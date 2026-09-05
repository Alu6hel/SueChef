import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { ThemeId, CornerGeometry, WorkstationId } from '../../types';
import { sound } from '../../services/soundEngine';
import { AluLogo } from '../Branding/AluLogo';
import { 
  Scale, 
  FileText, 
  Search, 
  FolderSearch, 
  Gavel, 
  ShieldCheck, 
  Calculator, 
  Lock, 
  Palette, 
  Volume2, 
  VolumeX, 
  Shapes, 
  AlertTriangle, 
  FolderGit2, 
  Sparkles,
  Layers,
  Flame,
  FileSpreadsheet,
  Clock,
  HelpCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    cornerGeometry, 
    setCornerGeometry,
    activeWorkstation,
    setActiveWorkstation,
    activeCase,
    soundEnabled,
    toggleSound,
    panicWipe,
    setIsCaseManagerOpen,
    setIsQuickSearchOpen,
    setIsTourOpen
  } = useSueChef();

  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);

  const themes: { id: ThemeId; name: string; desc: string; color: string }[] = [
    { id: 'chambers-onyx', name: 'Chambers Onyx', desc: 'Midnight Justice & Gold Leaf', color: '#D4AF37' },
    { id: 'parchment-ink', name: 'Parchment & Ink', desc: 'Editorial High-Contrast Light Mode', color: '#854D0E' },
    { id: 'legal-slate', name: 'Legal Slate & Cobalt', desc: 'Federal Court Admiralty Navy', color: '#38BDF8' },
    { id: 'emerald-chancery', name: 'Emerald Chancery', desc: 'British Chancery Racing Green', color: '#10B981' },
    { id: 'cyber-tribunal', name: 'Cyber Tribunal', desc: 'Tactical Matrix Terminal Dark', color: '#34D399' },
  ];

  const workstations: { id: WorkstationId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'claim-kitchen', label: 'Claim Kitchen', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'pleading-builder', label: '28-Line Pleading', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'discovery-studio', label: 'Discovery Studio', icon: <FolderSearch className="w-3.5 h-3.5" />, badge: '30D' },
    { id: 'trial-prep', label: 'Trial & Hearing Prep', icon: <Gavel className="w-3.5 h-3.5" />, badge: 'Sim' },
    { id: 'settlement-matrix', label: 'Settlement Matrix', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'evidence-locker', label: 'Evidence Locker', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: 'SHA256' },
    { id: 'sol-watcher', label: 'SOL Docket', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'service-tracker', label: 'Service & Proof', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'legalese-decoder', label: 'Legalese Decoder', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'attorney-dossier', label: 'Counsel Dossier', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'security-vault', label: 'Security Vault', icon: <Lock className="w-3.5 h-3.5" />, badge: 'AES' }
  ];

  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] sticky top-0 z-40 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 space-y-2">
        {/* Top Tier: Branding, Case Switcher, Global Tools */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <AluLogo size="md" showLabel={true} />
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] custom-geometry font-bold">
                PRO SE CIVIL SUITE
              </span>
            </div>
          </div>

          {/* Center: Active Dispute Switcher & Search Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsCaseManagerOpen(true);
              }}
              className="btn-geom flex items-center gap-2 px-3 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-all shadow-sm"
              title="Switch or create legal dispute cases"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-bold text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
                  {activeCase.title}
                </span>
                <span className="text-[9px] font-mono text-[var(--text-muted)]">
                  {activeCase.state} • {activeCase.claimEvaluation.category.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </button>

            {/* Quick Search Shortcut */}
            <button
              onClick={() => {
                sound.playClick();
                setIsQuickSearchOpen(true);
              }}
              className="btn-geom hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-all"
              title="Global Legal Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Search Blueprints...</span>
              <kbd className="text-[9px] font-mono bg-[var(--bg-secondary)] px-1.5 py-0.5 border border-[var(--border-color)] text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Tools: Tour, Sound, Geometry, Theme, Panic */}
          <div className="flex items-center gap-1.5">
            {/* Spotlight Tour Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIsTourOpen(true);
              }}
              className="btn-geom flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-black transition-all font-semibold"
              title="Launch Guided Feature Tour"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">Tour</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`btn-geom p-1.5 border transition-all ${
                soundEnabled 
                  ? 'bg-[var(--badge-bg)] border-[var(--badge-border)] text-[var(--accent-gold)]' 
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] opacity-60'
              }`}
              title={soundEnabled ? 'Acoustic feedback enabled' : 'Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Corner Geometry Switcher */}
            <button
              onClick={() => {
                const nextGeom: CornerGeometry = 
                  cornerGeometry === 'sharp' ? 'chamfer' : cornerGeometry === 'chamfer' ? 'smooth' : 'sharp';
                setCornerGeometry(nextGeom);
              }}
              className="btn-geom hidden sm:flex items-center gap-1 px-2 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
              title={`Corner Geometry: ${cornerGeometry.toUpperCase()}`}
            >
              <Shapes className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span className="uppercase text-[10px] font-mono font-semibold">{cornerGeometry}</span>
            </button>

            {/* Theme Palette Modal */}
            <button
              onClick={() => {
                sound.playClick();
                setShowThemeModal(true);
              }}
              className="btn-geom p-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
              title="Switch Theme Palette"
            >
              <Palette className="w-4 h-4 text-[var(--accent-gold)]" />
            </button>

            {/* Panic Shredder */}
            <button
              onClick={() => {
                sound.playWarningBell();
                setShowPanicConfirm(true);
              }}
              className="btn-geom flex items-center gap-1 px-2 py-1.5 text-xs font-semibold bg-rose-950/70 border border-rose-600/50 text-rose-300 hover:bg-rose-900/90 transition-all"
              title="Panic Button: Instantly purge all local data with cryptographic noise"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline font-mono">Panic</span>
            </button>
          </div>
        </div>

        {/* Workstation Tab Bar (Scrollable horizontally) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none pt-1 border-t border-[var(--border-color)]/60">
          {workstations.map(ws => {
            const isActive = activeWorkstation === ws.id;
            return (
              <button
                key={ws.id}
                onClick={() => setActiveWorkstation(ws.id)}
                className={`tab-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive 
                    ? 'bg-[var(--accent-gold)] text-slate-950 font-bold border-[var(--accent-gold)] shadow-sm' 
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'
                }`}
              >
                {ws.icon}
                <span>{ws.label}</span>
                {ws.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                    isActive ? 'bg-black/20 text-slate-950' : 'bg-[var(--bg-primary)] text-[var(--accent-gold)] border border-[var(--border-color)]'
                  }`}>
                    {ws.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="card-geom bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-[var(--accent-gold)]" />
                <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                  Chambers Theme Palette
                </h3>
              </div>
              <button 
                onClick={() => setShowThemeModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setShowThemeModal(false);
                  }}
                  className={`w-full card-geom flex items-center justify-between p-3.5 border text-left transition-all ${
                    theme === t.id 
                      ? 'border-[var(--accent-gold)] bg-[var(--badge-bg)] ring-1 ring-[var(--accent-gold)]' 
                      : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <div>
                      <div className="font-semibold text-sm text-[var(--text-main)]">{t.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{t.desc}</div>
                    </div>
                  </div>
                  {theme === t.id && (
                    <span className="text-xs font-mono font-bold text-[var(--accent-gold)] px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--accent-gold)]/40 rounded">
                      ACTIVE
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Panic Wipe Confirmation Modal */}
      {showPanicConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-geom bg-rose-950 border-2 border-rose-600 max-w-md w-full p-6 shadow-2xl text-rose-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8 flex-shrink-0 animate-pulse" />
              <div>
                <h3 className="font-bold text-lg text-white">CRYPTOGRAPHIC PANIC SHRED</h3>
                <p className="text-xs text-rose-300">Irreversible Local Data Obliteration</p>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed text-rose-200">
              This will immediately overwrite all IndexedDB records, evidence hashes, draft pleadings, and local encryption keys with cryptographic random noise, then permanently purge local storage.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPanicConfirm(false)}
                className="btn-geom px-4 py-2 text-xs font-semibold bg-rose-900/60 border border-rose-700 text-rose-200 hover:bg-rose-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowPanicConfirm(false);
                  await panicWipe();
                }}
                className="btn-geom px-4 py-2 text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-900/50"
              >
                CONFIRM IRREVERSIBLE PURGE
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
