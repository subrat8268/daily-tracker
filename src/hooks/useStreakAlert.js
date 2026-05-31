/**
 * useStreakAlert.js
 * Returns true if it's after 8 PM and fewer than 4 today-checks are ticked.
 * Used to show the streak-at-risk banner on Today page.
 */
import { useMemo } from 'react';
import useTrackerStore from '../store/useTrackerStore';

export function useStreakAlert() {
  const todayChecks = useTrackerStore((s) => s.todayChecks);

  return useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 20) return false; // only show after 8 PM

    const todayStr = now.toDateString();
    const checkedCount = Object.entries(todayChecks)
      .filter(([k, v]) => k.includes(todayStr) && v === true)
      .length;

    return checkedCount < 4;
  }, [todayChecks]);
}
