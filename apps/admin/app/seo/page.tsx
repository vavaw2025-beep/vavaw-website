import Link from 'next/link';
import { businessEntries } from '@vavaw/brand-config';

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 1rem',
  borderBottom: '2px solid #e2e8f0',
  color: '#475569',
  fontWeight: 600,
  fontSize: '0.875rem',
};

const tdStyle: React.CSSProperties = {
  padding: '0.625rem 1rem',
  borderBottom: '1px solid #f1f5f9',
  color: '#0f172a',
  fontSize: '0.875rem',
  verticalAlign: 'top',
};

const monoStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.8125rem',
  color: '#475569',
};

export default function SeoPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem', fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a' }}>SEO Settings</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Read-only view of SEO metadata from <code>@vavaw/brand-config</code>.
      </p>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Business</th>
              <th style={thStyle}>SEO Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Canonical URL</th>
              <th style={thStyle}>OG Image</th>
            </tr>
          </thead>
          <tbody>
            {businessEntries.map((entry) => (
              <tr key={entry.id}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{entry.name}</td>
                <td style={tdStyle}>{entry.seo.title}</td>
                <td style={{ ...tdStyle, maxWidth: '240px' }}>{entry.seo.description}</td>
                <td style={tdStyle}><span style={monoStyle}>{entry.seo.canonicalUrl}</span></td>
                <td style={tdStyle}><span style={monoStyle}>{entry.media.ogImage}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
