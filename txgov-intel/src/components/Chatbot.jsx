import React, { useState, useRef, useEffect } from 'react';

const DATASETS = {
  sales_history: { id: 'w64c-ndf7', label: 'DIR Coop Sales FY2010–Present' },
  fy26:          { id: 'a743-wj72', label: 'Coop & Tele Contracts FY2026' },
  by_customer:   { id: 'bh8a-hpms', label: 'DIR Sales by Customer' },
  active:        { id: 'vipt-h4ye', label: 'Active Cooperative Contracts' },
};

const API_BASE = 'https://data.texas.gov/resource';

// Extract search intent from the user's question
function parseIntent(question) {
  const q = question.toLowerCase();

  // Agency detection
  const agencyMap = {
    txdot: ['txdot','department of transportation','dot'],
    hhsc:  ['hhsc','health and human services','hhs'],
    dps:   ['dps','department of public safety','public safety'],
    tea:   ['tea','education agency','tea '],
    dir:   ['dir ','department of information resources'],
    txdmv: ['txdmv','motor vehicles','dmv'],
    tdcj:  ['tdcj','criminal justice'],
    twc:   ['twc','workforce commission'],
    tpwd:  ['tpwd','parks and wildlife'],
    cpa:   ['comptroller','cpa '],
  };

  let detectedAgency = null;
  for (const [key, terms] of Object.entries(agencyMap)) {
    if (terms.some(t => q.includes(t))) { detectedAgency = key.toUpperCase(); break; }
  }

  // Vendor/tech keyword detection
  const techKeywords = [
    'firewall','cisco','palo alto','fortinet','checkpoint','juniper',
    'microsoft','azure','aws','amazon','google','oracle','sap','dell',
    'hp','hewlett','vmware','crowdstrike','splunk','servicenow','salesforce',
    'zoom','webex','teams','office','windows','linux','red hat',
    'cybersecurity','security','network','storage','cloud','laptop','server',
    'software','hardware','managed service','consulting','staffing',
    'at&t','verizon','lumen','spectrum','internet','broadband',
    'printer','copier','lenovo','apple','ipad','iphone',
  ];

  const foundKeywords = techKeywords.filter(k => q.includes(k));

  // Question type
  let questionType = 'general';
  if (q.includes('who') && (q.includes('use') || q.includes('using') || q.includes('vendor') || q.includes('buy'))) questionType = 'vendor_lookup';
  if (q.includes('how much') || q.includes('spend') || q.includes('spent') || q.includes('cost')) questionType = 'spend_amount';
  if (q.includes('what contract') || q.includes('which contract') || q.includes('contract number')) questionType = 'contract_lookup';
  if (q.includes('top') || q.includes('largest') || q.includes('biggest') || q.includes('most')) questionType = 'ranking';
  if (q.includes('compare') || q.includes('vs') || q.includes('versus') || q.includes('difference')) questionType = 'comparison';

  return { detectedAgency, foundKeywords, questionType };
}

// Build SODA API query based on intent
function buildQuery(intent, question) {
  const { detectedAgency, foundKeywords, questionType } = intent;
  const queries = [];

  // Primary dataset — FY2026 for current, history for trends
  const useRecent = question.toLowerCase().includes('current') ||
    question.toLowerCase().includes('fy26') || question.toLowerCase().includes('2026') ||
    question.toLowerCase().includes('now') || question.toLowerCase().includes('today');

  const primaryDS = useRecent ? DATASETS.fy26 : DATASETS.sales_history;

  // Build where clause
  const conditions = [];

  if (detectedAgency) {
    conditions.push(`upper(customer_name) like '%${detectedAgency}%'`);
  }

  if (foundKeywords.length > 0) {
    const vendorConds = foundKeywords
      .map(k => `upper(vendor_name) like '%${k.toUpperCase()}%'`)
      .join(' OR ');
    conditions.push(`(${vendorConds})`);
  }

  // If no specific filters, do a broad keyword search from the raw question
  if (conditions.length === 0) {
    const words = question.split(' ')
      .filter(w => w.length > 4)
      .slice(0, 3)
      .map(w => `upper(vendor_name) like '%${w.toUpperCase()}%'`);
    if (words.length) conditions.push(`(${words.join(' OR ')})`);
  }

  const whereClause = conditions.length > 0 ? `&$where=${encodeURIComponent(conditions.join(' AND '))}` : '';
  const orderClause = questionType === 'ranking' || questionType === 'spend_amount'
    ? `&$order=total_sales DESC`
    : `&$order=fiscal_year DESC`;

  queries.push({
    url: `${API_BASE}/${primaryDS.id}.json?$limit=50${whereClause}${orderClause}`,
    label: primaryDS.label,
    dataset: primaryDS.id,
  });

  // Also query active contracts if looking for current vendors
  if (questionType === 'vendor_lookup' || questionType === 'contract_lookup') {
    const activeConditions = [];
    if (detectedAgency) activeConditions.push(`upper(customer_name) like '%${detectedAgency}%'`);
    if (foundKeywords.length > 0) {
      const vc = foundKeywords.map(k => `upper(vendor_name) like '%${k.toUpperCase()}%'`).join(' OR ');
      activeConditions.push(`(${vc})`);
    }
    const activeWhere = activeConditions.length > 0 ? `&$where=${encodeURIComponent(activeConditions.join(' AND '))}` : '';
    queries.push({
      url: `${API_BASE}/${DATASETS.active.id}.json?$limit=30${activeWhere}&$order=contract_start_date DESC`,
      label: DATASETS.active.label,
      dataset: DATASETS.active.id,
    });
  }

  return queries;
}

async function fetchDataset(query) {
  try {
    const res = await fetch(query.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { label: query.label, data, error: null };
  } catch (e) {
    return { label: query.label, data: [], error: e.message };
  }
}

async function askClaude(question, dataResults, apiKey) {
  const dataContext = dataResults.map(r => {
    if (r.error) return `Dataset "${r.label}": Error fetching — ${r.error}`;
    if (!r.data.length) return `Dataset "${r.label}": No matching records found.`;
    const sample = r.data.slice(0, 25);
    return `Dataset "${r.label}" (${r.data.length} records):\n${JSON.stringify(sample, null, 2)}`;
  }).join('\n\n---\n\n');

  const systemPrompt = `You are an expert analyst on Texas state government IT procurement and DIR cooperative contracts. 
You have been given real data from the Texas Open Data Portal in response to a user's question.

Your job is to:
1. Directly answer the user's question using the data provided
2. Highlight specific vendors, contract numbers, spend amounts, and agencies found in the data
3. Note any patterns or notable findings
4. If data is incomplete or missing, say so clearly and suggest what to look for
5. Format your response clearly with vendor names, amounts, and contract details bolded or highlighted
6. Keep responses concise but complete — 150-300 words

Always cite specific numbers from the data. If you see Palo Alto, Cisco, Fortinet, Microsoft etc. call them out specifically.
Texas fiscal year runs September 1 to August 31.`;

  const userMessage = `User question: "${question}"

Here is the live data from the Texas Open Data Portal:

${dataContext}

Please answer the user's question based on this data.`;

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
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const result = await response.json();
  return result.content[0].text;
}

const EXAMPLE_QUESTIONS = [
  "Who is TxDOT using for firewalls?",
  "What cybersecurity vendors does HHSC use through DIR contracts?",
  "Who are the top 10 vendors by spend in FY26?",
  "Does DPS use Palo Alto or Cisco for network security?",
  "What Microsoft spend is there across state agencies?",
  "Which agencies are buying CrowdStrike through DIR?",
  "What cloud vendors does TEA use?",
  "How much has TxDOT spent on Cisco through DIR contracts?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I can search the Texas DIR cooperative contract datasets to answer questions about vendor spend across state agencies. Try asking something like \"Who is TxDOT using for firewalls?\" or \"What cybersecurity vendors does HHSC use?\"",
      data: null,
      queries: null,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (question) => {
    const q = question || input.trim();
    if (!q || loading) return;
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', text: q }]);

    try {
      if (!apiKey) throw new Error('VITE_ANTHROPIC_KEY not set in environment variables.');

      // Parse intent and build queries
      const intent = parseIntent(q);
      const queries = buildQuery(intent, q);

      // Fetch all datasets in parallel
      const dataResults = await Promise.all(queries.map(fetchDataset));

      // Ask Claude to interpret
      const answer = await askClaude(q, dataResults, apiKey);

      // Flatten all records for display
      const allRecords = dataResults.flatMap(r => r.data || []).slice(0, 20);

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: answer,
        data: allRecords,
        queries: queries.map((q, i) => ({
          label: q.label,
          count: dataResults[i]?.data?.length || 0,
          error: dataResults[i]?.error,
        })),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Sorry, I ran into an error: ${err.message}. Please check that your VITE_ANTHROPIC_KEY is set correctly in Vercel environment variables.`,
        data: null,
        queries: null,
        isError: true,
      }]);
    }
    setLoading(false);
  };

  const fmtAmount = (v) => {
    const n = parseFloat(v);
    if (isNaN(n)) return v || '—';
    if (n >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
    if (n >= 1e3) return `$${(n/1e3).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 63px)' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #141A47, #1E2761)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 16,
        border: '1px solid rgba(200,169,81,0.25)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36, background: '#C8A951', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18
          }}>🔍</div>
          <div>
            <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600 }}>DIR Contract Intelligence</div>
            <div style={{ color: '#8A93B2', fontSize: 11 }}>Powered by Texas Open Data Portal + Claude AI</div>
          </div>
        </div>
        <p style={{ color: '#CADCFC', fontSize: 12, lineHeight: 1.5, margin: 0 }}>
          Ask natural language questions about DIR cooperative contract spend across Texas state agencies.
          Data pulled live from data.texas.gov — FY2010–FY2026.
        </p>
      </div>

      {/* Example questions */}
      <div style={{ marginBottom: 14, flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: '#8A93B2', marginBottom: 7, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Try asking…
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {EXAMPLE_QUESTIONS.map(q => (
            <button key={q} onClick={() => handleSubmit(q)}
              disabled={loading}
              style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 16,
                border: '1px solid rgba(30,39,97,0.2)',
                background: '#FFFFFF', color: '#1E2761',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', opacity: loading ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#E6F1FB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
            >{q}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', background: '#FFFFFF',
        borderRadius: 12, border: '1px solid rgba(30,39,97,0.1)',
        padding: '16px', marginBottom: 12,
        boxShadow: '0 2px 8px rgba(30,39,97,0.06)'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {/* Bubble */}
            <div style={{
              maxWidth: '85%',
              background: msg.role === 'user' ? '#1E2761' : msg.isError ? '#FDE8E8' : '#F4F6FB',
              color: msg.role === 'user' ? '#FFFFFF' : msg.isError ? '#8B1C1C' : '#1A1F3C',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              padding: '12px 16px',
              fontSize: 13,
              lineHeight: 1.6,
              border: msg.role === 'assistant' ? '1px solid rgba(30,39,97,0.08)' : 'none',
            }}>
              {/* Format assistant text with basic markdown-style bold */}
              {msg.role === 'assistant'
                ? msg.text.split('\n').map((line, li) => (
                    <div key={li} style={{ marginBottom: line === '' ? 6 : 0 }}>
                      {line.split(/\*\*(.*?)\*\*/).map((part, pi) =>
                        pi % 2 === 1
                          ? <strong key={pi} style={{ color: '#1E2761' }}>{part}</strong>
                          : part
                      )}
                    </div>
                  ))
                : msg.text
              }
            </div>

            {/* Dataset sources used */}
            {msg.queries && (
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {msg.queries.map((q, qi) => (
                  <span key={qi} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 10,
                    background: q.error ? '#FDE8E8' : '#E6F1FB',
                    color: q.error ? '#8B1C1C' : '#0C447C',
                    border: `1px solid ${q.error ? '#F5BCBC' : '#B5D4F4'}`
                  }}>
                    {q.error ? '⚠ ' : '✓ '}{q.label} {q.error ? `(error)` : `(${q.count} records)`}
                  </span>
                ))}
              </div>
            )}

            {/* Raw data table */}
            {msg.data && msg.data.length > 0 && (
              <div style={{ marginTop: 10, width: '100%', maxWidth: '100%' }}>
                <details>
                  <summary style={{
                    fontSize: 11, color: '#8A93B2', cursor: 'pointer',
                    marginBottom: 6, userSelect: 'none',
                    fontWeight: 500
                  }}>
                    View raw data ({msg.data.length} records)
                  </summary>
                  <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid rgba(30,39,97,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                      <thead>
                        <tr style={{ background: '#1E2761' }}>
                          {['Vendor', 'Customer / Agency', 'Contract', 'Amount', 'FY'].map(h => (
                            <th key={h} style={{
                              padding: '7px 10px', textAlign: 'left',
                              color: 'rgba(255,255,255,0.75)', fontWeight: 500,
                              whiteSpace: 'nowrap', fontSize: 10
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.data.map((row, ri) => (
                          <tr key={ri} style={{ borderBottom: '1px solid rgba(30,39,97,0.06)' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F8F9FD'}
                            onMouseLeave={e => e.currentTarget.style.background = ''}>
                            <td style={{ padding: '6px 10px', fontWeight: 500, color: '#1E2761' }}>
                              {row.vendor_name || row.reseller_name || '—'}
                            </td>
                            <td style={{ padding: '6px 10px', color: '#4A5280' }}>
                              {row.customer_name || row.agency_name || '—'}
                            </td>
                            <td style={{ padding: '6px 10px', color: '#8A93B2', fontFamily: 'monospace', fontSize: 10 }}>
                              {row.contract_number || row.dir_contract_number || row.contract_id || '—'}
                            </td>
                            <td style={{ padding: '6px 10px', fontWeight: 600, color: '#C8A951', fontFamily: 'monospace' }}>
                              {fmtAmount(row.total_sales || row.amount || row.total_amount || row.sales_amount)}
                            </td>
                            <td style={{ padding: '6px 10px', color: '#8A93B2' }}>
                              {row.fiscal_year || row.fy || '—'}
                            </td>
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

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
            <div style={{
              background: '#F4F6FB', borderRadius: '14px 14px 14px 4px',
              padding: '12px 16px', border: '1px solid rgba(30,39,97,0.08)'
            }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#C8A951',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
                <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.6)} 40%{transform:scale(1)} }`}</style>
                <span style={{ fontSize: 12, color: '#8A93B2', marginLeft: 6 }}>
                  Searching Texas ODP…
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 10, flexShrink: 0,
        background: '#FFFFFF', borderRadius: 12,
        border: '1px solid rgba(30,39,97,0.15)',
        padding: '10px 12px',
        boxShadow: '0 2px 8px rgba(30,39,97,0.06)'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }}}
          placeholder="Ask about DIR contract spend… (e.g. 'Who is TxDOT using for firewalls?')"
          disabled={loading}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 13, color: '#1A1F3C',
            background: 'transparent', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={loading || !input.trim()}
          style={{
            padding: '8px 18px', background: loading || !input.trim() ? 'rgba(200,169,81,0.4)' : '#C8A951',
            border: 'none', borderRadius: 8,
            color: '#141A47', fontSize: 13, fontWeight: 600,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', flexShrink: 0, transition: 'background 0.2s'
          }}
        >
          {loading ? '…' : 'Ask →'}
        </button>
      </div>

      <p style={{ fontSize: 10, color: '#8A93B2', marginTop: 8, textAlign: 'center', flexShrink: 0 }}>
        Data sourced live from data.texas.gov · DIR Cooperative Contract datasets · FY2010–FY2026
      </p>
    </div>
  );
}
