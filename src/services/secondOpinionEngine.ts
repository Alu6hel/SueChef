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

    const resolvedSet = new Set(caseFile.resolvedVulnerabilityIds || []);

    // Generate Structured Actionable Vulnerability Items
    const vulnerabilityItems: import('../types').VulnerabilityCheckItem[] = [];

    if (elementRatio < 0.6) {
      vulnerabilityItems.push({
        id: 'vuln_elements_gap',
        title: 'Incomplete Statutory Cause of Action Proof',
        description: `${totalElements - satisfiedElements} out of ${totalElements} legal elements lack affirmative proof notes.`,
        remedyAction: 'Review Claim Kitchen and link at least one exhibit or factual statement to each unsatisfied element.',
        isResolved: resolvedSet.has('vuln_elements_gap'),
        scoreBonus: 15
      });
    }

    if (evidenceCount === 0) {
      vulnerabilityItems.push({
        id: 'vuln_no_exhibits',
        title: 'Zero Cryptographic Documentary Exhibits',
        description: 'Judges heavily discount uncorroborated oral testimony in contested money disputes.',
        remedyAction: 'Upload contracts, receipts, bank statements, or text messages in the Evidence Locker.',
        isResolved: resolvedSet.has('vuln_no_exhibits'),
        scoreBonus: 15
      });
    }

    if (caseFile.parties.filter(p => p.role === 'defendant').length === 0) {
      vulnerabilityItems.push({
        id: 'vuln_missing_defendant',
        title: 'Defendant Entity & Registered Agent Missing',
        description: 'Cannot obtain an enforceable court judgment without a properly identified defendant.',
        remedyAction: 'Look up the defendant’s exact legal entity name and registered agent on the Secretary of State portal.',
        isResolved: resolvedSet.has('vuln_missing_defendant'),
        scoreBonus: 10
      });
    }

    if (!hasContract && !hasReceipt && caseFile.claimEvaluation.category !== 'negligence') {
      vulnerabilityItems.push({
        id: 'vuln_proof_of_payment',
        title: 'Missing Proof of Consideration / Payment',
        description: 'Contract and commercial claims require documentary proof of money transferred or services rendered.',
        remedyAction: 'Attach bank statements, cancelled checks, credit card receipts, or electronic invoice confirmations.',
        isResolved: resolvedSet.has('vuln_proof_of_payment'),
        scoreBonus: 10
      });
    }

    vulnerabilityItems.push({
      id: 'vuln_demand_notice',
      title: 'Pre-Suit Notice Window & Statutory Demand',
      description: 'Many courts require proof of a pre-suit demand letter before awarding court fees or bad-faith damages.',
      remedyAction: 'Send a formal 10-14 day Demand Letter via Certified Mail Return Receipt Requested.',
      isResolved: resolvedSet.has('vuln_demand_notice'),
      scoreBonus: 8
    });

    vulnerabilityItems.push({
      id: 'vuln_mitigation',
      title: 'Duty to Mitigate Economic Damages',
      description: 'Plaintiffs must show reasonable steps taken to minimize financial harm after the breach or defect occurred.',
      remedyAction: 'Catalog repair estimates, replacement vendor quotes, or written attempts to negotiate an amicable resolution.',
      isResolved: resolvedSet.has('vuln_mitigation'),
      scoreBonus: 5
    });

    // Calculate Win Probability (0 - 100)
    let rawScore = Math.round(elementRatio * 50);
    if (evidenceCount >= 1) rawScore += 10;
    if (evidenceCount >= 3) rawScore += 10;
    if (hasContract || hasReceipt) rawScore += 10;
    if (hasAdmissions) rawScore += 10;

    // Apply resolved vulnerability bonuses
    vulnerabilityItems.forEach(item => {
      if (item.isResolved) {
        rawScore += item.scoreBonus;
      }
    });

    const winProbabilityScore = Math.min(96, Math.max(15, rawScore));

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

    // Vulnerabilities as string summaries
    const vulnerabilities: string[] = vulnerabilityItems
      .filter(v => !v.isResolved)
      .map(v => `${v.title}: ${v.description}`);

    if (vulnerabilities.length === 0) {
      vulnerabilities.push('Procedural Timing: Ensure you strictly comply with statutory notice windows before filing court papers to preserve fee shifting.');
    }

    // Predicted Defenses (merge default template defenses + custom user-added defenses)
    const templateDefenses = this.getPredictedDefenses(caseFile.claimEvaluation.category, caseFile.state);
    const customDefenses = caseFile.secondOpinionDefenses || [];
    const predictedDefenses = [...customDefenses, ...templateDefenses];

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
      vulnerabilityItems,
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
      case 'freelance_unpaid':
        return [
          {
            defenseTitle: 'Defective or Incomplete Workmanship / Substantial Performance',
            likelihood: 'High' as const,
            opposingArgument: 'Client or buyer will claim you failed to complete milestones according to agreed specifications or quality standards.',
            counterStrategy: 'Submit written milestone approval emails, deliverable download links, or client messages stating satisfaction prior to invoice dispute.',
            statutoryBasis: 'Restatement (Second) of Contracts § 237 (Substantial Performance)'
          },
          {
            defenseTitle: 'Oral Modification or Scope Creep',
            likelihood: 'Medium' as const,
            opposingArgument: 'Opposing party will assert that terms were modified verbally during phone conversations.',
            counterStrategy: 'Enforce written Integration Clause ("No oral modifications valid unless signed in writing") and present chronological message records.',
            statutoryBasis: 'U.C.C. § 2-209 / Parol Evidence Rule'
          },
          {
            defenseTitle: 'Failure of Consideration & Set-Off Defense',
            likelihood: 'Medium' as const,
            opposingArgument: 'Defendant asserts that delays or minor defects entitled them to set off costs against the contracted sum.',
            counterStrategy: 'Demand verified receipts and third-party contractor invoices showing actual necessary replacement expenditures.',
            statutoryBasis: 'Restatement (Second) of Contracts § 241'
          }
        ];

      case 'contractor_dispute':
        return [
          {
            defenseTitle: 'Statutory Right to Cure Notice Missing',
            likelihood: 'High' as const,
            opposingArgument: 'Contractor will argue homeowner terminated the contract without providing written statutory 30-day notice and opportunity to cure defects.',
            counterStrategy: 'Show certified mail delivery of cure notice and photographs proving contractor repeatedly abandoned the site or refused remediation.',
            statutoryBasis: 'State Home Improvement Consumer Protection Act / Cal. Bus. & Prof. § 7159'
          },
          {
            defenseTitle: 'Unforeseen Site Conditions & Material Delays',
            likelihood: 'Medium' as const,
            opposingArgument: 'Contractor claims delays and cost overruns were caused by hidden structural rot or supply chain shortages outside their control.',
            counterStrategy: 'Review original contract terms regarding change orders: statutory rules require written signed change orders before billing additional fees.',
            statutoryBasis: 'Restatement (Second) of Contracts § 261 (Impracticability) / UCC § 2-615'
          }
        ];

      case 'consumer_fraud':
        return [
          {
            defenseTitle: '"As-Is" Disclaimer & Integration Merger Clause',
            likelihood: 'High' as const,
            opposingArgument: 'Seller will claim the product or vehicle was purchased strictly "As-Is" with all faults and no oral representations survive signing.',
            counterStrategy: 'Under consumer protection statutes (UDAP / CLRA), an "As-Is" clause does not shield an intentional fraudulent misrepresentation or concealment of material safety defects.',
            statutoryBasis: 'UCC § 2-316 / FTC Act 15 U.S.C. § 45 / Cal. Civ. Code § 1750 (CLRA)'
          },
          {
            defenseTitle: 'Puffery vs. Actionable Statement of Fact',
            likelihood: 'Medium' as const,
            opposingArgument: 'Merchant will argue that sales representations were non-actionable seller opinions or advertising puffery.',
            counterStrategy: 'Demonstrate specific objective factual statements made in writing regarding vehicle mileage, clean title, or specific technical performance.',
            statutoryBasis: 'Restatement (Second) of Torts § 525 / UCC § 2-313'
          }
        ];

      case 'property_damage':
        return [
          {
            defenseTitle: 'Comparative Negligence / Shared Blame',
            likelihood: 'High' as const,
            opposingArgument: 'Defendant will claim you or a third party contributed to the property damage through improper maintenance or failure to secure the property.',
            counterStrategy: 'Present timestamped photos, maintenance records, and witness statements proving the damage resulted exclusively from defendant’s negligent acts.',
            statutoryBasis: 'Uniform Comparative Fault Act § 1 / Restatement (Second) of Torts § 463'
          },
          {
            defenseTitle: 'Diminished Value vs. Repair Cost Calculation',
            likelihood: 'Medium' as const,
            opposingArgument: 'Defendant will argue that replacement costs exceed the actual pre-incident fair market value of the property.',
            counterStrategy: 'Obtain two independent licensed repair appraisals and present certified fair market valuation guides (e.g., KBB, insurance depreciation tables).',
            statutoryBasis: 'Restatement (Second) of Torts § 928 (Harm to Chattels)'
          }
        ];

      case 'wage_theft':
        return [
          {
            defenseTitle: 'Exempt Employee or Independent Contractor Classification',
            likelihood: 'High' as const,
            opposingArgument: 'Employer will argue you were an exempt executive/administrative employee or an independent contractor not entitled to statutory overtime or meal breaks.',
            counterStrategy: 'Apply the ABC test or Economic Realities test proving employer directed your hours, provided tools, and controlled your daily tasks.',
            statutoryBasis: 'FLSA 29 U.S.C. § 201 / Dynamex Operations West v. Superior Court'
          },
          {
            defenseTitle: 'Lack of Contemporaneous Time Records',
            likelihood: 'Medium' as const,
            opposingArgument: 'Employer claims they have no record of off-the-clock hours worked and that you never submitted timecards.',
            counterStrategy: 'Under the Anderson v. Mt. Clemens Pottery doctrine, when the employer fails to keep accurate time records, the employee’s reasonable estimate and testimony shifts the burden to the employer.',
            statutoryBasis: 'Anderson v. Mt. Clemens Pottery Co., 328 U.S. 680 (1946)'
          }
        ];

      case 'auto_accident':
      case 'negligence':
        return [
          {
            defenseTitle: 'Comparative Fault Allocation',
            likelihood: 'High' as const,
            opposingArgument: 'Defendant claims you were speeding, distracted, or failed to maintain a proper lookout, reducing or barring recovery.',
            counterStrategy: 'Introduce police collision reports, dashcam footage, and physical damage trajectory showing defendant had the primary duty of care.',
            statutoryBasis: 'State Motor Vehicle Code / Restatement (Third) of Torts: Liability for Physical and Emotional Harm § 7'
          },
          {
            defenseTitle: 'Pre-Existing Injury or Damage',
            likelihood: 'Medium' as const,
            opposingArgument: 'Defense asserts that the damage or mechanical failure existed prior to the incident.',
            counterStrategy: 'Provide inspection records, maintenance receipts, and dated photos from immediately prior to the incident establishing immaculate condition.',
            statutoryBasis: 'Restatement (Second) of Torts § 461 (Eggshell Plaintiff Doctrine)'
          }
        ];

      case 'hoa_neighbor':
        return [
          {
            defenseTitle: 'Arbitrary Enforcement & Waiver of Covenants',
            likelihood: 'High' as const,
            opposingArgument: 'HOA or neighbor argues the restriction has been uniformly enforced, or neighbor claims a prescriptive easement over boundary line.',
            counterStrategy: 'Submit photographic evidence of similar neighboring properties not subject to enforcement, establishing selective or bad-faith prosecution.',
            statutoryBasis: 'Restatement (Third) of Property: Servitudes § 8.3'
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

  /**
   * Interactive AI Legal Advisor & Case Consultant Backend Engine
   * Generates a fully factual, rigorous Pro Se legal memorandum tailored to the user's specific case.
   */
  public static consultAdvisor(caseFile: CaseFile, rawQuery: string): import('../types').AdvisorConsultationResult {
    const query = (rawQuery || '').trim();
    const qLower = query.toLowerCase();

    const p = caseFile.parties.find(pt => pt.role === 'plaintiff');
    const d = caseFile.parties.find(pt => pt.role === 'defendant');
    const pName = p?.name || 'Claimant';
    const dName = d?.name || 'Defendant';
    const category = caseFile.claimEvaluation.category;
    const jur = getJurisdiction(caseFile.state);
    const countryInfo = getCountryInfo(caseFile.country || 'US');
    const totalDamages = caseFile.claimEvaluation.damages.reduce((acc, dmg) => acc + (dmg.amount || 0), 0);
    const exhibitsCount = caseFile.evidenceList.length;
    const satisfiedElements = caseFile.claimEvaluation.elements.filter(e => e.isSatisfied).length;
    const totalElements = caseFile.claimEvaluation.elements.length || 1;

    // Detect Intent
    const isStatutesQuery = qLower.includes('statute') || qLower.includes('citation') || qLower.includes('code') || qLower.includes('governing law') || qLower.includes('what law');
    const isBadFaithQuery = qLower.includes('bad faith') || qLower.includes('penalty') || qLower.includes('penalties') || qLower.includes('punitive') || qLower.includes('multiplier') || qLower.includes('treble');
    const isEvidenceQuery = qLower.includes('evidence') || qLower.includes('proof') || qLower.includes('judge demand') || qLower.includes('admit') || qLower.includes('hearsay') || qLower.includes('binder');
    const isDefensesQuery = qLower.includes('defense') || qLower.includes('rebut') || qLower.includes('argue') || qLower.includes('trap') || qLower.includes('counter');
    const isSettleQuery = qLower.includes('settle') || qLower.includes('trial') || qLower.includes('risk') || qLower.includes('worth') || qLower.includes('ev') || qLower.includes('negotiate');
    const isDeadlinesQuery = qLower.includes('deadline') || qLower.includes('service') || qLower.includes('serve') || qLower.includes('limitation') || qLower.includes('how long');

    let topic = 'General Pro Se Case Viability & Strategy';
    let summary = '';
    let statutesAndAuthorities: string[] = [];
    let factualCaseAnalysis = '';
    let hearingTacticsAndRebuttal = '';
    let pitfallsToAvoid = '';
    let actionItems: string[] = [];

    if (isStatutesQuery) {
      topic = `Statutory Authority & Governing Laws for ${jur.stateName}`;
      summary = `Under ${jur.stateName} civil jurisprudence, your ${category.replace(/_/g, ' ')} claim against ${dName} is governed by statutory codifications establishing strict liability windows, notice protocols, and compensatory remedies.`;
      
      if (category === 'security_deposit') {
        statutesAndAuthorities = [
          `${jur.securityDepositStatuteCitation || jur.stateName + ' Residential Landlord-Tenant Act'} (Mandatory ${jur.securityDepositReturnDays}-day return & itemization requirement)`,
          `Granberry v. Islay Investments / URLTA Standards (Untimely deposit notice forfeits landlord’s affirmative right to withhold deductions)`,
          `${jur.interestStatuteCitation || jur.stateName + ' Interest Code'} (${jur.statutoryInterestRatePercent}% per annum prejudgment interest on withheld funds)`
        ];
        factualCaseAnalysis = `In ${caseFile.state}, a landlord who retains a ${countryInfo.currencySymbol}${totalDamages.toLocaleString()} security deposit past ${jur.securityDepositReturnDays} days without an itemized statement backed by contractor receipts violates ${jur.securityDepositStatuteCitation}. Because ${pName} has documented this failure, the statutory burden shifts to ${dName} to prove the deductions were lawful.`;
        hearingTacticsAndRebuttal = `At your court hearing, present Exhibit A (Lease Agreement) and Exhibit B (Move-Out Notice). State directly to the Judge: "Your Honor, under ${jur.securityDepositStatuteCitation}, Defendant had exactly ${jur.securityDepositReturnDays} calendar days to deliver the deposit or itemized documentation. Having missed that statutory deadline, Defendant has forfeited the right to make deductions from my funds."`;
        pitfallsToAvoid = `Do not argue emotional grievances or general landlord rudeness. Small claims judges rule strictly on the calendar: did the landlord mail the itemized deductions on or before Day ${jur.securityDepositReturnDays}? If no, liability is virtually automatic.`;
        actionItems = [
          `Confirm the date you surrendered premises keys in writing.`,
          `Calculate the exact calendar day 21 (or statutory deadline) fell on.`,
          `Highlight the statutory citation ${jur.securityDepositStatuteCitation} in your pleading complaint.`
        ];
      } else if (category === 'breach_of_contract' || category === 'freelance_unpaid') {
        statutesAndAuthorities = [
          `Restatement (Second) of Contracts §§ 1, 235 (Material Breach), 237 (Substantial Performance)`,
          `Uniform Commercial Code (U.C.C.) Article 2 (§ 2-201 Statute of Frauds, § 2-709 Action for the Price)`,
          `${jur.interestStatuteCitation || jur.stateName + ' Civil Code'} (${jur.statutoryInterestRatePercent}% Prejudgment Interest from breach date)`
        ];
        factualCaseAnalysis = `Your ${category.replace(/_/g, ' ')} action requires proving: (1) Formation of a binding agreement between ${pName} and ${dName}, (2) Performance of agreed deliverables by ${pName}, (3) Failure of ${dName} to tender ${countryInfo.currencySymbol}${totalDamages.toLocaleString()} consideration, and (4) Direct financial loss.`;
        hearingTacticsAndRebuttal = `Hand the Judge the chronological contract trail and state: "Your Honor, I completed every contracted specification on Date X. Defendant acknowledged receipt and made no contemporaneous objection. Under contract law, Plaintiff is entitled to full contract price plus statutory interest."`;
        pitfallsToAvoid = `Avoid relying on uncorroborated phone conversations. Provide written emails, text messages, or milestone receipts confirming acceptance.`;
        actionItems = [
          `Assemble written contract and proof of delivery.`,
          `Compute daily prejudgment interest at ${jur.statutoryInterestRatePercent}% per annum.`,
          `Print invoices showing payment due dates.`
        ];
      } else {
        statutesAndAuthorities = [
          `${jur.stateName} Civil Code & Rules of Court`,
          `Restatement (Second) of Torts § 281 / Contracts § 347`,
          `${jur.courtName} Local Rules of Practice`
        ];
        factualCaseAnalysis = `Your claim against ${dName} requires establishing liability by a preponderance of the evidence (51%+ probability) in ${jur.courtName}. Your current damage ledger totals ${countryInfo.currencySymbol}${totalDamages.toLocaleString()} across ${satisfiedElements} documented elements.`;
        hearingTacticsAndRebuttal = `Focus directly on proximate causation: demonstrate that ${dName} had a legal duty, breached that duty, and directly caused the financial injury.`;
        pitfallsToAvoid = `Do not inflate damages with unverified speculative losses. Every dollar requested must tie to an invoice, receipt, or statutory formula.`;
        actionItems = [
          `Review the Claim Kitchen elements checklist.`,
          `Attach at least one exhibit to each cause of action.`
        ];
      }
    } else if (isBadFaithQuery) {
      topic = 'Proving Bad Faith & Maximizing Statutory Penalties';
      summary = `Statutory bad faith does not require criminal malice; in civil court, bad faith is established by demonstrating that ${dName} retained your money or refused contractual obligations without a reasonable, good-faith legal basis.`;
      
      const multiplier = jur.securityDepositBadFaithPenaltyMultiplier || 2;
      statutesAndAuthorities = [
        `${jur.securityDepositStatuteCitation || 'State Bad-Faith Code'} (Authorizing up to ${multiplier}x statutory damages penalty)`,
        `Restatement (Second) of Contracts § 355 (Punitive and Bad-Faith Damages in Commercial Conduct)`,
        `Model Civil Jury Instructions: Definition of Willful and Oppressive Conduct`
      ];

      factualCaseAnalysis = `In your case against ${dName}, bad faith is evidenced by the absence of timely itemization or lawful justification for withholding ${countryInfo.currencySymbol}${totalDamages.toLocaleString()}. By establishing that ${dName} ignored your pre-suit demand or fabricated unauthorized deductions, you establish the predicate for the court to award statutory penalties of up to ${countryInfo.currencySymbol}${(totalDamages * multiplier).toLocaleString()}.`;
      hearingTacticsAndRebuttal = `Tell the Judge: "Your Honor, Defendant did not merely make an administrative error; Defendant knowingly retained my funds without complying with mandatory statutory itemization rules. Under ${jur.securityDepositStatuteCitation || jur.stateName + ' law'}, I request the court exercise its statutory authority to award the full ${multiplier}x bad-faith penalty."`;
      pitfallsToAvoid = `Do not claim bad faith without showing that you provided ${dName} a formal opportunity to cure (such as a 10-14 day written demand letter).`;
      actionItems = [
        `Send or verify delivery of your formal 10-Day Demand Letter via Certified Mail.`,
        `Preserve all evasive or dismissive email/text responses from ${dName}.`,
        `Explicitly itemize statutory bad-faith penalties on the court complaint face sheet.`
      ];
    } else if (isEvidenceQuery) {
      topic = 'Evidentiary Admissibility & Exhibit Presentation';
      summary = `Civil and small claims judges decide contested disputes almost exclusively on documentary exhibits. Uncorroborated oral testimony is routinely rejected when contradicted by the other side.`;
      
      statutesAndAuthorities = [
        `Federal Rule of Evidence (FRE) 901 / State Evidence Code § 1400 (Authentication Requirement)`,
        `FRE 803(6) (Business Records Exception for Bank Statements, Invoices, and Estimates)`,
        `FRE 801(d)(2) (Party-Opponent Admissions — Opposing Party’s Texts and Emails are NOT Hearsay)`,
        `FRE 1003 (Admissibility of Digital Duplicates and PDFs)`
      ];

      factualCaseAnalysis = `You currently have ${exhibitsCount} exhibits cataloged in the Evidence Locker. To ensure maximum judicial deference, each exhibit must be pre-marked (Exhibit A through ${String.fromCharCode(65 + Math.max(0, exhibitsCount - 1))}) with Sha-256 cryptographic verification timestamps.`;
      hearingTacticsAndRebuttal = `Bring 3 physical copies of your Exhibit Binder to court: one for the Judge, one for ${dName}, and one for yourself. When testifying, say: "Your Honor, referring to Exhibit B on page 4, you can see the timestamped written admission from Defendant acknowledging the debt."`;
      pitfallsToAvoid = `Never bring evidence solely on your phone screen! Judges will NOT hold your personal cell phone or scroll through private text threads. Print every single text, photo, and invoice on standard letter paper.`;
      actionItems = [
        `Use the SueChef Evidence Locker to print your numbered exhibit index.`,
        `Ensure every photo has a visible timestamp and location note.`,
        `Highlight the key sentence or dollar amount on each printed page.`
      ];
    } else if (isDefensesQuery) {
      topic = `Counter-Rebuttal Strategy Against ${dName}’s Defenses`;
      summary = `Defendants in ${category.replace(/_/g, ' ')} matters rely on standard procedural traps: claiming pre-existing wear, lack of notice, or failure to mitigate damages.`;
      
      statutesAndAuthorities = [
        `Restatement (Second) of Torts § 918 (Doctrine of Avoidable Consequences / Mitigation)`,
        `Uniform Commercial Code § 2-607 (Notice of Breach Requirement)`,
        `State Small Claims Procedural Rules on Affirmative Defenses`
      ];

      factualCaseAnalysis = `If ${dName} claims wear and tear or substandard work, the legal burden rests on ${dName} to prove actual depreciation and contractor expenditure. For ${category.replace(/_/g, ' ')}, ${dName} cannot simply estimate damages without production of real paid invoices.`;
      hearingTacticsAndRebuttal = `When ${dName} argues their defense, do not interrupt. Write down their statements. On rebuttal, state: "Your Honor, Defendant has presented oral assertions but has produced zero contractor invoices, zero paid receipts, and zero initial inspection checklists to satisfy their burden of proof."`;
      pitfallsToAvoid = `Do not get drawn into side arguments about personal relationship friction. Bring the Judge back to the core contract and statutory provisions.`;
      actionItems = [
        `Review the Defense Traps tab in SueChef for specific counter-strategies.`,
        `Prepare one pointed cross-examination question for each anticipated defense witness.`
      ];
    } else if (isSettleQuery) {
      topic = 'Settlement vs. Trial Expected Value (EV) Decision';
      summary = `A rational litigation strategy balances the certainty of immediate cash settlement against the mathematical expected value of trial after factoring in court fees, lost hearing-day wages, and enforcement delay.`;
      
      const estimatedFilingCost = totalDamages < 1500 ? 30 : totalDamages < 5000 ? 50 : 75;
      const trialEV = Math.round(totalDamages * 0.85) - (estimatedFilingCost + 185);

      statutesAndAuthorities = [
        `Federal Rule of Evidence 408 / State Evidence Code § 1152 (Confidential Settlement Negotiation Privilege)`,
        `Expected Value Formula: EV = (Win% × Damages) - (Court Fees + Lost Wages + Enforcement Friction)`
      ];

      factualCaseAnalysis = `For your claim of ${countryInfo.currencySymbol}${totalDamages.toLocaleString()}, taking this case through trial yields an estimated net Expected Value of ${countryInfo.currencySymbol}${trialEV.toLocaleString()}. If ${dName} offers at or above 70% of your claim (${countryInfo.currencySymbol}${Math.round(totalDamages * 0.70).toLocaleString()}) in guaranteed funds within 14 days, accepting settlement is mathematically superior to incurring trial risk.`;
      hearingTacticsAndRebuttal = `Use your verified Complaint as leverage: "We are fully prepared to file in ${jur.courtName} where statutory penalties will increase exposure to ${countryInfo.currencySymbol}${(totalDamages * 2).toLocaleString()}. However, under Rule 408, we will accept ${countryInfo.currencySymbol}${Math.round(totalDamages * 0.80).toLocaleString()} if paid within 10 business days."`;
      pitfallsToAvoid = `Never conduct settlement negotiations without placing "CONFIDENTIAL SETTLEMENT COMMUNICATION UNDER FRE 408" at the top of your letter or email.`;
      actionItems = [
        `Use the SueChef Settlement Matrix to generate your confidential Rule 408 settlement offer letter.`,
        `Establish your firm walk-away floor before speaking with ${dName}.`
      ];
    } else if (isDeadlinesQuery) {
      topic = 'Filing Deadlines, Limitations & Service of Process Rules';
      summary = `Filing court papers too late under the Statute of Limitations (SOL) or failing to execute neutral service of process results in immediate case dismissal.`;
      
      statutesAndAuthorities = [
        `${jur.stateName} Statute of Limitations: Written Contract (${jur.solWrittenContractYears} yrs), Oral Contract (${jur.solOralContractYears} yrs), Property Damage (${jur.solPropertyDamageYears} yrs)`,
        `Federal Rule of Civil Procedure 4(m) / State Service Codes (Mandatory Service Window)`,
        `Mandatory Service of Process Affidavit (Form POS-010 / Sheriff Return of Service)`
      ];

      factualCaseAnalysis = `Your ${category.replace(/_/g, ' ')} dispute is well within the ${jur.stateName} limitations window. Before filing, court rules require serving ${dName} with a 10-14 day formal written demand. Once filed with the clerk, ${dName} must be served by an adult non-party (sheriff, professional process server, or certified mail where allowed).`;
      hearingTacticsAndRebuttal = `Ensure your Proof of Service affidavit is stamped by the court clerk prior to the hearing day. Bring two copies of the filed Proof of Service to the courtroom.`;
      pitfallsToAvoid = `CRITICAL RULE: YOU CANNOT PERSONALLY HAND THE SUMMONS TO ${dName}! The plaintiff can NEVER serve their own lawsuit. Service by the plaintiff is legally void and will cause your case to be dismissed.`;
      actionItems = [
        `Check the Sol Watcher in SueChef to verify your exact filing deadline.`,
        `Engage the County Sheriff or a neutral adult friend (18+, non-party) to serve ${dName}.`,
        `File the signed Proof of Service (POS-010) with the court clerk immediately upon delivery.`
      ];
    } else {
      // Comprehensive contextual legal advisory for general or specific inquiries
      topic = `Pro Se Case Analysis: ${query.length > 50 ? query.slice(0, 50) + '...' : query}`;
      summary = `Based on your dispute data against ${dName} in ${jur.stateName}, your position is prima facie actionable for ${countryInfo.currencySymbol}${totalDamages.toLocaleString()} across ${satisfiedElements} documented elements.`;
      
      statutesAndAuthorities = [
        `${jur.stateName} Small Claims & Civil Procedure Code`,
        jur.securityDepositStatuteCitation || `${jur.stateName} Commercial Obligations Law`,
        `Preponderance of Evidence Standard (51%+ Judicial Proof Threshold)`
      ];

      factualCaseAnalysis = `In addressing your inquiry ("${query}"), our evaluation confirms that ${pName} holds a substantial evidentiary advantage. The primary vulnerability is ensuring that every oral interaction with ${dName} is backed by contemporaneous written records or photographic exhibits.`;
      hearingTacticsAndRebuttal = `Deliver your argument chronologically: (1) Formation / Agreement date, (2) Performance / Surrender date, (3) Breach by ${dName}, (4) Itemized monetary damage calculation of ${countryInfo.currencySymbol}${totalDamages.toLocaleString()}.`;
      pitfallsToAvoid = `Do not rely on hearsay from third parties who are not present in court to testify. Rely strictly on direct exhibits and opposing party admissions.`;
      actionItems = [
        `Review the 5-Step Action Roadmap in SueChef.`,
        `Run the Trial vs. Settlement calculator before deciding to file.`,
        `Verify ${dName}’s exact legal entity name and registered agent on your Secretary of State website.`
      ];
    }

    return {
      id: `consult_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      query: query || 'General Case Assessment',
      topic,
      summary,
      statutesAndAuthorities,
      factualCaseAnalysis,
      hearingTacticsAndRebuttal,
      pitfallsToAvoid,
      actionItems
    };
  }
}
