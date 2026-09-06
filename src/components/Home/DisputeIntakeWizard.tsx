import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { DisputeCategory } from '../../types';
import { STATE_JURISDICTIONS, getJurisdiction } from '../../services/jurisdictions';
import { getCountryInfo } from '../../services/countries';
import { sound } from '../../services/soundEngine';
import { 
  Zap, 
  Scale, 
  DollarSign, 
  Calendar, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Calculator
} from 'lucide-react';

interface DisputeTypeOption {
  id: DisputeCategory;
  title: string;
  subtitle: string;
  icon: string;
  defaultDesc: string;
  defaultAmount: number;
}

const DISPUTE_TYPES: DisputeTypeOption[] = [
  {
    id: 'security_deposit',
    title: 'Security Deposit Withheld',
    subtitle: 'Landlord kept deposit or failed statutory deadline',
    icon: '🏠',
    defaultDesc: 'Landlord failed to return security deposit within statutory window and failed to provide itemized receipts.',
    defaultAmount: 2500
  },
  {
    id: 'breach_of_contract',
    title: 'Unpaid Invoices / Freelance',
    subtitle: 'Client or customer failed to pay for completed deliverables',
    icon: '💼',
    defaultDesc: 'Completed agreed professional scope and submitted final invoice, but client refused or ignored payment.',
    defaultAmount: 3800
  },
  {
    id: 'consumer_fraud',
    title: 'Defective Contractor / Remodel',
    subtitle: 'Contractor abandoned job, caused leaks, or did shoddy work',
    icon: '🔨',
    defaultDesc: 'Contractor performed defective remodeling work failing local building codes and abandoned without curing defects.',
    defaultAmount: 6500
  },
  {
    id: 'property_damage',
    title: 'Property / Auto Damage',
    subtitle: 'Vehicle collision, neighbor tree fall, or property damage',
    icon: '🚗',
    defaultDesc: 'Defendant negligently caused damage to personal vehicle/property and refused to reimburse verified repair quote.',
    defaultAmount: 2200
  },
  {
    id: 'wage_theft',
    title: 'Unpaid Personal Loan / Debt',
    subtitle: 'Loaned funds with promise to repay, borrower defaulted',
    icon: '🤝',
    defaultDesc: 'Loaned personal funds under written/electronic repayment agreement; borrower stopped payments and defaulted.',
    defaultAmount: 3000
  },
  {
    id: 'negligence',
    title: 'Consumer Refund Denied',
    subtitle: 'Merchant refused lawful refund or delivered wrong product',
    icon: '🛍️',
    defaultDesc: 'Merchant delivered defective/non-conforming goods and refused lawful statutory refund upon return.',
    defaultAmount: 1450
  }
];

export const DisputeIntakeWizard: React.FC = () => {
  const { createCustomCase, setActiveWorkstation, activeCase, country } = useSueChef();
  const countryInfo = getCountryInfo(country);
  
  const [selectedType, setSelectedType] = useState<DisputeCategory>('security_deposit');
  const [claimantName, setClaimantName] = useState('You (Claimant)');
  const [opponentName, setOpponentName] = useState('Apex Property Holdings LLC');
  const [principalAmount, setPrincipalAmount] = useState<number>(2500);
  const [stateCode, setStateCode] = useState<string>(activeCase.state || 'CA');
  const [incidentDate, setIncidentDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 45);
    return d.toISOString().split('T')[0];
  });
  const [disputeSummary, setDisputeSummary] = useState(
    'Landlord retained $2,500 security deposit after move-out without providing itemized repair deductions or receipts within the statutory deadline.'
  );

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const jurisdiction = getJurisdiction(stateCode);

  // Real-time calculation logic
  const penaltyMultiplier = selectedType === 'security_deposit' 
    ? (jurisdiction.securityDepositBadFaithPenaltyMultiplier || 2) 
    : 1;
  const statutoryPenalty = selectedType === 'security_deposit' ? principalAmount * penaltyMultiplier : 0;

  // Accrued daily interest calculation
  const incidentDateObj = new Date(incidentDate);
  const daysElapsed = Math.max(1, Math.floor((new Date().getTime() - incidentDateObj.getTime()) / (1000 * 60 * 60 * 24)));
  const annualInterestRate = (jurisdiction.statutoryInterestRatePercent || 10) / 100;
  const dailyInterest = (principalAmount * annualInterestRate) / 365.25;
  const totalInterest = Math.round(dailyInterest * daysElapsed * 100) / 100;

  const totalCalculatedClaim = principalAmount + statutoryPenalty + totalInterest;
  const isSmallClaimsEligible = totalCalculatedClaim <= jurisdiction.smallClaimsLimitIndividual;

  const handleDisputeTypeChange = (type: DisputeTypeOption) => {
    sound.playClick();
    setSelectedType(type.id);
    setPrincipalAmount(type.defaultAmount);
    setDisputeSummary(type.defaultDesc);
  };

  const handleGenerateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playGavelStrike();

    createCustomCase({
      category: selectedType,
      state: stateCode,
      plaintiffName: claimantName,
      opponentName: opponentName,
      amount: principalAmount,
      incidentDate: incidentDate,
      description: disputeSummary
    });

    setIsSuccessModalOpen(true);
  };

  return (
    <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-5 md:p-7 custom-geometry shadow-xl space-y-6 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-gold)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent-gold)]">
            <Zap className="w-5 h-5 fill-[var(--accent-gold)]/20" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold font-serif text-[var(--text-main)] flex items-center gap-2">
              <span>Instant Dispute Intake Assistant</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold uppercase rounded">
                100% Real Legal Math
              </span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Answer 4 simple questions to automatically calculate statutory damages, verify court dollar limits, and create your ready-to-mail demand letter.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)]">Target State:</span>
          <select
            value={stateCode}
            onChange={e => {
              sound.playClick();
              setStateCode(e.target.value);
            }}
            className="input-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] font-bold px-2.5 py-1.5 focus:border-[var(--accent-gold)]"
          >
            {Object.keys(STATE_JURISDICTIONS).map(st => (
              <option key={st} value={st}>
                {STATE_JURISDICTIONS[st].stateName} ({st})
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleGenerateDispute} className="space-y-6 relative z-10">
        {/* Step 1: Select Dispute Category */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[var(--accent-gold)] text-slate-950 text-[10px] font-bold flex items-center justify-center">1</span>
            Select What Happened:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {DISPUTE_TYPES.map(type => {
              const isSelected = selectedType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => handleDisputeTypeChange(type)}
                  className={`p-3 text-left custom-geometry border-2 transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[var(--badge-bg)] border-[var(--accent-gold)] shadow-md'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--border-color)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{type.icon}</span>
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-bold font-serif text-xs text-[var(--text-main)] truncate">
                      {type.title}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] line-clamp-2 leading-snug">
                      {type.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Key Numbers & Parties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              Who Owes You? (Opponent)
            </label>
            <input
              type="text"
              required
              value={opponentName}
              onChange={e => setOpponentName(e.target.value)}
              placeholder="e.g. Apex Property Mgmt LLC or John Smith"
              className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2.5 focus:border-[var(--accent-gold)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Principal Amount Owed ({countryInfo.currencySymbol})
            </label>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={principalAmount}
              onChange={e => setPrincipalAmount(parseFloat(e.target.value) || 0)}
              placeholder="2500"
              className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono font-bold px-3 py-2.5 focus:border-[var(--accent-gold)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Incident / Move-Out Date
            </label>
            <input
              type="date"
              required
              value={incidentDate}
              onChange={e => setIncidentDate(e.target.value)}
              className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono px-3 py-2.5 focus:border-[var(--accent-gold)]"
            />
          </div>
        </div>

        {/* Dispute Summary Details */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase font-bold text-[var(--text-muted)] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              Brief Description of What Happened:
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-normal">Included in Demand Letter &amp; Court Form</span>
          </label>
          <textarea
            rows={2}
            value={disputeSummary}
            onChange={e => setDisputeSummary(e.target.value)}
            className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 focus:border-[var(--accent-gold)] leading-relaxed"
            placeholder="Describe the transaction, the violation, and dates..."
          />
        </div>

        {/* Live Calculation Preview Banner */}
        <div className="bg-[var(--bg-secondary)] border-2 border-[var(--accent-gold)]/40 p-4 custom-geometry space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-2.5">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[var(--accent-gold)]" />
              <span className="font-serif font-bold text-xs sm:text-sm text-[var(--text-main)]">
                Live State Statutory Damage &amp; Court Eligibility Audit:
              </span>
            </div>
            <span className="text-xs font-mono text-[var(--accent-gold)] font-bold">
              {jurisdiction.stateName} ({jurisdiction.stateCode}) Law
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">1. Principal Claim</div>
              <div className="font-mono font-bold text-sm text-[var(--text-main)] pt-0.5">
                {countryInfo.currencySymbol}{principalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry">
              <div className="text-[10px] font-mono text-emerald-400 uppercase">2. Statutory Penalty</div>
              <div className="font-mono font-bold text-sm text-emerald-400 pt-0.5">
                {statutoryPenalty > 0 ? `+${countryInfo.currencySymbol}${statutoryPenalty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${penaltyMultiplier}x)` : `${countryInfo.currencySymbol}0.00`}
              </div>
            </div>

            <div className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry">
              <div className="text-[10px] font-mono text-amber-400 uppercase">3. Daily Interest ({daysElapsed}d)</div>
              <div className="font-mono font-bold text-sm text-amber-400 pt-0.5">
                +{countryInfo.currencySymbol}{totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({jurisdiction.statutoryInterestRatePercent || 10}%)
              </div>
            </div>

            <div className="p-2 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 custom-geometry">
              <div className="text-[10px] font-mono text-[var(--accent-gold)] uppercase font-bold">Total Demand Sum</div>
              <div className="font-mono font-black text-sm text-[var(--accent-gold)] pt-0.5">
                {countryInfo.currencySymbol}{totalCalculatedClaim.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-1">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSmallClaimsEligible ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span>
                {isSmallClaimsEligible 
                  ? `Eligible for ${jurisdiction.courtName} (Limit: ${countryInfo.currencySymbol}${jurisdiction.smallClaimsLimitIndividual.toLocaleString()})`
                  : `Exceeds Small Claims Limit (${countryInfo.currencySymbol}${jurisdiction.smallClaimsLimitIndividual.toLocaleString()}) - File in Limited Civil`}
              </span>
            </div>
            <span>Citation: {jurisdiction.securityDepositStatuteCitation}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            type="submit"
            className="btn-geom w-full sm:w-auto flex-1 py-3.5 px-6 bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all font-serif"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Generate Complete Dispute Package &amp; Demand Letter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] font-mono text-center text-[var(--text-muted)] border-t border-[var(--border-color)]/60 pt-3">
          ⚖️ <strong>Legal Notice:</strong> SueChef provides self-help dispute tools and calculations. It is not a law firm and is not a substitute for formal attorney advice.
        </p>
      </form>

      {/* Success Intake Modal */}
      {isSuccessModalOpen && (
        <div 
          onClick={() => setIsSuccessModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] p-6 max-w-xl w-full custom-geometry shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative cursor-default"
          >
            {/* Close X */}
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-bold p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 pr-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                  Dispute Case Created &amp; Damages Itemized!
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Case: {claimantName} v. {opponentName} ({jurisdiction.stateCode})
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[var(--text-muted)]">
              <p>
                Your dispute file has been securely initialized with <strong className="text-[var(--text-main)]">{countryInfo.currencySymbol}{totalCalculatedClaim.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> in enforceable damages, statutory bad-faith citations, and pre-formatted legal pleadings.
              </p>

              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-2">
                <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5 font-serif text-sm">
                  <FileText className="w-4 h-4 text-[var(--accent-gold)]" />
                  <span>Recommended Next Action:</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--accent-gold)] font-bold">1.</span>
                    <span>Send the <strong>10-Day Pre-Lawsuit Demand Letter</strong> via Certified Mail (resolves ~70% of claims before court).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--accent-gold)] font-bold">2.</span>
                    <span>Upload your payment receipts or photos in the <strong>Evidence Locker</strong> to generate court-admissible SHA-256 exhibit stickers.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--accent-gold)] font-bold">3.</span>
                    <span>Review the <strong>Prima Facie Legal Checklist</strong> in the Claim Kitchen.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsSuccessModalOpen(false);
                  setActiveWorkstation('pleading-builder');
                }}
                className="btn-geom py-3 px-4 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>View &amp; Print Demand Letter</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsSuccessModalOpen(false);
                  setActiveWorkstation('claim-kitchen');
                }}
                className="btn-geom py-3 px-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-gold)] font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Scale className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Open Claim Kitchen Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
