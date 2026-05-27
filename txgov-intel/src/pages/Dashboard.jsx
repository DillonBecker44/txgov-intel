import React, { useState, useMemo } from 'react';
import { AGENCIES, TECH_AREAS, CATEGORIES, SUMMARY_STATS } from '../data/agencies';
import AgencyModal from '../components/AgencyModal';
import TechTag from '../components/TechTag';
import SpendBar from '../components/SpendBar';
import LiveSpend from '../components/LiveSpend';
import Chatbot from '../components/Chatbot';

const NAV_TABS = ['Overview', 'Agency Table', 'SB1 & HB500', 'Live Spend', 'Contract AI'];

export default function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('Agency Table');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [activeTech, setActiveTech] = useState(new Set());
  const [sortCol, setSortCol] = useState('fy25_spend');
  const [sortDir, setSortDir] = useState(-1);
  const [modal, setModal] = useState(null); // {agency, techLabel}
  const [legFilter, setLegFilter] = useState('all'); // all | sb1 | hb500 | exceptional

  const toggleTech = (label) => {
    setActiveTech(prev => {
      const n = new Set(prev);
      n.has(label) ? n.delete(label) : n.add(label);
      return n;
    });
  };

  const filtered = useMemo(() => {
    let rows = [...AGENCIES];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.abbr.toLowerCase().includes(q) ||
        r.initiatives.some(i => i.toLowerCase().includes(q)) ||
        r.strategic_plan.toLowerCase().includes(q) ||
        r.tech_areas.some(t => t.toLowerCase().includes(q))
      );
    }
    if (catFilter) rows = rows.filter(r => r.category === catFilter);
    if (activeTech.size) {
      rows = rows.filter(r => r.tech_areas.some(t => activeTech.has(t)));
    }
    rows.sort((a, b) => {
      let av = a[sortCol] ?? -1;
      let bv = b[sortCol] ?? -1;
      if (typeof av === 'string') return sortDir * av.localeCompare(bv);
      return sortDir * (av - bv);
    });
    return rows;
  }, [search, catFilter, activeTech, sortCol, sortDir]);

  const legFiltered = useMemo(() => {
    return AGENCIES.filter(a => {
      if (legFilter === 'sb1') return a.sb1_items.length > 0;
      if (legFilter === 'hb500') return a.hb500_items.length > 0;
      if (legFilter === 'exceptional') return a.exceptional_items.length > 0;
      return true;
    });
  }, [legFilter]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d * -1);
    else { setSortCol(col); setSortDir(-1); }
  };

  const totalHb500 = AGENCIES.reduce((sum, a) =>
    sum + a.hb500_items.reduce((s, i) => s + (i.amount || 0), 0), 0);
  const totalExceptional = AGENCIES.reduce((sum, a) =>
    sum + a.exceptional_items.reduce((s, i) => s + (i.amount || 0), 0), 0);

  return (
    <div style={{ minHeight:'100vh', background:'#F4F6FB', fontFamily:"'DM Sans', -apple-system, sans-serif" }}>
      {/* Header */}
      <header style={{
        background:'#1E2761', borderBottom:'3px solid #C8A951',
        position:'sticky', top:0, zIndex:100
      }}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:60, gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                width:36, height:36, background:'#C8A951', borderRadius:6,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:20, fontWeight:700, color:'#1E2761', fontFamily:'Georgia, serif', flexShrink:0
              }}>S</div>
              <div>
                <div style={{ color:'#FFFFFF', fontSize:13, fontWeight:500, lineHeight:1.2 }}>Signature Advisory Partners</div>
                <div style={{ color:'#C8A951', fontSize:10, letterSpacing:1, textTransform:'uppercase' }}>Texas IT Intelligence</div>
              </div>
            </div>
            <nav style={{ display:'flex', gap:4 }}>
              {NAV_TABS.map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding:'6px 14px', borderRadius:6, border:'none', cursor:'pointer', fontSize:12,
                  background: tab === t ? 'rgba(200,169,81,0.2)' : 'transparent',
                  color: tab === t ? '#C8A951' : 'rgba(255,255,255,0.65)',
                  fontWeight: tab === t ? 600 : 400, fontFamily:'inherit', transition:'all 0.15s'
                }}>{t}</button>
              ))}
            </nav>
            <button onClick={onLogout} style={{
              padding:'6px 14px', borderRadius:6, border:'1px solid rgba(255,255,255,0.2)',
              background:'transparent', color:'rgba(255,255,255,0.6)', fontSize:11,
              cursor:'pointer', fontFamily:'inherit'
            }}>Sign out</button>
          </div>
        </div>
      </header>

      {/* Tab: Overview */}
      {tab === 'Overview' && (
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'28px 24px' }}>
          {/* Hero stats */}
          <div style={{
            background:'linear-gradient(135deg, #141A47 0%, #1E2761 60%, #2A3570 100%)',
            borderRadius:16, padding:'32px', marginBottom:24,
            border:'1px solid rgba(200,169,81,0.2)'
          }}>
            <h1 style={{ color:'#FFFFFF', fontSize:26, fontWeight:700, fontFamily:'Georgia,serif', marginBottom:6 }}>
              Texas State Agency IT Landscape
            </h1>
            <p style={{ color:'#CADCFC', fontSize:13, maxWidth:660, lineHeight:1.6, marginBottom:24 }}>
              Comprehensive IT budget intelligence, SB1 appropriations, HB500 supplemental funding, exceptional items,
              and strategic initiatives across {SUMMARY_STATS.total_agencies}+ Texas state agencies. Data current as of {SUMMARY_STATS.data_updated}.
            </p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {[
                { val:`$${(SUMMARY_STATS.total_fy25_spend/1000).toFixed(1)}B`, lbl:'Total FY25 IT Spend' },
                { val:'$1.1B+', lbl:'HHSC IT Capital (Largest)' },
                { val:`${SUMMARY_STATS.total_agencies}`, lbl:'Agencies Tracked' },
                { val:`$${SUMMARY_STATS.txcc_new}M`, lbl:'Texas Cyber Command (New)' },
                { val:`${SUMMARY_STATS.sb1_it_items}`, lbl:'SB1 IT Riders & Provisions' },
                { val:`${SUMMARY_STATS.hb500_it_sections}`, lbl:'HB500 IT Sections' },
              ].map(s => (
                <div key={s.lbl} style={{
                  background:'rgba(255,255,255,0.07)', border:'1px solid rgba(200,169,81,0.3)',
                  borderRadius:10, padding:'14px 18px', minWidth:130
                }}>
                  <div style={{ color:'#C8A951', fontSize:22, fontWeight:700, fontFamily:'Georgia,serif' }}>{s.val}</div>
                  <div style={{ color:'#CADCFC', fontSize:11, marginTop:2, lineHeight:1.3 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top spenders */}
          <h2 style={{ fontSize:16, fontWeight:600, color:'#1E2761', marginBottom:14 }}>Top Agency IT Spenders — FY25</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12, marginBottom:28 }}>
            {AGENCIES.filter(a => a.fy25_spend).sort((a,b) => b.fy25_spend - a.fy25_spend).map(a => (
              <div key={a.id} style={{
                background:'#FFFFFF', borderRadius:12, padding:'16px',
                border:'1px solid rgba(30,39,97,0.1)', boxShadow:'0 2px 8px rgba(30,39,97,0.06)'
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#1E2761' }}>{a.abbr}</div>
                    <div style={{ fontSize:11, color:'#8A93B2' }}>{a.category}</div>
                  </div>
                  <div style={{ fontSize:20, fontWeight:700, color:'#C8A951', fontFamily:'Georgia,serif' }}>
                    ${a.fy25_spend}M
                  </div>
                </div>
                <SpendBar value={a.fy25_spend} max={900} />
              </div>
            ))}
          </div>

          {/* Source note */}
          <div style={{
            background:'#FFFFFF', borderRadius:10, padding:'14px 16px',
            border:'1px solid rgba(30,39,97,0.1)', fontSize:11, color:'#8A93B2', lineHeight:1.6
          }}>
            <strong style={{ color:'#1E2761' }}>Sources:</strong> Texas Comptroller Payments to Payee dashboard (FY25 actuals);
            SB1 89th Legislature General Appropriations Act (2026-27 Biennium);
            HB500 Supplemental Appropriations (enacted June 22, 2025);
            DIR FY2025-2029 Agency Strategic Plan; LBB Fiscal Size-Up 2026-27; Industry Insider Texas.
            Est. budgets are extrapolated using DIR IT spending methodology — treat as directional.
          </div>
        </div>
      )}

      {/* Tab: Agency Table */}
      {tab === 'Agency Table' && (
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'24px' }}>
          {/* Controls */}
          <div style={{
            background:'#FFFFFF', borderRadius:12, padding:'16px',
            border:'1px solid rgba(30,39,97,0.1)', marginBottom:16,
            position:'sticky', top:63, zIndex:80, boxShadow:'0 2px 8px rgba(30,39,97,0.06)'
          }}>
            <div style={{ display:'flex', gap:10, marginBottom:12, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:220, position:'relative' }}>
                <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#8A93B2', fontSize:14 }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search agencies, initiatives, keywords…"
                  style={{
                    width:'100%', padding:'8px 12px 8px 32px', fontSize:13,
                    border:'1px solid rgba(30,39,97,0.15)', borderRadius:8,
                    background:'#F4F6FB', color:'#1A1F3C', outline:'none',
                    fontFamily:'inherit', boxSizing:'border-box'
                  }} />
              </div>
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                style={{
                  padding:'8px 12px', fontSize:13, border:'1px solid rgba(30,39,97,0.15)',
                  borderRadius:8, background:'#F4F6FB', color:'#1A1F3C',
                  outline:'none', cursor:'pointer', fontFamily:'inherit'
                }}>
                <option value="">All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ fontSize:11, fontWeight:500, color:'#8A93B2', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>
              Filter by technology area — click a tag for agency synopsis
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {TECH_AREAS.map(t => (
                <button key={t.label} onClick={() => toggleTech(t.label)} style={{
                  padding:'4px 12px', borderRadius:20, border:'1px solid',
                  borderColor: activeTech.has(t.label) ? '#1E2761' : 'rgba(30,39,97,0.15)',
                  background: activeTech.has(t.label) ? '#1E2761' : '#F4F6FB',
                  color: activeTech.has(t.label) ? '#FFFFFF' : '#8A93B2',
                  fontSize:11, cursor:'pointer', fontFamily:'inherit', fontWeight: activeTech.has(t.label) ? 500 : 400,
                  transition:'all 0.15s'
                }}>{t.label}</button>
              ))}
              {activeTech.size > 0 && (
                <button onClick={() => setActiveTech(new Set())} style={{
                  padding:'4px 12px', borderRadius:20, border:'1px solid rgba(200,169,81,0.4)',
                  background:'rgba(200,169,81,0.05)', color:'#C8A951',
                  fontSize:11, cursor:'pointer', fontFamily:'inherit'
                }}>Clear all</button>
              )}
            </div>
            <div style={{ fontSize:11, color:'#8A93B2', marginTop:8 }}>
              Showing <strong style={{ color:'#1E2761' }}>{filtered.length}</strong> of {AGENCIES.length} agencies
            </div>
          </div>

          {/* Table */}
          <div style={{ background:'#FFFFFF', borderRadius:12, border:'1px solid rgba(30,39,97,0.1)', overflow:'hidden', boxShadow:'0 2px 8px rgba(30,39,97,0.06)' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
                <colgroup>
                  <col style={{ width:'17%' }} />
                  <col style={{ width:'9%' }} />
                  <col style={{ width:'9%' }} />
                  <col style={{ width:'24%' }} />
                  <col style={{ width:'41%' }} />
                </colgroup>
                <thead>
                  <tr>
                    {[
                      { key:'name', label:'Agency' },
                      { key:'fy25_spend', label:'FY25 Spend' },
                      { key:'fy26_budget', label:'FY26–27 Budget' },
                      { key:'_init', label:'Key Initiatives' },
                      { key:'_tech', label:'Technology Areas — click tag for details' },
                    ].map(col => (
                      <th key={col.key} onClick={() => handleSort(col.key)}
                        style={{
                          background:'#1E2761', color: sortCol === col.key ? '#C8A951' : 'rgba(255,255,255,0.7)',
                          padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:500,
                          letterSpacing:0.5, textTransform:'uppercase', cursor:'pointer',
                          userSelect:'none', whiteSpace:'nowrap', borderRight:'1px solid rgba(255,255,255,0.06)'
                        }}>
                        {col.label} {sortCol === col.key ? (sortDir > 0 ? '↑' : '↓') : '↕'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign:'center', padding:40, color:'#8A93B2', fontSize:14 }}>
                      No agencies match — try different keywords or clear filters.
                    </td></tr>
                  ) : filtered.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom:'1px solid rgba(30,39,97,0.08)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8F9FD'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding:'11px 14px', verticalAlign:'top' }}>
                        <div style={{ fontWeight:600, fontSize:13, color:'#1E2761', lineHeight:1.3 }}>
                          {a.name}
                        </div>
                        <div style={{ fontSize:10.5, color:'#8A93B2', marginTop:2 }}>{a.category}</div>
                        {(a.sb1_items.length > 0 || a.hb500_items.length > 0) && (
                          <div style={{ marginTop:5, display:'flex', gap:4, flexWrap:'wrap' }}>
                            {a.sb1_items.length > 0 && (
                              <span style={{ fontSize:9, padding:'2px 6px', borderRadius:4, background:'#E6F1FB', color:'#0C447C', fontWeight:600 }}>
                                SB1 ({a.sb1_items.length})
                              </span>
                            )}
                            {a.hb500_items.length > 0 && (
                              <span style={{ fontSize:9, padding:'2px 6px', borderRadius:4, background:'#EAF3DE', color:'#27500A', fontWeight:600 }}>
                                HB500 ({a.hb500_items.length})
                              </span>
                            )}
                            {a.exceptional_items.length > 0 && (
                              <span style={{ fontSize:9, padding:'2px 6px', borderRadius:4, background:'#FAEEDA', color:'#633806', fontWeight:600 }}>
                                {a.exceptional_items.length} Exc. Items
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td style={{ padding:'11px 14px', verticalAlign:'top' }}>
                        {a.fy25_spend ? (
                          <>
                            <SpendBar value={a.fy25_spend} max={900} />
                            <div style={{ fontSize:11, color:'#1A1F3C', fontFamily:'monospace', marginTop:3 }}>${a.fy25_spend}M</div>
                          </>
                        ) : <span style={{ fontSize:11, color:'#8A93B2' }}>N/A</span>}
                      </td>
                      <td style={{ padding:'11px 14px', verticalAlign:'top' }}>
                        <div style={{ fontSize:12, fontWeight:600, color:'#1E2761', fontFamily:'monospace' }}>
                          ${a.fy26_budget}M
                        </div>
                        <div style={{ fontSize:10, color:'#8A93B2', marginTop:2 }}>
                          {a.budget_confirmed ? '✓ Confirmed' : 'Est.'}
                        </div>
                      </td>
                      <td style={{ padding:'11px 14px', verticalAlign:'top' }}>
                        <ul style={{ margin:0, padding:0, listStyle:'none' }}>
                          {a.initiatives.slice(0,3).map((init, j) => (
                            <li key={j} style={{ fontSize:11.5, color:'#1A1F3C', lineHeight:1.5, paddingBottom:3, paddingLeft:10, position:'relative' }}>
                              <span style={{ position:'absolute', left:0, top:6, width:5, height:5, borderRadius:'50%', background:'#C8A951', display:'inline-block' }} />
                              {init}
                            </li>
                          ))}
                          {a.initiatives.length > 3 && (
                            <li style={{ fontSize:10.5, color:'#8A93B2', paddingLeft:10 }}>+{a.initiatives.length - 3} more</li>
                          )}
                        </ul>
                      </td>
                      <td style={{ padding:'11px 14px', verticalAlign:'top' }}>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                          {a.tech_areas.map(t => (
                            <TechTag key={t} label={t} active={activeTech.has(t)}
                              onClick={() => setModal({ agency: a, techLabel: t })} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p style={{ fontSize:11, color:'#8A93B2', marginTop:10, lineHeight:1.6 }}>
            <strong style={{ color:'#1E2761' }}>Sources:</strong> TX Comptroller FY25 actuals; SB1 89th Legislature GAA; HB500 (enacted June 22, 2025); DIR Agency Strategic Plan; LBB. Est. figures are directional.
          </p>
        </div>
      )}

      {/* Tab: SB1 & HB500 */}
      {tab === 'SB1 & HB500' && (
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'24px' }}>
          {/* Summary cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12, marginBottom:24 }}>
            {[
              { label:'SB1 — 89th Legislature', sub:'General Appropriations Act 2026-27', color:'#E6F1FB', tc:'#0C447C' },
              { label:'HB500 — Supplemental', sub:'Enacted June 22, 2025', color:'#EAF3DE', tc:'#27500A' },
              { label:`$${(totalHb500/1000).toFixed(1)}B`, sub:'HB500 IT-related appropriations', color:'#FAEEDA', tc:'#633806' },
              { label:`${AGENCIES.reduce((s,a)=>s+a.exceptional_items.length,0)}`, sub:'Exceptional items tracked', color:'#EEEDFE', tc:'#3C3489' },
            ].map(c => (
              <div key={c.label} style={{
                background:c.color, borderRadius:12, padding:'16px 18px',
                border:`1px solid ${c.color}`
              }}>
                <div style={{ fontSize:20, fontWeight:700, color:c.tc, fontFamily:'Georgia,serif' }}>{c.label}</div>
                <div style={{ fontSize:11, color:c.tc, opacity:0.8, marginTop:4 }}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            {[
              { key:'all', label:'All Agencies' },
              { key:'sb1', label:'Has SB1 Items' },
              { key:'hb500', label:'Has HB500 Items' },
              { key:'exceptional', label:'Has Exceptional Items' },
            ].map(f => (
              <button key={f.key} onClick={() => setLegFilter(f.key)} style={{
                padding:'6px 14px', borderRadius:20, border:'1px solid',
                borderColor: legFilter === f.key ? '#1E2761' : 'rgba(30,39,97,0.15)',
                background: legFilter === f.key ? '#1E2761' : '#FFFFFF',
                color: legFilter === f.key ? '#FFFFFF' : '#8A93B2',
                fontSize:12, cursor:'pointer', fontFamily:'inherit', fontWeight: legFilter === f.key ? 500 : 400
              }}>{f.label}</button>
            ))}
          </div>

          {/* Agency cards */}
          {legFiltered.map(agency => (
            <div key={agency.id} style={{
              background:'#FFFFFF', borderRadius:12, border:'1px solid rgba(30,39,97,0.1)',
              marginBottom:16, overflow:'hidden', boxShadow:'0 2px 8px rgba(30,39,97,0.05)'
            }}>
              {/* Agency header */}
              <div style={{ background:'#1E2761', padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                <div>
                  <span style={{ color:'#FFFFFF', fontWeight:600, fontSize:14 }}>{agency.name}</span>
                  <span style={{ color:'#8A93B2', fontSize:11, marginLeft:10 }}>{agency.category}</span>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  {agency.fy26_budget && (
                    <span style={{ fontSize:12, color:'#C8A951', fontFamily:'monospace', fontWeight:600 }}>
                      ${agency.fy26_budget}M FY26-27
                    </span>
                  )}
                  <span style={{ fontSize:10, color:agency.budget_confirmed ? '#9FE1CB' : '#FAC775', padding:'2px 8px', borderRadius:4, background:'rgba(255,255,255,0.1)' }}>
                    {agency.budget_confirmed ? 'Confirmed' : 'Estimated'}
                  </span>
                </div>
              </div>

              <div style={{ padding:'16px 20px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
                  {/* SB1 Items */}
                  {agency.sb1_items.length > 0 && (
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:'#0C447C', textTransform:'uppercase', letterSpacing:0.8, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ width:8, height:8, borderRadius:2, background:'#0C447C', display:'inline-block' }} />
                        SB1 — General Appropriations Act
                      </div>
                      {agency.sb1_items.map((item, i) => (
                        <div key={i} style={{
                          background:'#F4F8FE', borderRadius:8, padding:'10px 12px',
                          marginBottom:8, borderLeft:'3px solid #378ADD'
                        }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                            <span style={{ fontSize:10.5, fontWeight:600, color:'#1E2761' }}>{item.section}</span>
                            <span style={{ fontSize:10, color:'#8A93B2', background:'#E6F1FB', padding:'1px 6px', borderRadius:4 }}>{item.type}</span>
                          </div>
                          <p style={{ fontSize:12, color:'#1A1F3C', lineHeight:1.5, margin:0 }}>{item.description}</p>
                          {item.amount && (
                            <div style={{ fontSize:11, fontWeight:600, color:'#1E2761', marginTop:6, fontFamily:'monospace' }}>
                              ${item.amount >= 1000 ? `${(item.amount/1000).toFixed(1)}B` : `${item.amount}M`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* HB500 Items */}
                  {agency.hb500_items.length > 0 && (
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:'#27500A', textTransform:'uppercase', letterSpacing:0.8, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ width:8, height:8, borderRadius:2, background:'#27500A', display:'inline-block' }} />
                        HB500 — Supplemental Appropriations
                      </div>
                      {agency.hb500_items.map((item, i) => (
                        <div key={i} style={{
                          background:'#F4FBF0', borderRadius:8, padding:'10px 12px',
                          marginBottom:8, borderLeft:'3px solid #639922'
                        }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                            <span style={{ fontSize:10.5, fontWeight:600, color:'#1E2761' }}>{item.section}</span>
                            <span style={{ fontSize:10, color:'#8A93B2', background:'#EAF3DE', padding:'1px 6px', borderRadius:4 }}>{item.type}</span>
                          </div>
                          <p style={{ fontSize:12, color:'#1A1F3C', lineHeight:1.5, margin:0 }}>{item.description}</p>
                          {item.amount && (
                            <div style={{ fontSize:11, fontWeight:600, color:'#27500A', marginTop:6, fontFamily:'monospace' }}>
                              ${item.amount >= 1000 ? `${(item.amount/1000).toFixed(1)}B` : `${item.amount}M`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Exceptional Items */}
                  {agency.exceptional_items.length > 0 && (
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:'#633806', textTransform:'uppercase', letterSpacing:0.8, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ width:8, height:8, borderRadius:2, background:'#C8A951', display:'inline-block' }} />
                        Exceptional Items
                      </div>
                      {agency.exceptional_items.map((item, i) => (
                        <div key={i} style={{
                          background:'#FFFBF0', borderRadius:8, padding:'10px 12px',
                          marginBottom:8, borderLeft:'3px solid #C8A951'
                        }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                            <span style={{ fontSize:10.5, fontWeight:600, color:'#1E2761' }}>Item #{item.item_num}</span>
                            <span style={{ fontSize:10, padding:'1px 6px', borderRadius:4,
                              background: item.status.includes('Fully') ? '#EAF3DE' : item.status.includes('HB500') ? '#E6F1FB' : '#FFF3CD',
                              color: item.status.includes('Fully') ? '#27500A' : item.status.includes('HB500') ? '#0C447C' : '#633806'
                            }}>{item.status}</span>
                          </div>
                          <div style={{ fontSize:12, fontWeight:600, color:'#1A1F3C', marginBottom:3 }}>{item.title}</div>
                          <p style={{ fontSize:11.5, color:'#4A5280', lineHeight:1.5, margin:0 }}>{item.description}</p>
                          {item.amount && (
                            <div style={{ fontSize:11, fontWeight:600, color:'#C8A951', marginTop:6, fontFamily:'monospace' }}>
                              ${item.amount >= 1000 ? `${(item.amount/1000).toFixed(1)}B` : `${item.amount}M`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Live Spend */}
      {tab === 'Live Spend' && <LiveSpend />}

      {/* Tab: Contract AI */}
      {tab === 'Contract AI' && <Chatbot />}

      {/* Agency Modal */}
      {modal && (
        <AgencyModal agency={modal.agency} techLabel={modal.techLabel} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
