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
  Info,
  DollarSign,
  HelpCircle,
  Copy,
  BookOpen
} from 'lucide-react';

export const LegalServicesHub: React.FC = () => {
  const { country, setCountry, activeCase, updateActiveCase } = useSueChef();
  const [selectedState, setSelectedState] = useState<string>(activeCase.state || 'CA');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'directory' | 'fee_waiver' | 'state_rules'>('directory');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Fee Waiver Screener States
  const [householdSize, setHouseholdSize] = useState<number>(1);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(1800);
  const [receivesBenefits, setReceivesBenefits] = useState<{
    ssi: boolean;
    snap: boolean;
    medicaid: boolean;
    tanf: boolean;
  }>({
    ssi: false,
    snap: false,
    medicaid: false,
    tanf: false
  });

  const currCountryInfo = getCountryInfo(country);
  const currentJur = STATE_JURISDICTIONS[selectedState] || STATE_JURISDICTIONS['CA'];

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

  const handleCopyPhone = (phone: string) => {
    sound.playClick();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Federal Poverty Guideline 2026 approximation (125% limit ~ $1,560 base + $540/additional member)
  const monthlyPovertyThreshold = 1560 + ((householdSize - 1) * 540);
  const hasQualifyingBenefits = receivesBenefits.ssi || receivesBenefits.snap || receivesBenefits.medicaid || receivesBenefits.tanf;
  const isIncomeEligible = monthlyIncome <= monthlyPovertyThreshold;
  const isLikelyFeeWaiverEligible = hasQualifyingBenefits || isIncomeEligible;

  const getFeeWaiverFormCode = (stateCode: string) => {
    switch (stateCode) {
      case 'CA': return 'Form FW-001 (Request to Waive Court Fees) & FW-003 (Order)';
      case 'NY': return 'Form CPLR § 1101 (Poor Person Relief Application)';
      case 'TX': return 'Statement of Inability to Afford Payment of Court Costs (Texas Rule 145)';
      case 'FL': return 'Application for Determination of Civil Indigent Status (F.S. 57.082)';
      case 'IL': return 'Application for Waiver of Court Fees (Supreme Court Rule 298)';
      case 'PA': return 'In Forma Pauperis (IFP) Petition (Pa.R.C.P. No. 240)';
      case 'OH': return 'Financial Disclosure & Poverty Affidavit (R.C. 2323.31)';
      case 'GA': return 'Pauper’s Affidavit (O.C.G.A. § 9-15-2)';
      case 'NC': return 'Petition to Sue as an Indigent (Form AOC-G-106)';
      case 'WA': return 'Motion and Declaration for Waiver of Civil Fees (GR 34)';
      case 'MA': return 'Affidavit of Indigency (M.G.L. c. 261 § 27B)';
      default: return 'In Forma Pauperis (IFP) Court Fee Exemption Application';
    }
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

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-[var(--border-color)] pb-4">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('directory');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
              activeTab === 'directory'
                ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Legal Aid Directory ({filteredServices.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('fee_waiver');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
              activeTab === 'fee_waiver'
                ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Fee Waiver (In Forma Pauperis) Screener</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('state_rules');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
              activeTab === 'state_rules'
                ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{selectedState} Court Rules & Limits</span>
          </button>
        </div>

        {/* Country & State Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
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

          {/* State Selector */}
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
          {activeTab === 'directory' && (
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
          )}

          {/* Search Box */}
          {activeTab === 'directory' && (
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
          )}
        </div>
      </div>

      {/* Tab 1: Directory Cards Grid */}
      {activeTab === 'directory' && (
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
                        <div className="flex items-center justify-between pt-1 text-emerald-400 font-semibold">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{svc.phone}</span>
                          </div>
                          <button
                            onClick={() => handleCopyPhone(svc.phone!)}
                            className="text-[10px] text-[var(--accent-gold)] hover:underline flex items-center gap-1 font-mono"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedPhone === svc.phone ? 'Copied!' : 'Copy'}</span>
                          </button>
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
      )}

      {/* Tab 2: Interactive Fee Waiver (In Forma Pauperis) Screener */}
      {activeTab === 'fee_waiver' && (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 md:p-8 custom-geometry space-y-6 shadow-xl">
          <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
            <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
              Court Fee Waiver & In Forma Pauperis (IFP) Eligibility Screener
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              In every US jurisdiction, litigants with low-to-moderate income or receiving public assistance are entitled to have court filing and service fees 100% waived by the judge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs Column */}
            <div className="space-y-4 bg-[var(--bg-secondary)] p-5 custom-geometry border border-[var(--border-color)]">
              <h3 className="font-serif font-bold text-base text-[var(--text-main)] border-b border-[var(--border-color)] pb-2">
                Household & Income Details
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-muted)] font-bold uppercase">
                  Household Size (Including Yourself)
                </label>
                <select
                  value={householdSize}
                  onChange={e => setHouseholdSize(parseInt(e.target.value))}
                  className="w-full p-2 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-[var(--text-muted)] uppercase font-bold">Total Gross Monthly Income:</span>
                  <span className="font-mono font-bold text-[var(--accent-gold)]">${monthlyIncome.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6000"
                  step="50"
                  value={monthlyIncome}
                  onChange={e => setMonthlyIncome(parseInt(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
                <div className="text-[10px] font-mono text-[var(--text-muted)]">
                  Statutory 125% Poverty Ceiling for {householdSize} {householdSize === 1 ? 'person' : 'people'}: ~${monthlyPovertyThreshold.toLocaleString()} / mo
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                <span className="text-xs font-mono text-[var(--text-muted)] font-bold uppercase block">
                  Do you currently receive any of these benefits?
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <label className="flex items-center gap-2 p-2 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry cursor-pointer">
                    <input
                      type="checkbox"
                      checked={receivesBenefits.ssi}
                      onChange={e => setReceivesBenefits(prev => ({ ...prev, ssi: e.target.checked }))}
                      className="accent-[var(--accent-gold)]"
                    />
                    <span>SSI / SSDI</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry cursor-pointer">
                    <input
                      type="checkbox"
                      checked={receivesBenefits.snap}
                      onChange={e => setReceivesBenefits(prev => ({ ...prev, snap: e.target.checked }))}
                      className="accent-[var(--accent-gold)]"
                    />
                    <span>SNAP / Food Stamps</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry cursor-pointer">
                    <input
                      type="checkbox"
                      checked={receivesBenefits.medicaid}
                      onChange={e => setReceivesBenefits(prev => ({ ...prev, medicaid: e.target.checked }))}
                      className="accent-[var(--accent-gold)]"
                    />
                    <span>Medicaid / Medi-Cal</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry cursor-pointer">
                    <input
                      type="checkbox"
                      checked={receivesBenefits.tanf}
                      onChange={e => setReceivesBenefits(prev => ({ ...prev, tanf: e.target.checked }))}
                      className="accent-[var(--accent-gold)]"
                    />
                    <span>TANF / CalWORKs</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="bg-[var(--bg-secondary)] p-6 custom-geometry border border-[var(--border-color)] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold">
                  Screener Determination for {selectedState}:
                </span>

                <div className={`p-4 custom-geometry border space-y-2 ${
                  isLikelyFeeWaiverEligible 
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' 
                    : 'bg-amber-950/30 border-amber-500/50 text-amber-300'
                }`}>
                  <div className="flex items-center gap-2 font-bold font-serif text-base">
                    {isLikelyFeeWaiverEligible ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>Highly Likely Eligible for 100% Fee Waiver</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-5 h-5 text-amber-400" />
                        <span>May Require Judge Discretion / Partial Waiver</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed font-sans text-slate-200">
                    {isLikelyFeeWaiverEligible
                      ? `Based on your ${hasQualifyingBenefits ? 'public benefit enrollment' : `monthly income under 125% FPL ($${monthlyIncome}/mo)`}, court clerks in ${selectedState} are mandated to grant complete waiver of initial filing fees and jury fees.`
                      : `Your stated income ($${monthlyIncome}/mo) exceeds standard categorical guidelines, but you may still petition the judge under economic hardship by showing monthly living expenses.`}
                  </p>
                </div>

                <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-1.5 font-mono text-xs">
                  <div className="text-[10px] text-[var(--accent-gold)] uppercase font-bold">Required Official Form:</div>
                  <div className="font-bold text-[var(--text-main)]">{getFeeWaiverFormCode(selectedState)}</div>
                  <div className="text-[11px] text-[var(--text-muted)] pt-1">
                    Submit this form to the court clerk simultaneously with your initial complaint or claim.
                  </div>
                </div>
              </div>

              <a
                href={filteredServices.find(s => s.subdivision === selectedState || s.subdivision === 'National')?.websiteUrl || 'https://www.lawhelp.org'}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 custom-geometry hover:opacity-90"
              >
                <span>Download {selectedState} Court Fee Waiver Forms</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: State Court Rules Cheatsheet */}
      {activeTab === 'state_rules' && (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 md:p-8 custom-geometry space-y-6 shadow-xl">
          <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
            <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
              {currentJur.stateName} ({selectedState}) Small Claims Statutory Cheatsheet
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Key procedural benchmarks, statutory limits, and attorney rules for self-represented litigants in {selectedState}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">Jurisdictional Limit</span>
              <div className="text-2xl font-extrabold font-mono text-[var(--accent-gold)]">
                ${currentJur.smallClaimsLimitIndividual.toLocaleString()}
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Maximum claim amount for individuals. Corporate limit: ${currentJur.smallClaimsLimitCorporate?.toLocaleString() || currentJur.smallClaimsLimitIndividual.toLocaleString()}.
              </p>
            </div>

            <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">Bad Faith Multiplier</span>
              <div className="text-2xl font-extrabold font-mono text-[var(--accent-gold)]">
                {currentJur.securityDepositBadFaithPenaltyMultiplier || 2}x Statutory Penalty
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {currentJur.securityDepositStatuteCitation || 'State landlord-tenant statute'} allows statutory punitive damages for bad-faith withholding.
              </p>
            </div>

            <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">Security Deposit Deadline</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">
                {currentJur.securityDepositReturnDays || 21} Days
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Landlords must return deposits or provide itemized deductions within this mandatory statutory window.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

