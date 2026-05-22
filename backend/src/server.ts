/// <reference path="./types/express/index.d.ts" />
import express from 'express';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron';
import session from 'express-session';
import passport from './config/passport';
import pool from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import passkeyRoutes from './routes/passkeyRoutes';
import financeRoutes from './routes/financeRoutes';
import { mergeDuplicateImages, cleanupOrphanedImages } from './utils/imageMaintenance';

const app = express();
const PORT = process.env.PORT || 5555;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'wewshg_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000 // 1 hour
  }
}));

app.use(passport.initialize());

// Periodic Maintenance: Every day at midnight
// Note: On Vercel, use Vercel Cron Jobs instead of node-cron
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily image maintenance...');
    await mergeDuplicateImages();
    await cleanupOrphanedImages();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/passkeys', passkeyRoutes);
app.use('/api/finance', financeRoutes);

app.get('/api/greeting', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users LIMIT 1");
    res.json({ text: "Database connection verified. Users table accessible.", count: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "Error connecting to the database." });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });
}

export default app;
