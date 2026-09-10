# Supabase Setup Guide for Cucina SA

This guide explains how to connect your Supabase project to Cucina SA so that menus, weekly specials, and announcements are stored directly in PostgreSQL instead of Vercel Blob.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create or open your project.
2. Under **Project Settings -> API** (or **API Keys**), copy:
   - **Project URL**
   - **Publishable Key** (starts with `sb_pub_...` or named `publishable` / `anon public`)
   - **Secret Key** (starts with `sb_sec_...` or named `secret` / `service_role secret`)

---

## 2. Run Database Migration & Seed

1. In Supabase, open the **SQL Editor** from the left navigation.
2. Click **New Query**.
3. Copy and paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. Click **Run**.

This will:
- Create the `site_content` table.
- Set up Row Level Security (RLS) allowing public read and authenticated/admin write.
- Pre-populate initial live content for:
  - `'home'` (including the latest *"full bar,"* copy)
  - `'menu'` (including the complete *Specialty Cocktails* menu)
  - `'specials'` (Weekly specials)

---

## 3. Set Environment Variables in Vercel

In your Vercel project settings (**Settings -> Environment Variables**), add:

| Key | Value | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Frontend Supabase URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `your-publishable-key` | Frontend read key |
| `SUPABASE_URL` | `https://your-project.supabase.co` | Serverless API routes URL |
| `SUPABASE_PUBLISHABLE_KEY` | `your-publishable-key` | Serverless API routes read key |
| `SUPABASE_SECRET_KEY` | `your-secret-key` | Serverless Owner Portal updates (bypasses RLS) |

*(Note: Legacy key names `VITE_SUPABASE_ANON_KEY`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are also supported).*

---

## 4. How the Keep-Alive / "Paging" System Works

To ensure your free-tier Supabase project never pauses after 7 days of inactivity:

1. **Vercel Cron (`vercel.json`)**: Automatically triggers `GET /api/ping` every day at 12:00 UTC.
2. **GitHub Actions (`.github/workflows/supabase-keepalive.yml`)**: An automated background workflow that runs every 3 days to page the database.
3. **Dedicated API Endpoint (`/api/ping`)**: Executes a lightweight query against `site_content` and returns an active heartbeat status. You can also point any free external uptime monitor (such as [UptimeRobot](https://uptimerobot.com) or [cron-job.org](https://cron-job.org)) at `https://cucina-sa.com/api/ping`.

---

## 5. Deployment Verification
Once deployed on Vercel:
- Visit `/api/ping` on your live domain (e.g. `https://your-domain.com/api/ping`) to verify the database responds with `{"status": "active"}`.
- Visit `/portal` to edit any menu or popup announcement; updates will save directly to Supabase.
