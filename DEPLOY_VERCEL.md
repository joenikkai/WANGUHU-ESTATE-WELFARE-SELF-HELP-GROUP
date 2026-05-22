# Deploying WEWSHG to Vercel

This project is primed for a "Wholesome" deployment on Vercel. Because it uses a monorepo structure (Frontend + Backend), you have two main options.

## Option 1: Unified Deployment (Single Project)
This is the easiest to set up. Vercel will build both the React frontend and the Express backend as a single unit.

1.  Connect your repository to Vercel.
2.  Vercel should automatically detect the `vercel.json` and `package.json` at the root.
3.  **Framework Preset**: Select "Other" or let it auto-detect.
4.  **Environment Variables**: Add the variables from `.env.example` to the Vercel Project Settings.
5.  **Build Command**: `npm run build` (detected from root `package.json`).
6.  **Output Directory**: (Leave default, `vercel.json` handles routing).

## Option 2: Separate Projects (Recommended for Scale)
Deploy the frontend and backend as two separate Vercel projects pointing to the same repository.

### Backend Project
1.  **Root Directory**: `backend`
2.  **Framework Preset**: Node.js
3.  **Environment Variables**: `DATABASE_URL`, `SESSION_SECRET`, `FRONTEND_URL`.

### Frontend Project
1.  **Root Directory**: `frontend`
2.  **Framework Preset**: Vite
3.  **Environment Variables**: `VITE_API_URL` (point this to your backend project URL).

---

## Critical Considerations

### 1. Database
Since this project uses PostgreSQL, you can use **Vercel Postgres** or an external provider like Supabase or Neon. Update your `DATABASE_URL` accordingly.

### 2. File Uploads (The `/uploads` folder)
Vercel's filesystem is **read-only and ephemeral**. Files uploaded to `/uploads` will disappear when the serverless function spins down or when you redeploy.
*   **Wholesome Recommendation**: Integrate **Vercel Blob** or AWS S3 for persistent image storage. 
*   Update `backend/src/utils/imageMaintenance.ts` and controllers to use a cloud storage SDK.

### 3. Cron Jobs
The `node-cron` task in `server.ts` will not run on Vercel because serverless functions don't stay alive.
*   **Fix**: Use **Vercel Cron Jobs**. Add a `cron` property to your `vercel.json`:
    ```json
    "crons": [
      {
        "path": "/api/maintenance",
        "schedule": "0 0 * * *"
      }
    ]
    ```
    And create an endpoint at `/api/maintenance` that triggers the image cleanup logic.

### 4. Authentication (Passkeys & OAuth)
Ensure your `FRONTEND_URL` and OAuth redirect URIs (Google, Facebook, etc.) are correctly updated in your provider consoles to match your Vercel deployment URL.
