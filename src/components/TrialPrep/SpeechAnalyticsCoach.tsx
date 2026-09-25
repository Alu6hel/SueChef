import React, { useMemo } from 'react';
import { Mic, Award, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Volume2, Clock } from 'lucide-react';
import { MockHearingEngine, SpeechAnalyticsResult } from '../../services/mockHearingEngine';

interface SpeechAnalyticsCoachProps {
  speechText: string;
}

export const SpeechAnalyticsCoach: React.FC<SpeechAnalyticsCoachProps> = ({ speechText }) => {
  const analytics: SpeechAnalyticsResult = useMemo(() => {
    return MockHearingEngine.analyzeSpeech(speechText);
  }, [speechText]);

  if (!speechText.trim()) {
    return (
      <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 text-center text-xs font-mono text-[var(--text-muted)]">
        Speech Analytics &amp; Delivery Coach is listening. Type or dictate your courtroom argument above to receive cadence metrics and filler-word diagnostics.
      </div>
    );
  }

  return (
    <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-4 shadow-xl animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 card-geom bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[var(--text-main)]">
              Courtroom Delivery &amp; Cadence Coach
            </h4>
            <p className="text-[10px] text-[var(--text-muted)] font-mono">
              Real-time filler-word tracking, speaking velocity (WPM), and judicial composure analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-right">
            <div className="text-[9px] font-mono uppercase text-[var(--text-muted)]">Delivery Score</div>
            <div className={`font-mono font-bold text-base ${
              analytics.deliveryScore >= 80 ? 'text-emerald-400' : analytics.deliveryScore >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {analytics.deliveryScore}/100
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
          <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Spoken Duration</span>
          </div>
          <div className="font-bold text-sm text-[var(--text-main)]">
            ~{Math.round((analytics.totalWords / 130) * 60)} sec
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)]">
            {analytics.totalWords} total words
          </div>
        </div>

        <div className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
          <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Cadence (WPM)</span>
          </div>
          <div className={`font-bold text-sm font-mono ${
            analytics.pacingVerdict.startsWith('Optimal') ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {analytics.wpm} WPM
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)] truncate">
            {analytics.pacingVerdict}
          </div>
        </div>

        <div className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
          <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Filler Words</span>
          </div>
          <div className={`font-bold text-sm font-mono ${
            analytics.totalFillerCount === 0 ? 'text-emerald-400' : analytics.totalFillerCount <= 2 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {analytics.totalFillerCount} ({analytics.fillerPercentage}%)
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)]">
            {analytics.totalFillerCount === 0 ? 'None detected' : 'Syallable pauses'}
          </div>
        </div>

        <div className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
          <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Etiquette Status</span>
          </div>
          <div className="font-bold text-sm text-emerald-400 truncate">
            {analytics.respectfulAddress ? 'Respectful' : 'Needs "Your Honor"'}
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)]">
            {analytics.exhibitCited ? 'Exhibits Cited' : 'Missing Exhibit Ref'}
          </div>
        </div>
      </div>

      {/* Filler Words Breakdown Pill List */}
      {analytics.fillerWords.length > 0 && (
        <div className="p-3 bg-amber-950/20 border border-amber-500/30 card-geom space-y-1.5">
          <div className="text-[10px] font-mono uppercase text-amber-300 font-bold">
            Detected Filler Words (Vocal Pauses):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analytics.fillerWords.map((f, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-200 border border-amber-500/40">
                "{f.word}" &times; {f.count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Judicial Coach Points */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] font-mono uppercase font-bold text-[var(--accent-gold)] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span>Judicial Delivery Coaching Advice:</span>
        </div>
        <ul className="space-y-1 text-xs text-[var(--text-main)]">
          {analytics.coachingPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 bg-[var(--bg-secondary)] p-2 card-geom border border-[var(--border-color)]">
              <span className="text-[var(--accent-gold)] font-bold shrink-0">&bull;</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
