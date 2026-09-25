import { 
  CaseFile, 
  EnforcementPlan, 
  AssetDiscoveryItem, 
  WritOfExecution, 
  BankLevyNotice, 
  WageGarnishmentCalc, 
  JudgmentLienRecord, 
  DebtorsExamQuestionnaire 
} from '../types';
import { cleanPartyName, deriveCaseTitle } from './caseUtils';

export class EnforcementEngine {
  /**
   * Calculates post-judgment interest accrual
   */
  public static calculateInterest(
    principal: number,
    annualRatePercent: number,
    judgmentDateStr: string,
    paymentsReceived: number = 0,
    isCompounding: boolean = false
  ): {
    daysElapsed: number;
    dailyInterestRate: number;
    accruedInterest: number;
    currentPrincipalBalance: number;
    grandTotalEnforceable: number;
  } {
    const principalBalance = Math.max(0, principal - paymentsReceived);
    const jDate = new Date(judgmentDateStr);
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - jDate.getTime());
    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const rateFraction = (annualRatePercent || 10.0) / 100;
    const dailyRate = rateFraction / 365;

    let accruedInterest = 0;
    if (isCompounding) {
      accruedInterest = principalBalance * (Math.pow(1 + rateFraction, daysElapsed / 365) - 1);
    } else {
      accruedInterest = principalBalance * dailyRate * daysElapsed;
    }

    accruedInterest = Math.round(accruedInterest * 100) / 100;
    const grandTotal = Math.round((principalBalance + accruedInterest) * 100) / 100;

    return {
      daysElapsed,
      dailyInterestRate: dailyRate,
      accruedInterest,
      currentPrincipalBalance: principalBalance,
      grandTotalEnforceable: grandTotal
    };
  }

  /**
   * Calculates federal CCPA & state wage garnishment withholding
   */
  public static calculateGarnishment(
    disposableMonthlyPay: number,
    totalEnforceable: number,
    customStatutoryPercent: number = 25
  ): WageGarnishmentCalc {
    const federalMinExemptionMonthly = 217.5 * 4.33; // ~$942/mo
    const maxPercentFraction = Math.min(25, Math.max(10, customStatutoryPercent)) / 100;

    let monthlyWithholding = 0;
    const exemptions: string[] = [];

    if (disposableMonthlyPay <= federalMinExemptionMonthly) {
      monthlyWithholding = 0;
      exemptions.push('100% Exempt: Disposable income is below 30x Federal Minimum Wage threshold ($942/mo).');
    } else {
      const optionA = disposableMonthlyPay * maxPercentFraction;
      const optionB = disposableMonthlyPay - federalMinExemptionMonthly;
      monthlyWithholding = Math.min(optionA, optionB);
      exemptions.push(`Statutory ${customStatutoryPercent}% maximum disposable earnings cap applied under CCPA 15 U.S.C. § 1673.`);
    }

    monthlyWithholding = Math.round(monthlyWithholding * 100) / 100;
    const estimatedMonths = monthlyWithholding > 0 ? Math.ceil(totalEnforceable / monthlyWithholding) : 999;

    return {
      debtorGrossMonthlyPay: Math.round(disposableMonthlyPay * 1.25),
      debtorDisposableMonthlyPay: disposableMonthlyPay,
      statutoryMaxPercent: customStatutoryPercent,
      monthlyWithholdingAmount: monthlyWithholding,
      estimatedMonthsToSatisfy: estimatedMonths,
      exemptionsApplied: exemptions
    };
  }

  /**
   * Creates a default initialized EnforcementPlan for a case
   */
  public static createDefaultPlan(caseFile: CaseFile): EnforcementPlan {
    const totalAwarded = caseFile.claimEvaluation.damages.reduce((acc, d) => acc + (d.amount || 0), 0) || 3200;
    const p = caseFile.parties.find(x => x.role === 'plaintiff');
    const d = caseFile.parties.find(x => x.role === 'defendant');
    const pName = p ? cleanPartyName(p.name) : 'Plaintiff';
    const dName = d ? cleanPartyName(d.name) : 'Defendant';

    const defaultInterestRate = caseFile.state === 'CA' ? 10.0 : caseFile.state === 'NY' ? 9.0 : caseFile.country === 'GB' ? 8.0 : 10.0;
    const judgmentDate = caseFile.createdAt || new Date().toISOString().split('T')[0];

    const initialInterest = this.calculateInterest(totalAwarded, defaultInterestRate, judgmentDate, 0, false);
    const totalEnforceable = initialInterest.grandTotalEnforceable;

    return {
      judgmentObtained: true,
      judgmentDate,
      awardedPrincipal: totalAwarded,
      courtCosts: 185,
      postJudgmentCosts: 75,
      paymentsReceived: 0,
      statutoryInterestRate: defaultInterestRate,
      activeTab: 'overview',
      discoveredAssets: [
        {
          id: 'asset_1',
          category: 'bank_account',
          title: 'Commercial Checking Account',
          institutionOrEmployer: 'Chase Bank / Bank of America',
          estimatedValue: totalAwarded * 1.5,
          details: 'Used for rent collection and security deposit handling.',
          sourceOfInfo: 'Copy of deposited check refund and lease wire instructions.',
          isVerified: true
        },
        {
          id: 'asset_2',
          category: 'real_property',
          title: 'Residential Property Holding',
          institutionOrEmployer: `${caseFile.county} County Recorder of Deeds`,
          estimatedValue: 450000,
          details: `${d?.address || 'Subject Rental Property Address'}`,
          sourceOfInfo: 'County Tax Assessor Public Property Parcel Search.',
          isVerified: true
        },
        {
          id: 'asset_3',
          category: 'business_entity',
          title: 'Corporate Franchise Registration & Good Standing',
          institutionOrEmployer: 'Secretary of State Corporate Registry',
          estimatedValue: 100000,
          details: `Active LLC registration with statutory agent ${d?.registeredAgent || 'on file'}.`,
          sourceOfInfo: 'State Business Entity Online Search portal.',
          isVerified: true
        }
      ],
      writRecords: [
        {
          id: 'writ_1',
          caseTitle: deriveCaseTitle(pName, dName),
          caseNumber: caseFile.caseNumber || '26SC-004891',
          courtName: caseFile.courtName,
          county: caseFile.county,
          judgmentDate,
          principalAmount: totalAwarded,
          courtCostsAdded: 185,
          accruedInterest: initialInterest.accruedInterest,
          paymentsReceived: 0,
          totalEnforceable,
          targetDebtor: dName,
          levyOfficer: 'Sheriff',
          levyTargetAddress: d?.address || 'Defendant Business Address',
          status: 'draft'
        }
      ],
      lienRecords: [
        {
          id: 'lien_1',
          propertyAddress: d?.address || 'Subject Real Property',
          countyRecorderOffice: `${caseFile.county} County Recorder of Deeds`,
          apnOrParcelNumber: 'APN-849-012-004',
          recordingDate: new Date().toISOString().split('T')[0],
          instrumentNumber: 'DOC-2026-009182',
          status: 'draft'
        }
      ],
      examQuestions: [
        {
          id: 'q_1',
          category: 'banking',
          question: 'State the name, branch address, and account numbers for every bank or financial institution where you or your business hold accounts.',
          expectedDocuments: 'Last 12 months of complete bank account statements for all checking, savings, and merchant processing accounts.'
        },
        {
          id: 'q_2',
          category: 'employment',
          question: 'State your current sources of wages, commissions, independent contractor payments, and regular distributions.',
          expectedDocuments: 'Last 3 pay stubs, 1099-NEC forms, and federal tax returns for the past 2 calendar years.'
        },
        {
          id: 'q_3',
          category: 'real_estate',
          question: 'Do you own, co-own, or hold beneficial interest in any real estate, rental homes, or commercial properties?',
          expectedDocuments: 'Recorded deeds, mortgage statements, and lease agreements showing monthly rent collected from tenants.'
        },
        {
          id: 'q_4',
          category: 'vehicles',
          question: 'List the year, make, model, VIN, and registration status of all motor vehicles, equipment, or vessels titled in your name.',
          expectedDocuments: 'Vehicle titles, DMV registrations, and loan payoff statements.'
        }
      ],
      garnishment: this.calculateGarnishment(4500, totalEnforceable, 25)
    };
  }

  /**
   * Generates formal statutory Writ of Execution text
   */
  public static generateWritDocument(caseFile: CaseFile, plan: EnforcementPlan): string {
    const p = caseFile.parties.find(x => x.role === 'plaintiff');
    const d = caseFile.parties.find(x => x.role === 'defendant');
    const pName = p ? cleanPartyName(p.name) : 'Plaintiff';
    const dName = d ? cleanPartyName(d.name) : 'Defendant';

    const interestInfo = this.calculateInterest(
      plan.awardedPrincipal,
      plan.statutoryInterestRate,
      plan.judgmentDate,
      plan.paymentsReceived,
      false
    );

    const totalEnforceable = plan.awardedPrincipal + plan.courtCosts + plan.postJudgmentCosts + interestInfo.accruedInterest - plan.paymentsReceived;

    return `================================================================================
WRIT OF EXECUTION (MONEY JUDGMENT)
IN THE ${caseFile.courtName.toUpperCase()}
COUNTY OF ${caseFile.county.toUpperCase()}, STATE OF ${caseFile.state}
================================================================================

CASE NUMBER: ${caseFile.caseNumber || 'CIVIL ACTION'}
MATTER: ${deriveCaseTitle(pName, dName)}

TO THE SHERIFF, MARSHAL, OR AUTHORIZED LEVYING OFFICER:

1. JUDGMENT CREDITOR: ${pName}
   Address: ${p?.address || 'On File With Court'}, ${p?.city || ''}, ${p?.state || ''} ${p?.zip || ''}

2. JUDGMENT DEBTOR: ${dName}
   Address: ${d?.address || 'On File With Court'}, ${d?.city || ''}, ${d?.state || ''} ${d?.zip || ''}

3. JUDGMENT ENTRY DATE: ${plan.judgmentDate}

4. ACCOUNTING OF MONETARY JUDGMENT:
   a. Total Judgment Principal Awarded:             $${plan.awardedPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
   b. Court Costs Awarded in Judgment:              $${plan.courtCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
   c. Post-Judgment Accrued Costs (Writ & Service): $${plan.postJudgmentCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
   d. Statutory Post-Judgment Interest to Date:     $${interestInfo.accruedInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      (Accruing at ${plan.statutoryInterestRate}% per annum, daily rate: $${(interestInfo.dailyInterestRate * interestInfo.currentPrincipalBalance).toFixed(2)}/day)
   e. Less Payments Received and Credited:        - $${plan.paymentsReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
   -----------------------------------------------------------------------------
   TOTAL BALANCE CURRENTLY ENFORCEABLE:            $${totalEnforceable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

COMMAND TO LEVYING OFFICER:
YOU ARE HEREBY COMMANDED to satisfy the judgment described above, with interest and your
authorized fees and costs, by levying upon and selling all non-exempt personal or real
property of the Judgment Debtor ${dName}, or by serving bank levy notices upon financial
institutions holding debtor accounts, or earnings withholding orders upon employers.

DATED: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

_______________________________________
CLERK OF THE COURT
By: ____________________, Deputy Clerk
`;
  }

  /**
   * Generates formal Third-Party Bank Levy Notice
   */
  public static generateBankLevyNotice(caseFile: CaseFile, plan: EnforcementPlan, bankName: string, bankAddress: string): string {
    const p = caseFile.parties.find(x => x.role === 'plaintiff');
    const d = caseFile.parties.find(x => x.role === 'defendant');
    const pName = p ? cleanPartyName(p.name) : 'Plaintiff';
    const dName = d ? cleanPartyName(d.name) : 'Defendant';

    const interestInfo = this.calculateInterest(
      plan.awardedPrincipal,
      plan.statutoryInterestRate,
      plan.judgmentDate,
      plan.paymentsReceived,
      false
    );
    const grandTotal = plan.awardedPrincipal + plan.courtCosts + plan.postJudgmentCosts + interestInfo.accruedInterest - plan.paymentsReceived;

    return `================================================================================
NOTICE OF THIRD-PARTY BANK LEVY & GARNISHMENT OF FINANCIAL ASSETS
================================================================================

TO FINANCIAL INSTITUTION:
${bankName}
LEGAL PROCESS & LEVIES DEPARTMENT
${bankAddress}

REGARDING JUDGMENT DEBTOR:
NAME: ${dName}
KNOWN ADDRESS: ${d?.address || 'See Court Case File'}
COURT MATTER: ${deriveCaseTitle(pName, dName)}
CASE NO: ${caseFile.caseNumber || 'CIVIL ACTION'}
ISSUING COURT: ${caseFile.courtName}

YOU ARE HEREBY NOTIFIED THAT pursuant to the issued Writ of Execution, any and all
demand deposit accounts, checking accounts, savings accounts, certificates of deposit,
and safe deposit boxes titled in the name of the Judgment Debtor ${dName} are hereby
ATTACHED AND LEVIED UPON up to the total enforceable sum of:

        >>> TOTAL AMOUNT DUE: $${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <<<

MANDATORY INSTRUCTIONS TO FINANCIAL INSTITUTION:
1. IMMEDIATELY HOLD AND FREEZE all funds on deposit belonging to the Debtor up to the
   stated amount upon receipt of this Notice.
2. DO NOT PERMIT withdrawals, transfers, or debits that diminish the levied balance.
3. REMIT the held funds, less any statutory bank processing fee permitted by state law,
   to the Levying Officer (Sheriff / Marshal) within the statutory response window.
4. COMPLETE AND RETURN the garnishee memorandum certifying the exact balance frozen.

DATE SERVED: ________________________
LEVYING OFFICER BADGE / ID: _________
`;
  }

  /**
   * Generates formal Abstract of Judgment for Real Property Lien
   */
  public static generateAbstractOfJudgment(caseFile: CaseFile, plan: EnforcementPlan): string {
    const p = caseFile.parties.find(x => x.role === 'plaintiff');
    const d = caseFile.parties.find(x => x.role === 'defendant');
    const pName = p ? cleanPartyName(p.name) : 'Plaintiff';
    const dName = d ? cleanPartyName(d.name) : 'Defendant';

    return `================================================================================
RECORDING REQUESTED BY AND WHEN RECORDED RETURN TO:
${pName}
${p?.address || ''}
${p?.city || ''}, ${p?.state || ''} ${p?.zip || ''}

                     ABSTRACT OF JUDGMENT - CIVIL
              PURSUANT TO CAL. CODE CIV. PROC. § 674 / STATE CODE
================================================================================

1. JUDGMENT CREDITOR: ${pName}
2. JUDGMENT DEBTOR:
   Name: ${dName}
   Last Known Address: ${d?.address || 'N/A'}, ${d?.city || ''}, ${d?.state || ''}
   Entity Type: ${d?.entityType || 'Individual/Entity'}

3. JUDGMENT ENTERED ON: ${plan.judgmentDate}
   Court: ${caseFile.courtName}
   Case Number: ${caseFile.caseNumber}

4. MONETARY AWARD RECORD:
   Original Judgment Amount:     $${plan.awardedPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
   Costs Awarded at Judgment:    $${plan.courtCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
   Statutory Interest Rate:      ${plan.statutoryInterestRate}% per annum

NOTICE TO COUNTY RECORDER:
Upon recordation of this Abstract in the Official Records of ${caseFile.county} County,
a statutory Judgment Lien attaches to all real property currently owned or subsequently
acquired by the Judgment Debtor within this County. Any sale, transfer, or refinancing of
such property is subject to satisfaction of this lien.

I CERTIFY that the foregoing is a correct abstract of the judgment entered in this action.

CLERK OF THE COURT, by ________________________________, Deputy Clerk
`;
  }

  /**
   * Generates formal Memorandum of Costs After Judgment, Acknowledgment of Credit,
   * and Declaration of Accrued Interest (Cal. CCP § 685.070 / MC-012 equivalent)
   */
  public static generateMemorandumOfCostsAfterJudgment(caseFile: CaseFile, plan: EnforcementPlan): string {
    const p = caseFile.parties.find(x => x.role === 'plaintiff');
    const d = caseFile.parties.find(x => x.role === 'defendant');
    const pName = p ? cleanPartyName(p.name) : 'Plaintiff';
    const dName = d ? cleanPartyName(d.name) : 'Defendant';

    const interestInfo = this.calculateInterest(
      plan.awardedPrincipal,
      plan.statutoryInterestRate,
      plan.judgmentDate,
      plan.paymentsReceived,
      false
    );

    const totalEnforceable = plan.awardedPrincipal + plan.courtCosts + plan.postJudgmentCosts + interestInfo.accruedInterest - plan.paymentsReceived;

    return `================================================================================
MEMORANDUM OF COSTS AFTER JUDGMENT, ACKNOWLEDGMENT OF CREDIT,
AND DECLARATION OF ACCRUED STATUTORY INTEREST
PURSUANT TO CAL. CODE CIV. PROC. § 685.070 / GENERAL CIVIL PRACTICE
================================================================================

COURT: ${caseFile.courtName.toUpperCase()}
COUNTY: ${caseFile.county.toUpperCase()}, STATE: ${caseFile.state}
CASE NUMBER: ${caseFile.caseNumber || 'CIVIL ACTION'}
CASE TITLE: ${deriveCaseTitle(pName, dName)}

1. JUDGMENT CREDITOR: ${pName}
   Address: ${p?.address || ''}, ${p?.city || ''}, ${p?.state || ''} ${p?.zip || ''}

2. JUDGMENT DEBTOR: ${dName}
   Address: ${d?.address || ''}, ${d?.city || ''}, ${d?.state || ''} ${d?.zip || ''}

3. JUDGMENT ENTERED ON: ${plan.judgmentDate}

4. MEMORANDUM OF POST-JUDGMENT COSTS CLAIMED UNDER STATUTE:
   a. Preparing, issuing, and filing Writ of Execution (Gov. Code § 70626):  $  40.00
   b. Levying Officer statutory service fee for executing writ:               $  45.00
   c. County Recorder statutory fee for recording Abstract of Judgment:       $  25.00
   d. Service of process fees on third-party garnishee / employer:           $  50.00
   e. Prior court-ordered post-judgment motion costs:                        $  ${Math.max(0, plan.postJudgmentCosts - 160).toFixed(2)}
   -----------------------------------------------------------------------------
   TOTAL ALLOWABLE POST-JUDGMENT COSTS CLAIMED:                              $  ${plan.postJudgmentCosts.toFixed(2)}

5. DECLARATION OF ACCRUED STATUTORY POST-JUDGMENT INTEREST:
   a. Principal Judgment Amount Remaining:                                   $  ${plan.awardedPrincipal.toFixed(2)}
   b. Statutory Annual Interest Rate:                                           ${plan.statutoryInterestRate}% per annum
   c. Interest Accrual Period: From ${plan.judgmentDate} to ${new Date().toISOString().split('T')[0]} (${interestInfo.daysElapsed} days)
   d. Daily Interest Accrual Rate: $${(interestInfo.dailyInterestRate * interestInfo.currentPrincipalBalance).toFixed(2)} / day
   -----------------------------------------------------------------------------
   TOTAL STATUTORY POST-JUDGMENT INTEREST ACCRUED:                           $  ${interestInfo.accruedInterest.toFixed(2)}

6. ACKNOWLEDGMENT OF CREDIT (PAYMENTS RECEIVED):
   Total partial payments credited against interest and costs:              -$  ${plan.paymentsReceived.toFixed(2)}

7. RECAPITULATION & NET BALANCE OWING:
   Original Judgment Principal Awarded:                                      $  ${plan.awardedPrincipal.toFixed(2)}
   Court Costs Awarded in Judgment:                                          $  ${plan.courtCosts.toFixed(2)}
   Allowable Post-Judgment Costs (Item 4):                                   $  ${plan.postJudgmentCosts.toFixed(2)}
   Accrued Statutory Interest (Item 5):                                      $  ${interestInfo.accruedInterest.toFixed(2)}
   Less Acknowledged Credits (Item 6):                                      -$  ${plan.paymentsReceived.toFixed(2)}
   =============================================================================
   NET COLLECTIBLE BALANCE NOW SOUGHT TO BE ENFORCED:                        $  ${totalEnforceable.toFixed(2)}

DECLARATION OF JUDGMENT CREDITOR:
I am the Judgment Creditor in the above-entitled action. I have personal knowledge of the
facts stated herein. The post-judgment costs claimed above were reasonably and necessarily
incurred in enforcing the judgment, and the calculation of interest and credits is correct.

I declare under penalty of perjury under the laws of the State of ${caseFile.state} that the foregoing
is true and correct.

EXECUTED ON: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

_____________________________________________
${pName}, Judgment Creditor in Pro Se
`;
  }
}

