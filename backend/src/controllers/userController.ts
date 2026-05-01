import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/db';
import fs from 'fs';
import path from 'path';

import { mergeDuplicateImages, cleanupOrphanedImages } from '../utils/imageMaintenance';

export const updateProfilePicture = async (req: AuthRequest, res: Response): Promise<void> => {
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

export const updateProfilePictureFromUpload = async (req: AuthRequest, res: Response): Promise<void> => {
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
