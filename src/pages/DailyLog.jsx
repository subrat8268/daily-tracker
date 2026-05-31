import { Trash2, Download } from 'lucide-react';
import useTrackerStore from '../store/useTrackerStore';
import { DailyLogForm } from '../components/forms/DailyLogForm';
import { Card } from '../components/ui/Card';
import { useAppToast } from '../components/layout/AppShell';

function LogCard({ log, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{log.mood || '—'}</span>
          <span className="text-[12px] font-mono text-slate-500">{log.date}</span>
        </div>
        <button
          onClick={() => onDelete(log.id)}
          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
        {log.study && <div><span className="text-slate-400">Study:</span> <span className="text-slate-700 font-medium">{log.study}h</span></div>}
        {log.kred && <div><span className="text-slate-400">KredBook:</span> <span className="text-slate-700 font-medium">{log.kred}h</span></div>}
        {log.dsa && <div className="col-span-2"><span className="text-slate-400">DSA:</span> <span className="text-slate-700">{log.dsa}</span></div>}
        {log.js && <div className="col-span-2"><span className="text-slate-400">JS/React:</span> <span className="text-slate-700">{log.js}</span></div>}
        {log.mc && <div className="col-span-2"><span className="text-slate-400">Machine:</span> <span className="text-slate-700">{log.mc}</span></div>}
        {log.tomorrow && (
          <div className="col-span-2 mt-1 pt-1 border-t border-slate-100">
            <span className="text-blue-500 font-medium">Tomorrow 6AM:</span>{' '}
            <span className="text-slate-700">{log.tomorrow}</span>
          </div>
        )}
        {log.notes && (
          <div className="col-span-2 text-slate-400 italic mt-0.5">{log.notes}</div>
        )}
      </div>
    </div>
  );
}

export default function DailyLog() {
  const logs = useTrackerStore((s) => s.logs);
  const deleteLog = useTrackerStore((s) => s.deleteLog);
  const clearLogs = useTrackerStore((s) => s.clearLogs);
  const addToast = useAppToast();

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'subrat_daily_logs.json';
    a.click();
  };

  const handleDelete = (id) => {
    deleteLog(id);
    addToast?.('Log deleted', 'info');
  };

  const handleClear = () => {
    if (window.confirm('Clear ALL log entries? This cannot be undone.')) {
      clearLogs();
      addToast?.('All logs cleared', 'info');
    }
  };

  return (
    <div>
      <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
        Fill this every night at 8:30 PM. Takes under 60 seconds. Saves locally.
      </p>

      <Card>
        <div className="text-[13px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
          ✏️ Today's log
        </div>
        <DailyLogForm onSaved={(msg, type) => addToast?.(msg, type)} />
      </Card>

      {/* Log history */}
      <div className="flex items-center justify-between mb-3 mt-5">
        <div className="text-[13px] font-semibold text-slate-800">Log history</div>
        <div className="flex gap-2">
          {logs.length > 0 && (
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <Download size={12} /> Export
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={12} /> Clear all
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden">
        {logs.length === 0 ? (
          <p className="text-[13px] text-slate-400 text-center py-8">No logs yet. Fill the form above tonight.</p>
        ) : (
          logs.map((log) => <LogCard key={log.id} log={log} onDelete={handleDelete} />)
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        {logs.length === 0 ? (
          <p className="text-[13px] text-slate-400 py-4">No logs yet. Fill the form above tonight.</p>
        ) : (
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                {['Date', 'Mood', 'Study', 'KredBook', 'DSA', 'JS/React', 'Machine', 'Tomorrow', ''].map((h) => (
                  <th key={h} className="bg-slate-50 px-3 py-2 text-left border border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 border border-slate-200 font-mono text-[11px] whitespace-nowrap">{l.date}</td>
                  <td className="px-3 py-2 border border-slate-200 text-base">{l.mood || '—'}</td>
                  <td className="px-3 py-2 border border-slate-200 font-mono">{l.study ? `${l.study}h` : '—'}</td>
                  <td className="px-3 py-2 border border-slate-200 font-mono">{l.kred ? `${l.kred}h` : '—'}</td>
                  <td className="px-3 py-2 border border-slate-200 max-w-[120px] truncate">{l.dsa || '—'}</td>
                  <td className="px-3 py-2 border border-slate-200 max-w-[120px] truncate">{l.js || '—'}</td>
                  <td className="px-3 py-2 border border-slate-200 max-w-[100px] truncate">{l.mc || '—'}</td>
                  <td className="px-3 py-2 border border-slate-200 max-w-[120px] text-blue-600 truncate">{l.tomorrow || '—'}</td>
                  <td className="px-3 py-2 border border-slate-200">
                    <button onClick={() => handleDelete(l.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded">
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
