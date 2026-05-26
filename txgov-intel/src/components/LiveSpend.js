import React, { useState, useEffect } from 'react';

const AGENCIES_OF_INTEREST = [
  { name: 'Health and Human Services Commission', abbr: 'HHSC' },
  { name: 'Department of Information Resources', abbr: 'DIR' },
  { name: 'Department of Transportation', abbr: 'TxDOT' },
  { name: 'Department of Public Safety', abbr: 'DPS' },
  { name: 'Texas Education Agency', abbr: 'TEA' },
  { name: 'Department of Motor Vehicles', abbr: 'TxDMV' },
];

// Texas Open Data Portal — Comptroller Contract/Expenditure API
// Dataset: Texas Comptroller Payments to Payee (vendor payments)
const TXOD_BASE = 'https://data.texas.gov/resource';
const CONTRACTS_DS = 'ryi3-x5np'; // DIR cooperative contracts
const PAYMENTS_DS  = 'ijrd-svbj'; // Agency expenditures

export default function LiveSpend() {
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch DIR cooperative contract activity
      const contractUrl = `${TXOD_BASE}/${CONTRACTS_DS}.json?$limit=200&$order=total_amount DESC`;
      const contractRes = await fetch(contractUrl);
      if (contractRes.ok) {
        const contractData = await contractRes.json();
        setContracts(contractData);
      }

      // Fetch recent agency IT payments (last available fiscal year)
      const paymentUrl = `${TXOD_BASE}/${PAYMENTS_DS}.json?$limit=500&$order=amount DESC&$where=amount > 1000000`;
      const paymentRes = await fetch(paymentUrl);
      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        setPayments(paymentData);
      }

      setLastFetched(new Date().toLocaleString());
    } catch (err) {
      setError('Unable to reach Texas Open Data Portal. Check your connection or try again.');
    }
    setLoading(false);
  };

  const filteredContracts = contracts.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.vendor_name || '').toLowerCase().includes(q) ||
      (c.contract_description || '').toLowerCase().includes(q) ||
      (c.agency_name || '').toLowerCase().includes(q)
    );
  });

  const filteredPayments = payments.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.payee_name || '').toLowerCase().includes(q) ||
      (p.agency_name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  });

  const fmt = (n) => {
    const v = parseFloat(n);
    if (isNaN(v)) return 'N/A';
    if (v >= 1e9) return `$${(v/1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v/1e6).toFixed(1)}M`;
    return `$${v.toLocaleString()}`;
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      {/* Header card */}
      <div style={{
        background: 'linear-gradient(135deg, #141A47, #1E2761)',
        borderRadius: 16, padding: '24px', marginBottom: 20,
        border: '1px solid rgba(200,169,81,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 6 }}>
              Live Texas IT Spend Data
            </h2>
            <p style={{ color: '#CADCFC', fontSize: 13, maxWidth: 560, lineHeight: 1.6, margin: 0 }}>
              Live data from the Texas Open Data Portal — Comptroller vendor payments and DIR cooperative contract activity.
              Refreshes on demand. Data reflects published Comptroller records.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <button onClick={fetchData} disabled={loading} style={{
              padding: '8px 18px', background: '#C8A951', border: 'none', borderRadius: 8,
              color: '#141A47', fontSize: 12, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: loading ? 0.6 : 1
            }}>
              {loading ? '⟳ Refreshing…' : '⟳ Refresh Data'}
            </button>
            {lastFetched && <div style={{ fontSize: 10, color: '#8A93B2' }}>Last updated: {lastFetched}</div>}
          </div>
        </div>
      </div>

      {/* Source links */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20
      }}>
        {[
          { label: 'TX Open Data Portal', url: 'https://data.texas.gov' },
          { label: 'Comptroller Transparency', url: 'https://comptroller.texas.gov/transparency' },
          { label: 'DIR Contract Search', url: 'https://dir.texas.gov/contracts' },
          { label: 'LBB Budget Data', url: 'https://www.lbb.texas.gov' },
        ].map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{
            fontSize: 11, color: '#1E2761', background: '#FFFFFF', border: '1px solid rgba(30,39,97,0.15)',
            borderRadius: 20, padding: '4px 12px', textDecoration: 'none', fontWeight: 500
          }}>↗ {l.label}</a>
        ))}
      </div>

      {error && (
        <div style={{
          background: '#FDE8E8', border: '1px solid #F5BCBC', borderRadius: 10, padding: '14px 16px',
          color: '#8B1C1C', fontSize: 13, marginBottom: 20
        }}>
          <strong>Live data unavailable:</strong> {error}
          <div style={{ fontSize: 11, marginTop: 6, color: '#8B1C1C', opacity: 0.8 }}>
            The Texas Open Data Portal may be temporarily unavailable. Use the direct links above to access data manually.
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8A93B2' }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search vendors, agencies, contract descriptions…"
          style={{
            width: '100%', padding: '9px 12px 9px 32px', fontSize: 13,
            border: '1px solid rgba(30,39,97,0.15)', borderRadius: 8,
            background: '#FFFFFF', color: '#1A1F3C', outline: 'none',
            fontFamily: 'inherit', boxSizing: 'border-box'
          }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8A93B2' }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⟳</div>
          <div style={{ fontSize: 14 }}>Fetching live data from Texas Open Data Portal…</div>
        </div>
      ) : (
        <>
          {/* DIR Contracts */}
          {filteredContracts.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1E2761', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: '#E6F1FB', color: '#0C447C', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>DIR</span>
                Cooperative Contract Activity
                <span style={{ fontSize: 11, color: '#8A93B2', fontWeight: 400 }}>({filteredContracts.length} records)</span>
              </h3>
              <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(30,39,97,0.1)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#1E2761' }}>
                        {['Vendor', 'Agency', 'Contract', 'Amount', 'Period'].map(h => (
                          <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContracts.slice(0, 20).map((c, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(30,39,97,0.07)' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F8F9FD'}
                          onMouseLeave={e => e.currentTarget.style.background = ''}>
                          <td style={{ padding: '9px 14px', fontSize: 12, fontWeight: 500, color: '#1E2761' }}>{c.vendor_name || c.payee_name || '—'}</td>
                          <td style={{ padding: '9px 14px', fontSize: 11, color: '#8A93B2' }}>{c.agency_name || c.agency || '—'}</td>
                          <td style={{ padding: '9px 14px', fontSize: 11, color: '#1A1F3C', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.contract_description || c.description || c.contract_id || '—'}</td>
                          <td style={{ padding: '9px 14px', fontSize: 12, fontWeight: 600, color: '#1E2761', fontFamily: 'monospace' }}>{fmt(c.total_amount || c.amount)}</td>
                          <td style={{ padding: '9px 14px', fontSize: 11, color: '#8A93B2' }}>{c.contract_start_date || c.fiscal_year || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Vendor Payments */}
          {filteredPayments.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1E2761', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: '#FAEEDA', color: '#633806', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>COMPTROLLER</span>
                Agency Vendor Payments
                <span style={{ fontSize: 11, color: '#8A93B2', fontWeight: 400 }}>({filteredPayments.length} records)</span>
              </h3>
              <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(30,39,97,0.1)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#1E2761' }}>
                        {['Vendor / Payee', 'Agency', 'Description', 'Amount', 'Date'].map(h => (
                          <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.slice(0, 30).map((p, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(30,39,97,0.07)' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F8F9FD'}
                          onMouseLeave={e => e.currentTarget.style.background = ''}>
                          <td style={{ padding: '9px 14px', fontSize: 12, fontWeight: 500, color: '#1E2761' }}>{p.payee_name || p.vendor_name || '—'}</td>
                          <td style={{ padding: '9px 14px', fontSize: 11, color: '#8A93B2' }}>{p.agency_name || p.agency || '—'}</td>
                          <td style={{ padding: '9px 14px', fontSize: 11, color: '#1A1F3C', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description || p.category_description || p.object_description || '—'}</td>
                          <td style={{ padding: '9px 14px', fontSize: 12, fontWeight: 600, color: '#1E2761', fontFamily: 'monospace' }}>{fmt(p.amount || p.total_amount)}</td>
                          <td style={{ padding: '9px 14px', fontSize: 11, color: '#8A93B2' }}>{p.payment_date || p.fiscal_year || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {!error && filteredContracts.length === 0 && filteredPayments.length === 0 && (
            <div style={{
              background: '#FFFFFF', borderRadius: 12, padding: '40px', textAlign: 'center',
              border: '1px solid rgba(30,39,97,0.1)'
            }}>
              <div style={{ fontSize: 14, color: '#8A93B2', marginBottom: 12 }}>
                No live data returned from the Texas Open Data Portal for these datasets.
              </div>
              <p style={{ fontSize: 12, color: '#8A93B2', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
                The Comptroller's open data portal updates on a periodic basis. Use the direct links above to browse current data, or try the DIR Contract Search for cooperative contract details.
              </p>
            </div>
          )}
        </>
      )}

      <div style={{ fontSize: 11, color: '#8A93B2', lineHeight: 1.6, marginTop: 8 }}>
        <strong style={{ color: '#1E2761' }}>Live data source:</strong> Texas Open Data Portal (data.texas.gov) —
        Comptroller of Public Accounts vendor payment and contract datasets. Data is published by the Texas Comptroller and may lag by 30–90 days.
        For the most current DIR cooperative contract data, visit{' '}
        <a href="https://dir.texas.gov/contracts" target="_blank" rel="noreferrer" style={{ color: '#1E2761' }}>dir.texas.gov/contracts</a>.
      </div>
    </div>
  );
}
