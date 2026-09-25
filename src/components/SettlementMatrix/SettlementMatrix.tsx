import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { SettlementCalculation, SettlementOfferLog } from '../../types';
import { sound } from '../../services/soundEngine';
import { getCountryInfo } from '../../services/countries';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Scale, 
  Copy, 
  Check, 
  FileCheck, 
  Sliders, 
  AlertCircle,
  Plus,
  Trash2,
  Printer,
  History,
  ArrowRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Handshake,
  FileSignature
} from 'lucide-react';
import { SettlementAgreementModal } from './SettlementAgreementModal';
import { NegotiationSimulator } from './NegotiationSimulator';

export const SettlementMatrix: React.FC = () => {
  const { activeCase, updateActiveCase, country } = useSueChef();
  const countryInfo = getCountryInfo(country);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [settlementView, setSettlementView] = useState<'matrix' | 'simulator'>('matrix');
  
  // New offer log form state
  const [offerAmount, setOfferAmount] = useState<number>(3000);
  const [offeredBy, setOfferedBy] = useState<'opposing_party' | 'plaintiff'>('opposing_party');
  const [offerNotes, setOfferNotes] = useState('');
  const [offerWindowDays, setOfferWindowDays] = useState(14);
  const [offerStatus, setOfferStatus] = useState<'received' | 'countered' | 'rejected' | 'accepted'>('received');

  const settlement: SettlementCalculation = activeCase.settlement || {
    claimDamages: activeCase.claimEvaluation.damages.reduce((sum, d) => sum + (d.amount || 0), 0) || 5000,
    winProbabilityPercent: 80,
    courtFilingFees: 185,
    processServiceFees: 75,
    expertWitnessFees: 0,
    estimatedTimeValueLoss: 400,
    openingDemandAnchor: 5000,
    targetFairSettlement: 4000,
    walkAwayFloor: 2500,
    paymentWindowDays: 14,
    paymentMethod: 'wire_transfer',
    includeConfidentiality: true,
    includeNonDisparagement: true,
    offerHistory: []
  };

  const totalLitigationCost = 
    settlement.courtFilingFees + 
    settlement.processServiceFees + 
    settlement.expertWitnessFees + 
    settlement.estimatedTimeValueLoss;

  const caseTotalDamages = activeCase.claimEvaluation.damages.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Expected Value formula: (Damages * WinProb) - LitigationCosts
  const expectedValueTrial = Math.max(0, Math.round(
    (settlement.claimDamages * (settlement.winProbabilityPercent / 100)) - totalLitigationCost
  ));

  const handleSyncCaseDamages = () => {
    if (caseTotalDamages > 0) {
      sound.playSuccessChime();
      handleUpdate({ claimDamages: caseTotalDamages });
    }
  };

  const handleUpdate = (patch: Partial<SettlementCalculation>) => {
    sound.playClick();
    const updated = { ...settlement, ...patch };
    
    // Auto-update brackets if claim damages or win probability change
    if (patch.claimDamages !== undefined || patch.winProbabilityPercent !== undefined) {
      const claim = patch.claimDamages ?? settlement.claimDamages;
      const winP = patch.winProbabilityPercent ?? settlement.winProbabilityPercent;
      const ev = Math.max(0, Math.round((claim * (winP / 100)) - totalLitigationCost));
      
      updated.openingDemandAnchor = claim;
      updated.targetFairSettlement = Math.round((claim + ev) / 2);
      updated.walkAwayFloor = Math.round(ev * 0.85);
    }

    updateActiveCase(prev => ({
      ...prev,
      settlement: updated
    }));
  };

  const handleRecalculateBrackets = () => {
    sound.playSuccessChime();
    const ev = Math.max(0, Math.round((settlement.claimDamages * (settlement.winProbabilityPercent / 100)) - totalLitigationCost));
    const updated: SettlementCalculation = {
      ...settlement,
      openingDemandAnchor: settlement.claimDamages,
      targetFairSettlement: Math.round((settlement.claimDamages + ev) / 2),
      walkAwayFloor: Math.round(ev * 0.85)
    };
    updateActiveCase(prev => ({ ...prev, settlement: updated }));
  };

  const handleAddOfferLog = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playDocketStamp();

    const newOffer: SettlementOfferLog = {
      id: `off_${Date.now()}`,
      offerDate: new Date().toISOString().split('T')[0],
      offeredBy,
      amount: offerAmount,
      paymentWindowDays: offerWindowDays,
      includesConfidentiality: settlement.includeConfidentiality ?? true,
      includesNonDisparagement: settlement.includeNonDisparagement ?? true,
      notes: offerNotes || (offeredBy === 'opposing_party' ? 'Opposing formal settlement response' : 'Plaintiff compromise offer'),
      status: offerStatus
    };

    const updatedHistory = [newOffer, ...(settlement.offerHistory || [])];
    updateActiveCase(prev => ({
      ...prev,
      settlement: {
        ...settlement,
        offerHistory: updatedHistory
      }
    }));

    setShowAddOfferModal(false);
    setOfferNotes('');
  };

  const handleDeleteOffer = (id: string) => {
    sound.playClick();
    const updatedHistory = (settlement.offerHistory || []).filter(o => o.id !== id);
    updateActiveCase(prev => ({
      ...prev,
      settlement: {
        ...settlement,
        offerHistory: updatedHistory
      }
    }));
  };

  const handleUpdateOfferStatus = (id: string, newStatus: SettlementOfferLog['status']) => {
    sound.playSuccessChime();
    const updatedHistory = (settlement.offerHistory || []).map(o => {
      if (o.id === id) return { ...o, status: newStatus };
      return o;
    });
    updateActiveCase(prev => ({
      ...prev,
      settlement: {
        ...settlement,
        offerHistory: updatedHistory
      }
    }));
  };

  const generateSettlementAgreementText = () => {
    const pl = activeCase.parties.find(p => p.role === 'plaintiff');
    const df = activeCase.parties.find(p => p.role === 'defendant');
    const days = settlement.paymentWindowDays || 14;
    const methodStr = settlement.paymentMethod === 'certified_check' 
      ? "certified cashier's check delivered via tracked courier" 
      : settlement.paymentMethod === 'installments'
      ? "two equal installments over 30 calendar days"
      : "direct electronic bank wire transfer";

    return `CONFIDENTIAL SETTLEMENT COMMUNICATION & COMPROMISE PROPOSAL
PROTECTED UNDER FEDERAL RULE OF EVIDENCE 408 & APPLICABLE STATE EVIDENCE CODES
INADMISSIBLE IN ANY JUDICIAL PROCEEDING EXCEPT TO ENFORCE SETTLEMENT TERMS

DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
TO: ${df?.name || 'DEFENDANT'}
FROM: ${pl?.name || 'PLAINTIFF IN PRO SE'}
RE: FORMAL SETTLEMENT PROPOSAL & COMPROMISE OF DISPUTED CIVIL CLAIMS
MATTER: ${activeCase.title}
FORUM: ${activeCase.courtName} (Case Ref: ${activeCase.caseNumber})

Dear ${df?.name || 'Defendant'}:

This document constitutes a formal compromise and settlement proposal pursuant to Federal Rule of Evidence 408 and applicable state statutory settlement protections.

Plaintiff ${pl?.name || 'Plaintiff'} proposes to fully settle, release, and discharge all disputed civil claims against ${df?.name || 'Defendant'} upon satisfaction of the following terms and covenants:

1. SETTLEMENT COMPROMISE SUM:
   Defendant shall pay to Plaintiff the compromised total sum of ${countryInfo.currencySymbol}${settlement.targetFairSettlement.toLocaleString()}.00 in full satisfaction of all claims.

2. PAYMENT SCHEDULE & MANNER OF DELIVERY:
   The settlement sum shall be delivered via ${methodStr} within ${days} calendar days of execution of this agreement.

3. DISMISSAL WITH PREJUDICE & MUTUAL GENERAL RELEASE:
   Upon confirmed receipt and clearance of the full settlement funds, Plaintiff shall execute and file a formal Request for Dismissal with Prejudice in ${activeCase.courtName}, with each party bearing their own respective costs and attorney fees.

4. CONFIDENTIALITY & NON-DISPARAGEMENT COVENANTS:${settlement.includeConfidentiality ? '\n   - Confidentiality: The parties agree that the terms and existence of this settlement agreement shall remain strictly confidential.' : ''}${settlement.includeNonDisparagement ? '\n   - Non-Disparagement: The parties agree not to make derogatory, defamatory, or disparaging statements regarding one another in any public or online forum.' : ''}

5. EXPIRATION OF SETTLEMENT PROPOSAL:
   This formal compromise proposal shall automatically expire at 5:00 PM on the 10th business day following delivery. Should this offer lapse without written acceptance, Plaintiff will proceed to judicial trial seeking the full actual and statutory damages of ${countryInfo.currencySymbol}${settlement.claimDamages.toLocaleString()}.00 plus allowable court filing costs and statutory prejudgment interest.

Respectfully submitted,

________________________________________
${pl?.name || 'Plaintiff in Pro Se'}
${pl?.address || ''}, ${pl?.city || ''}, ${pl?.state || ''} ${pl?.zip || ''}
Tel: ${pl?.phone || 'N/A'} | Email: ${pl?.email || 'N/A'}
`;
  };

  const handleCopySettlementLetter = () => {
    sound.playDocketStamp();
    const text = generateSettlementAgreementText();
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  const handlePrintSettlement = () => {
    sound.playDocketStamp();
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[var(--bg-card)] border-2 border-[var(--border-color)] custom-geometry shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary custom-geometry">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide font-serif text-[var(--text-main)]">
              Settlement Negotiation &amp; Risk Matrix
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Mathematical Expected Value (EV) Risk Engine, Rule 408 Settlement Drafter &amp; Counter-Offer Tracker
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowAgreementModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-all custom-geometry shadow-sm"
          >
            <FileSignature className="w-4 h-4" />
            <span>📝 Agreement &amp; Mutual Release</span>
          </button>

          <button
            onClick={handleCopySettlementLetter}
            className="flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry shadow-sm"
          >
            {copiedLetter ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLetter ? 'Copied Rule 408 Offer!' : 'Copy Rule 408 Offer'}</span>
          </button>

          <button
            onClick={handlePrintSettlement}
            className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] text-xs font-semibold custom-geometry"
          >
            <Printer className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>Print Memo</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Risk Matrix vs AI Negotiation Sparring */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => { sound.playClick(); setSettlementView('matrix'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            settlementView === 'matrix'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Expected Value Risk Matrix &amp; Brackets</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setSettlementView('simulator'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            settlementView === 'simulator'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <Handshake className="w-4 h-4" />
          <span>AI Negotiation Sparring Partner</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-500/40 uppercase font-bold">
            Interactive
          </span>
        </button>
      </div>

      {settlementView === 'simulator' && <NegotiationSimulator />}

      {settlementView === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Expected Value (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 font-mono">
                <Sliders className="w-4 h-4" />
                <span>Litigation Risk &amp; Expense Parameters</span>
              </h2>
              <button
                onClick={handleRecalculateBrackets}
                className="flex items-center gap-1 text-[11px] font-mono text-[var(--accent-gold)] hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Brackets to Formula</span>
              </button>
            </div>

            {/* Claim Damages */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                <span className="text-[var(--text-main)] font-semibold">Total Claimed Damages &amp; Statutory Penalties</span>
                <div className="flex items-center gap-2">
                  {caseTotalDamages > 0 && caseTotalDamages !== settlement.claimDamages && (
                    <button
                      onClick={handleSyncCaseDamages}
                      className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 rounded-sm transition-all flex items-center gap-1 shadow-sm"
                      title="Sync total damages calculated from Claim Kitchen &amp; Ledger"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                      Sync Case ({countryInfo.currencySymbol}{caseTotalDamages.toLocaleString()})
                    </button>
                  )}
                  <span className="font-mono font-bold text-primary">{countryInfo.currencySymbol}{settlement.claimDamages.toLocaleString()}</span>
                </div>
              </div>
              <input
                type="range"
                min="500"
                max={Math.max(50000, settlement.claimDamages, caseTotalDamages)}
                step="250"
                value={settlement.claimDamages}
                onChange={(e) => handleUpdate({ claimDamages: parseInt(e.target.value) || 500 })}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Win Probability Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-main)] font-semibold">Assessed Win Probability at Trial</span>
                <span className="font-mono font-bold text-emerald-400">{settlement.winProbabilityPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="99"
                step="1"
                value={settlement.winProbabilityPercent}
                onChange={(e) => handleUpdate({ winProbabilityPercent: parseInt(e.target.value) || 10 })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Filing & Service Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Court Filing Fee ({countryInfo.currencySymbol})</label>
                <input
                  type="number"
                  value={settlement.courtFilingFees}
                  onChange={(e) => handleUpdate({ courtFilingFees: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Process Server Fee ({countryInfo.currencySymbol})</label>
                <input
                  type="number"
                  value={settlement.processServiceFees}
                  onChange={(e) => handleUpdate({ processServiceFees: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Expert / Inspection Fee ({countryInfo.currencySymbol})</label>
                <input
                  type="number"
                  value={settlement.expertWitnessFees}
                  onChange={(e) => handleUpdate({ expertWitnessFees: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Time / Wage Opportunity Loss ({countryInfo.currencySymbol})</label>
                <input
                  type="number"
                  value={settlement.estimatedTimeValueLoss}
                  onChange={(e) => handleUpdate({ estimatedTimeValueLoss: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono text-[var(--text-main)]"
                />
              </div>
            </div>
          </div>

          {/* Expected Value Result Card */}
          <div className="p-5 bg-gradient-to-br from-primary/10 via-[var(--bg-card)] to-background border-2 border-primary/40 custom-geometry space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Mathematical Expected Trial Value</span>
              <span className="text-[11px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 font-mono">
                EV Algorithm
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold font-mono text-[var(--text-main)]">
                {countryInfo.currencySymbol}{expectedValueTrial.toLocaleString()}
              </div>
              <span className="text-xs text-[var(--text-muted)]">net expected return</span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Based on a {settlement.winProbabilityPercent}% trial success likelihood, taking your claim of {countryInfo.currencySymbol}{settlement.claimDamages.toLocaleString()} to trial has a risk-discounted value of {countryInfo.currencySymbol}{expectedValueTrial.toLocaleString()} after deducting {countryInfo.currencySymbol}{totalLitigationCost.toLocaleString()} in estimated filing fees, service costs, and lost work time.
            </p>
          </div>

          {/* Settlement Terms Customizer */}
          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] font-mono flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>Rule 408 Agreement Terms Customizer</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Payment Window</label>
                <select
                  value={settlement.paymentWindowDays || 14}
                  onChange={(e) => handleUpdate({ paymentWindowDays: parseInt(e.target.value) })}
                  className="w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)] custom-geometry font-semibold"
                >
                  <option value={7}>7 Calendar Days (Urgent)</option>
                  <option value={10}>10 Calendar Days</option>
                  <option value={14}>14 Calendar Days (Standard)</option>
                  <option value={21}>21 Calendar Days</option>
                  <option value={30}>30 Calendar Days (Extended)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Payment Manner</label>
                <select
                  value={settlement.paymentMethod || 'wire_transfer'}
                  onChange={(e) => handleUpdate({ paymentMethod: e.target.value as any })}
                  className="w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)] custom-geometry font-semibold"
                >
                  <option value="wire_transfer">Direct Electronic Wire Transfer</option>
                  <option value="certified_check">Certified Cashier's Check</option>
                  <option value="installments">Structured 2-Part Installments</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[var(--text-main)]">
                <input
                  type="checkbox"
                  checked={settlement.includeConfidentiality ?? true}
                  onChange={(e) => handleUpdate({ includeConfidentiality: e.target.checked })}
                  className="rounded border-[var(--border-color)] text-primary accent-primary"
                />
                <span>Include Mutual Confidentiality Clause</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[var(--text-main)]">
                <input
                  type="checkbox"
                  checked={settlement.includeNonDisparagement ?? true}
                  onChange={(e) => handleUpdate({ includeNonDisparagement: e.target.checked })}
                  className="rounded border-[var(--border-color)] text-primary accent-primary"
                />
                <span>Include Mutual Non-Disparagement Clause</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: 3-Tier Negotiation Brackets & Offer Tracker (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Editable 3-Tier Negotiation Brackets */}
          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] font-mono">
                3-Tier Negotiation Brackets
              </h2>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Editable Targets</span>
            </div>

            {/* Tier 1: Opening Anchor */}
            <div className="p-3.5 bg-muted/40 border-l-4 border-amber-500 custom-geometry space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-400">Tier 1: Opening Demand Anchor</span>
                <div className="flex items-center gap-1 font-mono font-bold text-[var(--text-main)]">
                  <span>{countryInfo.currencySymbol}</span>
                  <input
                    type="number"
                    value={settlement.openingDemandAnchor}
                    onChange={(e) => handleUpdate({ openingDemandAnchor: parseInt(e.target.value) || 0 })}
                    className="w-24 bg-transparent border-b border-amber-500/50 text-right font-mono font-bold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Maximum justifiable legal demand including statutory penalties to anchor negotiation in your favor.
              </p>
            </div>

            {/* Tier 2: Target Fair Settlement */}
            <div className="p-3.5 bg-primary/10 border-l-4 border-primary custom-geometry space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-primary">Tier 2: Target Fair Compromise</span>
                <div className="flex items-center gap-1 font-mono font-bold text-[var(--text-main)]">
                  <span>{countryInfo.currencySymbol}</span>
                  <input
                    type="number"
                    value={settlement.targetFairSettlement}
                    onChange={(e) => handleUpdate({ targetFairSettlement: parseInt(e.target.value) || 0 })}
                    className="w-24 bg-transparent border-b border-primary/50 text-right font-mono font-bold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Optimal settlement sweet-spot: provides immediate guaranteed cash while avoiding months of litigation delay.
              </p>
            </div>

            {/* Tier 3: Walk-Away Floor */}
            <div className="p-3.5 bg-destructive/10 border-l-4 border-destructive custom-geometry space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-destructive">Tier 3: Walk-Away Floor</span>
                <div className="flex items-center gap-1 font-mono font-bold text-[var(--text-main)]">
                  <span>{countryInfo.currencySymbol}</span>
                  <input
                    type="number"
                    value={settlement.walkAwayFloor}
                    onChange={(e) => handleUpdate({ walkAwayFloor: parseInt(e.target.value) || 0 })}
                    className="w-24 bg-transparent border-b border-destructive/50 text-right font-mono font-bold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Absolute bottom line. If defendant offers less than {countryInfo.currencySymbol}{settlement.walkAwayFloor.toLocaleString()}, proceeding to judgment is mathematically superior.
              </p>
            </div>
          </div>

          {/* Settlement Offer History / Counter-Offer Logger */}
          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[var(--accent-gold)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] font-mono">
                  Offer &amp; Counter-Offer Log
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAddOfferModal(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-[var(--accent-gold)] text-slate-950 custom-geometry hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Offer</span>
              </button>
            </div>

            {(!settlement.offerHistory || settlement.offerHistory.length === 0) ? (
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry text-xs text-[var(--text-muted)] text-center space-y-1">
                <p>No settlement offers logged yet.</p>
                <p className="text-[11px]">When opposing counsel or defendant makes a settlement offer, log it here for instant risk evaluation against your 3-tier brackets.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {settlement.offerHistory.map(off => {
                  const isOpponent = off.offeredBy === 'opposing_party';
                  const isBelowFloor = off.amount < settlement.walkAwayFloor;
                  const isAboveTarget = off.amount >= settlement.targetFairSettlement;

                  return (
                    <div
                      key={off.id}
                      className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              isOpponent ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            }`}>
                              {isOpponent ? 'Opposing Offer' : 'Your Counter'}
                            </span>
                            <span className="font-mono text-[11px] text-[var(--text-muted)]">{off.offerDate}</span>
                          </div>
                          <div className="text-base font-bold font-mono text-[var(--text-main)] mt-1">
                            {countryInfo.currencySymbol}{off.amount.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteOffer(off.id)}
                            className="text-[var(--text-muted)] hover:text-rose-400 p-1"
                            title="Delete Log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Evaluation Pill */}
                      {isOpponent && (
                        <div className={`text-[10px] font-mono p-1.5 custom-geometry flex items-center gap-1.5 font-bold ${
                          isBelowFloor 
                            ? 'bg-rose-950/40 text-rose-300 border border-rose-500/40' 
                            : isAboveTarget 
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
                        }`}>
                          {isBelowFloor ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>BELOW FLOOR ({countryInfo.currencySymbol}{settlement.walkAwayFloor.toLocaleString()}) — REJECT &amp; COUNTER</span>
                            </>
                          ) : isAboveTarget ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>FAVORABLE OFFER — MEETS TARGET COMPROMISE</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>WITHIN COMPROMISE RANGE — CONSIDER COUNTERING +15%</span>
                            </>
                          )}
                        </div>
                      )}

                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {off.notes}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-[var(--border-color)]/60 text-[10px] font-mono">
                        <span className="text-[var(--text-muted)]">Window: {off.paymentWindowDays}d</span>
                        <div className="flex gap-1.5">
                          {(['received', 'countered', 'rejected', 'accepted'] as const).map(st => (
                            <button
                              key={st}
                              onClick={() => handleUpdateOfferStatus(off.id, st)}
                              className={`px-1.5 py-0.5 rounded capitalize ${
                                off.status === st 
                                  ? 'bg-[var(--accent-gold)] text-slate-950 font-bold' 
                                  : 'bg-black/30 text-[var(--text-muted)] hover:text-[var(--text-main)]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FRE 408 Shield Advisory */}
          <div className="p-4 bg-muted/40 border border-border/70 custom-geometry text-xs text-[var(--text-muted)] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>FRE 408 Evidentiary Immunity</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              All settlement compromise proposals generated here automatically include Federal Rule of Evidence 408 confidentiality protection headers. They cannot be shown to the judge at trial to prove weakness or diminished claim value.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Modal: Add Offer Log */}
      {showAddOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Log Settlement Offer / Counter
              </h3>
              <button 
                onClick={() => setShowAddOfferModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOfferLog} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Offered By</label>
                <select
                  value={offeredBy}
                  onChange={e => setOfferedBy(e.target.value as any)}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 font-semibold"
                >
                  <option value="opposing_party">Opposing Party / Defendant</option>
                  <option value="plaintiff">Plaintiff (Your Compromise Offer)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Settlement Dollar Amount ({countryInfo.currencySymbol})</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={offerAmount}
                  onChange={e => setOfferAmount(parseInt(e.target.value) || 0)}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Payment Window (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={offerWindowDays}
                  onChange={e => setOfferWindowDays(parseInt(e.target.value) || 14)}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Status</label>
                <select
                  value={offerStatus}
                  onChange={e => setOfferStatus(e.target.value as any)}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                >
                  <option value="received">Received / Under Review</option>
                  <option value="countered">Countered</option>
                  <option value="rejected">Rejected</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Notes &amp; Stipulations</label>
                <textarea
                  value={offerNotes}
                  onChange={e => setOfferNotes(e.target.value)}
                  placeholder="e.g. Defendant offered $3,000 conditioned on immediate dismissal and mutual non-disparagement..."
                  rows={3}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowAddOfferModal(false)}
                  className="btn-geom px-4 py-2 text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-geom px-4 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90"
                >
                  Save to Settlement Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formal Settlement Agreement & Mutual Release Modal */}
      <SettlementAgreementModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
      />
    </div>
  );
};

