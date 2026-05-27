import React from 'react';
import { TECH_AREAS } from '../data/agencies';

export default function TechTag({ label, active, onClick }) {
  const def = TECH_AREAS.find(t => t.label === label) || { color: '#F1EFE8', textColor: '#444441', borderColor: '#D3D1C7' };
  return (
    <span
      onClick={onClick}
      title={`Click for ${label} details`}
      style={{
        display: 'inline-block',
        fontSize: 10,
        padding: '3px 8px',
        borderRadius: 12,
        margin: '1px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        background: def.color,
        color: def.textColor,
        border: `1px solid ${active ? def.textColor : def.borderColor}`,
        outline: active ? `2px solid ${def.textColor}` : 'none',
        outlineOffset: 1,
        transition: 'all 0.12s',
        fontWeight: 400,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {label}
    </span>
  );
}
