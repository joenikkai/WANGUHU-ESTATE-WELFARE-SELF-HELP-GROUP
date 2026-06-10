import { Request, Response } from 'express';
import pool from '../config/db';

export const getAssets = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;
    const isTreasurer = req.user.role === 'board_member' || req.user.role === 'admin';

    try {
        const query = `
            SELECT a.*, 
                   COALESCE((SELECT SUM(amount) FROM transactions WHERE asset_id = a.id), 0) as total_contributed,
                   COALESCE((SELECT SUM(amount) FROM transactions WHERE asset_id = a.id AND user_id = $1), 0) as user_contribution
            FROM assets a
            WHERE a.owner_id = $1 
               OR (a.is_communal = true AND (
                   $2 = true OR EXISTS (
                       SELECT 1 FROM transactions t 
                       WHERE t.user_id = $1 AND t.asset_id = a.id
                   )
               ))
            ORDER BY a.is_communal DESC, a.name ASC
        `;
        
        const result = await pool.query(query, [userId, isTreasurer]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching assets' });
    }
};

export const createAsset = async (req: Request, res: Response): Promise<void> => {
    const { name, type, value, description, is_communal, target_amount } = req.body;
    const owner_id = is_communal ? null : req.user?.id;

    try {
        const result = await pool.query(
            `INSERT INTO assets (name, type, value, description, is_communal, owner_id, target_amount)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, type, value, description, is_communal, owner_id, target_amount]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating asset' });
    }
};

export const getAssetContributions = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;
    const isTreasurer = req.user?.role === 'board_member' || req.user?.role === 'admin';

    try {
        // Verify access: either owner, treasurer, or contributor
        const accessCheck = await pool.query(
            `SELECT 1 FROM assets a 
             WHERE a.id = $1 AND (
                 a.owner_id = $2 OR a.is_communal = true
             )`,
            [id, userId]
        );

        if (accessCheck.rowCount === 0) {
            res.status(403).json({ message: 'Access denied to this asset' });
            return;
        }

        const contributions = await pool.query(
            `SELECT t.*, p.full_name, u.username 
             FROM transactions t
             JOIN users u ON t.user_id = u.id
             JOIN persons p ON u.person_id = p.id
             WHERE t.asset_id = $1
             ORDER BY t.execution_date DESC`,
            [id]
        );

        res.json(contributions.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching asset contributions' });
    }
};
