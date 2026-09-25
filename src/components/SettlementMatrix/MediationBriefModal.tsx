import React, { useState } from 'react';
import { FileText, Printer, Copy, Check, X, ShieldCheck, Scale } from 'lucide-react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { getCountryInfo } from '../../services/countries';
import { cleanPartyName, deriveCaseTitle } from '../../services/caseUtils';

interface MediationBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediationBriefModal: React.FC<MediationBriefModalProps> = ({ isOpen, onClose }) => {
  const { activeCase, totalDamages, country } = useSueChef();
  const countryInfo = getCountryInfo(country);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pl = activeCase.parties.find(p => p.role === 'plaintiff') || activeCase.parties[0];
  const df = activeCase.parties.find(p => p.role === 'defendant') || activeCase.parties[1];
  const pName = pl ? cleanPartyName(pl.name) : 'Plaintiff';
  const dName = df ? cleanPartyName(df.name) : 'Defendant';

  const settlement = activeCase.settlement;
  const targetOffer = settlement?.targetFairSettlement || Math.round(totalDamages * 0.85);

  const generateBrief = () => {
    let out = `================================================================================
CONFIDENTIAL MEDIATION STATEMENT & SETTLEMENT CONFERENCE BRIEF
PROTECTED UNDER FRE 408 / CAL. EVID. CODE § 1119 (MEDIATION PRIVILEGE)
NOT FOR JUDICIAL FILING • FOR MEDIATOR EYES ONLY
================================================================================

COURT / FORUM:   ${activeCase.courtName.toUpperCase()}
COUNTY / STATE:  ${activeCase.county.toUpperCase()}, ${activeCase.state}
CASE NUMBER:     ${activeCase.caseNumber || 'CIVIL ACTION'}
MATTER:          ${deriveCaseTitle(pName, dName)}
PARTY SUBMITTING: ${pName} (Plaintiff in Pro Se)
DATE OF SESSION: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

--------------------------------------------------------------------------------
1. EXECUTIVE SUMMARY & STATEMENT OF DISPUTE:
Plaintiff ${pName} brings this civil action against Defendant ${dName} arising out of:
${activeCase.title || 'Breach of contractual covenants and wrongful withholding of funds.'}
Defendant failed to timely perform legal and contractual obligations despite formal written demand.

Plaintiff has complied with all pre-litigation notice protocols, demanded cure in writing,
and offered good-faith compromise without judicial intervention. Defendant has refused
to remit undisputed amounts, compelling Plaintiff to initiate formal court proceedings.

--------------------------------------------------------------------------------
2. LEGAL CAUSES OF ACTION & STATUTORY STANDARDS:
${activeCase.claimEvaluation.elements.map(e => `• ${e.title}: ${e.legalStandard} [${e.isSatisfied ? 'PROVEN BY RECORD' : 'AT ISSUE'}]`).join('\n')}

--------------------------------------------------------------------------------
3. KEY AUTHENTICATED EXHIBITS IN RECORD:
${activeCase.evidenceList.slice(0, 5).map((ev, i) => `[Exhibit ${String.fromCharCode(65 + i)}] ${ev.title} (${ev.category.toUpperCase()})
  Custodian: ${ev.custodian} | Date: ${ev.dateAcquired} | SHA-256: ${ev.sha256Hash.substring(0, 24)}...`).join('\n\n')}

--------------------------------------------------------------------------------
4. ITEMIZED ECONOMIC DAMAGES & STATUTORY RELIEF:
${activeCase.claimEvaluation.damages.map(d => `• ${d.description}: ${countryInfo.currencySymbol}${d.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`).join('\n')}
--------------------------------------------------------------------------------
TOTAL MONETARY DAMAGES SOUGHT AT TRIAL: ${countryInfo.currencySymbol}${totalDamages.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
PLUS STATUTORY FILING FEES & ACCRUING PREJUDGMENT INTEREST.

--------------------------------------------------------------------------------
5. PRIOR SETTLEMENT DISCUSSIONS & GOOD-FAITH POSITION:
• Plaintiff's Formal Opening Demand:     ${countryInfo.currencySymbol}${settlement?.openingDemandAnchor?.toLocaleString() || totalDamages.toLocaleString()}
• Plaintiff's Target Settlement Point:   ${countryInfo.currencySymbol}${targetOffer.toLocaleString()}
• Plaintiff's Walk-Away Trial Floor:     ${countryInfo.currencySymbol}${settlement?.walkAwayFloor?.toLocaleString() || Math.round(totalDamages * 0.7).toLocaleString()}

Plaintiff enters this mediation in good faith to resolve this dispute expeditiously and
avoid unnecessary court trial time. If Defendant agrees to pay ${countryInfo.currencySymbol}${targetOffer.toLocaleString()}
within 10 business days under an enforceable settlement stipulation, Plaintiff is prepared
to execute a mutual general release and dismiss the pending action with prejudice.

CONFIDENTIALITY NOTICE:
Pursuant to Federal Rule of Evidence 408 and State Mediation Confidentiality Statutes,
nothing contained in this brief or disclosed during mediation shall be admissible in any
subsequent trial or hearing.

Respectfully submitted,

_____________________________________________________
${pName}, Plaintiff in Pro Se
`;
    return out;
  };

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(generateBrief());
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
            <div className="p-2 card-geom bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                <span>1-Page Confidential Mediation Statement &amp; Brief</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 uppercase">
                  FRE 408 ADR
                </span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Court-ready settlement conference brief for independent mediators &amp; judicial settlement officers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>
            <button
              onClick={handleCopy}
              className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-slate-800 border border-slate-600 hover:border-slate-400 text-slate-200 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Brief Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Preview */}
        <div className="bg-slate-900/90 border border-white/10 p-5 rounded font-mono text-xs text-slate-200 overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre leading-relaxed select-text shadow-inner">
          {generateBrief()}
        </div>
      </div>
    </div>
  );
};

export default MediationBriefModal;
