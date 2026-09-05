import React, { useState, useEffect } from 'react';
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
  FolderSearch,
  FileText,
  Lock,
  Building,
  Lightbulb,
  MousePointerClick
} from 'lucide-react';

interface TourStep {
  id: string;
  stepNumber: number;
  title: string;
  simpleSubtitle: string;
  whatItDoes: string;
  targetWorkstation: WorkstationId;
  icon: React.ReactNode;
  whereToGo: string;
  whatToDoNext: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    stepNumber: 1,
    title: 'Welcome to SueChef Pro',
    simpleSubtitle: 'Easy Step-by-Step Legal Help for Everyday People',
    whatItDoes: 'SueChef helps you easily prepare, organize, and win your small claims dispute, security deposit claim, unpaid invoice, or property damage case without paying thousands to lawyers.',
    targetWorkstation: 'claim-kitchen',
    icon: <Scale className="w-6 h-6 text-amber-400" />,
    whereToGo: 'Top Navigation Tab #1: "1. Build Case"',
    whatToDoNext: 'Click "Take Me to Step 1" below to start building your case elements and check your small claims limit.'
  },
  {
    id: 'claim-kitchen',
    stepNumber: 2,
    title: '1. Build Your Case & Check Laws',
    simpleSubtitle: 'Pick Your Issue & Calculate Your Maximum Damages',
    whatItDoes: 'Select what happened (e.g. Landlord withheld deposit, Unpaid contractor, Car accident). SueChef checks your state laws, calculates late penalties (2x-3x damages), and rates your case strength.',
    targetWorkstation: 'claim-kitchen',
    icon: <Scale className="w-6 h-6 text-amber-400" />,
    whereToGo: 'Workstation Tab 1: Claim Kitchen (Top Bar)',
    whatToDoNext: 'Check off the boxes under "Statutory Elements" to verify you have all required legal ingredients to win.'
  },
  {
    id: 'evidence-locker',
    stepNumber: 3,
    title: '2. Add Your Proof & Photos',
    simpleSubtitle: 'Receipts, Text Messages, Photos & Contracts',
    whatItDoes: 'Upload your proof. SueChef creates official SHA-256 digital certificates (Federal Rule 902) and lets you easily black out sensitive private numbers (SSN, bank cards) with 1 click.',
    targetWorkstation: 'evidence-locker',
    icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
    whereToGo: 'Workstation Tab 2: Evidence Locker',
    whatToDoNext: 'Drag and drop your photos, lease agreements, or receipts to generate certified Exhibit stickers.'
  },
  {
    id: 'pleading-builder',
    stepNumber: 4,
    title: '3. Official 28-Line Court Papers',
    simpleSubtitle: 'Print-Ready Small Claims & Judicial Council Pleading Paper',
    whatItDoes: 'Generates real 28-line numbered court documents, formal legal notices, and verified complaints formatted for your local court clerk.',
    targetWorkstation: 'pleading-builder',
    icon: <FileText className="w-6 h-6 text-amber-400" />,
    whereToGo: 'Workstation Tab 3: 28-Line Pleading',
    whatToDoNext: 'Review your auto-drafted complaint, click "Print / Export Pleading", and take it directly to the courthouse.'
  },
  {
    id: 'second-opinion',
    stepNumber: 5,
    title: '4. AI Case Second Opinion',
    simpleSubtitle: 'Objective Case Viability & Defense Trap Predictions',
    whatItDoes: 'Gives you an objective second opinion on your case. Shows what the other person will argue to defend themselves, and gives you the exact legal rebuttal to win.',
    targetWorkstation: 'second-opinion',
    icon: <Lightbulb className="w-6 h-6 text-amber-400" />,
    whereToGo: 'Workstation Tab 5: Second Opinion (New!)',
    whatToDoNext: 'View your overall Merit Grade, Win Probability %, and predicted counter-strategies.'
  },
  {
    id: 'settlement-matrix',
    stepNumber: 6,
    title: '5. Demand Letter & Settlement Settle',
    simpleSubtitle: 'Get Paid Before Trial with Rule 408 Letters',
    whatItDoes: 'Drafts a formal 10-day demand letter with Federal Rule 408 confidentiality protection and calculates your walk-away settlement number.',
    targetWorkstation: 'settlement-matrix',
    icon: <Calculator className="w-6 h-6 text-amber-400" />,
    whereToGo: 'Workstation Tab 4: Demand & Settle',
    whatToDoNext: 'Adjust the probability slider to see your risk-adjusted expected recovery value.'
  },
  {
    id: 'legal-services',
    stepNumber: 7,
    title: '6. Real-Life Legal Aid & Local Courts',
    simpleSubtitle: 'Connect to Free Legal Aid Clinics & Court Self-Help Centers',
    whatItDoes: 'Direct phone numbers, e-filing portals, free legal aid societies, and small claims advisors for your specific country and state.',
    targetWorkstation: 'legal-services',
    icon: <Building className="w-6 h-6 text-amber-400" />,
    whereToGo: 'Workstation Tab 6: Legal Services Hub',
    whatToDoNext: 'Click "Open Official Site" or call the free Small Claims Advisor hotline in your area.'
  },
  {
    id: 'trial-prep',
    stepNumber: 8,
    title: '7. Courtroom Practice & Objections',
    simpleSubtitle: 'Rehearse Opening Argument with Live Teleprompter',
    whatItDoes: 'Train with real courtroom objection quizzes (Hearsay, Leading) and practice speaking with the adjustable speed teleprompter before your court hearing.',
    targetWorkstation: 'trial-prep',
    icon: <Gavel className="w-6 h-6 text-amber-400" />,
    whereToGo: 'Workstation Tab 8: Trial Prep',
    whatToDoNext: 'Test your objection skills with the interactive simulator and rehearse your opening speech.'
  }
];

export const WalkthroughTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen, setActiveWorkstation } = useSueChef();
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

  const handleJumpToFeature = () => {
    sound.playGavelStrike();
    setActiveWorkstation(currentStep.targetWorkstation);
    setIsTourOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* High-Contrast Spotlight Card */}
      <div className="bg-[#101420] text-slate-100 border-2 border-amber-400/90 ring-4 ring-amber-500/30 rounded-xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-[0_0_60px_rgba(212,175,55,0.45)] relative">
        {/* Top Header / Brand / Close */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-3">
            <AluLogo size="sm" showLabel={true} />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400/15 border border-amber-400/50 rounded text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Step {currentStep.stepNumber} of {TOUR_STEPS.length}
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

        {/* Step Progress Bar Dots */}
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
              title={`Jump to Step ${step.stepNumber}: ${step.title}`}
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
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight">
                {currentStep.title}
              </h2>
              <div className="text-xs sm:text-sm font-semibold text-amber-300 font-sans">
                {currentStep.simpleSubtitle}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/70 p-3.5 rounded-lg border border-slate-800">
            {currentStep.whatItDoes}
          </p>

          {/* WHERE TO GO & WHAT TO DO GUIDANCE BOX */}
          <div className="space-y-2 p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-300 tracking-wider">
              <MousePointerClick className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Where to Go & What to Do:</span>
            </div>
            
            <div className="text-xs text-amber-200 font-mono">
              📍 <strong className="text-white">{currentStep.whereToGo}</strong>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              👉 {currentStep.whatToDoNext}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleJumpToFeature}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-1"
          >
            <span>👉 Open & Use This Tool Now</span>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded hover:from-amber-400 hover:to-amber-300 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              <span>{isLast ? 'Complete & Start Preparing' : 'Next Step (Show Where to Go)'}</span>
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
