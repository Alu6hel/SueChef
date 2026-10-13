import React, { useState, useEffect, useMemo } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { WorkstationId } from '../../types';
import { sound } from '../../services/soundEngine';
import { AluLogo } from '../Branding/AluLogo';
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
  FileText,
  Building,
  Lightbulb,
  Home,
  Navigation,
  FolderGit2,
  Hourglass,
  Send,
  Volume2,
  Briefcase,
  Lock
} from 'lucide-react';

interface TourStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  description: string;
  targetWorkstation: WorkstationId;
  tabLabel: string;
  icon: React.ReactNode;
  actionTip: string;
}

export const WalkthroughTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen, activeWorkstation, setActiveWorkstation, t, format } = useSueChef();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const tourSteps: TourStep[] = useMemo(() => [
    {
      id: 'home',
      stepNumber: 1,
      totalSteps: 14,
      title: t('tourStep1Title', 'Executive Dashboard & Dispute Intake'),
      subtitle: t('tourStep1Subtitle', 'Your Central Legal Command Center'),
      description: t('tourStep1Desc', 'Track your dispute metrics, estimated damages, merit strength percentage, and calculated attorney fee savings all in one clean place.'),
      targetWorkstation: 'home',
      tabLabel: t('navHome', '🏠 Home'),
      icon: <Home className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep1Tip', 'Answer 4 intake questions to calculate statutory damages and generate your dispute file.')
    },
    {
      id: 'claim-kitchen',
      stepNumber: 2,
      totalSteps: 14,
      title: t('tourStep2Title', '1. Build Case & Legal Elements'),
      subtitle: t('tourStep2Subtitle', 'Damage Calculator & Statutory Multipliers'),
      description: t('tourStep2Desc', 'Itemize direct, consequential, and bad-faith statutory penalty damages (1x/2x/3x) and verify small claims court eligibility.'),
      targetWorkstation: 'claim-kitchen',
      tabLabel: t('navBuildCase', '1. Build Case'),
      icon: <Scale className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep2Tip', 'Check off prima facie legal elements to ensure your claim meets statutory requirements.')
    },
    {
      id: 'evidence-locker',
      stepNumber: 3,
      totalSteps: 14,
      title: t('tourStep3Title', '2. Evidence Locker & Cryptographic Vault'),
      subtitle: t('tourStep3Subtitle', 'Tamper-Proof SHA-256 Digest Verification'),
      description: t('tourStep3Desc', 'Secure leases, bank wires, inspection photos, and reconstructed SMS threads with Federal Rule of Evidence 902 digital digests and privacy redactions.'),
      targetWorkstation: 'evidence-locker',
      tabLabel: t('navEvidence', '2. Evidence & Proof'),
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep3Tip', 'Drop files to compute live SHA-256 hash digests and generate court-ready Exhibit stickers.')
    },
    {
      id: 'pleading-builder',
      stepNumber: 4,
      totalSteps: 14,
      title: t('tourStep4Title', '3. Official 28-Line Court Pleadings'),
      subtitle: t('tourStep4Subtitle', 'California Rule 2.105 & Formal Demand Letters'),
      description: t('tourStep4Desc', 'Generate numbered 28-line civil complaints, 10-day pre-litigation demand letters with statutory interest, and sworn verification affidavits.'),
      targetWorkstation: 'pleading-builder',
      tabLabel: t('navCourtPapers', '3. Court Papers'),
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep4Tip', 'Click "Print / Save PDF" to produce court-ready filing documents.')
    },
    {
      id: 'settlement-matrix',
      stepNumber: 5,
      totalSteps: 14,
      title: t('tourStep5Title', '4. Demand & Settlement Matrix'),
      subtitle: t('tourStep5Subtitle', 'Risk Math & Rule 408 Negotiation'),
      description: t('tourStep5Desc', 'Model your trial expected return (EV) after filing fees and time loss. Generate 3-tier settlement brackets and log incoming offers.'),
      targetWorkstation: 'settlement-matrix',
      tabLabel: t('navDemandSettle', '4. Demand & Settle'),
      icon: <Calculator className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep5Tip', 'Log settlement offers to evaluate whether to settle or proceed to trial.')
    },
    {
      id: 'second-opinion',
      stepNumber: 6,
      totalSteps: 14,
      title: t('tourStep6Title', '5. AI Legal Second Opinion'),
      subtitle: t('tourStep6Subtitle', 'Objective Merit Grade & Defense Rebuttals'),
      description: t('tourStep6Desc', 'Get an objective case audit (Grade A-F, Win Probability %), predicted defense arguments from opposing parties, and statutory counter-citations.'),
      targetWorkstation: 'second-opinion',
      tabLabel: t('navCaseStrategy', '5. Second Opinion'),
      icon: <Lightbulb className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep6Tip', 'Tick off vulnerability items to boost your calculated trial win probability score.')
    },
    {
      id: 'legal-services',
      stepNumber: 7,
      totalSteps: 14,
      title: t('tourStep7Title', '6. Verified Legal Aid & Court Portals'),
      subtitle: t('tourStep7Subtitle', 'Connect to Free Real-Life Legal Help'),
      description: t('tourStep7Desc', 'Direct phone numbers and intake portals for 131+ pro bono legal aid societies, court fee waiver screeners, and small claims advisors.'),
      targetWorkstation: 'legal-services',
      tabLabel: t('navLegalAid', '6. Legal Aid & Courts'),
      icon: <Building className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep7Tip', 'Check your eligibility for In Forma Pauperis (100% court fee waiver).')
    },
    {
      id: 'discovery-studio',
      stepNumber: 8,
      totalSteps: 14,
      title: t('tourStep8Title', '7. Formal Discovery Studio'),
      subtitle: t('tourStep8Subtitle', 'Interrogatories, RFPs, Admissions & Subpoenas'),
      description: t('tourStep8Desc', 'Draft court-captioned discovery requests with automatic 30-day response warning traps and third-party subpoena commands.'),
      targetWorkstation: 'discovery-studio',
      tabLabel: t('navRequestEvidence', '7. Discovery Studio'),
      icon: <FolderGit2 className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep8Tip', 'Auto-populate standard ROGs, RFPs, and RFAs tailored to your dispute category.')
    },
    {
      id: 'trial-prep',
      stepNumber: 9,
      totalSteps: 14,
      title: t('tourStep9Title', '8. Courtroom Trial & Hearing Prep'),
      subtitle: t('tourStep9Subtitle', 'Objection Simulator & Witness Outlines'),
      description: t('tourStep9Desc', 'Practice 8 realistic courtroom objection drills with immediate FRE feedback, organize witness outlines, and use the auto-scrolling teleprompter.'),
      targetWorkstation: 'trial-prep',
      tabLabel: t('navTrialPrep', '8. Trial & Hearing'),
      icon: <Gavel className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep9Tip', 'Set your reading WPM speed to rehearse your opening statement smoothly.')
    },
    {
      id: 'sol-watcher',
      stepNumber: 10,
      totalSteps: 14,
      title: t('tourStep10Title', '9. Statute of Limitations Docket'),
      subtitle: t('tourStep10Subtitle', 'Deadline Watcher & Tolling Calculator'),
      description: t('tourStep10Desc', 'Track statutory filing deadlines, apply +90-day tolling events (military/COVID/minor), and export court dates to .iCal calendar.'),
      targetWorkstation: 'sol-watcher',
      tabLabel: t('navSolDocket', '9. Deadlines & SOL'),
      icon: <Hourglass className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep10Tip', 'Add custom court deadlines to prevent forfeiture of legal claims.')
    },
    {
      id: 'service-tracker',
      stepNumber: 11,
      totalSteps: 14,
      title: t('tourStep11Title', '10. Process & Service Tracker'),
      subtitle: t('tourStep11Subtitle', 'Affidavits of Service & Registered Agents'),
      description: t('tourStep11Desc', 'Lookup California/Delaware corporate registered agents, verify USPS certified mail delivery signatures, and generate proofs of service.'),
      targetWorkstation: 'service-tracker',
      tabLabel: t('navServiceProof', '10. Service Tracker'),
      icon: <Send className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep11Tip', 'Generate signed returns of service to prove personal jurisdiction to the judge.')
    },
    {
      id: 'legalese-decoder',
      stepNumber: 12,
      totalSteps: 14,
      title: t('tourStep12Title', '11. Legalese Decoder & Clause Analyzer'),
      subtitle: t('tourStep12Subtitle', 'Web Speech Pronunciation & Contract Traps'),
      description: t('tourStep12Desc', 'Search 50+ legal terms and Latin maxims with audio pronunciation, and paste fine print clauses to detect unconscionable arbitration traps.'),
      targetWorkstation: 'legalese-decoder',
      tabLabel: t('navLegalDecoder', '11. Decoder & Audio'),
      icon: <Volume2 className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep12Tip', 'Click the speaker button to hear authentic pronunciations of legal terms.')
    },
    {
      id: 'attorney-dossier',
      stepNumber: 13,
      totalSteps: 14,
      title: t('tourStep13Title', '12. Attorney Dossier & Binder'),
      subtitle: t('tourStep13Subtitle', 'Opposing Counsel Profiler & Billable Savings'),
      description: t('tourStep13Desc', 'Profile opposing attorneys, calculate billable hours saved ($150-$650/hr), and print a 5-section executive litigation binder.'),
      targetWorkstation: 'attorney-dossier',
      tabLabel: t('navAttorneyBinder', '12. Attorney Binder'),
      icon: <Briefcase className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep13Tip', 'Adjust your hourly billing slider to see your exact quantified legal savings.')
    },
    {
      id: 'security-vault',
      stepNumber: 14,
      totalSteps: 14,
      title: t('tourStep14Title', '13. Security Vault & Panic Shredder'),
      subtitle: t('tourStep14Subtitle', 'Cryptographic Self-Audit & Zero Remote Logs'),
      description: t('tourStep14Desc', 'Audit cryptographic integrity, export encrypted `.suechef` case backups, and use the type-to-confirm Panic Shredder for irreversible local purges.'),
      targetWorkstation: 'security-vault',
      tabLabel: t('navSecurityVault', '13. Security Vault'),
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      actionTip: t('tourStep14Tip', '100% client-side privacy: zero remote telemetry or external tracking.')
    }
  ], [t]);

  // Sync active workstation immediately whenever step changes
  useEffect(() => {
    if (isTourOpen && tourSteps[currentStepIdx]) {
      const target = tourSteps[currentStepIdx].targetWorkstation;
      if (activeWorkstation !== target) {
        setActiveWorkstation(target);
      }
    }
  }, [currentStepIdx, isTourOpen, tourSteps]);

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
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, currentStepIdx, tourSteps]);

  if (!isTourOpen) return null;

  const currentStep = tourSteps[currentStepIdx] || tourSteps[0];
  const isLast = currentStepIdx === tourSteps.length - 1;

  const handleNext = () => {
    sound.playClick();
    if (currentStepIdx < tourSteps.length - 1) {
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

  const handleClose = () => {
    sound.playClick();
    setIsTourOpen(false);
    setCurrentStepIdx(0);
  };

  return (
    <aside aria-label="Interactive Tour Guide" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-lg w-[calc(100vw-2rem)] sm:w-full animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
      {/* Floating Non-Blocking Spotlight Card */}
      <div className="bg-[var(--bg-card)] text-[var(--text-main)] border-2 border-[var(--accent-gold)] ring-4 ring-[var(--accent-gold)]/25 custom-geometry p-5 sm:p-6 space-y-4 shadow-2xl backdrop-blur-xl">
        {/* Top Header / Step Indicator / Close */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2.5">
            <AluLogo size="sm" showLabel={false} />
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[var(--accent-gold)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {format('tourStepCounter', { current: currentStep.stepNumber, total: tourSteps.length }, `Tour Step ${currentStep.stepNumber} of ${tourSteps.length}`)}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] font-semibold custom-geometry">
              {t('tourActive', 'Active:')} {currentStep.tabLabel}
            </span>
            <button
              onClick={handleClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 custom-geometry hover:bg-[var(--bg-secondary)] transition-colors"
              title={t('closeEsc', 'Close (Esc)')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center shrink-0">
              {currentStep.icon}
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] leading-snug">
                {currentStep.title}
              </h3>
              <p className="text-xs font-semibold text-[var(--accent-gold)]">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry text-[11px] text-[var(--text-main)] flex items-center gap-2 font-mono">
            <Navigation className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
            <span>{t('tourTip', 'Tip')}: {currentStep.actionTip}</span>
          </div>
        </div>

        {/* Navigation Dots & Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-color)]">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => {
                  sound.playClick();
                  setCurrentStepIdx(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIdx 
                    ? 'w-6 bg-[var(--accent-gold)]' 
                    : idx < currentStepIdx
                    ? 'w-2 bg-[var(--accent-gold)]/50'
                    : 'w-2 bg-[var(--border-color)]'
                }`}
                title={`Step ${step.stepNumber}: ${step.title}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStepIdx > 0 && (
              <button
                onClick={handleBack}
                className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-semibold custom-geometry flex items-center gap-1 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('tourPreviousStep', '← Back')}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-[var(--accent-gold)] text-slate-950 text-xs font-bold custom-geometry hover:opacity-90 flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>{isLast ? t('tourFinishTour', 'Finish Tour & Start Case 🚀') : t('tourNextStep', 'Next Step →')}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
