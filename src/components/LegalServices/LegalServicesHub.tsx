import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { CountryCode } from '../../types';
import { SUPPORTED_COUNTRIES, getCountryInfo, REAL_LEGAL_SERVICES } from '../../services/countries';
import { STATE_JURISDICTIONS } from '../../services/jurisdictions';
import { sound } from '../../services/soundEngine';
import { AluLogo } from '../Branding/AluLogo';
import { 
  Building, 
  ExternalLink, 
  Phone, 
  Globe, 
  ShieldCheck, 
  Search, 
  Filter, 
  MapPin, 
  Scale, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';

export const LegalServicesHub: React.FC = () => {
  const { country, setCountry, activeCase, updateActiveCase } = useSueChef();
  const [selectedState, setSelectedState] = useState<string>(activeCase.state || 'CA');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const currCountryInfo = getCountryInfo(country);

  const handleCountryChange = (newCountry: CountryCode) => {
    sound.playClick();
    setCountry(newCountry);
    updateActiveCase(prev => ({
      ...prev,
      country: newCountry
    }));
  };

  const handleStateChange = (newState: string) => {
    sound.playClick();
    setSelectedState(newState);
    updateActiveCase(prev => ({
      ...prev,
      state: newState
    }));
  };

  const filteredServices = REAL_LEGAL_SERVICES.filter(svc => {
    // Country match
    if (svc.country !== country && svc.country !== 'US') return false;
    if (svc.country === country) {
      if (svc.subdivision && svc.subdivision !== 'National' && svc.subdivision !== selectedState) {
        return false;
      }
    }

    // Category match
    if (categoryFilter !== 'all' && svc.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = svc.name.toLowerCase().includes(q);
      const matchDesc = svc.description.toLowerCase().includes(q);
      const matchNotes = svc.intakeNotes.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchNotes) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 md:p-8 custom-geometry shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <AluLogo size="md" showLabel={true} />
              <span className="px-3 py-1 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] font-mono text-xs font-bold uppercase rounded-full">
                Verified Legal Aid Network
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-[var(--text-main)] leading-tight">
              Real-Life Legal Services, Court Portals & Legal Aid
            </h1>
            <p className="text-sm md:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
              Connect directly with official court self-help centers, free legal aid societies, bar association lawyer referral hotlines, and small claims advisors in your jurisdiction.
            </p>
          </div>

          {/* Active Jurisdiction Badge */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 custom-geometry shrink-0 space-y-1 shadow-inner text-right">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase">Active Legal Venue</div>
            <div className="text-lg font-bold font-serif text-[var(--accent-gold)] flex items-center gap-2 justify-end">
              <span>{currCountryInfo.flag} {currCountryInfo.name}</span>
              {country === 'US' && <span>• {selectedState}</span>}
            </div>
            <div className="text-[11px] font-mono text-emerald-400">
              Small Claims Limit: {currCountryInfo.currencySymbol}{currCountryInfo.defaultLimit.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Country & State Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Country Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Select Country</span>
            </label>
            <select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value as CountryCode)}
              className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm font-semibold focus:border-[var(--accent-gold)] outline-none"
            >
              {SUPPORTED_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.currencyCode})
                </option>
              ))}
            </select>
          </div>

          {/* State / Province Selector (for US / Canada) */}
          {country === 'US' && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>US State Jurisdiction</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm font-semibold focus:border-[var(--accent-gold)] outline-none"
              >
                {Object.keys(STATE_JURISDICTIONS).map(st => (
                  <option key={st} value={st}>
                    {STATE_JURISDICTIONS[st].stateName} ({st}) - Limit ${STATE_JURISDICTIONS[st].smallClaimsLimitIndividual.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Service Category</span>
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm font-semibold focus:border-[var(--accent-gold)] outline-none"
            >
              <option value="all">All Real-Life Services</option>
              <option value="court_self_help">Court Self-Help Centers</option>
              <option value="legal_aid">Free Legal Aid Societies</option>
              <option value="small_claims_advisor">Small Claims Advisors</option>
              <option value="bar_referral">Bar Association Referrals</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Search Directory</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, topic..."
              className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none placeholder:text-[var(--text-muted)]"
            />
          </div>
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
            Verified Legal Organizations & Portals ({filteredServices.length} Results)
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Updated for 2026 Statutory Rules
          </span>
        </div>

        {filteredServices.length === 0 ? (
          <div className="p-12 text-center bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-3">
            <Info className="w-8 h-8 text-[var(--accent-gold)] mx-auto" />
            <div className="text-base font-bold text-[var(--text-main)]">No Services Match Your Search</div>
            <p className="text-sm text-[var(--text-muted)]">
              Try switching your category filter to "All Real-Life Services" or clear your search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredServices.map(svc => (
              <div
                key={svc.id}
                className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 custom-geometry space-y-4 shadow-sm hover:border-[var(--accent-gold)] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] rounded uppercase">
                        {svc.category.replace(/_/g, ' ')}
                      </span>
                      <h3 className="text-lg font-bold text-[var(--text-main)] font-serif pt-1 leading-snug">
                        {svc.name}
                      </h3>
                    </div>
                    {svc.isFree && (
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold shrink-0">
                        FREE
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {svc.description}
                  </p>

                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry text-xs text-[var(--text-main)] space-y-1.5 font-mono">
                    <div className="text-[10px] text-[var(--accent-gold)] uppercase font-bold">What to expect / intake:</div>
                    <div className="leading-relaxed">{svc.intakeNotes}</div>
                    {svc.phone && (
                      <div className="flex items-center gap-2 pt-1 text-emerald-400 font-semibold">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{svc.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)]/60 flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {svc.subdivision || 'National'}
                  </span>
                  <a
                    href={svc.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 custom-geometry hover:opacity-90 transition-all shadow-sm"
                  >
                    <span>Open Official Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
