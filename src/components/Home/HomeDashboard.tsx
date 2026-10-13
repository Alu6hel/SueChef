import React, { useState } from 'react';
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
    setIsOnboardingOpen,
    loadBlueprint,
    t,
    format
  } = useSueChef();

  const [isLimitsModalOpen, setIsLimitsModalOpen] = useState(false);

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
                {t('homeDisputeSuite', 'DISPUTE RESOLUTION SUITE')}
              </span>
              <button
                onClick={() => { sound.playClick(); setIsSettingsOpen(true); }}
                className="text-xs font-mono px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] custom-geometry transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{countryInfo.flag} {country === 'US' ? `${stateJurisdiction?.stateName || activeCase.state} Court` : countryInfo.name}</span>
                <span className="text-[var(--accent-gold)] font-bold">{t('homeCourtLimit', 'Limit:')} {countryInfo.currencySymbol}{claimCeiling.toLocaleString()}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-[var(--text-main)] tracking-tight">
              {t('homeHeroTitle', 'Civil Dispute Preparation & Legal Second Opinion')}
            </h1>

            <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
              {t('homeHeroSubtitle', 'Prepare, substantiate, and negotiate small claims disputes, unreturned deposits, and contract breaches with professional precision without paying high legal retainers.')}
            </p>

            {/* Three-Pill Core Action Cluster */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.hapticPulse();
                  sound.playClick();
                  setIsOnboardingOpen(true);
                }}
                className="btn-geom px-5 py-3.5 bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                title="Launch personalized 4-step consumer assessment and statutory roadmap"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{t('homeInstantAssessment', 'Instant Dispute Assessment')}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/20 uppercase tracking-wider font-extrabold ml-1">
                  {t('homeStartHere', 'Start Here')}
                </span>
              </button>

              <button
                onClick={() => {
                  sound.hapticPulse();
                  sound.playClick();
                  setActiveWorkstation('claim-kitchen');
                }}
                className="btn-geom px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-gold)] font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Scale className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>{t('navBuildCase', 'Build Active Case')}: {activeCase.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sound.hapticPulse();
                  sound.playClick();
                  setIsCaseManagerOpen(true);
                }}
                className="btn-geom px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>{t('homeSwitchDispute', 'Switch / New Dispute')}</span>
              </button>
            </div>

            {/* Secondary Utility Chips Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  sound.hapticTick();
                  sound.playClick();
                  setIsPartiesModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Edit real names and addresses for you and opponent"
              >
                <Users className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>{t('homeEditParties', 'Edit Case Parties')}</span>
              </button>

              <button
                onClick={() => {
                  sound.hapticTick();
                  sound.playClick();
                  setIsTourOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>{t('homeTourGuide', 'Guided Tour')}</span>
              </button>

              <button
                onClick={() => {
                  sound.hapticPulse();
                  sound.playClick();
                  setIsLimitsModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="View small claims limits, statutory deadlines & fee scales"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('homeStatutoryLimits', 'ⓘ Statutory Limits & Court Rules')}</span>
              </button>
            </div>
          </div>

          {/* Active Case Health & Impact Box */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry lg:w-80 shrink-0 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
              <div className="text-xs font-mono uppercase text-[var(--text-muted)]">{t('homeActiveDisputeSnapshot', 'Active Dispute Snapshot')}</div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold custom-geometry">
                {t('homeEncryptedBadge', 'ENCRYPTED & LOCAL')}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-[var(--text-muted)] font-mono">{t('homeDisputeMatter', 'Dispute Matter:')}</div>
              <div className="text-sm font-bold font-serif text-[var(--text-main)] line-clamp-1">{activeCase.title}</div>
            </div>

            {/* Parties quick display & direct edit */}
            <div className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">{t('homePartiesInvolved', 'Parties Involved:')}</span>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setIsPartiesModalOpen(true); }}
                  className="text-[11px] font-bold text-[var(--accent-gold)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" /> {t('homeEditNames', 'Edit Names')}
                </button>
              </div>
              <div className="font-medium text-[var(--text-main)] truncate text-[11px]">
                <span className="text-emerald-400 font-bold">{t('homeYou', 'You:')}</span> {plaintiff?.name || '[Your Name]'}
              </div>
              <div className="font-medium text-[var(--text-muted)] truncate text-[11px]">
                <span className="text-amber-400 font-bold">{t('homeVs', 'Vs:')}</span> {defendant?.name || '[Opponent]'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">{t('homeDamagesClaimed', 'Damages Claimed')}</div>
                <div className="text-base font-bold font-mono text-[var(--accent-gold)] pt-0.5">
                  {countryInfo.currencySymbol}{totalDamages.toLocaleString()}
                </div>
              </div>

              <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">{t('homeMeritScore', 'Merit Score')}</div>
                <div className="text-base font-bold font-mono text-emerald-400 pt-0.5">
                  {meritPercent}% (A+)
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 custom-geometry flex items-center gap-2 text-xs text-[var(--accent-gold)] font-mono">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>{format('homeLegalFeesSaved', { amount: `${countryInfo.currencySymbol}${estimatedParalegalSavings.toLocaleString()}` }, `Est. Legal Fees Saved: ${countryInfo.currencySymbol}${estimatedParalegalSavings.toLocaleString()}`)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Litigation Pipeline & Lifecycle Kanban Tracker */}
      <section>
        <PipelineKanban />
      </section>

      {/* Personalized Concierge Banner (Zero Decision Fatigue & Instant Value) */}
      <section className="p-4 sm:p-5 bg-gradient-to-r from-[var(--badge-bg)] via-[var(--bg-secondary)] to-[var(--badge-bg)] border-2 border-[var(--accent-gold)] custom-geometry shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 flex items-center justify-center shrink-0 text-xl">
            ✨
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--text-main)]">
              {t('homeNewDisputeBannerTitle', 'New Dispute? Get an Instant Recovery Assessment')}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {t('homeNewDisputeBannerDesc', 'No legal jargon. Choose your atmosphere, define your goal in 1 tap, and unlock your statutory damage ceiling before doing any paperwork.')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsOnboardingOpen(true);
          }}
          className="btn-geom px-5 py-2.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs sm:text-sm hover:opacity-90 flex items-center gap-2 shadow-md shrink-0 w-full sm:w-auto justify-center transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('homeLaunchConcierge', 'Launch 60-Sec Concierge')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
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
              {t('homeRoadmapTitle', 'How SueChef Wins Your Dispute (3 Simple Steps)')}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {t('homeRoadmapSubtitle', 'Designed for everyday people — no complicated legal jargon or expensive lawyer retainers needed.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-2">
            <div className="w-7 h-7 rounded-full bg-[var(--accent-gold)] text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">{t('homeStep1Title', 'Fill in Names & Losses')}</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {t('homeStep1Desc', 'Use clear [e.g., example] placeholders to enter your real story, deposit amount, or unpaid invoice.')}
            </p>
          </div>

          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-2">
            <div className="w-7 h-7 rounded-full bg-[var(--accent-gold)] text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">{t('homeStep2Title', 'Generate Formal Demand & Papers')}</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {t('homeStep2Desc', 'Produce 14-day pre-lawsuit demand letters citing real state laws and California / NY 28-line numbered court pleadings.')}
            </p>
          </div>

          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-2">
            <div className="w-7 h-7 rounded-full bg-[var(--accent-gold)] text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">{t('homeStep3Title', 'Audit Win Odds & Settle Confidently')}</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {t('homeStep3Desc', 'Get an objective win percentage grade, spot opponent defense traps, and reach verified free legal aid clinics.')}
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
                {t('homePopularEverydayDisputes', 'POPULAR EVERYDAY DISPUTES')}
              </span>
            </div>
            <h2 className="text-xl font-bold font-serif text-[var(--text-main)] flex items-center gap-2 mt-1">
              <span>{t('homePopularDisputesTitle', 'Choose Your Dispute (Pre-Loaded Legal Elements & Math)')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              {t('homePopularDisputesSubtitle', 'Select a situation to automatically load verified state statutes, statutory penalty formulas, and editable facts.')}
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
                  {t('homeDisputeDepositBadge', 'Up to 2x Penalty')}
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('homeDisputeDepositTitle', 'Unreturned Security Deposit')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                {t('homeDisputeDepositDesc', 'Landlord failed to return your deposit or sent bogus repair deductions past the 21-day statutory deadline.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeDisputeDepositBtn', 'Start Deposit Claim')}</span>
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
                  {t('homeDisputeAutoBadge', 'Direct + Loss of Use')}
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('homeDisputeAutoTitle', 'Auto Collision & Property Damage')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                {t('homeDisputeAutoDesc', 'Other driver at fault in collision; insurance refuses to pay full repair or diminished market value.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeDisputeAutoBtn', 'Start Property Claim')}</span>
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
                  {t('homeDisputeFreelanceBadge', 'Double Damages')}
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('homeDisputeFreelanceTitle', 'Unpaid Freelance Invoice (FIFA)')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                {t('homeDisputeFreelanceDesc', 'Client accepted deliverables into production but refused payment beyond 30 days under Freelance Protection laws.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeDisputeFreelanceBtn', 'Start Freelance Claim')}</span>
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
                  {t('homeDisputeContractorBadge', 'Bond Claim Ready')}
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('homeDisputeContractorTitle', 'General Contractor Remodel Breach')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                {t('homeDisputeContractorDesc', 'Contractor abandoned renovation project with defective plumbing, leaks, or substandard construction.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeDisputeContractorBtn', 'Start Contractor Claim')}</span>
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
                  {t('homeDisputeFraudBadge', 'Treble Damages')}
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('homeDisputeFraudTitle', 'Auto Dealer Fraud & Deceptive Trade')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                {t('homeDisputeFraudDesc', 'Dealer sold flood/salvage vehicle as clean title accident-free or added unauthorized fees.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeDisputeFraudBtn', 'Start Fraud Claim')}</span>
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
                  {t('homeDisputeAirlineBadge', 'Statutory Reimbursement')}
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('homeDisputeAirlineTitle', 'Flight Cancellation & Lost Baggage')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                {t('homeDisputeAirlineDesc', 'Airline canceled flight without notice or lost luggage and refused mandatory compensation.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeDisputeAirlineBtn', 'Start Airline Claim')}</span>
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
              <span>{t('homeWorkstationsTitle', 'Litigation Workstations (6-Step Preparation)')}</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">
              {t('homeWorkstationsSubtitle', 'Follow these clear, sequential steps to prepare evidence, draft compliant pleadings, and calculate your legal second opinion.')}
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
                  {t('tourStep2Badge', 'Damage Calculator')}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('tourStep2Title', 'Build Case & Legal Elements')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t('tourStep2Desc', 'Itemize financial losses, calculate statutory penalty multipliers, and verify your small claims court dollar limits.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeOpenClaimKitchen', 'Open Claim Kitchen')}</span>
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
                  {t('tourStep3Badge', 'SHA-256 Digest')}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('tourStep3Title', 'Evidence Locker & Tamper Vault')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t('tourStep3Desc', 'Stamp contracts, receipts, photos, and reconstructed SMS chat threads with Federal Rules of Evidence 902 digital digests.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeOpenEvidenceLocker', 'Open Evidence Locker')}</span>
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
                  {t('tourStep4Badge', 'CRC 2.105 Format')}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('tourStep4Title', 'Court Pleadings & Demand Letters')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t('tourStep4Desc', 'Generate 28-line numbered legal court pleadings, formal 14-day pre-lawsuit demand letters, and sworn affidavits.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeOpenDocumentDrafter', 'Open Document Drafter')}</span>
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
                  {t('tourStep5Badge', 'Rule 408 Modeling')}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('tourStep5Title', 'Settlement Matrix & Risk Math')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t('tourStep5Desc', 'Calculate the optimal 3-tier negotiation brackets (Anchor, Compromise, Walk-Away Floor) and draft confidential offers.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeOpenSettlementMatrix', 'Open Settlement Matrix')}</span>
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
                  {t('tourStep6Badge', 'AI Legal Audit')}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('tourStep6Title', 'Legal Second Opinion Consultant')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t('tourStep6Desc', 'Objective case merit grade (A-F), win probability %, predicted opponent defense traps, and statutory counter-rebuttals.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeRunSecondOpinion', 'Run Second Opinion Audit')}</span>
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
                  {t('tourStep7Badge', 'Verified Directory')}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('tourStep7Title', 'Free Legal Aid & Court Portals')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t('tourStep7Desc', 'Direct phone numbers and intake links for 131+ pro bono legal aid societies, court self-help clinics, and fee waiver forms.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--accent-gold)]">
              <span>{t('homeFindRealLifeHelp', 'Find Real-Life Help')}</span>
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
              <span>{t('homeRealWorldBlueprints', 'Real-World Dispute Blueprints')}</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">
              {t('homeBlueprintsSubtitle', 'Select a pre-calibrated dispute blueprint to automatically load verified legal elements, damage math, and sample evidence.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DISPUTE_BLUEPRINTS.slice(0, 3).map(bp => {
            const getBpI18n = (id: string) => {
              switch (id) {
                case 'template_deposit_ca': return { title: 'bpDepositTitle', desc: 'bpDepositDesc' };
                case 'template_contractor_ca': return { title: 'bpContractorTitle', desc: 'bpContractorDesc' };
                case 'template_freelance_ny': return { title: 'bpFreelanceTitle', desc: 'bpFreelanceDesc' };
                default: return null;
              }
            };
            const bpKeys = getBpI18n(bp.id);
            const title = bpKeys ? t(bpKeys.title, bp.title) : bp.title;
            const desc = bpKeys ? t(bpKeys.desc, bp.description) : bp.description;

            return (
              <div
                key={bp.id}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-3 hover:border-[var(--accent-gold)] transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--accent-gold)] font-bold">{bp.state} {t('vaultJurisdiction', 'JURISDICTION')}</span>
                    <span className="text-emerald-400 font-bold">Est. {countryInfo.currencySymbol}{bp.estimatedTotal.toLocaleString()}</span>
                  </div>
                  <h4 className="text-sm font-bold font-serif text-[var(--text-main)]">{title}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">{desc}</p>
                </div>

                <button
                  onClick={() => {
                    sound.playGavelStrike();
                    loadBlueprint(bp.id);
                    setActiveWorkstation('claim-kitchen');
                  }}
                  className="w-full py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] text-[var(--text-main)] font-semibold text-xs custom-geometry flex items-center justify-center gap-2 transition-all hover:text-[var(--accent-gold)]"
                >
                  <span>{t('homeLoadBlueprintStart', 'Load Blueprint & Start')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
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
                {t('homeDisclaimerTitle', 'Important Legal Disclaimer & Self-Help Notice')}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold uppercase rounded">
                {t('homeDisclaimerBadge', 'Not a Substitute for an Attorney')}
              </span>
            </div>
            <p>
              {t('homeDisclaimerP1', 'SueChef is a legal technology self-help workflow tool designed to assist self-represented (pro se) claimants in organizing evidence, calculating statutory damage formulas, and structuring court-compliant paperwork. SueChef is not a law firm, does not provide formal legal representation or tailored legal advice, and does not establish an attorney-client relationship.')}
            </p>
            <p>
              {t('homeDisclaimerP2', 'All statutory multipliers, interest rates, and procedural checklists are derived from publicly accessible state civil codes and court rules. Actual legal results depend on individual case facts, local court local rules, and judicial discretion. If you require legal counsel, representation in court, or advice regarding complex legal strategies, please consult a licensed attorney in your jurisdiction or utilize our Verified Legal Aid Directory.')}
            </p>
            <div className="pt-1">
              <button type="button" onClick={() => { sound.playClick(); setActiveWorkstation('legal-services'); }} className="text-[var(--accent-gold)] underline font-semibold hover:opacity-80 flex items-center gap-1.5">
                <span>{t('tourStep7Title', 'Free Legal Aid & Court Portals')}</span> &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Progressive Disclosure Modal: Statutory Limits & Court Rules */}
      {isLimitsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[var(--accent-gold)] shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[var(--text-main)]">
                    {countryInfo.flag} {format('homeLimitsModalTitle', { jurisdiction: country === 'US' ? (stateJurisdiction?.stateName || activeCase.state) : countryInfo.name })}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    {t('homeLimitsModalSub', 'Jurisdictional Thresholds & Statutory Deadlines')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.hapticTick();
                  sound.playClick();
                  setIsLimitsModalOpen(false);
                }}
                className="text-[var(--text-muted)] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-1">
                  <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">{t('homeIndividualClaimCeiling', 'Individual Claim Ceiling')}</div>
                  <div className="text-lg font-mono font-bold text-[var(--accent-gold)]">
                    {countryInfo.currencySymbol}{claimCeiling.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">{t('homeMaxRecoverableSmallClaims', 'Maximum recoverable in small claims')}</div>
                </div>

                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-1">
                  <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">{t('homeAttorneyRepresentation', 'Attorney Representation')}</div>
                  <div className="text-base font-mono font-bold text-emerald-400">
                    {stateJurisdiction?.attorneysAllowedInSmallClaims ? t('homeAttorneysPermitted', 'Permitted') : t('homeAttorneysBarred', 'Barred (Pro Se Only)')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {stateJurisdiction?.attorneysAllowedInSmallClaims ? t('homeAttorneysPermittedSub', 'Parties may retain counsel') : t('homeAttorneysBarredSub', 'Self-representation required by law')}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-2">
                <div className="text-[11px] font-bold font-serif text-[var(--text-main)]">
                  ⏱️ {t('homeCommonStatutoryDeadlines', 'Common Statutory Deadlines (Statute of Limitations):')}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                  <div className="p-2 bg-black/40 rounded border border-white/5">
                    <div className="text-slate-400 text-[10px]">{t('homeWrittenContract', 'Written Contract')}</div>
                    <div className="font-bold text-amber-300">{format('homeYears', { count: 4 })}</div>
                  </div>
                  <div className="p-2 bg-black/40 rounded border border-white/5">
                    <div className="text-slate-400 text-[10px]">{t('homeOralContract', 'Oral Contract')}</div>
                    <div className="font-bold text-amber-300">{format('homeYears', { count: 2 })}</div>
                  </div>
                  <div className="p-2 bg-black/40 rounded border border-white/5">
                    <div className="text-slate-400 text-[10px]">{t('homePropertyDamageLimit', 'Property Damage')}</div>
                    <div className="font-bold text-amber-300">{format('homeYears', { count: 3 })}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-[11px] text-[var(--text-muted)]">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t('homeFeeWaiverNoticeTitle', 'Court Filing Fee Waiver Notice (In Forma Pauperis):')}</span>
                </div>
                <p>
                  {t('homeFeeWaiverNoticeDesc', 'If you are low-income or receive public assistance (SNAP, SSI, Medicaid), you may request a 100% waiver of court filing and service fees by filing Form FW-001 with the court clerk.')}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={() => {
                  sound.hapticPulse();
                  sound.playClick();
                  setIsLimitsModalOpen(false);
                }}
                className="px-5 py-2.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md"
              >
                {t('homeUnderstoodClose', 'Understood & Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
