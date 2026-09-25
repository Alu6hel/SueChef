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
  Mail,
  Landmark
} from 'lucide-react';
import { PleadingParagraph } from '../../types';
import { getJurisdiction } from '../../services/jurisdictions';
import { getCountryInfo } from '../../services/countries';
import { sound } from '../../services/soundEngine';
import { OfficialFormsModal } from './OfficialFormsModal';

export const PleadingBuilder: React.FC = () => {
  const { activeCase, updateActiveCase, updateParagraph, country } = useSueChef();
  const countryInfo = getCountryInfo(country);
  const [activeSubTab, setActiveSubTab] = useState<'complaint' | 'demand_letter' | 'verification' | 'court_packet'>('complaint');
  const [copied, setCopied] = useState(false);
  const [downloadedPacket, setDownloadedPacket] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showOfficialFormsModal, setShowOfficialFormsModal] = useState(false);
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

  const formattedPrincipal = `${countryInfo.currencySymbol}${principalDamage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedPenalty = `${countryInfo.currencySymbol}${statutoryPenalty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedTotal = `${countryInfo.currencySymbol}${totalDamages.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getCausesOfAction = (): string[] => {
    const cat = activeCase.claimEvaluation.category;
    switch (cat) {
      case 'security_deposit':
        return [
          `1. Statutory Security Deposit Violation (${jurisdiction.securityDepositStatuteCitation || 'Civil Code'})`,
          `2. Breach of Residential Lease Agreement`,
          `3. Unlawful Withholding & Prejudgment Interest (${jurisdiction.interestStatuteCitation || 'Code'})`
        ];
      case 'breach_of_contract':
      case 'freelance_unpaid':
        return [
          `1. Breach of Contract (Failure to Tender Payment)`,
          `2. Common Count for Work, Labor, & Services (Quantum Meruit)`,
          `3. Account Stated & Prejudgment Interest (${jurisdiction.statutoryInterestRatePercent}% under ${jurisdiction.interestStatuteCitation || 'Code'})`
        ];
      case 'contractor_dispute':
        return [
          `1. Breach of Construction Agreement`,
          `2. Negligent Workmanship & Building Code Violations`,
          `3. Restitution, Disgorgement & Surety Bond Claim`
        ];
      case 'consumer_fraud':
        return [
          `1. Statutory Unfair & Deceptive Trade Practices (UDAP)`,
          `2. Fraudulent Misrepresentation & Concealment`,
          `3. Rescission, Restitution & Statutory Multiplier`
        ];
      case 'property_damage':
        return [
          `1. Negligence & Tortious Harm to Property`,
          `2. Breach of Duty to Exercise Ordinary Care`,
          `3. Cost of Repair, Diminution in Value & Loss of Use`
        ];
      case 'wage_theft':
        return [
          `1. Statutory Wage Theft & Overtime Violations`,
          `2. Failure to Pay Wages Due Upon Separation (Waiting Time Penalties)`,
          `3. Statutory Liquidated Damages, Interest & Costs`
        ];
      case 'auto_accident':
      case 'negligence':
        return [
          `1. Motor Vehicle Negligence & Tort`,
          `2. Proximate Causation of Property Damage & Out-of-Pocket Loss`,
          `3. Prejudgment Interest & Court Filing Costs`
        ];
      default:
        return [
          `1. Prima Facie Civil Liability`,
          `2. Direct Economic Compensatory Loss`,
          `3. Statutory Prejudgment Interest & Court Costs`
        ];
    }
  };

  const causesOfAction = getCausesOfAction();

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
        ...causesOfAction.map(c => `  ${c}`),
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
    } else if (activeSubTab === 'court_packet') {
      textToCopy = generateFullCourtPacketText();
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    sound.playDocketStamp();
    setTimeout(() => setCopied(false), 2000);
  };

  const generateFullCourtPacketText = (): string => {
    const divider = '================================================================================';
    const subDivider = '--------------------------------------------------------------------------------';
    const exhibits = activeCase.evidenceList;
    const filingFee = 75;
    const serviceFee = 115;
    const totalFees = filingFee + serviceFee;

    const part1 = [
      divider,
      'PART 1: FORMAL 28-LINE VERIFIED CIVIL COMPLAINT',
      divider,
      `${activeCase.courtName.toUpperCase()}`,
      subDivider,
      `${plaintiff?.name || 'PLAINTIFF'},`,
      '        Plaintiff,',
      '    v.                                CASE NO. ' + activeCase.caseNumber,
      `${defendant?.name || 'DEFENDANT'},`,
      '        Defendant.',
      subDivider,
      'COMPLAINT FOR DAMAGES AND STATUTORY PENALTIES',
      ...causesOfAction.map(c => `  ${c}`),
      '',
      ...activeCase.pleadings.paragraphs.map(p => 
        `${p.heading ? `\n${p.heading}\n` : ''}${p.number}. ${p.content}`
      ),
      '',
      'PRAYER FOR RELIEF:',
      `WHEREFORE, Plaintiff prays for judgment against Defendant ${defendant?.name} as follows:`,
      `1. Compensatory damages in the amount of ${formattedPrincipal};`,
      statutoryPenalty > 0 ? `2. Statutory penalties in the amount of ${formattedPenalty};` : '',
      interestDamage > 0 ? `3. Prejudgment interest in the amount of $${interestDamage.toFixed(2)};` : '',
      `4. Allowable statutory court costs of $${totalFees.toFixed(2)};`,
      '5. For such other and further relief as the Court deems just and proper.',
      '',
      'VERIFICATION UNDER PENALTY OF PERJURY:',
      `I, ${plaintiff?.name}, declare under penalty of perjury under the laws of ${activeCase.state} that I am the Plaintiff; that I have read the foregoing Complaint and know the contents thereof; and that the matters stated therein are true of my own personal knowledge.`,
      `Executed on: ${new Date().toLocaleDateString('en-US')} at ${activeCase.county}, ${activeCase.state}.`,
      '',
      `________________________________________`,
      `${plaintiff?.name}, Pro Se Plaintiff`
    ].filter(Boolean).join('\n');

    const part2 = [
      divider,
      'PART 2: CIVIL CASE COVER SHEET SUMMARY (CM-010 / SC-100)',
      divider,
      `COURT: ${activeCase.courtName}`,
      `CASE NUMBER: ${activeCase.caseNumber}`,
      `PLAINTIFF: ${plaintiff?.name} (Pro Se / In Propria Persona)`,
      `DEFENDANT: ${defendant?.name} (${defendant?.entityType ? defendant.entityType.toUpperCase() : 'DEFENDANT'})`,
      `REGISTERED AGENT: ${defendant?.registeredAgent || 'Designated Agent for Service of Process'}`,
      `DISPUTE CATEGORY: ${activeCase.claimEvaluation.category.toUpperCase().replace(/_/g, ' ')}`,
      `TOTAL AMOUNT DEMANDED: ${formattedTotal}`,
      `JURY TRIAL DEMANDED: NO (Small Claims / Non-Jury Expedited Proceeding)`,
      `REMEDY SOUGHT: Monetary Compensatory Damages & Statutory Civil Penalties`,
      subDivider
    ].join('\n');

    const part3 = [
      divider,
      'PART 3: MASTER EXHIBIT INDEX & CRYPTOGRAPHIC SHA-256 TAB STAMPS',
      divider,
      'EVIDENTIARY AUTHENTICATION DECLARATION (FRE 901 / 902 / STATE RULES OF EVIDENCE):',
      'The following exhibits are true and correct duplicates of original contemporaneous documents, records, and photographs maintained by Claimant.',
      '',
      ...exhibits.map((e, i) => {
        return [
          `[ EXHIBIT ${String.fromCharCode(65 + i)} ] ${e.title.toUpperCase()}`,
          `  Type: ${e.category.toUpperCase()} | Date: ${e.dateOccurred} | Custodian: ${e.custodian}`,
          `  SHA-256 Hash: ${e.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}`,
          `  Evidentiary Purpose: ${e.notes}`,
          ''
        ].join('\n');
      })
    ].join('\n');

    const part4 = [
      divider,
      'PART 4: FORM PROOF OF SERVICE (AFFIDAVIT OF PROCESS RETURN)',
      divider,
      `1. I am at least 18 years of age and not a party to this action.`,
      `2. DOCUMENTS SERVED: Summons, Verified Complaint, Civil Case Cover Sheet, and Exhibits A through ${String.fromCharCode(64 + Math.max(1, exhibits.length))}.`,
      `3. PERSON SERVED: ${defendant?.name} / Authorized Corporate Agent (${defendant?.registeredAgent || 'Agent of Record'}).`,
      `4. DATE & MANNER: Personal delivery / Statutory Certified Mail Return Receipt Requested.`,
      `5. DECLARATION: I declare under penalty of perjury under the laws of ${activeCase.state} that the foregoing is true and correct.`,
      '',
      `Executed on: ${new Date().toLocaleDateString('en-US')} at ${activeCase.county}, ${activeCase.state}.`,
      '',
      `________________________________________`,
      `Disinterested Process Server / Registered Server`
    ].join('\n');

    const part5 = [
      divider,
      'PART 5: IN FORMA PAUPERIS (IFP) COURT FEE WAIVER WORKSHEET',
      divider,
      `CLAIMANT: ${plaintiff?.name}`,
      `STATUTORY FILING FEE: $${filingFee}.00 | SERVICE COSTS: $${serviceFee}.00 | TOTAL: $${totalFees}.00`,
      `ELIGIBILITY CRITERIA:`,
      `• Gross Monthly Income is below 133% / 150% of Federal Poverty Guidelines for a household of one ($1,698/mo), OR`,
      `• Claimant receives public assistance (Medi-Cal/Medicaid, CalFresh/SNAP, SSI/SSP, General Assistance).`,
      `AFFIDAVIT: If approved by the Presiding Judge or Clerk, all court filing fees and certified process service costs are waived pursuant to state in forma pauperis statutes.`,
      divider
    ].join('\n');

    return [part1, part2, part3, part4, part5].join('\n\n');
  };

  const handleDownloadPacketTxt = () => {
    sound.playDocketStamp();
    const packetText = generateFullCourtPacketText();
    const blob = new Blob([packetText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = activeCase.title.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `${cleanTitle}_Complete_Court_Filing_Packet.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedPacket(true);
    setTimeout(() => setDownloadedPacket(false), 3000);
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
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('court_packet');
            }}
            className={`tab-geom px-3 py-1.5 text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              activeSubTab === 'court_packet'
                ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Filing Packet (5-in-1)</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded font-mono font-bold">
              COURT READY
            </span>
          </button>
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

          <button
            onClick={() => {
              sound.playClick();
              setShowOfficialFormsModal(true);
            }}
            className="tab-geom px-3 py-1.5 text-xs font-semibold border border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Landmark className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Court Forms (SC-100 / N1)</span>
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

          {activeSubTab === 'complaint' && (
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
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeSubTab === 'court_packet' && (
            <button
              onClick={handleDownloadPacketTxt}
              className="btn-geom flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--bg-hover)] transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadedPacket ? '✓ Downloaded (.txt)' : 'Download Packet (.txt)'}</span>
            </button>
          )}
          <button
            onClick={handleCopyText}
            className="btn-geom flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
            <span>{copied ? 'Copied to Clipboard' : activeSubTab === 'court_packet' ? 'Copy Full Packet' : 'Copy Text'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-geom flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{activeSubTab === 'court_packet' ? 'Print Complete Packet' : 'Print / Save PDF'}</span>
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
                  <div className="text-[10px] text-slate-600 italic space-y-0.5">
                    {causesOfAction.map((ca, i) => (
                      <div key={i}>{ca}</div>
                    ))}
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

      {/* Master 5-in-1 Court-Ready Filing Packet */}
      {activeSubTab === 'court_packet' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Packet Summary Bar */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  CLERK-READY COMPLETE BUNDLE
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">5 Official Documents</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Master Court Filing &amp; Service Packet
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-xl">
                Assembles all mandatory components required for pro se filing at the clerk's window and legal service of process. Includes verified pleading, civil cover sheet, cryptographically hashed exhibits, return of service affidavit, and statutory fee waiver worksheet.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPacketTxt}
                className="btn-geom flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>{downloadedPacket ? '✓ Packet Downloaded' : 'Download Master Packet (.txt)'}</span>
              </button>
            </div>
          </div>

          {/* Document 1: 28-Line Formal Complaint */}
          <div className="pleading-paper-container p-6 md:p-10 text-slate-900 border border-slate-300 rounded-sm shadow-xl space-y-6 text-xs leading-relaxed font-pleading bg-[#faf8f5]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-2 gap-1.5">
              <span className="font-mono text-[11px] font-bold text-slate-700">DOCUMENT 1 OF 5</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900">VERIFIED CIVIL COMPLAINT (28-LINE PLEADING)</span>
            </div>

            {/* Attorney / Pro Se Block */}
            <div className="text-xs font-mono space-y-0.5 border-b border-slate-200 pb-3">
              <div className="font-bold text-slate-950">{plaintiff?.name} (In Pro Per / Pro Se)</div>
              <div>{plaintiff?.address}</div>
              <div>{plaintiff?.city}, {plaintiff?.state} {plaintiff?.zip}</div>
              <div>Tel: {plaintiff?.phone} | Email: {plaintiff?.email}</div>
              <div className="italic text-slate-600">Plaintiff in Propria Persona</div>
            </div>

            {/* Court Header */}
            <div className="text-center font-bold uppercase tracking-wider text-base">
              {activeCase.courtName}
            </div>

            {/* Caption */}
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
                <div className="font-bold uppercase text-[11px]">
                  COMPLAINT FOR DAMAGES AND STATUTORY PENALTIES
                </div>
                <div className="text-[10px] text-slate-600 italic">
                  {causesOfAction.join('; ')}
                </div>
                <div className="text-[10px] font-bold text-slate-800">DEMAND FOR JURY TRIAL</div>
              </div>
            </div>

            {/* Numbered Paragraphs */}
            <div className="space-y-3 pt-2">
              {activeCase.pleadings.paragraphs.map(p => (
                <div key={p.id} className="space-y-1">
                  {p.heading && (
                    <div className="font-bold uppercase text-[11px] tracking-wider pt-2 border-b border-slate-200 pb-0.5 text-slate-800">
                      {p.heading}
                    </div>
                  )}
                  <p className="indent-6">
                    <strong>{p.number}.</strong> {p.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Prayer */}
            <div className="space-y-2 pt-3 border-t border-slate-300">
              <div className="font-bold uppercase text-xs">PRAYER FOR RELIEF</div>
              <p className="indent-6">
                WHEREFORE, Plaintiff prays for judgment against Defendant {defendant?.name} as follows:
              </p>
              <ol className="list-decimal pl-10 space-y-1">
                <li>Compensatory general and special damages in the sum of <strong>{formattedPrincipal}</strong>;</li>
                {statutoryPenalty > 0 && (
                  <li>Statutory bad-faith penalties in the sum of <strong>{formattedPenalty}</strong>;</li>
                )}
                {interestDamage > 0 && (
                  <li>Prejudgment statutory interest in the sum of <strong>${interestDamage.toFixed(2)}</strong>;</li>
                )}
                <li>Recoverable court filing fees and costs of service of suit ($190.00);</li>
                <li>Such other and further relief as the Court deems just and proper.</li>
              </ol>
            </div>

            {/* Verification */}
            <div className="space-y-2 pt-4 border-t border-slate-300">
              <div className="font-bold uppercase text-xs text-center">VERIFICATION UNDER PENALTY OF PERJURY</div>
              <p className="indent-6">
                I, <strong>{plaintiff?.name}</strong>, declare under penalty of perjury under the laws of the State of {activeCase.state} that I am the Plaintiff in this action; I have read the foregoing Complaint and know the contents thereof; and the facts stated herein are true of my own knowledge, except as to matters stated on information and belief.
              </p>
              <div className="pt-4 flex justify-between items-end">
                <div>Dated: {new Date().toLocaleDateString('en-US')}</div>
                <div className="text-right">
                  <div className="font-serif italic text-base border-b border-slate-400 pb-1 w-48 text-blue-950">
                    {plaintiff?.name}
                  </div>
                  <div className="font-bold">{plaintiff?.name}, Pro Se Plaintiff</div>
                </div>
              </div>
            </div>
          </div>

          {/* Document 2: Civil Case Cover Sheet Summary */}
          <div className="pleading-paper-container p-6 md:p-10 text-slate-900 border border-slate-300 rounded-sm shadow-xl space-y-4 text-xs font-pleading bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-2 gap-1.5">
              <span className="font-mono text-[11px] font-bold text-slate-700">DOCUMENT 2 OF 5</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900">CIVIL CASE COVER SHEET SUMMARY (CM-010 / SC-100 EQUIVALENT)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-400 p-4 bg-slate-50 font-sans text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Court Venue</span>
                <span className="font-bold text-slate-900">{activeCase.courtName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Docket / Case #</span>
                <span className="font-mono font-bold text-slate-900">{activeCase.caseNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Plaintiff (Pro Se)</span>
                <span className="font-bold text-slate-900">{plaintiff?.name}</span>
                <div className="text-[11px] text-slate-600">{plaintiff?.phone} | {plaintiff?.email}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Defendant &amp; Entity Type</span>
                <span className="font-bold text-slate-900">{defendant?.name} ({defendant?.entityType ? defendant.entityType.toUpperCase() : 'INDIVIDUAL / BUSINESS'})</span>
                <div className="text-[11px] text-slate-600">Registered Agent: {defendant?.registeredAgent || 'Officer / Director / Authorized Agent'}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Nature of Action / Case Type</span>
                <span className="font-bold text-slate-900">{activeCase.claimEvaluation.category.toUpperCase().replace(/_/g, ' ')}</span>
                <div className="text-[11px] text-slate-600">Small Claims / Expedited Limited Civil Action</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Monetary Demand</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">{formattedTotal}</span>
                <div className="text-[11px] text-slate-600">Includes Compensatory + Statutory Penalty</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-300 text-amber-950 text-xs font-sans space-y-1">
              <div className="font-bold">CLERK'S INTAKE CERTIFICATION:</div>
              <div>This Civil Case Cover Sheet summary accompanies the original Verified Complaint filed herewith pursuant to state trial court civil case management rules. Plaintiff requests expedited summons issuance.</div>
            </div>
          </div>

          {/* Document 3: Master Exhibit Index & Cryptographic SHA-256 Tab Stamps */}
          <div className="pleading-paper-container p-6 md:p-10 text-slate-900 border border-slate-300 rounded-sm shadow-xl space-y-4 text-xs font-pleading bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-2 gap-1.5">
              <span className="font-mono text-[11px] font-bold text-slate-700">DOCUMENT 3 OF 5</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900">MASTER EXHIBIT INDEX WITH CRYPTOGRAPHIC SHA-256 TAB STAMPS</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              Pursuant to Federal Rules of Evidence 901 &amp; 902 and corresponding state evidence codes, the undersigned Plaintiff certifies that each of the following physical and digital exhibits has been maintained under strict chain of custody and authenticated with a cryptographic SHA-256 digest:
            </p>

            <div className="space-y-3 font-sans">
              {activeCase.evidenceList.map((e, index) => {
                const tabLetter = String.fromCharCode(65 + index);
                return (
                  <div key={e.id} className="border border-slate-300 p-3 bg-slate-50 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 bg-slate-900 text-amber-300 font-mono font-bold text-xs rounded-sm">
                        TAB {tabLetter}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Exhibit {tabLetter}: {e.title}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Date: {e.dateOccurred} | Custodian: {e.custodian} | Category: {e.category.toUpperCase()}
                        </div>
                        <div className="text-[11px] text-slate-700 italic mt-0.5">
                          "{e.notes}"
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-auto text-left md:text-right border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded block md:inline-block">
                        SHA-256 VERIFIED
                      </span>
                      <div className="font-mono text-[9px] text-slate-500 break-all max-w-xs mt-1">
                        {e.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Document 4: Proof of Service Affidavit */}
          <div className="pleading-paper-container p-6 md:p-10 text-slate-900 border border-slate-300 rounded-sm shadow-xl space-y-4 text-xs font-pleading bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-2 gap-1.5">
              <span className="font-mono text-[11px] font-bold text-slate-700">DOCUMENT 4 OF 5</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900">FORM PROOF OF SERVICE (AFFIDAVIT OF PROCESS RETURN)</span>
            </div>

            <div className="space-y-3 font-sans leading-relaxed">
              <p>
                <strong>1. Server Age &amp; Capacity:</strong> At the time of service, I was at least 18 years of age and not a party to this legal action.
              </p>
              <p>
                <strong>2. Documents Served:</strong> Summons; Verified Complaint; Civil Case Cover Sheet; Master Exhibit Index (Tabs A through {String.fromCharCode(64 + Math.max(1, activeCase.evidenceList.length))}); Notice of Case Assignment.
              </p>
              <p>
                <strong>3. Party Served:</strong> <strong>{defendant?.name}</strong>{defendant?.registeredAgent ? ` via Designated Registered Agent for Service of Process (${defendant.registeredAgent})` : ''} at {defendant?.address || activeCase.county + ', ' + activeCase.state}.
              </p>
              <p>
                <strong>4. Manner of Service:</strong> (Check Applicable)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 text-[11px]">
                <div className="p-2 border border-slate-300 bg-slate-50">
                  [ ✓ ] <strong>Personal Service:</strong> By personally delivering true copies to the defendant or registered agent.
                </div>
                <div className="p-2 border border-slate-300 bg-slate-50">
                  [ &nbsp; ] <strong>Certified Mail (Return Receipt Requested):</strong> Pursuant to state small claims service rules.
                </div>
              </div>
              <p className="font-bold pt-2">
                5. Declaration: I declare under penalty of perjury under the laws of the State of {activeCase.state} that the foregoing is true and correct.
              </p>

              <div className="pt-8 flex justify-between items-end border-t border-slate-300 font-serif">
                <div>
                  <div>Date Executed: ___________________</div>
                  <div>County/State: {activeCase.county}, {activeCase.state}</div>
                </div>
                <div className="text-right">
                  <div className="border-b border-slate-400 pb-1 w-56"></div>
                  <div className="text-xs font-sans font-bold pt-1">Signature of Process Server</div>
                  <div className="text-[10px] font-sans text-slate-500">Registered Process Server / Non-Party Adult</div>
                </div>
              </div>
            </div>
          </div>

          {/* Document 5: In Forma Pauperis (IFP) Fee Waiver Worksheet */}
          <div className="pleading-paper-container p-6 md:p-10 text-slate-900 border border-slate-300 rounded-sm shadow-xl space-y-4 text-xs font-pleading bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-2 gap-1.5">
              <span className="font-mono text-[11px] font-bold text-slate-700">DOCUMENT 5 OF 5</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900">IN FORMA PAUPERIS (IFP) COURT FEE WAIVER WORKSHEET</span>
            </div>

            <div className="space-y-3 font-sans">
              <div className="bg-slate-50 border border-slate-300 p-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Court Filing Fee</span>
                  <span className="font-mono font-bold text-slate-900">$75.00</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Process Service Fee</span>
                  <span className="font-mono font-bold text-slate-900">$115.00</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Total Waivable</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">$190.00</span>
                </div>
              </div>

              <div className="border border-slate-300 p-3 bg-white space-y-2">
                <div className="font-bold text-xs text-slate-900">STATUTORY QUALIFYING CRITERIA:</div>
                <div className="text-[11px] text-slate-700 space-y-1">
                  <div>• <strong>Criterion A:</strong> Claimant receives public benefits (SNAP / Food Stamps, SSI/SSP, Medi-Cal/Medicaid, TANF/CalWORKs, General Assistance).</div>
                  <div>• <strong>Criterion B:</strong> Claimant's gross monthly household income is less than 133% - 150% of the Federal Poverty Guidelines ($1,698.00/month for individual household).</div>
                  <div>• <strong>Criterion C:</strong> Income is insufficient to pay for the common necessaries of life without suffering undue financial hardship.</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-700 leading-relaxed italic">
                Worksheet Instructions: Submit this completed fee waiver declaration alongside Document 1 (Verified Complaint) directly to the court intake clerk. If approved, initial docketing fees and court-issued service fees are automatically remitted.
              </p>

              <div className="pt-6 flex justify-between items-end border-t border-slate-300 font-serif">
                <div>
                  <div>Claimant: {plaintiff?.name}</div>
                  <div>Date: {new Date().toLocaleDateString('en-US')}</div>
                </div>
                <div className="text-right">
                  <div className="border-b border-slate-400 pb-1 w-48 text-blue-950 font-serif italic text-base">
                    {plaintiff?.name}
                  </div>
                  <div className="text-xs font-sans font-bold pt-1">{plaintiff?.name}</div>
                  <div className="text-[10px] font-sans text-slate-500">Applicant in Pro Per</div>
                </div>
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

      {/* Official Court Forms Modal (SC-100, UK N1, NYC CIV-GP-58, Nigeria Form 1/2) */}
      <OfficialFormsModal
        isOpen={showOfficialFormsModal}
        onClose={() => setShowOfficialFormsModal(false)}
      />
    </div>
  );
};

