-- ============================================================
-- 90-Day Roadmap Tracker — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Progress tracking table
CREATE TABLE IF NOT EXISTS public.progress (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id    text NOT NULL UNIQUE,
  category   text NOT NULL DEFAULT '',
  is_done    boolean NOT NULL DEFAULT false,
  value      text NOT NULL DEFAULT '',
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

-- Add missing columns to progress if upgrading from old schema
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '';
ALTER TABLE public.progress ADD COLUMN IF NOT EXISTS value    text NOT NULL DEFAULT '';

-- Daily logs table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date          date NOT NULL UNIQUE,
  mood          text,
  study_hours   numeric(4,1),
  kred_hours    numeric(4,1),
  dsa_done      text,
  js_rev        text,
  mc_done       text,
  tomorrow_task text,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Add missing mood column if upgrading from old schema
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS mood text;
-- Add UNIQUE constraint on date if missing (needed for upsert onConflict: 'date')
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.daily_logs'::regclass
    AND   contype  = 'u'
    AND   conname LIKE '%date%'
  ) THEN
    ALTER TABLE public.daily_logs ADD CONSTRAINT daily_logs_date_key UNIQUE (date);
  END IF;
END $$;

-- ============================================================
-- RLS — Enable + allow anon full access (personal tool, no auth)
-- This prevents bots/scanners from hitting tables directly
-- while keeping your app working with the anon key.
-- ============================================================
ALTER TABLE public.progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon full access" ON public.progress;
DROP POLICY IF EXISTS "anon full access" ON public.daily_logs;

CREATE POLICY "anon full access" ON public.progress
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon full access" ON public.daily_logs
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Grant anon role access to tables
GRANT ALL ON public.progress   TO anon;
GRANT ALL ON public.daily_logs TO anon;
