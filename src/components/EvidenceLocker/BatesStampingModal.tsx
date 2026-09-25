import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { BatesStampConfig, EvidenceItem } from '../../types';
import { 
  FileDigit, 
  Tag, 
  CheckCircle2, 
  Copy, 
  Printer, 
  X, 
  Settings, 
  Eye, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface BatesStampingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatesStampingModal: React.FC<BatesStampingModalProps> = ({ isOpen, onClose }) => {
  const { activeCase, updateActiveCase, updateBatesConfig } = useSueChef();

  const config: BatesStampConfig = activeCase.batesStampConfig || {
    prefix: 'PLTF-',
    startingNumber: 1,
    digits: 4,
    position: 'bottom_right',
    fontSize: 12,
    includeDate: true
  };

  const [prefix, setPrefix] = useState(config.prefix);
  const [startingNumber, setStartingNumber] = useState(config.startingNumber);
  const [digits, setDigits] = useState(config.digits);
  const [position, setPosition] = useState<BatesStampConfig['position']>(config.position);
  const [includeDate, setIncludeDate] = useState(config.includeDate);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(activeCase.evidenceList[0]?.id || '');
  const [copiedIndex, setCopiedIndex] = useState(false);

  if (!isOpen) return null;

  const formatBates = (index: number) => {
    const num = (startingNumber + index).toString().padStart(digits, '0');
    const datePart = includeDate ? ` • ${new Date().toISOString().split('T')[0]}` : '';
    return `${prefix}${num}${datePart}`;
  };

  const selectedEvidence = activeCase.evidenceList.find(e => e.id === selectedEvidenceId) || activeCase.evidenceList[0];
  const selectedIndex = activeCase.evidenceList.findIndex(e => e.id === selectedEvidenceId);

  const handleApplyBatesConfig = () => {
    sound.playDocketStamp();
    updateBatesConfig({
      prefix,
      startingNumber,
      digits,
      position,
      includeDate
    });

    // Update exhibit tags with bates stamp references
    const updatedEvidence = activeCase.evidenceList.map((e, idx) => ({
      ...e,
      notes: e.notes.includes('[BATES:') 
        ? e.notes.replace(/\[BATES: [^\]]+\]/, `[BATES: ${formatBates(idx)}]`)
        : `${e.notes}\n[BATES: ${formatBates(idx)}]`
    }));

    updateActiveCase(prev => ({
      ...prev,
      evidenceList: updatedEvidence
    }));

    onClose();
  };

  const generateMasterIndexText = () => {
    let out = `================================================================================\n`;
    out += `MASTER EXHIBIT INDEX WITH BATES IDENTIFIERS & CRYPTOGRAPHIC HASHES\n`;
    out += `MATTER: ${activeCase.title} | CASE NO: ${activeCase.caseNumber}\n`;
    out += `================================================================================\n\n`;

    activeCase.evidenceList.forEach((ev, idx) => {
      out += `EXHIBIT TAG:     ${ev.exhibitTag || `EXHIBIT ${String.fromCharCode(65 + idx)}`}\n`;
      out += `BATES RANGE:     ${formatBates(idx)}\n`;
      out += `DOCUMENT TITLE:  ${ev.title}\n`;
      out += `CATEGORY:        ${ev.category.toUpperCase()}\n`;
      out += `CUSTODIAN:       ${ev.custodian}\n`;
      out += `SHA-256 HASH:    ${ev.sha256Hash}\n`;
      out += `ADMISSIBLE:      FRE 901 (Auth) | FRE 803 (Hearsay) | FRE 1002 (Best Evidence)\n`;
      out += `--------------------------------------------------------------------------------\n`;
    });

    return out;
  };

  const copyIndex = () => {
    sound.playClick();
    navigator.clipboard.writeText(generateMasterIndexText());
    setCopiedIndex(true);
    setTimeout(() => setCopiedIndex(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-4xl w-full max-h-[90vh] flex flex-col custom-geometry shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] flex items-center justify-center">
              <FileDigit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[var(--text-main)]">
                Automated Bates Stamping &amp; Master Exhibit Indexer
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">
                Standardized judicial exhibit numbering for civil court filings
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {/* Controls Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 custom-geometry">
            <div>
              <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Prefix</label>
              <input
                type="text"
                value={prefix}
                onChange={e => setPrefix(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-1 text-xs font-mono font-bold text-[var(--text-main)] custom-geometry"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Starting #</label>
              <input
                type="number"
                value={startingNumber}
                onChange={e => setStartingNumber(parseInt(e.target.value) || 1)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-1 text-xs font-mono font-bold text-[var(--text-main)] custom-geometry"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Digit Padding</label>
              <select
                value={digits}
                onChange={e => setDigits(parseInt(e.target.value) || 4)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-1 text-xs font-mono text-[var(--text-main)] custom-geometry"
              >
                <option value={3}>3 (e.g. 001)</option>
                <option value={4}>4 (e.g. 0001)</option>
                <option value={6}>6 (e.g. 000001)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Stamp Position</label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value as any)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-1 text-xs font-mono text-[var(--text-main)] custom-geometry"
              >
                <option value="bottom_right">Bottom Right</option>
                <option value="bottom_center">Bottom Center</option>
                <option value="top_right">Top Right</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-main)] cursor-pointer pb-1">
                <input
                  type="checkbox"
                  checked={includeDate}
                  onChange={e => setIncludeDate(e.target.checked)}
                  className="rounded"
                />
                <span>Include Date</span>
              </label>
            </div>
          </div>

          {/* Interactive Document Preview with Stamp */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Exhibit Selector List */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase block">
                Evidence Exhibits ({activeCase.evidenceList.length})
              </span>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {activeCase.evidenceList.map((ev, idx) => (
                  <button
                    key={ev.id}
                    onClick={() => { sound.playClick(); setSelectedEvidenceId(ev.id); }}
                    className={`w-full p-2.5 text-left text-xs custom-geometry border transition-all ${
                      ev.id === selectedEvidence?.id
                        ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-gold)]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-[var(--accent-gold)]">{ev.exhibitTag || `EXHIBIT ${String.fromCharCode(65 + idx)}`}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">{formatBates(idx)}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-main)] truncate mt-0.5">{ev.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Mockup View with Stamped Position */}
            <div className="md:col-span-2 bg-slate-900 border-2 border-slate-700 p-6 custom-geometry relative min-h-[300px] flex flex-col justify-between shadow-2xl">
              {/* Header of Exhibit */}
              <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold font-serif text-slate-100">
                    {selectedEvidence?.title || 'Document Exhibit'}
                  </span>
                  <p className="text-[10px] font-mono text-slate-400">
                    Custodian: {selectedEvidence?.custodian || 'Plaintiff'} • Category: {selectedEvidence?.category}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold rounded">
                  {selectedEvidence?.exhibitTag || 'EXHIBIT A'}
                </span>
              </div>

              {/* Document Body Simulation */}
              <div className="py-8 text-center text-xs font-mono text-slate-500 space-y-2">
                <FileText className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
                <p>Authentic Document Payload Attached</p>
                <p className="text-[10px] text-slate-600 truncate max-w-md mx-auto">
                  SHA-256: {selectedEvidence?.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </p>
              </div>

              {/* Physical Bates Stamp Overlay */}
              <div className={`p-2 bg-rose-950/80 border-2 border-rose-500/80 text-rose-300 font-mono text-xs font-bold custom-geometry shadow-lg inline-block w-fit ${
                position === 'bottom_right' ? 'self-end' : position === 'bottom_center' ? 'self-center' : 'self-end order-first mb-4'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-rose-400" />
                  <span>BATES: {formatBates(Math.max(0, selectedIndex))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Master Exhibit Index Generator */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 custom-geometry space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Courtroom Master Exhibit Index Table</span>
              </h4>
              <button
                onClick={copyIndex}
                className="px-3 py-1 bg-[var(--accent-gold)] text-slate-950 font-mono text-xs font-bold custom-geometry flex items-center gap-1.5"
              >
                {copiedIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex ? 'Copied Index' : 'Copy Master Index'}</span>
              </button>
            </div>

            <pre className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 text-[11px] font-mono text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {generateMasterIndexText()}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between">
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-4 py-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyBatesConfig}
            className="px-4 py-2 bg-[var(--accent-gold)] text-slate-950 font-mono text-xs font-bold custom-geometry flex items-center gap-1.5 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Bates Stamps to All Exhibits</span>
          </button>
        </div>
      </div>
    </div>
  );
};
