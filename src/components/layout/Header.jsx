import { useProgress } from "../../hooks/useProgress";
import { useStreak } from "../../hooks/useStreak";
import { ProgressBar } from "../ui/ProgressBar";

export function Header() {
  const { done, total, pct } = useProgress();
  const streak = useStreak();

  return (
    <div className="px-4 pt-4 pb-3 border-b border-slate-100">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <div className="text-[15px] font-semibold text-slate-900">
            Subrat's tracker
          </div>
          <div className="text-[11px] text-slate-400">
            90 days · Started May 27 · Uber, CRED, Meesho
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {streak > 0 && (
            <span className="text-xs font-semibold text-amber-600">
              🔥 {streak} streak
            </span>
          )}
          <div className="w-24">
            <ProgressBar pct={pct} label={`${done}/${total}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
