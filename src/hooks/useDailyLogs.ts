import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

const STORAGE_KEY = 'roadmap-daily-logs';

export interface DailyLog {
  id: string;
  date: string;
  studyHours: string;
  kredHours: string;
  dsaDone: string;
  jsRev: string;
  mcDone: string;
  tomorrowTask: string;
  notes: string;
}

// Map camelCase ↔ snake_case for Supabase
function toSupabase(log: Omit<DailyLog, 'id'>) {
  return {
    date: log.date,
    study_hours: log.studyHours ? parseFloat(log.studyHours) : null,
    kred_hours: log.kredHours ? parseFloat(log.kredHours) : null,
    dsa_done: log.dsaDone,
    js_rev: log.jsRev,
    mc_done: log.mcDone,
    tomorrow_task: log.tomorrowTask,
    notes: log.notes,
  };
}

function fromSupabase(row: Record<string, unknown>): DailyLog {
  return {
    id: row.id as string,
    date: row.date as string,
    studyHours: String(row.study_hours ?? ''),
    kredHours: String(row.kred_hours ?? ''),
    dsaDone: (row.dsa_done as string) ?? '',
    jsRev: (row.js_rev as string) ?? '',
    mcDone: (row.mc_done as string) ?? '',
    tomorrowTask: (row.tomorrow_task as string) ?? '',
    notes: (row.notes as string) ?? '',
  };
}

function loadLocalLogs(): DailyLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DailyLog[]) : [];
  } catch {
    return [];
  }
}

function saveLocalLogs(logs: DailyLog[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function useDailyLogs() {
  const [logs, setLogs] = useState<DailyLog[]>(loadLocalLogs);

  // Load from Supabase on mount
  useEffect(() => {
    if (!isSupabaseEnabled) return;
    let cancelled = false;

    supabase!
      .from('daily_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const cloudLogs = (data as Record<string, unknown>[]).map(fromSupabase);
        setLogs(cloudLogs);
        saveLocalLogs(cloudLogs);
      });

    return () => { cancelled = true; };
  }, []);

  const addLog = useCallback(async (log: Omit<DailyLog, 'id'>) => {
    if (isSupabaseEnabled) {
      const { data, error } = await supabase!
        .from('daily_logs')
        .insert(toSupabase(log))
        .select()
        .single();

      if (!error && data) {
        const newLog = fromSupabase(data as Record<string, unknown>);
        setLogs((prev) => {
          const next = [newLog, ...prev];
          saveLocalLogs(next);
          return next;
        });
        return;
      }
      console.error('[Supabase] daily_logs insert error:', error?.message);
    }

    // Fallback: localStorage only
    const newLog: DailyLog = { ...log, id: `${Date.now()}` };
    setLogs((prev) => {
      const next = [newLog, ...prev];
      saveLocalLogs(next);
      return next;
    });
  }, []);

  const clearLogs = useCallback(async () => {
    if (isSupabaseEnabled) {
      const { error } = await supabase!
        .from('daily_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all

      if (error) console.error('[Supabase] daily_logs clear error:', error.message);
    }
    setLogs([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportLogs = useCallback(() => {
    const data = JSON.stringify(logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roadmap-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs]);

  return { logs, addLog, clearLogs, exportLogs };
}
