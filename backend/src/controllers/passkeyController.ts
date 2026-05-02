import { Request, Response } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import pool from '../config/db';

import jwt from 'jsonwebtoken';

const RP_NAME = 'WEWSHG Management System';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || `http://${RP_ID}:5173`;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';

export const getRegistrationOptions = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const userId = req.user.id;
  const userResult = await pool.query(
    'SELECT u.username, p.email FROM users u JOIN persons p ON u.person_id = p.id WHERE u.id = $1',
    [userId]
  );
  
  if (userResult.rows.length === 0) return res.status(404).json({ message: 'User not found' });
  const user = userResult.rows[0];

  const passkeysResult = await pool.query('SELECT credential_id FROM passkeys WHERE user_id = $1', [userId]);
  const excludeCredentials = passkeysResult.rows.map((pk: any) => ({
    id: pk.credential_id,
    type: 'public-key' as const,
  }));

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: new TextEncoder().encode(userId),
    userName: user.username,
    userDisplayName: user.username,
    attestationType: 'none',
    excludeCredentials,
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  // Store challenge in session
  (req as any).session.currentChallenge = options.challenge;

  res.json(options);
};

export const verifyRegistration = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const userId = req.user.id;
  const body = req.body;

  const expectedChallenge = (req as any).session.currentChallenge;

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo;
      const { publicKey, id: credentialID, counter } = credential;

      await pool.query(
        'INSERT INTO passkeys (user_id, credential_id, public_key, counter) VALUES ($1, $2, $3, $4)',
        [userId, credentialID, Buffer.from(publicKey), counter]
      );

      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false, message: 'Verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: (error as Error).message });
  } finally {
    (req as any).session.currentChallenge = undefined;
  }
};

export const getAuthenticationOptions = async (req: Request, res: Response) => {
  const { identifier } = req.query; // Username or email

  let allowCredentials: any[] = [];

  if (identifier) {
    const userResult = await pool.query(
      'SELECT u.id FROM users u JOIN persons p ON u.person_id = p.id WHERE u.username = $1 OR p.email = $1',
      [identifier as string]
    );
    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].id;
      const passkeysResult = await pool.query('SELECT credential_id FROM passkeys WHERE user_id = $1', [userId]);
      allowCredentials = passkeysResult.rows.map((pk: any) => ({
        id: pk.credential_id,
        type: 'public-key' as const,
      }));
    }
  }

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials,
    userVerification: 'preferred',
  });

  (req as any).session.currentChallenge = options.challenge;

  res.json(options);
};

export const verifyAuthentication = async (req: Request, res: Response) => {
  const body = req.body;
  const expectedChallenge = (req as any).session.currentChallenge;

  try {
    const passkeyResult = await pool.query(
      'SELECT * FROM passkeys WHERE credential_id = $1',
      [body.id]
    );

    if (passkeyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Passkey not found' });
    }

    const passkey = passkeyResult.rows[0];
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [passkey.user_id]);
    const user = userResult.rows[0];

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: passkey.credential_id,
        publicKey: passkey.public_key,
        counter: passkey.counter,
      },
    });

    if (verification.verified) {
      // Update counter
      await pool.query(
        'UPDATE passkeys SET counter = $1, last_used_at = CURRENT_TIMESTAMP WHERE id = $2',
        [verification.authenticationInfo.newCounter, passkey.id]
      );

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ verified: true, token, user });
    } else {
      res.status(400).json({ verified: false, message: 'Verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: (error as Error).message });
  } finally {
    (req as any).session.currentChallenge = undefined;
  }
};
