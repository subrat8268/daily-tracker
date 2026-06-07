/**
 * syncBuilds.js
 * All Supabase CRUD for the machine_builds table.
 * Separate from syncProgress to keep concerns clean.
 */
import { supabase, isSupabaseEnabled } from './supabase';

// ── Load all builds from Supabase ────────────────────────────────────────────
export async function loadAllBuilds() {
  if (!isSupabaseEnabled) return null;

  const { data, error } = await supabase
    .from('machine_builds')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[Supabase] loadAllBuilds error:', error.message);
    return null;
  }

  return data; // array of build rows
}

// ── Upsert a build (insert or update by id) ──────────────────────────────────
export async function upsertBuild(build) {
  if (!isSupabaseEnabled) return null;

  const payload = {
    title:       build.title,
    difficulty:  build.difficulty,
    tags:        build.tags ?? [],
    status:      build.status ?? 'not_started',
    attempt_no:  build.attempt_no ?? 1,
    code:        build.code ?? '',
    notes:       build.notes ?? '',
    is_revision: build.is_revision ?? false,
    is_preset:   build.is_preset ?? false,
    preset_id:   build.preset_id ?? null,
    updated_at:  new Date().toISOString(),
  };

  // If we already have a DB id, update that row; otherwise insert fresh
  if (build.id) payload.id = build.id;

  const { data, error } = await supabase
    .from('machine_builds')
    .upsert(payload, {
      onConflict: build.preset_id ? 'preset_id' : 'id',
    })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] upsertBuild error:', error.message);
    return null;
  }

  return data; // returns the saved row with final id
}

// ── Delete a build by id ─────────────────────────────────────────────────────
export async function deleteBuild(id) {
  if (!isSupabaseEnabled) return;

  const { error } = await supabase
    .from('machine_builds')
    .delete()
    .eq('id', id);

  if (error) console.error('[Supabase] deleteBuild error:', error.message);
}

// ── Toggle is_revision flag only (lightweight patch) ────────────────────────
export async function patchRevision(id, is_revision) {
  if (!isSupabaseEnabled) return;

  const { error } = await supabase
    .from('machine_builds')
    .update({ is_revision, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) console.error('[Supabase] patchRevision error:', error.message);
}

// ── Patch status only ────────────────────────────────────────────────────────
export async function patchStatus(id, status) {
  if (!isSupabaseEnabled) return;

  const { error } = await supabase
    .from('machine_builds')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) console.error('[Supabase] patchStatus error:', error.message);
}
