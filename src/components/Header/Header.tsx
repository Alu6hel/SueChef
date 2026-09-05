import React from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { WorkstationId } from '../../types';
import { getCountryInfo } from '../../services/countries';
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
  Settings,
  Clock,
  Lightbulb,
  Building,
  Type
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    country,
    fontSizeScale,
    setFontSizeScale,
    activeWorkstation,
    setActiveWorkstation,
    activeCase,
    soundEnabled,
    toggleSound,
    panicWipe,
    setIsCaseManagerOpen,
    setIsQuickSearchOpen,
    setIsTourOpen,
    setIsSettingsOpen
  } = useSueChef();

  const currCountry = getCountryInfo(country);

  // Intuitive, plain-English numbered workstation tabs
  const workstations: { id: WorkstationId; stepNum: string; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'claim-kitchen', stepNum: '1', label: 'Build Case', icon: <Scale className="w-4 h-4" /> },
    { id: 'evidence-locker', stepNum: '2', label: 'Evidence & Proof', icon: <ShieldCheck className="w-4 h-4" />, badge: 'SHA256' },
    { id: 'pleading-builder', stepNum: '3', label: 'Court Papers', icon: <FileText className="w-4 h-4" /> },
    { id: 'settlement-matrix', stepNum: '4', label: 'Demand & Settle', icon: <Calculator className="w-4 h-4" /> },
    { id: 'second-opinion', stepNum: '5', label: 'Second Opinion', icon: <Lightbulb className="w-4 h-4" />, badge: 'AI' },
    { id: 'legal-services', stepNum: '6', label: 'Legal Aid & Courts', icon: <Building className="w-4 h-4" />, badge: 'Verified' },
    { id: 'discovery-studio', stepNum: '7', label: 'Request Evidence', icon: <FolderSearch className="w-4 h-4" /> },
    { id: 'trial-prep', stepNum: '8', label: 'Trial Prep', icon: <Gavel className="w-4 h-4" /> },
    { id: 'sol-watcher', stepNum: '9', label: 'SOL Docket', icon: <Clock className="w-4 h-4" /> },
    { id: 'service-tracker', stepNum: '10', label: 'Service & Proof', icon: <Clock className="w-4 h-4" /> },
    { id: 'legalese-decoder', stepNum: '11', label: 'Legal Decoder', icon: <Layers className="w-4 h-4" /> },
    { id: 'security-vault', stepNum: '12', label: 'Security Vault', icon: <Lock className="w-4 h-4" />, badge: 'AES' }
  ];

  return (
    <header className="border-b-2 border-[var(--border-color)] bg-[var(--bg-secondary)] sticky top-0 z-40 transition-colors shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 space-y-2.5">
        {/* Top Tier: Official Alu Brand, Case Switcher, Settings & Global Tools */}
        <div className="flex items-center justify-between gap-3">
          {/* Official Alu Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <AluLogo size="md" showLabel={true} />
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l-2 border-[var(--border-color)]">
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] custom-geometry font-bold tracking-wider">
                CIVIL DISPUTE SUITE
              </span>
            </div>
          </div>

          {/* Center: Active Dispute Switcher & Country Venue */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsCaseManagerOpen(true);
              }}
              className="btn-geom flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm bg-[var(--bg-card)] border-2 border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-all shadow-sm"
              title="Switch or create legal dispute cases"
            >
              <FolderGit2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
              <div className="flex flex-col text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold font-serif text-xs md:text-sm truncate max-w-[140px] sm:max-w-[220px]">
                    {activeCase.title}
                  </span>
                  <span className="text-xs">{currCountry.flag}</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--accent-gold)]">
                  {activeCase.state} • {activeCase.claimEvaluation.category.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </button>

            {/* Quick Search Shortcut */}
            <button
              onClick={() => {
                sound.playClick();
                setIsQuickSearchOpen(true);
              }}
              className="btn-geom hidden xl:flex items-center gap-2 px-3 py-2 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-all"
              title="Global Legal Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Search Blueprints...</span>
              <kbd className="text-[10px] font-mono bg-[var(--bg-secondary)] px-1.5 py-0.5 border border-[var(--border-color)] text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Tools: Tour, Settings, Sound, Font Scale, Panic */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Step-by-Step Tour Guide Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIsTourOpen(true);
              }}
              className="btn-geom flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all font-bold shadow-sm"
              title="Launch Step-by-Step Guided Tour"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="font-sans">How to Use (Tour)</span>
            </button>

            {/* Settings & Location Modal Launcher */}
            <button
              onClick={() => {
                sound.playClick();
                setIsSettingsOpen(true);
              }}
              className="btn-geom flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm bg-[var(--bg-card)] border-2 border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-all font-semibold"
              title="Open Location, Laws & Font Settings"
            >
              <Settings className="w-4 h-4 text-[var(--accent-gold)]" />
              <span className="hidden md:inline font-sans">Settings</span>
            </button>

            {/* Font Scale Quick Toggle */}
            <button
              onClick={() => {
                const nextScale = fontSizeScale === 'normal' ? 'large' : fontSizeScale === 'large' ? 'xlarge' : 'normal';
                setFontSizeScale(nextScale);
              }}
              className="btn-geom hidden sm:flex items-center gap-1 px-2.5 py-2 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
              title={`Text Size: ${fontSizeScale.toUpperCase()}`}
            >
              <Type className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span className="uppercase text-[10px] font-mono font-bold">{fontSizeScale}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`btn-geom p-2 border transition-all ${
                soundEnabled 
                  ? 'bg-[var(--badge-bg)] border-[var(--badge-border)] text-[var(--accent-gold)]' 
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] opacity-60'
              }`}
              title={soundEnabled ? 'Acoustic audio feedback enabled' : 'Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Panic Shredder */}
            <button
              onClick={() => {
                sound.playWarningBell();
                panicWipe();
              }}
              className="btn-geom flex items-center gap-1 px-2.5 py-2 text-xs font-bold bg-rose-950/70 border border-rose-600/50 text-rose-300 hover:bg-rose-900/90 transition-all"
              title="Panic Wipe: Instantly purge all local data"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xl:inline font-mono">Panic</span>
            </button>
          </div>
        </div>

        {/* Workstation Step Tabs Navigation Bar (Scrollable) */}
        <nav className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-none pt-1 border-t border-[var(--border-color)]/60">
          {workstations.map(ws => {
            const isActive = activeWorkstation === ws.id;
            return (
              <button
                key={ws.id}
                onClick={() => setActiveWorkstation(ws.id)}
                className={`tab-geom flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-bold whitespace-nowrap transition-all border-2 ${
                  isActive 
                    ? 'bg-[var(--accent-gold)] text-slate-950 font-extrabold border-[var(--accent-gold)] shadow-md' 
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)]/50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                  isActive ? 'bg-slate-950 text-amber-400' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                }`}>
                  {ws.stepNum}
                </div>
                {ws.icon}
                <span>{ws.label}</span>
                {ws.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                    isActive 
                      ? 'bg-slate-950/20 text-slate-950' 
                      : 'bg-[var(--bg-primary)] text-[var(--accent-gold)] border border-[var(--border-color)]'
                  }`}>
                    {ws.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
