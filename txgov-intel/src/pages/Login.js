import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = onLogin(pw);
      if (!ok) { setError('Incorrect password. Please try again.'); setLoading(false); }
    }, 400);
  };

  return (
    <div style={{
      minHeight:'100vh', background:'#141A47',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'DM Sans', -apple-system, sans-serif", padding:'20px'
    }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{
            width:56, height:56, background:'#C8A951', borderRadius:10,
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            fontSize:32, fontWeight:700, color:'#141A47',
            fontFamily:"Georgia, serif", marginBottom:16
          }}>S</div>
          <div style={{ color:'#FFFFFF', fontSize:18, fontWeight:500, letterSpacing:0.3 }}>
            Signature Advisory Partners
          </div>
          <div style={{ color:'#C8A951', fontSize:11, letterSpacing:2, textTransform:'uppercase', marginTop:4 }}>
            Your Procurement Resource
          </div>
        </div>

        {/* Card */}
        <div style={{
          background:'rgba(255,255,255,0.05)', borderRadius:16,
          border:'1px solid rgba(200,169,81,0.25)', padding:'36px 32px'
        }}>
          <h2 style={{ color:'#FFFFFF', fontSize:20, fontWeight:600, marginBottom:6, textAlign:'center' }}>
            Texas IT Intelligence
          </h2>
          <p style={{ color:'#8A93B2', fontSize:13, textAlign:'center', marginBottom:28 }}>
            Enter your access password to continue
          </p>

          <form onSubmit={submit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, color:'#8A93B2', marginBottom:6, letterSpacing:0.5 }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                placeholder="Enter password"
                autoFocus
                style={{
                  width:'100%', padding:'12px 14px',
                  background:'rgba(255,255,255,0.08)',
                  border: error ? '1px solid #E24B4A' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius:8, color:'#FFFFFF', fontSize:14,
                  fontFamily:"inherit", outline:'none', boxSizing:'border-box'
                }}
              />
              {error && (
                <div style={{ color:'#E24B4A', fontSize:12, marginTop:6 }}>{error}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !pw}
              style={{
                width:'100%', padding:'13px',
                background: loading || !pw ? 'rgba(200,169,81,0.4)' : '#C8A951',
                border:'none', borderRadius:8,
                color:'#141A47', fontSize:14, fontWeight:600,
                cursor: loading || !pw ? 'not-allowed' : 'pointer',
                fontFamily:'inherit', transition:'background 0.2s'
              }}
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', color:'#4A5280', fontSize:11, marginTop:24 }}>
          © 2026 Signature Advisory Partners LLC · Confidential
        </p>
      </div>
    </div>
  );
}
