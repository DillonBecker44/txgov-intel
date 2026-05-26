import React, { useEffect } from 'react';
import { TECH_AREAS } from '../data/agencies';

// Per-agency, per-tech synopsis
const SYNOPSES = {
  "Health & Human Services Commission": {
    "Cybersecurity": "HHSC is investing in cybersecurity as part of its data center overhaul. As Texas's largest health IT spender at $899M in FY25, protecting Medicaid, CHIP, and TIERS systems is a top priority given the sensitivity of beneficiary data across millions of Texans.",
    "Modernization": "HHSC leads all Texas agencies in IT modernization with $1.1B in the 2026–27 biennium — one of the largest state health IT overhauls in the country, spanning Medicaid claims, eligibility, WIC EBT, and enterprise platforms.",
    "Case Management": "HHSC is redesigning eligibility and case management workflows through TIERS ($246M) to streamline benefits delivery across Medicaid, SNAP, and other social services programs.",
    "ERP / Financial": "HHSC is upgrading CAPPS as part of statewide financial system modernization, coordinating with the Comptroller's office on enterprise-wide improvements.",
    "Cloud": "HHSC is consolidating data centers and migrating workloads to cloud infrastructure through DIR's statewide technology center, reducing physical footprint and improving resilience.",
    "AI / Automation": "HHSC is exploring AI-assisted case management to improve eligibility determinations and reduce processing times — aligning with the state's 2026–2030 AI governance framework under TRAIGA.",
    "Infrastructure": "HHSC's data center consolidation is one of the largest infrastructure projects in Texas government, moving from fragmented facilities to a consolidated, modernized footprint.",
    "Legacy Replacement": "HHSC is dismantling decades-old MMIS and TIERS platforms. The Medicaid Management Information System modernization alone is a $474M multi-year effort."
  },
  "Department of Transportation": {
    "Legacy Replacement": "TxDOT is replacing aging mainframe systems with cloud-compatible platforms affecting core transportation management, asset tracking, and financial systems.",
    "Modernization": "TxDOT holds the second-largest IT capital budget at $167.4M. Modernization spans data center upgrades, enterprise information management, and an AI adoption roadmap aligned to TRAIGA.",
    "Cybersecurity": "TxDOT's cybersecurity investments protect transportation infrastructure, traffic management systems, and sensitive construction and contract data.",
    "AI / Automation": "TxDOT is ahead of peers in AI adoption — using AI for strategic decision-making, data processing, and workflow execution. The 2026 AI Strategic Plan update formalizes governance as AI shifts from experimental to foundational.",
    "Data & Analytics": "TxDOT is building enterprise information management capabilities to integrate data across districts, improve project delivery analytics, and support connected vehicle initiatives.",
    "Infrastructure": "TxDOT is upgrading data centers statewide and investing in connectivity infrastructure supporting real-time traffic management, tolling systems, and field operations."
  },
  "Department of Information Resources": {
    "Cybersecurity": "DIR is transitioning its cybersecurity function to the new Texas Cyber Command, a standalone agency funded at $135M. DIR retains governance and policy while TXCC handles operational defense.",
    "Cloud": "DIR operates the statewide technology center and manages cloud shared services — IaaS, PaaS, and managed cloud options — negotiating enterprise agreements that drive significant savings.",
    "Identity & Access": "DIR's 2026–2030 SSP identifies Secure Identity and Access Management as a top goal — enabling Texans to securely manage digital credentials across all state services.",
    "AI / Automation": "DIR published the Texas AI Code of Ethics and coordinates statewide AI governance under TRAIGA — providing agencies with frameworks, tools, and training for responsible AI deployment.",
    "Infrastructure": "DIR manages the statewide technology center, telecom network, and shared infrastructure serving 176+ state agencies.",
    "Digital / Portals": "DIR's 2026–2030 SSP prioritizes Digital Accessibility and Customer Experience — ensuring all Texans can access government services online regardless of ability or device."
  },
  "Texas Cyber Command": {
    "Cybersecurity": "TXCC is a brand-new agency funded at $135M via HB150, headquartered in San Antonio. It will serve as the centralized statewide cybersecurity authority, replacing operational functions previously held by DIR — protecting critical infrastructure and coordinating threat response across Texas.",
    "Infrastructure": "TXCC will build and operate security operations centers, threat intelligence platforms, and incident response infrastructure serving state agencies, local governments, and critical infrastructure operators."
  },
  "Department of Public Safety": {
    "Cybersecurity": "DPS's $91.8M IT capital includes significant cybersecurity investment — threat detection platforms, advanced analytics for criminal intelligence, and hardening of state law enforcement networks.",
    "Data & Analytics": "DPS is building real-time threat intelligence capabilities, integrating data from law enforcement, border security, and emergency management to support faster, better-informed decisions.",
    "Modernization": "DPS is modernizing its driver's license system and core IT platforms, replacing aging infrastructure with modern, scalable solutions that support digital ID and improved citizen service.",
    "AI / Automation": "DPS is deploying AI-driven threat detection and pattern analysis across criminal justice and border security operations, aligning with TRAIGA requirements.",
    "Legacy Replacement": "DPS is retiring legacy systems supporting driver licensing, criminal records, and law enforcement databases, replacing them with integrated, API-driven platforms."
  },
  "Department of Motor Vehicles": {
    "Legacy Replacement": "TxDMV is executing one of the most ambitious legacy replacement projects in Texas government — dismantling a 30-year-old registration and title ecosystem with 20+ applications using $125M in legislative funding.",
    "Modernization": "The TxDMV modernization re-architects the agency's entire data infrastructure, moving from siloed legacy systems to an integrated, cloud-native platform.",
    "Digital / Portals": "TxDMV is building portals allowing Texans to handle vehicle registration, title transfers, and dealer transactions fully online — reducing in-person visits.",
    "Data & Analytics": "New data infrastructure enables better analytics on vehicle registration patterns, fraud detection, and service demand."
  },
  "Dept of Family & Protective Services": {
    "Case Management": "DFPS is replacing its CCWIS — the backbone of child protective services case management. The replacement involves ~20 subprojects covering data quality, system integration, AI-assisted triage, and mobile worker tools.",
    "Modernization": "The DFPS modernization consolidates fragmented legacy systems into a modern, integrated foundation for child welfare services.",
    "AI / Automation": "DFPS is integrating AI into case management workflows to assist caseworkers with risk assessment and workload prioritization — with a required human-in-the-loop per SB1 Rider 15.",
    "Data & Analytics": "Improving data quality and integration is central to the CCWIS replacement, enabling better tracking of child welfare outcomes and service gaps.",
    "Legacy Replacement": "Current DFPS systems are outdated and fragmented. ~20 discrete replacement subprojects reduce implementation risk."
  },
  "Texas Workforce Commission": {
    "AI / Automation": "TWC is one of the most aggressive AI adopters in Texas government, deploying AI across 150+ operational areas including claims processing, fraud detection, civil rights case review, and legislative analysis.",
    "Call Center / CRM": "TWC is implementing a new CRM platform to unify customer interactions across unemployment, job placement, and employer services — incorporating AI-powered chat, live agent support, and workflow automation.",
    "Modernization": "TWC's modernization centers on digitizing paper-based processes, automating routine determinations, and building a unified customer service platform.",
    "Digital / Portals": "TWC is building digital-first service delivery so Texans can file unemployment claims and access job resources entirely online.",
    "Data & Analytics": "TWC leverages data analytics for labor market intelligence, fraud detection, and program performance measurement."
  },
  "Texas Education Agency": {
    "Cybersecurity": "TEA is a statewide K-12 cybersecurity leader — providing tools, training, and coordination for Texas school districts. Given that districts are frequent ransomware targets, TEA's investments protect student data for millions of Texas children.",
    "Data & Analytics": "TEA operates extensive student data systems supporting accountability, academic performance tracking, and federal reporting across all Texas public schools.",
    "Identity & Access": "TEA is modernizing CCIAM (Centralized Credentials and Identity Access Management) to provide secure, streamlined access to education platforms for students, teachers, and administrators statewide.",
    "Digital / Portals": "TEA is building digital learning platforms and educator portals supporting curriculum resources, professional development, and compliance reporting.",
    "Modernization": "TEA's modernization covers student information systems, assessment platforms, and administrative tools supporting its accountability mission."
  }
};

export default function AgencyModal({ agency, techLabel, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const def = TECH_AREAS.find(t => t.label === techLabel) || { color: '#E6F1FB', textColor: '#0C447C', borderColor: '#B5D4F4' };
  const synopsis = (SYNOPSES[agency.name] && SYNOPSES[agency.name][techLabel]) ||
    `${agency.name} is actively investing in ${techLabel} as part of its ${agency.category.toLowerCase()} technology strategy. Review the initiatives below for specific programs and budget details.`;

  // Match initiatives to tech keywords
  const relevantInits = agency.initiatives.filter(i =>
    i.toLowerCase().includes(techLabel.split(' ')[0].toLowerCase()) ||
    i.toLowerCase().includes(techLabel.split('/')[0].trim().toLowerCase())
  );
  const displayInits = relevantInits.length > 0 ? relevantInits : agency.initiatives.slice(0, 4);

  // Related legislative items
  const relatedSb1 = agency.sb1_items.filter(i =>
    i.description.toLowerCase().includes(techLabel.split(' ')[0].toLowerCase()) ||
    i.type.toLowerCase().includes('rider')
  );
  const relatedHb500 = agency.hb500_items.filter(i =>
    i.description.toLowerCase().includes(techLabel.split(' ')[0].toLowerCase())
  );

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(20,26,71,0.6)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, backdropFilter: 'blur(4px)'
      }}
    >
      <div style={{
        background: '#FFFFFF', borderRadius: 16, width: '100%', maxWidth: 620,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 80px rgba(20,26,71,0.35)',
        animation: 'slideUp 0.2s ease'
      }}>
        <style>{`@keyframes slideUp { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }`}</style>

        {/* Header */}
        <div style={{ background: '#1E2761', padding: '20px 24px 16px', borderRadius: '16px 16px 0 0', position: 'relative' }}>
          <div style={{ fontSize: 11, color: '#C8A951', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, fontWeight: 500 }}>
            {agency.name}
          </div>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#FFFFFF', fontWeight: 700, lineHeight: 1.2 }}>
            {techLabel} Initiative
          </div>
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.12)', border: 'none', color: '#FFFFFF',
            width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          {/* Tech tag */}
          <div style={{ marginBottom: 16 }}>
            <span style={{
              display: 'inline-block', fontSize: 11, padding: '4px 12px',
              borderRadius: 12, fontWeight: 500,
              background: def.color, color: def.textColor, border: `1px solid ${def.borderColor}`
            }}>{techLabel}</span>
          </div>

          {/* Synopsis */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, color: '#8A93B2', marginBottom: 6 }}>Synopsis</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, color: '#1A1F3C', margin: 0 }}>{synopsis}</p>
          </div>

          {/* Active initiatives */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, color: '#8A93B2', marginBottom: 8 }}>Active Initiatives</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {displayInits.map((init, i) => (
                <li key={i} style={{
                  fontSize: 13, lineHeight: 1.6, color: '#1A1F3C',
                  padding: '7px 0 7px 18px', position: 'relative',
                  borderBottom: i < displayInits.length - 1 ? '1px solid rgba(30,39,97,0.08)' : 'none'
                }}>
                  <span style={{ position: 'absolute', left: 0, top: 14, width: 7, height: 7, borderRadius: '50%', background: '#C8A951' }} />
                  {init}
                </li>
              ))}
            </ul>
          </div>

          {/* Strategic plan */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, color: '#8A93B2', marginBottom: 6 }}>Strategic Plan Focus</div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: '#4A5280', margin: 0 }}>{agency.strategic_plan}</p>
          </div>

          {/* Related legislative items */}
          {(relatedSb1.length > 0 || relatedHb500.length > 0) && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, color: '#8A93B2', marginBottom: 8 }}>Related Legislative Items</div>
              {relatedSb1.map((item, i) => (
                <div key={`sb1-${i}`} style={{ background: '#F4F8FE', borderRadius: 8, padding: '10px 12px', marginBottom: 8, borderLeft: '3px solid #378ADD' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: '#1E2761', marginBottom: 3 }}>{item.section} — SB1</div>
                  <p style={{ fontSize: 12, color: '#1A1F3C', lineHeight: 1.5, margin: 0 }}>{item.description}</p>
                </div>
              ))}
              {relatedHb500.map((item, i) => (
                <div key={`hb500-${i}`} style={{ background: '#F4FBF0', borderRadius: 8, padding: '10px 12px', marginBottom: 8, borderLeft: '3px solid #639922' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: '#27500A', marginBottom: 3 }}>{item.section} — HB500</div>
                  <p style={{ fontSize: 12, color: '#1A1F3C', lineHeight: 1.5, margin: 0 }}>{item.description}</p>
                  {item.amount && <div style={{ fontSize: 11, fontWeight: 600, color: '#27500A', marginTop: 5, fontFamily: 'monospace' }}>${item.amount >= 1000 ? `${(item.amount/1000).toFixed(1)}B` : `${item.amount}M`}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer chips */}
        <div style={{ padding: '12px 24px 20px', borderTop: '1px solid rgba(30,39,97,0.08)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {agency.fy25_spend && (
            <span style={{ fontSize: 11, color: '#8A93B2', background: '#F4F6FB', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(30,39,97,0.1)' }}>
              FY25 Spend: <strong style={{ color: '#1E2761' }}>${agency.fy25_spend}M</strong>
            </span>
          )}
          <span style={{ fontSize: 11, color: '#8A93B2', background: '#F4F6FB', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(30,39,97,0.1)' }}>
            FY26–27: <strong style={{ color: '#1E2761' }}>${agency.fy26_budget}M</strong>
          </span>
          <span style={{ fontSize: 11, color: '#8A93B2', background: '#F4F6FB', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(30,39,97,0.1)' }}>
            {agency.budget_confirmed ? '✓ Confirmed appropriation' : 'Est. budget'}
          </span>
        </div>
      </div>
    </div>
  );
}
