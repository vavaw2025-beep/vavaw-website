import Link from 'next/link';
import { getSortedBusinessEntries } from '@vavaw/brand-config';

const entries = getSortedBusinessEntries();

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.125rem',
};

const valueStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#0f172a',
  marginBottom: '0.75rem',
};

const badgeStyle = (status: string): React.CSSProperties => ({
  display: 'inline-block',
  padding: '0.125rem 0.5rem',
  borderRadius: '9999px',
  fontSize: '0.75rem',
  fontWeight: 500,
  backgroundColor: status === 'active' ? '#dcfce7' : status === 'coming-soon' ? '#fef3c7' : '#f1f5f9',
  color: status === 'active' ? '#166534' : status === 'coming-soon' ? '#92400e' : '#475569',
});

export default function HeroPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem', fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a' }}>Hero Slides Management</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Read-only view of hero slider configuration from <code>@vavaw/brand-config</code>.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{entry.title}</h2>
              <span style={badgeStyle(entry.status)}>{entry.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem 2rem' }}>
              <div>
                <div style={labelStyle}>Subtitle</div>
                <div style={valueStyle}>{entry.subtitle}</div>
              </div>
              <div>
                <div style={labelStyle}>Sort Order</div>
                <div style={valueStyle}>{entry.sortOrder}</div>
              </div>
              <div>
                <div style={labelStyle}>CTA Label</div>
                <div style={valueStyle}>{entry.ctaLabel}</div>
              </div>
              <div>
                <div style={labelStyle}>Redirect Path</div>
                <div style={{ ...valueStyle, fontFamily: 'monospace', fontSize: '0.8125rem' }}>{entry.redirectPath}</div>
              </div>
              <div>
                <div style={labelStyle}>Background Image</div>
                <div style={{ ...valueStyle, fontFamily: 'monospace', fontSize: '0.8125rem' }}>{entry.media.backgroundImage}</div>
              </div>
              <div>
                <div style={labelStyle}>Preview Image</div>
                <div style={{ ...valueStyle, fontFamily: 'monospace', fontSize: '0.8125rem' }}>{entry.media.previewImage}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
