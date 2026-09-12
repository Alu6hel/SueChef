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
  FileText,
  Tag,
  Wand2,
  Scale,
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { MockHearingEngine, MockJudgeQuestion, HearingEvaluationResult } from '../../services/mockHearingEngine';

const SAMPLE_SCENARIOS: ObjectionScenario[] = [
  {
    id: 'obj_1',
    situation: 'During Plaintiff’s direct testimony, Plaintiff attempts to testify about what the landlord’s property manager said during a telephone call.',
    witnessStatement: '"The property manager told me directly that the HVAC unit had been broken since last winter and the owner refused to approve repair funds."',
    correctObjection: 'Opposing Party Statement / Admission (FRE 801(d)(2)(D)) — Overruled (Admissible)',
    ruleCitation: 'FRE 801(d)(2)(D) / FRE 802',
    explanation: 'Although out-of-court statements are generally hearsay under FRE 802, statements made by an opposing party or their authorized agent/employee concerning a matter within the scope of employment are OPPOSING PARTY ADMISSIONS under FRE 801(d)(2)(D) and are NOT hearsay!',
    distractorOptions: [
      'Leading the Witness (FRE 611(c))',
      'Best Evidence Rule (FRE 1002)',
      'Speculation & Lack of Foundation (FRE 602)'
    ]
  },
  {
    id: 'obj_2',
    situation: 'Defense counsel is conducting direct examination of their own witness (Property Supervisor).',
    witnessStatement: 'Defense Counsel asks: "And when you inspected the premises on July 1st, isn’t it true that the tenant had completely trashed the bathroom and left excessive trash everywhere?"',
    correctObjection: 'Leading Question on Direct Examination (FRE 611(c)) — Sustained',
    ruleCitation: 'FRE 611(c)',
    explanation: 'Leading questions (questions that suggest the desired answer or put words in the witness’s mouth) are strictly prohibited on DIRECT examination under FRE 611(c). Counsel must ask non-leading open questions (e.g. "What did you observe?").',
    distractorOptions: [
      'Hearsay (FRE 802)',
      'Improper Character Evidence (FRE 404)',
      'Relevance (FRE 401)'
    ]
  },
  {
    id: 'obj_3',
    situation: 'Defendant testifies about why Plaintiff left the company or vacated the rental premises.',
    witnessStatement: '"I know for a fact the tenant moved out because they ran out of money and lost all their savings in crypto investments."',
    correctObjection: 'Speculation & Lack of Personal Knowledge (FRE 602 / FRE 701) — Sustained',
    ruleCitation: 'FRE 602 & FRE 701',
    explanation: 'Under FRE 602, a witness may not testify to a matter unless evidence is introduced sufficient to support a finding that the witness has personal first-hand knowledge of the matter. Guessing at another person\'s private financial situation is improper speculation.',
    distractorOptions: [
      'Best Evidence Rule (FRE 1002)',
      'Authentication (FRE 901)',
      'Compound Question'
    ]
  },
  {
    id: 'obj_4',
    situation: 'Plaintiff presents a printed PDF of an official bank wire confirmation showing the $3,200 payment without bringing the original wet-ink passbook.',
    witnessStatement: 'Defendant objects: "Objection, Plaintiff must bring the original physical bank teller log under the Best Evidence Rule!"',
    correctObjection: 'Admissibility of Duplicates (FRE 1003) & Business Records (FRE 803(6)) — Overruled',
    ruleCitation: 'FRE 1003 & FRE 803(6)',
    explanation: 'Under FRE 1003, a duplicate (including digital printouts, PDFs, and electronic copies) is admissible to the same extent as the original unless a genuine question is raised about the authenticity. Regular bank statements qualify as business records.',
    distractorOptions: [
      'Parol Evidence Rule',
      'Hearsay Exception: Excited Utterance (FRE 803(2))',
      'Judicial Notice (FRE 201)'
    ]
  },
  {
    id: 'obj_5',
    situation: 'In a breach of contract claim, Defendant attempts to bring up that Plaintiff was sued in small claims court by an unrelated car dealer 5 years ago.',
    witnessStatement: 'Defense Counsel asks: "Isn’t it true you were sued for an unpaid credit card balance back in 2021?"',
    correctObjection: 'Improper Character Evidence & Unfair Prejudice (FRE 404(b) & FRE 403) — Sustained',
    ruleCitation: 'FRE 404(b) / FRE 403',
    explanation: 'Evidence of any other crime, wrong, or act is not admissible to prove a person’s character in order to show that on a particular occasion the person acted in accordance with the character. Prior unrelated debts have zero relevance to this contract.',
    distractorOptions: [
      'Hearsay (FRE 802)',
      'Best Evidence Rule (FRE 1002)',
      'Lack of Foundation (FRE 901)'
    ]
  },
  {
    id: 'obj_6',
    situation: 'Plaintiff introduces a printed screenshot of an SMS text message conversation without having the recipient or sender confirm it was sent from their phone.',
    witnessStatement: 'Defendant objects: "Objection, there is no proof this text message was actually sent by my client!"',
    correctObjection: 'Lack of Authentication & Foundation (FRE 901(a)) — Sustained until Authenticated',
    ruleCitation: 'FRE 901(a) / FRE 902(13)',
    explanation: 'Under FRE 901, the proponent must produce evidence sufficient to support a finding that the item is what the proponent claims it is. The witness must testify: "I sent this from phone number X to Defendant’s phone number Y on Date Z and received this exact reply."',
    distractorOptions: [
      'Leading Question (FRE 611)',
      'Parol Evidence Rule',
      'Double Hearsay (FRE 805)'
    ]
  },
  {
    id: 'obj_7',
    situation: 'Defense Counsel asks Plaintiff a complex four-part question on cross-examination.',
    witnessStatement: '"Didn’t you sign the lease on June 1st, notice the water leak on June 3rd, fail to email the office until July 10th, and refuse the repair technician on July 12th?"',
    correctObjection: 'Compound Question (FRE 611(a)) — Sustained',
    ruleCitation: 'FRE 611(a)',
    explanation: 'A compound question contains multiple separate factual inquiries joined together, making it impossible for the witness to give a single truthful yes or no answer. Counsel must split each question into separate individual inquiries.',
    distractorOptions: [
      'Hearsay (FRE 802)',
      'Best Evidence Rule (FRE 1002)',
      'Relevance (FRE 401)'
    ]
  },
  {
    id: 'obj_8',
    situation: 'Plaintiff asks Defendant’s witness a simple yes/no question, but the witness launches into a 3-minute promotional speech about their company philosophy.',
    witnessStatement: 'Witness: "Well, our company was founded in 1982 by my grandfather and we have won awards for community service and we always strive to be good neighbors..."',
    correctObjection: 'Non-Responsive Witness / Motion to Strike (FRE 611(a)) — Sustained',
    ruleCitation: 'FRE 611(a)',
    explanation: 'When a witness refuses to answer the question asked and instead volunteers irrelevant self-serving commentary, the examining party may object that the answer is non-responsive and move to strike the testimony from the court record.',
    distractorOptions: [
      'Hearsay (FRE 802)',
      'Leading the Witness (FRE 611(c))',
      'Lack of Foundation (FRE 901)'
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
    rule: 'FRE 403',
    title: 'Excluding Relevant Evidence for Prejudice or Confusion',
    summary: 'The court may exclude relevant evidence if its probative value is substantially outweighed by a danger of unfair prejudice, confusing the issues, or wasting time.',
    proSeTip: 'Object under FRE 403 if the other side tries to introduce irrelevant personal insults or past unrelated disputes.'
  },
  {
    rule: 'FRE 602',
    title: 'Need for Personal Knowledge',
    summary: 'A witness may testify to a matter only if evidence supports that the witness has personal firsthand knowledge.',
    proSeTip: 'Object immediately if the other side testifies about what someone else thought or was feeling.'
  },
  {
    rule: 'FRE 611(c)',
    title: 'Leading Questions on Direct vs Cross',
    summary: 'Leading questions should not be used on direct examination except as necessary. Leading questions ARE permitted and encouraged on cross-examination.',
    proSeTip: 'On Direct: ask open questions. On Cross: ask only leading yes/no trap questions.'
  },
  {
    rule: 'FRE 801(d)(2)',
    title: 'Opposing Party Statement / Admission',
    summary: 'An out-of-court statement offered against an opposing party made by the party or their employee/agent is NOT hearsay.',
    proSeTip: 'Defendant’s text messages, emails, voicemails, and employee statements can ALWAYS be read into evidence under this rule!'
  },
  {
    rule: 'FRE 803(6)',
    title: 'Records of a Regularly Conducted Activity (Business Records)',
    summary: 'Business records made at or near the time by someone with knowledge kept in the regular course of business are admissible exceptions to hearsay.',
    proSeTip: 'Use this rule to admit repair invoices, bank statements, lease ledgers, and certified contractor inspection estimates.'
  },
  {
    rule: 'FRE 901 / 902',
    title: 'Authenticating Electronic Evidence',
    summary: 'Proponent must establish that evidence is genuine through testimony or self-authenticating digital signatures and hashes.',
    proSeTip: 'Testify how you took the screenshot or downloaded the file to satisfy FRE 901.'
  },
  {
    rule: 'FRE 1002 / 1003',
    title: 'Best Evidence Rule & Admissibility of Duplicates',
    summary: 'An original writing, recording, or photograph is required, but duplicates are fully admissible unless genuine authenticity is questioned.',
    proSeTip: 'Printed PDFs and digital screenshots are fully admissible duplicates under FRE 1003.'
  }
];

export const TrialPrep: React.FC = () => {
  const { activeCase, updateActiveCase, totalDamages } = useSueChef();
  const [activeTab, setActiveTab] = useState<'mock_hearing' | 'simulator' | 'fre' | 'witnesses' | 'speech'>('mock_hearing');

  // Mock Hearing State
  const [mockQuestions, setMockQuestions] = useState<MockJudgeQuestion[]>(() => 
    MockHearingEngine.getQuestionsForCategory(activeCase.claimEvaluation.category)
  );
  const [mockIdx, setMockIdx] = useState(0);
  const [userHearingAnswer, setUserHearingAnswer] = useState('');
  const [hearingEvaluation, setHearingEvaluation] = useState<HearingEvaluationResult | null>(null);
  const [isEvaluatingHearing, setIsEvaluatingHearing] = useState(false);

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
  const [prompterFontSize, setPrompterFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const prompterRef = useRef<HTMLDivElement>(null);

  // New Witness Form
  const [newWitName, setNewWitName] = useState('');
  const [newWitRole, setNewWitRole] = useState<'plaintiff' | 'defendant' | 'expert' | 'eye_witness'>('plaintiff');
  const [newDirectQ, setNewDirectQ] = useState('');
  const [newCrossTrap, setNewCrossTrap] = useState('');
  const [selectedExhibitTag, setSelectedExhibitTag] = useState('');

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
      exhibitCitations: selectedExhibitTag ? [selectedExhibitTag] : []
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
    setSelectedExhibitTag('');
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

  const handleAutoGenerateSpeech = () => {
    sound.playSuccessChime();
    const pl = activeCase.parties.find(p => p.role === 'plaintiff');
    const df = activeCase.parties.find(p => p.role === 'defendant');

    let generated = '';
    if (prompterMode === 'opening') {
      generated = `May it please the Court, Your Honor.

My name is ${pl?.name || 'Plaintiff'}, and I appear before this Court representing myself in pro se in this matter against Defendant ${df?.name || 'Defendant'}.

This case is straightforward and turns upon well-established civil principles. The evidence you will hear today demonstrates that Defendant committed a clear breach of their legal duties and contractual covenants.

Specifically, the evidence will prove three essential facts:
1. First, that a valid binding legal obligation and mutual agreement existed between the parties.
2. Second, that Plaintiff fully performed all covenants, provided timely notice, and acted in good faith at all times.
3. Third, that Defendant willfully failed to satisfy their statutory obligations, resulting in direct financial damages totaling $${totalDamages.toLocaleString()}.

Through authenticated contemporaneous written exhibits, time-stamped text communications, and bank payment records, we will establish each prima facie element of our claim.

At the conclusion of this hearing, we will respectfully request that this Court enter judgment in Plaintiff's favor for the full sum of $${totalDamages.toLocaleString()}, together with allowable statutory costs.

Thank you, Your Honor.`;
    } else {
      generated = `Thank you, Your Honor.

Having now heard all of the evidence and testimony presented in this hearing, the record is crystal clear.

Defendant ${df?.name || 'Defendant'} has failed to present any credible rebuttal to the authenticated documentary exhibits in the record.

Under applicable statutory law, when a party suffers direct economic loss as a proximate result of another party's failure to perform, the law mandates full restitution and compensatory relief.

The evidence conclusively establishes:
- Exhibit records prove Plaintiff suffered actual damages of $${totalDamages.toLocaleString()}.
- Defendant's affirmative defenses are unsupported by documentary proof and contradicted by their own written admissions.

Plaintiff has carried the burden of proof by a clear preponderance of the evidence. Therefore, Plaintiff respectfully moves this Court to enter judgment against Defendant ${df?.name || 'Defendant'} in the full amount of $${totalDamages.toLocaleString()}, plus court filing fees and statutory interest.

Respectfully submitted, Plaintiff rests.`;
    }

    handleSpeechTextChange(generated);
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
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-[var(--bg-card)] border-2 border-[var(--border-color)] custom-geometry shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary custom-geometry">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide font-serif text-[var(--text-main)]">
              Trial &amp; Hearing Prep Workstation
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Master evidentiary objections under fire, structure witness examination traps, and rehearse arguments on the prompter.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[var(--bg-secondary)] px-4 py-2 border border-[var(--border-color)] custom-geometry shadow-inner">
          <Award className="w-4 h-4 text-[var(--accent-gold)]" />
          <div className="text-xs">
            <span className="text-[var(--text-muted)]">Evidentiary Score: </span>
            <span className="font-bold text-[var(--accent-gold)] font-mono">
              {totalAttempted > 0 ? Math.round((quizScore / totalAttempted) * 100) : 100}% ({quizScore}/{totalAttempted})
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => { sound.playClick(); setActiveTab('mock_hearing'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            activeTab === 'mock_hearing'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Mock Hearing Rehearsal</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
            Interactive
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('simulator'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            activeTab === 'simulator'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Objection Simulator Drill</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('fre'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            activeTab === 'fre'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Rules of Evidence Cheat Sheet</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('witnesses'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            activeTab === 'witnesses'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Witness Examination Outlines</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 text-white font-mono">
            {activeCase.trialPrep?.witnessOutlines?.length || 0}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('speech'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold custom-geometry border transition-all ${
            activeTab === 'speech'
              ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)] font-bold shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Courtroom Argument Teleprompter</span>
        </button>
      </div>

      {/* Tab 0: Interactive Mock Hearing Rehearsal */}
      {activeTab === 'mock_hearing' && (() => {
        const currQ = mockQuestions[mockIdx] || mockQuestions[0];
        
        const handleEvaluate = () => {
          if (!userHearingAnswer.trim()) return;
          sound.playGavelStrike();
          setIsEvaluatingHearing(true);
          setTimeout(() => {
            const res = MockHearingEngine.evaluateUserResponse(userHearingAnswer, currQ, activeCase);
            setHearingEvaluation(res);
            setIsEvaluatingHearing(false);
            if (res.score >= 70) sound.playSuccessChime();
            else sound.playWarningBell();
          }, 350);
        };

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Judge Question Card */}
            <div className="bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-secondary)] to-[var(--bg-card)] border-2 border-[var(--accent-gold)]/60 p-5 md:p-6 custom-geometry shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300">
                    <Gavel className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
                      {currQ.judgeName}
                    </h3>
                    <p className="text-xs text-[var(--accent-gold)] font-mono">
                      {currQ.judgeTitle} &bull; Inquiry #{mockIdx + 1} of {mockQuestions.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={mockIdx === 0}
                    onClick={() => {
                      sound.playClick();
                      setMockIdx(prev => Math.max(0, prev - 1));
                      setHearingEvaluation(null);
                    }}
                    className="px-2.5 py-1 text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] disabled:opacity-40 rounded"
                  >
                    &larr; Prev
                  </button>
                  <button
                    disabled={mockIdx >= mockQuestions.length - 1}
                    onClick={() => {
                      sound.playClick();
                      setMockIdx(prev => Math.min(mockQuestions.length - 1, prev + 1));
                      setHearingEvaluation(null);
                    }}
                    className="px-2.5 py-1 text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] disabled:opacity-40 rounded"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>

              {/* The Question */}
              <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded custom-geometry space-y-2">
                <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-2">
                  <span>Question From The Bench:</span>
                </div>
                <blockquote className="font-serif italic text-base text-slate-100 leading-relaxed">
                  "{currQ.question}"
                </blockquote>
              </div>

              {/* Objective & Legal Grounding */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded">
                  <span className="font-mono uppercase text-[10px] text-[var(--text-muted)] font-bold block">
                    What The Magistrate Is Evaluating:
                  </span>
                  <p className="text-[var(--text-main)] mt-1">{currQ.objective}</p>
                </div>
                <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded">
                  <span className="font-mono uppercase text-[10px] text-[var(--text-muted)] font-bold block">
                    Governing Statutory Authority:
                  </span>
                  <p className="text-[var(--accent-gold)] font-mono mt-1">{currQ.statutoryBasis}</p>
                </div>
              </div>

              {/* Answer Input Area */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold">
                    Your In-Court Response To The Judge:
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setUserHearingAnswer(currQ.modelAnswer);
                      }}
                      className="text-[11px] font-mono text-[var(--accent-gold)] hover:underline"
                    >
                      Use Model Answer
                    </button>
                    <span className="text-[var(--text-muted)]">&bull;</span>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setUserHearingAnswer(currQ.flawedAnswer);
                      }}
                      className="text-[11px] font-mono text-rose-400 hover:underline"
                    >
                      Test Flawed Hearsay
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={userHearingAnswer}
                  onChange={(e) => setUserHearingAnswer(e.target.value)}
                  placeholder="Address the court: 'Your Honor, under... as shown in Exhibit...' (Avoid emotional accusations or hearsay statements)..."
                  className="w-full p-3 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] focus:border-[var(--accent-gold)] text-sm text-[var(--text-main)] custom-geometry outline-none"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="text-xs font-mono text-[var(--text-muted)]">
                    {userHearingAnswer.trim().split(/\s+/).filter(Boolean).length} words &bull; Est. spoken time: ~{Math.round((userHearingAnswer.trim().split(/\s+/).filter(Boolean).length / 130) * 60)}s (Goal: &lt; 60s)
                  </div>
                  <button
                    type="button"
                    disabled={isEvaluatingHearing || !userHearingAnswer.trim()}
                    onClick={handleEvaluate}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs font-mono uppercase rounded hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {isEvaluatingHearing ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Gavel className="w-4 h-4" />
                    )}
                    <span>Evaluate Courtroom Readiness</span>
                  </button>
                </div>
              </div>

              {/* Real-time Evaluation Results */}
              {hearingEvaluation && (
                <div className="mt-4 p-5 bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded custom-geometry space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
                        Bench Assessment Verdict:
                      </div>
                      <div className="font-serif font-bold text-base text-[var(--text-main)]">
                        {hearingEvaluation.verdict}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded">
                      <Award className="w-4 h-4 text-[var(--accent-gold)]" />
                      <span className="font-mono font-bold text-sm text-[var(--accent-gold)]">
                        Score: {hearingEvaluation.score}/100
                      </span>
                    </div>
                  </div>

                  {/* Hearsay Violations Warning */}
                  {hearingEvaluation.hearsayViolations.length > 0 && (
                    <div className="p-3 bg-rose-950/60 border border-rose-500/60 rounded text-xs text-rose-200 space-y-1">
                      <div className="flex items-center gap-2 font-bold font-mono text-rose-300">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span>EVIDENTIARY RULE VIOLATIONS DETECTED:</span>
                      </div>
                      {hearingEvaluation.hearsayViolations.map((v, i) => (
                        <div key={i} className="pl-6">&bull; {v}</div>
                      ))}
                    </div>
                  )}

                  {/* Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <div className={`p-2.5 border rounded flex items-center gap-2 ${
                      hearingEvaluation.foundationCheck.addressedJudgeRespectfully ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Respectful "Your Honor"</span>
                    </div>
                    <div className={`p-2.5 border rounded flex items-center gap-2 ${
                      hearingEvaluation.foundationCheck.citedExhibits ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Cites Specific Exhibit</span>
                    </div>
                    <div className={`p-2.5 border rounded flex items-center gap-2 ${
                      hearingEvaluation.foundationCheck.citedDatesOrAmounts ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>States Exact Amounts/Dates</span>
                    </div>
                  </div>

                  {/* Magistrate's Feedback */}
                  <div className="space-y-1 text-xs">
                    <span className="font-mono uppercase text-[10px] text-[var(--text-muted)] font-bold block">
                      Magistrate's Ruling &amp; Critique:
                    </span>
                    <p className="text-slate-200 leading-relaxed">{hearingEvaluation.critique}</p>
                  </div>

                  {/* Suggested Courtroom Script */}
                  <div className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--accent-gold)]/40 rounded space-y-1.5">
                    <span className="font-mono uppercase text-[10px] text-[var(--accent-gold)] font-bold block">
                      Recommended Courtroom Rebuttal:
                    </span>
                    <p className="text-xs font-serif italic text-slate-100 leading-relaxed">
                      "{hearingEvaluation.suggestedRevision}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Tab 1: Objection Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-4">
          <div className="p-4 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-xs text-[var(--text-main)] custom-geometry flex items-center justify-between">
            <span>Drill Scenario {currentScenarioIdx + 1} of {SAMPLE_SCENARIOS.length}</span>
            <span className="font-mono text-[var(--accent-gold)] font-bold">Federal &amp; State Evidentiary Rules</span>
          </div>

          <div className="p-6 bg-[var(--bg-card)] border-2 border-[var(--border-color)] custom-geometry space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="text-xs uppercase tracking-wider font-mono text-[var(--accent-gold)] font-bold">
                Courtroom Evidentiary Situation
              </div>
              <div className="text-sm font-semibold text-[var(--text-main)] leading-relaxed">
                {currentScenario.situation}
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border-l-4 border-[var(--accent-gold)] custom-geometry">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">Witness Testifies / Counsel Inquires:</span>
              <p className="text-sm font-serif italic text-[var(--text-main)] leading-relaxed">
                {currentScenario.witnessStatement}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                Select your immediate evidentiary objection / response:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allChoices.map((choice, idx) => {
                  const isSelected = selectedAnswer === choice;
                  const isCorrect = choice === currentScenario.correctObjection;
                  
                  let btnStyle = 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-gold)]';
                  if (isSelected && !isAnswerSubmitted) {
                    btnStyle = 'bg-[var(--badge-bg)] border-[var(--accent-gold)] text-[var(--text-main)] font-bold';
                  }
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold';
                    } else {
                      btnStyle = 'bg-[var(--bg-card)]/40 border-[var(--border-color)]/40 text-[var(--text-muted)] opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(choice)}
                      disabled={isAnswerSubmitted}
                      className={`p-3.5 text-left text-xs border custom-geometry transition-all flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-black/40 border border-[var(--border-color)] flex items-center justify-center shrink-0 text-[10px] font-mono">
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
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm font-serif">
                  {selectedAnswer === currentScenario.correctObjection ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>THE COURT: "SUSTAINED!" (Statutory Authority: {currentScenario.ruleCitation})</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      <span>THE COURT: "OVERRULED." Correct Rule: {currentScenario.correctObjection}</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  {currentScenario.explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-5 py-2.5 bg-[var(--accent-gold)] text-slate-950 text-xs font-bold disabled:opacity-40 transition-all custom-geometry shadow-sm"
                >
                  Object to the Judge
                </button>
              ) : (
                <button
                  onClick={handleNextScenario}
                  className="px-5 py-2.5 bg-[var(--accent-gold)] text-slate-950 text-xs font-bold transition-all custom-geometry shadow-sm"
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
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input
              type="text"
              value={freQuery}
              onChange={(e) => setFreQuery(e.target.value)}
              placeholder="Search Rules of Evidence (e.g. hearsay, relevance, business records, duplicates, prejudice)..."
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] pl-9 pr-3 py-2.5 text-xs text-[var(--text-main)] custom-geometry focus:outline-none focus:border-[var(--accent-gold)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFRE.map((item, idx) => (
              <div key={idx} className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-2 hover:border-[var(--accent-gold)] transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] custom-geometry">
                    {item.rule}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)] font-serif">{item.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.summary}</p>
                <div className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)]/60 text-[11px] custom-geometry">
                  <strong className="text-[var(--accent-gold)] font-semibold">Pro Se Courtroom Tip: </strong>
                  <span className="text-[var(--text-main)]">{item.proSeTip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Witness Examination Outlines */}
      {activeTab === 'witnesses' && (
        <div className="space-y-4">
          <div className="p-4 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-xs leading-relaxed text-[var(--text-main)] custom-geometry">
            <strong className="text-[var(--accent-gold)]">Direct &amp; Cross Examination Protocols:</strong> On Direct Examination of your own witnesses, ask open-ended questions ("What happened next?", "What did you observe?"). On Cross Examination of adverse witnesses, only ask leading yes/no trap questions based strictly on authenticated exhibits.
          </div>

          <div className="space-y-4">
            {(activeCase.trialPrep?.witnessOutlines || []).map((wit) => (
              <div key={wit.id} className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] custom-geometry mr-2">
                      {wit.witnessRole.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--text-main)] inline font-serif">{wit.witnessName}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteWitness(wit.id)}
                    className="text-[var(--text-muted)] hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {wit.directQuestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                      Direct Examination Outline (Open Questions)
                    </div>
                    <ul className="space-y-1.5 pl-4 text-xs list-decimal text-[var(--text-muted)]">
                      {wit.directQuestions.map((q, qIdx) => (
                        <li key={qIdx} className="leading-relaxed text-[var(--text-main)]">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {wit.crossExamTraps.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/60">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                      Cross-Examination Traps (Leading Yes/No Lock-Ins)
                    </div>
                    <ul className="space-y-1.5 pl-4 text-xs list-disc text-amber-300/90">
                      {wit.crossExamTraps.map((trap, tIdx) => (
                        <li key={tIdx} className="leading-relaxed">{trap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {wit.exhibitCitations && wit.exhibitCitations.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 border-t border-[var(--border-color)]/40 text-[11px] font-mono text-[var(--accent-gold)]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Linked Exhibits: {wit.exhibitCitations.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Witness */}
          <div className="p-5 bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] custom-geometry space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5 font-mono">
              <Plus className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>Add Witness Examination Outline</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Witness Full Name</label>
                <input
                  type="text"
                  value={newWitName}
                  onChange={(e) => setNewWitName(e.target.value)}
                  placeholder="e.g. Alex Johnson (General Contractor)"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-gold)] mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Witness Role</label>
                <select
                  value={newWitRole}
                  onChange={(e) => setNewWitRole(e.target.value as any)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-gold)] mt-1 font-semibold"
                >
                  <option value="plaintiff">Plaintiff (Pro Se)</option>
                  <option value="defendant">Defendant / Adverse Witness</option>
                  <option value="expert">Expert Witness (Inspector / Appraiser)</option>
                  <option value="eye_witness">Eye Witness / Third Party</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Link Case Exhibit</label>
                <select
                  value={selectedExhibitTag}
                  onChange={(e) => setSelectedExhibitTag(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-gold)] mt-1"
                >
                  <option value="">No Exhibit Linked</option>
                  {activeCase.evidenceList.map(ev => (
                    <option key={ev.id} value={ev.exhibitTag}>
                      {ev.exhibitTag}: {ev.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Direct Examination Question (Open-Ended)</label>
              <textarea
                rows={2}
                value={newDirectQ}
                onChange={(e) => setNewDirectQ(e.target.value)}
                placeholder="e.g. What did you observe when you inspected the leaking ceiling on August 14th?"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-gold)] mt-1"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Cross-Examination Trap Question (Yes/No Question)</label>
              <textarea
                rows={2}
                value={newCrossTrap}
                onChange={(e) => setNewCrossTrap(e.target.value)}
                placeholder="e.g. Isn't it true that you received Plaintiff's certified notice on August 15th and never responded?"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-gold)] mt-1"
              />
            </div>

            <button
              onClick={handleAddWitness}
              className="px-4 py-2 bg-[var(--accent-gold)] text-slate-950 text-xs font-bold hover:opacity-90 transition-all custom-geometry shadow-sm"
            >
              Add Witness Outline
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Live Teleprompter */}
      {activeTab === 'speech' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { sound.playClick(); setPrompterMode('opening'); }}
                className={`px-3 py-1.5 text-xs font-semibold custom-geometry ${
                  prompterMode === 'opening' ? 'bg-[var(--accent-gold)] text-slate-950 font-bold' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                }`}
              >
                Opening Statement
              </button>
              <button
                onClick={() => { sound.playClick(); setPrompterMode('closing'); }}
                className={`px-3 py-1.5 text-xs font-semibold custom-geometry ${
                  prompterMode === 'closing' ? 'bg-[var(--accent-gold)] text-slate-950 font-bold' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                }`}
              >
                Closing Argument
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleAutoGenerateSpeech}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] custom-geometry hover:bg-[var(--accent-gold)] hover:text-black transition-all"
                title="Auto-Generate tailored courtroom script from case facts"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Draft {prompterMode === 'opening' ? 'Opening' : 'Closing'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--text-muted)]">Speed: </span>
                <span className="font-mono font-bold text-[var(--text-main)]">{wpm} WPM</span>
                <input
                  type="range"
                  min="80"
                  max="220"
                  step="5"
                  value={wpm}
                  onChange={(e) => setWpm(parseInt(e.target.value))}
                  className="w-20 accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1">
                {(['normal', 'large', 'huge'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => setPrompterFontSize(sz)}
                    className={`px-2 py-1 text-[10px] uppercase font-mono border ${
                      prompterFontSize === sz 
                        ? 'bg-[var(--accent-gold)] text-slate-950 font-bold' 
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                    }`}
                  >
                    {sz[0].toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { sound.playClick(); setIsPlaying(!isPlaying); }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[var(--accent-gold)] text-slate-950 text-xs font-bold custom-geometry shadow-sm hover:opacity-90"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Start Prompter'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  if (prompterRef.current) prompterRef.current.scrollTop = 0;
                  setIsPlaying(false);
                }}
                className="p-1.5 bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)] custom-geometry border border-[var(--border-color)]"
                title="Reset to Top"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prompter Visual Viewport */}
          <div
            ref={prompterRef}
            className={`h-80 overflow-y-auto bg-black border-2 border-[var(--accent-gold)]/50 p-8 custom-geometry font-serif leading-loose text-amber-100 select-none shadow-2xl scroll-smooth ${
              prompterFontSize === 'huge' ? 'text-2xl leading-loose' : prompterFontSize === 'large' ? 'text-lg leading-relaxed' : 'text-base'
            }`}
          >
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center font-mono text-xs uppercase tracking-widest text-[var(--accent-gold)] pb-4 border-b border-white/10">
                PRO SE COURTROOM ORAL ARGUMENT PROMPTER • {prompterMode.toUpperCase()}
              </div>
              <p className="whitespace-pre-wrap">{activeSpeechText || '(Click "Auto-Draft" above or type your script below to rehearse your argument)'}</p>
              <div className="text-center font-mono text-xs uppercase tracking-widest text-emerald-400 pt-8 pb-16">
                [ CONCLUDE ARGUMENT &amp; REQUEST ENTRY OF JUDGMENT IN PLAINTIFF'S FAVOR ]
              </div>
            </div>
          </div>

          {/* Editable Draft */}
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] custom-geometry space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
              Edit {prompterMode === 'opening' ? 'Opening Statement' : 'Closing Argument'} Script Draft
            </label>
            <textarea
              rows={6}
              value={activeSpeechText}
              onChange={(e) => handleSpeechTextChange(e.target.value)}
              placeholder="Type or paste your courtroom speech here..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 text-xs font-serif leading-relaxed text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-gold)] custom-geometry"
            />
          </div>
        </div>
      )}
    </div>
  );
};

