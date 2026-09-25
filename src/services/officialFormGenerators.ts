import { CaseFile } from '../types';

export interface SosDirectoryEntry {
  stateCode: string;
  stateName: string;
  agencyName: string;
  searchUrl: string;
  feeForSearch: string;
}

export const STATE_SOS_DIRECTORIES: SosDirectoryEntry[] = [
  { stateCode: 'AL', stateName: 'Alabama', agencyName: 'Secretary of State Business Entity Search', searchUrl: 'https://arc-sos.state.al.us/CGI/CORPNAME.MBR/INPUT', feeForSearch: 'Free' },
  { stateCode: 'AK', stateName: 'Alaska', agencyName: 'Div. of Corporations, Business and Professional Licensing', searchUrl: 'https://www.commerce.alaska.gov/cbp/main/search/entities', feeForSearch: 'Free' },
  { stateCode: 'AZ', stateName: 'Arizona', agencyName: 'Arizona Corporation Commission (eCorp)', searchUrl: 'https://ecorp.azcc.gov/EntitySearch/Index', feeForSearch: 'Free' },
  { stateCode: 'AR', stateName: 'Arkansas', agencyName: 'Secretary of State Corporation Search', searchUrl: 'https://www.sos.arkansas.gov/corps/search_all.php', feeForSearch: 'Free' },
  { stateCode: 'CA', stateName: 'California', agencyName: 'California Secretary of State (bizfileOnline)', searchUrl: 'https://bizfileonline.sos.ca.gov/search/business', feeForSearch: 'Free' },
  { stateCode: 'CO', stateName: 'Colorado', agencyName: 'Secretary of State Business Database', searchUrl: 'https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do', feeForSearch: 'Free' },
  { stateCode: 'CT', stateName: 'Connecticut', agencyName: 'business.ct.gov Business Search', searchUrl: 'https://service.ct.gov/business/s/onlinebusinesssearch', feeForSearch: 'Free' },
  { stateCode: 'DE', stateName: 'Delaware', agencyName: 'Division of Corporations Entity Search', searchUrl: 'https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx', feeForSearch: 'Free' },
  { stateCode: 'FL', stateName: 'Florida', agencyName: 'Division of Corporations (Sunbiz.org)', searchUrl: 'https://search.sunbiz.org/Inquiry/CorporationSearch/ByName', feeForSearch: 'Free' },
  { stateCode: 'GA', stateName: 'Georgia', agencyName: 'Corporations Division (eCorp)', searchUrl: 'https://ecorp.sos.ga.gov/BusinessSearch', feeForSearch: 'Free' },
  { stateCode: 'HI', stateName: 'Hawaii', agencyName: 'Business Registration Division (BREG)', searchUrl: 'https://hbe.ehawaii.gov/documents/search.html', feeForSearch: 'Free' },
  { stateCode: 'ID', stateName: 'Idaho', agencyName: 'Secretary of State Business Entity Search', searchUrl: 'https://sosbiz.idaho.gov/search/business', feeForSearch: 'Free' },
  { stateCode: 'IL', stateName: 'Illinois', agencyName: 'Secretary of State Corporate/LLC Search', searchUrl: 'https://apps.ilsos.gov/corporatellc/', feeForSearch: 'Free' },
  { stateCode: 'IN', stateName: 'Indiana', agencyName: 'INBiz Business Search', searchUrl: 'https://bsd.sos.in.gov/publicbusinesssearch', feeForSearch: 'Free' },
  { stateCode: 'IA', stateName: 'Iowa', agencyName: 'Secretary of State Business Entities', searchUrl: 'https://sos.iowa.gov/search/business/search.aspx', feeForSearch: 'Free' },
  { stateCode: 'KS', stateName: 'Kansas', agencyName: 'Business Entity Search Station (BESS)', searchUrl: 'https://www.kansas.gov/bess/flow/setup/welcome', feeForSearch: 'Free' },
  { stateCode: 'KY', stateName: 'Kentucky', agencyName: 'Secretary of State Organization Search', searchUrl: 'https://web.sos.ky.gov/ftsearch/', feeForSearch: 'Free' },
  { stateCode: 'LA', stateName: 'Louisiana', agencyName: 'geauxBIZ Commercial Database', searchUrl: 'https://coraweb.sos.la.gov/commercialsearch/commercialsearch.aspx', feeForSearch: 'Free' },
  { stateCode: 'ME', stateName: 'Maine', agencyName: 'Corporate Name Search', searchUrl: 'https://icrs.informe.org/nei-sos-icrs/ICRS?MainPage=x', feeForSearch: 'Free' },
  { stateCode: 'MD', stateName: 'Maryland', agencyName: 'Business Express Entity Search', searchUrl: 'https://egov.maryland.gov/BusinessExpress/EntitySearch', feeForSearch: 'Free' },
  { stateCode: 'MA', stateName: 'Massachusetts', agencyName: 'Corporations Division Database', searchUrl: 'https://corp.sec.state.ma.us/corpweb/corpsearch/CorpSearch.aspx', feeForSearch: 'Free' },
  { stateCode: 'MI', stateName: 'Michigan', agencyName: 'LARA Business Entity Search', searchUrl: 'https://cofs.lara.state.mi.us/Search/Search', feeForSearch: 'Free' },
  { stateCode: 'MN', stateName: 'Minnesota', agencyName: 'Business Filing Search', searchUrl: 'https://mblsportal.sos.state.mn.us/Business/Search', feeForSearch: 'Free' },
  { stateCode: 'MS', stateName: 'Mississippi', agencyName: 'Business Services Search', searchUrl: 'https://charities.sos.ms.gov/online/portal/ch/page/charities-search/Portal.aspx', feeForSearch: 'Free' },
  { stateCode: 'MO', stateName: 'Missouri', agencyName: 'Business Entity Search', searchUrl: 'https://bsd.sos.mo.gov/BusinessEntity/BESearch.aspx?SearchType=0', feeForSearch: 'Free' },
  { stateCode: 'MT', stateName: 'Montana', agencyName: 'Business Search Portal', searchUrl: 'https://biz.sosmt.gov/search/business', feeForSearch: 'Free' },
  { stateCode: 'NE', stateName: 'Nebraska', agencyName: 'Corporate & Business Search', searchUrl: 'https://www.nebraska.gov/sos/corp/corpsearch.cgi', feeForSearch: 'Free' },
  { stateCode: 'NV', stateName: 'Nevada', agencyName: 'SilverFlume Business Search', searchUrl: 'https://www.nvsilverflume.gov/businessSearch', feeForSearch: 'Free' },
  { stateCode: 'NH', stateName: 'New Hampshire', agencyName: 'NH QuickStart Business Search', searchUrl: 'https://quickstart.sos.nh.gov/online/Account/LandingPage', feeForSearch: 'Free' },
  { stateCode: 'NJ', stateName: 'New Jersey', agencyName: 'Division of Revenue Business Records Search', searchUrl: 'https://www.njportal.com/DOR/BusinessNameSearch/', feeForSearch: 'Free' },
  { stateCode: 'NM', stateName: 'New Mexico', agencyName: 'Business Search Portal', searchUrl: 'https://enterprise.sos.nm.gov/search/business', feeForSearch: 'Free' },
  { stateCode: 'NY', stateName: 'New York', agencyName: 'Department of State Division of Corporations', searchUrl: 'https://apps.dos.ny.gov/publicInquiry/', feeForSearch: 'Free' },
  { stateCode: 'NC', stateName: 'North Carolina', agencyName: 'Secretary of State Business Registration', searchUrl: 'https://www.sosnc.gov/search/index/corp', feeForSearch: 'Free' },
  { stateCode: 'ND', stateName: 'North Dakota', agencyName: 'FirstStop Business Search', searchUrl: 'https://firststop.sos.nd.gov/search/business', feeForSearch: 'Free' },
  { stateCode: 'OH', stateName: 'Ohio', agencyName: 'Secretary of State Business Search', searchUrl: 'https://businesssearch.ohiosos.gov/', feeForSearch: 'Free' },
  { stateCode: 'OK', stateName: 'Oklahoma', agencyName: 'Secretary of State Entity Search', searchUrl: 'https://www.sos.ok.gov/corp/corpInquiryFind.aspx', feeForSearch: 'Free' },
  { stateCode: 'OR', stateName: 'Oregon', agencyName: 'Business Registry Database', searchUrl: 'https://sos.oregon.gov/business/Pages/find.aspx', feeForSearch: 'Free' },
  { stateCode: 'PA', stateName: 'Pennsylvania', agencyName: 'Department of State Business Entity Search', searchUrl: 'https://file.dos.pa.gov/search/business', feeForSearch: 'Free' },
  { stateCode: 'RI', stateName: 'Rhode Island', agencyName: 'Corporate Database Search', searchUrl: 'https://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx', feeForSearch: 'Free' },
  { stateCode: 'SC', stateName: 'South Carolina', agencyName: 'Business Entities Search', searchUrl: 'https://businessfilings.sc.gov/businessfiling/search/entitysearch', feeForSearch: 'Free' },
  { stateCode: 'SD', stateName: 'South Dakota', agencyName: 'Business Database Search', searchUrl: 'https://sdsos.gov/business-services/default.aspx', feeForSearch: 'Free' },
  { stateCode: 'TN', stateName: 'Tennessee', agencyName: 'Business Information Search', searchUrl: 'https://tnbear.tn.gov/Ecommerce/FilingSearch.aspx', feeForSearch: 'Free' },
  { stateCode: 'TX', stateName: 'Texas', agencyName: 'Secretary of State SOSDirect / Taxable Entity Search', searchUrl: 'https://mycpa.cpa.state.tx.us/coa/', feeForSearch: 'Free' },
  { stateCode: 'UT', stateName: 'Utah', agencyName: 'Division of Corporations Business Search', searchUrl: 'https://secure.utah.gov/bes/', feeForSearch: 'Free' },
  { stateCode: 'VT', stateName: 'Vermont', agencyName: 'Corporations Division Database', searchUrl: 'https://bizfilings.vermont.gov/online/BusinessInquire/', feeForSearch: 'Free' },
  { stateCode: 'VA', stateName: 'Virginia', agencyName: 'State Corporation Commission (Clerk\'s Information System)', searchUrl: 'https://cis.scc.virginia.gov/', feeForSearch: 'Free' },
  { stateCode: 'WA', stateName: 'Washington', agencyName: 'Corporations and Charities Filing System (CCFS)', searchUrl: 'https://ccfs.sos.wa.gov/#/', feeForSearch: 'Free' },
  { stateCode: 'WV', stateName: 'West Virginia', agencyName: 'Secretary of State Business Organization Search', searchUrl: 'https://apps.wv.gov/SOS/BusinessEntitySearch/', feeForSearch: 'Free' },
  { stateCode: 'WI', stateName: 'Wisconsin', agencyName: 'DFI Corporate Records Database', searchUrl: 'https://www.wdfi.org/apps/CorpSearch/Search.aspx', feeForSearch: 'Free' },
  { stateCode: 'WY', stateName: 'Wyoming', agencyName: 'Secretary of State Business Center', searchUrl: 'https://wyobiz.wyo.gov/Business/FilingSearch.aspx', feeForSearch: 'Free' }
];

export class OfficialFormGenerators {
  /**
   * Generates California Judicial Council Form SC-100
   * "Plaintiff's Claim and ORDER to Go to Small Claims Court"
   */
  public static generateCaliforniaSC100(caseFile: CaseFile, totalDamages: number): string {
    const pl = caseFile.parties.find(p => p.role === 'plaintiff') || caseFile.parties[0];
    const df = caseFile.parties.find(p => p.role === 'defendant') || caseFile.parties[1];

    return `JUDICIAL COUNCIL OF CALIFORNIA • OFFICIAL FORM SC-100
[Rev. January 1, 2024]
PLAINTIFF'S CLAIM AND ORDER TO GO TO SMALL CLAIMS COURT
================================================================================
SUPERIOR COURT OF CALIFORNIA, COUNTY OF: ${caseFile.county || caseFile.state || 'LOS ANGELES'}
STREET ADDRESS: 111 North Hill Street
MAILING ADDRESS: 111 North Hill Street
BRANCH NAME: SMALL CLAIMS DIVISION
CASE NUMBER: ${caseFile.caseNumber || 'SC-2026-PENDING'}
--------------------------------------------------------------------------------

1. FILED BY PLAINTIFF (Name, Street Address, Phone, Email):
   Name: ${pl?.name || 'Plaintiff'}
   Address: ${pl?.address || '123 Main St'}, ${pl?.city || 'Los Angeles'}, ${pl?.state || 'CA'} ${pl?.zip || '90012'}
   Phone: ${pl?.phone || '(555) 019-2831'}
   Email: ${pl?.email || 'plaintiff@example.com'}
   [X] No fictitious business name statement required (individual capacity).

2. FILED AGAINST DEFENDANT (Name, Street Address, Phone):
   Name: ${df?.name || 'Defendant Entity LLC'}
   Address: ${df?.address || '456 Commercial Blvd'}, ${df?.city || 'Los Angeles'}, ${df?.state || 'CA'} ${df?.zip || '90015'}
   Phone: ${df?.phone || '(555) 987-6543'}
   Agent for Service of Process (if corporation/LLC): 
   Registered Agent / Officer: ${caseFile.serviceRecords[0]?.attempts[0]?.recipientName || 'Authorized Officer / CSC'}

3. PLAINTIFF'S CLAIM:
   a. Why does the Defendant owe you money?
      ${caseFile.title || 'Defendant committed a breach of contract and statutory violation by withholding funds rightfully owed.'}
   b. When did this happen? (Date): ${caseFile.pleadings.demandLetter.demandDate || '2026-06-01'}
   c. How much does Defendant owe you?
      TOTAL CLAIM: $${totalDamages.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      (Itemized: Principal damages $${(totalDamages * 0.75).toFixed(2)}, statutory interest and bad-faith withholding penalties under California Civil Code).

4. DEMAND PRIOR TO SUIT:
   [X] YES, Plaintiff asked Defendant in writing to pay this money before filing the claim.
       Date of formal demand: ${caseFile.pleadings.demandLetter.demandDate || '2026-06-01'} via Certified Mail.
       Did Defendant pay? [X] NO.

5. VENUE (Why is this the proper court location? Check all that apply):
   [X] At least one defendant lives or does business in this judicial district.
   [X] The contract or obligation was entered into, breached, or to be performed in this district.
   [X] The damage or injury occurred in this judicial district.

6. CLAIM LIMIT CERTIFICATIONS (Code of Civil Procedure §§ 116.221, 116.231):
   a. Have you filed more than 12 other small claims in California in the past 12 months? [X] NO.
   b. I understand that as a natural person, the statutory jurisdictional limit is $12,500.
   c. Plaintiff has not filed more than two claims for more than $2,500 anywhere in California this calendar year.

7. DECLARATION UNDER PENALTY OF PERJURY:
   I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.

   Date: ${new Date().toLocaleDateString('en-US')}
   Signature of Plaintiff: ____________________________________ (${pl?.name || 'Plaintiff'})

================================================================================
ORDER TO GO TO COURT (To be completed by Court Clerk)
To the Defendant: You are being sued by Plaintiff. You must attend court on:
HEARING DATE: ${caseFile.hearingDate || 'TBD (30-45 Days after filing)'} • TIME: 8:30 AM • DEPT: Small Claims
--------------------------------------------------------------------------------`;
  }

  /**
   * Generates UK HMCTS Claim Form N1 (CPR Part 7)
   */
  public static generateUKFormN1(caseFile: CaseFile, totalDamages: number): string {
    const pl = caseFile.parties.find(p => p.role === 'plaintiff') || caseFile.parties[0];
    const df = caseFile.parties.find(p => p.role === 'defendant') || caseFile.parties[1];

    return `HM COURTS & TRIBUNALS SERVICE • CLAIM FORM (CPR PART 7)
FORM N1 (County Court at ${caseFile.county || 'Central London'})
================================================================================
Claimant Name and Address:
${pl?.name || 'Claimant'}
${pl?.address || '10 High Street'}, ${pl?.city || 'London'}, ${pl?.zip || 'EC1A 1BB'}

Defendant Name and Address:
${df?.name || 'Defendant Ltd'}
${df?.address || '40 Commercial Way'}, ${df?.city || 'London'}, ${df?.zip || 'E14 9GE'}
--------------------------------------------------------------------------------
BRIEF DETAILS OF CLAIM:
The Claimant's claim is for payment of monies justly due and owing from Defendant 
pursuant to a binding consumer agreement and statutory provisions of the 
Consumer Rights Act 2015. 

Defendant failed to perform agreed obligations, failed to refund monies, 
and has retained the sum of £${totalDamages.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} despite formal 
Letter of Claim sent pursuant to the Pre-Action Protocol for Debt Claims.

The Claimant also claims interest under Section 69 of the County Courts Act 1984 
at the statutory rate of 8% per annum from the date of default until judgment.

--------------------------------------------------------------------------------
VALUE:
The Claimant expects to recover:
Amount claimed: £${totalDamages.toFixed(2)}
Court fee: £115.00
Legal representative's costs: £0.00 (Litigant in Person)
TOTAL AMOUNT: £${(totalDamages + 115).toFixed(2)}
--------------------------------------------------------------------------------
STATEMENT OF TRUTH:
I believe that the facts stated in this claim form are true. I understand that 
proceedings for contempt of court may be brought against anyone who makes, or 
causes to be made, a false statement in a document verified by a statement of truth 
without an honest belief in its truth.

Full Name: ${pl?.name || 'Claimant'} (Claimant in Person)
Date: ${new Date().toLocaleDateString('en-GB')}
Signed: ____________________________________
================================================================================`;
  }

  /**
   * Generates NYC Small Claims Form CIV-GP-58 (Statement of Claim)
   */
  public static generateNYCFormCIVGP58(caseFile: CaseFile, totalDamages: number): string {
    const pl = caseFile.parties.find(p => p.role === 'plaintiff') || caseFile.parties[0];
    const df = caseFile.parties.find(p => p.role === 'defendant') || caseFile.parties[1];

    return `CIVIL COURT OF THE CITY OF NEW YORK
COUNTY OF: ${caseFile.county || 'NEW YORK'} • SMALL CLAIMS PART
OFFICIAL FORM CIV-GP-58: STATEMENT OF CLAIM
================================================================================
INDEX NO: SC-${new Date().getFullYear()}-PENDING

CLAIMANT INFORMATION:
Name: ${pl?.name || 'Claimant'}
Address: ${pl?.address || '100 Broadway'}, Apt ${pl?.city || 'New York'}, NY ${pl?.zip || '10005'}
Telephone: ${pl?.phone || '(212) 555-0144'}

DEFENDANT INFORMATION:
Name: ${df?.name || 'Defendant LLC'}
Doing Business As (DBA): ${df?.name || 'Defendant Entity'}
Address: ${df?.address || '500 5th Avenue'}, ${df?.city || 'New York'}, NY ${df?.zip || '10110'}
Telephone: ${df?.phone || '(212) 555-9876'}

STATEMENT OF CLAIM:
Defendant on or about ${caseFile.pleadings.demandLetter.demandDate || '2026-06-01'} became indebted to 
Claimant in the amount of $${totalDamages.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} for:
[X] Failure to return security deposit (NYC Admin Code § 7-103)
[X] Breach of written contract / agreement
[X] Failure to provide services or goods paid for
[X] Improper fee assessment / statutory damages

WHEREFORE, Claimant demands judgment against Defendant in the sum of 
$${totalDamages.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, together with statutory interest from date of breach, 
and allowable disbursements of this action.

STATE OF NEW YORK, COUNTY OF ${caseFile.county || 'NEW YORK'} ss:
${pl?.name || 'Claimant'}, being duly sworn, deposes and says: I am the claimant 
herein; I have read the foregoing statement of claim and know the contents thereof; 
the same is true of my own knowledge.

Sworn to before me this _____ day of _______________, 2026.
_________________________________ (Clerk of the Small Claims Court / Notary)
================================================================================`;
  }

  /**
   * Generates Nigeria Small Claims Court Form 1 & Form 2 (Lagos / FCT Practice Directions)
   */
  public static generateNigeriaSmallClaimsForms(caseFile: CaseFile, totalDamages: number): string {
    const pl = caseFile.parties.find(p => p.role === 'plaintiff') || caseFile.parties[0];
    const df = caseFile.parties.find(p => p.role === 'defendant') || caseFile.parties[1];

    return `IN THE MAGISTRATE COURT OF LAGOS STATE
IN THE SMALL CLAIMS DIVISION • HOLDEN AT LAGOS/IKEJA
SUIT NO: SCC/${new Date().getFullYear()}/PENDING
================================================================================
PART A: FORM 1 — MANDATORY LETTER OF DEMAND (ORDER 2 RULE 1)
--------------------------------------------------------------------------------
TO: ${df?.name}
ADDRESS: ${df?.address}, ${df?.city}, Nigeria

TAKE NOTICE that you are hereby demanded to settle the liquidated money claim of:
SUM DUE: ₦${totalDamages.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Nigerian Naira)
BEING: Outstanding liquidated sums due from breach of contract and failure of performance.

TAKE FURTHER NOTICE that you have FOURTEEN (14) DAYS from the date of service of 
this demand to remit the full sum to Claimant. In default whereof, legal proceedings 
will be instituted against you in the Small Claims Court of Lagos State without further notice.

Dated this _____ day of _______________, 2026.
CLAIMANT: ${pl?.name} • TEL: ${pl?.phone || '+234 800 000 0000'}

================================================================================
PART B: FORM 2 — SMALL CLAIMS COMPLAINT FORM (ORDER 2 RULE 2)
--------------------------------------------------------------------------------
BETWEEN:
${pl?.name || 'CLAIMANT'} ................................................. CLAIMANT
AND
${df?.name || 'DEFENDANT'} ................................................ DEFENDANT

1. The Claimant's claim against the Defendant is for the sum of:
   ₦${totalDamages.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
2. The claim arises from: Transaction entered into on or about ${caseFile.pleadings.demandLetter.demandDate || '2026-06-01'} 
   wherein Defendant failed to perform agreed covenants.
3. The Defendant was served with Form 1 (Letter of Demand) on ${caseFile.pleadings.demandLetter.demandDate || '2026-06-01'} 
   and has neglected or refused to satisfy the claim within the 14-day statutory period.

CLAIMANT VERIFICATION:
I, ${pl?.name || 'Claimant'}, verify that the facts stated above are true to the best of my knowledge.

Signature: __________________________ Date: ___________________
================================================================================`;
  }

  /**
   * Generates USPS PO Boxholder Physical Address Disclosure Request
   * Pursuant to Federal Regulations: 39 CFR § 265.6(d)(5)(ii)
   */
  public static generateUSPSProcessServerRequest(caseFile: CaseFile, poBox: string, cityStateZip: string): string {
    const pl = caseFile.parties.find(p => p.role === 'plaintiff') || caseFile.parties[0];
    const df = caseFile.parties.find(p => p.role === 'defendant') || caseFile.parties[1];

    return `UNITED STATES POSTAL SERVICE (USPS)
REQUEST FOR CHANGE OF ADDRESS OR BOXHOLDER INFORMATION 
NEEDED FOR SERVICE OF LEGAL PROCESS
[Pursuant to 39 CFR § 265.6(d)(5)(ii) / USPS Domestic Mail Manual § 508.4]
================================================================================
DATE: ${new Date().toLocaleDateString('en-US')}

TO: POSTMASTER
UNITED STATES POSTAL SERVICE
LOCATION: ${cityStateZip || 'Post Office Station'}

FROM (REQUESTOR / PROCESS SERVER):
Name: ${pl?.name || 'Plaintiff in Pro Se'}
Address: ${pl?.address || '123 Legal Way'}, ${pl?.city || 'City'}, ${pl?.state || 'CA'} ${pl?.zip || '90001'}
Telephone: ${pl?.phone || '(555) 019-2831'}
Capacity: [X] Pro Se Litigant Serving Summons & Complaint (Self-Represented)
          [ ] Registered Process Server

SUBJECT: Request for Physical Street Address of Boxholder:
         BOX NUMBER: ${poBox || 'P.O. Box [Number]'}
         POST OFFICE: ${cityStateZip || '[City, State, ZIP]'}
         NAME OF BOXHOLDER / BUSINESS: ${df?.name || 'Defendant Entity LLC'}

--------------------------------------------------------------------------------
STATUTORY CERTIFICATION UNDER 39 CFR § 265.6(d)(5)(ii):
I hereby certify that all of the following statements are true and correct:

1. The boxholder address requested is needed solely for the purpose of serving 
   legal process in connection with an actual or pending civil proceeding.

2. The caption of the lawsuit and the docket / case number are:
   CAPTION: ${pl?.name || 'Plaintiff'} v. ${df?.name || 'Defendant'}
   DOCKET / CASE NO: ${caseFile.caseNumber || 'CIV-2026-PENDING'}
   COURT: ${caseFile.courtName || 'Small Claims Court'}

3. The boxholder is a party to the lawsuit (named Defendant).

4. Under 39 CFR § 265.6(d)(5)(ii), no fee is charged to individuals seeking 
   boxholder information for service of legal process.

5. I certify that this information will not be used for any other purpose and 
   will not be disclosed to any person except as necessary in the litigation.

WARNING: THE SUBMISSION OF FALSE INFORMATION TO OBTAIN POSTAL RECORDS MAY SUBJECT 
THE REQUESTOR TO CRIMINAL PENALTIES UNDER 18 U.S.C. § 1001.

Signature of Requestor: ____________________________________
Printed Name: ${pl?.name || 'Plaintiff'}
Date: ${new Date().toLocaleDateString('en-US')}
================================================================================
FOR POSTAL USE ONLY:
[ ] Approved: Physical Street Address of Boxholder is:
    ____________________________________________________________________________
    ____________________________________________________________________________
[ ] Denied / No Boxholder Record Found for this P.O. Box.
Postal Official Signature: _______________________ Date: _______________________`;
  }
}
