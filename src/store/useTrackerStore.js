import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTrackerStore = create(
  persist(
    (set, get) => ({
      // ── Checklist states ──────────────────────────────────────────
      weekDone: {},       // { 'w1-dsa-0': true, ... }
      mcDone: {},         // { 'mc-Easy-0': true, ... }
      nsDone: {},         // { 'ns_section_topic': 'none'|'wip'|'done' }
      streakData: {},     // { 'Sun Jun 01 2026': 3, ... } — level 0-4
      todayChecks: {},    // { 'today-0_Sun Jun 01 2026': true, ... }

      // ── Logs ──────────────────────────────────────────────────────
      logs: [],           // [{ id, date, mood, study, kred, dsa, js, mc, tomorrow, notes }]

      // ── Q&A bank ─────────────────────────────────────────────────
      qaUser: [],         // user-added questions

      // ── Actions ───────────────────────────────────────────────────
      toggleWeek: (id) =>
        set((s) => ({ weekDone: { ...s.weekDone, [id]: !s.weekDone[id] } })),

      toggleMC: (id) =>
        set((s) => ({ mcDone: { ...s.mcDone, [id]: !s.mcDone[id] } })),

      cycleNS: (key) =>
        set((s) => {
          const cur = s.nsDone[key] || 'none';
          const next = cur === 'none' ? 'wip' : cur === 'wip' ? 'done' : 'none';
          return { nsDone: { ...s.nsDone, [key]: next } };
        }),

      setStreak: (dateStr, level) =>
        set((s) => ({ streakData: { ...s.streakData, [dateStr]: level } })),

      cycleStreak: (dateStr) =>
        set((s) => {
          const cur = s.streakData[dateStr] || 0;
          return { streakData: { ...s.streakData, [dateStr]: (cur + 1) % 5 } };
        }),

      toggleTodayCheck: (id, dateStr) =>
        set((s) => {
          const key = id + '_' + dateStr;
          return { todayChecks: { ...s.todayChecks, [key]: !s.todayChecks[key] } };
        }),

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
      name: 'subrat-tracker-v2', // localStorage key
    }
  )
);

export default useTrackerStore;
