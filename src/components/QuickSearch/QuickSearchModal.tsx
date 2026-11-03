import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { DISPUTE_BLUEPRINTS } from '../../services/disputeTemplates';
import { 
  Search, 
  Command, 
  FolderSearch, 
  Gavel, 
  Calculator, 
  Clock, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Send, 
  UserCheck, 
  Lock, 
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  X,
  Building,
  Lightbulb,
  Scale
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  keywords: string;
  stepNum?: string;
  category: 'workstation' | 'blueprint' | 'evidence' | 'lexicon' | 'action';
  icon: React.ReactNode;
  action: () => void;
}

export const QuickSearchModal: React.FC = () => {
  const { 
    isQuickSearchOpen, 
    setIsQuickSearchOpen, 
    setActiveWorkstation, 
    loadBlueprint,
    setIsCaseManagerOpen,
    setIsPartiesModalOpen,
    setIsTourOpen,
    setIsSettingsOpen,
    exportCaseBundle,
    activeCase,
    t
  } = useSueChef();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isQuickSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isQuickSearchOpen]);

  const items: SearchResultItem[] = useMemo(() => [
    // All 15 Workstations (numbered 0-13 + enforcement)
    {
      id: 'ws_home',
      stepNum: '0',
      title: `0. ${t('navHome', 'Home')} — Dashboard & 30-Sec Intake Assistant`,
      subtitle: 'Dispute overview, merit stats, and 4-question intake wizard',
      keywords: '0 home dashboard intake start overview wizard',
      category: 'workstation',
      icon: <UtensilsCrossed className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('home'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_claim',
      stepNum: '1',
      title: `1. ${t('navBuildCase', 'Build Case')} — Claim Kitchen & Merit Scoring`,
      subtitle: 'Analyze legal elements, evaluate damages, and assess small claims caps',
      keywords: '1 step 1 ws 1 build case claim kitchen merit score elements damages deposit contract',
      category: 'workstation',
      icon: <Scale className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('claim-kitchen'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_evidence',
      stepNum: '2',
      title: `2. ${t('navEvidence', 'Evidence & Proof')} — SHA-256 Locker & Redactor`,
      subtitle: 'SHA-256 evidence hashing, SMS chat reconstructor, Bates stamps & PII redactor',
      keywords: '2 step 2 ws 2 evidence locker proof sha256 256 901 exhibit hash sms chat redact photo receipt',
      category: 'workstation',
      icon: <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('evidence-locker'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_pleading',
      stepNum: '3',
      title: `3. ${t('navCourtPapers', 'Court Papers')} — 28-Line Pleading & Demand Builder`,
      subtitle: 'California/Federal 28-line numbered complaint, 10-day demand letter & affidavits',
      keywords: '3 step 3 ws 3 28 10 5 court papers pleading complaint demand letter affidavit packet sc-100',
      category: 'workstation',
      icon: <FileText className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('pleading-builder'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_settlement',
      stepNum: '4',
      title: `4. ${t('navDemandSettle', 'Demand & Settle')} — Settlement Matrix & Rule 408`,
      subtitle: 'Expected Value (EV) calculator, ZOPA zone, and FRE Rule 408 offer drafter',
      keywords: '4 step 4 ws 4 408 settlement demand negotiate matrix ev calculator offer counteroffer release',
      category: 'workstation',
      icon: <Calculator className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('settlement-matrix'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_second_op',
      stepNum: '5',
      title: `5. ${t('navCaseStrategy', 'Case Strategy')} — AI Legal Second Opinion & Viability Audit`,
      subtitle: 'Predict opponent defenses, winning counter-rebuttals, and case grade',
      keywords: '5 step 5 ws 5 strategy second opinion advisor ai defenses rebuttal viability grade win probability',
      category: 'workstation',
      icon: <Lightbulb className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('second-opinion'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_legal_aid',
      stepNum: '6',
      title: `6. ${t('navLegalAid', 'Legal Aid & Courts')} — Verified Clinics & Fee Waivers`,
      subtitle: '131+ pro bono clinics, court self-help portals, and FW-001 $0 fee waiver forms',
      keywords: '6 step 6 ws 6 131 fw-001 legal aid courts fee waiver pro bono clinic directory lawyer',
      category: 'workstation',
      icon: <Building className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('legal-services'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_discovery',
      stepNum: '7',
      title: `7. ${t('navRequestEvidence', 'Request Evidence')} — Pre-Trial Discovery & Subpoenas`,
      subtitle: 'Draft Interrogatories, RFPs, RFAs (30-day admission trap), and Subpoenas',
      keywords: '7 step 7 ws 7 30 discovery request evidence interrogatories rfp rfa subpoena duces tecum',
      category: 'workstation',
      icon: <FolderSearch className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('discovery-studio'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_trial',
      stepNum: '8',
      title: `8. ${t('navTrialPrep', 'Trial Prep')} — Hearing Simulator & Teleprompter`,
      subtitle: 'Interactive objection simulator quiz, FRE rules cheat sheet, and opening script',
      keywords: '8 step 8 ws 8 trial prep hearing objection simulator hearsay script teleprompter cross examination',
      category: 'workstation',
      icon: <Gavel className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('trial-prep'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_sol',
      stepNum: '9',
      title: `9. ${t('navSolDocket', 'SOL Docket')} — Statute of Limitations Watcher`,
      subtitle: 'Jurisdiction-specific filing deadlines, tolling calculator, and countdown dockets',
      keywords: '9 step 9 ws 9 sol docket statute of limitations deadline countdown tolling calendar',
      category: 'workstation',
      icon: <Clock className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('sol-watcher'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_service',
      stepNum: '10',
      title: `10. ${t('navServiceProof', 'Service & Proof')} — Process Server & Return Affidavit`,
      subtitle: 'FRCP Rule 4 90-day service countdown, certified mail & Proof of Service affidavit',
      keywords: '10 step 10 ws 10 90 rule 4 service of process proof server certified mail summons',
      category: 'workstation',
      icon: <Send className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('service-tracker'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_decoder',
      stepNum: '11',
      title: `11. ${t('navLegalDecoder', 'Legal Decoder')} — Plain-English Clause & Lexicon`,
      subtitle: 'Demystify toxic contract clauses, courtroom Latin, and 300+ legal terms',
      keywords: '11 step 11 ws 11 300 legalese decoder dictionary lexicon latin contract clause translate',
      category: 'workstation',
      icon: <BookOpen className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('legalese-decoder'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_dossier',
      stepNum: '12',
      title: `12. ${t('navAttorneyBinder', 'Attorney Binder')} — Dossier & Opposing Counsel`,
      subtitle: 'Printable attorney intake binder, opposing counsel tracker & fee savings calculator',
      keywords: '12 step 12 ws 12 attorney binder dossier opposing counsel judge savings hours',
      category: 'workstation',
      icon: <UserCheck className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('attorney-dossier'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_security',
      stepNum: '13',
      title: `13. ${t('navSecurityVault', 'Security Vault')} — AES-256 Crypto Vault & Panic Wipe`,
      subtitle: 'AES-256 GCM zero-knowledge encryption, offline backups & instant shredder',
      keywords: '13 step 13 ws 13 256 security vault crypto encrypt backup export panic wipe shredder',
      category: 'workstation',
      icon: <Lock className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setActiveWorkstation('security-vault'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_enforcement',
      stepNum: '14',
      title: '14. Post-Judgment Enforcement & Asset Collection Suite',
      subtitle: 'Wage garnishment, bank levy writs, property liens & debtor asset examination',
      keywords: '14 enforcement collect judgment garnishment bank levy writ lien',
      category: 'workstation',
      icon: <Gavel className="w-4 h-4 text-emerald-400" />,
      action: () => { setActiveWorkstation('enforcement'); setIsQuickSearchOpen(false); }
    },

    // Active Case Evidence Exhibits
    ...(activeCase?.evidenceList || []).map((ev, idx) => ({
      id: `ev_${ev.id}`,
      stepNum: `${idx + 1}`,
      title: `Exhibit ${ev.exhibitTag}: ${ev.title}`,
      subtitle: `${ev.category.toUpperCase()} • ${ev.dateOccurred} • SHA-256 Verified`,
      keywords: `exhibit ${ev.exhibitTag} ${ev.title} ${ev.category} ${ev.dateOccurred} ${ev.custodian} evidence`,
      category: 'evidence' as const,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      action: () => { setActiveWorkstation('evidence-locker'); setIsQuickSearchOpen(false); }
    })),

    // Dispute Blueprints
    ...DISPUTE_BLUEPRINTS.map((bp, idx) => ({
      id: `bp_${bp.id}`,
      stepNum: `B${idx + 1}`,
      title: `Blueprint: ${bp.title}`,
      subtitle: `${bp.state} Jurisdiction • ${bp.damagesSummary}`,
      keywords: `blueprint template sample ${bp.title} ${bp.state} ${bp.category.replace(/_/g, ' ')} ${bp.damagesSummary}`,
      category: 'blueprint' as const,
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: () => { loadBlueprint(bp.id); setIsQuickSearchOpen(false); }
    })),

    // Key Legal Lexicon Terms
    ...[
      { term: 'Prima Facie Case', sub: 'Basic legal elements required to prove liability in court', kw: 'prima facie elements proof burden' },
      { term: 'Treble / Statutory Bad-Faith Damages (2x–3x)', sub: 'Punitive multiplier for willful withholding of deposits or wages', kw: 'treble 2x 3x multiplier bad faith penalty civ code 1950.5' },
      { term: 'FRE Rule 408 — Confidential Settlement Offer', sub: 'Protects settlement negotiations from being used against you at trial', kw: '408 rule 408 settlement offer compromise' },
      { term: 'Subpoena Duces Tecum', sub: 'Court order compelling opponent or third party to produce records', kw: 'subpoena duces tecum records bank discovery' },
      { term: 'In Forma Pauperis (FW-001 Court Fee Waiver)', sub: 'Statutory application to waive $75–$435 court filing and service fees', kw: 'ifp in forma pauperis fw-001 fee waiver free filing' },
      { term: 'Hearsay & Business Records Exception (FRE 803(6))', sub: 'How to admit invoices, receipts, and text messages over objection', kw: 'hearsay 801 803 objection business records text messages' }
    ].map((lx, idx) => ({
      id: `lex_${idx}`,
      title: `Legal Term: ${lx.term}`,
      subtitle: lx.sub,
      keywords: `lexicon term dictionary ${lx.term} ${lx.sub} ${lx.kw}`,
      category: 'lexicon' as const,
      icon: <BookOpen className="w-4 h-4 text-sky-400" />,
      action: () => { setActiveWorkstation('legalese-decoder'); setIsQuickSearchOpen(false); }
    })),

    // Quick Actions
    {
      id: 'act_case_mgr',
      title: 'Switch Dispute Case or Load Blueprint',
      subtitle: 'Open the Dispute Matter Switcher modal',
      keywords: 'switch case manager matter new dispute blueprint',
      category: 'action',
      icon: <Command className="w-4 h-4 text-emerald-400" />,
      action: () => { setIsQuickSearchOpen(false); setIsCaseManagerOpen(true); }
    },
    {
      id: 'act_parties',
      title: 'Edit Dispute Parties (Plaintiff & Defendant Names)',
      subtitle: 'Update your name, opponent name, addresses, and registered agent',
      keywords: 'edit parties plaintiff defendant opponent landlord name address',
      category: 'action',
      icon: <UserCheck className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setIsQuickSearchOpen(false); setIsPartiesModalOpen(true); }
    },
    {
      id: 'act_tour',
      title: 'Start Interactive Guided Spotlight Tour',
      subtitle: 'Learn how to navigate SueChef workstations step-by-step',
      keywords: 'tour guide help walkthrough onboarding',
      category: 'action',
      icon: <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setIsQuickSearchOpen(false); setIsTourOpen(true); }
    },
    {
      id: 'act_settings',
      title: 'Open App Settings, Themes & Country Jurisdiction',
      subtitle: 'Switch visual theme, font size, sound, or international country law',
      keywords: 'settings theme light dark font size country jurisdiction',
      category: 'action',
      icon: <Command className="w-4 h-4 text-[var(--accent-gold)]" />,
      action: () => { setIsQuickSearchOpen(false); setIsSettingsOpen(true); }
    },
    {
      id: 'act_export',
      title: 'Export Encrypted JSON Case Bundle',
      subtitle: 'Download complete offline case backup',
      keywords: 'export download json backup bundle save',
      category: 'action',
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      action: () => { exportCaseBundle(); setIsQuickSearchOpen(false); }
    }
  ], [activeCase, t, setActiveWorkstation, setIsQuickSearchOpen, loadBlueprint, setIsCaseManagerOpen, setIsPartiesModalOpen, setIsTourOpen, setIsSettingsOpen, exportCaseBundle]);

  // Multi-token relevance scoring so typing numbers ("1", "3", "28", "408") or partial letters ("evid", "dep", "plea") ranks the exact match first
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const tokens = q.split(/\s+/).filter(Boolean);

    const scored = items.map(item => {
      const titleLower = item.title.toLowerCase();
      const subLower = item.subtitle.toLowerCase();
      const kwLower = item.keywords.toLowerCase();
      const catLower = item.category.toLowerCase();
      const hay = `${titleLower} ${subLower} ${kwLower} ${catLower}`;

      // Every token must match somewhere in the item
      for (const tk of tokens) {
        if (!hay.includes(tk)) return { item, score: 0 };
      }

      let score = 10;
      if (item.stepNum && item.stepNum.toLowerCase() === q) score += 200;
      if (titleLower.startsWith(q) || titleLower.includes(`. ${q}`)) score += 120;
      for (const tk of tokens) {
        if (item.stepNum && item.stepNum.toLowerCase() === tk) score += 100;
        if (titleLower.includes(tk)) score += 40;
        const words = hay.split(/[^a-z0-9]+/);
        if (words.some(w => w === tk)) score += 50;
        else if (words.some(w => w.startsWith(tk))) score += 25;
      }
      return { item, score };
    }).filter(entry => entry.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.item);
  }, [items, query]);

  if (!isQuickSearchOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) {
      if (e.key === 'Escape') setIsQuickSearchOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        sound.playClick();
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsQuickSearchOpen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={() => setIsQuickSearchOpen(false)}
    >
      <div 
        className="bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] custom-geometry max-w-2xl w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-gold)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder={t('quickSearchPlaceholder', 'Search tools, step # (1-13), blueprints, exhibits, legal terms...')}
            className="w-full bg-transparent text-xs sm:text-sm text-[var(--text-main)] focus:outline-none placeholder:text-[var(--text-muted)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSelectedIndex(0); inputRef.current?.focus(); }}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsQuickSearchOpen(false)}
            className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry text-[var(--text-muted)] hover:text-[var(--text-main)] shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Results Count & Category Filter Hint */}
        <div className="px-3 py-1.5 bg-[var(--bg-primary)] border-b border-[var(--border-color)]/60 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
          <span>{filteredItems.length} result{filteredItems.length === 1 ? '' : 's'} available</span>
          <span className="hidden sm:inline">Tip: Type a step number (1–13), statute (408, 28), or keyword</span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] sm:max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  item.action();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`p-2.5 sm:p-3 custom-geometry cursor-pointer transition-all flex items-center justify-between gap-2 sm:gap-3 border ${
                  isSelected
                    ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-semibold'
                    : 'bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-hover)] text-[var(--text-main)] border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className={`p-1.5 sm:p-2 custom-geometry shrink-0 ${isSelected ? 'bg-slate-950 text-[var(--accent-gold)]' : 'bg-[var(--bg-card)] border border-[var(--border-color)]'}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-bold font-serif leading-tight truncate ${isSelected ? 'text-slate-950' : 'text-[var(--text-main)]'}`}>
                      {item.title}
                    </div>
                    <div className={`text-[11px] leading-tight truncate mt-0.5 ${isSelected ? 'text-slate-900' : 'text-[var(--text-muted)]'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 custom-geometry font-bold ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-[var(--bg-card)] text-[var(--accent-gold)] border border-[var(--border-color)]'
                  }`}>
                    {item.category}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 hidden xs:block ${isSelected ? 'opacity-100 text-slate-950' : 'opacity-40 text-[var(--text-muted)]'}`} />
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-10 text-center text-xs text-[var(--text-muted)]">
              No matching workstations, blueprints, exhibits, or terms found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
