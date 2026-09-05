import React, { useState, useEffect, useRef } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { WorkstationId } from '../../types';
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
  X
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'workstation' | 'blueprint' | 'action';
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
    setIsTourOpen,
    panicWipe,
    exportCaseBundle
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

  if (!isQuickSearchOpen) return null;

  const items: SearchResultItem[] = [
    // Workstations
    {
      id: 'ws_claim',
      title: 'Claim Kitchen & Merit Scoring',
      subtitle: 'Analyze legal elements, evaluate damages, and assess small claims caps',
      category: 'workstation',
      icon: <UtensilsCrossed className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('claim-kitchen'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_discovery',
      title: 'Pre-Trial Discovery & Subpoena Studio',
      subtitle: 'Draft Interrogatories, RFPs, RFAs (30-day trap), and Subpoenas',
      category: 'workstation',
      icon: <FolderSearch className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('discovery-studio'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_trial',
      title: 'Trial & Hearing Prep Workstation',
      subtitle: 'Objection simulator quiz, FRE rules cheat sheet, and teleprompter',
      category: 'workstation',
      icon: <Gavel className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('trial-prep'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_settlement',
      title: 'Settlement Negotiation & Risk Matrix',
      subtitle: 'Expected Value (EV) calculator and Rule 408 counter-offer drafter',
      category: 'workstation',
      icon: <Calculator className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('settlement-matrix'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_sol',
      title: 'Statute of Limitations Watcher',
      subtitle: 'Jurisdiction-specific deadlines, tolling calculator, and countdown dockets',
      category: 'workstation',
      icon: <Clock className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('sol-watcher'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_pleading',
      title: '28-Line Pleading & Complaint Builder',
      subtitle: 'California style 28-line numbered pleading generator & demand letters',
      category: 'workstation',
      icon: <FileText className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('pleading-builder'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_evidence',
      title: 'Evidence Locker, Chat Reconstructor & Redaction',
      subtitle: 'SHA-256 evidence hashing, SMS chat reconstructor, and PII redactor',
      category: 'workstation',
      icon: <ShieldCheck className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('evidence-locker'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_decoder',
      title: 'Legalese Decoder & 300+ Term Lexicon',
      subtitle: 'Demystify courtroom Latin, procedural jargon, and pro se strategy',
      category: 'workstation',
      icon: <BookOpen className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('legalese-decoder'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_service',
      title: 'Service of Process & Proof Tracker',
      subtitle: 'FRCP Rule 4 90-day service countdown and Proof of Service affidavit',
      category: 'workstation',
      icon: <Send className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('service-tracker'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_dossier',
      title: 'Opposing Counsel & Judge Intelligence Dossier',
      subtitle: 'Track attorney reputation, past sanctions, and pro se bias tendencies',
      category: 'workstation',
      icon: <UserCheck className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('attorney-dossier'); setIsQuickSearchOpen(false); }
    },
    {
      id: 'ws_security',
      title: 'Zero-Knowledge Crypto Vault & Panic Wipe',
      subtitle: 'AES-256 GCM client encryption, export encrypted bundles, instant shredder',
      category: 'workstation',
      icon: <Lock className="w-4 h-4 text-primary" />,
      action: () => { setActiveWorkstation('security-vault'); setIsQuickSearchOpen(false); }
    },

    // Blueprints
    ...DISPUTE_BLUEPRINTS.map(bp => ({
      id: `bp_${bp.id}`,
      title: `Load Blueprint: ${bp.title}`,
      subtitle: `${bp.state} Jurisdiction • ${bp.damagesSummary}`,
      category: 'blueprint' as const,
      icon: <Sparkles className="w-4 h-4 text-amber-300" />,
      action: () => { loadBlueprint(bp.id); setIsQuickSearchOpen(false); }
    })),

    // Quick Actions
    {
      id: 'act_case_mgr',
      title: 'Open Dispute Matter Switcher',
      subtitle: 'Browse all active cases and blueprints',
      category: 'action',
      icon: <Command className="w-4 h-4 text-emerald-400" />,
      action: () => { setIsQuickSearchOpen(false); setIsCaseManagerOpen(true); }
    },
    {
      id: 'act_tour',
      title: 'Start Interactive Guided Spotlight Tour',
      subtitle: 'Learn how to navigate SueChef workstations step-by-step',
      category: 'action',
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      action: () => { setIsQuickSearchOpen(false); setIsTourOpen(true); }
    },
    {
      id: 'act_export',
      title: 'Export Encrypted JSON Case Bundle',
      subtitle: 'Download complete offline case backup',
      category: 'action',
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      action: () => { exportCaseBundle(); setIsQuickSearchOpen(false); }
    }
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={() => setIsQuickSearchOpen(false)}
    >
      <div 
        className="bg-card border-2 border-border custom-geometry max-w-2xl w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search workstations, dispute blueprints, legal actions... (↑↓ to navigate, Enter to select)"
            className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-muted border border-border custom-geometry text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
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
                className={`p-3 custom-geometry cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/50 text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 custom-geometry ${isSelected ? 'bg-black/20 text-white' : 'bg-muted'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold font-serif leading-tight">
                      {item.title}
                    </div>
                    <div className={`text-[11px] leading-tight ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] uppercase font-mono px-2 py-0.5 custom-geometry ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-muted text-muted-foreground border border-border'
                  }`}>
                    {item.category}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-10 text-center text-xs text-muted-foreground">
              No matching workstations or blueprints found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
