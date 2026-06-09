import { Router } from 'express';
import { 
    getNseData, 
    getCbkExchangeRates, 
    getWorldBankData, 
    getMarketIndices 
} from '../controllers/externalApiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Publicly available data (though we require authentication for the app)
router.get('/nse', authenticateToken, getNseData);
router.get('/cbk', authenticateToken, getCbkExchangeRates);
router.get('/worldbank', authenticateToken, getWorldBankData);
router.get('/indices', authenticateToken, getMarketIndices);

export default router;
