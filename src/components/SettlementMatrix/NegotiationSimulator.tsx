import React, { useState } from 'react';
import { MessageSquare, DollarSign, TrendingDown, ArrowRight, ShieldCheck, Scale, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { getCountryInfo } from '../../services/countries';

interface NegotiationTurn {
  speaker: 'adjuster' | 'plaintiff';
  amount?: number;
  message: string;
  tactic: string;
}

export const NegotiationSimulator: React.FC = () => {
  const { activeCase, country } = useSueChef();
  const countryInfo = getCountryInfo(country);

  const claimDamages = activeCase.settlement?.claimDamages || 
    activeCase.claimEvaluation.damages.reduce((sum, d) => sum + (d.amount || 0), 0) || 5000;
  const targetFair = activeCase.settlement?.targetFairSettlement || Math.round(claimDamages * 0.75);
  const walkAway = activeCase.settlement?.walkAwayFloor || Math.round(claimDamages * 0.5);

  const [currentAdjusterOffer, setCurrentAdjusterOffer] = useState<number>(Math.round(claimDamages * 0.25));
  const [round, setRound] = useState<number>(1);
  const [dialogue, setDialogue] = useState<NegotiationTurn[]>([
    {
      speaker: 'adjuster',
      amount: Math.round(claimDamages * 0.25),
      message: `Claimant, our risk review committee evaluated your demand letter. We dispute substantial portions of your claimed damages and consider your statutory penalty threats speculative. However, to avoid litigation inconvenience, we are authorized to extend a one-time nuisance settlement offer of ${countryInfo.currencySymbol}${Math.round(claimDamages * 0.25).toLocaleString()} in exchange for a full mutual release.`,
      tactic: 'Lowball Anchor & Liability Denial'
    }
  ]);
  const [negotiationEnded, setNegotiationEnded] = useState<boolean>(false);
  const [finalVerdict, setFinalVerdict] = useState<string | null>(null);

  const handleStandFirm = () => {
    sound.playClick();
    const plaintiffTurn: NegotiationTurn = {
      speaker: 'plaintiff',
      amount: claimDamages,
      message: `We reject your lowball offer. Under governing statutory law, our verified documentary evidence conclusively establishes breach of duty. If forced to file the complaint, we will seek the full principal sum of ${countryInfo.currencySymbol}${claimDamages.toLocaleString()} plus statutory multiplier penalties and court costs.`,
      tactic: 'Statutory Fortress Re-Anchor'
    };

    // Adjuster response: raises offer by ~15-20%
    const nextAdjusterAmount = Math.min(targetFair, Math.round(currentAdjusterOffer + claimDamages * 0.18));
    setCurrentAdjusterOffer(nextAdjusterAmount);

    let adjusterMsg = '';
    let tactic = '';
    if (round === 1) {
      adjusterMsg = `We understand your position, but trial carries substantial risk and judicial delay. I reached out to my supervisor and secured expanded authority to increase our offer to ${countryInfo.currencySymbol}${nextAdjusterAmount.toLocaleString()}. This represents fair compensation without months in court.`;
      tactic = 'Supervisor Authority Concession';
    } else {
      adjusterMsg = `This is our absolute ceiling. We will offer ${countryInfo.currencySymbol}${nextAdjusterAmount.toLocaleString()} paid within 10 business days. Take it or we will proceed to hearing and contest every exhibit.`;
      tactic = 'Final "Take It or Leave It" Anchor';
    }

    const adjusterTurn: NegotiationTurn = {
      speaker: 'adjuster',
      amount: nextAdjusterAmount,
      message: adjusterMsg,
      tactic
    };

    setDialogue(prev => [...prev, plaintiffTurn, adjusterTurn]);
    setRound(prev => prev + 1);
  };

  const handleCounterOffer = () => {
    sound.playClick();
    const counterAmount = Math.round((claimDamages + currentAdjusterOffer) / 2);

    const plaintiffTurn: NegotiationTurn = {
      speaker: 'plaintiff',
      amount: counterAmount,
      message: `In the spirit of good-faith compromise and immediate resolution, we are willing to meet in the middle at ${countryInfo.currencySymbol}${counterAmount.toLocaleString()}, provided payment is delivered via wire transfer within 7 business days with a default acceleration clause.`,
      tactic: 'Reciprocal Concession & Speed Incentive'
    };

    const nextAdjusterAmount = Math.min(targetFair, Math.round((currentAdjusterOffer + counterAmount) / 2));
    setCurrentAdjusterOffer(nextAdjusterAmount);

    const adjusterTurn: NegotiationTurn = {
      speaker: 'adjuster',
      amount: nextAdjusterAmount,
      message: `We appreciate your willingness to narrow the gap. We cannot quite meet ${countryInfo.currencySymbol}${counterAmount.toLocaleString()}, but we can close at ${countryInfo.currencySymbol}${nextAdjusterAmount.toLocaleString()} with standard confidentiality and a mutual release.`,
      tactic: 'Bracket Closure Concession'
    };

    setDialogue(prev => [...prev, plaintiffTurn, adjusterTurn]);
    setRound(prev => prev + 1);
  };

  const handleAccept = () => {
    sound.playSuccessChime();
    setNegotiationEnded(true);
    setFinalVerdict(`Deal Reached at ${countryInfo.currencySymbol}${currentAdjusterOffer.toLocaleString()}! You successfully negotiated the defense adjuster up by +${Math.round(((currentAdjusterOffer - dialogue[0].amount!) / dialogue[0].amount!) * 100)}% above their initial lowball.`);
  };

  const handleWalkAway = () => {
    sound.playWarningBell();
    setNegotiationEnded(true);
    setFinalVerdict(`Negotiation Terminated. Defense offer of ${countryInfo.currencySymbol}${currentAdjusterOffer.toLocaleString()} was below your Walk-Away Floor (${countryInfo.currencySymbol}${walkAway.toLocaleString()}). Proceeding directly to formal court filing and trial.`);
  };

  const handleReset = () => {
    sound.playGavelStrike();
    setCurrentAdjusterOffer(Math.round(claimDamages * 0.25));
    setRound(1);
    setNegotiationEnded(false);
    setFinalVerdict(null);
    setDialogue([
      {
        speaker: 'adjuster',
        amount: Math.round(claimDamages * 0.25),
        message: `Claimant, our risk review committee evaluated your demand letter. We dispute substantial portions of your claimed damages and consider your statutory penalty threats speculative. However, to avoid litigation inconvenience, we are authorized to extend a one-time nuisance settlement offer of ${countryInfo.currencySymbol}${Math.round(claimDamages * 0.25).toLocaleString()} in exchange for a full mutual release.`,
        tactic: 'Lowball Anchor & Liability Denial'
      }
    ]);
  };

  return (
    <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-5 shadow-xl animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40 uppercase">
              AI Negotiation Sparring Partner
            </span>
            <span className="font-bold text-sm text-[var(--text-main)]">
              Arthur Vance, Senior Defense Claims Adjuster
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
            Roleplay against corporate claim lowballs &bull; Learn when to push back and when to settle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-right">
            <div className="text-[9px] font-mono uppercase text-[var(--text-muted)]">Current Defense Offer</div>
            <div className="font-mono font-bold text-base text-emerald-400">
              {countryInfo.currencySymbol}{currentAdjusterOffer.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dialogue Thread */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {dialogue.map((turn, i) => (
          <div
            key={i}
            className={`p-3.5 card-geom border space-y-1.5 ${
              turn.speaker === 'adjuster'
                ? 'bg-[var(--bg-secondary)] border-[var(--border-color)] mr-8'
                : 'bg-indigo-950/30 border-indigo-500/40 ml-8 text-right'
            }`}
          >
            <div className={`flex items-center justify-between text-[10px] font-mono ${
              turn.speaker === 'adjuster' ? 'text-amber-400' : 'text-indigo-300'
            }`}>
              <span className="font-bold">
                {turn.speaker === 'adjuster' ? '💼 DEFENSE ADJUSTER' : '🧑‍💼 YOU (CLAIMANT)'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                Tactic: {turn.tactic}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {turn.message}
            </p>
          </div>
        ))}
      </div>

      {/* Outcome Verdict or Action Controls */}
      {negotiationEnded ? (
        <div className="p-4 card-geom bg-emerald-950/40 border border-emerald-500 space-y-2 text-center animate-fadeIn">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="font-serif font-bold text-sm text-emerald-300">
            Negotiation Exercise Concluded
          </h4>
          <p className="text-xs text-slate-200 max-w-xl mx-auto">
            {finalVerdict}
          </p>
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="btn-geom px-4 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90"
            >
              Run Another Negotiation Scenario
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
          <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
            Select Your Negotiation Move (Round {round}):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleStandFirm}
              className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-amber-400 text-left transition-all text-xs space-y-1"
            >
              <div className="font-bold text-amber-300">1. Stand Firm on Anchor</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono leading-tight">
                Reject lowball and cite statutory damages &amp; trial risk.
              </div>
            </button>

            <button
              onClick={handleCounterOffer}
              className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-indigo-400 text-left transition-all text-xs space-y-1"
            >
              <div className="font-bold text-indigo-300">2. Concession (Split Difference)</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono leading-tight">
                Offer reasonable bracket closure with fast payment window.
              </div>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAccept}
                className="p-2 card-geom bg-emerald-950/40 border border-emerald-500/60 hover:bg-emerald-900/50 text-emerald-300 text-center font-bold text-xs transition-all"
              >
                Accept Offer ({countryInfo.currencySymbol}{currentAdjusterOffer.toLocaleString()})
              </button>

              <button
                onClick={handleWalkAway}
                className="p-2 card-geom bg-rose-950/40 border border-rose-500/60 hover:bg-rose-900/50 text-rose-300 text-center font-bold text-xs transition-all"
              >
                Walk Away &amp; File Suit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
