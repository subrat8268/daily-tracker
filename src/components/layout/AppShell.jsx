import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { MoreSheet } from './MoreSheet';
import { Toast } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';
import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);
export const useAppToast = () => useContext(ToastContext);

const DESKTOP_TABS = [
  { to: '/',          label: 'Today',         end: true },
  { to: '/namaste',   label: 'NamasteDev' },
  { to: '/weeks',     label: '12 Weeks' },
  { to: '/routine',   label: 'Routine' },
  { to: '/machine',   label: 'Machine Coding' },
  { to: '/qa',        label: 'Q&A Bank' },
  { to: '/log',       label: 'Daily Log' },
  { to: '/linkedin',  label: 'LinkedIn' },
];

// Map routes → page titles shown in header on mobile
const PAGE_TITLES = {
  '/':          'Today',
  '/namaste':   'NamasteDev',
  '/weeks':     '12-Week Plan',
  '/routine':   'Daily Routine',
  '/machine':   'Machine Coding',
  '/qa':        'Q&A Bank',
  '/log':       'Daily Log',
  '/linkedin':  'LinkedIn',
};

function PageTitle({ pathname }) {
  const title = PAGE_TITLES[pathname] || '';
  if (!title) return null;
  return (
    <div className="px-4 pt-3 pb-1 md:hidden">
      <h1 className="text-[18px] font-bold text-slate-900 tracking-tight">{title}</h1>
    </div>
  );
}

export function AppShell() {
  const { toasts, addToast, removeToast } = useToast();
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  return (
    <ToastContext.Provider value={addToast}>
      <div className="min-h-screen bg-slate-100">
        <div className="max-w-5xl mx-auto md:p-4">
          <div className="bg-white md:rounded-2xl md:shadow-lg overflow-hidden min-h-screen md:min-h-0">
            <Header />

            {/* Desktop tab nav */}
            <div className="hidden md:flex overflow-x-auto border-b border-slate-100 px-2">
              {DESKTOP_TABS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `px-3.5 py-2.5 text-[13px] font-medium border-b-2 whitespace-nowrap transition-colors shrink-0
                    ${ isActive
                        ? 'border-slate-900 text-slate-900 font-semibold'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Mobile page title */}
            <PageTitle pathname={location.pathname} />

            {/* Page content */}
            <div className="p-4 pb-24 md:pb-6">
              <Outlet />
            </div>
          </div>
        </div>

        <BottomNav onMoreClick={() => setMoreOpen(true)} />
        {moreOpen && <MoreSheet onClose={() => setMoreOpen(false)} />}
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastContext.Provider>
  );
}
