import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Send, 
  Edit3, 
  Eye, 
  Sparkles, 
  Printer, 
  ShieldCheck,
  Building,
  User,
  Scale,
  Plus,
  Trash2,
  Calendar,
  Mail
} from 'lucide-react';
import { PleadingParagraph } from '../../types';
import { getJurisdiction } from '../../services/jurisdictions';
import { sound } from '../../services/soundEngine';

export const PleadingBuilder: React.FC = () => {
  const { activeCase, updateActiveCase, updateParagraph } = useSueChef();
  const [activeSubTab, setActiveSubTab] = useState<'complaint' | 'demand_letter' | 'verification'>('complaint');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFont, setSelectedFont] = useState<'Century Schoolbook' | 'Times New Roman' | 'Courier New' | 'Georgia'>(
    activeCase.pleadings.fontFamily || 'Century Schoolbook'
  );

  // New Paragraph Modal State
  const [showAddParaModal, setShowAddParaModal] = useState(false);
  const [newParaHeading, setNewParaHeading] = useState('');
  const [newParaContent, setNewParaContent] = useState('');
  const [newParaSection, setNewParaSection] = useState<PleadingParagraph['section']>('facts');

  const jurisdiction = getJurisdiction(activeCase.state || 'CA');
  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff') || activeCase.parties[0];
  const defendant = activeCase.parties.find(p => p.role === 'defendant') || activeCase.parties[1];

  const principalDamage = activeCase.claimEvaluation.damages.find(d => d.category === 'direct_actual')?.amount || 2500;
  const statutoryPenalty = activeCase.claimEvaluation.damages.find(d => d.category === 'statutory_penalty')?.amount || 0;
  const interestDamage = activeCase.claimEvaluation.damages.find(d => d.category === 'interest')?.amount || 0;
  const totalDamages = activeCase.claimEvaluation.damages.reduce((sum, d) => sum + (d.amount || 0), 0) || (principalDamage + statutoryPenalty + interestDamage);

  const deadlineDays = activeCase.pleadings.demandLetter.responseDeadlineDays || 10;
  const demandDateObj = new Date(activeCase.pleadings.demandLetter.demandDate || activeCase.createdAt || new Date());
  const calculatedDeadline = new Date(demandDateObj.getTime() + deadlineDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedPrincipal = `$${principalDamage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedPenalty = `$${statutoryPenalty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedTotal = `$${totalDamages.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleAddParagraph = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParaContent.trim()) return;
    sound.playDocketStamp();

    const newPara: PleadingParagraph = {
      id: `para_${Date.now()}`,
      number: activeCase.pleadings.paragraphs.length + 1,
      heading: newParaHeading.trim() ? newParaHeading.trim().toUpperCase() : undefined,
      content: newParaContent.trim(),
      section: newParaSection,
      linkedEvidenceIds: []
    };

    updateActiveCase(prev => ({
      ...prev,
      pleadings: {
        ...prev.pleadings,
        paragraphs: [...prev.pleadings.paragraphs, newPara]
      }
    }));

    setShowAddParaModal(false);
    setNewParaHeading('');
    setNewParaContent('');
  };

  const handleDeleteParagraph = (id: string) => {
    sound.playClick();
    updateActiveCase(prev => ({
      ...prev,
      pleadings: {
        ...prev.pleadings,
        paragraphs: prev.pleadings.paragraphs
          .filter(p => p.id !== id)
          .map((p, idx) => ({ ...p, number: idx + 1 }))
      }
    }));
  };

  const handleCopyText = () => {
    sound.playClick();
    let textToCopy = '';
    
    if (activeSubTab === 'complaint') {
      textToCopy = [
        `${activeCase.courtName.toUpperCase()}`,
        '-------------------------------------------------------',
        `${plaintiff?.name || 'PLAINTIFF'},`,
        '        Plaintiff,',
        '    v.                                CASE NO. ' + activeCase.caseNumber,
        `${defendant?.name || 'DEFENDANT'},`,
        '        Defendant.',
        '-------------------------------------------------------',
        'COMPLAINT FOR DAMAGES AND STATUTORY PENALTIES',
        '',
        ...activeCase.pleadings.paragraphs.map(p => 
          `${p.heading ? `\n${p.heading}\n` : ''}${p.number}. ${p.content}`
        )
      ].join('\n');
    } else if (activeSubTab === 'demand_letter') {
      textToCopy = [
        'FORMAL LEGAL NOTICE & DEMAND FOR SETTLEMENT PRIOR TO LITIGATION',
        `Date: ${activeCase.pleadings.demandLetter.demandDate}`,
        `Certified Mail No: ${activeCase.pleadings.demandLetter.certifiedMailNumber || 'USPS CERTIFIED'}`,
        '',
        `TO: ${defendant?.name}`,
        `    ${defendant?.address}, ${defendant?.city}, ${defendant?.state} ${defendant?.zip}`,
        '',
        `FROM: ${plaintiff?.name}`,
        `      ${plaintiff?.address}, ${plaintiff?.city}, ${plaintiff?.state} ${plaintiff?.zip}`,
        '',
        `RE: FINAL DEMAND FOR IMMEDIATE SETTLEMENT & PAYMENT (${formattedTotal})`,
        '',
        `Dear ${defendant?.name}:`,
        `This letter serves as formal written notice and final demand for the immediate payment of ${formattedPrincipal} owed to Claimant.`,
        '',
        activeCase.pleadings.demandLetter.settlementOfferText,
        '',
        `DEMANDED SETTLEMENT TERMS:`,
        `• Principal Due: ${formattedPrincipal}`,
        statutoryPenalty > 0 ? `• Statutory Bad-Faith Penalty Claimable: ${formattedPenalty} (${jurisdiction.securityDepositStatuteCitation})` : '',
        interestDamage > 0 ? `• Accrued Prejudgment Interest: $${interestDamage.toFixed(2)} (${jurisdiction.statutoryInterestRatePercent}%)` : '',
        `• Total Demanded Sum: ${formattedTotal}`,
        `• Response Deadline: ${deadlineDays} calendar days (${calculatedDeadline})`,
        '',
        `Failure to remit the demanded sum on or before ${calculatedDeadline} will result in the immediate filing of a civil action in ${jurisdiction.courtName}, seeking full compensatory damages, statutory penalties under ${jurisdiction.securityDepositStatuteCitation || 'state law'}, prejudgment interest, and court filing costs.`,
        '',
        `Respectfully submitted,`,
        `${plaintiff?.name}`
      ].filter(Boolean).join('\n');
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    sound.playDocketStamp();
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    sound.playDocketStamp();
    window.print();
  };

  // Generate 28 margin line numbers
  const lineNumbers = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-fadeIn">
      {/* Header & Subtabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 card-geom bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[var(--text-main)]">
              Pleading &amp; Document Builder
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              28-Line State/Federal Pleading Paper, Formal 10-Day Demand Letters &amp; Sworn Affidavits
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('complaint');
            }}
            className={`tab-geom px-3 py-1.5 text-xs font-semibold border transition-all ${
              activeSubTab === 'complaint'
                ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            Court Complaint (28-Line)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('demand_letter');
            }}
            className={`tab-geom px-3 py-1.5 text-xs font-semibold border transition-all ${
              activeSubTab === 'demand_letter'
                ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            10-Day Demand Letter
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('verification');
            }}
            className={`tab-geom px-3 py-1.5 text-xs font-semibold border transition-all ${
              activeSubTab === 'verification'
                ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            Verification Affidavit
          </button>
        </div>
      </div>

      {/* Toolbar: Font Selection, Mode Toggle, Export/Copy */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 card-geom bg-[var(--bg-card)] border border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            Court Typography:
          </label>
          <select
            value={selectedFont}
            onChange={e => {
              sound.playClick();
              setSelectedFont(e.target.value as typeof selectedFont);
            }}
            className="input-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-2 py-1"
          >
            <option value="Century Schoolbook">Century Schoolbook (California Rule 2.105)</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New (Typewriter Pleading)</option>
            <option value="Georgia">Georgia</option>
          </select>

          <button
            onClick={() => {
              sound.playClick();
              setIsEditing(!isEditing);
            }}
            className={`btn-geom flex items-center gap-1.5 px-3 py-1 text-xs border ${
              isEditing ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Preview Mode' : 'WYSIWYG Edit'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="btn-geom flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-geom flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Viewer Container */}
      {activeSubTab === 'complaint' && (
        <div className="max-w-4xl mx-auto pleading-paper-container p-8 md:p-12 text-slate-900 border border-slate-300 rounded-sm shadow-2xl relative font-pleading leading-relaxed">
          
          {/* 28-Line Pleading Paper Numbered Left Margin */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* 1-28 Line Margin (2 Cols) */}
            <div className="col-span-1 border-r-2 border-double border-slate-400 pr-2 text-right select-none font-mono text-xs text-slate-400 space-y-[1.12rem] pt-1">
              {lineNumbers.map(n => (
                <div key={n}>{n}</div>
              ))}
            </div>

            {/* Pleading Content (11 Cols) */}
            <div className="col-span-11 pl-2 space-y-6 text-sm" style={{ fontFamily: selectedFont }}>
              
              {/* Attorney / Pro Se Header */}
              <div className="text-xs font-mono space-y-0.5 border-b border-slate-200 pb-3">
                <div className="font-bold text-slate-950">{plaintiff?.name} (In Pro Per / Pro Se)</div>
                <div>{plaintiff?.address}</div>
                <div>{plaintiff?.city}, {plaintiff?.state} {plaintiff?.zip}</div>
                <div>Telephone: {plaintiff?.phone}</div>
                <div>Email: {plaintiff?.email}</div>
                <div className="italic text-slate-600 mt-1">Plaintiff in Propria Persona</div>
              </div>

              {/* Court Header */}
              <div className="text-center font-bold uppercase tracking-wider text-base pt-2">
                {activeCase.courtName}
              </div>

              {/* Formal Case Caption Box */}
              <div className="grid grid-cols-2 border-y-2 border-slate-900 py-3 text-xs">
                <div className="border-r border-slate-400 pr-3 space-y-2">
                  <div className="font-bold">{plaintiff?.name},</div>
                  <div className="pl-6 italic">Plaintiff,</div>
                  <div className="font-bold pt-2">v.</div>
                  <div className="font-bold pt-2">{defendant?.name},</div>
                  <div className="pl-6 italic">Defendant.</div>
                </div>

                <div className="pl-4 space-y-1.5">
                  <div className="font-bold font-mono">CASE NO. {activeCase.caseNumber}</div>
                  <div className="font-bold uppercase text-[11px] leading-snug">
                    COMPLAINT FOR DAMAGES AND STATUTORY BAD-FAITH PENALTIES
                  </div>
                  <div className="text-[10px] text-slate-600 italic">
                    1. {jurisdiction.securityDepositStatuteCitation || 'Statutory Violation'}<br />
                    2. Breach of Contract / Unlawful Retention<br />
                    3. Unjust Enrichment &amp; Prejudgment Interest
                  </div>
                  <div className="text-[10px] font-bold text-slate-800">DEMAND FOR JURY TRIAL</div>
                </div>
              </div>

              {/* Numbered Legal Paragraphs */}
              <div className="space-y-4 pt-2">
                {isEditing && (
                  <div className="flex justify-between items-center bg-amber-50 p-3 border border-amber-300 card-geom">
                    <span className="text-xs font-mono font-bold text-amber-950">
                      WYSIWYG Pleading Editor ({activeCase.pleadings.paragraphs.length} Paragraphs)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setShowAddParaModal(true);
                      }}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs card-geom flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>
                )}

                {activeCase.pleadings.paragraphs.map(p => (
                  <div key={p.id} className="space-y-1 relative group">
                    {p.heading && (
                      <div className="font-bold uppercase tracking-wider text-xs pt-3 text-slate-950 border-b border-slate-200 pb-1">
                        {p.heading}
                      </div>
                    )}
                    {isEditing ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                          <span>Paragraph {p.number} ({p.section})</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteParagraph(p.id)}
                            className="text-rose-600 hover:text-rose-800 p-1 flex items-center gap-1"
                            title="Delete Paragraph"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                        <textarea
                          value={p.content}
                          onChange={e => updateParagraph(p.id, e.target.value)}
                          className="w-full bg-amber-50/50 border border-amber-300 p-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          rows={3}
                        />
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed text-slate-900 indent-8">
                        <span className="font-bold font-mono">{p.number}. </span>
                        {p.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Signature Block */}
              <div className="pt-8 space-y-4 border-t border-slate-300">
                <div className="flex justify-between text-xs">
                  <div>DATED: {activeCase.createdAt}</div>
                  <div className="text-right space-y-4">
                    <div className="font-serif italic text-base text-blue-950 border-b border-slate-400 pb-1 w-48">
                      {plaintiff?.name}
                    </div>
                    <div className="font-bold text-xs">{plaintiff?.name}</div>
                    <div className="italic text-slate-600">Plaintiff in Propria Persona</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demand Letter View */}
      {activeSubTab === 'demand_letter' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Demand Letter Controls */}
          <div className="p-4 card-geom bg-[var(--bg-card)] border border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                Certified Mail Tracking #
              </label>
              <input
                type="text"
                value={activeCase.pleadings.demandLetter.certifiedMailNumber || ''}
                onChange={e => {
                  const val = e.target.value;
                  updateActiveCase(prev => ({
                    ...prev,
                    pleadings: {
                      ...prev.pleadings,
                      demandLetter: {
                        ...prev.pleadings.demandLetter,
                        certifiedMailNumber: val
                      }
                    }
                  }));
                }}
                className="input-geom w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-xs"
                placeholder="7021 0350 0001 2345 6789"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                Response Deadline Window
              </label>
              <select
                value={activeCase.pleadings.demandLetter.responseDeadlineDays || 10}
                onChange={e => {
                  sound.playClick();
                  const val = parseInt(e.target.value) || 10;
                  updateActiveCase(prev => ({
                    ...prev,
                    pleadings: {
                      ...prev.pleadings,
                      demandLetter: {
                        ...prev.pleadings.demandLetter,
                        responseDeadlineDays: val
                      }
                    }
                  }));
                }}
                className="input-geom w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] text-xs"
              >
                <option value={7}>7 Calendar Days (Urgent Demand)</option>
                <option value={10}>10 Calendar Days (Standard Notice)</option>
                <option value={14}>14 Calendar Days (Statutory 2-Week Window)</option>
                <option value={21}>21 Calendar Days (Landlord Statutory Cure)</option>
                <option value={30}>30 Calendar Days (Commercial / Government Notice)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                Demand Letter Date
              </label>
              <input
                type="date"
                value={activeCase.pleadings.demandLetter.demandDate || activeCase.createdAt || ''}
                onChange={e => {
                  const val = e.target.value;
                  updateActiveCase(prev => ({
                    ...prev,
                    pleadings: {
                      ...prev.pleadings,
                      demandLetter: {
                        ...prev.pleadings.demandLetter,
                        demandDate: val
                      }
                    }
                  }));
                }}
                className="input-geom w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-xs"
              />
            </div>
          </div>

          <div className="pleading-paper-container p-8 md:p-12 text-slate-900 border border-slate-300 rounded-sm shadow-2xl space-y-6 text-xs leading-relaxed font-pleading">
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h2 className="font-bold text-base uppercase tracking-wider text-slate-950">
                FORMAL LEGAL NOTICE &amp; SETTLEMENT DEMAND
              </h2>
              <p className="text-[11px] font-mono text-slate-600">
                SENT VIA USPS CERTIFIED MAIL WITH RETURN RECEIPT REQUESTED
              </p>
              <div className="font-mono text-xs font-bold text-slate-800">
                TRACKING NO: {activeCase.pleadings.demandLetter.certifiedMailNumber || 'USPS CERTIFIED'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="font-bold text-slate-700">SENT BY:</span>
                <div className="font-bold">{plaintiff?.name}</div>
                <div>{plaintiff?.address}</div>
                <div>{plaintiff?.city}, {plaintiff?.state} {plaintiff?.zip}</div>
              </div>

              <div>
                <span className="font-bold text-slate-700">DELIVERED TO:</span>
                <div className="font-bold">{defendant?.name}</div>
                <div>{defendant?.address}</div>
                <div>{defendant?.city}, {defendant?.state} {defendant?.zip}</div>
                <div className="text-slate-600 italic">Attn: Legal Department / Managing Officer</div>
              </div>
            </div>

            <div className="pt-3 font-bold border-t border-slate-200">
              RE: FINAL DEMAND FOR IMMEDIATE SETTLEMENT &amp; PAYMENT ({formattedTotal})
            </div>

            <p className="indent-6">
              Dear {defendant?.name}:
            </p>

            <p className="indent-6">
              This letter serves as formal written demand for the immediate payment and reimbursement of Claimant’s principal claim in the amount of <strong>{formattedPrincipal}</strong>.
            </p>

            <p className="indent-6">
              Under {jurisdiction.stateName} law ({jurisdiction.securityDepositStatuteCitation || 'applicable statutes'}), an opposing party has an affirmative statutory duty to return withheld funds and provide complete accounting within <strong>{jurisdiction.securityDepositReturnDays || 21} calendar days</strong>. Defendant has failed to satisfy statutory deadlines, unlawfully withholding funds from Claimant.
            </p>

            <div className="p-4 bg-slate-100 border-l-4 border-slate-800 text-xs font-mono space-y-1">
              <div className="font-bold">ITEMIZED CLAIM &amp; DEMANDED SETTLEMENT TERMS:</div>
              <div>• Principal Amount Due: {formattedPrincipal}</div>
              {statutoryPenalty > 0 && (
                <div>• Statutory Bad-Faith Penalty (Authorized under {jurisdiction.securityDepositStatuteCitation}): {formattedPenalty}</div>
              )}
              {interestDamage > 0 && (
                <div>• Accrued Prejudgment Interest ({jurisdiction.statutoryInterestRatePercent}% per annum): ${interestDamage.toFixed(2)}</div>
              )}
              <div className="font-bold text-slate-950 pt-1">• Total Enforceable Demand Sum: {formattedTotal}</div>
              <div>• Response Deadline: Within {deadlineDays} calendar days ({calculatedDeadline})</div>
            </div>

            <p className="indent-6">
              If full settlement payment is not received on or before <strong>{calculatedDeadline}</strong>, Claimant will immediately file a formal civil lawsuit in <strong>{jurisdiction.courtName}</strong>. In addition to the principal amount of {formattedPrincipal}, Claimant will vigorously seek maximum statutory bad-faith penalties of <strong>{formattedPenalty}</strong>, prejudgment daily interest, court filing fees, and certified process server costs.
            </p>

            <div className="pt-6 flex justify-between items-end">
              <div>
                <div>DATED: {activeCase.pleadings.demandLetter.demandDate}</div>
              </div>
              <div className="text-right space-y-2">
                <div className="font-serif italic text-base text-blue-950 border-b border-slate-400 pb-1 w-48">
                  {plaintiff?.name}
                </div>
                <div className="font-bold">{plaintiff?.name}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Affidavit View */}
      {activeSubTab === 'verification' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Verification Controls */}
          <div className="p-4 card-geom bg-[var(--bg-card)] border border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                Declarant Name
              </label>
              <input
                type="text"
                value={activeCase.pleadings.verificationAffidavit.declarantName || plaintiff?.name || ''}
                onChange={e => {
                  const val = e.target.value;
                  updateActiveCase(prev => ({
                    ...prev,
                    pleadings: {
                      ...prev.pleadings,
                      verificationAffidavit: {
                        ...prev.pleadings.verificationAffidavit,
                        declarantName: val
                      }
                    }
                  }));
                }}
                className="input-geom w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] text-xs"
                placeholder="Full Legal Name"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                Execution Date
              </label>
              <input
                type="date"
                value={activeCase.pleadings.verificationAffidavit.signedDate || activeCase.createdAt || ''}
                onChange={e => {
                  const val = e.target.value;
                  updateActiveCase(prev => ({
                    ...prev,
                    pleadings: {
                      ...prev.pleadings,
                      verificationAffidavit: {
                        ...prev.pleadings.verificationAffidavit,
                        signedDate: val
                      }
                    }
                  }));
                }}
                className="input-geom w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-xs"
              />
            </div>
          </div>

          <div className="pleading-paper-container p-8 md:p-12 text-slate-900 border border-slate-300 rounded-sm shadow-2xl space-y-6 text-xs leading-relaxed font-pleading">
            <div className="text-center font-bold text-base uppercase border-b-2 border-slate-900 pb-3">
              VERIFICATION UNDER PENALTY OF PERJURY
            </div>

            <div className="space-y-1 text-xs">
              <div>STATE OF {jurisdiction.stateName.toUpperCase()}</div>
              <div>COURT OF JURISDICTION: {jurisdiction.courtName.toUpperCase()}</div>
            </div>

            <p className="indent-6">
              I, <strong>{activeCase.pleadings.verificationAffidavit.declarantName || plaintiff?.name}</strong>, declare as follows:
            </p>

            <p className="indent-6">
              I am the Plaintiff in the above-entitled civil action. I have read the foregoing <strong>COMPLAINT FOR DAMAGES AND STATUTORY PENALTIES</strong> and know the contents thereof. The facts stated in the complaint are true of my own knowledge, except as to those matters which are therein stated upon information and belief, and as to those matters I believe them to be true.
            </p>

            <p className="indent-6 font-bold">
              I declare under penalty of perjury under the laws of the State of {jurisdiction.stateName} that the foregoing is true and correct.
            </p>

            <div className="pt-10 flex justify-between items-end border-t border-slate-300">
              <div>
                <div>Executed on: {activeCase.pleadings.verificationAffidavit.signedDate || activeCase.createdAt}</div>
                <div>Jurisdiction: {jurisdiction.stateName}</div>
              </div>
              <div className="text-right space-y-2">
                <div className="font-serif italic text-base text-blue-950 border-b border-slate-400 pb-1 w-48">
                  {activeCase.pleadings.verificationAffidavit.declarantName || plaintiff?.name}
                </div>
                <div className="font-bold">{activeCase.pleadings.verificationAffidavit.declarantName || plaintiff?.name}</div>
                <div className="text-slate-600 italic">Declarant / Plaintiff in Pro Per</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Pleading Paragraph Modal */}
      {showAddParaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--accent-gold)]" />
                <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">Add Pleading Paragraph</h3>
              </div>
              <button
                onClick={() => setShowAddParaModal(false)}
                className="text-[var(--text-muted)] hover:text-white text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddParagraph} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                    Section Type
                  </label>
                  <select
                    value={newParaSection}
                    onChange={e => setNewParaSection(e.target.value as PleadingParagraph['section'])}
                    className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                  >
                    <option value="parties">Parties &amp; Capacity</option>
                    <option value="jurisdiction_venue">Jurisdiction &amp; Venue</option>
                    <option value="facts">Factual Allegations</option>
                    <option value="causes_of_action">Causes of Action</option>
                    <option value="prayer">Prayer for Relief</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                    Section Heading (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FACTUAL ALLEGATIONS"
                    value={newParaHeading}
                    onChange={e => setNewParaHeading(e.target.value)}
                    className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                  Paragraph Legal Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="State the factual allegation or claim element clearly..."
                  value={newParaContent}
                  onChange={e => setNewParaContent(e.target.value)}
                  className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddParaModal(false)}
                  className="btn-geom px-4 py-2 text-xs text-[var(--text-muted)] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-geom px-5 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Paragraph</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

