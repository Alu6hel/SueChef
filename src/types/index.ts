export type ThemeId = 
  | 'chambers-onyx' 
  | 'parchment-ink' 
  | 'legal-slate' 
  | 'emerald-chancery' 
  | 'cyber-tribunal';

export type CornerGeometry = 'sharp' | 'chamfer' | 'smooth';

export type WorkstationId = 
  | 'claim-kitchen'
  | 'sol-watcher'
  | 'pleading-builder'
  | 'evidence-locker'
  | 'legalese-decoder'
  | 'service-tracker'
  | 'attorney-dossier'
  | 'security-vault';

export type DisputeCategory = 
  | 'security_deposit'
  | 'breach_of_contract'
  | 'consumer_fraud'
  | 'property_damage'
  | 'wage_theft'
  | 'negligence'
  | 'hoa_neighbor';

export interface Party {
  id: string;
  name: string;
  entityType: 'individual' | 'corporation' | 'llc' | 'government';
  role: 'plaintiff' | 'defendant' | 'co-defendant';
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  email?: string;
  registeredAgent?: string;
}

export interface ClaimElement {
  id: string;
  title: string;
  legalStandard: string;
  description: string;
  isSatisfied: boolean;
  userEvidenceNotes: string;
  linkedEvidenceIds: string[];
}

export interface DamageItem {
  id: string;
  description: string;
  category: 'direct_actual' | 'consequential' | 'statutory_penalty' | 'punitive' | 'interest';
  amount: number;
  receiptEvidenceId?: string;
  statutoryBasis?: string;
}

export interface ClaimEvaluation {
  category: DisputeCategory;
  elements: ClaimElement[];
  damages: DamageItem[];
  smallClaimsLimit: number;
  courtRecommendation: 'small_claims' | 'civil_limited' | 'superior_unlimited';
  meritScore: number; // 0 - 100
  defectWarnings: string[];
  remediationSuggestions: string[];
  settlementMin: number;
  settlementMax: number;
}

export interface SolDocketItem {
  id: string;
  title: string;
  category: DisputeCategory;
  triggerDate: string; // YYYY-MM-DD
  statutoryLimitYears: number;
  expirationDate: string;
  tollingDays: number;
  tollingNotes: string[];
  daysRemaining: number;
  urgencyLevel: 'safe' | 'warning' | 'critical' | 'expired';
  isTolled: boolean;
}

export interface PleadingParagraph {
  id: string;
  number: number;
  heading?: string;
  content: string;
  section: 'parties' | 'jurisdiction_venue' | 'facts' | 'causes_of_action' | 'prayer';
  linkedEvidenceIds: string[];
}

export interface DemandLetterConfig {
  demandDate: string;
  responseDeadlineDays: number; // 10, 14, 30
  demandedAmount: number;
  settlementOfferText: string;
  certifiedMailNumber?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'contract' | 'receipt' | 'text_sms' | 'email' | 'photo' | 'report' | 'other';
  originalFileName: string;
  fileSizeBytes: number;
  sha256Hash: string;
  dateAcquired: string;
  dateOccurred: string;
  custodian: string;
  admissibilityChecklist: {
    authenticationFre901: boolean;
    hearsayExceptionFre803: boolean;
    bestEvidenceFre1002: boolean;
    relevanceFre401: boolean;
  };
  exhibitTag: string; // "EXHIBIT A", "EXHIBIT B"
  linkedParagraphIds: string[];
  notes: string;
  dataUrl?: string;
}

export interface ServiceAttempt {
  id: string;
  timestamp: string;
  address: string;
  serverName: string;
  success: boolean;
  notes: string;
  gpsCoords?: string;
}

export interface ServiceRecord {
  id: string;
  defendantId: string;
  defendantName: string;
  serviceMethod: 'personal' | 'substituted' | 'certified_mail' | 'statutory_agent' | 'publication';
  filingDate: string;
  deadlineDate: string; // 90 days under FRCP Rule 4(m)
  daysRemaining: number;
  status: 'pending' | 'in_progress' | 'served' | 'expired';
  attempts: ServiceAttempt[];
  dateServed?: string;
  affidavitSigned: boolean;
  serverSignatureDataUrl?: string;
}

export interface LegalTerm {
  term: string;
  phonetic?: string;
  category: 'procedural' | 'evidence' | 'contracts' | 'torts' | 'latin';
  plainEnglish: string;
  courtContext: string;
  proSeTip: string;
  exampleSentence: string;
}

export interface CaseFile {
  id: string;
  title: string;
  caseNumber: string;
  state: string;
  county: string;
  courtName: string;
  createdAt: string;
  updatedAt: string;
  parties: Party[];
  claimEvaluation: ClaimEvaluation;
  solDocket: SolDocketItem[];
  pleadings: {
    is28LineNumbered: boolean;
    fontFamily: 'Century Schoolbook' | 'Times New Roman' | 'Courier New' | 'Georgia';
    paragraphs: PleadingParagraph[];
    demandLetter: DemandLetterConfig;
    verificationAffidavit: {
      declarantName: string;
      county: string;
      isSworn: boolean;
      signatureDataUrl?: string;
    };
  };
  evidenceList: EvidenceItem[];
  serviceRecords: ServiceRecord[];
}
