import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20 &&
    !supabaseUrl.includes('your-supabase-project')
  );
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createClient(supabaseUrl!, supabaseAnonKey!);
};

/**
 * SQL Schema script for user to copy-paste into Supabase SQL Editor.
 */
export const SUPABASE_SCHEMA_SQL = `-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

CREATE TABLE IF NOT EXISTS adventures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  synopsis TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  scenes JSONB DEFAULT '[]'::jsonb,
  characters JSONB DEFAULT '[]'::jsonb,
  quests JSONB DEFAULT '[]'::jsonb,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read and write for rapid RPG prototyping
CREATE POLICY "Allow public read access" ON adventures
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON adventures
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON adventures
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON adventures
  FOR DELETE USING (true);
`;
