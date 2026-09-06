export type ThemeId = 
  | 'chambers-onyx' 
  | 'parchment-ink' 
  | 'legal-slate' 
  | 'emerald-chancery' 
  | 'cyber-tribunal';

export type CornerGeometry = 'sharp' | 'chamfer' | 'smooth';

export type FontSizeScale = 'normal' | 'large' | 'xlarge';

export type CountryCode = 'US' | 'GB' | 'CA' | 'AU' | 'NG' | 'DE' | 'GLOBAL';

export type WorkstationId = 
  | 'home'              // 0. Executive Homepage & Case Overview
  | 'claim-kitchen'     // 1. Build Your Case (Claim Kitchen)
  | 'evidence-locker'   // 2. Proof & Evidence (Evidence Locker)
  | 'pleading-builder'  // 3. Court Papers & Pleadings (28-Line Pleading)
  | 'settlement-matrix' // 4. Demand & Settle (Settlement Matrix)
  | 'second-opinion'    // 5. Legal Second Opinion AI
  | 'legal-services'    // 6. Real-Life Legal Aid & Courts
  | 'discovery-studio'  // 7. Request Evidence (Discovery Studio)
  | 'trial-prep'        // 8. Practice Hearing & Objections
  | 'sol-watcher'       // 9. Statute of Limitations Docket
  | 'service-tracker'   // 10. Service of Process & Proof
  | 'legalese-decoder'  // 11. Plain-English Legal Decoder
  | 'attorney-dossier'  // 12. Opposing Counsel Tracker
  | 'security-vault';   // 13. Privacy & Offline Vault

export type DisputeCategory = 
  | 'security_deposit'
  | 'breach_of_contract'
  | 'contractor_dispute'
  | 'freelance_unpaid'
  | 'auto_accident'
  | 'consumer_fraud'
  | 'wage_theft'
  | 'property_damage'
  | 'negligence'
  | 'hoa_neighbor';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  smallClaimsName: string;
  defaultLimit: number;
  hasSubdivisions: boolean;
  subdivisionType: string; // "State", "Province", "Constituent Country"
  legalSystemSummary: string;
}

export interface LegalServiceDirectory {
  id: string;
  country: CountryCode;
  subdivision?: string; // State or Province (e.g. CA, NY, ON, NSW)
  name: string;
  category: 'legal_aid' | 'court_self_help' | 'bar_referral' | 'small_claims_advisor' | 'consumer_affairs';
  description: string;
  phone?: string;
  websiteUrl: string;
  isFree: boolean;
  intakeNotes: string;
}

export interface PredictedDefense {
  id?: string;
  defenseTitle: string;
  likelihood: 'High' | 'Medium' | 'Low';
  opposingArgument: string;
  counterStrategy: string;
  statutoryBasis: string;
  isCustom?: boolean;
}

export interface VulnerabilityCheckItem {
  id: string;
  title: string;
  description: string;
  remedyAction: string;
  isResolved: boolean;
  scoreBonus: number;
}

export interface SecondOpinionReport {
  timestamp: string;
  caseTitle: string;
  category: DisputeCategory;
  state: string;
  country: CountryCode;
  overallMeritGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  winProbabilityScore: number; // 0-100%
  verdictSummary: string;
  keyStrengths: string[];
  vulnerabilities: string[];
  vulnerabilityItems?: VulnerabilityCheckItem[];
  predictedDefenses: PredictedDefense[];
  financialAssessment: {
    claimedDamages: number;
    realisticRecoveryEstimate: number;
    courtFilingCostEstimate: number;
    recommendedSettlementFloor: number;
    proceedRecommendation: 'Strongly Recommend Filing' | 'Negotiate Pre-Trial Settlement' | 'Gather Additional Evidence' | 'Not Economically Viable';
  };
  stepByStepRoadmap: {
    stepNumber: number;
    action: string;
    deadlineNotice: string;
    importance: 'Mandatory' | 'Recommended' | 'Optional';
  }[];
  localHelpResources: LegalServiceDirectory[];
}

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
  serverLicenseNumber?: string;
  recipientName?: string;
  recipientTitle?: string;
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
  affidavitDeclarantName?: string;
  serverLicenseNumber?: string;
  countyOfRegistration?: string;
  formType?: 'CA_POS_010' | 'FRCP_AO_440' | 'UNIVERSAL_CIVIL';
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

// Discovery Types
export interface DiscoveryItem {
  id: string;
  number: number;
  questionText: string;
  targetObjective: string;
  objectionRiskNotes: string;
  category: 'interrogatory' | 'rfp' | 'rfa';
}

export interface SubpoenaRequest {
  id: string;
  thirdPartyName: string;
  thirdPartyAddress: string;
  documentsRequested: string;
  relevanceDeclaration: string;
  complianceDeadlineDays: number;
}

// Trial Prep Types
export interface ObjectionScenario {
  id: string;
  situation: string;
  witnessStatement: string;
  correctObjection: string;
  ruleCitation: string;
  explanation: string;
  distractorOptions: string[];
}

export interface WitnessOutline {
  id: string;
  witnessName: string;
  witnessRole: 'plaintiff' | 'defendant' | 'expert' | 'eye_witness';
  directQuestions: string[];
  crossExamTraps: string[];
  exhibitCitations: string[];
}

// Settlement Types
export interface SettlementOfferLog {
  id: string;
  offerDate: string;
  offeredBy: 'opposing_party' | 'plaintiff';
  amount: number;
  paymentWindowDays: number;
  includesConfidentiality: boolean;
  includesNonDisparagement: boolean;
  notes: string;
  status: 'received' | 'countered' | 'rejected' | 'accepted';
}

export interface SettlementCalculation {
  claimDamages: number;
  winProbabilityPercent: number;
  courtFilingFees: number;
  processServiceFees: number;
  expertWitnessFees: number;
  estimatedTimeValueLoss: number;
  openingDemandAnchor: number;
  targetFairSettlement: number;
  walkAwayFloor: number;
  paymentWindowDays?: number;
  paymentMethod?: 'certified_check' | 'wire_transfer' | 'installments';
  includeConfidentiality?: boolean;
  includeNonDisparagement?: boolean;
  offerHistory?: SettlementOfferLog[];
}

// Chat Thread Types
export interface ChatMessage {
  id: string;
  senderName: string;
  isMe: boolean;
  timestamp: string;
  content: string;
  isAdmission: boolean;
  highlightNote?: string;
}

export interface ChatThread {
  id: string;
  title: string;
  platform: 'iMessage' | 'SMS' | 'WhatsApp' | 'Email';
  participantA: string;
  participantB: string;
  messages: ChatMessage[];
}

export interface OpposingCounselInfo {
  name: string;
  firm: string;
  barNumber?: string;
  email?: string;
  phone?: string;
  posture: 'aggressive' | 'cooperative' | 'unresponsive' | 'cautious';
  notes: string;
}

export interface DossierPrintOptions {
  includeSummary: boolean;
  includeElements: boolean;
  includeDamages: boolean;
  includeEvidence: boolean;
  includeCounsel: boolean;
  includeStrategy: boolean;
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  status: 'verified' | 'logged' | 'warning';
}

export interface CaseFile {
  id: string;
  title: string;
  caseNumber: string;
  country: CountryCode;
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
      signedDate?: string;
      signatureDataUrl?: string;
    };
  };
  evidenceList: EvidenceItem[];
  serviceRecords: ServiceRecord[];
  discovery: {
    interrogatories: DiscoveryItem[];
    rfps: DiscoveryItem[];
    rfas: DiscoveryItem[];
    subpoenas: SubpoenaRequest[];
  };
  trialPrep: {
    witnessOutlines: WitnessOutline[];
    openingStatementDraft: string;
    closingArgumentDraft: string;
    teleprompterWpm: number;
  };
  settlement: SettlementCalculation;
  chatThreads: ChatThread[];
  secondOpinionDefenses?: PredictedDefense[];
  resolvedVulnerabilityIds?: string[];
  opposingCounsel?: OpposingCounselInfo;
  dossierPrintSections?: DossierPrintOptions;
  securityAuditLogs?: SecurityAuditEntry[];
}

export interface DisputeBlueprint {
  id: string;
  title: string;
  category: DisputeCategory;
  state: string;
  damagesSummary: string;
  estimatedTotal: number;
  description: string;
  caseData: CaseFile;
}
