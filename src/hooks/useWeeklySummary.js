/**
 * useWeeklySummary.js
 * Computes last-7-days stats from Supabase daily_logs.
 * Returns { totalStudy, totalKred, avgScore, dsaCount, bestMood, loading }
 */
import { useState, useEffect } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import useTrackerStore from '../store/useTrackerStore';

const MOOD_SCORE = { '🔥': 100, '✅': 75, '😐': 50, '😓': 25, '❌': 0 };

export function calcScore(log) {
  const study = Math.min((parseFloat(log.study_hours || log.study || 0) / 8) * 40, 40);
  const kred  = Math.min((parseFloat(log.kred_hours  || log.kred  || 0) / 3) * 20, 20);
  const dsa   = (log.dsa_done || log.dsa) ? 20 : 0;
  const mood  = ((MOOD_SCORE[log.mood] ?? 50) / 100) * 20;
  return Math.round(study + kred + dsa + mood);
}

export function useWeeklySummary() {
  const storeLogs = useTrackerStore((s) => s.logs);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function compute() {
      setLoading(true);
      let logs = [];

      if (isSupabaseEnabled) {
        const since = new Date();
        since.setDate(since.getDate() - 7);
        const { data } = await supabase
          .from('daily_logs')
          .select('*')
          .gte('date', since.toISOString().slice(0, 10))
          .order('date', { ascending: false });
        logs = data || [];
      } else {
        logs = storeLogs.slice(0, 7);
      }

      if (!logs.length) { setLoading(false); setSummary(null); return; }

      const totalStudy = logs.reduce((s, l) => s + parseFloat(l.study_hours || l.study || 0), 0);
      const totalKred  = logs.reduce((s, l) => s + parseFloat(l.kred_hours  || l.kred  || 0), 0);
      const scores     = logs.map(calcScore);
      const avgScore   = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const dsaCount   = logs.filter((l) => (l.dsa_done || l.dsa)?.trim()).length;
      const bestDay    = logs.reduce((best, l) => calcScore(l) >= calcScore(best) ? l : best, logs[0]);

      setSummary({ totalStudy: totalStudy.toFixed(1), totalKred: totalKred.toFixed(1), avgScore, dsaCount, bestDay, logCount: logs.length });
      setLoading(false);
    }
    compute();
  }, [storeLogs]);

  return { summary, loading };
}
