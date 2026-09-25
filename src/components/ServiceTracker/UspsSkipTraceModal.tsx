import React, { useState } from 'react';
import { Mail, Printer, Copy, Check, X, ShieldAlert, FileText, Info, HelpCircle } from 'lucide-react';
import { useSueChef } from '../../context/SueChefContext';
import { OfficialFormGenerators } from '../../services/officialFormGenerators';
import { sound } from '../../services/soundEngine';

interface UspsSkipTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UspsSkipTraceModal: React.FC<UspsSkipTraceModalProps> = ({ isOpen, onClose }) => {
  const { activeCase } = useSueChef();
  const [poBox, setPoBox] = useState('P.O. Box 4821');
  const [cityStateZip, setCityStateZip] = useState(
    activeCase.parties.find(p => p.role === 'defendant')?.city 
      ? `${activeCase.parties.find(p => p.role === 'defendant')?.city}, ${activeCase.parties.find(p => p.role === 'defendant')?.state} ${activeCase.parties.find(p => p.role === 'defendant')?.zip || ''}`
      : 'Sacramento, CA 95814'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedText = OfficialFormGenerators.generateUSPSProcessServerRequest(activeCase, poBox, cityStateZip);

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    sound.playDocketStamp();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="card-geom bg-slate-950 border-2 border-[var(--accent-gold)] p-6 max-w-3xl w-full space-y-5 shadow-2xl my-8 text-slate-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--accent-gold)]/40 pb-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 card-geom bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                <span>USPS Boxholder Physical Address Disclosure Request</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/40 uppercase">
                  39 CFR § 265.6
                </span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Mandatory postal regulation disclosure for serving defendants hiding behind P.O. Boxes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Form</span>
            </button>
            <button
              onClick={handleCopy}
              className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-slate-800 border border-slate-600 hover:border-slate-400 text-slate-200 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Form'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legal Authority Note */}
        <div className="p-3 bg-sky-950/30 border border-sky-500/40 card-geom text-xs text-sky-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Federal Postal Law:</strong> Under 39 CFR § 265.6(d)(5)(ii), United States Postmasters are legally required to furnish the actual physical residence or business address of any boxholder or CMRA customer when requested in writing for service of court legal process. Post offices may <strong>not</strong> charge a search fee.
          </div>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
          <div>
            <label className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">
              Defendant's P.O. Box Number:
            </label>
            <input
              type="text"
              value={poBox}
              onChange={e => setPoBox(e.target.value)}
              placeholder="e.g. P.O. Box 4821"
              className="input-geom w-full p-2 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">
              Post Office Branch (City, State, ZIP):
            </label>
            <input
              type="text"
              value={cityStateZip}
              onChange={e => setCityStateZip(e.target.value)}
              placeholder="e.g. Sacramento, CA 95814"
              className="input-geom w-full p-2 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
            />
          </div>
        </div>

        {/* Form Document View */}
        <div className="bg-slate-900 border border-white/10 p-5 rounded font-mono text-xs text-slate-200 overflow-x-auto max-h-[380px] overflow-y-auto whitespace-pre leading-relaxed select-text shadow-inner">
          {generatedText}
        </div>
      </div>
    </div>
  );
};
