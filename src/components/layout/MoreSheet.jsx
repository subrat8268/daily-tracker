import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Calendar, Clock, Monitor, Linkedin, X } from "lucide-react";

const MORE_ITEMS = [
  {
    to: "/weeks",
    label: "12-Week Plan",
    Icon: Calendar,
    desc: "DSA, JS/React, UI tasks per week",
  },
  {
    to: "/routine",
    label: "Daily Routine",
    Icon: Clock,
    desc: "Your actual daily schedule",
  },
  {
    to: "/machine",
    label: "Machine Coding",
    Icon: Monitor,
    desc: "Easy → hard UI builds",
  },
  {
    to: "/linkedin",
    label: "LinkedIn",
    Icon: Linkedin,
    desc: "Post templates + daily habits",
  },
];

export function MoreSheet({ onClose }) {
  const navigate = useNavigate();

  // Close on backdrop click
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleNav = (to) => {
    navigate(to);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-5 pb-10"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-800">
            More sections
          </span>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {MORE_ITEMS.map(({ to, label, Icon, desc }) => (
            <button
              key={to}
              onClick={() => handleNav(to)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={18} className="text-slate-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">
                  {label}
                </div>
                <div className="text-xs text-slate-400">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
