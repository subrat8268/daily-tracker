import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Monitor, Linkedin, X } from 'lucide-react';

const MORE_ITEMS = [
  { to: '/weeks',    label: '12-Week Plan',    Icon: Calendar, desc: 'DSA, JS/React, UI tasks per week' },
  { to: '/routine',  label: 'Daily Routine',   Icon: Clock,    desc: 'Your actual daily schedule' },
  { to: '/machine',  label: 'Machine Coding',  Icon: Monitor,  desc: 'Easy → hard UI builds' },
  { to: '/linkedin', label: 'LinkedIn',        Icon: Linkedin, desc: 'Post templates + daily habits' },
];

export function MoreSheet({ onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-5"
        style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>More sections</span>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>
        <div className="space-y-1">
          {MORE_ITEMS.map(({ to, label, Icon, desc }) => (
            <button
              key={to}
              onClick={() => { navigate(to); onClose(); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--bg-elevated)' }}
              >
                <Icon size={18} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
