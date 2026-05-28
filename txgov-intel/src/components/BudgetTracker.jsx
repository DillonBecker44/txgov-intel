import React, { useState, useEffect } from 'react';

const API     = 'https://data.texas.gov/resource';
const DS_FY26 = 'a743-wj72';
const DS_HIST = 'w64c-ndf7';
const DS_STS  = '8hps-ztn4';

// TEX-AN and CCTS are both mandatory telecom programs billed through DIR
// rfo_description values confirmed from live dataset (a743-wj72):
//   "Telecomm" = TEX-AN voice/data services (AT&T, Verizon, Lumen etc.)
//   "CCTS" = Capitol Complex Telephone System (Austin-area agencies)
//   "Telecommunications" = older/alternative label
//   contract_number pattern DIR-TELE-* = all TEX-AN/telecom contracts
const TEXAN_RFOS = ['telecomm', 'next generation tex-an', 'tex-an', 'telecommunications', 'ccts', 'capitol complex telephone'];
const isTexan = (rfo) => {
  if (!rfo) return false;
  const lower = rfo.toLowerCase();
  return TEXAN_RFOS.some(t => lower.includes(t));
};

const STS_PROGRAMS = {
  'DCS Texas Private Cloud':     { label:'DCS Private Cloud',  color:'#1E2761', desc:'Atos — private cloud, compute, storage' },
  'DCS Mainframe':               { label:'DCS Mainframe',      color:'#2A3570', desc:'Atos — mainframe compute & storage' },
  'Public Cloud':                { label:'Public Cloud (PCM)', color:'#378ADD', desc:'Rackspace — AWS, Azure, GCP' },
  'Technology Solution Services':{ label:'TSS',                color:'#6B80B8', desc:'Deloitte — architects, consulting, staff aug' },
  'Managed Security Services':   { label:'MSS',                color:'#E24B4A', desc:'Managed security monitoring & compliance' },
  'Texas.gov':                   { label:'Texas.gov',          color:'#27500A', desc:'Texas.gov portal & payment services' },
  'Other':                       { label:'Other',              color:'#8A93B2', desc:'Miscellaneous STS charges' },
};

// Complete Texas state agency list from CPA Manual of Accounts (FY2026)
// agency_num: official 3-digit CPA code
// sts_abbr: abbreviation used in STS dataset customer field (null if not in STS)
// category: for filtering
const ALL_AGENCIES = [
  // Legislature
  { num:'101', name:'Senate',                                        abbr:'Senate',    sts_abbr:null,   category:'Legislative' },
  { num:'102', name:'House of Representatives',                      abbr:'House',     sts_abbr:null,   category:'Legislative' },
  { num:'103', name:'Texas Legislative Council',                     abbr:'TLC',       sts_abbr:'TLC',  category:'Legislative' },
  { num:'104', name:'Legislative Budget Board',                      abbr:'LBB',       sts_abbr:'LBB',  category:'Legislative' },
  // Courts
  { num:'201', name:'Supreme Court',                                 abbr:'TXSC',      sts_abbr:'TXSC', category:'Judicial' },
  { num:'211', name:'Court of Criminal Appeals',                     abbr:'CCA',       sts_abbr:'CCA',  category:'Judicial' },
  { num:'212', name:'Office of Court Administration',                abbr:'OCA',       sts_abbr:'OCA',  category:'Judicial' },
  // Executive / Statewide
  { num:'301', name:'Office of the Governor',                        abbr:'GOV',       sts_abbr:'GOV',  category:'Executive' },
  { num:'302', name:'Office of the Attorney General',                abbr:'OAG',       sts_abbr:'OAG',  category:'Finance & Regulatory' },
  { num:'303', name:'Texas Facilities Commission',                   abbr:'TFC',       sts_abbr:'TFC',  category:'Operations' },
  { num:'304', name:'Comptroller of Public Accounts',                abbr:'CPA',       sts_abbr:'CPA',  category:'Finance & Regulatory' },
  { num:'305', name:'General Land Office',                           abbr:'GLO',       sts_abbr:'GLO',  category:'Environment & Resources' },
  { num:'306', name:'Texas State Library and Archives',              abbr:'TSLAC',     sts_abbr:'TSLAC',category:'Education' },
  { num:'307', name:'Secretary of State',                            abbr:'SOS',       sts_abbr:'SOS',  category:'Finance & Regulatory' },
  { num:'308', name:'State Auditor',                                 abbr:'SAO',       sts_abbr:'SAO',  category:'Finance & Regulatory' },
  { num:'312', name:'State Securities Board',                        abbr:'SSB',       sts_abbr:'SSB',  category:'Finance & Regulatory' },
  { num:'313', name:'Department of Information Resources',           abbr:'DIR',       sts_abbr:null,   category:'Technology & Operations' },
  { num:'320', name:'Texas Workforce Commission',                    abbr:'TWC',       sts_abbr:'TWC',  category:'Health & Human Services' },
  { num:'323', name:'Teacher Retirement System',                     abbr:'TRS',       sts_abbr:'TRS',  category:'Finance & Regulatory' },
  { num:'327', name:'Employees Retirement System',                   abbr:'ERS',       sts_abbr:'ERS',  category:'Finance & Regulatory' },
  { num:'328', name:'Veterans Land Board',                           abbr:'VLB',       sts_abbr:'VLB',  category:'Veterans' },
  { num:'329', name:'Texas Real Estate Commission',                  abbr:'TREC',      sts_abbr:'TREC', category:'Finance & Regulatory' },
  { num:'332', name:'Dept of Housing and Community Affairs',         abbr:'TDHCA',     sts_abbr:'TDHCA',category:'Health & Human Services' },
  { num:'347', name:'Texas Public Finance Authority',                abbr:'TPFA',      sts_abbr:'TPFA', category:'Finance & Regulatory' },
  { num:'356', name:'Texas Ethics Commission',                       abbr:'TEC',       sts_abbr:'TEC',  category:'Finance & Regulatory' },
  { num:'358', name:'Texas Space Commission',                        abbr:'TSC',       sts_abbr:null,   category:'Technology & Operations' },
  { num:'360', name:'State Office of Administrative Hearings',       abbr:'SOAH',      sts_abbr:'SOAH', category:'Finance & Regulatory' },
  { num:'371', name:'Texas Cyber Command',                           abbr:'TXCC',      sts_abbr:'TXCC', category:'Technology & Operations' },
  { num:'401', name:'Texas Military Department',                     abbr:'TMD',       sts_abbr:'TMD',  category:'Public Safety & Law' },
  { num:'403', name:'Texas Veterans Commission',                     abbr:'TVC',       sts_abbr:'TVC',  category:'Veterans' },
  { num:'405', name:'Department of Public Safety',                   abbr:'DPS',       sts_abbr:'DPS',  category:'Public Safety & Law' },
  { num:'407', name:'Texas Commission on Law Enforcement',           abbr:'TCOLE',     sts_abbr:'TCOLE',category:'Public Safety & Law' },
  { num:'409', name:'Commission on Jail Standards',                  abbr:'TCJS',      sts_abbr:'TCJS', category:'Public Safety & Law' },
  { num:'448', name:'Office of Injured Employee Counsel',            abbr:'OIEC',      sts_abbr:'OIEC', category:'Finance & Regulatory' },
  { num:'451', name:'Texas Department of Banking',                   abbr:'DOB',       sts_abbr:'DOB',  category:'Finance & Regulatory' },
  { num:'452', name:'Texas Dept of Licensing & Regulation',          abbr:'TDLR',      sts_abbr:'TDLR', category:'Finance & Regulatory' },
  { num:'454', name:'Texas Department of Insurance',                 abbr:'TDI',       sts_abbr:'TDI',  category:'Finance & Regulatory' },
  { num:'455', name:'Railroad Commission of Texas',                  abbr:'RRC',       sts_abbr:'RRC',  category:'Environment & Resources' },
  { num:'458', name:'Texas Alcoholic Beverage Commission',           abbr:'TABC',      sts_abbr:'TABC', category:'Finance & Regulatory' },
  { num:'473', name:'Public Utility Commission',                     abbr:'PUC',       sts_abbr:'PUC',  category:'Finance & Regulatory' },
  { num:'477', name:'Commission on State Emergency Communications',  abbr:'CSEC',      sts_abbr:'CSEC', category:'Public Safety & Law' },
  { num:'479', name:'State Office of Risk Management',               abbr:'SORM',      sts_abbr:'SORM', category:'Operations' },
  { num:'503', name:'Texas Medical Board',                           abbr:'TMB',       sts_abbr:'TMB',  category:'Health & Human Services' },
  { num:'507', name:'Texas Board of Nursing',                        abbr:'BON',       sts_abbr:'BON',  category:'Health & Human Services' },
  { num:'515', name:'Texas State Board of Pharmacy',                 abbr:'TSBP',      sts_abbr:'TSBP', category:'Health & Human Services' },
  { num:'529', name:'Health and Human Services Commission',          abbr:'HHSC',      sts_abbr:'HHS',  category:'Health & Human Services' },
  { num:'530', name:'Dept of Family & Protective Services',          abbr:'DFPS',      sts_abbr:'DFPS', category:'Health & Human Services' },
  { num:'537', name:'Department of State Health Services',           abbr:'DSHS',      sts_abbr:'DSHS', category:'Health & Human Services' },
  { num:'542', name:'Cancer Prevention and Research Institute',      abbr:'CPRIT',     sts_abbr:'CPRIT',category:'Health & Human Services' },
  { num:'544', name:'Texas Civil Commitment Office',                 abbr:'TCCO',      sts_abbr:'TCCO', category:'Health & Human Services' },
  { num:'551', name:'Department of Agriculture',                     abbr:'TDA',       sts_abbr:'TDA',  category:'Environment & Resources' },
  { num:'554', name:'Texas Animal Health Commission',                abbr:'TAHC',      sts_abbr:'TAHC', category:'Environment & Resources' },
  { num:'575', name:'Texas Division of Emergency Management',        abbr:'TDEM',      sts_abbr:'TDEM', category:'Public Safety & Law' },
  { num:'580', name:'Texas Water Development Board',                 abbr:'TWDB',      sts_abbr:'TWDB', category:'Environment & Resources' },
  { num:'582', name:'Texas Commission on Environmental Quality',     abbr:'TCEQ',      sts_abbr:'TCEQ', category:'Environment & Resources' },
  { num:'592', name:'Soil and Water Conservation Board',             abbr:'SWCB',      sts_abbr:'SWCB', category:'Environment & Resources' },
  { num:'601', name:'Department of Transportation',                  abbr:'TxDOT',     sts_abbr:'TxDOT',category:'Transportation & Infrastructure' },
  { num:'608', name:'Department of Motor Vehicles',                  abbr:'TxDMV',     sts_abbr:'DMV',  category:'Transportation & Infrastructure' },
  { num:'644', name:'Texas Juvenile Justice Department',             abbr:'TJJD',      sts_abbr:'TJJD', category:'Public Safety & Law' },
  { num:'696', name:'Texas Department of Criminal Justice',          abbr:'TDCJ',      sts_abbr:'TDCJ', category:'Public Safety & Law' },
  { num:'701', name:'Texas Education Agency',                        abbr:'TEA',       sts_abbr:'TEA',  category:'Education' },
  { num:'705', name:'State Board for Educator Certification',        abbr:'SBEC',      sts_abbr:'SBEC', category:'Education' },
  { num:'781', name:'Texas Higher Education Coordinating Board',     abbr:'THECB',     sts_abbr:'THECB',category:'Education' },
  { num:'802', name:'Parks and Wildlife Department',                 abbr:'TPWD',      sts_abbr:'TPWD', category:'Environment & Resources' },
  { num:'808', name:'Texas Historical Commission',                   abbr:'THC',       sts_abbr:'THC',  category:'Education' },
  { num:'907', name:'State Energy Conservation Office',              abbr:'SECO',      sts_abbr:'SECO', category:'Environment & Resources' },
  { num:'909', name:'Texas Broadband Development Office',            abbr:'TBDO',      sts_abbr:null,   category:'Technology & Operations' },
  // Universities (major ones that appear in DIR data)
  { num:'710', name:'Texas A&M University System',                   abbr:'TAMUS',     sts_abbr:'TAMUS',category:'Higher Education' },
  { num:'711', name:'Texas A&M University',                          abbr:'TAMU',      sts_abbr:'TAMU', category:'Higher Education' },
  { num:'720', name:'University of Texas System',                    abbr:'UTS',       sts_abbr:'UTS',  category:'Higher Education' },
  { num:'721', name:'University of Texas at Austin',                 abbr:'UT',        sts_abbr:'UTA',  category:'Higher Education' },
  { num:'730', name:'University of Houston',                         abbr:'UH',        sts_abbr:'UH',   category:'Higher Education' },
  { num:'733', name:'Texas Tech University',                         abbr:'TTU',       sts_abbr:'TTU',  category:'Higher Education' },
  { num:'752', name:'University of North Texas',                     abbr:'UNT',       sts_abbr:'UNT',  category:'Higher Education' },
  { num:'754', name:'Texas State University',                        abbr:'TXST',      sts_abbr:'TXST', category:'Higher Education' },
];

// SB1 89th Legislature IT budgets — annual allocation (biennium ÷ 2 where not confirmed)
// Only agencies with significant IT appropriations tracked here
// agencies NOT in this map will still show live spend data but without a budget line
const BUDGETS = {
  '529': { fy26:550,  fy27:550,  confirmed:true  }, // HHSC
  '601': { fy26:83.7, fy27:83.7, confirmed:true  }, // TxDOT
  '313': { fy26:23.4, fy27:22.9, confirmed:true  }, // DIR — Art. I Rider 2 confirmed
  '371': { fy26:60.5, fy27:75.0, confirmed:true  }, // TXCC — HB150 fiscal note confirmed
  '405': { fy26:45.9, fy27:45.9, confirmed:true  }, // DPS
  '608': { fy26:62.5, fy27:62.5, confirmed:true  }, // TxDMV
  '530': { fy26:30,   fy27:30,   confirmed:false }, // DFPS
  '320': { fy26:25,   fy27:25,   confirmed:false }, // TWC
  '701': { fy26:40,   fy27:40,   confirmed:false }, // TEA
  '304': { fy26:27.5, fy27:27.5, confirmed:false }, // CPA
  '696': { fy26:22.5, fy27:22.5, confirmed:false }, // TDCJ
  '401': { fy26:45,   fy27:45,   confirmed:false }, // TMD
  '802': { fy26:9,    fy27:9,    confirmed:false }, // TPWD
  '580': { fy26:7.5,  fy27:7.5,  confirmed:false }, // TWDB
  '323': { fy26:7.5,  fy27:7.5,  confirmed:false }, // TRS
  '212': { fy26:10,   fy27:10,   confirmed:false }, // OCA
  '302': { fy26:15,   fy27:15,   confirmed:false }, // OAG
  '305': { fy26:10,   fy27:10,   confirmed:false }, // GLO
  '582': { fy26:11,   fy27:11,   confirmed:false }, // TCEQ
  '307': { fy26:6,    fy27:6,    confirmed:false }, // SOS
  '537': { fy26:20,   fy27:20,   confirmed:false }, // DSHS
  '575': { fy26:15,   fy27:15,   confirmed:false }, // TDEM
  '451': { fy26:0.4,  fy27:0.4,  confirmed:true  }, // DOB
  '455': { fy26:5,    fy27:5,    confirmed:false }, // RRC
};

const CURRENT_FY = '2026';
const PREV_FY    = '2025';

const FMT = (n, d=1) => {
  if (n===null||n===undefined||isNaN(n)||n===0) return n===0?'$0':'—';
  if (n>=1000) return `$${(n/1000).toFixed(d)}B`;
  if (n>=1)    return `$${Number(n).toFixed(d)}M`;
  return `$${(n*1000).toFixed(0)}K`;
};
const PCT = (part, total) => (!total||!part||part<=0)?0:Math.min(Math.round((part/total)*100),100);
const toTxFY = (st) => {
  if (!st) return null;
  const p = st.split('/');
  const m = parseInt(p[0]), y = parseInt(p[p.length-1]);
  return (isNaN(m)||isNaN(y)) ? null : String(m>=9?y+1:y);
};

function Badge({ level }) {
  const cfg = {
    live:      {bg:'#EAF3DE',c:'#27500A',t:'● Live'},
    confirmed: {bg:'#E6F1FB',c:'#0C447C',t:'✓ Confirmed'},
    estimated: {bg:'#FAEEDA',c:'#633806',t:'~ Estimated'},
    nodata:    {bg:'#F1EFE8',c:'#8A93B2',t:'No data'},
    nobudget:  {bg:'#F1EFE8',c:'#8A93B2',t:'Budget N/A'},
  }[level]||{bg:'#FAEEDA',c:'#633806',t:'~'};
  return <span style={{fontSize:9,padding:'2px 6px',borderRadius:4,background:cfg.bg,color:cfg.c,fontWeight:600,whiteSpace:'nowrap'}}>{cfg.t}</span>;
}

function MiniBar({ coop, texan, sts, budget }) {
  if (!budget) return null;
  const total = (coop||0)+(texan||0)+(sts||0);
  const pct   = PCT(total, budget);
  const sc    = pct>90?'#E24B4A':pct>70?'#C8A951':'#1E2761';
  return (
    <div style={{marginTop:6}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
        <span style={{fontSize:10,color:'#8A93B2'}}>vs budget</span>
        <span style={{fontSize:10,fontWeight:700,color:sc}}>{pct}%</span>
      </div>
      <div style={{height:7,background:'#F0F2F8',borderRadius:4,overflow:'hidden',display:'flex'}}>
        {[[coop,'#1E2761'],[texan,'#C8A951'],[sts,'#378ADD']].map(([v,c],i)=>(
          <div key={i} style={{width:`${PCT(v,budget)}%`,height:'100%',background:c,minWidth:v>0?2:0}}/>
        ))}
      </div>
    </div>
  );
}

export default function BudgetTracker() {
  const [coopFY26, setCoopFY26] = useState([]);
  const [coopFY25, setCoopFY25] = useState([]);
  const [stsRaw,   setStsRaw]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [loadMsg,  setLoadMsg]  = useState('');
  const [error,    setError]    = useState(null);
  const [lastFetch,setLastFetch]= useState(null);

  const [activeFY,  setActiveFY]  = useState(CURRENT_FY);
  const [sortBy,    setSortBy]    = useState('coop');
  const [filterCat, setFilterCat] = useState('');
  const [showOnly,  setShowOnly]  = useState('active'); // active | all | budget
  const [search,    setSearch]    = useState('');
  const [expanded,  setExpanded]  = useState(null);
  const [viewMode,  setViewMode]  = useState('cards');

  useEffect(()=>{ fetchAll(); },[]);

  const fetchAll = async () => {
    setLoading(true); setError(null);
    try {
      setLoadMsg('Fetching FY2026 DIR coop & TEX-AN…');
      // Split coop and telecom into separate queries to avoid $limit issues.
      // TEX-AN/CCTS telecom rows use rfo_description containing "Telecomm" or "CCTS".
      // Fetching them separately guarantees we don't lose them to the 50k row limit.
      const [r1coop, r1tel] = await Promise.all([
        fetch(`${API}/${DS_FY26}.json?$select=customer_name,rfo_description,SUM(purchase_amount)%20as%20total&$where=upper(rfo_description)%20not%20like%20%27%25TELECOM%25%27%20AND%20upper(rfo_description)%20not%20like%20%27%25CCTS%25%27&$group=customer_name,rfo_description&$limit=50000`),
        fetch(`${API}/${DS_FY26}.json?$select=customer_name,rfo_description,SUM(purchase_amount)%20as%20total&$where=upper(rfo_description)%20like%20%27%25TELECOM%25%27%20OR%20upper(rfo_description)%20like%20%27%25CCTS%25%27&$group=customer_name,rfo_description&$limit=10000`),
      ]);
      const fy26coop = r1coop.ok ? await r1coop.json() : [];
      const fy26tel  = r1tel.ok  ? await r1tel.json()  : [];
      setCoopFY26([...fy26coop, ...fy26tel]);

      setLoadMsg('Fetching FY2025 DIR coop & TEX-AN…');
      const [r2coop, r2tel] = await Promise.all([
        fetch(`${API}/${DS_HIST}.json?$select=customer_name,rfo_description,SUM(purchase_amount)%20as%20total&$where=fiscal_year=%272025%27%20AND%20upper(rfo_description)%20not%20like%20%27%25TELECOM%25%27%20AND%20upper(rfo_description)%20not%20like%20%27%25CCTS%25%27&$group=customer_name,rfo_description&$limit=50000`),
        fetch(`${API}/${DS_HIST}.json?$select=customer_name,rfo_description,SUM(purchase_amount)%20as%20total&$where=fiscal_year=%272025%27%20AND%20(upper(rfo_description)%20like%20%27%25TELECOM%25%27%20OR%20upper(rfo_description)%20like%20%27%25CCTS%25%27)&$group=customer_name,rfo_description&$limit=10000`),
      ]);
      const fy25coop = r2coop.ok ? await r2coop.json() : [];
      const fy25tel  = r2tel.ok  ? await r2tel.json()  : [];
      setCoopFY25([...fy25coop, ...fy25tel]);

      setLoadMsg('Fetching STS invoices…');
      const r3 = await fetch(`${API}/${DS_STS}.json?$select=customer,business_line,start_time,SUM(total_charges)%20as%20total&$group=customer,business_line,start_time&$limit=50000`);
      if (r3.ok) setStsRaw(await r3.json());

      setLastFetch(new Date().toLocaleString());
    } catch(e) { setError(e.message); }
    setLoading(false); setLoadMsg('');
  };

  // Build spend for one agency + FY

// Exact customer_name values as stored in DIR datasets
// Source: DIR customer eligibility dataset (4v6c-qfkr) + manual verification
const CUSTOMER_NAME_MAP = {
  '529': 'Texas Health and Human Services Commission',
  '601': 'Texas Department of Transportation',
  '405': 'Texas Department of Public Safety',
  '608': 'Texas Department of Motor Vehicles',
  '701': 'Texas Education Agency',
  '304': 'Texas Comptroller of Public Accounts',
  '302': 'Texas Office of the Attorney General',
  '313': 'Texas Department of Information Resources',
  '320': 'Texas Workforce Commission',
  '696': 'Texas Department of Criminal Justice',
  '401': 'Texas Military Department',
  '802': 'Texas Parks and Wildlife Department',
  '580': 'Texas Water Development Board',
  '323': 'Teacher Retirement System of Texas',
  '212': 'Texas Office of Court Administration',
  '305': 'Texas General Land Office',
  '582': 'Texas Commission on Environmental Quality',
  '307': 'Texas Secretary of State',
  '537': 'Texas Department of State Health Services',
  '575': 'Texas Division of Emergency Management',
  '451': 'Texas Department of Banking',
  '455': 'Railroad Commission of Texas',
  '371': 'Texas Cyber Command',
  '530': 'Texas Department of Family and Protective Services',
  '303': 'Texas Facilities Commission',
  '327': 'Employees Retirement System of Texas',
  '328': 'Veterans Land Board',
  '332': 'Texas Department of Housing and Community Affairs',
  '356': 'Texas Ethics Commission',
  '360': 'State Office of Administrative Hearings',
  '403': 'Texas Veterans Commission',
  '407': 'Texas Commission on Law Enforcement',
  '448': 'Office of Injured Employee Counsel',
  '452': 'Texas Department of Licensing and Regulation',
  '454': 'Texas Department of Insurance',
  '458': 'Texas Alcoholic Beverage Commission',
  '473': 'Public Utility Commission of Texas',
  '477': 'Commission on State Emergency Communications',
  '479': 'State Office of Risk Management',
  '503': 'Texas Medical Board',
  '507': 'Texas Board of Nursing',
  '515': 'Texas State Board of Pharmacy',
  '542': 'Cancer Prevention and Research Institute of Texas',
  '551': 'Texas Department of Agriculture',
  '554': 'Texas Animal Health Commission',
  '644': 'Texas Juvenile Justice Department',
  '308': 'Texas State Auditor's Office',
  '301': 'Office of the Governor',
  '306': 'Texas State Library and Archives Commission',
  '781': 'Texas Higher Education Coordinating Board',
};

  const buildSpend = (agency, fy) => {
    const rows = (fy===CURRENT_FY ? coopFY26 : coopFY25)
      .filter(r => {
        if (!r.customer_name) return false;
        const cn = r.customer_name.toUpperCase();
        // 1. Try exact match from lookup map
        const exactName = CUSTOMER_NAME_MAP[agency.num];
        if (exactName && cn === exactName.toUpperCase()) return true;
        // 2. Try contains match on exact name
        if (exactName && cn.includes(exactName.toUpperCase())) return true;
        // 3. Fallback: match on agency name keywords (skip short abbrs like DPS which match too broadly)
        if (agency.name.length > 6) {
          const keywords = agency.name.toUpperCase().replace(/^(TEXAS|DEPARTMENT OF|OFFICE OF|COMMISSION ON)\s+/,'').slice(0,18);
          if (keywords.length > 5 && cn.includes(keywords)) return true;
        }
        return false;
      });

    let coop=0, texan=0;
    const coopByRfo={};
    rows.forEach(r=>{
      const amt=parseFloat(r.total||0)/1e6;
      if(isTexan(r.rfo_description)){ texan+=amt; }
      else { coop+=amt; const k=r.rfo_description||'General'; coopByRfo[k]=(coopByRfo[k]||0)+amt; }
    });

    const sa=(agency.sts_abbr||'').toUpperCase();
    let stsTotal=0; const stsByProg={};
    if (sa) {
      stsRaw.forEach(r=>{
        if(!r.customer) return;
        const cu=r.customer.toUpperCase().trim();
        if(cu!==sa&&!cu.includes(sa)&&!sa.includes(cu)) return;
        if(toTxFY(r.start_time)!==fy) return;
        const amt=parseFloat(r.total||0)/1e6;
        if(isNaN(amt)||amt<=0) return;
        const prog=r.business_line||'Other';
        stsByProg[prog]=(stsByProg[prog]||0)+amt;
        stsTotal+=amt;
      });
    }

    return { coop, texan, stsTotal, coopByRfo, stsByProg };
  };

  // Compute all agencies
  const allMerged = ALL_AGENCIES.map(a=>{
    const spend  = buildSpend(a, activeFY);
    const budget = BUDGETS[a.num];
    const bval   = budget ? (activeFY===CURRENT_FY ? budget.fy26 : budget.fy27) : null;
    const total  = (spend.coop||0)+(spend.texan||0)+(spend.stsTotal||0);
    return { ...a, spend, budget, bval, total };
  });

  // Filter
  let filtered = allMerged.filter(a=>{
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
        !a.abbr.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat && a.category!==filterCat) return false;
    if (showOnly==='active') return a.total>0 || a.bval;
    if (showOnly==='budget') return !!a.bval;
    return true;
  });

  // Sort
  filtered.sort((a,b)=>{
    if(sortBy==='budget')  return (b.bval||0)-(a.bval||0);
    if(sortBy==='total')   return b.total-a.total;
    if(sortBy==='coop')    return (b.spend.coop||0)-(a.spend.coop||0);
    if(sortBy==='texan')   return (b.spend.texan||0)-(a.spend.texan||0);
    if(sortBy==='sts')     return (b.spend.stsTotal||0)-(a.spend.stsTotal||0);
    if(sortBy==='pct')     return PCT(b.total,b.bval||1)-PCT(a.total,a.bval||1);
    if(sortBy==='name')    return a.name.localeCompare(b.name);
    if(sortBy==='num')     return parseInt(a.num)-parseInt(b.num);
    return 0;
  });

  const totals = filtered.reduce((acc,a)=>({
    budget: acc.budget+(a.bval||0),
    coop:   acc.coop+(a.spend.coop||0),
    texan:  acc.texan+(a.spend.texan||0),
    sts:    acc.sts+(a.spend.stsTotal||0),
  }),{budget:0,coop:0,texan:0,sts:0});
  const totKnown=totals.coop+totals.texan+totals.sts;

  const categories=[...new Set(ALL_AGENCIES.map(a=>a.category))].sort();

  return (
    <div style={{maxWidth:1400,margin:'0 auto',padding:'24px',fontFamily:"'DM Sans',sans-serif"}}>

      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#141A47,#1E2761)',borderRadius:16,padding:'22px',marginBottom:16,border:'1px solid rgba(200,169,81,0.25)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
          <div>
            <h2 style={{color:'#FFF',fontSize:21,fontWeight:700,fontFamily:'Georgia,serif',marginBottom:5}}>Agency IT Budget vs Spend Tracker</h2>
            <p style={{color:'#CADCFC',fontSize:12,lineHeight:1.6,maxWidth:700,margin:0}}>
              <strong style={{color:'#C8A951'}}>{ALL_AGENCIES.length} agencies</strong> from the CPA Manual of Accounts.
              Three live buckets: <strong style={{color:'#C8A951'}}>DIR Coop</strong>, <strong style={{color:'#C8A951'}}>TEX-AN</strong>, and <strong style={{color:'#378ADD'}}>STS</strong> (by program).
              Showing agencies with recorded spend or confirmed IT budget. Toggle below to show all.
            </p>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
            <button onClick={fetchAll} disabled={loading} style={{padding:'8px 16px',background:'#C8A951',border:'none',borderRadius:8,color:'#141A47',fontSize:12,fontWeight:600,cursor:loading?'not-allowed':'pointer',fontFamily:'inherit',opacity:loading?0.6:1}}>
              {loading?`⟳ ${loadMsg}`:'⟳ Refresh'}
            </button>
            {lastFetch&&<div style={{fontSize:10,color:'#8A93B2'}}>Fetched: {lastFetch}</div>}
          </div>
        </div>

        {/* FY selector */}
        <div style={{display:'flex',gap:8,marginTop:14,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:12,color:'#CADCFC',fontWeight:500}}>FY:</span>
          {[CURRENT_FY,PREV_FY].map(fy=>(
            <button key={fy} onClick={()=>setActiveFY(fy)} style={{
              padding:'5px 14px',borderRadius:20,border:'1px solid',fontFamily:'inherit',cursor:'pointer',fontSize:12,
              borderColor:activeFY===fy?'#C8A951':'rgba(255,255,255,0.2)',
              background:activeFY===fy?'rgba(200,169,81,0.2)':'transparent',
              color:activeFY===fy?'#C8A951':'rgba(255,255,255,0.65)',
              fontWeight:activeFY===fy?700:400,
            }}>FY{fy} — Sept {parseInt(fy)-1}–Aug {fy}{fy===CURRENT_FY?' (current)':' (prior)'}</button>
          ))}
          <span style={{fontSize:11,color:'#8A93B2'}}>TX FY{activeFY}: Sept {parseInt(activeFY)-1} – Aug {activeFY}</span>
        </div>

        {/* Totals */}
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:14}}>
          {[
            {label:`Budget (${filtered.filter(a=>a.bval).length} agencies)`, val:FMT(totals.budget), sub:'SB1 89th Leg.',       gold:true},
            {label:'DIR Coop (excl. TEX-AN)',                                val:loading?'…':FMT(totals.coop),  sub:'Live · coop dataset', live:true},
            {label:'TEX-AN Telecom',                                         val:loading?'…':FMT(totals.texan), sub:'Live · coop dataset', live:true},
            {label:'STS / DCS',                                              val:loading?'…':FMT(totals.sts),   sub:'Live · 8hps-ztn4',    live:true},
            {label:'Total Known Spend',                                      val:loading?'…':FMT(totKnown),     sub:`${PCT(totKnown,totals.budget)}% of tracked budget`, gold:true},
          ].map(s=>(
            <div key={s.label} style={{background:'rgba(255,255,255,0.07)',border:`1px solid ${s.gold?'rgba(200,169,81,0.4)':'rgba(255,255,255,0.1)'}`,borderRadius:10,padding:'9px 13px',minWidth:120}}>
              <div style={{color:s.gold?'#C8A951':'#FFF',fontSize:16,fontWeight:700,fontFamily:'Georgia,serif',display:'flex',alignItems:'center',gap:5}}>
                {s.val}{s.live&&!loading&&!error&&<span style={{fontSize:8,background:'#27500A',color:'#FFF',borderRadius:3,padding:'1px 4px',fontFamily:'sans-serif',fontWeight:600}}>LIVE</span>}
              </div>
              <div style={{color:'rgba(255,255,255,0.8)',fontSize:10,fontWeight:500,marginTop:2}}>{s.label}</div>
              <div style={{color:'#8A93B2',fontSize:9,marginTop:1}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {error&&<div style={{background:'#FDE8E8',border:'1px solid #F5BCBC',borderRadius:10,padding:'10px 14px',marginBottom:12,fontSize:12,color:'#8B1C1C'}}><strong>Error:</strong> {error}</div>}

      {/* Controls */}
      <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search agencies…"
          style={{padding:'7px 12px',fontSize:12,border:'1px solid rgba(30,39,97,0.15)',borderRadius:8,background:'#FFF',color:'#1A1F3C',outline:'none',fontFamily:'inherit',minWidth:180}}/>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)}
          style={{padding:'7px 12px',fontSize:12,border:'1px solid rgba(30,39,97,0.15)',borderRadius:8,background:'#FFF',color:'#1A1F3C',outline:'none',fontFamily:'inherit'}}>
          <option value="">All categories</option>
          {categories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{display:'flex',gap:4}}>
          {[{k:'active',l:'Active/Budgeted'},{k:'budget',l:'Has Budget'},{k:'all',l:'All Agencies'}].map(f=>(
            <button key={f.k} onClick={()=>setShowOnly(f.k)} style={{
              padding:'5px 10px',fontSize:11,borderRadius:7,border:'1px solid',fontFamily:'inherit',cursor:'pointer',
              borderColor:showOnly===f.k?'#1E2761':'rgba(30,39,97,0.15)',
              background:showOnly===f.k?'#1E2761':'#FFF',
              color:showOnly===f.k?'#FFF':'#8A93B2',
            }}>{f.l} {f.k==='all'?`(${ALL_AGENCIES.length})`:''}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {[{k:'coop',l:'Coop'},{k:'texan',l:'TEX-AN'},{k:'sts',l:'STS'},{k:'total',l:'Total'},{k:'budget',l:'Budget'},{k:'pct',l:'%'},{k:'name',l:'Name'},{k:'num',l:'#'}].map(s=>(
            <button key={s.k} onClick={()=>setSortBy(s.k)} style={{
              padding:'4px 8px',fontSize:10,borderRadius:6,border:'1px solid',fontFamily:'inherit',cursor:'pointer',
              borderColor:sortBy===s.k?'#1E2761':'rgba(30,39,97,0.15)',
              background:sortBy===s.k?'#1E2761':'#FFF',
              color:sortBy===s.k?'#FFF':'#8A93B2',
            }}>↓{s.l}</button>
          ))}
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:5}}>
          {['cards','table'].map(m=>(
            <button key={m} onClick={()=>setViewMode(m)} style={{
              padding:'5px 10px',fontSize:11,borderRadius:7,border:'1px solid',fontFamily:'inherit',cursor:'pointer',
              borderColor:viewMode===m?'#C8A951':'rgba(30,39,97,0.15)',
              background:viewMode===m?'rgba(200,169,81,0.1)':'#FFF',
              color:viewMode===m?'#633806':'#8A93B2',
            }}>{m==='cards'?'⊞':'☰'} {m}</button>
          ))}
        </div>
      </div>
      <div style={{fontSize:11,color:'#8A93B2',marginBottom:10}}>
        Showing <strong style={{color:'#1E2761'}}>{filtered.length}</strong> of {ALL_AGENCIES.length} agencies
      </div>

      {/* ── CARDS ───────────────────────────────────────────────────────────── */}
      {viewMode==='cards'&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:10}}>
          {filtered.map(agency=>{
            const s=agency.spend, isExp=expanded===agency.id;
            const stsList=Object.entries(s.stsByProg||{}).sort((a,b)=>b[1]-a[1]);
            const rfList =Object.entries(s.coopByRfo||{}).sort((a,b)=>b[1]-a[1]);
            const sc=agency.bval ? (PCT(agency.total,agency.bval)>90?'#E24B4A':PCT(agency.total,agency.bval)>70?'#C8A951':'#27500A') : '#8A93B2';

            return (
              <div key={agency.id||agency.num} style={{background:'#FFF',borderRadius:10,border:'1px solid rgba(30,39,97,0.1)',overflow:'hidden',boxShadow:'0 1px 6px rgba(30,39,97,0.05)',cursor:'pointer'}}
                onClick={()=>setExpanded(isExp?null:agency.id||agency.num)}>

                <div style={{background:'#1E2761',padding:'9px 13px',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{color:'#FFF',fontWeight:600,fontSize:12,lineHeight:1.3}}>{agency.name}</div>
                    <div style={{color:'#8A93B2',fontSize:9,marginTop:2}}>{agency.category} · #{agency.num}</div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0,marginLeft:8}}>
                    {agency.bval
                      ? <><div style={{color:'#C8A951',fontSize:14,fontWeight:700,fontFamily:'Georgia,serif'}}>{FMT(agency.bval)}</div><Badge level={agency.budget?.confirmed?'confirmed':'estimated'}/></>
                      : <Badge level="nobudget"/>
                    }
                  </div>
                </div>

                <div style={{padding:'10px 13px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5,marginBottom:8}}>
                    {[
                      {label:'DIR Coop', val:s.coop,     color:'#1E2761'},
                      {label:'TEX-AN',   val:s.texan,    color:'#C8A951'},
                      {label:'STS',      val:s.stsTotal, color:'#378ADD'},
                    ].map(b=>(
                      <div key={b.label} style={{background:'#F4F6FB',borderRadius:6,padding:'6px 8px',textAlign:'center'}}>
                        <div style={{fontSize:12,fontWeight:700,color:b.color,fontFamily:'monospace'}}>{loading?'…':FMT(b.val)}</div>
                        <div style={{fontSize:9,color:'#8A93B2',marginTop:1}}>{b.label}</div>
                        <Badge level={b.val?'live':'nodata'}/>
                      </div>
                    ))}
                  </div>

                  {agency.bval&&<MiniBar coop={s.coop} texan={s.texan} sts={s.stsTotal} budget={agency.bval}/>}

                  {stsList.length>0&&(
                    <div style={{marginTop:7,display:'flex',flexWrap:'wrap',gap:3}}>
                      {stsList.map(([prog,amt])=>{
                        const pd=STS_PROGRAMS[prog]||STS_PROGRAMS['Other'];
                        return(
                          <div key={prog} title={pd.desc} style={{display:'flex',alignItems:'center',gap:2,background:'#F4F6FB',borderRadius:4,padding:'1px 5px'}}>
                            <div style={{width:5,height:5,borderRadius:1,background:pd.color,flexShrink:0}}/>
                            <span style={{fontSize:9,color:'#4A5280'}}>{pd.label}</span>
                            <span style={{fontSize:9,color:'#C8A951',fontFamily:'monospace'}}>{FMT(amt,2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div style={{marginTop:7,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 8px',background:'#F4F6FB',borderRadius:6}}>
                    <span style={{fontSize:10,color:'#8A93B2'}}>Total known FY{activeFY} spend (Sept {parseInt(activeFY)-1}–Aug {activeFY})</span>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontSize:12,fontWeight:700,color:'#1E2761',fontFamily:'monospace'}}>{loading?'…':FMT(agency.total)}</span>
                      {agency.bval&&<span style={{fontSize:10,fontWeight:700,color:sc}}>{PCT(agency.total,agency.bval)}%</span>}
                    </div>
                  </div>
                </div>

                {isExp&&(
                  <div style={{borderTop:'1px solid rgba(30,39,97,0.08)',padding:'10px 13px',background:'#FAFBFD'}}
                    onClick={e=>e.stopPropagation()}>
                    {rfList.length>0&&(
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:10,fontWeight:600,color:'#1E2761',marginBottom:5,textTransform:'uppercase',letterSpacing:0.6}}>DIR Coop by Type <Badge level="live"/></div>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:10}}>
                          <tbody>
                            {rfList.map(([rfo,amt])=>(
                              <tr key={rfo} style={{borderBottom:'1px solid rgba(30,39,97,0.06)'}}>
                                <td style={{padding:'3px 5px',color:'#4A5280'}}>{rfo}</td>
                                <td style={{padding:'3px 5px',fontFamily:'monospace',fontWeight:600,color:'#1E2761',textAlign:'right'}}>{FMT(amt,2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {stsList.length>0&&(
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:10,fontWeight:600,color:'#378ADD',marginBottom:5,textTransform:'uppercase',letterSpacing:0.6}}>STS Programs FY{activeFY} <Badge level="live"/></div>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:10}}>
                          <tbody>
                            {stsList.map(([prog,amt])=>{
                              const pd=STS_PROGRAMS[prog]||STS_PROGRAMS['Other'];
                              return(
                                <tr key={prog} style={{borderBottom:'1px solid rgba(30,39,97,0.06)'}}>
                                  <td style={{padding:'3px 5px'}}>
                                    <div style={{display:'flex',alignItems:'center',gap:3}}><div style={{width:5,height:5,borderRadius:1,background:pd.color}}/><span style={{color:'#4A5280'}}>{pd.label}</span></div>
                                  </td>
                                  <td style={{padding:'3px 5px',color:'#8A93B2',fontSize:9,fontStyle:'italic'}}>{prog}</td>
                                  <td style={{padding:'3px 5px',fontFamily:'monospace',fontWeight:600,color:'#C8A951',textAlign:'right'}}>{FMT(amt,2)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div style={{fontSize:9,color:'#8A93B2',padding:'5px 7px',background:'rgba(200,169,81,0.05)',borderRadius:5,borderLeft:'2px solid #C8A951'}}>
                      <strong style={{color:'#633806'}}>Agency #{agency.num}</strong> · STS match: "{agency.sts_abbr||'N/A'}" ·
                      Budget: {agency.bval ? `${FMT(agency.bval)} FY${activeFY} (${agency.budget?.confirmed?'confirmed':'est.'})` : 'Not tracked in SB1 IT budget database'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE ───────────────────────────────────────────────────────────── */}
      {viewMode==='table'&&(
        <div style={{background:'#FFF',borderRadius:12,border:'1px solid rgba(30,39,97,0.1)',overflow:'hidden',boxShadow:'0 2px 8px rgba(30,39,97,0.05)'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
              <thead>
                <tr style={{background:'#1E2761'}}>
                  {['#','Agency','Category',`FY${activeFY} Annual Budget`,'DIR Coop YTD ●','TEX-AN YTD ●','STS YTD ●','STS Programs','Total Known FY','% Budget'].map(h=>(
                    <th key={h} style={{padding:'8px 10px',textAlign:'left',color:'rgba(255,255,255,0.75)',fontSize:10,fontWeight:500,textTransform:'uppercase',whiteSpace:'nowrap',borderRight:'1px solid rgba(255,255,255,0.06)'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(agency=>{
                  const s=agency.spend;
                  const pct=PCT(agency.total,agency.bval||1);
                  const sc=pct>90?'#E24B4A':pct>70?'#C8A951':'#27500A';
                  const stsList=Object.entries(s.stsByProg||{}).sort((a,b)=>b[1]-a[1]);
                  return(
                    <tr key={agency.num} style={{borderBottom:'1px solid rgba(30,39,97,0.07)'}}
                      onMouseEnter={e=>e.currentTarget.style.background='#F8F9FD'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{padding:'7px 10px',fontSize:10,color:'#8A93B2',fontFamily:'monospace'}}>{agency.num}</td>
                      <td style={{padding:'7px 10px'}}>
                        <div style={{fontWeight:600,color:'#1E2761',fontSize:11}}>{agency.abbr}</div>
                        <div style={{fontSize:9,color:'#8A93B2'}}>{agency.name}</div>
                      </td>
                      <td style={{padding:'7px 10px',fontSize:10,color:'#8A93B2'}}>{agency.category}</td>
                      <td style={{padding:'7px 10px'}}>
                        {agency.bval?<><div style={{fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:12}}>{FMT(agency.bval)}</div><Badge level={agency.budget?.confirmed?'confirmed':'estimated'}/></>:<Badge level="nobudget"/>}
                      </td>
                      <td style={{padding:'7px 10px'}}><div style={{fontFamily:'monospace',fontWeight:700,color:'#1E2761',fontSize:12}}>{loading?'…':FMT(s.coop)}</div>{!loading&&<Badge level={s.coop?'live':'nodata'}/>}</td>
                      <td style={{padding:'7px 10px'}}><div style={{fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:12}}>{loading?'…':FMT(s.texan)}</div>{!loading&&<Badge level={s.texan?'live':'nodata'}/>}</td>
                      <td style={{padding:'7px 10px'}}><div style={{fontFamily:'monospace',fontWeight:700,color:'#378ADD',fontSize:12}}>{loading?'…':(s.stsTotal?FMT(s.stsTotal):'—')}</div>{!loading&&<Badge level={s.stsTotal?'live':'nodata'}/>}</td>
                      <td style={{padding:'7px 10px',maxWidth:140}}>
                        <div style={{display:'flex',flexWrap:'wrap',gap:2}}>
                          {stsList.slice(0,3).map(([prog,amt])=>{
                            const pd=STS_PROGRAMS[prog]||STS_PROGRAMS['Other'];
                            return(<div key={prog} style={{display:'flex',alignItems:'center',gap:2,background:'#F4F6FB',borderRadius:3,padding:'1px 4px'}}>
                              <div style={{width:4,height:4,borderRadius:1,background:pd.color,flexShrink:0}}/><span style={{fontSize:8,color:'#4A5280'}}>{pd.label}</span><span style={{fontSize:8,color:'#C8A951',fontFamily:'monospace'}}>{FMT(amt,1)}</span>
                            </div>);
                          })}
                        </div>
                      </td>
                      <td style={{padding:'7px 10px',fontFamily:'monospace',fontWeight:700,color:'#1E2761',fontSize:12}}>{loading?'…':FMT(agency.total)}</td>
                      <td style={{padding:'7px 10px'}}>
                        {agency.bval?(
                          <div style={{display:'flex',alignItems:'center',gap:5}}>
                            <div style={{width:48,height:5,background:'#F0F2F8',borderRadius:3,overflow:'hidden'}}>
                              <div style={{width:`${pct}%`,height:'100%',background:sc,borderRadius:3}}/>
                            </div>
                            <span style={{fontSize:11,fontWeight:700,color:sc}}>{pct}%</span>
                          </div>
                        ):<span style={{fontSize:9,color:'#8A93B2'}}>—</span>}
                      </td>
                    </tr>
                  );
                })}
                <tr style={{background:'#1E2761',borderTop:'2px solid rgba(200,169,81,0.4)'}}>
                  <td colSpan={3} style={{padding:'8px 10px',color:'#C8A951',fontWeight:700,fontSize:11}}>TOTALS ({filtered.length} agencies)</td>
                  <td style={{padding:'8px 10px',fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:12}}>{FMT(totals.budget)}</td>
                  <td style={{padding:'8px 10px',fontFamily:'monospace',fontWeight:700,color:'#CADCFC',fontSize:12}}>{loading?'…':FMT(totals.coop)}</td>
                  <td style={{padding:'8px 10px',fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:12}}>{loading?'…':FMT(totals.texan)}</td>
                  <td style={{padding:'8px 10px',fontFamily:'monospace',fontWeight:700,color:'#CADCFC',fontSize:12}}>{loading?'…':FMT(totals.sts)}</td>
                  <td/>
                  <td style={{padding:'8px 10px',fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:12}}>{loading?'…':FMT(totKnown)}</td>
                  <td style={{padding:'8px 10px',color:'#C8A951',fontWeight:700,fontSize:11}}>{PCT(totKnown,totals.budget)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p style={{fontSize:11,color:'#8A93B2',marginTop:10,lineHeight:1.7}}>
        <strong style={{color:'#1E2761'}}>Agency list:</strong> CPA Manual of Accounts FY2026 — {ALL_AGENCIES.length} agencies tracked. &nbsp;|&nbsp;
        <strong style={{color:'#1E2761'}}>Live data:</strong> DIR Coop & TEX-AN spend for <strong>FY{activeFY} year-to-date</strong> (Sept {parseInt(activeFY)-1}–Aug {activeFY}) — datasets a743-wj72, w64c-ndf7 · STS invoices filtered to same TX fiscal year — dataset 8hps-ztn4 · All via data.texas.gov. &nbsp;|&nbsp;
        <strong style={{color:'#1E2761'}}>Budgets:</strong> <strong>Annual</strong> IT capital appropriation from SB1 89th Legislature GAA — confirmed where marked, estimated otherwise. Biennium ÷ 2 where only biennium total available. &nbsp;|&nbsp;
        <strong style={{color:'#1E2761'}}>Not captured:</strong> open market IT contracts, federal grant-funded purchases, interagency transfers.
      </p>
    </div>
  );
}
