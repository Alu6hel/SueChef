import React from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { DISPUTE_BLUEPRINTS } from '../../services/disputeTemplates';
import { getCountryInfo } from '../../services/countries';
import { STATE_JURISDICTIONS } from '../../services/jurisdictions';
import { sound } from '../../services/soundEngine';
import { AluLogo } from '../Branding/AluLogo';
import { DisputeIntakeWizard } from './DisputeIntakeWizard';
import { PipelineKanban } from './PipelineKanban';
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  Lightbulb, 
  Building, 
  ArrowRight, 
  Plus, 
  FolderGit2, 
  Sparkles, 
  DollarSign, 
  Award, 
  Clock, 
  TrendingUp,
  HelpCircle,
  Settings,
  ChevronRight,
  Zap,
  Users,
  Edit3,
  User,
  Building2,
  CheckCircle2,
  Car,
  Briefcase,
  Package,
  Home as HomeIcon,
  AlertCircle,
  Wrench
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { 
    activeCase, 
    totalDamages, 
    estimatedParalegalSavings, 
    country, 
    setActiveWorkstation, 
    setIsCaseManagerOpen,
    setIsPartiesModalOpen,
    setIsTourOpen,
    setIsSettingsOpen,
    loadBlueprint
  } = useSueChef();

  const countryInfo = getCountryInfo(country);
  const stateJurisdiction = (country === 'US' || !country) ? STATE_JURISDICTIONS[activeCase.state] : null;
  const claimCeiling = stateJurisdiction ? stateJurisdiction.smallClaimsLimitIndividual : countryInfo.defaultLimit;

  // Calculate high-level merit summary
  const totalElements = activeCase.claimEvaluation.elements.length;
  const provenElements = activeCase.claimEvaluation.elements.filter(e => e.isSatisfied).length;
  const meritPercent = totalElements > 0 ? Math.round((provenElements / totalElements) * 100) : 85;

  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff');
  const defendant = activeCase.parties.find(p => p.role === 'defendant');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome & Dispute Status Card */}
      <section className="bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-secondary)] to-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 md:p-8 custom-geometry shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-gold)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] font-bold tracking-wider custom-geometry">
                DISPUTE RESOLUTION SUITE
              </span>
              <button
                onClick={() => { sound.playClick(); setIsSettingsOpen(true); }}
                className="text-xs font-mono px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] custom-geometry transition-all flex items-center gap-1.5"
              >
                <span>{countryInfo.flag} {country === 'US' ? `${stateJurisdiction?.stateName || activeCase.state} Court` : countryInfo.name}</span>
                <span className="text-[var(--accent-gold)] font-bold">Limit: {countryInfo.currencySymbol}{claimCeiling.toLocaleString()}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-[var(--text-main)] tracking-tight">
              Civil Dispute Preparation &amp; Legal Second Opinion
            </h1>

            <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
              Prepare, substantiate, and negotiate small claims disputes, unreturned deposits, and contract breaches with professional precision without paying high legal retainers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveWorkstation('claim-kitchen');
                }}
                className="btn-geom px-5 py-3 bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all"
              >
                <Scale className="w-4 h-4" />
                <span>Work on Active Case: {activeCase.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsCaseManagerOpen(true);
                }}
                className="btn-geom px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-gold)] font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <FolderGit2 className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Switch / New Dispute</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsPartiesModalOpen(true);
                }}
                className="btn-geom px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-gold)] font-semibold text-sm flex items-center gap-2 transition-all"
                title="Edit real names and addresses for you and opponent"
              >
                <Users className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Edit Your Names</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsTourOpen(true);
                }}
                className="btn-geom px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Guided Tour</span>
              </button>
            </div>
          </div>

          {/* Active Case Health & Impact Box */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry lg:w-80 shrink-0 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
              <div className="text-xs font-mono uppercase text-[var(--text-muted)]">Active Dispute Snapshot</div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold custom-geometry">
                ENCRYPTED &amp; LOCAL
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-[var(--text-muted)] font-mono">Dispute Matter:</div>
              <div className="text-sm font-bold font-serif text-[var(--text-main)] line-clamp-1">{activeCase.title}</div>
            </div>

            {/* Parties quick display & direct edit */}
            <div className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Parties Involved:</span>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setIsPartiesModalOpen(true); }}
                  className="text-[11px] font-bold text-[var(--accent-gold)] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit Names
                </button>
              </div>
              <div className="font-medium text-[var(--text-main)] truncate text-[11px]">
                <span className="text-emerald-400 font-bold">You:</span> {plaintiff?.name || '[Your Name]'}
              </div>
              <div className="font-medium text-[var(--text-muted)] truncate text-[11px]">
                <span className="text-amber-400 font-bold">Vs:</span> {defendant?.name || '[Opponent]'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Damages Claimed</div>
                <div className="text-base font-bold font-mono text-[var(--accent-gold)] pt-0.5">
                  {countryInfo.currencySymbol}{totalDamages.toLocaleString()}
                </div>
              </div>

              <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Merit Score</div>
                <div className="text-base font-bold font-mono text-emerald-400 pt-0.5">
                  {meritPercent}% (A+)
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 custom-geometry flex items-center gap-2 text-xs text-[var(--accent-gold)] font-mono">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Est. Legal Fees Saved: {countryInfo.currencySymbol}{estimatedParalegalSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Litigation Pipeline & Lifecycle Kanban Tracker */}
      <section>
        <PipelineKanban />
      </section>

      {/* Guided 30-Second Dispute Intake Assistant (Direct Real-World Help) */}
      <section>
        <DisputeIntakeWizard />
      </section>

      {/* 3-Step Plain-English Action Roadmap */}
      <section className="p-5 sm:p-6 bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-secondary)] to-[var(--bg-card)] border-2 border-[var(--accent-gold)]/40 custom-geometry space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[var(--text-main)]">
              How SueChef Wins Your Dispute (3 Simple Steps)
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Designed for everyday people — no complicated legal jargon or expensive lawyer retainers needed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-2">
            <div className="w-7 h-7 rounded-full bg-[var(--accent-gold)] text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">Fill in Names &amp; Losses</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Use clear <span className="font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded text-[var(--accent-gold)]">[e.g., example]</span> placeholders to enter your real story, deposit amount, or unpaid invoice.
            </p>
          </div>

          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-2">
            <div className="w-7 h-7 rounded-full bg-[var(--accent-gold)] text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">Generate Formal Demand &amp; Papers</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Produce 14-day pre-lawsuit demand letters citing real state laws and California / NY 28-line numbered court pleadings.
            </p>
          </div>

          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-2">
            <div className="w-7 h-7 rounded-full bg-[var(--accent-gold)] text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">Audit Win Odds &amp; Settle Confidently</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Get an objective win percentage grade, spot opponent defense traps, and reach verified free legal aid clinics.
            </p>
          </div>
        </div>
      </section>

      {/* Everyday Layman Dispute Quick Starters */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 bg-amber-500/10 text-[var(--accent-gold)] border border-amber-500/30 custom-geometry font-bold">
                POPULAR EVERYDAY DISPUTES
              </span>
            </div>
            <h2 className="text-xl font-bold font-serif text-[var(--text-main)] flex items-center gap-2 mt-1">
              <span>Choose Your Dispute (Pre-Loaded Legal Elements &amp; Math)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Select a situation to automatically load verified state statutes, statutory penalty formulas, and editable facts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Card 1: Security Deposit */}
          <div 
            onClick={() => {
              sound.playGavelStrike();
              loadBlueprint('template_deposit_ca');
              setActiveWorkstation('claim-kitchen');
            }}
            className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 text-[var(--accent-gold)] rounded-lg">
                  <HomeIcon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold custom-geometry">
                  Up to 2x Penalty
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Unreturned Security Deposit
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                Landlord failed to return your deposit or sent bogus repair deductions past the 21-day statutory deadline.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Start Deposit Claim</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Auto Mechanic / Car Damage */}
          <div 
            onClick={() => {
              sound.playGavelStrike();
              loadBlueprint('template_auto_tx');
              setActiveWorkstation('claim-kitchen');
            }}
            className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 text-[var(--accent-gold)] rounded-lg">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-bold custom-geometry">
                  Accident / Auto Shop
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Auto Damage &amp; Mechanic Overcharge
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                Collision repair damage, unauthorized repair shop charges, or low-ball insurance company refusal.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Start Vehicle Claim</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Unpaid Freelancer / Contractor Invoice */}
          <div 
            onClick={() => {
              sound.playGavelStrike();
              loadBlueprint('template_freelance_ny');
              setActiveWorkstation('claim-kitchen');
            }}
            className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 text-[var(--accent-gold)] rounded-lg">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold custom-geometry">
                  FIFA Double Damages
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Unpaid Freelance &amp; Client Invoices
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                Client received deliverables or creative work and refused to tender payment past 30 days.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Start Invoice Claim</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Home Contractor Remodel */}
          <div 
            onClick={() => {
              sound.playGavelStrike();
              loadBlueprint('template_contractor_ca');
              setActiveWorkstation('claim-kitchen');
            }}
            className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 text-[var(--accent-gold)] rounded-lg">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-bold custom-geometry">
                  CSLB Surety Bond
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Home Contractor &amp; Remodel Defect
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                Contractor walked off job after receiving milestone payments, or performed defective plumbing/tile work.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Start Contractor Claim</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Consumer Fraud & Deceptive Sales */}
          <div 
            onClick={() => {
              sound.playGavelStrike();
              loadBlueprint('template_consumer_fl');
              setActiveWorkstation('claim-kitchen');
            }}
            className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 text-[var(--accent-gold)] rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-950/60 text-rose-300 border border-rose-500/30 font-bold custom-geometry">
                  FDUTPA / UDAP
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Consumer Fraud &amp; Deceptive Sales
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                Merchant or dealership concealed salvage vehicle title, made false promises, or refused refund.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Start Consumer Claim</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Damaged Moving & Courier */}
          <div 
            onClick={() => {
              sound.playGavelStrike();
              loadBlueprint('template_deposit_ca');
              setActiveWorkstation('claim-kitchen');
            }}
            className="p-4 bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 text-[var(--accent-gold)] rounded-lg">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-bold custom-geometry">
                  Carrier Claim
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Damaged Moving &amp; Freight Delivery
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                Moving company broke furniture, lost shipment cartons, or denied declared value liability claim.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Start Cargo Claim</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Litigation Workstations (The Core Value Engine) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold font-serif text-[var(--text-main)] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>Litigation Workstations (6-Step Preparation)</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">
              Follow these clear, sequential steps to prepare evidence, draft compliant pleadings, and calculate your legal second opinion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Build Case */}
          <div 
            onClick={() => { sound.playClick(); setActiveWorkstation('claim-kitchen'); }}
            className="group bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] p-5 custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent-gold)] font-bold text-sm">
                  1
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-semibold">
                  Damage Calculator
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Build Case &amp; Legal Elements
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Itemize financial losses, calculate statutory penalty multipliers, and verify your small claims court dollar limits.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Open Claim Kitchen</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Evidence Locker */}
          <div 
            onClick={() => { sound.playClick(); setActiveWorkstation('evidence-locker'); }}
            className="group bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] p-5 custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent-gold)] font-bold text-sm">
                  2
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-emerald-400 font-semibold">
                  SHA-256 Digest
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Evidence Locker &amp; Tamper Vault
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Stamp contracts, receipts, photos, and reconstructed SMS chat threads with Federal Rules of Evidence 902 digital digests.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Open Evidence Locker</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Court Papers */}
          <div 
            onClick={() => { sound.playClick(); setActiveWorkstation('pleading-builder'); }}
            className="group bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] p-5 custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent-gold)] font-bold text-sm">
                  3
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-semibold">
                  CRC 2.105 Format
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Court Pleadings &amp; Demand Letters
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Generate 28-line numbered legal court pleadings, formal 14-day pre-lawsuit demand letters, and sworn affidavits.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Open Document Drafter</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Demand & Settle */}
          <div 
            onClick={() => { sound.playClick(); setActiveWorkstation('settlement-matrix'); }}
            className="group bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] p-5 custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent-gold)] font-bold text-sm">
                  4
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-semibold">
                  Rule 408 Modeling
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Settlement Matrix &amp; Risk Math
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Calculate the optimal 3-tier negotiation brackets (Anchor, Compromise, Walk-Away Floor) and draft confidential offers.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Open Settlement Matrix</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Second Opinion */}
          <div 
            onClick={() => { sound.playClick(); setActiveWorkstation('second-opinion'); }}
            className="group bg-[var(--bg-card)] border-2 border-[var(--accent-gold)]/70 hover:border-[var(--accent-gold)] p-5 custom-geometry transition-all cursor-pointer shadow-md hover:shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-gold)] text-slate-950 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] font-bold">
                  AI Legal Audit
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Legal Second Opinion Consultant
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Objective case merit grade (A-F), win probability %, predicted opponent defense traps, and statutory counter-rebuttals.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Run Second Opinion Audit</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Legal Aid */}
          <div 
            onClick={() => { sound.playClick(); setActiveWorkstation('legal-services'); }}
            className="group bg-[var(--bg-card)] border-2 border-[var(--border-color)] hover:border-[var(--accent-gold)] p-5 custom-geometry transition-all cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent-gold)] font-bold text-sm">
                  6
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Verified Directory
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                Free Legal Aid &amp; Court Portals
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Direct phone numbers and intake links for 131+ pro bono legal aid societies, court self-help clinics, and fee waiver forms.
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>Find Real-Life Help</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Built Dispute Blueprints (1-Click Starters) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-[var(--text-main)] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>Real-World Dispute Blueprints</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">
              Select a pre-calibrated dispute blueprint to automatically load verified legal elements, damage math, and sample evidence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DISPUTE_BLUEPRINTS.slice(0, 3).map(bp => (
            <div
              key={bp.id}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-3 hover:border-[var(--accent-gold)] transition-all flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--accent-gold)] font-bold">{bp.state} JURISDICTION</span>
                  <span className="text-emerald-400 font-bold">Est. {countryInfo.currencySymbol}{bp.estimatedTotal.toLocaleString()}</span>
                </div>
                <h4 className="text-sm font-bold font-serif text-[var(--text-main)]">{bp.title}</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">{bp.description}</p>
              </div>

              <button
                onClick={() => {
                  sound.playGavelStrike();
                  loadBlueprint(bp.id);
                  setActiveWorkstation('claim-kitchen');
                }}
                className="w-full py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] text-[var(--text-main)] font-semibold text-xs custom-geometry flex items-center justify-center gap-2 transition-all hover:text-[var(--accent-gold)]"
              >
                <span>Load Blueprint &amp; Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Prominent Legal Self-Help Disclaimer & Non-Attorney Notice */}
      <section className="bg-[var(--bg-card)] border-2 border-amber-500/30 p-5 md:p-6 custom-geometry shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[var(--accent-gold)] shrink-0 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-xs text-[var(--text-muted)] leading-relaxed">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif font-bold text-sm text-[var(--text-main)]">
                Important Legal Disclaimer &amp; Self-Help Notice
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold uppercase rounded">
                Not a Substitute for an Attorney
              </span>
            </div>
            <p>
              <strong>SueChef is a legal technology self-help workflow tool</strong> designed to assist self-represented (pro se) claimants in organizing evidence, calculating statutory damage formulas, and structuring court-compliant paperwork. <strong>SueChef is not a law firm, does not provide formal legal representation or tailored legal advice, and does not establish an attorney-client relationship.</strong>
            </p>
            <p>
              All statutory multipliers, interest rates, and procedural checklists are derived from publicly accessible state civil codes and court rules. Actual legal results depend on individual case facts, local court local rules, and judicial discretion. If you require legal counsel, representation in court, or advice regarding complex legal strategies, please consult a licensed attorney in your jurisdiction or utilize our <strong><button type="button" onClick={() => { sound.playClick(); setActiveWorkstation('legal-services'); }} className="text-[var(--accent-gold)] underline font-semibold hover:opacity-80">Verified Legal Aid Directory</button></strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
