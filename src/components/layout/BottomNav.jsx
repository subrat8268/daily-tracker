import { NavLink, useLocation } from 'react-router-dom';
import { Sun, ListChecks, NotebookPen, HelpCircle, MoreHorizontal } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',        label: 'Today',   Icon: Sun,           exact: true },
  { to: '/namaste', label: 'Namaste', Icon: ListChecks,    exact: false },
  { to: '/log',     label: 'Log',     Icon: NotebookPen,   exact: false },
  { to: '/qa',      label: 'Q&A',     Icon: HelpCircle,    exact: false },
];

export function BottomNav({ onMoreClick }) {
  const location = useLocation();
  const moreRoutes = ['/weeks', '/routine', '/machine', '/linkedin', '/more'];
  const moreActive = moreRoutes.some((r) => location.pathname.startsWith(r));

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex h-16">
        {NAV_ITEMS.map(({ to, label, Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors
              ${isActive ? 'text-slate-900' : 'text-slate-400'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-slate-100' : ''}`}>
                  <Icon size={20} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* More button */}
        <button
          onClick={onMoreClick}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors
            ${moreActive ? 'text-slate-900' : 'text-slate-400'}`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${moreActive ? 'bg-slate-100' : ''}`}>
            <MoreHorizontal size={20} />
          </div>
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
