import React, { useState } from 'react';
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
  FolderSearch 
} from 'lucide-react';

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  targetWorkstation: WorkstationId;
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to SueChef Pro',
    subtitle: 'The Privacy-First Pro Se Legal Preparation Platform',
    description: 'SueChef equips self-represented civil litigants with the same computational tools, discovery weapons, and evidentiary rigor used by high-billing commercial litigation firms.',
    targetWorkstation: 'claim-kitchen',
    icon: <Scale className="w-6 h-6 text-primary" />
  },
  {
    title: 'Workstation 1: Claim Kitchen',
    subtitle: 'Deconstruct Causes of Action & Assess Small Claims Limits',
    description: 'Break your civil dispute into black-letter statutory elements. Ensure every element of liability and every dollar of damages is mathematically proven before filing.',
    targetWorkstation: 'claim-kitchen',
    icon: <Scale className="w-6 h-6 text-primary" />
  },
  {
    title: 'Workstation 2: Pre-Trial Discovery Studio',
    subtitle: 'Interrogatories, RFPs, Subpoenas & The 30-Day Default Trap',
    description: 'Draft written discovery requests under oath. Weaponize Requests for Admission (RFAs)—if the defendant fails to answer within 30 days, every fact is deemed admitted by law!',
    targetWorkstation: 'discovery-studio',
    icon: <FolderSearch className="w-6 h-6 text-primary" />
  },
  {
    title: 'Workstation 3: Trial & Hearing Prep',
    subtitle: 'Evidentiary Objection Simulator & Argument Teleprompter',
    description: 'Train on real courtroom scenarios to master hearsay exceptions and leading objections under fire. Rehearse opening statements using the adjustable WPM live teleprompter.',
    targetWorkstation: 'trial-prep',
    icon: <Gavel className="w-6 h-6 text-primary" />
  },
  {
    title: 'Workstation 4: Settlement Negotiation Matrix',
    subtitle: 'Expected Value (EV) Risk Modeling & Rule 408 Offer Drafter',
    description: 'Calculate your risk-adjusted trial outcome and generate 3-tier settlement brackets (Anchor, Fair Compromise, Walk-Away Floor) with Federal Rule of Evidence 408 confidentiality protection.',
    targetWorkstation: 'settlement-matrix',
    icon: <Calculator className="w-6 h-6 text-primary" />
  },
  {
    title: 'Workstation 5: Evidence Locker & PII Redactor',
    subtitle: 'SHA-256 Fingerprinting, SMS Reconstructor & Canvas Redaction',
    description: 'Hash critical receipts and contracts with in-browser SHA-256 for FRE 902 self-authentication. Reconstruct messy SMS threads and redact sensitive SSN/Bank numbers.',
    targetWorkstation: 'evidence-locker',
    icon: <ShieldCheck className="w-6 h-6 text-primary" />
  },
  {
    title: 'Workstation 6: Zero-Knowledge Security Vault',
    subtitle: 'AES-256 GCM Client Encryption & Panic Shredder',
    description: 'Your case data never touches third-party servers. All files are encrypted locally in IndexedDB with instant one-click panic wipe capability.',
    targetWorkstation: 'security-vault',
    icon: <ShieldCheck className="w-6 h-6 text-primary" />
  }
];

export const WalkthroughTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen, setActiveWorkstation } = useSueChef();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isTourOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIdx];

  const handleNext = () => {
    sound.playClick();
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setActiveWorkstation(TOUR_STEPS[nextIdx].targetWorkstation);
    } else {
      sound.playSuccessChime();
      setIsTourOpen(false);
      setCurrentStepIdx(0);
    }
  };

  const handleBack = () => {
    sound.playClick();
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      setActiveWorkstation(TOUR_STEPS[prevIdx].targetWorkstation);
    }
  };

  const handleSkip = () => {
    sound.playClick();
    setIsTourOpen(false);
    setCurrentStepIdx(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card border-2 border-primary/60 custom-geometry max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        {/* Close / Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 custom-geometry"
          title="Close Tour"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Counter Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase font-bold text-primary tracking-widest">
            Interactive Spotlight Tour • Step {currentStepIdx + 1} of {TOUR_STEPS.length}
          </span>
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-1.5 custom-geometry transition-all ${
                  idx === currentStepIdx ? 'bg-primary w-6' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="flex items-start gap-4 pt-1">
          <div className="p-3 bg-primary/15 border border-primary/30 custom-geometry shrink-0">
            {currentStep.icon}
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold font-serif text-foreground leading-snug">
              {currentStep.title}
            </h2>
            <div className="text-xs font-semibold text-primary font-mono">
              {currentStep.subtitle}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {currentStep.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStepIdx > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-3 py-1.5 bg-muted text-foreground text-xs font-semibold custom-geometry hover:bg-muted/80"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold custom-geometry hover:bg-primary/90 shadow-sm"
            >
              <span>{currentStepIdx === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              {currentStepIdx === TOUR_STEPS.length - 1 ? (
                <Check className="w-4 h-4 text-emerald-300" />
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
