import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { ThemeId, CountryCode, DisputeCategory } from '../../types';
import { SUPPORTED_COUNTRIES, getCountryInfo } from '../../services/countries';
import { STATE_JURISDICTIONS } from '../../services/jurisdictions';
import { sound } from '../../services/soundEngine';
import { AluLogo } from '../Branding/AluLogo';
import { 
  Palette, 
  Target, 
  User, 
  Globe, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Scale, 
  CheckCircle2, 
  Calendar, 
  Zap, 
  Briefcase, 
  Home as HomeIcon, 
  CreditCard, 
  Car, 
  Plane, 
  Wrench, 
  TrendingUp,
  Award,
  Clock,
  X
} from 'lucide-react';

interface ThemeOption {
  id: ThemeId;
  name: string;
  desc: string;
  previewBg: string;
  previewAccent: string;
  icon: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'chambers-onyx',
    name: 'Royal Chambers',
    desc: 'Deep navy obsidian & warm gold — authoritative, judicial, calm.',
    previewBg: 'bg-[#060a12]',
    previewAccent: 'border-amber-400 text-amber-400',
    icon: '👑'
  },
  {
    id: 'parchment-ink',
    name: 'Legal Parchment',
    desc: 'Warm ivory parchment & crisp ink — classic law library aesthetic.',
    previewBg: 'bg-[#f4efe4]',
    previewAccent: 'border-amber-700 text-amber-900',
    icon: '📜'
  },
  {
    id: 'cyber-tribunal',
    name: 'Cyber Tribunal',
    desc: 'OLED pitch black with emerald neon — high-tech, forensic precision.',
    previewBg: 'bg-[#030708]',
    previewAccent: 'border-emerald-400 text-emerald-400',
    icon: '⚡'
  },
  {
    id: 'legal-slate',
    name: 'Clean Slate',
    desc: 'Monochrome slate & calm ocean blue — distraction-free minimalism.',
    previewBg: 'bg-[#0f172a]',
    previewAccent: 'border-blue-400 text-blue-400',
    icon: '🏛️'
  }
];

interface DisputeGoalOption {
  id: DisputeCategory;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  defaultAmount: number;
  statutoryRule: string;
  penaltyMultiplier: string;
  cureDays: number;
}

const DISPUTE_GOALS: DisputeGoalOption[] = [
  {
    id: 'security_deposit',
    title: 'Security Deposit Return',
    subtitle: 'Landlord kept deposit or failed the statutory deadline without receipts',
    icon: <HomeIcon className="w-5 h-5 text-amber-400" />,
    defaultAmount: 2200,
    statutoryRule: 'Landlord must provide full refund or itemized receipts within statutory window (e.g. 21 days in CA). Missing this forfeits deductions.',
    penaltyMultiplier: 'Up to 2x statutory bad-faith penalty',
    cureDays: 14
  },
  {
    id: 'zombie_subscription',
    title: 'Zombie Subscription Refund',
    subtitle: 'Company refused cancellation, used dark patterns, or charged unauthorized fees',
    icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
    defaultAmount: 350,
    statutoryRule: 'Federal ROSCA & EFTA laws prohibit deceptive auto-renewals without 1-click simple cancellation.',
    penaltyMultiplier: 'Full reimbursement + statutory fee shifting',
    cureDays: 10
  },
  {
    id: 'freelance_unpaid',
    title: 'Unpaid Freelance / Invoices',
    subtitle: 'Client accepted completed deliverables but ignored payment or broke contract',
    icon: <Briefcase className="w-5 h-5 text-blue-400" />,
    defaultAmount: 3800,
    statutoryRule: 'Prompt Payment Acts mandate timely payment upon delivery with statutory prejudgment interest.',
    penaltyMultiplier: 'Statutory interest (up to 1.5%/mo) + legal costs',
    cureDays: 14
  },
  {
    id: 'predatory_towing',
    title: 'Predatory Towing / Impound',
    subtitle: 'Vehicle towed without lawful signage, predatory cash-only, or exorbitant fees',
    icon: <Car className="w-5 h-5 text-rose-400" />,
    defaultAmount: 650,
    statutoryRule: 'Vehicle codes prohibit towing without proper property owner authorization and compliant warning signs.',
    penaltyMultiplier: 'Up to 4x towing charges for statutory violations',
    cureDays: 7
  },
  {
    id: 'airline_compensation',
    title: 'Airline Delay / Cancelation',
    subtitle: 'Flight canceled or severely delayed and airline refused lawful cash compensation',
    icon: <Plane className="w-5 h-5 text-cyan-400" />,
    defaultAmount: 850,
    statutoryRule: 'US DOT mandates automatic prompt refunds for canceled flights; EU261 provides €250–€600 statutory compensation.',
    penaltyMultiplier: 'Mandatory statutory compensation + hotel/meal expenses',
    cureDays: 14
  },
  {
    id: 'contractor_dispute',
    title: 'Defective Contractor Work',
    subtitle: 'Remodel contractor abandoned job, caused property leaks, or violated building codes',
    icon: <Wrench className="w-5 h-5 text-amber-500" />,
    defaultAmount: 5500,
    statutoryRule: 'Contractors must perform in workmanlike manner. License bond surety liability covers defective scopes.',
    penaltyMultiplier: 'Cost of repair + license bond claim',
    cureDays: 14
  },
  {
    id: 'breach_of_contract',
    title: 'General Civil Dispute',
    subtitle: 'Unreturned personal loan, damaged property, or broken commercial agreement',
    icon: <Scale className="w-5 h-5 text-indigo-400" />,
    defaultAmount: 2500,
    statutoryRule: 'Common law breach of contract provides full compensatory damages to restore you to your rightful position.',
    penaltyMultiplier: 'Compensatory damages + statutory court costs',
    cureDays: 14
  }
];

export const PersonalizedOnboardingModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    theme, 
    setTheme, 
    country, 
    setCountry, 
    activeCase, 
    createCustomCase,
    setActiveWorkstation
  } = useSueChef();

  // Step 1: Palette | Step 2: Goal | Step 3: Identity & Location | Step 4: The Gift of Value
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(theme);
  const [selectedGoal, setSelectedGoal] = useState<DisputeCategory>('security_deposit');
  const [yourName, setYourName] = useState<string>('Alex Johnson');
  const [opponentName, setOpponentName] = useState<string>('Apex Property Management LLC');
  const [amount, setAmount] = useState<number>(2200);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(country || 'US');
  const [selectedState, setSelectedState] = useState<string>(activeCase.state || 'CA');

  if (!isOnboardingOpen) return null;

  const currentGoalData = DISPUTE_GOALS.find(g => g.id === selectedGoal) || DISPUTE_GOALS[0];
  const countryInfo = getCountryInfo(selectedCountry);
  const stateJurisdiction = (selectedCountry === 'US') ? STATE_JURISDICTIONS[selectedState] : null;
  const courtLimit = stateJurisdiction ? stateJurisdiction.smallClaimsLimitIndividual : countryInfo.defaultLimit;

  // Potential Recovery Calculations (The Reciprocity Gift)
  const principal = Number(amount) || 1000;
  let estimatedStatutoryPenalty = 0;
  if (selectedGoal === 'security_deposit') {
    estimatedStatutoryPenalty = principal * 2; // 2x statutory bad-faith penalty
  } else if (selectedGoal === 'predatory_towing') {
    estimatedStatutoryPenalty = principal * 3; // Up to 4x total
  } else if (selectedGoal === 'airline_compensation') {
    estimatedStatutoryPenalty = 650;
  } else {
    estimatedStatutoryPenalty = Math.round(principal * 0.15); // Prejudgment interest / statutory fee shifting
  }
  const totalPotentialRecovery = Math.min(principal + estimatedStatutoryPenalty, courtLimit * 2);

  const handleNextStep = () => {
    sound.playClick();
    if (step < 4) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrevStep = () => {
    sound.playClick();
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleSelectTheme = (thm: ThemeId) => {
    setSelectedTheme(thm);
    setTheme(thm);
    sound.playClick();
  };

  const handleSelectGoal = (goal: DisputeCategory) => {
    setSelectedGoal(goal);
    const gData = DISPUTE_GOALS.find(g => g.id === goal);
    if (gData) {
      setAmount(gData.defaultAmount);
      if (goal === 'security_deposit') {
        setOpponentName('Apex Property Management LLC');
      } else if (goal === 'zombie_subscription') {
        setOpponentName('StreamVault Media Inc.');
      } else if (goal === 'freelance_unpaid') {
        setOpponentName('Horizon Digital Agency');
      } else if (goal === 'predatory_towing') {
        setOpponentName('Metro Quick-Tow Services');
      } else if (goal === 'airline_compensation') {
        setOpponentName('SkyWay Global Airlines');
      } else if (goal === 'contractor_dispute') {
        setOpponentName('Reliant Home Renovations');
      }
    }
    sound.playClick();
  };

  const handleFinalClaimCase = () => {
    sound.playSuccessChime();
    sound.playGavelStrike();

    // Set Country and State
    setCountry(selectedCountry);
    localStorage.setItem('suechef_onboarded_location', 'true');
    localStorage.setItem('suechef_onboarded_concierge', 'true');

    // Create the fully-formed personalized dispute
    createCustomCase({
      category: selectedGoal,
      opponentName: opponentName.trim() || 'Opposing Party',
      opponentType: 'corporation',
      plaintiffName: yourName.trim() || 'You (Claimant)',
      amount: principal,
      incidentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      state: selectedCountry === 'US' ? selectedState : 'CA',
      description: `${currentGoalData.title}: ${currentGoalData.subtitle}. Demand for full reimbursement of ${countryInfo.currencySymbol}${principal.toLocaleString()} plus statutory penalties and fees.`
    });

    setIsOnboardingOpen(false);
    setActiveWorkstation('claim-kitchen');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] ring-4 ring-[var(--accent-gold)]/15 max-w-2xl w-full p-5 sm:p-7 md:p-8 custom-geometry shadow-2xl space-y-6 text-[var(--text-main)] my-auto transition-all duration-300 relative">
        
        {/* Top Header & Progress Stepper */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <AluLogo size="sm" showLabel={false} />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-gold)] font-bold">
                SueChef Concierge • Step {step} of 4
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-[var(--text-main)]">
                {step === 1 && 'Choose Your Atmosphere'}
                {step === 2 && 'Define Your Dispute Goal'}
                {step === 3 && 'Who is Involved & Location'}
                {step === 4 && 'Your Instant Case Assessment'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step 
                    ? 'w-6 bg-[var(--accent-gold)]' 
                    : s < step 
                    ? 'w-2 bg-emerald-400' 
                    : 'w-2 bg-[var(--border-color)]'
                }`}
              />
            ))}
            {localStorage.getItem('suechef_onboarded_location') && (
              <button
                type="button"
                onClick={() => setIsOnboardingOpen(false)}
                className="ml-2 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-md hover:bg-white/10 transition-colors"
                title="Close Concierge"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: Micro-Choice 1 — Palette & Atmosphere */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Legal preparation requires focus and calm. Pick the visual environment that feels most comfortable to your eyes. You can change this at any time in Settings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {THEME_OPTIONS.map(opt => {
                const isSelected = selectedTheme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectTheme(opt.id)}
                    className={`p-3.5 border custom-geometry text-left transition-all duration-200 flex flex-col justify-between gap-2.5 relative group ${
                      isSelected 
                        ? 'border-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]/30 bg-[var(--badge-bg)] shadow-md' 
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--accent-gold)]/60 hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{opt.icon}</span>
                        <span className="font-serif font-bold text-sm text-[var(--text-main)]">{opt.name}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                      )}
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)] leading-normal">
                      {opt.desc}
                    </p>

                    <div className="flex items-center gap-1.5 pt-1">
                      <div className={`w-4 h-4 rounded-full border ${opt.previewAccent} ${opt.previewBg}`} />
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">Live Theme Preview</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[var(--border-color)]">
              <span className="text-[11px] text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Theme active immediately</span>
              </span>

              <button
                type="button"
                onClick={handleNextStep}
                className="btn-geom px-5 py-2.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs sm:text-sm hover:opacity-90 flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continue to Dispute Goal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Micro-Choice 2 — Define Your Dispute Goal */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              What specific problem do you need resolved? Select your dispute category in 1 tap to calibrate your legal algorithms and statutory rules.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {DISPUTE_GOALS.map(goal => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => handleSelectGoal(goal.id)}
                    className={`p-3 border custom-geometry text-left transition-all duration-200 flex items-start gap-3 relative ${
                      isSelected 
                        ? 'border-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]/30 bg-[var(--badge-bg)] shadow-md' 
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--accent-gold)]/60 hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="p-2 rounded bg-black/20 shrink-0 mt-0.5">
                      {goal.icon}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-serif font-bold text-xs sm:text-sm text-[var(--text-main)] truncate">
                          {goal.title}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                        {goal.subtitle}
                      </p>
                      <div className="text-[10px] font-mono text-[var(--accent-gold)] pt-0.5">
                        Typical Claim: {countryInfo.currencySymbol}{goal.defaultAmount.toLocaleString()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn-geom px-4 py-2 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="btn-geom px-5 py-2.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs sm:text-sm hover:opacity-90 flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continue to Case Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Micro-Choice 3 — Who is Involved & Where */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Provide just two names, your rough amount at stake, and your location. We will unlock your full statutory assessment.
            </p>

            <div className="space-y-3.5">
              {/* Names row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your Full Name / Entity:</span>
                  </label>
                  <input
                    type="text"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-xs font-semibold focus:border-[var(--accent-gold)] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Opponent / Business Name:</span>
                  </label>
                  <input
                    type="text"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    placeholder="e.g. Apex Property Management LLC"
                    className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-xs font-semibold focus:border-[var(--accent-gold)] outline-none"
                  />
                </div>
              </div>

              {/* Amount & Currency */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-[var(--accent-gold)] flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Estimated Amount Withheld / Lost ({countryInfo.currencySymbol}):</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--text-muted)]">
                    {countryInfo.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm font-bold font-mono focus:border-[var(--accent-gold)] outline-none"
                  />
                </div>
              </div>

              {/* Jurisdiction / Country & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Country:</span>
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
                    className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-xs font-semibold focus:border-[var(--accent-gold)] outline-none"
                  >
                    {SUPPORTED_COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.currencyCode})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCountry === 'US' ? (
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>US State (Local Damage Limit):</span>
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-xs font-semibold focus:border-[var(--accent-gold)] outline-none"
                    >
                      {Object.keys(STATE_JURISDICTIONS).map(st => (
                        <option key={st} value={st}>
                          {STATE_JURISDICTIONS[st].stateName} ({st}) - Limit ${STATE_JURISDICTIONS[st].smallClaimsLimitIndividual.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-blue-400" />
                      <span>Court Jurisdiction Limit:</span>
                    </label>
                    <div className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-xs font-mono font-bold">
                      {countryInfo.smallClaimsName} ({countryInfo.currencySymbol}{countryInfo.defaultLimit.toLocaleString()})
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn-geom px-4 py-2 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="btn-geom px-5 py-2.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs sm:text-sm hover:opacity-90 flex items-center gap-2 shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Unlock Instant Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: The Reciprocity Principle — The Gift of Value First */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Value Gift Banner */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-[var(--bg-secondary)] to-emerald-950/40 border border-emerald-500/40 custom-geometry flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-300 font-serif">
                  Your Free Dispute Valuation &amp; Statutory Protection Roadmap
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed pt-0.5">
                  Before you enter your dashboard or upload evidence, we have analyzed your dispute against local statutes. Here is your leverage:
                </p>
              </div>
            </div>

            {/* Recovery Valuation Calculator Box */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 custom-geometry space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
                  Calculated Recovery Ceiling
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold rounded">
                  MAXIMUM STATUTORY POTENTIAL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry">
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">Principal Claim</div>
                  <div className="text-sm font-bold font-mono text-[var(--text-main)] pt-0.5">
                    {countryInfo.currencySymbol}{principal.toLocaleString()}
                  </div>
                </div>

                <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry">
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">Statutory Penalties</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 pt-0.5">
                    +{countryInfo.currencySymbol}{estimatedStatutoryPenalty.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-[var(--text-muted)] font-mono">{currentGoalData.penaltyMultiplier}</div>
                </div>

                <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 custom-geometry">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold">Total Max Ceiling</div>
                  <div className="text-base font-bold font-mono text-emerald-300 pt-0.5">
                    {countryInfo.currencySymbol}{totalPotentialRecovery.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-[var(--text-muted)] font-mono">Small Claims Cap: {countryInfo.currencySymbol}{courtLimit.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Plain English Statutory Rule */}
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold font-serif text-[var(--accent-gold)]">
                <Scale className="w-4 h-4" />
                <span>Statutory Leverage in Plain English:</span>
              </div>
              <p className="text-xs text-[var(--text-main)] leading-relaxed">
                {currentGoalData.statutoryRule}
              </p>
            </div>

            {/* 4-Phase Strategy Checklist (Pre-configured for the user) */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)]">
                Your Pre-Configured Action Plan:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry">
                  <div className="text-emerald-400 font-bold font-mono text-[10px]">1. DEMAND</div>
                  <div className="text-[11px] text-[var(--text-main)] pt-0.5 font-medium">{currentGoalData.cureDays}-Day Cure Notice</div>
                </div>
                <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry">
                  <div className="text-emerald-400 font-bold font-mono text-[10px]">2. EVIDENCE</div>
                  <div className="text-[11px] text-[var(--text-main)] pt-0.5 font-medium">Bates Exhibit Index</div>
                </div>
                <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry">
                  <div className="text-emerald-400 font-bold font-mono text-[10px]">3. PETITION</div>
                  <div className="text-[11px] text-[var(--text-main)] pt-0.5 font-medium">Court Filing Ready</div>
                </div>
                <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry">
                  <div className="text-emerald-400 font-bold font-mono text-[10px]">4. COLLECT</div>
                  <div className="text-[11px] text-[var(--text-main)] pt-0.5 font-medium">Bank Levy / Writ</div>
                </div>
              </div>
            </div>

            {/* Final Call to Action */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero Cloud Retention. 100% Client-Side Encryption.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn-geom px-3.5 py-2.5 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalClaimCase}
                  className="btn-geom flex-1 sm:flex-initial px-6 py-3 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs sm:text-sm hover:opacity-90 flex items-center justify-center gap-2 shadow-xl shadow-amber-500/10 transition-all"
                >
                  <span>Claim My Case &amp; Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
