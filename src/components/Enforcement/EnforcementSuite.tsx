import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { EnforcementEngine } from '../../services/enforcementEngine';
import { sound } from '../../services/soundEngine';
import { getCountryInfo } from '../../services/countries';
import { cleanPartyName, deriveCaseTitle } from '../../services/caseUtils';
import { AssetDiscoveryItem, WritOfExecution, JudgmentLienRecord } from '../../types';
import { 
  Gavel, 
  DollarSign, 
  ShieldCheck, 
  Building, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Printer, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Search, 
  Lock, 
  ChevronRight, 
  Calculator, 
  UserCheck, 
  Landmark, 
  Car, 
  Briefcase, 
  Home, 
  Layers, 
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

export const EnforcementSuite: React.FC = () => {
  const { 
    activeCase, 
    updateActiveCase, 
    updateEnforcementPlan, 
    country, 
    setActiveWorkstation 
  } = useSueChef();
  const countryInfo = getCountryInfo(country);

  const plan = activeCase.enforcement || EnforcementEngine.createDefaultPlan(activeCase);
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'interest_calc' | 'writ' | 'levy' | 'garnishment' | 'liens' | 'debtors_exam' | 'memo_costs'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New asset form state
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [assetTitle, setAssetTitle] = useState('');
  const [assetCategory, setAssetCategory] = useState<AssetDiscoveryItem['category']>('bank_account');
  const [assetInstitution, setAssetInstitution] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetDetails, setAssetDetails] = useState('');

  // Bank levy form state
  const [levyBankName, setLevyBankName] = useState('JPMorgan Chase Bank / Bank of America');
  const [levyBankAddress, setLevyBankAddress] = useState('Central Process & Legal Levies Department, P.O. Box 260161');

  // Debtor pay for garnishment
  const [debtorMonthlyPay, setDebtorMonthlyPay] = useState<number>(plan.garnishment?.debtorDisposableMonthlyPay || 4500);

  const p = activeCase.parties.find(x => x.role === 'plaintiff');
  const d = activeCase.parties.find(x => x.role === 'defendant');
  const pName = p ? cleanPartyName(p.name) : 'Plaintiff';
  const dName = d ? cleanPartyName(d.name) : 'Defendant';

  // Compute live interest and balance
  const interestStats = EnforcementEngine.calculateInterest(
    plan.awardedPrincipal,
    plan.statutoryInterestRate,
    plan.judgmentDate,
    plan.paymentsReceived,
    false
  );

  const netCollectibleBalance = Math.max(0, 
    plan.awardedPrincipal + plan.courtCosts + plan.postJudgmentCosts + interestStats.accruedInterest - plan.paymentsReceived
  );

  const garnishmentCalc = EnforcementEngine.calculateGarnishment(
    debtorMonthlyPay,
    netCollectibleBalance,
    25
  );

  const copyToClipboard = (text: string, key: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTitle.trim()) return;

    sound.playDocketStamp();
    const newAsset: AssetDiscoveryItem = {
      id: `asset_${Date.now()}`,
      title: assetTitle.trim(),
      category: assetCategory,
      institutionOrEmployer: assetInstitution.trim() || 'Verified Entity Record',
      estimatedValue: parseFloat(assetValue) || 1000,
      details: assetDetails.trim() || 'Identified through financial record investigation.',
      sourceOfInfo: 'Public records / party transaction history.',
      isVerified: true
    };

    updateEnforcementPlan({
      discoveredAssets: [...plan.discoveredAssets, newAsset]
    });

    setAssetTitle('');
    setAssetInstitution('');
    setAssetValue('');
    setAssetDetails('');
    setIsAddingAsset(false);
  };

  const handleDeleteAsset = (id: string) => {
    sound.playClick();
    updateEnforcementPlan({
      discoveredAssets: plan.discoveredAssets.filter(a => a.id !== id)
    });
  };

  const handleUpdatePayments = (amt: number) => {
    sound.playClick();
    updateEnforcementPlan({
      paymentsReceived: Math.max(0, amt)
    });
  };

  const handleUpdateInterestRate = (rate: number) => {
    sound.playClick();
    updateEnforcementPlan({
      statutoryInterestRate: Math.max(0, rate)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Workstation Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[var(--bg-card)] to-[var(--bg-secondary)] border-2 border-emerald-500/40 p-5 md:p-6 custom-geometry shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold custom-geometry flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                POST-JUDGMENT ENFORCEMENT &amp; DEBT RECOVERY SUITE
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {countryInfo.flag} {activeCase.state} Jurisdiction
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-[var(--text-main)]">
              Court Judgment Enforcement &amp; Asset Liquidation
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-muted)] max-w-2xl mt-1">
              Courts issue judgments, but they do not collect money for you. Execute writs, levy commercial bank accounts, garnish employer payroll, and cloud real estate titles until the debtor satisfies every dollar owed.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 custom-geometry min-w-[240px] text-right">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase tracking-wider">
              Net Collectible Balance
            </span>
            <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
              {countryInfo.currencySymbol}{netCollectibleBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] mt-1 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-[var(--accent-gold)]" />
              <span>+{countryInfo.currencySymbol}{interestStats.accruedInterest.toFixed(2)} statutory interest ({interestStats.daysElapsed} days)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: '1. Collection Roadmap', icon: Layers },
          { id: 'assets', label: `2. Asset Profiler (${plan.discoveredAssets.length})`, icon: Building },
          { id: 'interest_calc', label: '3. Interest Clock', icon: Calculator },
          { id: 'writ', label: '4. Writ of Execution', icon: FileText },
          { id: 'levy', label: '5. Bank Levy Notice', icon: Landmark },
          { id: 'garnishment', label: '6. Wage Garnishment', icon: Briefcase },
          { id: 'liens', label: '7. Real Property Lien', icon: Home },
          { id: 'debtors_exam', label: '8. Debtor Subpoena', icon: UserCheck },
          { id: 'memo_costs', label: '9. Memorandum of Costs (MC-012)', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { sound.playClick(); setActiveTab(tab.id as any); }}
              className={`px-3 py-2 text-xs font-mono font-bold custom-geometry whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] shadow-md'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & COLLECTION ROADMAP */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 custom-geometry space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Awarded Principal</span>
              <div className="text-xl font-bold font-mono text-[var(--text-main)]">
                {countryInfo.currencySymbol}{plan.awardedPrincipal.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Entered: {plan.judgmentDate}</span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 custom-geometry space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Statutory Court Costs</span>
              <div className="text-xl font-bold font-mono text-sky-400">
                {countryInfo.currencySymbol}{(plan.courtCosts + plan.postJudgmentCosts).toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Filing + Writ + Service costs</span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 custom-geometry space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Accrued Legal Interest</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                +{countryInfo.currencySymbol}{interestStats.accruedInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Accruing at {plan.statutoryInterestRate}%/year</span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 custom-geometry space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Payments Credited</span>
              <div className="text-xl font-bold font-mono text-amber-400">
                -{countryInfo.currencySymbol}{plan.paymentsReceived.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Direct partial payments</span>
            </div>
          </div>

          {/* Step-by-Step Enforcement Strategy */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-4">
            <h3 className="font-serif font-bold text-base text-[var(--text-main)] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>5-Step Statutory Judgment Collection Protocol</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                {
                  step: 'Step 1',
                  title: 'Asset Profiling',
                  desc: 'Search bank routing numbers from cashed checks, employer payroll info, and county property titles.',
                  tab: 'assets'
                },
                {
                  step: 'Step 2',
                  title: 'Writ Issuance',
                  desc: 'Obtain court-stamped Writ of Execution commanding sheriff/marshal to seize funds.',
                  tab: 'writ'
                },
                {
                  step: 'Step 3',
                  title: 'Bank Levy Freeze',
                  desc: 'Instruct sheriff to serve bank levy on debtor accounts; funds frozen within 24 hours.',
                  tab: 'levy'
                },
                {
                  step: 'Step 4',
                  title: 'Wage Garnishment',
                  desc: 'Garnish up to 25% of disposable paycheck each pay period until balance reaches zero.',
                  tab: 'garnishment'
                },
                {
                  step: 'Step 5',
                  title: 'Property Lien / Exam',
                  desc: 'Record Abstract of Judgment on real estate and subpoena debtor to testify under oath.',
                  tab: 'liens'
                }
              ].map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => { sound.playClick(); setActiveTab(s.tab as any); }}
                  className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] custom-geometry cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--accent-gold)] font-bold">{s.step}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-gold)] transition-colors" />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-[var(--text-main)]">{s.title}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSET PROFILER */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Debtor Asset Discovery &amp; Target Directory
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Identify accounts and property belonging to {dName} eligible for judicial seizure.
              </p>
            </div>
            <button
              onClick={() => { sound.playClick(); setIsAddingAsset(!isAddingAsset); }}
              className="px-3 py-1.5 bg-[var(--accent-gold)] text-slate-950 font-mono text-xs font-bold custom-geometry flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingAsset ? 'Cancel' : 'Add Discovered Asset'}</span>
            </button>
          </div>

          {isAddingAsset && (
            <form onSubmit={handleAddAsset} className="bg-[var(--bg-secondary)] border border-[var(--accent-gold)] p-4 custom-geometry space-y-3">
              <h4 className="font-serif font-bold text-sm text-[var(--accent-gold)]">Log Discovered Debtor Asset</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Asset Category</label>
                  <select
                    value={assetCategory}
                    onChange={e => setAssetCategory(e.target.value as any)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-main)] custom-geometry"
                  >
                    <option value="bank_account">Bank Checking / Savings</option>
                    <option value="employer_wage">Employer Payroll Wages</option>
                    <option value="real_property">Real Estate / House / Land</option>
                    <option value="vehicle">Motor Vehicle / Equipment</option>
                    <option value="business_entity">Business LLC / Franchise</option>
                    <option value="receivables">Accounts Receivable</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Asset Title / Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Commercial Operating Account"
                    value={assetTitle}
                    onChange={e => setAssetTitle(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-main)] custom-geometry"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Bank / Institution / Office</label>
                  <input
                    type="text"
                    placeholder="e.g., Bank of America, Downtown Branch"
                    value={assetInstitution}
                    onChange={e => setAssetInstitution(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-main)] custom-geometry"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Estimated Value ({countryInfo.currencySymbol})</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={assetValue}
                    onChange={e => setAssetValue(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-main)] custom-geometry"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Account / Address Notes</label>
                  <input
                    type="text"
                    placeholder="e.g., Routing 121000358 from rent deposit check"
                    value={assetDetails}
                    onChange={e => setAssetDetails(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-main)] custom-geometry"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAsset(false)}
                  className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--accent-gold)] text-slate-950 font-mono text-xs font-bold custom-geometry"
                >
                  Save Discovered Asset
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.discoveredAssets.map(asset => (
              <div key={asset.id} className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--badge-bg)] text-[var(--accent-gold)] uppercase font-bold border border-[var(--badge-border)]">
                    {asset.category.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="text-[var(--text-muted)] hover:text-rose-400 p-1"
                    title="Remove asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-serif font-bold text-sm text-[var(--text-main)]">{asset.title}</h4>
                <p className="text-xs text-[var(--text-muted)] font-mono">{asset.institutionOrEmployer}</p>
                <p className="text-xs text-[var(--text-main)] bg-[var(--bg-secondary)] p-2 custom-geometry border border-[var(--border-color)]">
                  {asset.details}
                </p>
                <div className="flex items-center justify-between pt-1 text-xs font-mono">
                  <span className="text-[var(--text-muted)]">Source: {asset.sourceOfInfo}</span>
                  <span className="font-bold text-emerald-400">{countryInfo.currencySymbol}{asset.estimatedValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INTEREST ACCRUAL CALCULATOR */}
      {activeTab === 'interest_calc' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-5">
          <div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              Statutory Post-Judgment Interest Engine
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Under civil law, judgments earn legal interest every single day from entry date until paid in full.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-2">
              <label className="text-xs font-mono text-[var(--text-muted)] block uppercase">Statutory Annual Rate (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={plan.statutoryInterestRate}
                  onChange={e => handleUpdateInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 text-base font-mono font-bold text-[var(--text-main)] custom-geometry"
                />
                <span className="text-xs font-mono text-[var(--text-muted)]">% per year</span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                California: 10% (CCP § 685.010) • New York: 9% (CPLR § 5004) • UK: 8% (Judgments Act)
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-2">
              <label className="text-xs font-mono text-[var(--text-muted)] block uppercase">Payments Received</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[var(--text-muted)]">{countryInfo.currencySymbol}</span>
                <input
                  type="number"
                  value={plan.paymentsReceived}
                  onChange={e => handleUpdatePayments(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 text-base font-mono font-bold text-amber-400 custom-geometry"
                />
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                Credit partial payments against interest first, then principal.
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-1">
              <span className="text-xs font-mono text-[var(--text-muted)] block uppercase">Daily Accrual Rate</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                +{countryInfo.currencySymbol}{(interestStats.dailyInterestRate * interestStats.currentPrincipalBalance).toFixed(2)}/day
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                {interestStats.daysElapsed} days elapsed since entry ({plan.judgmentDate})
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 custom-geometry flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase block">Current Grand Total With Interest</span>
              <span className="text-2xl font-mono font-bold text-[var(--text-main)]">
                {countryInfo.currencySymbol}{netCollectibleBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(
                `JUDGMENT ACCOUNTING:\nPrincipal: $${plan.awardedPrincipal.toFixed(2)}\nCosts: $${(plan.courtCosts + plan.postJudgmentCosts).toFixed(2)}\nInterest (${plan.statutoryInterestRate}% over ${interestStats.daysElapsed} days): $${interestStats.accruedInterest.toFixed(2)}\nPayments: -$${plan.paymentsReceived.toFixed(2)}\nTOTAL DUE: $${netCollectibleBalance.toFixed(2)}`,
                'interest_tally'
              )}
              className="px-4 py-2 bg-[var(--accent-gold)] text-slate-950 font-mono text-xs font-bold custom-geometry flex items-center gap-1.5"
            >
              {copiedKey === 'interest_tally' ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'interest_tally' ? 'Copied Itemization' : 'Copy Accounting Breakdown'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: WRIT OF EXECUTION GENERATOR */}
      {activeTab === 'writ' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Official Writ of Execution (Command to Levying Officer)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Take this court-ready document to the court clerk for issuance, then deliver to the Sheriff / Marshal.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const doc = EnforcementEngine.generateWritDocument(activeCase, plan);
                  copyToClipboard(doc, 'writ_doc');
                }}
                className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono font-bold custom-geometry flex items-center gap-1.5 hover:text-[var(--accent-gold)]"
              >
                {copiedKey === 'writ_doc' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'writ_doc' ? 'Copied' : 'Copy Text'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[var(--accent-gold)] text-slate-950 text-xs font-mono font-bold custom-geometry flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Writ</span>
              </button>
            </div>
          </div>

          <pre className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px]">
            {EnforcementEngine.generateWritDocument(activeCase, plan)}
          </pre>
        </div>
      )}

      {/* TAB 5: BANK LEVY NOTICE */}
      {activeTab === 'levy' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Third-Party Bank Levy Notice &amp; Account Attachment
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Freezes and garnishes all checking, savings, and deposit balances held by {dName}.
              </p>
            </div>
            <button
              onClick={() => {
                const doc = EnforcementEngine.generateBankLevyNotice(activeCase, plan, levyBankName, levyBankAddress);
                copyToClipboard(doc, 'levy_notice');
              }}
              className="px-3 py-1.5 bg-[var(--accent-gold)] text-slate-950 font-mono text-xs font-bold custom-geometry flex items-center gap-1.5"
            >
              {copiedKey === 'levy_notice' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'levy_notice' ? 'Copied Notice' : 'Copy Bank Notice'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Target Financial Institution</label>
              <input
                type="text"
                value={levyBankName}
                onChange={e => setLevyBankName(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-main)] custom-geometry font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Bank Legal Levies Address</label>
              <input
                type="text"
                value={levyBankAddress}
                onChange={e => setLevyBankAddress(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-main)] custom-geometry font-mono"
              />
            </div>
          </div>

          <pre className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[450px]">
            {EnforcementEngine.generateBankLevyNotice(activeCase, plan, levyBankName, levyBankAddress)}
          </pre>
        </div>
      )}

      {/* TAB 6: WAGE GARNISHMENT CALCULATOR */}
      {activeTab === 'garnishment' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-5">
          <div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              Earnings Withholding &amp; Wage Garnishment Calculator
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Calculates monthly paycheck deductions under federal Consumer Credit Protection Act (15 U.S.C. § 1673) 25% cap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-2">
              <label className="text-xs font-mono text-[var(--text-muted)] block uppercase">Debtor Disposable Monthly Pay</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[var(--text-muted)]">{countryInfo.currencySymbol}</span>
                <input
                  type="number"
                  value={debtorMonthlyPay}
                  onChange={e => setDebtorMonthlyPay(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 text-base font-mono font-bold text-[var(--text-main)] custom-geometry"
                />
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">Gross pay minus mandatory statutory tax withholdings.</p>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-1">
              <span className="text-xs font-mono text-[var(--text-muted)] block uppercase">Monthly Withholding Amount</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {countryInfo.currencySymbol}{garnishmentCalc.monthlyWithholdingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}/mo
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">Statutory maximum deducted from each paycheck</p>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-1">
              <span className="text-xs font-mono text-[var(--text-muted)] block uppercase">Time to Full Satisfaction</span>
              <div className="text-2xl font-bold font-mono text-[var(--accent-gold)]">
                {garnishmentCalc.estimatedMonthsToSatisfy} Months
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">To collect full {countryInfo.currencySymbol}{netCollectibleBalance.toFixed(2)} balance</p>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] p-4 border border-[var(--border-color)] custom-geometry space-y-2">
            <h4 className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase">Statutory Exemption Rules Applied</h4>
            {garnishmentCalc.exemptionsApplied.map((ex, i) => (
              <div key={i} className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: REAL PROPERTY LIEN (ABSTRACT OF JUDGMENT) */}
      {activeTab === 'liens' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Abstract of Judgment (Real Property Lien Recorder)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Record this document with the County Recorder to place an involuntary lien on all debtor real estate.
              </p>
            </div>
            <button
              onClick={() => {
                const doc = EnforcementEngine.generateAbstractOfJudgment(activeCase, plan);
                copyToClipboard(doc, 'abstract_lien');
              }}
              className="px-3 py-1.5 bg-[var(--accent-gold)] text-slate-950 font-mono text-xs font-bold custom-geometry flex items-center gap-1.5"
            >
              {copiedKey === 'abstract_lien' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'abstract_lien' ? 'Copied Abstract' : 'Copy Abstract of Judgment'}</span>
            </button>
          </div>

          <pre className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[450px]">
            {EnforcementEngine.generateAbstractOfJudgment(activeCase, plan)}
          </pre>
        </div>
      )}

      {/* TAB 8: ORDER FOR EXAMINATION OF DEBTOR */}
      {activeTab === 'debtors_exam' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              Order for Examination of Judgment Debtor (Debtor Subpoena)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Compel {dName} to appear in court under penalty of contempt with 12 months of financial records.
            </p>
          </div>

          <div className="space-y-3">
            {plan.examQuestions.map((q, idx) => (
              <div key={q.id} className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--accent-gold)] uppercase font-bold">
                    Question #{idx + 1} • {q.category}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-xs text-[var(--text-main)]">"{q.question}"</h4>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  Mandatory Subpoenaed Records: {q.expectedDocuments}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: MEMORANDUM OF COSTS AFTER JUDGMENT (MC-012) */}
      {activeTab === 'memo_costs' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Memorandum of Costs After Judgment &amp; Accrued Interest (MC-012)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Required statutory filing to formally claim post-judgment enforcement fees, writ costs, and accrued legal interest.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const doc = EnforcementEngine.generateMemorandumOfCostsAfterJudgment(activeCase, plan);
                  copyToClipboard(doc, 'memo_costs_doc');
                }}
                className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono font-bold custom-geometry flex items-center gap-1.5 hover:text-[var(--accent-gold)]"
              >
                {copiedKey === 'memo_costs_doc' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'memo_costs_doc' ? 'Copied' : 'Copy Text'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[var(--accent-gold)] text-slate-950 text-xs font-mono font-bold custom-geometry flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Memorandum</span>
              </button>
            </div>
          </div>

          <pre className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px]">
            {EnforcementEngine.generateMemorandumOfCostsAfterJudgment(activeCase, plan)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default EnforcementSuite;
