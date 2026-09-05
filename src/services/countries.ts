import { CountryCode, CountryInfo, LegalServiceDirectory } from '../types';

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currencySymbol: '$',
    currencyCode: 'USD',
    smallClaimsName: 'Small Claims Court',
    defaultLimit: 10000,
    hasSubdivisions: true,
    subdivisionType: 'State',
    legalSystemSummary: '50-State Common Law with statutory damage multipliers, small claims courts, and Rule 408 settlement protections.'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencySymbol: '£',
    currencyCode: 'GBP',
    smallClaimsName: 'Small Claims Track (County Court)',
    defaultLimit: 10000,
    hasSubdivisions: true,
    subdivisionType: 'Constituent Country',
    legalSystemSummary: 'England & Wales Civil Procedure Rules (CPR Part 27), Money Claim Online (MCOL), and Pre-Action Protocols.'
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currencySymbol: 'CA$',
    currencyCode: 'CAD',
    smallClaimsName: 'Small Claims Court / CRT',
    defaultLimit: 35000,
    hasSubdivisions: true,
    subdivisionType: 'Province / Territory',
    legalSystemSummary: 'Provincial Small Claims Courts (e.g. Ontario $35k, BC CRT online tribunal $5k, Alberta $100k).'
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currencySymbol: 'AU$',
    currencyCode: 'AUD',
    smallClaimsName: 'Civil & Administrative Tribunal (NCAT/VCAT/QCAT)',
    defaultLimit: 40000,
    hasSubdivisions: true,
    subdivisionType: 'State / Territory',
    legalSystemSummary: 'State Administrative Tribunals with informal evidence rules and accessible self-represented dispute tracks.'
  },
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    currencySymbol: '₦',
    currencyCode: 'NGN',
    smallClaimsName: 'Magistrate Small Claims Court / Multi-Door Courthouse',
    defaultLimit: 5000000,
    hasSubdivisions: true,
    subdivisionType: 'State',
    legalSystemSummary: 'Fast-track liquidated money demand procedures in Lagos, Abuja, Kano, and Rivers State Small Claims Courts.'
  },
  {
    code: 'DE',
    name: 'Germany / European Union',
    flag: '🇩🇪',
    currencySymbol: '€',
    currencyCode: 'EUR',
    smallClaimsName: 'Amtsgericht & Mahnverfahren (Payment Order)',
    defaultLimit: 5000,
    hasSubdivisions: false,
    subdivisionType: 'Federal State',
    legalSystemSummary: 'European Small Claims Procedure (ESCP) for cross-border claims up to €5,000 and national Mahnbescheid summary proceedings.'
  },
  {
    code: 'GLOBAL',
    name: 'International / Other Jurisdiction',
    flag: '🌐',
    currencySymbol: '$',
    currencyCode: 'USD',
    smallClaimsName: 'General Civil Dispute Resolution',
    defaultLimit: 10000,
    hasSubdivisions: false,
    subdivisionType: 'Region',
    legalSystemSummary: 'Universal international civil claims standard based on UNCITRAL conciliation and common law evidence principles.'
  }
];

export const REAL_LEGAL_SERVICES: LegalServiceDirectory[] = [
  // United States - Federal & Major States
  {
    id: 'us_legal_aid_soc',
    country: 'US',
    subdivision: 'National',
    name: 'Legal Services Corporation (LSC)',
    category: 'legal_aid',
    description: 'Federally established non-profit supporting 131 independent civil legal aid programs across all 50 states.',
    phone: '1-202-295-1500',
    websiteUrl: 'https://www.lsc.gov/what-legal-aid/find-legal-aid',
    isFree: true,
    intakeNotes: 'Free legal assistance for low-to-moderate income individuals facing housing, consumer, and wage claims.'
  },
  {
    id: 'us_lawhelp',
    country: 'US',
    subdivision: 'National',
    name: 'LawHelp.org & Court Self-Help Network',
    category: 'court_self_help',
    description: 'Official comprehensive directory of free state-by-state court forms, small claims guides, and legal aid hotlines.',
    websiteUrl: 'https://www.lawhelp.org',
    isFree: true,
    intakeNotes: 'Instant access to state-specific small claims manuals, court fee waiver forms, and self-help centers.'
  },
  {
    id: 'us_aba_referral',
    country: 'US',
    subdivision: 'National',
    name: 'American Bar Association (ABA) Lawyer Referral & Free Legal Answers',
    category: 'bar_referral',
    description: 'Official ABA portal providing state bar certified attorney referrals ($25-$50 initial consultation) and virtual pro bono answers.',
    websiteUrl: 'https://www.americanbar.org/groups/legal_services/flh-home/flh-free-legal-answers/',
    isFree: false,
    intakeNotes: 'Modest means panels available for individuals who do not qualify for legal aid but cannot afford standard firm rates.'
  },
  {
    id: 'us_ca_selfhelp',
    country: 'US',
    subdivision: 'CA',
    name: 'California Courts Self-Help Center & Small Claims Advisor',
    category: 'small_claims_advisor',
    description: 'Mandatory county-funded Small Claims Advisors providing free 1-on-1 legal guidance for California civil litigants.',
    phone: '1-800-COURT-CA',
    websiteUrl: 'https://selfhelp.courts.ca.gov/small-claims-california',
    isFree: true,
    intakeNotes: 'Advisors assist with Form SC-100 completion, statutory citations under Cal. Civ. Code, and service of process affidavits.'
  },
  {
    id: 'us_ny_helpcenter',
    country: 'US',
    subdivision: 'NY',
    name: 'New York City & State Civil Court Help Center',
    category: 'court_self_help',
    description: 'Court-employed attorneys and navigators assisting pro se litigants in NY Town, Village, and City Small Claims Courts.',
    phone: '1-646-386-5556',
    websiteUrl: 'https://nycourts.gov/courts/nyc/civil/help.shtml',
    isFree: true,
    intakeNotes: 'Assistance with Night Court arbitration, Section 1801 filings, and treble damage consumer protection laws.'
  },
  {
    id: 'us_tx_lawhelp',
    country: 'US',
    subdivision: 'TX',
    name: 'Texas Law Help & Justice of the Peace Self-Help',
    category: 'court_self_help',
    description: 'Official Texas Justice Court Training Center guidance for self-represented litigants in Texas JP Courts.',
    websiteUrl: 'https://texaslawhelp.org',
    isFree: true,
    intakeNotes: 'Detailed step-by-step guides for Texas JP Court $20,000 limit claims and Chapter 92 security deposit remedies.'
  },
  {
    id: 'us_fl_help',
    country: 'US',
    subdivision: 'FL',
    name: 'Florida Courts E-Filing & Self-Help Portal',
    category: 'court_self_help',
    description: 'Florida County Court summary claims ($8,000 limit) e-filing access, pre-trial mediation, and local legal aid.',
    websiteUrl: 'https://www.floridacourts.gov/Resources-Services/Court-Improvement/Self-Help-Information',
    isFree: true,
    intakeNotes: 'Covers Florida Small Claims Rules 7.010-7.340 and mandatory pre-trial settlement mediation conferences.'
  },

  // United Kingdom (England & Wales)
  {
    id: 'uk_citizens_advice',
    country: 'GB',
    subdivision: 'England & Wales',
    name: 'Citizens Advice Bureau (CAB) Legal Help',
    category: 'legal_aid',
    description: 'Nationwide UK charity providing free, confidential, and independent advice on small claims, consumer disputes, and landlord issues.',
    phone: '0800 144 8848',
    websiteUrl: 'https://www.citizensadvice.org.uk/law-and-courts/legal-system/taking-someone-to-court/small-claims/',
    isFree: true,
    intakeNotes: 'Free advice on Letter Before Claim drafting, County Court Form N1, and Money Claim Online procedures.'
  },
  {
    id: 'uk_mcol',
    country: 'GB',
    subdivision: 'England & Wales',
    name: 'HMCTS Money Claim Online (MCOL) Government Portal',
    category: 'court_self_help',
    description: 'Official UK Government digital service for issuing small claims in the County Court for claims up to £100,000.',
    websiteUrl: 'https://www.moneyclaim.gov.uk',
    isFree: false,
    intakeNotes: 'Reduced electronic court fees compared to paper Form N1 filings; instant default judgment entry if defendant fails to respond in 14 days.'
  },
  {
    id: 'uk_lawworks',
    country: 'GB',
    subdivision: 'England & Wales',
    name: 'LawWorks (The Solicitors Pro Bono Group)',
    category: 'bar_referral',
    description: 'Connects individuals with free legal advice clinics staffed by volunteer solicitors across the United Kingdom.',
    websiteUrl: 'https://www.lawworks.org.uk',
    isFree: true,
    intakeNotes: 'Over 300 community legal clinics offering initial case consultations and second opinions for self-represented parties.'
  },

  // Canada
  {
    id: 'ca_probono_ontario',
    country: 'CA',
    subdivision: 'ON',
    name: 'Pro Bono Ontario Free Legal Advice Hotline',
    category: 'legal_aid',
    description: 'Free 30-minute summary legal advice from Ontario lawyers for Small Claims Court cases up to $35,000.',
    phone: '1-855-255-7256',
    websiteUrl: 'https://www.probonoontario.org/hotline/',
    isFree: true,
    intakeNotes: 'Guidance on Plaintiff’s Claim Form 7A, Settlement Conferences with Deputy Judges, and enforcing judgments.'
  },
  {
    id: 'ca_bc_crt',
    country: 'CA',
    subdivision: 'BC',
    name: 'BC Civil Resolution Tribunal (CRT)',
    category: 'court_self_help',
    description: 'Canada’s first 100% online civil dispute resolution tribunal for claims up to $5,000 and strata property disputes.',
    websiteUrl: 'https://civilresolutionbc.ca',
    isFree: false,
    intakeNotes: 'Streamlined continuous online resolution; no in-person court attendance required; binding enforceable tribunal orders.'
  },

  // Australia
  {
    id: 'au_legal_aid',
    country: 'AU',
    subdivision: 'National',
    name: 'National Legal Aid Australia & Community Legal Centres',
    category: 'legal_aid',
    description: 'Network of over 170 community legal centres providing free advice for consumer debt, tenancy, and small civil claims.',
    websiteUrl: 'https://www.nationallegalaid.org',
    isFree: true,
    intakeNotes: 'State-specific referrals to LawAccess NSW, Victoria Legal Aid, and Queensland Legal Aid self-help units.'
  },
  {
    id: 'au_ncat',
    country: 'AU',
    subdivision: 'NSW',
    name: 'NSW Civil & Administrative Tribunal (NCAT) Consumer & Commercial Division',
    category: 'court_self_help',
    description: 'Tribunal for resolving tenancy, building, and consumer claims up to $40,000 without strict evidence rules.',
    phone: '1300 006 228',
    websiteUrl: 'https://www.ncat.nsw.gov.au',
    isFree: false,
    intakeNotes: 'Accessible hearings where parties represent themselves; conciliators assist with same-day negotiated consent orders.'
  },

  // Nigeria
  {
    id: 'ng_lagos_small_claims',
    country: 'NG',
    subdivision: 'Lagos',
    name: 'Lagos State Judiciary Small Claims Court Portal',
    category: 'court_self_help',
    description: 'Fast-track Magistrate Court hearing liquidated debt and contract disputes up to ₦5,000,000 within 60 days.',
    websiteUrl: 'https://lagosjudiciary.gov.ng/small-claims-court',
    isFree: false,
    intakeNotes: 'Simplified Claim Form SCA 1 and Summons SCA 2; mandatory hearing within 14 days of filing; maximum 60 days to final judgment.'
  },
  {
    id: 'ng_legal_aid_council',
    country: 'NG',
    subdivision: 'National',
    name: 'Legal Aid Council of Nigeria (LACON)',
    category: 'legal_aid',
    description: 'Statutory federal body providing free legal counsel and dispute mediation to indigent Nigerians.',
    phone: '+234 803 333 4455',
    websiteUrl: 'https://legalaidcouncil.gov.ng',
    isFree: true,
    intakeNotes: 'Provides alternative dispute resolution (ADR) and legal representation for civil disputes.'
  }
];

export function getCountryInfo(code: CountryCode): CountryInfo {
  return SUPPORTED_COUNTRIES.find(c => c.code === code) || SUPPORTED_COUNTRIES[0];
}

export function getServicesForJurisdiction(country: CountryCode, subdivision?: string): LegalServiceDirectory[] {
  return REAL_LEGAL_SERVICES.filter(s => {
    if (s.country !== country && s.country !== 'US') return false; // Show relevant + national
    if (s.country === country) {
      if (!subdivision || s.subdivision === 'National' || s.subdivision === subdivision) {
        return true;
      }
    }
    return false;
  });
}
