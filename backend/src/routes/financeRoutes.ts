import { Router } from 'express';
import { getUserDashboardData, getTransactionHistory, recordContribution } from '../controllers/financeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', authenticateToken, getUserDashboardData);
router.get('/transactions', authenticateToken, getTransactionHistory);
router.post('/contribute', authenticateToken, recordContribution);

export default router;
