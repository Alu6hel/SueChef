import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { WorkstationId } from '../../types';
import { sound } from '../../services/soundEngine';
import { getCountryInfo } from '../../services/countries';
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  Gavel, 
  Clock, 
  Users, 
  ArrowRight, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';

export const CaseMetadataSummaryCard: React.FC = () => {
  const { 
    activeCase, 
    updateActiveCase, 
    activeWorkstation, 
    setActiveWorkstation, 
    totalDamages,
    country,
    t
  } = useSueChef();

  const countryInfo = getCountryInfo(country);
  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff');
  const defendant = activeCase.parties.find(p => p.role === 'defendant');

  // Inline Opponent Quick-Edit State
  const [isEditingOpponent, setIsEditingOpponent] = useState(false);
  const [opponentNameInput, setOpponentNameInput] = useState(
    defendant?.name.replace(/\s*\[Sample\s*—\s*Tap to Put Opponent Name\]/gi, '') || ''
  );

  const handleSaveOpponent = () => {
    sound.playClick();
    const cleanName = opponentNameInput.trim() || 'Opposing Party';
    updateActiveCase(prev => {
      const parties = prev.parties.map(p => 
        p.role === 'defendant' ? { ...p, name: cleanName, isPlaceholder: false } : p
      );
      // Also update case title if it contains old sample name
      const pName = parties.find(p => p.role === 'plaintiff')?.name || 'Plaintiff';
      const cleanPName = pName.replace(/\s*\[Sample.*?\]/gi, '').trim();
      const updatedTitle = `${cleanPName} v. ${cleanName}`;
      return {
        ...prev,
        title: updatedTitle,
        parties
      };
    });
    setIsEditingOpponent(false);
  };

  // Determine Litigation Stage & Next Action
  const provenCount = activeCase.claimEvaluation.elements.filter(e => e.isSatisfied).length;
  const totalElements = activeCase.claimEvaluation.elements.length;
  const evidenceCount = activeCase.evidenceList.length;
  const solCritical = activeCase.solDocket.find(s => s.urgencyLevel === 'critical' || s.daysRemaining <= 14);

  let stageBadge = t('activeDispute', 'Active Pro Se Dispute');
  let nextActionLabel = 'Complete Prima Facie Proof Checklist';
  let nextActionWorkstation: WorkstationId = 'claim-kitchen';

  if (provenCount < totalElements) {
    stageBadge = t('claimsAssembled', 'Assembling Claim Proof');
    nextActionLabel = `Prove Remaining Element (${provenCount}/${totalElements} done)`;
    nextActionWorkstation = 'claim-kitchen';
  } else if (evidenceCount === 0) {
    stageBadge = t('claimsAssembled', 'Claims Assembled — Attach Proof');
    nextActionLabel = 'Attach First Evidence Exhibit (Lease / Receipt)';
    nextActionWorkstation = 'evidence-locker';
  } else if (!activeCase.pleadings?.demandLetter?.demandDate) {
    stageBadge = t('preFilingDemand', 'Pre-Litigation Demand Stage');
    nextActionLabel = 'Draft & Send 14-Day Statutory Demand Letter';
    nextActionWorkstation = 'settlement-matrix';
  } else {
    stageBadge = t('inCourtLitigation', 'Ready for Court Filing');
    nextActionLabel = 'Generate 28-Line Verified Complaint / Petition';
    nextActionWorkstation = 'pleading-builder';
  }

  // Multi-step progress tracker definition
  const steps: { id: WorkstationId; number: number; label: string; isDone: boolean; isActive: boolean }[] = [
    { 
      id: 'claim-kitchen', 
      number: 1, 
      label: t('step1BuildCase', '1. Build Case'), 
      isDone: provenCount >= totalElements, 
      isActive: activeWorkstation === 'claim-kitchen' 
    },
    { 
      id: 'evidence-locker', 
      number: 2, 
      label: t('step2Evidence', '2. Evidence'), 
      isDone: evidenceCount >= 2, 
      isActive: activeWorkstation === 'evidence-locker' 
    },
    { 
      id: 'settlement-matrix', 
      number: 3, 
      label: t('step3Demand', '3. Demand'), 
      isDone: Boolean(activeCase.pleadings?.demandLetter?.demandDate), 
      isActive: activeWorkstation === 'settlement-matrix' 
    },
    { 
      id: 'pleading-builder', 
      number: 4, 
      label: t('step4CourtPapers', '4. Court Papers'), 
      isDone: Boolean(activeCase.pleadings?.paragraphs?.length > 4), 
      isActive: activeWorkstation === 'pleading-builder' 
    },
    { 
      id: 'second-opinion', 
      number: 5, 
      label: t('step5SettleEnforce', '5. Settle & Enforce'), 
      isDone: false, 
      isActive: activeWorkstation === 'second-opinion' || activeWorkstation === 'enforcement' 
    },
  ];

  const completedStepsCount = steps.filter(s => s.isDone).length;
  const progressPercent = Math.round((completedStepsCount / steps.length) * 100);

  return (
    <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] custom-geometry shadow-md p-4 sm:p-5 space-y-4">
      {/* Top Row: Case Metadata Snapshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)]/60 pb-4">
        {/* Left: Case Status & Opposing Party */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{stageBadge}</span>
            </span>

            <span className="text-[11px] font-mono text-[var(--accent-gold)] font-bold">
              {countryInfo.flag} {activeCase.state} Court • {countryInfo.currencySymbol}{totalDamages.toLocaleString()} Claim
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase">
              {t('opposingPartyCounsel', 'Opposing Party')}:
            </span>

            {isEditingOpponent ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={opponentNameInput}
                  onChange={e => setOpponentNameInput(e.target.value)}
                  placeholder="Enter Opponent or Landlord Name..."
                  className="px-2 py-1 text-xs bg-[var(--bg-secondary)] border border-[var(--accent-gold)] text-[var(--text-main)] rounded outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveOpponent}
                  className="p-1 bg-emerald-500 text-slate-950 rounded hover:opacity-90"
                  title="Save Name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingOpponent(false)}
                  className="p-1 bg-slate-800 text-slate-300 rounded hover:opacity-90"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsEditingOpponent(true);
                }}
                className="group flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer bg-[var(--bg-secondary)] px-2 py-0.5 rounded border border-[var(--border-color)] hover:border-[var(--accent-gold)]"
                title="Click to edit opponent name directly"
              >
                <span>{defendant?.name || 'Defendant LLC'}</span>
                <Edit3 className="w-3 h-3 text-[var(--accent-gold)] opacity-70 group-hover:opacity-100" />
                {defendant?.isPlaceholder && (
                  <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">
                    {t('btnTapToEdit', 'Tap to Edit')}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Center: Filing Deadline & SOL Alert */}
        <div className="bg-[var(--bg-secondary)] px-3 py-2 rounded border border-[var(--border-color)] text-xs font-mono space-y-0.5 shrink-0">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px] uppercase font-bold">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{t('filingDeadlineSol', 'Filing Deadlines & SOL')}</span>
          </div>
          <div className="text-[var(--text-main)] font-bold">
            {solCritical ? (
              <span className="text-amber-400">
                ⚠️ {solCritical.title.slice(0, 24)}: {solCritical.daysRemaining} {t('daysRemaining', 'days remaining')}
              </span>
            ) : (
              <span>SOL Active: Compliant within 4-Yr Window</span>
            )}
          </div>
        </div>

        {/* Right: Direct 1-Click Immediate Next Action Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveWorkstation(nextActionWorkstation);
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs card-geom hover:opacity-90 transition-all flex items-center justify-between sm:justify-start gap-2 shadow-md group"
          >
            <div className="text-left">
              <div className="text-[9px] font-mono uppercase tracking-wider text-slate-900 font-extrabold">
                {t('nextImmediateAction', 'Immediate Next Action')}:
              </div>
              <div className="text-xs font-extrabold">
                {nextActionLabel}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Visual Multi-Step Workflow Progress Tracker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold uppercase text-[var(--text-muted)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>{t('stepTracker', 'Litigation Step Tracker')}</span>
          </span>
          <span className="text-[var(--accent-gold)] font-bold">
            {progressPercent}% Complete ({completedStepsCount}/5 Steps)
          </span>
        </div>

        {/* Clickable 5-Step Progress Pills Bar */}
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2">
          {steps.map(step => (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveWorkstation(step.id);
              }}
              className={`p-2 rounded text-left transition-all border flex items-center gap-2 cursor-pointer ${
                step.isActive
                  ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] shadow-sm font-bold'
                  : step.isDone
                  ? 'bg-emerald-950/20 text-emerald-300 border-emerald-700/40 hover:border-emerald-500'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-main)]'
              }`}
              title={`Jump to Step ${step.number}: ${step.label}`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                step.isActive
                  ? 'bg-slate-950 text-[var(--accent-gold)]'
                  : step.isDone
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]'
              }`}>
                {step.isDone ? <Check className="w-3 h-3 stroke-[3]" /> : step.number}
              </div>

              <span className="text-xs truncate font-medium">
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
