import React, { useState, useEffect } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { WorkstationId } from '../../types';
import { sound } from '../../services/soundEngine';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Scale, 
  ShieldCheck, 
  Gavel, 
  Calculator, 
  FolderSearch,
  FileText,
  Lock,
  Flame,
  MessageSquare,
  HelpCircle,
  Play
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetWorkstation: WorkstationId;
  icon: React.ReactNode;
  highlights: string[];
  actionPrompt: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SueChef Pro',
    subtitle: 'High-Rigor Pro Se Civil Litigation Suite',
    description: 'SueChef equips self-represented civil litigants with the computational firepower, discovery weapons, and evidentiary rigor used by high-billing commercial litigation law firms.',
    targetWorkstation: 'claim-kitchen',
    icon: <Scale className="w-6 h-6 text-amber-400" />,
    highlights: [
      'Zero third-party cloud dependence — 100% offline client encrypted',
      'Automated statutory cause of action deconstruction',
      'Federal Rule 902 cryptographic evidence hashing & redaction'
    ],
    actionPrompt: 'Explore Claim Kitchen Elements'
  },
  {
    id: 'claim-kitchen',
    title: 'Workstation 1: Claim Kitchen',
    subtitle: 'Deconstruct Causes of Action & Prove Every Statutory Element',
    description: 'Break your civil dispute into black-letter legal elements. Ensure every element of liability and every dollar of damages is mathematically proven before filing.',
    targetWorkstation: 'claim-kitchen',
    icon: <Scale className="w-6 h-6 text-amber-400" />,
    highlights: [
      '50-State Small Claims jurisdictional damage caps',
      'Statutory element satisfaction checklist with merit score rating',
      'Itemized special and general damages ledger'
    ],
    actionPrompt: 'Inspect Statutory Checklist'
  },
  {
    id: 'pleading-drafter',
    title: 'Workstation 2: 28-Line Pleading Drafter',
    subtitle: 'Authentic Judicial Council 28-Line Court Pleading Paper',
    description: 'Draft formal complaints, answers, and motions with numbered double-line margins, automatic verified paragraph numbering, and prayer for relief formatting.',
    targetWorkstation: 'pleading-builder',
    icon: <FileText className="w-6 h-6 text-amber-400" />,
    highlights: [
      'Court-compliant 28-line numbered judicial pleading paper',
      'Interactive paragraph reordering & cause of action linking',
      'Instant print-ready PDF export with formal caption formatting'
    ],
    actionPrompt: 'View 28-Line Pleading Paper'
  },
  {
    id: 'discovery-studio',
    title: 'Workstation 3: Discovery Studio & 30-Day Default Trap',
    subtitle: 'Interrogatories, RFPs, Subpoenas & Requests for Admission',
    description: 'Draft written discovery requests under oath. Weaponize Requests for Admission (RFAs)—if the defendant fails to answer within 30 days, every fact is deemed legally admitted!',
    targetWorkstation: 'discovery-studio',
    icon: <FolderSearch className="w-6 h-6 text-amber-400" />,
    highlights: [
      'Interrogatories, Requests for Production & Subpoena templates',
      '30-Day RFA Default Clock countdown timer',
      'Objection rebuttal cheat sheet for non-responsive opposing parties'
    ],
    actionPrompt: 'Examine Discovery Requests'
  },
  {
    id: 'trial-prep',
    title: 'Workstation 4: Trial Prep & Objection Simulator',
    subtitle: 'Evidentiary Objection Quiz & Argument Teleprompter',
    description: 'Train on real courtroom scenarios to master hearsay exceptions and leading objections under fire. Rehearse opening statements using the adjustable WPM live teleprompter.',
    targetWorkstation: 'trial-prep',
    icon: <Gavel className="w-6 h-6 text-amber-400" />,
    highlights: [
      'Interactive Evidence Objection Quiz with real-time rulings',
      'Direct & Cross-examination witness question trees',
      'Speed-controlled Argument Teleprompter for hearing rehearsal'
    ],
    actionPrompt: 'Test Objection Simulator'
  },
  {
    id: 'settlement-matrix',
    title: 'Workstation 5: Settlement Negotiation Matrix',
    subtitle: 'Expected Value (EV) Modeling & Rule 408 Letter Drafter',
    description: 'Calculate your risk-adjusted trial outcome and generate 3-tier settlement brackets (Anchor, Fair Compromise, Walk-Away Floor) with Federal Rule of Evidence 408 confidentiality protection.',
    targetWorkstation: 'settlement-matrix',
    icon: <Calculator className="w-6 h-6 text-amber-400" />,
    highlights: [
      'Win-probability Monte Carlo expected value calculation',
      'Litigation cost-offset & wage-loss deduction analyzer',
      'Formal Rule 408 Confidential Settlement Offer generator'
    ],
    actionPrompt: 'Calculate Settlement EV'
  },
  {
    id: 'evidence-locker',
    title: 'Workstation 6: Evidence Locker & PII Redactor',
    subtitle: 'SHA-256 Fingerprinting & Canvas Redactor',
    description: 'Hash critical receipts and contracts with in-browser SHA-256 for FRE 902 self-authentication. Reconstruct messy SMS threads and redact sensitive SSN/Bank numbers.',
    targetWorkstation: 'evidence-locker',
    icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
    highlights: [
      'Client-side SHA-256 cryptographic chain of custody certification',
      'Visual Canvas Redactor with black box & blur modes',
      'Chat & SMS iMessage-style timeline reconstructor'
    ],
    actionPrompt: 'Inspect Evidence Vault'
  },
  {
    id: 'security-vault',
    title: 'Workstation 7: Zero-Knowledge Security Vault',
    subtitle: 'AES-256 GCM Client Encryption & Panic Shredder',
    description: 'Your case data never touches third-party servers. All files are encrypted locally in IndexedDB with instant one-click panic wipe capability.',
    targetWorkstation: 'security-vault',
    icon: <Lock className="w-6 h-6 text-amber-400" />,
    highlights: [
      'Zero cloud leaks — 100% in-browser WebCrypto & IndexedDB',
      'One-click Cryptographic Panic Wipe with random noise overwrite',
      'Encrypted JSON case backup & instant restore'
    ],
    actionPrompt: 'Review Security Controls'
  }
];

export const WalkthroughTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen, setActiveWorkstation, theme } = useSueChef();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Sync active workstation whenever step changes
  useEffect(() => {
    if (isTourOpen) {
      setActiveWorkstation(TOUR_STEPS[currentStepIdx].targetWorkstation);
    }
  }, [currentStepIdx, isTourOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isTourOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, currentStepIdx]);

  if (!isTourOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIdx];
  const isLast = currentStepIdx === TOUR_STEPS.length - 1;

  const handleNext = () => {
    sound.playClick();
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
    } else {
      sound.playSuccessChime();
      setIsTourOpen(false);
      setCurrentStepIdx(0);
    }
  };

  const handleBack = () => {
    sound.playClick();
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    sound.playClick();
    setIsTourOpen(false);
    setCurrentStepIdx(0);
  };

  const handleTryFeature = () => {
    sound.playGavelStrike();
    setActiveWorkstation(currentStep.targetWorkstation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* High-Contrast Spotlight Card with Glowing Gold Frame */}
      <div className="bg-[#101420] text-slate-100 border-2 border-amber-400/90 ring-4 ring-amber-500/30 rounded-xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-[0_0_60px_rgba(212,175,55,0.4)] relative">
        {/* Top Header / Close */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400/15 border border-amber-400/50 rounded text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              SueChef Pro Tour • Step {currentStepIdx + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="Close Tour (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar Indicator */}
        <div className="flex gap-1.5 w-full">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => {
                sound.playClick();
                setCurrentStepIdx(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIdx 
                  ? 'bg-amber-400 w-12 shadow-[0_0_8px_rgba(212,175,55,0.8)]' 
                  : idx < currentStepIdx
                  ? 'bg-amber-600/70 w-4'
                  : 'bg-slate-700 w-3'
              }`}
              title={`Jump to ${step.title}`}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-400/15 border border-amber-400/40 rounded-lg shrink-0 shadow-inner">
              {currentStep.icon}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-serif text-white leading-tight">
                {currentStep.title}
              </h2>
              <div className="text-xs font-semibold text-amber-300 font-mono">
                {currentStep.subtitle}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            {currentStep.description}
          </p>

          {/* Key Feature Highlights */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-mono uppercase text-amber-400/90 font-bold tracking-wider">
              Core Capabilities in this Workstation:
            </div>
            <ul className="space-y-1">
              {currentStep.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleSkip}
            className="text-xs text-slate-400 hover:text-slate-200 font-mono"
          >
            Skip Tour (Esc)
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {currentStepIdx > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-bold rounded hover:from-amber-400 hover:to-amber-300 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              <span>{isLast ? 'Complete & Start Preparing' : 'Next Workstation'}</span>
              {isLast ? (
                <Check className="w-4 h-4 text-slate-950 font-bold" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
