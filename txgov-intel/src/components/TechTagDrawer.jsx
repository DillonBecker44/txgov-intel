import React, { useState, useEffect, useRef } from 'react';
import { TECH_AREAS } from '../data/agencies';

// Returns the style config for a given tag label
const tagStyle = (label) => {
  const t = TECH_AREAS.find(t => t.label === label);
  return t || { color:'#F1EFE8', textColor:'#444441', borderColor:'#D3D1C7' };
};

// TechTag — clickable pill that opens the detail drawer
export function TechTag({ tag, onClick }) {
  // tag can be a string (legacy) or {label, why, source, budget_note}
  const label  = typeof tag === 'string' ? tag : tag.label;
  const hasCtx = typeof tag === 'object' && tag.why;
  const s = tagStyle(label);
  return (
    <span
      onClick={hasCtx ? (e) => { e.stopPropagation(); onClick(tag); } : undefined}
      title={hasCtx ? 'Click for sourced details' : label}
      style={{
        display:'inline-flex', alignItems:'center', gap:4,
        background:s.color, color:s.textColor,
        border:`1px solid ${s.borderColor}`,
        borderRadius:20, padding:'3px 10px',
        fontSize:11, fontWeight:500,
        cursor:hasCtx ? 'pointer' : 'default',
        userSelect:'none', flexShrink:0,
        transition:'filter 0.12s',
      }}
      onMouseEnter={e => { if(hasCtx) e.currentTarget.style.filter='brightness(0.93)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter=''; }}
    >
      {label}
      {hasCtx && <span style={{opacity:0.55,fontSize:9}}>↗</span>}
    </span>
  );
}

// TagDrawer — slides up from bottom when a tag is clicked
export function TagDrawer({ tag, agency, onClose }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (tag) { setTimeout(() => setVisible(true), 10); }
    else { setVisible(false); }
  }, [tag]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    if (tag) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tag, onClose]);

  if (!tag || !agency) return null;

  const label       = typeof tag === 'string' ? tag : tag.label;
  const why         = tag.why || '';
  const source      = tag.source || '';
  const budget_note = tag.budget_note || '';
  const s           = tagStyle(label);

  // Filter sb1_items, hb500_items, exceptional_items relevant to this tag
  // Strategy: look for keyword overlap between item descriptions and tag label
  const TAG_KEYWORDS = {
    'Cybersecurity':      ['cyber','security','penetration','incident response','threat','TXCC','SOC','CJIS','PHI','privacy','breach','zero trust','hardening'],
    'Modernization':      ['modern','replac','upgrade','rebuild','overhaul','end-of-life','legacy','migration','phase','redesign','rewrite','ERP','platform','CCWIS','MMIS','TIERS','PEIMS'],
    'AI / Automation':    ['AI','artificial','automated','automation','machine learning','TRAIGA','bias','model','prediction','risk score'],
    'Legacy Replacement': ['legacy','replac','end-of-life','decommission','30-year','1990s','mainframe','IMPACT','30 year'],
    'Cloud':              ['cloud','STC','data center','consolidat','offsite','hybrid','Azure','AWS'],
    'Data & Analytics':   ['data','analytics','BI','reporting','dashboard','PEIMS','SLDS','transparency','EIM'],
    'ERP / Financial':    ['CAPPS','ERP','financial','payroll','accounting','pension','benefit','revenue'],
    'Digital / Portals':  ['portal','online','e-filing','eFile','website','mobile','self-service','digital'],
    'Infrastructure':     ['infrastructure','network','hardware','data center','facility','server','mainframe'],
    'Identity & Access':  ['identity','IAM','CCIAM','credential','access management','SSO','MFA'],
    'Case Management':    ['case','CMS','CCWIS','MMIS','TIERS','court','tracking','management system','workflow'],
    'Call Center / CRM':  ['CRM','call center','customer service','contact center','chat','routing'],
  };

  const keywords = (TAG_KEYWORDS[label] || [label.toLowerCase()]).map(k => k.toLowerCase());

  const matches = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return keywords.some(k => lower.includes(k));
  };

  const relatedSb1  = (agency.sb1_items  || []).filter(i => matches(i.description) || matches(i.section));
  const relatedHb500 = (agency.hb500_items || []).filter(i => matches(i.description));
  const relatedEI   = (agency.exceptional_items || []).filter(i => matches(i.title) || matches(i.description));

  const FMT = (n) => {
    if (!n) return null;
    if (n >= 1000) return `$${(n/1000).toFixed(2)}B`;
    if (n >= 1)    return `$${n.toFixed(1)}M`;
    return `$${(n*1000).toFixed(0)}K`;
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.35)',
      display:'flex', alignItems:'flex-end', justifyContent:'center',
      opacity:visible?1:0, transition:'opacity 0.2s',
      pointerEvents:tag?'all':'none',
    }}>
      <div ref={ref} style={{
        background:'#FFF', width:'100%', maxWidth:760,
        borderRadius:'16px 16px 0 0',
        boxShadow:'0 -8px 40px rgba(30,39,97,0.18)',
        transform:visible?'translateY(0)':'translateY(40px)',
        transition:'transform 0.25s cubic-bezier(.32,.72,0,1)',
        maxHeight:'80vh', display:'flex', flexDirection:'column',
        overflow:'hidden',
      }}>
        {/* Header */}
        <div style={{
          background:`linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
          borderBottom:`2px solid ${s.borderColor}`,
          padding:'16px 20px 14px',
          display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12,
          flexShrink:0,
        }}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:4}}>
              <span style={{
                background:s.borderColor, color:s.textColor,
                borderRadius:20, padding:'3px 12px',
                fontSize:12, fontWeight:700, letterSpacing:0.3,
              }}>{label}</span>
              <span style={{fontSize:13, color:s.textColor, fontWeight:600, opacity:0.8}}>
                {agency.abbr} — {agency.name}
              </span>
            </div>
            {budget_note && (
              <div style={{fontSize:11, color:s.textColor, opacity:0.7, fontStyle:'italic'}}>
                {budget_note}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            background:'none', border:'none', cursor:'pointer',
            fontSize:20, color:s.textColor, opacity:0.6, lineHeight:1,
            padding:'0 4px', flexShrink:0,
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{overflowY:'auto', padding:'16px 20px', flex:1}}>

          {/* Why this tag */}
          {why && (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'#1E2761',textTransform:'uppercase',letterSpacing:0.8,marginBottom:6}}>
                Why {label}?
              </div>
              <div style={{
                background:'#F8F9FD', borderLeft:`3px solid ${s.borderColor}`,
                borderRadius:'0 8px 8px 0', padding:'10px 14px',
                fontSize:13, lineHeight:1.7, color:'#1A1F3C',
              }}>
                {why}
              </div>
              {source && (
                <div style={{fontSize:11, color:'#8A93B2', marginTop:5, fontStyle:'italic'}}>
                  📎 {source}
                </div>
              )}
            </div>
          )}

          {/* Related SB1 items */}
          {relatedSb1.length > 0 && (
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:'#1E2761',textTransform:'uppercase',letterSpacing:0.8,marginBottom:6}}>
                SB1 Appropriations — {label}
              </div>
              {relatedSb1.map((item, i) => (
                <div key={i} style={{
                  background:'#EAF3DE', border:'1px solid #C0DD97',
                  borderRadius:8, padding:'9px 13px', marginBottom:6,
                  display:'flex', gap:10, alignItems:'flex-start',
                }}>
                  <div style={{flexShrink:0}}>
                    <div style={{fontSize:10,background:'#27500A',color:'#FFF',borderRadius:4,padding:'2px 7px',display:'inline-block',marginBottom:3}}>{item.type}</div>
                    <div style={{fontSize:11,color:'#27500A',fontWeight:600}}>{item.section}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:'#1A1F3C',lineHeight:1.5}}>{item.description}</div>
                    {item.amount && (
                      <div style={{fontSize:12,fontWeight:700,color:'#27500A',marginTop:3}}>
                        {FMT(item.amount)} — {item.fy}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Related HB500 items */}
          {relatedHb500.length > 0 && (
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:'#1E2761',textTransform:'uppercase',letterSpacing:0.8,marginBottom:6}}>
                HB500 Supplemental — {label}
              </div>
              {relatedHb500.map((item, i) => (
                <div key={i} style={{
                  background:'#FAEEDA', border:'1px solid #FAC775',
                  borderRadius:8, padding:'9px 13px', marginBottom:6,
                }}>
                  <div style={{fontSize:10,background:'#633806',color:'#FFF',borderRadius:4,padding:'2px 7px',display:'inline-block',marginBottom:3}}>{item.section}</div>
                  <div style={{fontSize:12,color:'#1A1F3C',lineHeight:1.5}}>{item.description}</div>
                  {item.amount && (
                    <div style={{fontSize:12,fontWeight:700,color:'#633806',marginTop:3}}>
                      {FMT(item.amount)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Related Exceptional Items */}
          {relatedEI.length > 0 && (
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:'#1E2761',textTransform:'uppercase',letterSpacing:0.8,marginBottom:6}}>
                Exceptional Items — {label}
              </div>
              {relatedEI.map((item, i) => (
                <div key={i} style={{
                  background:'#E6F1FB', border:'1px solid #B5D4F4',
                  borderRadius:8, padding:'9px 13px', marginBottom:6,
                  display:'flex', gap:10, alignItems:'flex-start',
                }}>
                  <div style={{flexShrink:0}}>
                    <div style={{fontSize:10,background:'#0C447C',color:'#FFF',borderRadius:4,padding:'2px 7px',display:'inline-block',marginBottom:3}}>EI #{item.item_num}</div>
                    <div style={{
                      fontSize:10, borderRadius:4, padding:'2px 7px', display:'inline-block', marginLeft:4,
                      background: item.status?.includes('Funded') ? '#E1F5EE' : '#FDE8E8',
                      color: item.status?.includes('Funded') ? '#085041' : '#8B1C1C',
                      border: `1px solid ${item.status?.includes('Funded') ? '#9FE1CB' : '#F5BCBC'}`,
                    }}>{item.status}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:'#0C447C',marginBottom:2}}>{item.title}</div>
                    <div style={{fontSize:12,color:'#1A1F3C',lineHeight:1.5}}>{item.description}</div>
                    {item.amount && (
                      <div style={{fontSize:12,fontWeight:700,color:'#0C447C',marginTop:3}}>{FMT(item.amount)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fallback if no related items found */}
          {!why && relatedSb1.length===0 && relatedHb500.length===0 && relatedEI.length===0 && (
            <div style={{color:'#8A93B2',fontSize:13,fontStyle:'italic',textAlign:'center',padding:'20px 0'}}>
              No specific appropriation details linked to this tag for {agency.abbr}.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop:'1px solid rgba(30,39,97,0.08)',
          padding:'10px 20px',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          background:'#F8F9FD', flexShrink:0,
        }}>
          <span style={{fontSize:11,color:'#8A93B2'}}>
            Source: SB1 89th Legislature · LBE by Strategy · CC Issue Dockets · Agency LAR FY2026-27
          </span>
          <button onClick={onClose} style={{
            background:'#1E2761', color:'#FFF', border:'none',
            borderRadius:8, padding:'6px 16px', fontSize:12,
            cursor:'pointer', fontFamily:'inherit',
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}
