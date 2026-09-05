import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { SecondOpinionEngine } from '../../services/secondOpinionEngine';
import { sound } from '../../services/soundEngine';
import { AluLogo } from '../Branding/AluLogo';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Gavel, 
  Download, 
  ExternalLink, 
  Scale, 
  DollarSign, 
  Lightbulb, 
  ArrowRight,
  Printer,
  HelpCircle,
  Clock,
  Phone,
  Building
} from 'lucide-react';

export const SecondOpinionConsultant: React.FC = () => {
  const { activeCase, setActiveWorkstation, country } = useSueChef();
  const [activeTab, setActiveTab] = useState<'overview' | 'defenses' | 'roadmap' | 'local_aid'>('overview');
  const [copiedMemo, setCopiedMemo] = useState(false);

  const report = SecondOpinionEngine.generateReport(activeCase);

  const handlePrintMemo = () => {
    sound.playDocketStamp();
    window.print();
  };

  const handleCopyMemo = () => {
    sound.playClick();
    const memoText = `
=== SUECHEF LEGAL SECOND OPINION MEMORANDUM ===
DISPUTE MATTER: ${report.caseTitle}
CATEGORY: ${report.category.replace(/_/g, ' ').toUpperCase()} | JURISDICTION: ${report.state}, ${report.country}
MERIT GRADE: ${report.overallMeritGrade} | WIN PROBABILITY: ${report.winProbabilityScore}%
DATE GENERATED: ${new Date(report.timestamp).toLocaleDateString()}

--- EXECUTIVE SUMMARY ---
${report.verdictSummary}

--- KEY CASE STRENGTHS ---
${report.keyStrengths.map(s => `• ${s}`).join('\n')}

--- VULNERABILITIES & RISK AREAS ---
${report.vulnerabilities.map(v => `• ${v}`).join('\n')}

--- PREDICTED OPPOSING DEFENSES & COUNTER-STRATEGIES ---
${report.predictedDefenses.map(d => `
[DEFENSE]: ${d.defenseTitle} (${d.likelihood} Likelihood)
ARGUMENT: ${d.opposingArgument}
REBUTTAL: ${d.counterStrategy}
CITATION: ${d.statutoryBasis}
`).join('\n')}

--- FINANCIAL RECOMMENDATION ---
Claimed Damages: $${report.financialAssessment.claimedDamages.toLocaleString()}
Recommended Settlement Floor: $${report.financialAssessment.recommendedSettlementFloor.toLocaleString()}
Estimated Filing Fee: $${report.financialAssessment.courtFilingCostEstimate}
Recommendation: ${report.financialAssessment.proceedRecommendation}

--- ACTION ROADMAP ---
${report.stepByStepRoadmap.map(s => `Step ${s.stepNumber}: ${s.action} (${s.importance})\n  -> ${s.deadlineNotice}`).join('\n')}

Certified by SueChef Privacy-First Pro Se Legal Suite
    `.trim();

    navigator.clipboard.writeText(memoText);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      {/* Top Banner with Official Brand Stamp & Case Score */}
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 md:p-8 custom-geometry shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <AluLogo size="md" showLabel={true} />
              <span className="px-3 py-1 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] font-mono text-xs font-bold uppercase rounded-full">
                AI Legal Case Evaluator
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-[var(--text-main)] leading-tight">
              Legal Second Opinion & Case Viability Audit
            </h1>
            <p className="text-sm md:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
              Objective, non-partisan computational evaluation of your dispute’s evidentiary foundation, defense traps, and recovery likelihood before filing in court.
            </p>
          </div>

          {/* Letter Grade & Win Probability Display */}
          <div className="flex items-center gap-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 custom-geometry shrink-0 shadow-inner">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Merit Rating</span>
              <span className={`text-4xl font-extrabold font-serif ${
                report.overallMeritGrade.startsWith('A') ? 'text-emerald-400' :
                report.overallMeritGrade === 'B' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {report.overallMeritGrade}
              </span>
            </div>

            <div className="w-px h-12 bg-[var(--border-color)]" />

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Win Probability</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-mono text-emerald-400">
                  {report.winProbabilityScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Verdict Box */}
        <div className="bg-[var(--badge-bg)] border-l-4 border-[var(--accent-gold)] p-5 custom-geometry space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-gold)] tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Consultant Strategic Verdict</span>
          </div>
          <p className="text-sm md:text-base text-[var(--text-main)] leading-relaxed font-sans font-medium">
            {report.verdictSummary}
          </p>
        </div>

        {/* Quick Action Navigation & Memo Download */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'overview', label: 'Case Strengths & Risks', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'defenses', label: 'Predicted Defenses & Rebuttals', icon: <Gavel className="w-4 h-4" /> },
              { id: 'roadmap', label: 'Action Roadmap (5 Steps)', icon: <Clock className="w-4 h-4" /> },
              { id: 'local_aid', label: 'Local Legal Aid & Courts', icon: <Building className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMemo}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] custom-geometry transition-all"
            >
              <FileText className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>{copiedMemo ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrintMemo}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 custom-geometry hover:opacity-90 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Memo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Strengths, Vulnerabilities & Financial ROI */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Strengths */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 custom-geometry space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-color)]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Core Case Strengths
              </h2>
            </div>
            <ul className="space-y-3">
              {report.keyStrengths.map((st, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-main)] leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vulnerabilities & Risks */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 custom-geometry space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-color)]">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Vulnerabilities & Risk Areas
              </h2>
            </div>
            <ul className="space-y-3">
              {report.vulnerabilities.map((vu, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-main)] leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span>{vu}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Financial ROI & Recommendation Card */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--accent-gold)]/40 p-6 custom-geometry space-y-5 shadow-lg">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-color)]">
              <DollarSign className="w-5 h-5 text-[var(--accent-gold)]" />
              <h2 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Financial Assessment
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)]/60">
                <span className="text-[var(--text-muted)]">Claimed Damages:</span>
                <span className="font-mono font-bold text-lg text-[var(--text-main)]">
                  ${report.financialAssessment.claimedDamages.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)]/60">
                <span className="text-[var(--text-muted)]">Realistic Recovery:</span>
                <span className="font-mono font-bold text-lg text-emerald-400">
                  ${report.financialAssessment.realisticRecoveryEstimate.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)]/60">
                <span className="text-[var(--text-muted)]">Estimated Court Filing Fee:</span>
                <span className="font-mono font-semibold text-[var(--text-main)]">
                  ${report.financialAssessment.courtFilingCostEstimate}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-[var(--text-muted)]">Target Settle Floor:</span>
                <span className="font-mono font-semibold text-[var(--accent-gold)]">
                  ${report.financialAssessment.recommendedSettlementFloor.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase mb-1">
                Consultant Recommendation:
              </div>
              <div className="p-3 bg-[var(--badge-bg)] border border-[var(--badge-border)] custom-geometry text-center font-bold text-sm text-[var(--accent-gold)]">
                {report.financialAssessment.proceedRecommendation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Predicted Defense Tactics & Legal Rebuttal Counters */}
      {activeTab === 'defenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
              Anticipated Defense Arguments & Court Counter-Strategies
            </h2>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Tailored for {report.category.replace(/_/g, ' ').toUpperCase()} in {report.state}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {report.predictedDefenses.map((def, idx) => (
              <div key={idx} className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-5 custom-geometry space-y-4 shadow-sm hover:border-[var(--accent-gold)]/60 transition-all">
                <div className="flex items-start justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded uppercase">
                      Opposing Defense #{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-main)] font-serif pt-1">
                      {def.defenseTitle}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] rounded">
                    {def.likelihood} Probability
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-rose-950/20 border border-rose-800/40 custom-geometry text-rose-200">
                    <div className="text-[10px] font-mono uppercase font-bold text-rose-400 mb-1">
                      What the Defendant Will Argue:
                    </div>
                    {def.opposingArgument}
                  </div>

                  <div className="p-3.5 bg-[var(--badge-bg)] border-l-4 border-[var(--accent-gold)] custom-geometry text-[var(--text-main)]">
                    <div className="text-[10px] font-mono uppercase font-bold text-[var(--accent-gold)] mb-1">
                      Your Winning Counter-Rebuttal:
                    </div>
                    {def.counterStrategy}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] pt-1">
                    <Scale className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    <span>Statutory Authority: {def.statutoryBasis}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Step-by-Step Action Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 custom-geometry space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <div>
              <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
                5-Step Pro Se Litigation Execution Roadmap
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono pt-1">
                Follow these mandatory procedural milestones to preserve all statutory rights
              </p>
            </div>
            <button
              onClick={() => setActiveWorkstation('pleading-builder')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 custom-geometry hover:opacity-90"
            >
              <span>Draft Court Papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {report.stepByStepRoadmap.map((step) => (
              <div key={step.stepNumber} className="flex items-start gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry hover:border-[var(--accent-gold)]/60 transition-all">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-gold)] text-slate-950 font-extrabold flex items-center justify-center font-mono shrink-0 shadow-sm">
                  {step.stepNumber}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-[var(--text-main)] font-serif">
                      {step.action}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      step.importance === 'Mandatory' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : 'bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)]'
                    }`}>
                      {step.importance}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {step.deadlineNotice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Real-Life Legal Aid & Local Court Directory */}
      {activeTab === 'local_aid' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
                Real-Life Legal Help, Pro Bono Clinics & Court Self-Help
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono pt-1">
                Verified legal resources for {report.state}, {report.country}
              </p>
            </div>
            <button
              onClick={() => setActiveWorkstation('legal-services')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] custom-geometry hover:bg-[var(--accent-gold)] hover:text-black"
            >
              <span>View Full Directory</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {report.localHelpResources.map((svc) => (
              <div key={svc.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 custom-geometry space-y-4 shadow-sm hover:border-[var(--accent-gold)] transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] rounded uppercase">
                      {svc.category.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-main)] font-serif pt-1">
                      {svc.name}
                    </h3>
                  </div>
                  {svc.isFree && (
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold shrink-0">
                      FREE SERVICE
                    </span>
                  )}
                </div>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {svc.description}
                </p>

                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry text-xs text-[var(--text-main)] space-y-1 font-mono">
                  <div className="text-[10px] text-[var(--accent-gold)] uppercase font-bold">Intake Details:</div>
                  <div>{svc.intakeNotes}</div>
                  {svc.phone && (
                    <div className="flex items-center gap-1.5 pt-1 text-emerald-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{svc.phone}</span>
                    </div>
                  )}
                </div>

                <div className="pt-1 flex justify-end">
                  <a
                    href={svc.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 custom-geometry hover:opacity-90"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
