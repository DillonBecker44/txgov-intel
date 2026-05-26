// Texas State Agency IT Intelligence Data
// Sources: TX Comptroller, DIR, LBB, SB1 89th Legislature (2026-27 GAA), HB500 Supplemental Appropriations
// Last updated: May 2026

export const AGENCIES = [
  {
    id: "hhsc",
    name: "Health & Human Services Commission",
    abbr: "HHSC",
    category: "Health & Human Services",
    fy25_spend: 899,
    fy26_budget: 1100,
    budget_confirmed: true,
    initiatives: [
      "Medicaid Management Information System (MMIS) modernization — $474M",
      "Texas Integrated Eligibility Redesign System (TIERS) — $246M",
      "Data center consolidation via DIR statewide tech center",
      "CAPPS enterprise financial system upgrades",
      "Online WIC EBT transition from physical cards",
      "Cybersecurity uplift and managed security services"
    ],
    strategic_plan: "Legacy system modernization; AI-enabled case management; cloud migration; cybersecurity; digital accessibility",
    tech_areas: ["Cybersecurity","Modernization","Case Management","ERP / Financial","Cloud","AI / Automation","Infrastructure","Legacy Replacement"],
    sb1_items: [
      {
        section: "Art. II, HHSC",
        type: "Base Appropriation",
        description: "IT capital budget of $1.1B for 2026–27 biennium covering MMIS, TIERS, data center, CAPPS, and cybersecurity",
        amount: 1100,
        fy: "2026-27"
      },
      {
        section: "Art. II, Rider 78",
        type: "Rider",
        description: "TIERS Modernization Rider — requires quarterly reporting to LBB on TIERS replacement milestones, expenditures, and vendor performance",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. II, Rider 81",
        type: "Rider",
        description: "MMIS Modernization Rider — requires federal CMS approval maintained and annual reporting on Medicaid system uptime and claims accuracy rates",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. II, Rider 85",
        type: "Rider",
        description: "Data Center Consolidation Rider — DIR coordination required; cost savings report due to LBB by December 2026",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [
      {
        section: "Sec. 2.01",
        type: "Supplemental Appropriation",
        description: "Medicaid Transfer Authority — grants HHSC authority to transfer unexpended balances from other strategies to Medicaid Client Services for FY2024–25",
        amount: null,
        fy: "2024-25"
      }
    ],
    exceptional_items: [
      {
        item_num: 1,
        title: "MMIS Phase 2 Continuation",
        status: "Fully Funded",
        amount: 474,
        description: "Continuation of Medicaid Management Information System modernization — Phase 2 of multi-year replacement"
      },
      {
        item_num: 2,
        title: "TIERS Eligibility Redesign",
        status: "Fully Funded",
        amount: 246,
        description: "Continued development of Texas Integrated Eligibility Redesign System serving SNAP, Medicaid, CHIP, TANF"
      },
      {
        item_num: 3,
        title: "Data Center & Cybersecurity Consolidation",
        status: "Fully Funded",
        amount: 380,
        description: "Data center consolidation, cybersecurity uplift, CAPPS upgrades, and WIC EBT online transition"
      }
    ]
  },
  {
    id: "txdot",
    name: "Department of Transportation",
    abbr: "TxDOT",
    category: "Transportation & Infrastructure",
    fy25_spend: 882,
    fy26_budget: 167.4,
    budget_confirmed: true,
    initiatives: [
      "Legacy mainframe replacement — core transportation management systems",
      "Data center upgrades statewide across district offices",
      "Enterprise information management and data integration",
      "Cybersecurity hardening for transportation infrastructure",
      "AI adoption roadmap — TRAIGA compliance (signed June 2025)",
      "Connected vehicle and smart infrastructure technology pilots"
    ],
    strategic_plan: "Digital-first infrastructure; AI in operations & safety; data integration; connected infrastructure",
    tech_areas: ["Legacy Replacement","Modernization","Cybersecurity","AI / Automation","Data & Analytics","Infrastructure"],
    sb1_items: [
      {
        section: "Art. VI, TxDOT",
        type: "Base Appropriation",
        description: "IT capital budget of $167.4M for 2026–27 covering mainframe replacement, data center upgrades, cybersecurity, and enterprise information management",
        amount: 167.4,
        fy: "2026-27"
      },
      {
        section: "Art. VI, Rider 42",
        type: "Rider",
        description: "IT Modernization Reporting Rider — TxDOT must submit semiannual reports to LBB on IT modernization project status, costs, and schedule",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. VI, Rider 44",
        type: "Rider",
        description: "AI Governance Rider — requires TxDOT to comply with TRAIGA and submit AI inventory and risk assessment to DIR annually",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "Legacy Mainframe Replacement",
        status: "Fully Funded",
        amount: 45,
        description: "Replacement of aging mainframe systems supporting core transportation management and financial operations"
      },
      {
        item_num: 2,
        title: "Cybersecurity Infrastructure Upgrade",
        status: "Fully Funded",
        amount: 28,
        description: "Network security upgrades, zero trust architecture implementation, and SOC expansion"
      },
      {
        item_num: 3,
        title: "Enterprise Information Management",
        status: "Partially Funded",
        amount: 22,
        description: "Integrated data platform for project management, asset tracking, and real-time performance analytics"
      }
    ]
  },
  {
    id: "dir",
    name: "Department of Information Resources",
    abbr: "DIR",
    category: "Technology & Operations",
    fy25_spend: 820,
    fy26_budget: 400,
    budget_confirmed: false,
    initiatives: [
      "Statewide Technology Center (STC) operations and expansion",
      "Managed security services for 200+ state entities",
      "Cloud shared services — AWS, Azure enterprise agreements",
      "Texas Cyber Command (TXCC) transition coordination",
      "2026–2030 State Strategic Plan for IRM implementation",
      "AI governance framework and TRAIGA coordination",
      "Cooperative contracts portfolio management ($5B+ annual volume)"
    ],
    strategic_plan: "2026–2030 SSP: digital accessibility; secure IAM; connectivity & continuity; AI governance; cybersecurity centralization via TXCC",
    tech_areas: ["Cybersecurity","Cloud","Identity & Access","AI / Automation","Infrastructure","Digital / Portals"],
    sb1_items: [
      {
        section: "Art. IX, Sec. 9.01",
        type: "General Provision",
        description: "Statewide Technology Center — requires all state agencies to use DIR STC services unless granted exemption; sets cost recovery framework",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. IX, Sec. 9.02",
        type: "General Provision",
        description: "Cybersecurity Requirements — all agencies must comply with DIR security controls framework; TXCC to assume operational authority by Dec 2026",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. I, DIR Rider 12",
        type: "Rider",
        description: "Cooperative Contracts Rider — DIR must publish annual report on cooperative contract utilization, savings, and vendor diversity metrics",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [
      {
        section: "Sec. 8.08",
        type: "Exceptional Item — HB500",
        description: "DIR Exceptional Item #2 — Cybersecurity tools and managed services expansion to meet increased agency demand for shared security services",
        amount: null,
        fy: "2025-26"
      },
      {
        section: "Sec. 8.09",
        type: "Exceptional Item — HB500",
        description: "DIR Exceptional Item #3 — IT management and governance tools for statewide technology oversight and compliance monitoring",
        amount: null,
        fy: "2025-26"
      },
      {
        section: "Sec. 8.10",
        type: "Exceptional Item — HB500",
        description: "DIR Exceptional Item #5 — Data governance and privacy tools enabling agencies to meet requirements under state and federal data protection law",
        amount: null,
        fy: "2025-26"
      }
    ],
    exceptional_items: [
      {
        item_num: 2,
        title: "Cybersecurity Tools Expansion",
        status: "Funded via HB500",
        amount: null,
        description: "Expanded managed security services capacity to serve growing number of state and local entities using DIR shared services"
      },
      {
        item_num: 3,
        title: "IT Management & Governance Tools",
        status: "Funded via HB500",
        amount: null,
        description: "Statewide IT governance platform improvements for better visibility, compliance tracking, and technology asset management"
      },
      {
        item_num: 5,
        title: "Data Governance & Privacy Platform",
        status: "Funded via HB500",
        amount: null,
        description: "Tools enabling agencies to implement data classification, privacy controls, and compliance reporting under TRAIGA and federal requirements"
      }
    ]
  },
  {
    id: "txcc",
    name: "Texas Cyber Command",
    abbr: "TXCC",
    category: "Technology & Operations",
    fy25_spend: null,
    fy26_budget: 135,
    budget_confirmed: true,
    initiatives: [
      "New statewide cybersecurity authority — established by HB 150 (89th Leg.)",
      "Security Operations Center (SOC) build-out in San Antonio",
      "Critical infrastructure protection program",
      "Threat intelligence sharing platform with state and local entities",
      "Incident response coordination replacing DIR cyber functions",
      "Vulnerability management program for state networks"
    ],
    strategic_plan: "Centralized cyber defense; threat intel sharing; incident response; vulnerability management; whole-of-state cybersecurity",
    tech_areas: ["Cybersecurity","Infrastructure"],
    sb1_items: [
      {
        section: "Art. IX, HB 150",
        type: "New Agency Appropriation",
        description: "Texas Cyber Command established as standalone agency — $135M appropriation for FY2026-27 covering SOC build-out, personnel, and operational tools",
        amount: 135,
        fy: "2026-27"
      },
      {
        section: "Art. IX, TXCC Rider 1",
        type: "Rider",
        description: "Transition Rider — TXCC must assume all DIR cybersecurity operational functions by August 31, 2026; transition plan due to LBB by November 2025",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. IX, TXCC Rider 2",
        type: "Rider",
        description: "Performance Metrics Rider — TXCC must report quarterly on incident response times, threat detections, agencies covered, and SOC staffing levels",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "SOC Facility & Technology Build-Out",
        status: "Fully Funded",
        amount: 75,
        description: "Physical and technical infrastructure for San Antonio SOC including SIEM, threat intel platforms, and secure communications"
      },
      {
        item_num: 2,
        title: "Personnel — Cyber Analysts & Engineers",
        status: "Fully Funded",
        amount: 40,
        description: "Recruitment and onboarding of ~150 cybersecurity professionals including analysts, engineers, and incident responders"
      },
      {
        item_num: 3,
        title: "Whole-of-State Outreach Program",
        status: "Fully Funded",
        amount: 20,
        description: "Program to extend TXCC services to cities, counties, school districts, and critical infrastructure operators"
      }
    ]
  },
  {
    id: "dps",
    name: "Department of Public Safety",
    abbr: "DPS",
    category: "Public Safety & Law",
    fy25_spend: null,
    fy26_budget: 91.8,
    budget_confirmed: true,
    initiatives: [
      "Threat detection and advanced analytics platform",
      "Driver's license system modernization — replacement of legacy DL system",
      "Biometrics expansion — fingerprint, facial recognition integration",
      "Core IT platform maintenance and cybersecurity improvements",
      "Real-time threat intelligence integration with law enforcement partners",
      "Border security technology — surveillance and sensor systems"
    ],
    strategic_plan: "Public safety data modernization; biometrics; real-time threat intel; cybersecurity; border technology",
    tech_areas: ["Cybersecurity","Data & Analytics","Modernization","AI / Automation","Legacy Replacement"],
    sb1_items: [
      {
        section: "Art. V, DPS",
        type: "Base Appropriation",
        description: "IT capital budget of $91.8M covering driver's license system upgrade, threat detection, biometrics, and cybersecurity improvements",
        amount: 91.8,
        fy: "2026-27"
      },
      {
        section: "Art. V, DPS Rider 22",
        type: "Rider",
        description: "Driver's License Modernization Rider — requires milestone reporting to LBB; project must maintain federal REAL ID compliance throughout transition",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. V, DPS Rider 25",
        type: "Rider",
        description: "Border Technology Rider — surveillance and sensor technology deployments must coordinate with DHS and report on effectiveness metrics",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "Driver's License System Replacement",
        status: "Fully Funded",
        amount: 38,
        description: "Replacement of legacy driver's license issuance system with modern platform supporting REAL ID, mobile ID, and digital credentials"
      },
      {
        item_num: 2,
        title: "Threat Detection & Analytics",
        status: "Fully Funded",
        amount: 25,
        description: "AI-powered threat detection platform integrating criminal intelligence, border data, and law enforcement feeds"
      },
      {
        item_num: 3,
        title: "Cybersecurity Platform Upgrade",
        status: "Partially Funded",
        amount: 18,
        description: "Zero trust network architecture and endpoint security improvements across DPS enterprise"
      }
    ]
  },
  {
    id: "txdmv",
    name: "Department of Motor Vehicles",
    abbr: "TxDMV",
    category: "Transportation & Infrastructure",
    fy25_spend: null,
    fy26_budget: 125,
    budget_confirmed: true,
    initiatives: [
      "Full replacement of 30-year-old registration & title system (20+ legacy applications)",
      "Data infrastructure re-architecture — modern API-based platform",
      "Digital-first service delivery — online transactions for all DMV services",
      "Dealer management portal modernization",
      "Fraud detection system using data analytics"
    ],
    strategic_plan: "Digital transformation; legacy elimination; customer-facing portals; data modernization; fraud prevention",
    tech_areas: ["Legacy Replacement","Modernization","Digital / Portals","Data & Analytics"],
    sb1_items: [
      {
        section: "Art. VI, TxDMV",
        type: "Base Appropriation",
        description: "$125M for complete replacement of registration and title system — largest IT project in TxDMV history",
        amount: 125,
        fy: "2026-27"
      },
      {
        section: "Art. VI, TxDMV Rider 8",
        type: "Rider",
        description: "Registration & Title System Rider — phased implementation required; LBB approval needed for expenditures exceeding $25M per phase; county tax assessor-collector coordination mandated",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. VI, TxDMV Rider 9",
        type: "Rider",
        description: "Legacy Decommission Rider — requires plan for retiring 20+ legacy applications within 36 months of new system go-live",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "Registration & Title System Replacement",
        status: "Fully Funded",
        amount: 125,
        description: "Ground-up replacement of 30-year-old ecosystem — 20+ applications replaced with unified, cloud-native platform"
      }
    ]
  },
  {
    id: "dfps",
    name: "Dept of Family & Protective Services",
    abbr: "DFPS",
    category: "Health & Human Services",
    fy25_spend: null,
    fy26_budget: 60,
    budget_confirmed: false,
    initiatives: [
      "Comprehensive Child Welfare Information System (CCWIS) replacement",
      "AI integration for case triage and risk assessment",
      "~20 subprojects: data quality, system integration, mobile worker tools",
      "Provider portal modernization",
      "Interoperability with HHSC eligibility systems"
    ],
    strategic_plan: "Child welfare modernization; AI-assisted case management; data governance; interoperability with HHSC",
    tech_areas: ["Case Management","Modernization","AI / Automation","Data & Analytics","Legacy Replacement"],
    sb1_items: [
      {
        section: "Art. II, DFPS Rider 14",
        type: "Rider",
        description: "CCWIS Implementation Rider — federal ACF approval required; DFPS must submit Implementation Advance Planning Document (IAPD); quarterly progress reports to LBB",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. II, DFPS Rider 15",
        type: "Rider",
        description: "AI Use in Child Welfare Rider — any AI tools used in case triage or removal decisions must be approved by a human caseworker; bias audit required annually",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "CCWIS System Replacement",
        status: "Fully Funded",
        amount: 45,
        description: "Federal-state cost share replacement of child welfare case management system; federal match estimated at 50%"
      },
      {
        item_num: 2,
        title: "Mobile Worker Technology",
        status: "Partially Funded",
        amount: 12,
        description: "Tablets, mobile apps, and offline-capable tools for field caseworkers — improving documentation and safety"
      }
    ]
  },
  {
    id: "twc",
    name: "Texas Workforce Commission",
    abbr: "TWC",
    category: "Health & Human Services",
    fy25_spend: null,
    fy26_budget: 50,
    budget_confirmed: false,
    initiatives: [
      "AI deployment across 150+ operational areas",
      "New CRM platform — unified customer interaction hub",
      "Call center modernization — AI chat + live agent integration",
      "Unemployment insurance claims digitization and automation",
      "Civil rights case review automation",
      "Legislative analysis AI tool deployment"
    ],
    strategic_plan: "AI-first operations; customer experience transformation; workflow automation; call center modernization",
    tech_areas: ["AI / Automation","Call Center / CRM","Modernization","Digital / Portals","Data & Analytics"],
    sb1_items: [
      {
        section: "Art. VII, TWC Rider 18",
        type: "Rider",
        description: "AI Deployment Rider — TWC must maintain AI use inventory per TRAIGA; annual report on AI-assisted decisions, accuracy rates, and bias assessments required",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. VII, TWC Rider 19",
        type: "Rider",
        description: "UI System Modernization Rider — UI claims system must maintain 99.5% uptime; any modernization must not reduce claimant access or increase average processing time",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "CRM & Call Center Platform",
        status: "Fully Funded",
        amount: 22,
        description: "New unified CRM platform replacing fragmented legacy contact center systems; AI-powered routing and self-service"
      },
      {
        item_num: 2,
        title: "AI Operations Platform",
        status: "Fully Funded",
        amount: 18,
        description: "Enterprise AI tooling for 150+ operational use cases including claims processing, fraud detection, and case review"
      }
    ]
  },
  {
    id: "tea",
    name: "Texas Education Agency",
    abbr: "TEA",
    category: "Education",
    fy25_spend: null,
    fy26_budget: 80,
    budget_confirmed: false,
    initiatives: [
      "Student data system modernization — PEIMS replacement planning",
      "K-12 statewide cybersecurity program for school districts",
      "CCIAM identity & access management modernization",
      "Digital learning platform expansion",
      "Data accountability and performance reporting systems"
    ],
    strategic_plan: "Data-driven accountability; K-12 cybersecurity leadership; digital equity; identity management; educator tools",
    tech_areas: ["Cybersecurity","Data & Analytics","Identity & Access","Digital / Portals","Modernization"],
    sb1_items: [
      {
        section: "Art. III, TEA Rider 44",
        type: "Rider",
        description: "K-12 Cybersecurity Rider — TEA must publish annual threat report for school districts; coordinate with TXCC on incident response for districts",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. III, TEA Rider 45",
        type: "Rider",
        description: "Student Data Privacy Rider — TEA must maintain Student Data Privacy Consortium agreements; annual audit of third-party vendor data practices required",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "K-12 Cybersecurity Program",
        status: "Fully Funded",
        amount: 35,
        description: "Statewide cybersecurity support for school districts including threat monitoring, incident response, and security training"
      },
      {
        item_num: 2,
        title: "CCIAM Identity Modernization",
        status: "Fully Funded",
        amount: 25,
        description: "Centralized credential and identity management replacing fragmented district-level authentication systems"
      }
    ]
  },
  {
    id: "cpa",
    name: "Comptroller of Public Accounts",
    abbr: "CPA",
    category: "Finance & Regulatory",
    fy25_spend: null,
    fy26_budget: 55,
    budget_confirmed: false,
    initiatives: [
      "CAPPS statewide financial system upgrades",
      "Revenue collection systems modernization",
      "Texas Transparency portal enhancement",
      "Cybersecurity for financial systems",
      "Open data initiative expansion",
      "Audit analytics platform"
    ],
    strategic_plan: "Financial systems modernization; public transparency; data analytics; cybersecurity; statewide CAPPS stewardship",
    tech_areas: ["ERP / Financial","Modernization","Cybersecurity","Data & Analytics","Digital / Portals"],
    sb1_items: [
      {
        section: "Art. I, CPA Rider 9",
        type: "Rider",
        description: "CAPPS Stewardship Rider — CPA as CAPPS system owner must publish annual roadmap; agency requests for CAPPS modifications require CPA approval",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. I, CPA Rider 10",
        type: "Rider",
        description: "Transparency Portal Rider — Texas Transparency portal must be updated within 30 days of fiscal year-end; contract data must include DIR cooperative contract spend",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "CAPPS Next Generation Planning",
        status: "Partially Funded",
        amount: 18,
        description: "Planning and design for next-generation CAPPS platform to replace aging ERP infrastructure across state government"
      }
    ]
  },
  {
    id: "tdcj",
    name: "Dept of Criminal Justice",
    abbr: "TDCJ",
    category: "Public Safety & Law",
    fy25_spend: null,
    fy26_budget: 45,
    budget_confirmed: false,
    initiatives: [
      "Offender management system modernization",
      "Facility network infrastructure upgrades (100+ locations)",
      "Cybersecurity hardening",
      "Body camera and surveillance technology integration",
      "Case management for parole and reentry services"
    ],
    strategic_plan: "Operational efficiency; facility security; data integration with courts and law enforcement; infrastructure modernization",
    tech_areas: ["Cybersecurity","Infrastructure","Case Management","Modernization","Data & Analytics"],
    sb1_items: [
      {
        section: "Art. V, TDCJ Rider 31",
        type: "Rider",
        description: "Heat Mitigation Technology Rider — facilities receiving climate control infrastructure upgrades must integrate with facility management systems; energy reporting required",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. V, TDCJ Rider 32",
        type: "Rider",
        description: "Body Camera Rider — all body camera footage must be retained per DOJ standards; system must integrate with evidence management platform",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [
      {
        section: "Sec. 4.04",
        type: "Supplemental Appropriation",
        description: "Heat Mitigation & Facility Technology — appropriation for refurbishing older units with climate control and building technology systems",
        amount: null,
        fy: "2024-25"
      },
      {
        section: "Sec. 4.05",
        type: "Supplemental Appropriation",
        description: "New Construction Technology Standards — requires newly built TDCJ units to include integrated climate control and facility management technology",
        amount: null,
        fy: "2024-25"
      }
    ],
    exceptional_items: [
      {
        item_num: 1,
        title: "Offender Management System Upgrade",
        status: "Partially Funded",
        amount: 20,
        description: "Modernization of offender tracking, programming, and reentry management systems across 100+ facilities"
      }
    ]
  },
  {
    id: "oca",
    name: "Office of Court Administration",
    abbr: "OCA",
    category: "Finance & Regulatory",
    fy25_spend: null,
    fy26_budget: 20,
    budget_confirmed: false,
    initiatives: [
      "Appellate court case management system — cloud-based replacement",
      "Specialty court tracking system (200+ specialty courts)",
      "E-filing expansion statewide",
      "Court backlog data and analytics platform",
      "Judicial IT infrastructure one-time investment"
    ],
    strategic_plan: "Judicial IT modernization; e-filing; data infrastructure; accessibility; court backlog reduction",
    tech_areas: ["Case Management","Modernization","Digital / Portals","Data & Analytics","Cloud"],
    sb1_items: [
      {
        section: "Art. I, OCA Rider 5",
        type: "Rider",
        description: "Court Technology Rider — one-time IT infrastructure investment must be spent within biennium; no carryover; procurement must use DIR cooperative contracts",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [
      {
        section: "Sec. 8.24",
        type: "Exceptional Item — HB500",
        description: "Appellate Court Case Management System — $11.9M for cloud-based replacement of legacy server-based system used by Texas Supreme Court, Court of Criminal Appeals, and 15 Courts of Appeals",
        amount: 11.9,
        fy: "2025-26"
      },
      {
        section: "Sec. 8.25",
        type: "Exceptional Item — HB500",
        description: "Specialty Court Case Management — $3.9M for cloud-based tracking and reporting system for 200+ specialty court dockets replacing inconsistent spreadsheet/custom software approaches",
        amount: 3.9,
        fy: "2025-26"
      }
    ],
    exceptional_items: [
      {
        item_num: 1,
        title: "Appellate Court Cloud CMS",
        status: "Funded via HB500",
        amount: 11.9,
        description: "Cloud-based case management system replacing vulnerable legacy platform at Texas Supreme Court and all 15 Courts of Appeals"
      },
      {
        item_num: 2,
        title: "Specialty Court Tracking System",
        status: "Funded via HB500",
        amount: 3.9,
        description: "Unified cloud system for 200+ specialty courts (drug courts, veterans courts, mental health courts) — standardizing data collection and outcome reporting"
      }
    ]
  },
  {
    id: "tpwd",
    name: "Parks & Wildlife Department",
    abbr: "TPWD",
    category: "Environment & Resources",
    fy25_spend: null,
    fy26_budget: 18,
    budget_confirmed: false,
    initiatives: [
      "Online permitting & licensing platform modernization",
      "GIS and conservation data platform upgrades",
      "Customer experience portal improvement",
      "Cybersecurity across distributed field office network",
      "Wildlife management data analytics"
    ],
    strategic_plan: "Digital permitting; conservation data management; customer experience; cybersecurity; GIS modernization",
    tech_areas: ["Digital / Portals","Modernization","Data & Analytics","Cybersecurity"],
    sb1_items: [
      {
        section: "Art. VI, TPWD Rider 11",
        type: "Rider",
        description: "Online Licensing Rider — TPWD must ensure online licensing platform handles peak demand (opening of deer season); uptime SLA of 99.9% required during peak periods",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "Licensing & Permitting Platform",
        status: "Partially Funded",
        amount: 10,
        description: "Modernization of hunting, fishing, and park reservation systems — improving reliability during high-demand periods"
      }
    ]
  },
  {
    id: "twdb",
    name: "Texas Water Development Board",
    abbr: "TWDB",
    category: "Environment & Resources",
    fy25_spend: null,
    fy26_budget: 15,
    budget_confirmed: false,
    initiatives: [
      "Water data analytics platform for state water planning",
      "Grant management system modernization",
      "Cloud migration for water planning databases",
      "Public reporting portals for water data",
      "Cybersecurity for water infrastructure data"
    ],
    strategic_plan: "Water infrastructure data; digital grant management; analytics; cybersecurity; open data for water planning",
    tech_areas: ["Data & Analytics","Cloud","Cybersecurity","Digital / Portals"],
    sb1_items: [
      {
        section: "Art. VI, TWDB Rider 6",
        type: "Rider",
        description: "Texas Water Fund Technology Rider — grants management system must track all Texas Water Fund ($2.5B) grant expenditures; real-time reporting portal required",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [
      {
        section: "Sec. 5.03",
        type: "Major Supplemental Appropriation",
        description: "Texas Water Fund — $2.5B appropriated to Texas Water Fund for water supply and infrastructure projects; TWDB grant management system must be updated to handle increased volume",
        amount: 2500,
        fy: "2024-25"
      },
      {
        section: "Sec. 5.01",
        type: "Supplemental Appropriation",
        description: "Clean Water State Revolving Fund — $54.8M to maximize federal drawdown; TWDB systems must track federal match requirements",
        amount: 54.8,
        fy: "2024-25"
      }
    ],
    exceptional_items: [
      {
        item_num: 1,
        title: "Grant Management System Upgrade",
        status: "Fully Funded",
        amount: 8,
        description: "Upgraded grant management platform to handle $2.5B+ Texas Water Fund grant awards — tracking, reporting, and compliance monitoring"
      }
    ]
  },
  {
    id: "sos",
    name: "Secretary of State",
    abbr: "SOS",
    category: "Finance & Regulatory",
    fy25_spend: null,
    fy26_budget: 12,
    budget_confirmed: false,
    initiatives: [
      "Business & government filings IT modernization (biennium-end target)",
      "Election systems security hardening",
      "Accessible voting technology compliance",
      "E-filing expansion for business entities",
      "Voter registration system maintenance"
    ],
    strategic_plan: "Election integrity; business filings modernization; digital accessibility; cybersecurity; voter registration modernization",
    tech_areas: ["Modernization","Cybersecurity","Digital / Portals","Identity & Access"],
    sb1_items: [
      {
        section: "Art. I, SOS Rider 7",
        type: "Rider",
        description: "Business Filings Modernization Rider — IT modernization plan must be submitted to LBB by December 2025; system must process 95% of filings online by August 2027",
        amount: null,
        fy: "2026-27"
      },
      {
        section: "Art. I, SOS Rider 8",
        type: "Rider",
        description: "Election Security Rider — election systems must meet CISA security baselines; any changes to voting system software require DIR security review before deployment",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "Business Filings IT Modernization",
        status: "Partially Funded",
        amount: 8,
        description: "Replacement of legacy business entity filing system with modern cloud-based platform supporting same-day processing"
      }
    ]
  },
  {
    id: "trs",
    name: "Teacher Retirement System",
    abbr: "TRS",
    category: "Finance & Regulatory",
    fy25_spend: null,
    fy26_budget: 15,
    budget_confirmed: false,
    initiatives: [
      "Pension administration system modernization",
      "Member self-service portal redesign",
      "Cybersecurity for member financial data",
      "Cloud migration for pension workloads",
      "Benefit delivery automation"
    ],
    strategic_plan: "Benefits delivery modernization; member self-service; data security; cloud migration; actuarial system upgrade",
    tech_areas: ["ERP / Financial","Modernization","Digital / Portals","Cybersecurity","Cloud"],
    sb1_items: [
      {
        section: "Art. I, TRS Rider 12",
        type: "Rider",
        description: "Pension System Security Rider — TRS must conduct annual third-party penetration test; results reported to Board of Trustees; remediation plan due within 90 days",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [
      {
        section: "Sec. 1.01",
        type: "Pension Lump Sum Payment",
        description: "$1B lump sum payment to TRS legacy fund — projected to save $2.5B in future interest payments and eliminate unfunded actuarial liability two years ahead of schedule (by 2044); reduces future IT burden for benefit servicing",
        amount: 1000,
        fy: "2024-25"
      }
    ],
    exceptional_items: [
      {
        item_num: 1,
        title: "Pension Administration Modernization",
        status: "Partially Funded",
        amount: 12,
        description: "Next-generation pension admin platform replacing 20+ year-old system; improves benefit calculation accuracy and member self-service"
      }
    ]
  },
  {
    id: "glo",
    name: "General Land Office",
    abbr: "GLO",
    category: "Environment & Resources",
    fy25_spend: null,
    fy26_budget: 20,
    budget_confirmed: false,
    initiatives: [
      "GIS and land records modernization",
      "Disaster recovery and emergency management systems",
      "Cloud migration for land and title databases",
      "Geospatial data platform for Alamo preservation",
      "Grant management for disaster recovery funds"
    ],
    strategic_plan: "Geospatial data modernization; disaster resilience; cloud adoption; Alamo preservation technology",
    tech_areas: ["Cloud","Modernization","Data & Analytics","Infrastructure"],
    sb1_items: [
      {
        section: "Art. I, GLO Rider 9",
        type: "Rider",
        description: "Disaster Recovery Technology Rider — GLO disaster recovery systems must maintain real-time data sync; recovery time objective (RTO) of 4 hours for critical systems",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: [
      {
        item_num: 1,
        title: "GIS Platform Modernization",
        status: "Partially Funded",
        amount: 12,
        description: "Cloud-native GIS platform replacing ESRI on-premise infrastructure; supports land management, disaster response, and public data access"
      }
    ]
  },
  {
    id: "tceq",
    name: "Texas Commission on Environmental Quality",
    abbr: "TCEQ",
    category: "Environment & Resources",
    fy25_spend: null,
    fy26_budget: 22,
    budget_confirmed: false,
    initiatives: [
      "Environmental data management platform",
      "Online permitting system modernization",
      "Public reporting portal upgrades",
      "Data analytics for regulatory compliance monitoring",
      "Cloud adoption for environmental monitoring data"
    ],
    strategic_plan: "Environmental data transparency; digital permitting; analytics; cloud adoption; regulatory efficiency",
    tech_areas: ["Data & Analytics","Digital / Portals","Modernization","Cloud"],
    sb1_items: [
      {
        section: "Art. VI, TCEQ Rider 18",
        type: "Rider",
        description: "Permitting Technology Rider — online permitting must handle 90% of new air, water, and waste permit applications; processing time targets set for each permit type",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: []
  },
  {
    id: "oag",
    name: "Office of the Attorney General",
    abbr: "OAG",
    category: "Finance & Regulatory",
    fy25_spend: null,
    fy26_budget: 30,
    budget_confirmed: false,
    initiatives: [
      "Case management system modernization",
      "eDiscovery platform implementation",
      "Cybersecurity for legal and law enforcement data",
      "Secure communications infrastructure",
      "E-filing expansion for consumer protection and child support"
    ],
    strategic_plan: "Legal tech modernization; data security; digital case management; e-filing; secure communications",
    tech_areas: ["Case Management","Cybersecurity","Modernization","Digital / Portals"],
    sb1_items: [
      {
        section: "Art. I, OAG Rider 14",
        type: "Rider",
        description: "Legal Technology Rider — case management system must integrate with courts' e-filing platform; child support data must maintain real-time sync with HHSC eligibility systems",
        amount: null,
        fy: "2026-27"
      }
    ],
    hb500_items: [],
    exceptional_items: []
  }
];

export const TECH_AREAS = [
  { label: "Cybersecurity",      color: "#FDE8E8", textColor: "#8B1C1C", borderColor: "#F5BCBC" },
  { label: "Modernization",      color: "#E6F1FB", textColor: "#0C447C", borderColor: "#B5D4F4" },
  { label: "Call Center / CRM",  color: "#E1F5EE", textColor: "#085041", borderColor: "#9FE1CB" },
  { label: "AI / Automation",    color: "#EEEDFE", textColor: "#3C3489", borderColor: "#CECBF6" },
  { label: "Cloud",              color: "#EAF3DE", textColor: "#27500A", borderColor: "#C0DD97" },
  { label: "Data & Analytics",   color: "#FAEEDA", textColor: "#633806", borderColor: "#FAC775" },
  { label: "Legacy Replacement", color: "#F1EFE8", textColor: "#444441", borderColor: "#D3D1C7" },
  { label: "ERP / Financial",    color: "#FBEAF0", textColor: "#72243E", borderColor: "#F4C0D1" },
  { label: "Digital / Portals",  color: "#FAECE7", textColor: "#712B13", borderColor: "#F5C4B3" },
  { label: "Infrastructure",     color: "#F8F0FE", textColor: "#4A1B7A", borderColor: "#DCC8F5" },
  { label: "Identity & Access",  color: "#FFF8E6", textColor: "#6B4A00", borderColor: "#FFD77A" },
  { label: "Case Management",    color: "#E8F7F5", textColor: "#0A4D45", borderColor: "#7DCFC7" },
];

export const CATEGORIES = [
  "Health & Human Services",
  "Transportation & Infrastructure",
  "Public Safety & Law",
  "Education",
  "Finance & Regulatory",
  "Technology & Operations",
  "Environment & Resources",
];

export const SUMMARY_STATS = {
  total_fy25_spend: 6300,
  total_agencies: 24,
  biennial_budget: 337400,
  txcc_new: 135,
  hhsc_it_capital: 1100,
  sb1_it_items: 38,
  hb500_it_sections: 12,
  data_updated: "May 2026",
  sb1_session: "89th Legislature",
  hb500_enacted: "June 22, 2025"
};
