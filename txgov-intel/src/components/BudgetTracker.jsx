import React, { useState, useEffect } from 'react';
import { AGENCIES } from '../data/agencies';

const API   = 'https://data.texas.gov/resource';
const DS_FY26 = 'a743-wj72';
const DS_HIST = 'w64c-ndf7';
const DS_STS  = '8hps-ztn4';

const TEXAN_RFOS = ['telecomm', 'next generation tex-an', 'tex-an', 'telecom'];
const isTexan = (rfo) => rfo && TEXAN_RFOS.some(t => rfo.toLowerCase().includes(t));

const STS_PROGRAMS = {
  'DCS Texas Private Cloud':     { label:'DCS Private Cloud',  color:'#1E2761', desc:'Atos — private cloud, compute, storage' },
  'DCS Mainframe':               { label:'DCS Mainframe',      color:'#2A3570', desc:'Atos — mainframe compute & storage' },
  'Public Cloud':                { label:'Public Cloud (PCM)', color:'#378ADD', desc:'Rackspace — AWS, Azure, GCP' },
  'Technology Solution Services':{ label:'TSS',                color:'#6B80B8', desc:'Deloitte — architects, consulting, staff aug' },
  'Managed Security Services':   { label:'MSS',                color:'#E24B4A', desc:'Managed security monitoring & compliance' },
  'Texas.gov':                   { label:'Texas.gov',          color:'#27500A', desc:'Texas.gov portal & payment services' },
  'Other':                       { label:'Other',              color:'#8A93B2', desc:'Miscellaneous STS charges' },
};

// Approved IT budgets — split into annual allocations from SB1 89th Leg. biennium
// fy26_budget / fy27_budget = annual amounts (biennium ÷ 2 where not individually confirmed)
const AGENCY_DATA = [
  { id:'hhsc',  abbr:'HHSC',  sts_abbr:'HHS',   cs:'HEALTH AND HUMAN SERVICES', fy26:550,  fy27:550,  confirmed:true  },
  { id:'txdot', abbr:'TxDOT', sts_abbr:'TxDOT', cs:'TRANSPORTATION',            fy26:83.7, fy27:83.7, confirmed:true  },
  { id:'dir',   abbr:'DIR',   sts_abbr:null,     cs:'INFORMATION RESOURCES',     fy26:200,  fy27:200,  confirmed:false },
  { id:'txcc',  abbr:'TXCC',  sts_abbr:'TXCC',   cs:'CYBER COMMAND',             fy26:67.5, fy27:67.5, confirmed:true  },
  { id:'dps',   abbr:'DPS',   sts_abbr:'DPS',    cs:'PUBLIC SAFETY',             fy26:45.9, fy27:45.9, confirmed:true  },
  { id:'txdmv', abbr:'TxDMV', sts_abbr:'DMV',    cs:'MOTOR VEHICLES',            fy26:62.5, fy27:62.5, confirmed:true  },
  { id:'dfps',  abbr:'DFPS',  sts_abbr:'DFPS',   cs:'FAMILY AND PROTECTIVE',     fy26:30,   fy27:30,   confirmed:false },
  { id:'twc',   abbr:'TWC',   sts_abbr:'TWC',    cs:'WORKFORCE COMMISSION',      fy26:25,   fy27:25,   confirmed:false },
  { id:'tea',   abbr:'TEA',   sts_abbr:'TEA',    cs:'EDUCATION AGENCY',          fy26:40,   fy27:40,   confirmed:false },
  { id:'cpa',   abbr:'CPA',   sts_abbr:'CPA',    cs:'COMPTROLLER',               fy26:27.5, fy27:27.5, confirmed:false },
  { id:'tdcj',  abbr:'TDCJ',  sts_abbr:'TDCJ',   cs:'CRIMINAL JUSTICE',          fy26:22.5, fy27:22.5, confirmed:false },
  { id:'tpwd',  abbr:'TPWD',  sts_abbr:'TPWD',   cs:'PARKS AND WILDLIFE',        fy26:9,    fy27:9,    confirmed:false },
  { id:'twdb',  abbr:'TWDB',  sts_abbr:'TWDB',   cs:'WATER DEVELOPMENT',         fy26:7.5,  fy27:7.5,  confirmed:false },
  { id:'trs',   abbr:'TRS',   sts_abbr:'TRS',    cs:'TEACHER RETIREMENT',        fy26:7.5,  fy27:7.5,  confirmed:false },
  { id:'oca',   abbr:'OCA',   sts_abbr:'OCA',    cs:'COURT ADMINISTRATION',      fy26:10,   fy27:10,   confirmed:false },
];

const CURRENT_FY = '2026';
const PREV_FY    = '2025';

const FMT = (n, d=1) => {
  if (n===null||n===undefined||isNaN(n)) return '—';
  if (n===0) return '$0';
  if (n>=1000) return `$${(n/1000).toFixed(d)}B`;
  if (n>=1)    return `$${Number(n).toFixed(d)}M`;
  return `$${(n*1000).toFixed(0)}K`;
};
const PCT = (part, total) => (!total||!part||part<=0) ? 0 : Math.min(Math.round((part/total)*100),100);

const toTxFY = (st) => {
  if (!st) return null;
  const p = st.split('/');
  if (p.length < 2) return null;
  const m = parseInt(p[0]), y = parseInt(p[p.length-1]);
  if (isNaN(m)||isNaN(y)) return null;
  return String(m >= 9 ? y+1 : y);
};

function Badge({ level }) {
  const cfg = {
    live:      { bg:'#EAF3DE', c:'#27500A', t:'● Live'      },
    confirmed: { bg:'#E6F1FB', c:'#0C447C', t:'✓ Confirmed' },
    estimated: { bg:'#FAEEDA', c:'#633806', t:'~ Estimated' },
    nodata:    { bg:'#F1EFE8', c:'#8A93B2', t:'No data'     },
  }[level]||{bg:'#FAEEDA',c:'#633806',t:'~ Est.'};
  return <span style={{fontSize:9,padding:'2px 6px',borderRadius:4,background:cfg.bg,color:cfg.c,fontWeight:600,whiteSpace:'nowrap'}}>{cfg.t}</span>;
}

function StackedBar({ budget, coop, texan, sts }) {
  const total = (coop||0)+(texan||0)+(sts||0);
  const pct   = PCT(total, budget);
  const sc    = pct>90?'#E24B4A':pct>70?'#C8A951':'#1E2761';
  const segs  = [
    { val:coop||0,  color:'#1E2761', label:'DIR Coop' },
    { val:texan||0, color:'#C8A951', label:'TEX-AN'   },
    { val:sts||0,   color:'#378ADD', label:'STS'      },
  ];
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{fontSize:11,color:'#8A93B2'}}>Known IT spend vs FY budget</span>
        <span style={{fontSize:12,fontWeight:700,color:sc}}>{pct}%</span>
      </div>
      <div style={{height:10,background:'#F0F2F8',borderRadius:5,overflow:'hidden',display:'flex'}}>
        {segs.map((s,i)=>(
          <div key={i} title={`${s.label}: ${FMT(s.val)}`} style={{
            width:`${PCT(s.val,budget)}%`,height:'100%',
            background:s.color,minWidth:s.val>0?2:0,transition:'width 0.5s ease'
          }}/>
        ))}
      </div>
      <div style={{display:'flex',gap:10,marginTop:5,flexWrap:'wrap'}}>
        {segs.filter(s=>s.val>0).map(s=>(
          <div key={s.label} style={{display:'flex',alignItems:'center',gap:3}}>
            <div style={{width:7,height:7,borderRadius:2,background:s.color,flexShrink:0}}/>
            <span style={{fontSize:10,color:'#8A93B2'}}>{s.label}: <strong style={{color:'#1A1F3C'}}>{FMT(s.val)}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BudgetTracker() {
  const [raw,       setRaw]       = useState({ fy26:[], fy25:[], sts:[] });
  const [loading,   setLoading]   = useState(true);
  const [loadMsg,   setLoadMsg]   = useState('');
  const [error,     setError]     = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [activeFY,  setActiveFY]  = useState(CURRENT_FY);
  const [sortBy,    setSortBy]    = useState('budget');
  const [filterCat, setFilterCat] = useState('');
  const [expanded,  setExpanded]  = useState(null);
  const [viewMode,  setViewMode]  = useState('cards');

  useEffect(()=>{ fetchAll(); },[]);

  const fetchAll = async () => {
    setLoading(true); setError(null);
    try {
      setLoadMsg('Fetching FY2026 DIR coop & TEX-AN spend…');
      const r1 = await fetch(`${API}/${DS_FY26}.json?$select=customer_name,rfo_description,SUM(purchase_amount)%20as%20total&$group=customer_name,rfo_description&$limit=5000`);
      const fy26 = r1.ok ? await r1.json() : [];

      setLoadMsg('Fetching FY2025 DIR coop & TEX-AN spend…');
      const r2 = await fetch(`${API}/${DS_HIST}.json?$select=customer_name,rfo_description,SUM(purchase_amount)%20as%20total&$where=fiscal_year=%272025%27&$group=customer_name,rfo_description&$limit=5000`);
      const fy25 = r2.ok ? await r2.json() : [];

      setLoadMsg('Fetching STS invoices by program and fiscal year…');
      const r3 = await fetch(`${API}/${DS_STS}.json?$select=customer,business_line,start_time,SUM(total_charges)%20as%20total&$group=customer,business_line,start_time&$limit=50000`);
      const sts = r3.ok ? await r3.json() : [];

      setRaw({ fy26, fy25, sts });
      setLastFetch(new Date().toLocaleString());
    } catch(e) { setError(e.message); }
    setLoading(false); setLoadMsg('');
  };

  const buildSpend = (agency, fy) => {
    const coopRaw = fy===CURRENT_FY ? raw.fy26 : raw.fy25;
    const term    = agency.cs.toUpperCase();
    const rows    = coopRaw.filter(r => r.customer_name?.toUpperCase().includes(term));

    let coop = 0, texan = 0;
    const coopByRfo = {};
    rows.forEach(r => {
      const amt = parseFloat(r.total||0)/1e6;
      if (isTexan(r.rfo_description)) {
        texan += amt;
      } else {
        coop += amt;
        const key = r.rfo_description || 'General';
        coopByRfo[key] = (coopByRfo[key]||0) + amt;
      }
    });

    const stsAbbr = (agency.sts_abbr||'').toUpperCase();
    let stsTotal = 0;
    const stsByProg = {};
    raw.sts.forEach(r => {
      if (!r.customer) return;
      const cu = r.customer.toUpperCase().trim();
      if (cu !== stsAbbr && !cu.includes(stsAbbr)) return;
      if (toTxFY(r.start_time) !== fy) return;
      const amt = parseFloat(r.total||0)/1e6;
      if (isNaN(amt)||amt<=0) return;
      const prog = r.business_line||'Other';
      stsByProg[prog] = (stsByProg[prog]||0)+amt;
      stsTotal += amt;
    });

    return { coop, texan, stsTotal, coopByRfo, stsByProg };
  };

  const merged = AGENCY_DATA.map(a => {
    const meta   = AGENCIES.find(x=>x.id===a.id)||{};
    const spend  = buildSpend(a, activeFY);
    const budget = activeFY===CURRENT_FY ? a.fy26 : a.fy27;
    return { ...meta, ...a, budget, spend };
  });

  const sorted = [...merged]
    .filter(a => !filterCat || a.category===filterCat)
    .sort((a,b) => {
      const tot = x=>(x.spend.coop||0)+(x.spend.texan||0)+(x.spend.stsTotal||0);
      if (sortBy==='budget') return (b.budget||0)-(a.budget||0);
      if (sortBy==='total')  return tot(b)-tot(a);
      if (sortBy==='coop')   return (b.spend.coop||0)-(a.spend.coop||0);
      if (sortBy==='texan')  return (b.spend.texan||0)-(a.spend.texan||0);
      if (sortBy==='sts')    return (b.spend.stsTotal||0)-(a.spend.stsTotal||0);
      if (sortBy==='pct')    return PCT(tot(b),b.budget||1)-PCT(tot(a),a.budget||1);
      if (sortBy==='name')   return (a.name||a.abbr||'').localeCompare(b.name||b.abbr||'');
      return 0;
    });

  const totals = sorted.reduce((acc,a)=>({
    budget: acc.budget+(a.budget||0),
    coop:   acc.coop+(a.spend.coop||0),
    texan:  acc.texan+(a.spend.texan||0),
    sts:    acc.sts+(a.spend.stsTotal||0),
  }),{budget:0,coop:0,texan:0,sts:0});
  const totKnown = totals.coop+totals.texan+totals.sts;

  const categories = [...new Set(AGENCIES.map(a=>a.category).filter(Boolean))].sort();

  return (
    <div style={{maxWidth:1400,margin:'0 auto',padding:'24px',fontFamily:"'DM Sans',sans-serif"}}>

      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#141A47,#1E2761)',borderRadius:16,padding:'22px',marginBottom:16,border:'1px solid rgba(200,169,81,0.25)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
          <div>
            <h2 style={{color:'#FFF',fontSize:21,fontWeight:700,fontFamily:'Georgia,serif',marginBottom:5}}>Agency IT Budget vs Spend Tracker</h2>
            <p style={{color:'#CADCFC',fontSize:12,lineHeight:1.6,maxWidth:680,margin:0}}>
              Three live data sources from the Texas Open Data Portal.
              <strong style={{color:'#C8A951'}}> DIR Coop</strong> and
              <strong style={{color:'#C8A951'}}> TEX-AN</strong> split from the same dataset using <code>rfo_description</code>.
              <strong style={{color:'#378ADD'}}> STS</strong> broken out by program (DCS Private Cloud, Mainframe, PCM, TSS, MSS, Texas.gov), filtered by Texas fiscal year.
              All figures live — no manual data.
            </p>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
            <button onClick={fetchAll} disabled={loading} style={{
              padding:'8px 16px',background:'#C8A951',border:'none',borderRadius:8,
              color:'#141A47',fontSize:12,fontWeight:600,cursor:loading?'not-allowed':'pointer',
              fontFamily:'inherit',opacity:loading?0.6:1
            }}>{loading?`⟳ ${loadMsg}`:'⟳ Refresh Live Data'}</button>
            {lastFetch&&<div style={{fontSize:10,color:'#8A93B2'}}>Fetched: {lastFetch}</div>}
          </div>
        </div>

        {/* FY Selector */}
        <div style={{display:'flex',gap:8,marginTop:16,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:12,color:'#CADCFC',fontWeight:500}}>Fiscal Year:</span>
          {[CURRENT_FY, PREV_FY].map(fy=>(
            <button key={fy} onClick={()=>setActiveFY(fy)} style={{
              padding:'6px 16px',borderRadius:20,border:'1px solid',fontFamily:'inherit',cursor:'pointer',fontSize:12,
              borderColor: activeFY===fy?'#C8A951':'rgba(255,255,255,0.2)',
              background:  activeFY===fy?'rgba(200,169,81,0.2)':'transparent',
              color:       activeFY===fy?'#C8A951':'rgba(255,255,255,0.65)',
              fontWeight:  activeFY===fy?700:400,
            }}>FY{fy} {fy===CURRENT_FY?'(current)':'(prior)'}</button>
          ))}
          <span style={{fontSize:11,color:'#8A93B2'}}>TX FY{activeFY}: Sept {parseInt(activeFY)-1} – Aug {activeFY}</span>
        </div>

        {/* Summary stats */}
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:16}}>
          {[
            {label:`FY${activeFY} IT Budget`,   val:FMT(totals.budget), sub:'SB1 89th Legislature', gold:true},
            {label:'DIR Coop (excl. TEX-AN)',    val:loading?'…':FMT(totals.coop),  sub:'Live · coop dataset', live:true},
            {label:'TEX-AN Telecom',             val:loading?'…':FMT(totals.texan), sub:'Live · coop dataset', live:true},
            {label:'STS / DCS Programs',         val:loading?'…':FMT(totals.sts),   sub:'Live · dataset 8hps-ztn4', live:true},
            {label:'Total Known IT Spend',       val:loading?'…':FMT(totKnown), sub:`${PCT(totKnown,totals.budget)}% of budget`, gold:true},
          ].map(s=>(
            <div key={s.label} style={{background:'rgba(255,255,255,0.07)',border:`1px solid ${s.gold?'rgba(200,169,81,0.4)':'rgba(255,255,255,0.1)'}`,borderRadius:10,padding:'10px 14px',minWidth:130}}>
              <div style={{color:s.gold?'#C8A951':'#FFF',fontSize:17,fontWeight:700,fontFamily:'Georgia,serif',display:'flex',alignItems:'center',gap:5}}>
                {s.val}
                {s.live&&!loading&&!error&&<span style={{fontSize:8,background:'#27500A',color:'#FFF',borderRadius:3,padding:'1px 4px',fontFamily:'sans-serif',fontWeight:600}}>LIVE</span>}
              </div>
              <div style={{color:'rgba(255,255,255,0.8)',fontSize:10,fontWeight:500,marginTop:2}}>{s.label}</div>
              <div style={{color:'#8A93B2',fontSize:9,marginTop:1}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {error&&<div style={{background:'#FDE8E8',border:'1px solid #F5BCBC',borderRadius:10,padding:'10px 14px',marginBottom:12,fontSize:12,color:'#8B1C1C'}}><strong>Live data error:</strong> {error} — Click Refresh to retry.</div>}

      {/* Note */}
      <div style={{background:'#F0F4FF',border:'1px solid rgba(30,39,97,0.15)',borderRadius:10,padding:'10px 16px',marginBottom:12,fontSize:11,color:'#4A5280',lineHeight:1.6}}>
        <strong style={{color:'#1E2761'}}>Data sources:</strong> DIR Coop & TEX-AN — dataset <code>a743-wj72</code> (FY2026), <code>w64c-ndf7</code> (FY2025). TEX-AN split using <code>rfo_description IN ('Telecomm','Next Generation TEX-AN')</code> — not double-counted.
        STS — dataset <code>8hps-ztn4</code>, filtered by TX fiscal year (Sept–Aug). &nbsp;|&nbsp;
        <strong style={{color:'#1E2761'}}>Budgets:</strong> SB1 89th Legislature — confirmed where marked, otherwise biennium total ÷ 2. Verify exact allocations at lbb.texas.gov. &nbsp;|&nbsp;
        <strong style={{color:'#1E2761'}}>Not captured:</strong> open market IT contracts, federal grant-funded purchases, interagency transfers.
      </div>

      {/* Controls */}
      <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{padding:'7px 12px',fontSize:12,border:'1px solid rgba(30,39,97,0.15)',borderRadius:8,background:'#FFF',color:'#1A1F3C',outline:'none',fontFamily:'inherit'}}>
          <option value="">All categories</option>
          {categories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {[{k:'budget',l:'Budget'},{k:'total',l:'Total Spend'},{k:'coop',l:'DIR Coop'},{k:'texan',l:'TEX-AN'},{k:'sts',l:'STS'},{k:'pct',l:'% Used'},{k:'name',l:'Name'}].map(s=>(
            <button key={s.k} onClick={()=>setSortBy(s.k)} style={{
              padding:'5px 10px',fontSize:11,borderRadius:7,border:'1px solid',fontFamily:'inherit',cursor:'pointer',
              borderColor:sortBy===s.k?'#1E2761':'rgba(30,39,97,0.15)',
              background: sortBy===s.k?'#1E2761':'#FFF',
              color:      sortBy===s.k?'#FFF':'#8A93B2',
              fontWeight: sortBy===s.k?600:400,
            }}>↓ {s.l}</button>
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

      {/* ── CARDS ──────────────────────────────────────────────────────────── */}
      {viewMode==='cards'&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(380px,1fr))',gap:12}}>
          {sorted.map(agency=>{
            const s      = agency.spend;
            const total  = (s.coop||0)+(s.texan||0)+(s.stsTotal||0);
            const pct    = PCT(total, agency.budget);
            const sc     = pct>90?'#E24B4A':pct>70?'#C8A951':'#27500A';
            const isExp  = expanded===agency.id;
            const stsList= Object.entries(s.stsByProg||{}).sort((a,b)=>b[1]-a[1]);
            const rfList = Object.entries(s.coopByRfo||{}).sort((a,b)=>b[1]-a[1]);

            return (
              <div key={agency.id} style={{background:'#FFF',borderRadius:12,border:'1px solid rgba(30,39,97,0.1)',overflow:'hidden',boxShadow:'0 2px 8px rgba(30,39,97,0.05)',cursor:'pointer'}}
                onClick={()=>setExpanded(isExp?null:agency.id)}>

                <div style={{background:'#1E2761',padding:'11px 15px',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{color:'#FFF',fontWeight:600,fontSize:13}}>{agency.name||agency.abbr}</div>
                    <div style={{color:'#8A93B2',fontSize:10,marginTop:2}}>{agency.category}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{color:'#C8A951',fontSize:16,fontWeight:700,fontFamily:'Georgia,serif'}}>FY{activeFY}: {FMT(agency.budget)}</div>
                    <Badge level={agency.confirmed?'confirmed':'estimated'}/>
                  </div>
                </div>

                <div style={{padding:'13px 15px'}}>
                  <StackedBar budget={agency.budget} coop={s.coop} texan={s.texan} sts={s.stsTotal}/>

                  {/* Three bucket cards */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginTop:11}}>
                    {[
                      {label:'DIR Coop',  val:s.coop,     color:'#1E2761', badge:'live'},
                      {label:'TEX-AN',    val:s.texan,    color:'#C8A951', badge:'live'},
                      {label:'STS Total', val:s.stsTotal, color:'#378ADD', badge:s.stsTotal?'live':'nodata'},
                    ].map(b=>(
                      <div key={b.label} style={{background:'#F4F6FB',borderRadius:7,padding:'8px 10px'}}>
                        <div style={{fontSize:13,fontWeight:700,color:b.color,fontFamily:'monospace'}}>{loading?'…':FMT(b.val)}</div>
                        <div style={{fontSize:10,color:'#1A1F3C',fontWeight:500,marginTop:2}}>{b.label}</div>
                        <div style={{marginTop:3}}><Badge level={b.badge}/></div>
                      </div>
                    ))}
                  </div>

                  {/* STS mini breakdown */}
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

                  {/* TEX-AN callout */}
                  {(s.texan||0)>0&&(
                    <div style={{marginTop:7,background:'rgba(200,169,81,0.06)',borderRadius:7,padding:'6px 10px',border:'1px solid rgba(200,169,81,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:11,color:'#633806',fontWeight:500}}>TEX-AN Telecom</span>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{fontSize:12,fontWeight:700,color:'#C8A951',fontFamily:'monospace'}}>{FMT(s.texan)}</span>
                        <Badge level="live"/>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div style={{marginTop:9,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 10px',background:'#F4F6FB',borderRadius:7}}>
                    <span style={{fontSize:11,color:'#8A93B2'}}>Total known IT spend FY{activeFY}</span>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:13,fontWeight:700,color:'#1E2761',fontFamily:'monospace'}}>{loading?'…':FMT(total)}</span>
                      <span style={{fontSize:11,fontWeight:700,color:sc}}>{pct}%</span>
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {isExp&&(
                  <div style={{borderTop:'1px solid rgba(30,39,97,0.08)',padding:'13px 15px',background:'#FAFBFD'}}
                    onClick={e=>e.stopPropagation()}>

                    {/* DIR Coop by RFO */}
                    {rfList.length>0&&(
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:10,fontWeight:600,color:'#1E2761',textTransform:'uppercase',letterSpacing:0.7,marginBottom:6}}>
                          DIR Coop by Contract Type <Badge level="live"/>
                        </div>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                          <tbody>
                            {rfList.map(([rfo,amt])=>(
                              <tr key={rfo} style={{borderBottom:'1px solid rgba(30,39,97,0.06)'}}>
                                <td style={{padding:'4px 6px',color:'#4A5280'}}>{rfo}</td>
                                <td style={{padding:'4px 6px',fontFamily:'monospace',fontWeight:600,color:'#1E2761',textAlign:'right'}}>{FMT(amt,2)}</td>
                              </tr>
                            ))}
                            <tr style={{background:'#F0F4FF'}}>
                              <td style={{padding:'4px 6px',fontWeight:600,color:'#1E2761'}}>DIR Coop Total</td>
                              <td style={{padding:'4px 6px',fontFamily:'monospace',fontWeight:700,color:'#1E2761',textAlign:'right'}}>{FMT(s.coop,2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* TEX-AN */}
                    {(s.texan||0)>0&&(
                      <div style={{marginBottom:12,padding:'8px 10px',background:'rgba(200,169,81,0.06)',borderRadius:7,border:'1px solid rgba(200,169,81,0.2)'}}>
                        <div style={{fontSize:10,fontWeight:600,color:'#633806',textTransform:'uppercase',letterSpacing:0.7,marginBottom:3}}>
                          TEX-AN Telecom <Badge level="live"/>
                        </div>
                        <div style={{fontSize:11,color:'#4A5280',lineHeight:1.5}}>
                          Voice (local, long-distance, toll-free), Data (broadband, MPLS, Internet), SOHO.
                          State agencies are required to procure these services through TEX-AN.
                        </div>
                        <div style={{fontSize:13,fontWeight:700,color:'#C8A951',fontFamily:'monospace',marginTop:4}}>{FMT(s.texan,2)}</div>
                        <div style={{fontSize:9,color:'#8A93B2',marginTop:3}}>
                          Filtered using rfo_description IN ('Telecomm', 'Next Generation TEX-AN') — not included in DIR Coop total above
                        </div>
                      </div>
                    )}

                    {/* STS program table */}
                    {stsList.length>0&&(
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:10,fontWeight:600,color:'#378ADD',textTransform:'uppercase',letterSpacing:0.7,marginBottom:6}}>
                          STS Program Detail — FY{activeFY} <Badge level="live"/>
                        </div>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                          <thead>
                            <tr style={{background:'#1E2761'}}>
                              {['Business Line','Program','Amount','Description'].map(h=>(
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
                                      <div style={{width:6,height:6,borderRadius:1,background:pd.color}}/>
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
                              <td style={{padding:'5px 8px',fontFamily:'monospace',fontWeight:700,color:'#378ADD'}}>{FMT(s.stsTotal,2)}</td>
                              <td/>
                            </tr>
                          </tbody>
                        </table>
                        <div style={{fontSize:9,color:'#8A93B2',marginTop:4}}>
                          Filtered from dataset 8hps-ztn4 by customer "{agency.sts_abbr}" and TX FY{activeFY} (Sept {parseInt(activeFY)-1}–Aug {activeFY})
                        </div>
                      </div>
                    )}

                    {/* Budget note */}
                    <div style={{padding:'7px 10px',background:'rgba(200,169,81,0.06)',borderRadius:7,border:'1px solid rgba(200,169,81,0.2)'}}>
                      <div style={{fontSize:10,fontWeight:600,color:'#633806',marginBottom:2}}>Approved FY{activeFY} IT Budget</div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontSize:10,color:'#8A93B2',fontStyle:'italic',maxWidth:'70%'}}>
                          {agency.confirmed?'Confirmed — SB1 89th Legislature GAA 2026-27 biennium':'Estimated — biennium total ÷ 2. Verify individual FY allocations at lbb.texas.gov'}
                        </div>
                        <div style={{display:'flex',gap:6,alignItems:'center'}}>
                          <span style={{fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:14}}>{FMT(agency.budget)}</span>
                          <Badge level={agency.confirmed?'confirmed':'estimated'}/>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE ──────────────────────────────────────────────────────────── */}
      {viewMode==='table'&&(
        <div style={{background:'#FFF',borderRadius:12,border:'1px solid rgba(30,39,97,0.1)',overflow:'hidden',boxShadow:'0 2px 8px rgba(30,39,97,0.05)'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr style={{background:'#1E2761'}}>
                  {['Agency',`FY${activeFY} Budget`,'DIR Coop ●','TEX-AN ●','STS ●','STS Programs ●','Total Known','% Budget'].map(h=>(
                    <th key={h} style={{padding:'9px 12px',textAlign:'left',color:'rgba(255,255,255,0.75)',fontSize:10,fontWeight:500,letterSpacing:0.4,textTransform:'uppercase',whiteSpace:'nowrap',borderRight:'1px solid rgba(255,255,255,0.06)'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(agency=>{
                  const s     = agency.spend;
                  const total = (s.coop||0)+(s.texan||0)+(s.stsTotal||0);
                  const pct   = PCT(total, agency.budget);
                  const sc    = pct>90?'#E24B4A':pct>70?'#C8A951':'#27500A';
                  const stsList=Object.entries(s.stsByProg||{}).sort((a,b)=>b[1]-a[1]);
                  return (
                    <tr key={agency.id} style={{borderBottom:'1px solid rgba(30,39,97,0.07)'}}
                      onMouseEnter={e=>e.currentTarget.style.background='#F8F9FD'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{padding:'8px 12px'}}>
                        <div style={{fontWeight:600,color:'#1E2761',fontSize:12}}>{agency.abbr}</div>
                        <div style={{fontSize:10,color:'#8A93B2'}}>{agency.name}</div>
                      </td>
                      <td style={{padding:'8px 12px'}}>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{FMT(agency.budget)}</div>
                        <Badge level={agency.confirmed?'confirmed':'estimated'}/>
                      </td>
                      <td style={{padding:'8px 12px'}}>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#1E2761',fontSize:13}}>{loading?'…':FMT(s.coop)}</div>
                        {!loading&&<Badge level={s.coop?'live':'nodata'}/>}
                      </td>
                      <td style={{padding:'8px 12px'}}>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{loading?'…':FMT(s.texan)}</div>
                        {!loading&&<Badge level={s.texan?'live':'nodata'}/>}
                      </td>
                      <td style={{padding:'8px 12px'}}>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#378ADD',fontSize:13}}>{loading?'…':(s.stsTotal?FMT(s.stsTotal):'—')}</div>
                        {!loading&&<Badge level={s.stsTotal?'live':'nodata'}/>}
                      </td>
                      <td style={{padding:'8px 12px',maxWidth:160}}>
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
                      <td style={{padding:'8px 12px',fontFamily:'monospace',fontWeight:700,color:'#1E2761',fontSize:13}}>{loading?'…':FMT(total)}</td>
                      <td style={{padding:'8px 12px'}}>
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
                <tr style={{background:'#1E2761',borderTop:'2px solid rgba(200,169,81,0.4)'}}>
                  <td style={{padding:'9px 12px',color:'#C8A951',fontWeight:700,fontSize:12}}>TOTALS ({sorted.length})</td>
                  <td style={{padding:'9px 12px',fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{FMT(totals.budget)}</td>
                  <td style={{padding:'9px 12px',fontFamily:'monospace',fontWeight:700,color:'#CADCFC',fontSize:13}}>{loading?'…':FMT(totals.coop)}</td>
                  <td style={{padding:'9px 12px',fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{loading?'…':FMT(totals.texan)}</td>
                  <td style={{padding:'9px 12px',fontFamily:'monospace',fontWeight:700,color:'#CADCFC',fontSize:13}}>{loading?'…':FMT(totals.sts)}</td>
                  <td/>
                  <td style={{padding:'9px 12px',fontFamily:'monospace',fontWeight:700,color:'#C8A951',fontSize:13}}>{loading?'…':FMT(totKnown)}</td>
                  <td style={{padding:'9px 12px',color:'#C8A951',fontWeight:700,fontSize:12}}>{PCT(totKnown,totals.budget)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p style={{fontSize:11,color:'#8A93B2',marginTop:10,lineHeight:1.7}}>
        <strong style={{color:'#1E2761'}}>Sources:</strong> DIR Coop & TEX-AN — datasets a743-wj72 (FY2026), w64c-ndf7 (FY2025) · STS — dataset 8hps-ztn4 filtered by TX fiscal year ·
        All live from data.texas.gov · Budgets from SB1 89th Legislature GAA ·
        <strong style={{color:'#1E2761'}}> Not captured:</strong> open market IT, federal grant-funded purchases, interagency transfers.
      </p>
    </div>
  );
}
