import { Router } from 'express';
import { getUserDashboardData, getTransactionHistory, recordContribution, getCommunityFundsSummary, verifyTransaction } from '../controllers/financeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', authenticateToken, getUserDashboardData);
router.get('/community-funds', authenticateToken, getCommunityFundsSummary);
router.get('/transactions', authenticateToken, getTransactionHistory);
router.post('/contribute', authenticateToken, recordContribution);
router.post('/verify/:transactionId', authenticateToken, verifyTransaction);

export default router;
