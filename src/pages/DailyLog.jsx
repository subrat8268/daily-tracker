import { useState, useEffect, useCallback } from 'react';
import { Trash2, Download } from 'lucide-react';
import useTrackerStore from '../store/useTrackerStore';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import { DailyLogForm } from '../components/forms/DailyLogForm';
import { Card } from '../components/ui/Card';
import { useAppToast } from '../components/layout/AppShell';
import { calcScore } from '../hooks/useWeeklySummary';

function ScoreBadge({ log }) {
  const score = calcScore(log);
  const [bg, color] = score >= 75
    ? ['var(--success-surface)', 'var(--success)']
    : score >= 50
      ? ['var(--warning-surface)', 'var(--warning)']
      : ['var(--danger-surface)', 'var(--danger)'];
  return (
    <span
      className="text-[11px] font-bold px-1.5 py-0.5"
      style={{ background: bg, color, borderRadius: 'var(--radius-sm)' }}
    >
      {score}
    </span>
  );
}

function LogCard({ log, onDelete }) {
  return (
    <div
      className="mb-2"
      style={{
        background:   'var(--bg-surface)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        boxShadow:    'var(--shadow-card)',
        padding:      14,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{log.mood || '—'}</span>
          <span className="text-[12px] font-mono" style={{ color: 'var(--text-tertiary)' }}>{log.date}</span>
          <ScoreBadge log={log} />
        </div>
        <button
          onClick={() => onDelete(log.id)}
          className="p-1.5 rounded-lg transition-colors duration-150"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-surface)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <Trash2 size={13} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
        {log.study_hours != null && (
          <div>
            <span style={{ color: 'var(--text-tertiary)' }}>Study: </span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{log.study_hours}h</span>
          </div>
        )}
        {log.kred_hours != null && (
          <div>
            <span style={{ color: 'var(--text-tertiary)' }}>KredBook: </span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{log.kred_hours}h</span>
          </div>
        )}
        {(log.dsa_done || log.dsa) && (
          <div className="col-span-2">
            <span style={{ color: 'var(--text-tertiary)' }}>DSA: </span>
            <span style={{ color: 'var(--text-secondary)' }}>{log.dsa_done || log.dsa}</span>
          </div>
        )}
        {(log.js_rev || log.js) && (
          <div className="col-span-2">
            <span style={{ color: 'var(--text-tertiary)' }}>JS/React: </span>
            <span style={{ color: 'var(--text-secondary)' }}>{log.js_rev || log.js}</span>
          </div>
        )}
        {(log.mc_done || log.mc) && (
          <div className="col-span-2">
            <span style={{ color: 'var(--text-tertiary)' }}>Machine: </span>
            <span style={{ color: 'var(--text-secondary)' }}>{log.mc_done || log.mc}</span>
          </div>
        )}
        {(log.tomorrow_task || log.tomorrow) && (
          <div className="col-span-2 mt-1 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Tomorrow 6AM: </span>
            <span style={{ color: 'var(--text-secondary)' }}>{log.tomorrow_task || log.tomorrow}</span>
          </div>
        )}
        {log.notes && (
          <div className="col-span-2 mt-0.5 italic" style={{ color: 'var(--text-tertiary)' }}>
            {log.notes}
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({ onClick, children, style, onMouseEnter, onMouseLeave }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1.5 text-[12px] transition-colors duration-150"
      style={{
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        color:        'var(--text-secondary)',
        background:   'transparent',
        ...style,
      }}
      onMouseEnter={onMouseEnter || ((e) => e.currentTarget.style.background = 'var(--bg-elevated)')}
      onMouseLeave={onMouseLeave || ((e) => e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );
}

export default function DailyLog() {
  const storeLogs      = useTrackerStore((s) => s.logs);
  const deleteStoreLog = useTrackerStore((s) => s.deleteLog);
  const clearStoreLogs = useTrackerStore((s) => s.clearLogs);
  const addToast       = useAppToast();

  const [cloudLogs, setCloudLogs] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [prefill,   setPrefill]   = useState(null);

  useEffect(() => {
    if (!isSupabaseEnabled) return;
    setLoading(true);
    supabase
      .from('daily_logs')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false);
        if (error) { console.error('[Supabase] fetch error:', error.message); return; }
        if (data) {
          setCloudLogs(data);
          const last = data[0];
          if (last?.tomorrow_task) setPrefill(last.tomorrow_task);
        }
      });
  }, []);

  const logs = isSupabaseEnabled ? cloudLogs : storeLogs;

  const handleLogAdded = useCallback((newRow) => {
    setCloudLogs((prev) => {
      const idx = prev.findIndex((l) => l.date === newRow.date);
      if (idx >= 0) { const next = [...prev]; next[idx] = newRow; return next.sort((a, b) => b.date.localeCompare(a.date)); }
      return [newRow, ...prev];
    });
    setPrefill(newRow.tomorrow_task || null);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (isSupabaseEnabled) {
      const { error } = await supabase.from('daily_logs').delete().eq('id', id);
      if (error) { console.error('[Supabase] delete error:', error.message); return; }
      setCloudLogs((prev) => prev.filter((l) => l.id !== id));
    } else { deleteStoreLog(id); }
    addToast?.('Log deleted', 'info');
  }, [deleteStoreLog, addToast]);

  const handleClear = useCallback(async () => {
    if (!window.confirm('Clear ALL log entries? This cannot be undone.')) return;
    if (isSupabaseEnabled) {
      const { error } = await supabase.from('daily_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) { console.error('[Supabase] clear error:', error.message); return; }
      setCloudLogs([]);
    } else { clearStoreLogs(); }
    addToast?.('All logs cleared', 'info');
  }, [clearStoreLogs, addToast]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `subrat-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }, [logs]);

  return (
    <div>
      <p className="text-[13px] mb-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Fill this every night at 8:30 PM. Takes under 60 seconds.
      </p>
      <p className="text-[11px] mb-4 font-medium">
        {isSupabaseEnabled
          ? <span style={{ color: 'var(--success)' }}>☁️ Syncing to Supabase</span>
          : <span style={{ color: 'var(--warning)' }}>⚠️ Saving locally only</span>}
      </p>

      <Card>
        <div className="text-[13px] font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          ✏️ Today's log
          {prefill && (
            <span className="text-[11px] font-normal ml-auto" style={{ color: 'var(--accent)' }}>
              Pre-filled from yesterday ✓
            </span>
          )}
        </div>
        <DailyLogForm
          onSaved={(msg, type) => addToast?.(msg, type)}
          onLogAdded={handleLogAdded}
          prefillDsa={prefill}
        />
      </Card>

      {/* History header */}
      <div className="flex items-center justify-between mb-3 mt-5">
        <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          Log history{' '}
          {loading && <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>(loading…)</span>}
        </div>
        <div className="flex gap-2">
          {logs.length > 0 && (
            <>
              <IconBtn onClick={handleExport}>
                <Download size={12} /> Export
              </IconBtn>
              <IconBtn
                onClick={handleClear}
                style={{ color: 'var(--danger)', borderColor: 'rgba(225,25,0,0.25)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-surface)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Trash2 size={12} /> Clear all
              </IconBtn>
            </>
          )}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        {logs.length === 0
          ? <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
              {loading ? 'Fetching logs…' : 'No logs yet. Fill the form above tonight.'}
            </p>
          : logs.map((log) => <LogCard key={log.id} log={log} onDelete={handleDelete} />)}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        {logs.length === 0
          ? <p className="text-[13px] py-4" style={{ color: 'var(--text-tertiary)' }}>
              {loading ? 'Fetching logs…' : 'No logs yet.'}
            </p>
          : (
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  {['Date', 'Mood', 'Score', 'Study', 'KredBook', 'DSA', 'JS/React', 'Machine', 'Tomorrow', ''].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-[11px] uppercase tracking-wider font-semibold"
                      style={{
                        background:   'var(--bg-elevated)',
                        borderBottom: '1px solid var(--border)',
                        color:        'var(--text-tertiary)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr
                    key={l.id}
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-3 py-2 font-mono text-[11px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{l.date}</td>
                    <td className="px-3 py-2 text-base">{l.mood || '—'}</td>
                    <td className="px-3 py-2"><ScoreBadge log={l} /></td>
                    <td className="px-3 py-2 font-mono" style={{ color: 'var(--text-secondary)' }}>{l.study_hours != null ? `${l.study_hours}h` : l.study ? `${l.study}h` : '—'}</td>
                    <td className="px-3 py-2 font-mono" style={{ color: 'var(--text-secondary)' }}>{l.kred_hours  != null ? `${l.kred_hours}h`  : l.kred  ? `${l.kred}h`  : '—'}</td>
                    <td className="px-3 py-2 max-w-[120px] truncate" style={{ color: 'var(--text-secondary)' }}>{l.dsa_done || l.dsa || '—'}</td>
                    <td className="px-3 py-2 max-w-[120px] truncate" style={{ color: 'var(--text-secondary)' }}>{l.js_rev   || l.js  || '—'}</td>
                    <td className="px-3 py-2 max-w-[100px] truncate" style={{ color: 'var(--text-secondary)' }}>{l.mc_done  || l.mc  || '—'}</td>
                    <td className="px-3 py-2 max-w-[120px] truncate" style={{ color: 'var(--accent)' }}>{l.tomorrow_task || l.tomorrow || '—'}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="p-1 rounded transition-colors duration-150"
                        style={{ color: 'var(--text-tertiary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-surface)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}
