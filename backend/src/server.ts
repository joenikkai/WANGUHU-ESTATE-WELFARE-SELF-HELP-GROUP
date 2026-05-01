import express from 'express';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron';
import pool from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import { mergeDuplicateImages, cleanupOrphanedImages } from './utils/imageMaintenance';

const app = express();
const PORT = 5555;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Periodic Maintenance: Every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily image maintenance...');
  await mergeDuplicateImages();
  await cleanupOrphanedImages();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.get('/api/greeting', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users LIMIT 1");
    res.json({ text: "Database connection verified. Users table accessible.", count: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "Error connecting to the database." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
