import React, { useState, useRef, useEffect } from 'react';

const DATASETS = {
  main: {
    id: 'w64c-ndf7',
    label: 'DIR Coop Sales FY2010–Present',
    columns: [
      'fiscal_year','customer_name','vendor_name','purchase_amount',
      'contract_number','rfo_description','rfo_number','customer_type',
      'brand_name','reseller_name','contract_type','contract_subtype',
      'staffing_contractor_name','staffing_technology','staffing_title',
      'order_date','contract_start_date','contract_end_date',
    ],
    notes: 'Main dataset FY2010-present. rfo_description contains program names: "DBITS", "ITSAC", "Telecom", "SDD". customer_type: "State Agency", "K-12", "Higher Education", "Local Government". purchase_amount is the dollar field.',
  },
  fy26: {
    id: 'a743-wj72',
    label: 'Coop & Tele Contracts FY2026',
    columns: [
      'fiscal_year','customer_name','vendor_name','purchase_amount',
      'contract_number','rfo_description','rfo_number','customer_type',
      'brand_name','reseller_name','contract_type',
    ],
    notes: 'FY2026 current year. Same structure as main. Use for current/recent queries.',
  },
  active: {
    id: 'vipt-h4ye',
    label: 'Active Cooperative Contracts',
    columns: [
      'contract_number','vendor_name','contract_start_date','contract_end_date',
      'contract_type','rfo_description','vendor_hub_type',
    ],
    notes: 'Active DIR contracts. Good for "what contracts does vendor X have" questions.',
  },
};

const API_BASE = 'https://data.texas.gov/resource';

// Detect if this is a tech stack / technology profile question
function isTechStackQuestion(question) {
  const q = question.toLowerCase();
  return (
    q.includes('tech stack') ||
    q.includes('technology stack') ||
    q.includes('what technology') ||
    q.includes('what technologies') ||
    q.includes('what tech') ||
    q.includes('technology profile') ||
    q.includes('what does') && (q.includes('use') || q.includes('run') || q.includes('buy')) ||
    q.includes('what is') && (q.includes('using') || q.includes('stack') || q.includes('infrastructure')) ||
    q.includes('what tools') ||
    q.includes('what software') ||
    q.includes('what hardware') ||
    q.includes('what vendors does') ||
    q.includes('full picture') ||
    q.includes('overview of') && q.includes('tech') ||
    q.includes('profile')
  );
}

// Extract agency name from a tech stack question
// Agency registry — abbr for display, customerName for dataset matching, patterns for detection
const AGENCY_REGISTRY = [
  { abbr: 'DPS',   customerName: 'Department of Public Safety',                    patterns: ['dps','department of public safety','public safety'] },
  { abbr: 'HHSC',  customerName: 'Health and Human Services Commission',           patterns: ['hhsc','health and human services'] },
  { abbr: 'TxDOT', customerName: 'Department of Transportation',                   patterns: ['txdot','department of transportation'] },
  { abbr: 'TEA',   customerName: 'Education Agency',                               patterns: [' tea ','texas education agency','education agency'] },
  { abbr: 'DIR',   customerName: 'Department of Information Resources',            patterns: ['dir ','department of information resources'] },
  { abbr: 'TxDMV', customerName: 'Department of Motor Vehicles',                   patterns: ['txdmv','motor vehicles','dmv'] },
  { abbr: 'TDCJ',  customerName: 'Department of Criminal Justice',                 patterns: ['tdcj','criminal justice'] },
  { abbr: 'TWC',   customerName: 'Workforce Commission',                           patterns: ['twc','workforce commission'] },
  { abbr: 'TPWD',  customerName: 'Parks and Wildlife',                             patterns: ['tpwd','parks and wildlife'] },
  { abbr: 'CPA',   customerName: 'Comptroller of Public Accounts',                 patterns: ['cpa ','comptroller'] },
  { abbr: 'OCA',   customerName: 'Office of Court Administration',                 patterns: ['oca ','court administration'] },
  { abbr: 'GLO',   customerName: 'General Land Office',                            patterns: ['glo ','general land office'] },
  { abbr: 'TCEQ',  customerName: 'Commission on Environmental Quality',            patterns: ['tceq','environmental quality'] },
  { abbr: 'SOS',   customerName: 'Secretary of State',                             patterns: ['secretary of state',' sos '] },
  { abbr: 'TDLR',  customerName: 'Department of Licensing and Regulation',         patterns: ['tdlr','licensing and regulation'] },
  { abbr: 'TRS',   customerName: 'Teacher Retirement System',                      patterns: ['trs ','teacher retirement'] },
  { abbr: 'TNRIS', customerName: 'Natural Resources Information System',           patterns: ['tnris','natural resources information'] },
  { abbr: 'TDA',   customerName: 'Department of Agriculture',                      patterns: [' tda ','department of agriculture'] },
  { abbr: 'OAG',   customerName: 'Attorney General',                               patterns: ['oag ','attorney general'] },
  { abbr: 'TXDPS', customerName: 'Department of Public Safety',                    patterns: ['txdps'] },
];

function extractAgencyRecord(question) {
  const lower = question.toLowerCase();
  for (const a of AGENCY_REGISTRY) {
    if (a.patterns.some(p => lower.includes(p))) return a;
  }
  return null;
}

// Keep old function name for compatibility
function extractAgency(question) {
  const rec = extractAgencyRecord(question);
  return rec ? rec.abbr : null;
}

// Build a broad agency profile query using the FULL customer name for matching
async function buildTechProfileQueries(agencyAbbr) {
  // Find the full customer name for this agency
  const agencyRec = AGENCY_REGISTRY.find(a => a.abbr === agencyAbbr);
  // Use a broad search term — the partial name that will match the full dataset value
  const searchTerm = agencyRec ? agencyRec.customerName.split(' ').slice(0,3).join(' ').toUpperCase() : agencyAbbr;

  const vendorQuery = {
    dataset: 'main',
    params: {
      '$select': 'vendor_name, brand_name, rfo_description, SUM(purchase_amount) as total_spend, COUNT(*) as order_count, MAX(fiscal_year) as latest_fy',
      '$where': `upper(customer_name) like '%${searchTerm}%' AND fiscal_year >= '2022'`,
      '$group': 'vendor_name, brand_name, rfo_description',
      '$order': 'total_spend DESC',
      '$limit': '200',
    },
    explanation: `All ${agencyAbbr} vendor/brand purchases FY2022-present (searching: "${searchTerm}")`,
  };

  const fy26Query = {
    dataset: 'fy26',
    params: {
      '$select': 'vendor_name, brand_name, rfo_description, SUM(purchase_amount) as total_spend, COUNT(*) as order_count',
      '$where': `upper(customer_name) like '%${searchTerm}%'`,
      '$group': 'vendor_name, brand_name, rfo_description',
      '$order': 'total_spend DESC',
      '$limit': '100',
    },
    explanation: `${agencyAbbr} FY2026 current purchases`,
  };

  return [vendorQuery, fy26Query];
}

// Generate SODA query via Claude
async function generateQuery(question, apiKey) {
  const schemaDoc = Object.entries(DATASETS).map(([key, ds]) => `
Dataset: "${key}" (id: ${ds.id}) — ${ds.label}
Columns: ${ds.columns.join(', ')}
Notes: ${ds.notes}`).join('\n---\n');

  const systemPrompt = `You are an expert on the Socrata Open Data API (SODA) and Texas DIR cooperative contract data.
Given a user question, output a JSON object describing exactly how to query the Texas Open Data Portal.

SODA syntax rules:
- $where uses SQL-like syntax with proper quoting: fiscal_year='2026' or upper(vendor_name) like '%CISCO%'
- String comparisons need upper() for case-insensitive: upper(rfo_description) like '%DBITS%'
- $select with aggregations: SUM(purchase_amount) as total_spend, COUNT(*) as order_count
- $group required when using aggregations
- $order: field DESC or aggregated alias DESC (e.g. total_spend DESC)
- $limit: number as string

rfo_description common values: "DBITS", "ITSAC", "Telecom", "SDD"
customer_type values: "State Agency", "K-12", "Local Government", "Higher Education"
Fiscal years are strings: '2026', '2025', '2024', etc.

Output ONLY this JSON (no markdown, no explanation outside JSON):
{
  "dataset": "main" | "fy26" | "active",
  "params": { "$select": "...", "$where": "...", "$group": "...", "$order": "...", "$limit": "..." },
  "explanation": "one sentence describing what this query finds"
}
Only include params that are needed.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Question: "${question}"\n\nSchemas:\n${schemaDoc}\n\nJSON query:` }],
    }),
  });

  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `API ${res.status}`); }
  const result = await res.json();
  const clean = result.content[0].text.trim().replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// Execute a query plan
async function executeQuery(plan) {
  const ds = DATASETS[plan.dataset];
  if (!ds) throw new Error(`Unknown dataset: ${plan.dataset}`);
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(plan.params || {})) { if (v) params.set(k, v); }
  const url = `${API_BASE}/${ds.id}.json?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`SODA ${res.status}: ${errText.slice(0, 300)}`);
  }
  const data = await res.json();
  return { data, url, label: ds.label, explanation: plan.explanation };
}

// Interpret results for regular queries
async function interpretResults(question, queryResult, apiKey) {
  const { data, label, explanation } = queryResult;
  const context = data.length === 0
    ? `Dataset: ${label}\nQuery: ${explanation}\nResult: No records found.`
    : `Dataset: ${label}\nQuery: ${explanation}\nRecords: ${data.length}\nData:\n${JSON.stringify(data.slice(0, 40), null, 2)}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      system: `You are an expert analyst on Texas DIR cooperative contract data.
Answer the user's question using the data. Bold key figures with **bold**.
Format dollar amounts clearly ($1.2M, $450K). For top-N queries use numbered lists.
If no data found, explain what was searched. Keep to 150-300 words.
Texas fiscal year: Sept 1 – Aug 31.`,
      messages: [{ role: 'user', content: `Question: "${question}"\n\n${context}` }],
    }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message); }
  const result = await res.json();
  return result.content[0].text;
}

// Build tech stack profile from multiple query results
async function buildTechStackProfile(agency, results, apiKey) {
  const combined = results.flatMap(r => r.data || []);
  const context = `Agency: ${agency}
Total records analyzed: ${combined.length}
Data from FY2022–FY2026:
${JSON.stringify(combined.slice(0, 80), null, 2)}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      system: `You are an expert IT analyst specializing in Texas state government technology infrastructure.
You will analyze DIR cooperative contract purchase data for a state agency and produce a structured technology stack profile.

Analyze vendor names, brand names, RFO descriptions, and spend amounts to categorize the agency's technology footprint.

Structure your response EXACTLY like this (use these exact headers with ##):

## Technology Stack Profile: [AGENCY]

**Data based on DIR cooperative contract purchases, FY2022–FY2026**

## Network & Infrastructure
List specific vendors/brands found (e.g. Cisco, Juniper, Dell, HPE) with spend if available

## Cybersecurity
List security vendors/tools found (e.g. Palo Alto, CrowdStrike, Splunk, Tenable)

## Cloud & Virtualization
List cloud/virtualization vendors (Microsoft Azure, AWS, VMware, etc.)

## End User Computing
Laptops, desktops, peripherals (Dell, Lenovo, HP, Apple)

## Software & Productivity
Microsoft, Oracle, SAP, ServiceNow, Salesforce, etc.

## Telecommunications
AT&T, Verizon, Lumen, etc.

## Professional Services (DBITS/ITSAC)
Key consulting/services vendors

## Key Observations
2-3 bullet points about notable patterns, dominant vendors, or strategic observations

Bold all **vendor names** and **dollar amounts**. Note spend totals where available.
If a category has no data, omit it. Keep concise but informative.`,
      messages: [{ role: 'user', content: context }],
    }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message); }
  const result = await res.json();
  return result.content[0].text;
}

const fmtAmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v || '—';
  if (n >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n/1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
};

const EXAMPLE_QUESTIONS = [
  "What is the technology stack that DPS uses?",
  "Give me a tech profile for HHSC",
  "What technology does TxDOT use?",
  "Top 10 customers using DBITS contracts in FY2026",
  "Who is TxDOT using for firewalls?",
  "Top 10 vendors by spend in FY2025",
  "What cybersecurity vendors does HHSC use?",
  "Which agencies are buying CrowdStrike?",
  "What is total Microsoft spend in FY2025?",
  "Top ITSAC vendors for state agencies FY2024",
  "What telecom vendors does TDCJ use?",
  "Which K-12 districts spend the most on DIR contracts?",
];

// Render markdown-style text with ## headers and **bold**
function RichText({ text, isError }) {
  return (
    <div>
      {text.split('\n').map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <div key={i} style={{ fontSize:13, fontWeight:700, color:'#1E2761', marginTop:i===0?0:12, marginBottom:3, borderBottom:'1px solid rgba(30,39,97,0.1)', paddingBottom:3 }}>
              {line.replace('## ','')}
            </div>
          );
        }
        if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
          return <div key={i} style={{ fontWeight:600, color:'#1E2761', marginBottom:2 }}>{line.replace(/\*\*/g,'')}</div>;
        }
        if (line === '') return <div key={i} style={{ height:4 }} />;
        return (
          <div key={i} style={{ fontSize:12.5, lineHeight:1.6, marginBottom:1, color: isError ? '#8B1C1C' : '#1A1F3C' }}>
            {line.split(/\*\*(.*?)\*\*/).map((part, pi) =>
              pi % 2 === 1
                ? <strong key={pi} style={{ color: isError ? '#8B1C1C' : '#1E2761' }}>{part}</strong>
                : part
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: `## Welcome to DIR Contract Intelligence

Ask me anything about Texas DIR cooperative contract spend. I can:

**Technology Stack Profiles** — "What is the technology stack that DPS uses?"
**Vendor Lookups** — "Who is TxDOT using for firewalls?"
**Spend Rankings** — "Top 10 DBITS customers in FY2026"
**Contract Type Queries** — "Show me all ITSAC spend for HHSC in FY2025"
**Cross-Agency Analysis** — "Which agencies are buying CrowdStrike?"

Data sourced live from the Texas Open Data Portal · FY2010–FY2026`,
    data: null, queryInfo: null, isTechProfile: false,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const bottomRef = useRef(null);
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSubmit = async (question) => {
    const q = (question || input).trim();
    if (!q || loading) return;
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: q }]);

    try {
      if (!apiKey) throw new Error('VITE_ANTHROPIC_KEY not set in Vercel environment variables.');

      const isTechProfile = isTechStackQuestion(q);
      const agency = isTechProfile ? extractAgency(q) : null;

      if (isTechProfile && agency) {
        // ── Tech Stack Profile flow ──────────────────────────────────────────
        setLoadingStep(`Building ${agency} tech profile…`);
        const queryPlans = await buildTechProfileQueries(agency);

        setLoadingStep(`Fetching ${agency} purchase history…`);
        const results = await Promise.all(queryPlans.map(executeQuery));

        setLoadingStep('Analyzing technology stack…');
        const profile = await buildTechStackProfile(agency, results, apiKey);

        const allData = results.flatMap(r => r.data || []).slice(0, 30);
        const totalRecords = results.reduce((s, r) => s + (r.data?.length || 0), 0);

        setMessages(prev => [...prev, {
          role: 'assistant',
          text: profile,
          data: allData,
          isTechProfile: true,
          queryInfo: {
            label: `${agency} Technology Profile`,
            explanation: `Analysis of ${totalRecords} DIR contract records from FY2022–FY2026`,
            count: totalRecords,
          },
        }]);

      } else {
        // ── Standard query flow ──────────────────────────────────────────────
        setLoadingStep('Generating query…');
        const queryPlan = await generateQuery(q, apiKey);

        setLoadingStep('Fetching from Texas ODP…');
        const queryResult = await executeQuery(queryPlan);

        setLoadingStep('Analyzing results…');
        const answer = await interpretResults(q, queryResult, apiKey);

        setMessages(prev => [...prev, {
          role: 'assistant',
          text: answer,
          data: queryResult.data.slice(0, 30),
          isTechProfile: false,
          queryInfo: {
            label: queryResult.label,
            explanation: queryResult.explanation,
            count: queryResult.data.length,
          },
        }]);
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `**Error:** ${err.message}\n\nTry rephrasing with a specific agency abbreviation (DPS, HHSC, TxDOT) or vendor name.`,
        data: null, queryInfo: null, isError: true,
      }]);
    }
    setLoading(false);
    setLoadingStep('');
  };

  const getHeaders = (data) => {
    if (!data?.length) return [];
    const all = new Set(data.flatMap(r => Object.keys(r)));
    const priority = ['customer_name','vendor_name','brand_name','rfo_description','contract_number','purchase_amount','total_spend','sum_purchase_amount','order_count','fiscal_year','latest_fy','customer_type'];
    const sorted = priority.filter(k => all.has(k));
    all.forEach(k => { if (!sorted.includes(k)) sorted.push(k); });
    return sorted.slice(0, 7);
  };

  return (
    <div style={{ maxWidth:1060, margin:'0 auto', padding:'20px 24px', display:'flex', flexDirection:'column', height:'calc(100vh - 63px)', fontFamily:"'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#141A47,#1E2761)', borderRadius:14, padding:'14px 20px', marginBottom:10, border:'1px solid rgba(200,169,81,0.25)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, background:'#C8A951', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🔍</div>
          <div>
            <div style={{ color:'#FFFFFF', fontSize:15, fontWeight:600 }}>DIR Contract Intelligence</div>
            <div style={{ color:'#8A93B2', fontSize:11 }}>Live · Texas Open Data Portal · FY2010–FY2026 · Claude AI query engine</div>
          </div>
        </div>
      </div>

      {/* Example chips */}
      <div style={{ marginBottom:9, flexShrink:0 }}>
        <div style={{ fontSize:11, color:'#8A93B2', marginBottom:5, fontWeight:500, textTransform:'uppercase', letterSpacing:0.8 }}>Try asking…</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          {EXAMPLE_QUESTIONS.map(q => (
            <button key={q} onClick={() => handleSubmit(q)} disabled={loading} style={{
              fontSize:11, padding:'3px 9px', borderRadius:14,
              border:'1px solid rgba(30,39,97,0.18)', background:'#FFFFFF', color:'#1E2761',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'inherit',
              opacity: loading ? 0.5 : 1, transition:'background 0.12s'
            }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.background='#E6F1FB'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#FFFFFF'; }}
            >{q}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', background:'#FFFFFF', borderRadius:12, border:'1px solid rgba(30,39,97,0.1)', padding:'16px', marginBottom:10, boxShadow:'0 2px 8px rgba(30,39,97,0.05)' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom:18, display:'flex', flexDirection:'column', alignItems: msg.role==='user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: msg.isTechProfile ? '96%' : '88%',
              background: msg.role==='user' ? '#1E2761' : msg.isError ? '#FDE8E8' : '#F4F6FB',
              color: msg.role==='user' ? '#FFFFFF' : msg.isError ? '#8B1C1C' : '#1A1F3C',
              borderRadius: msg.role==='user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              padding: msg.isTechProfile ? '16px 20px' : '11px 15px',
              fontSize:13, lineHeight:1.65,
              border: msg.role==='assistant' ? '1px solid rgba(30,39,97,0.08)' : 'none',
            }}>
              {msg.role === 'assistant'
                ? <RichText text={msg.text} isError={msg.isError} />
                : msg.text}
            </div>

            {msg.queryInfo && (
              <div style={{ display:'flex', gap:5, marginTop:5, flexWrap:'wrap', maxWidth:'96%' }}>
                <span style={{ fontSize:10, padding:'2px 8px', borderRadius:10, background: msg.isTechProfile ? '#FAEEDA' : '#E6F1FB', color: msg.isTechProfile ? '#633806' : '#0C447C', border:`1px solid ${msg.isTechProfile ? '#FAC775' : '#B5D4F4'}` }}>
                  {msg.isTechProfile ? '📊' : '✓'} {msg.queryInfo.label} · {msg.queryInfo.count} records
                </span>
                <span style={{ fontSize:10, padding:'2px 8px', borderRadius:10, background:'#F4F6FB', color:'#8A93B2', border:'1px solid rgba(30,39,97,0.1)', fontStyle:'italic' }}>
                  {msg.queryInfo.explanation}
                </span>
              </div>
            )}

            {msg.data && msg.data.length > 0 && (() => {
              const headers = getHeaders(msg.data);
              return (
                <div style={{ marginTop:7, width:'100%', maxWidth:'96%' }}>
                  <details>
                    <summary style={{ fontSize:11, color:'#8A93B2', cursor:'pointer', marginBottom:5, userSelect:'none', fontWeight:500 }}>
                      View raw data ({msg.data.length} records shown)
                    </summary>
                    <div style={{ overflowX:'auto', borderRadius:8, border:'1px solid rgba(30,39,97,0.1)' }}>
                      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
                        <thead>
                          <tr style={{ background:'#1E2761' }}>
                            {headers.map(h => (
                              <th key={h} style={{ padding:'6px 10px', textAlign:'left', color:'rgba(255,255,255,0.75)', fontWeight:500, whiteSpace:'nowrap', fontSize:10 }}>
                                {h.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {msg.data.map((row, ri) => (
                            <tr key={ri} style={{ borderBottom:'1px solid rgba(30,39,97,0.06)' }}
                              onMouseEnter={e => e.currentTarget.style.background='#F8F9FD'}
                              onMouseLeave={e => e.currentTarget.style.background=''}>
                              {headers.map(h => (
                                <td key={h} style={{
                                  padding:'6px 10px',
                                  color: h.includes('amount')||h.includes('spend')||h.includes('sum') ? '#C8A951' : h==='vendor_name'||h==='customer_name' ? '#1E2761' : '#4A5280',
                                  fontWeight: h==='vendor_name'||h==='customer_name' ? 500 : 400,
                                  fontFamily: h.includes('amount')||h.includes('spend')||h.includes('sum')||h.includes('count') ? 'monospace' : 'inherit'
                                }}>
                                  {h.includes('amount')||h.includes('spend')||h.includes('sum') ? fmtAmt(row[h]) : (row[h]||'—')}
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

        {loading && (
          <div style={{ display:'flex', alignItems:'flex-start', marginBottom:14 }}>
            <div style={{ background:'#F4F6FB', borderRadius:'14px 14px 14px 4px', padding:'11px 15px', border:'1px solid rgba(30,39,97,0.08)' }}>
              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#C8A951', animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
                ))}
                <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.6)}40%{transform:scale(1)}}`}</style>
                <span style={{ fontSize:12, color:'#8A93B2', marginLeft:6 }}>{loadingStep || 'Thinking…'}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display:'flex', gap:8, flexShrink:0, background:'#FFFFFF', borderRadius:12, border:'1px solid rgba(30,39,97,0.15)', padding:'9px 12px', boxShadow:'0 2px 8px rgba(30,39,97,0.05)' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); handleSubmit(); }}}
          placeholder="Ask about tech stacks, vendors, contract spend… (e.g. 'What tech stack does DPS use?')"
          disabled={loading}
          style={{ flex:1, border:'none', outline:'none', fontSize:13, color:'#1A1F3C', background:'transparent', fontFamily:'inherit' }}
        />
        <button onClick={() => handleSubmit()} disabled={loading || !input.trim()} style={{
          padding:'7px 16px', background: loading||!input.trim() ? 'rgba(200,169,81,0.4)' : '#C8A951',
          border:'none', borderRadius:8, color:'#141A47', fontSize:13, fontWeight:600,
          cursor: loading||!input.trim() ? 'not-allowed' : 'pointer',
          fontFamily:'inherit', flexShrink:0, transition:'background 0.2s'
        }}>{loading ? '…' : 'Ask →'}</button>
      </div>

      <p style={{ fontSize:10, color:'#8A93B2', marginTop:6, textAlign:'center', flexShrink:0 }}>
        Live data · data.texas.gov · DIR Cooperative Contracts FY2010–FY2026 · Powered by Claude AI
      </p>
    </div>
  );
}
