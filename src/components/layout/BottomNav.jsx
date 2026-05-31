import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListChecks, NotebookPen, HelpCircle, MoreHorizontal } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',        label: 'Today',   Icon: LayoutDashboard, exact: true },
  { to: '/namaste', label: 'Namaste', Icon: ListChecks,      exact: false },
  { to: '/log',     label: 'Log',     Icon: NotebookPen,     exact: false },
  { to: '/qa',      label: 'Q&A',     Icon: HelpCircle,      exact: false },
];

export function BottomNav({ onMoreClick }) {
  const location = useLocation();
  const moreRoutes = ['/weeks', '/routine', '/machine', '/linkedin'];
  const moreActive = moreRoutes.some((r) => location.pathname.startsWith(r));

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex h-14">
        {NAV_ITEMS.map(({ to, label, Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className="flex-1 flex flex-col items-center justify-center gap-0.5"
          >
            {({ isActive }) => (
              <>
                <div
                  className="p-1.5 rounded-lg transition-all duration-150"
                  style={{
                    background: isActive ? 'var(--text-primary)' : 'transparent',
                    color: isActive ? 'var(--text-inverse)' : 'var(--text-tertiary)',
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        <button
          onClick={onMoreClick}
          className="flex-1 flex flex-col items-center justify-center gap-0.5"
        >
          <div
            className="p-1.5 rounded-lg transition-all duration-150"
            style={{
              background: moreActive ? 'var(--text-primary)' : 'transparent',
              color: moreActive ? 'var(--text-inverse)' : 'var(--text-tertiary)',
              transform: moreActive ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            <MoreHorizontal size={18} strokeWidth={moreActive ? 2.5 : 1.8} />
          </div>
          <span
            className="text-[10px] font-medium"
            style={{ color: moreActive ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
          >
            More
          </span>
        </button>
      </div>
    </nav>
  );
}
