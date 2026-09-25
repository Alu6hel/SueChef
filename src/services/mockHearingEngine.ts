import { CaseFile } from '../types';

export interface JudicialPersona {
  id: 'stickler' | 'pragmatist' | 'skeptical_auditor' | 'equitable_arbitrator';
  name: string;
  title: string;
  avatarEmoji: string;
  badge: string;
  demeanor: string;
  description: string;
  keyPriority: string;
  preferredTone: string;
  pitch: number;
  rate: number;
}

export const JUDICIAL_PERSONAS: JudicialPersona[] = [
  {
    id: 'stickler',
    name: 'Hon. Margaret Vance',
    title: 'Small Claims Presiding Magistrate',
    avatarEmoji: '👩‍⚖️',
    badge: 'FRE Procedure Hawk',
    demeanor: 'Formal, impatient with hearsay, strictly adheres to statutory deadlines and exhibit rules.',
    description: 'Demands clear exhibit citations, zero hearsay, and strict statutory proof. Cuts off emotional narratives immediately.',
    keyPriority: 'Authenticity, chain of custody, and rule of evidence compliance.',
    preferredTone: 'Formal, concise, cite exhibit letters and statutory code sections.',
    pitch: 1.1,
    rate: 1.05
  },
  {
    id: 'pragmatist',
    name: 'Hon. Robert Chen',
    title: 'Superior Court Commissioner',
    avatarEmoji: '👨‍⚖️',
    badge: 'Bottom-Line Pragmatist',
    demeanor: 'Fast-paced, businesslike, focuses on exact damage calculations and mitigation efforts.',
    description: 'Skips procedural handwringing to drill straight into the math: How much was paid? How much was refunded? Did you attempt to resolve it first?',
    keyPriority: 'Precise financial ledger, bank records, and duty to mitigate damages.',
    preferredTone: 'Direct, ledger-based, avoid legalistic rhetoric.',
    pitch: 0.95,
    rate: 1.15
  },
  {
    id: 'skeptical_auditor',
    name: 'Hon. Elena Rostova',
    title: 'Labor & Civil Hearing Commissioner',
    avatarEmoji: '⚖️',
    badge: 'Skeptical Auditor',
    demeanor: 'Inquisitive, examines delivery receipts, certified tracking numbers, and date discrepancies.',
    description: 'Presumes nothing until verified. Cross-references written notices against postal stamps, email timestamps, and contractual clauses.',
    keyPriority: 'Proof of receipt, certified mail tracking, unambiguous date timelines.',
    preferredTone: 'Chronological timeline, tracking numbers, contemporaneous records.',
    pitch: 1.0,
    rate: 0.95
  },
  {
    id: 'equitable_arbitrator',
    name: 'Hon. Marcus Sterling',
    title: 'Civil Hearing Magistrate',
    avatarEmoji: '🏛️',
    badge: 'Equitable Arbitrator',
    demeanor: 'Even-tempered, probes good faith, fair dealing, and proportional remedies.',
    description: 'Looks for who acted reasonably. Values compromise attempts, formal cure opportunities, and bad-faith refusal to negotiate.',
    keyPriority: 'Good faith, reasonableness of expenses, avoidance of windfall profits.',
    preferredTone: 'Calm, reasonable, demonstrating fairness and patience.',
    pitch: 0.9,
    rate: 1.0
  }
];

export interface MockJudgeQuestion {
  id: string;
  category: string;
  personaId: JudicialPersona['id'];
  judgeName: string;
  judgeTitle: string;
  question: string;
  objective: string;
  statutoryBasis: string;
  modelAnswer: string;
  flawedAnswer: string;
}

export interface HearingEvaluationResult {
  score: number; // 0 to 100
  verdict: 'Excellent — Courtroom Ready' | 'Solid with Minor Adjustments' | 'Warning: Inadmissible / Hearsay Trap';
  hearsayViolations: string[];
  foundationCheck: {
    citedExhibits: boolean;
    citedDatesOrAmounts: boolean;
    addressedJudgeRespectfully: boolean;
  };
  wordCount: number;
  timeEstimateSeconds: number;
  critique: string;
  suggestedRevision: string;
}

export interface HostileCrossScenario {
  id: string;
  counselName: string;
  firmName: string;
  situation: string;
  question: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
    composureDelta: number; // e.g. +10 composure (good), -15 (bad)
  }[];
  goldenRule: string;
}

export interface CourtroomStation {
  id: string;
  title: string;
  subtitle: string;
  gridArea: string;
  rules: string[];
  forbidden: string[];
  powerPhrases: string[];
}

export interface SpeechAnalyticsResult {
  totalWords: number;
  wpm: number;
  pacingVerdict: 'Too Fast (>160 WPM)' | 'Optimal (120-145 WPM)' | 'Too Slow (<90 WPM)';
  fillerWords: { word: string; count: number }[];
  totalFillerCount: number;
  fillerPercentage: number;
  respectfulAddress: boolean;
  exhibitCited: boolean;
  emotionalLanguage: string[];
  deliveryScore: number; // 0-100
  coachingPoints: string[];
}

export const MOCK_QUESTIONS: MockJudgeQuestion[] = [
  {
    id: 'q_deposit_1',
    category: 'security_deposit',
    personaId: 'stickler',
    judgeName: 'Hon. Margaret Vance',
    judgeTitle: 'Small Claims Presiding Magistrate',
    question: 'Plaintiff, Apex Property Holdings LLC claims they withheld your $9,890 deposit for deep cleaning, repainting, and wall patching. Did you inspect the premises together before moving out, and what proof do you have of the condition on move-out day?',
    objective: 'Judge is testing compliance with mandatory pre-move-out inspection statutory notices (e.g. Cal. Civ. Code § 1950.5(f)) and personal foundation regarding move-out condition.',
    statutoryBasis: 'Cal. Civ. Code § 1950.5 / URLTA § 2.101',
    modelAnswer: 'Your Honor, under Cal. Civ. Code § 1950.5(f), Defendant was legally obligated to notify me in writing of my right to an initial pre-move-out inspection. As shown in Exhibit B, Defendant never gave notice. Furthermore, as shown in the timestamped photos in Exhibit C and D taken at 2:15 PM on June 30th, the premises were thoroughly scrubbed and returned in move-in condition, normal wear and tear excepted.',
    flawedAnswer: 'The landlord is a complete scammer and thief who steals everyone\'s deposit! My neighbor told me they do this to every tenant, and they are lying about the walls.'
  },
  {
    id: 'q_deposit_2',
    category: 'security_deposit',
    personaId: 'skeptical_auditor',
    judgeName: 'Hon. Elena Rostova',
    judgeTitle: 'Superior Court Commissioner',
    question: 'Show me where in the record you established that Defendant received your formal forwarding address, and did they provide an itemized receipt statement within the statutory deadline?',
    objective: 'Testing proof of delivery and forfeiture of deduction rights for missing statutory itemization deadlines.',
    statutoryBasis: 'Cal. Civ. Code § 1950.5(l) / Granberry v. Islay Investments',
    modelAnswer: 'Your Honor, Exhibit A contains the written notice of forwarding address delivered via certified mail on July 1st, tracking verified in Exhibit A-2. Under Cal. Civ. Code § 1950.5(l), Defendant had exactly 21 calendar days—until July 22nd—to deliver an itemized disposition with paid vendor receipts. Defendant tendered nothing until August 15th, well past the deadline. Under Granberry v. Islay Investments, Defendant has completely forfeited the right to retain any deductions.',
    flawedAnswer: 'I texted the manager but he ignored me because he\'s a crook. Everyone knows you only get 3 weeks.'
  },
  {
    id: 'q_contract_1',
    category: 'breach_of_contract',
    personaId: 'pragmatist',
    judgeName: 'Hon. Robert Chen',
    judgeTitle: 'Superior Court Commissioner',
    question: 'Plaintiff, Defendant claims there was no formal signed agreement and that you performed work beyond the original verbal scope. How do you prove the terms of the agreement and mutual assent?',
    objective: 'Testing existence of enforceable contract terms, offer, acceptance, and consideration under contract law.',
    statutoryBasis: 'Restatement (Second) of Contracts §§ 17, 347 / UCC § 2-204',
    modelAnswer: 'Your Honor, as shown in Exhibit A, the written agreement was executed via confirmed email correspondence on May 10th specifying deliverables and the exact contract sum of $9,890. Under Restatement (Second) of Contracts § 17, mutual assent and consideration were fully exchanged. In addition, Exhibit F contains Defendant\'s written acceptance of the milestone deliverables without objection.',
    flawedAnswer: 'They shook hands on it and promised me! It\'s completely unfair and they are trying to cheat an honest worker.'
  },
  {
    id: 'q_airline_1',
    category: 'airline_delay',
    personaId: 'pragmatist',
    judgeName: 'Hon. Robert Chen',
    judgeTitle: 'Civil Court Judge',
    question: 'Plaintiff, the carrier asserts the cancellation was caused by unforeseen air traffic management constraints beyond their control. What evidence establishes this was a controllable carrier cancellation rather than weather or FAA mandated ground stop?',
    objective: 'Distinguishing carrier controllable schedule changes from non-controllable force majeure under 14 CFR Part 260 / EU261.',
    statutoryBasis: 'DOT 14 CFR Part 260 / Regulation (EC) No 261/2004',
    modelAnswer: 'Your Honor, Exhibit C is the FAA National Airspace Operations Plan for July 14th showing normal airport operations with zero weather ground delays. Furthermore, as verified by the carrier\'s own automated text notification in Exhibit B, the cancellation was specifically caused by "crew member shortage," an internal operational breakdown. Under 14 CFR § 260.4, prompt refund in cash rather than unrequested travel credit is legally mandated.',
    flawedAnswer: 'The airline staff were terribly rude and treated all passengers like cattle! They cancel flights all the time because they are greedy.'
  },
  {
    id: 'q_subscription_1',
    category: 'zombie_subscription',
    personaId: 'stickler',
    judgeName: 'Hon. Margaret Vance',
    judgeTitle: 'Small Claims Presiding Magistrate',
    question: 'Defendant maintains their terms of service included an express auto-renewal clause and that you agreed upon registration. Did they provide compliant statutory pre-renewal notice, and how did you attempt cancellation?',
    objective: 'Testing adherence to Restore Online Shoppers\' Confidence Act (ROSCA) and automatic renewal affirmative consent laws.',
    statutoryBasis: '15 U.S.C. § 8401 (ROSCA) / Cal. Bus. & Prof. Code § 17602',
    modelAnswer: 'Your Honor, under California Bus. & Prof. Code § 17602(a)(3), online subscriptions require a clear, conspicuous click-to-cancel mechanism in the same medium as enrollment. As demonstrated in Exhibit D, Defendant erected a deceptive cancellation labyrinth requiring telephone customer service queues. Furthermore, Exhibit E proves Plaintiff submitted an unequivocal cancellation request on April 12th, yet Defendant continued unauthorized monthly debit charges of $149 for 6 consecutive months.',
    flawedAnswer: 'They are running a credit card scam! I never check my statements and they just stole hundreds of dollars from my account.'
  },
  {
    id: 'q_porch_1',
    category: 'ecommerce_porch_theft',
    personaId: 'skeptical_auditor',
    judgeName: 'Hon. Elena Rostova',
    judgeTitle: 'Labor & Civil Hearing Commissioner',
    question: 'The merchant claims their delivery obligations ceased when the carrier marked the tracking number "delivered to front door." Under the governing sales law, where did the risk of loss shift and what proof exists of actual receipt?',
    objective: 'Establishing merchant risk of loss in consumer contracts under UCC 2-509 and FCBA nondelivery remedies.',
    statutoryBasis: 'UCC § 2-509(1)(b) / FTC Mail Order Rule 16 CFR Part 435',
    modelAnswer: 'Your Honor, under UCC § 2-509(1)(b), in a destination contract the risk of loss does not shift to the buyer until the goods are duly tendered and made available at the destination. As documented by the doorbell surveillance camera footage in Exhibit A, the carrier delivery truck never entered the property on June 18th. The driver made a false scan. Under the FTC Mail Order Rule, the seller remains legally accountable for safe delivery to the buyer.',
    flawedAnswer: 'Porch pirates or delivery drivers stole it! The seller refused to give me my money back and just hung up on me.'
  },
  {
    id: 'q_vacation_1',
    category: 'vacation_rental',
    personaId: 'equitable_arbitrator',
    judgeName: 'Hon. Marcus Sterling',
    judgeTitle: 'Civil Hearing Magistrate',
    question: 'The host argues you remained on the property for two days before demanding a refund. What conditions made the rental uninhabitable, and did you afford the host an opportunity to cure?',
    objective: 'Proving substantial material breach of warranty of habitability and timely notice with cure opportunity.',
    statutoryBasis: 'Restatement (Second) of Contracts § 241 / Implied Warranty of Habitability',
    modelAnswer: 'Your Honor, upon arrival on August 5th, the premises had no potable running water and active black mold growth in the primary bedroom, as captured in timestamped photos in Exhibit B. As shown in Exhibit C, Plaintiff immediately notified the host via the platform messaging system within 45 minutes of check-in, giving 24 hours to arrange emergency plumbing. The host refused assistance. Plaintiff mitigated damages by vacating and booking alternative lodging.',
    flawedAnswer: 'The cabin was disgusting and unlivable! The host is a slumlord who ruined our entire family vacation.'
  },
  {
    id: 'q_towing_1',
    category: 'predatory_towing',
    personaId: 'stickler',
    judgeName: 'Hon. Margaret Vance',
    judgeTitle: 'Small Claims Presiding Magistrate',
    question: 'Defendant tow operator contends your vehicle was unlawfully parked on private commercial property without a valid permit. Did the property owner provide statutory written authorization for this specific tow, and were the signs clearly posted?',
    objective: 'Strict statutory compliance for non-consensual private property impounds and statutory double/treble damages.',
    statutoryBasis: 'Cal. Veh. Code § 22658 / Tex. Occ. Code § 2308',
    modelAnswer: 'Your Honor, under Cal. Veh. Code § 22658(l)(1)(A), a towing company cannot impound a vehicle without a contemporaneous written authorization signed by the property owner specifying the vehicle license plate and parking violation. As admitted in Defendant\'s impound sheet in Exhibit A, no owner authorization was ever obtained. This was an unlawful patrol tow, entitling Plaintiff to mandatory statutory damages of double the towing fee under subsection (j).',
    flawedAnswer: 'These predatory tow bandits stalk parking lots and rob innocent drivers! They demanded $500 cash only, which is illegal extortion!'
  },
  {
    id: 'q_fifa_1',
    category: 'fifa_double_damages',
    personaId: 'stickler',
    judgeName: 'Hon. Margaret Vance',
    judgeTitle: 'Small Claims Presiding Magistrate',
    question: 'Plaintiff, explain why you are requesting statutory double damages rather than simple compensatory refund for the cancelled match tickets.',
    objective: 'Proving bad-faith withholding and statutory multiple damages under consumer protection statutes.',
    statutoryBasis: 'Cal. Civ. Code § 1780 (CLRA) / NY Gen. Bus. Law § 349',
    modelAnswer: 'Your Honor, while compensatory damages for the unrefunded face value of the tickets amount to $3,200 as proven in Exhibit A, Defendant engaged in deceptive business practices by unilaterally canceling confirmed seats while reselling the identical section at 400% markup on their secondary partner exchange. Under applicable deceptive trade practices laws, willful refusal to tender refunds within 30 days warrants double statutory damages for deceptive enrichment.',
    flawedAnswer: 'Ticket scalpers and corporate conglomerates are ruining sports for fans! They deserve to pay maximum punitive damages for their greed.'
  },
  {
    id: 'q_general_1',
    category: 'default',
    personaId: 'pragmatist',
    judgeName: 'Hon. Robert Chen',
    judgeTitle: 'Civil Hearing Magistrate',
    question: 'Plaintiff, walk me through your damages calculation. Exactly how did you arrive at your total claim amount of $9,890, and what documents verify each item?',
    objective: 'Testing burden of proof regarding quantified compensatory damages and avoidance of speculative recovery.',
    statutoryBasis: 'Restatement (Second) of Contracts § 347 / General Damages Principles',
    modelAnswer: 'Your Honor, our total damages of $9,890 are itemized in Section 4 of our verified Complaint. First, the principal withheld amount is $6,500, verified by the bank wire transfer in Exhibit A. Second, statutory penalties of $3,200 are authorized under governing civil statutes for bad-faith withholding. Third, court filing fees of $75 and service costs of $115 are verified by clerk receipts in Exhibit G.',
    flawedAnswer: 'I calculated it because they stressed me out so much, made me take days off work, and I think they owe me at least ten grand for all the emotional damage.'
  }
];

export const HOSTILE_CROSS_SCENARIOS: HostileCrossScenario[] = [
  {
    id: 'cross_1',
    counselName: 'Bradley Sterling, Esq.',
    firmName: 'Vanguard Litigation Partners LLP',
    situation: 'Opposing counsel rises to cross-examine you on whether you documented any defects prior to signing the contract.',
    question: 'Isn\'t it a fact that you never sent a single formal written letter complaining about the services until two weeks after the final payment was already overdue, isn\'t that true?',
    options: [
      {
        id: 'opt_1',
        label: 'Objection, Your Honor: Misstates the evidence and compound question.',
        isCorrect: true,
        feedback: 'Excellent objection! Counsel is trying to smuggle an unproven premise ("final payment was already overdue") into a leading compound question.',
        composureDelta: 15
      },
      {
        id: 'opt_2',
        label: 'No that\'s a total lie, your client was ducking all my phone calls for months!',
        isCorrect: false,
        feedback: 'Trap sprung! Getting defensive and accusatory makes you look combative and validates the attorney\'s pressure tactic.',
        composureDelta: -20
      },
      {
        id: 'opt_3',
        label: 'That is incorrect. As shown in Exhibit B, I transmitted written deficiency notices via email on May 4th and May 12th, well before the completion date.',
        isCorrect: true,
        feedback: 'Flawless factual retort. You directly rejected the false premise and anchored your answer in a specific exhibit.',
        composureDelta: 15
      }
    ],
    goldenRule: 'Never accept counsel\'s loaded premise. Refuse the false assumption or object to misstatement of evidence (FRE 611).'
  },
  {
    id: 'cross_2',
    counselName: 'Vanessa Croft, Esq.',
    firmName: 'Metropolitan Defense Counsel',
    situation: 'Opposing counsel attempts to impeach your credibility by bringing up an unrelated personal debt.',
    question: 'Isn\'t it true that your checking account had an overdraft fee in March, and isn\'t the real reason you filed this lawsuit simply that you are desperate for cash?',
    options: [
      {
        id: 'opt_1',
        label: 'Objection, Your Honor! Relevance under FRE 401 and improper character evidence under FRE 404(b).',
        isCorrect: true,
        feedback: 'Sustained! Unrelated personal financial conditions have zero relevance to whether defendant breached this contract.',
        composureDelta: 20
      },
      {
        id: 'opt_2',
        label: 'My personal finances are none of your business and you have no right to look at my private bank account!',
        isCorrect: false,
        feedback: 'Poor response. Shouting at opposing counsel in open court will result in a judicial reprimand.',
        composureDelta: -15
      },
      {
        id: 'opt_3',
        label: 'I had an unexpected medical bill that week, but I have always paid all my debts on time.',
        isCorrect: false,
        feedback: 'Trap sprung! You took the bait and started justifying irrelevant personal matters on the court record.',
        composureDelta: -10
      }
    ],
    goldenRule: 'When counsel attacks your character with irrelevant personal history, do not explain—immediately object under FRE 401 and 404.'
  },
  {
    id: 'cross_3',
    counselName: 'Marcus Albright, Esq.',
    firmName: 'Albright & Sterling Defense',
    situation: 'Opposing counsel fires a machine-gun series of four factual questions in a single breath.',
    question: 'You inspected the vehicle on Monday, noticed the dent on Tuesday, drove 200 miles on Wednesday, and didn\'t bother calling our service dispatch until Friday afternoon, correct?',
    options: [
      {
        id: 'opt_1',
        label: 'Objection, Your Honor: Compound question under FRE 611(a).',
        isCorrect: true,
        feedback: 'Sustained! Compound questions force a witness into an impossible yes/no answer for multiple independent assertions.',
        composureDelta: 15
      },
      {
        id: 'opt_2',
        label: 'Yes, but...',
        isCorrect: false,
        feedback: 'Disaster! Saying "Yes, but..." gives opposing counsel the soundbite admission they wanted. They will cut you off with: "Thank you, no further questions."',
        composureDelta: -25
      },
      {
        id: 'opt_3',
        label: 'I cannot answer that with a simple yes or no because it joins several separate events, some of which are inaccurate.',
        isCorrect: true,
        feedback: 'Very solid composure. Demonstrates poise and refuses to be pigeonholed by a compound trap.',
        composureDelta: 10
      }
    ],
    goldenRule: 'Never answer "Yes, but..." to a multi-part compound question. Stop, object, or state that the question joins distinct occurrences.'
  },
  {
    id: 'cross_4',
    counselName: 'Richard Vance, Esq.',
    firmName: 'Vance & Associates Commercial Defense',
    situation: 'Counsel attempts to make you speculate about what their client was thinking.',
    question: 'Isn\'t it obvious that our client intended to issue the refund as soon as their internal accounting cycle closed at the end of the quarter?',
    options: [
      {
        id: 'opt_1',
        label: 'Objection, Your Honor: Calls for speculation under FRE 602. I cannot testify to what Defendant was internally thinking.',
        isCorrect: true,
        feedback: 'Sustained! A witness may only testify to matters of personal knowledge. Speculating about another company\'s intent is impermissible.',
        composureDelta: 15
      },
      {
        id: 'opt_2',
        label: 'No, they obviously intended to steal my money permanently!',
        isCorrect: false,
        feedback: 'Trap sprung! Answering speculation with speculative accusations damages your objective credibility.',
        composureDelta: -15
      },
      {
        id: 'opt_3',
        label: 'I have no knowledge of Defendant\'s internal accounting. All I know is that they missed the mandatory 21-day statutory deadline.',
        isCorrect: true,
        feedback: 'Great factual anchor. Disclaimed speculation and returned immediately to the statutory violation.',
        composureDelta: 10
      }
    ],
    goldenRule: 'You cannot know what someone else was thinking or intending. Object to speculation or restrict your answer strictly to observed facts.'
  }
];

export const COURTROOM_STATIONS: CourtroomStation[] = [
  {
    id: 'bench',
    title: "Judge's Bench",
    subtitle: 'Presiding Judicial Officer',
    gridArea: 'col-span-12',
    rules: [
      'Always stand when the Judge enters or exits the courtroom.',
      'Always stand when addressing or being addressed by the Judge.',
      'Never interrupt the Judge while they are speaking, even if they misstate a fact—wait until they finish.',
      'Always address the judicial officer as "Your Honor" or "The Court".'
    ],
    forbidden: [
      'Never walk up to the bench uninvited. You must explicitly ask: "May I approach the bench, Your Honor?"',
      'Never argue with the Judge after a ruling is made. Say: "Understood, Your Honor."'
    ],
    powerPhrases: [
      '"May it please the Court, Your Honor."',
      '"Your Honor, may I respectfully direct the Court\'s attention to Exhibit C?"',
      '"Thank you, Your Honor."'
    ]
  },
  {
    id: 'plaintiff_table',
    title: "Plaintiff's Counsel Table",
    subtitle: 'Your Designated Station (Facing the Bench)',
    gridArea: 'col-span-6',
    rules: [
      'Organize all exhibits chronologically in tabbed folders with master exhibit index on top.',
      'Keep a notepad and pen ready to jot down questions during the opposing party\'s testimony.',
      'Maintain an upright, calm, attentive posture at all times. The Judge is watching your reactions.'
    ],
    forbidden: [
      'Never make audible sighs, scoff, shake your head, or roll your eyes while the opposing party speaks.',
      'Never leave clutter, trash, or unfiled loose papers on the counsel table.'
    ],
    powerPhrases: [
      '"Plaintiff is ready to proceed, Your Honor."',
      '"Plaintiff respectfully moves Exhibit A into evidence under FRE 902."'
    ]
  },
  {
    id: 'defense_table',
    title: "Defendant's Counsel Table",
    subtitle: 'Opposing Party & Legal Counsel',
    gridArea: 'col-span-6',
    rules: [
      'Direct all statements and arguments exclusively to the Judge, NEVER to the Defendant.',
      'Listen carefully for admissions of liability in Defendant\'s testimony.',
      'Note any facts Defendant testifies to that contradict their written correspondence.'
    ],
    forbidden: [
      'NEVER turn around or face Defendant directly to argue or point fingers.',
      'Never address Defendant by first name in an adversarial tone.'
    ],
    powerPhrases: [
      '"Your Honor, Defendant\'s testimony contradicts their own verified email in Exhibit D, line 8."'
    ]
  },
  {
    id: 'witness_box',
    title: 'Witness Stand',
    subtitle: 'Testimonial Evidence Center',
    gridArea: 'col-span-4',
    rules: [
      'Wait for the witness to be sworn in under oath before asking questions.',
      'Ask open, non-leading questions on direct examination: Who, What, Where, When, Why, How.',
      'Show the exhibit to opposing counsel first, then request permission to approach the witness.'
    ],
    forbidden: [
      'Never ask leading questions on direct (FRE 611(c)).',
      'Never badger or argue with a hostile witness.'
    ],
    powerPhrases: [
      '"Your Honor, may I approach the witness to show what has been marked as Exhibit B for identification?"',
      '"Please state your full name and occupation for the record."'
    ]
  },
  {
    id: 'clerk_reporter',
    title: 'Court Clerk & Reporter',
    subtitle: 'Official Docket & Record Keeper',
    gridArea: 'col-span-4',
    rules: [
      'Provide 3 physical copies of every exhibit: 1 for Judge, 1 for Opposing Party, 1 for Clerk.',
      'Speak clearly and at a measured pace so the court reporter can accurately transcribe.',
      'Spell out unusual names, street addresses, or technical terms when first mentioned.'
    ],
    forbidden: [
      'Never talk over another speaker—court reporting hardware can only capture one voice at a time.',
      'Never nod or shake your head for answers—the reporter requires audible "Yes" or "No".'
    ],
    powerPhrases: [
      '"For the record, spelling is S-T-E-R-L-I-N-G."'
    ]
  },
  {
    id: 'gallery',
    title: 'Public Gallery & Podium',
    subtitle: 'Audience & Presentation Lectern',
    gridArea: 'col-span-4',
    rules: [
      'Silence all cell phones and mobile devices completely before stepping past the bar.',
      'Speak directly into the microphone at the podium if the courtroom uses one.',
      'Stay behind the podium/bar unless specifically granted permission to move.'
    ],
    forbidden: [
      'Never bring food, drink, or chewing gum into the courtroom.',
      'No photography or recording devices without prior judicial administrative order.'
    ],
    powerPhrases: [
      '"May I speak from the podium, Your Honor?"'
    ]
  }
];

export class MockHearingEngine {
  public static getQuestionsForCategory(category: string): MockJudgeQuestion[] {
    const specific = MOCK_QUESTIONS.filter(q => q.category === category);
    if (specific.length > 0) {
      const defaultQ = MOCK_QUESTIONS.find(q => q.category === 'default')!;
      return [...specific, defaultQ];
    }
    return MOCK_QUESTIONS;
  }

  public static getPersonas(): JudicialPersona[] {
    return JUDICIAL_PERSONAS;
  }

  public static getPersona(id: JudicialPersona['id']): JudicialPersona {
    return JUDICIAL_PERSONAS.find(p => p.id === id) || JUDICIAL_PERSONAS[0];
  }

  public static evaluateUserResponse(
    response: string,
    question: MockJudgeQuestion,
    caseFile: CaseFile
  ): HearingEvaluationResult {
    const clean = response.trim();
    const lower = clean.toLowerCase();
    const words = clean.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const timeSeconds = Math.round((wordCount / 130) * 60);

    const hearsayViolations: string[] = [];
    
    const hearsayTriggers = [
      { word: 'scam', reason: 'Unsubstantiated criminal characterization (FRE 404)' },
      { word: 'thief', reason: 'Unsubstantiated criminal accusation (FRE 404)' },
      { word: 'crook', reason: 'Emotional character attack (FRE 404)' },
      { word: 'liar', reason: 'Direct credibility attack without foundation (FRE 608)' },
      { word: 'lying', reason: 'Direct credibility accusation rather than factual discrepancy' },
      { word: 'evil', reason: 'Inflammatory emotional characterization' },
      { word: 'neighbor told me', reason: 'Classic out-of-court inadmissible hearsay (FRE 801/802)' },
      { word: 'friend told me', reason: 'Inadmissible second-hand hearsay (FRE 801/802)' },
      { word: 'everyone knows', reason: 'Speculation and lack of personal knowledge (FRE 602)' }
    ];

    hearsayTriggers.forEach(t => {
      if (lower.includes(t.word)) {
        hearsayViolations.push(t.reason);
      }
    });

    const citesExhibit = /exhibit\s+[a-z0-9]/i.test(clean) || lower.includes('receipt') || lower.includes('document') || lower.includes('contract');
    const citesDatesOrAmounts = /\$?\d+[\.,]?\d*/.test(clean) || /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2})/i.test(clean);
    const addressesJudge = lower.includes('your honor') || lower.includes('judge');

    let score = 50;

    if (addressesJudge) score += 10;
    if (citesExhibit) score += 25;
    if (citesDatesOrAmounts) score += 15;
    if (hearsayViolations.length === 0) score += 15;
    else score -= hearsayViolations.length * 15;

    if (wordCount >= 25 && wordCount <= 120) score += 10;
    else if (wordCount > 200) score -= 15;

    score = Math.max(10, Math.min(100, score));

    let verdict: HearingEvaluationResult['verdict'] = 'Solid with Minor Adjustments';
    if (score >= 80 && hearsayViolations.length === 0) {
      verdict = 'Excellent — Courtroom Ready';
    } else if (hearsayViolations.length > 0 || score < 50) {
      verdict = 'Warning: Inadmissible / Hearsay Trap';
    }

    let critique = '';
    if (hearsayViolations.length > 0) {
      critique = `Your response contained emotional accusations or hearsay (${hearsayViolations.join(', ')}). Judges in civil and small claims courts immediately tune out personal attacks. Always replace "They are liars/scammers" with objective documentary proof: "As established by Exhibit C, Defendant's statements conflict with their own written records."`;
    } else if (!citesExhibit) {
      critique = `Good demeanor, but you did not refer to a specific numbered Exhibit. When answering the judge, always physically hold up or point to your exhibit: "Your Honor, as shown in Exhibit B, line 4..."`;
    } else if (wordCount > 180) {
      critique = `Your answer is thorough but runs approximately ${timeSeconds} seconds. Small claims magistrates preside over dozens of cases per morning and will cut you off. Aim to state your main point in 45 to 60 seconds.`;
    } else {
      critique = `Superb answer! You addressed the court respectfully as 'Your Honor', grounded your factual assertions in numbered exhibits, avoided emotional traps, and delivered a clear statutory foundation.`;
    }

    const plaintiffName = caseFile.parties.find(p => p.role === 'plaintiff')?.name || 'Plaintiff';
    const defendantName = caseFile.parties.find(p => p.role === 'defendant')?.name || 'Defendant';
    const suggestedRevision = `Your Honor, on behalf of ${plaintiffName}, our position is grounded strictly in verified documentary exhibits. As demonstrated in Exhibit A and Exhibit B, ${defendantName} failed to comply with statutory requirements under ${question.statutoryBasis}. We respectfully submit that the evidence establishes liability by a clear preponderance of the evidence.`;

    return {
      score,
      verdict,
      hearsayViolations,
      foundationCheck: {
        citedExhibits: citesExhibit,
        citedDatesOrAmounts: citesDatesOrAmounts,
        addressedJudgeRespectfully: addressesJudge
      },
      wordCount,
      timeEstimateSeconds: timeSeconds,
      critique,
      suggestedRevision
    };
  }

  public static analyzeSpeech(text: string, durationSeconds?: number): SpeechAnalyticsResult {
    const clean = text.trim();
    const lower = clean.toLowerCase();
    const words = clean.split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    const fillerPatterns = [
      { pattern: /\bum\b/gi, word: 'um' },
      { pattern: /\buh\b/gi, word: 'uh' },
      { pattern: /\blike\b/gi, word: 'like' },
      { pattern: /\byou know\b/gi, word: 'you know' },
      { pattern: /\bbasically\b/gi, word: 'basically' },
      { pattern: /\bliterally\b/gi, word: 'literally' },
      { pattern: /\bhonestly\b/gi, word: 'honestly' },
      { pattern: /\bactually\b/gi, word: 'actually' },
      { pattern: /\bsort of\b/gi, word: 'sort of' },
      { pattern: /\bkind of\b/gi, word: 'kind of' }
    ];

    const fillerWords: { word: string; count: number }[] = [];
    let totalFillerCount = 0;

    fillerPatterns.forEach(({ pattern, word }) => {
      const matches = clean.match(pattern);
      if (matches && matches.length > 0) {
        fillerWords.push({ word, count: matches.length });
        totalFillerCount += matches.length;
      }
    });

    const fillerPercentage = totalWords > 0 ? Math.round((totalFillerCount / totalWords) * 100) : 0;

    const effectiveDuration = durationSeconds && durationSeconds > 0 ? durationSeconds : Math.max(15, (totalWords / 130) * 60);
    const wpm = Math.round((totalWords / effectiveDuration) * 60);

    let pacingVerdict: SpeechAnalyticsResult['pacingVerdict'] = 'Optimal (120-145 WPM)';
    if (wpm > 155) pacingVerdict = 'Too Fast (>160 WPM)';
    else if (wpm < 95 && totalWords > 10) pacingVerdict = 'Too Slow (<90 WPM)';

    const respectfulAddress = lower.includes('your honor') || lower.includes('may it please the court');
    const exhibitCited = /exhibit\s+[a-z0-9]/i.test(clean) || lower.includes('exhibit');

    const emotionalPatterns = ['scam', 'liar', 'thief', 'crook', 'evil', 'greedy', 'fraudster', 'hate'];
    const emotionalLanguage = emotionalPatterns.filter(p => lower.includes(p));

    let deliveryScore = 80;
    if (respectfulAddress) deliveryScore += 10;
    else deliveryScore -= 10;

    if (exhibitCited) deliveryScore += 10;
    else deliveryScore -= 5;

    deliveryScore -= Math.min(25, totalFillerCount * 4);
    deliveryScore -= emotionalLanguage.length * 15;

    if (wpm >= 115 && wpm <= 145) deliveryScore += 5;
    deliveryScore = Math.max(10, Math.min(100, deliveryScore));

    const coachingPoints: string[] = [];
    if (!respectfulAddress) {
      coachingPoints.push('Open or close with "Your Honor". Formal judicial etiquette establishes immediate respect and credibility.');
    }
    if (totalFillerCount > 2) {
      coachingPoints.push(`Detected ${totalFillerCount} filler words (${fillerWords.map(f => `"${f.word}" x${f.count}`).join(', ')}). Practice pausing silently rather than vocalizing filler syllables.`);
    }
    if (!exhibitCited) {
      coachingPoints.push('You did not reference an Exhibit. Anchor arguments in documentary evidence: "As documented in Exhibit A..."');
    }
    if (wpm > 155) {
      coachingPoints.push(`Speaking pace (${wpm} WPM) is too fast. Rapid speech conveys nervousness and court reporters cannot capture it. Aim for 125-135 WPM.`);
    }
    if (emotionalLanguage.length > 0) {
      coachingPoints.push(`Remove subjective terms (${emotionalLanguage.map(w => `"${w}"`).join(', ')}). Frame facts dispassionately.`);
    }
    if (coachingPoints.length === 0) {
      coachingPoints.push('Outstanding courtroom cadence! Measured pacing, respectful judicial address, and zero distracting filler words.');
    }

    return {
      totalWords,
      wpm,
      pacingVerdict,
      fillerWords,
      totalFillerCount,
      fillerPercentage,
      respectfulAddress,
      exhibitCited,
      emotionalLanguage,
      deliveryScore,
      coachingPoints
    };
  }

  public static speakQuestion(text: string, personaId?: JudicialPersona['id']): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const persona = personaId ? this.getPersona(personaId) : JUDICIAL_PERSONAS[0];
      utterance.pitch = persona.pitch;
      utterance.rate = persona.rate;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
        if (englishVoice) utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable:', e);
    }
  }

  public static stopSpeaking(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Speech synthesis cancel error:', e);
    }
  }
}
