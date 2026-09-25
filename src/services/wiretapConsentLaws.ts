import { RecordingConsentRule } from '../types';

export const WIRETAP_CONSENT_RULES: Record<string, RecordingConsentRule> = {
  // Two-Party / All-Party Consent States (Strictest)
  CA: {
    jurisdiction: 'California',
    consentType: 'two_party_all_party',
    statuteCitation: 'Cal. Penal Code § 632',
    summary: 'California is a strict two-party (all-party) consent state. It is a crime and a civil tort to record confidential communications without the consent of all parties.',
    admissibilityWarning: 'CRITICAL WARNING: Audio recorded without the defendant’s knowledge in California is generally INADMISSIBLE in civil court and exposes the recorder to statutory civil damages of $5,000 per violation under Penal Code § 637.2.'
  },
  FL: {
    jurisdiction: 'Florida',
    consentType: 'two_party_all_party',
    statuteCitation: 'Fla. Stat. § 934.03',
    summary: 'Florida requires the consent of all parties to any oral or wire communication where there is a reasonable expectation of privacy.',
    admissibilityWarning: 'WARNING: Unconsented recordings are inadmissible under Fla. Stat. § 934.06 and carry felony penalties unless recorded in a public setting with zero expectation of privacy.'
  },
  IL: {
    jurisdiction: 'Illinois',
    consentType: 'two_party_all_party',
    statuteCitation: '720 ILCS 5/14-2',
    summary: 'Illinois requires all-party consent for recording private in-person or telephone conversations.',
    admissibilityWarning: 'WARNING: Audio obtained without all-party consent is strictly inadmissible in Illinois civil proceedings under 720 ILCS 5/14-5.'
  },
  MA: {
    jurisdiction: 'Massachusetts',
    consentType: 'two_party_all_party',
    statuteCitation: 'Mass. Gen. Laws ch. 272, § 99',
    summary: 'Massachusetts strictly prohibits any secret audio recording. All parties must have actual knowledge and consent.',
    admissibilityWarning: 'WARNING: Massachusetts courts strictly exclude any secretly recorded audio under Commonwealth wiretap statutes.'
  },
  MD: {
    jurisdiction: 'Maryland',
    consentType: 'two_party_all_party',
    statuteCitation: 'Md. Code, Cts. & Jud. Proc. § 10-402',
    summary: 'Maryland requires all participants to consent to recording private conversations.',
    admissibilityWarning: 'WARNING: Secret recordings are inadmissible in Maryland civil actions under § 10-405.'
  },
  PA: {
    jurisdiction: 'Pennsylvania',
    consentType: 'two_party_all_party',
    statuteCitation: '18 Pa. Cons. Stat. § 5703',
    summary: 'Pennsylvania is a two-party consent jurisdiction requiring mutual assent of all participants.',
    admissibilityWarning: 'WARNING: Inadmissible under 18 Pa.C.S. § 5721.1 unless recorded during an extortion/felony emergency exception.'
  },
  WA: {
    jurisdiction: 'Washington',
    consentType: 'two_party_all_party',
    statuteCitation: 'Wash. Rev. Code § 9.73.030',
    summary: 'Washington requires consent of all parties to record private communications.',
    admissibilityWarning: 'WARNING: Violations are inadmissible in court under RCW 9.73.050 and create civil liability.'
  },
  CT: {
    jurisdiction: 'Connecticut',
    consentType: 'two_party_all_party',
    statuteCitation: 'Conn. Gen. Stat. § 52-570d',
    summary: 'Requires consent of all parties to record telephone conversations (or oral warning beep every 15 seconds).',
    admissibilityWarning: 'WARNING: Inadmissible in Connecticut civil courts unless recorded with verbal consent or automated warning chime.'
  },

  // One-Party Consent States (Federal Standard)
  TX: {
    jurisdiction: 'Texas',
    consentType: 'one_party',
    statuteCitation: 'Tex. Penal Code § 16.02 & Tex. Civ. Prac. & Rem. Code § 123.001',
    summary: 'Texas is a one-party consent state. You may record any telephone call or conversation as long as you are a participant in the conversation.',
    admissibilityWarning: 'ADMISSIBLE: As long as you were an active participant in the conversation, the recording is fully lawful and admissible in Texas civil and small claims courts.'
  },
  NY: {
    jurisdiction: 'New York',
    consentType: 'one_party',
    statuteCitation: 'N.Y. Penal Law §§ 250.00, 250.05',
    summary: 'New York is a one-party consent state. You do not need to inform the landlord, contractor, or opposing party that you are recording a conversation you are participating in.',
    admissibilityWarning: 'ADMISSIBLE: Secretly recorded conversations where you participated are fully admissible in New York courts.'
  },
  NJ: {
    jurisdiction: 'New Jersey',
    consentType: 'one_party',
    statuteCitation: 'N.J. Stat. § 2A:156A-4',
    summary: 'New Jersey is a one-party consent state.',
    admissibilityWarning: 'ADMISSIBLE: Participant recording is lawful and admissible.'
  },
  GA: {
    jurisdiction: 'Georgia',
    consentType: 'one_party',
    statuteCitation: 'Ga. Code § 16-11-62',
    summary: 'Georgia is a one-party consent state for participating individuals.',
    admissibilityWarning: 'ADMISSIBLE: Lawful to record conversations you take part in.'
  },
  OH: {
    jurisdiction: 'Ohio',
    consentType: 'one_party',
    statuteCitation: 'Ohio Rev. Code § 2933.52',
    summary: 'Ohio is a one-party consent state.',
    admissibilityWarning: 'ADMISSIBLE: Admissible if authenticated under Evidence Rule 901.'
  },

  // International Jurisdictions
  GB: {
    jurisdiction: 'United Kingdom',
    consentType: 'one_party',
    statuteCitation: 'RIPA 2000 / Civil Procedure Rules Part 32',
    summary: 'In the UK, recording a conversation for personal private use is lawful. Under CPR Part 32, judges have wide discretion to admit covert audio if highly probative of fraud or breach.',
    admissibilityWarning: 'GENERALLY ADMISSIBLE: Employment and County Court judges routinely admit covert recordings of landlords and employers if relevant to liability.'
  },
  CA_COUNTRY: {
    jurisdiction: 'Canada',
    consentType: 'one_party',
    statuteCitation: 'Criminal Code of Canada, R.S.C. 1985, c. C-46, s. 184',
    summary: 'Canada is a one-party consent country under federal Criminal Code section 184(2)(a). Single-participant recording is completely lawful.',
    admissibilityWarning: 'ADMISSIBLE: Admissible in Provincial Small Claims Courts and Tribunals (e.g. Ontario Small Claims, BC CRT).'
  },
  AU: {
    jurisdiction: 'Australia',
    consentType: 'two_party_all_party',
    statuteCitation: 'Surveillance Devices Act (State specific: NSW/VIC/QLD)',
    summary: 'Most Australian states prohibit recording private conversations without consent unless reasonably necessary to protect a lawful interest.',
    admissibilityWarning: 'CAUTION: Strictly restricted in NSW and Victoria unless the court finds it was necessary to protect a legal right against fraud.'
  },
  NG: {
    jurisdiction: 'Nigeria',
    consentType: 'one_party',
    statuteCitation: 'Section 37 Constitution of the Federal Republic of Nigeria 1999 & Evidence Act 2011',
    summary: 'Under Section 84 of the Nigerian Evidence Act 2011, electronically generated audio recordings are admissible upon filing a Section 84 Certificate of Authentication.',
    admissibilityWarning: 'ADMISSIBLE WITH CERTIFICATE: Admissible in Lagos and High Courts provided a Section 84 Certificate of Electronic Evidence is filed.'
  }
};

export function getConsentRuleForJurisdiction(stateOrCountry: string): RecordingConsentRule {
  const code = (stateOrCountry || 'US').toUpperCase();
  if (WIRETAP_CONSENT_RULES[code]) return WIRETAP_CONSENT_RULES[code];

  // Default to Federal US standard
  return {
    jurisdiction: stateOrCountry || 'General Jurisdiction',
    consentType: 'one_party',
    statuteCitation: '18 U.S.C. § 2511(2)(d) (Federal Wiretap Act)',
    summary: 'Under Federal law and 35+ states, only one party’s consent is required to record a private conversation.',
    admissibilityWarning: 'VERIFY LOCAL RULES: Under federal standard, participant recording is lawful. Check if your state requires all-party consent before filing.'
  };
}
