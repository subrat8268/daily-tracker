import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { MoreSheet } from "./MoreSheet";
import { Toast } from "../ui/Toast";
import { useToast } from "../../hooks/useToast";

// Desktop tab links
const DESKTOP_TABS = [
  { to: "/", label: "Today", end: true },
  { to: "/namaste", label: "NamasteDev" },
  { to: "/weeks", label: "12 Weeks" },
  { to: "/routine", label: "Routine" },
  { to: "/machine", label: "Machine Coding" },
  { to: "/qa", label: "Q&A Bank" },
  { to: "/log", label: "Daily Log" },
  { to: "/linkedin", label: "LinkedIn" },
];

// Expose toast context globally so pages can use it
import { createContext, useContext } from "react";
export const ToastContext = createContext(null);
export const useAppToast = () => useContext(ToastContext);

export function AppShell() {
  const { toasts, addToast, removeToast } = useToast();
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  return (
    <ToastContext.Provider value={addToast}>
      <div className="min-h-screen bg-slate-100">
        {/* App card */}
        <div className="max-w-5xl mx-auto md:p-4">
          <div className="bg-white md:rounded-2xl md:shadow-lg overflow-hidden min-h-screen md:min-h-0">
            {/* Header */}
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
                    ${
                      isActive
                        ? "border-slate-900 text-slate-900 font-semibold"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Page content */}
            <div className="p-4 pb-24 md:pb-6">
              <Outlet />
            </div>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <BottomNav onMoreClick={() => setMoreOpen(true)} />

        {/* More sheet */}
        {moreOpen && <MoreSheet onClose={() => setMoreOpen(false)} />}

        {/* Toast stack */}
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastContext.Provider>
  );
}
