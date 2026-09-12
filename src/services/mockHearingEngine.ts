import { CaseFile } from '../types';

export interface MockJudgeQuestion {
  id: string;
  category: string;
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

export const MOCK_QUESTIONS: MockJudgeQuestion[] = [
  {
    id: 'q_deposit_1',
    category: 'security_deposit',
    judgeName: 'Hon. Margaret Vance',
    judgeTitle: 'Small Claims Presiding Magistrate',
    question: 'Plaintiff, the landlord Apex Property Holdings LLC claims they withheld your $9,890 deposit for deep cleaning, repainting, and wall patching. Did you inspect the premises together before moving out, and what proof do you have of the condition on move-out day?',
    objective: 'Judge is testing compliance with mandatory pre-move-out inspection statutory notices (e.g. Cal. Civ. Code § 1950.5(f)) and personal foundation regarding move-out condition.',
    statutoryBasis: 'Cal. Civ. Code § 1950.5 / URLTA § 2.101',
    modelAnswer: 'Your Honor, under Cal. Civ. Code § 1950.5(f), Defendant was legally obligated to notify me in writing of my right to an initial pre-move-out inspection. As shown in Exhibit B, Defendant never gave notice. Furthermore, as shown in the timestamped photos in Exhibit C and D taken at 2:15 PM on June 30th, the premises were thoroughly scrubbed and returned in move-in condition, normal wear and tear excepted.',
    flawedAnswer: 'The landlord is a complete scammer and thief who steals everyone\'s deposit! My neighbor told me they do this to every tenant, and they are lying about the walls.'
  },
  {
    id: 'q_deposit_2',
    category: 'security_deposit',
    judgeName: 'Hon. Robert Chen',
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
    judgeName: 'Hon. Arthur Vance',
    judgeTitle: 'Civil Court Judge',
    question: 'Plaintiff, Defendant claims there was no formal signed agreement and that you performed work beyond the original verbal scope. How do you prove the terms of the agreement and mutual assent?',
    objective: 'Testing existence of enforceable contract terms, offer, acceptance, and consideration under contract law.',
    statutoryBasis: 'Restatement (Second) of Contracts §§ 17, 347 / UCC § 2-204',
    modelAnswer: 'Your Honor, as shown in Exhibit A, the written agreement was executed via confirmed email correspondence on May 10th specifying deliverables and the exact contract sum of $9,890. Under Restatement (Second) of Contracts § 17, mutual assent and consideration were fully exchanged. In addition, Exhibit F contains Defendant\'s written acceptance of the milestone deliverables without objection.',
    flawedAnswer: 'They shook hands on it and promised me! It\'s completely unfair and they are trying to cheat an honest worker.'
  },
  {
    id: 'q_wage_1',
    category: 'wage_theft',
    judgeName: 'Hon. Elena Rostova',
    judgeTitle: 'Labor & Small Claims Commissioner',
    question: 'Defendant argues you were an independent contractor rather than an employee, and therefore statutory waiting-time penalties do not apply. What evidence shows their direction and control over your hours and work?',
    objective: 'Testing statutory classification standards (ABC Test / economic realities test) for labor penalties.',
    statutoryBasis: 'Cal. Labor Code § 226.8 / Dynamex / FLSA 29 U.S.C. § 216(b)',
    modelAnswer: 'Your Honor, under the statutory ABC test, Defendant had the legal burden to prove independent business operation. As documented in Exhibit B, Defendant mandated fixed working hours from 9 AM to 5 PM, required use of company credentials, and provided direct day-to-day managerial supervision, establishing an employment relationship as a matter of law.',
    flawedAnswer: 'I have text messages showing my boss was a tyrant and micro-managed me constantly.'
  },
  {
    id: 'q_general_1',
    category: 'default',
    judgeName: 'Hon. Marcus Sterling',
    judgeTitle: 'Civil Hearing Magistrate',
    question: 'Plaintiff, walk me through your damages calculation. Exactly how did you arrive at your total claim amount of $9,890, and what documents verify each item?',
    objective: 'Testing burden of proof regarding quantified compensatory damages and avoidance of speculative recovery.',
    statutoryBasis: 'Restatement (Second) of Contracts § 347 / General Damages Principles',
    modelAnswer: 'Your Honor, our total damages of $9,890 are itemized in Section 4 of our verified Complaint. First, the principal withheld amount is $6,500, verified by the bank wire transfer in Exhibit A. Second, statutory penalties of $3,200 are authorized under governing civil statutes for bad-faith withholding. Third, court filing fees of $75 and service costs of $115 are verified by clerk receipts in Exhibit G.',
    flawedAnswer: 'I calculated it because they stressed me out so much, made me take days off work, and I think they owe me at least ten grand for all the emotional damage.'
  }
];

export class MockHearingEngine {
  public static getQuestionsForCategory(category: string): MockJudgeQuestion[] {
    const specific = MOCK_QUESTIONS.filter(q => q.category === category);
    if (specific.length > 0) {
      return [...specific, MOCK_QUESTIONS.find(q => q.category === 'default')!];
    }
    return MOCK_QUESTIONS;
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
    
    // Check for emotional character attacks & inadmissible hearsay
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
    else if (wordCount > 200) score -= 15; // Too long for small claims

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

    // Dynamic suggested revision
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
}
