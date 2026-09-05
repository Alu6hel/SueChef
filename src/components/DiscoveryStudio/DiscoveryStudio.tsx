import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { DiscoveryItem, SubpoenaRequest } from '../../types';
import { sound } from '../../services/soundEngine';
import { 
  FolderSearch, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Send, 
  Building, 
  HelpCircle,
  ShieldCheck,
  Download
} from 'lucide-react';

export const DiscoveryStudio: React.FC = () => {
  const { activeCase, updateActiveCase } = useSueChef();
  const [activeTab, setActiveTab] = useState<'rog' | 'rfp' | 'rfa' | 'subpoena'>('rog');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // New item states
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newObjectionRisk, setNewObjectionRisk] = useState('');

  // Subpoena form
  const [subThirdParty, setSubThirdParty] = useState('');
  const [subAddress, setSubAddress] = useState('');
  const [subDocs, setSubDocs] = useState('');
  const [subRelevance, setSubRelevance] = useState('');
  const [subDays, setSubDays] = useState(20);

  const discovery = activeCase.discovery || {
    interrogatories: [],
    rfps: [],
    rfas: [],
    subpoenas: []
  };

  const handleCopyFormattedPleading = (type: 'rog' | 'rfp' | 'rfa' | 'subpoena') => {
    sound.playDocketStamp();
    let text = `ATTORNEY OR PARTY WITHOUT ATTORNEY (Name & Address):\n`;
    const pl = activeCase.parties.find(p => p.role === 'plaintiff');
    const df = activeCase.parties.find(p => p.role === 'defendant');
    text += `${pl?.name || 'PLAINTIFF'}\n${pl?.address || ''}\n${pl?.city || ''}, ${pl?.state || ''} ${pl?.zip || ''}\n`;
    text += `PRO SE / IN PROPRIA PERSONA\n\n`;
    text += `${activeCase.courtName.toUpperCase()}\n\n`;
    text += `${pl?.name || 'PLAINTIFF'}, Plaintiff,\nv.\n${df?.name || 'DEFENDANT'}, Defendant.\n\n`;
    text += `Case No.: ${activeCase.caseNumber}\n\n`;

    if (type === 'rog') {
      text += `PLAINTIFF'S FIRST SET OF WRITTEN INTERROGATORIES TO DEFENDANT\n`;
      text += `PROPOUNDING PARTY: Plaintiff ${pl?.name}\nRESPONDING PARTY: Defendant ${df?.name}\nSET NUMBER: ONE (1)\n\n`;
      text += `INSTRUCTIONS: Pursuant to applicable rules of civil procedure, responding party is required to answer separately and fully in writing under oath within 30 days of service.\n\n`;
      discovery.interrogatories.forEach(item => {
        text += `INTERROGATORY NO. ${item.number}:\n${item.questionText}\n\n`;
      });
    } else if (type === 'rfp') {
      text += `PLAINTIFF'S FIRST SET OF REQUESTS FOR PRODUCTION OF DOCUMENTS\n`;
      text += `PROPOUNDING PARTY: Plaintiff ${pl?.name}\nRESPONDING PARTY: Defendant ${df?.name}\n\n`;
      text += `INSTRUCTIONS: Responding party is requested to produce and permit inspection/copying of the following documents within 30 days of service.\n\n`;
      discovery.rfps.forEach(item => {
        text += `REQUEST FOR PRODUCTION NO. ${item.number}:\n${item.questionText}\n\n`;
      });
    } else if (type === 'rfa') {
      text += `PLAINTIFF'S FIRST SET OF REQUESTS FOR ADMISSION\n`;
      text += `PROPOUNDING PARTY: Plaintiff ${pl?.name}\nRESPONDING PARTY: Defendant ${df?.name}\n\n`;
      text += `WARNING: PURSUANT TO CIVIL PROCEDURE RULES, EACH MATTER REQUESTED HEREIN IS DEEMED ADMITTED UNLESS RESPONDING PARTY SERVES WRITTEN OBJECTIONS OR ANSWERS WITHIN THIRTY (30) DAYS.\n\n`;
      discovery.rfas.forEach(item => {
        text += `REQUEST FOR ADMISSION NO. ${item.number}:\n${item.questionText}\n\n`;
      });
    } else {
      text += `SUBPOENA DUCES TECUM FOR PRODUCTION OF BUSINESS RECORDS\n\n`;
      discovery.subpoenas.forEach((sub, idx) => {
        text += `SUBPOENA NO. ${idx + 1}:\nTO: ${sub.thirdPartyName}\nADDRESS: ${sub.thirdPartyAddress}\n`;
        text += `DOCUMENTS COMMANDED: ${sub.documentsRequested}\n`;
        text += `RELEVANCE DECLARATION: ${sub.relevanceDeclaration}\n`;
        text += `COMPLIANCE DEADLINE: ${sub.complianceDeadlineDays} calendar days from service.\n\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleAddItem = (category: 'rog' | 'rfp' | 'rfa') => {
    if (!newQuestionText.trim()) return;
    sound.playGavelStrike();

    const targetKey = category === 'rog' ? 'interrogatories' : category === 'rfp' ? 'rfps' : 'rfas';
    const currentList = discovery[targetKey];
    const newItem: DiscoveryItem = {
      id: `disc_${Date.now()}`,
      number: currentList.length + 1,
      questionText: newQuestionText.trim(),
      targetObjective: newObjective.trim() || 'Establish material factual basis for civil liability.',
      objectionRiskNotes: newObjectionRisk.trim() || 'Standard civil discovery scope.',
      category: category === 'rog' ? 'interrogatory' : category
    };

    updateActiveCase(prev => ({
      ...prev,
      discovery: {
        ...discovery,
        [targetKey]: [...currentList, newItem]
      }
    }));

    setNewQuestionText('');
    setNewObjective('');
    setNewObjectionRisk('');
  };

  const handleDeleteItem = (category: 'rog' | 'rfp' | 'rfa', id: string) => {
    sound.playClick();
    const targetKey = category === 'rog' ? 'interrogatories' : category === 'rfp' ? 'rfps' : 'rfas';
    const filtered = discovery[targetKey].filter(i => i.id !== id).map((item, idx) => ({
      ...item,
      number: idx + 1
    }));

    updateActiveCase(prev => ({
      ...prev,
      discovery: {
        ...discovery,
        [targetKey]: filtered
      }
    }));
  };

  const handleAddSubpoena = () => {
    if (!subThirdParty.trim() || !subDocs.trim()) return;
    sound.playGavelStrike();

    const newSub: SubpoenaRequest = {
      id: `sub_${Date.now()}`,
      thirdPartyName: subThirdParty.trim(),
      thirdPartyAddress: subAddress.trim() || 'Headquarters / Registered Agent Address',
      documentsRequested: subDocs.trim(),
      relevanceDeclaration: subRelevance.trim() || 'Directly relevant to material allegations in verified complaint.',
      complianceDeadlineDays: subDays || 20
    };

    updateActiveCase(prev => ({
      ...prev,
      discovery: {
        ...discovery,
        subpoenas: [...discovery.subpoenas, newSub]
      }
    }));

    setSubThirdParty('');
    setSubAddress('');
    setSubDocs('');
    setSubRelevance('');
    setSubDays(20);
  };

  const handleDeleteSubpoena = (id: string) => {
    sound.playClick();
    updateActiveCase(prev => ({
      ...prev,
      discovery: {
        ...discovery,
        subpoenas: discovery.subpoenas.filter(s => s.id !== id)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-card/60 border border-border/80 custom-geometry">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary custom-geometry">
            <FolderSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide font-serif">Pre-Trial Discovery & Subpoena Studio</h1>
            <p className="text-xs text-muted-foreground">
              Lock in facts under oath, uncover hidden communications, and enforce statutory 30-day admission traps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopyFormattedPleading(activeTab)}
            className="flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
          >
            {copiedSection === activeTab ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>Copy Formal Pleading ({activeTab.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/70 pb-3">
        <button
          onClick={() => { sound.playClick(); setActiveTab('rog'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'rog'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Interrogatories (ROG)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {discovery.interrogatories.length}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('rfp'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'rfp'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <FolderSearch className="w-4 h-4" />
          <span>Document Production (RFP)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {discovery.rfps.length}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('rfa'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'rfa'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-300" />
          <span>Requests for Admission (RFA)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {discovery.rfas.length}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('subpoena'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'subpoena'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Subpoenas Duces Tecum</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {discovery.subpoenas.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Interrogatories */}
      {activeTab === 'rog' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 text-xs leading-relaxed text-muted-foreground custom-geometry">
            <strong className="text-foreground">Pro Se Litigation Strategy:</strong> Interrogatories are written questions propounded under oath (FRCP Rule 33 / State analogues). Limit questions to concise, single-issue facts. Responding parties have 30 calendar days to answer under penalty of perjury.
          </div>

          <div className="space-y-3">
            {discovery.interrogatories.map((item) => (
              <div key={item.id} className="p-4 bg-card/70 border border-border custom-geometry space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-primary/15 text-primary border border-primary/30 custom-geometry">
                      ROG #{item.number}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('rog', item.id)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {item.questionText}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-primary font-semibold">Tactical Objective: </span>
                    <span className="text-muted-foreground">{item.targetObjective}</span>
                  </div>
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-amber-500 font-semibold">Objection Defense: </span>
                    <span className="text-muted-foreground">{item.objectionRiskNotes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Rog */}
          <div className="p-4 bg-card border border-dashed border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Draft Custom Interrogatory</span>
            </h3>

            <textarea
              rows={2}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g., State the full legal name, job title, and current contact address of every individual who inspected Plaintiff's unit on July 31, 2025."
              className="w-full bg-input/50 border border-border p-2.5 text-xs rounded-none focus:outline-none focus:border-primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Tactical Objective (e.g. Identify direct witness)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={newObjectionRisk}
                onChange={(e) => setNewObjectionRisk(e.target.value)}
                placeholder="Objection Mitigation (e.g. Narrowly tailored)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={() => handleAddItem('rog')}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
            >
              Add Interrogatory to Docket
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: RFP */}
      {activeTab === 'rfp' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 text-xs leading-relaxed text-muted-foreground custom-geometry">
            <strong className="text-foreground">Document Production Weaponry:</strong> Requests for Production (FRCP Rule 34 / State analogues) force the opposing party to produce unedited emails, ledgers, internal chats, and original receipts. Failure to produce after 30 days allows filing a Motion to Compel with mandatory fee sanctions.
          </div>

          <div className="space-y-3">
            {discovery.rfps.map((item) => (
              <div key={item.id} className="p-4 bg-card/70 border border-border custom-geometry space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-primary/15 text-primary border border-primary/30 custom-geometry">
                    RFP #{item.number}
                  </span>
                  <button
                    onClick={() => handleDeleteItem('rfp', item.id)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {item.questionText}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-primary font-semibold">Evidence Targeted: </span>
                    <span className="text-muted-foreground">{item.targetObjective}</span>
                  </div>
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-amber-500 font-semibold">Scope Defense: </span>
                    <span className="text-muted-foreground">{item.objectionRiskNotes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New RFP */}
          <div className="p-4 bg-card border border-dashed border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Draft Custom Request for Production (RFP)</span>
            </h3>

            <textarea
              rows={2}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g., Produce all timecard records, GPS vehicle logs, and work orders for Defendant's technicians for the date of September 15, 2025."
              className="w-full bg-input/50 border border-border p-2.5 text-xs rounded-none focus:outline-none focus:border-primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Targeted Records (e.g. Prove technician arrived 3 hours late)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={newObjectionRisk}
                onChange={(e) => setNewObjectionRisk(e.target.value)}
                placeholder="Scope Justification (e.g. Direct liability evidence)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={() => handleAddItem('rfp')}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
            >
              Add RFP to Docket
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: RFA (30-Day Default Trap) */}
      {activeTab === 'rfa' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-xs leading-relaxed text-amber-200 custom-geometry flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">The 30-Day Admission Trap (FRCP Rule 36 / State Statutes):</strong>
              <p className="mt-1 text-[11px] text-amber-200/90">
                Requests for Admission are the single most deadly tool for self-represented litigants. If the defendant forgets or fails to serve verified responses within exactly <strong>30 calendar days</strong> of service, <strong>each and every statement is automatically deemed conclusively admitted by law</strong>. No trial testimony can contradict a deemed admission!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {discovery.rfas.map((item) => (
              <div key={item.id} className="p-4 bg-card/70 border border-border custom-geometry space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 custom-geometry">
                      RFA #{item.number}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-destructive/20 text-destructive-foreground border border-destructive/30 font-mono">
                      30-Day Default Trap Active
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('rfa', item.id)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {item.questionText}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-primary font-semibold">Litigation Impact: </span>
                    <span className="text-muted-foreground">{item.targetObjective}</span>
                  </div>
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-emerald-400 font-semibold">Conclusive Effect: </span>
                    <span className="text-muted-foreground">Eliminates need for trial proof if admitted.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New RFA */}
          <div className="p-4 bg-card border border-dashed border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Draft Conclusive Request for Admission (RFA)</span>
            </h3>

            <textarea
              rows={2}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g., Admit that Defendant received Plaintiff's certified demand letter on September 3, 2025."
              className="w-full bg-input/50 border border-border p-2.5 text-xs rounded-none focus:outline-none focus:border-primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Tactical Impact (e.g. Conclusively prove receipt of notice)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={newObjectionRisk}
                onChange={(e) => setNewObjectionRisk(e.target.value)}
                placeholder="Clear single-sentence phrasing"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={() => handleAddItem('rfa')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold transition-all custom-geometry"
            >
              Add RFA to Docket (Activate 30-Day Trap)
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Subpoenas */}
      {activeTab === 'subpoena' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 text-xs leading-relaxed text-muted-foreground custom-geometry">
            <strong className="text-foreground">Third-Party Subpoena Duces Tecum (FRCP Rule 45 / State Code):</strong> Command uncooperative banks, telecom carriers (phone call/SMS records), or independent inspection companies to produce certified business records under penalty of judicial contempt.
          </div>

          <div className="space-y-3">
            {discovery.subpoenas.map((sub, idx) => (
              <div key={sub.id} className="p-4 bg-card/70 border border-border custom-geometry space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-primary/15 text-primary border border-primary/30 custom-geometry">
                      SUBPOENA #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-foreground">{sub.thirdPartyName}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSubpoena(sub.id)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div><strong>Service Address:</strong> {sub.thirdPartyAddress}</div>
                  <div><strong>Records Commanded:</strong> <span className="text-foreground">{sub.documentsRequested}</span></div>
                  <div><strong>Materiality Declaration:</strong> {sub.relevanceDeclaration}</div>
                  <div><strong>Mandatory Response Window:</strong> {sub.complianceDeadlineDays} calendar days</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Subpoena */}
          <div className="p-4 bg-card border border-dashed border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Issue New Subpoena Duces Tecum</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Target Entity / Bank / Carrier</label>
                <input
                  type="text"
                  value={subThirdParty}
                  onChange={(e) => setSubThirdParty(e.target.value)}
                  placeholder="e.g., JPMorgan Chase Bank, N.A."
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Subpoena Compliance Address</label>
                <input
                  type="text"
                  value={subAddress}
                  onChange={(e) => setSubAddress(e.target.value)}
                  placeholder="e.g., National Subpoena Dept, 500 Stanton Christiana Rd"
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Specific Business Records Commanded</label>
              <textarea
                rows={2}
                value={subDocs}
                onChange={(e) => setSubDocs(e.target.value)}
                placeholder="e.g., Certified bank statements and check deposit logs for Account #4912 for the months of July-September 2025."
                className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Declaration of Relevance / Materiality</label>
                <input
                  type="text"
                  value={subRelevance}
                  onChange={(e) => setSubRelevance(e.target.value)}
                  placeholder="e.g., Directly proves date and handling of escrow security deposit funds."
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Compliance Window (Days)</label>
                <input
                  type="number"
                  value={subDays}
                  onChange={(e) => setSubDays(parseInt(e.target.value) || 20)}
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleAddSubpoena}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
            >
              Draft Subpoena Duces Tecum
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
