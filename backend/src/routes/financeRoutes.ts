import { Router } from 'express';
import { getUserDashboardData, getTransactionHistory } from '../controllers/financeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', authenticateToken, getUserDashboardData);
router.get('/transactions', authenticateToken, getTransactionHistory);

export default router;
