import React from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { getCountryInfo } from '../../services/countries';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Scale, 
  Send, 
  ShieldCheck, 
  Gavel, 
  Coins, 
  Sparkles,
  FileText
} from 'lucide-react';
import { CaseFile } from '../../types';

type StageId = NonNullable<CaseFile['pipelineStage']>;

interface StageConfig {
  id: StageId;
  label: string;
  stepNumber: number;
  icon: any;
  workstation: any;
  workstationLabel: string;
  description: string;
}

const PIPELINE_STAGES: StageConfig[] = [
  {
    id: 'intake',
    label: 'Claim Intake',
    stepNumber: 1,
    icon: Scale,
    workstation: 'claim-kitchen',
    workstationLabel: 'Claim Kitchen',
    description: 'Document facts, itemize losses & verify legal elements.'
  },
  {
    id: 'demand_sent',
    label: '14-Day Demand',
    stepNumber: 2,
    icon: FileText,
    workstation: 'pleadings',
    workstationLabel: 'Pleadings & Demand',
    description: 'Certified pre-lawsuit notice with statutory deadline.'
  },
  {
    id: 'filed',
    label: 'Court Filed',
    stepNumber: 3,
    icon: Clock,
    workstation: 'sol-watcher',
    workstationLabel: 'SOL & Dockets',
    description: 'Complaint submitted to clerk; docket number assigned.'
  },
  {
    id: 'served',
    label: 'Defendant Served',
    stepNumber: 4,
    icon: Send,
    workstation: 'service-tracker',
    workstationLabel: 'Process Tracker',
    description: 'Personal delivery executed; proof of service filed.'
  },
  {
    id: 'hearing_prep',
    label: 'Hearing Prep',
    stepNumber: 5,
    icon: Gavel,
    workstation: 'trial-prep',
    workstationLabel: 'Trial Prep',
    description: 'Practice objections, judge questioning & cross-exam.'
  },
  {
    id: 'judgment_enforcing',
    label: 'Enforcement',
    stepNumber: 6,
    icon: Coins,
    workstation: 'enforcement',
    workstationLabel: 'Enforcement Suite',
    description: 'Writs of execution, bank levies & wage garnishments.'
  },
  {
    id: 'resolved',
    label: 'Case Resolved',
    stepNumber: 7,
    icon: CheckCircle2,
    workstation: 'settlement',
    workstationLabel: 'Settlement Matrix',
    description: 'Full settlement executed or judgment collected.'
  }
];

export const PipelineKanban: React.FC = () => {
  const { activeCase, setPipelineStage, setActiveWorkstation, totalDamages, country } = useSueChef();
  const countryInfo = getCountryInfo(country);

  const currentStageId: StageId = activeCase.pipelineStage || 'intake';
  const currentStageIndex = PIPELINE_STAGES.findIndex(s => s.id === currentStageId);
  const currentStage = PIPELINE_STAGES[currentStageIndex] || PIPELINE_STAGES[0];

  const handleStageSelect = (stageId: StageId) => {
    sound.playDocketStamp();
    setPipelineStage(stageId);
  };

  const handleAdvance = () => {
    if (currentStageIndex < PIPELINE_STAGES.length - 1) {
      sound.playSuccessChime();
      const nextStage = PIPELINE_STAGES[currentStageIndex + 1];
      setPipelineStage(nextStage.id);
    }
  };

  const defendant = activeCase.parties.find(p => p.role === 'defendant');

  return (
    <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 sm:p-6 space-y-5 shadow-xl animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--accent-gold)] text-slate-950 uppercase">
              Litigation Pipeline
            </span>
            <h2 className="font-serif font-bold text-lg text-[var(--text-main)]">
              Dispute Lifecycle &amp; Kanban Tracker
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
            Track case progress from initial claim intake through post-judgment bank levies
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentStageIndex < PIPELINE_STAGES.length - 1 && (
            <button
              onClick={handleAdvance}
              className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all shadow-sm"
            >
              <span>Advance to Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 7-Stage Horizontal Pipeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {PIPELINE_STAGES.map((st, idx) => {
          const isCurrent = st.id === currentStageId;
          const isPassed = idx < currentStageIndex;
          const Icon = st.icon;

          return (
            <button
              key={st.id}
              onClick={() => handleStageSelect(st.id)}
              className={`p-3 card-geom border text-left transition-all relative ${
                isCurrent
                  ? 'border-[var(--accent-gold)] bg-amber-950/40 text-[var(--accent-gold)] shadow-lg scale-[1.02]'
                  : isPassed
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/30'
                  : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-slate-500 text-[var(--text-muted)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                  isCurrent ? 'bg-[var(--accent-gold)] text-slate-950' : isPassed ? 'bg-emerald-500 text-slate-950' : 'bg-black/40 text-slate-400'
                }`}>
                  {st.stepNumber}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[var(--accent-gold)]' : isPassed ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>

              <div className="font-bold text-xs mt-2 truncate">
                {st.label}
              </div>

              <div className="text-[9px] font-mono text-[var(--text-muted)] line-clamp-2 mt-1 leading-tight">
                {st.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Callout Card */}
      <div className="p-4 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-secondary)] border border-[var(--accent-gold)]/40 card-geom flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Currently Active Step: {currentStage.stepNumber} of 7 &bull; {currentStage.label}</span>
          </div>
          <div className="font-serif font-bold text-sm text-[var(--text-main)]">
            Matter: "{activeCase.title}" &bull; Claim: {countryInfo.currencySymbol}{totalDamages.toLocaleString()} vs {defendant?.name || 'Defendant'}
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {currentStage.description}
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveWorkstation(currentStage.workstation);
          }}
          className="btn-geom px-4 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0 shadow-md"
        >
          <span>Open {currentStage.workstationLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
