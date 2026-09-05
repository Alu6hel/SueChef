import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { 
  Scale, 
  Flame, 
  Hourglass, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Send, 
  Briefcase, 
  Lock, 
  Volume2, 
  VolumeX, 
  Palette, 
  Shapes, 
  AlertTriangle,
  DollarSign,
  Award,
  Sparkles
} from 'lucide-react';
import { ThemeId, CornerGeometry, WorkstationId } from '../../types';
import { sound } from '../../services/soundEngine';

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
    totalDamages,
    estimatedParalegalSavings
  } = useSueChef();

  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);

  const workstations: { id: WorkstationId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'claim-kitchen', label: 'Claim Kitchen', icon: <Flame className="w-4 h-4 text-amber-500" />, badge: `${activeCase.claimEvaluation.meritScore}%` },
    { id: 'sol-watcher', label: 'SOL Docket', icon: <Hourglass className="w-4 h-4 text-sky-400" /> },
    { id: 'pleading-builder', label: 'Pleadings & Demand', icon: <FileText className="w-4 h-4 text-emerald-400" /> },
    { id: 'evidence-locker', label: 'Evidence Locker', icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />, badge: `${activeCase.evidenceList.length}` },
    { id: 'legalese-decoder', label: 'Legalese Decoder', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
    { id: 'service-tracker', label: 'Process Service', icon: <Send className="w-4 h-4 text-teal-400" /> },
    { id: 'attorney-dossier', label: 'Attorney Hand-Off', icon: <Briefcase className="w-4 h-4 text-amber-400" />, badge: 'Save $5k' },
    { id: 'security-vault', label: 'Security Vault', icon: <Lock className="w-4 h-4 text-rose-400" /> },
  ];

  const themes: { id: ThemeId; name: string; desc: string; color: string }[] = [
    { id: 'chambers-onyx', name: 'Chambers Onyx', desc: 'Midnight obsidian with gold accents', color: '#D4AF37' },
    { id: 'parchment-ink', name: 'Parchment & Ink', desc: 'Warm ivory editorial paper mode', color: '#854D0E' },
    { id: 'legal-slate', name: 'Legal Slate & Cobalt', desc: 'Corporate navy slate with cyan', color: '#38BDF8' },
    { id: 'emerald-chancery', name: 'Emerald Chancery', desc: 'Deep racing green with brass', color: '#10B981' },
    { id: 'cyber-tribunal', name: 'Cyber Tribunal', desc: 'Tactical high-contrast terminal', color: '#34D399' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-3 py-2 transition-colors">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        
        {/* Brand & Active Case Info */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div 
              onClick={() => sound.playGavelStrike()}
              className="w-10 h-10 card-geom bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md group"
              title="Click to strike the Gavel"
            >
              <Scale className="w-5 h-5 text-[var(--accent-gold)] group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[var(--text-main)] tracking-wide">
                  SueChef
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 card-geom bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-semibold">
                  Zero-Cloud Offline
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate max-w-[240px] md:max-w-xs font-mono">
                {activeCase.title}
              </p>
            </div>
          </div>

          {/* Quick Metrics (Mobile visible) */}
          <div className="flex lg:hidden items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400">
              ${totalDamages.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Workstation Tab Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {workstations.map(ws => {
            const isActive = activeWorkstation === ws.id;
            return (
              <button
                key={ws.id}
                onClick={() => setActiveWorkstation(ws.id)}
                className={`tab-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive 
                    ? 'bg-[var(--accent-gold)] text-slate-950 font-bold border-[var(--accent-gold)] shadow-sm' 
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'
                }`}
              >
                {ws.icon}
                <span>{ws.label}</span>
                {ws.badge && (
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono font-bold ${
                    isActive ? 'bg-black/20 text-slate-950' : 'bg-[var(--bg-primary)] text-[var(--accent-gold)]'
                  }`}>
                    {ws.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {/* Audio Synthesizer Toggle */}
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
            className="btn-geom flex items-center gap-1 px-2 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
            title={`Corner Geometry: ${cornerGeometry.toUpperCase()}`}
          >
            <Shapes className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span className="uppercase text-[10px] font-mono font-semibold">{cornerGeometry}</span>
          </button>

          {/* Theme Palette Modal Button */}
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

          {/* Panic Shredder Button */}
          <button
            onClick={() => {
              sound.playWarningBell();
              setShowPanicConfirm(true);
            }}
            className="btn-geom flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-rose-950/60 border border-rose-600/40 text-rose-300 hover:bg-rose-900/80 transition-all"
            title="Panic Button: Instantly purge all local data with cryptographic noise"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline font-mono">Panic Shred</span>
          </button>
        </div>
      </div>

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[var(--accent-gold)]" />
                <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                  Chambers Theme Palette
                </h3>
              </div>
              <button 
                onClick={() => setShowThemeModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-bold"
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
                  className={`w-full card-geom flex items-center justify-between p-3 border text-left transition-all ${
                    theme === t.id 
                      ? 'border-[var(--accent-gold)] bg-[var(--badge-bg)]' 
                      : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.color }}
                    />
                    <div>
                      <div className="font-semibold text-sm text-[var(--text-main)]">{t.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{t.desc}</div>
                    </div>
                  </div>
                  {theme === t.id && (
                    <span className="text-xs font-mono font-bold text-[var(--accent-gold)]">ACTIVE</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Panic Wipe Confirmation Modal */}
      {showPanicConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
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
