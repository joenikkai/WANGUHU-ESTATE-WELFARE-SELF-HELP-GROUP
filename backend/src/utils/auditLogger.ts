import pool from '../config/db';

/**
 * Logs a critical action to the audit_logs table for transparency and accountability.
 * @param user_id The ID of the user performing the action.
 * @param action The type of action performed (e.g., 'UPDATE_PROFILE', 'CONSIGN_PRODUCT').
 * @param entity_type The type of entity affected (e.g., 'user', 'market_listing').
 * @param entity_id The ID of the entity affected.
 * @param details JSON object containing additional details about the change.
 */
export const logAudit = async (
    user_id: string | null,
    action: string,
    entity_type: string,
    entity_id: string | null,
    details: any = {}
) => {
    try {
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) 
             VALUES ($1, $2, $3, $4, $5)`,
            [user_id, action, entity_type, entity_id, JSON.stringify(details)]
        );
    } catch (err) {
        // We don't want to crash the main process if auditing fails, 
        // but we should log the failure.
        console.error('Failed to log audit:', err);
    }
};
