import React, { useState } from 'react';
import { FileText, Printer, Copy, Check, X, Scale, Landmark, ShieldCheck, Download } from 'lucide-react';
import { useSueChef } from '../../context/SueChefContext';
import { OfficialFormGenerators } from '../../services/officialFormGenerators';
import { sound } from '../../services/soundEngine';

interface OfficialFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormKey = 'ca_sc100' | 'uk_n1' | 'nyc_civgp58' | 'nigeria_form1_2';

export const OfficialFormsModal: React.FC<OfficialFormsModalProps> = ({ isOpen, onClose }) => {
  const { activeCase, totalDamages, country } = useSueChef();
  const [selectedForm, setSelectedForm] = useState<FormKey>(() => {
    if (country === 'GB') return 'uk_n1';
    if (country === 'NG') return 'nigeria_form1_2';
    return 'ca_sc100';
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let formText = '';
  let formTitle = '';
  let jurisdictionLabel = '';

  switch (selectedForm) {
    case 'ca_sc100':
      formText = OfficialFormGenerators.generateCaliforniaSC100(activeCase, totalDamages);
      formTitle = 'California SC-100: Plaintiff’s Claim and Order';
      jurisdictionLabel = 'California Judicial Council Official Form SC-100';
      break;
    case 'uk_n1':
      formText = OfficialFormGenerators.generateUKFormN1(activeCase, totalDamages);
      formTitle = 'UK HMCTS Form N1: CPR Part 7 County Court Claim';
      jurisdictionLabel = 'Her Majesty\'s Courts & Tribunals Service Form N1';
      break;
    case 'nyc_civgp58':
      formText = OfficialFormGenerators.generateNYCFormCIVGP58(activeCase, totalDamages);
      formTitle = 'New York City CIV-GP-58: Statement of Claim';
      jurisdictionLabel = 'Civil Court of the City of New York Small Claims';
      break;
    case 'nigeria_form1_2':
      formText = OfficialFormGenerators.generateNigeriaSmallClaimsForms(activeCase, totalDamages);
      formTitle = 'Nigeria Small Claims Form 1 (Demand) & Form 2 (Claim)';
      jurisdictionLabel = 'Magistrate Court Small Claims Practice Direction';
      break;
  }

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(formText);
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
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Official Judicial Court Form Mappers
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Statutorily formatted court pleadings ready for filing with court clerks
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
              <span>{copied ? 'Copied!' : 'Copy Form Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 no-print">
          <button
            onClick={() => { sound.playClick(); setSelectedForm('ca_sc100'); }}
            className={`p-2.5 card-geom border text-left transition-all ${
              selectedForm === 'ca_sc100'
                ? 'border-[var(--accent-gold)] bg-amber-950/40 text-[var(--accent-gold)] font-bold shadow-md'
                : 'border-white/10 bg-slate-900/60 hover:border-white/30 text-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold">California SC-100</div>
            <div className="text-[9px] font-mono text-slate-400">Judicial Council Form</div>
          </button>

          <button
            onClick={() => { sound.playClick(); setSelectedForm('uk_n1'); }}
            className={`p-2.5 card-geom border text-left transition-all ${
              selectedForm === 'uk_n1'
                ? 'border-[var(--accent-gold)] bg-amber-950/40 text-[var(--accent-gold)] font-bold shadow-md'
                : 'border-white/10 bg-slate-900/60 hover:border-white/30 text-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold">UK Form N1</div>
            <div className="text-[9px] font-mono text-slate-400">CPR Part 7 Claim Form</div>
          </button>

          <button
            onClick={() => { sound.playClick(); setSelectedForm('nyc_civgp58'); }}
            className={`p-2.5 card-geom border text-left transition-all ${
              selectedForm === 'nyc_civgp58'
                ? 'border-[var(--accent-gold)] bg-amber-950/40 text-[var(--accent-gold)] font-bold shadow-md'
                : 'border-white/10 bg-slate-900/60 hover:border-white/30 text-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold">New York CIV-GP-58</div>
            <div className="text-[9px] font-mono text-slate-400">NYC Statement of Claim</div>
          </button>

          <button
            onClick={() => { sound.playClick(); setSelectedForm('nigeria_form1_2'); }}
            className={`p-2.5 card-geom border text-left transition-all ${
              selectedForm === 'nigeria_form1_2'
                ? 'border-[var(--accent-gold)] bg-amber-950/40 text-[var(--accent-gold)] font-bold shadow-md'
                : 'border-white/10 bg-slate-900/60 hover:border-white/30 text-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold">Nigeria Form 1 &amp; 2</div>
            <div className="text-[9px] font-mono text-slate-400">Demand &amp; Summons</div>
          </button>
        </div>

        {/* Official Form Header Bar */}
        <div className="p-3 bg-slate-900 border border-white/10 card-geom flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Scale className="w-4 h-4" />
            <span>{jurisdictionLabel}</span>
          </div>
          <span className="text-slate-400">Print Ready 8.5 x 11</span>
        </div>

        {/* Form Document Preview */}
        <div className="bg-slate-900/90 border border-white/10 p-5 rounded font-mono text-xs text-slate-200 overflow-x-auto max-h-[460px] overflow-y-auto whitespace-pre leading-relaxed select-text shadow-inner">
          {formText}
        </div>
      </div>
    </div>
  );
};
