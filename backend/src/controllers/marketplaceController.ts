import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/db';

export const consignProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const seller_id = req.user.id;
    const { 
        product_name, 
        category, 
        quantity, 
        unit, 
        price_per_unit, 
        description 
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create the listing
        const listingResult = await client.query(
            `INSERT INTO market_listings (seller_id, product_name, category, quantity, unit, price_per_unit, description) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [seller_id, product_name, category, quantity, unit, price_per_unit, description]
        );
        const listing_id = listingResult.rows[0].id;

        // 2. Save documents if they exist
        if (files) {
            for (const fieldname in files) {
                for (const file of files[fieldname]) {
                    const document_url = `http://localhost:5555/uploads/${file.filename}`;
                    await client.query(
                        `INSERT INTO verification_documents (listing_id, document_type, document_url) 
                         VALUES ($1, $2, $3)`,
                        [listing_id, fieldname, document_url]
                    );
                }
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ listing_id, message: 'Product consigned successfully. Pending verification.' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error during consignment' });
    } finally {
        client.release();
    }
};

export const getPublicListings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT ml.*, u.username as seller_username,
             (SELECT json_agg(vd) FROM verification_documents vd WHERE vd.listing_id = ml.id) as documents
             FROM market_listings ml
             JOIN users u ON ml.seller_id = u.id
             WHERE ml.status = 'available'`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching listings' });
    }
};

export const getMemberListings = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT ml.*, 
             (SELECT json_agg(vd) FROM verification_documents vd WHERE vd.listing_id = ml.id) as documents
             FROM market_listings ml
             WHERE ml.seller_id = $1`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching member listings' });
    }
};
