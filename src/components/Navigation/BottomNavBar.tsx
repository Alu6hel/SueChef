import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { WorkstationId } from '../../types';
import { sound } from '../../services/soundEngine';
import { 
  Home, 
  Scale, 
  ShieldCheck, 
  FileText, 
  Lightbulb, 
  Grid, 
  Calculator, 
  Building, 
  FolderSearch, 
  Gavel, 
  Clock, 
  Layers, 
  UserCheck, 
  Settings, 
  Sparkles, 
  X,
  Users
} from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { 
    activeWorkstation, 
    setActiveWorkstation, 
    setIsPartiesModalOpen,
    setIsSettingsOpen,
    setIsTourOpen,
    activeCase
  } = useSueChef();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Main 5 navigation items (Audiomack-inspired bottom layout)
  const navItems: { id: WorkstationId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'claim-kitchen', label: 'Build Case', icon: Scale },
    { id: 'evidence-locker', label: 'Evidence', icon: ShieldCheck },
    { id: 'pleading-builder', label: 'Papers', icon: FileText },
    { id: 'second-opinion', label: 'AI Advisor', icon: Lightbulb },
  ];

  // Secondary tools in the drawer
  const moreTools: { id: WorkstationId; label: string; desc: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'settlement-matrix', label: 'Demand & Settle', desc: 'Rule 408 negotiation brackets & offers', icon: Calculator },
    { id: 'legal-services', label: 'Free Legal Aid & Courts', desc: '131+ pro bono clinics & self-help portals', icon: Building, badge: 'Verified' },
    { id: 'discovery-studio', label: 'Request Evidence', desc: 'Formal discovery interrogatories & document demands', icon: FolderSearch },
    { id: 'trial-prep', label: 'Court Hearing Prep', desc: 'Practice mock trial & evidentiary objections', icon: Gavel },
    { id: 'sol-watcher', label: 'Statute of Limitations', desc: 'Filing deadlines docket & tolling dates', icon: Clock },
    { id: 'service-tracker', label: 'Service of Process', desc: 'Affidavits of service & summons tracking', icon: UserCheck },
    { id: 'legalese-decoder', label: 'Plain-English Decoder', desc: 'Translate dense legal jargon into plain facts', icon: Layers },
    { id: 'attorney-dossier', label: 'Opposing Counsel', desc: 'Opponent settlement patterns & strategies', icon: FileText },
    { id: 'security-vault', label: 'Privacy & Offline Vault', desc: 'Local encryption & tamper-evident export', icon: ShieldCheck },
  ];

  const handleNavClick = (id: WorkstationId) => {
    sound.playClick();
    setActiveWorkstation(id);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Drawer Overlay for All Litigation Stations */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="bg-[var(--bg-card)] border-t-2 sm:border-2 border-[var(--accent-gold)] sm:rounded-2xl rounded-t-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent-gold)]">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[var(--text-main)]">
                    All Litigation Workstations
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">
                    Everyday legal dispute toolbox
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsDrawerOpen(false);
                  setIsPartiesModalOpen(true);
                }}
                className="btn-geom px-2.5 py-1.5 bg-[var(--accent-gold)] text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Edit Case Parties</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsDrawerOpen(false);
                    setIsTourOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] rounded flex items-center gap-1 font-mono"
                >
                  <Sparkles className="w-3 h-3 text-[var(--accent-gold)]" />
                  <span>Tour</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsDrawerOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] rounded flex items-center gap-1 font-mono"
                >
                  <Settings className="w-3 h-3 text-[var(--accent-gold)]" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Workstations Grid */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {moreTools.map(tool => {
                  const Icon = tool.icon;
                  const isActive = activeWorkstation === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleNavClick(tool.id)}
                      className={`p-3 text-left rounded-xl border transition-all flex items-start gap-3 ${
                        isActive
                          ? 'bg-[var(--accent-gold)] text-slate-950 font-bold border-[var(--accent-gold)] shadow-md'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]/60 hover:text-[var(--text-main)]'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${
                        isActive ? 'bg-slate-950 text-[var(--accent-gold)]' : 'bg-black/30 text-[var(--accent-gold)]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate ${isActive ? 'text-slate-950' : 'text-[var(--text-main)]'}`}>
                            {tool.label}
                          </span>
                          {tool.badge && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-900/80 text-emerald-300 font-bold ml-1">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-slate-800' : 'text-[var(--text-muted)]'}`}>
                          {tool.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audiomack-Inspired Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e14]/95 dark:bg-[#0c0e14]/95 backdrop-blur-xl border-t border-amber-500/25 shadow-2xl transition-all">
        <div className="max-w-xl mx-auto px-2 py-1.5 flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeWorkstation === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all select-none group ${
                  isActive 
                    ? 'text-amber-400 font-bold scale-105' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active warm indicator pill */}
                {isActive && (
                  <span className="absolute -top-1.5 w-6 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-in fade-in zoom-in-75 duration-200" />
                )}
                
                <div className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-amber-500/15' : 'group-hover:bg-white/5'
                }`}>
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                </div>
                
                <span className={`text-[10px] tracking-tight leading-tight mt-0.5 ${
                  isActive ? 'text-amber-400 font-extrabold' : 'text-slate-400'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Drawer Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsDrawerOpen(prev => !prev);
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all select-none group ${
              isDrawerOpen ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg transition-colors ${
              isDrawerOpen ? 'bg-amber-500/15' : 'group-hover:bg-white/5'
            }`}>
              <Grid className="w-5 h-5 text-slate-400 group-hover:text-slate-200" />
            </div>
            <span className="text-[10px] tracking-tight leading-tight mt-0.5 text-slate-400">
              More
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
