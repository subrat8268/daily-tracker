import { useState, createContext, useContext } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  ListChecks,
  NotebookPen,
  HelpCircle,
  MoreHorizontal,
  LayoutDashboard,
  Calendar,
  Clock,
  Monitor,
  Linkedin,
  ChevronLeft,
} from "lucide-react";
import { BottomNav } from "./BottomNav";
import { MoreSheet } from "./MoreSheet";
import { Toast } from "../ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../hooks/useTheme";
import { useProgress } from "../../hooks/useProgress";
import { useStreak } from "../../hooks/useStreak";

export const ToastContext = createContext(null);
export const ThemeContext = createContext(null);
export const useAppToast = () => useContext(ToastContext);
export const useAppTheme = () => useContext(ThemeContext);

const SIDEBAR_ITEMS = [
  { to: "/", label: "Today", Icon: LayoutDashboard, end: true },
  { to: "/namaste", label: "NamasteDev", Icon: ListChecks },
  { to: "/weeks", label: "12 Weeks", Icon: Calendar },
  { to: "/routine", label: "Routine", Icon: Clock },
  { to: "/machine", label: "Machine Coding", Icon: Monitor },
  { to: "/qa", label: "Q&A Bank", Icon: HelpCircle },
  { to: "/log", label: "Daily Log", Icon: NotebookPen },
  { to: "/linkedin", label: "LinkedIn", Icon: Linkedin },
];

const PAGE_TITLES = {
  "/": "Today",
  "/namaste": "NamasteDev",
  "/weeks": "12-Week Plan",
  "/routine": "Daily Routine",
  "/machine": "Machine Coding",
  "/qa": "Q&A Bank",
  "/log": "Daily Log",
  "/linkedin": "LinkedIn",
};

function Sidebar({ theme, onToggleTheme }) {
  const [expanded, setExpanded] = useState(true);
  const { done, total, pct } = useProgress();

  return (
    <aside
      className="sidebar hidden md:flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: expanded
          ? "var(--sidebar-w-expanded)"
          : "var(--sidebar-w-collapsed)",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        cursor: !expanded ? "pointer" : "default",
      }}
      onClick={!expanded ? () => setExpanded(true) : undefined}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 py-5 shrink-0"
        style={{ minHeight: 64 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center shrink-0 font-black text-sm cursor-pointer select-none transition-transform active:scale-95"
            style={{
              background: "var(--text-primary)",
              color: "var(--text-inverse)",
            }}
            onClick={(e) => {
              if (expanded) {
                e.stopPropagation();
                setExpanded(false);
              }
            }}
          >
            SJ
          </div>
          {expanded && (
            <span
              className="font-bold text-sm whitespace-nowrap"
              style={{ color: "var(--text-primary)" }}
            >
              Subrat's Tracker
            </span>
          )}
        </div>
        {expanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
            className="p-1 rounded-lg hover:bg-(--bg-elevated) transition-colors cursor-pointer text-(--text-tertiary) flex items-center justify-center"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {expanded && (
        <div className="px-4 pb-4 shrink-0">
          <div
            className="flex justify-between text-[11px] mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            <span>Progress</span>
            <span className="font-mono">
              {done}/{total}
            </span>
          </div>
          <div
            className="h-[3px] rounded-full"
            style={{ background: "var(--bg-overlay)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(pct, 100)}%`,
                background: "var(--text-primary)",
              }}
            />
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {SIDEBAR_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
              ${isActive ? "font-semibold" : "font-medium"}`
            }
            style={({ isActive }) => ({
              background: isActive ? "var(--bg-elevated)" : "transparent",
              color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
            })}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="shrink-0"
                />
                {expanded && (
                  <span className="text-[13px] whitespace-nowrap">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom — theme toggle */}
      <div className="px-2 pb-4 shrink-0">
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors"
          style={{ color: "var(--text-tertiary)" }}
        >
          {theme === "dark" ? (
            <Sun size={18} strokeWidth={1.8} className="shrink-0" />
          ) : (
            <Moon size={18} strokeWidth={1.8} className="shrink-0" />
          )}
          {expanded && (
            <span className="text-[13px] font-medium">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

function TopBar({ title, theme, onToggleTheme }) {
  const streak = useStreak();
  const { done, total } = useProgress();
  const dayNum = done; // reuse done count as rough day proxy

  return (
    <div
      className="md:hidden flex items-center justify-between px-4 shrink-0"
      style={{
        height: 56,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left: wordmark */}
      <div
        className="w-8 h-8 rounded flex items-center justify-center font-black text-sm shrink-0"
        style={{
          background: "var(--text-primary)",
          color: "var(--text-inverse)",
        }}
      >
        SJ
      </div>

      {/* Center: page title */}
      <span
        className="text-[15px] font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </span>

      {/* Right: streak + toggle */}
      <div className="flex items-center gap-3">
        {streak > 0 && (
          <span
            className="text-[12px] font-semibold"
            style={{ color: "#FFC043" }}
          >
            🔥 {streak}
          </span>
        )}
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{
            color: "var(--text-secondary)",
            background: "var(--bg-elevated)",
          }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}

export function AppShell() {
  const { toasts, addToast, removeToast } = useToast();
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const { theme, toggle, isDark } = useTheme();

  const pageTitle = PAGE_TITLES[location.pathname] || "";

  return (
    <ToastContext.Provider value={addToast}>
      <ThemeContext.Provider value={{ theme, toggle, isDark }}>
        <div
          className="flex h-screen overflow-hidden"
          style={{ background: "var(--bg-base)" }}
        >
          {/* Desktop sidebar */}
          <Sidebar theme={theme} onToggleTheme={toggle} />

          {/* Main column */}
          <div className="flex flex-col flex-1 min-w-0 h-screen">
            {/* Mobile top bar */}
            <TopBar title={pageTitle} theme={theme} onToggleTheme={toggle} />

            {/* Scrollable page content */}
            <main
              className="flex-1 overflow-y-auto"
              style={{ background: "var(--bg-base)" }}
            >
              <div className="p-4 pb-24 md:p-6 md:pb-6 max-w-5xl mx-auto w-full">
                <Outlet />
              </div>
            </main>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <BottomNav onMoreClick={() => setMoreOpen(true)} />

        {/* More sheet */}
        {moreOpen && <MoreSheet onClose={() => setMoreOpen(false)} />}

        {/* Toast stack */}
        <Toast toasts={toasts} onRemove={removeToast} />
      </ThemeContext.Provider>
    </ToastContext.Provider>
  );
}
