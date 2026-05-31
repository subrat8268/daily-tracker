import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Copy, Check, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useTrackerStore from '../../store/useTrackerStore';
import { START_DATE, TOTAL_DAYS } from '../../data/constants';

function parseBullets(text, isDoneField = true) {
  if (!text) return [];
  // Split by newlines first. If no newlines, split by commas or semicolons.
  let lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 1 && text.includes(',') && !text.includes('\n')) {
    lines = text.split(',').map(l => l.trim()).filter(Boolean);
  } else if (lines.length === 1 && text.includes(';') && !text.includes('\n')) {
    lines = text.split(';').map(l => l.trim()).filter(Boolean);
  }

  return lines.map(line => {
    let clean = line;
    let isWip = false;
    let isDone = isDoneField;

    if (line.startsWith('✓') || line.toLowerCase().startsWith('done:') || line.startsWith('[x]')) {
      isWip = false;
      isDone = true;
      clean = line.replace(/^(✓|done:|\[x\])\s*/i, '').trim();
    } else if (line.startsWith('→') || line.toLowerCase().startsWith('wip:') || line.startsWith('[wip]') || line.startsWith('[ ]')) {
      isWip = true;
      isDone = false;
      clean = line.replace(/^(→|wip:|\[wip\]|\[\s*\])\s*/i, '').trim();
    }

    return { text: clean, isWip, isDone };
  });
}

export function ShareCardModal({ log, isOpen, onClose }) {
  const cardRef = useRef(null);
  const streakData = useTrackerStore((s) => s.streakData);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !log) return null;

  // ── Calculate Date & Day Number ──────────────────────────────────
  const logDateParts = log.date.split('-');
  const logDate = new Date(logDateParts[0], logDateParts[1] - 1, logDateParts[2]);
  
  const formattedDate = logDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const diffTime = logDate.getTime() - START_DATE.getTime();
  const dayNum = Math.min(
    Math.max(Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1, 1),
    TOTAL_DAYS
  );

  // ── Calculate Streak up to logDate ───────────────────────────────
  let streak = 0;
  for (let i = 0; i < 90; i++) {
    const d = new Date(logDate);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    if (streakData[key] && streakData[key] > 0) {
      streak++;
    } else {
      break;
    }
  }

  // ── Parse Cell Contents ──────────────────────────────────────────
  const dsaItems = parseBullets(log.dsa_done || log.dsa, true);
  const jsItems = parseBullets(log.js_rev || log.js, true);
  const mcItems = parseBullets(log.mc_done || log.mc, true);
  const tomorrowItems = parseBullets(log.tomorrow_task || log.tomorrow, false);

  const hasKred = log.kred_hours != null || log.kred != null;
  const kredVal = log.kred_hours != null ? log.kred_hours : log.kred;
  const hasMc = mcItems.length > 0;

  // Determine KredBook cell title and items dynamically
  let kredTitle = 'KREDBOOK';
  let kredDisplayItems = [];
  let showKredStackFooter = false;

  if (hasKred && hasMc) {
    kredTitle = 'KREDBOOK & MACHINE';
    kredDisplayItems = [
      { text: `KredBook dev: ${kredVal}h`, isWip: true, isDone: false },
      ...mcItems
    ];
    showKredStackFooter = true;
  } else if (hasMc) {
    kredTitle = 'JS MACHINE CODING';
    kredDisplayItems = mcItems;
  } else if (hasKred) {
    kredTitle = 'KREDBOOK';
    kredDisplayItems = [
      { text: `Development work: ${kredVal}h`, isWip: true, isDone: false }
    ];
    showKredStackFooter = true;
  } else {
    kredTitle = 'KREDBOOK';
    kredDisplayItems = [
      { text: 'Entry screen WIP', isWip: true, isDone: false }
    ];
    showKredStackFooter = true;
  }

  // ── Generate All 90 Dots ─────────────────────────────────────────
  const dots = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(START_DATE);
    d.setDate(d.getDate() + i);
    return d;
  });

  // ── Export PNG Action ────────────────────────────────────────────
  const handleDownload = () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    // Wait a brief moment to ensure fonts are fully styled
    setTimeout(() => {
      toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3, // 3x for ultra-sharp high-res text on LinkedIn
        backgroundColor: '#070a13', // Soft matching backdrop behind the card
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `subrat_prep_day_${dayNum}.png`;
        link.href = dataUrl;
        link.click();
        setDownloading(false);
      })
      .catch((err) => {
        console.error('[Card Export] Error generating image:', err);
        setDownloading(false);
      });
    }, 200);
  };

  // ── Copy Post Text Action ────────────────────────────────────────
  const handleCopyText = () => {
    const dsaText = dsaItems.map(item => `${item.isWip ? '→' : '✓'} ${item.text}`).join('\n');
    const jsText = jsItems.map(item => `${item.isWip ? '→' : '✓'} ${item.text}`).join('\n');
    const kredText = kredDisplayItems.map(item => `${item.isWip ? '→' : '✓'} ${item.text}`).join('\n');
    const tomorrowText = tomorrowItems.map(item => `• ${item.text}`).join('\n');
    
    const postText = `🚀 Day ${dayNum} of 90 — Frontend Dev Prep!

🔥 Streak: ${streak} Days
📅 Date: ${formattedDate}

📚 DSA Today:
${dsaText || '—'}

💻 JS/React Concepts:
${jsText || '—'}

🛠️ KredBook & Machine Coding:
${kredText || '—'}

🎯 Tomorrow's Focus:
${tomorrowText || '—'}

#100DaysOfCode #FrontendDev #BuildingInPublic`;

    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
          style={{ background: 'rgba(3, 7, 18, 0.75)', backdropFilter: 'blur(8px)' }}
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[600px] overflow-y-auto max-h-[90vh] rounded-2xl flex flex-col items-center p-6 shadow-2xl border"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#EF9F27]" />
              <span className="font-bold text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
                LinkedIn Progress Card
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Export container (will be exported by html-to-image) */}
          <div className="w-full overflow-x-auto flex justify-center py-2 bg-[#070a13] rounded-xl border border-dashed border-gray-800">
            <div ref={cardRef} className="dt-root" style={{ width: '540px', flexShrink: 0 }}>
              <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500&display=swap');
                .dt-root { font-family: 'DM Sans', sans-serif; padding: 2rem 0; background: #070a13; }
                .dt-wrap { width: 540px; margin: 0 auto; background: #0B0F1A; border-radius: 16px; overflow: hidden; border: 0.5px solid #1e2535; }
                .dt-header { padding: 28px 32px 20px; display: flex; align-items: flex-start; justify-content: space-between; }
                .dt-day-big { font-family: 'Syne', sans-serif; font-size: 54px; font-weight: 800; color: #F8F6F0; line-height: 1; }
                .dt-day-big span { color: #5DCAA5; }
                .dt-sub { font-size: 12px; color: #5F5E5A; margin-top: 4px; letter-spacing: 0.04em; font-weight: 500; }
                .dt-right { text-align: right; }
                .dt-date { font-size: 12px; color: #5F5E5A; font-weight: 500; }
                .dt-streak { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #EF9F27; margin-top: 2px; }
                .dt-streak-label { font-size: 10px; color: #5F5E5A; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; }
                .dt-divider { height: 0.5px; background: #1e2535; margin: 0 32px; }
                .dt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 16px 32px; }
                .dt-cell { padding: 10px 0; min-height: 95px; display: flex; flex-col: column; justify-content: flex-start; }
                .dt-cell:nth-child(odd) { padding-right: 20px; border-right: 0.5px solid #1e2535; }
                .dt-cell:nth-child(even) { padding-left: 20px; }
                .dt-cell-label { font-size: 10px; color: #5F5E5A; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; font-weight: 700; }
                .dt-cell-content { font-size: 13px; color: #D3D1C7; line-height: 1.5; }
                .dt-cell-content .done { color: #5DCAA5; font-weight: bold; }
                .dt-cell-content .wip { color: #EF9F27; font-weight: bold; }
                .dt-footer { background: #060911; padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; border-top: 0.5px solid #1e2535; }
                .dt-dots { display: flex; gap: 5px; flex-wrap: wrap; max-width: 290px; }
                .dt-dot { width: 9px; height: 9px; border-radius: 2px; }
                .dot-done { background: #5DCAA5; }
                .dot-today { background: #EF9F27; }
                .dot-empty { background: #1e2535; }
                .dt-hashtags { font-size: 11px; color: #4B469F; line-height: 1.8; text-align: right; font-weight: 500; }
              `}</style>
              <div className="dt-wrap">
                <div className="dt-header">
                  <div className="dt-left">
                    <div className="dt-day-big">Day <span>{dayNum}</span></div>
                    <div className="dt-sub">of 90 — frontend dev prep</div>
                  </div>
                  <div className="dt-right">
                    <div className="dt-date">{formattedDate}</div>
                    <div className="dt-streak">{streak}🔥</div>
                    <div className="dt-streak-label">day streak</div>
                  </div>
                </div>
                <div className="dt-divider"></div>
                <div className="dt-grid">
                  {/* Cell 1: DSA */}
                  <div className="dt-cell flex flex-col">
                    <div className="dt-cell-label">DSA today</div>
                    <div className="dt-cell-content">
                      {dsaItems.length === 0 ? (
                        <span style={{ color: '#5F5E5A', fontStyle: 'italic' }}>No DSA logged today</span>
                      ) : (
                        dsaItems.map((item, idx) => (
                          <div key={idx}>
                            {item.isWip ? (
                              <span className="wip">→</span>
                            ) : (
                              <span className="done">✓</span>
                            )}{' '}
                            {item.text}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  {/* Cell 2: JS / React */}
                  <div className="dt-cell flex flex-col">
                    <div className="dt-cell-label">JS / React</div>
                    <div className="dt-cell-content">
                      {jsItems.length === 0 ? (
                        <span style={{ color: '#5F5E5A', fontStyle: 'italic' }}>No concepts logged today</span>
                      ) : (
                        jsItems.map((item, idx) => (
                          <div key={idx}>
                            {item.isWip ? (
                              <span className="wip">→</span>
                            ) : (
                              <span className="done">✓</span>
                            )}{' '}
                            {item.text}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  {/* Cell 3: KredBook & Machine */}
                  <div className="dt-cell flex flex-col" style={{ borderTop: '0.5px solid #1e2535' }}>
                    <div className="dt-cell-label">{kredTitle}</div>
                    <div className="dt-cell-content">
                      {kredDisplayItems.map((item, idx) => (
                        <div key={idx}>
                          {item.isWip ? (
                            <span className="wip">→</span>
                          ) : (
                            <span className="done">✓</span>
                          )}{' '}
                          {item.text}
                        </div>
                      ))}
                      {showKredStackFooter && (
                        <div style={{ color: '#5F5E5A', marginTop: 4, fontSize: '11px', fontWeight: 500 }}>
                          React Native + Supabase
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Cell 4: Tomorrow */}
                  <div className="dt-cell flex flex-col" style={{ borderTop: '0.5px solid #1e2535' }}>
                    <div className="dt-cell-label">Tomorrow's focus</div>
                    <div className="dt-cell-content">
                      {tomorrowItems.length === 0 ? (
                        <span style={{ color: '#5F5E5A', fontStyle: 'italic' }}>Rest & recharge</span>
                      ) : (
                        tomorrowItems.map((item, idx) => {
                          const isSpecial = item.text.toLowerCase().includes('machine coding') || 
                                            item.text.toLowerCase().includes('system design') ||
                                            item.text.includes(':') || 
                                            (tomorrowItems.length >= 3 && idx === tomorrowItems.length - 1);
                          return (
                            <div
                              key={idx}
                              style={{ color: isSpecial ? '#5F5E5A' : '#D3D1C7', fontWeight: isSpecial ? 500 : 'normal' }}
                            >
                              {item.text}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className="dt-divider"></div>
                <div className="dt-footer">
                  <div>
                    <div className="dt-dots">
                      {dots.map((d, idx) => {
                        const key = d.toDateString();
                        const isCardDate = key === logDate.toDateString();
                        const isDone = d <= logDate && streakData[key] > 0;
                        
                        let dotClass = 'dot-empty';
                        if (isCardDate) dotClass = 'dot-today';
                        else if (isDone) dotClass = 'dot-done';

                        return (
                          <div key={idx} className={`dt-dot ${dotClass}`} />
                        );
                      })}
                    </div>
                    <div style={{ fontSize: '10px', color: '#5F5E5A', marginTop: '6px', fontWeight: 500 }}>
                      {dayNum} of 90 days completed
                    </div>
                  </div>
                  <div className="dt-hashtags">
                    #100DaysOfCode<br />#FrontendDev<br />#BuildingInPublic
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={handleCopyText}
              disabled={copied}
              className="flex items-center justify-center gap-2 h-11 text-xs font-semibold rounded-xl border transition-all duration-150 active:scale-95 cursor-pointer"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
                background: 'transparent',
              }}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-[var(--success)]" />
                  <span className="text-[var(--success)]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Post Text</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-2 h-11 text-xs font-semibold rounded-xl transition-all duration-150 active:scale-95 cursor-pointer text-white"
              style={{
                background: 'var(--accent)',
              }}
            >
              <Download size={14} />
              <span>{downloading ? 'Generating PNG...' : 'Download PNG'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
