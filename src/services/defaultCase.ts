import { CaseFile } from '../types';

export function createDefaultCase(): CaseFile {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  return {
    id: 'case_2026_0901',
    title: 'Smith v. Vanguard Property Management LLC',
    caseNumber: '26SC-004891',
    state: 'CA',
    county: 'Santa Clara',
    courtName: 'Superior Court of California, County of Santa Clara - Small Claims Division',
    createdAt: dateStr,
    updatedAt: dateStr,
    parties: [
      {
        id: 'p_1',
        name: 'Jordan Smith',
        entityType: 'individual',
        role: 'plaintiff',
        address: '450 University Avenue, Apt 3B',
        city: 'Palo Alto',
        state: 'CA',
        zip: '94301',
        phone: '(650) 555-0192',
        email: 'jordan.smith@example.com'
      },
      {
        id: 'd_1',
        name: 'Vanguard Property Management LLC',
        entityType: 'llc',
        role: 'defendant',
        address: '1200 Silicon Valley Blvd, Suite 400',
        city: 'San Jose',
        state: 'CA',
        zip: '95110',
        phone: '(408) 555-8840',
        email: 'legal@vanguardpropmgmt.com',
        registeredAgent: 'CSC Lawyers Incorporating Service, 2710 Gateway Oaks Dr, Sacramento, CA 95833'
      }
    ],
    claimEvaluation: {
      category: 'security_deposit',
      smallClaimsLimit: 12500,
      courtRecommendation: 'small_claims',
      meritScore: 92,
      defectWarnings: [
        'Ensure you have proof of the date keys were surrendered to establish the start of the 21-day statutory clock.',
        'Obtain photographic evidence of apartment condition immediately prior to move-out.'
      ],
      remediationSuggestions: [
        'Attach move-out walk-through video and key return receipt as Exhibit A and Exhibit B.',
        'Send formal 14-day statutory demand letter citing Cal. Civ. Code § 1950.5(l) via Certified Mail.'
      ],
      settlementMin: 3200,
      settlementMax: 9600,
      elements: [
        {
          id: 'elem_1',
          title: 'Execution of Lease & Payment of Deposit',
          legalStandard: 'Cal. Civ. Code § 1950.5(b)',
          description: 'Plaintiff paid a security deposit to Defendant pursuant to a valid residential lease agreement.',
          isSatisfied: true,
          userEvidenceNotes: 'Signed lease agreement dated Aug 1, 2024 and bank wire receipt of $3,200 deposit.',
          linkedEvidenceIds: ['ev_1', 'ev_2']
        },
        {
          id: 'elem_2',
          title: 'Surrender of Possession & Termination of Tenancy',
          legalStandard: 'Cal. Civ. Code § 1950.5(g)(1)',
          description: 'Tenant fully vacated the premises, restored condition, and returned all keys to landlord.',
          isSatisfied: true,
          userEvidenceNotes: 'Keys delivered in lockbox on July 31, 2025; email confirmation received from building manager.',
          linkedEvidenceIds: ['ev_3']
        },
        {
          id: 'elem_3',
          title: 'Failure to Return Deposit / Itemize Within 21 Days',
          legalStandard: 'Cal. Civ. Code § 1950.5(g)(1)',
          description: 'Landlord failed to deliver the remaining deposit and itemized deduction list within 21 calendar days after vacating.',
          isSatisfied: true,
          userEvidenceNotes: 'No itemized deduction statement or refund received as of day 35 after move-out.',
          linkedEvidenceIds: ['ev_4']
        },
        {
          id: 'elem_4',
          title: 'Bad Faith Retention / Statutory Penalty Claim',
          legalStandard: 'Cal. Civ. Code § 1950.5(l)',
          description: 'Landlord acted in bad faith by retaining the deposit without legal basis or timely notice, subjecting them to up to 2x statutory penalty.',
          isSatisfied: true,
          userEvidenceNotes: 'Defendant ignored two written inquiries and falsely claimed apartment needed full repaint after 1 year.',
          linkedEvidenceIds: ['ev_5']
        }
      ],
      damages: [
        {
          id: 'dmg_1',
          description: 'Unreturned Security Deposit (Principal Sum)',
          category: 'direct_actual',
          amount: 3200,
          receiptEvidenceId: 'ev_2',
          statutoryBasis: 'Cal. Civ. Code § 1950.5(m)'
        },
        {
          id: 'dmg_2',
          description: 'Bad Faith Statutory Penalty (2x Withheld Amount)',
          category: 'statutory_penalty',
          amount: 6400,
          receiptEvidenceId: 'ev_5',
          statutoryBasis: 'Cal. Civ. Code § 1950.5(l)'
        },
        {
          id: 'dmg_3',
          description: 'Court Filing & Process Service Fees',
          category: 'direct_actual',
          amount: 185,
          statutoryBasis: 'Cal. Code Civ. Proc. § 1033.5'
        },
        {
          id: 'dmg_4',
          description: 'Prejudgment Statutory Interest (10% per annum)',
          category: 'interest',
          amount: 105,
          statutoryBasis: 'Cal. Civ. Code § 3287(a)'
        }
      ]
    },
    solDocket: [
      {
        id: 'sol_1',
        title: 'Statute of Limitations: Security Deposit Bad Faith & Breach',
        category: 'security_deposit',
        triggerDate: '2025-08-21',
        statutoryLimitYears: 4,
        expirationDate: '2029-08-21',
        tollingDays: 0,
        tollingNotes: ['No tolling factors currently applied.'],
        daysRemaining: 1080,
        urgencyLevel: 'safe',
        isTolled: false
      },
      {
        id: 'sol_2',
        title: 'Pre-Litigation Demand Letter Response Window',
        category: 'security_deposit',
        triggerDate: '2025-09-01',
        statutoryLimitYears: 0.04,
        expirationDate: '2025-09-15',
        tollingDays: 0,
        tollingNotes: ['14-Day Formal Cure Notice period.'],
        daysRemaining: 8,
        urgencyLevel: 'critical',
        isTolled: false
      }
    ],
    pleadings: {
      is28LineNumbered: true,
      fontFamily: 'Century Schoolbook',
      paragraphs: [
        {
          id: 'p_para_1',
          number: 1,
          heading: 'PARTIES & VENUE',
          content: 'Plaintiff Jordan Smith is an individual residing in the County of Santa Clara, State of California.',
          section: 'parties',
          linkedEvidenceIds: []
        },
        {
          id: 'p_para_2',
          number: 2,
          content: 'Defendant Vanguard Property Management LLC is a California limited liability company doing business and managing residential property in Santa Clara County, California.',
          section: 'parties',
          linkedEvidenceIds: []
        },
        {
          id: 'p_para_3',
          number: 3,
          content: 'Venue is proper in this judicial district pursuant to Cal. Code Civ. Proc. § 395(a) because the residential lease contract was entered into and performed within Santa Clara County.',
          section: 'jurisdiction_venue',
          linkedEvidenceIds: ['ev_1']
        },
        {
          id: 'p_para_4',
          number: 4,
          heading: 'FACTUAL ALLEGATIONS',
          content: 'On or about August 1, 2024, Plaintiff entered into a written residential lease agreement with Defendant for the real property located at 450 University Avenue, Apt 3B, Palo Alto, CA 94301.',
          section: 'facts',
          linkedEvidenceIds: ['ev_1']
        },
        {
          id: 'p_para_5',
          number: 5,
          content: 'Pursuant to the lease agreement, Plaintiff deposited with Defendant the sum of $3,200.00 as a refundable security deposit.',
          section: 'facts',
          linkedEvidenceIds: ['ev_2']
        },
        {
          id: 'p_para_6',
          number: 6,
          content: 'On July 31, 2025, Plaintiff fully vacated the premises, restored the property to clean condition reasonable wear and tear excepted, and surrendered possession and all keys to Defendant.',
          section: 'facts',
          linkedEvidenceIds: ['ev_3']
        },
        {
          id: 'p_para_7',
          number: 7,
          content: 'More than 21 calendar days have elapsed since Plaintiff surrendered possession. Defendant has wholly failed to deliver an itemized statement of deductions or return any portion of the security deposit in violation of Cal. Civ. Code § 1950.5(g)(1).',
          section: 'facts',
          linkedEvidenceIds: ['ev_4', 'ev_5']
        },
        {
          id: 'p_para_8',
          number: 8,
          heading: 'FIRST CAUSE OF ACTION — VIOLATION OF CAL. CIV. CODE § 1950.5',
          content: 'Plaintiff incorporates herein by reference Paragraphs 1 through 7 as though fully set forth herein.',
          section: 'causes_of_action',
          linkedEvidenceIds: []
        },
        {
          id: 'p_para_9',
          number: 9,
          content: 'Defendant’s failure and refusal to return the security deposit was willful and in bad faith, entitling Plaintiff to statutory damages up to twice the amount of the security deposit under Cal. Civ. Code § 1950.5(l).',
          section: 'causes_of_action',
          linkedEvidenceIds: ['ev_5']
        },
        {
          id: 'p_para_10',
          number: 10,
          heading: 'PRAYER FOR RELIEF',
          content: 'WHEREFORE, Plaintiff prays for judgment against Defendant as follows: (1) Actual damages of $3,200.00; (2) Statutory bad faith damages of $6,400.00 pursuant to Cal. Civ. Code § 1950.5(l); (3) Prejudgment interest at the legal rate; (4) Costs of suit; and (5) Such other and further relief as the Court deems just and proper.',
          section: 'prayer',
          linkedEvidenceIds: []
        }
      ],
      demandLetter: {
        demandDate: '2025-09-01',
        responseDeadlineDays: 14,
        demandedAmount: 3200,
        settlementOfferText: 'Please remit payment of the full deposit sum of $3,200.00 within 14 calendar days to avoid formal civil action seeking statutory bad-faith damages of $9,600.00 plus court costs.',
        certifiedMailNumber: '7021 0950 0001 4829 3910'
      },
      verificationAffidavit: {
        declarantName: 'Jordan Smith',
        county: 'Santa Clara',
        isSworn: true
      }
    },
    evidenceList: [
      {
        id: 'ev_1',
        title: 'Residential Lease Agreement (Signed)',
        category: 'contract',
        originalFileName: 'Lease_Agreement_University_Ave.pdf',
        fileSizeBytes: 2458190,
        sha256Hash: 'a7b8e39f02c418de491b2c68f192b0c39f0d11c79a200f8983e20fa16892e661',
        dateAcquired: '2024-08-01',
        dateOccurred: '2024-08-01',
        custodian: 'Jordan Smith',
        admissibilityChecklist: {
          authenticationFre901: true,
          hearsayExceptionFre803: true,
          bestEvidenceFre1002: true,
          relevanceFre401: true
        },
        exhibitTag: 'EXHIBIT A',
        linkedParagraphIds: ['p_para_3', 'p_para_4'],
        notes: 'Signed 12-month lease with explicit terms detailing $3,200 refundable deposit.'
      },
      {
        id: 'ev_2',
        title: 'Bank Wire Confirmation of Security Deposit',
        category: 'receipt',
        originalFileName: 'Chase_Wire_Receipt_3200.pdf',
        fileSizeBytes: 412090,
        sha256Hash: 'c94f0e1a68192df7850a11cb93019f20e408da819a584820bc0112fa5720d588',
        dateAcquired: '2024-08-01',
        dateOccurred: '2024-08-01',
        custodian: 'Jordan Smith / JPMorgan Chase',
        admissibilityChecklist: {
          authenticationFre901: true,
          hearsayExceptionFre803: true,
          bestEvidenceFre1002: true,
          relevanceFre401: true
        },
        exhibitTag: 'EXHIBIT B',
        linkedParagraphIds: ['p_para_5'],
        notes: 'Bank record proving timely electronic transfer of $3,200 to Vanguard Property Mgmt account.'
      },
      {
        id: 'ev_3',
        title: 'Move-Out Inspection & Key Return Email Thread',
        category: 'email',
        originalFileName: 'MoveOut_KeyReturn_Email.pdf',
        fileSizeBytes: 182400,
        sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        dateAcquired: '2025-07-31',
        dateOccurred: '2025-07-31',
        custodian: 'Jordan Smith',
        admissibilityChecklist: {
          authenticationFre901: true,
          hearsayExceptionFre803: true,
          bestEvidenceFre1002: true,
          relevanceFre401: true
        },
        exhibitTag: 'EXHIBIT C',
        linkedParagraphIds: ['p_para_6'],
        notes: 'Building manager Maria Gomez confirms keys received in lockbox on 07/31/2025.'
      },
      {
        id: 'ev_4',
        title: 'Move-Out Condition High-Resolution Photo Log',
        category: 'photo',
        originalFileName: 'Apt3B_MoveOut_Photos_Binder.pdf',
        fileSizeBytes: 8940120,
        sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        dateAcquired: '2025-07-31',
        dateOccurred: '2025-07-31',
        custodian: 'Jordan Smith',
        admissibilityChecklist: {
          authenticationFre901: true,
          hearsayExceptionFre803: true,
          bestEvidenceFre1002: true,
          relevanceFre401: true
        },
        exhibitTag: 'EXHIBIT D',
        linkedParagraphIds: ['p_para_6', 'p_para_7'],
        notes: '38 time-stamped EXIF photos demonstrating pristine walls, scrubbed oven, clean carpets.'
      },
      {
        id: 'ev_5',
        title: '14-Day Formal Demand Letter & USPS Certified Mail Tracking',
        category: 'report',
        originalFileName: 'Demand_Letter_USPS_Certified.pdf',
        fileSizeBytes: 320150,
        sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        dateAcquired: '2025-09-01',
        dateOccurred: '2025-09-01',
        custodian: 'Jordan Smith / USPS',
        admissibilityChecklist: {
          authenticationFre901: true,
          hearsayExceptionFre803: true,
          bestEvidenceFre1002: true,
          relevanceFre401: true
        },
        exhibitTag: 'EXHIBIT E',
        linkedParagraphIds: ['p_para_7', 'p_para_9'],
        notes: 'Delivered to Vanguard corporate HQ on 09/03/2025 with signed green return receipt.'
      }
    ],
    serviceRecords: [
      {
        id: 'srv_1',
        defendantId: 'd_1',
        defendantName: 'Vanguard Property Management LLC',
        serviceMethod: 'statutory_agent',
        filingDate: '2025-09-05',
        deadlineDate: '2025-12-04',
        daysRemaining: 90,
        status: 'in_progress',
        affidavitSigned: false,
        attempts: [
          {
            id: 'att_1',
            timestamp: '2025-09-05 10:15 AM',
            address: '2710 Gateway Oaks Dr, Sacramento, CA 95833 (CSC Registered Agent Office)',
            serverName: 'Apex Legal Process Services Inc. (Reg. #492)',
            success: true,
            notes: 'Personal delivery of Summons, Complaint, and Exhibit Binder to intake officer Brenda Vance.',
            gpsCoords: '38.6142° N, 121.5034° W'
          }
        ]
      }
    ],
    discovery: {
      interrogatories: [
        {
          id: 'rog_1',
          number: 1,
          category: 'interrogatory',
          questionText: 'State the exact date, time, and method by which Defendant received the keys and physical possession of the subject rental property from Plaintiff.',
          targetObjective: 'Lock in the exact start date of the mandatory 21-day statutory clock under Cal. Civ. Code § 1950.5(g)(1).',
          objectionRiskNotes: 'Standard identification question. Any objection for vagueness will be overruled.'
        },
        {
          id: 'rog_2',
          number: 2,
          category: 'interrogatory',
          questionText: 'Identify each individual employee or contractor who performed an inspection of the subject premises between July 31, 2025 and August 21, 2025.',
          targetObjective: 'Discover potential defense witnesses and expose lack of timely move-out inspection.',
          objectionRiskNotes: 'Directly relevant to whether landlord had legitimate basis to withhold funds.'
        },
        {
          id: 'rog_3',
          number: 3,
          category: 'interrogatory',
          questionText: 'State whether Defendant deposited Plaintiff’s $3,200.00 security deposit into a segregated trust or escrow account, and state the bank name and account number.',
          targetObjective: 'Establish commingling of funds to support statutory bad-faith claim.',
          objectionRiskNotes: 'Defendant may assert privacy objection; narrow to account title and bank name.'
        }
      ],
      rfps: [
        {
          id: 'rfp_1',
          number: 1,
          category: 'rfp',
          questionText: 'Produce all written communications, including emails, text messages, and internal property management notes, concerning Plaintiff’s security deposit.',
          targetObjective: 'Uncover smoking-gun internal admissions demonstrating intentional delay in refunding.',
          objectionRiskNotes: 'Narrowly tailored in time (July 1, 2025 to present).'
        },
        {
          id: 'rfp_2',
          number: 2,
          category: 'rfp',
          questionText: 'Produce all itemized contractor invoices, receipts, and canceled checks for any alleged repairs or painting performed on the subject unit after July 31, 2025.',
          targetObjective: 'Prove that landlord never actually paid for claimed repairs or inflated costs.',
          objectionRiskNotes: 'Mandatory under Cal. Civ. Code § 1950.5(g)(2).'
        }
      ],
      rfas: [
        {
          id: 'rfa_1',
          number: 1,
          category: 'rfa',
          questionText: 'Admit that Defendant did not mail or deliver an itemized security deposit deduction statement to Plaintiff on or before August 21, 2025.',
          targetObjective: 'FORCE ADMISSION of statutory violation. If ignored for 30 days, deemed admitted by law!',
          objectionRiskNotes: 'Clear, concise, single-issue statement.'
        },
        {
          id: 'rfa_2',
          number: 2,
          category: 'rfa',
          questionText: 'Admit that Plaintiff paid the sum of $3,200.00 as a refundable deposit under the subject lease agreement.',
          targetObjective: 'Conclusively establish principal damages sum before trial.',
          objectionRiskNotes: 'Undisputable fact supported by bank wire receipt Exhibit B.'
        }
      ],
      subpoenas: [
        {
          id: 'sub_1',
          thirdPartyName: 'JPMorgan Chase Bank, N.A.',
          thirdPartyAddress: 'National Subpoena Processing Center, 500 Stanton Christiana Rd, Newark, DE 19713',
          documentsRequested: 'Certified bank statements and wire receipt records for Vanguard Property Management LLC Account #****4912 for August 1, 2024 and July-August 2025.',
          relevanceDeclaration: 'Records are necessary to establish receipt and handling of security deposit funds in compliance with California trust accounting standards.',
          complianceDeadlineDays: 20
        }
      ]
    },
    trialPrep: {
      openingStatementDraft: `May it please the Court: My name is Jordan Smith, and I am the Plaintiff in this matter. This case is about a simple, fundamental statutory protection enacted by the California Legislature in Civil Code Section 1950.5. 

On August 1, 2024, I paid a $3,200 security deposit. On July 31, 2025, I surrendered the apartment in immaculate condition and handed over the keys. Under California law, a landlord has an unconditional 21-day deadline to either return the deposit in full or provide an itemized list of lawful deductions with receipts.

The evidence today will show that Day 21 passed on August 21st without a single word from Defendant. When I sent a formal demand letter, they ignored it. Because Defendant acted willfully and in bad faith, California Civil Code Section 1950.5(l) authorizes this Court to award statutory penalties of twice the withheld deposit. I ask the Court for judgment in the amount of $9,600 plus court costs. Thank you.`,
      closingArgumentDraft: `Your Honor: The defense has offered several excuses today, but none of them change the black-letter law of California. 

Defendant admits receiving my $3,200 deposit. Defendant admits receiving the keys on July 31st. And Defendant admits that no itemized deduction letter was sent within the mandatory 21 days. Under Granberry v. Islay Investments, a landlord who fails to provide a timely itemized statement within 21 days forfeits all right to retain any portion of the security deposit.

Furthermore, their complete disregard of my certified demand letter demonstrates bad faith as defined in Civil Code Section 1950.5(l). I respectfully ask the Court to enter judgment for $3,200 in actual damages, $6,400 in statutory penalties, and $185 in court fees. Thank you.`,
      teleprompterWpm: 130,
      witnessOutlines: [
        {
          id: 'wit_1',
          witnessName: 'Jordan Smith (Plaintiff Self-Examination)',
          witnessRole: 'plaintiff',
          directQuestions: [
            'State your name and former address.',
            'Did you enter into a residential lease with Defendant on August 1, 2024? (Direct attention to Exhibit A).',
            'How much security deposit did you pay, and how was it paid? (Direct attention to Exhibit B).',
            'When did you vacate the premises and how were keys returned? (Direct attention to Exhibit C).',
            'Did you take photographs of the apartment condition before leaving? (Direct attention to Exhibit D).',
            'Did you receive any itemized statement or refund within 21 days?'
          ],
          crossExamTraps: [
            'If defense asks about normal wear on carpet, emphasize 1-year tenancy and pre-move-in condition.',
            'If defense asks about demand letter, confirm certified mail tracking receipt Exhibit E.'
          ],
          exhibitCitations: ['EXHIBIT A', 'EXHIBIT B', 'EXHIBIT C', 'EXHIBIT D', 'EXHIBIT E']
        },
        {
          id: 'wit_2',
          witnessName: 'Maria Gomez (Property Manager / Defense Witness)',
          witnessRole: 'defendant',
          directQuestions: [],
          crossExamTraps: [
            'Cross Q1: Ms. Gomez, you received Plaintiff’s keys in the lockbox on July 31, 2025, correct?',
            'Cross Q2: You are aware that California law requires an itemized statement within 21 days, correct?',
            'Cross Q3: You did not mail an itemized statement on or before August 21, 2025, did you?',
            'Cross Q4: You received Plaintiff’s certified demand letter on September 3rd, correct?',
            'Cross Q5: As of today, Plaintiff’s $3,200 deposit has still not been returned, has it?'
          ],
          exhibitCitations: ['EXHIBIT C', 'EXHIBIT E']
        }
      ]
    },
    settlement: {
      claimDamages: 9600,
      winProbabilityPercent: 85,
      courtFilingFees: 185,
      processServiceFees: 75,
      expertWitnessFees: 0,
      estimatedTimeValueLoss: 450,
      openingDemandAnchor: 9600,
      targetFairSettlement: 6400,
      walkAwayFloor: 3200
    },
    chatThreads: [
      {
        id: 'chat_1',
        title: 'Move-Out & Deposit Inquiry SMS Thread',
        platform: 'iMessage',
        participantA: 'Jordan Smith',
        participantB: 'Maria Gomez (Vanguard Prop Mgr)',
        messages: [
          {
            id: 'm_1',
            senderName: 'Jordan Smith',
            isMe: true,
            timestamp: 'July 31, 2025 • 2:15 PM',
            content: 'Hi Maria, I have finished deep cleaning Apt 3B and left all 3 sets of keys in the wall lockbox as instructed. Thanks!',
            isAdmission: false
          },
          {
            id: 'm_2',
            senderName: 'Maria Gomez',
            isMe: false,
            timestamp: 'July 31, 2025 • 2:42 PM',
            content: 'Got them Jordan! Thank you for leaving the place so clean. We will process your $3,200 deposit refund.',
            isAdmission: true,
            highlightNote: 'CRITICAL ADMISSION: Landlord admits apartment was left clean and acknowledges $3,200 refundable deposit.'
          },
          {
            id: 'm_3',
            senderName: 'Jordan Smith',
            isMe: true,
            timestamp: 'August 24, 2025 • 10:05 AM',
            content: 'Hi Maria, checking in as it has now been 24 days since move-out and I have not received the deposit or any letter.',
            isAdmission: false
          },
          {
            id: 'm_4',
            senderName: 'Maria Gomez',
            isMe: false,
            timestamp: 'August 24, 2025 • 4:18 PM',
            content: 'Our corporate accounting is backed up, we will get to it next month.',
            isAdmission: true,
            highlightNote: 'ADMISSION OF STATUTORY VIOLATION: Landlord admits failure to comply with 21-day legal window due to internal backlog.'
          }
        ]
      }
    ]
  };
}
