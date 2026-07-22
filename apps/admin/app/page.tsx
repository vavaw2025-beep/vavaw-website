import { businessEntries } from '@vavaw/brand-config';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const totalEntries = businessEntries.length;
  const activeEntries = businessEntries.filter(b => b.status === 'active').length;
  const comingSoonEntries = businessEntries.filter(b => b.status === 'coming-soon').length;
  const externalAppEntries = businessEntries.filter(b => b.navigationType === 'external-app').length;

  const cards = [
    { title: 'Business Entries', href: '/business', count: totalEntries, desc: 'Manage brand profiles & entries' },
    { title: 'Hero Slides', href: '/hero', count: 'Active', desc: 'Configure main hero slider' },
    { title: 'Media Library', href: '/media', count: 'Assets', desc: 'Images, banners & logos' },
    { title: 'SEO Settings', href: '/seo', count: 'Global', desc: 'Meta tags & OpenGraph' },
    { title: 'Redirects', href: '/redirects', count: '/go/*', desc: 'Shortlinks & routing rules' },
    { title: 'Website Content', href: '/content', count: 'Sections', desc: 'Copy, stories & CTAs' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
          VAVAW Admin Dashboard
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Manage the VAVAW brand ecosystem
        </p>
      </header>

      {/* Statistics Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Business Entries</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', marginTop: '0.25rem' }}>{totalEntries}</div>
        </div>
        <div style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Active Entries</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#16a34a', marginTop: '0.25rem' }}>{activeEntries}</div>
        </div>
        <div style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Coming Soon Entries</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#d97706', marginTop: '0.25rem' }}>{comingSoonEntries}</div>
        </div>
        <div style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>External App Entries</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginTop: '0.25rem' }}>{externalAppEntries}</div>
        </div>
      </section>

      {/* Management Cards */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
        Management Modules
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              display: 'block',
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                {card.title}
              </h3>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#475569', backgroundColor: '#f1f5f9', padding: '0.25rem 0.625rem', borderRadius: '9999px' }}>
                {card.count}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', marginBottom: 0 }}>
              {card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
