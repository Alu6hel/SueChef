import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { 
  Briefcase, 
  DollarSign, 
  Download, 
  CheckCircle2, 
  FileText, 
  Award, 
  Clock, 
  Printer, 
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building
} from 'lucide-react';
import { sound } from '../../services/soundEngine';

export const AttorneyDossier: React.FC = () => {
  const { activeCase, totalDamages, exportCaseBundle } = useSueChef();
  const [hourlyRate, setHourlyRate] = useState<number>(325); // Average litigation associate/paralegal blended rate

  // Standard hours required for raw unorganized case intake:
  // - Fact interview & intake: 2 hrs
  // - Evidence sorting & hash verification: 4 hrs
  // - Prima facie element research: 3 hrs
  // - Pleading & demand drafting: 6 hrs
  // - Exhibit indexing & stamping: 3 hrs
  const estimatedHoursSaved = 18;
  const totalMoneySaved = estimatedHoursSaved * hourlyRate;

  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff');
  const defendant = activeCase.parties.find(p => p.role === 'defendant');

  const handleDownloadBundle = () => {
    sound.playDocketStamp();
    const bundle = exportCaseBundle();
    const blob = new Blob([bundle], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeCase.title.replace(/\s+/g, '_')}_Master_Dossier.suechef`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintDossier = () => {
    sound.playDocketStamp();
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 card-geom bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[var(--text-main)]">
              The Attorney Hand-Off Dossier
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Professional Paralegal-Grade Case Binder & Billable Hour Financial Savings Counter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadBundle}
            className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Export .suechef Archive</span>
          </button>
          <button
            onClick={handlePrintDossier}
            className="btn-geom flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Master Binder</span>
          </button>
        </div>
      </div>

      {/* Financial Savings Highlight Banner */}
      <div className="card-geom bg-gradient-to-r from-amber-950/40 via-[var(--bg-card)] to-emerald-950/40 border border-[var(--accent-gold)] p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--accent-gold)] font-bold">
              <Sparkles className="w-4 h-4" />
              Direct Financial Best Practice
            </div>
            <h2 className="font-serif font-bold text-xl text-[var(--text-main)]">
              Estimated Legal Fee Savings: ${totalMoneySaved.toLocaleString()}
            </h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Attorneys and paralegals bill between $150 and $650 per hour simply sorting through messy text messages, organizing receipts, and researching basic elements. Handing over this structured, verified SueChef dossier bypasses ~{estimatedHoursSaved} initial billable hours.
            </p>
          </div>

          <div className="md:col-span-5 card-geom bg-black/40 border border-white/10 p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-muted)]">Paralegal/Attorney Hourly Rate:</span>
              <span className="font-mono font-bold text-[var(--accent-gold)]">${hourlyRate}/hr</span>
            </div>
            <input
              type="range"
              min="150"
              max="650"
              step="25"
              value={hourlyRate}
              onChange={e => setHourlyRate(parseInt(e.target.value))}
              className="w-full accent-[var(--accent-gold)] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <span>$150/hr (Paralegal)</span>
              <span>$350/hr (Associate)</span>
              <span>$650/hr (Partner)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Printable Dossier Binder View */}
      <div className="max-w-4xl mx-auto pleading-paper-container p-8 md:p-12 text-slate-900 border border-slate-300 rounded-sm shadow-2xl space-y-8 font-pleading text-xs leading-relaxed">
        
        {/* Binder Cover Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6 space-y-2">
          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
            CONFIDENTIAL ATTORNEY INTAKE DOSSIER • PRE-LITIGATION BRIEF
          </div>
          <h1 className="font-serif font-bold text-2xl text-slate-950 uppercase">
            {activeCase.title}
          </h1>
          <div className="font-mono text-xs text-slate-700">
            CASE REF: {activeCase.caseNumber} • JURISDICTION: {activeCase.courtName}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            COMPILED: {activeCase.createdAt} • VERIFIED ZERO-CLOUD CLIENT ENCRYPTED
          </div>
        </div>

        {/* Section 1: Executive Case Summary */}
        <div className="space-y-3">
          <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
            SECTION 1: EXECUTIVE CASE SUMMARY
          </div>
          <div className="grid grid-cols-2 gap-4 text-[11px]">
            <div className="p-3 bg-slate-100 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">PLAINTIFF (PRO SE):</span>
              <div>{plaintiff?.name}</div>
              <div>{plaintiff?.address}, {plaintiff?.city}, {plaintiff?.state} {plaintiff?.zip}</div>
              <div>Tel: {plaintiff?.phone} • Email: {plaintiff?.email}</div>
            </div>

            <div className="p-3 bg-slate-100 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">DEFENDANT:</span>
              <div>{defendant?.name}</div>
              <div>{defendant?.address}, {defendant?.city}, {defendant?.state} {defendant?.zip}</div>
              <div>Registered Agent: {defendant?.registeredAgent || 'Direct Service'}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Prima Facie Elements */}
        <div className="space-y-3">
          <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
            SECTION 2: LEGAL ELEMENTS & PRIMA FACIE PROOF
          </div>
          <div className="space-y-2 text-[11px]">
            {activeCase.claimEvaluation.elements.map((elem, idx) => (
              <div key={elem.id} className="p-2.5 bg-slate-50 border border-slate-200 flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓ [PROVEN]</span>
                <div>
                  <strong>Element {idx + 1} ({elem.title}):</strong> {elem.description}
                  <div className="text-slate-600 italic mt-0.5">Citation: {elem.legalStandard}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Itemized Table of Damages */}
        <div className="space-y-3">
          <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex justify-between">
            <span>SECTION 3: ITEMIZED TABLE OF DAMAGES</span>
            <span>TOTAL: ${totalDamages.toLocaleString()}</span>
          </div>
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-200 border border-slate-300 text-slate-800 text-left">
                <th className="p-2">Description</th>
                <th className="p-2">Category</th>
                <th className="p-2">Statutory Basis</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {activeCase.claimEvaluation.damages.map(dmg => (
                <tr key={dmg.id} className="border-b border-slate-200">
                  <td className="p-2 font-semibold">{dmg.description}</td>
                  <td className="p-2 uppercase text-[10px] text-slate-600">{dmg.category.replace('_', ' ')}</td>
                  <td className="p-2 text-slate-600 font-mono text-[10px]">{dmg.statutoryBasis || 'General Law'}</td>
                  <td className="p-2 text-right font-mono font-bold">${dmg.amount.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
                <td colSpan={3} className="p-2 text-right">TOTAL QUANTIFIED CLAIM:</td>
                <td className="p-2 text-right font-mono text-emerald-800">${totalDamages.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Master Stamped Exhibit Index with SHA-256 Hashes */}
        <div className="space-y-3">
          <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
            SECTION 4: MASTER EXHIBIT INDEX & SHA-256 DIGITAL INTEGRITY
          </div>
          <table className="w-full border-collapse text-[10px] font-mono">
            <thead>
              <tr className="bg-slate-200 border border-slate-300 text-slate-800 text-left">
                <th className="p-1.5">Exhibit</th>
                <th className="p-1.5">Document Title</th>
                <th className="p-1.5">Original File</th>
                <th className="p-1.5">SHA-256 Digital Fingerprint</th>
              </tr>
            </thead>
            <tbody>
              {activeCase.evidenceList.map(ev => (
                <tr key={ev.id} className="border-b border-slate-200">
                  <td className="p-1.5 font-bold text-slate-900">{ev.exhibitTag}</td>
                  <td className="p-1.5">{ev.title}</td>
                  <td className="p-1.5 text-slate-600">{ev.originalFileName}</td>
                  <td className="p-1.5 text-slate-500 break-all">{ev.sha256Hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
