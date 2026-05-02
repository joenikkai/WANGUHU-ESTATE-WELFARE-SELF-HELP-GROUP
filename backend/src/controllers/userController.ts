import { Request, Response } from 'express';

import pool from '../config/db';
import fs from 'fs';
import path from 'path';

import { mergeDuplicateImages, cleanupOrphanedImages } from '../utils/imageMaintenance';

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT u.id, u.username, u.role, u.title, u.profile_picture_url, u.personal_balance,
             p.full_name, p.email, p.phone_number, p.physical_address, p.national_id, p.kra_pin
             FROM users u
             JOIN persons p ON u.person_id = p.id
             WHERE u.id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching user' });
    }
};

export const updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;
    const { profile_picture_data } = req.body; // Expecting base64 data from camera capture

    try {
        if (profile_picture_data) {
            // Handle base64 camera capture
            const base64Data = profile_picture_data.replace(/^data:image\/\w+;base64,/, "");
            const fileName = `profile_${userId}_${Date.now()}.png`;
            const filePath = path.join(__dirname, '../../uploads', fileName);
            
            fs.writeFileSync(filePath, base64Data, 'base64');
            const profile_picture_url = `http://localhost:5555/uploads/${fileName}`;

            await pool.query('UPDATE users SET profile_picture_url = $1 WHERE id = $2', [profile_picture_url, userId]);
            
            // Immediate cleanup
            await mergeDuplicateImages();
            await cleanupOrphanedImages();

            res.json({ profile_picture_url, message: 'Profile picture updated successfully' });
        } else {
            res.status(400).json({ message: 'No image data provided' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while updating profile picture' });
    }
};

export const updateProfilePictureFromUpload = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    const userId = req.user.id;
    const profile_picture_url = `http://localhost:5555/uploads/${req.file.filename}`;

    try {
        await pool.query('UPDATE users SET profile_picture_url = $1 WHERE id = $2', [profile_picture_url, userId]);
        
        // Immediate cleanup
        await mergeDuplicateImages();
        await cleanupOrphanedImages();

        res.json({ profile_picture_url, message: 'Profile picture updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while updating profile picture' });
    }
};

export const removeProfilePicture = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;

    try {
        const userResult = await pool.query('SELECT profile_picture_url FROM users WHERE id = $1', [userId]);
        const oldUrl = userResult.rows[0]?.profile_picture_url;

        if (oldUrl) {
            const fileName = oldUrl.split('/').pop();
            const filePath = path.join(__dirname, '../../uploads', fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await pool.query('UPDATE users SET profile_picture_url = NULL WHERE id = $2', [null, userId]);
        res.json({ message: 'Profile picture removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while removing profile picture' });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;
    const { username, full_name, email, phone_number, physical_address, national_id, kra_pin } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Update username in users table
        await client.query(
            'UPDATE users SET username = $1 WHERE id = $2',
            [username, userId]
        );

        // Get person_id
        const userRes = await client.query('SELECT person_id FROM users WHERE id = $1', [userId]);
        const personId = userRes.rows[0].person_id;

        // Update persons table
        await client.query(
            `UPDATE persons 
             SET full_name = $1, email = $2, phone_number = $3, physical_address = $4, national_id = $5, kra_pin = $6 
             WHERE id = $7`,
            [full_name, email, phone_number, physical_address, national_id, kra_pin, personId]
        );

        await client.query('COMMIT');

        // Fetch updated user data
        const updatedUser = await client.query(
            `SELECT u.id, u.username, u.role, u.title, u.profile_picture_url,
             p.full_name, p.email, p.phone_number, p.physical_address, p.national_id, p.kra_pin
             FROM users u
             JOIN persons p ON u.person_id = p.id
             WHERE u.id = $1`,
            [userId]
        );

        res.json({ user: updatedUser.rows[0], message: 'Profile updated successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error while updating profile' });
    } finally {
        client.release();
    }
};
