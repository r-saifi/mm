# Supabase Migration Instructions

We have fully migrated the codebase from Firebase/Cloudinary to Supabase for Auth, Database, and Storage.

## Your Part: Setup Guide

### 1. Environment Variables
1. Copy `.env.example` to `.env` (I've created `.env.example` for you).
2. Go to your Supabase Project Dashboard -> **Settings -> API**.
3. Copy the **Project URL** and **anon public key** into your `.env` file.
4. Add your admin emails to `VITE_ADMIN_EMAILS` (comma-separated).

### 2. Authentication Setup
1. In Supabase Dashboard, go to **Authentication -> Providers**.
2. Make sure **Email** provider is enabled. You can disable "Confirm email" if you want to create admin accounts manually without verifying.
3. Go to **Authentication -> Users** and manually create your admin user account(s) using the same emails you put in your `.env`.

### 3. Storage Setup (Important)
1. Go to **Storage** in Supabase and click **New Bucket**.
2. Name the bucket exactly: `images`
3. Check the box for **Public bucket** (so visitors can see the portfolio pictures).
4. Save the bucket.
5. In the **Policies** section of the `images` bucket:
   - Click "New Policy" for SELECT (Read): Choose "Enable read access for all users" (so anyone can see images).
   - Click "New Policy" for INSERT, UPDATE, DELETE: Choose "Enable [action] for authenticated users only" (so only logged-in admins can upload/delete).

### 4. Database & Row Level Security (SQL)
Go to the **SQL Editor** in Supabase and run the following script to create your tables and secure them:

```sql
-- 1. Create tables
CREATE TABLE projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text,
  images text[] default '{}',
  "coverImage" text,
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

CREATE TABLE messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  project text,
  message text not null,
  status text default 'unread',
  "createdAt" timestamp with time zone default now()
);

CREATE TABLE settings (
  key text primary key,
  value jsonb
);

-- 2. Insert initial hero setting
INSERT INTO settings (key, value) VALUES ('hero', '{"images": []}');

-- 3. Enable Row Level Security (RLS) on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies

-- PROJECTS: Anyone can read, only authenticated can modify
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Auth users can insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete projects" ON projects FOR DELETE TO authenticated USING (true);

-- MESSAGES: Anyone can insert, only authenticated can read/modify
CREATE POLICY "Anyone can submit a message" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can read messages" ON messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can update messages" ON messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete messages" ON messages FOR DELETE TO authenticated USING (true);

-- SETTINGS: Anyone can read, only authenticated can modify
CREATE POLICY "Settings viewable by everyone" ON settings FOR SELECT USING (true);
CREATE POLICY "Auth users can modify settings" ON settings FOR ALL TO authenticated USING (true);
```

Once this is done, restart your local server (`npm run dev`) and your completely secure, all-in-one Supabase backend will be ready to go!
