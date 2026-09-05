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
  Scale
} from 'lucide-react';
import { PleadingParagraph } from '../../types';
import { sound } from '../../services/soundEngine';

export const PleadingBuilder: React.FC = () => {
  const { activeCase, updateActiveCase, updateParagraph } = useSueChef();
  const [activeSubTab, setActiveSubTab] = useState<'complaint' | 'demand_letter' | 'verification'>('complaint');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFont, setSelectedFont] = useState<'Century Schoolbook' | 'Times New Roman' | 'Courier New' | 'Georgia'>(
    activeCase.pleadings.fontFamily || 'Century Schoolbook'
  );

  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff') || activeCase.parties[0];
  const defendant = activeCase.parties.find(p => p.role === 'defendant') || activeCase.parties[1];

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
        'FORMAL NOTICE & DEMAND FOR SETTLEMENT PRIOR TO LITIGATION',
        `Date: ${activeCase.pleadings.demandLetter.demandDate}`,
        `Certified Mail No: ${activeCase.pleadings.demandLetter.certifiedMailNumber || 'USPS CERTIFIED'}`,
        '',
        `TO: ${defendant?.name}`,
        `    ${defendant?.address}, ${defendant?.city}, ${defendant?.state} ${defendant?.zip}`,
        '',
        `FROM: ${plaintiff?.name}`,
        `      ${plaintiff?.address}, ${plaintiff?.city}, ${plaintiff?.state} ${plaintiff?.zip}`,
        '',
        'RE: FINAL DEMAND FOR PAYMENT — RETURN OF SECURITY DEPOSIT',
        '',
        `Dear ${defendant?.name}:`,
        activeCase.pleadings.demandLetter.settlementOfferText,
        '',
        'Failure to remit the full demanded sum within the statutory window will result in the immediate filing of a civil lawsuit seeking statutory bad-faith penalties up to twice the principal deposit under California Civil Code § 1950.5(l) plus all court and service costs.',
        '',
        `Respectfully submitted,`,
        `${plaintiff?.name}`
      ].join('\n');
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
              Pleading & Document Builder
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              28-Line California/Federal Pleading Paper, Formal Demand Letters & Sworn Affidavits
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
            14-Day Demand Letter
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
                    1. Violation of Cal. Civ. Code § 1950.5<br />
                    2. Breach of Written Contract<br />
                    3. Unjust Enrichment
                  </div>
                  <div className="text-[10px] font-bold text-slate-800">DEMAND FOR JURY TRIAL</div>
                </div>
              </div>

              {/* Numbered Legal Paragraphs */}
              <div className="space-y-4 pt-2">
                {activeCase.pleadings.paragraphs.map(p => (
                  <div key={p.id} className="space-y-1">
                    {p.heading && (
                      <div className="font-bold uppercase tracking-wider text-xs pt-3 text-slate-950 border-b border-slate-200 pb-1">
                        {p.heading}
                      </div>
                    )}
                    {isEditing ? (
                      <textarea
                        value={p.content}
                        onChange={e => updateParagraph(p.id, e.target.value)}
                        className="w-full bg-amber-50/50 border border-amber-300 p-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        rows={3}
                      />
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
        <div className="max-w-4xl mx-auto pleading-paper-container p-8 md:p-12 text-slate-900 border border-slate-300 rounded-sm shadow-2xl space-y-6 text-xs leading-relaxed font-pleading">
          
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <h2 className="font-bold text-base uppercase tracking-wider text-slate-950">
              FORMAL LEGAL NOTICE & SETTLEMENT DEMAND
            </h2>
            <p className="text-[11px] font-mono text-slate-600">
              SENT VIA USPS CERTIFIED MAIL WITH RETURN RECEIPT REQUESTED
            </p>
            <div className="font-mono text-xs font-bold text-slate-800">
              TRACKING NO: {activeCase.pleadings.demandLetter.certifiedMailNumber}
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
              <div className="text-slate-600 italic">Attn: Managing Agent / Legal Dept</div>
            </div>
          </div>

          <div className="pt-3 font-bold border-t border-slate-200">
            RE: FINAL DEMAND FOR IMMEDIATE RETURN OF WITHHELD SECURITY DEPOSIT ($3,200.00)
          </div>

          <p className="indent-6">
            Dear {defendant?.name}:
          </p>

          <p className="indent-6">
            This letter serves as formal written demand for the immediate return of Plaintiff’s full refundable security deposit in the amount of <strong>$3,200.00</strong>, paid pursuant to the residential lease agreement for the premises located at 450 University Avenue, Apt 3B, Palo Alto, CA 94301.
          </p>

          <p className="indent-6">
            Under California Civil Code § 1950.5(g)(1), a landlord has a mandatory legal obligation to return the deposit and deliver an itemized list of lawful deductions within <strong>21 calendar days</strong> of the tenant surrendering possession. Plaintiff fully vacated and surrendered keys on July 31, 2025. More than 35 days have elapsed, and Defendant has failed to provide either an itemized deduction statement or the funds.
          </p>

          <div className="p-4 bg-slate-100 border-l-4 border-slate-800 text-xs font-mono space-y-1">
            <div className="font-bold">DEMANDED SETTLEMENT TERMS:</div>
            <div>• Principal Deposit Due: $3,200.00</div>
            <div>• Response Deadline: Within {activeCase.pleadings.demandLetter.responseDeadlineDays} calendar days of receipt of this notice.</div>
          </div>

          <p className="indent-6">
            If payment is not received in full by <strong>September 15, 2025</strong>, Plaintiff will immediately initiate formal civil proceedings in the Superior Court of California, County of Santa Clara. In addition to the principal deposit of $3,200.00, Plaintiff will seek statutory bad-faith damages of up to <strong>$6,400.00 (two times the deposit)</strong> pursuant to California Civil Code § 1950.5(l), plus prejudgment interest and mandatory court filing costs.
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
      )}

      {/* Verification Affidavit View */}
      {activeSubTab === 'verification' && (
        <div className="max-w-4xl mx-auto pleading-paper-container p-8 md:p-12 text-slate-900 border border-slate-300 rounded-sm shadow-2xl space-y-6 text-xs leading-relaxed font-pleading">
          <div className="text-center font-bold text-base uppercase border-b-2 border-slate-900 pb-3">
            VERIFICATION UNDER PENALTY OF PERJURY
          </div>

          <div className="space-y-1 text-xs">
            <div>STATE OF CALIFORNIA</div>
            <div>COUNTY OF {activeCase.county.toUpperCase()}</div>
          </div>

          <p className="indent-6">
            I, <strong>{activeCase.pleadings.verificationAffidavit.declarantName}</strong>, declare as follows:
          </p>

          <p className="indent-6">
            I am the Plaintiff in the above-entitled civil action. I have read the foregoing <strong>COMPLAINT FOR DAMAGES AND STATUTORY PENALTIES</strong> and know the contents thereof. The facts stated in the complaint are true of my own knowledge, except as to those matters which are therein stated upon information and belief, and as to those matters I believe them to be true.
          </p>

          <p className="indent-6 font-bold">
            I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.
          </p>

          <div className="pt-10 flex justify-between items-end border-t border-slate-300">
            <div>
              <div>Executed on: {activeCase.createdAt}</div>
              <div>At: {activeCase.county} County, California</div>
            </div>
            <div className="text-right space-y-2">
              <div className="font-serif italic text-base text-blue-950 border-b border-slate-400 pb-1 w-48">
                {activeCase.pleadings.verificationAffidavit.declarantName}
              </div>
              <div className="font-bold">{activeCase.pleadings.verificationAffidavit.declarantName}</div>
              <div className="text-slate-600 italic">Declarant</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
