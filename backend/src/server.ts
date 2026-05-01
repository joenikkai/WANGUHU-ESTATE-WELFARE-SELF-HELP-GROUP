import express from 'express';
import cors from 'cors';
import pool from './config/db';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = 5555;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

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
