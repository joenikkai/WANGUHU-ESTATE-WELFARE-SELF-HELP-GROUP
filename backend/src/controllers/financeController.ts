import { Request, Response } from 'express';
import pool from '../config/db';

export const getUserDashboardData = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;

    try {
        const client = await pool.connect();
        try {
            // 1. Fetch recent transactions
            const transactionsRes = await client.query(
                `SELECT id, amount, category as type, execution_date as date, status, description 
                 FROM transactions 
                 WHERE user_id = $1 
                 ORDER BY execution_date DESC LIMIT 10`,
                [userId]
            );

            // 2. Fetch user's assets
            const assetsRes = await client.query(
                `SELECT id, name, type, value, is_communal 
                 FROM assets 
                 WHERE owner_id = $1 OR is_communal = true`,
                [userId]
            );

            // 3. Fetch pool totals (if treasurer)
            let pools = null;
            const userRoleRes = await client.query('SELECT role FROM users WHERE id = $1', [userId]);
            const role = userRoleRes.rows[0].role;
            
            if (role === 'board_member' || role === 'admin') {
                const poolsRes = await client.query('SELECT name, balance FROM communal_pools');
                pools = poolsRes.rows;
            }

            // 4. Fetch specific fund balances for the user
            // Note: In our current schema, we have 'personal_balance' in users table.
            // Other funds (Mandatory, Benevolence) might be tracked via transaction sums or specific tables.
            // For now, let's sum them from transactions to get "live" data.
            const mandatorySum = await client.query(
                "SELECT SUM(amount) as total FROM transactions WHERE user_id = $1 AND category = 'mandatory_contribution'",
                [userId]
            );
            const benevolenceSum = await client.query(
                "SELECT SUM(amount) as total FROM transactions WHERE user_id = $1 AND category = 'benevolence'",
                [userId]
            );

            res.json({
                transactions: transactionsRes.rows,
                assets: assetsRes.rows,
                pools,
                stats: {
                    mandatory_total: mandatorySum.rows[0].total || 0,
                    benevolence_total: benevolenceSum.rows[0].total || 0
                }
            });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
};

export const getTransactionHistory = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const { category } = req.query;
    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    let params: any[] = [req.user.id];

    if (category) {
        query += ' AND category = $2';
        params.push(category);
    }

    query += ' ORDER BY execution_date DESC';

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching transaction history' });
    }
};
