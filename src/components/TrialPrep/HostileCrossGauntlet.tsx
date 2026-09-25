import React, { useState } from 'react';
import { ShieldAlert, Zap, Award, RotateCcw, ArrowRight, CheckCircle2, XCircle, AlertTriangle, Scale, Volume2 } from 'lucide-react';
import { HOSTILE_CROSS_SCENARIOS, HostileCrossScenario } from '../../services/mockHearingEngine';
import { sound } from '../../services/soundEngine';

export const HostileCrossGauntlet: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [composure, setComposure] = useState(100);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const scenario: HostileCrossScenario = HOSTILE_CROSS_SCENARIOS[currentIdx];

  const handleSelectOption = (opt: HostileCrossScenario['options'][0]) => {
    if (isAnswered) return;
    setSelectedOptionId(opt.id);
    setIsAnswered(true);

    const newComposure = Math.max(10, Math.min(100, composure + opt.composureDelta));
    setComposure(newComposure);

    if (opt.isCorrect) {
      sound.playSuccessChime();
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      sound.playWarningBell();
    }
  };

  const handleNext = () => {
    sound.playClick();
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCurrentIdx(prev => (prev + 1) % HOSTILE_CROSS_SCENARIOS.length);
  };

  const handleReset = () => {
    sound.playGavelStrike();
    setCurrentIdx(0);
    setComposure(100);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
  };

  const selectedOpt = scenario.options.find(o => o.id === selectedOptionId);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Composure Gauge */}
      <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 card-geom bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[var(--text-main)] flex items-center gap-2">
                <span>Hostile Cross-Examination Gauntlet</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 uppercase">
                  High-Pressure Drill
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Train against aggressive defense counsel traps: leading bait, compound ambushes, and character assassinations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">Witness Composure</div>
              <div className={`font-mono font-bold text-lg ${
                composure >= 70 ? 'text-emerald-400' : composure >= 40 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {composure}%
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white"
              title="Reset Gauntlet"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Composure Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/10">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                composure >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                composure >= 40 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                'bg-gradient-to-r from-rose-600 to-red-400 animate-pulse'
              }`}
              style={{ width: `${composure}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>Critical Stress (Reprimand)</span>
            <span>Steady Demeanor</span>
            <span>Unshakeable Poise</span>
          </div>
        </div>
      </div>

      {/* Opposing Counsel Persona & Drill Arena */}
      <div className="card-geom bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-secondary)] to-[var(--bg-card)] border-2 border-rose-500/40 p-6 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 card-geom bg-rose-500/20 text-rose-300 border border-rose-500/40">
                OPPOSING COUNSEL
              </span>
              <span className="font-bold text-sm text-[var(--text-main)]">
                {scenario.counselName}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
              {scenario.firmName} &bull; Cross-Exam #{currentIdx + 1} of {HOSTILE_CROSS_SCENARIOS.length}
            </div>
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)]">
            Score: <span className="font-bold text-[var(--accent-gold)]">{correctAnswersCount}/{currentIdx + (isAnswered ? 1 : 0)}</span>
          </div>
        </div>

        {/* The Situation */}
        <div className="text-xs text-[var(--text-muted)] font-mono italic">
          Context: {scenario.situation}
        </div>

        {/* The Question Box */}
        <div className="p-4 bg-slate-950 border border-rose-500/30 card-geom space-y-2">
          <div className="text-[10px] font-mono uppercase text-rose-400 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Cross-Examination Attack:</span>
          </div>
          <blockquote className="font-serif italic text-base text-slate-100 leading-relaxed">
            "{scenario.question}"
          </blockquote>
        </div>

        {/* Options to Respond or Object */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold">
            Choose Your Immediate In-Court Reaction:
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {scenario.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnClass = 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-slate-400 text-[var(--text-main)]';
              
              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                } else if (isSelected && !opt.isCorrect) {
                  btnClass = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  btnClass = 'opacity-40 border-[var(--border-color)] text-[var(--text-muted)]';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-3.5 card-geom border text-left text-xs transition-all flex items-start gap-3 ${btnClass}`}
                >
                  <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/10 shrink-0 mt-0.5">
                    {opt.label.startsWith('Objection') ? 'OBJECTION' : 'ANSWER'}
                  </span>
                  <span className="leading-relaxed">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Section */}
        {isAnswered && selectedOpt && (
          <div className={`p-4 card-geom border space-y-3 animate-fadeIn ${
            selectedOpt.isCorrect 
              ? 'bg-emerald-950/30 border-emerald-500/50' 
              : 'bg-rose-950/40 border-rose-500/50'
          }`}>
            <div className="flex items-center gap-2 font-mono font-bold text-xs">
              {selectedOpt.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">JUDICIAL RULING: SUSTAINED / EXCELLENT FACTUAL POISE</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400">TRAP SPRUNG: DEFENSE EXPLOITED YOUR REACTION</span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedOpt.feedback}
            </p>

            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 shrink-0" />
                <span><strong>Golden Rule:</strong> {scenario.goldenRule}</span>
              </div>

              <button
                onClick={handleNext}
                className="btn-geom px-4 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Next Cross Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
