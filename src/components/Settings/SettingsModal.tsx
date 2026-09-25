import React from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { CountryCode, ThemeId, CornerGeometry, FontSizeScale } from '../../types';
import { SUPPORTED_COUNTRIES } from '../../services/countries';
import { STATE_JURISDICTIONS } from '../../services/jurisdictions';
import { sound } from '../../services/soundEngine';
import { AluLogo } from '../Branding/AluLogo';
import { 
  Settings, 
  Globe, 
  Type, 
  Palette, 
  Volume2, 
  VolumeX, 
  Shapes, 
  Download, 
  Upload, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  FileCheck
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    country,
    setCountry,
    fontSizeScale,
    setFontSizeScale,
    theme,
    setTheme,
    cornerGeometry,
    setCornerGeometry,
    soundEnabled,
    toggleSound,
    isMuted,
    toggleMute,
    activeCase,
    updateActiveCase,
    exportCaseBundle,
    importCaseBundle,
    panicWipe
  } = useSueChef();

  if (!isSettingsOpen) return null;

  const themes: { id: ThemeId; name: string; desc: string; color: string }[] = [
    { id: 'chambers-onyx', name: 'Chambers Onyx', desc: 'Midnight Justice & Gold Leaf', color: '#D4AF37' },
    { id: 'parchment-ink', name: 'Parchment & Ink', desc: 'Editorial High-Contrast Light Mode', color: '#854D0E' },
    { id: 'legal-slate', name: 'Legal Slate & Cobalt', desc: 'Federal Court Admiralty Navy', color: '#38BDF8' },
    { id: 'emerald-chancery', name: 'Emerald Chancery', desc: 'British Chancery Racing Green', color: '#10B981' },
    { id: 'cyber-tribunal', name: 'Cyber Tribunal', desc: 'Tactical Matrix Terminal Dark', color: '#34D399' },
  ];

  const handleCountrySelect = (c: CountryCode) => {
    sound.playClick();
    setCountry(c);
    updateActiveCase(prev => ({ ...prev, country: c }));
  };

  const handleStateSelect = (st: string) => {
    sound.playClick();
    updateActiveCase(prev => ({ ...prev, state: st }));
  };

  const handleExport = () => {
    sound.playDocketStamp();
    const jsonStr = exportCaseBundle();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCase.title.replace(/\s+/g, '_')}_backup.suechef`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importCaseBundle(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-2xl w-full max-h-[90vh] flex flex-col custom-geometry shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <AluLogo size="md" showLabel={true} />
            <div className="pl-2 border-l border-[var(--border-color)]">
              <h2 className="text-base font-bold font-serif text-[var(--text-main)]">
                Application Settings & Jurisdiction
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Configure country laws, typography size & privacy
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsSettingsOpen(false);
            }}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] custom-geometry hover:bg-[var(--bg-hover)]"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[var(--text-main)]">
          {/* Section 1: Country & Jurisdiction */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-gold)]">
              <Globe className="w-4 h-4" />
              <span>1. Country Jurisdiction & Applicable Laws</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUPPORTED_COUNTRIES.map(c => (
                <button
                  key={c.code}
                  onClick={() => handleCountrySelect(c.code)}
                  className={`p-3 border custom-geometry text-left transition-all flex items-center justify-between ${
                    country === c.code
                      ? 'bg-[var(--badge-bg)] border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{c.flag}</span>
                    <div>
                      <div className="text-xs font-bold font-serif text-[var(--text-main)]">{c.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">
                        Limit: {c.currencySymbol}{c.defaultLimit.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {country === c.code && (
                    <span className="text-[10px] font-mono font-bold text-[var(--accent-gold)] px-1.5 py-0.5 bg-[var(--bg-card)] border border-[var(--accent-gold)]/40 rounded">
                      ACTIVE
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* US State Selector if USA selected */}
            {country === 'US' && (
              <div className="pt-2 space-y-1.5">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>Select Specific US State Jurisdiction:</span>
                </label>
                <select
                  value={activeCase.state}
                  onChange={(e) => handleStateSelect(e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-xs font-semibold focus:border-[var(--accent-gold)] outline-none"
                >
                  {Object.keys(STATE_JURISDICTIONS).map(st => (
                    <option key={st} value={st}>
                      {STATE_JURISDICTIONS[st].stateName} ({st}) • Small Claims Limit: ${STATE_JURISDICTIONS[st].smallClaimsLimitIndividual.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section 2: Font Size & Accessibility */}
          <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-gold)]">
              <Type className="w-4 h-4" />
              <span>2. Text Font Size & Readability Scale</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'normal', label: 'Standard', desc: 'Default Compact' },
                { id: 'large', label: 'Large (18px)', desc: 'Mobile / Tablet Friendly' },
                { id: 'xlarge', label: 'Extra Large (21px)', desc: 'Senior / High Visibility' }
              ].map(sz => (
                <button
                  key={sz.id}
                  onClick={() => {
                    sound.playClick();
                    setFontSizeScale(sz.id as FontSizeScale);
                  }}
                  className={`p-3 border custom-geometry text-left transition-all ${
                    fontSizeScale === sz.id
                      ? 'bg-[var(--badge-bg)] border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="text-xs font-bold font-serif text-[var(--text-main)]">{sz.label}</div>
                  <div className="text-[10px] text-[var(--text-muted)] pt-0.5">{sz.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Visual Theme Palette */}
          <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-gold)]">
              <Palette className="w-4 h-4" />
              <span>3. Chambers Theme Palette</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    sound.playClick();
                    setTheme(t.id);
                  }}
                  className={`p-2.5 border custom-geometry flex items-center justify-between text-left transition-all ${
                    theme === t.id
                      ? 'bg-[var(--badge-bg)] border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="text-xs font-semibold text-[var(--text-main)]">{t.name}</span>
                  </div>
                  {theme === t.id && (
                    <span className="text-[10px] font-mono font-bold text-[var(--accent-gold)]">ACTIVE</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Interface & Acoustic Preferences */}
          <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-gold)]">
              <Sparkles className="w-4 h-4" />
              <span>4. Interface, Audio & Device Controls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Primary Master Audio Mute Toggle */}
              <button
                onClick={() => {
                  toggleMute();
                }}
                className={`p-3 border custom-geometry flex items-center justify-between text-left transition-all ${
                  isMuted
                    ? 'bg-rose-500/10 border-rose-500/60 ring-1 ring-rose-500/40'
                    : 'bg-[var(--badge-bg)] border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]'
                }`}
                title="Master toggle to mute all procedural sound synthesis"
              >
                <div className="flex items-center gap-2.5">
                  {isMuted ? (
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <VolumeX className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent-gold)]">
                      <Volume2 className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold font-serif text-[var(--text-main)]">
                      {isMuted ? 'All Sounds Muted' : 'Acoustic Sound Synthesizer'}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {isMuted ? 'Muted (Zero Gavels, Stamps or Clicks)' : 'Active (Gavel strike, docket stamp, warning bells)'}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 custom-geometry ${
                  isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/40'
                }`}>
                  {isMuted ? 'MUTED' : 'ACTIVE'}
                </span>
              </button>

              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shapes className="w-4 h-4 text-[var(--accent-gold)]" />
                  <div>
                    <div className="text-xs font-bold font-serif text-[var(--text-main)]">Corner Geometry</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">{cornerGeometry} styling</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {(['sharp', 'chamfer', 'smooth'] as CornerGeometry[]).map(geom => (
                    <button
                      key={geom}
                      onClick={() => { sound.playClick(); setCornerGeometry(geom); }}
                      className={`px-2 py-1 text-[10px] font-mono uppercase font-bold border transition-all ${
                        cornerGeometry === geom
                          ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)]'
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {geom}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Data Privacy, Backups & Emergency Wipe */}
          <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-gold)]">
              <ShieldCheck className="w-4 h-4" />
              <span>5. Encrypted Backup & Data Purge</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] custom-geometry text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-all"
              >
                <Download className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Export Backup (.suechef)</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] custom-geometry text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-all cursor-pointer">
                <Upload className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Restore Backup File</span>
                <input
                  type="file"
                  accept=".suechef,.json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Panic Wipe Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (window.confirm('⚠️ WARNING: Are you sure you want to permanently purge all local cases, evidence, and cached legal documents? This cannot be undone.')) {
                    sound.playWarningBell();
                    panicWipe();
                    setIsSettingsOpen(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 p-3 bg-rose-950/40 border border-rose-600/40 text-rose-300 hover:bg-rose-900/60 custom-geometry text-xs font-bold transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Panic Purge: Erase All Local Data & Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] flex items-center justify-between">
          <div className="text-[10px] font-mono text-[var(--text-muted)]">
            SueChef Pro v2.0 • 100% Client-Side WebCrypto
          </div>
          <button
            onClick={() => {
              sound.playSuccessChime();
              setIsSettingsOpen(false);
            }}
            className="px-5 py-2 bg-[var(--accent-gold)] text-slate-950 text-xs font-bold custom-geometry hover:opacity-90 transition-all shadow-sm"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
