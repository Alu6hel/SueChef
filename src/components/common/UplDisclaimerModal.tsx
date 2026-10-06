import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { triggerHaptic } from '../../services/fileExport';
import { 
  Scale, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  Lock,
  X
} from 'lucide-react';

export const UplDisclaimerModal: React.FC = () => {
  const { isUplModalOpen, setIsUplModalOpen } = useSueChef();
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [hasAcknowledgedPrivilege, setHasAcknowledgedPrivilege] = useState(false);

  if (!isUplModalOpen) return null;

  const handleAccept = () => {
    if (!hasAcknowledged || !hasAcknowledgedPrivilege) return;
    sound.playSuccessChime();
    triggerHaptic(50);
    localStorage.setItem('suechef_upl_accepted', 'true');
    setIsUplModalOpen(false);
  };

  return (
    <div 
      id="modal-upl-disclaimer" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] card-geom shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[var(--text-main)]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 card-geom bg-amber-500/10 border border-amber-500/30 text-[var(--accent-gold)]">
              <Scale className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--accent-gold)] block">
                MANDATORY STATUTORY COMPLIANCE • ABA MODEL RULE 5.5
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-main)]">
                Unauthorized Practice of Law (UPL) Notice
              </h2>
            </div>
          </div>
          {/* Allow close only if already accepted before */}
          {localStorage.getItem('suechef_upl_accepted') === 'true' && (
            <button
              onClick={() => {
                sound.playClick();
                setIsUplModalOpen(false);
              }}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-all"
              title="Close Notice"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed">
          {/* Main Primary Click-Wrap Disclaimer */}
          <div className="p-4 rounded-none border-l-4 border-[var(--accent-gold)] bg-amber-500/5 text-[var(--text-main)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--accent-gold)] font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>LEGAL PREPARATION & EDUCATIONAL SELF-HELP PLATFORM ONLY</span>
            </div>
            <p className="font-serif italic text-[13px] sm:text-sm text-[var(--text-main)] leading-relaxed font-semibold">
              "SueChef is a legal preparation, document organization, and self-help educational platform. 
              SueChef is NOT a law firm and its software does not provide legal advice or create an attorney-client relationship. 
              Users represent themselves pro se or must retain licensed legal counsel."
            </p>
          </div>

          {/* Detailed Regulatory Disclosures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1.5">
              <span className="font-mono font-bold text-[var(--accent-gold)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                1. Pro Se Self-Representation
              </span>
              <p className="text-[var(--text-muted)] leading-normal">
                You are representing yourself in court as a self-represented pro se litigant. All templates, calculations, and pleading sheets are automated tools that require your own independent verification.
              </p>
            </div>

            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1.5">
              <span className="font-mono font-bold text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                2. Evidentiary Privilege Notice
              </span>
              <p className="text-[var(--text-muted)] leading-normal">
                Information and documents entered into SueChef are not protected by attorney-client privilege until transmitted to a licensed attorney retained to represent you.
              </p>
            </div>

            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1.5">
              <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                3. 100% Offline Device Privacy
              </span>
              <p className="text-[var(--text-muted)] leading-normal">
                All cases, evidence SHA-256 hashes, and documents remain strictly on your local device. SueChef operates zero cloud collection servers and transmits no client legal records.
              </p>
            </div>

            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1.5">
              <span className="font-mono font-bold text-sky-400 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                4. Statutory Bar Compliance
              </span>
              <p className="text-[var(--text-muted)] leading-normal">
                Complies with American Bar Association (ABA) Model Rule 5.5 and State Bar Pro Se Access to Justice Guidelines across all 50 U.S. states and international jurisdictions.
              </p>
            </div>
          </div>

          {/* Evidentiary Checklist Confirmation */}
          <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
            <label className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] cursor-pointer transition-all select-none">
              <input
                type="checkbox"
                id="checkbox-upl-acknowledge"
                checked={hasAcknowledged}
                onChange={e => {
                  sound.playClick();
                  setHasAcknowledged(e.target.checked);
                }}
                className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 focus:ring-offset-0 bg-slate-900 border-slate-700"
              />
              <span className="text-xs text-[var(--text-main)]">
                <strong>I acknowledge and agree:</strong> SueChef is not a law firm, does not provide legal advice, does not guarantee litigation outcomes, and I assume sole responsibility for all court filings.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-rose-400 cursor-pointer transition-all select-none">
              <input
                type="checkbox"
                id="checkbox-privilege-acknowledge"
                checked={hasAcknowledgedPrivilege}
                onChange={e => {
                  sound.playClick();
                  setHasAcknowledgedPrivilege(e.target.checked);
                }}
                className="mt-1 w-4 h-4 rounded text-rose-500 focus:ring-rose-400 focus:ring-offset-0 bg-slate-900 border-slate-700"
              />
              <span className="text-xs text-[var(--text-main)]">
                <strong>I understand the Evidentiary Privilege Limitation:</strong> Information stored locally in SueChef is not covered by attorney-client privilege until retained counsel receives it.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-[var(--text-muted)] text-center sm:text-left">
            Terms of Use & Pro Se Self-Help Protocol v1.0.0
          </span>

          <button
            type="button"
            id="btn-accept-upl"
            disabled={!hasAcknowledged || !hasAcknowledgedPrivilege}
            onClick={handleAccept}
            className={`btn-geom w-full sm:w-auto px-6 py-2.5 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              hasAcknowledged && hasAcknowledgedPrivilege
                ? 'bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Accept Terms & Enter Workstation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
