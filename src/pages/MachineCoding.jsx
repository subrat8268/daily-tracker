import { useCallback } from 'react';
import { CheckSquare, Square, AlertTriangle } from 'lucide-react';
import useTrackerStore from '../store/useTrackerStore';
import { MACHINE } from '../data/machineData';
import { SkillTag } from '../components/ui/Badge';

const LEVEL_STYLES = {
  green: { text: 'text-green-600', border: 'border-green-200', icon: 'text-green-500' },
  amber: { text: 'text-amber-600', border: 'border-amber-200', icon: 'text-amber-500' },
  red:   { text: 'text-red-600',   border: 'border-red-200',   icon: 'text-red-500' },
};

export default function MachineCoding() {
  const mcDone = useTrackerStore((s) => s.mcDone);
  const toggleMC = useTrackerStore((s) => s.toggleMC);

  const handleToggle = useCallback((id) => {
    toggleMC(id);
  }, [toggleMC]);

  return (
    <div>
      <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
        Easy → hard. Your two failed interview tasks are marked ⚠️. Rebuild those first, at least 3 times each.
      </p>

      {MACHINE.map((lvl) => {
        const styles = LEVEL_STYLES[lvl.color] || LEVEL_STYLES.amber;
        return (
          <div key={lvl.level} className="mb-6">
            <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${styles.text}`}>
              {lvl.level}
            </div>
            {lvl.items.map((item, i) => {
              const prefix = lvl.level.split(' ')[0].toLowerCase();
              const id = `mc-${prefix}-${i}`;
              const done = !!mcDone[id];
              const isWarning = item.t.startsWith('⚠️');

              return (
                <button
                  key={i}
                  onClick={() => handleToggle(id)}
                  className={`w-full flex gap-3 items-start p-3.5 rounded-xl border mb-2 text-left transition-all active:scale-95
                    ${done ? 'opacity-45 bg-slate-50 border-slate-200' : `bg-white ${isWarning ? 'border-amber-200 bg-amber-50' : 'border-slate-200'} hover:bg-slate-50`}
                  `}
                >
                  {done
                    ? <CheckSquare size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    : <Square size={18} className="text-slate-300 flex-shrink-0 mt-0.5" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13px] font-medium leading-snug mb-1.5 ${done ? 'line-through' : 'text-slate-800'}`}>
                      {item.t}
                    </div>
                    <div className="flex flex-wrap">
                      {item.s.map((tag) => <SkillTag key={tag} label={tag} />)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
