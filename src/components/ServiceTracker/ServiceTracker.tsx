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
  Edit2,
  Trash2,
  Copy,
  Check,
  Scale
} from 'lucide-react';
import { ServiceRecord, ServiceAttempt } from '../../types';
import { sound } from '../../services/soundEngine';

export const ServiceTracker: React.FC = () => {
  const { activeCase, updateActiveCase } = useSueChef();
  const [showAddAttemptModal, setShowAddAttemptModal] = useState(false);
  const [showAffidavitPreview, setShowAffidavitPreview] = useState(false);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const [copiedAffidavit, setCopiedAffidavit] = useState(false);

  const defendants = activeCase.parties.filter(p => p.role === 'defendant' || p.role === 'co-defendant');
  const primaryDefendant = defendants[0] || activeCase.parties[1] || {
    id: 'def_1',
    name: 'Defendant Entity LLC',
    address: '100 Legal Way, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105'
  };

  // Ensure activeCase has at least one service record
  const currentRecord: ServiceRecord = activeCase.serviceRecords[selectedRecordIndex] || {
    id: 'srv_1',
    defendantId: primaryDefendant.id,
    defendantName: primaryDefendant.name,
    serviceMethod: 'statutory_agent',
    filingDate: activeCase.createdAt ? activeCase.createdAt.split('T')[0] : '2026-09-01',
    deadlineDate: '2026-11-30',
    daysRemaining: 85,
    status: 'in_progress',
    attempts: [
      {
        id: 'att_1',
        timestamp: '09/05/2026 10:15 AM',
        address: primaryDefendant.address ? `${primaryDefendant.address}, ${primaryDefendant.city}, ${primaryDefendant.state}` : '2710 Gateway Oaks Dr, Sacramento, CA 95833',
        serverName: 'Apex Legal Process Services Inc. / B. Taylor',
        serverLicenseNumber: 'Reg. Process Server #492 (Sacramento Co.)',
        recipientName: 'Brenda Vance',
        recipientTitle: 'Authorized Agent for Service (CSC)',
        success: true,
        notes: 'Hand-delivered Summons, Complaint, and Exhibits A-D directly to corporate intake clerk. Confirmed identity and authorized agency.',
        gpsCoords: '37.3382° N, 121.8863° W'
      }
    ],
    affidavitSigned: true,
    formType: 'CA_POS_010',
    affidavitDeclarantName: 'Brian Taylor',
    serverLicenseNumber: '492',
    countyOfRegistration: 'Sacramento County'
  };

  // New attempt form state
  const [attemptAddress, setAttemptAddress] = useState(
    primaryDefendant.address ? `${primaryDefendant.address}, ${primaryDefendant.city}, ${primaryDefendant.state}` : ''
  );
  const [attemptServer, setAttemptServer] = useState('Apex Legal Process Services Inc.');
  const [attemptLicense, setAttemptLicense] = useState('Reg. Process Server #492');
  const [attemptRecipientName, setAttemptRecipientName] = useState('Brenda Vance');
  const [attemptRecipientTitle, setAttemptRecipientTitle] = useState('Authorized Intake Agent (CSC)');
  const [attemptSuccess, setAttemptSuccess] = useState(true);
  const [attemptNotes, setAttemptNotes] = useState('');
  const [attemptGps, setAttemptGps] = useState('37.3382° N, 121.8863° W');

  const handleAddAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playDocketStamp();

    const newAttempt: ServiceAttempt = {
      id: `att_${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      address: attemptAddress,
      serverName: attemptServer,
      serverLicenseNumber: attemptLicense,
      recipientName: attemptRecipientName,
      recipientTitle: attemptRecipientTitle,
      success: attemptSuccess,
      notes: attemptNotes || (attemptSuccess ? 'Personal physical delivery executed to authorized recipient.' : 'Attempted service; premises locked, no response.'),
      gpsCoords: attemptGps
    };

    updateActiveCase(prev => {
      const records = prev.serviceRecords && prev.serviceRecords.length > 0 
        ? [...prev.serviceRecords] 
        : [currentRecord];

      const updated = records.map((rec, i) => {
        if (i !== selectedRecordIndex) return rec;
        return {
          ...rec,
          status: attemptSuccess ? ('served' as const) : rec.status,
          dateServed: attemptSuccess ? new Date().toISOString().split('T')[0] : rec.dateServed,
          attempts: [...rec.attempts, newAttempt]
        };
      });

      return { ...prev, serviceRecords: updated };
    });

    setShowAddAttemptModal(false);
    setAttemptNotes('');
  };

  const handleDeleteAttempt = (attemptId: string) => {
    sound.playClick();
    updateActiveCase(prev => {
      const records = prev.serviceRecords.map((rec, i) => {
        if (i !== selectedRecordIndex) return rec;
        const newAttempts = rec.attempts.filter(a => a.id !== attemptId);
        const hasSuccess = newAttempts.some(a => a.success);
        return {
          ...rec,
          status: hasSuccess ? ('served' as const) : ('in_progress' as const),
          attempts: newAttempts
        };
      });
      return { ...prev, serviceRecords: records };
    });
  };

  const handleSignAffidavit = () => {
    sound.playSuccessChime();
    updateActiveCase(prev => {
      const records = (prev.serviceRecords && prev.serviceRecords.length > 0 ? prev.serviceRecords : [currentRecord]).map((rec, i) => {
        if (i !== selectedRecordIndex) return rec;
        return {
          ...rec,
          affidavitSigned: true
        };
      });
      return { ...prev, serviceRecords: records };
    });
  };

  const handleUpdateRecordField = (patch: Partial<ServiceRecord>) => {
    sound.playClick();
    updateActiveCase(prev => {
      const records = (prev.serviceRecords && prev.serviceRecords.length > 0 ? prev.serviceRecords : [currentRecord]).map((rec, i) => {
        if (i !== selectedRecordIndex) return rec;
        return {
          ...rec,
          ...patch
        };
      });
      return { ...prev, serviceRecords: records };
    });
  };

  const generateAffidavitText = () => {
    const pl = activeCase.parties.find(p => p.role === 'plaintiff');
    const successfulAttempt = currentRecord.attempts.find(a => a.success) || currentRecord.attempts[0];
    const declarant = currentRecord.affidavitDeclarantName || 'Brian Taylor';
    const formName = currentRecord.formType === 'FRCP_AO_440'
      ? 'FEDERAL RULE 4 / FORM AO 440 SUMMONS RETURN OF SERVICE'
      : currentRecord.formType === 'UNIVERSAL_CIVIL'
      ? 'UNIVERSAL PRO SE AFFIDAVIT OF SERVICE OF SUMMONS AND COMPLAINT'
      : 'STATE OF CALIFORNIA PROOF OF SERVICE OF SUMMONS (POS-010)';

    return `================================================================================
${formName}
COURT: ${activeCase.courtName}
CASE NO.: ${activeCase.caseNumber}
MATTER: ${activeCase.title}
================================================================================

1. DECLARATION OF SERVER:
   I, ${declarant}, declare under penalty of perjury under the laws of the State of ${activeCase.state} and the United States of America that:
   a. At the time of service I was at least 18 years of age and not a party to this action.
   b. I am a registered process server in ${currentRecord.countyOfRegistration || 'Sacramento County'}, Registration/License No.: ${currentRecord.serverLicenseNumber || '492'}.

2. DOCUMENTS SERVED:
   I served copies of the: SUMMONS, VERIFIED COMPLAINT, CIVIL COVER SHEET, AND EXHIBITS A THROUGH ${activeCase.evidenceList.length > 0 ? String.fromCharCode(64 + Math.min(26, activeCase.evidenceList.length)) : 'D'}.

3. PARTY & PERSON SERVED:
   a. Party served: ${currentRecord.defendantName}
   b. Person served: ${successfulAttempt?.recipientName || 'Authorized Corporate Agent'} (${successfulAttempt?.recipientTitle || 'Authorized Agent for Service'})

4. LOCATION & TIME OF SERVICE:
   a. Address: ${successfulAttempt?.address || currentRecord.defendantName}
   b. Date and Time: ${successfulAttempt?.timestamp || new Date().toLocaleString()}
   c. GPS Verification: ${successfulAttempt?.gpsCoords || 'Verified On-Site'}

5. MANNER OF SERVICE:
   [X] Personal Delivery: By handing true and correct copies directly to the person served.
   [ ] Substituted Service: After due diligence of three attempts, by leaving copies with a competent adult at dwelling/usual place of business.
   [ ] Statutory Registered Corporate Agent: Delivered to designated corporate agent of record.

6. SERVER CERTIFICATION UNDER PENALTY OF PERJURY:
   I declare under penalty of perjury that the foregoing is true and correct.

Executed on: ${currentRecord.dateServed || new Date().toISOString().split('T')[0]} at ${activeCase.county}, ${activeCase.state}.

________________________________________
${declarant}
${currentRecord.serverLicenseNumber ? `Registered Process Server #${currentRecord.serverLicenseNumber}` : 'Disinterested Process Server'}
`;
  };

  const handleCopyAffidavit = () => {
    sound.playDocketStamp();
    const text = generateAffidavitText();
    navigator.clipboard.writeText(text);
    setCopiedAffidavit(true);
    setTimeout(() => setCopiedAffidavit(false), 2500);
  };

  const successfulAttempt = currentRecord.attempts.find(a => a.success) || currentRecord.attempts[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 card-geom bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[var(--text-main)]">
              Process &amp; Service Tracker
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              FRCP Rule 4(m) 90-Day Clock, Process Server Attempt Logs &amp; Proof of Service (Affidavit of Return)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowAddAttemptModal(true);
            }}
            className="btn-geom flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all shadow-sm"
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

            {/* Defendant Target Picker */}
            <div className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2 text-xs">
              <div className="font-bold text-[var(--text-main)] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[var(--accent-gold)]" />
                  <span>Target Defendant:</span>
                </div>
                {defendants.length > 1 && (
                  <select
                    value={selectedRecordIndex}
                    onChange={e => setSelectedRecordIndex(parseInt(e.target.value))}
                    className="text-[10px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] px-2 py-0.5"
                  >
                    {defendants.map((d, idx) => (
                      <option key={d.id} value={idx}>{d.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="font-mono text-[var(--text-main)] font-semibold">
                {currentRecord?.defendantName}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                Service Method: {currentRecord.serviceMethod.replace(/_/g, ' ').toUpperCase()}
              </div>
            </div>
          </div>

          {/* Service Methods Rules Advisory */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Service of Process Legal Hierarchy
            </h4>

            <div className="space-y-2 text-xs">
              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2.5">
                <div className="font-bold text-[var(--text-main)]">1. Personal Service (Gold Standard)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Handing papers directly to the named defendant. Complete immediately upon physical in-hand delivery.
                </p>
              </div>

              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2.5">
                <div className="font-bold text-[var(--text-main)]">2. Substituted Service (Requires 3 Prior Attempts)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Leaving copies with a competent adult at dwelling/workplace after 3 failed personal attempts + mailing copies.
                </p>
              </div>

              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2.5">
                <div className="font-bold text-[var(--text-main)]">3. Statutory Registered Agent (Corporations/LLCs)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Serving the official registered agent recorded with the Secretary of State (e.g. CSC, CT Corporation).
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
                        <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 card-geom border ${
                          att.success 
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-950 text-rose-400 border-rose-500/30'
                        }`}>
                          ATTEMPT #{idx + 1} — {att.success ? 'SUCCESSFUL (SERVED)' : 'FAILED ATTEMPT'}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">{att.timestamp}</span>
                      </div>
                      <div className="font-bold text-[var(--text-main)] mt-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {att.address}
                      </div>
                      {att.recipientName && (
                        <div className="text-[11px] text-[var(--accent-gold)] font-mono mt-0.5">
                          Recipient: {att.recipientName} {att.recipientTitle ? `(${att.recipientTitle})` : ''}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteAttempt(att.id)}
                      className="text-[var(--text-muted)] hover:text-rose-400 p-1"
                      title="Delete Attempt Log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] bg-black/20 p-2 card-geom border border-white/5 leading-relaxed">
                    {att.notes}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-color)]/40">
                    <span>Server: {att.serverName}</span>
                    {att.gpsCoords && <span className="text-[var(--accent-gold)]">GPS: {att.gpsCoords}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proof of Service Affidavit Generator */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
                  Proof of Service Affidavit (Return of Summons)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={currentRecord.formType || 'CA_POS_010'}
                  onChange={e => handleUpdateRecordField({ formType: e.target.value as any })}
                  className="text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] px-2 py-1 card-geom"
                >
                  <option value="CA_POS_010">California POS-010 Form</option>
                  <option value="FRCP_AO_440">Federal AO 440 Return</option>
                  <option value="UNIVERSAL_CIVIL">Universal Pro Se Return</option>
                </select>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowAffidavitPreview(!showAffidavitPreview);
                  }}
                  className="btn-geom px-3 py-1 text-xs border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
                >
                  {showAffidavitPreview ? 'Collapse Affidavit' : 'View Court Affidavit'}
                </button>
              </div>
            </div>

            {showAffidavitPreview ? (
              <div className="pleading-paper-container p-6 text-slate-900 text-xs space-y-4 font-pleading leading-relaxed border border-slate-300 bg-white">
                <div className="text-center font-bold text-sm uppercase border-b border-slate-900 pb-2">
                  {currentRecord.formType === 'FRCP_AO_440' 
                    ? 'PROOF OF SERVICE OF SUMMONS IN A CIVIL ACTION (FRCP FORM AO 440)'
                    : currentRecord.formType === 'UNIVERSAL_CIVIL'
                    ? 'UNIVERSAL AFFIDAVIT AND RETURN OF SERVICE OF SUMMONS'
                    : 'PROOF OF SERVICE OF SUMMONS AND COMPLAINT (CALIFORNIA POS-010)'}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] border-b border-slate-300 pb-2">
                  <div><strong>Court:</strong> {activeCase.courtName}</div>
                  <div><strong>Case Number:</strong> {activeCase.caseNumber}</div>
                  <div><strong>Plaintiff:</strong> {activeCase.parties.find(p => p.role === 'plaintiff')?.name}</div>
                  <div><strong>Defendant:</strong> {currentRecord.defendantName}</div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div>1. At the time of service I was at least 18 years of age and not a party to this action.</div>
                  <div>2. I served copies of the: <strong>SUMMONS, COMPLAINT, CIVIL COVER SHEET, AND EXHIBITS A THROUGH {activeCase.evidenceList.length > 0 ? String.fromCharCode(64 + Math.min(26, activeCase.evidenceList.length)) : 'D'}</strong>.</div>
                  <div>3. a. Party served: <strong>{currentRecord.defendantName}</strong></div>
                  <div>&nbsp;&nbsp;&nbsp;b. Person served: <strong>{successfulAttempt?.recipientName || 'Authorized Agent for Service'} ({successfulAttempt?.recipientTitle || 'Authorized Agent'})</strong></div>
                  <div>4. Address where served: <strong>{successfulAttempt?.address || currentRecord.defendantName}</strong></div>
                  <div>5. Date and time of service: <strong>{successfulAttempt?.timestamp || new Date().toLocaleString()}</strong></div>
                  <div>6. Manner of service: <strong>Personal physical delivery to authorized corporate intake agent with identity verification</strong>.</div>
                </div>

                {/* Declarant Details */}
                <div className="pt-3 border-t border-slate-300 grid grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <label className="text-slate-600 block font-bold">Process Server Declarant Name:</label>
                    <input
                      type="text"
                      value={currentRecord.affidavitDeclarantName || 'Brian Taylor'}
                      onChange={e => handleUpdateRecordField({ affidavitDeclarantName: e.target.value })}
                      className="border border-slate-300 px-2 py-1 w-full mt-0.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block font-bold">Registration / County / License No.:</label>
                    <input
                      type="text"
                      value={currentRecord.serverLicenseNumber || '492 (Sacramento County)'}
                      onChange={e => handleUpdateRecordField({ serverLicenseNumber: e.target.value })}
                      className="border border-slate-300 px-2 py-1 w-full mt-0.5 text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-300 flex justify-between items-end">
                  <div className="text-[10px]">
                    Registered Process Server #{currentRecord.serverLicenseNumber || '492'}<br />
                    County: {currentRecord.countyOfRegistration || 'Sacramento'}
                  </div>
                  <div className="text-right space-y-1">
                    {currentRecord?.affidavitSigned ? (
                      <div className="font-serif italic text-base text-blue-950 font-bold border-b border-slate-400 pb-1 w-44">
                        {currentRecord.affidavitDeclarantName || 'Brian Taylor'}
                      </div>
                    ) : (
                      <button
                        onClick={handleSignAffidavit}
                        className="btn-geom px-3 py-1 bg-emerald-600 text-white font-bold text-xs shadow-sm"
                      >
                        Sign &amp; Stamp Affidavit
                      </button>
                    )}
                    <div className="text-[10px] text-slate-600">Declaration Under Penalty of Perjury</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-300">
                  <button
                    onClick={handleCopyAffidavit}
                    className="px-3 py-1 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-200"
                  >
                    {copiedAffidavit ? 'Copied Affidavit!' : 'Copy Affidavit Text'}
                  </button>
                  <button
                    onClick={() => {
                      sound.playDocketStamp();
                      window.print();
                    }}
                    className="px-3 py-1 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                  >
                    Print Proof of Service
                  </button>
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
                  className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Proof of Service</span>
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

              <div className="grid grid-cols-2 gap-2">
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
                  <label className="text-xs font-mono text-[var(--text-muted)]">Server License / Reg #</label>
                  <input
                    type="text"
                    value={attemptLicense}
                    onChange={e => setAttemptLicense(e.target.value)}
                    className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)]">Recipient Person Served</label>
                  <input
                    type="text"
                    value={attemptRecipientName}
                    onChange={e => setAttemptRecipientName(e.target.value)}
                    placeholder="e.g. Brenda Vance"
                    className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)]">Recipient Title / Capacity</label>
                  <input
                    type="text"
                    value={attemptRecipientTitle}
                    onChange={e => setAttemptRecipientTitle(e.target.value)}
                    placeholder="e.g. Authorized Agent (CSC)"
                    className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Outcome</label>
                <select
                  value={attemptSuccess ? 'success' : 'failed'}
                  onChange={e => setAttemptSuccess(e.target.value === 'success')}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 font-semibold"
                >
                  <option value="success">Successful Service (Served In-Hand)</option>
                  <option value="failed">Failed Attempt (No answer / Evasion / Refused entry)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">GPS Verification Coordinates</label>
                <input
                  type="text"
                  value={attemptGps}
                  onChange={e => setAttemptGps(e.target.value)}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Process Notes &amp; Physical Observations</label>
                <textarea
                  value={attemptNotes}
                  onChange={e => setAttemptNotes(e.target.value)}
                  placeholder="Notes on recipient appearance, statements made, corporate intake procedures..."
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

