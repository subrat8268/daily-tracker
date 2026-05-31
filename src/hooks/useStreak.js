import { useMemo } from 'react';
import useTrackerStore from '../store/useTrackerStore';

export function useStreak() {
  const streakData = useTrackerStore((s) => s.streakData);

  return useMemo(() => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      if (streakData[key] && streakData[key] > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [streakData]);
}
