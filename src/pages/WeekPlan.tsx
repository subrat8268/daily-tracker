import React, { useState } from 'react';
import { Save, Download, Trash2 } from 'lucide-react';
import { WEEKS } from '../data/weeks';
import { PHASES } from '../data/phases';
import { WeekCard } from '../components/WeekCard';
import { useDailyLogs, DailyLog } from '../hooks/useDailyLogs';

interface WeekPlanProps {
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
  onSaved?: () => void;
}

const emptyForm = (): Omit<DailyLog, 'id'> => ({
  date: new Date().toISOString().slice(0, 10),
  studyHours: '',
  kredHours: '',
  dsaDone: '',
  jsRev: '',
  mcDone: '',
  tomorrowTask: '',
  notes: '',
});

export const WeekPlan: React.FC<WeekPlanProps> = ({ isDone, onToggle, onSaved }) => {
  const { logs, addLog, clearLogs, exportLogs } = useDailyLogs();
  const [form, setForm] = useState(emptyForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    await addLog(form);
    setForm(emptyForm());
    onSaved?.();
  };

  const handleClear = () => {
    if (window.confirm('Clear all logs? This cannot be undone.')) clearLogs();
  };

  let lastPh = 0;

  return (
    <div id="panel-weeks" role="tabpanel" aria-labelledby="tab-weeks">
      {/* Daily Tracker Form */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title">Daily Tracker</div>
        <p className="text-sm text-muted" style={{ lineHeight: 1.6, marginBottom: 4 }}>
          Log your day here. Saved to your browser automatically.
        </p>

        <div className="tracker-grid">
          <div className="tracker-field">
            <label htmlFor="log-date">Date</label>
            <input id="log-date" type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="tracker-field">
            <label htmlFor="log-studyHours">Study Hours</label>
            <input id="log-studyHours" type="number" name="studyHours" min="0" step="0.5" placeholder="4" value={form.studyHours} onChange={handleChange} />
          </div>
          <div className="tracker-field">
            <label htmlFor="log-kredHours">KredBook Hours</label>
            <input id="log-kredHours" type="number" name="kredHours" min="0" step="0.5" placeholder="2" value={form.kredHours} onChange={handleChange} />
          </div>
          <div className="tracker-field">
            <label htmlFor="log-dsaDone">DSA Done</label>
            <input id="log-dsaDone" type="text" name="dsaDone" placeholder="e.g. Two Sum, Sliding Window" value={form.dsaDone} onChange={handleChange} />
          </div>
          <div className="tracker-field">
            <label htmlFor="log-jsRev">JS/React Revision</label>
            <input id="log-jsRev" type="text" name="jsRev" placeholder="e.g. closures, useEffect" value={form.jsRev} onChange={handleChange} />
          </div>
          <div className="tracker-field">
            <label htmlFor="log-mcDone">Machine Coding</label>
            <input id="log-mcDone" type="text" name="mcDone" placeholder="e.g. search filter UI" value={form.mcDone} onChange={handleChange} />
          </div>
          <div className="tracker-field">
            <label htmlFor="log-tomorrowTask">Tomorrow First Task</label>
            <input id="log-tomorrowTask" type="text" name="tomorrowTask" placeholder="e.g. Solve Valid Anagram at 7 AM" value={form.tomorrowTask} onChange={handleChange} />
          </div>
          <div className="tracker-field full">
            <label htmlFor="log-notes">Notes</label>
            <textarea id="log-notes" name="notes" rows={4} placeholder="blockers, fixes, learnings, interview notes" value={form.notes} onChange={handleChange} />
          </div>
        </div>

        <div className="toolbar">
          <button className="btn-primary" id="save-log-btn" onClick={handleSave}>
            <Save size={14} aria-hidden="true" />
            Save Log
          </button>
          <button className="btn-secondary" id="export-logs-btn" onClick={exportLogs}>
            <Download size={14} aria-hidden="true" />
            Export JSON
          </button>
          <button className="btn-secondary" id="clear-logs-btn" onClick={handleClear} style={{ color: 'var(--color-text-danger)' }}>
            <Trash2 size={14} aria-hidden="true" />
            Clear Logs
          </button>
        </div>

        {/* Logs Table */}
        {logs.length > 0 && (
          <div style={{ overflowX: 'auto', marginTop: 8 }}>
            <table className="tracker-table" aria-label="Daily logs">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Study</th>
                  <th>KredBook</th>
                  <th>DSA</th>
                  <th>JS/React</th>
                  <th>Machine Coding</th>
                  <th>Tomorrow</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.date}</td>
                    <td>{log.studyHours}h</td>
                    <td>{log.kredHours}h</td>
                    <td>{log.dsaDone}</td>
                    <td>{log.jsRev}</td>
                    <td>{log.mcDone}</td>
                    <td>{log.tomorrowTask}</td>
                    <td>{log.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Week Cards */}
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 14 }}>
        Click any week to expand. Tap items to track your progress.
      </p>
      {WEEKS.map((week) => {
        const phase = PHASES[week.ph - 1];
        const showPhaseLabel = week.ph !== lastPh;
        lastPh = week.ph;
        return (
          <React.Fragment key={week.w}>
            {showPhaseLabel && (
              <div
                className="phase-divider"
                style={{ color: phase.color }}
              >
                {phase.name}
              </div>
            )}
            <WeekCard
              week={week}
              phase={phase}
              isDone={isDone}
              onToggle={onToggle}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
