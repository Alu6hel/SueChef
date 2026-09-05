import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { SettlementCalculation } from '../../types';
import { sound } from '../../services/soundEngine';
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
  AlertCircle 
} from 'lucide-react';

export const SettlementMatrix: React.FC = () => {
  const { activeCase, updateActiveCase } = useSueChef();
  const [copiedLetter, setCopiedLetter] = useState(false);

  const settlement: SettlementCalculation = activeCase.settlement || {
    claimDamages: activeCase.claimEvaluation.damages.reduce((sum, d) => sum + (d.amount || 0), 0) || 5000,
    winProbabilityPercent: 80,
    courtFilingFees: 185,
    processServiceFees: 75,
    expertWitnessFees: 0,
    estimatedTimeValueLoss: 400,
    openingDemandAnchor: 5000,
    targetFairSettlement: 4000,
    walkAwayFloor: 2500
  };

  const totalLitigationCost = 
    settlement.courtFilingFees + 
    settlement.processServiceFees + 
    settlement.expertWitnessFees + 
    settlement.estimatedTimeValueLoss;

  // Expected Value formula: (Damages * WinProb) - LitigationCosts
  const expectedValueTrial = Math.max(0, Math.round(
    (settlement.claimDamages * (settlement.winProbabilityPercent / 100)) - totalLitigationCost
  ));

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

  const handleCopySettlementLetter = () => {
    sound.playDocketStamp();
    const pl = activeCase.parties.find(p => p.role === 'plaintiff');
    const df = activeCase.parties.find(p => p.role === 'defendant');

    const letter = `CONFIDENTIAL SETTLEMENT COMMUNICATION
PROTECTED UNDER FRE 408 / STATE EVIDENCE CODE § 1152
INADMISSIBLE IN ANY JUDICIAL PROCEEDING

DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
TO: ${df?.name || 'DEFENDANT'}
RE: SETTLEMENT PROPOSAL & COMPROMISE OF CLAIMS
MATTER: ${activeCase.title} (Case No.: ${activeCase.caseNumber})

Dear ${df?.name || 'Defendant'}:

This letter constitutes a formal compromise offer pursuant to Federal Rule of Evidence 408 and applicable state statutory settlement protections.

Plaintiff ${pl?.name || 'Plaintiff'} is prepared to fully resolve and discharge all disputed civil claims against ${df?.name || 'Defendant'} upon satisfaction of the following terms:

1. SETTLEMENT PAYMENT SUM:
   Defendant shall pay to Plaintiff the total compromised sum of $${settlement.targetFairSettlement.toLocaleString()}.00 in full settlement.

2. PAYMENT TERMS & SCHEDULE:
   Full payment shall be delivered via certified cashier’s check or direct wire transfer within fourteen (14) calendar days of execution of the formal settlement agreement.

3. MUTUAL DISMISSAL WITH PREJUDICE:
   Upon confirmed receipt and clearance of the settlement funds, Plaintiff shall file a formal Request for Dismissal with Prejudice in ${activeCase.courtName}, with each party bearing their own respective costs and attorney fees.

4. EXPIRATION OF OFFER:
   This settlement compromise offer shall expire at 5:00 PM on the 10th business day following delivery. Should this offer lapse without written acceptance, Plaintiff will proceed to judicial trial seeking full actual and statutory damages of $${settlement.claimDamages.toLocaleString()}.00 plus allowable court costs.

Respectfully submitted,

________________________________________
${pl?.name || 'Plaintiff in Pro Se'}
${pl?.phone || ''} | ${pl?.email || ''}
`;

    navigator.clipboard.writeText(letter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-card/60 border border-border/80 custom-geometry">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary custom-geometry">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide font-serif">Settlement Negotiation & Risk Matrix</h1>
            <p className="text-xs text-muted-foreground">
              Mathematical risk modeling, Expected Value (EV) calculation, and Rule 408 settlement drafter.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySettlementLetter}
          className="flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
        >
          {copiedLetter ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>Copy Rule 408 Settlement Offer</span>
        </button>
      </div>

      {/* Grid: Risk Algorithm & Brackets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-card border border-border custom-geometry space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 font-mono">
              <Sliders className="w-4 h-4" />
              <span>Litigation Risk Parameters</span>
            </h2>

            {/* Claim Damages */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold">Total Claimed Damages &amp; Penalties</span>
                <span className="font-mono font-bold text-primary">${settlement.claimDamages.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="250"
                value={settlement.claimDamages}
                onChange={(e) => handleUpdate({ claimDamages: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Win Probability Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold">Assessed Win Probability at Trial</span>
                <span className="font-mono font-bold text-emerald-400">{settlement.winProbabilityPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="99"
                step="1"
                value={settlement.winProbabilityPercent}
                onChange={(e) => handleUpdate({ winProbabilityPercent: parseInt(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Filing & Service Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Court Filing Fee ($)</label>
                <input
                  type="number"
                  value={settlement.courtFilingFees}
                  onChange={(e) => handleUpdate({ courtFilingFees: parseInt(e.target.value) || 0 })}
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Process Server Fee ($)</label>
                <input
                  type="number"
                  value={settlement.processServiceFees}
                  onChange={(e) => handleUpdate({ processServiceFees: parseInt(e.target.value) || 0 })}
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Expert / Inspection Fee ($)</label>
                <input
                  type="number"
                  value={settlement.expertWitnessFees}
                  onChange={(e) => handleUpdate({ expertWitnessFees: parseInt(e.target.value) || 0 })}
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Time / Wage Opportunity Loss ($)</label>
                <input
                  type="number"
                  value={settlement.estimatedTimeValueLoss}
                  onChange={(e) => handleUpdate({ estimatedTimeValueLoss: parseInt(e.target.value) || 0 })}
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Expected Value Result Card */}
          <div className="p-5 bg-gradient-to-br from-primary/10 via-card to-background border border-primary/30 custom-geometry space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted-foreground">Mathematical Expected Trial Value</span>
              <span className="text-[11px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 font-mono">
                EV Algorithm
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold font-mono text-foreground">
                ${expectedValueTrial.toLocaleString()}
              </div>
              <span className="text-xs text-muted-foreground">net expected return</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on a {settlement.winProbabilityPercent}% trial success likelihood, taking your claim of ${settlement.claimDamages.toLocaleString()} to trial has a risk-discounted value of ${expectedValueTrial.toLocaleString()} after deducting ${totalLitigationCost.toLocaleString()} in estimated filing fees, service costs, and lost work time.
            </p>
          </div>
        </div>

        {/* Right Column: 3-Tier Negotiation Brackets (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-card border border-border custom-geometry space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              3-Tier Negotiation Brackets
            </h2>

            {/* Tier 1: Opening Anchor */}
            <div className="p-3.5 bg-muted/40 border-l-4 border-amber-500 custom-geometry space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-400">Tier 1: Opening Demand Anchor</span>
                <span className="font-mono font-bold text-foreground">
                  ${settlement.openingDemandAnchor.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Maximum justifiable legal demand including statutory penalties to anchor negotiation in your favor.
              </p>
            </div>

            {/* Tier 2: Target Fair Settlement */}
            <div className="p-3.5 bg-primary/10 border-l-4 border-primary custom-geometry space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-primary">Tier 2: Target Fair Compromise</span>
                <span className="font-mono font-bold text-foreground">
                  ${settlement.targetFairSettlement.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Optimal settlement sweet-spot: provides immediate guaranteed cash while avoiding months of litigation delay.
              </p>
            </div>

            {/* Tier 3: Walk-Away Floor */}
            <div className="p-3.5 bg-destructive/10 border-l-4 border-destructive custom-geometry space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-destructive">Tier 3: Walk-Away Floor</span>
                <span className="font-mono font-bold text-foreground">
                  ${settlement.walkAwayFloor.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Absolute bottom line. If defendant offers less than ${settlement.walkAwayFloor.toLocaleString()}, proceeding to judgment is mathematically superior.
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted/40 border border-border/70 custom-geometry text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>FRE 408 Evidentiary Immunity</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              All settlement compromise proposals generated here automatically include Federal Rule of Evidence 408 confidentiality protection headers. They cannot be shown to the judge at trial to prove weakness or diminished claim value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
