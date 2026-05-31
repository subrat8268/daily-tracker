import { useState, useMemo, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import useTrackerStore from "../store/useTrackerStore";
import { NAMASTE_SECTIONS } from "../data/namasteData";
import { ProgressBar } from "../components/ui/ProgressBar";

const STATE_CLASSES = {
  none: "bg-slate-50 border-slate-200",
  wip: "bg-amber-50 border-amber-200",
  done: "bg-green-50 border-green-200",
};
const STATE_TEXT = {
  none: { label: "not started", color: "text-slate-400" },
  wip: { label: "watching…", color: "text-amber-600" },
  done: { label: "✓ done", color: "text-green-600" },
};
const DOT_CLASSES = {
  none: "bg-slate-300",
  wip: "bg-amber-400",
  done: "bg-green-500",
};
const TOPIC_TEXT = {
  none: "text-slate-700",
  wip: "text-amber-700",
  done: "text-green-700",
};

function Section({ sec, nsDone, onCycle }) {
  const [open, setOpen] = useState(false);

  const { doneCount, totalCount } = useMemo(() => {
    let doneCount = 0;
    sec.topics.forEach((topic) => {
      if ((nsDone[`ns_${sec.section}_${topic}`] || "none") === "done")
        doneCount++;
    });
    return { doneCount, totalCount: sec.topics.length };
  }, [sec, nsDone]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl mb-2 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="text-left">
          <span className="text-[13px] font-semibold text-slate-800">
            {sec.section}
          </span>
          <span className="text-[11px] text-slate-400 ml-2">
            {doneCount}/{totalCount} done
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-16">
            <ProgressBar
              pct={
                totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0
              }
            />
          </div>
          {open ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 pt-0 border-t border-slate-100">
          {sec.topics.map((topic) => {
            const key = `ns_${sec.section}_${topic}`;
            const state = nsDone[key] || "none";
            return (
              <button
                key={topic}
                onClick={() => onCycle(key)}
                className={`relative border rounded-xl p-2.5 text-left transition-all active:scale-95 ${STATE_CLASSES[state]}`}
              >
                <div
                  className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${DOT_CLASSES[state]}`}
                />
                <div
                  className={`text-[11px] font-medium pr-4 leading-tight ${TOPIC_TEXT[state]}`}
                >
                  {topic}
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${STATE_TEXT[state].color}`}
                >
                  {STATE_TEXT[state].label}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NamasteDev() {
  const nsDone = useTrackerStore((s) => s.nsDone);
  const cycleNS = useTrackerStore((s) => s.cycleNS);

  const { totalDone, totalTopics } = useMemo(() => {
    let totalDone = 0;
    let totalTopics = 0;
    NAMASTE_SECTIONS.forEach((sec) => {
      sec.topics.forEach((topic) => {
        totalTopics++;
        if ((nsDone[`ns_${sec.section}_${topic}`] || "none") === "done")
          totalDone++;
      });
    });
    return { totalDone, totalTopics };
  }, [nsDone]);

  const handleCycle = useCallback(
    (key) => {
      cycleNS(key);
    },
    [cycleNS],
  );

  const pct = totalTopics > 0 ? Math.round((totalDone / totalTopics) * 100) : 0;

  return (
    <div>
      <p className="text-[13px] text-slate-500 mb-3 leading-relaxed">
        Click once ={" "}
        <span className="text-amber-600 font-semibold">watching</span>, twice ={" "}
        <span className="text-green-600 font-semibold">done</span>, three times
        = reset. Sections collapsed — tap to open.
      </p>

      {/* Sticky progress */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 -mx-4 px-4 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Progress:</span>
          <ProgressBar
            pct={pct}
            label={`${totalDone}/${totalTopics} done — ${pct}%`}
            className="flex-1"
          />
        </div>
      </div>

      {NAMASTE_SECTIONS.map((sec) => (
        <Section
          key={sec.section}
          sec={sec}
          nsDone={nsDone}
          onCycle={handleCycle}
        />
      ))}
    </div>
  );
}
