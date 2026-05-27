import React, { useState, useEffect } from 'react';
import { AGENCIES } from '../data/agencies';

// ─── Budget data ─────────────────────────────────────────────────────────────
// approved_budget: SB1 89th Legislature IT capital budget (confirmed or estimated)
// sts_annual:      STS/Data Center Services IAC — annual billed amount to DIR (agency 313)
// open_market_est: Open market IT spend estimate (object codes 7242,7262,7267,7275,7284,7390)
//                  sourced from Comptroller USAS — update quarterly
// dir_coop_fy25:   FY25 DIR cooperative contract actual (from Comptroller/Industry Insider)
// last_updated:    When this row was last manually updated
// notes:           Source/context notes

const BUDGET_DATA = [
  {
    id: 'hhsc',
    approved_budget: 1100,
    budget_confirmed: true,
    sts_annual: 210,
    sts_source: 'IAC with DIR — Data Center + MSS services (est. from SFR/LAR)',
    open_market_est: 320,
    open_market_source: 'Comptroller USAS obj. 7262/7275 — FY25 estimate',
    dir_coop_fy25: 899,
    dir_coop_fy26_ytd: 247,
    last_updated: 'May 2026',
    notes: 'Largest IT spender. STS includes mainframe, DCS, MSS. Open market includes TIERS/MMIS vendor payments.',
  },
  {
    id: 'txdot',
    approved_budget: 167.4,
    budget_confirmed: true,
    sts_annual: 45,
    sts_source: 'IAC with DIR — DCS and network services',
    open_market_est: 95,
    open_market_source: 'Comptroller USAS est. — includes district IT contracts',
    dir_coop_fy25: 882,
    dir_coop_fy26_ytd: 112,
    last_updated: 'May 2026',
    notes: 'High FY25 coop spend reflects statewide network and hardware refresh. Capital budget is IT-specific appropriation only.',
  },
  {
    id: 'dir',
    approved_budget: 400,
    budget_confirmed: false,
    sts_annual: 0,
    sts_source: 'DIR is the STS provider — not a customer',
    open_market_est: 55,
    open_market_source: 'Operational IT spend estimate',
    dir_coop_fy25: 820,
    dir_coop_fy26_ytd: 198,
    last_updated: 'May 2026',
    notes: 'DIR is the STS operator. Its own IT spend is primarily for statewide infrastructure it manages on behalf of state.',
  },
  {
    id: 'txcc',
    approved_budget: 135,
    budget_confirmed: true,
    sts_annual: 0,
    sts_source: 'New agency — STS participation TBD',
    open_market_est: 40,
    open_market_source: 'SOC build-out and tooling estimate',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 8,
    last_updated: 'May 2026',
    notes: 'New agency — full spend picture will emerge as it operationalizes through FY2026.',
  },
  {
    id: 'dps',
    approved_budget: 91.8,
    budget_confirmed: true,
    sts_annual: 18,
    sts_source: 'IAC with DIR — DCS and network services',
    open_market_est: 42,
    open_market_source: 'Comptroller USAS est. — law enforcement systems, biometrics',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 14,
    last_updated: 'May 2026',
    notes: 'Significant federal-funded IT spend (border security, law enforcement) not captured in state appropriations.',
  },
  {
    id: 'txdmv',
    approved_budget: 125,
    budget_confirmed: true,
    sts_annual: 8,
    sts_source: 'IAC with DIR — limited DCS participation',
    open_market_est: 28,
    open_market_source: 'Comptroller USAS est. — registration system vendors',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 22,
    last_updated: 'May 2026',
    notes: 'Most of FY26 budget dedicated to 30-yr registration/title system replacement.',
  },
  {
    id: 'dfps',
    approved_budget: 60,
    budget_confirmed: false,
    sts_annual: 12,
    sts_source: 'IAC with DIR — DCS participation',
    open_market_est: 18,
    open_market_source: 'Comptroller USAS est. — CCWIS vendors',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 9,
    last_updated: 'May 2026',
    notes: 'Federal cost share for CCWIS (~50%) not reflected in state appropriation figure.',
  },
  {
    id: 'twc',
    approved_budget: 50,
    budget_confirmed: false,
    sts_annual: 10,
    sts_source: 'IAC with DIR — DCS and MSS',
    open_market_est: 15,
    open_market_source: 'Comptroller USAS est.',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 7,
    last_updated: 'May 2026',
    notes: 'AI platform investments largely through DIR cooperative contracts.',
  },
  {
    id: 'tea',
    approved_budget: 80,
    budget_confirmed: false,
    sts_annual: 14,
    sts_source: 'IAC with DIR — DCS participation',
    open_market_est: 22,
    open_market_source: 'Comptroller USAS est.',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 11,
    last_updated: 'May 2026',
    notes: 'K-12 cybersecurity program spend flows through TEA budget to districts.',
  },
  {
    id: 'cpa',
    approved_budget: 55,
    budget_confirmed: false,
    sts_annual: 8,
    sts_source: 'IAC with DIR — DCS',
    open_market_est: 14,
    open_market_source: 'Comptroller USAS est.',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 6,
    last_updated: 'May 2026',
    notes: 'CAPPS steward — some IT costs are allocated statewide to other agencies.',
  },
  {
    id: 'tdcj',
    approved_budget: 45,
    budget_confirmed: false,
    sts_annual: 9,
    sts_source: 'IAC with DIR — DCS',
    open_market_est: 18,
    open_market_source: 'Comptroller USAS est. — facility tech, surveillance',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 5,
    last_updated: 'May 2026',
    notes: 'Facility technology and surveillance systems often procured through open market.',
  },
  {
    id: 'tpwd',
    approved_budget: 18,
    budget_confirmed: false,
    sts_annual: 3,
    sts_source: 'IAC with DIR — limited participation',
    open_market_est: 5,
    open_market_source: 'Comptroller USAS est.',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 2,
    last_updated: 'May 2026',
    notes: 'Former CIO George Rios led TPWD — strong DIR cooperative contract utilization.',
  },
  {
    id: 'twdb',
    approved_budget: 15,
    budget_confirmed: false,
    sts_annual: 7.7,
    sts_source: 'IAC with DIR — $7.74M FY24-25 biennium (board approved Aug 2023)',
    open_market_est: 3,
    open_market_source: 'Comptroller USAS est.',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 1.5,
    last_updated: 'May 2026',
    notes: 'STS contract amount confirmed from board meeting minutes Aug 2023.',
  },
  {
    id: 'trs',
    approved_budget: 15,
    budget_confirmed: false,
    sts_annual: 4,
    sts_source: 'IAC with DIR — DCS participation',
    open_market_est: 5,
    open_market_source: 'Comptroller USAS est.',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 2,
    last_updated: 'May 2026',
    notes: 'Pension system modernization largely through open market vendor contracts.',
  },
  {
    id: 'oca',
    approved_budget: 20,
    budget_confirmed: false,
    sts_annual: 2,
    sts_source: 'IAC with DIR — minimal DCS',
    open_market_est: 8,
    open_market_source: 'Comptroller USAS est. — court system vendors',
    dir_coop_fy25: null,
    dir_coop_fy26_ytd: 3,
    last_updated: 'May 2026',
    notes: 'HB500 funded appellate CMS ($11.9M) and specialty court system ($3.9M).',
  },
];

const FMT = (n, decimals = 1) => {
  if (n === null || n === undefined) return '—';
  if (n >= 1000) return `$${(n/1000).toFixed(decimals)}B`;
  if (n >= 1) return `$${n.toFixed(decimals)}M`;
  return `$${(n*1000).toFixed(0)}K`;
};

const PCT = (part, total) => total > 0 ? Math.min(Math.round((part / total) * 100), 100) : 0;

function SpendGauge({ budget, dirCoop, sts, openMarket }) {
  const total = (dirCoop || 0) + (sts || 0) + (openMarket || 0);
  const pct = PCT(total, budget);
  const segments = [
    { val: dirCoop || 0,   color: '#1E2761', label: 'DIR Coop' },
    { val: sts || 0,       color: '#378ADD', label: 'STS' },
    { val: openMarket || 0, color: '#8A93B2', label: 'Open Market' },
  ];
  let offset = 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#8A93B2' }}>Known spend vs budget</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: pct > 85 ? '#E24B4A' : pct > 60 ? '#C8A951' : '#27500A' }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 10, background: '#F4F6FB', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
        {segments.map((seg, i) => {
          const segPct = PCT(seg.val, budget);
          const el = (
            <div key={i} style={{
              width: `${segPct}%`, height: '100%',
              background: seg.color, transition: 'width 0.4s ease',
              minWidth: seg.val > 0 ? 2 : 0,
            }} />
          );
          return el;
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
        {segments.map(s => s.val > 0 && (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#8A93B2' }}>{s.label}: <strong style={{ color: '#1A1F3C' }}>{FMT(s.val)}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfidenceBadge({ level }) {
  const styles = {
    confirmed: { bg: '#EAF3DE', color: '#27500A', label: '✓ Confirmed' },
    estimated: { bg: '#FAEEDA', color: '#633806', label: '~ Estimated' },
    partial:   { bg: '#E6F1FB', color: '#0C447C', label: '◑ Partial' },
  };
  const s = styles[level] || styles.estimated;
  return (
    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: s.bg, color: s.color, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

export default function BudgetTracker() {
  const [sortBy, setSortBy] = useState('budget');
  const [filterCat, setFilterCat] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // cards | table

  // Merge budget data with agency metadata
  const merged = BUDGET_DATA.map(b => {
    const agency = AGENCIES.find(a => a.id === b.id);
    return { ...b, ...agency, ...b }; // budget data takes precedence
  }).filter(Boolean);

  const sorted = [...merged].sort((a, b) => {
    if (sortBy === 'budget') return (b.approved_budget || 0) - (a.approved_budget || 0);
    if (sortBy === 'spend') {
      const ta = (a.dir_coop_fy26_ytd || 0) + (a.sts_annual || 0) + (a.open_market_est || 0);
      const tb = (b.dir_coop_fy26_ytd || 0) + (b.sts_annual || 0) + (b.open_market_est || 0);
      return tb - ta;
    }
    if (sortBy === 'pct') {
      const pa = PCT((a.dir_coop_fy26_ytd||0)+(a.sts_annual||0)+(a.open_market_est||0), a.approved_budget||1);
      const pb = PCT((b.dir_coop_fy26_ytd||0)+(b.sts_annual||0)+(b.open_market_est||0), b.approved_budget||1);
      return pb - pa;
    }
    if (sortBy === 'name') return (a.name||'').localeCompare(b.name||'');
    return 0;
  }).filter(a => !filterCat || a.category === filterCat);

  // Summary totals
  const totals = merged.reduce((acc, a) => {
    acc.budget += a.approved_budget || 0;
    acc.dirCoop += a.dir_coop_fy26_ytd || 0;
    acc.sts += a.sts_annual || 0;
    acc.openMarket += a.open_market_est || 0;
    return acc;
  }, { budget: 0, dirCoop: 0, sts: 0, openMarket: 0 });
  const totalKnown = totals.dirCoop + totals.sts + totals.openMarket;

  const categories = [...new Set(AGENCIES.map(a => a.category))].sort();

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#141A47,#1E2761)', borderRadius: 16, padding: '24px', marginBottom: 20, border: '1px solid rgba(200,169,81,0.25)' }}>
        <h2 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 6 }}>
          Agency IT Budget vs Spend Tracker
        </h2>
        <p style={{ color: '#CADCFC', fontSize: 12, lineHeight: 1.6, maxWidth: 700, marginBottom: 20 }}>
          Tracks approved SB1 IT appropriations against known spend across three channels:
          DIR Cooperative Contracts (live), STS/Shared Technology Services (IAC billed to DIR),
          and Open Market IT purchases (Comptroller USAS object codes). Updated quarterly.
        </p>

        {/* Summary stats */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Approved IT Budget', val: FMT(totals.budget, 1), sub: 'SB1 89th Legislature', color: '#C8A951' },
            { label: 'DIR Coop Spend (FY26 YTD)', val: FMT(totals.dirCoop, 1), sub: 'Live · data.texas.gov', color: '#CADCFC' },
            { label: 'STS / Data Center', val: FMT(totals.sts, 1), sub: 'IAC estimates', color: '#CADCFC' },
            { label: 'Open Market IT (est.)', val: FMT(totals.openMarket, 1), sub: 'USAS obj. 7262/7275 est.', color: '#CADCFC' },
            { label: 'Total Known Spend', val: FMT(totalKnown, 1), sub: `${PCT(totalKnown, totals.budget)}% of budget`, color: '#C8A951' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(200,169,81,0.2)', borderRadius: 10, padding: '12px 16px', minWidth: 140 }}>
              <div style={{ color: s.color, fontSize: 20, fontWeight: 700, fontFamily: 'Georgia,serif' }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              <div style={{ color: '#8A93B2', fontSize: 10, marginTop: 1 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: '#FFFBF0', border: '1px solid rgba(200,169,81,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
        <p style={{ fontSize: 11.5, color: '#633806', lineHeight: 1.6, margin: 0 }}>
          <strong>Data confidence note:</strong> DIR Cooperative Contract spend is live from data.texas.gov.
          STS/Data Center figures are estimated from interagency contract (IAC) amounts — some confirmed from board minutes, most estimated from historical patterns.
          Open market figures are estimated from Comptroller USAS object code data — not real-time.
          Approved budgets are from SB1 89th Legislature GAA; estimated figures are extrapolated.
          <strong> Total spend shown is a floor, not a ceiling</strong> — actual IT spend is likely higher due to federal funds, emergency procurements, and interagency transfers not captured here.
          Update STS and open market figures quarterly in <code>src/data/agencies.js</code>.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '7px 12px', fontSize: 12, border: '1px solid rgba(30,39,97,0.15)', borderRadius: 8, background: '#FFFFFF', color: '#1A1F3C', outline: 'none', fontFamily: 'inherit' }}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { key: 'budget', label: 'Sort: Budget ↓' },
            { key: 'spend',  label: 'Sort: Known Spend ↓' },
            { key: 'pct',    label: 'Sort: % Used ↓' },
            { key: 'name',   label: 'Sort: Name' },
          ].map(s => (
            <button key={s.key} onClick={() => setSortBy(s.key)} style={{
              padding: '6px 12px', fontSize: 11, borderRadius: 8,
              border: '1px solid', fontFamily: 'inherit', cursor: 'pointer',
              borderColor: sortBy === s.key ? '#1E2761' : 'rgba(30,39,97,0.15)',
              background: sortBy === s.key ? '#1E2761' : '#FFFFFF',
              color: sortBy === s.key ? '#FFFFFF' : '#8A93B2',
              fontWeight: sortBy === s.key ? 600 : 400,
            }}>{s.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['cards','table'].map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{
              padding: '6px 12px', fontSize: 11, borderRadius: 8,
              border: '1px solid', fontFamily: 'inherit', cursor: 'pointer',
              borderColor: viewMode === m ? '#C8A951' : 'rgba(30,39,97,0.15)',
              background: viewMode === m ? 'rgba(200,169,81,0.1)' : '#FFFFFF',
              color: viewMode === m ? '#633806' : '#8A93B2',
            }}>{m === 'cards' ? '⊞ Cards' : '☰ Table'}</button>
          ))}
        </div>
      </div>

      {/* ── CARDS VIEW ── */}
      {viewMode === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
          {sorted.map(agency => {
            const knownSpend = (agency.dir_coop_fy26_ytd || 0) + (agency.sts_annual || 0) + (agency.open_market_est || 0);
            const pct = PCT(knownSpend, agency.approved_budget);
            const isExpanded = expandedId === agency.id;
            const statusColor = pct > 85 ? '#E24B4A' : pct > 60 ? '#C8A951' : '#27500A';

            return (
              <div key={agency.id} style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(30,39,97,0.1)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(30,39,97,0.05)', cursor: 'pointer' }}
                onClick={() => setExpandedId(isExpanded ? null : agency.id)}>

                {/* Card header */}
                <div style={{ background: '#1E2761', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 13 }}>{agency.name || agency.id.toUpperCase()}</div>
                    <div style={{ color: '#8A93B2', fontSize: 10, marginTop: 2 }}>{agency.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#C8A951', fontSize: 18, fontWeight: 700, fontFamily: 'Georgia,serif' }}>{FMT(agency.approved_budget)}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 3, justifyContent: 'flex-end' }}>
                      <ConfidenceBadge level={agency.budget_confirmed ? 'confirmed' : 'estimated'} />
                    </div>
                  </div>
                </div>

                {/* Gauge */}
                <div style={{ padding: '14px 16px' }}>
                  <SpendGauge
                    budget={agency.approved_budget}
                    dirCoop={agency.dir_coop_fy26_ytd}
                    sts={agency.sts_annual}
                    openMarket={agency.open_market_est}
                  />

                  {/* Quick stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
                    {[
                      { label: 'DIR Coop YTD', val: FMT(agency.dir_coop_fy26_ytd), sub: 'FY26 live', color: '#1E2761', confidence: 'confirmed' },
                      { label: 'STS / DCS', val: FMT(agency.sts_annual), sub: 'annual IAC', color: '#378ADD', confidence: agency.id === 'twdb' ? 'confirmed' : 'estimated' },
                      { label: 'Open Market', val: FMT(agency.open_market_est), sub: 'est. FY25', color: '#8A93B2', confidence: 'estimated' },
                    ].map(s => (
                      <div key={s.label} style={{ background: '#F4F6FB', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: s.color, fontFamily: 'monospace' }}>{s.val}</div>
                        <div style={{ fontSize: 10, color: '#1A1F3C', fontWeight: 500, marginTop: 1 }}>{s.label}</div>
                        <div style={{ marginTop: 2 }}><ConfidenceBadge level={s.confidence} /></div>
                      </div>
                    ))}
                  </div>

                  {/* Known vs budget summary */}
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#F4F6FB', borderRadius: 8 }}>
                    <span style={{ fontSize: 11, color: '#8A93B2' }}>Total known spend</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1E2761', fontFamily: 'monospace' }}>{FMT(knownSpend)}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: statusColor }}>{pct}% of budget</span>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid rgba(30,39,97,0.08)', padding: '14px 16px', background: '#FAFBFD' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#1E2761', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Data Sources</div>
                    {[
                      { label: 'DIR Cooperative (FY26 YTD)', val: FMT(agency.dir_coop_fy26_ytd), source: 'Live · data.texas.gov · w64c-ndf7 + a743-wj72', confidence: 'confirmed', color: '#1E2761' },
                      { label: 'DIR Cooperative (FY25 actual)', val: FMT(agency.dir_coop_fy25), source: 'Confirmed · TX Comptroller / Industry Insider TX', confidence: 'confirmed', color: '#1E2761' },
                      { label: 'STS / Data Center Services', val: FMT(agency.sts_annual), source: agency.sts_source, confidence: agency.id === 'twdb' ? 'confirmed' : 'estimated', color: '#378ADD' },
                      { label: 'Open Market IT', val: FMT(agency.open_market_est), source: agency.open_market_source, confidence: 'estimated', color: '#8A93B2' },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid rgba(30,39,97,0.06)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 500, color: '#1A1F3C' }}>{row.label}</div>
                          <div style={{ fontSize: 10, color: '#8A93B2', marginTop: 1, fontStyle: 'italic' }}>{row.source}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 10, flexShrink: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: row.color, fontFamily: 'monospace' }}>{row.val}</span>
                          <ConfidenceBadge level={row.confidence} />
                        </div>
                      </div>
                    ))}
                    {agency.notes && (
                      <div style={{ marginTop: 10, padding: '8px 10px', background: '#F0F4FF', borderRadius: 6, borderLeft: '3px solid #C8A951' }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#1E2761', marginBottom: 2 }}>Notes</div>
                        <div style={{ fontSize: 11, color: '#4A5280', lineHeight: 1.5 }}>{agency.notes}</div>
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: '#8A93B2', marginTop: 8, textAlign: 'right' }}>Last updated: {agency.last_updated}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(30,39,97,0.1)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(30,39,97,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#1E2761' }}>
                  {['Agency','Category','Approved Budget','DIR Coop YTD','STS / DCS','Open Market','Total Known','% of Budget'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(agency => {
                  const knownSpend = (agency.dir_coop_fy26_ytd || 0) + (agency.sts_annual || 0) + (agency.open_market_est || 0);
                  const pct = PCT(knownSpend, agency.approved_budget);
                  const statusColor = pct > 85 ? '#E24B4A' : pct > 60 ? '#C8A951' : '#27500A';
                  return (
                    <tr key={agency.id} style={{ borderBottom: '1px solid rgba(30,39,97,0.07)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8F9FD'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#1E2761', fontSize: 12 }}>{agency.abbr || agency.id.toUpperCase()}</div>
                        <div style={{ fontSize: 10, color: '#8A93B2' }}>{agency.name}</div>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 11, color: '#8A93B2' }}>{agency.category}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#C8A951', fontFamily: 'monospace' }}>{FMT(agency.approved_budget)}</div>
                        <ConfidenceBadge level={agency.budget_confirmed ? 'confirmed' : 'estimated'} />
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 600, color: '#1E2761', fontSize: 12 }}>{FMT(agency.dir_coop_fy26_ytd)}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#378ADD', fontSize: 12 }}>{FMT(agency.sts_annual)}</div>
                        <ConfidenceBadge level={agency.id === 'twdb' ? 'confirmed' : 'estimated'} />
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#8A93B2', fontSize: 12 }}>{FMT(agency.open_market_est)}</div>
                        <ConfidenceBadge level="estimated" />
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#1E2761', fontSize: 13 }}>{FMT(knownSpend)}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: '#F4F6FB', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: statusColor, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: statusColor, minWidth: 32 }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {/* Totals row */}
                <tr style={{ background: '#1E2761', borderTop: '2px solid rgba(200,169,81,0.4)' }}>
                  <td colSpan={2} style={{ padding: '10px 14px', color: '#C8A951', fontWeight: 700, fontSize: 12 }}>TOTALS ({sorted.length} agencies)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#C8A951', fontSize: 13 }}>{FMT(sorted.reduce((s,a)=>s+(a.approved_budget||0),0))}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#CADCFC', fontSize: 13 }}>{FMT(sorted.reduce((s,a)=>s+(a.dir_coop_fy26_ytd||0),0))}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#CADCFC', fontSize: 13 }}>{FMT(sorted.reduce((s,a)=>s+(a.sts_annual||0),0))}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#CADCFC', fontSize: 13 }}>{FMT(sorted.reduce((s,a)=>s+(a.open_market_est||0),0))}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#C8A951', fontSize: 13 }}>{FMT(sorted.reduce((s,a)=>s+(a.dir_coop_fy26_ytd||0)+(a.sts_annual||0)+(a.open_market_est||0),0))}</td>
                  <td style={{ padding: '10px 14px', color: '#C8A951', fontWeight: 700, fontSize: 12 }}>
                    {PCT(sorted.reduce((s,a)=>s+(a.dir_coop_fy26_ytd||0)+(a.sts_annual||0)+(a.open_market_est||0),0), sorted.reduce((s,a)=>s+(a.approved_budget||0),0))}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p style={{ fontSize: 11, color: '#8A93B2', marginTop: 12, lineHeight: 1.6 }}>
        <strong style={{ color: '#1E2761' }}>Sources:</strong> Approved budgets — SB1 89th Legislature GAA (2026-27 biennium).
        DIR Cooperative spend — live from data.texas.gov (datasets w64c-ndf7, a743-wj72).
        STS/Data Center — interagency contract amounts; TWDB confirmed from Aug 2023 board minutes; others estimated from historical patterns.
        Open market IT — estimated from TX Comptroller USAS object codes 7242, 7262, 7267, 7275, 7284, 7390.
        Update quarterly in <code>src/data/BudgetTracker.jsx</code> → BUDGET_DATA array.
        Last manual update: May 2026.
      </p>
    </div>
  );
}
