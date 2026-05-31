import { AlertTriangle } from 'lucide-react';
import { useStreakAlert } from '../../hooks/useStreakAlert';

export function StreakAlertBanner() {
  const atRisk = useStreakAlert();
  if (!atRisk) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3 flex items-start gap-2">
      <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
      <div>
        <div className="text-[13px] font-semibold text-red-700">Streak at risk ⚠️</div>
        <div className="text-[12px] text-red-500 mt-0.5">
          It’s after 8 PM and you’ve ticked fewer than 4 items today. Fill the daily log before midnight.
        </div>
      </div>
    </div>
  );
}
