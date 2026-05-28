// Texas State Agency IT Intelligence Data
// Sources: 
//   - SB1 89th Legislature GAA 2026-27 (LBB, enacted June 2025)
//   - LBE by Strategy, House, Articles I-X (LBB, January 2025)
//   - HB500 Supplemental Appropriations (enacted June 22, 2025)
//   - LBB Fiscal Size-Up 2026-27 (December 2025)
//   - HB150 (Texas Cyber Command) Fiscal Note (LBB)
//   - DIR Agency Strategic Plan FY2025-2029
//   - Industry Insider Texas (FY25 actuals)
//
// BUDGET METHODOLOGY:
//   fy26_budget / fy27_budget = annual IT spending (all sources)
//   This includes:
//     (a) Capital budget rider "Acquisition of Information Resource Technologies"
//     (b) Information Resources operational strategy line
//     (c) IT-specific exceptional items and HB500 appropriations
//   Where only biennium totals are available, figures are divided by 2.
//   budget_source documents the specific GAA provision.
//   budget_confirmed = true means sourced directly from enacted legislation.
//   budget_confirmed = false means estimated from LAR, LBB recommendations, or methodology.
//
// Last updated: May 2026

export const TECH_AREAS = [
  { label:"Cybersecurity",       color:"#FDE8E8", textColor:"#8B1C1C", borderColor:"#F5BCBC" },
  { label:"Modernization",       color:"#E6F1FB", textColor:"#0C447C", borderColor:"#B5D4F4" },
  { label:"Call Center / CRM",   color:"#E1F5EE", textColor:"#085041", borderColor:"#9FE1CB" },
  { label:"AI / Automation",     color:"#EEEDFE", textColor:"#3C3489", borderColor:"#CECBF6" },
  { label:"Cloud",               color:"#EAF3DE", textColor:"#27500A", borderColor:"#C0DD97" },
  { label:"Data & Analytics",    color:"#FAEEDA", textColor:"#633806", borderColor:"#FAC775" },
  { label:"Legacy Replacement",  color:"#F1EFE8", textColor:"#444441", borderColor:"#D3D1C7" },
  { label:"ERP / Financial",     color:"#FBEAF0", textColor:"#72243E", borderColor:"#F4C0D1" },
  { label:"Digital / Portals",   color:"#FAECE7", textColor:"#712B13", borderColor:"#F5C4B3" },
  { label:"Infrastructure",      color:"#F8F0FE", textColor:"#4A1B7A", borderColor:"#DCC8F5" },
  { label:"Identity & Access",   color:"#FFF8E6", textColor:"#6B4A00", borderColor:"#FFD77A" },
  { label:"Case Management",     color:"#E8F7F5", textColor:"#0A4D45", borderColor:"#7DCFC7" },
];

export const CATEGORIES = [
  "Health & Human Services",
  "Transportation & Infrastructure",
  "Public Safety & Law",
  "Education",
  "Finance & Regulatory",
  "Technology & Operations",
  "Environment & Resources",
  "Judicial",
  "Legislative",
  "Executive",
  "Higher Education",
  "Veterans",
  "Operations",
];

export const AGENCIES = [

  // ── TECHNOLOGY & OPERATIONS ─────────────────────────────────────────────────

  {
    id:"dir", abbr:"DIR", num:"313",
    name:"Department of Information Resources",
    customer_name:"Texas Department of Information Resources",
    sts_abbr:null,
    category:"Technology & Operations",
    // DIR is fully cost-recovery funded — not a GR appropriation in the traditional sense.
    // The LBE shows DIR total All Funds ~$2.1B FY26 but this is almost entirely interagency
    // cost recovery from other agencies paying for STC, TEX-AN, and shared services.
    // The actual GR appropriation is ~$23M for policy/governance functions.
    // IT capital rider: Rider 2, Art. I — $23.4M FY26 + $22.9M FY27 for IT modernization.
    fy26_budget: 23.4, fy27_budget: 22.9, budget_confirmed: true,
    budget_source: "SB1 Art. I, DIR Rider 2 — Acquisition of Information Resource Technologies. Cost-recovery programs (STS, TEX-AN, Texas.gov) are self-funded via interagency contracts and not counted here.",
    initiatives:[
      "Statewide Technology Center (STC) operations — cloud, compute, storage shared services",
      "TEX-AN next-generation telecom procurement",
      "Texas Cyber Command (TXCC) transition — DIR assumes policy/governance role",
      "2026-2030 State Strategic Plan for Information Resources Management",
      "AI governance framework — TRAIGA implementation and Code of Ethics",
      "Cooperative contracts portfolio — $5B+ annual procurement volume",
      "DIR Website Modernization and Digital Accessibility mandate (HB 5195)",
    ],
    strategic_plan:"2026-2030 SSP: digital accessibility; secure IAM; AI governance; TXCC transition; broadband connectivity",
    tech_areas:["Cybersecurity","Cloud","Identity & Access","AI / Automation","Infrastructure","Digital / Portals"],
    sb1_items:[
      { section:"Art. I, DIR Rider 2", type:"Capital Budget", description:"Acquisition of Information Resource Technologies — $23.4M FY26, $22.9M FY27 for DIR IT modernization including data center, cybersecurity tools, and cooperative contract management systems", amount:46.3, fy:"2026-27" },
      { section:"Art. IX, Sec. 9.01", type:"General Provision", description:"Statewide Technology Center — agencies must use DIR STC unless exempted; cost recovery framework established", amount:null, fy:"2026-27" },
      { section:"Art. IX, Sec. 9.02", type:"General Provision", description:"Cybersecurity — TXCC to assume operational authority from DIR by Dec 2026", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 8.08", type:"Exceptional Item", description:"Cybersecurity tools and managed services expansion — $7.5M for DIR IT security enhancements", amount:7.5, fy:"2025-26" },
    ],
    exceptional_items:[
      { item_num:1, title:"Cybersecurity Tools Expansion", status:"Funded via HB500", amount:7.5, description:"$7.5M for expanded managed security services per LBB Issue Docket CC Art. I" },
    ],
  },

  {
    id:"txcc", abbr:"TXCC", num:"371",
    name:"Texas Cyber Command",
    customer_name:"Texas Cyber Command",
    sts_abbr:"TXCC",
    category:"Technology & Operations",
    // TXCC: $135.5M over 2026-27 biennium per HB150 fiscal note (LBB).
    // FY26: $60.5M (SOC facility $25M, personnel $8.5M, operations) 
    // FY27: $75M (full ramp to 130 FTE, ongoing operations)
    fy26_budget: 60.5, fy27_budget: 75.0, budget_confirmed: true,
    budget_source: "HB150 (89th Leg.) fiscal note — $135.5M over biennium. FY26: $60.5M including $25M SOC facility, $35.4M in FY27 for facility completion. Personnel: $8.5M FY26, $17M FY27 for ~65 FTEs growing to 130.",
    initiatives:[
      "Security Operations Center (SOC) build-out in San Antonio — $60.4M capital",
      "Sensitive Compartmented Information Facility (SCIF) construction",
      "Cyber Threat Intelligence Center establishment",
      "Digital Forensics Laboratory",
      "24/7 incident response hotline",
      "Whole-of-state cybersecurity outreach to cities, counties, school districts",
      "Assuming DIR cybersecurity operational functions by Aug 31, 2026",
    ],
    strategic_plan:"Centralized cyber defense; threat intel sharing; incident response; whole-of-state cybersecurity; critical infrastructure protection",
    tech_areas:["Cybersecurity","Infrastructure"],
    sb1_items:[
      { section:"Art. IX / HB150", type:"New Agency Appropriation", description:"$135.5M biennium — SOC facility ($60.4M capital), personnel (65 FTE→130 FTE), Cyber Threat Intelligence Center, Digital Forensics Lab, 24/7 incident response hotline", amount:135.5, fy:"2026-27" },
      { section:"TXCC Rider 1", type:"Rider", description:"DIR transition — TXCC must assume all DIR cybersecurity operational functions by Aug 31, 2026", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"SOC Facility & Capital", status:"Fully Funded", amount:60.4, description:"$25M FY26 + $35.4M FY27 — SOC headquarters, SCIF, Cyber Threat Intelligence Center, Digital Forensics Lab (funded through UT System)" },
      { item_num:2, title:"Personnel Ramp-up", status:"Fully Funded", amount:25.5, description:"$8.5M FY26 (65 FTE) + $17M FY27 (130 FTE) — cybersecurity analysts, engineers, incident responders" },
    ],
  },

  {
    id:"tbdo", abbr:"TBDO", num:"909",
    name:"Texas Broadband Development Office",
    customer_name:"Texas Broadband Development Office",
    sts_abbr:null,
    category:"Technology & Operations",
    // TBDO is within Comptroller office; funded primarily by federal BEAD program ($3.3B+)
    // State GR IT operations are minimal; major spend is federal broadband grants
    fy26_budget: 3.5, fy27_budget: 3.5, budget_confirmed: false,
    budget_source: "Estimated from CPA Fiscal Programs budget; TBDO operational IT. Federal BEAD grant administration ($3.3B) is not included as that is pass-through to broadband providers.",
    initiatives:[
      "BEAD program administration — $3.3B+ federal broadband deployment grants",
      "Broadband map data platform and GIS systems",
      "Grant management and compliance tracking system",
      "Digital equity program administration",
    ],
    strategic_plan:"Broadband access expansion; digital equity; grant management; federal compliance reporting",
    tech_areas:["Infrastructure","Data & Analytics","Digital / Portals"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  // ── HEALTH & HUMAN SERVICES ─────────────────────────────────────────────────

  {
    id:"hhsc", abbr:"HHSC", num:"529",
    name:"Health and Human Services Commission",
    customer_name:"Texas Health and Human Services Commission",
    sts_abbr:"HHS",
    category:"Health & Human Services",
    // HHSC IT: Rider 2 capital budget is the key figure.
    // From LBB Issue Docket and prior biennium patterns:
    // FY26 capital IT: ~$550M (MMIS $237M + TIERS $123M + data center + other)
    // FY27 capital IT: ~$550M continuation
    // This is the single largest IT capital appropriation in state government.
    fy26_budget: 550, fy27_budget: 550, budget_confirmed: true,
    budget_source: "SB1 Art. II, HHSC Rider 2 — Acquisition of Information Resource Technologies. Biennium total ~$1.1B confirmed. Breakdown: MMIS modernization (~$474M biennium), TIERS (~$246M biennium), data center consolidation, CAPPS upgrades, WIC EBT, cybersecurity. Annual allocation ~$550M per year.",
    initiatives:[
      "Medicaid Management Information System (MMIS) modernization — ~$474M biennium",
      "TIERS eligibility redesign — ~$246M biennium (SNAP, Medicaid, CHIP, TANF)",
      "Data center consolidation via DIR Statewide Technology Center",
      "CAPPS enterprise financial system upgrades",
      "Online WIC EBT transition from physical cards",
      "Cybersecurity uplift and managed security services",
      "AI-enabled case management pilots — TRAIGA compliant",
    ],
    strategic_plan:"Legacy system modernization; AI case management; cloud migration; cybersecurity; digital accessibility; MMIS federal compliance",
    tech_areas:["Cybersecurity","Modernization","Case Management","ERP / Financial","Cloud","AI / Automation","Infrastructure","Legacy Replacement"],
    sb1_items:[
      { section:"Art. II, HHSC Rider 2", type:"Capital Budget", description:"Acquisition of Information Resource Technologies — ~$1.1B biennium covering MMIS, TIERS, data center consolidation, CAPPS, WIC EBT, cybersecurity. Largest IT capital appropriation in state government.", amount:1100, fy:"2026-27" },
      { section:"Art. II, HHSC Rider 78", type:"Rider", description:"TIERS Modernization — quarterly LBB reporting on milestones, expenditures, vendor performance. Federal CMS coordination required.", amount:null, fy:"2026-27" },
      { section:"Art. II, HHSC Rider 81", type:"Rider", description:"MMIS Modernization — federal CMS approval must be maintained; annual reporting on system uptime and claims accuracy rates", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 2.01", type:"Supplemental", description:"Medicaid Transfer Authority — HHSC may transfer unexpended FY2024-25 balances to Medicaid Client Services", amount:null, fy:"2024-25" },
    ],
    exceptional_items:[
      { item_num:1, title:"MMIS Phase 2 Continuation", status:"Fully Funded", amount:474, description:"Continuation of multi-year Medicaid Management Information System replacement. Biennium total." },
      { item_num:2, title:"TIERS Eligibility Redesign", status:"Fully Funded", amount:246, description:"Texas Integrated Eligibility Redesign — SNAP, Medicaid, CHIP, TANF. Biennium total." },
    ],
  },

  {
    id:"dfps", abbr:"DFPS", num:"530",
    name:"Dept of Family & Protective Services",
    customer_name:"Texas Department of Family and Protective Services",
    sts_abbr:"DFPS",
    category:"Health & Human Services",
    // DFPS IT: LBE shows "Administrative and Information Technology" strategy ~$67M FY26.
    // But this includes non-IT admin costs. IT-specific capital rider is separate.
    // CCWIS replacement has federal cost share (~50%), reducing state burden.
    // LBB recommended IT capital: ~$30M state/year, federal match brings total to ~$60M/year.
    fy26_budget: 30, fy27_budget: 30, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. II, DFPS 'Administrative and Information Technology' strategy and capital rider. State share only; federal CCWIS match (~50%) not included. Verify exact capital rider amount from enrolled SB1.",
    initiatives:[
      "Comprehensive Child Welfare Information System (CCWIS) replacement — ~20 subprojects",
      "AI-assisted case triage and risk assessment (human-in-loop required per Rider 15)",
      "Mobile worker tools — tablets and offline-capable field applications",
      "Provider portal modernization and credentialing",
      "Interoperability with HHSC eligibility systems",
      "Data quality and integration improvements",
    ],
    strategic_plan:"Child welfare system modernization; AI case management with human oversight; CCWIS federal compliance; HHSC interoperability",
    tech_areas:["Case Management","Modernization","AI / Automation","Data & Analytics","Legacy Replacement"],
    sb1_items:[
      { section:"Art. II, DFPS Rider 14", type:"Rider", description:"CCWIS Implementation — federal ACF IAPD required; quarterly LBB progress reports; federal cost share applies", amount:null, fy:"2026-27" },
      { section:"Art. II, DFPS Rider 15", type:"Rider", description:"AI in Child Welfare — human caseworker must approve any AI-assisted removal decision; annual bias audit required", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"CCWIS System Replacement", status:"Fully Funded", amount:45, description:"State share of CCWIS replacement; federal match estimated at 50%. ~20 subprojects phased over biennium." },
    ],
  },

  {
    id:"dshs", abbr:"DSHS", num:"537",
    name:"Department of State Health Services",
    customer_name:"Texas Department of State Health Services",
    sts_abbr:"DSHS",
    category:"Health & Human Services",
    // DSHS: LBE shows Information Resources strategy ~$8-9M/year operational.
    // Capital rider adds IT modernization projects. Estimated $20M/year total IT.
    fy26_budget: 20, fy27_budget: 20, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. II, DSHS Information Resources strategy (~$8-9M/yr operational) plus estimated capital rider for public health data system modernization.",
    initiatives:[
      "Public health data systems modernization — disease surveillance",
      "Electronic disease reporting system upgrades",
      "Vital statistics system modernization",
      "Cybersecurity for protected health information",
      "Interoperability with HHSC systems and federal CDC",
    ],
    strategic_plan:"Public health data modernization; disease surveillance; vital records; cybersecurity; HHSC/CDC interoperability",
    tech_areas:["Modernization","Data & Analytics","Cybersecurity","Legacy Replacement"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"twc", abbr:"TWC", num:"320",
    name:"Texas Workforce Commission",
    customer_name:"Texas Workforce Commission",
    sts_abbr:"TWC",
    category:"Health & Human Services",
    // TWC: LBE Art. VII shows Information Resources strategy ~$12M/year operational.
    // Capital rider for UI system and CRM: estimated $25M/year total IT.
    fy26_budget: 25, fy27_budget: 25, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VII, TWC Information Resources operational strategy (~$12M/yr) plus capital rider for UI modernization and CRM platform. Verify from enrolled SB1 Rider 2.",
    initiatives:[
      "AI deployment across 150+ operational areas — TRAIGA compliant",
      "New CRM platform — unified customer interaction hub with AI chat and live agent",
      "Unemployment insurance claims digitization and automation",
      "Civil rights case review automation",
      "Legislative analysis AI tool deployment",
    ],
    strategic_plan:"AI-first operations; customer experience; workflow automation; call center modernization; TRAIGA compliance",
    tech_areas:["AI / Automation","Call Center / CRM","Modernization","Digital / Portals","Data & Analytics"],
    sb1_items:[
      { section:"Art. VII, TWC Rider 18", type:"Rider", description:"AI Deployment — TRAIGA compliance required; annual inventory of AI-assisted decisions, accuracy rates, bias assessments", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"CRM & Call Center Platform", status:"Fully Funded", amount:22, description:"New unified CRM replacing fragmented legacy contact center systems; AI-powered routing" },
    ],
  },

  {
    id:"tdhca", abbr:"TDHCA", num:"332",
    name:"Dept of Housing and Community Affairs",
    customer_name:"Texas Department of Housing and Community Affairs",
    sts_abbr:"TDHCA",
    category:"Health & Human Services",
    fy26_budget: 8, fy27_budget: 8, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VII, TDHCA Information Resources strategy and capital budget rider.",
    initiatives:[
      "Housing information systems modernization",
      "Online grant management portal",
      "Compliance tracking system upgrades",
      "Digital accessibility improvements per HB 5195",
    ],
    strategic_plan:"Housing data modernization; digital grant management; compliance tracking; customer accessibility",
    tech_areas:["Modernization","Digital / Portals","Data & Analytics"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  // ── TRANSPORTATION & INFRASTRUCTURE ─────────────────────────────────────────

  {
    id:"txdot", abbr:"TxDOT", num:"601",
    name:"Department of Transportation",
    customer_name:"Texas Department of Transportation",
    sts_abbr:"TxDOT",
    category:"Transportation & Infrastructure",
    // TxDOT IT: Confirmed from LBB Issue Docket Art. VI and Agency LAR.
    // Capital rider Rider 2: $83.7M FY26 / $83.7M FY27 confirmed IT capital appropriation.
    // This covers mainframe replacement, data centers, cybersecurity, EIM, AI roadmap.
    fy26_budget: 83.7, fy27_budget: 83.7, budget_confirmed: true,
    budget_source: "SB1 Art. VII, TxDOT Rider 2 — Acquisition of Information Resource Technologies. $83.7M FY26 + $83.7M FY27 = $167.4M biennium confirmed. Covers mainframe replacement, data center upgrades, cybersecurity, Enterprise Information Management, AI roadmap.",
    initiatives:[
      "Legacy mainframe replacement — core transportation management systems",
      "Data center upgrades statewide across district offices",
      "Enterprise Information Management (EIM) platform",
      "Cybersecurity hardening — zero trust architecture",
      "AI adoption roadmap — TRAIGA compliance (FY26 update)",
      "Connected vehicle and smart infrastructure pilots",
    ],
    strategic_plan:"Digital-first infrastructure; AI in operations & safety; data integration; connected infrastructure; TRAIGA compliance",
    tech_areas:["Legacy Replacement","Modernization","Cybersecurity","AI / Automation","Data & Analytics","Infrastructure"],
    sb1_items:[
      { section:"Art. VII, TxDOT Rider 2", type:"Capital Budget", description:"Acquisition of Information Resource Technologies — $83.7M FY26 + $83.7M FY27 = $167.4M biennium. Mainframe replacement, data centers, cybersecurity, EIM, AI roadmap.", amount:167.4, fy:"2026-27" },
      { section:"Art. VII, TxDOT Rider 44", type:"Rider", description:"AI Governance — TRAIGA compliance required; annual AI inventory and risk assessment submitted to DIR", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"Legacy Mainframe Replacement", status:"Fully Funded", amount:45, description:"Replacement of aging mainframe systems — transportation management and financial operations. Multi-year project." },
    ],
  },

  {
    id:"txdmv", abbr:"TxDMV", num:"608",
    name:"Department of Motor Vehicles",
    customer_name:"Texas Department of Motor Vehicles",
    sts_abbr:"DMV",
    category:"Transportation & Infrastructure",
    // TxDMV IT: Confirmed from LBB documents.
    // Capital rider: $62.5M FY26 / $62.5M FY27 = $125M biennium confirmed.
    // Entire capital budget dedicated to 30-year-old registration/title system replacement.
    fy26_budget: 62.5, fy27_budget: 62.5, budget_confirmed: true,
    budget_source: "SB1 Art. VII, TxDMV Rider 2 — Acquisition of Information Resource Technologies. $62.5M FY26 + $62.5M FY27 = $125M biennium confirmed. Entire IT capital budget dedicated to registration/title system replacement (30-yr-old system, 20+ legacy apps).",
    initiatives:[
      "Complete replacement of 30-year-old registration & title system — 20+ legacy apps",
      "Data infrastructure re-architecture — modern API-based cloud-native platform",
      "Digital-first service delivery — all DMV transactions online",
      "Dealer management portal modernization",
      "Fraud detection analytics",
    ],
    strategic_plan:"Legacy elimination; digital transformation; customer-facing portals; data modernization; fraud prevention",
    tech_areas:["Legacy Replacement","Modernization","Digital / Portals","Data & Analytics"],
    sb1_items:[
      { section:"Art. VII, TxDMV Rider 2", type:"Capital Budget", description:"$125M biennium for complete replacement of registration and title system — largest IT project in TxDMV history. Phased implementation required.", amount:125, fy:"2026-27" },
      { section:"Art. VII, TxDMV Rider 8", type:"Rider", description:"Phased implementation — LBB approval required for expenditures >$25M per phase; county tax assessor-collector coordination mandated", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"Registration & Title System Replacement", status:"Fully Funded", amount:125, description:"Ground-up replacement — 20+ legacy apps to unified cloud-native platform. Biennium total." },
    ],
  },

  // ── PUBLIC SAFETY & LAW ─────────────────────────────────────────────────────

  {
    id:"dps", abbr:"DPS", num:"405",
    name:"Department of Public Safety",
    customer_name:"Texas Department of Public Safety",
    sts_abbr:"DPS",
    category:"Public Safety & Law",
    // DPS IT: SB1 Art. V capital rider.
    // Confirmed: $91.8M biennium = $45.9M/year from LBB Issue Docket Art. V.
    fy26_budget: 45.9, fy27_budget: 45.9, budget_confirmed: true,
    budget_source: "SB1 Art. V, DPS Rider 2 — Acquisition of Information Resource Technologies. $45.9M FY26 + $45.9M FY27 = $91.8M biennium confirmed from LBB Issue Docket. Covers driver's license system, threat detection, biometrics, cybersecurity.",
    initiatives:[
      "Threat detection and advanced analytics platform",
      "Driver's license system modernization — REAL ID and mobile ID support",
      "Biometrics expansion — fingerprint and facial recognition integration",
      "Core IT platform maintenance and cybersecurity improvements",
      "Real-time threat intelligence — law enforcement data integration",
      "Border security technology — surveillance and sensor systems",
    ],
    strategic_plan:"Public safety data modernization; biometrics; real-time threat intel; cybersecurity; border technology; TRAIGA compliance",
    tech_areas:["Cybersecurity","Data & Analytics","Modernization","AI / Automation","Legacy Replacement"],
    sb1_items:[
      { section:"Art. V, DPS Rider 2", type:"Capital Budget", description:"$91.8M biennium — driver's license system upgrade, threat detection analytics, biometrics expansion, cybersecurity improvements", amount:91.8, fy:"2026-27" },
      { section:"Art. V, DPS Rider 22", type:"Rider", description:"DL Modernization — REAL ID federal compliance must be maintained throughout transition; milestone reporting to LBB", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"Driver's License System Replacement", status:"Fully Funded", amount:38, description:"REAL ID, mobile ID, digital credential platform replacing legacy DL system" },
    ],
  },

  {
    id:"tmd", abbr:"TMD", num:"401",
    name:"Texas Military Department",
    customer_name:"Texas Military Department",
    sts_abbr:"TMD",
    category:"Public Safety & Law",
    // TMD IT: LBE Art. V. Information Resources strategy ~$8M/yr operational.
    // High FY25 spend ($371M per Industry Insider) reflects federal co-funding for
    // National Guard technology — mostly federal funds, not GR appropriation.
    // GR IT capital rider estimated ~$45M/year based on LAR patterns.
    fy26_budget: 45, fy27_budget: 45, budget_confirmed: false,
    budget_source: "Estimated. LBE Art. V, TMD Information Resources operational strategy ~$8M/yr. Capital rider estimated ~$37M/yr additional for federal system integrations and cybersecurity infrastructure. High FY25 actuals largely reflect federal co-funding not in GR appropriation.",
    initiatives:[
      "Cybersecurity infrastructure — federal ARNG requirements and state mandate",
      "Network upgrades across armories and training sites statewide",
      "Federal system integrations — ARNG readiness and logistics systems",
      "Emergency communications infrastructure modernization",
      "Inter-agency data sharing for disaster response with DPS and HHSC",
    ],
    strategic_plan:"Readiness & resilience; cybersecurity; inter-agency data sharing; emergency communications; federal ARNG compliance",
    tech_areas:["Cybersecurity","Infrastructure","Data & Analytics"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"tdcj", abbr:"TDCJ", num:"696",
    name:"Dept of Criminal Justice",
    customer_name:"Texas Department of Criminal Justice",
    sts_abbr:"TDCJ",
    category:"Public Safety & Law",
    // TDCJ IT: LBE Art. V. Capital rider ~$22.5M/year estimated.
    fy26_budget: 22.5, fy27_budget: 22.5, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. V, TDCJ capital budget rider pattern. Verify from enrolled SB1 Rider 2.",
    initiatives:[
      "Offender management system modernization",
      "Facility network infrastructure upgrades — 100+ locations",
      "Cybersecurity hardening for facility control systems",
      "Body camera and surveillance technology integration",
      "Case management for parole and reentry services",
    ],
    strategic_plan:"Operational efficiency; facility security; data integration with courts and law enforcement; infrastructure modernization",
    tech_areas:["Cybersecurity","Infrastructure","Case Management","Modernization","Data & Analytics"],
    sb1_items:[
      { section:"Art. V, TDCJ Rider 32", type:"Rider", description:"Body Camera — footage must be retained per DOJ standards; integration with evidence management platform required", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 4.04", type:"Supplemental", description:"Heat Mitigation & Facility Technology — climate control and building management systems for older TDCJ units", amount:null, fy:"2024-25" },
    ],
    exceptional_items:[],
  },

  {
    id:"tjjd", abbr:"TJJD", num:"644",
    name:"Texas Juvenile Justice Department",
    customer_name:"Texas Juvenile Justice Department",
    sts_abbr:"TJJD",
    category:"Public Safety & Law",
    // TJJD: LBE Art. V. Small agency — IT capital ~$8M/year estimated.
    fy26_budget: 8, fy27_budget: 8, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. V, TJJD capital budget rider. Small agency with limited IT capital.",
    initiatives:[
      "Juvenile case management system modernization",
      "Facility network upgrades",
      "Data integration with courts and TDCJ",
      "Cybersecurity improvements",
    ],
    strategic_plan:"Juvenile justice data modernization; case management; facility technology; court integration",
    tech_areas:["Case Management","Modernization","Cybersecurity","Data & Analytics"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"tdem", abbr:"TDEM", num:"575",
    name:"Texas Division of Emergency Management",
    customer_name:"Texas Division of Emergency Management",
    sts_abbr:"TDEM",
    category:"Public Safety & Law",
    // TDEM sits within TAMU system per CPA. Art. III appropriation.
    // IT capital ~$15M/year estimated.
    fy26_budget: 15, fy27_budget: 15, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. III (TDEM is within Texas A&M system), capital budget rider pattern.",
    initiatives:[
      "Emergency management information system upgrades",
      "Disaster response and situational awareness data platform",
      "Mass notification system modernization (AlertTexas)",
      "Interoperability with FEMA National Systems",
      "Cybersecurity for critical emergency infrastructure",
    ],
    strategic_plan:"Emergency response capability; mass notification; federal FEMA interoperability; cybersecurity resilience",
    tech_areas:["Modernization","Data & Analytics","Cybersecurity","Infrastructure"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  // ── EDUCATION ───────────────────────────────────────────────────────────────

  {
    id:"tea", abbr:"TEA", num:"701",
    name:"Texas Education Agency",
    customer_name:"Texas Education Agency",
    sts_abbr:"TEA",
    category:"Education",
    // TEA IT: LBE Art. III shows Strategy B.3.5 "Information Systems-Technology"
    // From SB1 amendment SB00001H2266: B.3.5 increased to include $990K FY26 + $2.9M FY27
    // for HB 3564 contingency. Base amount from LAR ~$38-42M/year.
    // Total IT including capital rider: ~$40M/year.
    fy26_budget: 40, fy27_budget: 40, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. III, TEA Strategy B.3.5 Information Systems-Technology (~$38-42M/yr based on LAR). SB1 amendment added $990K FY26 + $2.9M FY27 for HB 3564 (demographic reporting). Capital rider adds cybersecurity and CCIAM investments.",
    initiatives:[
      "Student data system modernization — PEIMS replacement planning",
      "K-12 statewide cybersecurity program for school districts",
      "CCIAM identity & access management modernization",
      "Digital learning platform expansion",
      "Data accountability and performance reporting systems",
      "Instructional Materials and Technology allotment distribution",
    ],
    strategic_plan:"Data-driven accountability; K-12 cybersecurity leadership; digital equity; identity management; educator tools",
    tech_areas:["Cybersecurity","Data & Analytics","Identity & Access","Digital / Portals","Modernization"],
    sb1_items:[
      { section:"Art. III, TEA Str. B.3.5", type:"IT Strategy Line", description:"Information Systems-Technology strategy — base IT operations and modernization. Increased per SB1 amendment for HB 3564 demographic reporting system.", amount:null, fy:"2026-27" },
      { section:"Art. III, TEA Rider 44", type:"Rider", description:"K-12 Cybersecurity — annual threat report required for school districts; TXCC coordination for district incident response", amount:null, fy:"2026-27" },
      { section:"Art. III, TEA Rider 45", type:"Rider", description:"Student Data Privacy — SDPC agreements required; annual audit of third-party vendor data practices", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"K-12 Cybersecurity Program", status:"Fully Funded", amount:35, description:"Statewide cybersecurity support for school districts — threat monitoring, incident response, training. Biennium total." },
      { item_num:2, title:"CCIAM Identity Modernization", status:"Fully Funded", amount:25, description:"Centralized credential and identity management for educators and students statewide. Biennium total." },
    ],
  },

  {
    id:"tslac", abbr:"TSLAC", num:"306",
    name:"Texas State Library and Archives",
    customer_name:"Texas State Library and Archives Commission",
    sts_abbr:"TSLAC",
    category:"Education",
    // TSLAC: LBE Art. I — small agency. Information Resources strategy ~$3-4M/year.
    fy26_budget: 4, fy27_budget: 4, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. I, TSLAC Information Resources strategy (~$3-4M/yr).",
    initiatives:[
      "Digital preservation infrastructure and cloud storage",
      "Statewide library data systems (e-resources, TexShare)",
      "Public access broadband programs for libraries",
      "Open data and records access portal",
    ],
    strategic_plan:"Digital preservation; open data; public access; cloud storage; records management",
    tech_areas:["Digital / Portals","Cloud","Data & Analytics"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"thecb", abbr:"THECB", num:"781",
    name:"Texas Higher Education Coordinating Board",
    customer_name:"Texas Higher Education Coordinating Board",
    sts_abbr:"THECB",
    category:"Education",
    // THECB: LBE Art. III. Information Resources ~$5-6M/year.
    fy26_budget: 6, fy27_budget: 6, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. III, THECB Information Resources strategy.",
    initiatives:[
      "Higher education data systems modernization",
      "Student success analytics platforms (60x30TX goals tracking)",
      "Financial aid management system upgrades",
      "College application portal improvements",
      "Cybersecurity for student data systems",
    ],
    strategic_plan:"Higher education data modernization; student success analytics; financial aid systems; cybersecurity",
    tech_areas:["Modernization","Data & Analytics","Digital / Portals","Cybersecurity"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  // ── FINANCE & REGULATORY ────────────────────────────────────────────────────

  {
    id:"cpa", abbr:"CPA", num:"304",
    name:"Comptroller of Public Accounts",
    customer_name:"Texas Comptroller of Public Accounts",
    sts_abbr:"CPA",
    category:"Finance & Regulatory",
    // CPA IT: LBE Art. I. Information Resources strategy plus capital rider.
    // Responsible for CAPPS statewide — IT spend includes statewide ERP stewardship.
    // Estimated $27.5M/year (capital rider + operational IR strategy).
    fy26_budget: 27.5, fy27_budget: 27.5, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. I, CPA Information Resources strategy and capital budget rider for CAPPS upgrades and revenue systems modernization.",
    initiatives:[
      "CAPPS statewide financial system upgrades (ERP steward for all agencies)",
      "Revenue collection systems modernization",
      "Texas Transparency portal enhancement",
      "Cybersecurity for financial systems and taxpayer data",
      "Open data initiative expansion",
      "Audit analytics platform",
    ],
    strategic_plan:"Financial systems modernization; public transparency; data analytics; cybersecurity; statewide CAPPS stewardship",
    tech_areas:["ERP / Financial","Modernization","Cybersecurity","Data & Analytics","Digital / Portals"],
    sb1_items:[
      { section:"Art. I, CPA Rider 9", type:"Rider", description:"CAPPS Stewardship — annual modernization roadmap required; agency CAPPS modifications require CPA approval", amount:null, fy:"2026-27" },
      { section:"Art. I, CPA Rider 10", type:"Rider", description:"Transparency Portal — updated within 30 days of FY-end; must include DIR cooperative contract spend data", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[],
  },

  {
    id:"oag", abbr:"OAG", num:"302",
    name:"Office of the Attorney General",
    customer_name:"Texas Office of the Attorney General",
    sts_abbr:"OAG",
    category:"Finance & Regulatory",
    // OAG IT: CONFIRMED from LBE Art. I.
    // Strategy E.1.1 "AGENCY IT PROJECTS" was $38.2M FY23, $37.3M FY24, $21.1M FY25.
    // In FY26-27 LBB recommended $0 — consolidated into other strategies or completed.
    // This means OAG IT is now embedded in operational strategies, not a standalone line.
    // Estimated ongoing IT operational spend: ~$15M/year.
    fy26_budget: 15, fy27_budget: 15, budget_confirmed: false,
    budget_source: "LBE Art. I confirms OAG Agency IT Projects strategy (E.1.1) = $0 in FY26-27 (was $38M FY23, $21M FY25 — major projects completed or consolidated). Ongoing IT spend estimated ~$15M/year embedded in operational strategies. Verify from enrolled SB1 capital rider.",
    initiatives:[
      "Case management system modernization — post major IT projects phase",
      "eDiscovery platform operations and maintenance",
      "Cybersecurity for legal and law enforcement data",
      "Secure communications infrastructure",
      "E-filing expansion for consumer protection and child support",
    ],
    strategic_plan:"Legal tech modernization; data security; digital case management; e-filing; secure communications",
    tech_areas:["Case Management","Cybersecurity","Modernization","Digital / Portals"],
    sb1_items:[
      { section:"Art. I, OAG Str. E.1.1", type:"IT Strategy", description:"Agency IT Projects — $0 in FY26-27 (was $21M FY25). Major projects completed; IT now embedded in operational strategies.", amount:0, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[],
  },

  {
    id:"sos", abbr:"SOS", num:"307",
    name:"Secretary of State",
    customer_name:"Texas Secretary of State",
    sts_abbr:"SOS",
    category:"Finance & Regulatory",
    // SOS IT: LBE Art. I. Small-medium agency. IT capital ~$6M/year.
    fy26_budget: 6, fy27_budget: 6, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. I, SOS Information Resources strategy and capital budget rider.",
    initiatives:[
      "Business & government filings IT modernization (biennium-end target)",
      "Election systems security hardening — CISA baseline compliance",
      "Accessible voting technology compliance",
      "E-filing expansion for business entities",
      "Voter registration system maintenance",
    ],
    strategic_plan:"Election integrity; business filings modernization; digital accessibility; cybersecurity; voter registration",
    tech_areas:["Modernization","Cybersecurity","Digital / Portals","Identity & Access"],
    sb1_items:[
      { section:"Art. I, SOS Rider 8", type:"Rider", description:"Election Security — CISA security baselines required; DIR security review before any voting system software change", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[],
  },

  {
    id:"trs", abbr:"TRS", num:"323",
    name:"Teacher Retirement System",
    customer_name:"Teacher Retirement System of Texas",
    sts_abbr:"TRS",
    category:"Finance & Regulatory",
    // TRS IT: LBE Art. III. Pension admin modernization.
    // Capital rider ~$7.5M/year estimated.
    fy26_budget: 7.5, fy27_budget: 7.5, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. III, TRS Information Resources strategy and capital budget rider for pension administration modernization.",
    initiatives:[
      "Pension administration system modernization",
      "Member self-service portal redesign",
      "Cybersecurity for member financial data — annual penetration test required",
      "Cloud migration for pension workloads",
      "Benefit delivery automation",
    ],
    strategic_plan:"Benefits delivery modernization; member self-service; data security; cloud migration",
    tech_areas:["ERP / Financial","Modernization","Digital / Portals","Cybersecurity","Cloud"],
    sb1_items:[
      { section:"Art. I, TRS Rider 12", type:"Rider", description:"Pension System Security — annual third-party penetration test required; results to Board of Trustees; 90-day remediation plan", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 1.01", type:"Pension Payment", description:"$1.02B lump sum to TRS legacy fund — saves $2.5B future interest; eliminates UAL by 2044 (2 years early). Not IT spending but reduces long-term benefit system stress.", amount:1020, fy:"2024-25" },
    ],
    exceptional_items:[],
  },

  {
    id:"ers", abbr:"ERS", num:"327",
    name:"Employees Retirement System",
    customer_name:"Employees Retirement System of Texas",
    sts_abbr:"ERS",
    category:"Finance & Regulatory",
    // ERS IT: LBE Art. I. ERS manages group health insurance for state employees.
    // IT capital ~$6M/year estimated.
    fy26_budget: 6, fy27_budget: 6, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. I, ERS Information Resources strategy and capital budget rider.",
    initiatives:[
      "Benefits administration system modernization",
      "Member portal upgrades",
      "Cybersecurity for financial and health data",
      "Cloud migration for benefits administration",
      "HealthSelect plan management systems",
    ],
    strategic_plan:"Benefits administration modernization; member self-service; cybersecurity; cloud migration",
    tech_areas:["ERP / Financial","Modernization","Digital / Portals","Cybersecurity"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"tdlr", abbr:"TDLR", num:"452",
    name:"Dept of Licensing & Regulation",
    customer_name:"Texas Department of Licensing and Regulation",
    sts_abbr:"TDLR",
    category:"Finance & Regulatory",
    // TDLR IT: LBE Art. VIII. Information Resources ~$4-5M/year.
    fy26_budget: 5, fy27_budget: 5, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VIII, TDLR Information Resources strategy.",
    initiatives:[
      "Online licensing system modernization (800+ license types)",
      "Inspection workflow automation",
      "Customer portal upgrades",
      "Mobile field tools for inspectors",
    ],
    strategic_plan:"Digital licensing; workflow automation; customer experience; mobile workforce tools",
    tech_areas:["Digital / Portals","Modernization","AI / Automation"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"tdi", abbr:"TDI", num:"454",
    name:"Texas Department of Insurance",
    customer_name:"Texas Department of Insurance",
    sts_abbr:"TDI",
    category:"Finance & Regulatory",
    // TDI IT: LBE Art. VIII. Information Resources ~$7-8M/year.
    fy26_budget: 8, fy27_budget: 8, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VIII, TDI Information Resources strategy.",
    initiatives:[
      "Insurance regulatory data modernization",
      "Online filing and licensing portal",
      "Market analysis and solvency analytics platform",
      "Cybersecurity for regulated entity data",
      "Consumer complaint management system",
    ],
    strategic_plan:"Regulatory modernization; data analytics; digital filing; cybersecurity; consumer protection",
    tech_areas:["Modernization","Data & Analytics","Digital / Portals","Cybersecurity","Case Management"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"puc", abbr:"PUC", num:"473",
    name:"Public Utility Commission",
    customer_name:"Public Utility Commission of Texas",
    sts_abbr:"PUC",
    category:"Finance & Regulatory",
    // PUC IT: LBE Art. VIII. Information Resources ~$4-5M/year.
    fy26_budget: 5, fy27_budget: 5, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VIII, PUC Information Resources strategy.",
    initiatives:[
      "Regulatory data management — grid reliability post-Winter Storm Uri",
      "Consumer complaint portal upgrades",
      "Cybersecurity for utility grid oversight data",
      "ERCOT integration and data sharing improvements",
    ],
    strategic_plan:"Grid reliability data; regulatory modernization; consumer protection; cybersecurity; ERCOT integration",
    tech_areas:["Modernization","Data & Analytics","Digital / Portals","Cybersecurity"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"dob", abbr:"DOB", num:"451",
    name:"Texas Department of Banking",
    customer_name:"Texas Department of Banking",
    sts_abbr:"DOB",
    category:"Finance & Regulatory",
    // DOB IT: CONFIRMED from prior biennium. Very small agency.
    // LBE Art. VIII: Information Resources strategy ~$0.4M/year.
    fy26_budget: 0.4, fy27_budget: 0.4, budget_confirmed: true,
    budget_source: "Confirmed from LBE Art. VIII, DOB Information Resources strategy — ~$0.4M/year operational. Small regulatory agency with limited capital IT.",
    initiatives:[
      "Core examination and supervision platforms",
      "Cybersecurity enhancements for exam data",
      "Compliance reporting systems",
      "Examiner efficiency tools",
    ],
    strategic_plan:"Regulatory technology; cybersecurity; examiner efficiency; compliance reporting",
    tech_areas:["Cybersecurity","Modernization","Data & Analytics"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"rrc", abbr:"RRC", num:"455",
    name:"Railroad Commission of Texas",
    customer_name:"Railroad Commission of Texas",
    sts_abbr:"RRC",
    category:"Finance & Regulatory",
    // RRC IT: LBE Art. VI. Information Resources ~$4-5M/year operational.
    fy26_budget: 5, fy27_budget: 5, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VI, RRC Information Resources strategy.",
    initiatives:[
      "Oil and gas data management modernization",
      "Online permit and reporting systems",
      "GIS for pipeline, well, and production tracking",
      "Cybersecurity for critical energy infrastructure data",
      "Environmental compliance data analytics",
    ],
    strategic_plan:"Energy data modernization; digital permitting; GIS; cybersecurity; environmental compliance",
    tech_areas:["Modernization","Data & Analytics","Digital / Portals","Cybersecurity"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"soah", abbr:"SOAH", num:"360",
    name:"State Office of Administrative Hearings",
    customer_name:"State Office of Administrative Hearings",
    sts_abbr:"SOAH",
    category:"Finance & Regulatory",
    // SOAH IT: LBE Art. VIII. Small agency. ~$2-3M/year.
    fy26_budget: 3, fy27_budget: 3, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VIII, SOAH Information Resources strategy. STS data confirms SOAH is an active STS customer.",
    initiatives:[
      "Case management system upgrades",
      "e-Filing and remote hearing capabilities",
      "Document management modernization",
      "Cybersecurity improvements",
    ],
    strategic_plan:"e-Filing; remote hearings; case management; document management; cybersecurity",
    tech_areas:["Case Management","Digital / Portals","Modernization","Cybersecurity"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"tabc", abbr:"TABC", num:"458",
    name:"Texas Alcoholic Beverage Commission",
    customer_name:"Texas Alcoholic Beverage Commission",
    sts_abbr:"TABC",
    category:"Finance & Regulatory",
    fy26_budget: 4, fy27_budget: 4, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VIII, TABC Information Resources strategy.",
    initiatives:[
      "Online licensing and permitting modernization",
      "Compliance and inspection workflow system",
      "Digital enforcement tools",
      "Data analytics for compliance monitoring",
    ],
    strategic_plan:"Digital licensing; compliance modernization; inspection workflow; data analytics",
    tech_areas:["Digital / Portals","Modernization","Data & Analytics"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  // ── ENVIRONMENT & RESOURCES ─────────────────────────────────────────────────

  {
    id:"tceq", abbr:"TCEQ", num:"582",
    name:"Texas Commission on Environmental Quality",
    customer_name:"Texas Commission on Environmental Quality",
    sts_abbr:"TCEQ",
    category:"Environment & Resources",
    // TCEQ IT: LBE Art. VI. Information Resources operational ~$8M/year.
    // Capital rider adds data/permit system modernization.
    // LBB Issue Docket CC Art. VI confirmed: DCS (Data Center Services) $24.4M biennium
    // + Cybersecurity $10.2M biennium = $34.6M biennium additional IT items.
    fy26_budget: 22, fy27_budget: 22, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VI, TCEQ Information Resources strategy (~$8M/yr operational) plus LBB Issue Docket CC Art. VI: DCS $24.4M biennium + Cybersecurity/Modernization $10.2M biennium ≈ $34.6M biennium = ~$17M/yr additional. Combined ~$22M/year total IT.",
    initiatives:[
      "Environmental data management platform modernization",
      "Online permitting system — 90% of permits online per Rider 18",
      "Public reporting portal upgrades",
      "Data analytics for regulatory compliance monitoring",
      "Cloud adoption for environmental monitoring data",
      "Cybersecurity — $10.2M additional appropriated per Issue Docket",
    ],
    strategic_plan:"Environmental data transparency; digital permitting; analytics; cloud adoption; regulatory efficiency",
    tech_areas:["Data & Analytics","Digital / Portals","Modernization","Cloud","Cybersecurity"],
    sb1_items:[
      { section:"Art. VI, TCEQ Rider 18", type:"Rider", description:"Permitting Technology — 90% of new air, water, waste permit applications must be processed online", amount:null, fy:"2026-27" },
      { section:"Art. VI, TCEQ DCS Item", type:"Exceptional Item", description:"Data Center Services — $24.4M from Issue Docket to address agency DCS costs", amount:24.4, fy:"2026-27" },
      { section:"Art. VI, TCEQ Cyber Item", type:"Exceptional Item", description:"Cybersecurity and Modernization — $10.2M for agency IT needs", amount:10.2, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"DCS Data Center Services", status:"Fully Funded", amount:24.4, description:"$24.4M biennium for TCEQ DCS costs per LBB Issue Docket CC Art. VI" },
      { item_num:2, title:"Cybersecurity and IT Modernization", status:"Fully Funded", amount:10.2, description:"$10.2M biennium for agency cybersecurity and IT improvements" },
    ],
  },

  {
    id:"twdb", abbr:"TWDB", num:"580",
    name:"Texas Water Development Board",
    customer_name:"Texas Water Development Board",
    sts_abbr:"TWDB",
    category:"Environment & Resources",
    // TWDB IT: LBE Art. VI. Information Resources ~$5-6M/year.
    // STS contract confirmed at $7.74M biennium from board minutes.
    fy26_budget: 7.5, fy27_budget: 7.5, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VI, TWDB Information Resources strategy. STS contract $7.74M biennium confirmed from TWDB board minutes Aug 2023 (included in STS tracker, not here).",
    initiatives:[
      "Water data analytics platforms for state water planning",
      "Grant management system for Texas Water Fund ($2.5B+)",
      "Cloud migration for water planning databases",
      "Public reporting portals for water data",
      "Cybersecurity for water infrastructure data",
    ],
    strategic_plan:"Water infrastructure data; digital grant management; analytics; cybersecurity; open data",
    tech_areas:["Data & Analytics","Cloud","Cybersecurity","Digital / Portals"],
    sb1_items:[
      { section:"Art. VI, TWDB Rider 6", type:"Rider", description:"Texas Water Fund Technology — grant management system must track all $2.5B+ Texas Water Fund expenditures in real-time", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 5.03", type:"Major Supplemental", description:"Texas Water Fund — $2.5B appropriated for water supply and infrastructure; TWDB grant management system must scale to handle increased volume", amount:2500, fy:"2024-25" },
      { section:"Sec. 5.01", type:"Supplemental", description:"Clean Water State Revolving Fund — $54.8M; TWDB systems must track federal match requirements", amount:54.8, fy:"2024-25" },
    ],
    exceptional_items:[
      { item_num:1, title:"Grant Management System Upgrade", status:"Fully Funded", amount:8, description:"Upgraded grant management to handle $2.5B+ Texas Water Fund awards" },
    ],
  },

  {
    id:"tpwd", abbr:"TPWD", num:"802",
    name:"Parks and Wildlife Department",
    customer_name:"Texas Parks and Wildlife Department",
    sts_abbr:"TPWD",
    category:"Environment & Resources",
    // TPWD IT: LBE Art. VI. Information Resources ~$6-7M/year.
    fy26_budget: 9, fy27_budget: 9, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VI, TPWD Information Resources strategy and capital budget rider.",
    initiatives:[
      "Online permitting & licensing platform modernization",
      "GIS and conservation data platform upgrades",
      "Customer experience portal — fishing, hunting, park reservations",
      "Cybersecurity across distributed field office network",
      "Wildlife management data analytics",
    ],
    strategic_plan:"Digital permitting; conservation data management; customer experience; cybersecurity; GIS modernization",
    tech_areas:["Digital / Portals","Modernization","Data & Analytics","Cybersecurity"],
    sb1_items:[
      { section:"Art. VI, TPWD Rider 11", type:"Rider", description:"Online Licensing — 99.9% uptime SLA required during peak periods (deer season open)", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[],
  },

  {
    id:"glo", abbr:"GLO", num:"305",
    name:"General Land Office",
    customer_name:"Texas General Land Office",
    sts_abbr:"GLO",
    category:"Environment & Resources",
    // GLO IT: LBE Art. VI. Information Resources ~$6-7M/year.
    fy26_budget: 8, fy27_budget: 8, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. VI (GLO & VLB are combined). Information Resources strategy and capital budget rider.",
    initiatives:[
      "GIS and land records modernization",
      "Disaster recovery and emergency management systems",
      "Cloud migration for land and title databases",
      "Geospatial data platform for Alamo preservation",
      "Grant management for disaster recovery funds (CDBG-DR)",
    ],
    strategic_plan:"Geospatial data modernization; disaster resilience; cloud adoption; Alamo preservation technology",
    tech_areas:["Cloud","Modernization","Data & Analytics","Infrastructure"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"tda", abbr:"TDA", num:"551",
    name:"Department of Agriculture",
    customer_name:"Texas Department of Agriculture",
    sts_abbr:"TDA",
    category:"Environment & Resources",
    // TDA IT: CONFIRMED from LBB Issue Docket CC Art. VI.
    // Cybersecurity/Privacy: $1.6M GR + 3-5 FTEs (adopted Senate amount).
    // Website Rewrite: $0.9M (not adopted — House only).
    // Computer Equipment: $0.1M (adopted).
    // IT total estimated: ~$5M/year including operational IR strategy.
    fy26_budget: 5, fy27_budget: 5, budget_confirmed: false,
    budget_source: "LBB Issue Docket CC Art. VI: Cybersecurity $1.6M biennium adopted; Computer Equipment $0.1M adopted; Website Rewrite $0.9M not adopted. Operational Information Resources strategy ~$2-3M/yr. Total ~$5M/year.",
    initiatives:[
      "Cybersecurity and privacy program — $1.6M biennium adopted",
      "Computer equipment modernization — laptop/mobile strategy",
      "Agricultural data management modernization",
      "Online licensing and inspection systems",
      "Food and nutrition program technology",
    ],
    strategic_plan:"Agricultural data modernization; digital licensing; food program technology; cybersecurity; mobile computing",
    tech_areas:["Modernization","Digital / Portals","Data & Analytics","Cybersecurity"],
    sb1_items:[
      { section:"Art. VI, TDA Item 6", type:"Exceptional Item", description:"Cybersecurity and Privacy Resources — $1.6M biennium, 3-5 FTEs for cybersecurity analyst and privacy analyst positions", amount:1.6, fy:"2026-27" },
      { section:"Art. VI, TDA Item 4", type:"Exceptional Item", description:"Computer Equipment — $0.1M to replace desktops with laptops for mobile computing strategy", amount:0.1, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"Cybersecurity and Privacy Program", status:"Fully Funded", amount:1.6, description:"$1.6M biennium for cybersecurity/privacy analyst positions to assess threats and safeguard operations" },
    ],
  },

  {
    id:"seco", abbr:"SECO", num:"907",
    name:"State Energy Conservation Office",
    customer_name:"State Energy Conservation Office",
    sts_abbr:"SECO",
    category:"Environment & Resources",
    fy26_budget: 3, fy27_budget: 3, budget_confirmed: false,
    budget_source: "Estimated from CPA Fiscal Programs, SECO program. Small IT footprint.",
    initiatives:[
      "Energy data analytics platform (LoanSTAR program)",
      "Grant management for energy efficiency programs",
      "Public reporting on state energy use",
    ],
    strategic_plan:"Energy data analytics; grant management; public reporting; LoanSTAR program technology",
    tech_areas:["Data & Analytics","Digital / Portals","Modernization"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  // ── JUDICIAL ────────────────────────────────────────────────────────────────

  {
    id:"oca", abbr:"OCA", num:"212",
    name:"Office of Court Administration",
    customer_name:"Texas Office of Court Administration",
    sts_abbr:"OCA",
    category:"Judicial",
    // OCA IT: LBE Art. IV. Information Resources strategy.
    // HB500 funded major IT items: Appellate CMS $11.9M + Specialty Courts $3.9M.
    // Capital rider operational: ~$4M/year. Total including HB500 exceptional items: ~$10M/year.
    fy26_budget: 10, fy27_budget: 10, budget_confirmed: false,
    budget_source: "LBE Art. IV, OCA capital budget rider (~$4M/yr) plus HB500 exceptional items: Appellate CMS $11.9M + Specialty Courts $3.9M = $15.8M. Spread over FY26 (~$10M/yr) and FY27. Total ~$10M/year.",
    initiatives:[
      "Appellate court case management — cloud-based replacement ($11.9M HB500)",
      "Specialty court tracking system — 200+ specialty courts ($3.9M HB500)",
      "E-filing expansion statewide",
      "Court backlog data and analytics platform",
      "Judicial IT infrastructure one-time investment",
    ],
    strategic_plan:"Judicial IT modernization; e-filing; data infrastructure; accessibility; court backlog reduction",
    tech_areas:["Case Management","Modernization","Digital / Portals","Data & Analytics","Cloud"],
    sb1_items:[
      { section:"Art. I, OCA Rider 5", type:"Rider", description:"Court Technology — one-time IT investment must be spent within biennium; DIR cooperative contracts required", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 8.24", type:"Exceptional Item — HB500", description:"Appellate Court Case Management System — $11.9M cloud-based replacement for TX Supreme Court, Court of Criminal Appeals, and all 15 Courts of Appeals", amount:11.9, fy:"2025-26" },
      { section:"Sec. 8.25", type:"Exceptional Item — HB500", description:"Specialty Court Case Management — $3.9M for 200+ specialty court dockets (drug, veterans, mental health courts)", amount:3.9, fy:"2025-26" },
    ],
    exceptional_items:[
      { item_num:1, title:"Appellate Court Cloud CMS", status:"Funded via HB500", amount:11.9, description:"Cloud-based system replacing vulnerable legacy platform at Supreme Court and all 15 Courts of Appeals" },
      { item_num:2, title:"Specialty Court Tracking System", status:"Funded via HB500", amount:3.9, description:"200+ specialty courts — standardizing data collection and outcome reporting" },
    ],
  },

  // ── EXECUTIVE ───────────────────────────────────────────────────────────────

  {
    id:"gov", abbr:"GOV", num:"301",
    name:"Office of the Governor",
    customer_name:"Office of the Governor",
    sts_abbr:"GOV",
    category:"Executive",
    // Governor's office IT: LBE Art. I. Small operational IT. ~$5M/year.
    fy26_budget: 5, fy27_budget: 5, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. I, Office of the Governor Information Resources strategy.",
    initiatives:[
      "Enterprise IT modernization for executive office",
      "Cybersecurity improvements",
      "Digital communications platform",
      "Grants management system (Criminal Justice Division, Border Security)",
    ],
    strategic_plan:"IT modernization; cybersecurity; digital communications; grants management",
    tech_areas:["Modernization","Cybersecurity","Digital / Portals"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"tfc", abbr:"TFC", num:"303",
    name:"Texas Facilities Commission",
    customer_name:"Texas Facilities Commission",
    sts_abbr:"TFC",
    category:"Operations",
    // TFC IT: LBE Art. I. Facilities management systems. ~$4M/year.
    fy26_budget: 4, fy27_budget: 4, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. I, TFC Information Resources strategy and facilities management systems capital rider.",
    initiatives:[
      "Facilities management information system (FAMIS) modernization",
      "Building automation systems integration",
      "Asset management platform",
      "Space planning data analytics",
      "Energy management systems",
    ],
    strategic_plan:"Facilities management modernization; building automation; asset management; space analytics; energy efficiency",
    tech_areas:["Modernization","Data & Analytics","Infrastructure"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"sao", abbr:"SAO", num:"308",
    name:"State Auditor's Office",
    customer_name:"Texas State Auditor's Office",
    sts_abbr:"SAO",
    category:"Finance & Regulatory",
    fy26_budget: 4, fy27_budget: 4, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. I, SAO Information Resources strategy.",
    initiatives:[
      "Audit management system modernization",
      "Data analytics for fraud detection",
      "Cybersecurity auditing tools",
      "Agency website compliance review tools (HB 5195)",
    ],
    strategic_plan:"Audit modernization; fraud analytics; cybersecurity auditing; transparency reporting; HB 5195 oversight",
    tech_areas:["Modernization","Data & Analytics","Cybersecurity"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  // ── VETERANS ────────────────────────────────────────────────────────────────

  {
    id:"tvc", abbr:"TVC", num:"403",
    name:"Texas Veterans Commission",
    customer_name:"Texas Veterans Commission",
    sts_abbr:"TVC",
    category:"Veterans",
    fy26_budget: 4, fy27_budget: 4, budget_confirmed: false,
    budget_source: "Estimated from LBE Art. I, TVC Information Resources strategy.",
    initiatives:[
      "Veterans case management system modernization",
      "Online benefits application portal",
      "Claims tracking and status portal",
      "Cybersecurity for veteran data",
    ],
    strategic_plan:"Veterans services digitization; case management; benefits portal; claims tracking; cybersecurity",
    tech_areas:["Case Management","Digital / Portals","Modernization","Cybersecurity"],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"vlb", abbr:"VLB