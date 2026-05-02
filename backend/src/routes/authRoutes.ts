import { Router } from 'express';
import { register, login } from '../controllers/authController';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { logAudit } from '../utils/auditLogger';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';

router.post('/register', register);
router.post('/login', login);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req: any, res) => {
    // Log social login
    await logAudit(req.user.id, 'SOCIAL_LOGIN', 'user', req.user.id, { provider: 'google' });

    // Generate JWT for the user
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}`);
  }
);

export default router;
