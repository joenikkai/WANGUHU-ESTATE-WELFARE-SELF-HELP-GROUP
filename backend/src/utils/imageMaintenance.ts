import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pool from '../config/db';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

/**
 * Calculates the SHA-256 hash of a file.
 */
const getFileHash = (filePath: string): string => {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
};

/**
 * Checks for duplicate images in the uploads folder.
 * If duplicates are found, users pointing to duplicate files are updated
 * to point to a single original file, and the redundant files are deleted.
 */
export const mergeDuplicateImages = async () => {
    console.log('--- Starting Duplicate Image Merge ---');
    const files = fs.readdirSync(UPLOADS_DIR);
    const hashMap: { [hash: string]: string } = {}; // hash -> first_found_filepath

    for (const file of files) {
        const filePath = path.join(UPLOADS_DIR, file);
        if (fs.lstatSync(filePath).isDirectory()) continue;

        const hash = getFileHash(filePath);
        if (hashMap[hash]) {
            const originalFile = hashMap[hash];
            const duplicateFile = file;
            
            console.log(`Duplicate found: ${duplicateFile} is a duplicate of ${originalFile}`);

            // Update database to point to the original file
            const originalUrl = `http://localhost:5555/uploads/${originalFile}`;
            const duplicateUrl = `http://localhost:5555/uploads/${duplicateFile}`;

            await pool.query('UPDATE users SET profile_picture_url = $1 WHERE profile_picture_url = $2', [originalUrl, duplicateUrl]);

            // Delete the duplicate file
            fs.unlinkSync(filePath);
            console.log(`Deleted duplicate file: ${duplicateFile}`);
        } else {
            hashMap[hash] = file;
        }
    }
    console.log('--- Finished Duplicate Image Merge ---');
};

/**
 * Removes images in the uploads folder that are not linked to any user.
 */
export const cleanupOrphanedImages = async () => {
    console.log('--- Starting Orphaned Image Cleanup ---');
    const files = fs.readdirSync(UPLOADS_DIR);
    
    // Get all profile picture URLs from the database
    const result = await pool.query('SELECT profile_picture_url FROM users WHERE profile_picture_url IS NOT NULL');
    const activeFiles = new Set(result.rows.map(row => path.basename(row.profile_picture_url)));

    for (const file of files) {
        const filePath = path.join(UPLOADS_DIR, file);
        if (fs.lstatSync(filePath).isDirectory()) continue;

        // Skip files that are default placeholders (dicebear links aren't local files, but just in case)
        if (!activeFiles.has(file)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted orphaned image: ${file}`);
        }
    }
    console.log('--- Finished Orphaned Image Cleanup ---');
};
