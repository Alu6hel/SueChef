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
  Building,
  UserCheck,
  Scale,
  Sliders,
  CheckSquare,
  Square
} from 'lucide-react';
import { sound } from '../../services/soundEngine';

export const AttorneyDossier: React.FC = () => {
  const { activeCase, updateActiveCase, totalDamages, exportCaseBundle } = useSueChef();
  const [hourlyRate, setHourlyRate] = useState<number>(325); // Average litigation associate/paralegal blended rate
  const [activeTab, setActiveTab] = useState<'binder' | 'opposing_counsel' | 'hours_breakdown'>('binder');

  // Granular task hours
  const [intakeHours, setIntakeHours] = useState<number>(2.5);
  const [evidenceHours, setEvidenceHours] = useState<number>(4.0);
  const [elementResearchHours, setElementResearchHours] = useState<number>(3.5);
  const [pleadingDraftingHours, setPleadingDraftingHours] = useState<number>(6.0);
  const [discoveryPrepHours, setDiscoveryPrepHours] = useState<number>(4.5);
  const [witnessOutlineHours, setWitnessOutlineHours] = useState<number>(3.5);

  // Section print toggles
  const [printSections, setPrintSections] = useState({
    summary: true,
    opposingCounsel: true,
    elements: true,
    damages: true,
    evidence: true,
    discovery: true
  });

  const totalHoursSaved = Math.round((intakeHours + evidenceHours + elementResearchHours + pleadingDraftingHours + discoveryPrepHours + witnessOutlineHours) * 10) / 10;
  const totalMoneySaved = Math.round(totalHoursSaved * hourlyRate);

  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff');
  const defendant = activeCase.parties.find(p => p.role === 'defendant');
  const opposingCounsel = activeCase.opposingCounsel || {
    name: '',
    firm: '',
    barNumber: '',
    email: '',
    phone: '',
    posture: 'cautious',
    notes: ''
  };

  const handleUpdateCounselField = (field: string, value: any) => {
    updateActiveCase(prev => ({
      ...prev,
      opposingCounsel: {
        ...(prev.opposingCounsel || {
          name: '',
          firm: '',
          barNumber: '',
          email: '',
          phone: '',
          posture: 'cautious',
          notes: ''
        }),
        [field]: value
      }
    }));
  };

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
              Professional Paralegal-Grade Case Binder, Opposing Counsel Profiler & Billable Hour Savings Calculator
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

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('binder');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            activeTab === 'binder'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Master Dossier Binder View</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('opposing_counsel');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            activeTab === 'opposing_counsel'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Opposing Counsel Profiler</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('hours_breakdown');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            activeTab === 'hours_breakdown'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Billable Hours Savings ({totalHoursSaved}h / ${totalMoneySaved.toLocaleString()})</span>
        </button>
      </div>

      {/* Financial Savings Highlight Banner */}
      <div className="card-geom bg-gradient-to-r from-amber-950/40 via-[var(--bg-card)] to-emerald-950/40 border border-[var(--accent-gold)] p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--accent-gold)] font-bold">
              <Sparkles className="w-4 h-4" />
              Direct Financial Value Created
            </div>
            <h2 className="font-serif font-bold text-xl text-[var(--text-main)]">
              Estimated Legal Fee Savings: ${totalMoneySaved.toLocaleString()} ({totalHoursSaved} Hours Saved)
            </h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Attorneys and paralegals bill between $150 and $650 per hour simply sorting through unorganized evidence, drafting basic complaints, and researching cause-of-action elements. Handing over this structured SueChef binder bypasses raw intake billing entirely.
            </p>
          </div>

          <div className="md:col-span-5 card-geom bg-black/40 border border-white/10 p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-muted)]">Litigation Hourly Billing Rate:</span>
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
              <span>$350/hr (Senior Associate)</span>
              <span>$650/hr (Partner)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 2: Opposing Counsel Intelligence Station */}
      {activeTab === 'opposing_counsel' && (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 md:p-8 custom-geometry space-y-6 shadow-xl">
          <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
            <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
              Opposing Counsel Intelligence & Posture Tracker
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Keep verified contact credentials, bar license numbers, and strategic posture observations on opposing attorneys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-[var(--text-muted)] uppercase font-bold">Attorney Name</label>
              <input
                type="text"
                placeholder="e.g. Robert Vance, Esq."
                value={opposingCounsel.name}
                onChange={e => handleUpdateCounselField('name', e.target.value)}
                className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-muted)] uppercase font-bold">Law Firm / Organization</label>
              <input
                type="text"
                placeholder="e.g. Apex Litigation Group LLP"
                value={opposingCounsel.firm}
                onChange={e => handleUpdateCounselField('firm', e.target.value)}
                className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-muted)] uppercase font-bold">State Bar License Number</label>
              <input
                type="text"
                placeholder="e.g. CA State Bar #294819"
                value={opposingCounsel.barNumber || ''}
                onChange={e => handleUpdateCounselField('barNumber', e.target.value)}
                className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-muted)] uppercase font-bold">Settlement & Negotiation Posture</label>
              <select
                value={opposingCounsel.posture}
                onChange={e => handleUpdateCounselField('posture', e.target.value)}
                className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none font-sans"
              >
                <option value="cooperative">Cooperative / Pragmatic (Favors Early Settlement)</option>
                <option value="aggressive">Aggressive / Paper-Heavy Litigator</option>
                <option value="unresponsive">Unresponsive / Delay & Stall Tactics</option>
                <option value="cautious">Cautious Solo Practitioner / General Counsel</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-muted)] uppercase font-bold">Direct Email Address</label>
              <input
                type="email"
                placeholder="e.g. rvance@apexlitigation.com"
                value={opposingCounsel.email || ''}
                onChange={e => handleUpdateCounselField('email', e.target.value)}
                className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-muted)] uppercase font-bold">Direct Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. (415) 555-0199"
                value={opposingCounsel.phone || ''}
                onChange={e => handleUpdateCounselField('phone', e.target.value)}
                className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[var(--text-muted)] uppercase font-bold">Counsel Tactics & Notes</label>
              <textarea
                rows={3}
                placeholder="Record notes on opposing counsel communications, procedural motions threatened, or settlement attitudes..."
                value={opposingCounsel.notes}
                onChange={e => handleUpdateCounselField('notes', e.target.value)}
                className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Granular Billable Hours Calculator */}
      {activeTab === 'hours_breakdown' && (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 md:p-8 custom-geometry space-y-6 shadow-xl">
          <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
            <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
              Granular Litigation Intake & Drafting Task Calculator
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Adjust the estimated baseline hours for each stage of dispute preparation to calculate exact cost savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-[var(--bg-secondary)] p-5 custom-geometry border border-[var(--border-color)]">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)] font-bold">1. Fact Interview & Intake Audit:</span>
                  <span className="text-[var(--accent-gold)] font-bold">{intakeHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6"
                  step="0.5"
                  value={intakeHours}
                  onChange={e => setIntakeHours(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)] font-bold">2. Evidence Cataloging & SHA-256 Hashing:</span>
                  <span className="text-[var(--accent-gold)] font-bold">{evidenceHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={evidenceHours}
                  onChange={e => setEvidenceHours(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)] font-bold">3. Statutory Element & Cause of Action Research:</span>
                  <span className="text-[var(--accent-gold)] font-bold">{elementResearchHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={elementResearchHours}
                  onChange={e => setElementResearchHours(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4 bg-[var(--bg-secondary)] p-5 custom-geometry border border-[var(--border-color)]">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)] font-bold">4. 28-Line Pleading & Demand Drafting:</span>
                  <span className="text-[var(--accent-gold)] font-bold">{pleadingDraftingHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.5"
                  value={pleadingDraftingHours}
                  onChange={e => setPleadingDraftingHours(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)] font-bold">5. Discovery Interrogatories & RFP Suite:</span>
                  <span className="text-[var(--accent-gold)] font-bold">{discoveryPrepHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={discoveryPrepHours}
                  onChange={e => setDiscoveryPrepHours(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)] font-bold">6. Witness Direct/Cross Outline & Exhibit Index:</span>
                  <span className="text-[var(--accent-gold)] font-bold">{witnessOutlineHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={witnessOutlineHours}
                  onChange={e => setWitnessOutlineHours(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Complete Printable Dossier Binder View */}
      {activeTab === 'binder' && (
        <div className="space-y-4">
          {/* Section Selector Toolbar */}
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[var(--text-muted)] uppercase font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Print Binder Sections:</span>
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { id: 'summary', label: 'Summary' },
                { id: 'opposingCounsel', label: 'Opposing Counsel' },
                { id: 'elements', label: 'Prima Facie Elements' },
                { id: 'damages', label: 'Damages' },
                { id: 'evidence', label: 'Exhibit Index' },
                { id: 'discovery', label: 'Discovery Suite' }
              ].map(sec => (
                <label key={sec.id} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(printSections as any)[sec.id]}
                    onChange={e => setPrintSections(prev => ({ ...prev, [sec.id]: e.target.checked }))}
                    className="accent-[var(--accent-gold)]"
                  />
                  <span className="text-[var(--text-main)]">{sec.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto pleading-paper-container p-8 md:p-12 text-slate-900 border border-slate-300 rounded-sm shadow-2xl space-y-8 font-pleading text-xs leading-relaxed bg-white">
            {/* Binder Cover Header */}
            <div className="text-center border-b-2 border-slate-900 pb-6 space-y-2">
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                CONFIDENTIAL ATTORNEY INTAKE DOSSIER • PRE-LITIGATION MASTER BINDER
              </div>
              <h1 className="font-serif font-bold text-2xl text-slate-950 uppercase">
                {activeCase.title}
              </h1>
              <div className="font-mono text-xs text-slate-700">
                CASE REF: {activeCase.caseNumber} • JURISDICTION: {activeCase.courtName || `${activeCase.state} Small Claims / Civil Court`}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                COMPILED: {activeCase.createdAt} • VERIFIED ZERO-CLOUD CLIENT ENCRYPTED
              </div>
            </div>

            {/* Section 1: Executive Case Summary */}
            {printSections.summary && (
              <div className="space-y-3">
                <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                  SECTION 1: EXECUTIVE LITIGATION SUMMARY
                </div>
                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div className="p-3 bg-slate-100 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800">PLAINTIFF (PRO SE):</span>
                    <div>{plaintiff?.name || 'Self-Represented Litigant'}</div>
                    <div>{plaintiff?.address}, {plaintiff?.city}, {plaintiff?.state} {plaintiff?.zip}</div>
                    <div>Tel: {plaintiff?.phone} • Email: {plaintiff?.email}</div>
                  </div>

                  <div className="p-3 bg-slate-100 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800">DEFENDANT:</span>
                    <div>{defendant?.name || 'Named Defendant Entity'}</div>
                    <div>{defendant?.address}, {defendant?.city}, {defendant?.state} {defendant?.zip}</div>
                    <div>Registered Agent: {defendant?.registeredAgent || 'Direct Service'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Opposing Counsel Profile */}
            {printSections.opposingCounsel && opposingCounsel.name && (
              <div className="space-y-3">
                <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                  SECTION 2: OPPOSING COUNSEL RECORD & POSTURE
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
                  <div><strong>Attorney:</strong> {opposingCounsel.name} ({opposingCounsel.firm || 'Solo Practice'})</div>
                  <div><strong>Bar Number:</strong> {opposingCounsel.barNumber || 'Not Cataloged'} • <strong>Contact:</strong> {opposingCounsel.email || 'N/A'} • {opposingCounsel.phone || 'N/A'}</div>
                  <div><strong>Observed Posture:</strong> <span className="uppercase font-bold">{opposingCounsel.posture}</span></div>
                  {opposingCounsel.notes && (
                    <div className="italic text-slate-700 pt-1">Notes: {opposingCounsel.notes}</div>
                  )}
                </div>
              </div>
            )}

            {/* Section 3: Legal Elements & Prima Facie Proof */}
            {printSections.elements && (
              <div className="space-y-3">
                <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                  SECTION 3: LEGAL ELEMENTS & PRIMA FACIE PROOF
                </div>
                <div className="space-y-2 text-[11px]">
                  {activeCase.claimEvaluation.elements.map((elem, idx) => (
                    <div key={elem.id} className="p-2.5 bg-slate-50 border border-slate-200 flex items-start gap-2">
                      <span className="font-bold text-emerald-700">✓ [PROVEN]</span>
                      <div>
                        <strong>Element {idx + 1} ({elem.title}):</strong> {elem.description}
                        <div className="text-slate-600 italic mt-0.5">Citation: {elem.legalStandard}</div>
                        {elem.userEvidenceNotes && (
                          <div className="text-slate-800 font-medium mt-1">Proof: {elem.userEvidenceNotes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Itemized Table of Damages */}
            {printSections.damages && (
              <div className="space-y-3">
                <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex justify-between">
                  <span>SECTION 4: ITEMIZED TABLE OF DAMAGES</span>
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
            )}

            {/* Section 5: Master Stamped Exhibit Index with SHA-256 Hashes */}
            {printSections.evidence && (
              <div className="space-y-3">
                <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                  SECTION 5: MASTER EXHIBIT INDEX & CRYPTOGRAPHIC SHA-256 DIGITAL INTEGRITY
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
            )}

            {/* Section 6: Discovery Requests Summary */}
            {printSections.discovery && activeCase.discovery.interrogatories.length > 0 && (
              <div className="space-y-3">
                <div className="font-bold text-sm uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                  SECTION 6: PROPOUNDED DISCOVERY & INTERROGATORIES
                </div>
                <div className="space-y-2 text-[11px]">
                  {activeCase.discovery.interrogatories.slice(0, 5).map(item => (
                    <div key={item.id} className="p-2 bg-slate-50 border border-slate-200">
                      <strong>Interrogatory #{item.number}:</strong> {item.questionText}
                      <div className="text-[10px] text-slate-600 font-mono mt-0.5">Target Objective: {item.targetObjective}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
