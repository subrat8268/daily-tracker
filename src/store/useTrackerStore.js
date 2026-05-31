import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncItem, loadAllProgress } from '../lib/syncProgress';

const useTrackerStore = create(
  persist(
    (set, get) => ({
      // ── State ─────────────────────────────────────────────────────
      weekDone: {},
      mcDone: {},
      nsDone: {},
      streakData: {},
      todayChecks: {},
      logs: [],
      qaUser: [],

      // ── Cloud sync flag ───────────────────────────────────────────
      _cloudLoaded: false,

      // ── Boot: load from Supabase and merge ────────────────────────
      loadFromCloud: async () => {
        if (get()._cloudLoaded) return;
        const cloud = await loadAllProgress();
        if (!cloud) return;
        set((s) => ({
          _cloudLoaded: true,
          // Cloud wins over localStorage for progress data
          weekDone:    { ...s.weekDone,    ...cloud.weekDone },
          mcDone:      { ...s.mcDone,      ...cloud.mcDone },
          nsDone:      { ...s.nsDone,      ...cloud.nsDone },
          streakData:  { ...s.streakData,  ...cloud.streakData },
          todayChecks: { ...s.todayChecks, ...cloud.todayChecks },
        }));
      },

      // ── Actions ───────────────────────────────────────────────────
      toggleWeek: (id) => {
        set((s) => {
          const next = !s.weekDone[id];
          syncItem('weekDone', id, next);
          return { weekDone: { ...s.weekDone, [id]: next } };
        });
      },

      toggleMC: (id) => {
        set((s) => {
          const next = !s.mcDone[id];
          syncItem('mcDone', id, next);
          return { mcDone: { ...s.mcDone, [id]: next } };
        });
      },

      cycleNS: (key) => {
        set((s) => {
          const cur = s.nsDone[key] || 'none';
          const next = cur === 'none' ? 'wip' : cur === 'wip' ? 'done' : 'none';
          syncItem('nsDone', key, next);
          return { nsDone: { ...s.nsDone, [key]: next } };
        });
      },

      setStreak: (dateStr, level) => {
        set((s) => {
          syncItem('streakData', dateStr, level);
          return { streakData: { ...s.streakData, [dateStr]: level } };
        });
      },

      cycleStreak: (dateStr) => {
        set((s) => {
          const cur = s.streakData[dateStr] || 0;
          const next = (cur + 1) % 5;
          syncItem('streakData', dateStr, next);
          return { streakData: { ...s.streakData, [dateStr]: next } };
        });
      },

      toggleTodayCheck: (id, dateStr) => {
        set((s) => {
          const key = id + '_' + dateStr;
          const next = !s.todayChecks[key];
          syncItem('todayChecks', key, next);
          return { todayChecks: { ...s.todayChecks, [key]: next } };
        });
      },

      saveLog: (entry) =>
        set((s) => {
          const existing = s.logs.findIndex((l) => l.date === entry.date);
          const newLogs = [...s.logs];
          if (existing >= 0) newLogs[existing] = entry;
          else newLogs.unshift(entry);
          return { logs: newLogs };
        }),

      deleteLog: (id) =>
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),

      clearLogs: () => set({ logs: [] }),

      addQA: (q) => set((s) => ({ qaUser: [...s.qaUser, q] })),

      deleteQA: (i) =>
        set((s) => ({ qaUser: s.qaUser.filter((_, idx) => idx !== i) })),
    }),
    {
      name: 'subrat-tracker-v2',
    }
  )
);

export default useTrackerStore;
