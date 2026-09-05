import React, { useState, useEffect, useRef } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { ObjectionScenario, WitnessOutline } from '../../types';
import { sound } from '../../services/soundEngine';
import { 
  Gavel, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles,
  Search,
  Plus,
  Trash2,
  Maximize2,
  FileText
} from 'lucide-react';

const SAMPLE_SCENARIOS: ObjectionScenario[] = [
  {
    id: 'obj_1',
    situation: 'During Plaintiff’s direct testimony, Plaintiff attempts to testify about what the landlord’s maintenance worker said.',
    witnessStatement: '"The handyman told me that the roof has been leaking for three years and the landlord refused to buy new shingles."',
    correctObjection: 'Hearsay (FRE 802) / Party Opponent Admission (FRE 801(d)(2)(D))',
    ruleCitation: 'FRE 801(d)(2)(D) / FRE 802',
    explanation: 'Although out-of-court statements are generally inadmissible hearsay under FRE 802, statement by an employee/agent within the scope of employment is an opposing party admission under FRE 801(d)(2)(D) and is NOT hearsay!',
    distractorOptions: [
      'Leading the Witness (FRE 611)',
      'Best Evidence Rule (FRE 1002)',
      'Speculation & Lack of Foundation (FRE 602)'
    ]
  },
  {
    id: 'obj_2',
    situation: 'Defense counsel is conducting direct examination of their own witness (Property Manager).',
    witnessStatement: 'Defense Counsel asks: "And when you arrived at the apartment on August 1st, isn’t it true that the tenant had completely trashed the bathroom?"',
    correctObjection: 'Leading Question on Direct Examination (FRE 611(c))',
    ruleCitation: 'FRE 611(c)',
    explanation: 'Leading questions (questions that suggest the desired answer) are strictly prohibited on DIRECT examination under FRE 611(c). Counsel must ask open-ended questions (e.g. "What did you observe?").',
    distractorOptions: [
      'Hearsay (FRE 802)',
      'Improper Character Evidence (FRE 404)',
      'Relevance (FRE 401)'
    ]
  },
  {
    id: 'obj_3',
    situation: 'Defendant testifies about why Plaintiff left the company or vacated the apartment.',
    witnessStatement: '"I know for a fact the tenant moved out because they ran out of money in their stock investments."',
    correctObjection: 'Speculation & Lack of Personal Knowledge (FRE 602 / FRE 701)',
    ruleCitation: 'FRE 602',
    explanation: 'A witness may not testify to a matter unless evidence is introduced sufficient to support a finding that the witness has personal first-hand knowledge of the matter under FRE 602.',
    distractorOptions: [
      'Best Evidence Rule (FRE 1002)',
      'Authentication (FRE 901)',
      'Compound Question'
    ]
  },
  {
    id: 'obj_4',
    situation: 'Plaintiff presents a photocopy of a bank statement showing the $3,200 wire transfer without producing the original digital bank download.',
    witnessStatement: 'Defendant objects: "Objection, Plaintiff must bring original certified wet-ink bank books!"',
    correctObjection: 'Admissibility of Duplicates (FRE 1003)',
    ruleCitation: 'FRE 1003 & FRE 803(6)',
    explanation: 'A duplicate is admissible to the same extent as the original unless a genuine question is raised about the original’s authenticity under FRE 1003. Certified bank records are admissible duplicates under the Business Records Exception (FRE 803(6)).',
    distractorOptions: [
      'Parol Evidence Rule',
      'Hearsay Exception: Excited Utterance (FRE 803(2))',
      'Judicial Notice (FRE 201)'
    ]
  }
];

const FRE_RULES = [
  {
    rule: 'FRE 401 / 402',
    title: 'Test for Relevant Evidence',
    summary: 'Evidence is relevant if it has any tendency to make a fact more or less probable than it would be without the evidence.',
    proSeTip: 'If opposing counsel objects to relevance, explain to the Judge in one sentence exactly which cause of action or damage element this fact proves.'
  },
  {
    rule: 'FRE 602',
    title: 'Need for Personal Knowledge',
    summary: 'A witness may testify to a matter only if evidence supports that the witness has personal firsthand knowledge.',
    proSeTip: 'Object immediately if the other side testifies about what someone else thought or was feeling.'
  },
  {
    rule: 'FRE 611(c)',
    title: 'Leading Questions',
    summary: 'Leading questions should not be used on direct examination except as necessary to develop the witness\'s testimony.',
    proSeTip: 'Stand up and say: "Objection, Your Honor, leading the witness on direct." Force them to ask open questions.'
  },
  {
    rule: 'FRE 801(d)(2)',
    title: 'Opposing Party Statement / Admission',
    summary: 'An out-of-court statement offered against an opposing party made by the party or their employee/agent is NOT hearsay.',
    proSeTip: 'Defendant’s text messages, emails, and voicemail admissions can ALWAYS be read into evidence under this rule!'
  },
  {
    rule: 'FRE 803(6)',
    title: 'Records of a Regularly Conducted Activity',
    summary: 'Business records made at or near the time by someone with knowledge kept in the regular course of business are admissible exceptions to hearsay.',
    proSeTip: 'Use this rule to admit repair invoices, bank statements, lease ledgers, and certified contractor inspection estimates.'
  },
  {
    rule: 'FRE 1002 / 1003',
    title: 'Best Evidence Rule & Duplicates',
    summary: 'An original writing, recording, or photograph is required, but duplicates are fully admissible unless genuine authenticity is questioned.',
    proSeTip: 'Printed PDFs and digital screenshots are fully admissible duplicates under FRE 1003.'
  }
];

export const TrialPrep: React.FC = () => {
  const { activeCase, updateActiveCase } = useSueChef();
  const [activeTab, setActiveTab] = useState<'simulator' | 'fre' | 'witnesses' | 'speech'>('simulator');

  // Simulator Quiz State
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);

  // FRE Search
  const [freQuery, setFreQuery] = useState('');

  // Speech / Prompter State
  const [prompterMode, setPrompterMode] = useState<'opening' | 'closing'>('opening');
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(activeCase.trialPrep?.teleprompterWpm || 130);
  const prompterRef = useRef<HTMLDivElement>(null);

  // New Witness Form
  const [newWitName, setNewWitName] = useState('');
  const [newWitRole, setNewWitRole] = useState<'plaintiff' | 'defendant' | 'expert' | 'eye_witness'>('plaintiff');
  const [newDirectQ, setNewDirectQ] = useState('');
  const [newCrossTrap, setNewCrossTrap] = useState('');

  const currentScenario = SAMPLE_SCENARIOS[currentScenarioIdx];
  const allChoices = React.useMemo(() => {
    if (!currentScenario) return [];
    return [currentScenario.correctObjection, ...currentScenario.distractorOptions].sort();
  }, [currentScenario]);

  // Teleprompter auto-scroll effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && prompterRef.current) {
      // scroll speed calculated from WPM
      const scrollStep = Math.max(1, Math.round(wpm / 40));
      interval = setInterval(() => {
        if (prompterRef.current) {
          prompterRef.current.scrollTop += scrollStep;
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, wpm]);

  const handleSelectAnswer = (option: string) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setTotalAttempted(prev => prev + 1);

    const isCorrect = selectedAnswer === currentScenario.correctObjection;
    if (isCorrect) {
      sound.playSuccessChime();
      setQuizScore(prev => prev + 1);
    } else {
      sound.playWarningBell();
    }
  };

  const handleNextScenario = () => {
    sound.playClick();
    setIsAnswerSubmitted(false);
    setSelectedAnswer(null);
    setCurrentScenarioIdx(prev => (prev + 1) % SAMPLE_SCENARIOS.length);
  };

  const handleAddWitness = () => {
    if (!newWitName.trim()) return;
    sound.playGavelStrike();

    const newWit: WitnessOutline = {
      id: `wit_${Date.now()}`,
      witnessName: newWitName.trim(),
      witnessRole: newWitRole,
      directQuestions: newDirectQ.trim() ? [newDirectQ.trim()] : [],
      crossExamTraps: newCrossTrap.trim() ? [newCrossTrap.trim()] : [],
      exhibitCitations: []
    };

    updateActiveCase(prev => ({
      ...prev,
      trialPrep: {
        ...prev.trialPrep,
        witnessOutlines: [...(prev.trialPrep?.witnessOutlines || []), newWit]
      }
    }));

    setNewWitName('');
    setNewDirectQ('');
    setNewCrossTrap('');
  };

  const handleDeleteWitness = (id: string) => {
    sound.playClick();
    updateActiveCase(prev => ({
      ...prev,
      trialPrep: {
        ...prev.trialPrep,
        witnessOutlines: (prev.trialPrep?.witnessOutlines || []).filter(w => w.id !== id)
      }
    }));
  };

  const handleSpeechTextChange = (text: string) => {
    updateActiveCase(prev => ({
      ...prev,
      trialPrep: {
        ...prev.trialPrep,
        [prompterMode === 'opening' ? 'openingStatementDraft' : 'closingArgumentDraft']: text
      }
    }));
  };

  const filteredFRE = FRE_RULES.filter(r => 
    r.rule.toLowerCase().includes(freQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(freQuery.toLowerCase()) ||
    r.summary.toLowerCase().includes(freQuery.toLowerCase()) ||
    r.proSeTip.toLowerCase().includes(freQuery.toLowerCase())
  );

  const activeSpeechText = prompterMode === 'opening' 
    ? activeCase.trialPrep?.openingStatementDraft || ''
    : activeCase.trialPrep?.closingArgumentDraft || '';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-card/60 border border-border/80 custom-geometry">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary custom-geometry">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide font-serif">Trial & Hearing Prep Workstation</h1>
            <p className="text-xs text-muted-foreground">
              Master evidentiary objections under fire, structure witness examination traps, and rehearse arguments on the prompter.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 border border-primary/30 custom-geometry">
          <Award className="w-4 h-4 text-amber-400" />
          <div className="text-xs">
            <span className="text-muted-foreground">Evidentiary Accuracy: </span>
            <span className="font-bold text-foreground font-mono">
              {totalAttempted > 0 ? Math.round((quizScore / totalAttempted) * 100) : 100}% ({quizScore}/{totalAttempted})
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/70 pb-3">
        <button
          onClick={() => { sound.playClick(); setActiveTab('simulator'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'simulator'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Objection Simulator / Quiz</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('fre'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'fre'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Rules of Evidence Cheat Sheet</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('witnesses'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'witnesses'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Witness Examination Outlines</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {activeCase.trialPrep?.witnessOutlines?.length || 0}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('speech'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'speech'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Live Argument Teleprompter</span>
        </button>
      </div>

      {/* Tab 1: Objection Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 text-xs text-muted-foreground custom-geometry flex items-center justify-between">
            <span>Scenario {currentScenarioIdx + 1} of {SAMPLE_SCENARIOS.length}</span>
            <span className="font-mono text-primary font-bold">Rule Drills</span>
          </div>

          <div className="p-6 bg-card border border-border custom-geometry space-y-4 shadow-sm">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider font-mono text-primary font-bold">
                Courtroom Situation
              </div>
              <div className="text-sm font-semibold text-foreground">
                {currentScenario.situation}
              </div>
            </div>

            <div className="p-4 bg-muted/60 border-l-4 border-primary custom-geometry">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">Witness Testifies:</span>
              <p className="text-sm font-serif italic text-foreground leading-relaxed">
                {currentScenario.witnessStatement}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                What is your immediate evidentiary objection?
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allChoices.map((choice, idx) => {
                  const isSelected = selectedAnswer === choice;
                  const isCorrect = choice === currentScenario.correctObjection;
                  
                  let btnStyle = 'bg-card border-border/80 text-foreground hover:border-primary/60';
                  if (isSelected && !isAnswerSubmitted) {
                    btnStyle = 'bg-primary/20 border-primary text-primary font-bold';
                  }
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-destructive/20 border-destructive text-destructive font-bold';
                    } else {
                      btnStyle = 'bg-card/40 border-border/40 text-muted-foreground opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(choice)}
                      disabled={isAnswerSubmitted}
                      className={`p-3.5 text-left text-xs border custom-geometry transition-all flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 text-[10px] font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{choice}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ruling & Explanation Feedback */}
            {isAnswerSubmitted && (
              <div className={`p-4 border custom-geometry space-y-2 animate-in fade-in duration-200 ${
                selectedAnswer === currentScenario.correctObjection
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-destructive/10 border-destructive/30 text-destructive-foreground'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {selectedAnswer === currentScenario.correctObjection ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>THE COURT: "SUSTAINED!" (Correct Rule Citation: {currentScenario.ruleCitation})</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-destructive" />
                      <span>THE COURT: "OVERRULED." Correct Objection: {currentScenario.correctObjection}</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {currentScenario.explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40 transition-all custom-geometry"
                >
                  Object to the Judge
                </button>
              ) : (
                <button
                  onClick={handleNextScenario}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold transition-all custom-geometry"
                >
                  Next Trial Scenario &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: FRE Rules Cheat Sheet */}
      {activeTab === 'fre' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={freQuery}
              onChange={(e) => setFreQuery(e.target.value)}
              placeholder="Search Rules of Evidence (e.g. hearsay, relevance, business records, duplicates)..."
              className="w-full bg-input/50 border border-border pl-9 pr-3 py-2.5 text-xs custom-geometry focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFRE.map((item, idx) => (
              <div key={idx} className="p-4 bg-card border border-border custom-geometry space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-primary/15 text-primary border border-primary/30 custom-geometry">
                    {item.rule}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground font-serif">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
                <div className="p-2.5 bg-muted/40 border border-border/40 text-[11px] custom-geometry">
                  <strong className="text-primary font-semibold">Pro Se Courtroom Tip: </strong>
                  <span className="text-foreground/90">{item.proSeTip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Witness Examination Outlines */}
      {activeTab === 'witnesses' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 text-xs leading-relaxed text-muted-foreground custom-geometry">
            <strong className="text-foreground">Direct & Cross Examination Protocols:</strong> On Direct Examination, ask open-ended non-leading questions ("What", "When", "Why"). On Cross Examination, only ask leading yes/no trap questions based directly on written exhibits.
          </div>

          <div className="space-y-4">
            {(activeCase.trialPrep?.witnessOutlines || []).map((wit) => (
              <div key={wit.id} className="p-5 bg-card border border-border custom-geometry space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-primary/15 text-primary border border-primary/30 custom-geometry mr-2">
                      {wit.witnessRole}
                    </span>
                    <h3 className="text-sm font-bold text-foreground inline">{wit.witnessName}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteWitness(wit.id)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {wit.directQuestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                      Direct Examination Outline (Open Questions)
                    </div>
                    <ul className="space-y-1.5 pl-4 text-xs list-decimal text-muted-foreground">
                      {wit.directQuestions.map((q, qIdx) => (
                        <li key={qIdx} className="leading-relaxed text-foreground">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {wit.crossExamTraps.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono">
                      Cross-Examination Traps (Leading Yes/No Lock-Ins)
                    </div>
                    <ul className="space-y-1.5 pl-4 text-xs list-disc text-amber-300/90">
                      {wit.crossExamTraps.map((trap, tIdx) => (
                        <li key={tIdx} className="leading-relaxed">{trap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Witness */}
          <div className="p-4 bg-card border border-dashed border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Add Witness Examination Outline</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Witness Full Name</label>
                <input
                  type="text"
                  value={newWitName}
                  onChange={(e) => setNewWitName(e.target.value)}
                  placeholder="e.g., Alex Johnson (Contractor Foreman)"
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Witness Role</label>
                <select
                  value={newWitRole}
                  onChange={(e) => setNewWitRole(e.target.value as any)}
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
                >
                  <option value="plaintiff">Plaintiff</option>
                  <option value="defendant">Defendant / Adverse Witness</option>
                  <option value="expert">Expert Witness (Inspector / Appraiser)</option>
                  <option value="eye_witness">Eye Witness / Third Party</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Direct Examination Question</label>
              <textarea
                rows={2}
                value={newDirectQ}
                onChange={(e) => setNewDirectQ(e.target.value)}
                placeholder="e.g., What did you observe when you inspected the bathroom plumbing on October 14th?"
                className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Cross-Examination Trap Question (Yes/No)</label>
              <textarea
                rows={2}
                value={newCrossTrap}
                onChange={(e) => setNewCrossTrap(e.target.value)}
                placeholder="e.g., Isn't it true that you never obtained a building permit prior to beginning demolition?"
                className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
              />
            </div>

            <button
              onClick={handleAddWitness}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
            >
              Add Witness Outline
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Live Teleprompter */}
      {activeTab === 'speech' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card border border-border custom-geometry">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { sound.playClick(); setPrompterMode('opening'); }}
                className={`px-3 py-1.5 text-xs font-semibold custom-geometry ${
                  prompterMode === 'opening' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                Opening Statement
              </button>
              <button
                onClick={() => { sound.playClick(); setPrompterMode('closing'); }}
                className={`px-3 py-1.5 text-xs font-semibold custom-geometry ${
                  prompterMode === 'closing' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                Closing Argument
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Speed: </span>
                <span className="font-mono font-bold text-foreground">{wpm} WPM</span>
                <input
                  type="range"
                  min="90"
                  max="190"
                  step="5"
                  value={wpm}
                  onChange={(e) => setWpm(parseInt(e.target.value))}
                  className="w-24 accent-primary"
                />
              </div>

              <button
                onClick={() => { sound.playClick(); setIsPlaying(!isPlaying); }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold custom-geometry shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Prompter' : 'Start Prompter'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  if (prompterRef.current) prompterRef.current.scrollTop = 0;
                  setIsPlaying(false);
                }}
                className="p-1.5 bg-muted text-muted-foreground hover:text-foreground custom-geometry"
                title="Reset to Top"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prompter Visual Viewport */}
          <div
            ref={prompterRef}
            className="h-80 overflow-y-auto bg-black border-2 border-primary/40 p-8 custom-geometry font-serif text-lg leading-loose text-amber-100 select-none shadow-inner scroll-smooth"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center font-mono text-xs uppercase tracking-widest text-primary/70 pb-4 border-b border-primary/20">
                PRO SE COURTROOM ORAL ARGUMENT PROMPTER • {prompterMode.toUpperCase()}
              </div>
              <p className="whitespace-pre-wrap">{activeSpeechText}</p>
              <div className="text-center font-mono text-xs uppercase tracking-widest text-emerald-400 pt-8 pb-16">
                [ CONCLUDE ARGUMENT &amp; REQUEST ENTRY OF JUDGMENT ]
              </div>
            </div>
          </div>

          {/* Editable Draft */}
          <div className="p-4 bg-card border border-border custom-geometry space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Edit {prompterMode === 'opening' ? 'Opening Statement' : 'Closing Argument'} Script Draft
            </label>
            <textarea
              rows={6}
              value={activeSpeechText}
              onChange={(e) => handleSpeechTextChange(e.target.value)}
              className="w-full bg-input/50 border border-border p-3 text-xs font-serif leading-relaxed focus:outline-none focus:border-primary custom-geometry"
            />
          </div>
        </div>
      )}
    </div>
  );
};
