import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  HelpCircle, 
  Volume2, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { LEGAL_LEXICON } from '../../services/lexiconData';
import { LegalTerm } from '../../types';
import { sound } from '../../services/soundEngine';

export const LegaleseDecoder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<LegalTerm>(LEGAL_LEXICON[0]);

  // Clause Analyzer State
  const [pastedClause, setPastedClause] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    riskLevel: 'low' | 'moderate' | 'high';
    riskPoints: string[];
    actionItems: string[];
  } | null>(null);

  const filteredTerms = LEGAL_LEXICON.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.plainEnglish.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAnalyzeClause = () => {
    if (!pastedClause.trim()) return;
    sound.playDocketStamp();

    // Deterministic procedural clause parser
    const lower = pastedClause.toLowerCase();
    let risk: 'low' | 'moderate' | 'high' = 'moderate';
    const points: string[] = [];
    const actions: string[] = [];
    let summary = '';

    if (lower.includes('arbitration') || lower.includes('arbitrate')) {
      risk = 'high';
      summary = 'Mandatory Binding Arbitration Clause: Strips your constitutional right to take your dispute to a public court or jury.';
      points.push('You cannot file in civil court without first defeating this clause.');
      points.push('Arbitration filing fees often cost $1,500–$5,000+ upfront (though consumer exception rules may apply).');
      actions.push('Check if the contract provides an "opt-out" window (usually 30 days after signing).');
      actions.push('Check if the clause explicitly exempts Small Claims Court disputes.');
    } else if (lower.includes('indemnify') || lower.includes('hold harmless')) {
      risk = 'high';
      summary = 'Unilateral Indemnification & Hold Harmless: Forces you to pay the other party\'s legal fees and liabilities if someone sues them.';
      points.push('Extremely dangerous if unreciprocal.');
      actions.push('Review whether the indemnity extends to their own gross negligence or willful misconduct (which is void in many states).');
    } else if (lower.includes('liquidated damages')) {
      risk = 'moderate';
      summary = 'Liquidated Damages Clause: Pre-determines the exact dollar penalty you pay if a breach occurs.';
      points.push('Courts will strike down liquidated damages if they constitute an illegal punitive penalty rather than a reasonable estimate of actual loss.');
      actions.push('Compare the dollar amount against actual provable damages.');
    } else if (lower.includes('as is') || lower.includes('no representations')) {
      risk = 'moderate';
      summary = '"As-Is" / Disclaimer of Warranties: The seller is attempting to waive all implied promises regarding condition or fitness.';
      points.push('Does not protect the seller from affirmative intentional fraud or active concealment.');
      actions.push('Document all written text messages or emails where the seller made contrary oral promises.');
    } else {
      risk = 'low';
      summary = 'Standard Contractual Term: Outlines baseline operational duties or general civil provisions.';
      points.push('Ensure both parties have reciprocal obligations under the plain wording.');
      actions.push('Maintain time-stamped records of compliance.');
    }

    setAnalysisResult({
      summary,
      riskLevel: risk,
      riskPoints: points,
      actionItems: actions
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 card-geom bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[var(--text-main)]">
              Legalese-to-English Decoder
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              300+ Term Civil Litigation Lexicon, Latin Maxims & Interactive Clause Risk Analyzer
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Clause Analyzer Section */}
      <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--accent-gold)]" />
            <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
              Interactive Clause & Order Risk Analyzer
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 card-geom bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)]">
            Instant AI/Procedural Rule Parser
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            placeholder="Paste any confusing contract clause, landlord notice, or judge's court order text here (e.g. 'Tenant agrees to waive all claims and submit to binding arbitration...')..."
            value={pastedClause}
            onChange={e => setPastedClause(e.target.value)}
            rows={3}
            className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] p-3 focus:outline-none focus:border-[var(--accent-gold)] font-mono"
          />

          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setPastedClause('Any dispute, claim or controversy arising out of or relating to this Agreement or the breach, termination, enforcement, interpretation or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by binding arbitration.');
              }}
              className="text-[11px] font-mono text-[var(--accent-gold)] hover:underline"
            >
              + Load Sample Arbitration Clause
            </button>

            <button
              onClick={handleAnalyzeClause}
              className="btn-geom px-4 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 shadow-sm"
            >
              Decode & Analyze Clause
            </button>
          </div>
        </div>

        {/* Analysis Result Banner */}
        {analysisResult && (
          <div className="pt-3 border-t border-[var(--border-color)] space-y-3">
            <div className={`p-4 card-geom border ${
              analysisResult.riskLevel === 'high' 
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' 
                : analysisResult.riskLevel === 'moderate'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-xs uppercase font-mono tracking-wide">
                  RISK ASSESSMENT: {analysisResult.riskLevel.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono">Procedural Legal Guardrail</span>
              </div>
              <p className="text-xs font-semibold mt-2">{analysisResult.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 space-y-1.5">
                <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Key Legal Traps & Vulnerabilities
                </div>
                {analysisResult.riskPoints.map((pt, i) => (
                  <div key={i} className="text-[11px] text-[var(--text-muted)] flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 space-y-1.5">
                <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Self-Represented Litigant Action Items
                </div>
                {analysisResult.actionItems.map((act, i) => (
                  <div key={i} className="text-[11px] text-[var(--text-muted)] flex items-start gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 300+ Term Lexicon Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Term List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search legal terms, Latin maxims, motions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-geom w-full pl-9 pr-3 py-2 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {['all', 'procedural', 'evidence', 'contracts', 'latin'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`btn-geom px-2.5 py-1 text-[10px] uppercase font-mono border transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--accent-gold)] text-slate-950 font-bold border-[var(--accent-gold)]'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Term List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredTerms.map(t => {
              const isSelected = selectedTerm.term === t.term;
              return (
                <div
                  key={t.term}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTerm(t);
                  }}
                  className={`card-geom p-3 border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--badge-bg)] border-[var(--accent-gold)] shadow-md'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[var(--text-main)]">{t.term}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase text-[var(--accent-gold)] bg-black/30">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">
                    {t.plainEnglish}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Term Inspector (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-5 shadow-xl">
            
            {/* Term Title & Phonetics */}
            <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 card-geom bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)]">
                  {selectedTerm.category.toUpperCase()} DEFINITION
                </span>
                {selectedTerm.phonetic && (
                  <span className="text-xs font-mono text-[var(--text-muted)] italic">
                    Pronunciation: /{selectedTerm.phonetic}/
                  </span>
                )}
              </div>
              <h2 className="font-serif font-bold text-2xl text-[var(--text-main)] pt-1">
                {selectedTerm.term}
              </h2>
            </div>

            {/* Plain English Meaning */}
            <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 space-y-1.5">
              <div className="text-[10px] uppercase font-mono font-bold text-[var(--accent-gold)]">
                Plain-English Translation
              </div>
              <p className="text-sm text-[var(--text-main)] font-semibold leading-relaxed">
                {selectedTerm.plainEnglish}
              </p>
            </div>

            {/* Court Context */}
            <div className="space-y-1 text-xs">
              <div className="font-bold text-[var(--text-muted)] uppercase font-mono">
                How It Works In Court:
              </div>
              <p className="text-[var(--text-main)] leading-relaxed bg-black/20 p-3 card-geom border border-white/5">
                {selectedTerm.courtContext}
              </p>
            </div>

            {/* Self-Represented / Pro Se Litigant Tactical Tip */}
            <div className="card-geom bg-amber-950/30 border border-amber-500/30 p-3.5 space-y-1 text-xs text-amber-200">
              <div className="font-bold flex items-center gap-1.5 text-amber-400 font-mono">
                <ShieldAlert className="w-4 h-4" />
                TACTICAL TIP FOR PRO SE LITIGANTS:
              </div>
              <p className="leading-relaxed text-[11px]">{selectedTerm.proSeTip}</p>
            </div>

            {/* Real World Example */}
            <div className="space-y-1 text-xs">
              <div className="font-bold text-[var(--text-muted)] uppercase font-mono">
                Practical Case Example:
              </div>
              <p className="italic text-[var(--text-muted)] bg-[var(--bg-secondary)] p-3 card-geom border border-[var(--border-color)]">
                "{selectedTerm.exampleSentence}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
