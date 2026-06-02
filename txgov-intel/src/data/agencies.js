// Texas State Agency IT Intelligence Data
// Sources: SB1 89th Legislature GAA 2026-27, LBE by Strategy Arts I-X (LBB Jan 2025),
//   HB500 (enacted June 22 2025), LBB Conference Committee Issue Dockets (Arts I-VIII),
//   Agency LARs FY2026-27, DIR Agency Strategic Plan FY2025-2029, HB150 (TXCC)
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
  "Health & Human Services","Transportation & Infrastructure","Public Safety & Law",
  "Education","Finance & Regulatory","Technology & Operations","Environment & Resources",
  "Judicial","Legislative","Executive","Higher Education","Veterans","Operations",
];

// tech_areas format: { label, why, source, budget_note }
// why: specific language from LAR, strategic plan, or appropriations tied to THIS tag only
// source: document citation
// budget_note: dollar amount/rider specifically for this tag's work (optional)

export const AGENCIES = [

  // ── TECHNOLOGY & OPERATIONS ─────────────────────────────────────────────────

  {
    id:"dir", abbr:"DIR", num:"313",
    name:"Department of Information Resources",
    customer_name:"Texas Department of Information Resources",
    sts_abbr:null, category:"Technology & Operations",
    fy26_budget:28.6, fy27_budget:28.4, budget_confirmed:true,
    budget_source:"LBB HAC Summary Agency 313: GR governance $57.1M biennium. STS ($1,048.4M biennium) and TEX-AN/CCTS ($231.9M biennium) are cost-recovery, not GR appropriation.",
    initiatives:[
      "Statewide Technology Center (STC) — cloud, compute, storage shared services",
      "TEX-AN next-generation telecom procurement",
      "Texas Cyber Command (TXCC) transition — DIR assumes policy/governance role",
      "2026-2030 State Strategic Plan for Information Resources Management",
      "AI governance framework — TRAIGA implementation and Code of Ethics",
      "Cooperative contracts portfolio — $5B+ annual procurement volume",
      "DIR Website Modernization and Digital Accessibility (HB 5195)",
    ],
    strategic_plan:"2026-2030 SSP: digital accessibility; secure IAM; AI governance; TXCC transition; broadband connectivity",
    tech_areas:[
      { label:"Cybersecurity", why:"DIR is transitioning cybersecurity operational authority to TXCC by Aug 31 2026 per SB1 Art. IX Sec. 9.02. During transition DIR maintains statewide managed security services, Shared Technology Center security operations, and the cybersecurity baseline program for all state agencies.", source:"SB1 Art. IX Sec. 9.02; DIR Strategic Plan FY2025-29", budget_note:"Security services included in $1,048.4M biennium STC cost recovery" },
      { label:"Cloud", why:"DIR operates the Statewide Technology Center (STC) providing cloud, compute, and storage shared services to 200+ state agencies. STC budget is $1,048.4M biennium (cost recovery from agencies). DIR is migrating STC workloads to hybrid cloud under the 2026-2030 SSP.", source:"LBB HAC Summary Agency 313; DIR Strategic Plan FY2025-29", budget_note:"$1,048.4M biennium STC cost recovery (not GR appropriation)" },
      { label:"Identity & Access", why:"DIR's 2026-2030 State Strategic Plan identifies 'secure IAM' as a statewide priority. DIR is building a centralized credential and identity management framework for state employees and citizen-facing services.", source:"DIR State Strategic Plan for Information Resources 2026-2030", budget_note:"Included in DIR GR governance appropriation $28.6M/yr" },
      { label:"AI / Automation", why:"DIR leads TRAIGA (Texas Responsible AI Governance Act) implementation. Required to publish AI Code of Ethics, maintain statewide AI inventory, and provide compliance guidance to all agencies. Every agency AI deployment requires DIR review.", source:"TRAIGA (89th Leg.); DIR Strategic Plan FY2025-29", budget_note:"Included in DIR GR governance appropriation" },
      { label:"Infrastructure", why:"DIR's STC provides mainframe, server, network, data center, print/mail services statewide. The STC is the largest shared IT infrastructure program in Texas government.", source:"LBB HAC Summary Agency 313", budget_note:"STC $1,048.4M biennium cost recovery" },
      { label:"Digital / Portals", why:"DIR operates Texas.gov — the statewide citizen services portal. HB 5195 (89th Leg.) mandates all state agency websites meet WCAG 2.1 accessibility standards by Aug 31 2026; DIR leads compliance.", source:"HB 5195 (89th Leg.); LBB HAC Summary Agency 313", budget_note:"Texas.gov ~$108M biennium cost recovery" },
    ],
    sb1_items:[
      { section:"Art. I, DIR Rider 2", type:"Capital Budget", description:"Acquisition of Information Resource Technologies — $23.4M FY26, $22.9M FY27 for DIR IT modernization", amount:46.3, fy:"2026-27" },
      { section:"Art. IX, Sec. 9.01", type:"General Provision", description:"Statewide Technology Center — agencies must use DIR STC unless exempted", amount:null, fy:"2026-27" },
      { section:"Art. IX, Sec. 9.02", type:"General Provision", description:"Cybersecurity — TXCC to assume operational authority from DIR by Dec 2026", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 8.08", type:"Exceptional Item", description:"Cybersecurity tools and managed services expansion", amount:7.5, fy:"2025-26" },
    ],
    exceptional_items:[
      { item_num:1, title:"Cybersecurity Tools Expansion", status:"Funded via HB500", amount:7.5, description:"$7.5M for expanded managed security services" },
    ],
  },

  {
    id:"txcc", abbr:"TXCC", num:"371",
    name:"Texas Cyber Command",
    customer_name:"Texas Cyber Command",
    sts_abbr:"TXCC", category:"Technology & Operations",
    fy26_budget:60.5, fy27_budget:75.0, budget_confirmed:true,
    budget_source:"HB150 (89th Leg.) fiscal note — $135.5M biennium. FY26: $60.5M including $25M SOC facility. FY27: $75M full ramp.",
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
    tech_areas:[
      { label:"Cybersecurity", why:"TXCC is the entire agency's mission. HB150 appropriated $135.5M biennium to build Texas's first dedicated cybersecurity command. Responsibilities include: SOC operations, Cyber Threat Intelligence Center, Digital Forensics Lab, 24/7 incident response hotline, and whole-of-state outreach to local governments and school districts.", source:"HB150 (89th Leg.); SB1 Art. IX Sec. 9.02", budget_note:"$60.5M FY26 / $75M FY27 — entire agency is IT/cyber" },
      { label:"Infrastructure", why:"TXCC is constructing a $60.4M capital facility in San Antonio including a SCIF, SOC floor, Digital Forensics Lab, and Cyber Threat Intelligence Center. This physical infrastructure underpins all cyber operations.", source:"HB150 fiscal note (LBB); SB1 capital appropriation", budget_note:"$60.4M capital facility: $25M FY26 + $35.4M FY27" },
    ],
    sb1_items:[
      { section:"Art. IX / HB150", type:"New Agency Appropriation", description:"$135.5M biennium — SOC facility ($60.4M capital), personnel (65→130 FTE), Cyber Threat Intelligence Center, Digital Forensics Lab, 24/7 incident response", amount:135.5, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[],
  },

  // ── HEALTH & HUMAN SERVICES ─────────────────────────────────────────────────

  {
    id:"hhsc", abbr:"HHSC", num:"529",
    name:"Health and Human Services Commission",
    customer_name:"Texas Health and Human Services Commission",
    sts_abbr:"HHS", category:"Health & Human Services",
    fy26_budget:550, fy27_budget:550, budget_confirmed:true,
    budget_source:"SB1 Art. II, HHSC Rider 2 — ~$1.1B biennium. Breakdown: MMIS ~$474M biennium, TIERS ~$246M biennium, data center, CAPPS, WIC EBT, cybersecurity.",
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
    tech_areas:[
      { label:"Modernization", why:"HHSC Rider 2 appropriates ~$1.1B biennium for IT capital. The two flagship modernization projects are: MMIS (Medicaid Management Information System) replacement at ~$474M biennium — a federal CMS-mandated overhaul replacing the aging claims processing system; and TIERS (Texas Integrated Eligibility Redesign System) at ~$246M biennium — modernizing how 7.5M Texans apply for SNAP, Medicaid, CHIP, and TANF.", source:"SB1 Art. II HHSC Rider 2; SB1 Art. II Rider 78 (TIERS); Rider 81 (MMIS)", budget_note:"~$474M biennium MMIS + ~$246M biennium TIERS = ~$720M of $1.1B total" },
      { label:"Legacy Replacement", why:"TIERS was originally built in the late 1990s and has been in continuous operation for 25+ years. The current modernization effort replaces the eligibility determination core, moving from a mainframe-based architecture to a modern cloud-native platform. MMIS similarly replaces a legacy claims processing system that predates current federal standards.", source:"HHSC LAR FY2026-27; LBB Issue Docket Art. II", budget_note:"Combined $720M biennium for these two legacy replacements" },
      { label:"Case Management", why:"TIERS redesign includes a complete overhaul of case worker tooling — mobile-accessible interfaces, automated case routing, and AI-assisted eligibility determination (human-in-loop required per Rider 15). The system handles 7.5M Texans monthly across SNAP, Medicaid, CHIP, and TANF.", source:"SB1 Art. II HHSC Rider 78; DFPS Rider 15 (AI requirement)", budget_note:"Included in TIERS ~$246M biennium" },
      { label:"ERP / Financial", why:"HHSC is the steward of CAPPS (Centralized Accounting and Payroll/Personnel System) for all HHS agencies. CAPPS upgrades are included in Rider 2 capital budget to maintain federal audit compliance and integrate with modernized eligibility systems.", source:"SB1 Art. II HHSC Rider 2; CPA Rider 9 (CAPPS stewardship)", budget_note:"Included in Rider 2 $1.1B biennium" },
      { label:"Cloud", why:"HHSC's data center consolidation strategy moves workloads to DIR's Statewide Technology Center. MMIS and TIERS replacements are both designed as cloud-native systems, eliminating on-premise infrastructure.", source:"HHSC LAR FY2026-27; DIR STC framework", budget_note:"Data center consolidation included in Rider 2" },
      { label:"AI / Automation", why:"HHSC is piloting AI-enabled case triage in TIERS under TRAIGA compliance requirements. Per SB1 Rider, any AI-assisted eligibility determination requires human caseworker approval. HHSC LAR identifies AI for fraud detection in Medicaid claims as a priority.", source:"SB1 Art. II HHSC Rider 15 (AI human-in-loop); TRAIGA; HHSC LAR FY2026-27", budget_note:"AI pilots included in TIERS modernization budget" },
      { label:"Cybersecurity", why:"Rider 2 includes cybersecurity uplift as a named component. HHSC protects PHI for 7.5M Texans across 200 programs — among the largest state PHI custodians in the country. Managed security services are procured through DIR.", source:"SB1 Art. II HHSC Rider 2; HHSC LAR FY2026-27", budget_note:"Cybersecurity component within Rider 2 $1.1B biennium" },
      { label:"Infrastructure", why:"HHSC is consolidating its distributed data center footprint into DIR's STC. This includes migrating MMIS, TIERS, and legacy benefits systems off agency-owned hardware.", source:"HHSC LAR FY2026-27; DIR STC consolidation framework", budget_note:"Data center consolidation within Rider 2" },
    ],
    sb1_items:[
      { section:"Art. II, HHSC Rider 2", type:"Capital Budget", description:"Acquisition of Information Resource Technologies — ~$1.1B biennium: MMIS, TIERS, data center, CAPPS, WIC EBT, cybersecurity", amount:1100, fy:"2026-27" },
      { section:"Art. II, HHSC Rider 78", type:"Rider", description:"TIERS Modernization — quarterly LBB reporting on milestones, expenditures, vendor performance. Federal CMS coordination required.", amount:null, fy:"2026-27" },
      { section:"Art. II, HHSC Rider 81", type:"Rider", description:"MMIS Modernization — federal CMS approval must be maintained; annual reporting on system uptime and claims accuracy rates", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"MMIS Phase 2 Continuation", status:"Fully Funded", amount:474, description:"Biennium total for MMIS replacement." },
      { item_num:2, title:"TIERS Eligibility Redesign", status:"Fully Funded", amount:246, description:"SNAP, Medicaid, CHIP, TANF modernization. Biennium total." },
    ],
  },

  {
    id:"dfps", abbr:"DFPS", num:"530",
    name:"Dept of Family & Protective Services",
    customer_name:"Texas Department of Family and Protective Services",
    sts_abbr:"DFPS", category:"Health & Human Services",
    fy26_budget:30, fy27_budget:30, budget_confirmed:false,
    budget_source:"Estimated. State IT capital rider ~$30M/yr. Federal CCWIS match ~50% adds ~$30M more.",
    initiatives:[
      "CCWIS replacement — ~20 subprojects, federal ACF IAPD required",
      "AI-assisted case triage and risk assessment (human-in-loop per Rider 15)",
      "Mobile worker tools — tablets and offline-capable field applications",
      "Provider portal modernization and credentialing",
      "Interoperability with HHSC eligibility systems",
    ],
    strategic_plan:"Child welfare system modernization; AI case management with human oversight; CCWIS federal compliance; HHSC interoperability",
    tech_areas:[
      { label:"Case Management", why:"DFPS's CCWIS (Comprehensive Child Welfare Information System) replacement is the largest IT project in agency history. Approximately 20 subprojects are being implemented over the biennium. The system tracks child welfare cases, investigations, placements, and court proceedings for all children in state care.", source:"SB1 Art. II DFPS Rider 14; DFPS LAR FY2026-27", budget_note:"Federal ACF 50% match applies; state share ~$30M/yr" },
      { label:"Modernization", why:"DFPS is replacing the legacy IMPACT case management system (built in the 1990s) with CCWIS — a modular, API-first architecture. The ACF requires CCWIS compliance as a condition of federal Title IV-E funding.", source:"SB1 Art. II DFPS Rider 14; federal ACF IAPD requirement", budget_note:"CCWIS state share ~$30M/yr; federal match ~50%" },
      { label:"AI / Automation", why:"SB1 Art. II DFPS Rider 15 specifically governs AI in child welfare: 'A human caseworker must approve any AI-assisted removal decision; annual bias audit required.' DFPS is piloting AI-assisted risk scoring for case triage — the rider ensures human oversight of all AI recommendations.", source:"SB1 Art. II DFPS Rider 15 (exact rider language)", budget_note:"AI pilots within CCWIS modernization budget" },
      { label:"Data & Analytics", why:"DFPS is building a unified data platform to integrate CCWIS with HHSC eligibility data, court systems, and law enforcement records. This supports earlier identification of at-risk children and cross-agency service coordination.", source:"DFPS LAR FY2026-27; DFPS Strategic Plan FY2025-29", budget_note:"Data integration within CCWIS subprojects" },
      { label:"Legacy Replacement", why:"IMPACT (Information Management Protecting Adults and Children in Texas) was built in the 1990s and is being fully replaced by CCWIS. The legacy system cannot meet federal data exchange standards required by the Family First Prevention Services Act.", source:"DFPS LAR FY2026-27; federal Family First Act compliance", budget_note:"Full IMPACT decommission targeted by biennium end" },
    ],
    sb1_items:[
      { section:"Art. II, DFPS Rider 14", type:"Rider", description:"CCWIS Implementation — federal ACF IAPD required; quarterly LBB progress reports; federal cost share applies", amount:null, fy:"2026-27" },
      { section:"Art. II, DFPS Rider 15", type:"Rider", description:"AI in Child Welfare — human caseworker must approve any AI-assisted removal decision; annual bias audit required", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"CCWIS System Replacement", status:"Fully Funded", amount:45, description:"State share of CCWIS replacement; federal match ~50%. ~20 subprojects phased over biennium." },
    ],
  },

  {
    id:"twc", abbr:"TWC", num:"320",
    name:"Texas Workforce Commission",
    customer_name:"Texas Workforce Commission",
    sts_abbr:"TWC", category:"Health & Human Services",
    fy26_budget:62, fy27_budget:40, budget_confirmed:false,
    budget_source:"LBE Art VII Info Tech strategy $31.5M FY26 + capital rider $6M + federal UI CRM build $25M (one-time FY26). FY27 lower as build completes.",
    initiatives:[
      "AI deployment across 150+ operational areas — TRAIGA compliant",
      "New CRM platform — unified customer hub with AI chat and live agent",
      "Unemployment insurance claims digitization and automation",
      "Civil rights case review automation",
      "Legislative analysis AI tool deployment",
    ],
    strategic_plan:"AI-first operations; customer experience; workflow automation; call center modernization; TRAIGA compliance",
    tech_areas:[
      { label:"AI / Automation", why:"TWC's FY2026-27 LAR documents AI deployment across 150+ operational areas — the broadest AI adoption scope of any Texas state agency. Use cases include: unemployment claims fraud detection, civil rights case triage, legislative analysis, and customer service automation. All deployments require TRAIGA compliance with annual bias assessments per SB1 Rider 18.", source:"TWC LAR FY2026-27; SB1 Art. VII TWC Rider 18 (TRAIGA compliance)", budget_note:"AI across existing IT strategy budget ~$31.5M/yr" },
      { label:"Call Center / CRM", why:"TWC is building a new unified CRM platform to replace fragmented legacy contact center systems. The FY26 capital includes $25M (one-time) for platform build. The system will handle UI claims status inquiries, employer services, workforce program enrollment, and civil rights complaints through a single AI-powered routing engine.", source:"TWC LAR FY2026-27; LBE Art. VII Info Tech strategy", budget_note:"$25M one-time federal CRM build FY26; $6M/yr ongoing capital" },
      { label:"Modernization", why:"TWC's IT strategy includes replacement of aging unemployment insurance (UI) claims processing infrastructure. The legacy UI system dates to the 1990s and experienced capacity failures during COVID-19. Modernization is funded through a combination of state capital and federal UI administration grants.", source:"TWC LAR FY2026-27; federal USDOL UI administration grant", budget_note:"UI modernization within $31.5M/yr IT strategy" },
      { label:"Digital / Portals", why:"WorkInTexas.com, the state's job matching portal, is under active modernization. TWC's LAR identifies digital self-service expansion as a key goal — targeting 80%+ of UI transactions completed online without agent intervention by end of biennium.", source:"TWC LAR FY2026-27; TWC Strategic Plan FY2025-29", budget_note:"Portal modernization within IT strategy" },
      { label:"Data & Analytics", why:"TWC manages labor market data for all Texas counties. The agency is building a unified data analytics platform to support labor market forecasting, program outcome measurement, and USDOL performance reporting.", source:"TWC LAR FY2026-27", budget_note:"Data platform within IT strategy" },
    ],
    sb1_items:[
      { section:"Art. VII, TWC Rider 18", type:"Rider", description:"AI Deployment — TRAIGA compliance required; annual inventory of AI-assisted decisions, accuracy rates, bias assessments", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"CRM & Call Center Platform", status:"Fully Funded", amount:22, description:"Unified CRM replacing fragmented legacy contact center systems; AI-powered routing" },
    ],
  },

  // ── TRANSPORTATION & INFRASTRUCTURE ─────────────────────────────────────────

  {
    id:"txdot", abbr:"TxDOT", num:"601",
    name:"Department of Transportation",
    customer_name:"Texas Department of Transportation",
    sts_abbr:"TxDOT", category:"Transportation & Infrastructure",
    fy26_budget:83.7, fy27_budget:83.7, budget_confirmed:true,
    budget_source:"SB1 Art. VII, TxDOT Rider 2 — $83.7M FY26 + $83.7M FY27 = $167.4M biennium confirmed. Operational IR strategy ~$42M/yr and district IT ~$55M/yr not captured.",
    initiatives:[
      "Legacy mainframe replacement — core transportation management systems",
      "Data center upgrades statewide across district offices",
      "Enterprise Information Management (EIM) platform",
      "Cybersecurity hardening — zero trust architecture",
      "AI adoption roadmap — TRAIGA compliance (FY26 update)",
      "Connected vehicle and smart infrastructure pilots",
    ],
    strategic_plan:"Digital-first infrastructure; AI in operations & safety; data integration; connected infrastructure; TRAIGA compliance",
    tech_areas:[
      { label:"Legacy Replacement", why:"TxDOT's capital rider ($83.7M/yr) is primarily dedicated to replacing mainframe-based transportation management systems that date to the 1970s-1980s. These systems manage project tracking, contract management, financial reporting, and right-of-way records across 25 district offices. TxDOT's LAR identified mainframe replacement as its #1 IT exceptional item.", source:"TxDOT LAR FY2026-27; SB1 Art. VII TxDOT Rider 2", budget_note:"Majority of $83.7M/yr capital rider" },
      { label:"Modernization", why:"TxDOT is building an Enterprise Information Management (EIM) platform to replace siloed district-level systems with a unified data architecture. This includes project management, financial systems, and maintenance management across all 25 districts and 80+ offices.", source:"TxDOT LAR FY2026-27; TxDOT Strategic Plan FY2025-29", budget_note:"EIM within $83.7M/yr capital rider" },
      { label:"Cybersecurity", why:"TxDOT Rider 44 requires annual AI and cybersecurity governance reporting. TxDOT is implementing zero trust architecture across its 80+ facilities, which include safety-critical traffic management systems and bridge monitoring infrastructure.", source:"SB1 Art. VII TxDOT Rider 44; TxDOT LAR FY2026-27", budget_note:"Cybersecurity within capital rider; zero trust architecture rollout" },
      { label:"AI / Automation", why:"SB1 TxDOT Rider 44 requires an annual AI inventory and risk assessment submitted to DIR. TxDOT's AI adoption roadmap (updated FY26 per TRAIGA) identifies use cases including: predictive maintenance on bridges and pavements, traffic incident detection, and permit processing automation.", source:"SB1 Art. VII TxDOT Rider 44; TRAIGA; TxDOT LAR FY2026-27", budget_note:"AI initiatives within operational IT budget" },
      { label:"Data & Analytics", why:"TxDOT manages the largest state agency dataset in Texas — over 100B records spanning 80,000 miles of highway. The EIM platform is designed to unify this data for performance measurement, federal FHWA reporting, and predictive analytics.", source:"TxDOT LAR FY2026-27; federal FHWA data requirements", budget_note:"Data infrastructure within EIM project" },
      { label:"Infrastructure", why:"TxDOT is upgrading network infrastructure across 25 district offices and 80+ maintenance facilities. This includes SD-WAN deployment, fiber connectivity to remote locations, and facility network security hardening.", source:"TxDOT LAR FY2026-27", budget_note:"Infrastructure within $83.7M/yr capital rider" },
    ],
    sb1_items:[
      { section:"Art. VII, TxDOT Rider 2", type:"Capital Budget", description:"$83.7M FY26 + $83.7M FY27 = $167.4M biennium. Mainframe replacement, data centers, cybersecurity, EIM, AI roadmap.", amount:167.4, fy:"2026-27" },
      { section:"Art. VII, TxDOT Rider 44", type:"Rider", description:"AI Governance — TRAIGA compliance required; annual AI inventory and risk assessment submitted to DIR", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"Legacy Mainframe Replacement", status:"Fully Funded", amount:45, description:"Multi-year mainframe replacement — transportation management and financial operations." },
    ],
  },

  {
    id:"txdmv", abbr:"TxDMV", num:"608",
    name:"Department of Motor Vehicles",
    customer_name:"Texas Department of Motor Vehicles",
    sts_abbr:"DMV", category:"Transportation & Infrastructure",
    fy26_budget:62.5, fy27_budget:62.5, budget_confirmed:true,
    budget_source:"SB1 Art. VII, TxDMV Rider 2 — $62.5M FY26 + $62.5M FY27 = $125M biennium confirmed. Entire capital budget dedicated to registration/title system replacement.",
    initiatives:[
      "Complete replacement of 30-year-old registration & title system — 20+ legacy apps",
      "Data infrastructure re-architecture — modern API-based cloud-native platform",
      "Digital-first service delivery — all DMV transactions online",
      "Dealer management portal modernization",
      "Fraud detection analytics",
    ],
    strategic_plan:"Legacy elimination; digital transformation; customer-facing portals; data modernization; fraud prevention",
    tech_areas:[
      { label:"Legacy Replacement", why:"TxDMV's entire $125M biennium capital budget is dedicated to replacing a 30-year-old registration and title system — the largest single IT project in TxDMV history. The legacy system consists of 20+ separate applications and cannot support modern digital service delivery, mobile access, or real-time fraud detection. SB1 Rider 8 requires phased implementation with LBB approval for expenditures exceeding $25M per phase.", source:"SB1 Art. VII TxDMV Rider 2; TxDMV Rider 8 (phased implementation); TxDMV LAR FY2026-27", budget_note:"$125M biennium — 100% of capital budget" },
      { label:"Modernization", why:"The replacement system is being built as an API-first, cloud-native platform. This enables real-time integration with county tax assessor-collector offices (254 counties), dealer management systems, lienholders, and law enforcement. The new architecture will support future capabilities like mobile digital titles and connected vehicle registration.", source:"TxDMV LAR FY2026-27; TxDMV Strategic Plan FY2025-29", budget_note:"Within $125M biennium capital budget" },
      { label:"Digital / Portals", why:"A core goal of the replacement system is enabling 100% of DMV transactions online — eliminating in-office visits for registration renewal, title transfer, and dealer transactions. Current system limitations prevent certain title transactions from being done digitally.", source:"TxDMV LAR FY2026-27; TxDMV Strategic Plan FY2025-29", budget_note:"Digital transformation is primary project goal" },
      { label:"Data & Analytics", why:"The new platform includes a fraud detection analytics layer to identify fraudulent title applications, stolen vehicle registrations, and dealer violations. Current legacy system has no real-time analytics capability.", source:"TxDMV LAR FY2026-27", budget_note:"Analytics module within replacement platform" },
    ],
    sb1_items:[
      { section:"Art. VII, TxDMV Rider 2", type:"Capital Budget", description:"$125M biennium for complete replacement of registration and title system — 20+ legacy apps to unified cloud-native platform.", amount:125, fy:"2026-27" },
      { section:"Art. VII, TxDMV Rider 8", type:"Rider", description:"Phased implementation — LBB approval required for expenditures >$25M per phase; county tax assessor-collector coordination mandated", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"Registration & Title System Replacement", status:"Fully Funded", amount:125, description:"Ground-up replacement — 20+ legacy apps to unified cloud-native platform." },
    ],
  },

  // ── PUBLIC SAFETY & LAW ─────────────────────────────────────────────────────

  {
    id:"dps", abbr:"DPS", num:"405",
    name:"Department of Public Safety",
    customer_name:"Texas Department of Public Safety",
    sts_abbr:"DPS", category:"Public Safety & Law",
    fy26_budget:102, fy27_budget:85, budget_confirmed:false,
    budget_source:"DPS LAR: base IT strategy 5.1.2 = $57.4M FY26 (all funds). CC Docket adopted IT exceptional items: body cameras $11M, interoperability $9.9M, aircraft avionics $16.2M, EI#3 partial ~$44M FY26. FY27 lower as one-time items complete.",
    initiatives:[
      "Disaster recovery and technology modernization — 40+ end-of-life applications",
      "Driver's license system modernization — REAL ID and mobile ID",
      "Biometrics expansion — fingerprint and facial recognition integration",
      "Body worn cameras and in-car video — statewide unified solution",
      "Cybersecurity infrastructure — zero trust and cyber incident response team",
      "Data classification program — agency-wide data governance",
      "Computer aided dispatch (CAD) system for Texas Highway Patrol",
    ],
    strategic_plan:"Public safety data modernization; biometrics; real-time threat intel; cybersecurity; border technology; TRAIGA compliance",
    tech_areas:[
      { label:"Cybersecurity", why:"DPS EI #3 (Critical IT Infrastructure) included $13.5M biennium for 'Secure Data and Systems' — upgrading cybersecurity infrastructure and establishing a dedicated cyber incident response team (20 FTEs). Additionally $10M biennium for 'Data Classification Program' to implement agency-wide data governance. Both items were requested; Secure Data adopted, Classification pending HB500.", source:"DPS LAR FY2026-27 EI #3f and #3l; CC Art. V Docket (adopted amounts)", budget_note:"$13.5M biennium Secure Data; $10M biennium Data Classification" },
      { label:"Data & Analytics", why:"DPS EI #3a: 'Secure Crime Record Data & Systems' — $27.5M biennium, 52 FTEs to modernize CJIS crime records infrastructure. DPS is the state's central repository for criminal history, sex offender registry, and law enforcement data shared with 5,000+ agencies.", source:"DPS LAR FY2026-27 EI #3a; CJIS compliance requirements", budget_note:"$27.5M biennium, 52 FTEs" },
      { label:"Modernization", why:"DPS EI #3h: 'Disaster Recovery and Technology Modernization' — $97M biennium 'to modernize over 40 end-of-life applications' and implement offsite disaster recovery using cloud-based platforms. This is the largest single IT exceptional item in DPS history. Adopted to HB500.", source:"DPS LAR FY2026-27 EI #3h (exact language: 'over forty end-of-life applications'); CC Art. V Docket", budget_note:"$97M biennium — ADOPTED TO HB500" },
      { label:"AI / Automation", why:"DPS's AI adoption roadmap (TRAIGA-compliant, updated FY26) identifies facial recognition integration with biometrics, predictive patrol analytics, and automated threat detection as priority use cases. All AI deployments require annual bias audits.", source:"DPS LAR FY2026-27; TRAIGA compliance; DPS Strategic Plan", budget_note:"AI within existing operational strategy budget" },
      { label:"Legacy Replacement", why:"The 40+ end-of-life application modernization (EI #3h) includes replacing the legacy Driver License system (DL), which cannot natively support REAL ID, mobile ID, or digital credential standards. DPS LAR: 'The typical life span of IT infrastructure is now three to seven years; relying on outdated hardware may create multiple points of failure.'", source:"DPS LAR FY2026-27 (exact quote from Administrator's Statement); EI #3h and #3c", budget_note:"Within $97M biennium EI #3h (HB500)" },
      { label:"Infrastructure", why:"DPS EI #3b: 'Replace Aging Critical Technology' — $20M one-time to replace end-of-life infrastructure hardware. EI #3k: 'Multi-Directional External File Sharing Solution' — $900K for secure data exchange with federal law enforcement partners.", source:"DPS LAR FY2026-27 EI #3b and #3k", budget_note:"$20M one-time hardware replacement; $900K file sharing" },
    ],
    sb1_items:[
      { section:"Art. V, DPS Rider 2", type:"Capital Budget", description:"$91.8M biennium — driver's license system upgrade, threat detection analytics, biometrics expansion, cybersecurity improvements", amount:91.8, fy:"2026-27" },
      { section:"Art. V, DPS Rider 22", type:"Rider", description:"DL Modernization — REAL ID federal compliance must be maintained throughout transition; milestone reporting to LBB", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"EI #3h via HB500", type:"Exceptional Item", description:"Disaster Recovery & Technology Modernization — $97M biennium to modernize 40+ end-of-life applications and implement cloud-based disaster recovery", amount:97, fy:"2025-26" },
    ],
    exceptional_items:[
      { item_num:3, title:"Critical IT Infrastructure", status:"Partial — $97M DR/Modernization adopted to HB500; other items pending", amount:220.9, description:"Full EI #3 request: $220.9M biennium across 14 sub-items. Key adopted items: DR/Modernization $97M (HB500), Secure Data $13.5M." },
    ],
  },

  // ── EDUCATION ───────────────────────────────────────────────────────────────

  {
    id:"tea", abbr:"TEA", num:"701",
    name:"Texas Education Agency",
    customer_name:"Texas Education Agency",
    sts_abbr:"TEA", category:"Education",
    fy26_budget:47, fy27_budget:44, budget_confirmed:false,
    budget_source:"LBE Art III Strategy B.3.5 Info Systems ~$41.5M FY26. Capital rider ~$6M/yr additional.",
    initiatives:[
      "Student data system modernization — PEIMS replacement planning",
      "K-12 statewide cybersecurity program for school districts",
      "CCIAM identity & access management modernization",
      "Digital learning platform expansion",
      "Data accountability and performance reporting systems",
    ],
    strategic_plan:"Data-driven accountability; K-12 cybersecurity leadership; digital equity; identity management; educator tools",
    tech_areas:[
      { label:"Cybersecurity", why:"TEA leads K-12 cybersecurity for all Texas public school districts. SB1 TEA Rider 44 requires: (1) annual cyber threat report for school districts, (2) TXCC coordination for district incident response, and (3) cybersecurity training resources for district IT staff. This extends TEA's IT budget impact to 1,200+ school districts.", source:"SB1 Art. III TEA Rider 44; TXCC coordination framework", budget_note:"K-12 Cybersecurity Program ~$35M biennium" },
      { label:"Data & Analytics", why:"TEA's PEIMS (Public Education Information Management System) collects data on 5.5M+ students across 1,200+ districts. Current modernization planning targets replacement of PEIMS with a cloud-native data platform. TEA also operates the State Longitudinal Data System (SLDS) tracking student outcomes from PreK through workforce.", source:"TEA LAR FY2026-27; TEA Strategic Plan FY2025-29", budget_note:"Data systems within Info Systems strategy $41.5M FY26" },
      { label:"Identity & Access", why:"CCIAM (Centralized Credential and Identity Access Management) is TEA's major capital project — building a unified identity platform for 700,000+ Texas educators and administrators accessing TEA systems. SB1 funding: ~$25M biennium.", source:"SB1 Art. III capital rider; TEA LAR FY2026-27", budget_note:"CCIAM ~$25M biennium" },
      { label:"Digital / Portals", why:"TEA operates the Texas Education Portal (TEA Login), educator certification portal (ECOS), and school report card system. HB 5195 accessibility mandate applies to all TEA portals; TEA's LAR includes accessibility improvements across all citizen-facing systems.", source:"HB 5195 (89th Leg.); TEA LAR FY2026-27", budget_note:"Portal improvements within Info Systems strategy" },
      { label:"Modernization", why:"TEA is in planning phase for PEIMS modernization — replacing the 1980s-era student data collection system with a modern API-based platform. TEA LAR FY2026-27 identifies this as a multi-biennium effort requiring LBB approval before procurement.", source:"TEA LAR FY2026-27; LBB PEIMS modernization review", budget_note:"Planning phase; procurement in future biennium" },
    ],
    sb1_items:[
      { section:"Art. III, TEA Str. B.3.5", type:"IT Strategy Line", description:"Information Systems-Technology strategy — base IT operations and modernization", amount:null, fy:"2026-27" },
      { section:"Art. III, TEA Rider 44", type:"Rider", description:"K-12 Cybersecurity — annual threat report; TXCC coordination for district incident response", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"K-12 Cybersecurity Program", status:"Fully Funded", amount:35, description:"Statewide cybersecurity support for school districts. Biennium total." },
      { item_num:2, title:"CCIAM Identity Modernization", status:"Fully Funded", amount:25, description:"Centralized credential and identity management for educators statewide. Biennium total." },
    ],
  },

  // ── FINANCE & REGULATORY ────────────────────────────────────────────────────

  {
    id:"cpa", abbr:"CPA", num:"304",
    name:"Comptroller of Public Accounts",
    customer_name:"Texas Comptroller of Public Accounts",
    sts_abbr:"CPA", category:"Finance & Regulatory",
    fy26_budget:28, fy27_budget:28, budget_confirmed:false,
    budget_source:"Info Resources strategy ~$20M/yr + capital rider ~$8M/yr (CAPPS stewardship).",
    initiatives:[
      "CAPPS statewide financial system upgrades (ERP steward for all agencies)",
      "Revenue collection systems modernization",
      "Texas Transparency portal enhancement",
      "Cybersecurity for financial systems and taxpayer data",
      "Open data initiative expansion",
    ],
    strategic_plan:"Financial systems modernization; public transparency; data analytics; cybersecurity; statewide CAPPS stewardship",
    tech_areas:[
      { label:"ERP / Financial", why:"CPA is the statutory steward of CAPPS (Centralized Accounting and Payroll/Personnel System) — the statewide ERP used by 150+ agencies. SB1 CPA Rider 9 requires CPA to publish an annual CAPPS modernization roadmap and approve any agency-level CAPPS customizations. CAPPS upgrades are CPA's primary IT capital expenditure.", source:"SB1 Art. I CPA Rider 9 (CAPPS Stewardship); CPA LAR FY2026-27", budget_note:"CAPPS upgrades within ~$8M/yr capital rider" },
      { label:"Modernization", why:"CPA is modernizing its revenue collection systems — including sales tax, franchise tax, and motor fuels tax platforms. The legacy revenue systems predate modern API standards and cannot support real-time compliance data sharing with taxpayers.", source:"CPA LAR FY2026-27; CPA Strategic Plan FY2025-29", budget_note:"Revenue system modernization within capital rider" },
      { label:"Cybersecurity", why:"CPA holds tax and financial data for every Texas business and individual taxpayer. The agency's cybersecurity program includes annual penetration testing, SOC monitoring through DIR, and taxpayer data encryption standards.", source:"CPA LAR FY2026-27; DIR managed security services", budget_note:"Cybersecurity within operational IT budget" },
      { label:"Data & Analytics", why:"CPA's Texas Transparency portal (transparency.texas.gov) publishes all state expenditure data. SB1 CPA Rider 10 requires the portal to be updated within 30 days of fiscal year end and mandates inclusion of DIR cooperative contract spend data.", source:"SB1 Art. I CPA Rider 10 (Transparency Portal requirement)", budget_note:"Transparency portal within Info Resources strategy" },
      { label:"Digital / Portals", why:"CPA's eSystems portal handles $60B+ in annual tax filings and payments. The portal is undergoing a UX modernization to support mobile filing and reduce call center contacts.", source:"CPA LAR FY2026-27", budget_note:"eSystems portal within Info Resources strategy" },
    ],
    sb1_items:[
      { section:"Art. I, CPA Rider 9", type:"Rider", description:"CAPPS Stewardship — annual modernization roadmap required; agency CAPPS modifications require CPA approval", amount:null, fy:"2026-27" },
      { section:"Art. I, CPA Rider 10", type:"Rider", description:"Transparency Portal — updated within 30 days of FY-end; must include DIR cooperative contract spend data", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[],
  },

  {
    id:"oag", abbr:"OAG", num:"302",
    name:"Office of the Attorney General",
    customer_name:"Office of the Attorney General of Texas",
    sts_abbr:"OAG", category:"Finance & Regulatory",
    fy26_budget:15, fy27_budget:15, budget_confirmed:false,
    budget_source:"LBE Art I confirmed: Agency IT Projects strategy $0 FY26-27 (was $21M FY25 — projects complete). IT now embedded in operational strategies. Estimated ~$15M/yr ongoing.",
    initiatives:[
      "Case management system — post major IT projects phase",
      "eDiscovery platform operations and maintenance",
      "Cybersecurity for legal and law enforcement data",
      "E-filing expansion for consumer protection and child support",
    ],
    strategic_plan:"Legal tech modernization; data security; digital case management; e-filing; secure communications",
    tech_areas:[
      { label:"Case Management", why:"OAG manages the nation's largest child support program ($4.35B collected annually), requiring enterprise case management across 250+ attorneys and caseworkers. The major IT Projects strategy (E.1.1) funded $38.2M in FY23 and $21.1M in FY25 to modernize this system. Those projects are now complete — ongoing maintenance is embedded in operational strategies.", source:"LBE Art I OAG Strategy E.1.1 (confirmed $0 FY26-27; was $38.2M FY23)", budget_note:"Ongoing maintenance ~$15M/yr embedded in operational strategies" },
      { label:"Cybersecurity", why:"OAG holds highly sensitive law enforcement data, child support records, and Medicaid fraud investigation files. The agency's cybersecurity program is funded through the Legal Services strategy rather than a dedicated IT line, reflecting its operational integration.", source:"OAG LAR FY2026-27; OAG Strategic Plan FY2025-29", budget_note:"Embedded in Legal Services strategy" },
      { label:"Modernization", why:"OAG completed its major IT modernization cycle in FY2024-25 (funded by the $38.2M FY23 + $21.1M FY25 IT Projects strategy). The agency is now in an operations and maintenance phase with no major new IT capital projects requested for FY26-27.", source:"LBE Art I OAG Strategy E.1.1 confirmed $0 FY26-27", budget_note:"No new capital — maintenance mode FY26-27" },
      { label:"Digital / Portals", why:"OAG's eFile portal (child support payments, consumer protection complaints, public records requests) was part of the completed IT modernization. Ongoing enhancements to online service delivery are funded through operational budgets.", source:"OAG LAR FY2026-27", budget_note:"Portal maintenance within operational IT" },
    ],
    sb1_items:[
      { section:"Art. I, OAG Str. E.1.1", type:"IT Strategy", description:"Agency IT Projects — $0 in FY26-27 (was $21M FY25). Major projects completed; IT now embedded in operational strategies.", amount:0, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[],
  },

  {
    id:"trs", abbr:"TRS", num:"323",
    name:"Teacher Retirement System",
    customer_name:"Teacher Retirement System of Texas",
    sts_abbr:"TRS", category:"Finance & Regulatory",
    fy26_budget:7, fy27_budget:7, budget_confirmed:false,
    budget_source:"Pension admin modernization. Info Resources + capital rider ~$7M/yr.",
    initiatives:[
      "Pension administration system modernization",
      "Member self-service portal redesign",
      "Cybersecurity for member financial data — annual penetration test required",
      "Cloud migration for pension workloads",
    ],
    strategic_plan:"Benefits delivery modernization; member self-service; data security; cloud migration",
    tech_areas:[
      { label:"ERP / Financial", why:"TRS administers $200B+ in pension assets and pays monthly benefits to 450,000+ retirees. The core pension administration system handles actuarial calculations, benefit payments, and employer reporting for 2M active members. Modernization is focused on replacing aging core processing software.", source:"TRS LAR FY2026-27; TRS Strategic Plan FY2025-29", budget_note:"Core system within ~$7M/yr IT budget" },
      { label:"Modernization", why:"TRS is modernizing its member portal (MyTRS) and employer reporting portal to support self-service transactions, reducing call center volume. This includes mobile-first design, real-time benefit calculators, and automated employer contribution reporting.", source:"TRS LAR FY2026-27", budget_note:"Portal modernization within IT budget" },
      { label:"Digital / Portals", why:"The MyTRS member portal serves 2M active and retired members. Current functionality includes benefit estimates, service credit purchases, and document uploads. Modernization adds real-time benefit statements, mobile access, and automated beneficiary updates.", source:"TRS LAR FY2026-27; TRS Strategic Plan FY2025-29", budget_note:"MyTRS portal within IT budget" },
      { label:"Cybersecurity", why:"SB1 TRS Rider 12 specifically requires: 'annual third-party penetration test; results to Board of Trustees; 90-day remediation plan.' TRS protects financial and PII for 2M Texans, making it a high-value target. The rider reflects the Legislature's specific concern about pension system security.", source:"SB1 Art. I TRS Rider 12 (exact rider language)", budget_note:"Annual pentest required; within IT budget" },
      { label:"Cloud", why:"TRS is migrating pension administration workloads to cloud infrastructure via DIR STC. This supports disaster recovery requirements and reduces dependency on aging on-premise hardware.", source:"TRS LAR FY2026-27", budget_note:"Cloud migration within IT budget" },
    ],
    sb1_items:[
      { section:"Art. I, TRS Rider 12", type:"Rider", description:"Pension System Security — annual third-party penetration test required; results to Board of Trustees; 90-day remediation plan", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 1.01", type:"Pension Payment", description:"$1.02B lump sum to TRS legacy fund — saves $2.5B future interest; eliminates UAL by 2044. Not IT spending but reduces long-term benefit system stress.", amount:1020, fy:"2024-25" },
    ],
    exceptional_items:[],
  },

  // ── ENVIRONMENT & RESOURCES ─────────────────────────────────────────────────

  {
    id:"tceq", abbr:"TCEQ", num:"582",
    name:"Texas Commission on Environmental Quality",
    customer_name:"Texas Commission on Environmental Quality",
    sts_abbr:"TCEQ", category:"Environment & Resources",
    fy26_budget:25, fy27_budget:25, budget_confirmed:false,
    budget_source:"CC Art VI confirmed: DCS $12.2M/yr + Cybersecurity $5.1M/yr + Operational IR $8M/yr = ~$25M/yr.",
    initiatives:[
      "Environmental data management platform modernization",
      "Online permitting system — 90% of permits online per Rider 18",
      "Public reporting portal upgrades",
      "Data analytics for regulatory compliance monitoring",
      "Cloud adoption for environmental monitoring data",
      "Cybersecurity — $10.2M additional appropriated (Issue Docket confirmed)",
    ],
    strategic_plan:"Environmental data transparency; digital permitting; analytics; cloud adoption; regulatory efficiency",
    tech_areas:[
      { label:"Data & Analytics", why:"TCEQ manages environmental monitoring data for all Texas air, water, and waste permits. The agency is building a unified data platform replacing siloed permit-type databases. TCEQ's LAR identifies real-time compliance analytics as a priority — moving from periodic inspection to continuous data monitoring.", source:"TCEQ LAR FY2026-27; TCEQ Strategic Plan FY2025-29", budget_note:"Data platform within $8M/yr operational IR strategy" },
      { label:"Digital / Portals", why:"SB1 TCEQ Rider 18 mandates: '90% of new air, water, and waste permit applications must be processed online.' TCEQ is expanding its STEERS online permitting system to cover all permit types by August 2027.", source:"SB1 Art. VI TCEQ Rider 18 (exact rider requirement)", budget_note:"STEERS expansion within DCS and capital budget" },
      { label:"Modernization", why:"TCEQ received $24.4M biennium (CC Art. VI Issue Docket confirmed) for Data Center Services modernization — migrating from aging agency-owned data center to DIR STC. This is a direct confirmed appropriation from the conference committee.", source:"CC Art. VI Issue Docket (adopted): DCS $24.4M biennium", budget_note:"$24.4M biennium DCS — CONFIRMED" },
      { label:"Cloud", why:"TCEQ's data center consolidation moves environmental monitoring databases to DIR STC cloud infrastructure. This supports the online permitting mandate and real-time data analytics goals.", source:"CC Art. VI Issue Docket; TCEQ LAR FY2026-27", budget_note:"Within $24.4M biennium DCS" },
      { label:"Cybersecurity", why:"TCEQ received $10.2M biennium for cybersecurity and IT modernization (CC Art. VI Issue Docket confirmed). TCEQ holds sensitive data on industrial facilities — a target for both environmental activists and industrial espionage.", source:"CC Art. VI Issue Docket (adopted): Cybersecurity $10.2M biennium", budget_note:"$10.2M biennium — CONFIRMED" },
    ],
    sb1_items:[
      { section:"Art. VI, TCEQ Rider 18", type:"Rider", description:"Permitting Technology — 90% of new air, water, waste permit applications must be processed online", amount:null, fy:"2026-27" },
      { section:"Art. VI, TCEQ DCS Item", type:"Exceptional Item", description:"Data Center Services — $24.4M biennium (CC Art. VI confirmed)", amount:24.4, fy:"2026-27" },
      { section:"Art. VI, TCEQ Cyber Item", type:"Exceptional Item", description:"Cybersecurity and Modernization — $10.2M biennium (CC Art. VI confirmed)", amount:10.2, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"DCS Data Center Services", status:"Fully Funded", amount:24.4, description:"$24.4M biennium confirmed CC Art. VI" },
      { item_num:2, title:"Cybersecurity and IT Modernization", status:"Fully Funded", amount:10.2, description:"$10.2M biennium confirmed CC Art. VI" },
    ],
  },

  {
    id:"twdb", abbr:"TWDB", num:"580",
    name:"Texas Water Development Board",
    customer_name:"Texas Water Development Board",
    sts_abbr:"TWDB", category:"Environment & Resources",
    fy26_budget:7.5, fy27_budget:7.5, budget_confirmed:false,
    budget_source:"Info Resources strategy ~$5M/yr + capital rider ~$2.5M/yr.",
    initiatives:[
      "Water data analytics platforms for state water planning",
      "Grant management system for Texas Water Fund ($2.5B+)",
      "Cloud migration for water planning databases",
      "Public reporting portals for water data",
      "Cybersecurity for water infrastructure data",
    ],
    strategic_plan:"Water infrastructure data; digital grant management; analytics; cybersecurity; open data",
    tech_areas:[
      { label:"Data & Analytics", why:"TWDB manages the State Water Plan — a comprehensive 50-year water resource database covering every Texas county. The agency is building a new water data analytics platform to support real-time water availability tracking and drought modeling.", source:"TWDB LAR FY2026-27; TWDB Strategic Plan FY2025-29", budget_note:"Data platform within ~$7.5M/yr IT budget" },
      { label:"Cloud", why:"TWDB is migrating water planning databases to cloud infrastructure to support larger datasets from statewide water monitoring networks and improve public access to water data.", source:"TWDB LAR FY2026-27", budget_note:"Cloud migration within IT budget" },
      { label:"Cybersecurity", why:"TWDB manages data on Texas's critical water infrastructure — reservoirs, groundwater conservation districts, and water supply systems for 30M+ Texans. Protecting this infrastructure data from ransomware and adversarial attacks is a priority.", source:"TWDB LAR FY2026-27", budget_note:"Cybersecurity within IT budget" },
      { label:"Digital / Portals", why:"SB1 TWDB Rider 6 requires the Texas Water Fund grant management system to track all $2.5B+ Texas Water Fund expenditures in real-time. TWDB is building a public-facing portal for grant application, tracking, and reporting.", source:"SB1 Art. VI TWDB Rider 6 (exact rider requirement); HB500 Sec. 5.03 ($2.5B Texas Water Fund)", budget_note:"Grant portal within IT budget; $2.5B HB500 Water Fund drives requirements" },
    ],
    sb1_items:[
      { section:"Art. VI, TWDB Rider 6", type:"Rider", description:"Texas Water Fund Technology — grant management system must track all $2.5B+ Texas Water Fund expenditures in real-time", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 5.03", type:"Major Supplemental", description:"Texas Water Fund — $2.5B appropriated; TWDB grant management must scale", amount:2500, fy:"2024-25" },
    ],
    exceptional_items:[],
  },

  {
    id:"tpwd", abbr:"TPWD", num:"802",
    name:"Parks and Wildlife Department",
    customer_name:"Texas Parks and Wildlife Department",
    sts_abbr:"TPWD", category:"Environment & Resources",
    fy26_budget:9, fy27_budget:9, budget_confirmed:false,
    budget_source:"Info Resources strategy ~$6M/yr + capital rider ~$3M/yr.",
    initiatives:[
      "Online permitting & licensing platform modernization",
      "GIS and conservation data platform upgrades",
      "Customer experience portal — fishing, hunting, park reservations",
      "Cybersecurity across distributed field office network",
      "Wildlife management data analytics",
    ],
    strategic_plan:"Digital permitting; conservation data management; customer experience; cybersecurity; GIS modernization",
    tech_areas:[
      { label:"Digital / Portals", why:"SB1 TPWD Rider 11 requires 99.9% uptime SLA during peak periods (deer season open). TPWD's licensing portal processes millions of hunting and fishing licenses annually — peak load on opening day of deer season is among the highest of any state agency portal.", source:"SB1 Art. VI TPWD Rider 11 (exact uptime requirement)", budget_note:"Portal infrastructure within capital rider" },
      { label:"Modernization", why:"TPWD is replacing its legacy licensing and reservation system, which cannot handle modern payment processing or mobile access. The new platform integrates hunting licenses, fishing licenses, park reservations, and boat registrations in a single system.", source:"TPWD LAR FY2026-27; TPWD Strategic Plan FY2025-29", budget_note:"Licensing platform within ~$9M/yr IT budget" },
      { label:"Data & Analytics", why:"TPWD maintains GIS and conservation data for all Texas wildlife habitats, species populations, and park conditions. The agency is building improved analytics for wildlife population modeling and habitat conservation prioritization.", source:"TPWD LAR FY2026-27", budget_note:"GIS/analytics within IT budget" },
      { label:"Cybersecurity", why:"TPWD's distributed network of 80+ state parks, wildlife management areas, and field offices creates a broad attack surface. Cybersecurity upgrades focus on securing point-of-sale systems at park entrances and remote monitoring sensors.", source:"TPWD LAR FY2026-27", budget_note:"Cybersecurity within IT budget" },
    ],
    sb1_items:[
      { section:"Art. VI, TPWD Rider 11", type:"Rider", description:"Online Licensing — 99.9% uptime SLA required during peak periods (deer season open)", amount:null, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[],
  },

  {
    id:"tda", abbr:"TDA", num:"551",
    name:"Department of Agriculture",
    customer_name:"Texas Department of Agriculture",
    sts_abbr:"TDA", category:"Environment & Resources",
    fy26_budget:4, fy27_budget:4, budget_confirmed:true,
    budget_source:"CC Art VI confirmed: Cybersecurity $0.8M/yr + Computer Equipment $0.1M + Operational IR ~$2.5M/yr = ~$3.5-4M/yr.",
    initiatives:[
      "Cybersecurity and privacy program — $1.6M biennium (CC Art VI confirmed)",
      "Computer equipment modernization — laptop/mobile strategy",
      "Agricultural data management modernization",
      "Online licensing and inspection systems",
      "Food and nutrition program technology",
    ],
    strategic_plan:"Agricultural data modernization; digital licensing; food program technology; cybersecurity; mobile computing",
    tech_areas:[
      { label:"Cybersecurity", why:"CC Art. VI Issue Docket confirms $1.6M biennium for 'Cybersecurity and Privacy Resources' — specifically to hire 3-5 FTEs: a cybersecurity analyst and privacy analyst. This is a targeted hire to establish TDA's first dedicated cybersecurity function.", source:"CC Art. VI Issue Docket (adopted): TDA Item 6 — exact language: 'cybersecurity analyst and privacy analyst positions'", budget_note:"$1.6M biennium — CONFIRMED (CC Art. VI adopted)" },
      { label:"Modernization", why:"TDA is modernizing its online licensing system covering agricultural dealers, weights and measures inspectors, and food handler certifications. The agency is also updating food and nutrition program technology for school meal programs.", source:"TDA LAR FY2026-27", budget_note:"Within ~$4M/yr IT budget" },
      { label:"Digital / Portals", why:"TDA's eLicense portal handles licensing for 200+ agricultural business types. CC Art. VI Item 4 ($0.1M confirmed) provides for replacing desktop computers with laptops to support a mobile-first inspection workflow.", source:"CC Art. VI Issue Docket (adopted): TDA Item 4 — computer equipment", budget_note:"$0.1M confirmed for mobile computing transition" },
      { label:"Data & Analytics", why:"TDA manages data for agricultural commodity programs, farmer assistance programs, and food safety inspections across 30,000+ licensed facilities. Analytics modernization supports federal USDA reporting requirements.", source:"TDA LAR FY2026-27", budget_note:"Within IT budget" },
    ],
    sb1_items:[
      { section:"Art. VI, TDA Item 6", type:"Exceptional Item", description:"Cybersecurity and Privacy Resources — $1.6M biennium, 3-5 FTEs for cybersecurity analyst and privacy analyst positions", amount:1.6, fy:"2026-27" },
      { section:"Art. VI, TDA Item 4", type:"Exceptional Item", description:"Computer Equipment — $0.1M to replace desktops with laptops for mobile computing strategy", amount:0.1, fy:"2026-27" },
    ],
    hb500_items:[], exceptional_items:[
      { item_num:1, title:"Cybersecurity and Privacy Program", status:"Fully Funded", amount:1.6, description:"$1.6M biennium for cybersecurity/privacy analyst positions" },
    ],
  },

  // ── JUDICIAL ────────────────────────────────────────────────────────────────

  {
    id:"oca", abbr:"OCA", num:"212",
    name:"Office of Court Administration",
    customer_name:"Texas Office of Court Administration",
    sts_abbr:"OCA", category:"Judicial",
    fy26_budget:10, fy27_budget:6, budget_confirmed:false,
    budget_source:"LBE Art IV capital rider ~$4M/yr + HB500 exceptional items: Appellate CMS $11.9M + Specialty Courts $3.9M. FY26 high for build phase.",
    initiatives:[
      "Appellate court case management — cloud-based replacement ($11.9M HB500)",
      "Specialty court tracking system — 200+ specialty courts ($3.9M HB500)",
      "E-filing expansion statewide",
      "Court backlog data and analytics platform",
    ],
    strategic_plan:"Judicial IT modernization; e-filing; data infrastructure; accessibility; court backlog reduction",
    tech_areas:[
      { label:"Case Management", why:"HB500 Sec. 8.24 appropriated $11.9M for a cloud-based Appellate Court Case Management System replacing the vulnerable legacy platform at the Texas Supreme Court, Court of Criminal Appeals, and all 15 Courts of Appeals. HB500 Sec. 8.25 appropriated $3.9M for a Specialty Court Case Management System covering 200+ specialty court dockets (drug, veterans, mental health courts).", source:"HB500 Sec. 8.24 (Appellate CMS $11.9M); HB500 Sec. 8.25 (Specialty Courts $3.9M)", budget_note:"$11.9M + $3.9M = $15.8M — HB500 confirmed" },
      { label:"Modernization", why:"The appellate CMS replacement addresses a vulnerable legacy platform that is end-of-life and cannot support modern e-filing standards, remote access, or accessibility requirements. This is the first major judicial IT overhaul since the 1990s.", source:"HB500 Sec. 8.24; OCA LAR FY2026-27", budget_note:"$11.9M HB500 for cloud-based replacement" },
      { label:"Cloud", why:"Both the Appellate CMS and Specialty Court systems are being built as cloud-hosted platforms via DIR cooperative contracts, eliminating OCA's dependency on aging on-premise court servers at the Supreme Court building.", source:"HB500 Sec. 8.24; OCA LAR FY2026-27", budget_note:"Cloud-native architecture requirement in procurement" },
      { label:"Digital / Portals", why:"OCA is expanding e-filing to all district and county courts. The appellate CMS replacement includes a public-facing portal for attorneys, litigants, and press to access court records and case status.", source:"OCA LAR FY2026-27; SB1 Art. I OCA Rider 5", budget_note:"E-filing expansion within capital rider" },
      { label:"Data & Analytics", why:"OCA is building a court backlog analytics platform to track case aging, disposition rates, and court capacity across all Texas courts — supporting the Legislature's judicial efficiency initiatives.", source:"OCA LAR FY2026-27; judicial efficiency rider language", budget_note:"Analytics within capital rider" },
    ],
    sb1_items:[
      { section:"Art. I, OCA Rider 5", type:"Rider", description:"Court Technology — one-time IT investment must be spent within biennium; DIR cooperative contracts required", amount:null, fy:"2026-27" },
    ],
    hb500_items:[
      { section:"Sec. 8.24", type:"Exceptional Item — HB500", description:"Appellate Court CMS — $11.9M cloud-based replacement for TX Supreme Court, Court of Criminal Appeals, and all 15 Courts of Appeals", amount:11.9, fy:"2025-26" },
      { section:"Sec. 8.25", type:"Exceptional Item — HB500", description:"Specialty Court Case Management — $3.9M for 200+ specialty court dockets (drug, veterans, mental health courts)", amount:3.9, fy:"2025-26" },
    ],
    exceptional_items:[
      { item_num:1, title:"Appellate Court Cloud CMS", status:"Funded via HB500", amount:11.9, description:"Cloud-based system replacing legacy platform at Supreme Court and all 15 Courts of Appeals" },
      { item_num:2, title:"Specialty Court Tracking System", status:"Funded via HB500", amount:3.9, description:"200+ specialty courts — standardized data collection and outcome reporting" },
    ],
  },

  // ── HIGHER EDUCATION ────────────────────────────────────────────────────────
  {
    id:"tamus", abbr:"TAMUS", num:"710",
    name:"Texas A&M University System",
    customer_name:"Texas A&M University System",
    sts_abbr:"TAMUS", category:"Higher Education",
    fy26_budget:null, fy27_budget:null, budget_confirmed:false,
    budget_source:"Higher education IT budgets tracked separately from state GR capital. Included for DIR coop and STS spend monitoring only.",
    initiatives:["Enterprise systems modernization","TAMU Cybersecurity Center","Research computing (ACES, FASTER, Grace HPC)","Cloud migration","AI research computing"],
    strategic_plan:"Enterprise modernization; cybersecurity shared services; research computing; cloud; AI for research",
    tech_areas:[
      { label:"Modernization", why:"TAMU System is modernizing enterprise administrative systems across 11 universities — consolidating ERP, HR, and student information systems onto shared platforms.", source:"TAMUS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately from GAA" },
      { label:"Cybersecurity", why:"TAMU operates one of the largest university cybersecurity centers in the country, providing shared SOC services for 11 campuses.", source:"TAMUS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
      { label:"Cloud", why:"TAMU System is migrating administrative workloads to cloud infrastructure and building research cloud platforms for computational science.", source:"TAMUS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
      { label:"Infrastructure", why:"TAMU operates ACES, FASTER, and Grace HPC clusters — among the fastest academic supercomputers in Texas, supporting federally funded research programs.", source:"TAMUS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
      { label:"AI / Automation", why:"TAMU is a national leader in AI research and is building AI research computing platforms including GPU clusters for large language model training.", source:"TAMUS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
      { label:"Data & Analytics", why:"TAMU manages research data repositories for 11 universities plus AgriLife, Engineering Extension, and other system components.", source:"TAMUS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
    ],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

  {
    id:"uts", abbr:"UTS", num:"720",
    name:"University of Texas System",
    customer_name:"University of Texas System",
    sts_abbr:"UTS", category:"Higher Education",
    fy26_budget:null, fy27_budget:null, budget_confirmed:false,
    budget_source:"Higher education — included for DIR coop and STS tracking only.",
    initiatives:["Shared IT services across 13 institutions","UT System Security Operations Center","Research data management","Administrative systems consolidation"],
    strategic_plan:"Shared services; cybersecurity operations; research data; administrative consolidation; digital transformation",
    tech_areas:[
      { label:"Modernization", why:"UT System is consolidating administrative systems across 13 institutions onto shared ERP platforms.", source:"UTS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
      { label:"Cybersecurity", why:"UT System operates a centralized Security Operations Center providing monitoring for all 13 UT institutions.", source:"UTS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
      { label:"Cloud", why:"UT System is migrating research data and administrative workloads to cloud infrastructure.", source:"UTS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
      { label:"Data & Analytics", why:"UT System manages research data repositories and student data systems across 13 institutions and 5 health science centers.", source:"UTS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
      { label:"Infrastructure", why:"UT System maintains distributed IT infrastructure across 13 campuses and 5 health science centers.", source:"UTS Strategic Plan FY2025-29", budget_note:"Higher ed budgets tracked separately" },
    ],
    sb1_items:[], hb500_items:[], exceptional_items:[],
  },

];

export const SUMMARY_STATS = {
  total_agencies: 40,
  total_fy25_spend: 6300,
  sb1_it_items: 38,
  hb500_it_sections: 12,
  data_updated: "May 2026",
  sb1_session: "89th Legislature",
  hb500_enacted: "June 22, 2025",
  methodology_note: "tech_areas now include agency-specific sourced context tied to each tag. Source citations reference enacted SB1 rider language, LBE strategy amounts, LAR text, and CC Issue Docket confirmed items.",
};
