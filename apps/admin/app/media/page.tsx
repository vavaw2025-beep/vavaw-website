import Link from 'next/link';
import { businessEntries } from '@vavaw/brand-config';

const mediaCategories = [
  {
    title: 'Hero Images',
    description: 'Full-screen background images for the hero slider.',
    items: businessEntries.map((e) => ({ name: e.name, path: e.media.backgroundImage })),
  },
  {
    title: 'Preview Images',
    description: 'Thumbnail preview cards shown in the carousel.',
    items: businessEntries.map((e) => ({ name: e.name, path: e.media.previewImage })),
  },
  {
    title: 'Open Graph Images',
    description: 'Social sharing images for SEO and link previews.',
    items: businessEntries.map((e) => ({ name: e.name, path: e.media.ogImage })),
  },
  {
    title: 'Videos',
    description: 'Intro and promotional videos.',
    items: businessEntries
      .filter((e) => e.media.introVideo)
      .map((e) => ({ name: e.name, path: e.media.introVideo! })),
  },
];

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 1rem',
  borderBottom: '2px solid #e2e8f0',
  color: '#475569',
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: '0.625rem 1rem',
  borderBottom: '1px solid #f1f5f9',
  color: '#0f172a',
};

export default function MediaPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem', fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a' }}>Media Library</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Static overview of all media assets referenced in <code>@vavaw/brand-config</code>. Upload and delete features coming soon.
      </p>

      {mediaCategories.map((cat) => (
        <section key={cat.title} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{cat.title}</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>{cat.description}</p>

          {cat.items.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.875rem' }}>No assets configured yet.</p>
          ) : (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Business</th>
                    <th style={thStyle}>Path</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map((item) => (
                    <tr key={item.path}>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.8125rem', color: '#475569' }}>{item.path}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
