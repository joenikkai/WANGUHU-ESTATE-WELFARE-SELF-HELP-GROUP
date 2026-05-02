import { Request, Response } from 'express';
import pool from '../config/db';

export const consignProduct = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const { name, category, description, price, quantity, unit } = req.body;
    const seller_id = req.user.id;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const images = files['images'] ? files['images'].map(f => `http://localhost:5555/uploads/${f.filename}`) : [];
    const inspection_certificate = files['inspection_certificate'] ? `http://localhost:5555/uploads/${files['inspection_certificate'][0].filename}` : null;
    const license_permit = files['license_permit'] ? `http://localhost:5555/uploads/${files['license_permit'][0].filename}` : null;

    try {
        await pool.query(
            `INSERT INTO market_listings (seller_id, name, category, description, price, quantity, unit, images, inspection_certificate, license_permit)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [seller_id, name, category, description, price, quantity, unit, JSON.stringify(images), inspection_certificate, license_permit]
        );
        res.status(201).json({ message: 'Product consigned successfully. Pending verification.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during consignment' });
    }
};

export const getPublicListings = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT m.*, u.username, u.profile_picture_url, p.full_name 
             FROM market_listings m
             JOIN users u ON m.seller_id = u.id
             JOIN persons p ON u.person_id = p.id
             WHERE m.status = 'verified'`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching listings' });
    }
};

export const getMemberListings = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const result = await pool.query(
            'SELECT * FROM market_listings WHERE seller_id = $1',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching your listings' });
    }
};
