import { Router } from 'express';
import { getAssets, createAsset, getAssetContributions } from '../controllers/assetController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getAssets);
router.post('/', authenticateToken, authorizeRoles('board_member', 'admin'), createAsset);
router.get('/:id/contributions', authenticateToken, getAssetContributions);

export default router;
