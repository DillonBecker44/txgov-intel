import React, { useState, useRef, useEffect } from 'react';

// ─── Dataset registry ──────────────────────────────────────────────────────
const DATASETS = {
  fy26: {
    id: 'a743-wj72',
    label: 'DIR Coop & TEX-AN FY2026',
    fy: '2026',
    columns: 'fiscal_year, customer_name, vendor_name, purchase_amount, contract_number, rfo_description, rfo_number, customer_type, brand_name, reseller_name',
    notes: 'Current fiscal year Sept 2025–Aug 2026. Contains BOTH cooperative contracts AND TEX-AN telecom (filter rfo_description for Telecomm/Next Generation TEX-AN to isolate TEX-AN).',
  },
  history: {
    id: 'w64c-ndf7',
    label: 'DIR Coop Sales FY2010–Present',
    fy: 'multi',
    columns: 'fiscal_year, customer_name, vendor_name, purchase_amount, contract_number, rfo_description, rfo_number, customer_type, brand_name, reseller_name, staffing_technology, staffing_title',
    notes: 'Historical data FY2010–FY2025. Filter by fiscal_year field (string: "2025", "2024" etc.). TX fiscal year = Sept–Aug. Same structure as FY26 dataset.',
  },
  sts: {
    id: '8hps-ztn4',
    label: 'STS Customer Invoices',
    fy: 'multi',
    columns: 'customer, vendor, business_line, resource_unit_group, start_time, unit_type, units, chargeback_rate, current_month_charges, total_charges',
    notes: 'Shared Technology Services invoices. customer field = short agency abbreviation (e.g. DPS, HHSC, TxDOT). start_time = MM/YYYY. TX FY: months 9-12 of year Y belong to FY(Y+1), months 1-8 belong to FY(Y). business_line values: DCS Texas Private Cloud, DCS Mainframe, Public Cloud, Technology Solution Services, Managed Security Services, Texas.gov.',
  },
  active: {
    id: 'vipt-h4ye',
    label: 'Active Cooperative Contracts',
    fy: 'current',
    columns: 'contract_number, vendor_name, contract_start_date, contract_end_date, contract_type, rfo_description, vendor_hub_type',
    notes: 'Currently active DIR contracts. Good for "what contracts does vendor X have" or "is vendor X on DIR contract".',
  },
};

const API = 'https://data.texas.gov/resource';

// ─── Ask Claude to plan all queries needed ─────────────────────────────────
async function planQueries(question, apiKey) {
  const schema = Object.entries(DATASETS).map(([k,d]) =>
    `Dataset "${k}" (id: ${d.id})\nLabel: ${d.label}\nColumns: ${d.columns}\nNotes: ${d.notes}`
  ).join('\n\n---\n\n');

  const system = `You are an expert on Texas DIR cooperative contract data and the Socrata Open Data API (SODA).

Given a user's question, plan ALL the SODA queries needed to fully answer it. If the question spans multiple fiscal years or multiple datasets, include a query for EACH.

SODA rules:
- $where: SQL-like, e.g. upper(customer_name) like '%DEPARTMENT OF PUBLIC SAFETY%' AND fiscal_year='2025'
- $select with aggregations: SUM(purchase_amount) as total, COUNT(*) as cnt, customer_name
- $group required when aggregating
- $order: field DESC or alias DESC
- $limit: string number
- fiscal_year is a string field: '2026', '2025', '2024' etc.
- For STS dataset: customer is short abbr (DPS, HHSC, TWC etc.), start_time is MM/YYYY
- rfo_description common values: "DBITS", "ITSAC", "Telecomm", "Next Generation TEX-AN", "SDD", "Break/Fix"
- customer_type: "State Agency", "K-12", "Local Government", "Higher Education"


CRITICAL - EXACT customer_name values in DIR coop datasets (use these exactly in $where filters):
- HHSC / Health & Human Services: "Texas Health and Human Services Commission"
- TxDOT / Transportation: "Texas Department of Transportation"  
- DPS / Public Safety: "Texas Department of Public Safety"
- TxDMV / Motor Vehicles: "Texas Department of Motor Vehicles"
- TEA / Education Agency: "Texas Education Agency"
- CPA / Comptroller: "Texas Comptroller of Public Accounts"
- OAG / Attorney General: "Texas Office of the Attorney General"
- DIR / Information Resources: "Texas Department of Information Resources"
- TWC / Workforce: "Texas Workforce Commission"
- TDCJ / Criminal Justice: "Texas Department of Criminal Justice"
- TCEQ / Environmental Quality: "Texas Commission on Environmental Quality"
- TPWD / Parks & Wildlife: "Texas Parks and Wildlife Department"
- TxDPS same as DPS above
- GLO / Land Office: "Texas General Land Office"
- SOS / Secretary of State: "Texas Secretary of State"
- TRS / Teacher Retirement: "Teacher Retirement System of Texas"
- TWDB / Water Development: "Texas Water Development Board"
- TFC / Facilities: "Texas Facilities Commission"
- TABC / Alcoholic Beverage: "Texas Alcoholic Beverage Commission"
- TDI / Insurance: "Texas Department of Insurance"
- PUC / Public Utility: "Public Utility Commission of Texas"
- TDEM / Emergency Mgmt: "Texas Division of Emergency Management"
- DFPS / Family Services: "Texas Department of Family and Protective Services"
- DSHS / State Health: "Texas Department of State Health Services"
- TXCC / Cyber Command: "Texas Cyber Command"
- OCA / Court Admin: "Texas Office of Court Administration"
- TMD / Military: "Texas Military Department"
- RRC / Railroad Commission: "Railroad Commission of Texas"

For STS dataset, customer field uses SHORT abbreviations: HHS, TxDOT, DPS, DMV, TEA, CPA, OAG, TWC, TDCJ, TCEQ, TPWD, GLO, SOS, TRS, TWDB, TFC, TABC, TDI, PUC, DFPS, DSHS, TXCC, OCA, TMD, RRC

When filtering by agency in coop datasets, use UPPER() LIKE for safety:
  upper(customer_name) like '%HEALTH AND HUMAN SERVICES%'
  upper(customer_name) like '%DEPARTMENT OF PUBLIC SAFETY%'


IMPORTANT: 
- If question asks about multiple FYs (e.g. FY25 AND FY26), create SEPARATE queries for each dataset/FY combination
- If question asks about both coop AND STS spend, include queries for both
- If question asks for a tech stack or vendor profile, pull broad data (no vendor filter, just agency filter)
- Always include fiscal_year filter when possible to avoid returning irrelevant data

Respond ONLY with valid JSON array of query objects. No markdown, no explanation outside JSON:
[
  {
    "dataset": "fy26" | "history" | "sts" | "active",
    "params": { "$select": "...", "$where": "...", "$group": "...", "$order": "...", "$limit": "..." },
    "label": "human-readable label for this query",
    "purpose": "what this query contributes to the answer"
  }
]

Only include params that are needed. Omit unused params entirely.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: `Plan queries to answer: "${question}"\n\nDataset schemas:\n${schema}` }],
    }),
  });

  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `API ${res.status}`); }
  const result = await res.json();
  const text = result.content[0].text.trim().replace(/```json|```/g,'').trim();
  return JSON.parse(text);
}

// ─── Execute one query plan ─────────────────────────────────────────────────
async function executeQuery(plan) {
  const ds = DATASETS[plan.dataset];
  if (!ds) throw new Error(`Unknown dataset: ${plan.dataset}`);
  const params = new URLSearchParams();
  for (const [k,v] of Object.entries(plan.params||{})) { if (v) params.set(k,v); }
  const url = `${API}/${ds.id}.json?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    return { label: plan.label, purpose: plan.purpose, data: [], error: `HTTP ${res.status}: ${txt.slice(0,200)}`, url };
  }
  const data = await res.json();
  return { label: plan.label, purpose: plan.purpose, data, error: null, url, dataset: plan.dataset };
}

// ─── Ask Claude to synthesize all results ──────────────────────────────────
async function synthesize(question, results, apiKey) {
  const context = results.map(r => {
    if (r.error) return `## ${r.label}\nError: ${r.error}\nPurpose: ${r.purpose}`;
    if (!r.data.length) return `## ${r.label}\nNo records found.\nPurpose: ${r.purpose}`;
    return `## ${r.label} (${r.data.length} records)\nPurpose: ${r.purpose}\n${JSON.stringify(r.data.slice(0,100), null, 2)}`;
  }).join('\n\n---\n\n');

  const system = `You are an expert analyst on Texas DIR cooperative contracts and state IT procurement.

You have received results from multiple live queries against the Texas Open Data Portal. Your job is to synthesize ALL results into a single coherent answer.

Key rules:
- Combine data across datasets/fiscal years to give ONE unified answer
- When showing multi-year spend, add totals across years
- Bold key figures: **$1.2M**, **Vendor Name**, **Agency Name**
- Format dollar amounts clearly ($1.2M, $450K, $2.3B)
- For rankings/top-N: use a numbered list
- For tech stacks: use the ## section headers (Network, Security, Cloud, etc.)
- Explicitly state which fiscal year(s) each figure covers
- If a dataset returned no data, mention what was searched and why it might be empty
- Keep responses focused and under 400 words unless a tech stack profile
- TX fiscal year runs Sept 1 – Aug 31 (FY2026 = Sept 2025 – Aug 2026)
- When combining multi-year data: sum the totals mathematically, show each year AND the combined total
- When you see a "total" or "sum" field in the data, that is already aggregated — use it directly
- If you see multiple rows for the same vendor/agency across different FY queries, add them up
- Always show: FY25 amount + FY26 amount = Combined total
- For "top N" questions across multiple years: aggregate first, then rank

Never say "I cannot" if data was returned — synthesize what you have.
If data came back empty, explain WHY (wrong agency name format, wrong FY, etc.) and suggest a correction.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2500,
      system,
      messages: [{ role: 'user', content: `Question: "${question}"\n\nQuery Results:\n\n${context}` }],
    }),
  });

  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `API ${res.status}`); }
  const result = await res.json();
  return result.content[0].text;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const FMT = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v||'—';
  if (n>=1e9) return `$${(n/1e9).toFixed(2)}B`;
  if (n>=1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (n>=1e3) return `$${(n/1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
};

function RichText({ text, isError }) {
  const lines = text.split('\n');
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return (
          <div key={i} style={{fontSize:13,fontWeight:700,color:'#1E2761',marginTop:i===0?0:10,marginBottom:3,borderBottom:'1px solid rgba(30,39,97,0.1)',paddingBottom:3}}>
            {line.replace('## ','')}
          </div>
        );
        if (line.startsWith('# ')) return (
          <div key={i} style={{fontSize:14,fontWeight:700,color:'#1E2761',marginBottom:4}}>{line.replace('# ','')}</div>
        );
        if (line === '') return <div key={i} style={{height:5}}/>;
        // Numbered list
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) return (
          <div key={i} style={{display:'flex',gap:6,marginBottom:3}}>
            <span style={{color:'#C8A951',fontWeight:700,flexShrink:0,minWidth:18}}>{numMatch[1]}.</span>
            <span style={{fontSize:12.5,lineHeight:1.6,color:isError?'#8B1C1C':'#1A1F3C'}}>
              {numMatch[2].split(/\*\*(.*?)\*\*/).map((p,pi)=>
                pi%2===1?<strong key={pi} style={{color:isError?'#8B1C1C':'#1E2761'}}>{p}</strong>:p
              )}
            </span>
          </div>
        );
        // Bullet list
        if (line.startsWith('- ') || line.startsWith('• ')) return (
          <div key={i} style={{display:'flex',gap:6,marginBottom:2}}>
            <span style={{color:'#C8A951',flexShrink:0}}>•</span>
            <span style={{fontSize:12.5,lineHeight:1.6,color:isError?'#8B1C1C':'#1A1F3C'}}>
              {line.replace(/^[-•]\s+/,'').split(/\*\*(.*?)\*\*/).map((p,pi)=>
                pi%2===1?<strong key={pi} style={{color:'#1E2761'}}>{p}</strong>:p
              )}
            </span>
          </div>
        );
        return (
          <div key={i} style={{fontSize:12.5,lineHeight:1.6,marginBottom:1,color:isError?'#8B1C1C':'#1A1F3C'}}>
            {line.split(/\*\*(.*?)\*\*/).map((p,pi)=>
              pi%2===1?<strong key={pi} style={{color:isError?'#8B1C1C':'#1E2761'}}>{p}</strong>:p
            )}
          </div>
        );
      })}
    </div>
  );
}

const EXAMPLES = [
  "What is HHSC's total DIR spend across FY2025 and FY2026 combined?",
  "Top 10 agencies by total DIR coop spend in FY2025 and FY2026 combined",
  "What is the technology stack that DPS uses?",
  "Who is TxDOT using for firewalls?",
  "Top 10 DBITS vendors for state agencies in FY2026",
  "Show me all Palo Alto Networks spend by state agencies across FY25 and FY26",
  "What is total Microsoft spend across all agencies in FY2025?",
  "Which agencies spend the most on STS services?",
  "What cybersecurity vendors does HHSC use?",
  "Compare HHSC and TxDOT DIR coop spend in FY2025 vs FY2026",
  "Top ITSAC vendors for state agencies FY2024 and FY2025",
  "What TEX-AN telecom spend does TDCJ have in FY2026?",
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: `## DIR Contract Intelligence

Ask anything about Texas state agency IT procurement. I can now handle **multi-year questions**, **cross-dataset synthesis**, and **combined totals**.

**Try asking:**
- "What is HHSC's total DIR spend across FY2025 and FY2026 combined?"
- "Compare TxDOT and DPS coop spend FY25 vs FY26"
- "Top 10 DBITS vendors across FY24, FY25, and FY26"
- "What is the technology stack that DPS uses?"

All data is live from the Texas Open Data Portal.`,
    queries: null, data: null,
  }]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState('');
  const bottomRef               = useRef(null);
  const apiKey                  = import.meta.env.VITE_ANTHROPIC_KEY;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const ask = async (q) => {
    const question = (q || input).trim();
    if (!question || loading) return;
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role:'user', text:question }]);

    try {
      if (!apiKey) throw new Error('VITE_ANTHROPIC_KEY not set in Vercel environment variables.');

      // Step 1: Plan all queries
      setStep('Planning queries…');
      const plans = await planQueries(question, apiKey);

      // Step 2: Execute all in parallel
      setStep(`Fetching ${plans.length} dataset${plans.length>1?'s':''} in parallel…`);
      const results = await Promise.all(plans.map(executeQuery));

      // Step 3: Synthesize
      setStep('Synthesizing results…');
      const answer = await synthesize(question, results, apiKey);

      // Flatten raw data for table display
      const allData = results.flatMap(r => (r.data||[]).map(row => ({...row, _source: r.label})));

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: answer,
        queries: results.map(r => ({
          label: r.label,
          purpose: r.purpose,
          count: r.data?.length || 0,
          error: r.error,
        })),
        data: allData.slice(0, 40),
      }]);
    } catch(err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `**Error:** ${err.message}\n\nTry rephrasing with specific agency names (e.g. "Department of Public Safety" or "DPS") or fiscal years (e.g. "FY2025" or "FY2026").`,
        queries: null, data: null, isError: true,
      }]);
    }
    setLoading(false);
    setStep('');
  };

  // Dynamic column headers from data
  const getHeaders = (data) => {
    if (!data?.length) return [];
    const all = new Set(data.flatMap(r => Object.keys(r).filter(k => k !== '_source')));
    const priority = ['customer_name','vendor_name','brand_name','rfo_description','contract_number',
      'purchase_amount','total','total_spend','sum_purchase_amount','fiscal_year','customer_type',
      'business_line','total_charges','start_time'];
    const sorted = priority.filter(k => all.has(k));
    all.forEach(k => { if (!sorted.includes(k)) sorted.push(k); });
    return sorted.slice(0, 7);
  };

  const isAmtCol = (h) => h.includes('amount')||h.includes('total')||h.includes('charges')||h.includes('spend');

  return (
    <div style={{maxWidth:1060,margin:'0 auto',padding:'20px 24px',display:'flex',flexDirection:'column',height:'calc(100vh - 63px)',fontFamily:"'DM Sans',sans-serif"}}>

      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#141A47,#1E2761)',borderRadius:14,padding:'14px 20px',marginBottom:10,border:'1px solid rgba(200,169,81,0.25)',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,background:'#C8A951',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🔍</div>
          <div>
            <div style={{color:'#FFF',fontSize:15,fontWeight:600}}>DIR Contract Intelligence</div>
            <div style={{color:'#8A93B2',fontSize:11}}>Live · Texas Open Data Portal · Multi-dataset synthesis · FY2010–FY2026</div>
          </div>
        </div>
      </div>

      {/* Example chips */}
      <div style={{marginBottom:8,flexShrink:0}}>
        <div style={{fontSize:11,color:'#8A93B2',marginBottom:5,fontWeight:500,textTransform:'uppercase',letterSpacing:0.8}}>Try asking…</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {EXAMPLES.map(q=>(
            <button key={q} onClick={()=>ask(q)} disabled={loading} style={{
              fontSize:11,padding:'3px 9px',borderRadius:14,
              border:'1px solid rgba(30,39,97,0.18)',background:'#FFF',color:'#1E2761',
              cursor:loading?'not-allowed':'pointer',fontFamily:'inherit',
              opacity:loading?0.5:1,transition:'background 0.12s'
            }}
            onMouseEnter={e=>{if(!loading)e.currentTarget.style.background='#E6F1FB';}}
            onMouseLeave={e=>{e.currentTarget.style.background='#FFF';}}
            >{q}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',background:'#FFF',borderRadius:12,border:'1px solid rgba(30,39,97,0.1)',padding:'14px',marginBottom:10,boxShadow:'0 2px 8px rgba(30,39,97,0.05)'}}>
        {messages.map((msg,i)=>(
          <div key={i} style={{marginBottom:18,display:'flex',flexDirection:'column',alignItems:msg.role==='user'?'flex-end':'flex-start'}}>

            {/* Bubble */}
            <div style={{
              maxWidth:msg.role==='assistant'?'95%':'85%',
              background:msg.role==='user'?'#1E2761':msg.isError?'#FDE8E8':'#F4F6FB',
              color:msg.role==='user'?'#FFF':msg.isError?'#8B1C1C':'#1A1F3C',
              borderRadius:msg.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px',
              padding:'11px 15px',fontSize:13,lineHeight:1.65,
              border:msg.role==='assistant'?'1px solid rgba(30,39,97,0.08)':'none',
            }}>
              {msg.role==='assistant'
                ? <RichText text={msg.text} isError={msg.isError}/>
                : msg.text}
            </div>

            {/* Query metadata badges */}
            {msg.queries&&(
              <div style={{display:'flex',gap:4,marginTop:5,flexWrap:'wrap',maxWidth:'95%'}}>
                {msg.queries.map((q,qi)=>(
                  <span key={qi} title={q.purpose} style={{
                    fontSize:10,padding:'2px 8px',borderRadius:10,
                    background:q.error?'#FDE8E8':'#E6F1FB',
                    color:q.error?'#8B1C1C':'#0C447C',
                    border:`1px solid ${q.error?'#F5BCBC':'#B5D4F4'}`,
                    cursor:'help'
                  }}>
                    {q.error?'⚠ ':'✓ '}{q.label} · {q.error?'error':`${q.count} rows`}
                  </span>
                ))}
              </div>
            )}

            {/* Raw data table */}
            {msg.data&&msg.data.length>0&&(()=>{
              const headers = getHeaders(msg.data);
              return (
                <div style={{marginTop:7,width:'100%',maxWidth:'95%'}}>
                  <details>
                    <summary style={{fontSize:11,color:'#8A93B2',cursor:'pointer',marginBottom:5,userSelect:'none',fontWeight:500}}>
                      View raw data ({msg.data.length} records shown)
                    </summary>
                    <div style={{overflowX:'auto',borderRadius:8,border:'1px solid rgba(30,39,97,0.1)'}}>
                      <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                        <thead>
                          <tr style={{background:'#1E2761'}}>
                            {headers.map(h=>(
                              <th key={h} style={{padding:'5px 9px',textAlign:'left',color:'rgba(255,255,255,0.75)',fontSize:10,fontWeight:500,whiteSpace:'nowrap'}}>
                                {h.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {msg.data.map((row,ri)=>(
                            <tr key={ri} style={{borderBottom:'1px solid rgba(30,39,97,0.06)'}}
                              onMouseEnter={e=>e.currentTarget.style.background='#F8F9FD'}
                              onMouseLeave={e=>e.currentTarget.style.background=''}>
                              {headers.map(h=>(
                                <td key={h} style={{
                                  padding:'5px 9px',
                                  color:isAmtCol(h)?'#C8A951':h==='vendor_name'||h==='customer_name'?'#1E2761':'#4A5280',
                                  fontWeight:h==='vendor_name'||h==='customer_name'?500:400,
                                  fontFamily:isAmtCol(h)?'monospace':'inherit'
                                }}>
                                  {isAmtCol(h)?FMT(row[h]):(row[h]||'—')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              );
            })()}
          </div>
        ))}

        {/* Loading */}
        {loading&&(
          <div style={{display:'flex',alignItems:'flex-start',marginBottom:14}}>
            <div style={{background:'#F4F6FB',borderRadius:'14px 14px 14px 4px',padding:'11px 15px',border:'1px solid rgba(30,39,97,0.08)'}}>
              <div style={{display:'flex',gap:4,alignItems:'center'}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:7,height:7,borderRadius:'50%',background:'#C8A951',animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`}}/>
                ))}
                <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.6)}40%{transform:scale(1)}}`}</style>
                <span style={{fontSize:12,color:'#8A93B2',marginLeft:6}}>{step||'Thinking…'}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{display:'flex',gap:8,flexShrink:0,background:'#FFF',borderRadius:12,border:'1px solid rgba(30,39,97,0.15)',padding:'9px 12px',boxShadow:'0 2px 8px rgba(30,39,97,0.05)'}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask();}}}
          placeholder="Ask about vendor spend, tech stacks, DBITS contracts, multi-year totals…"
          disabled={loading}
          style={{flex:1,border:'none',outline:'none',fontSize:13,color:'#1A1F3C',background:'transparent',fontFamily:'inherit'}}
        />
        <button onClick={()=>ask()} disabled={loading||!input.trim()} style={{
          padding:'7px 16px',background:loading||!input.trim()?'rgba(200,169,81,0.4)':'#C8A951',
          border:'none',borderRadius:8,color:'#141A47',fontSize:13,fontWeight:600,
          cursor:loading||!input.trim()?'not-allowed':'pointer',
          fontFamily:'inherit',flexShrink:0,transition:'background 0.2s'
        }}>{loading?'…':'Ask →'}</button>
      </div>

      <p style={{fontSize:10,color:'#8A93B2',marginTop:6,textAlign:'center',flexShrink:0}}>
        Live · data.texas.gov · DIR Cooperative Contracts FY2010–FY2026 · Multi-dataset synthesis powered by Claude AI
      </p>
    </div>
  );
}
