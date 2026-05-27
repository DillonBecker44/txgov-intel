import React, { useState, useRef, useEffect } from 'react';

const DATASETS = {
  sales_history: { id: 'w64c-ndf7', label: 'DIR Coop Sales FY2010–Present' },
  fy26:          { id: 'a743-wj72', label: 'Coop & Tele Contracts FY2026' },
  by_customer:   { id: 'bh8a-hpms', label: 'DIR Sales by Customer' },
  active:        { id: 'vipt-h4ye', label: 'Active Cooperative Contracts' },
};

const API_BASE = 'https://data.texas.gov/resource';

function parseIntent(question) {
  const q = question.toLowerCase();

  const agencyMap = {
    'TxDOT':  ['txdot','department of transportation'],
    'HHSC':   ['hhsc','health and human services'],
    'DPS':    ['dps','department of public safety','public safety'],
    'TEA':    ['texas education agency','tea '],
    'DIR':    ['dir ','department of information resources'],
    'TxDMV':  ['txdmv','motor vehicles','dmv'],
    'TDCJ':   ['tdcj','criminal justice'],
    'TWC':    ['twc','workforce commission'],
    'TPWD':   ['tpwd','parks and wildlife'],
    'CPA':    ['comptroller','cpa '],
    'OCA':    ['court administration','oca '],
    'GLO':    ['general land office','glo '],
    'TCEQ':   ['tceq','environmental quality'],
    'SOS':    ['secretary of state',' sos '],
  };

  let detectedAgency = null;
  for (const [key, terms] of Object.entries(agencyMap)) {
    if (terms.some(t => q.includes(t))) { detectedAgency = key; break; }
  }

  const techKeywords = [
    'firewall','cisco','palo alto','fortinet','checkpoint','juniper','sonicwall',
    'microsoft','azure','aws','amazon','google','oracle','sap','dell','hp','hewlett',
    'vmware','crowdstrike','splunk','servicenow','salesforce','proofpoint','mimecast',
    'zscaler','okta','ping identity','sailpoint','cyberark','tenable','qualys','rapid7',
    'zoom','webex','teams','office 365','windows','red hat','nutanix',
    'cybersecurity','network','storage','cloud','server','software','hardware',
    'managed service','staffing','consulting','at&t','verizon','lumen',
    'printer','lenovo','apple','ipad','laptop','desktop',
  ];

  const foundKeywords = techKeywords.filter(k => q.includes(k));

  let questionType = 'general';
  if (q.includes('who') && (q.includes('use') || q.includes('using') || q.includes('vendor') || q.includes('buy'))) questionType = 'vendor_lookup';
  if (q.includes('how much') || q.includes('spend') || q.includes('spent') || q.includes('cost')) questionType = 'spend_amount';
  if (q.includes('top') || q.includes('largest') || q.includes('biggest') || q.includes('most')) questionType = 'ranking';
  if (q.includes('compare') || q.includes('vs') || q.includes('versus')) questionType = 'comparison';

  return { detectedAgency, foundKeywords, questionType };
}

function buildQuery(intent, question) {
  const { detectedAgency, foundKeywords, questionType } = intent;
  const queries = [];

  const useRecent = question.toLowerCase().includes('current') ||
    question.toLowerCase().includes('fy26') || question.toLowerCase().includes('2026') ||
    question.toLowerCase().includes('now') || question.toLowerCase().includes('today');

  const primaryDS = useRecent ? DATASETS.fy26 : DATASETS.sales_history;

  // Build search terms — $q does full-text search across all columns in Socrata
  const searchTerms = [];
  if (detectedAgency) searchTerms.push(detectedAgency);
  foundKeywords.forEach(k => searchTerms.push(k));

  if (searchTerms.length === 0) {
    const stopWords = new Set(['who','what','which','how','much','does','did','is','are','the',
      'for','and','with','use','using','buy','get','have','been','through','dir',
      'contracts','contract','agency','state','texas','about','their','they','list','show','find','give','me']);
    const words = question.toLowerCase().split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w))
      .slice(0, 4);
    searchTerms.push(...words);
  }

  const searchQ = [...new Set(searchTerms)].join(' ');
  const orderClause = (questionType === 'ranking' || questionType === 'spend_amount')
    ? '&$order=purchase_amount DESC'
    : '&$order=fiscal_year DESC';

  const qParam = searchQ ? `&$q=${encodeURIComponent(searchQ)}` : '';

  queries.push({
    url: `${API_BASE}/${primaryDS.id}.json?$limit=50${qParam}${orderClause}`,
    label: primaryDS.label,
    dataset: primaryDS.id,
  });

  // Always also check FY26 for current vendor info
  if (!useRecent && searchQ) {
    queries.push({
      url: `${API_BASE}/${DATASETS.fy26.id}.json?$limit=30${qParam}&$order=fiscal_year DESC`,
      label: DATASETS.fy26.label,
      dataset: DATASETS.fy26.id,
    });
  }

  return queries;
}

async function fetchDataset(query) {
  try {
    const res = await fetch(query.url);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }
    const data = await res.json();
    return { label: query.label, data, error: null };
  } catch (e) {
    return { label: query.label, data: [], error: e.message };
  }
}

async function askClaude(question, dataResults, apiKey) {
  const dataContext = dataResults.map(r => {
    if (r.error) return `Dataset "${r.label}": Error — ${r.error}`;
    if (!r.data.length) return `Dataset "${r.label}": No matching records found.`;
    const sample = r.data.slice(0, 30);
    return `Dataset "${r.label}" (${r.data.length} records returned):\n${JSON.stringify(sample, null, 2)}`;
  }).join('\n\n---\n\n');

  const systemPrompt = `You are an expert analyst on Texas state government IT procurement and DIR cooperative contracts.
You have been given real data from the Texas Open Data Portal (data.texas.gov) in response to a user's question.

Key column names in the data:
- vendor_name: the technology vendor
- customer_name: the Texas agency or entity buying
- purchase_amount: dollar amount of the purchase
- brand_name: specific product brand purchased
- contract_number: DIR contract number (e.g. DIR-CPO-XXXX)
- fiscal_year: Texas fiscal year (Sept 1 - Aug 31)
- reseller_name: reseller/VAR used if applicable

Your job:
1. Directly answer the question using the data
2. Call out specific vendor names, agencies, amounts, and contract numbers
3. Group and summarize spend where useful (e.g. total Cisco spend across agencies)
4. If no data returned, say clearly what was searched and suggest alternatives
5. Keep responses to 150-300 words, well formatted
6. Bold key vendor names and dollar amounts using **bold**`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
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
      system: systemPrompt,
      messages: [{ role: 'user', content: `Question: "${question}"\n\nData:\n${dataContext}` }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Anthropic API error ${response.status}`);
  }

  const result = await response.json();
  return result.content[0].text;
}

const EXAMPLE_QUESTIONS = [
  "Who is TxDOT using for firewalls?",
  "What cybersecurity vendors does HHSC use?",
  "Top 10 vendors by spend in FY2024",
  "Does DPS use Palo Alto or Cisco?",
  "What Microsoft spend is there across agencies?",
  "Which agencies are buying CrowdStrike?",
  "What cloud vendors does TEA use?",
  "Show me Proofpoint customers in Texas",
  "Who sells network equipment to TDCJ?",
  "What is Zscaler spend across state agencies?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: "Hi! I can search Texas DIR cooperative contract data (FY2010–FY2026) to answer questions about vendor spend across state agencies.\n\nTry: **\"Who is TxDOT using for firewalls?\"** or **\"What cybersecurity vendors does HHSC use?\"**",
    data: null, queries: null,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
      const intent = parseIntent(q);
      const queries = buildQuery(intent, q);
      const dataResults = await Promise.all(queries.map(fetchDataset));
      const answer = await askClaude(q, dataResults, apiKey);
      const allRecords = dataResults.flatMap(r => r.data || []).slice(0, 25);
      setMessages(prev => [...prev, {
        role: 'assistant', text: answer, data: allRecords,
        queries: queries.map((q, i) => ({
          label: q.label,
          count: dataResults[i]?.data?.length || 0,
          error: dataResults[i]?.error,
        })),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Error: ${err.message}`,
        data: null, queries: null, isError: true,
      }]);
    }
    setLoading(false);
  };

  const fmtAmt = (v) => {
    const n = parseFloat(v);
    if (isNaN(n)) return v || '—';
    if (n >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
    if (n >= 1e3) return `$${(n/1e3).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
  };

  return (
    <div style={{ maxWidth:1000, margin:'0 auto', padding:'20px 24px', display:'flex', flexDirection:'column', height:'calc(100vh - 63px)', fontFamily:"'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#141A47,#1E2761)', borderRadius:14, padding:'18px 22px', marginBottom:14, border:'1px solid rgba(200,169,81,0.25)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
          <div style={{ width:34, height:34, background:'#C8A951', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🔍</div>
          <div>
            <div style={{ color:'#FFFFFF', fontSize:15, fontWeight:600 }}>DIR Contract Intelligence</div>
            <div style={{ color:'#8A93B2', fontSize:11 }}>Live data from Texas Open Data Portal · FY2010–FY2026 · Powered by Claude AI</div>
          </div>
        </div>
      </div>

      {/* Example chips */}
      <div style={{ marginBottom:12, flexShrink:0 }}>
        <div style={{ fontSize:11, color:'#8A93B2', marginBottom:6, fontWeight:500, textTransform:'uppercase', letterSpacing:0.8 }}>Try asking…</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          {EXAMPLE_QUESTIONS.map(q => (
            <button key={q} onClick={() => handleSubmit(q)} disabled={loading} style={{
              fontSize:11, padding:'4px 10px', borderRadius:16,
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
              maxWidth:'88%',
              background: msg.role==='user' ? '#1E2761' : msg.isError ? '#FDE8E8' : '#F4F6FB',
              color: msg.role==='user' ? '#FFFFFF' : msg.isError ? '#8B1C1C' : '#1A1F3C',
              borderRadius: msg.role==='user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              padding:'11px 15px', fontSize:13, lineHeight:1.65,
              border: msg.role==='assistant' ? '1px solid rgba(30,39,97,0.08)' : 'none',
            }}>
              {msg.role === 'assistant'
                ? msg.text.split('\n').map((line, li) => (
                    <div key={li} style={{ marginBottom: line==='' ? 5 : 0 }}>
                      {line.split(/\*\*(.*?)\*\*/).map((part, pi) =>
                        pi % 2 === 1
                          ? <strong key={pi} style={{ color: msg.isError ? '#8B1C1C' : '#1E2761' }}>{part}</strong>
                          : part
                      )}
                    </div>
                  ))
                : msg.text}
            </div>

            {msg.queries && (
              <div style={{ display:'flex', gap:5, marginTop:5, flexWrap:'wrap' }}>
                {msg.queries.map((q, qi) => (
                  <span key={qi} style={{ fontSize:10, padding:'2px 8px', borderRadius:10,
                    background: q.error ? '#FDE8E8' : '#E6F1FB',
                    color: q.error ? '#8B1C1C' : '#0C447C',
                    border:`1px solid ${q.error ? '#F5BCBC' : '#B5D4F4'}`
                  }}>
                    {q.error ? '⚠ ' : '✓ '}{q.label} {q.error ? '(error)' : `(${q.count})`}
                  </span>
                ))}
              </div>
            )}

            {msg.data && msg.data.length > 0 && (
              <div style={{ marginTop:8, width:'100%', maxWidth:'100%' }}>
                <details>
                  <summary style={{ fontSize:11, color:'#8A93B2', cursor:'pointer', marginBottom:5, userSelect:'none', fontWeight:500 }}>
                    View raw records ({msg.data.length})
                  </summary>
                  <div style={{ overflowX:'auto', borderRadius:8, border:'1px solid rgba(30,39,97,0.1)' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
                      <thead>
                        <tr style={{ background:'#1E2761' }}>
                          {['Vendor','Brand','Customer / Agency','Contract #','Amount','FY'].map(h => (
                            <th key={h} style={{ padding:'6px 10px', textAlign:'left', color:'rgba(255,255,255,0.75)', fontWeight:500, whiteSpace:'nowrap', fontSize:10 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.data.map((row, ri) => (
                          <tr key={ri} style={{ borderBottom:'1px solid rgba(30,39,97,0.06)' }}
                            onMouseEnter={e => e.currentTarget.style.background='#F8F9FD'}
                            onMouseLeave={e => e.currentTarget.style.background=''}>
                            <td style={{ padding:'6px 10px', fontWeight:500, color:'#1E2761' }}>{row.vendor_name||'—'}</td>
                            <td style={{ padding:'6px 10px', color:'#4A5280', fontSize:10 }}>{row.brand_name||'—'}</td>
                            <td style={{ padding:'6px 10px', color:'#4A5280' }}>{row.customer_name||'—'}</td>
                            <td style={{ padding:'6px 10px', color:'#8A93B2', fontFamily:'monospace', fontSize:10 }}>{row.contract_number||row.dir_contract_number||'—'}</td>
                            <td style={{ padding:'6px 10px', fontWeight:600, color:'#C8A951', fontFamily:'monospace' }}>{fmtAmt(row.purchase_amount||row.total_sales||row.amount)}</td>
                            <td style={{ padding:'6px 10px', color:'#8A93B2' }}>{row.fiscal_year||'—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </div>
            )}
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
                <span style={{ fontSize:12, color:'#8A93B2', marginLeft:6 }}>Searching Texas ODP…</span>
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
          placeholder="Ask about DIR contract spend… (e.g. 'Who is TxDOT using for firewalls?')"
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
        Live data · data.texas.gov · DIR Cooperative Contracts FY2010–FY2026
      </p>
    </div>
  );
}
