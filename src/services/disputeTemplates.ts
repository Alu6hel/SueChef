import { CaseFile, DisputeBlueprint, DisputeCategory } from '../types';
import { createDefaultCase } from './defaultCase';
import { getJurisdiction } from './jurisdictions';

export function createContractorBreachCase(): CaseFile {
  const base = createDefaultCase();
  return {
    ...base,
    id: 'case_contractor_2026',
    title: 'Martinez v. Apex Horizon Construction LLC',
    caseNumber: '26CV-009124',
    state: 'CA',
    county: 'Los Angeles',
    courtName: 'Superior Court of California, County of Los Angeles - Central District',
    parties: [
      {
        id: 'p_cm',
        name: '[e.g., Elena Martinez (Your Name)]',
        entityType: 'individual',
        role: 'plaintiff',
        address: '[e.g., 1840 Pasadena Ave]',
        city: '[e.g., Los Angeles]',
        state: 'CA',
        zip: '[e.g., 90031]',
        phone: '[e.g., (213) 555-4921]',
        email: '[e.g., your.name@example.com]',
        isPlaceholder: true
      },
      {
        id: 'd_apex',
        name: '[e.g., Apex Horizon Construction LLC (Contractor)]',
        entityType: 'llc',
        role: 'defendant',
        address: '[e.g., 4200 Wilshire Blvd, Suite 210]',
        city: '[e.g., Los Angeles]',
        state: 'CA',
        zip: '[e.g., 90010]',
        phone: '[e.g., (323) 555-8800]',
        registeredAgent: '[e.g., Registered Agents, 818 W 7th St, Los Angeles, CA]',
        isPlaceholder: true
      }
    ],
    claimEvaluation: {
      category: 'contractor_dispute',
      smallClaimsLimit: 12500,
      courtRecommendation: 'civil_limited',
      meritScore: 94,
      defectWarnings: [
        'Contract exceeds small claims $12.5k limit. File in Limited Civil jurisdiction.',
        'Ensure independent contractor licensed inspection report is stamped as Exhibit C.'
      ],
      remediationSuggestions: [
        'Attach licensed home inspector expert report quantifying cost to cure defect.',
        'File CSLB (Contractors State License Board) formal bond claim against contractor license surety.'
      ],
      settlementMin: 11000,
      settlementMax: 14500,
      elements: [
        {
          id: 'elem_c1',
          title: 'Valid Written Construction Contract',
          legalStandard: 'Cal. Bus. & Prof. Code § 7159',
          description: 'Parties executed a formal home improvement contract specifying scope of kitchen and bathroom remodel.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Signed contract dated October 12, 2024 with itemized payment milestones. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_c1']
        },
        {
          id: 'elem_c2',
          title: 'Plaintiff Full Payment of Required Milestones',
          legalStandard: 'Restatement (Second) of Contracts § 235',
          description: 'Homeowner timely paid $18,000 across 3 initial milestones pursuant to contract schedule.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Canceled checks and bank statements verifying $18k total payments. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_c2']
        },
        {
          id: 'elem_c3',
          title: 'Defective Workmanship & Abandonment',
          legalStandard: 'Cal. Bus. & Prof. Code § 7107',
          description: 'Contractor walked off job on Day 45, leaving plumbing unsealed and tile unlevel, causing water leakage.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Certified home inspection report detailing $14,500 cost to tear out and repair defective plumbing. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_c3']
        }
      ],
      damages: [
        {
          id: 'dmg_c1',
          description: 'Cost to Cure / Repair Defective Plumbing & Tile',
          category: 'direct_actual',
          amount: 12200,
          statutoryBasis: 'Cal. Civ. Code § 3300'
        },
        {
          id: 'dmg_c2',
          description: 'Licensed Structural Inspector Assessment Fee',
          category: 'direct_actual',
          amount: 850,
          statutoryBasis: 'Cal. Code Civ. Proc. § 1033.5'
        },
        {
          id: 'dmg_c3',
          description: 'Temporary Hotel Accommodation During Emergency Plumbing Shutoff',
          category: 'consequential',
          amount: 1450,
          statutoryBasis: 'Cal. Civ. Code § 3333'
        }
      ]
    },
    solDocket: [
      {
        id: 'sol_c1',
        title: 'Statute of Limitations: Written Contract Breach',
        category: 'contractor_dispute',
        triggerDate: '2025-01-15',
        statutoryLimitYears: 4,
        expirationDate: '2029-01-15',
        tollingDays: 0,
        tollingNotes: ['4 years for written contract under CCP § 337(a).'],
        daysRemaining: 1040,
        urgencyLevel: 'safe',
        isTolled: false
      }
    ]
  };
}

export function createFreelanceUnpaidCase(): CaseFile {
  const base = createDefaultCase();
  return {
    ...base,
    id: 'case_freelance_2026',
    title: 'Chen v. HyperScale Media Group Inc.',
    caseNumber: '26SC-012984',
    state: 'NY',
    county: 'New York',
    courtName: 'Civil Court of the City of New York, Small Claims Part',
    parties: [
      {
        id: 'p_chen',
        name: '[e.g., Alex Chen (Your Name / Studio)]',
        entityType: 'individual',
        role: 'plaintiff',
        address: '[e.g., 320 E 21st St, Apt 4F]',
        city: '[e.g., New York]',
        state: 'NY',
        zip: '[e.g., 10010]',
        phone: '[e.g., (917) 555-3021]',
        email: '[e.g., your.email@example.com]',
        isPlaceholder: true
      },
      {
        id: 'd_media',
        name: '[e.g., HyperScale Media Group Inc. (Client)]',
        entityType: 'corporation',
        role: 'defendant',
        address: '[e.g., 575 Broadway, 8th Floor]',
        city: '[e.g., New York]',
        state: 'NY',
        zip: '[e.g., 10012]',
        phone: '[e.g., (212) 555-7700]',
        registeredAgent: '[e.g., Corporation Service Company, 80 State St, Albany, NY]',
        isPlaceholder: true
      }
    ],
    claimEvaluation: {
      category: 'freelance_unpaid',
      smallClaimsLimit: 10000,
      courtRecommendation: 'small_claims',
      meritScore: 98,
      defectWarnings: [],
      remediationSuggestions: [
        'Invoke NYC Freelance Isn’t Free Act (FIFA - N.Y.C. Admin. Code § 20-927) for mandatory double damages.',
        'Attach GitHub pull request delivery commits and client Slack approvals as Exhibit A & B.'
      ],
      settlementMin: 6800,
      settlementMax: 8400,
      elements: [
        {
          id: 'elem_f1',
          title: 'Freelance Services Contract Execution',
          legalStandard: 'N.Y.C. Admin. Code § 20-928',
          description: 'Written Statement of Work (SOW) executed for React/Node.js web application frontend development.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Executed SOW signed via DocuSign specifying $8,400 project fee. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_f1']
        },
        {
          id: 'elem_f2',
          title: 'Full Code Delivery & Client Acceptance',
          legalStandard: 'UCC § 2-606',
          description: 'Plaintiff delivered production code repository, passed QA, and received written approval from CEO.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Slack approval messages from CEO stating: "Looks great, launched to prod!". Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_f2']
        },
        {
          id: 'elem_f3',
          title: 'Non-Payment After 30 Days (FIFA Violation)',
          legalStandard: 'N.Y.C. Admin. Code § 20-929',
          description: 'Client failed to pay invoice within 30 days of completion, triggering statutory double damages under NYC FIFA.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Invoice #1042 issued 65 days ago; three overdue notices ignored. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_f3']
        }
      ],
      damages: [
        {
          id: 'dmg_f1',
          description: 'Unpaid Contract Milestone Fee',
          category: 'direct_actual',
          amount: 4200,
          statutoryBasis: 'N.Y. Gen. Oblig. Law § 5-701'
        },
        {
          id: 'dmg_f2',
          description: 'NYC Freelance Isn’t Free Act Statutory Double Damages',
          category: 'statutory_penalty',
          amount: 4200,
          statutoryBasis: 'N.Y.C. Admin. Code § 20-933(b)(3)'
        }
      ]
    },
    solDocket: [
      {
        id: 'sol_f1',
        title: 'Statute of Limitations: NYC FIFA & Breach of Contract',
        category: 'freelance_unpaid',
        triggerDate: '2025-07-01',
        statutoryLimitYears: 6,
        expirationDate: '2031-07-01',
        tollingDays: 0,
        tollingNotes: ['6-year NY statute under CPLR 213(2).'],
        daysRemaining: 1800,
        urgencyLevel: 'safe',
        isTolled: false
      }
    ]
  };
}

export function createAutoAccidentCase(): CaseFile {
  const base = createDefaultCase();
  return {
    ...base,
    id: 'case_auto_2026',
    title: 'Taylor v. Ramirez (Auto Damage)',
    caseNumber: '26SC-048210',
    state: 'TX',
    county: 'Harris',
    courtName: 'Justice Court, Precinct 1, Harris County, Texas (Small Claims)',
    parties: [
      {
        id: 'p_auto',
        name: '[e.g., Jordan Taylor (Your Name)]',
        entityType: 'individual',
        role: 'plaintiff',
        address: '[e.g., 5120 Westheimer Rd]',
        city: '[e.g., Houston]',
        state: 'TX',
        zip: '[e.g., 77056]',
        phone: '[e.g., (713) 555-8120]',
        email: '[e.g., your.email@example.com]',
        isPlaceholder: true
      },
      {
        id: 'd_auto',
        name: '[e.g., Carlos Ramirez (Other Driver)]',
        entityType: 'individual',
        role: 'defendant',
        address: '[e.g., 2900 Richmond Ave]',
        city: '[e.g., Houston]',
        state: 'TX',
        zip: '[e.g., 77098]',
        phone: '[e.g., (832) 555-9011]',
        isPlaceholder: true
      }
    ],
    claimEvaluation: {
      category: 'auto_accident',
      smallClaimsLimit: 20000,
      courtRecommendation: 'small_claims',
      meritScore: 92,
      defectWarnings: [],
      remediationSuggestions: [
        'Present police crash report citing Defendant for failure to yield at signal.',
        'Submit 3 certified collision body shop estimates alongside paid repair invoices.'
      ],
      settlementMin: 5400,
      settlementMax: 6200,
      elements: [
        {
          id: 'elem_a1',
          title: 'Duty of Due Care in Operating Motor Vehicle',
          legalStandard: 'Tex. Transp. Code § 545.151',
          description: 'Defendant had a legal duty to obey traffic signals and yield right-of-way when entering intersection.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Clear statutory duty under Texas Transportation Code. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: 'elem_a2',
          title: 'Breach of Duty & Red Light Infraction',
          legalStandard: 'Tex. Transp. Code § 544.007',
          description: 'Defendant ran steady red signal at Montrose & Westheimer, striking Plaintiff’s vehicle.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Police report citing Defendant for running red light + dashcam video. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_a1', 'ev_a2']
        },
        {
          id: 'elem_a3',
          title: 'Direct Property Damage & Loss of Use',
          legalStandard: 'Restatement (Second) of Torts § 928',
          description: 'Vehicle sustained structural door frame damage, rendering it undriveable for 14 days.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Repair invoice $5,400 + Enterprise rental car receipts $800. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_a3']
        }
      ],
      damages: [
        {
          id: 'dmg_a1',
          description: 'Vehicle Body & Frame Collision Repair',
          category: 'direct_actual',
          amount: 5400,
          statutoryBasis: 'Tex. Civ. Prac. & Rem. Code § 41.001'
        },
        {
          id: 'dmg_a2',
          description: 'Loss of Vehicle Use (14-Day Enterprise Rental Car)',
          category: 'consequential',
          amount: 800,
          statutoryBasis: 'Texas Common Law Property Damages'
        }
      ]
    },
    solDocket: [
      {
        id: 'sol_a1',
        title: 'Statute of Limitations: Texas Property Damage Tort',
        category: 'auto_accident',
        triggerDate: '2025-04-10',
        statutoryLimitYears: 2,
        expirationDate: '2027-04-10',
        tollingDays: 0,
        tollingNotes: ['2 years for property damage under Tex. Civ. Prac. & Rem. Code § 16.003.'],
        daysRemaining: 420,
        urgencyLevel: 'safe',
        isTolled: false
      }
    ]
  };
}

export function createConsumerFraudCase(): CaseFile {
  const base = createDefaultCase();
  return {
    ...base,
    id: 'case_consumer_2026',
    title: 'Walker v. Apex Certified Auto Sales LLC',
    caseNumber: '26-CC-03109',
    state: 'FL',
    county: 'Miami-Dade',
    courtName: 'County Court in and for Miami-Dade County, Florida - Civil Division',
    parties: [
      {
        id: 'p_walker',
        name: '[e.g., David Walker (Your Name)]',
        entityType: 'individual',
        role: 'plaintiff',
        address: '[e.g., 742 Biscayne Blvd]',
        city: '[e.g., Miami]',
        state: 'FL',
        zip: '[e.g., 33132]',
        phone: '[e.g., (305) 555-1920]',
        email: '[e.g., your.email@example.com]',
        isPlaceholder: true
      },
      {
        id: 'd_dealer',
        name: 'Apex Certified Auto Sales LLC',
        entityType: 'llc',
        role: 'defendant',
        address: '10400 NW 27th Ave',
        city: 'Miami',
        state: 'FL',
        zip: '33147',
        phone: '(305) 555-7722',
        registeredAgent: 'Florida Registered Agents, Tallahassee, FL'
      }
    ],
    claimEvaluation: {
      category: 'consumer_fraud',
      smallClaimsLimit: 8000,
      courtRecommendation: 'civil_limited',
      meritScore: 96,
      defectWarnings: [
        'Total claim of $11,800 exceeds $8,000 Small Claims limit in Florida. File in County Court Civil Division.'
      ],
      remediationSuggestions: [
        'Invoke Florida Deceptive and Unfair Trade Practices Act (FDUTPA - Fla. Stat. § 501.204).',
        'Include certified CarFax report showing hidden frame damage omitted on dealership disclosures.'
      ],
      settlementMin: 9500,
      settlementMax: 11800,
      elements: [
        {
          id: 'elem_cf1',
          title: 'Deceptive Act or Unfair Trade Practice',
          legalStandard: 'Fla. Stat. § 501.204(1)',
          description: 'Dealership advertised vehicle as "Clean Title, 1-Owner, Accident-Free" while knowing frame was previously welded after structural total loss.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Online listing screenshots and certified pre-purchase inspection. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_cf1']
        },
        {
          id: 'elem_cf2',
          title: 'Consumer Reliance & Material Inducement',
          legalStandard: 'Fla. Stat. § 501.211',
          description: 'Plaintiff relied upon the false accident-free disclosure to pay full market price of $14,500.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Buyer purchase agreement and written salesperson warranty assurances. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_cf2']
        },
        {
          id: 'elem_cf3',
          title: 'Actual Economic Damages & Diminished Value',
          legalStandard: 'Rollins, Inc. v. Butland, 951 So. 2d 860',
          description: 'Structural inspection revealed catastrophic frame defect reducing vehicle market value by $8,500 + repair diagnostic costs.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Master mechanic appraisal and structural laser measurement report. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_cf3']
        }
      ],
      damages: [
        {
          id: 'dmg_cf1',
          description: 'Diminution in Vehicle Value (Concealed Structural Defect)',
          category: 'direct_actual',
          amount: 8500,
          statutoryBasis: 'Fla. Stat. § 501.211(2)'
        },
        {
          id: 'dmg_cf2',
          description: 'Certified Diagnostic Laser Inspection Fee',
          category: 'direct_actual',
          amount: 650,
          statutoryBasis: 'Fla. Stat. § 57.041'
        },
        {
          id: 'dmg_cf3',
          description: 'Statutory Treble Damages / FDUTPA Willful Bad Faith',
          category: 'statutory_penalty',
          amount: 2650,
          statutoryBasis: 'Fla. Stat. § 501.204'
        }
      ]
    },
    solDocket: [
      {
        id: 'sol_cf1',
        title: 'Statute of Limitations: Florida FDUTPA Claim',
        category: 'consumer_fraud',
        triggerDate: '2025-02-18',
        statutoryLimitYears: 4,
        expirationDate: '2029-02-18',
        tollingDays: 0,
        tollingNotes: ['4 years under Fla. Stat. § 95.11(3)(f).'],
        daysRemaining: 980,
        urgencyLevel: 'safe',
        isTolled: false
      }
    ]
  };
}

export function createWageTheftCase(): CaseFile {
  const base = createDefaultCase();
  return {
    ...base,
    id: 'case_wage_2026',
    title: 'Jenkins v. Prime Logistics Solutions Inc.',
    caseNumber: '2026-CH-01948',
    state: 'IL',
    county: 'Cook',
    courtName: 'Circuit Court of Cook County, Illinois - Municipal Department, First District',
    parties: [
      {
        id: 'p_jenkins',
        name: '[e.g., Marcus Jenkins (Your Name / Worker)]',
        entityType: 'individual',
        role: 'plaintiff',
        address: '[e.g., 4820 S Michigan Ave]',
        city: '[e.g., Chicago]',
        state: 'IL',
        zip: '[e.g., 60615]',
        phone: '[e.g., (312) 555-6610]',
        email: '[e.g., your.email@example.com]',
        isPlaceholder: true
      },
      {
        id: 'd_prime',
        name: '[e.g., Prime Logistics Solutions Inc. (Employer)]',
        entityType: 'corporation',
        role: 'defendant',
        address: '[e.g., 1200 S Canal St]',
        city: '[e.g., Chicago]',
        state: 'IL',
        zip: '[e.g., 60607]',
        phone: '[e.g., (312) 555-8833]',
        registeredAgent: '[e.g., Corporation Service Co, Springfield, IL]',
        isPlaceholder: true
      }
    ],
    claimEvaluation: {
      category: 'wage_theft',
      smallClaimsLimit: 10000,
      courtRecommendation: 'small_claims',
      meritScore: 97,
      defectWarnings: [],
      remediationSuggestions: [
        'Demand Illinois Wage Payment and Collection Act 5% monthly statutory penalty under 820 ILCS 115/14.',
        'Submit digital badge punch logs alongside pay stubs showing non-exempt misclassification.'
      ],
      settlementMin: 6500,
      settlementMax: 7850,
      elements: [
        {
          id: 'elem_w1',
          title: 'Employment Relationship & Non-Exempt Status',
          legalStandard: '820 ILCS 115/2 & 29 U.S.C. § 207',
          description: 'Plaintiff was employed as warehouse dispatcher/loader with zero managerial authority, non-exempt under FLSA and IWPCA.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Job description, hourly pay stubs, shift logs. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_w1']
        },
        {
          id: 'elem_w2',
          title: 'Uncompensated Overtime Hours Worked',
          legalStandard: '820 ILCS 105/4a',
          description: 'Plaintiff logged 140 uncompensated overtime hours over 7-month period with manager knowledge.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Digital GPS badge punches and Google timeline location logs. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_w2']
        },
        {
          id: 'elem_w3',
          title: 'Statutory 5% Monthly Penalty for Late Wages',
          legalStandard: '820 ILCS 115/14(a)',
          description: 'Employer unlawfully withheld overtime wages for >180 days, triggering statutory 5% per month interest penalty.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Pay stubs missing overtime calculations and demand letter. Tap to edit with your facts.]',
          linkedEvidenceIds: ['ev_w3']
        }
      ],
      damages: [
        {
          id: 'dmg_w1',
          description: 'Unpaid Overtime Wages (140 hrs @ 1.5x $28/hr rate = $42/hr)',
          category: 'direct_actual',
          amount: 5880,
          statutoryBasis: '820 ILCS 105/4a'
        },
        {
          id: 'dmg_w2',
          description: 'IWPCA 5% Per Month Statutory Underpayment Penalty',
          category: 'statutory_penalty',
          amount: 1970,
          statutoryBasis: '820 ILCS 115/14(a)'
        }
      ]
    },
    solDocket: [
      {
        id: 'sol_w1',
        title: 'Statute of Limitations: Illinois Wage Payment Act',
        category: 'wage_theft',
        triggerDate: '2025-06-30',
        statutoryLimitYears: 3,
        expirationDate: '2028-06-30',
        tollingDays: 0,
        tollingNotes: ['3-year statute of limitations under 820 ILCS 115/14.'],
        daysRemaining: 740,
        urgencyLevel: 'safe',
        isTolled: false
      }
    ]
  };
}

export const DISPUTE_BLUEPRINTS: DisputeBlueprint[] = [
  {
    id: 'template_deposit_ca',
    title: 'California Security Deposit Bad Faith',
    category: 'security_deposit',
    state: 'CA',
    damagesSummary: '$3,200 Deposit + $6,400 Statutory 2x Penalty',
    estimatedTotal: 9600,
    description: 'Landlord failed to return or itemize deposit deductions within mandatory 21 calendar days under Cal. Civ. Code § 1950.5(l).',
    caseData: createDefaultCase()
  },
  {
    id: 'template_contractor_ca',
    title: 'General Contractor Remodel Breach & Defects',
    category: 'contractor_dispute',
    state: 'CA',
    damagesSummary: '$12,200 Repair Cost + $1,450 Mitigation',
    estimatedTotal: 14500,
    description: 'Contractor abandoned home renovation project with defective plumbing and uneven tile work after receiving payments.',
    caseData: createContractorBreachCase()
  },
  {
    id: 'template_freelance_ny',
    title: 'Freelance Software Developer Unpaid Invoice (NYC FIFA)',
    category: 'freelance_unpaid',
    state: 'NY',
    damagesSummary: '$4,200 Unpaid Milestone + $4,200 Double Damages',
    estimatedTotal: 8400,
    description: 'Client accepted React web application code into production but refused payment beyond 30 days under NYC Freelance Isn’t Free Act.',
    caseData: createFreelanceUnpaidCase()
  },
  {
    id: 'template_auto_tx',
    title: 'Auto Collision & Property Damage Small Claims',
    category: 'auto_accident',
    state: 'TX',
    damagesSummary: '$5,400 Frame Repair + $800 Rental Loss',
    estimatedTotal: 6200,
    description: 'Driver ran red light causing collision damage; insurer failed to reimburse full fair market repair value.',
    caseData: createAutoAccidentCase()
  },
  {
    id: 'template_consumer_fl',
    title: 'Consumer Auto Dealer Deceptive Trade Practices (FDUTPA)',
    category: 'consumer_fraud',
    state: 'FL',
    damagesSummary: '$8,500 Diminished Value + $3,300 Penalty/Costs',
    estimatedTotal: 11800,
    description: 'Auto dealership deceptively sold salvaged frame-damaged vehicle as "clean title accident-free" in violation of Florida FDUTPA.',
    caseData: createConsumerFraudCase()
  },
  {
    id: 'template_airline_us_eu',
    title: 'Airline Flight Cancellation & Lost Luggage Compensation',
    category: 'airline_compensation',
    state: 'NY',
    damagesSummary: '$650 Statutory Cancellation + $1,220 Hotel/Luggage Out-of-Pocket',
    estimatedTotal: 1870,
    description: 'Carrier cancelled transatlantic flight without statutory notice and refused mandatory meal/hotel care and EU261/DOT delay compensation.',
    caseData: createCustomDispute({
      category: 'airline_compensation',
      opponentName: 'TransAtlantic Airlines Corp.',
      opponentType: 'corporation',
      opponentAddress: 'Terminal 4, JFK International Airport, Jamaica, NY 11430',
      plaintiffName: 'Jordan Vance',
      plaintiffEmail: 'jordan.vance@example.com',
      amount: 1870,
      incidentDate: '2026-03-14',
      state: 'NY',
      description: 'Flight cancelled at boarding gate without mechanical emergency. Carrier refused hotel voucher and ignored statutory 14 CFR Part 259 demand.'
    })
  },
  {
    id: 'template_zombie_sub',
    title: 'Zombie Subscription Recurring Billing Post-Cancellation',
    category: 'zombie_subscription',
    state: 'CA',
    damagesSummary: '$640 Unauthorized Debits + $1,500 Statutory ARL Penalty',
    estimatedTotal: 2140,
    description: 'Software platform continued charging $79.99/mo for 8 months after user cancelled account, violating FTC Click-to-Cancel & California ARL.',
    caseData: createCustomDispute({
      category: 'zombie_subscription',
      opponentName: 'Omnifit Cloud Services LLC',
      opponentType: 'llc',
      opponentAddress: '500 Howard St, Suite 400, San Francisco, CA 94105',
      plaintiffName: 'Maya Reynolds',
      plaintiffEmail: 'maya.reynolds@example.com',
      amount: 2140,
      incidentDate: '2025-08-10',
      state: 'CA',
      description: 'Cancelled subscription on web portal with screenshot confirmation. Defendant unlawfully debited credit card 8 consecutive months.'
    })
  },
  {
    id: 'template_ecommerce_misdelivery',
    title: 'E-Commerce Package Misdelivery & Porch Theft Non-Refund',
    category: 'ecommerce_fraud',
    state: 'TX',
    damagesSummary: '$1,450 Lost Electronics + $1,450 DTPA Statutory Treble/Penalty',
    estimatedTotal: 2900,
    description: 'Merchant shipped expensive computer workstation without required signature; carrier dropped at wrong street address; merchant refused refund.',
    caseData: createCustomDispute({
      category: 'ecommerce_fraud',
      opponentName: 'GadgetHub Direct LLC',
      opponentType: 'llc',
      opponentAddress: '8200 Interstate 35, Austin, TX 78753',
      plaintiffName: 'Marcus Chen',
      plaintiffEmail: 'marcus.chen@example.com',
      amount: 2900,
      incidentDate: '2026-01-22',
      state: 'TX',
      description: 'Paid $1,450 for workstation hardware. Tracking photo shows parcel left at completely different apartment complex. Merchant denied dispute.'
    })
  },
  {
    id: 'template_vacation_rental',
    title: 'Vacation Rental Habitability & Undisclosed Security Camera',
    category: 'vacation_rental',
    state: 'FL',
    damagesSummary: '$3,400 Booking Refund + $1,850 Emergency Relocation Lodging',
    estimatedTotal: 5250,
    description: 'Vacation home had non-functioning air conditioning in mid-summer and undisclosed indoor surveillance device in private living quarters.',
    caseData: createCustomDispute({
      category: 'vacation_rental',
      opponentName: 'Coastal Vista Stays LLC',
      opponentType: 'llc',
      opponentAddress: '1400 Ocean Drive, Miami Beach, FL 33139',
      plaintiffName: 'Liam O’Connor',
      plaintiffEmail: 'liam.oconnor@example.com',
      amount: 5250,
      incidentDate: '2026-06-18',
      state: 'FL',
      description: 'Arrived at vacation rental with interior temperature exceeding 92°F and discovered active lens camera disguised as smoke detector in dining hall.'
    })
  },
  {
    id: 'template_predatory_towing',
    title: 'Predatory Towing & Extortionate Impound Gate Fee Challenge',
    category: 'predatory_towing',
    state: 'CA',
    damagesSummary: '$485 Tow/Storage Fee Paid Under Protest + $1,940 4x Statutory Penalty',
    estimatedTotal: 2425,
    description: 'Tow truck operator hooked parked vehicle without property owner authorization and refused statutory half-rate drop-fee under Cal. Veh. Code § 22658.',
    caseData: createCustomDispute({
      category: 'predatory_towing',
      opponentName: 'QuickHook Recovery & Impound Services Inc.',
      opponentType: 'corporation',
      opponentAddress: '3100 E Olympic Blvd, Los Angeles, CA 90023',
      plaintiffName: 'Tunde Adeyemi',
      plaintiffEmail: 'tunde.adeyemi@example.com',
      amount: 2425,
      incidentDate: '2026-04-05',
      state: 'CA',
      description: 'Vehicle hooked while driver was standing 10 feet away. Driver offered statutory drop-fee on site; operator refused and extorted $485 cash at gate.'
    })
  },
  {
    id: 'template_fifa_double_damages',
    title: 'Freelance Isn’t Free Act (FIFA) Mandatory 100% Double Damages',
    category: 'freelance_fifa',
    state: 'NY',
    damagesSummary: '$4,500 Unpaid Web App Deliverable + $4,500 Mandatory Double Damages',
    estimatedTotal: 9000,
    description: 'Hiring agency accepted finished design sprint and deployment code, then ceased communications for >60 days violating NY Gen. Bus. Law § 1410.',
    caseData: createCustomDispute({
      category: 'freelance_fifa',
      opponentName: 'BrightScale Growth Ventures LLC',
      opponentType: 'llc',
      opponentAddress: '350 5th Ave, 59th Floor, New York, NY 10118',
      plaintiffName: 'Sarah Goldman',
      plaintiffEmail: 'sarah.goldman@example.com',
      amount: 9000,
      incidentDate: '2026-02-15',
      state: 'NY',
      description: 'Delivered client web application with signed acceptance test. Agency defaulted on $4,500 final invoice beyond statutory 30-day window.'
    })
  }
];

export interface CustomDisputeInput {
  category: DisputeCategory;
  opponentName: string;
  opponentType?: 'individual' | 'corporation' | 'llc';
  opponentAddress?: string;
  plaintiffName?: string;
  plaintiffEmail?: string;
  amount: number;
  incidentDate: string;
  state: string;
  description?: string;
}

export function generateElementsForCategory(category: DisputeCategory, jurisdiction: any, dName: string = 'Defendant') {
  switch (category) {
    case 'security_deposit':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Execution of Lease & Payment of Deposit',
          legalStandard: jurisdiction.securityDepositStatuteCitation || 'Cal. Civ. Code § 1950.5(b)',
          description: `Plaintiff paid security deposit to Defendant ${dName} pursuant to a valid residential lease.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Signed lease agreement and payment receipt attached as Exhibit A. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Surrender of Possession & Vacating Premises',
          legalStandard: 'Statutory Surrender of Tenancy',
          description: 'Tenant restored premises condition and surrendered all keys to landlord.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Keys returned and move-out confirmation confirmed. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: `Failure to Return / Itemize Deductions in ${jurisdiction.securityDepositReturnDays || 21} Days`,
          legalStandard: jurisdiction.securityDepositStatuteCitation || 'Statutory Return Window',
          description: `Landlord failed to deliver deposit refund or itemized repair list within ${jurisdiction.securityDepositReturnDays || 21} statutory days.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., No itemization or refund delivered within statutory period. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_4`,
          title: 'Bad-Faith Retention & Statutory Penalty',
          legalStandard: jurisdiction.securityDepositStatuteCitation || 'Bad-Faith Multiplier',
          description: `Landlord retained funds in bad faith without lawful cause, authorizing up to ${jurisdiction.securityDepositBadFaithPenaltyMultiplier || 2}x statutory penalty.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Written demand delivered; Defendant failed to cure violation. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'contractor_dispute':
    case 'breach_of_contract':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Valid Contract / Agreement Formed',
          legalStandard: 'Restatement (Second) of Contracts § 1',
          description: `Valid mutual assent between Plaintiff and ${dName} with defined scope, price, and consideration.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Written contract / signed invoice / written electronic confirmation. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Plaintiff Full Performance / Tender of Consideration',
          legalStandard: 'Restatement (Second) of Contracts § 235',
          description: 'Plaintiff timely performed all required terms and paid agreed consideration.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Bank transfer and proof of payment. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: `Material Breach by Defendant ${dName}`,
          legalStandard: 'Restatement (Second) of Contracts § 241',
          description: `Defendant failed to perform agreed services, deliver promised goods, or cure material defects.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Photos of incomplete work, defective deliverables, and communication records. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_4`,
          title: 'Resulting Quantifiable Financial Damages',
          legalStandard: 'UCC § 2-715 / Expectation Damages',
          description: 'Direct out-of-pocket costs to cure breach, cover losses, or repair defects.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Third-party replacement invoices and repair estimates. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'consumer_fraud':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Unlawful, Deceptive, or Unfair Trade Practice',
          legalStandard: 'UDAP / State Deceptive Trade Practices Act',
          description: `Defendant ${dName} made false representations or concealed material facts in commercial trade.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Advertisements, written representations, and discrepancy logs. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Material Consumer Reliance',
          legalStandard: 'Restatement (Second) of Torts § 538',
          description: 'Plaintiff reasonably relied upon Defendant’s material representation in purchasing.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Purchase agreement and contemporaneous communications. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Actual Economic Injury / Diminished Value',
          legalStandard: 'Benefit-of-the-Bargain Rule',
          description: 'Plaintiff suffered quantifiable pecuniary loss or received goods of diminished worth.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Comparative appraisal and certified repair / replacement quotes. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_4`,
          title: 'Statutory Penalties / Multipliers for Willful Conduct',
          legalStandard: 'Treble / Statutory Damages Under State Consumer Protection Code',
          description: 'Willful bad-faith misrepresentation authorizes statutory multipliers or penalties.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Formal notice letter demanding cure ignored by merchant. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'wage_theft':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Employer-Employee Relationship & Hours Rendered',
          legalStandard: 'FLSA § 206 / State Labor Code',
          description: `Plaintiff rendered compensable labor and services for the benefit of Defendant ${dName}.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Timecards, GPS check-in logs, and schedule assignments. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Failure to Pay Minimum Wage, Overtime, or Final Wages',
          legalStandard: 'Statutory Wage Payment Mandate',
          description: 'Defendant withheld earned wages, refused overtime rates, or delayed final paycheck.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Paystubs, bank deposit records, and non-payment discrepancy ledger. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Statutory Waiting Time Penalties & Liquidated Damages',
          legalStandard: 'FLSA § 216(b) / State Waiting Time Penalty Code',
          description: 'Willful non-payment triggers statutory daily wage penalties and liquidated damages.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Formal demand for unpaid wages delivered to management. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'property_damage':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Plaintiff Lawful Ownership / Possessory Interest',
          legalStandard: 'Property Ownership / Leasehold Right',
          description: 'Plaintiff held lawful title, lease, or possessory interest in damaged property.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Title certificate, lease, or proof of purchase. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: `Defendant Wrongful Act, Negligence, or Trespass`,
          legalStandard: 'Tortious Interference / Negligence',
          description: `Defendant ${dName} committed an unauthorized, negligent, or unlawful act harming property.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Incident report, witness statements, and video/photo evidence. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Direct Physical Harm & Reasonable Cost of Repair',
          legalStandard: 'Restatement (Second) of Torts § 928',
          description: 'Property sustained demonstrable physical damage requiring restoration or replacement.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Licensed contractor / mechanic estimates and paid repair receipts. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'auto_accident':
    case 'negligence':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Legal Duty of Due Care Owed',
          legalStandard: 'Common Law Duty / State Vehicle & Safety Code',
          description: `Defendant ${dName} owed a legal duty to exercise reasonable care under the circumstances.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Statutory driving standard or premise safety standard. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Breach of Duty by Defendant',
          legalStandard: 'Negligence Per Se / Reasonable Person Standard',
          description: 'Defendant failed to act as a reasonably prudent party, committing a moving violation or hazard.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Police collision report, traffic citation, or dashcam footage. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Direct & Proximate Causation',
          legalStandard: 'Proximate Cause / But-For Causation',
          description: 'Defendant’s negligent conduct was the unbroken direct cause of Plaintiff’s harm.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Accident reconstruction details and eyewitness corroboration. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_4`,
          title: 'Ascertainable Economic Damages & Loss of Use',
          legalStandard: 'Actual Compensatory Property & Out-of-Pocket Damages',
          description: 'Plaintiff incurred collision repair expenses, rental vehicle fees, and towing charges.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Itemized body shop invoices and rental car payment records. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'freelance_unpaid':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Freelance Independent Contract / SOW Execution',
          legalStandard: 'Freelance Worker Protection Act / Common Law SOW',
          description: `Plaintiff and Defendant ${dName} agreed to written statement of work with defined compensation.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Executed freelance agreement or email confirmation. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Complete Delivery & Client Acceptance of Deliverables',
          legalStandard: 'UCC § 2-606 Substantial Performance',
          description: 'Plaintiff delivered all contractual milestones, code, or creative assets.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Delivery confirmation, repository merges, and client approval messages. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Non-Payment Beyond Statutory / Contractual 30 Days',
          legalStandard: 'Statutory Double Damages Mandate',
          description: 'Client failed to tender invoice payment within required statutory window.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Unpaid invoice records and repeated overdue reminder notices. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'hoa_neighbor':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Property Ownership / CC&R Covenant Applicability',
          legalStandard: 'Real Property Covenants, Conditions & Restrictions (CC&Rs)',
          description: 'Parties are subject to established property rights and neighborhood covenants.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Property deed, CC&R charter, or survey boundary map. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Unlawful Nuisance, Encroachment, or Ultra Vires HOA Fine',
          legalStandard: 'Private Nuisance Standard / HOA Procedural Due Process',
          description: `Defendant ${dName} caused substantial unreasonable interference or levied illegal fines.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Notice of violation, boundary survey, and photographic evidence. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Quantifiable Property Damage / Improper Assessment',
          legalStandard: 'Actual Economic Damages / Restitution',
          description: 'Direct repair costs, landscape restoration, or improperly collected fine funds.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Bank debit records and licensed contractor repair bids. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'airline_compensation':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Confirmed Ticket & Passenger Boarding Pass',
          legalStandard: '14 CFR Part 259 / EU Regulation 261/2004',
          description: `Plaintiff held a confirmed reservation and presented for check-in on airline ${dName}.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Electronic ticket receipt, booking reference, and boarding passes. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Qualifying Flight Delay, Cancellation, or Lost Baggage',
          legalStandard: 'Statutory Carrier Liability Threshold',
          description: 'Flight cancelled or delayed >3 hours without extraordinary circumstances, or baggage delayed >21 days.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Flight status notification, gate change logs, PIR baggage report. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Statutory Cash Compensation & Out-of-Pocket Duty of Care',
          legalStandard: 'Montreal Convention / DOT Passenger Bill of Rights',
          description: 'Fixed statutory compensation plus unreimbursed hotel, food, and ground transport expenses.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Itemized hotel/meal receipts during stranding and carrier claim denial. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'zombie_subscription':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Timely and Unambiguous Cancellation Request',
          legalStandard: 'FTC "Click-to-Cancel" Rule / Cal. Bus. & Prof. Code § 17602',
          description: 'Plaintiff followed cancellation procedure or submitted clear written revocation of recurring charge consent.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Screenshot of cancellation confirmation page or timestamped email. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Subsequent Unauthorized Post-Cancellation Debits',
          legalStandard: 'Restore Online Shoppers Confidence Act (ROSCA) / EFTA',
          description: `Defendant ${dName} repeatedly debited Plaintiff’s credit card or bank account after cancellation notice.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Bank and credit card statements showing recurring post-cancellation debits. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Refusal of Refund & Restitution of Unlawful Billing',
          legalStandard: 'Unjust Enrichment / Statutory Restitution',
          description: 'Defendant retained funds without consumer authorization and refused prompt restitution.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Customer support ticket transcript and refund denial notice. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'ecommerce_fraud':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Payment Tendered for Merchant Order',
          legalStandard: 'UCC § 2-206 / Consumer Sales Agreement',
          description: `Plaintiff ordered and paid for specified merchandise from merchant ${dName}.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Order receipt, merchant confirmation number, and credit card debit. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Non-Delivery, Counterfeit Deliverable, or Misdelivery',
          legalStandard: 'UCC § 2-601 Perfect Tender Rule',
          description: 'Goods never delivered, delivered damaged/counterfeit, or left at incorrect address without buyer signature.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Carrier tracking anomaly, porch security camera footage, unboxing video. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Exhaustion of Merchant Dispute Resolution & Direct Loss',
          legalStandard: 'Actual Economic Damages / Breach of Implied Warranty',
          description: 'Merchant refused replacement or refund despite proof of non-receipt or defective tender.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Support chat logs, merchant ticket closure, and chargeback rebuttal record. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'vacation_rental':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Confirmed Vacation Rental Booking & Payment',
          legalStandard: 'Transient Occupancy Agreement / Hospitality Duty of Care',
          description: `Plaintiff booked and fully paid for residential vacation rental hosted/operated by ${dName}.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Platform booking itinerary, receipt of payment, and check-in instructions. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Habitability Breach, Material Discrepancy, or Undisclosed Camera',
          legalStandard: 'Implied Covenant of Habitability / Invasion of Privacy',
          description: 'Severe unsanitary conditions, lack of hot water/AC, or undisclosed recording devices in private areas.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., High-resolution photos/videos of premises condition or hidden device location. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Notice Given & Constructive Eviction / Alternate Housing Cost',
          legalStandard: 'Consequential Out-of-Pocket Mitigation Damages',
          description: 'Host failed to cure within reasonable time; guest forced to secure emergency alternate lodging.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Emergency hotel booking receipts, timestamped host messages, and platform dispute. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'predatory_towing':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Lawful Vehicle Ownership & Non-Consensual Tow',
          legalStandard: 'State Towing Bill of Rights / Vehicle Code Non-Consent Standard',
          description: `Plaintiff owned vehicle unlawfully removed and impounded without owner consent by ${dName}.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Vehicle registration, parking permit, or valid guest stall authorization. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Lack of Statutory Signage, Authorization, or Drop-Fee Violation',
          legalStandard: 'Mandatory Signage & Drop-Fee Statutory Pre-requisite',
          description: 'Signage missing/illegible, tow operator refused to unhook vehicle for statutory drop-fee, or no private property owner authorization.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Photos of parking lot entrance with missing signage and tow truck dashcam notes. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Excessive / Extortionate Impound Gate Fees Paid Under Protest',
          legalStandard: 'Statutory 2x-4x Damages for Unlawful Towing',
          description: 'Plaintiff was compelled to pay unlawful storage and gate fees to recover vehicle.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Impound invoice paid with "Paid Under Protest" notation and cash receipt. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    case 'freelance_fifa':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Written Freelance Contract / Proof of Retainer',
          legalStandard: 'Freelance Isn’t Free Act (FIFA) Mandatory Contract Rule',
          description: `Contract value equaled or exceeded $800 between Freelance Worker and Hiring Party ${dName}.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Signed scope of work, email statement of work, or service agreement. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Full Delivery of Contracted Deliverables / Milestones',
          legalStandard: 'Substantial Performance Standard',
          description: 'Freelancer delivered finished work product according to contract specifications.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Transmittal email, git commit logs, cloud deliverable links, and client acceptance. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Failure to Pay Within 30 Days & Statutory Double Damages',
          legalStandard: 'Statutory 100% Double Damages (NYC Admin Code § 20-927 / NY Gen Bus L § 1410)',
          description: 'Hiring party failed to pay within 30 days of deliverable, entitling worker to double the contract value.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Invoice with date, overdue demand letter, and bank statements showing non-receipt. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];

    default:
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Duty of Care / Legal Obligation Owed',
          legalStandard: 'Common Law Duty / Statutory Mandate',
          description: `Defendant ${dName} owed a clear legal or contractual obligation to Plaintiff.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Documented transaction or legal relationship. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: `Breach of Duty by ${dName}`,
          legalStandard: 'Prima Facie Breach Standard',
          description: `Defendant committed an act or omission violating the duty or agreement.`,
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Direct records, written messages, and date logs. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Direct and Proximate Causation',
          legalStandard: 'Proximate Cause / But-For Test',
          description: 'The Defendant’s breach was the direct and proximate cause of the claimant’s loss.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Chain of custody and incident timeline. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_4`,
          title: 'Ascertainable Monetary Damages',
          legalStandard: 'Actual Compensatory Damages',
          description: 'Verifiable monetary loss resulting directly from Defendant’s wrongful conduct.',
          isSatisfied: true,
          userEvidenceNotes: '[e.g., Itemized receipts, bank statements, and paid invoices. Tap to edit with your facts.]',
          linkedEvidenceIds: []
        }
      ];
  }
}

function generateParagraphsForDispute(
  pName: string,
  dName: string,
  state: string,
  category: DisputeCategory,
  principalAmt: number,
  penaltyAmt: number,
  accruedInterest: number,
  incidentDate: string,
  description?: string
) {
  const jurisdiction = getJurisdiction(state);
  const formattedPrincipal = `$${principalAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedPenalty = `$${penaltyAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedInterest = `$${accruedInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedTotal = `$${(principalAmt + penaltyAmt + accruedInterest).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return [
    {
      id: `p_para_1`,
      number: 1,
      heading: 'PARTIES & VENUE',
      content: `Plaintiff ${pName} is an individual residing in the State of ${jurisdiction.stateName}.`,
      section: 'parties' as const,
      linkedEvidenceIds: []
    },
    {
      id: `p_para_2`,
      number: 2,
      content: `Defendant ${dName} is an entity or individual conducting business and/or residing in the State of ${jurisdiction.stateName}.`,
      section: 'parties' as const,
      linkedEvidenceIds: []
    },
    {
      id: `p_para_3`,
      number: 3,
      content: `Venue is proper in ${jurisdiction.courtName} pursuant to applicable state statutes because the underlying dispute, obligations, and wrongful actions occurred within this judicial district.`,
      section: 'jurisdiction_venue' as const,
      linkedEvidenceIds: ['ev_1']
    },
    {
      id: `p_para_4`,
      number: 4,
      heading: 'FACTUAL ALLEGATIONS',
      content: `On or about ${incidentDate}, Plaintiff entered into an agreement / transaction with Defendant ${dName} for ${description || 'the underlying subject matter'}.`,
      section: 'facts' as const,
      linkedEvidenceIds: ['ev_1']
    },
    {
      id: `p_para_5`,
      number: 5,
      content: `Pursuant to the agreement and applicable law, Plaintiff tendered and/or was owed the principal sum of ${formattedPrincipal}.`,
      section: 'facts' as const,
      linkedEvidenceIds: []
    },
    {
      id: `p_para_6`,
      number: 6,
      content: `Defendant breached its legal and statutory duties by failing to perform, improperly withholding funds, and refusing to deliver required statutory accounting.`,
      section: 'facts' as const,
      linkedEvidenceIds: []
    },
    {
      id: `p_para_7`,
      number: 7,
      content: `More than ${jurisdiction.securityDepositReturnDays || 21} calendar days have elapsed since the obligation became due. Defendant continues to unlawfully withhold ${formattedPrincipal} from Plaintiff without lawful excuse.`,
      section: 'facts' as const,
      linkedEvidenceIds: []
    },
    {
      id: `p_para_8`,
      number: 8,
      heading: 'CAUSES OF ACTION & STATUTORY BAD-FAITH CLAIMS',
      content: `Plaintiff incorporates herein Paragraphs 1 through 7 as though fully set forth. Defendant's willful refusal to return funds constitutes bad-faith non-compliance under ${jurisdiction.securityDepositStatuteCitation || 'applicable state statute'}, authorizing statutory penalties of up to ${formattedPenalty}.`,
      section: 'causes_of_action' as const,
      linkedEvidenceIds: []
    },
    {
      id: `p_para_9`,
      number: 9,
      content: `Prejudgment interest at the legal rate of ${jurisdiction.statutoryInterestRatePercent || 10.0}% per annum (${formattedInterest} accrued to date) is owed pursuant to ${jurisdiction.interestStatuteCitation || 'state law'}.`,
      section: 'causes_of_action' as const,
      linkedEvidenceIds: []
    },
    {
      id: `p_para_10`,
      number: 10,
      heading: 'PRAYER FOR RELIEF',
      content: `WHEREFORE, Plaintiff prays for judgment against Defendant ${dName} as follows: (1) Actual compensatory damages of ${formattedPrincipal}; (2) Statutory bad-faith damages of ${formattedPenalty}; (3) Prejudgment statutory interest of ${formattedInterest}; (4) Court filing fees and process service costs; and (5) Such further relief as the Court deems just and proper. Total Enforceable Demand: ${formattedTotal}.`,
      section: 'prayer' as const,
      linkedEvidenceIds: []
    }
  ];
}

export function createCustomDispute(input: CustomDisputeInput): CaseFile {
  const jurisdiction = getJurisdiction(input.state);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const pName = input.plaintiffName || 'You (Claimant)';
  const dName = input.opponentName || 'Opposing Party';
  const principalAmt = input.amount || 2500;
  
  const multiplier = input.category === 'security_deposit' 
    ? (jurisdiction.securityDepositBadFaithPenaltyMultiplier || 2)
    : 1;
  const penaltyAmt = input.category === 'security_deposit' ? principalAmt * multiplier : 0;
  
  const daysElapsed = Math.max(15, Math.floor((now.getTime() - new Date(input.incidentDate).getTime()) / (1000 * 60 * 60 * 24))) || 60;
  const interestRate = (jurisdiction.statutoryInterestRatePercent || 10) / 100;
  const accruedInterest = Math.round((principalAmt * interestRate * (daysElapsed / 365.25)) * 100) / 100;
  const totalDemandSum = principalAmt + penaltyAmt + accruedInterest;
  
  const damagesList: any[] = [
    {
      id: `dmg_${Date.now()}_1`,
      description: `Direct Actual Loss (${input.description || 'Principal Claim Sum'})`,
      amount: principalAmt,
      category: 'direct_actual',
      statutoryBasis: input.category === 'security_deposit' ? jurisdiction.securityDepositStatuteCitation : 'Common Law Breach'
    }
  ];

  if (penaltyAmt > 0) {
    damagesList.push({
      id: `dmg_${Date.now()}_2`,
      description: `Statutory Bad-Faith Penalty (${multiplier}x under ${jurisdiction.securityDepositStatuteCitation})`,
      amount: penaltyAmt,
      category: 'statutory_penalty',
      statutoryBasis: jurisdiction.securityDepositStatuteCitation
    });
  }

  if (accruedInterest > 0) {
    damagesList.push({
      id: `dmg_${Date.now()}_3`,
      description: `Accrued Prejudgment Interest (${jurisdiction.statutoryInterestRatePercent || 10}% under ${jurisdiction.interestStatuteCitation || 'Code'})`,
      amount: accruedInterest,
      category: 'interest',
      statutoryBasis: jurisdiction.interestStatuteCitation
    });
  }

  const elements = generateElementsForCategory(input.category, jurisdiction, dName);
  const customParagraphs = generateParagraphsForDispute(
    pName,
    dName,
    input.state,
    input.category,
    principalAmt,
    penaltyAmt,
    accruedInterest,
    input.incidentDate,
    input.description
  );

  const defaultBase = createDefaultCase();

  return {
    ...defaultBase,
    id: `case_${Date.now()}`,
    title: `${pName} v. ${dName}`,
    caseNumber: `${now.getFullYear().toString().slice(-2)}SC-${Math.floor(100000 + Math.random() * 900000)}`,
    country: 'US',
    state: input.state,
    county: `${jurisdiction.stateName} Civil Court`,
    courtName: jurisdiction.courtName,
    createdAt: dateStr,
    updatedAt: dateStr,
    parties: [
      {
        id: `p_${Date.now()}`,
        name: pName || '[e.g., Your Name]',
        entityType: 'individual',
        role: 'plaintiff',
        address: '[e.g., 100 Main Street]',
        city: '[e.g., Metropolis]',
        state: input.state,
        zip: '[e.g., 90001]',
        phone: '[e.g., (555) 019-2834]',
        email: input.plaintiffEmail || '[e.g., claimant@example.com]',
        isPlaceholder: !input.plaintiffName
      },
      {
        id: `d_${Date.now()}`,
        name: dName || '[e.g., Opposing Party / Business]',
        entityType: input.opponentType || 'corporation',
        role: 'defendant',
        address: input.opponentAddress || '[e.g., 200 Commercial Way, Suite 100]',
        city: '[e.g., Metropolis]',
        state: input.state,
        zip: '[e.g., 90001]',
        phone: '[e.g., (555) 018-9922]',
        email: '[e.g., legal@opposingparty.com]',
        isPlaceholder: !input.opponentName
      }
    ],
    claimEvaluation: {
      category: input.category,
      smallClaimsLimit: jurisdiction.smallClaimsLimitIndividual,
      courtRecommendation: totalDemandSum <= jurisdiction.smallClaimsLimitIndividual ? 'small_claims' : 'civil_limited',
      meritScore: 94,
      defectWarnings: [
        `Ensure formal written demand letter is delivered via Certified Mail to establish statutory notice.`,
        'Preserve all timestamped receipts, invoices, and message threads in Evidence Locker.'
      ],
      remediationSuggestions: [
        'Complete the 4-part prima facie checklist with dates and exhibits.',
        'Download and send the signed 10-day formal demand letter before filing court pleadings.'
      ],
      settlementMin: principalAmt,
      settlementMax: totalDemandSum,
      elements,
      damages: damagesList
    },
    evidenceList: [
      {
        id: `ev_${Date.now()}_1`,
        title: `Proof of Initial Agreement / Payment to ${dName}`,
        category: 'contract',
        originalFileName: 'agreement_and_payment_proof.pdf',
        fileSizeBytes: 245000,
        dateAcquired: dateStr,
        dateOccurred: input.incidentDate,
        custodian: pName,
        sha256Hash: 'a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7',
        admissibilityChecklist: {
          authenticationFre901: true,
          hearsayExceptionFre803: true,
          bestEvidenceFre1002: true,
          relevanceFre401: true
        },
        exhibitTag: 'EXHIBIT A',
        linkedParagraphIds: ['p_para_1', 'p_para_4'],
        notes: `Original verification of the $${principalAmt.toLocaleString()} transaction.`
      }
    ],
    pleadings: {
      ...defaultBase.pleadings,
      paragraphs: customParagraphs,
      demandLetter: {
        demandDate: dateStr,
        responseDeadlineDays: 10,
        demandedAmount: totalDemandSum,
        settlementOfferText: `Pursuant to ${jurisdiction.securityDepositStatuteCitation || 'applicable state law'}, claimant demands full payment of $${totalDemandSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} within ten (10) calendar days to avoid civil litigation in ${jurisdiction.courtName}.`,
        certifiedMailNumber: `7024 ${Math.floor(1000 + Math.random() * 9000)} 0001 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`
      },
      verificationAffidavit: {
        declarantName: pName,
        county: `${jurisdiction.stateName} Civil`,
        isSworn: true
      }
    }
  };
}
