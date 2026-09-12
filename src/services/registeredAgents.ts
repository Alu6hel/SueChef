export interface SosPortalInfo {
  stateCode: string;
  stateName: string;
  portalName: string;
  searchUrl: string;
  searchTips: string;
  statuteCitation: string;
  commonAgents: string[];
}

export const SOS_PORTALS: Record<string, SosPortalInfo> = {
  CA: {
    stateCode: 'CA',
    stateName: 'California',
    portalName: 'California BizFile Online (Secretary of State)',
    searchUrl: 'https://bizfileonline.sos.ca.gov/search/business',
    searchTips: 'Search by exact entity name. Look for the "Agent for Service of Process" tab on the official entity detail page. Serving an on-site property manager instead of this registered agent invalidates service under California CCP § 416.10.',
    statuteCitation: 'Cal. Code Civ. Proc. § 416.10 & Cal. Corp. Code § 17701.16',
    commonAgents: ['CT Corporation System (818 W 7th St, Los Angeles)', 'CSC - Lawyers Incorporating Service (2710 Gateway Oaks Dr, Sacramento)', 'Corporation Service Company', 'Cogency Global Inc.']
  },
  NY: {
    stateCode: 'NY',
    stateName: 'New York',
    portalName: 'NYS Department of State Corporation & Business Entity Database',
    searchUrl: 'https://apps.dos.ny.gov/publicInquiry/',
    searchTips: 'Check "Active" status. In New York, the Secretary of State itself is often the default agent for service under LLC Law § 303, but private registered agents like CT Corp or CSC are commonly designated.',
    statuteCitation: 'N.Y. C.P.L.R. § 311-a & N.Y. Ltd. Liab. Co. Law § 303',
    commonAgents: ['CT Corporation System (28 Liberty St, New York, NY)', 'Corporation Service Company (80 State St, Albany, NY)', 'United Agent Group Inc.']
  },
  TX: {
    stateCode: 'TX',
    stateName: 'Texas',
    portalName: 'Texas Secretary of State (SOSDirect / Taxable Entity Search)',
    searchUrl: 'https://mycpa.cpa.state.tx.us/coa/',
    searchTips: 'Use the Texas Comptroller Franchise Tax Account Status search for free, instant Registered Agent and Registered Office address verification.',
    statuteCitation: 'Tex. Bus. Orgs. Code § 5.251 & Tex. R. Civ. P. 106',
    commonAgents: ['CT Corporation System (1999 Bryan St, Dallas, TX)', 'Corporation Service Company (211 E 7th St, Austin, TX)', 'National Registered Agents, Inc.']
  },
  FL: {
    stateCode: 'FL',
    stateName: 'Florida',
    portalName: 'Florida Division of Corporations (Sunbiz.org)',
    searchUrl: 'https://search.sunbiz.org/Inquiry/CorporationSearch/ByName',
    searchTips: 'Sunbiz provides instant access to official Annual Reports. View the most recent Annual Report PDF to find the currently active Registered Agent and their signature.',
    statuteCitation: 'Fla. Stat. § 48.062 & Fla. Stat. § 605.0113',
    commonAgents: ['CT Corporation System (1200 S Pine Island Rd, Plantation, FL)', 'Corporation Service Company (1201 Hays St, Tallahassee, FL)', 'InCorp Services, Inc.']
  },
  IL: {
    stateCode: 'IL',
    stateName: 'Illinois',
    portalName: 'Illinois Secretary of State (CyberDriveIllinois Entity Search)',
    searchUrl: 'https://apps.ilsos.gov/corporatesearch/',
    searchTips: 'Search for Corporation/LLC. Verify the Registered Agent name and Registered Office address in Illinois. Service at any other location without a court order is void under 735 ILCS 5/2-204.',
    statuteCitation: '735 ILCS 5/2-204 & 805 ILCS 180/1-50',
    commonAgents: ['CT Corporation System (208 S LaSalle St, Chicago, IL)', 'Illinois Corporation Service C (801 Adlai Stevenson Dr, Springfield, IL)']
  },
  WA: {
    stateCode: 'WA',
    stateName: 'Washington',
    portalName: 'Washington Secretary of State (CCFS Business Search)',
    searchUrl: 'https://ccfs.sos.wa.gov/#/BusinessSearch',
    searchTips: 'Search Washington Corporations and Charities System (CCFS). Check the "Registered Agent" field on the entity summary.',
    statuteCitation: 'Wash. Rev. Code § 23.95.450 & RCW 4.28.080',
    commonAgents: ['CT Corporation System (711 Capitol Way S, Olympia, WA)', 'Corporation Service Company (300 Deschutes Way SW, Tumwater, WA)']
  },
  GA: {
    stateCode: 'GA',
    stateName: 'Georgia',
    portalName: 'Georgia Secretary of State Corporations Division',
    searchUrl: 'https://ecorp.sos.ga.gov/BusinessSearch',
    searchTips: 'Verify Active/Compliance status and look up the designated registered agent. Service on an LLC must comply with O.C.G.A. § 9-11-4(e)(1).',
    statuteCitation: 'O.C.G.A. § 9-11-4(e)(1) & O.C.G.A. § 14-11-209',
    commonAgents: ['CT Corporation System (289 S Culver St, Lawrenceville, GA)', 'Corporation Service Company (40 Technology Pkwy S, Norcross, GA)']
  },
  PA: {
    stateCode: 'PA',
    stateName: 'Pennsylvania',
    portalName: 'PA Department of State Business Entity Search',
    searchUrl: 'https://www.corporations.pa.gov/search/corpsearch',
    searchTips: 'Pennsylvania requires service on an authorized registered office address under Pa. R.C.P. No. 424.',
    statuteCitation: 'Pa. R.C.P. No. 424 & 15 Pa.C.S. § 109',
    commonAgents: ['CT Corporation System (600 N 2nd St, Harrisburg, PA)', 'Corporation Service Company (2595 Interstate Dr, Harrisburg, PA)']
  },
  OH: {
    stateCode: 'OH',
    stateName: 'Ohio',
    portalName: 'Ohio Secretary of State Business Search',
    searchUrl: 'https://businesssearch.ohiosos.gov/',
    searchTips: 'Check the Statutory Agent Name and Address. Ohio Civ. R. 4.2 requires service directed to the statutory agent.',
    statuteCitation: 'Ohio Civ. R. 4.2 & Ohio Rev. Code § 1706.09',
    commonAgents: ['CT Corporation System (4400 Easton Commons, Columbus, OH)', 'Corporation Service Company (50 W Broad St, Columbus, OH)']
  },
  NC: {
    stateCode: 'NC',
    stateName: 'North Carolina',
    portalName: 'North Carolina Secretary of State Business Search',
    searchUrl: 'https://www.sosnc.gov/search/index/corp',
    searchTips: 'Search by legal corporate name. Review the Registered Agent name and Registered Office physical street address.',
    statuteCitation: 'N.C. Gen. Stat. § 1A-1, Rule 4(j)(6) & N.C.G.S. § 57D-2-40',
    commonAgents: ['CT Corporation System (160 Mine Lake Ct, Raleigh, NC)', 'Corporation Service Company (2626 Glenwood Ave, Raleigh, NC)']
  },
  AZ: {
    stateCode: 'AZ',
    stateName: 'Arizona',
    portalName: 'Arizona Corporation Commission (eCorp Search)',
    searchUrl: 'https://ecorp.azcc.gov/EntitySearch/Index',
    searchTips: 'Arizona uses the Corporation Commission (AZCC). Search eCorp for Statutory Agent Name and Physical Address.',
    statuteCitation: 'Ariz. R. Civ. P. 4.1(i) & A.R.S. § 29-3115',
    commonAgents: ['CT Corporation System (3800 N Central Ave, Phoenix, AZ)', 'Corporation Service Company (8825 N 23rd Ave, Phoenix, AZ)']
  },
  CO: {
    stateCode: 'CO',
    stateName: 'Colorado',
    portalName: 'Colorado Secretary of State Business Database',
    searchUrl: 'https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do',
    searchTips: 'Colorado requires all entities to maintain a Registered Agent with a street address in Colorado (C.R.S. § 7-90-701).',
    statuteCitation: 'Colo. Rev. Stat. § 7-90-701 & C.R.C.P. 4(e)(4)',
    commonAgents: ['CT Corporation System (7700 E Arapahoe Rd, Centennial, CO)', 'Corporation Service Company (1900 W Littleton Blvd, Littleton, CO)']
  },
  MI: {
    stateCode: 'MI',
    stateName: 'Michigan',
    portalName: 'Michigan LARA Corporation Division Business Search',
    searchUrl: 'https://cofs.lara.state.mi.us/SearchApi/Search/Search',
    searchTips: 'LARA (Licensing and Regulatory Affairs) records the Resident Agent and Registered Office address for all Michigan corporations and LLCs.',
    statuteCitation: 'Mich. Comp. Laws § 600.1920 & MCL 450.4207',
    commonAgents: ['The Corporation Company (40600 Ann Arbor Rd E, Plymouth, MI)', 'CSC-Lawyers Incorporating Service (3410 Belle Chase Way, Lansing, MI)']
  },
  NJ: {
    stateCode: 'NJ',
    stateName: 'New Jersey',
    portalName: 'New Jersey Business Records Service',
    searchUrl: 'https://www.njportal.com/DOR/BusinessNameSearch/',
    searchTips: 'Search for the Registered Agent and Registered Office address under N.J. Court Rule 4:4-4(a)(6).',
    statuteCitation: 'N.J. Court Rule 4:4-4(a)(6) & N.J. Stat. § 42:2C-14',
    commonAgents: ['The Corporation Trust Company (820 Bear Tavern Rd, West Trenton, NJ)', 'Corporation Service Company (Princeton, NJ)']
  },
  VA: {
    stateCode: 'VA',
    stateName: 'Virginia',
    portalName: 'Virginia State Corporation Commission (Clerk\'s Information System - CIS)',
    searchUrl: 'https://cis.scc.virginia.gov/',
    searchTips: 'Search the SCC CIS database. Virginia law requires service on the registered agent or officer under Va. Code § 8.01-299.',
    statuteCitation: 'Va. Code Ann. § 8.01-299 & Va. Code § 13.1-1015',
    commonAgents: ['CT Corporation System (4701 Cox Rd, Glen Allen, VA)', 'Corporation Service Company (100 Shockoe Slip, Richmond, VA)']
  },
  MA: {
    stateCode: 'MA',
    stateName: 'Massachusetts',
    portalName: 'Massachusetts Corporations Division Business Search',
    searchUrl: 'https://corp.sec.state.ma.us/corpweb/CorpSearch/CorpSearch.aspx',
    searchTips: 'Look up the Resident Agent name and street address under Mass. R. Civ. P. 4(d)(2).',
    statuteCitation: 'Mass. R. Civ. P. 4(d)(2) & Mass. Gen. Laws ch. 156C § 5',
    commonAgents: ['CT Corporation System (155 Federal St, Boston, MA)', 'Corporation Service Company (84 State St, Boston, MA)']
  }
};

export class RegisteredAgentService {
  public static isCorporateEntity(entityName: string): boolean {
    if (!entityName) return false;
    const clean = entityName.toUpperCase();
    return (
      clean.includes('LLC') ||
      clean.includes('L.L.C.') ||
      clean.includes('INC') ||
      clean.includes('INCORPORATED') ||
      clean.includes('CORP') ||
      clean.includes('CORPORATION') ||
      clean.includes('CO.') ||
      clean.includes('COMPANY') ||
      clean.includes('HOLDINGS') ||
      clean.includes('PROPERTIES') ||
      clean.includes('MANAGEMENT') ||
      clean.includes('LIMITED') ||
      clean.includes('LTD') ||
      clean.includes('PARTNERS') ||
      clean.includes('LP') ||
      clean.includes('L.P.')
    );
  }

  public static getPortalForState(stateCode: string): SosPortalInfo {
    const code = (stateCode || 'CA').toUpperCase();
    if (SOS_PORTALS[code]) {
      return SOS_PORTALS[code];
    }
    return {
      stateCode: code,
      stateName: code,
      portalName: `${code} Secretary of State Business Registry`,
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`${code} Secretary of State business entity search registered agent`)}`,
      searchTips: `Search the official ${code} Secretary of State or Department of Corporations database for the exact Registered Agent for Service of Process and Registered Office address.`,
      statuteCitation: `Uniform Business Organizations Code / ${code} Rules of Civil Procedure (Service on Entities)`,
      commonAgents: [
        'CT Corporation System',
        'Corporation Service Company (CSC)',
        'Registered Agent Solutions, Inc. (RASI)',
        'National Registered Agents, Inc. (NRAI)',
        'InCorp Services, Inc.'
      ]
    };
  }

  public static getCorporateServiceWarning(defendantName: string, registeredAgent?: string): string | null {
    if (!this.isCorporateEntity(defendantName)) {
      return null;
    }
    if (!registeredAgent || registeredAgent.trim().length === 0 || registeredAgent.toLowerCase().includes('[sample') || registeredAgent.toLowerCase().includes('notices@')) {
      return `CRITICAL SERVICE WARNING: "${defendantName}" appears to be a corporate entity (LLC/Corp). In civil and small claims court, serving an on-site property manager, desk clerk, or leasing office instead of the official Registered Agent on file with the Secretary of State gives the corporate defendant grounds to vacate default judgments or dismiss the case for improper service.`;
    }
    return null;
  }
}
