import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { 
  ShieldCheck, 
  Hash, 
  FileText, 
  Image, 
  Mail, 
  MessageSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Sparkles,
  ExternalLink,
  Search,
  Tag,
  Key,
  Smartphone,
  Scissors
} from 'lucide-react';
import { EvidenceItem } from '../../types';
import { sound } from '../../services/soundEngine';
import { ChatThreadMaker } from './ChatThreadMaker';
import { RedactionCanvas } from './RedactionCanvas';

export const EvidenceLocker: React.FC = () => {
  const { activeCase, updateActiveCase, addEvidence } = useSueChef();
  const [activeTab, setActiveTab] = useState<'vault' | 'chat' | 'redaction'>('vault');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(activeCase.evidenceList[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for new evidence
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EvidenceItem['category']>('receipt');
  const [newFileName, setNewFileName] = useState('');
  const [newDateOccurred, setNewDateOccurred] = useState(new Date().toISOString().split('T')[0]);
  const [newCustodian, setNewCustodian] = useState('Jordan Smith');
  const [newNotes, setNewNotes] = useState('');

  const filteredEvidence = activeCase.evidenceList.filter(ev => 
    ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.exhibitTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newFileName) return;

    await addEvidence({
      title: newTitle,
      category: newCategory,
      originalFileName: newFileName,
      fileSizeBytes: Math.floor(Math.random() * 2000000) + 150000,
      dateAcquired: new Date().toISOString().split('T')[0],
      dateOccurred: newDateOccurred,
      custodian: newCustodian,
      admissibilityChecklist: {
        authenticationFre901: true,
        hearsayExceptionFre803: true,
        bestEvidenceFre1002: true,
        relevanceFre401: true
      },
      exhibitTag: `EXHIBIT ${String.fromCharCode(65 + activeCase.evidenceList.length)}`,
      linkedParagraphIds: ['p_para_4'],
      notes: newNotes
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewFileName('');
    setNewNotes('');
  };

  const getCategoryIcon = (category: EvidenceItem['category']) => {
    switch (category) {
      case 'contract': return <FileText className="w-4 h-4 text-amber-400" />;
      case 'receipt': return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'email': return <Mail className="w-4 h-4 text-sky-400" />;
      case 'text_sms': return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'photo': return <Image className="w-4 h-4 text-pink-400" />;
      default: return <FileText className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-fadeIn">
      {/* Top Workstation Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-border/70 pb-3">
        <button
          onClick={() => { sound.playClick(); setActiveTab('vault'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'vault'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Evidence Locker &amp; SHA-256 Vault</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {activeCase.evidenceList.length}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('chat'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'chat'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>SMS &amp; Chat Reconstructor</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {activeCase.chatThreads?.length || 1}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('redaction'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'redaction'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <Scissors className="w-4 h-4 text-pink-300" />
          <span>Image PII Redaction Canvas</span>
        </button>
      </div>

      {activeTab === 'chat' && <ChatThreadMaker />}
      {activeTab === 'redaction' && <RedactionCanvas />}

      {activeTab === 'vault' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 card-geom bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-2xl text-[var(--text-main)]">
                  Evidence Locker & Cryptographic Vault
                </h1>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  In-Browser SHA-256 Fingerprinting, Federal Rules of Evidence (FRE) Admissibility & Exhibit Stamping
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAddModal(true);
                }}
                className="btn-geom flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Evidence Exhibit</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Left List (5 Cols), Right Detail Inspector (7 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left List (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Filter exhibits by name, tag, or type..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-geom w-full pl-9 pr-3 py-2 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]"
                />
              </div>

              {/* Evidence List Items */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredEvidence.map(ev => {
                  const isSelected = selectedEvidence?.id === ev.id;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedEvidence(ev);
                      }}
                      className={`card-geom p-3.5 border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[var(--badge-bg)] border-[var(--accent-gold)] shadow-md'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] mt-0.5">
                            {getCategoryIcon(ev.category)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 card-geom bg-[var(--accent-gold)] text-slate-950">
                                {ev.exhibitTag}
                              </span>
                              <span className="font-bold text-xs text-[var(--text-main)] truncate max-w-[180px]">
                                {ev.title}
                              </span>
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1 truncate max-w-[220px]">
                              {ev.originalFileName}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[10px] font-mono text-[var(--text-muted)]">
                        <span>Acquired: {ev.dateAcquired}</span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          FRE Admissible
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Detail Inspector (7 Cols) */}
            <div className="lg:col-span-7">
              {selectedEvidence ? (
                <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-5 shadow-xl">
                  {/* Exhibit Header Banner */}
                  <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2 py-1 card-geom bg-[var(--accent-gold)] text-slate-950">
                          {selectedEvidence.exhibitTag}
                        </span>
                        <span className="text-xs uppercase font-mono text-[var(--text-muted)]">
                          {selectedEvidence.category.toUpperCase()} EXHIBIT
                        </span>
                      </div>
                      <h2 className="font-serif font-bold text-xl text-[var(--text-main)] mt-1.5">
                        {selectedEvidence.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        updateActiveCase(prev => ({
                          ...prev,
                          evidenceList: prev.evidenceList.filter(e => e.id !== selectedEvidence.id)
                        }));
                        setSelectedEvidence(activeCase.evidenceList.find(e => e.id !== selectedEvidence.id) || null);
                      }}
                      className="text-[var(--text-muted)] hover:text-red-400 p-1.5 card-geom hover:bg-red-500/10 transition-colors"
                      title="Delete Evidence"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* SHA-256 Hash Display */}
                  <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-gold)]">
                        <Hash className="w-4 h-4" />
                        <span>SHA-256 Cryptographic Digest</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 card-geom bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Tamper-Proof Verified
                      </span>
                    </div>
                    <div className="font-mono text-xs text-[var(--text-main)] break-all bg-black/40 p-2.5 card-geom border border-white/5">
                      {selectedEvidence.sha256Hash}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-indigo-400" />
                      <span>Certified under Federal Rule of Evidence 902(13) &amp; 902(14) (Self-Authenticating Digital Evidence)</span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="card-geom bg-[var(--bg-secondary)] p-3 border border-[var(--border-color)]">
                      <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">Original File</div>
                      <div className="font-bold text-xs text-[var(--text-main)] truncate mt-0.5">
                        {selectedEvidence.originalFileName}
                      </div>
                    </div>
                    <div className="card-geom bg-[var(--bg-secondary)] p-3 border border-[var(--border-color)]">
                      <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">File Size</div>
                      <div className="font-bold text-xs text-[var(--text-main)] mt-0.5">
                        {Math.round(selectedEvidence.fileSizeBytes / 1024)} KB
                      </div>
                    </div>
                    <div className="card-geom bg-[var(--bg-secondary)] p-3 border border-[var(--border-color)]">
                      <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">Custodian</div>
                      <div className="font-bold text-xs text-[var(--text-main)] truncate mt-0.5">
                        {selectedEvidence.custodian}
                      </div>
                    </div>
                  </div>

                  {/* FRE Admissibility Checklist */}
                  <div className="space-y-3 pt-2">
                    <h3 className="font-serif font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Evidentiary Admissibility Checklist (FRE)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-3 card-geom bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                        <span className="font-bold">FRE 901 Authentication: </span>
                        <span>Firsthand custodian statement &amp; digital metadata timestamp.</span>
                      </div>
                      <div className="p-3 card-geom bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                        <span className="font-bold">FRE 803(6) Business Records: </span>
                        <span>Regular course of business records exception.</span>
                      </div>
                      <div className="p-3 card-geom bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                        <span className="font-bold">FRE 1002 Best Evidence: </span>
                        <span>Original digital capture / verified duplicate under FRE 1003.</span>
                      </div>
                      <div className="p-3 card-geom bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                        <span className="font-bold">FRE 401 Relevance: </span>
                        <span>Directly proves breach, condition, or damages element.</span>
                      </div>
                    </div>
                  </div>

                  {/* Official Courtroom Exhibit Sticker */}
                  <div className="p-4 card-geom bg-slate-950 border-2 border-[var(--accent-gold)] space-y-3">
                    <div className="flex justify-between items-center border-b border-[var(--accent-gold)]/30 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest font-mono text-[var(--accent-gold)] font-bold">
                          Official Courtroom Exhibit Sticker
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Form SC-EX-01
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-4 border border-[var(--accent-gold)]/40 text-center space-y-2">
                      <div className="text-xl font-serif font-black text-[var(--accent-gold)] tracking-wide">
                        {selectedEvidence.exhibitTag}
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-200">
                        {activeCase.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {activeCase.courtName} • Case No. {activeCase.caseNumber}
                      </div>
                      <div className="text-[11px] font-medium text-slate-300 pt-1 border-t border-white/10">
                        "{selectedEvidence.title}" ({selectedEvidence.originalFileName})
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400/90 break-all bg-black/60 p-1.5 rounded">
                        SHA-256: {selectedEvidence.sha256Hash}
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 pt-1">
                        <span>Offered By: Plaintiff ({selectedEvidence.custodian})</span>
                        <span>Date: {selectedEvidence.dateOccurred || '2026-06-01'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playDocketStamp();
                        window.print();
                      }}
                      className="w-full py-2 bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 font-bold text-xs card-geom transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Print Official Exhibit Sticker Label
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-xs text-[var(--text-muted)]">
                  Select an evidence exhibit on the left to view cryptographic fingerprints and admissibility reports.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">Add Evidence Exhibit</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[var(--text-muted)] hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">Exhibit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Move-Out Inspection Photos (Apt 3B)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                  >
                    <option value="receipt">Receipt / Invoice</option>
                    <option value="contract">Written Contract / Lease</option>
                    <option value="photo">Photographic Evidence</option>
                    <option value="text_sms">SMS / Chat Thread</option>
                    <option value="email">Email Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">File Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IMG_4091_ApartmentClean.jpg"
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">Notes & Context</label>
                <textarea
                  rows={2}
                  placeholder="Describe why this evidence is conclusive..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-geom px-4 py-2 text-xs text-[var(--text-muted)] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-geom px-5 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all"
                >
                  Generate SHA-256 & Stamp Exhibit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
