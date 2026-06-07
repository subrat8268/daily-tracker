-- ============================================================
-- Machine Coding Builds — Code Vault
-- Run this in Supabase SQL Editor (already applied via MCP)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.machine_builds (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  difficulty   text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags         text[] NOT NULL DEFAULT '{}',
  status       text NOT NULL DEFAULT 'not_started'
               CHECK (status IN ('not_started', 'in_progress', 'done', 'revision')),
  attempt_no   int NOT NULL DEFAULT 1,
  code         text NOT NULL DEFAULT '',
  notes        text NOT NULL DEFAULT '',
  is_revision  boolean NOT NULL DEFAULT false,
  is_preset    boolean NOT NULL DEFAULT false,
  preset_id    text,   -- e.g. 'mc-easy-0' — links to MACHINE data
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION public.set_machine_builds_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS machine_builds_updated_at ON public.machine_builds;
CREATE TRIGGER machine_builds_updated_at
  BEFORE UPDATE ON public.machine_builds
  FOR EACH ROW EXECUTE FUNCTION public.set_machine_builds_updated_at();

-- One DB row per preset item (no duplicates)
CREATE UNIQUE INDEX IF NOT EXISTS machine_builds_preset_id_key
  ON public.machine_builds (preset_id)
  WHERE preset_id IS NOT NULL;

-- RLS — anon full access (personal tool)
ALTER TABLE public.machine_builds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon full access" ON public.machine_builds;
CREATE POLICY "anon full access" ON public.machine_builds
  FOR ALL TO anon USING (true) WITH CHECK (true);

GRANT ALL ON public.machine_builds TO anon;
