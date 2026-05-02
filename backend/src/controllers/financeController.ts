import { Request, Response } from 'express';
import pool from '../config/db';
import { logAudit } from '../utils/auditLogger';

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
            const mandatorySum = await client.query(
                "SELECT SUM(amount) as total FROM transactions WHERE user_id = $1 AND category = 'mandatory_contribution'",
                [userId]
            );
            const benevolenceSum = await client.query(
                "SELECT SUM(amount) as total FROM transactions WHERE user_id = $1 AND category = 'benevolence'",
                [userId]
            );

            // 5. Fetch historical data for graph (last 30 days)
            const historicalRes = await client.query(
                `SELECT 
                    date_trunc('day', execution_date) as date,
                    category,
                    SUM(amount) as daily_total
                 FROM transactions
                 WHERE user_id = $1 AND execution_date > CURRENT_DATE - INTERVAL '30 days'
                 GROUP BY 1, 2
                 ORDER BY 1 ASC`,
                [userId]
            );

            res.json({
                transactions: transactionsRes.rows,
                assets: assetsRes.rows,
                pools,
                stats: {
                    mandatory_total: mandatorySum.rows[0].total || 0,
                    benevolence_total: benevolenceSum.rows[0].total || 0
                },
                historical: historicalRes.rows
            });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
};

export const recordContribution = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const { amount, category, description, payment_method } = req.body;
    const userId = req.user.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Record the transaction
        const txRes = await client.query(
            `INSERT INTO transactions (user_id, amount, category, description, payment_method, status)
             VALUES ($1, $2, $3, $4, $5, 'completed') RETURNING id`,
            [userId, amount, category, description, payment_method]
        );

        // 2. Update communal pool if applicable
        let poolName = null;
        if (category === 'mandatory_contribution') poolName = 'Maintenance'; // Or whatever pool handles mandatory
        if (category === 'benevolence') poolName = 'Benevolence';

        if (poolName) {
            await client.query(
                'UPDATE communal_pools SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE name = $2',
                [amount, poolName]
            );
        }

        // 3. Update personal balance if it's a deposit
        if (category === 'personal_deposit') {
            await client.query(
                'UPDATE users SET personal_balance = personal_balance + $1 WHERE id = $2',
                [amount, userId]
            );
        }

        await client.query('COMMIT');
        
        await logAudit(userId, 'CONTRIBUTION_RECORDED', 'transaction', txRes.rows[0].id, { amount, category });

        res.status(201).json({ message: 'Contribution recorded successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error recording contribution' });
    } finally {
        client.release();
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
