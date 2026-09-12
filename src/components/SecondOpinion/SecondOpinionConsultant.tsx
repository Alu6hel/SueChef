import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { SecondOpinionEngine } from '../../services/secondOpinionEngine';
import { sound } from '../../services/soundEngine';
import { getCountryInfo } from '../../services/countries';
import { AluLogo } from '../Branding/AluLogo';
import { PredictedDefense, AdvisorConsultationResult } from '../../types';
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
  Building, 
  Plus, 
  Trash2, 
  Calculator, 
  CheckSquare, 
  Square, 
  X,
  Send,
  Copy,
  Check,
  BookOpen,
  MessageSquare
} from 'lucide-react';

export const SecondOpinionConsultant: React.FC = () => {
  const { activeCase, updateActiveCase, setActiveWorkstation, country } = useSueChef();
  const countryInfo = getCountryInfo(country);
  const [activeTab, setActiveTab] = useState<'advisor_chat' | 'overview' | 'vulnerabilities' | 'defenses' | 'ev_calculator' | 'roadmap' | 'local_aid'>('advisor_chat');
  const [copiedMemo, setCopiedMemo] = useState(false);

  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff');
  const defendant = activeCase.parties.find(p => p.role === 'defendant');
  const plaintiffName = plaintiff?.name || 'Claimant';
  const defendantName = defendant?.name || 'Defendant';

  // AI Advisor Interactive Consultation State
  const [queryInput, setQueryInput] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [copiedConsultMemo, setCopiedConsultMemo] = useState(false);

  const [activeConsultation, setActiveConsultation] = useState<AdvisorConsultationResult>(() => {
    if (activeCase.advisorConsultationHistory && activeCase.advisorConsultationHistory.length > 0) {
      return activeCase.advisorConsultationHistory[0];
    }
    return SecondOpinionEngine.consultAdvisor(
      activeCase,
      `What exact statutes, evidence rules, and court hearing tactics apply to my case against ${defendantName}?`
    );
  });

  // Custom defense builder modal state
  const [isAddDefenseModalOpen, setIsAddDefenseModalOpen] = useState(false);
  const [newDefenseTitle, setNewDefenseTitle] = useState('');
  const [newOpposingArgument, setNewOpposingArgument] = useState('');
  const [newCounterStrategy, setNewCounterStrategy] = useState('');
  const [newStatutoryBasis, setNewStatutoryBasis] = useState('');
  const [newLikelihood, setNewLikelihood] = useState<'High' | 'Medium' | 'Low'>('High');

  // EV Calculator States
  const [currentSettlementOffer, setCurrentSettlementOffer] = useState<number>(
    activeCase.settlement?.offerHistory?.[activeCase.settlement.offerHistory.length - 1]?.amount || 
    Math.round((activeCase.claimEvaluation.damages.reduce((a, b) => a + (b.amount || 0), 0)) * 0.5)
  );
  const [wageLossHearingDay, setWageLossHearingDay] = useState<number>(150);
  const [travelParkingCosts, setTravelParkingCosts] = useState<number>(35);

  const report = SecondOpinionEngine.generateReport(activeCase);

  const handleConsult = (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : queryInput).trim();
    if (!q) return;

    sound.playGavelStrike();
    setIsConsulting(true);

    setTimeout(() => {
      const result = SecondOpinionEngine.consultAdvisor(activeCase, q);
      setActiveConsultation(result);
      setIsConsulting(false);
      setQueryInput('');
      sound.playSuccessChime();

      updateActiveCase(prev => {
        const existing = prev.advisorConsultationHistory || [];
        const filtered = existing.filter(c => c.query.toLowerCase() !== q.toLowerCase());
        return {
          ...prev,
          advisorConsultationHistory: [result, ...filtered]
        };
      });
    }, 150);
  };

  const handleCopyCitation = (citation: string) => {
    sound.playClick();
    navigator.clipboard.writeText(citation);
    setCopiedCitation(citation);
    setTimeout(() => setCopiedCitation(null), 2000);
  };

  const handleCopyConsultMemo = () => {
    sound.playClick();
    const text = `
=== SUECHEF PRO SE LEGAL ADVISORY MEMORANDUM ===
MATTER: ${activeCase.title}
TOPIC: ${activeConsultation.topic}
JURISDICTION: ${activeCase.state}, ${countryInfo.name}
CLAIMANT: ${plaintiffName} | OPPONENT: ${defendantName}
DATE: ${new Date(activeConsultation.timestamp).toLocaleDateString()}

--- 1. EXECUTIVE LEGAL SUMMARY & VIABILITY ---
${activeConsultation.summary}

--- 2. APPLICABLE STATUTES & GOVERNING AUTHORITIES ---
${activeConsultation.statutesAndAuthorities.map(s => `• ${s}`).join('\n')}

--- 3. FACTUAL CASE & EVIDENTIARY ANALYSIS ---
${activeConsultation.factualCaseAnalysis}

--- 4. IN-COURT HEARING TACTICS & REBUTTAL SCRIPT ---
${activeConsultation.hearingTacticsAndRebuttal}

--- 5. DEFENSE TRAPS & CRITICAL PITFALLS TO AVOID ---
${activeConsultation.pitfallsToAvoid}

--- 6. IMMEDIATE ACTION CHECKLIST ---
${activeConsultation.actionItems.map((a, i) => `[ ] Step ${i + 1}: ${a}`).join('\n')}

Certified by SueChef Privacy-First Legal Technology Suite
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedConsultMemo(true);
    setTimeout(() => setCopiedConsultMemo(false), 2000);
  };

  const handleToggleVulnerability = (vulnId: string) => {
    sound.playClick();
    const currentResolved = new Set(activeCase.resolvedVulnerabilityIds || []);
    if (currentResolved.has(vulnId)) {
      currentResolved.delete(vulnId);
    } else {
      currentResolved.add(vulnId);
      sound.playSuccessChime();
    }
    updateActiveCase(prev => ({
      ...prev,
      resolvedVulnerabilityIds: Array.from(currentResolved)
    }));
  };

  const handleAddCustomDefense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDefenseTitle.trim() || !newOpposingArgument.trim() || !newCounterStrategy.trim()) return;

    sound.playDocketStamp();
    const newDefense: PredictedDefense = {
      id: 'custom_def_' + Date.now(),
      defenseTitle: newDefenseTitle.trim(),
      likelihood: newLikelihood,
      opposingArgument: newOpposingArgument.trim(),
      counterStrategy: newCounterStrategy.trim(),
      statutoryBasis: newStatutoryBasis.trim() || 'General Civil Law / Local Rules',
      isCustom: true
    };

    updateActiveCase(prev => ({
      ...prev,
      secondOpinionDefenses: [newDefense, ...(prev.secondOpinionDefenses || [])]
    }));

    setNewDefenseTitle('');
    setNewOpposingArgument('');
    setNewCounterStrategy('');
    setNewStatutoryBasis('');
    setIsAddDefenseModalOpen(false);
  };

  const handleDeleteCustomDefense = (defenseId: string) => {
    sound.playClick();
    updateActiveCase(prev => ({
      ...prev,
      secondOpinionDefenses: (prev.secondOpinionDefenses || []).filter(d => d.id !== defenseId)
    }));
  };

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

--- FINANCIAL & SETTLEMENT EXPECTED VALUE ASSESSMENT ---
Claimed Damages: ${countryInfo.currencySymbol}${report.financialAssessment.claimedDamages.toLocaleString()}
Recommended Settlement Floor: ${countryInfo.currencySymbol}${report.financialAssessment.recommendedSettlementFloor.toLocaleString()}
Estimated Filing Fee: ${countryInfo.currencySymbol}${report.financialAssessment.courtFilingCostEstimate}
Recommendation: ${report.financialAssessment.proceedRecommendation}

--- ACTION ROADMAP ---
${report.stepByStepRoadmap.map(s => `Step ${s.stepNumber}: ${s.action} (${s.importance})\n  -> ${s.deadlineNotice}`).join('\n')}

Certified by SueChef Privacy-First Pro Se Legal Suite
    `.trim();

    navigator.clipboard.writeText(memoText);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  // EV Math: EV_Trial = (WinProb% * ClaimDamages) - FilingFees - WageLoss - Travel
  const totalTrialCosts = report.financialAssessment.courtFilingCostEstimate + wageLossHearingDay + travelParkingCosts;
  const expectedTrialValue = Math.round((report.winProbabilityScore / 100) * report.financialAssessment.claimedDamages) - totalTrialCosts;
  const netSettlementValue = currentSettlementOffer;
  const evDelta = expectedTrialValue - netSettlementValue;

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

        {/* Navigation Tabs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'advisor_chat', label: 'Ask AI Legal Advisor', icon: <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" />, badge: 'Interactive' },
              { id: 'overview', label: 'Strengths & Overview', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'vulnerabilities', label: `Risk Checklist (${report.vulnerabilityItems?.length || 0})`, icon: <CheckCircle2 className="w-4 h-4" /> },
              { id: 'defenses', label: `Defense Traps (${report.predictedDefenses.length})`, icon: <Gavel className="w-4 h-4" /> },
              { id: 'ev_calculator', label: 'Trial vs Settle Calculator', icon: <Calculator className="w-4 h-4" /> },
              { id: 'roadmap', label: 'Action Roadmap (5 Steps)', icon: <Clock className="w-4 h-4" /> },
              { id: 'local_aid', label: 'Legal Aid & Courts', icon: <Building className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded uppercase font-bold ${
                    activeTab === tab.id ? 'bg-slate-950 text-[var(--accent-gold)]' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMemo}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] custom-geometry transition-all"
            >
              <FileText className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>{copiedMemo ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrintMemo}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 custom-geometry hover:opacity-90 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 0: Interactive AI Legal Advisor & Case Consultant */}
      {activeTab === 'advisor_chat' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Interactive Advisory Input Box */}
          <div className="bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-secondary)] to-[var(--bg-card)] border-2 border-[var(--accent-gold)]/60 p-5 md:p-6 custom-geometry shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                    <span>Ask AI Legal Advisor &amp; Case Consultant</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded uppercase font-bold">
                      Factual &amp; Grounded
                    </span>
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Grounded in {countryInfo.flag} {activeCase.state} Civil Codes, Court Local Rules &amp; Federal Rules of Evidence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-card)] px-3 py-1.5 border border-[var(--border-color)] rounded">
                <Scale className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Matter: <strong className="text-[var(--text-main)]">{activeCase.title}</strong></span>
              </div>
            </div>

            {/* Instant One-Click Topic Prompts */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
                1-Tap Instant Case Consultations:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: `📜 Statutes for ${activeCase.state}`, query: `What exact statutes and citations apply to my case in ${activeCase.state}?` },
                  { label: '⚖️ Proving Bad Faith & Multipliers', query: 'How do I prove bad faith and win maximum statutory penalties?' },
                  { label: '📁 Evidence Demanded by Judge', query: `What evidence will the Judge demand to see for ${activeCase.claimEvaluation.category.replace(/_/g, ' ')}?` },
                  { label: `🛡️ Defeating ${defendantName}'s Defenses`, query: `How do I defeat ${defendantName}'s likely defenses?` },
                  { label: '💰 Settlement vs. Trial EV Math', query: 'Should I settle or take this to court (EV calculation)?' },
                  { label: `⏰ Deadlines & Service in ${activeCase.state}`, query: `What deadlines and service of process rules apply in ${activeCase.state}?` }
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleConsult(prompt.query)}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] text-xs font-mono text-[var(--text-muted)] custom-geometry transition-all flex items-center gap-1.5"
                  >
                    <span>{prompt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Query Input Bar */}
            <form 
              onSubmit={e => {
                e.preventDefault();
                handleConsult();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={queryInput}
                  onChange={e => setQueryInput(e.target.value)}
                  placeholder={`Ask anything about your dispute against ${defendantName} (e.g. Can landlord deduct painting? How to subpoena records?)...`}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] focus:border-[var(--accent-gold)] text-sm text-[var(--text-main)] custom-geometry outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>

              <button
                type="submit"
                disabled={isConsulting || !queryInput.trim()}
                className="px-5 py-3 bg-[var(--accent-gold)] text-slate-950 font-bold text-sm custom-geometry hover:opacity-90 disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-md transition-all"
              >
                {isConsulting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Consult Advisor</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Past Consultations Switcher Pill Bar (if history exists) */}
          {(activeCase.advisorConsultationHistory && activeCase.advisorConsultationHistory.length > 1) && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] shrink-0">
                Recent Consultations:
              </span>
              {activeCase.advisorConsultationHistory.map((hist, idx) => (
                <button
                  key={hist.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveConsultation(hist);
                  }}
                  className={`px-3 py-1 custom-geometry font-mono text-xs shrink-0 border transition-all ${
                    activeConsultation.id === hist.id
                      ? 'bg-[var(--accent-gold)] text-slate-950 font-bold border-[var(--accent-gold)]'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                  }`}
                >
                  #{idx + 1}: {hist.topic.length > 25 ? hist.topic.slice(0, 25) + '...' : hist.topic}
                </button>
              ))}
            </div>
          )}

          {/* Pro Se Legal Advisory Memorandum (Official Document Rendering) */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] custom-geometry shadow-2xl p-6 md:p-8 space-y-6">
            {/* Memo Document Header */}
            <div className="border-b-2 border-double border-[var(--border-color)] pb-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AluLogo size="sm" showLabel={true} />
                  <span className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                    PRO SE LITIGATION ADVISORY MEMORANDUM
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyConsultMemo}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] custom-geometry transition-all"
                  >
                    {copiedConsultMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
                    <span>{copiedConsultMemo ? 'Copied Memo!' : 'Copy Advice Memo'}</span>
                  </button>

                  <button
                    onClick={handlePrintMemo}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 custom-geometry hover:opacity-90 shadow-sm transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Brief</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-mono bg-[var(--bg-secondary)] p-3 custom-geometry border border-[var(--border-color)]">
                <div>
                  <span className="text-[var(--text-muted)]">MATTER:</span>
                  <div className="font-bold text-[var(--text-main)] truncate">{activeCase.title}</div>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">JURISDICTION:</span>
                  <div className="font-bold text-[var(--text-main)]">{countryInfo.flag} {activeCase.state} Court</div>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">INQUIRY SUBJECT:</span>
                  <div className="font-bold text-[var(--accent-gold)] truncate">{activeConsultation.topic}</div>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">DATE GENERATED:</span>
                  <div className="font-bold text-[var(--text-main)]">{new Date(activeConsultation.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Section 1: Executive Viability Summary */}
            <div className="bg-[var(--badge-bg)] border-l-4 border-[var(--accent-gold)] p-5 custom-geometry space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-gold)] tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>1. Executive Legal Summary &amp; Viability Verdict</span>
              </div>
              <p className="text-sm md:text-base text-[var(--text-main)] leading-relaxed font-sans font-medium">
                {activeConsultation.summary}
              </p>
            </div>

            {/* Section 2: Applicable Statutes & Governing Authorities */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                <BookOpen className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>2. Governing Statutes &amp; Legal Authorities ({activeConsultation.statutesAndAuthorities.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeConsultation.statutesAndAuthorities.map((statute, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry flex items-start justify-between gap-3 hover:border-[var(--accent-gold)] transition-all"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="text-[10px] font-mono text-[var(--accent-gold)] uppercase font-bold">
                        Authority #{idx + 1}
                      </div>
                      <p className="text-xs text-[var(--text-main)] font-medium leading-relaxed">
                        {statute}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyCitation(statute)}
                      className="p-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded hover:border-[var(--accent-gold)] text-[var(--text-muted)] hover:text-[var(--text-main)] shrink-0"
                      title="Copy citation"
                    >
                      {copiedCitation === statute ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Factual Case & Evidentiary Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                <FileText className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>3. Factual Case &amp; Evidentiary Application</span>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry text-sm text-[var(--text-main)] leading-relaxed">
                {activeConsultation.factualCaseAnalysis}
              </div>
            </div>

            {/* Section 4: In-Court Hearing Tactics & Rebuttal Verbatim Script */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                <Gavel className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>4. In-Court Hearing Tactics &amp; Verbatim Rebuttal Script</span>
              </div>
              <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 custom-geometry space-y-2">
                <div className="text-[10px] font-mono uppercase font-bold text-[var(--accent-gold)]">
                  Verbatim Statement to Deliver to Judge:
                </div>
                <blockquote className="text-sm text-[var(--text-main)] italic font-serif leading-relaxed">
                  "{activeConsultation.hearingTacticsAndRebuttal}"
                </blockquote>
              </div>
            </div>

            {/* Section 5: Defense Traps & Critical Pitfalls to Avoid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>5. Defense Traps &amp; Pitfalls to Avoid</span>
              </div>
              <div className="p-4 bg-rose-950/20 border border-rose-800/40 custom-geometry text-xs sm:text-sm text-rose-200 leading-relaxed space-y-1">
                <div className="text-[10px] font-mono uppercase font-bold text-rose-400">
                  Critical Procedural Warning:
                </div>
                <p>{activeConsultation.pitfallsToAvoid}</p>
              </div>
            </div>

            {/* Section 6: Step-by-Step Action Items */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>6. Immediate Action Items Checklist</span>
              </div>
              <div className="space-y-2">
                {activeConsultation.actionItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry text-xs sm:text-sm text-[var(--text-main)]">
                    <span className="w-5 h-5 rounded bg-[var(--accent-gold)] text-slate-950 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Strengths & Overview */}
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
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-color)] justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif font-bold text-lg text-[var(--text-main)]">
                  Identified Risk Areas
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('vulnerabilities')}
                className="text-xs text-[var(--accent-gold)] font-bold hover:underline"
              >
                Resolve Checklist →
              </button>
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

          {/* Financial Assessment Card */}
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
                  {countryInfo.currencySymbol}{report.financialAssessment.claimedDamages.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)]/60">
                <span className="text-[var(--text-muted)]">Realistic Recovery:</span>
                <span className="font-mono font-bold text-lg text-emerald-400">
                  {countryInfo.currencySymbol}{report.financialAssessment.realisticRecoveryEstimate.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)]/60">
                <span className="text-[var(--text-muted)]">Estimated Court Filing Fee:</span>
                <span className="font-mono font-semibold text-[var(--text-main)]">
                  {countryInfo.currencySymbol}{report.financialAssessment.courtFilingCostEstimate}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-[var(--text-muted)]">Target Settle Floor:</span>
                <span className="font-mono font-semibold text-[var(--accent-gold)]">
                  {countryInfo.currencySymbol}{report.financialAssessment.recommendedSettlementFloor.toLocaleString()}
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

      {/* Tab 2: Interactive Vulnerability Remediation Checklist */}
      {activeTab === 'vulnerabilities' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 custom-geometry space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[var(--border-color)]">
            <div>
              <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
                Vulnerability Remediation & Score Booster Checklist
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono pt-1">
                Ticking off completed remediation tasks immediately raises your case Merit Rating and Win Probability score.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--text-muted)]">Resolved:</span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-mono font-bold text-xs">
                {report.vulnerabilityItems?.filter(v => v.isResolved).length || 0} / {report.vulnerabilityItems?.length || 0}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {report.vulnerabilityItems?.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggleVulnerability(item.id)}
                className={`p-4 border custom-geometry cursor-pointer transition-all flex items-start gap-4 ${
                  item.isResolved
                    ? 'bg-emerald-950/20 border-emerald-500/50 hover:bg-emerald-950/30'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-gold)]'
                }`}
              >
                <div className="pt-0.5 shrink-0 text-xl">
                  {item.isResolved ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-[var(--text-muted)]" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className={`text-base font-bold font-serif ${item.isResolved ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                      {item.title}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      item.isResolved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {item.isResolved ? 'RESOLVED (+Bonus Applied)' : `+${item.scoreBonus}% Win Boost Available`}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry text-xs text-[var(--text-main)] flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                    <span><strong>Remedy:</strong> {item.remedyAction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Predicted Defenses & Custom Opposing Argument Builder */}
      {activeTab === 'defenses' && (
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
                Anticipated Opposing Defenses & Rebuttals ({report.predictedDefenses.length})
              </h2>
              <p className="text-xs font-mono text-[var(--text-muted)] pt-1">
                Specific court rebuttals and statutory citations to dismantle defendant arguments.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setIsAddDefenseModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 custom-geometry hover:opacity-90 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Custom Opposing Defense</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {report.predictedDefenses.map((def, idx) => (
              <div key={def.id || idx} className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-5 custom-geometry space-y-4 shadow-sm hover:border-[var(--accent-gold)]/60 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded uppercase">
                          {def.isCustom ? 'Custom User Defense' : `Predicted Defense #${idx + 1}`}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] rounded">
                          {def.likelihood} Likelihood
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[var(--text-main)] font-serif pt-1">
                        {def.defenseTitle}
                      </h3>
                    </div>
                    {def.isCustom && def.id && (
                      <button
                        onClick={() => handleDeleteCustomDefense(def.id!)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="Delete custom defense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-rose-950/20 border border-rose-800/40 custom-geometry text-rose-200">
                      <div className="text-[10px] font-mono uppercase font-bold text-rose-400 mb-1">
                        What Defendant Will Argue:
                      </div>
                      {def.opposingArgument}
                    </div>

                    <div className="p-3.5 bg-[var(--badge-bg)] border-l-4 border-[var(--accent-gold)] custom-geometry text-[var(--text-main)]">
                      <div className="text-[10px] font-mono uppercase font-bold text-[var(--accent-gold)] mb-1">
                        Your Winning Counter-Rebuttal:
                      </div>
                      {def.counterStrategy}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]/60">
                  <Scale className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>Authority: {def.statutoryBasis}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Trial vs Settlement Expected Value (EV) Simulator */}
      {activeTab === 'ev_calculator' && (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] p-6 md:p-8 custom-geometry space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
                Litigation Expected Value (EV) Decision Engine
              </h2>
              <p className="text-xs font-mono text-[var(--text-muted)] pt-1">
                Mathematical risk modeling comparing guaranteed settlement offers against trial trial outcomes after all court costs and lost wages.
              </p>
            </div>
            <div className={`px-4 py-2 custom-geometry font-bold text-sm border font-mono ${
              evDelta > 0 
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' 
                : 'bg-amber-950/40 border-amber-500/60 text-amber-300'
            }`}>
              {evDelta > 0 ? '✓ MATHEMATICALLY FAVORABLE TO PROCEED TO TRIAL' : '⚠️ FAVORABLE TO ACCEPT SETTLEMENT OFFER'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Financial Variables Slider */}
            <div className="space-y-4 bg-[var(--bg-secondary)] p-5 custom-geometry border border-[var(--border-color)]">
              <h3 className="font-serif font-bold text-base text-[var(--text-main)] border-b border-[var(--border-color)] pb-2">
                Dispute Inputs & Variables
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Defendant Settlement Offer:</span>
                  <span className="font-mono font-bold text-[var(--accent-gold)]">{countryInfo.currencySymbol}{currentSettlementOffer.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={report.financialAssessment.claimedDamages}
                  step="50"
                  value={currentSettlementOffer}
                  onChange={e => setCurrentSettlementOffer(parseInt(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Estimated Court Filing Fee:</span>
                  <span className="font-mono font-bold text-[var(--text-main)]">{countryInfo.currencySymbol}{report.financialAssessment.courtFilingCostEstimate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Hearing Day Lost Wages:</span>
                  <span className="font-mono font-bold text-[var(--text-main)]">{countryInfo.currencySymbol}{wageLossHearingDay}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="25"
                  value={wageLossHearingDay}
                  onChange={e => setWageLossHearingDay(parseInt(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Travel, Parking & Copies:</span>
                  <span className="font-mono font-bold text-[var(--text-main)]">{countryInfo.currencySymbol}{travelParkingCosts}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={travelParkingCosts}
                  onChange={e => setTravelParkingCosts(parseInt(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>
            </div>

            {/* Column 2: Expected Trial Outcome */}
            <div className="space-y-4 bg-[var(--bg-secondary)] p-5 custom-geometry border border-[var(--border-color)] flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center justify-between">
                  <span>Trial Scenario ({countryInfo.currencySymbol}EV)</span>
                  <span className="text-xs font-mono text-emerald-400">{report.winProbabilityScore}% Win Odds</span>
                </h3>

                <div className="space-y-3 pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Claimed Recovery:</span>
                    <span className="font-mono font-bold">{countryInfo.currencySymbol}{report.financialAssessment.claimedDamages.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Expected Gross Win:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {countryInfo.currencySymbol}{Math.round((report.winProbabilityScore / 100) * report.financialAssessment.claimedDamages).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Total Trial Costs:</span>
                    <span className="font-mono font-bold text-rose-400">-{countryInfo.currencySymbol}{totalTrialCosts}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry text-center space-y-1">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Net Expected Trial Value</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-400">
                  {countryInfo.currencySymbol}{expectedTrialValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Column 3: Guaranteed Settlement Offer */}
            <div className="space-y-4 bg-[var(--bg-secondary)] p-5 custom-geometry border border-[var(--border-color)] flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center justify-between">
                  <span>Settlement Offer (100% Certain)</span>
                  <span className="text-xs font-mono text-amber-400">Zero Trial Risk</span>
                </h3>

                <div className="space-y-3 pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Offered Cash Amount:</span>
                    <span className="font-mono font-bold">{countryInfo.currencySymbol}{currentSettlementOffer.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Trial Costs Incurred:</span>
                    <span className="font-mono font-bold text-emerald-400">{countryInfo.currencySymbol}0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Collection Timeframe:</span>
                    <span className="font-mono font-bold text-[var(--text-main)]">7-14 Days</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry text-center space-y-1">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Guaranteed Net In-Pocket</span>
                <div className="text-2xl font-extrabold font-mono text-[var(--accent-gold)]">
                  {countryInfo.currencySymbol}{netSettlementValue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Step-by-Step Action Roadmap */}
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

      {/* Tab 6: Real-Life Legal Aid & Local Court Directory */}
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

      {/* Modal: Add Custom Defense Argument */}
      {isAddDefenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] max-w-lg w-full custom-geometry p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[var(--accent-gold)]" />
                <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                  Add Custom Opposing Defense
                </h3>
              </div>
              <button
                onClick={() => setIsAddDefenseModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomDefense} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[var(--text-muted)] uppercase font-bold">Defense Label / Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Pre-existing wear or Lack of formal notice"
                  value={newDefenseTitle}
                  onChange={e => setNewDefenseTitle(e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)] uppercase font-bold">Likelihood of Defendant Raising This</label>
                <select
                  value={newLikelihood}
                  onChange={e => setNewLikelihood(e.target.value as any)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none font-sans"
                >
                  <option value="High">High Likelihood (Primary Defense)</option>
                  <option value="Medium">Medium Likelihood (Secondary Rebuttal)</option>
                  <option value="Low">Low Likelihood (Fringe / Unlikely)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)] uppercase font-bold">What the Defendant Will Argue / Claim</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Defendant claimed the leak was caused by abnormal tenant negligence."
                  value={newOpposingArgument}
                  onChange={e => setNewOpposingArgument(e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none font-sans"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)] uppercase font-bold">Your Counter-Strategy & Evidence Rebuttal</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Submit timestamped move-in inspection and plumber receipt proving pre-existing main line failure."
                  value={newCounterStrategy}
                  onChange={e => setNewCounterStrategy(e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none font-sans"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)] uppercase font-bold">Statutory Authority / Citation (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Cal. Civ. Code § 1941.1 (Habitability Standards)"
                  value={newStatutoryBasis}
                  onChange={e => setNewStatutoryBasis(e.target.value)}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry text-sm focus:border-[var(--accent-gold)] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDefenseModalOpen(false)}
                  className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry font-bold hover:bg-[var(--bg-hover)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--accent-gold)] text-slate-950 custom-geometry font-bold hover:opacity-90 shadow-sm"
                >
                  Save to Case Defenses
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Second Opinion Legal Disclaimer */}
      <div className="p-4 bg-[var(--bg-card)] border border-amber-500/30 custom-geometry text-xs text-[var(--text-muted)] space-y-1">
        <div className="flex items-center gap-2 text-[var(--accent-gold)] font-bold">
          <Scale className="w-4 h-4" />
          <span>Notice Regarding AI Second Opinion Evaluation:</span>
        </div>
        <p>
          This evaluation memorandum is a diagnostic self-help analysis produced from user-supplied factual data and statutory formulas. It does not constitute formal legal advice, representation, or a guarantee of trial outcome. For formal representation or complex legal questions, consult a licensed attorney.
        </p>
      </div>
    </div>
  );
};
