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

            // 2. Fetch user's assets with contribution-based visibility
            const assetsRes = await client.query(
                `SELECT a.* 
                 FROM assets a
                 WHERE a.owner_id = $1 
                    OR (a.is_communal = true AND (
                        EXISTS (SELECT 1 FROM transactions WHERE user_id = $1 AND asset_id = a.id)
                        OR $2 = true
                    ))`,
                [userId, req.user.role === 'board_member' || req.user.role === 'admin']
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

    const { amount, category, description, payment_method, target_user_id, treasurer_notes, asset_id } = req.body;
    const actorId = req.user.id;
    const actorRole = req.user.role;

    // Determine who the contribution is for
    // If target_user_id is provided, check if actor has permission
    let finalTargetId = actorId;
    let isOnBehalf = false;

    if (target_user_id && target_user_id !== actorId) {
        if (actorRole !== 'board_member' && actorRole !== 'admin') {
            res.status(403).json({ message: 'Only treasurers or admins can record contributions for others.' });
            return;
        }
        finalTargetId = target_user_id;
        isOnBehalf = true;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Generate a unique receipt number for cash payments
        let receiptNumber = null;
        if (payment_method === 'Cash' && isOnBehalf) {
            receiptNumber = `RCPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        }

        // 1. Record the transaction
        const fullDescription = isOnBehalf 
            ? `${description} (Recorded by ${req.user.role} ${actorId})${receiptNumber ? ' [Receipt: ' + receiptNumber + ']' : ''}${treasurer_notes ? ' - Notes: ' + treasurer_notes : ''}`
            : description;

        const txRes = await client.query(
            `INSERT INTO transactions (user_id, amount, category, description, payment_method, status, asset_id)
             VALUES ($1, $2, $3, $4, $5, 'completed', $6) RETURNING id`,
            [finalTargetId, amount, category, fullDescription, payment_method, asset_id]
        );

        // 2. Update communal pool if applicable
        let poolName = null;
        if (category === 'mandatory_contribution') poolName = 'Maintenance'; 
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
                [amount, finalTargetId]
            );
        }

        await client.query('COMMIT');
        
        await logAudit(actorId, isOnBehalf ? 'CONTRIBUTION_ON_BEHALF' : 'CONTRIBUTION_RECORDED', 'transaction', txRes.rows[0].id, { 
            amount, 
            category, 
            target_user_id: finalTargetId,
            treasurer_notes 
        });

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

    const { category, user_id } = req.query;
    const actorId = req.user.id;
    const actorRole = req.user.role;
    const isTreasurer = actorRole === 'board_member' || actorRole === 'admin';

    let query = `
        SELECT t.*, p.full_name as user_full_name, u.username as user_username 
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        JOIN persons p ON u.person_id = p.id
    `;
    let params: any[] = [];
    let whereClauses: string[] = [];

    // Authorization logic for filtering by user_id
    if (isTreasurer) {
        if (user_id) {
            whereClauses.push(`t.user_id = $${params.length + 1}`);
            params.push(user_id);
        }
    } else {
        // Members can only see their own
        whereClauses.push(`t.user_id = $${params.length + 1}`);
        params.push(actorId);
    }

    if (category) {
        whereClauses.push(`t.category = $${params.length + 1}`);
        params.push(category);
    }

    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += ' ORDER BY t.execution_date DESC';

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching transaction history' });
    }
};
