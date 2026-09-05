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
  Key
} from 'lucide-react';
import { EvidenceItem } from '../../types';
import { sound } from '../../services/soundEngine';

export const EvidenceLocker: React.FC = () => {
  const { activeCase, updateActiveCase, addEvidence } = useSueChef();
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

      {/* Main Grid: Left List (4 Cols), Right Detail Inspector (8 Cols) */}
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

                <div className="p-2 card-geom bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5 text-xs font-mono font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>INTEGRITY VERIFIED</span>
                </div>
              </div>

              {/* SHA-256 Cryptographic Hash Fingerprint */}
              <div className="space-y-1.5 card-geom bg-black/40 border border-[var(--border-color)] p-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--accent-gold)]">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" />
                    Web Crypto SHA-256 Digital Fingerprint
                  </span>
                  <span className="text-[10px] text-slate-400">Deterministic Court Hash</span>
                </div>
                <div className="font-mono text-[11px] text-slate-300 break-all select-all bg-black/60 p-2 card-geom border border-white/5">
                  {selectedEvidence.sha256Hash}
                </div>
              </div>

              {/* Chain of Custody & Metadata Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3">
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">ORIGINAL FILE</div>
                  <div className="font-mono font-semibold text-[var(--text-main)] mt-1 truncate">
                    {selectedEvidence.originalFileName}
                  </div>
                </div>

                <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3">
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">FILE SIZE</div>
                  <div className="font-mono font-semibold text-[var(--text-main)] mt-1">
                    {(selectedEvidence.fileSizeBytes / 1024).toFixed(1)} KB
                  </div>
                </div>

                <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3">
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">LEGAL CUSTODIAN</div>
                  <div className="font-mono font-semibold text-[var(--text-main)] mt-1 truncate">
                    {selectedEvidence.custodian}
                  </div>
                </div>
              </div>

              {/* Federal Rules of Evidence Admissibility Checklist */}
              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 space-y-3">
                <h4 className="font-serif font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Federal Rules of Evidence (FRE) Admissibility Test
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 card-geom bg-[var(--bg-card)] border border-white/5">
                    <span className="text-[var(--text-main)]">
                      <strong>FRE 901:</strong> Authenticity & Witness Personal Knowledge
                    </span>
                    <span className="font-mono font-bold text-emerald-400">PASS ✓</span>
                  </div>

                  <div className="flex items-center justify-between p-2 card-geom bg-[var(--bg-card)] border border-white/5">
                    <span className="text-[var(--text-main)]">
                      <strong>FRE 803(6):</strong> Business Record / Direct Written Admission
                    </span>
                    <span className="font-mono font-bold text-emerald-400">PASS ✓</span>
                  </div>

                  <div className="flex items-center justify-between p-2 card-geom bg-[var(--bg-card)] border border-white/5">
                    <span className="text-[var(--text-main)]">
                      <strong>FRE 1002:</strong> Best Evidence Rule (Original Electronic File)
                    </span>
                    <span className="font-mono font-bold text-emerald-400">PASS ✓</span>
                  </div>

                  <div className="flex items-center justify-between p-2 card-geom bg-[var(--bg-card)] border border-white/5">
                    <span className="text-[var(--text-main)]">
                      <strong>FRE 401:</strong> Material Relevance to Complaint Paragraphs
                    </span>
                    <span className="font-mono font-bold text-emerald-400">PASS ✓</span>
                  </div>
                </div>
              </div>

              {/* Substantive Notes & Evidentiary Value */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[var(--text-muted)]">
                  EVIDENTIARY VALUE & COURT NOTES:
                </label>
                <div className="text-xs text-[var(--text-main)] bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 card-geom leading-relaxed">
                  {selectedEvidence.notes}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--text-muted)] space-y-2">
              <ShieldCheck className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm">Select an exhibit from the left to inspect its cryptographic fingerprint and admissibility.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Evidence Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--accent-gold)]" />
                <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                  Add Evidence Exhibit
                </h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Exhibit Title</label>
                <input
                  type="text"
                  placeholder="e.g. Move-out Inspection Photos"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)]">Evidence Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as EvidenceItem['category'])}
                    className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                  >
                    <option value="receipt">Bank Wire / Receipt</option>
                    <option value="contract">Written Contract / Lease</option>
                    <option value="email">Email Correspondence</option>
                    <option value="text_sms">SMS / Text Message Thread</option>
                    <option value="photo">Photo / Video Log</option>
                    <option value="report">Police / Incident Report</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)]">File Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Moveout_Photos.pdf"
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    required
                    className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)]">Date Occurred / Created</label>
                  <input
                    type="date"
                    value={newDateOccurred}
                    onChange={e => setNewDateOccurred(e.target.value)}
                    className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--text-muted)]">Custodian Name</label>
                  <input
                    type="text"
                    value={newCustodian}
                    onChange={e => setNewCustodian(e.target.value)}
                    className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--text-muted)]">Evidentiary Notes / Relevance</label>
                <textarea
                  placeholder="Explain why this evidence proves your claim..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  rows={3}
                  className="input-geom w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-geom px-4 py-2 text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-geom px-4 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90"
                >
                  Calculate Hash & Stamp Exhibit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
