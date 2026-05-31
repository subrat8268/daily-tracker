import {
  Sunrise,
  Dumbbell,
  Coffee,
  Brain,
  Smartphone,
  Calculator,
  Mic,
  NotebookPen,
  UtensilsCrossed,
  Moon,
} from "lucide-react";
import { DAILY_BLOCKS } from "../data/routineData";
import { Card } from "../components/ui/Card";

const ICON_MAP = {
  Sunrise,
  Dumbbell,
  Coffee,
  Brain,
  Smartphone,
  Calculator,
  Mic,
  NotebookPen,
  UtensilsCrossed,
  Moon,
};

const COLOR_LINE = {
  amber: "bg-amber-400",
  green: "bg-green-500",
  blue: "bg-blue-500",
  slate: "bg-slate-200",
};
const COLOR_ICON = {
  amber: "text-amber-500",
  green: "text-green-600",
  blue: "text-blue-500",
  slate: "text-slate-400",
};

export default function Routine() {
  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="text-[13px] font-semibold text-amber-700 mb-1">
          ⏰ Your actual schedule (from your notebook)
        </div>
        <p className="text-[12px] text-amber-600 leading-relaxed">
          Based on what you wrote: wake before 6, workout at 8, deep work at 10,
          KredBook at 1 PM. I've mapped this exactly — don't start your deep
          work block before the morning blocks are done.
        </p>
      </div>

      {DAILY_BLOCKS.map((block, i) => {
        const Icon = ICON_MAP[block.icon] || Brain;
        return (
          <div key={i} className="flex gap-3 mb-3">
            {/* Time + line */}
            <div className="flex flex-col items-end w-[72px] shrink-0 pt-3">
              <div className="text-[11px] font-semibold font-mono text-slate-800 text-right">
                {block.time}
              </div>
              <div className="text-[10px] text-slate-400">{block.dur}</div>
              <div
                className={`w-0.5 flex-1 mt-1.5 rounded-full min-h-[28px] ${COLOR_LINE[block.color] || COLOR_LINE.slate}`}
              />
            </div>
            {/* Card */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 mb-0">
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  size={14}
                  className={COLOR_ICON[block.color] || COLOR_ICON.slate}
                />
                <span className="text-[13px] font-semibold text-slate-800">
                  {block.label}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                {block.desc}
              </p>
            </div>
          </div>
        );
      })}

      <Card accent accentColor="border-l-slate-300" className="mt-2">
        <div className="text-[13px] font-semibold text-slate-800 mb-2">
          📓 Night log rule (non-negotiable)
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          8:30 PM: open the Daily Log tab. Write what you solved, what was hard,
          and tomorrow's 6 AM first task. Log it here in the tracker. "Log to AI
          and know next step" from your notebook — do that here. This compounds
          faster than you think.
        </p>
      </Card>
    </div>
  );
}
