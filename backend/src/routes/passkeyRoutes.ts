import { Router } from 'express';
import { 
  getRegistrationOptions, 
  verifyRegistration, 
  getAuthenticationOptions, 
  verifyAuthentication 
} from '../controllers/passkeyController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/register-options', authenticateToken, getRegistrationOptions);
router.post('/register-verify', authenticateToken, verifyRegistration);
router.get('/login-options', getAuthenticationOptions);
router.post('/login-verify', verifyAuthentication);

export default router;
