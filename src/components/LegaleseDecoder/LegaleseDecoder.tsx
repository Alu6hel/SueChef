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
  AlertTriangle,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { LEGAL_LEXICON } from '../../services/lexiconData';
import { LegalTerm } from '../../types';
import { sound } from '../../services/soundEngine';

const SAMPLE_CLAUSES = [
  {
    title: 'Arbitration & Class Action Waiver',
    category: 'Arbitration',
    text: 'Any dispute, claim or controversy arising out of or relating to this Agreement or the breach, termination, enforcement, interpretation or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by binding individual arbitration before AAA and each party waives the right to participate in a class action.'
  },
  {
    title: 'Unilateral Indemnification & Hold Harmless',
    category: 'Indemnity',
    text: 'Customer shall defend, indemnify, and hold harmless Provider, its officers, employees, and agents from and against all liabilities, losses, damages, claims, suits, costs, and legal fees arising out of or related to Customer’s use of the premises or services.'
  },
  {
    title: 'Liquidated Damages Clause ($500/day)',
    category: 'Penalties',
    text: 'In the event Tenant fails to surrender possession by the expiration date, Tenant shall pay liquidated damages in the agreed sum of $500.00 for each calendar day of holdover, which the parties agree is a reasonable pre-estimate of Landlord’s administrative damages.'
  },
  {
    title: '"As-Is" & Complete Warranty Disclaimer',
    category: 'Warranties',
    text: 'The vehicle/property is sold strictly "AS-IS, WHERE-IS" with all faults. Seller makes no representations, warranties, or covenants, express or implied, including the implied warranty of merchantability or fitness for a particular purpose.'
  },
  {
    title: 'Exculpatory Gross Negligence Release',
    category: 'Liability Waiver',
    text: 'Participant hereby forever releases and discharges the Company from any and all liability, claims, or demands arising out of negligence, gross negligence, bodily injury, or property damage sustained while on Company property.'
  },
  {
    title: '24-Hour Landlord Access & Entry Waiver',
    category: 'Landlord-Tenant',
    text: 'Landlord and its authorized agents reserve the right to enter the leased dwelling at any time without prior written notice for inspection, showing, repairs, or general property management purposes.'
  }
];

export const LegaleseDecoder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<LegalTerm>(LEGAL_LEXICON[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedDefinition, setCopiedDefinition] = useState(false);

  // Clause Analyzer State
  const [pastedClause, setPastedClause] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    riskLevel: 'low' | 'moderate' | 'high';
    riskPoints: string[];
    actionItems: string[];
    statutoryDefense: string;
  } | null>(null);

  const filteredTerms = LEGAL_LEXICON.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.plainEnglish.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSpeakTerm = (termText: string) => {
    sound.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(termText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyTerm = () => {
    sound.playDocketStamp();
    const formatted = `LEGAL TERM: ${selectedTerm.term} (${selectedTerm.category.toUpperCase()})
PRONUNCIATION: /${selectedTerm.phonetic || selectedTerm.term}/
PLAIN ENGLISH: ${selectedTerm.plainEnglish}
COURT CONTEXT: ${selectedTerm.courtContext}
PRO SE TACTICAL TIP: ${selectedTerm.proSeTip}
EXAMPLE: "${selectedTerm.exampleSentence}"
-- SueChef Plain-English Legal Lexicon --`;

    navigator.clipboard.writeText(formatted);
    setCopiedDefinition(true);
    setTimeout(() => setCopiedDefinition(false), 2000);
  };

  const handleAnalyzeClause = () => {
    if (!pastedClause.trim()) return;
    sound.playDocketStamp();

    // Deterministic procedural clause parser
    const lower = pastedClause.toLowerCase();
    let risk: 'low' | 'moderate' | 'high' = 'moderate';
    const points: string[] = [];
    const actions: string[] = [];
    let summary = '';
    let statutoryDefense = '';

    if (lower.includes('arbitration') || lower.includes('arbitrate') || lower.includes('class action')) {
      risk = 'high';
      summary = 'Mandatory Binding Arbitration & Class Action Waiver: Strips your constitutional right to take your dispute to a public court or jury.';
      points.push('You cannot file in civil court without first defeating this clause or filing a Small Claims exemption.');
      points.push('Arbitration filing fees often cost $1,500–$5,000+ upfront (though consumer exemption rules under AAA/JAMS may cap consumer share at $250).');
      points.push('Arbitration proceedings are private and have extremely limited appeal rights compared to court judgments.');
      actions.push('Check if the contract provides an "opt-out" window (usually 30 days after signing via certified mail).');
      actions.push('Check if the clause explicitly exempts Small Claims Court disputes (most standardized adhesion contracts do).');
      actions.push('Assert "Procedural and Substantive Unconscionability" if the contract was non-negotiable and one-sided.');
      statutoryDefense = 'California Civil Code § 1670.5 (Unconscionable Contracts) / 9 U.S.C. § 2 (FAA Savings Clause)';
    } else if (lower.includes('indemnify') || lower.includes('hold harmless') || lower.includes('defend')) {
      risk = 'high';
      summary = 'Unilateral Indemnification & Hold Harmless: Forces you to pay the other party\'s legal fees and third-party liabilities if someone sues them.';
      points.push('Extremely dangerous if unreciprocal and placed in standard consumer or tenant contracts.');
      points.push('Could make you financially liable for damages caused entirely by the other party.');
      actions.push('Review whether the indemnity extends to their own gross negligence or willful misconduct (which is void as a matter of public policy in almost all jurisdictions).');
      actions.push('Argue that unilateral indemnity clauses in consumer adhesion contracts violate statutory consumer protection acts.');
      statutoryDefense = 'California Civil Code § 2772-2778 (Indemnity Interpretation) & Public Policy Restraints';
    } else if (lower.includes('liquidated damages') || lower.includes('penalty') || lower.includes('holdover')) {
      risk = 'moderate';
      summary = 'Liquidated Damages Clause: Pre-determines the exact dollar penalty you pay if a breach occurs.';
      points.push('Courts will strike down liquidated damages if they constitute an illegal punitive penalty rather than a reasonable pre-estimate of actual anticipated loss.');
      points.push('If the actual damages are readily ascertainable, fixed contractual penalties are frequently unenforceable.');
      actions.push('Compare the claimed penalty amount against the other party\'s actual provable economic loss.');
      actions.push('Demand itemized accounting and receipts proving their actual damages.');
      statutoryDefense = 'California Civil Code § 1671 (Enforceability of Liquidated Damages)';
    } else if (lower.includes('as is') || lower.includes('where is') || lower.includes('no representations') || lower.includes('merchantability')) {
      risk = 'moderate';
      summary = '"As-Is" / Disclaimer of Warranties: The seller is attempting to waive all implied promises regarding condition, fitness, or quality.';
      points.push('Does NOT protect the seller from affirmative intentional fraud, active concealment of material defects, or statutory disclosure duties.');
      points.push('Many states prohibit "as-is" disclaimers on consumer goods under state Song-Beverly / Lemon Law acts.');
      actions.push('Document all written text messages, emails, or listings where the seller made affirmative oral promises.');
      actions.push('Obtain a certified mechanic or home inspector report showing pre-existing latent defects.');
      statutoryDefense = 'UCC § 2-316 / Cal. Civ. Code § 1790 (Song-Beverly Consumer Warranty Act)';
    } else if (lower.includes('release') || lower.includes('gross negligence') || lower.includes('exculpatory')) {
      risk = 'high';
      summary = 'Exculpatory Liability Waiver: Attempting to extinguish all legal liability for personal injuries or property damage.';
      points.push('Clauses attempting to exempt a party from liability for gross negligence, willful injury, or statutory violations are strictly VOID.');
      actions.push('Establish that the opposing party exhibited gross negligence (a conscious, voluntary act or omission in reckless disregard of consequences).');
      statutoryDefense = 'California Civil Code § 1668 (Contracts Exempting from Responsibility for Fraud/Willful Injury are Void)';
    } else if (lower.includes('enter') || lower.includes('access') || lower.includes('notice') || lower.includes('inspection')) {
      risk = 'moderate';
      summary = 'Landlord Right of Entry / Notice Waiver: Landlord attempting to enter leased premises without statutory advance notice.';
      points.push('Statutory entry rules are non-waivable. Landlords MUST give reasonable written notice (typically 24 hours) during normal business hours.');
      actions.push('Cite statutory quiet enjoyment rights and non-waivability provisions.');
      statutoryDefense = 'California Civil Code § 1954 (Landlord Right of Entry & Mandatory 24-Hour Notice)';
    } else {
      risk = 'low';
      summary = 'Standard Contractual Covenant: Outlines baseline operational duties or general procedural provisions.';
      points.push('Ensure both parties have reciprocal obligations under the plain wording.');
      actions.push('Maintain time-stamped records of compliance.');
      statutoryDefense = 'Restatement (Second) of Contracts § 205 (Duty of Good Faith & Fair Dealing)';
    }

    setAnalysisResult({
      summary,
      riskLevel: risk,
      riskPoints: points,
      actionItems: actions,
      statutoryDefense
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
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
              300+ Term Civil Litigation Lexicon, Latin Maxims &amp; Interactive Contract Clause Risk Analyzer
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
              Interactive Clause &amp; Contract Risk Analyzer
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 card-geom bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)]">
            Instant Procedural Rule Parser
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            placeholder="Paste any confusing contract clause, lease provision, landlord notice, or court order text here (e.g. 'Tenant agrees to waive all claims and submit to binding arbitration...')..."
            value={pastedClause}
            onChange={e => setPastedClause(e.target.value)}
            rows={3}
            className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] p-3 focus:outline-none focus:border-[var(--accent-gold)] font-mono leading-relaxed"
          />

          {/* Quick-Load Sample Clause Buttons */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
              Load Common Trap Clauses for Analysis:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_CLAUSES.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setPastedClause(sc.text);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent-gold)] hover:border-[var(--accent-gold)] custom-geometry transition-all"
                >
                  + {sc.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                sound.playClick();
                setPastedClause('');
                setAnalysisResult(null);
              }}
              className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Input</span>
            </button>

            <button
              onClick={handleAnalyzeClause}
              className="btn-geom px-5 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 shadow-sm"
            >
              Decode &amp; Analyze Clause
            </button>
          </div>
        </div>

        {/* Analysis Result Banner */}
        {analysisResult && (
          <div className="pt-3 border-t border-[var(--border-color)] space-y-4 animate-in fade-in duration-200">
            <div className={`p-4 card-geom border ${
              analysisResult.riskLevel === 'high' 
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' 
                : analysisResult.riskLevel === 'moderate'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-xs uppercase font-mono tracking-wide">
                  RISK ASSESSMENT: {analysisResult.riskLevel.toUpperCase()} LEVEL TRAP
                </span>
                <span className="text-[10px] font-mono">Procedural Defense Analysis</span>
              </div>
              <p className="text-xs font-semibold mt-2 leading-relaxed">{analysisResult.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 space-y-2">
                <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5 font-serif">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Key Legal Traps &amp; Risks</span>
                </div>
                <div className="space-y-1.5">
                  {analysisResult.riskPoints.map((pt, i) => (
                    <div key={i} className="text-[11px] text-[var(--text-muted)] flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 space-y-2">
                <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5 font-serif">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pro Se Rebuttal Action Items</span>
                </div>
                <div className="space-y-1.5">
                  {analysisResult.actionItems.map((act, i) => (
                    <div key={i} className="text-[11px] text-[var(--text-muted)] flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {analysisResult.statutoryDefense && (
              <div className="p-3 bg-[var(--badge-bg)] border border-[var(--badge-border)] custom-geometry text-xs font-mono text-[var(--accent-gold)] flex items-center gap-2">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Statutory Authority &amp; Voidance Standard: {analysisResult.statutoryDefense}</span>
              </div>
            )}
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
              {['all', 'procedural', 'evidence', 'contracts', 'torts', 'latin'].map(cat => (
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
            
            {/* Term Title, Audio Pronunciation & Copy */}
            <div className="border-b border-[var(--border-color)] pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 card-geom bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)]">
                  {selectedTerm.category.toUpperCase()} DEFINITION
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeakTerm(selectedTerm.term)}
                    className={`flex items-center gap-1 px-2 py-1 text-[11px] font-mono border border-[var(--border-color)] custom-geometry transition-all ${
                      isSpeaking ? 'bg-primary text-primary-foreground font-bold animate-pulse' : 'bg-[var(--bg-secondary)] text-[var(--text-main)] hover:text-[var(--accent-gold)]'
                    }`}
                    title="Pronounce with Audio"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    <span>{isSpeaking ? 'Speaking...' : 'Pronounce'}</span>
                  </button>

                  <button
                    onClick={handleCopyTerm}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:text-[var(--accent-gold)] custom-geometry transition-all"
                    title="Copy Definition"
                  >
                    {copiedDefinition ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDefinition ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-0.5">
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-[var(--text-main)]">
                  {selectedTerm.term}
                </h2>
                {selectedTerm.phonetic && (
                  <div className="text-xs font-mono text-[var(--text-muted)] italic">
                    Phonetic Pronunciation: /{selectedTerm.phonetic}/
                  </div>
                )}
              </div>
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

