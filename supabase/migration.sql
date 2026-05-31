-- ============================================================
-- 90-Day Roadmap Tracker — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Progress tracking table
CREATE TABLE IF NOT EXISTS public.progress (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id    text NOT NULL UNIQUE,
  is_done    boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS progress_updated_at ON public.progress;
CREATE TRIGGER progress_updated_at
  BEFORE UPDATE ON public.progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Daily logs table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date          date NOT NULL,
  study_hours   numeric(4,1),
  kred_hours    numeric(4,1),
  dsa_done      text,
  js_rev        text,
  mc_done       text,
  tomorrow_task text,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Disable RLS (personal tool — no auth needed)
ALTER TABLE public.progress   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs DISABLE ROW LEVEL SECURITY;

-- Grant anon access (needed for Supabase anon key)
GRANT ALL ON public.progress   TO anon;
GRANT ALL ON public.daily_logs TO anon;
