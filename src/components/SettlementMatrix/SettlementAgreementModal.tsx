import React, { useState } from 'react';
import { FileText, Printer, Copy, Check, X, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { getCountryInfo } from '../../services/countries';

interface SettlementAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettlementAgreementModal: React.FC<SettlementAgreementModalProps> = ({ isOpen, onClose }) => {
  const { activeCase, country } = useSueChef();
  const countryInfo = getCountryInfo(country);
  const [copied, setCopied] = useState(false);
  const [includeConfidentiality, setIncludeConfidentiality] = useState(true);
  const [includeAccelerationClause, setIncludeAccelerationClause] = useState(true);

  if (!isOpen) return null;

  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff') || activeCase.parties[0];
  const defendant = activeCase.parties.find(p => p.role === 'defendant') || activeCase.parties[1];

  const settlementAmount = activeCase.settlement?.targetFairSettlement || 
    Math.round(activeCase.claimEvaluation.damages.reduce((sum, d) => sum + (d.amount || 0), 0) * 0.8) || 3500;
  
  const paymentDays = activeCase.settlement?.paymentWindowDays || 14;

  const agreementText = `SETTLEMENT AGREEMENT AND MUTUAL GENERAL RELEASE
================================================================================
THIS SETTLEMENT AGREEMENT AND MUTUAL GENERAL RELEASE ("Agreement") is made and 
entered into as of this _____ day of _______________, 2026, by and between:

CLAIMANT / PLAINTIFF:
${plaintiff?.name || 'Plaintiff'}
${plaintiff?.address || '123 Main St'}, ${plaintiff?.city || 'City'}, ${plaintiff?.state || 'CA'} ${plaintiff?.zip || '90001'}

AND

RELEASEE / DEFENDANT:
${defendant?.name || 'Defendant Entity LLC'}
${defendant?.address || '456 Business Blvd'}, ${defendant?.city || 'City'}, ${defendant?.state || 'CA'} ${defendant?.zip || '90015'}

(Individually referred to as a "Party" and collectively as the "Parties".)

RECITALS
--------------------------------------------------------------------------------
A. A dispute has arisen between the Parties concerning: ${activeCase.title || 'alleged contractual breaches and statutory claims'}.
B. The dispute is currently pending or subject to immediate filing in ${activeCase.courtName || 'the Small Claims Division'} under Case No. ${activeCase.caseNumber || 'CIV-2026-PENDING'}.
C. The Parties desire to compromise, settle, and fully resolve all claims, disputes, and controversies between them without admitting liability.

NOW, THEREFORE, in consideration of the mutual covenants and promises herein contained, 
the Parties agree as follows:

1. SETTLEMENT CONSIDERATION & PAYMENT TERMS:
   Defendant agrees to pay Claimant the total compromise sum of:
   ${countryInfo.currencySymbol}${settlementAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${countryInfo.name} Currency)
   Payment shall be delivered to Claimant via ${activeCase.settlement?.paymentMethod || 'Certified Bank Check or Wire Transfer'} within ${paymentDays} calendar days 
   of the full execution of this Agreement (no later than _______________, 2026).

${includeAccelerationClause ? `2. DEFAULT ACCELERATION & STIPULATED JUDGMENT CLAUSE:
   TIME IS STRICTLY OF THE ESSENCE. In the event Defendant fails to tender the full 
   settlement sum on or before the due date specified in Section 1, Claimant shall 
   provide a 3-day written notice of default. If Defendant fails to cure within 
   3 days, this Agreement shall be deemed in material default, and:
   a. The full original claimed principal sum of ${countryInfo.currencySymbol}${(settlementAmount * 1.35).toFixed(2)} plus a 20% statutory liquidated penalty shall immediately become due and payable.
   b. Claimant shall be entitled to immediate entry of a Stipulated Judgment in ${activeCase.courtName || 'Court'} for the full accelerated amount plus all incurred attorney's fees, court costs, and post-judgment interest at the legal rate, without further hearing or notice to Defendant.` : ''}

3. DISMISSAL OF PENDING ACTION:
   Within five (5) business days following Claimant's receipt and confirmed bank clearance 
   of the full settlement funds, Claimant shall execute and file a formal Request for 
   Dismissal with Prejudice (Form CIV-110) of the pending legal action.

4. MUTUAL GENERAL RELEASE OF ALL CLAIMS:
   Except for the obligations created by this Agreement, Claimant and Defendant hereby 
   fully, irrevocably, and unconditionally release, acquit, and forever discharge each 
   other from any and all claims, demands, liabilities, suits, debts, covenants, and causes 
   of action of any kind, whether known or unknown, suspected or unsuspected, arising out 
   of or related to the underlying dispute.

5. EXPRESS WAIVER OF UNKNOWN CLAIMS (CALIFORNIA CIVIL CODE § 1542):
   The Parties acknowledge that they have been advised of and expressly waive the provisions 
   of California Civil Code Section 1542 (and any equivalent statute of any other jurisdiction), 
   which provides:
   "A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS THAT THE CREDITOR OR RELEASING PARTY 
   DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE TIME OF EXECUTING 
   THE RELEASE AND THAT, IF KNOWN BY HIM OR HER, WOULD HAVE MATERIALLY AFFECTED 
   HIS OR HER SETTLEMENT WITH THE DEBTOR OR RELEASED PARTY."

${includeConfidentiality ? `6. CONFIDENTIALITY & MUTUAL NON-DISPARAGEMENT:
   The terms and conditions of this Agreement shall remain strictly confidential. 
   Neither Party shall publish, disparage, or post negative reviews concerning the 
   other on any public forum, social media network, or commercial review platform.` : ''}

7. GOVERNING LAW & JURISDICTION:
   This Agreement shall be construed, interpreted, and governed by the laws of 
   ${activeCase.state || 'California'}. The court in which the action was pending shall 
   retain jurisdiction to enforce this settlement pursuant to CCP § 664.6.

IN WITNESS WHEREOF, the Parties have executed this Settlement Agreement as of the date first written above.

CLAIMANT / PLAINTIFF:                        DEFENDANT / RELEASEE:

________________________________________     ________________________________________
${plaintiff?.name || 'Plaintiff'}            ${defendant?.name || 'Defendant Entity LLC'}
Date: __________________________________     Date: __________________________________
`;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(agreementText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    sound.playDocketStamp();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="card-geom bg-slate-950 border-2 border-[var(--accent-gold)] p-6 max-w-4xl w-full space-y-5 shadow-2xl my-8 text-slate-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--accent-gold)]/40 pb-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 card-geom bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Formal Settlement Agreement &amp; Mutual Release
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Enforceable settlement contract with default acceleration &amp; CCP § 664.6 retention
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Agreement</span>
            </button>
            <button
              onClick={handleCopy}
              className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-slate-800 border border-slate-600 hover:border-slate-400 text-slate-200 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Contract Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clause Toggles */}
        <div className="flex flex-wrap items-center gap-4 p-3 bg-slate-900 border border-white/10 card-geom text-xs no-print">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeAccelerationClause}
              onChange={e => setIncludeAccelerationClause(e.target.checked)}
              className="rounded accent-[var(--accent-gold)]"
            />
            <span className="font-bold text-emerald-300">Include Default Acceleration Clause (Mandatory Protection)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeConfidentiality}
              onChange={e => setIncludeConfidentiality(e.target.checked)}
              className="rounded accent-[var(--accent-gold)]"
            />
            <span className="text-slate-300">Confidentiality &amp; Non-Disparagement</span>
          </label>
        </div>

        {/* Contract Preview */}
        <div className="bg-slate-900/90 border border-white/10 p-5 rounded font-mono text-xs text-slate-200 overflow-x-auto max-h-[460px] overflow-y-auto whitespace-pre leading-relaxed select-text shadow-inner">
          {agreementText}
        </div>
      </div>
    </div>
  );
};
