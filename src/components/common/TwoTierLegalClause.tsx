import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, ShieldAlert, Sparkles, Scale, BookOpen, AlertCircle } from 'lucide-react';
import { sound } from '../../services/soundEngine';
import { useSueChef } from '../../context/SueChefContext';

export interface CalloutBadge {
  type: 'liability' | 'penalty' | 'deadline' | 'recovery' | 'info';
  label: string;
  detail: string;
}

export interface TwoTierLegalClauseProps {
  id?: string;
  title: string;
  statutoryCitation?: string;
  summary: string; // Plain-language summary (1-2 sentences)
  keyRights?: string[]; // 3 bullet points of rights/obligations
  callouts?: CalloutBadge[]; // Colored callout boxes
  rawLegalText?: string; // Full raw statute or clause
  nestedClauses?: {
    section: string;
    subsections: string[];
  }[];
  defaultExpanded?: boolean;
  onActionClick?: () => void;
  actionButtonLabel?: string;
  className?: string;
}

export const TwoTierLegalClause: React.FC<TwoTierLegalClauseProps> = ({
  id,
  title,
  statutoryCitation,
  summary,
  keyRights,
  callouts,
  rawLegalText,
  nestedClauses,
  defaultExpanded = false,
  onActionClick,
  actionButtonLabel,
  className = ''
}) => {
  const { t } = useSueChef();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleToggle = () => {
    sound.playClick();
    setIsExpanded(prev => !prev);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const textToCopy = rawLegalText || statutoryCitation || summary;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`card-geom bg-[var(--bg-card)] border-2 border-[var(--border-color)] overflow-hidden transition-all shadow-sm hover:border-[var(--accent-gold)]/60 ${className}`}>
      {/* TIER 1: Plain-Language Summary Header */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Top Title & Citation Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)]/60 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 flex items-center justify-center text-xs shrink-0">
              <Scale className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[var(--text-main)] truncate">
              {title}
            </h4>
          </div>

          {statutoryCitation && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)]">
                {statutoryCitation}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors rounded"
                title="Copy Statutory Citation"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}
        </div>

        {/* Tier 1 Plain Language Content: 'What this means for you' */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-[var(--accent-gold)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('whatThisMeansForYou', 'What this means for you')}</span>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed font-sans">
            {summary}
          </p>

          {/* 3-Bullet Summary of Rights / Requirements if provided */}
          {keyRights && keyRights.length > 0 && (
            <ul className="pt-1 space-y-1.5 text-xs text-[var(--text-main)]">
              {keyRights.map((right, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{right}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Skimmable Callout Boxes: Liabilities, Deadlines & Penalties */}
        {callouts && callouts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {callouts.map((callout, idx) => {
              const isLiability = callout.type === 'liability' || callout.type === 'penalty';
              const isRecovery = callout.type === 'recovery';
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded border custom-geometry text-xs space-y-1 transition-all ${
                    isLiability
                      ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                      : isRecovery
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-mono font-bold text-[10px] uppercase tracking-wider">
                    <ShieldAlert className={`w-3.5 h-3.5 ${isLiability ? 'text-rose-400' : isRecovery ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <span>{callout.label}</span>
                  </div>
                  <p className="font-semibold leading-tight text-xs">
                    {callout.detail}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button if provided */}
        {actionButtonLabel && onActionClick && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onActionClick}
              className="px-3 py-1.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs card-geom hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>{actionButtonLabel}</span>
            </button>
          </div>
        )}
      </div>

      {/* TIER 2: Collapsible Accordion Trigger */}
      <div
        onClick={handleToggle}
        className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[var(--bg-hover)] transition-colors select-none"
      >
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--accent-gold)]">
          <BookOpen className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span>{isExpanded ? t('hideLegalTerms', 'Hide Legal Terms') : t('readFullClause', 'Read Full Clause')}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>

        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          {t('officialLegalTerms', 'Official Legal Terms & Citations')}
        </span>
      </div>

      {/* TIER 2 Collapsible Content Drawer */}
      {isExpanded && (
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] p-4 sm:p-5 text-xs text-[var(--text-main)] space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {rawLegalText && (
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded font-serif italic text-xs leading-relaxed text-[var(--text-main)]">
              "{rawLegalText}"
            </div>
          )}

          {nestedClauses && nestedClauses.length > 0 && (
            <div className="space-y-2 font-mono text-[11px]">
              {nestedClauses.map((clause, sIdx) => (
                <div key={sIdx} className="space-y-1 pl-1 border-l-2 border-[var(--accent-gold)]/40">
                  <div className="font-bold text-[var(--accent-gold)]">
                    {clause.section}
                  </div>
                  <div className="pl-3 space-y-1 text-[var(--text-muted)]">
                    {clause.subsections.map((sub, subIdx) => (
                      <div key={subIdx} className="flex items-start gap-1.5">
                        <span className="text-[var(--text-muted)]">•</span>
                        <span className="text-[var(--text-main)] leading-relaxed">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 text-[10px] font-mono bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-gold)] rounded flex items-center gap-1 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? t('citationCopied', 'Citation Copied!') : t('copyCitation', 'Copy Citation')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
