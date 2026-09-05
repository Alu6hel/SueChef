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
        name: 'Elena Martinez',
        entityType: 'individual',
        role: 'plaintiff',
        address: '1840 Pasadena Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90031',
        phone: '(213) 555-4921',
        email: 'elena.m@example.com'
      },
      {
        id: 'd_apex',
        name: 'Apex Horizon Construction LLC',
        entityType: 'llc',
        role: 'defendant',
        address: '4200 Wilshire Blvd, Suite 210',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90010',
        phone: '(323) 555-8800',
        registeredAgent: 'National Registered Agents, 818 W 7th St, Los Angeles, CA'
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
          userEvidenceNotes: 'Signed contract dated October 12, 2024 with itemized payment milestones.',
          linkedEvidenceIds: ['ev_c1']
        },
        {
          id: 'elem_c2',
          title: 'Plaintiff Full Payment of Required Milestones',
          legalStandard: 'Restatement (Second) of Contracts § 235',
          description: 'Homeowner timely paid $18,000 across 3 initial milestones pursuant to contract schedule.',
          isSatisfied: true,
          userEvidenceNotes: 'Canceled checks and bank statements verifying $18k total payments.',
          linkedEvidenceIds: ['ev_c2']
        },
        {
          id: 'elem_c3',
          title: 'Defective Workmanship & Abandonment',
          legalStandard: 'Cal. Bus. & Prof. Code § 7107',
          description: 'Contractor walked off job on Day 45, leaving plumbing unsealed and tile unlevel, causing water leakage.',
          isSatisfied: true,
          userEvidenceNotes: 'Certified home inspection report detailing $14,500 cost to tear out and repair defective plumbing.',
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
        name: 'Alex Chen',
        entityType: 'individual',
        role: 'plaintiff',
        address: '320 E 21st St, Apt 4F',
        city: 'New York',
        state: 'NY',
        zip: '10010',
        phone: '(917) 555-3021',
        email: 'alex.chen.dev@example.com'
      },
      {
        id: 'd_media',
        name: 'HyperScale Media Group Inc.',
        entityType: 'corporation',
        role: 'defendant',
        address: '575 Broadway, 8th Floor',
        city: 'New York',
        state: 'NY',
        zip: '10012',
        phone: '(212) 555-7700',
        registeredAgent: 'Corporation Service Company, 80 State St, Albany, NY'
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
          userEvidenceNotes: 'Executed SOW signed via DocuSign specifying $8,400 project fee.',
          linkedEvidenceIds: ['ev_f1']
        },
        {
          id: 'elem_f2',
          title: 'Full Code Delivery & Client Acceptance',
          legalStandard: 'UCC § 2-606',
          description: 'Plaintiff delivered production code repository, passed QA, and received written approval from CEO.',
          isSatisfied: true,
          userEvidenceNotes: 'Slack approval messages from CEO stating: "Looks great, launched to prod!".',
          linkedEvidenceIds: ['ev_f2']
        },
        {
          id: 'elem_f3',
          title: 'Non-Payment After 30 Days (FIFA Violation)',
          legalStandard: 'N.Y.C. Admin. Code § 20-929',
          description: 'Client failed to pay invoice within 30 days of completion, triggering statutory double damages under NYC FIFA.',
          isSatisfied: true,
          userEvidenceNotes: 'Invoice #1042 issued 65 days ago; three overdue notices ignored.',
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
        name: 'Jordan Taylor',
        entityType: 'individual',
        role: 'plaintiff',
        address: '5120 Westheimer Rd',
        city: 'Houston',
        state: 'TX',
        zip: '77056',
        phone: '(713) 555-8120',
        email: 'jtaylor@example.com'
      },
      {
        id: 'd_auto',
        name: 'Carlos Ramirez',
        entityType: 'individual',
        role: 'defendant',
        address: '2900 Richmond Ave',
        city: 'Houston',
        state: 'TX',
        zip: '77098',
        phone: '(832) 555-9011'
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
          userEvidenceNotes: 'Clear statutory duty under Texas Transportation Code.',
          linkedEvidenceIds: []
        },
        {
          id: 'elem_a2',
          title: 'Breach of Duty & Red Light Infraction',
          legalStandard: 'Tex. Transp. Code § 544.007',
          description: 'Defendant ran steady red signal at Montrose & Westheimer, striking Plaintiff’s vehicle.',
          isSatisfied: true,
          userEvidenceNotes: 'Police report citing Defendant for running red light + dashcam video.',
          linkedEvidenceIds: ['ev_a1', 'ev_a2']
        },
        {
          id: 'elem_a3',
          title: 'Direct Property Damage & Loss of Use',
          legalStandard: 'Restatement (Second) of Torts § 928',
          description: 'Vehicle sustained structural door frame damage, rendering it undriveable for 14 days.',
          isSatisfied: true,
          userEvidenceNotes: 'Repair invoice $5,400 + Enterprise rental car receipts $800.',
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
        name: 'David Walker',
        entityType: 'individual',
        role: 'plaintiff',
        address: '742 Biscayne Blvd',
        city: 'Miami',
        state: 'FL',
        zip: '33132',
        phone: '(305) 555-1920',
        email: 'dwalker@example.com'
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
          userEvidenceNotes: 'Online listing screenshots and certified pre-purchase inspection.',
          linkedEvidenceIds: ['ev_cf1']
        },
        {
          id: 'elem_cf2',
          title: 'Consumer Reliance & Material Inducement',
          legalStandard: 'Fla. Stat. § 501.211',
          description: 'Plaintiff relied upon the false accident-free disclosure to pay full market price of $14,500.',
          isSatisfied: true,
          userEvidenceNotes: 'Buyer purchase agreement and written salesperson warranty assurances.',
          linkedEvidenceIds: ['ev_cf2']
        },
        {
          id: 'elem_cf3',
          title: 'Actual Economic Damages & Diminished Value',
          legalStandard: 'Rollins, Inc. v. Butland, 951 So. 2d 860',
          description: 'Structural inspection revealed catastrophic frame defect reducing vehicle market value by $8,500 + repair diagnostic costs.',
          isSatisfied: true,
          userEvidenceNotes: 'Master mechanic appraisal and structural laser measurement report.',
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
        name: 'Marcus Jenkins',
        entityType: 'individual',
        role: 'plaintiff',
        address: '4820 S Michigan Ave',
        city: 'Chicago',
        state: 'IL',
        zip: '60615',
        phone: '(312) 555-6610',
        email: 'mjenkins@example.com'
      },
      {
        id: 'd_prime',
        name: 'Prime Logistics Solutions Inc.',
        entityType: 'corporation',
        role: 'defendant',
        address: '1200 S Canal St',
        city: 'Chicago',
        state: 'IL',
        zip: '60607',
        phone: '(312) 555-8833',
        registeredAgent: 'Illinois Corporation Service Co, Springfield, IL'
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
          userEvidenceNotes: 'Job description, hourly pay stubs, shift logs.',
          linkedEvidenceIds: ['ev_w1']
        },
        {
          id: 'elem_w2',
          title: 'Uncompensated Overtime Hours Worked',
          legalStandard: '820 ILCS 105/4a',
          description: 'Plaintiff logged 140 uncompensated overtime hours over 7-month period with manager knowledge.',
          isSatisfied: true,
          userEvidenceNotes: 'Digital GPS badge punches and Google timeline location logs.',
          linkedEvidenceIds: ['ev_w2']
        },
        {
          id: 'elem_w3',
          title: 'Statutory 5% Monthly Penalty for Late Wages',
          legalStandard: '820 ILCS 115/14(a)',
          description: 'Employer unlawfully withheld overtime wages for >180 days, triggering statutory 5% per month interest penalty.',
          isSatisfied: true,
          userEvidenceNotes: 'Pay stubs missing overtime calculations and demand letter.',
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

function generateElementsForCategory(category: DisputeCategory, jurisdiction: any, dName: string) {
  switch (category) {
    case 'security_deposit':
      return [
        {
          id: `elem_${Date.now()}_1`,
          title: 'Execution of Lease & Payment of Deposit',
          legalStandard: jurisdiction.securityDepositStatuteCitation || 'Cal. Civ. Code § 1950.5(b)',
          description: `Plaintiff paid security deposit to Defendant ${dName} pursuant to a valid residential lease.`,
          isSatisfied: true,
          userEvidenceNotes: 'Signed lease agreement and payment receipt attached as Exhibit A.',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Surrender of Possession & Vacating Premises',
          legalStandard: 'Statutory Surrender of Tenancy',
          description: 'Tenant restored premises condition and surrendered all keys to landlord.',
          isSatisfied: true,
          userEvidenceNotes: 'Keys returned and move-out confirmation confirmed.',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: `Failure to Return / Itemize Deductions in ${jurisdiction.securityDepositReturnDays || 21} Days`,
          legalStandard: jurisdiction.securityDepositStatuteCitation || 'Statutory Return Window',
          description: `Landlord failed to deliver deposit refund or itemized repair list within ${jurisdiction.securityDepositReturnDays || 21} statutory days.`,
          isSatisfied: true,
          userEvidenceNotes: 'No itemization or refund delivered within statutory period.',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_4`,
          title: 'Bad-Faith Retention & Statutory Penalty',
          legalStandard: jurisdiction.securityDepositStatuteCitation || 'Bad-Faith Multiplier',
          description: `Landlord retained funds in bad faith without lawful cause, authorizing up to ${jurisdiction.securityDepositBadFaithPenaltyMultiplier || 2}x statutory penalty.`,
          isSatisfied: true,
          userEvidenceNotes: 'Written demand delivered; Defendant failed to cure violation.',
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
          description: `Valid mutual assent between Plaintiff and ${dName} with defined scope and consideration.`,
          isSatisfied: true,
          userEvidenceNotes: 'Written contract / invoice / text confirmation.',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: 'Plaintiff Full Performance / Tender of Consideration',
          legalStandard: 'Restatement (Second) of Contracts § 235',
          description: 'Plaintiff timely performed all required terms and paid agreed consideration.',
          isSatisfied: true,
          userEvidenceNotes: 'Bank transfer and proof of payment.',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: `Material Breach by Defendant ${dName}`,
          legalStandard: 'Restatement (Second) of Contracts § 241',
          description: `Defendant failed to perform agreed services, deliver promised goods, or cure defects.`,
          isSatisfied: true,
          userEvidenceNotes: 'Photos of incomplete work, defective deliverables, and communications.',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_4`,
          title: 'Resulting Quantifiable Financial Damages',
          legalStandard: 'UCC § 2-715 / Expectation Damages',
          description: 'Direct out-of-pocket costs to cure breach, cover losses, or repair defects.',
          isSatisfied: true,
          userEvidenceNotes: 'Third-party replacement invoices and repair estimates.',
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
          userEvidenceNotes: 'Documented transaction or legal relationship.',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_2`,
          title: `Breach of Duty by ${dName}`,
          legalStandard: 'Prima Facie Breach Standard',
          description: `Defendant committed an act or omission violating the duty or agreement.`,
          isSatisfied: true,
          userEvidenceNotes: 'Direct records, written messages, and date logs.',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_3`,
          title: 'Direct and Proximate Causation',
          legalStandard: 'Proximate Cause / But-For Test',
          description: 'The Defendant’s breach was the direct and proximate cause of the claimant’s loss.',
          isSatisfied: true,
          userEvidenceNotes: 'Chain of custody and incident timeline.',
          linkedEvidenceIds: []
        },
        {
          id: `elem_${Date.now()}_4`,
          title: 'Ascertainable Monetary Damages',
          legalStandard: 'Actual Compensatory Damages',
          description: 'Verifiable monetary loss resulting directly from Defendant’s wrongful conduct.',
          isSatisfied: true,
          userEvidenceNotes: 'Itemized receipts, bank statements, and paid invoices.',
          linkedEvidenceIds: []
        }
      ];
  }
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

  const defaultBase = createDefaultCase();

  return {
    ...defaultBase,
    id: `case_${Date.now()}`,
    title: `${pName} v. ${dName}`,
    caseNumber: `${now.getFullYear().toString().slice(-2)}SC-${Math.floor(100000 + Math.random() * 900000)}`,
    country: 'US',
    state: input.state,
    county: 'County Civil Division',
    courtName: jurisdiction.courtName,
    createdAt: dateStr,
    updatedAt: dateStr,
    parties: [
      {
        id: `p_${Date.now()}`,
        name: pName,
        entityType: 'individual',
        role: 'plaintiff',
        address: '100 Main Street',
        city: 'Metropolis',
        state: input.state,
        zip: '90001',
        phone: '(555) 019-2834',
        email: input.plaintiffEmail || 'claimant@example.com'
      },
      {
        id: `d_${Date.now()}`,
        name: dName,
        entityType: input.opponentType || 'corporation',
        role: 'defendant',
        address: input.opponentAddress || '200 Commercial Way, Suite 100',
        city: 'Metropolis',
        state: input.state,
        zip: '90001',
        phone: '(555) 018-9922',
        email: 'legal@opposingparty.com'
      }
    ],
    claimEvaluation: {
      category: input.category,
      smallClaimsLimit: jurisdiction.smallClaimsLimitIndividual,
      courtRecommendation: (principalAmt + penaltyAmt + accruedInterest) <= jurisdiction.smallClaimsLimitIndividual ? 'small_claims' : 'civil_limited',
      meritScore: 92,
      defectWarnings: [
        `Ensure formal written demand letter is delivered via Certified Mail to establish statutory notice.`,
        'Preserve all timestamped receipts, invoices, and message threads in Evidence Locker.'
      ],
      remediationSuggestions: [
        'Complete the 4-part prima facie checklist with dates and exhibits.',
        'Download and send the signed 10-day formal demand letter before filing court pleadings.'
      ],
      settlementMin: principalAmt,
      settlementMax: principalAmt + penaltyAmt + accruedInterest,
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
        linkedParagraphIds: ['p_para_1'],
        notes: `Original verification of the $${principalAmt.toLocaleString()} transaction.`
      }
    ],
    pleadings: {
      ...defaultBase.pleadings,
      demandLetter: {
        ...defaultBase.pleadings.demandLetter,
        demandDate: dateStr,
        responseDeadlineDays: 10,
        demandedAmount: principalAmt + penaltyAmt + accruedInterest,
        settlementOfferText: `Pursuant to ${jurisdiction.securityDepositStatuteCitation || 'applicable state law'}, claimant demands full payment of $${(principalAmt + penaltyAmt + accruedInterest).toLocaleString()} within ten (10) calendar days to avoid civil litigation in ${jurisdiction.courtName}.`
      }
    }
  };
}
