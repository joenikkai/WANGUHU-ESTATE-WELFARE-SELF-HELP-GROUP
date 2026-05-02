import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import pool from './db';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'placeholder';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'placeholder';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true
  },
  async (req: Request, accessToken: string, refreshToken: string, profile: GoogleProfile, done: (err: any, user?: any) => void) => {
    try {
      const email = profile.emails?.[0].value;
      if (!email) return done(new Error("No email found in Google profile"));

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        // Check if social account already exists
        let result = await client.query(
          'SELECT user_id FROM social_accounts WHERE provider = $1 AND provider_user_id = $2',
          ['google', profile.id]
        );

        if (result.rows.length > 0) {
          const userResult = await client.query('SELECT * FROM users WHERE id = $1', [result.rows[0].user_id]);
          await client.query('COMMIT');
          return done(null, userResult.rows[0]);
        }

        // Check if user with this email already exists
        result = await client.query('SELECT id FROM persons WHERE email = $1', [email]);
        let userId;

        if (result.rows.length > 0) {
          const personId = result.rows[0].id;
          const userResult = await client.query('SELECT id FROM users WHERE person_id = $1', [personId]);
          userId = userResult.rows[0].id;
        } else {
          // Create new person and user
          const personResult = await client.query(
            'INSERT INTO persons (full_name, email) VALUES ($1, $2) RETURNING id',
            [profile.displayName, email]
          );
          const personId = personResult.rows[0].id;
          
          const username = email.split('@')[0] + '_' + Math.floor(Math.random() * 1000);
          const profilePictureUrl = profile.photos?.[0].value || `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
          
          const userResult = await client.query(
            'INSERT INTO users (person_id, username, password_hash, profile_picture_url) VALUES ($1, $2, $3, $4) RETURNING id',
            [personId, username, uuidv4(), profilePictureUrl]
          );
          userId = userResult.rows[0].id;
        }

        // Link social account
        await client.query(
          'INSERT INTO social_accounts (user_id, provider, provider_user_id) VALUES ($1, $2, $3)',
          [userId, 'google', profile.id]
        );

        await client.query('COMMIT');
        const finalUser = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        return done(null, finalUser.rows[0]);
      } catch (err) {
        await client.query('ROLLBACK');
        return done(err);
      } finally {
        client.release();
      }
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

export default passport;
