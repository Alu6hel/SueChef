import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { triggerHaptic } from '../../services/fileExport';
import { 
  Check, 
  Sparkles, 
  Crown, 
  Building2, 
  Scale, 
  ShieldCheck, 
  Zap, 
  X,
  CreditCard,
  FileCheck
} from 'lucide-react';

export const PricingTiersModal: React.FC = () => {
  const { isPricingModalOpen, setIsPricingModalOpen, activeCase } = useSueChef();
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'case' | 'annual'>('case');
  const [activatedTier, setActivatedTier] = useState<string>(() => {
    return localStorage.getItem('suechef_license_tier') || 'pro';
  });

  if (!isPricingModalOpen) return null;

  const handleSelectTier = (tierName: string) => {
    sound.playSuccessChime();
    triggerHaptic(40);
    setActivatedTier(tierName);
    localStorage.setItem('suechef_license_tier', tierName);
  };

  return (
    <div 
      id="modal-pricing-tiers" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] card-geom shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[var(--text-main)]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 card-geom bg-amber-500/10 border border-amber-500/30 text-[var(--accent-gold)]">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--accent-gold)] block">
                COMMERCIAL EDITIONS & LICENSING
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-main)]">
                SueChef Professional Litigation Tiers
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setIsPricingModalOpen(false);
            }}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-all"
            title="Close Pricing"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--text-main)]">
              Fair, Transparent Pricing for Pro Se Litigants & Businesses
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              100% offline-ready. Keep all work locally encrypted on your device. No hidden recurring lock-ins.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Free Tier */}
            <div className={`p-4 sm:p-5 border-2 card-geom flex flex-col justify-between transition-all ${
              activatedTier === 'free' ? 'border-[var(--accent-gold)] bg-amber-500/5' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[var(--text-muted)]">Free Tier</span>
                  <Scale className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif">$0</div>
                  <span className="text-[11px] text-[var(--text-muted)]">Always Free / Educational</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-main)]">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Legalese decoder & legal dictionary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Basic civil dispute checklist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>50-State small claims statutory limits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Basic fee waiver guidance</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTier('free')}
                className={`mt-6 w-full py-2 text-xs font-bold uppercase tracking-wider btn-geom border ${
                  activatedTier === 'free'
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-transparent text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--accent-gold)]'
                }`}
              >
                {activatedTier === 'free' ? 'Current Tier' : 'Select Free'}
              </button>
            </div>

            {/* Pro Litigant Tier (Popular) */}
            <div className={`p-4 sm:p-5 border-2 card-geom flex flex-col justify-between relative transition-all shadow-xl ${
              activatedTier === 'pro' ? 'border-[var(--accent-gold)] bg-amber-500/10' : 'border-[var(--accent-gold)]/60 bg-[var(--bg-secondary)]'
            }`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[var(--accent-gold)] text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider shadow">
                Most Popular for Court
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[var(--accent-gold)]">Pro Litigant</span>
                  <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif text-[var(--accent-gold)]">$49 <span className="text-xs text-[var(--text-muted)] font-normal">/case or $19.99/mo</span></div>
                  <span className="text-[11px] text-[var(--text-muted)]">Complete Legal Court Arsenal</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-main)]">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Full 28-Line Pleading Generator</strong> (California & Federal format)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Formal Demand Letters</strong> with pre-judgment statutory interest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>SHA-256 Evidence Hashing</strong> & FRE 901 chain-of-custody stamping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Master Attorney Dossier</strong> export & print</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Interactive Mock Hearing objection simulator</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTier('pro')}
                className={`mt-6 w-full py-2.5 text-xs font-bold uppercase tracking-wider btn-geom shadow ${
                  activatedTier === 'pro'
                    ? 'bg-[var(--accent-gold)] text-slate-950 font-extrabold'
                    : 'bg-[var(--accent-gold)] text-slate-950 hover:opacity-90'
                }`}
              >
                {activatedTier === 'pro' ? '✓ Pro Tier Active' : 'Activate Pro Litigant'}
              </button>
            </div>

            {/* Business / Landlord Tier */}
            <div className={`p-4 sm:p-5 border-2 card-geom flex flex-col justify-between transition-all ${
              activatedTier === 'business' ? 'border-[var(--accent-gold)] bg-amber-500/5' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[var(--text-muted)]">Business / Landlord</span>
                  <Building2 className="w-4 h-4 text-[var(--accent-gold)]" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif">$99 – $199 <span className="text-xs text-[var(--text-muted)] font-normal">/yr</span></div>
                  <span className="text-[11px] text-[var(--text-muted)]">Multi-Case Organization</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-main)]">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Unlimited Multi-Case Dashboard</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Security deposit recovery & accounting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Unpaid invoice & contractor demand tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Certified mail tracking log & USPS skip tracing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Zero-Knowledge AES-GCM Encrypted Vault backups</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTier('business')}
                className={`mt-6 w-full py-2 text-xs font-bold uppercase tracking-wider btn-geom border ${
                  activatedTier === 'business'
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-transparent text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--accent-gold)]'
                }`}
              >
                {activatedTier === 'business' ? '✓ Business Active' : 'Select Business Tier'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--text-muted)] font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Active Case: <strong>{activeCase.title}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsPricingModalOpen(false);
            }}
            className="btn-geom px-5 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] text-xs font-bold uppercase tracking-wider"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
