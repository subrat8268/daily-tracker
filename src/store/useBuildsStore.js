/**
 * useBuildsStore.js
 * Zustand store for machine_builds — completely separate from useTrackerStore
 * so the two concerns never tangle.
 *
 * Shape of a build object (mirrors the DB row):
 * {
 *   id          : string (uuid)
 *   title       : string
 *   difficulty  : 'easy' | 'medium' | 'hard'
 *   tags        : string[]
 *   status      : 'not_started' | 'in_progress' | 'done' | 'revision'
 *   attempt_no  : number
 *   code        : string
 *   notes       : string
 *   is_revision : boolean
 *   is_preset   : boolean
 *   preset_id   : string | null   — e.g. 'mc-easy-0'
 *   created_at  : string
 *   updated_at  : string
 * }
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  loadAllBuilds,
  upsertBuild,
  deleteBuild,
  patchRevision,
  patchStatus,
} from '../lib/syncBuilds';

const useBuildsStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────
      builds: [],           // array of build objects
      _buildsLoaded: false, // cloud boot flag

      // ── Active UI state (not persisted) ───────────────────────────
      expandedId: null,     // which accordion is open
      activeFilter: 'all',  // 'all' | 'easy' | 'medium' | 'hard' | 'revision'

      // ── Boot: load from Supabase ──────────────────────────────────
      loadBuildsFromCloud: async () => {
        if (get()._buildsLoaded) return;
        const rows = await loadAllBuilds();
        if (!rows) return;
        set({ builds: rows, _buildsLoaded: true });
      },

      // ── Add new build (custom) ────────────────────────────────────
      addBuild: async (buildData) => {
        // Optimistic: assign a temp id so UI updates instantly
        const temp = {
          ...buildData,
          id: `temp-${Date.now()}`,
          is_preset: false,
          attempt_no: 1,
          code: '',
          notes: '',
          is_revision: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((s) => ({ builds: [...s.builds, temp] }));

        // Then persist to Supabase and replace temp with real row
        const saved = await upsertBuild(temp);
        if (saved) {
          set((s) => ({
            builds: s.builds.map((b) => (b.id === temp.id ? saved : b)),
          }));
        }
        return saved ?? temp;
      },

      // ── Save / update a build (code, notes, status, attempt_no) ───
      saveBuild: async (updated) => {
        set((s) => ({
          builds: s.builds.map((b) => (b.id === updated.id ? updated : b)),
        }));
        await upsertBuild(updated);
      },

      // ── Lazy-create a record for a preset item ────────────────────
      // Called when user opens an accordion on a preset card for the first time.
      ensurePresetBuild: async (presetId, title, difficulty, tags) => {
        const existing = get().builds.find((b) => b.preset_id === presetId);
        if (existing) return existing;

        const newBuild = {
          title,
          difficulty,
          tags: tags ?? [],
          status: 'not_started',
          attempt_no: 0,
          code: '',
          notes: '',
          is_revision: false,
          is_preset: true,
          preset_id: presetId,
        };

        // Optimistic insert
        const temp = { ...newBuild, id: `temp-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        set((s) => ({ builds: [...s.builds, temp] }));

        const saved = await upsertBuild(newBuild);
        if (saved) {
          set((s) => ({
            builds: s.builds.map((b) => (b.id === temp.id ? saved : b)),
          }));
          return saved;
        }
        return temp;
      },

      // ── Toggle revision flag ──────────────────────────────────────
      toggleRevision: async (id) => {
        const build = get().builds.find((b) => b.id === id);
        if (!build) return;
        const next = !build.is_revision;
        set((s) => ({
          builds: s.builds.map((b) => (b.id === id ? { ...b, is_revision: next } : b)),
        }));
        await patchRevision(id, next);
      },

      // ── Update status ─────────────────────────────────────────────
      setStatus: async (id, status) => {
        set((s) => ({
          builds: s.builds.map((b) => (b.id === id ? { ...b, status } : b)),
        }));
        await patchStatus(id, status);
      },

      // ── Delete a custom build ─────────────────────────────────────
      removeBuild: async (id) => {
        set((s) => ({ builds: s.builds.filter((b) => b.id !== id) }));
        await deleteBuild(id);
      },

      // ── UI: accordion expand ──────────────────────────────────────
      setExpanded: (id) =>
        set((s) => ({ expandedId: s.expandedId === id ? null : id })),

      // ── UI: filter ────────────────────────────────────────────────
      setFilter: (filter) => set({ activeFilter: filter }),

      // ── Derived helpers (not stored, computed on read) ────────────
      getBuildByPresetId: (presetId) =>
        get().builds.find((b) => b.preset_id === presetId) ?? null,

      getBuildById: (id) =>
        get().builds.find((b) => b.id === id) ?? null,

      getCustomBuilds: () =>
        get().builds.filter((b) => !b.is_preset),

      getRevisionBuilds: () =>
        get().builds.filter((b) => b.is_revision),
    }),
    {
      name: 'subrat-builds-v1',
      // Only persist builds array + loaded flag; UI state is transient
      partialize: (s) => ({
        builds: s.builds,
        _buildsLoaded: s._buildsLoaded,
      }),
    }
  )
);

export default useBuildsStore;
