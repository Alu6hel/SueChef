import { CaseFile, SecondOpinionReport, DisputeCategory } from '../types';
import { getJurisdiction } from './jurisdictions';
import { getCountryInfo, getServicesForJurisdiction } from './countries';

export class SecondOpinionEngine {
  public static generateReport(caseFile: CaseFile): SecondOpinionReport {
    const totalDamages = caseFile.claimEvaluation.damages.reduce((acc, d) => acc + (d.amount || 0), 0);
    const elements = caseFile.claimEvaluation.elements || [];
    const satisfiedElements = elements.filter(e => e.isSatisfied).length;
    const totalElements = elements.length || 1;
    const elementRatio = satisfiedElements / totalElements;

    const evidenceCount = caseFile.evidenceList.length;
    const hasContract = caseFile.evidenceList.some(e => e.category === 'contract');
    const hasReceipt = caseFile.evidenceList.some(e => e.category === 'receipt');
    const hasAdmissions = caseFile.chatThreads.some(t => t.messages.some(m => m.isAdmission));

    // Calculate Win Probability (0 - 100)
    let rawScore = Math.round(elementRatio * 60);
    if (evidenceCount >= 1) rawScore += 10;
    if (evidenceCount >= 3) rawScore += 10;
    if (hasContract || hasReceipt) rawScore += 10;
    if (hasAdmissions) rawScore += 10;

    const winProbabilityScore = Math.min(95, Math.max(15, rawScore));

    // Letter Grade
    let overallMeritGrade: SecondOpinionReport['overallMeritGrade'] = 'B';
    if (winProbabilityScore >= 90) overallMeritGrade = 'A+';
    else if (winProbabilityScore >= 80) overallMeritGrade = 'A';
    else if (winProbabilityScore >= 65) overallMeritGrade = 'B';
    else if (winProbabilityScore >= 50) overallMeritGrade = 'C';
    else if (winProbabilityScore >= 35) overallMeritGrade = 'D';
    else overallMeritGrade = 'F';

    // Jurisdiction context
    const jur = getJurisdiction(caseFile.state);
    const country = getCountryInfo(caseFile.country || 'US');

    // Strengths
    const keyStrengths: string[] = [];
    if (elementRatio >= 0.75) {
      keyStrengths.push(`Substantial Prima Facie Liability: ${satisfiedElements} of ${totalElements} essential legal elements are fully satisfied and documented.`);
    }
    if (hasAdmissions) {
      keyStrengths.push('Opposing Party Statements: Your record contains direct written admissions from the opposing party, qualifying as party-opponent admissions.');
    }
    if (evidenceCount >= 2) {
      keyStrengths.push(`Cryptographic Evidence Trail: ${evidenceCount} exhibits are cataloged with in-browser SHA-256 integrity certificates for simplified court authentication.`);
    }
    if (totalDamages <= jur.smallClaimsLimitIndividual) {
      keyStrengths.push(`Small Claims Jurisdiction Match: Your claimed amount of $${totalDamages.toLocaleString()} fits within the ${caseFile.state} small claims statutory limit ($${jur.smallClaimsLimitIndividual.toLocaleString()}).`);
    } else {
      keyStrengths.push(`High Monetary Value: Your $${totalDamages.toLocaleString()} claim qualifies for formal civil court, providing access to full pre-trial discovery and depositions.`);
    }

    // Vulnerabilities
    const vulnerabilities: string[] = [];
    if (elementRatio < 0.6) {
      vulnerabilities.push('Incomplete Element Proof: One or more statutory elements of your cause of action lack affirmative evidence.');
    }
    if (evidenceCount === 0) {
      vulnerabilities.push('Lack of Documentary Exhibits: Courts strongly disfavor oral "he-said-she-said" claims without written receipts, contracts, or text records.');
    }
    if (caseFile.parties.filter(p => p.role === 'defendant').length === 0) {
      vulnerabilities.push('Unidentified Defendant: You must identify the exact legal entity name and registered agent address for valid service of process.');
    }
    if (vulnerabilities.length === 0) {
      vulnerabilities.push('Procedural Timing: Ensure you strictly comply with statutory notice windows before filing court papers to preserve fee shifting.');
    }

    // Predicted Defenses by Category
    const predictedDefenses = this.getPredictedDefenses(caseFile.claimEvaluation.category, caseFile.state);

    // Financial Recommendation
    let proceedRecommendation: SecondOpinionReport['financialAssessment']['proceedRecommendation'] = 'Strongly Recommend Filing';
    if (winProbabilityScore >= 75 && totalDamages > 300) {
      proceedRecommendation = 'Strongly Recommend Filing';
    } else if (winProbabilityScore >= 50) {
      proceedRecommendation = 'Negotiate Pre-Trial Settlement';
    } else if (evidenceCount === 0) {
      proceedRecommendation = 'Gather Additional Evidence';
    } else {
      proceedRecommendation = 'Negotiate Pre-Trial Settlement';
    }

    const estimatedFilingCost = totalDamages < 1500 ? 30 : totalDamages < 5000 ? 50 : 75;
    const realisticRecoveryEstimate = Math.round(totalDamages * (winProbabilityScore / 100));
    const recommendedSettlementFloor = Math.round(totalDamages * 0.70);

    // Step by step roadmap
    const stepByStepRoadmap = [
      {
        stepNumber: 1,
        action: 'Send Formal Written Demand Letter via Certified Mail with Return Receipt',
        deadlineNotice: 'Must provide opposing party 10-14 days to resolve before initiating formal legal proceedings.',
        importance: 'Mandatory' as const
      },
      {
        stepNumber: 2,
        action: 'Assemble Numbered Exhibit Binder with Cryptographic Hash Certification',
        deadlineNotice: 'Organize receipts, contracts, and chat logs into Exhibits A through D.',
        importance: 'Mandatory' as const
      },
      {
        stepNumber: 3,
        action: `File Official ${caseFile.state} Small Claims / Civil Complaint Form with Court Clerk`,
        deadlineNotice: `Pay estimated court fee ($${estimatedFilingCost}) or request an in-court fee waiver (Form FW-001).`,
        importance: 'Mandatory' as const
      },
      {
        stepNumber: 4,
        action: 'Execute Neutral Service of Process on Defendant (Sheriff or Registered Server)',
        deadlineNotice: 'Must be completed at least 15 days prior to trial hearing under court rules.',
        importance: 'Mandatory' as const
      },
      {
        stepNumber: 5,
        action: 'Rehearse Direct Witness Examination and Objections with SueChef Simulator',
        deadlineNotice: 'Practice delivering chronological opening arguments under 5 minutes.',
        importance: 'Recommended' as const
      }
    ];

    // Local Help Resources
    const localHelpResources = getServicesForJurisdiction(caseFile.country || 'US', caseFile.state);

    return {
      timestamp: new Date().toISOString(),
      caseTitle: caseFile.title,
      category: caseFile.claimEvaluation.category,
      state: caseFile.state,
      country: caseFile.country || 'US',
      overallMeritGrade,
      winProbabilityScore,
      verdictSummary: this.getVerdictSummary(overallMeritGrade, winProbabilityScore, caseFile),
      keyStrengths,
      vulnerabilities,
      predictedDefenses,
      financialAssessment: {
        claimedDamages: totalDamages,
        realisticRecoveryEstimate,
        courtFilingCostEstimate: estimatedFilingCost,
        recommendedSettlementFloor,
        proceedRecommendation
      },
      stepByStepRoadmap,
      localHelpResources
    };
  }

  private static getVerdictSummary(grade: string, winProb: number, caseFile: CaseFile): string {
    const totalDamages = caseFile.claimEvaluation.damages.reduce((acc, d) => acc + (d.amount || 0), 0);
    const categoryName = caseFile.claimEvaluation.category.replace(/_/g, ' ').toUpperCase();

    if (winProb >= 80) {
      return `Solid Legal Position (${grade}): Your ${categoryName} claim demonstrates strong evidentiary foundation with quantified monetary damages of $${totalDamages.toLocaleString()}. By presenting your documented exhibits in chronological order, you hold a commanding legal advantage before a small claims judge or magistrate.`;
    } else if (winProb >= 60) {
      return `Viable Claim with Rebuttal Vulnerabilities (${grade}): You have a prima facie actionable case for $${totalDamages.toLocaleString()}, but the opposing party is likely to assert factual disputes regarding performance or pre-existing conditions. Follow the recommended counter-rebuttal roadmap below to seal your proof.`;
    } else {
      return `Preliminary Claim (${grade}): While your grievances are valid, formal civil courts require documentary proof beyond oral testimony. We recommend serving a formal Demand Letter to negotiate a settlement while collecting additional bank records or written communications.`;
    }
  }

  private static getPredictedDefenses(category: DisputeCategory, state: string) {
    switch (category) {
      case 'security_deposit':
        return [
          {
            defenseTitle: 'Ordinary Wear & Tear vs. Damage Deduction',
            likelihood: 'High' as const,
            opposingArgument: 'Landlord will claim that repainting, carpet cleaning, and scuff marks exceeded ordinary wear and tear.',
            counterStrategy: 'Cite state statutory code requiring landlord to prove extraordinary damage beyond normal tenancy. Demand itemized contractor invoices with hourly labor breakdowns.',
            statutoryBasis: 'Cal. Civ. Code § 1950.5(e) / NY Gen. Oblig. § 7-108'
          },
          {
            defenseTitle: 'Statutory Itemization Notice Timeliness',
            likelihood: 'Medium' as const,
            opposingArgument: 'Landlord may claim they mailed the itemized deductions within the statutory 21-day or 30-day window.',
            counterStrategy: 'Produce postmarked envelope or USPS delivery timestamp showing deposit deduction statement was sent untimely, forfeiting landlord’s right to withhold.',
            statutoryBasis: 'Granberry v. Islay Investments / Cal. Civ. Code § 1950.5(g)'
          },
          {
            defenseTitle: 'Pre-Existing Move-In Defects',
            likelihood: 'Medium' as const,
            opposingArgument: 'Landlord will argue the property was pristine at move-in and damaged upon surrender.',
            counterStrategy: 'Present time-stamped move-in inspection checklist, dated photos, or initial move-in email communications.',
            statutoryBasis: 'Uniform Residential Landlord & Tenant Act (URLTA) § 2.101'
          }
        ];

      case 'breach_of_contract':
      case 'contractor_dispute':
      case 'freelance_unpaid':
        return [
          {
            defenseTitle: 'Defective or Incomplete Workmanship',
            likelihood: 'High' as const,
            opposingArgument: 'Client/Owner will claim you failed to complete milestones according to agreed specifications or quality standards.',
            counterStrategy: 'Submit written milestone approval emails, deliverable download links, or client messages stating satisfaction prior to invoice dispute.',
            statutoryBasis: 'Restatement (Second) of Contracts § 237 (Substantial Performance)'
          },
          {
            defenseTitle: 'Oral Modification or Scope Creep',
            likelihood: 'Medium' as const,
            opposingArgument: 'Opposing party will assert that terms were modified verbally during phone conversations.',
            counterStrategy: 'Enforce written Integration Clause ("No oral modifications valid unless signed in writing") and present chronological message records.',
            statutoryBasis: 'U.C.C. § 2-209 / Parol Evidence Rule'
          }
        ];

      case 'consumer_fraud':
        return [
          {
            defenseTitle: '"As-Is" Disclaimer & Merger Clause',
            likelihood: 'High' as const,
            opposingArgument: 'Seller will claim the product or service was purchased "As-Is" with all faults and no express warranties.',
            counterStrategy: 'Under consumer protection statutes, an "As-Is" clause does not shield an intentional fraudulent misrepresentation or deceptive trade practice.',
            statutoryBasis: 'UCC § 2-316 / FTC Act 15 U.S.C. § 45 / State Unfair Trade Practices Act'
          }
        ];

      default:
        return [
          {
            defenseTitle: 'Comparative Fault & Failure to Mitigate',
            likelihood: 'Medium' as const,
            opposingArgument: 'Defendant will argue that your actions contributed to the loss or that you failed to minimize financial damages after the breach.',
            counterStrategy: 'Demonstrate prompt alternative vendor quotes, repair invoices, and documented attempts to resolve dispute at minimum cost.',
            statutoryBasis: 'Restatement (Second) of Torts § 918 (Avoidable Consequences)'
          }
        ];
    }
  }
}
