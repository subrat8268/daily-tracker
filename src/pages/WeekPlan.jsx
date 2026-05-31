import { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import useTrackerStore from "../store/useTrackerStore";
import { WEEKS, PHASES } from "../data/weekData";
import { CheckItem } from "../components/ui/CheckItem";
import { Badge } from "../components/ui/Badge";

const PHASE_COLORS = { 1: "amber", 2: "blue", 3: "green" };

function WeekCard({ w }) {
  const [open, setOpen] = useState(false);
  const weekDone = useTrackerStore((s) => s.weekDone);
  const toggleWeek = useTrackerStore((s) => s.toggleWeek);

  const phColor = PHASE_COLORS[w.ph];

  const handleToggle = useCallback(
    (section, idx) => {
      toggleWeek(`w${w.w}-${section}-${idx}`);
    },
    [toggleWeek, w.w],
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl mb-2 overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <Badge label={`W${w.w}`} color={phColor} />
        <span className="flex-1 text-[13px] font-semibold text-slate-800">
          {w.theme}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-slate-400" />
        ) : (
          <ChevronDown size={14} className="text-slate-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            {/* DSA col */}
            <div>
              <div className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-2">
                DSA
              </div>
              {w.dsa.map((item, i) => (
                <CheckItem
                  key={i}
                  id={i}
                  label={item}
                  checked={!!weekDone[`w${w.w}-dsa-${i}`]}
                  onToggle={() => handleToggle("dsa", i)}
                />
              ))}
            </div>
            {/* Concept col */}
            <div>
              <div
                className={`text-[11px] font-bold uppercase tracking-wider mb-2
                ${w.ph === 1 ? "text-amber-600" : w.ph === 2 ? "text-blue-600" : "text-red-600"}`}
              >
                {w.cLabel}
              </div>
              {w.concept.map((item, i) => (
                <CheckItem
                  key={i}
                  id={i}
                  label={item}
                  checked={!!weekDone[`w${w.w}-c-${i}`]}
                  onToggle={() => handleToggle("c", i)}
                />
              ))}
            </div>
          </div>

          {/* UI tasks */}
          <div className="mb-3">
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">
              UI / Machine coding tasks
            </div>
            {w.ui.map((item, i) => (
              <CheckItem
                key={i}
                id={i}
                label={item}
                checked={!!weekDone[`w${w.w}-ui-${i}`]}
                onToggle={() => handleToggle("ui", i)}
              />
            ))}
          </div>

          {/* Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
            <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-700 leading-relaxed">
              {w.tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WeekPlan() {
  let lastPh = 0;

  return (
    <div>
      <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
        Click any week to expand. Tap items to track. All progress saves
        locally.
      </p>
      {WEEKS.map((w) => {
        const phHeader =
          w.ph !== lastPh ? (
            <div
              key={`ph-${w.ph}`}
              className={`text-[11px] font-bold uppercase tracking-wider mb-2 mt-4 first:mt-0
            ${w.ph === 1 ? "text-amber-600" : w.ph === 2 ? "text-blue-600" : "text-green-600"}`}
            >
              {PHASES[w.ph - 1].name} · {PHASES[w.ph - 1].period} —{" "}
              {PHASES[w.ph - 1].tagline}
            </div>
          ) : null;
        lastPh = w.ph;
        return [phHeader, <WeekCard key={w.w} w={w} />];
      })}
    </div>
  );
}
