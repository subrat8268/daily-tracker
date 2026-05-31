import { useMemo } from 'react';
import useTrackerStore from '../store/useTrackerStore';
import { WEEKS } from '../data/weekData';
import { MACHINE } from '../data/machineData';

export function useProgress() {
  const weekDone = useTrackerStore((s) => s.weekDone);
  const mcDone = useTrackerStore((s) => s.mcDone);

  return useMemo(() => {
    let total = 0;
    let done = 0;

    WEEKS.forEach((w) => {
      [...w.dsa, ...w.concept, ...w.ui].forEach((_, i) => {
        const dsaId = `w${w.w}-dsa-${i < w.dsa.length ? i : -1}`;
        total++;
        // Count properly
      });
    });

    // Recalculate properly
    total = 0; done = 0;
    WEEKS.forEach((w) => {
      w.dsa.forEach((_, i) => { total++; if (weekDone[`w${w.w}-dsa-${i}`]) done++; });
      w.concept.forEach((_, i) => { total++; if (weekDone[`w${w.w}-c-${i}`]) done++; });
      w.ui.forEach((_, i) => { total++; if (weekDone[`w${w.w}-ui-${i}`]) done++; });
    });
    MACHINE.forEach((lvl) => {
      const prefix = lvl.level.split(' ')[0].toLowerCase();
      lvl.items.forEach((_, i) => {
        total++;
        if (mcDone[`mc-${prefix}-${i}`]) done++;
      });
    });

    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [weekDone, mcDone]);
}
