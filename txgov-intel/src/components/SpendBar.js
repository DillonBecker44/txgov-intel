import React from 'react';

export default function SpendBar({ value, max = 900 }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(30,39,97,0.1)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.min(pct, 100)}%`,
          background: 'linear-gradient(90deg, #1E2761, #378ADD)',
          borderRadius: 3,
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}
