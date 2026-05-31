import { NavLink, useLocation } from 'react-router-dom';
import { Sun, ListChecks, NotebookPen, HelpCircle, MoreHorizontal } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',        label: 'Today',   Icon: Sun,         exact: true },
  { to: '/namaste', label: 'Namaste', Icon: ListChecks,  exact: false },
  { to: '/log',     label: 'Log',     Icon: NotebookPen, exact: false },
  { to: '/qa',      label: 'Q&A',     Icon: HelpCircle,  exact: false },
];

export function BottomNav({ onMoreClick }) {
  const location = useLocation();
  const moreRoutes = ['/weeks', '/routine', '/machine', '/linkedin', '/more'];
  const moreActive = moreRoutes.some((r) => location.pathname.startsWith(r));

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex h-16">
        {NAV_ITEMS.map(({ to, label, Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className="flex-1 flex flex-col items-center justify-center gap-0.5"
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-2 rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-110'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={`text-[10px] font-medium transition-colors duration-200
                  ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* More button */}
        <button
          onClick={onMoreClick}
          className="flex-1 flex flex-col items-center justify-center gap-0.5"
        >
          <div className={`p-2 rounded-2xl transition-all duration-200
            ${moreActive
              ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-110'
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MoreHorizontal size={18} strokeWidth={moreActive ? 2.5 : 1.8} />
          </div>
          <span className={`text-[10px] font-medium transition-colors duration-200
            ${moreActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
            More
          </span>
        </button>
      </div>
    </nav>
  );
}
