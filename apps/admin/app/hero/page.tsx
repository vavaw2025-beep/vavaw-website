import Link from 'next/link';

export default function HeroPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>Hero Slides Management</h1>
      <p style={{ color: '#64748b' }}>Placeholder page for configuring hero slider content.</p>
    </div>
  );
}
