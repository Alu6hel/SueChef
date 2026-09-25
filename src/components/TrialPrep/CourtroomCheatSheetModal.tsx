import React from 'react';
import { Printer, X, Scale, FileText, CheckCircle2, ShieldCheck, Hash } from 'lucide-react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';

interface CourtroomCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourtroomCheatSheetModal: React.FC<CourtroomCheatSheetModalProps> = ({ isOpen, onClose }) => {
  const { activeCase, totalDamages } = useSueChef();

  if (!isOpen) return null;

  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff');
  const defendant = activeCase.parties.find(p => p.role === 'defendant');

  const handlePrint = () => {
    sound.playDocketStamp();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="card-geom bg-slate-950 border-2 border-[var(--accent-gold)] p-6 md:p-8 max-w-3xl w-full space-y-6 shadow-2xl text-slate-100 my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-[var(--accent-gold)]/40 pb-3 no-print">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[var(--accent-gold)]" />
            <h3 className="font-serif font-bold text-lg text-[var(--accent-gold)]">
              Courtroom Quick-Reference Cheat Sheet (Form SC-REF-01)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Cheat Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Cheat Sheet Body */}
        <div className="bg-white text-slate-950 p-6 rounded shadow space-y-4 print:p-0 print:shadow-none print:bg-transparent">
          {/* Header Banner */}
          <div className="border-b-2 border-slate-950 pb-3 flex justify-between items-start">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">
                COURTROOM TRIAL REFERENCE CARD &bull; PRO SE LITIGANT
              </div>
              <h1 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 mt-0.5">
                {activeCase.courtName || 'Small Claims Division'}
              </h1>
              <div className="text-xs font-mono font-bold text-slate-700">
                Case No: {activeCase.caseNumber || 'CIV-2026-PENDING'} &bull; Hearing Date: {activeCase.hearingDate || 'TBD'}
              </div>
            </div>

            <div className="text-right border-l-2 border-slate-950 pl-4">
              <div className="text-[9px] font-mono uppercase text-slate-500">Total Claim Claimed</div>
              <div className="text-xl font-mono font-black text-emerald-800">
                ${totalDamages.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="grid grid-cols-2 gap-4 bg-slate-100 p-2.5 rounded text-xs border border-slate-300 font-serif">
            <div>
              <span className="font-bold uppercase text-[9px] font-mono text-slate-500 block">Plaintiff (Pro Se)</span>
              <span className="font-bold">{plaintiff?.name || 'Plaintiff'}</span>
            </div>
            <div>
              <span className="font-bold uppercase text-[9px] font-mono text-slate-500 block">Defendant</span>
              <span className="font-bold">{defendant?.name || 'Defendant'}</span>
            </div>
          </div>

          {/* 3-Sentence Prima Facie Opening Hook */}
          <div className="border border-slate-300 p-3 rounded space-y-1">
            <div className="text-[9px] font-mono uppercase font-bold text-slate-700 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-600" />
              <span>3-Sentence Prima Facie Opening Hook (Memorize / Read to Judge):</span>
            </div>
            <p className="text-xs font-serif italic text-slate-800 leading-relaxed bg-amber-50/50 p-2 border-l-2 border-amber-500">
              "Your Honor, this action arises from Defendant's willful failure to perform their statutory covenants. The authenticated documentary evidence in Exhibits A through D establishes liability by a clear preponderance of the evidence. Plaintiff respectfully requests judgment for actual and statutory damages totaling ${totalDamages.toLocaleString()}."
            </p>
          </div>

          {/* Master Stamped Exhibit Checklist */}
          <div className="border border-slate-300 p-3 rounded space-y-2">
            <div className="text-[9px] font-mono uppercase font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Master Stamped Exhibit Index ({activeCase.evidenceList.length} Exhibits):</span>
              </span>
              <span className="text-[8px] font-mono text-slate-500">Hand 3 copies to Bailiff/Clerk</span>
            </div>
            <div className="grid grid-cols-1 divide-y divide-slate-200 text-[10px] font-mono">
              {activeCase.evidenceList.slice(0, 5).map((ev) => (
                <div key={ev.id} className="py-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold bg-slate-200 px-1 rounded text-slate-900">{ev.exhibitTag}</span>
                    <span className="font-medium text-slate-800 truncate">{ev.title}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 shrink-0">
                    SHA-256: {ev.sha256Hash.substring(0, 10)}...
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Golden Rules of the Courtroom */}
          <div className="bg-slate-900 text-slate-100 p-3 rounded space-y-1.5 border border-slate-800">
            <div className="text-[9px] font-mono uppercase font-bold text-amber-400">
              5 Golden Courtroom Commandment Rules:
            </div>
            <ol className="list-decimal list-inside text-[10px] space-y-1 text-slate-200 leading-tight">
              <li><strong>Address Only The Judge:</strong> Direct 100% of testimony to "Your Honor". Never look at or argue with the Defendant.</li>
              <li><strong>Stand Whenever Speaking:</strong> Stand immediately when addressed by the Judge or when presenting arguments.</li>
              <li><strong>State Exact Numbers &amp; Cite Exhibits:</strong> Say "As shown in Exhibit B, line 4", never guess or generalize.</li>
              <li><strong>Immediate Silence on Interruption:</strong> If the Judge begins speaking, stop mid-sentence instantly.</li>
              <li><strong>Object to Traps:</strong> If opposing counsel asks compound questions, say: "Objection, compound question under FRE 611."</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
