import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { 
  Send, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  FileCheck, 
  ShieldCheck, 
  UserCheck,
  Building,
  Printer,
  Edit2
} from 'lucide-react';
import { ServiceRecord, ServiceAttempt } from '../../types';
import { sound } from '../../services/soundEngine';

export const ServiceTracker: React.FC = () => {
  const { activeCase, updateActiveCase } = useSueChef();
  const [showAddAttemptModal, setShowAddAttemptModal] = useState(false);
  const [showAffidavitPreview, setShowAffidavitPreview] = useState(false);

  // New attempt form state
  const [attemptAddress, setAttemptAddress] = useState(
    activeCase.parties.find(p => p.role === 'defendant')?.address || ''
  );
  const [attemptServer, setAttemptServer] = useState('Apex Legal Process Services Inc.');
  const [attemptSuccess, setAttemptSuccess] = useState(true);
  const [attemptNotes, setAttemptNotes] = useState('');

  const currentRecord = activeCase.serviceRecords[0];

  const handleAddAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playDocketStamp();

    const newAttempt: ServiceAttempt = {
      id: `att_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      address: attemptAddress,
      serverName: attemptServer,
      success: attemptSuccess,
      notes: attemptNotes,
      gpsCoords: '37.3382° N, 121.8863° W'
    };

    updateActiveCase(prev => {
      const updatedRecords = prev.serviceRecords.map((rec, i) => {
        if (i !== 0) return rec;
        return {
          ...rec,
          status: attemptSuccess ? ('served' as const) : rec.status,
          dateServed: attemptSuccess ? new Date().toISOString().split('T')[0] : rec.dateServed,
          attempts: [...rec.attempts, newAttempt]
        };
      });
      return { ...prev, serviceRecords: updatedRecords };
    });

    setShowAddAttemptModal(false);
    setAttemptNotes('');
  };

  const handleSignAffidavit = () => {
    sound.playSuccessChime();
    updateActiveCase(prev => {
      const updatedRecords = prev.serviceRecords.map((rec, i) => {
        if (i !== 0) return rec;
        return {
          ...rec,
          affidavitSigned: true
        };
      });
      return { ...prev, serviceRecords: updatedRecords };
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 card-geom bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[var(--text-main)]">
              Process & Service Tracker
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              FRCP Rule 4(m) 90-Day Clock, Process Server Attempt Logs & Proof of Service (Affidavit of Return)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowAddAttemptModal(true);
            }}
            className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log Service Attempt</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Status & Countdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 90-Day Clock Banner */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                  FEDERAL / STATE STATUTORY SERVICE WINDOW
                </span>
                <h3 className="font-serif font-bold text-base text-[var(--text-main)] mt-0.5">
                  FRCP Rule 4(m) Deadline Clock
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 card-geom border ${
                currentRecord?.status === 'served'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-amber-950 border-amber-500 text-amber-300'
              }`}>
                {currentRecord?.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3">
                <div className="text-[10px] text-[var(--text-muted)] font-mono">COMPLAINT FILED</div>
                <div className="font-mono font-bold text-[var(--text-main)] mt-1">
                  {currentRecord?.filingDate}
                </div>
              </div>

              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3">
                <div className="text-[10px] text-[var(--text-muted)] font-mono">SERVICE DEADLINE (90D)</div>
                <div className="font-mono font-bold text-sky-400 mt-1">
                  {currentRecord?.deadlineDate}
                </div>
              </div>
            </div>

            <div className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1 text-xs">
              <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[var(--accent-gold)]" />
                Target Defendant:
              </div>
              <div className="font-mono text-[var(--text-main)] font-semibold">
                {currentRecord?.defendantName}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                Method: Statutory Registered Agent Service (CSC Corporate Agents)
              </div>
            </div>
          </div>

          {/* Service Methods Rules Advisory */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Service of Process Hierarchy
            </h4>

            <div className="space-y-2 text-xs">
              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2.5">
                <div className="font-bold text-[var(--text-main)]">1. Personal Service (Gold Standard)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Handing papers directly to the defendant. Complete immediately upon physical delivery.
                </p>
              </div>

              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2.5">
                <div className="font-bold text-[var(--text-main)]">2. Substituted Service (Requires Due Diligence)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Leaving with a competent adult at dwelling/workplace after 3 failed personal attempts + mailing copies.
                </p>
              </div>

              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2.5">
                <div className="font-bold text-[var(--text-main)]">3. Registered Agent (Corporate Defendants)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Serving the designated corporate agent registered with the Secretary of State (e.g. CSC, CT Corp).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Attempt Logs & Proof of Service (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Attempt Log Timeline */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
                Process Server Attempt Activity Log
              </h3>
              <span className="text-xs font-mono text-[var(--accent-gold)]">
                {currentRecord?.attempts.length} Logged Attempts
              </span>
            </div>

            <div className="space-y-3">
              {currentRecord?.attempts.map((att, idx) => (
                <div
                  key={att.id}
                  className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 card-geom bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          ATTEMPT #{idx + 1} — {att.success ? 'SUCCESSFUL' : 'FAILED'}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">{att.timestamp}</span>
                      </div>
                      <div className="font-bold text-[var(--text-main)] mt-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {att.address}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] bg-black/20 p-2 card-geom border border-white/5 leading-relaxed">
                    {att.notes}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1">
                    <span>Server: {att.serverName}</span>
                    {att.gpsCoords && <span className="text-[var(--accent-gold)]">GPS: {att.gpsCoords}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proof of Service Affidavit Generator */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
                  Proof of Service Affidavit (Return of Summons)
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAffidavitPreview(!showAffidavitPreview);
                }}
                className="btn-geom px-3 py-1 text-xs border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
              >
                {showAffidavitPreview ? 'Hide Affidavit' : 'View Court Affidavit'}
              </button>
            </div>

            {showAffidavitPreview ? (
              <div className="pleading-paper-container p-6 text-slate-900 text-xs space-y-4 font-pleading leading-relaxed border border-slate-300">
                <div className="text-center font-bold text-sm uppercase border-b border-slate-900 pb-2">
                  PROOF OF SERVICE OF SUMMONS AND COMPLAINT (CALIFORNIA POS-010)
                </div>

                <div className="space-y-1 text-[11px]">
                  <div>1. At the time of service I was at least 18 years of age and not a party to this action.</div>
                  <div>2. I served copies of the: <strong>SUMMONS, COMPLAINT, AND EXHIBITS A THROUGH E</strong>.</div>
                  <div>3. a. Party served: <strong>Vanguard Property Management LLC</strong></div>
                  <div>&nbsp;&nbsp;&nbsp;b. Person served: <strong>Brenda Vance, Authorized Agent for Service (CSC)</strong></div>
                  <div>4. Address where served: <strong>2710 Gateway Oaks Dr, Sacramento, CA 95833</strong></div>
                  <div>5. Date and time of service: <strong>{currentRecord?.attempts[0]?.timestamp || '09/05/2025'}</strong></div>
                  <div>6. Manner of service: <strong>Personal delivery to authorized corporate intake agent</strong>.</div>
                </div>

                <div className="pt-4 border-t border-slate-300 flex justify-between items-end">
                  <div className="text-[10px]">
                    Registered California Process Server #492<br />
                    County of Sacramento
                  </div>
                  <div className="text-right space-y-1">
                    {currentRecord?.affidavitSigned ? (
                      <div className="font-serif italic text-base text-blue-950 font-bold border-b border-slate-400 pb-1 w-44">
                        Apex Process / B. Taylor
                      </div>
                    ) : (
                      <button
                        onClick={handleSignAffidavit}
                        className="btn-geom px-3 py-1 bg-emerald-600 text-white font-bold text-xs"
                      >
                        Sign & Stamp Affidavit
                      </button>
                    )}
                    <div className="text-[10px] text-slate-600">Declaration Under Penalty of Perjury</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
                <span>Status: {currentRecord?.affidavitSigned ? 'Signed & Court-Ready' : 'Ready for Process Server Verification'}</span>
                <button
                  onClick={() => {
                    sound.playDocketStamp();
                    window.print();
                  }}
                  className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Proof of Service
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add Attempt */}
      {showAddAttemptModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Log Service Attempt
              </h3>
              <button 
                onClick={() => setShowAddAttemptModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAttempt} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Address Attempted</label>
                <input
                  type="text"
                  value={attemptAddress}
                  onChange={e => setAttemptAddress(e.target.value)}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Process Server Name</label>
                <input
                  type="text"
                  value={attemptServer}
                  onChange={e => setAttemptServer(e.target.value)}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Outcome</label>
                <select
                  value={attemptSuccess ? 'success' : 'failed'}
                  onChange={e => setAttemptSuccess(e.target.value === 'success')}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                >
                  <option value="success">Successful Service (Served)</option>
                  <option value="failed">Failed Attempt (No answer / Evasion)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Process Notes</label>
                <textarea
                  value={attemptNotes}
                  onChange={e => setAttemptNotes(e.target.value)}
                  placeholder="Notes on physical appearance, recipient statements..."
                  rows={3}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowAddAttemptModal(false)}
                  className="btn-geom px-4 py-2 text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-geom px-4 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
