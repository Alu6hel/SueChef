import React, { useState, useEffect } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { CountryCode } from '../../types';
import { SUPPORTED_COUNTRIES } from '../../services/countries';
import { STATE_JURISDICTIONS } from '../../services/jurisdictions';
import { sound } from '../../services/soundEngine';
import { AluLogo } from '../Branding/AluLogo';
import { Globe, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LocationOnboardingModal: React.FC = () => {
  const { country, setCountry, activeCase, updateActiveCase } = useSueChef();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
  const [selectedState, setSelectedState] = useState<string>('CA');

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('suechef_onboarded_location');
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleFinishOnboarding = () => {
    sound.playSuccessChime();
    setCountry(selectedCountry);
    updateActiveCase(prev => ({
      ...prev,
      country: selectedCountry,
      state: selectedCountry === 'US' ? selectedState : prev.state
    }));
    localStorage.setItem('suechef_onboarded_location', 'true');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] ring-4 ring-[var(--accent-gold)]/20 max-w-lg w-full p-6 md:p-8 custom-geometry shadow-2xl space-y-6 text-[var(--text-main)]">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <AluLogo size="lg" showLabel={true} className="justify-center" />
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)] pt-2">
            Welcome to SueChef Pro
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
            Civil laws, small claims damage ceilings, and statutory notice deadlines vary significantly by jurisdiction. Select your location to calibrate your legal algorithms.
          </p>
        </div>

        {/* Country Grid */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase font-bold text-[var(--accent-gold)] flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            <span>Select Your Country:</span>
          </label>

          <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
            {SUPPORTED_COUNTRIES.map(c => (
              <button
                key={c.code}
                onClick={() => {
                  sound.playClick();
                  setSelectedCountry(c.code);
                }}
                className={`p-3 border custom-geometry text-left transition-all flex items-center gap-2.5 ${
                  selectedCountry === c.code
                    ? 'bg-[var(--badge-bg)] border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <span className="text-xl">{c.flag}</span>
                <div>
                  <div className="text-xs font-bold text-[var(--text-main)]">{c.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">{c.currencyCode}</div>
                </div>
              </button>
            ))}
          </div>

          {/* US State Selector if USA */}
          {selectedCountry === 'US' && (
            <div className="pt-2 space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-[var(--accent-gold)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Select Your US State:</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  sound.playClick();
                  setSelectedState(e.target.value);
                }}
                className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-xs font-semibold focus:border-[var(--accent-gold)] outline-none"
              >
                {Object.keys(STATE_JURISDICTIONS).map(st => (
                  <option key={st} value={st}>
                    {STATE_JURISDICTIONS[st].stateName} ({st}) - Limit ${STATE_JURISDICTIONS[st].smallClaimsLimitIndividual.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Privacy Assurance & Action Button */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Client-Side Privacy: Your location never leaves your device.</span>
          </div>

          <button
            onClick={handleFinishOnboarding}
            className="w-full py-3 bg-[var(--accent-gold)] text-slate-950 font-bold text-sm custom-geometry hover:opacity-90 flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>Calibrate & Start Legal Preparation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
