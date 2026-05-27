import React, { useState, useEffect } from 'react';
import { AGENCIES } from '../data/agencies';

// ─── Dataset IDs ──────────────────────────────────────────────────────────────
const API   = 'https://data.texas.gov/resource';
const DS_FY26_COOP = 'a743-wj72'; // VSR Data Coop & Tele FY2026
const DS_HIST      = 'w64c-ndf7'; // DIR Coop Sales FY2010–Present
const DS_STS       = '8hps-ztn4'; // Customer STS & TX.Gov Invoices

// ─── RFO Description → Bucket mapping ────────────────────────────────────────
// TEX-AN: 'Telecomm', 'Next Generation TEX-AN'
// All other rfo_description values stay in DIR Coop buckets
const TEXAN_RFOS = ['telecomm', 'next generation tex-an', 'tex-an', 'telecom'];

function isTexan(rfo) {
  if (!rfo) return false;
  return TEXAN_RFOS.some(t => rfo.toLowerCase().includes(t));
}

// ─── STS Business Line colors ─────────────────────────────────────────────────
const STS_PROGRAMS = {
  'DCS Texas Private Cloud':     { label:'DCS Private Cloud',  color:'#1E2761', desc:'Atos — private cloud, compute, storage' },
  'DCS Mainframe':               { label:'DCS Mainframe',      color:'#2A3570', desc:'Atos — mainframe compute & storage' },
  'Public Cloud':                { label:'Public Cloud (PCM)', color:'#378ADD', desc:'Rackspace — AWS, Azure, GCP management' },
  'Technology Solution Services':{ label:'TSS',                color:'#6B80B8', desc:'Deloitte — architects, consulting, staff aug' },
  'Managed Security Services':   { label:'MSS',                color:'#E24B4A', desc:'Managed security monitoring & compliance' },
  'Texas.gov':                   { label:'Texas.gov',          color:'#27500A', desc:'Texas.gov portal & payment services' },
  'Other':                       { label:'Other',              color:'#8A93B2', desc:'Miscellaneous STS charges' },
};

// ─── Per-agency approved budgets (SB1 89th Leg.) ─────────────────────────────
// open_market: manually updated monthly from LBB CMS — NO DIR coop, TEX-AN, or STS
// Per LBB FAQ: DIR cooperative contracts are NOT reported to LBB CMS → zero duplication risk
// lbb_url: pre-filtered deep link to LBB contracts.lbb.texas.gov for this agency
const AGENCY_DATA = [
  {
    id:'hhsc',  abbr:'HHSC',  sts_abbr:'HHS',   customer_search:'HEALTH AND HUMAN SERVICES',
    fy26_budget:550, fy27_budget:550, budget_confirmed:true,
    open_market:{ fy25:185, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=529',
    notes:'Largest IT spender. Open market includes TIERS/MMIS vendor contracts. FY26 open market update pending.',
  },
  {
    id:'txdot', abbr:'TxDOT', sts_abbr:'TxDOT', customer_search:'TRANSPORTATION',
    fy26_budget:83.7, fy27_budget:83.7, budget_confirmed:true,
    open_market:{ fy25:52, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=601',
    notes:'High coop spend reflects statewide network refresh. Open market includes district IT contracts.',
  },
  {
    id:'dir',   abbr:'DIR',   sts_abbr:null,     customer_search:'INFORMATION RESOURCES',
    fy26_budget:200, fy27_budget:200, budget_confirmed:false,
    open_market:{ fy25:28, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=313',
    notes:'DIR is STS operator — not an STS customer. Open market is DIR\'s own operational IT.',
  },
  {
    id:'txcc',  abbr:'TXCC',  sts_abbr:'TXCC',   customer_search:'CYBER COMMAND',
    fy26_budget:67.5, fy27_budget:67.5, budget_confirmed:true,
    open_market:{ fy25:null, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=576',
    notes:'New agency — full spend picture emerging through FY2026.',
  },
  {
    id:'dps',   abbr:'DPS',   sts_abbr:'DPS',    customer_search:'PUBLIC SAFETY',
    fy26_budget:45.9, fy27_budget:45.9, budget_confirmed:true,
    open_market:{ fy25:24, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=405',
    notes:'Federal-funded IT (border, law enforcement) not captured in state appropriations.',
  },
  {
    id:'txdmv', abbr:'TxDMV', sts_abbr:'DMV',    customer_search:'MOTOR VEHICLES',
    fy26_budget:62.5, fy27_budget:62.5, budget_confirmed:true,
    open_market:{ fy25:16, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=608',
    notes:'Most FY26 budget dedicated to 30-yr registration/title system replacement.',
  },
  {
    id:'dfps',  abbr:'DFPS',  sts_abbr:'DFPS',   customer_search:'FAMILY AND PROTECTIVE',
    fy26_budget:30, fy27_budget:30, budget_confirmed:false,
    open_market:{ fy25:10, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=530',
    notes:'Federal CCWIS cost share (~50%) not in state appropriation.',
  },
  {
    id:'twc',   abbr:'TWC',   sts_abbr:'TWC',    customer_search:'WORKFORCE COMMISSION',
    fy26_budget:25, fy27_budget:25, budget_confirmed:false,
    open_market:{ fy25:8, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=320',
    notes:'AI platform investments largely through DIR coop contracts.',
  },
  {
    id:'tea',   abbr:'TEA',   sts_abbr:'TEA',    customer_search:'EDUCATION AGENCY',
    fy26_budget:40, fy27_budget:40, budget_confirmed:false,
    open_market:{ fy25:12, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=701',
    notes:'K-12 cybersecurity program spend flows through TEA to districts.',
  },
  {
    id:'cpa',   abbr:'CPA',   sts_abbr:'CPA',    customer_search:'COMPTROLLER',
    fy26_budget:27.5, fy27_budget:27.5, budget_confirmed:false,
    open_market:{ fy25:8, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=304',
    notes:'CAPPS steward — some costs allocated statewide to other agencies.',
  },
  {
    id:'tdcj',  abbr:'TDCJ',  sts_abbr:'TDCJ',   customer_search:'CRIMINAL JUSTICE',
    fy26_budget:22.5, fy27_budget:22.5, budget_confirmed:false,
    open_market:{ fy25:10, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=696',
    notes:'Facility tech and surveillance often open market.',
  },
  {
    id:'tpwd',  abbr:'TPWD',  sts_abbr:'TPWD',   customer_search:'PARKS AND WILDLIFE',
    fy26_budget:9, fy27_budget:9, budget_confirmed:false,
    open_market:{ fy25:3, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=802',
    notes:'Strong DIR coop utilization historically.',
  },
  {
    id:'twdb',  abbr:'TWDB',  sts_abbr:'TWDB',   customer_search:'WATER DEVELOPMENT',
    fy26_budget:7.5, fy27_budget:7.5, budget_confirmed:false,
    open_market:{ fy25:2, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=580',
    notes:'STS contract $7.74M confirmed from board minutes Aug 2023.',
  },
  {
    id:'trs',   abbr:'TRS',   sts_abbr:'TRS',    customer_search:'TEACHER RETIREMENT',
    fy26_budget:7.5, fy27_budget:7.5, budget_confirmed:false,
    open_market:{ fy25:3, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=323',
    notes:'Pension modernization largely open market.',
  },
  {
    id:'oca',   abbr:'OCA',   sts_abbr:'OCA',    customer_search:'COURT ADMINISTRATION',
    fy26_budget:10, fy27_budget:10, budget_confirmed:false,
    open_market:{ fy25:5, fy26:null },
    open_market_confirmed:false,
    lbb_url:'https://contracts.lbb.texas.gov/?agency=212',
    notes:'HB500 funded appellate CMS ($11.9M) and specialty courts ($3.9M).',
  },
];

// Texas FY = Sept 1 – Aug 31. FY2026 = Sept 2025 – Aug 2026
const CURRENT_FY = '2026';
const PREV_FY    = '2025';

const FMT = (n, d=1) => {
  if (n===null||n===undefined||isNaN(n)) return '—';
  if (n===0) return '$0';
  if (n>=1000) return `$${(n/1000).toFixed(d)}B`;
  if (n>=1)    return `$${Number(n).toFixed(d)}M`;
  return `$${(n*1000).toFixed(0)}K`;
};
const PCT = (part, total) => (!total||!part||part<0) ? 0 : Math.min(Math.round((part/total)*100),100);

function Badge({ level }) {
  const cfg = {
    live:      { bg:'#EAF3DE', c:'#27500A', t:'● Live'        },
    confirmed: { bg:'#E6F1FB', c:'#0C447C', t:'✓ Confirmed'   },
    estimated: { bg:'#FAEEDA', c:'#633806', t:'~ Estimated'   },
    nodata:    { bg:'#F1EFE8', c:'#8A93B2', t:'No data'       },
    manual:    { bg:'#F8F0FE', c:'#4A1B7A', t:'✎ Manual'      },
  }[level]||{bg:'#FAEEDA',c:'#633806',t:'~ Estimated'};
  return <span style={{fontSize:9,padding:'2px 6px',borderRadius:4,background:cfg.bg,color:cfg.c,fontWeight:600,whiteSpace:'nowrap'}}>{cfg.t}</span>;
}

// Stacked horizontal bar showing spend buckets vs budget
function StackedBar({ budget, buckets }) {
  const total = buckets.reduce((s,b)=>s+(b.val||0),0);
  const pct   = PCT(total, budget);
  const sc    = pct>90?'#E24B4A':pct>70?'#C8A951':'#1E2761';
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{fontSize:11,color:'#8A93B2'}}>Known spend vs FY budget</span>
        <span style={{fontSize:12,fontWeight:700,color:sc}}>{pct}% of ${budget}M</span>
      </div>
      <div style={{height:12,background:'#F0F2F8',borderRadius:6,overflow:'hidden',display:'flex'}}>
        {buckets.map((b,i)=>(
          <div key={i} title={`${b.label}: ${FMT(b.val)}`} style={{
            width:`${PCT(b.val,budget)}%`, height:'100%',
            background:b.color, minWidth:b.val>0?2:0, transition:'width 0.5s ease',
          }}/>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginTop:5,flexWrap:'wrap'}}>
        {buckets.filter(b=>b.val>0).map(b=>(
          <div key={b.label} style={{display:'flex',alignItems:'center',gap:3}}>
            <div style={{width:7,height:7,borderRadius:2,background:b.color,flexShrink:0}}/>
            <span style={{fontSize:10,color:'#8A93B2'}}>{b.label}: <strong style={{color:'#1A1F3C'}}>{FMT(b.val)}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BudgetTracker() {
  const [raw,        setRaw]        = useState({ fy26_coop:[], fy25_coop:[], sts:[] });
  const [loading,    setLoading]    = useState(true);
  const [loadMsg,    setLoadMsg]    = useState('');
  const [error,      setError]      = useState(null);
  const [lastFetch,  setLastFetch]  = useState(null);
  const [activeFY,   setActiveFY]   = useState(CURRENT_FY); // '2026' | '2025'
  const [sortBy,     setSortBy]     = useState('budget');
  const [filterCat,  setFilterCat]  = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode,   setViewMode]   = useState('cards');

  useEffect(()=>{ fetchAll(); },[]);

  const fetchAll = async () => {
    setLoading(true); setError(null);
    try {
      // FY26 coop — all rfo descriptions (we'll split TEX-AN client-side)
      setLoadMsg('Fetching FY2026 DIR/TEX-AN spend…');
      const r1 = await fetch(`${API}/${DS_FY26_COOP}.json?$select=customer_name,rfo_description,SUM(purchase_amount)%20as%20total&$group=customer_name,rfo_description&$limit=5000`);
      const fy26 = r1.ok ? await r1.json() : [];

      // FY25 coop from history dataset
      setLoadMsg('Fetching FY2025 DIR/TEX-AN spend…');
      const r2 = await fetch(`${API}/${DS_HIST}.json?$select=customer_name,rfo_description,SUM(purchase_amount)%20as%20total&$where=fiscal_year=%272025%27&$group=customer_name,rfo_description&$limit=5000`);
      const fy25 = r2.ok ? await r2.json() : [];

      // STS — all time, grouped by customer + business_line + start_time (month)
      // We parse start_time to determine FY
      setLoadMsg('Fetching STS invoices…');
      const r3 = await fetch(`${API}/${DS_STS}.json?$select=customer,business_line,start_time,SUM(total_charges)%20as%20total&$group=customer,business_line,start_time&$limit=50000`);
      const sts = r3.ok ? await r3.json() : [];

      setRaw({ fy26_coop:fy26, fy25_coop:fy25, sts });
      setLastFetch(new Date().toLocaleString());
    } catch(e) { setError(e.message); }
    setLoading(false); setLoadMsg('');
  };

  // Parse "MM/YYYY" STS start_time → Texas FY string
  // TX FY: Sept 1 – Aug 31. So month 9-12 of year Y = FY(Y+1); month 1-8 of year Y = FY(Y)
  const toTxFY = (startTime) => {
    if (!startTime) return null;
    const parts = startTime.split('/');
    if (parts.length < 2) return null;
    const month = parseInt(parts[0]);
    const year  = parseInt(parts[parts.length-1]);
    if (isNaN(month)||isNaN(year)) return null;
    return String(month >= 9 ? year+1 : year);
  };

  // Build structured spend data for a given agency + FY
  const buildAgencyFY = (agency, fy) => {
    const coopRaw = fy===CURRENT_FY ? raw.fy26_coop : raw.fy25_coop;
    const term    = agency.customer_search.toUpperCase();

    // Filter coop rows for this agency
    const agencyRows = coopRaw.filter(r => r.customer_name?.toUpperCase().includes(term));

    // Split TEX-AN vs DIR Coop
    let texan = 0, coop = 0;
    const coopByRfo = {};
    agencyRows.forEach(r => {
      const amt = parseFloat(r.total||0)/1e6;
      if (isTexan(r.rfo_description)) {
        texan += amt;
      } else {
        coop += amt;
        const rfo = r.rfo_description || 'General';
        coopByRfo[rfo] = (coopByRfo[rfo]||0) + amt;
      }
    });

    // STS for this agency + FY
    const stsAbbr = (agency.sts_abbr||'').toUpperCase();
    let stsTotal = 0;
    const stsByProgram = {};
    raw.sts.forEach(r => {
      if (!r.customer) return;
      const custUp = r.customer.toUpperCase().trim();
      if (custUp !== stsAbbr && !custUp.includes(stsAbbr)) return;
      const rowFY = toTxFY(r.start_time);
      if (rowFY !== fy) return;
      const amt = parseFloat(r.total||0)/1e6;
      if (isNaN(amt)||amt<=0) return;
      const prog = r.business_line || 'Other';
      stsByProgram[prog] = (stsByProgram[prog]||0) + amt;
      stsTotal += amt;
    });

    // Open market (manual)
    const om = agency.open_market?.[`fy${fy.slice(-2)}`] ?? null;

    return { coop, coopByRfo, texan, stsTotal, stsByProgram, openMarket:om };
  };

  // Merge all agencies with computed spend
  const merged = AGENCY_DATA.map(a => {
    const meta   = AGENCIES.find(x=>x.id===a.id)||{};
    const fyData = buildAgencyFY(a, activeFY);
    const budget = activeFY===CURRENT_FY ? a.fy26_budget : a.fy27_budget;
    return { ...meta, ...a, budget, fyData };
  });

  const sorted = [...merged]
    .filter(a => !filterCat || a.category===filterCat)
    .sort((a,b)=>{
      const getTotal = x => (x.fyData.coop||0)+(x.fyData.texan||0)+(x.fyData.stsTotal||0)+(x.fyData.openMarket||0);
      if (sortBy==='budget') return (b.budget||0)-(a.budget||0);
      if (sortBy==='total')  return getTotal(b)-getTotal(a);
      if (sortBy==='coop')   return (b.fyData.coop||0)-(a.fyData.coop||0);
      if (sortBy==='texan')  return (b.fyData.texan||0)-(a.fyData.texan||0);
      if (sortBy==='sts')    return (b.fyData.stsTotal||0)-(a.fyData.stsTotal||0);
      if (sortBy==='pct') {
        return PCT(getTotal(b),b.budget||1)-PCT(getTotal(a),a.budget||1);
      }
      if (sortBy==='name') return (a.name||a.abbr||'').localeCompare(b.name||b.abbr||'');
      return 0;
    });

  // Grand totals
  const totals = sorted.reduce((acc,a)=>{
    acc.budget   += a.budget||0;
    acc.coop     += a.fyData.coop||0;
    acc.texan    += a.fyData.texan||0;
    acc.sts      += a.fyData.stsTotal||0;
    acc.openMkt  += a.fyData.openMarket||0;
    return acc;
  },{budget:0,coop:0,texan:0,sts:0,openMkt:0});
  const totalsKnown = totals.coop+totals.texan+totals.sts+totals.openMkt;

  const categories = [...new Set(AGENCIES.map(a=>a.category).filter(Boolean))].sort();

  const BUCKET_COLORS = {
    coop:'#1E2761', texan:'#C8A951', sts:'#378ADD', openMkt:'#8A93B2'
  };

  return (
    <div style={{maxWidth:1400,margin:'0 auto',padding:'24px',fontFamily:"'DM Sans',sans-serif"}}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(135deg,#141A47,#1E2761)',borderRadius:16,padding:'22px',marginBottom:16,border:'1px solid rgba(200,169,81,0.25)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
          <div>
            <h2 style={{color:'#FFFFFF',fontSize:21,fontWeight:700,fontFamily:'Georgia,serif',marginBottom:5}}>
              Agency IT Budget vs Spend Tracker
            </h2>
            <p style={{color:'#CADCFC',fontSize:12,lineHeight:1.6,maxWidth:680,margin:0}}>
              Four spend buckets, all live or manually verified.
              <strong style={{color:'#C8A951'}}> DIR Coop</strong> and
              <strong style={{color:'#C8A951'}}> TEX-AN</strong> split from the same dataset —
              <strong style={{color:'#C8A951'}}> STS</strong> broken out by program (DCS, MSS, TSS, PCM, Public Cloud) —
              <strong style={{color:'#8A93B2'}}> Open Market</strong> updated monthly from LBB CMS.
              No duplicates: DIR coop purchases are excluded from LBB reporting by rule.
            </p>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
            <button onClick={fetchAll} disabled={loading} style={{
              padding:'8px 16px',background:'#C8A951',border:'none',borderRadius:8,
              color:'#141A47',fontSize:12,fontWeight:600,
              cursor:loading?'not-allowed':'pointer',fontFamily:'inherit',opacity:loading?0.6:1
            }}>{loading?`⟳ ${loadMsg}`:'⟳ Refresh Live Data'}</button>
            {lastFetch&&<div style={{fontSize:10,color:'#8A93B2'}}>Fetched: {lastFetch}</div>}
          </div>
        </div>

        {/* FY selector */}
        <div style={{display:'flex',gap:8,marginTop:16,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:12,color:'#CADCFC',fontWeight:500}}>Fiscal Year:</span>
          {[CURRENT_FY, PREV_FY].map(fy=>(
            <button key={fy} onClick={()=>setActiveFY(fy)} style={{
              padding:'6px 16px',borderRadius:20,border:'1px solid',fontFamily:'inherit',cursor:'pointer',fontSize:12,
              borderColor:  activeFY===fy?'#C8A951':'rgba(255,255,255,0.2)',
              background:   activeFY===fy?'rgba(200,169,81,0.2)':'transparent',
              color:        activeFY===fy?'#C8A951':'rgba(255,255,255,0.65)',
              fontWeight:   activeFY===fy?700:400,
            }}>FY{fy} {fy===CURRENT_FY?'(current)':'(prior)'}</button>
          ))}
          <span style={{fontSize:11,color:'#8A93B2',marginLeft:4}}>
            TX FY{activeFY}: Sept {parseInt(activeFY)-1} – Aug {activeFY}
          </span>
        </div>

        {/* Summary stat row */}
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:16}}>
          {[
            {label:`FY${activeFY} IT Budget`,      val:FMT(totals.budget),       sub:'SB1 89th Legislature',     gold:true},
            {label:'DIR Coop (excl. TEX-AN)',       val:loading?'…':FMT(totals.coop),   sub:'Live · coop dataset',      live:true},
            {label:'TEX-AN Telecom',               val:loading?'…':FMT(totals.texan),  sub:'Live · coop dataset',      live:true},
            {label:'STS / DCS',                    val:loading?'…':FMT(totals.sts),    sub:'Live · dataset 8hps-ztn4', live:true},
            {label:'Open Market (manual)',          val:FMT(totals.openMkt),      sub:'Monthly update · LBB CMS', gold:false},
            {label:'Total Known',                  val:loading?'…':FMT(totalsKnown),   sub:`${PCT(totalsKnown,totals.budget)}% of budget`, gold:true},
          ].map(s=>(
            <div key={s.label} style={{background:'rgba(255,255,255,0.07)',border:`1px solid ${s.gold?'rgba(200,169,81,0.4)':'rgba(255,255,255,0.1)'}`,borderRadius:10,padding:'10px 14px',minWidth:120}}>
              <div style={{color:s.gold?'#C8A951':'#FFFFFF',fontSize:17,fontWeight:700,fontFamily:'Georgia,serif',display:'flex',alignItems:'center',gap:5}}>
                {s.val}
                {s.live&&!loading&&!error&&<span style={{fontSize:8,background:'#27500A',color:'#FFF',borderRadius:3,padding:'1px 4px',fontFamily:'sans-serif',fontWeight:600}}>LIVE</span>}
              </div>
              <div style={{color:'rgba(255,255,255,0.8)',fontSize:10,fontWeight:500,marginTop:2}}>{s.label}</div>
              <div style={{color:'#8A93B2',fontSize:9,marginTop:1}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error&&<div style={{background:'#FDE8E8',border:'1px solid #F5BCBC',borderRadius:10,padding:'10px 14px',marginBottom:12,fontSize:12,color:'#8B1C1C'}}><strong>Live data error:</strong> {error} — Click Refresh to retry.</div>}

      {/* Deduplication note */}
      <div style={{background:'#F0F4FF',border:'1px solid rgba(30,39,97,0.15)',borderRadius:10,padding:'10px 16px',marginBottom:12}}>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-start'}}>
          <div style={{fontSize:11,color:'#1E2761',fontWeight:600,flexShrink:0}}>⚠ Deduplication rules:</div>
          <div style={{fontSize:11,color:'#4A5280',lineHeight:1.6}}>
            <strong>TEX-AN</strong> is split from DIR Coop using <code>rfo_description IN ('Telecomm','Next Generation TEX-AN')</code> — not double-counted.&nbsp;
            <strong>STS</strong> is billed separately via IAC — no overlap with coop.&nbsp;
            <strong>Open Market</strong> sourced from LBB CMS — DIR coop purchases are excluded from LBB reporting by statute (GAA Art. IX FAQ), so zero duplication risk.&nbsp;
            <strong>Federal-funded IT</strong> (grants, IACs with federal agencies) is NOT captured here.
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{background:'#FFFBF0',border:'1px solid rgba(200,169,81,0.3)',borderRadius:10,padding:'8px 14px',marginBottom:12,display:'flex',gap:14,flexWrap:'wrap',alignItems:'center'}}>
        {[
          {level:'live',      t:'DIR Coop, TEX-AN, STS — live from Texas ODP'},
          {level:'manual',    t:'Open Market — updated monthly from LBB contracts.lbb.texas.gov'},
          {level:'confirmed', t:'Confirmed from official source'},
          {level:'estimated', t:'Estimated — verify before client use'},
        ].map(i=>(
          <div key={i.t} style={{display:'flex',alignItems:'center',gap:5}}>
            <Badge level={i.level}/><span style={{fontSize:11,color:'#633806'}}>{i.t}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{padding:'7px 12px',fontSize:12,border:'1px solid rgba(30,39,97,0.15)',borderRadius:8,background:'#FFF',color:'#1A1F3C',outline:'none',fontFamily:'inherit'}}>
          <option value="">All categories</option>
          {categories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {[
            {k:'budget',l:'Budget ↓'},
            {k:'total', l:'Total Spend ↓'},
            {k:'coop',  l:'DIR Coop ↓'},
            {k:'texan', l:'TEX-AN ↓'},
            {k:'sts',   l:'STS ↓'},
            {k:'pct',   l:'% Used ↓'},
            {k:'name',  l:'Name'},
          ].map(s=>(
            <button key={s.k} onClick={()=>setSortBy(s.k)} style={{
              padding:'5px 10px',fontSize:11,borderRadius:7,border:'1px solid',fontFamily:'inherit',cursor:'pointer',
              borderColor:sortBy===s.k?'#1E2761':'rgba(30,39,97,0.15)',
              background: sortBy===s.k?'#1E2761':'#FFF',
              color:      sortBy===s.k?'#FFF':'#8A93B2',
              fontWeight: sortBy===s.k?600:400,
            }}>Sort: {s.l}</button>
          ))}
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:5}}>
          {['cards','table'].map(m=>(
            <button key={m} onClick={()=>setViewMode(m)} style={{
              padding:'5px 11px',fontSize:11,borderRadius:7,border:'1px solid',fontFamily:'inherit',cursor:'pointer',
              borderColor:viewMode===m?'#C8A951':'rgba(30,39,97,0.15)',
              background: viewMode===m?'rgba(200,169,81,0.1)':'#FFF',
              color:      viewMode===m?'#633806':'#8A93B2',
            }}>{m==='cards'?'⊞ Cards':'☰ Table'}</button>
          ))}
        </div>
      </div>

      {/* ── CARDS VIEW ──────────────────────────────────────────────────────── */}
      {viewMode==='cards'&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(390px,1fr))',gap:12}}>
          {sorted.map(agency=>{
            const d       = agency.fyData;
            const total   = (d.coop||0)+(d.texan||0)+(d.stsTotal||0)+(d.openMarket||0);
            const pct     = PCT(total, agency.budget);
            const sc      = pct>90?'#E24B4A':pct>70?'#C8A951':'#27500A';
            const isExp   = expandedId===agency.id;
            const buckets = [
              {label:'DIR Coop',   val:d.coop,        color:BUCKET_COLORS.coop},
              {label:'TEX-AN',     val:d.texan,       color:BUCKET_COLORS.texan},
              {label:'STS',        val:d.stsTotal,    color:BUCKET_COLORS.sts},
              {label:'Open Mkt',   val:d.openMarket,  color:BUCKET_COLORS.openMkt},
            ];
            const stsList = Object.entries(d.stsByProgram||{}).sort((a,b)=>b[1]-a[1]);
            const coopList= Object.entries(d.coopByRfo||{}).sort((a,b)=>b[1]-a[1]);

            return (
              <div key={agency.id} style={{background:'#FFF',borderRadius:12,border:'1px solid rgba(30,39,97,0.1)',overflow:'hidden',boxShadow:'0 2px 8px rgba(30,39,97,0.05)',cursor:'pointer'}}
                onClick={()=>setExpandedId(isExp?null:agency.id)}>

                {/* Card header */}
                <div style={{background:'#1E2761',padding:'11px 15px',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{color:'#FFF',fontWeight:600,fontSize:13}}>{agency.name||agency.abbr}</div>
                    <div style={{color:'#8A93B2',fontSize:10,marginTop:2}}>{agency.category}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{color:'#C8A951',fontSize:17,fontWeight:700,fontFamily:'Georgia,serif'}}>
                      FY{activeFY}: {FMT(agency.budget)}
                    </div>
                    <div style={{display:'flex',gap:4,marginTop:2,justifyContent:'flex-end'}}>
                      <Badge level={agency.budget_confirmed?'confirmed':'estimated'}/>
                      <span style={{fontSize:9,color:'#8A93B2'}}>annual budget</span>
                    </div>
                  </div>
                </div>

                <div style={{padding:'13px 15px'}}>
                  {/* Stacked bar */}
                  <StackedBar budget={agency.budget} buckets={buckets}/>

                  {/* Four spend buckets */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:5,marginTop:11}}>
                    {[
                      {label:'DIR Coop',  val:d.coop,       color:'#1E2761', badge:'live'},
                      {label:'TEX-AN',    val:d.texan,      color:'#C8A951', badge:'live'},
                      {label:'STS',       val:d.stsTotal,   color:'#378ADD', badge:d.stsTotal?'live':'nodata'},
                      {label:'Open Mkt',  val:d.openMarket, color:'#8A93B2', badge:d.openMarket?'manual':'nodata'},
                    ].map(b=>(
                      <div key={b.label} style={{background:'#F4F6FB',borderRadius:7,padding:'7px 8px'}}>
                        <div style={{fontSize:12,fontWeight:700,color:b.color,fontFamily:'monospace'}}>
                          {loading?'…':FMT(b.val)}
                        </div>
                        <div style={{fontSize:9.5,color:'#1A1F3C',fontWeight:500,marginTop:1}}>{b.label}</div>
                        <div style={{marginTop:2}}><Badge level={b.badge}/></div>
                      </div>
                    ))}
                  </div>

                  {/* STS mini-breakdown */}
                  {stsList.length>0&&(
                    <div style={{marginTop:9,background:'#F4F6FB',borderRadius:8,padding:'7px 10px'}}>
                      <div style={{fontSize:10,fontWeight:600,color:'#378ADD',marginBottom:5,textTransform:'uppercase',letterSpacing:0.7}}>
                        STS Programs <Badge level="live"/>
                      </div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                        {stsList.map(([prog,amt])=>{
                          const pd=STS_PROGRAMS[prog]||STS_PROGRAMS['Other'];
                          return (
                            <div key={prog} title={pd.desc} style={{display:'flex',alignItems:'center',gap:3,background:'#FFF',border:'1px solid rgba(30,39,97,0.1)',borderRadius:5,padding:'2px 6px'}}>
                              <div style={{width:5,height:5,borderRadius:1,background:pd.color,flexShrink:0}}/>
                              <span style={{fontSize:9.5,fontWeight:600,color:'#1A1F3C'}}>{pd.label}</span>
                              <span style={{fontSize:9.5,color:'#C8A951',fontFamily:'monospace'}}>{FMT(amt,2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TEX-AN callout if >0 */}
                  {d.texan>0&&(
                    <div style={{marginTop:7,background:'rgba(200,169,81,0.06)',borderRadius:7,padding:'6px 10px',border:'1px solid rgba(200,169,81,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:11,color:'#633806',fontWeight:500}}>TEX-AN Telecom</span>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{fontSize:12,fontWeight:700,color:'#C8A951',fontFamily:'monospace'}}>{FMT(d.texan)}</span>
                        <Badge level="live"/>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div style={{marginTop:9,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 9px',background:'#F4F6FB',borderRadius:7}}>
                    <span style={{fontSize:11,color:'#8A93B2'}}>Total known FY{activeFY}</span>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:13,fontWeight:700,color:'#1E2761',fontFamily:'monospace'}}>{loading?'…':FMT(total)}</span>
                      <span style={{fontSize:11,fontWeight:700,color:sc}}>{pct}%</span>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExp&&(
                  <div style={{borderTop:'1px solid rgba(30,39,97,0.08)',padding:'13px 15px',background:'#FAFBFD'}}
                    onClick={e=>e.stopPropagation()}>

                    {/* DIR Coop by RFO type */}
                    {coopList.length>0&&(
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:10,fontWeight:600,color:'#1E2761',textTransform:'uppercase',letterSpacing:0.7,marginBottom:6}}>
                          DIR Coop by Contract Type <Badge level="live"/>
                        </div>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                          <tbody>
                            {coopList.map(([rfo,amt])=>(
                              <tr key={rfo} style={{borderBottom:'1px solid rgba(30,39,97,0.06)'}}>
                                <td style={{padding:'4px 6px',color:'#4A5280'}}>{rfo}</td>
                                <td style={{padding:'4px 6px',fontFamily:'monospace',fontWeight:600,color:'#1E2761',textAlign:'right'}}>{FMT(amt,2)}</td>
                              </tr>
                            ))}
                            <tr style={{background:'#F0F4FF'}}>
                              <td style={{padding:'4px 6px',fontWeight:600,color:'#1E2761',fontSize:11}}>DIR Coop Total</td>
                              <td style={{padding:'4px 6px',fontFamily:'monospace',fontWeight:700,color:'#1E2761',textAlign:'right'}}>{FMT(d.coop,2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* TEX-AN detail */}
                    {d.texan>0&&(
                      <div style={{marginBottom:12,padding:'8px 10px',background:'rgba(200,169,81,0.06)',borderRadius:7,border:'1px solid rgba(200,169,81,0.2)'}}>
                        <div style={{fontSize:10,fontWeight:600,color:'#633806',textTransform:'uppercase',letterSpacing:0.7,marginBottom:3}}>
                          TEX-AN Telecom <Badge level="live"/>
                        </div>
                        <div style={{fontSize:11,color:'#4A5280'}}>
                          Voice (local, long-distance, toll-free), Data (broadband, MPLS, Internet circuits), SOHO.
                          State agencies are required to procure these through TEX-AN.
                        </div>
                        <div style={{fontSize:13,fontWeight:700,color:'#C8A951',fontFamily:'monospace',marginTop:4}}>{FMT(d.texan,2)}</div>
                        <div style={{fontSize:9,color:'#8A93B2',marginTop:2}}>
                          Filtered from DIR coop dataset using rfo_description IN ('Telecomm','Next Generation TEX-AN')
                        </div>
                      </div>
                    )}

                    {/* STS detail table */}
                    {stsList.length>0&&(
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:10,fontWeight:600,color:'#378ADD',textTransform:'uppercase',letterSpacing:0.7,marginBottom:6}}>
                          STS Program Detail <Badge level="live"/>
                        </div>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                          <thead>
                            <tr style={{background:'#1E2761'}}>
                              {['Business Line','Program','FY Amount','Description'].map(h=>(
                                <th key={h} style={{padding:'5px 8px',textAlign:'left',color:'rgba(255,255,255,0.75)',fontSize:10,fontWeight:500}}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {stsList.map(([prog,amt])=>{
                              const pd=STS_PROGRAMS[prog]||STS_PROGRAMS['Other'];
                              return (
                                <tr key={prog} style={{borderBottom:'1px solid rgba(30,39,97,0.06)'}}>
                                  <td style={{padding:'5px 8px',fontWeight:500,color:'#1E2761'}}>{prog}</td>
                                  <td style={{padding:'5px 8px'}}>
                                    <div style={{display:'flex',alignItems:'center',gap:3}}>
                                      <div style={{width:6,height:6,borderRadius:1,background:pd.color,flexShrink:0}}/>
                                      <span style={{color:'#4A5280'}}>{pd.label}</span>
                                    </div>
                                  </td>
                                  <td style={{padding:'5px 8px',fontFamily:'monospace',fontWeight:700,color:'#C8A951'}}>{FMT(amt,2)}</td>
                                  <td style={{padding:'5px 8px',fontSize:10,color:'#8A93B2',fontStyle:'italic'}}>{pd.desc}</td>
                                </tr>
                              );
                            })}
                            <tr style={{background:'#F4F6FB'}}>
                              <td colSpan={2} style={{padding:'5px 8px',fontWeight:600,color:'#1E2761'}}>STS Total FY{activeFY}</td>
                              <td style={{padding:'5px 8px',fontFamily:'monospace',fontWeight:700,color:'#378ADD'}}>{FMT(d.stsTotal,2)}</td>
                              <td/>
                            </tr>
                          </tbody>
                        </table>
                        <div style={{fontSize:9,color:'#8A93B2',marginTop:4}}>
                          Filtered from dataset 8hps-ztn4 by customer abbr "{agency.sts_abbr}" and TX FY{activeFY} (Sept {parseInt(activeFY)-1}–Aug {activeFY})
                        </div>
                      </div>
                    )}

                    {/* Open market */}
                    <div style={{marginBottom:12,padding:'8px 10px',background:'#F8F0FE',borderRadius:7,border:'1px solid rgba(74,27,122,0.15)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <div>
                          <div style={{fontSize:10,fontWeight:600,color:'#4A1B7A',textTransform:'uppercase',letterSpacing:0.7,marginBottom:3}}>
                            Open Market Procurement <Badge level="manual"/>
                          </div>
                          <div style={{fontSize:11,color:'#4A5280',lineHeight:1.5}}>
                            Sourced from LBB Contract Management System (contracts.lbb.texas.gov).
                            Includes contracts &gt;$50K not through DIR coop, TEX-AN, or STS.
                            DIR coop excluded from LBB by statute — zero duplication.
                            Updated monthly.
                          </div>
                        </div>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#4A1B7A',fontSize:14,marginLeft:12,flexShrink:0}}>
                          {d.openMarket ? FMT(d.openMarket,2) : '—'}
                        </div>
                      </div>
                      <a href={agency.lbb_url} target="_blank" rel="noreferrer"
                        style={{display:'inline-block',marginTop:6,fontSize:10,color:'#4A1B7A',fontWeight:600,textDecoration:'none'}}>
                        ↗ View {agency.abbr} contracts at LBB CMS
                      </a>
                    </div>

                    {/* Budget */}
                    <div style={{padding:'7px 9px',background:'rgba(200,169,81,0.06)',borderRadius:7,border:'1px solid rgba(200,169,81,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <div>
                        <div style={{fontSize:10,fontWeight:600,color:'#633806',marginBottom:2}}>Approved FY{activeFY} IT Budget</div>
                        <div style={{fontSize:10,color:'#8A93B2',fontStyle:'italic'}}>
                          {agency.budget_confirmed?'Confirmed — SB1 89th Legislature GAA':'Estimated — extrapolated from total budget; verify at lbb.texas.gov'}
                        </div>
                      </div>
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <span style={{fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:14}}>{FMT(agency.budget)}</span>
                        <Badge level={agency.budget_confirmed?'confirmed':'estimated'}/>
                      </div>
                    </div>

                    {agency.notes&&(
                      <div style={{padding:'7px 9px',background:'#F0F4FF',borderRadius:6,borderLeft:'3px solid #C8A951'}}>
                        <div style={{fontSize:10,fontWeight:600,color:'#1E2761',marginBottom:2}}>Context</div>
                        <div style={{fontSize:11,color:'#4A5280',lineHeight:1.5}}>{agency.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ──────────────────────────────────────────────────────── */}
      {viewMode==='table'&&(
        <div style={{background:'#FFF',borderRadius:12,border:'1px solid rgba(30,39,97,0.1)',overflow:'hidden',boxShadow:'0 2px 8px rgba(30,39,97,0.05)'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr style={{background:'#1E2761'}}>
                  {[
                    `Agency`,
                    `FY${activeFY} Budget`,
                    `DIR Coop ●`,
                    `TEX-AN ●`,
                    `STS ●`,
                    `STS Programs ●`,
                    `Open Mkt ✎`,
                    `Total Known`,
                    `% Budget`,
                  ].map(h=>(
                    <th key={h} style={{padding:'9px 11px',textAlign:'left',color:'rgba(255,255,255,0.75)',fontSize:10,fontWeight:500,letterSpacing:0.4,textTransform:'uppercase',whiteSpace:'nowrap',borderRight:'1px solid rgba(255,255,255,0.06)'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(agency=>{
                  const d      = agency.fyData;
                  const total  = (d.coop||0)+(d.texan||0)+(d.stsTotal||0)+(d.openMarket||0);
                  const pct    = PCT(total, agency.budget);
                  const sc     = pct>90?'#E24B4A':pct>70?'#C8A951':'#27500A';
                  const stsList= Object.entries(d.stsByProgram||{}).sort((a,b)=>b[1]-a[1]);
                  return (
                    <tr key={agency.id} style={{borderBottom:'1px solid rgba(30,39,97,0.07)'}}
                      onMouseEnter={e=>e.currentTarget.style.background='#F8F9FD'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{padding:'8px 11px'}}>
                        <div style={{fontWeight:600,color:'#1E2761',fontSize:12}}>{agency.abbr}</div>
                        <div style={{fontSize:10,color:'#8A93B2'}}>{agency.name}</div>
                      </td>
                      <td style={{padding:'8px 11px'}}>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{FMT(agency.budget)}</div>
                        <Badge level={agency.budget_confirmed?'confirmed':'estimated'}/>
                      </td>
                      <td style={{padding:'8px 11px'}}>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#1E2761',fontSize:13}}>{loading?'…':FMT(d.coop)}</div>
                        {!loading&&<Badge level={d.coop?'live':'nodata'}/>}
                      </td>
                      <td style={{padding:'8px 11px'}}>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{loading?'…':FMT(d.texan)}</div>
                        {!loading&&<Badge level={d.texan?'live':'nodata'}/>}
                      </td>
                      <td style={{padding:'8px 11px'}}>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#378ADD',fontSize:13}}>{loading?'…':(d.stsTotal?FMT(d.stsTotal):'—')}</div>
                        {!loading&&<Badge level={d.stsTotal?'live':'nodata'}/>}
                      </td>
                      <td style={{padding:'8px 11px',maxWidth:160}}>
                        <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
                          {stsList.slice(0,3).map(([prog,amt])=>{
                            const pd=STS_PROGRAMS[prog]||STS_PROGRAMS['Other'];
                            return (
                              <div key={prog} style={{display:'flex',alignItems:'center',gap:2,background:'#F4F6FB',borderRadius:4,padding:'1px 5px'}}>
                                <div style={{width:5,height:5,borderRadius:1,background:pd.color,flexShrink:0}}/>
                                <span style={{fontSize:9,color:'#4A5280'}}>{pd.label}</span>
                                <span style={{fontSize:9,color:'#C8A951',fontFamily:'monospace'}}>{FMT(amt,1)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td style={{padding:'8px 11px'}}>
                        <div style={{fontFamily:'monospace',color:'#4A1B7A',fontSize:12,fontWeight:600}}>{d.openMarket?FMT(d.openMarket):'—'}</div>
                        <Badge level={d.openMarket?'manual':'nodata'}/>
                      </td>
                      <td style={{padding:'8px 11px',fontFamily:'monospace',fontWeight:700,color:'#1E2761',fontSize:13}}>{loading?'…':FMT(total)}</td>
                      <td style={{padding:'8px 11px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <div style={{flex:1,height:6,background:'#F0F2F8',borderRadius:3,overflow:'hidden',minWidth:48}}>
                            <div style={{width:`${pct}%`,height:'100%',background:sc,borderRadius:3}}/>
                          </div>
                          <span style={{fontSize:12,fontWeight:700,color:sc,minWidth:32}}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {/* Totals */}
                <tr style={{background:'#1E2761',borderTop:'2px solid rgba(200,169,81,0.4)'}}>
                  <td style={{padding:'9px 11px',color:'#C8A951',fontWeight:700,fontSize:12}}>TOTALS ({sorted.length})</td>
                  <td style={{padding:'9px 11px',fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{FMT(totals.budget)}</td>
                  <td style={{padding:'9px 11px',fontFamily:'monospace',fontWeight:700,color:'#CADCFC',fontSize:13}}>{loading?'…':FMT(totals.coop)}</td>
                  <td style={{padding:'9px 11px',fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{loading?'…':FMT(totals.texan)}</td>
                  <td style={{padding:'9px 11px',fontFamily:'monospace',fontWeight:700,color:'#CADCFC',fontSize:13}}>{loading?'…':FMT(totals.sts)}</td>
                  <td/>
                  <td style={{padding:'9px 11px',fontFamily:'monospace',fontWeight:700,color:'#CADCFC',fontSize:13}}>{FMT(totals.openMkt)}</td>
                  <td style={{padding:'9px 11px',fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{loading?'…':FMT(totalsKnown)}</td>
                  <td style={{padding:'9px 11px',color:'#C8A951',fontWeight:700,fontSize:12}}>{PCT(totalsKnown,totals.budget)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p style={{fontSize:11,color:'#8A93B2',marginTop:10,lineHeight:1.7}}>
        <strong style={{color:'#1E2761'}}>Live data:</strong> DIR Coop & TEX-AN — datasets a743-wj72 (FY2026), w64c-ndf7 (FY2025) ·
        STS — dataset 8hps-ztn4 filtered by TX fiscal year (Sept–Aug) · All via data.texas.gov. &nbsp;|&nbsp;
        <strong style={{color:'#1E2761'}}>Open Market:</strong> LBB Contract Management System (contracts.lbb.texas.gov) — updated monthly.
        DIR coop excluded from LBB by statute — zero duplication. &nbsp;|&nbsp;
        <strong style={{color:'#1E2761'}}>Budgets:</strong> SB1 89th Legislature split into annual allocations (biennium ÷ 2 where not individually confirmed). &nbsp;|&nbsp;
        <strong style={{color:'#1E2761'}}>Last manual update:</strong> May 2026.
      </p>
    </div>
  );
}
