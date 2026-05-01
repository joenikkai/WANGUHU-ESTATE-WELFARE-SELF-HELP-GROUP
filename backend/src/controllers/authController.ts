import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { 
    username, 
    email, 
    password, 
    full_name, 
    national_id, 
    kra_pin, 
    phone_number,
    physical_address 
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Check if person or user already exists
    const existingCheck = await client.query(
      'SELECT email FROM persons WHERE email = $1 OR national_id = $2 OR kra_pin = $3 OR phone_number = $4',
      [email, national_id, kra_pin, phone_number]
    );

    if (existingCheck.rows.length > 0) {
      res.status(400).json({ message: 'A person with these details already exists' });
      return;
    }

    const usernameCheck = await client.query('SELECT username FROM users WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
      res.status(400).json({ message: 'Username is already taken' });
      return;
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Create Person
    const personResult = await client.query(
      `INSERT INTO persons (full_name, national_id, kra_pin, phone_number, email, physical_address) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [full_name, national_id, kra_pin, phone_number, email, physical_address]
    );
    const person_id = personResult.rows[0].id;

    // 4. Create User linked to Person
    const userResult = await client.query(
      `INSERT INTO users (person_id, username, password_hash, title) 
       VALUES ($1, $2, $3, $4) RETURNING id, username, role, title`,
      [person_id, username, password_hash, 'Community Member']
    );

    await client.query('COMMIT');

    res.status(201).json({ 
      user: { ...userResult.rows[0], email, full_name }, 
      message: 'User registered successfully' 
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  } finally {
    client.release();
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user by joining with persons table
    const result = await pool.query(
      `SELECT u.*, p.email, p.full_name, p.national_id, p.phone_number 
       FROM users u 
       JOIN persons p ON u.person_id = p.id 
       WHERE p.email = $1 OR u.username = $1`, 
      [email]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        national_id: user.national_id,
        kra_pin: user.kra_pin,
        phone_number: user.phone_number,
        role: user.role,
        title: user.title,
        personal_balance: user.personal_balance
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
