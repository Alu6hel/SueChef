import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { DiscoveryItem, SubpoenaRequest } from '../../types';
import { sound } from '../../services/soundEngine';
import { 
  FolderSearch, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Send, 
  Building, 
  HelpCircle,
  ShieldCheck,
  Download,
  RefreshCw,
  Edit3,
  Sparkles
} from 'lucide-react';

export const DiscoveryStudio: React.FC = () => {
  const { activeCase, updateActiveCase } = useSueChef();
  const [activeTab, setActiveTab] = useState<'rog' | 'rfp' | 'rfa' | 'subpoena'>('rog');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // New item states
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newObjectionRisk, setNewObjectionRisk] = useState('');

  // Editing state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Subpoena form
  const [subThirdParty, setSubThirdParty] = useState('');
  const [subAddress, setSubAddress] = useState('');
  const [subDocs, setSubDocs] = useState('');
  const [subRelevance, setSubRelevance] = useState('');
  const [subDays, setSubDays] = useState(20);

  const discovery = activeCase.discovery || {
    interrogatories: [],
    rfps: [],
    rfas: [],
    subpoenas: []
  };

  const handleLoadDiscoveryTemplate = () => {
    sound.playDocketStamp();
    const dName = activeCase.parties.find(p => p.role === 'defendant')?.name || 'Defendant';
    const cat = activeCase.claimEvaluation.category;

    let newRogs: DiscoveryItem[] = [];
    let newRfps: DiscoveryItem[] = [];
    let newRfas: DiscoveryItem[] = [];
    let newSubs: SubpoenaRequest[] = [];

    if (cat === 'security_deposit') {
      newRogs = [
        {
          id: `disc_rog_1`,
          number: 1,
          questionText: `Identify the financial institution, account number, and escrow title where Plaintiff's security deposit was held throughout tenancy.`,
          targetObjective: 'Verify whether deposit was commingled with landlord personal operating funds.',
          objectionRiskNotes: 'Directly relevant under state security deposit statutory trust requirements.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_2`,
          number: 2,
          questionText: `State the exact date, time, and identity of all individuals who conducted the move-out inspection of the subject premises.`,
          targetObjective: 'Establish lack of contemporaneous inspection or unqualified inspector.',
          objectionRiskNotes: 'Standard factual inquiry regarding basis of withholding.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_3`,
          number: 3,
          questionText: `Itemize every deduction made from Plaintiff's deposit, including vendor name, invoice date, amount paid, and description of work.`,
          targetObjective: 'Lock in defendant to specific itemized invoices or expose fabricated repair charges.',
          objectionRiskNotes: 'Statutory disclosure requirement under civil deposit code.',
          category: 'interrogatory'
        }
      ];

      newRfps = [
        {
          id: `disc_rfp_1`,
          number: 1,
          questionText: `All original canceled checks, bank statements, wire confirmations, and deposit escrow ledgers reflecting Plaintiff's security deposit payment.`,
          targetObjective: 'Prove payment in full and trace escrowed funds.',
          objectionRiskNotes: 'Standard financial document production.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_2`,
          number: 2,
          questionText: `All itemized contractor invoices, paid receipts, timecards, and material receipts supporting any deduction claimed against Plaintiff's deposit.`,
          targetObjective: 'Expose inflated repair claims or absence of actual out-of-pocket expenditures.',
          objectionRiskNotes: 'Direct evidentiary support for affirmative defense.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_3`,
          number: 3,
          questionText: `All move-in and move-out photographic evidence, video walkthroughs, and inspection checklists depicting the condition of the subject premises.`,
          targetObjective: 'Demonstrate pre-existing wear and tear versus tenant damage.',
          objectionRiskNotes: 'Standard property condition evidence.',
          category: 'rfp'
        }
      ];

      newRfas = [
        {
          id: `disc_rfa_1`,
          number: 1,
          questionText: `Admit that Plaintiff surrendered physical possession and returned all premises keys on the move-out date.`,
          targetObjective: 'Trigger 30-day statutory admission trap establishing tenancy surrender date.',
          objectionRiskNotes: 'Clear factual admission request under civil discovery rules.',
          category: 'rfa'
        },
        {
          id: `disc_rfa_2`,
          number: 2,
          questionText: `Admit that Defendant failed to deliver an itemized disposition letter and refund check to Plaintiff within the statutory window.`,
          targetObjective: 'Conclusively establish per se statutory breach authorizing bad-faith multiplier.',
          objectionRiskNotes: 'Dispositive admission on statutory deadline.',
          category: 'rfa'
        }
      ];

      newSubs = [
        {
          id: `disc_sub_1`,
          thirdPartyName: 'JPMorgan Chase Bank / Escrow Dept',
          thirdPartyAddress: 'National Subpoena Processing, Dallas, TX',
          documentsRequested: 'Bank account monthly statements and deposit transaction slips for account ending in #9912.',
          relevanceDeclaration: 'Proves whether security deposit was commingled and date of deposit clearance.',
          complianceDeadlineDays: 20
        }
      ];
    } else if (cat === 'wage_theft') {
      newRogs = [
        {
          id: `disc_rog_1`,
          number: 1,
          questionText: `State Plaintiff's complete dates of employment, job classification (exempt vs non-exempt), agreed regular hourly wage rate, and overtime rate.`,
          targetObjective: 'Establish baseline wage agreement and statutory non-exempt classification.',
          objectionRiskNotes: 'Fundamental employment and wage liability baseline.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_2`,
          number: 2,
          questionText: `Identify all timekeeping systems, electronic badge swipe records, POS sign-ins, and manual timesheets tracking Plaintiff's daily hours worked.`,
          targetObjective: 'Capture objective electronic records of uncompensated overtime and off-the-clock work.',
          objectionRiskNotes: 'Core electronic discovery under FLSA and state labor codes.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_3`,
          number: 3,
          questionText: `State the exact date, payment method, check number, and breakdown of all funds tendered to Plaintiff as final wages upon termination of employment.`,
          targetObjective: 'Establish prompt-payment penalty liability and willful withholding.',
          objectionRiskNotes: 'Direct inquiry on statutory waiting time penalties.',
          category: 'interrogatory'
        }
      ];

      newRfps = [
        {
          id: `disc_rfp_1`,
          number: 1,
          questionText: `All contemporaneous electronic punch logs, timecards, biometric clock logs, and supervisor time-edit audit trails for Plaintiff.`,
          targetObjective: 'Expose unauthorized supervisor shave-downs or unrecorded shift hours.',
          objectionRiskNotes: 'Mandatory statutory employer payroll record retention.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_2`,
          number: 2,
          questionText: `All itemized wage statements (paystubs), direct deposit confirmations, and W-2 / 1099 tax forms issued to Plaintiff.`,
          targetObjective: 'Document exact gross wages, statutory deductions, and overtime pay discrepancies.',
          objectionRiskNotes: 'Standard statutory wage records.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_3`,
          number: 3,
          questionText: `Defendant's written meal and rest break policies, employee handbook, and acknowledgement forms signed by Plaintiff.`,
          targetObjective: 'Prove lack of statutory break compliance and employer notice.',
          objectionRiskNotes: 'Standard employer policy production.',
          category: 'rfp'
        }
      ];

      newRfas = [
        {
          id: `disc_rfa_1`,
          number: 1,
          questionText: `Admit that Plaintiff was classified as a non-exempt hourly employee eligible for statutory overtime compensation.`,
          targetObjective: 'Conclusively eliminate misclassification exemption defense.',
          objectionRiskNotes: 'Key claim element admission.',
          category: 'rfa'
        },
        {
          id: `disc_rfa_2`,
          number: 2,
          questionText: `Admit that Defendant did not pay Plaintiff all accrued final wages on the date of employment separation or within statutory waiting time limits.`,
          targetObjective: 'Lock in full statutory waiting time penalties under labor code.',
          objectionRiskNotes: 'Dispositive timing admission under state wage statutes.',
          category: 'rfa'
        }
      ];

      newSubs = [
        {
          id: `disc_sub_1`,
          thirdPartyName: 'ADP / Gusto / Paychex Legal Department',
          thirdPartyAddress: 'Subpoena Operations, National Headquarters',
          documentsRequested: 'Certified electronic payroll audit logs, gross earnings ledgers, and direct deposit confirmation records for Plaintiff.',
          relevanceDeclaration: 'Unbiased third-party verification of gross pay, net pay, and transmission timestamps.',
          complianceDeadlineDays: 20
        }
      ];
    } else if (cat === 'consumer_fraud') {
      newRogs = [
        {
          id: `disc_rog_1`,
          number: 1,
          questionText: `Identify all advertising claims, promotional marketing materials, specifications, and sales presentations provided to Plaintiff concerning the subject transaction.`,
          targetObjective: 'Lock in the explicit representations and factual warranties made to consumer.',
          objectionRiskNotes: 'Directly relevant to deceptive trade practices and statutory fraud.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_2`,
          number: 2,
          questionText: `State all consumer complaints, warranty claims, BBB arbitrations, or state attorney general inquiries received by Defendant regarding identical product/service defects within the past 24 months.`,
          targetObjective: 'Establish Defendant scienter, pattern of deceptive conduct, and willful non-disclosure.',
          objectionRiskNotes: 'Pattern and practice evidence admissible under consumer protection statutes.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_3`,
          number: 3,
          questionText: `State the factual and legal basis for Defendant's refusal to provide a full statutory refund or repair upon Plaintiff's timely demand.`,
          targetObjective: 'Commit Defendant to affirmative defenses and identify purported contractual disclaimers.',
          objectionRiskNotes: 'Standard contention interrogatory.',
          category: 'interrogatory'
        }
      ];

      newRfps = [
        {
          id: `disc_rfp_1`,
          number: 1,
          questionText: `All sales agreements, invoices, receipts, written warranty brochures, and return policies provided to Plaintiff at or before the time of purchase.`,
          targetObjective: 'Establish contract terms and unconscionable or misleading clauses.',
          objectionRiskNotes: 'Primary transaction documents.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_2`,
          number: 2,
          questionText: `All internal emails, customer service tickets, chat transcripts, and repair logs regarding Plaintiff's complaints and requests for remedy.`,
          targetObjective: 'Uncover internal admissions of product defect or bad-faith stonewalling.',
          objectionRiskNotes: 'Standard business communications.',
          category: 'rfp'
        }
      ];

      newRfas = [
        {
          id: `disc_rfa_1`,
          number: 1,
          questionText: `Admit that Defendant represented the subject merchandise/service possessed specific attributes or quality that it did not in fact possess.`,
          targetObjective: 'Conclusively establish deceptive representation under consumer protection statutes.',
          objectionRiskNotes: 'Dispositive admission of misrepresentation.',
          category: 'rfa'
        },
        {
          id: `disc_rfa_2`,
          number: 2,
          questionText: `Admit that Plaintiff provided timely written notice of defect and demanded rescission or refund within 30 days of discovery.`,
          targetObjective: 'Establish compliance with statutory notice prerequisites.',
          objectionRiskNotes: 'Factual notice admission.',
          category: 'rfa'
        }
      ];

      newSubs = [
        {
          id: `disc_sub_1`,
          thirdPartyName: 'Stripe / Square / Merchant Payment Processor',
          thirdPartyAddress: 'Subpoena Compliance Unit, San Francisco, CA',
          documentsRequested: 'Payment transaction authorization logs, dispute correspondence, and chargeback arbitration records for transaction.',
          relevanceDeclaration: 'Establishes payment flow, merchant representations, and financial dispute chronology.',
          complianceDeadlineDays: 20
        }
      ];
    } else if (cat === 'contractor_dispute') {
      newRogs = [
        {
          id: `disc_rog_1`,
          number: 1,
          questionText: `State Defendant's official state contractor license number, specialty classification, active bonding company, and commercial general liability insurance policy number.`,
          targetObjective: 'Verify statutory licensure status and identify surety bond assets for collection.',
          objectionRiskNotes: 'Public statutory licensing requirements for home improvement contractors.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_2`,
          number: 2,
          questionText: `Itemize all labor hours, subcontractor payments, materials purchased, and equipment rentals billed to Plaintiff on the subject improvement project.`,
          targetObjective: 'Expose inflated billing, ghost labor, or markups unauthorized by contract.',
          objectionRiskNotes: 'Direct cost itemization under construction contract.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_3`,
          number: 3,
          questionText: `State the factual reasons why project milestones were not completed by the agreed substantial completion deadline.`,
          targetObjective: 'Lock in excuses (weather, supply chain, homeowner changes) prior to trial.',
          objectionRiskNotes: 'Core breach of contract defense inquiry.',
          category: 'interrogatory'
        }
      ];

      newRfps = [
        {
          id: `disc_rfp_1`,
          number: 1,
          questionText: `The complete executed construction agreement, change orders, architectural drawings, project timeline, and daily superintendent job logs.`,
          targetObjective: 'Prove contractual scope, unapproved changes, and daily job site delays.',
          objectionRiskNotes: 'Fundamental construction project documentation.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_2`,
          number: 2,
          questionText: `All municipal building permits, permit applications, inspection sign-off cards, correction notices, and certificates of occupancy for Plaintiff's premises.`,
          targetObjective: 'Demonstrate code violations, unpermitted work, or failed municipal inspections.',
          objectionRiskNotes: 'Official public safety and building code compliance records.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_3`,
          number: 3,
          questionText: `All invoices, material receipts, and unconditional lien waivers from all subcontractors and suppliers who provided labor or materials.`,
          targetObjective: 'Prevent mechanic lien exposure and verify true wholesale material expenditures.',
          objectionRiskNotes: 'Essential construction financial records.',
          category: 'rfp'
        }
      ];

      newRfas = [
        {
          id: `disc_rfa_1`,
          number: 1,
          questionText: `Admit that Defendant did not obtain final municipal building inspection approval for the work performed on Plaintiff's property.`,
          targetObjective: 'Establish incomplete performance and building code non-compliance as a matter of law.',
          objectionRiskNotes: 'Dispositive admission regarding completion.',
          category: 'rfa'
        },
        {
          id: `disc_rfa_2`,
          number: 2,
          questionText: `Admit that Plaintiff paid Defendant all installment sums due under the contract prior to Defendant abandoning or halting work.`,
          targetObjective: 'Conclusively establish Plaintiff full performance of payment covenants.',
          objectionRiskNotes: 'Direct claim element admission.',
          category: 'rfa'
        }
      ];

      newSubs = [
        {
          id: `disc_sub_1`,
          thirdPartyName: 'City Department of Building & Safety',
          thirdPartyAddress: 'Office of Records & Code Enforcement, City Hall',
          documentsRequested: 'Certified permit history, building inspector field notes, and correction notices issued for the subject parcel.',
          relevanceDeclaration: 'Neutral municipal documentation of defective work or missing mandatory permits.',
          complianceDeadlineDays: 20
        }
      ];
    } else if (cat === 'property_damage') {
      newRogs = [
        {
          id: `disc_rog_1`,
          number: 1,
          questionText: `Describe in complete detail the exact sequence of events, date, time, and physical mechanism whereby Defendant or Defendant's agents caused damage to Plaintiff's property.`,
          targetObjective: 'Pin down Defendant narrative of incident under oath before trial.',
          objectionRiskNotes: 'Core factual inquiry regarding liability.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_2`,
          number: 2,
          questionText: `Identify all liability insurance policies (carrier name, policy number, and policy limits) providing coverage for Defendant for the incident in question.`,
          targetObjective: 'Discover insurance indemnity assets and trigger carrier settlement reserves.',
          objectionRiskNotes: 'Mandatory insurance disclosure under modern rules of civil procedure.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_3`,
          number: 3,
          questionText: `Identify all eyewitnesses, employees, or third parties who observed or investigated the damage to Plaintiff's property.`,
          targetObjective: 'Identify trial witnesses and unearth prior admissions.',
          objectionRiskNotes: 'Standard witness identification.',
          category: 'interrogatory'
        }
      ];

      newRfps = [
        {
          id: `disc_rfp_1`,
          number: 1,
          questionText: `All photographs, video surveillance footage, incident reports, and internal memos documenting the damage incident.`,
          targetObjective: 'Secure visual evidence before spoliation or automatic overwrite.',
          objectionRiskNotes: 'Direct physical and video evidence.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_2`,
          number: 2,
          questionText: `All repair estimates, salvage value calculations, and insurance adjuster appraisals regarding Plaintiff's damaged property.`,
          targetObjective: 'Establish benchmark cost of repair or diminution in fair market value.',
          objectionRiskNotes: 'Standard property damage assessment.',
          category: 'rfp'
        }
      ];

      newRfas = [
        {
          id: `disc_rfa_1`,
          number: 1,
          questionText: `Admit that Defendant or Defendant's agents exercised exclusive control over the instrumentality that caused damage to Plaintiff's property.`,
          targetObjective: 'Establish res ipsa loquitur and prima facie negligence.',
          objectionRiskNotes: 'Dispositive admission of control and causation.',
          category: 'rfa'
        },
        {
          id: `disc_rfa_2`,
          number: 2,
          questionText: `Admit that Defendant has not reimbursed Plaintiff for the documented repair or replacement cost of the damaged property.`,
          targetObjective: 'Eliminate affirmative defenses of accord and satisfaction or prior payment.',
          objectionRiskNotes: 'Direct damages admission.',
          category: 'rfa'
        }
      ];

      newSubs = [
        {
          id: `disc_sub_1`,
          thirdPartyName: 'Commercial Liability Insurance Carrier / Claims Dept',
          thirdPartyAddress: 'Subpoena Processing Center, National Claims Office',
          documentsRequested: 'Certified claim file, field adjuster photographs, recorded statements, and preliminary property loss reports.',
          relevanceDeclaration: 'Uncovers contemporaneous liability assessments and insurer loss appraisals.',
          complianceDeadlineDays: 20
        }
      ];
    } else if (cat === 'auto_accident') {
      newRogs = [
        {
          id: `disc_rog_1`,
          number: 1,
          questionText: `State Defendant operator's full name, driver's license number, registered vehicle owner, and vehicular insurance policy details.`,
          targetObjective: 'Establish permissive use, agency, and vicarious ownership liability.',
          objectionRiskNotes: 'Standard automobile collision discovery.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_2`,
          number: 2,
          questionText: `State Defendant's exact speed, braking distance, lane of travel, and whether Defendant was utilizing a mobile device immediately preceding collision.`,
          targetObjective: 'Establish per se statutory vehicle code violations and distracted driving.',
          objectionRiskNotes: 'Direct causation and negligence inquiry.',
          category: 'interrogatory'
        }
      ];

      newRfps = [
        {
          id: `disc_rfp_1`,
          number: 1,
          questionText: `All dashcam footage, event data recorder (black box) telemetry, collision scene photographs, and repair shop estimates for Defendant vehicle.`,
          targetObjective: 'Prove vehicle impact velocity and physical point of impact.',
          objectionRiskNotes: 'Direct physical evidence.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_2`,
          number: 2,
          questionText: `Police collision reports, traffic citations, and recorded witness statements arising from the accident.`,
          targetObjective: 'Document official law enforcement liability findings.',
          objectionRiskNotes: 'Public and official accident records.',
          category: 'rfp'
        }
      ];

      newRfas = [
        {
          id: `disc_rfa_1`,
          number: 1,
          questionText: `Admit that Defendant vehicle struck Plaintiff vehicle in the rear or failed to yield the statutory right of way.`,
          targetObjective: 'Conclusively establish prima facie driver negligence.',
          objectionRiskNotes: 'Dispositive liability admission.',
          category: 'rfa'
        }
      ];

      newSubs = [
        {
          id: `disc_sub_1`,
          thirdPartyName: 'Cellular Service Carrier (Verizon / AT&T / T-Mobile)',
          thirdPartyAddress: 'Law Enforcement & Civil Subpoena Compliance Dept',
          documentsRequested: 'Call detail records, SMS transmission logs, and data session timestamps for Defendant mobile number during the 30-minute window surrounding collision.',
          relevanceDeclaration: 'Establishes whether Defendant was texting or using mobile device at exact time of crash.',
          complianceDeadlineDays: 20
        }
      ];
    } else {
      // Default: Breach of Contract & General Dispute
      newRogs = [
        {
          id: `disc_rog_1`,
          number: 1,
          questionText: `Identify all agreements, written statements of work, invoices, and communications between Plaintiff and ${dName}.`,
          targetObjective: 'Establish complete contract formation, terms, and scope.',
          objectionRiskNotes: 'Standard contract liability scope.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_2`,
          number: 2,
          questionText: `State the factual basis for Defendant's non-payment or refusal to perform contract obligations.`,
          targetObjective: 'Lock in defense arguments under oath prior to trial.',
          objectionRiskNotes: 'Core contention interrogatory.',
          category: 'interrogatory'
        },
        {
          id: `disc_rog_3`,
          number: 3,
          questionText: `Identify each person who reviewed, accepted, or rejected Plaintiff's performance or deliverables under the agreement.`,
          targetObjective: 'Identify key corporate witnesses and prevent surprise trial testimony.',
          objectionRiskNotes: 'Standard witness and personnel identification.',
          category: 'interrogatory'
        }
      ];

      newRfps = [
        {
          id: `disc_rfp_1`,
          number: 1,
          questionText: `All written contracts, email threads, text messages, and internal notes concerning Plaintiff and transaction in dispute.`,
          targetObjective: 'Uncover admissions and verify contract terms.',
          objectionRiskNotes: 'Standard business communications request.',
          category: 'rfp'
        },
        {
          id: `disc_rfp_2`,
          number: 2,
          questionText: `All invoices, purchase orders, delivery confirmations, and accounts payable ledgers relating to Plaintiff's claim.`,
          targetObjective: 'Document receipt of invoices and lack of timely written dispute.',
          objectionRiskNotes: 'Essential accounting and transactional records.',
          category: 'rfp'
        }
      ];

      newRfas = [
        {
          id: `disc_rfa_1`,
          number: 1,
          questionText: `Admit that Plaintiff performed agreed obligations and delivered required deliverables/consideration under the contract.`,
          targetObjective: 'Conclusively admit Plaintiff substantial performance.',
          objectionRiskNotes: 'Direct claim element admission.',
          category: 'rfa'
        },
        {
          id: `disc_rfa_2`,
          number: 2,
          questionText: `Admit that Defendant failed to pay the agreed contract sum within the time specified in Plaintiff's invoices.`,
          targetObjective: 'Conclusively establish breach of contract payment covenants.',
          objectionRiskNotes: 'Dispositive admission of non-payment.',
          category: 'rfa'
        }
      ];

      newSubs = [
        {
          id: `disc_sub_1`,
          thirdPartyName: `Commercial Banking Institution of ${dName}`,
          thirdPartyAddress: 'Legal Subpoena Processing Division',
          documentsRequested: 'Accounts payable ledgers and wire transfer records related to transactions with Plaintiff.',
          relevanceDeclaration: 'Verifies whether payment was ever authorized, disbursed, or blocked.',
          complianceDeadlineDays: 20
        }
      ];
    }

    updateActiveCase(prev => ({
      ...prev,
      discovery: {
        interrogatories: newRogs,
        rfps: newRfps,
        rfas: newRfas,
        subpoenas: newSubs.length > 0 ? newSubs : prev.discovery?.subpoenas || []
      }
    }));
  };

  const handleCopyFormattedPleading = (type: 'rog' | 'rfp' | 'rfa' | 'subpoena') => {
    sound.playDocketStamp();
    let text = `ATTORNEY OR PARTY WITHOUT ATTORNEY (Name & Address):\n`;
    const pl = activeCase.parties.find(p => p.role === 'plaintiff');
    const df = activeCase.parties.find(p => p.role === 'defendant');
    text += `${pl?.name || 'PLAINTIFF'}\n${pl?.address || ''}\n${pl?.city || ''}, ${pl?.state || ''} ${pl?.zip || ''}\n`;
    text += `PRO SE / IN PROPRIA PERSONA\n\n`;
    text += `${activeCase.courtName.toUpperCase()}\n\n`;
    text += `${pl?.name || 'PLAINTIFF'}, Plaintiff,\nv.\n${df?.name || 'DEFENDANT'}, Defendant.\n\n`;
    text += `Case No.: ${activeCase.caseNumber}\n\n`;

    if (type === 'rog') {
      text += `PLAINTIFF'S FIRST SET OF WRITTEN INTERROGATORIES TO DEFENDANT\n`;
      text += `PROPOUNDING PARTY: Plaintiff ${pl?.name}\nRESPONDING PARTY: Defendant ${df?.name}\nSET NUMBER: ONE (1)\n\n`;
      text += `INSTRUCTIONS: Pursuant to applicable rules of civil procedure, responding party is required to answer separately and fully in writing under oath within 30 days of service.\n\n`;
      discovery.interrogatories.forEach(item => {
        text += `INTERROGATORY NO. ${item.number}:\n${item.questionText}\n\n`;
      });
    } else if (type === 'rfp') {
      text += `PLAINTIFF'S FIRST SET OF REQUESTS FOR PRODUCTION OF DOCUMENTS\n`;
      text += `PROPOUNDING PARTY: Plaintiff ${pl?.name}\nRESPONDING PARTY: Defendant ${df?.name}\n\n`;
      text += `INSTRUCTIONS: Responding party is requested to produce and permit inspection/copying of the following documents within 30 days of service.\n\n`;
      discovery.rfps.forEach(item => {
        text += `REQUEST FOR PRODUCTION NO. ${item.number}:\n${item.questionText}\n\n`;
      });
    } else if (type === 'rfa') {
      text += `PLAINTIFF'S FIRST SET OF REQUESTS FOR ADMISSION\n`;
      text += `PROPOUNDING PARTY: Plaintiff ${pl?.name}\nRESPONDING PARTY: Defendant ${df?.name}\n\n`;
      text += `WARNING: PURSUANT TO CIVIL PROCEDURE RULES, EACH MATTER REQUESTED HEREIN IS DEEMED ADMITTED UNLESS RESPONDING PARTY SERVES WRITTEN OBJECTIONS OR ANSWERS WITHIN THIRTY (30) DAYS.\n\n`;
      discovery.rfas.forEach(item => {
        text += `REQUEST FOR ADMISSION NO. ${item.number}:\n${item.questionText}\n\n`;
      });
    } else {
      text += `SUBPOENA DUCES TECUM FOR PRODUCTION OF BUSINESS RECORDS\n\n`;
      discovery.subpoenas.forEach((sub, idx) => {
        text += `SUBPOENA NO. ${idx + 1}:\nTO: ${sub.thirdPartyName}\nADDRESS: ${sub.thirdPartyAddress}\n`;
        text += `DOCUMENTS COMMANDED: ${sub.documentsRequested}\n`;
        text += `RELEVANCE DECLARATION: ${sub.relevanceDeclaration}\n`;
        text += `COMPLIANCE DEADLINE: ${sub.complianceDeadlineDays} calendar days from service.\n\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleAddItem = (category: 'rog' | 'rfp' | 'rfa') => {
    if (!newQuestionText.trim()) return;
    sound.playGavelStrike();

    const targetKey = category === 'rog' ? 'interrogatories' : category === 'rfp' ? 'rfps' : 'rfas';
    const currentList = discovery[targetKey];
    const newItem: DiscoveryItem = {
      id: `disc_${Date.now()}`,
      number: currentList.length + 1,
      questionText: newQuestionText.trim(),
      targetObjective: newObjective.trim() || 'Establish material factual basis for civil liability.',
      objectionRiskNotes: newObjectionRisk.trim() || 'Standard civil discovery scope.',
      category: category === 'rog' ? 'interrogatory' : category
    };

    updateActiveCase(prev => ({
      ...prev,
      discovery: {
        ...discovery,
        [targetKey]: [...currentList, newItem]
      }
    }));

    setNewQuestionText('');
    setNewObjective('');
    setNewObjectionRisk('');
  };

  const handleDeleteItem = (category: 'rog' | 'rfp' | 'rfa', id: string) => {
    sound.playClick();
    const targetKey = category === 'rog' ? 'interrogatories' : category === 'rfp' ? 'rfps' : 'rfas';
    const filtered = discovery[targetKey].filter(i => i.id !== id).map((item, idx) => ({
      ...item,
      number: idx + 1
    }));

    updateActiveCase(prev => ({
      ...prev,
      discovery: {
        ...discovery,
        [targetKey]: filtered
      }
    }));
  };

  const handleAddSubpoena = () => {
    if (!subThirdParty.trim() || !subDocs.trim()) return;
    sound.playGavelStrike();

    const newSub: SubpoenaRequest = {
      id: `sub_${Date.now()}`,
      thirdPartyName: subThirdParty.trim(),
      thirdPartyAddress: subAddress.trim() || 'Headquarters / Registered Agent Address',
      documentsRequested: subDocs.trim(),
      relevanceDeclaration: subRelevance.trim() || 'Directly relevant to material allegations in verified complaint.',
      complianceDeadlineDays: subDays || 20
    };

    updateActiveCase(prev => ({
      ...prev,
      discovery: {
        ...discovery,
        subpoenas: [...discovery.subpoenas, newSub]
      }
    }));

    setSubThirdParty('');
    setSubAddress('');
    setSubDocs('');
    setSubRelevance('');
    setSubDays(20);
  };

  const handleDeleteSubpoena = (id: string) => {
    sound.playClick();
    updateActiveCase(prev => ({
      ...prev,
      discovery: {
        ...discovery,
        subpoenas: discovery.subpoenas.filter(s => s.id !== id)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-card/60 border border-border/80 custom-geometry">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary custom-geometry">
            <FolderSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide font-serif">Pre-Trial Discovery & Subpoena Studio</h1>
            <p className="text-xs text-muted-foreground">
              Lock in facts under oath, uncover hidden communications, and enforce statutory 30-day admission traps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleLoadDiscoveryTemplate}
            className="flex items-center gap-1.5 px-3 py-2 bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 border border-border custom-geometry transition-all"
            title="Populate complete sets of ROGs, RFPs, and RFAs for your dispute type"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Category Discovery Suite</span>
          </button>
          <button
            onClick={() => handleCopyFormattedPleading(activeTab)}
            className="flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
          >
            {copiedSection === activeTab ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>Copy Formal Pleading ({activeTab.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/70 pb-3">
        <button
          onClick={() => { sound.playClick(); setActiveTab('rog'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'rog'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Interrogatories (ROG)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {discovery.interrogatories.length}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('rfp'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'rfp'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <FolderSearch className="w-4 h-4" />
          <span>Document Production (RFP)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {discovery.rfps.length}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('rfa'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'rfa'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-300" />
          <span>Requests for Admission (RFA)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {discovery.rfas.length}
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('subpoena'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold custom-geometry transition-all ${
            activeTab === 'subpoena'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/60'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Subpoenas Duces Tecum</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 text-white font-mono">
            {discovery.subpoenas.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Interrogatories */}
      {activeTab === 'rog' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 text-xs leading-relaxed text-muted-foreground custom-geometry">
            <strong className="text-foreground">Pro Se Litigation Strategy:</strong> Interrogatories are written questions propounded under oath (FRCP Rule 33 / State analogues). Limit questions to concise, single-issue facts. Responding parties have 30 calendar days to answer under penalty of perjury.
          </div>

          <div className="space-y-3">
            {discovery.interrogatories.map((item) => (
              <div key={item.id} className="p-4 bg-card/70 border border-border custom-geometry space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-primary/15 text-primary border border-primary/30 custom-geometry">
                      ROG #{item.number}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('rog', item.id)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {item.questionText}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-primary font-semibold">Tactical Objective: </span>
                    <span className="text-muted-foreground">{item.targetObjective}</span>
                  </div>
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-amber-500 font-semibold">Objection Defense: </span>
                    <span className="text-muted-foreground">{item.objectionRiskNotes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Rog */}
          <div className="p-4 bg-card border border-dashed border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Draft Custom Interrogatory</span>
            </h3>

            <textarea
              rows={2}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g., State the full legal name, job title, and current contact address of every individual who inspected Plaintiff's unit on July 31, 2025."
              className="w-full bg-input/50 border border-border p-2.5 text-xs rounded-none focus:outline-none focus:border-primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Tactical Objective (e.g. Identify direct witness)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={newObjectionRisk}
                onChange={(e) => setNewObjectionRisk(e.target.value)}
                placeholder="Objection Mitigation (e.g. Narrowly tailored)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={() => handleAddItem('rog')}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
            >
              Add Interrogatory to Docket
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: RFP */}
      {activeTab === 'rfp' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 text-xs leading-relaxed text-muted-foreground custom-geometry">
            <strong className="text-foreground">Document Production Weaponry:</strong> Requests for Production (FRCP Rule 34 / State analogues) force the opposing party to produce unedited emails, ledgers, internal chats, and original receipts. Failure to produce after 30 days allows filing a Motion to Compel with mandatory fee sanctions.
          </div>

          <div className="space-y-3">
            {discovery.rfps.map((item) => (
              <div key={item.id} className="p-4 bg-card/70 border border-border custom-geometry space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-primary/15 text-primary border border-primary/30 custom-geometry">
                    RFP #{item.number}
                  </span>
                  <button
                    onClick={() => handleDeleteItem('rfp', item.id)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {item.questionText}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-primary font-semibold">Evidence Targeted: </span>
                    <span className="text-muted-foreground">{item.targetObjective}</span>
                  </div>
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-amber-500 font-semibold">Scope Defense: </span>
                    <span className="text-muted-foreground">{item.objectionRiskNotes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New RFP */}
          <div className="p-4 bg-card border border-dashed border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Draft Custom Request for Production (RFP)</span>
            </h3>

            <textarea
              rows={2}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g., Produce all timecard records, GPS vehicle logs, and work orders for Defendant's technicians for the date of September 15, 2025."
              className="w-full bg-input/50 border border-border p-2.5 text-xs rounded-none focus:outline-none focus:border-primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Targeted Records (e.g. Prove technician arrived 3 hours late)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={newObjectionRisk}
                onChange={(e) => setNewObjectionRisk(e.target.value)}
                placeholder="Scope Justification (e.g. Direct liability evidence)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={() => handleAddItem('rfp')}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
            >
              Add RFP to Docket
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: RFA (30-Day Default Trap) */}
      {activeTab === 'rfa' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-xs leading-relaxed text-amber-200 custom-geometry flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">The 30-Day Admission Trap (FRCP Rule 36 / State Statutes):</strong>
              <p className="mt-1 text-[11px] text-amber-200/90">
                Requests for Admission are the single most deadly tool for self-represented litigants. If the defendant forgets or fails to serve verified responses within exactly <strong>30 calendar days</strong> of service, <strong>each and every statement is automatically deemed conclusively admitted by law</strong>. No trial testimony can contradict a deemed admission!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {discovery.rfas.map((item) => (
              <div key={item.id} className="p-4 bg-card/70 border border-border custom-geometry space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 custom-geometry">
                      RFA #{item.number}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-destructive/20 text-destructive-foreground border border-destructive/30 font-mono">
                      30-Day Default Trap Active
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('rfa', item.id)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {item.questionText}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-primary font-semibold">Litigation Impact: </span>
                    <span className="text-muted-foreground">{item.targetObjective}</span>
                  </div>
                  <div className="p-2 bg-muted/40 border border-border/40 custom-geometry">
                    <span className="text-emerald-400 font-semibold">Conclusive Effect: </span>
                    <span className="text-muted-foreground">Eliminates need for trial proof if admitted.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New RFA */}
          <div className="p-4 bg-card border border-dashed border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Draft Conclusive Request for Admission (RFA)</span>
            </h3>

            <textarea
              rows={2}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g., Admit that Defendant received Plaintiff's certified demand letter on September 3, 2025."
              className="w-full bg-input/50 border border-border p-2.5 text-xs rounded-none focus:outline-none focus:border-primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Tactical Impact (e.g. Conclusively prove receipt of notice)"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={newObjectionRisk}
                onChange={(e) => setNewObjectionRisk(e.target.value)}
                placeholder="Clear single-sentence phrasing"
                className="bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={() => handleAddItem('rfa')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold transition-all custom-geometry"
            >
              Add RFA to Docket (Activate 30-Day Trap)
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Subpoenas */}
      {activeTab === 'subpoena' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 text-xs leading-relaxed text-muted-foreground custom-geometry">
            <strong className="text-foreground">Third-Party Subpoena Duces Tecum (FRCP Rule 45 / State Code):</strong> Command uncooperative banks, telecom carriers (phone call/SMS records), or independent inspection companies to produce certified business records under penalty of judicial contempt.
          </div>

          <div className="space-y-3">
            {discovery.subpoenas.map((sub, idx) => (
              <div key={sub.id} className="p-4 bg-card/70 border border-border custom-geometry space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-primary/15 text-primary border border-primary/30 custom-geometry">
                      SUBPOENA #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-foreground">{sub.thirdPartyName}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSubpoena(sub.id)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div><strong>Service Address:</strong> {sub.thirdPartyAddress}</div>
                  <div><strong>Records Commanded:</strong> <span className="text-foreground">{sub.documentsRequested}</span></div>
                  <div><strong>Materiality Declaration:</strong> {sub.relevanceDeclaration}</div>
                  <div><strong>Mandatory Response Window:</strong> {sub.complianceDeadlineDays} calendar days</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Subpoena */}
          <div className="p-4 bg-card border border-dashed border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Issue New Subpoena Duces Tecum</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Target Entity / Bank / Carrier</label>
                <input
                  type="text"
                  value={subThirdParty}
                  onChange={(e) => setSubThirdParty(e.target.value)}
                  placeholder="e.g., JPMorgan Chase Bank, N.A."
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Subpoena Compliance Address</label>
                <input
                  type="text"
                  value={subAddress}
                  onChange={(e) => setSubAddress(e.target.value)}
                  placeholder="e.g., National Subpoena Dept, 500 Stanton Christiana Rd"
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Specific Business Records Commanded</label>
              <textarea
                rows={2}
                value={subDocs}
                onChange={(e) => setSubDocs(e.target.value)}
                placeholder="e.g., Certified bank statements and check deposit logs for Account #4912 for the months of July-September 2025."
                className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Declaration of Relevance / Materiality</label>
                <input
                  type="text"
                  value={subRelevance}
                  onChange={(e) => setSubRelevance(e.target.value)}
                  placeholder="e.g., Directly proves date and handling of escrow security deposit funds."
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Compliance Window (Days)</label>
                <input
                  type="number"
                  value={subDays}
                  onChange={(e) => setSubDays(parseInt(e.target.value) || 20)}
                  className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleAddSubpoena}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
            >
              Draft Subpoena Duces Tecum
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
