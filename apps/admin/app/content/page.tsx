import Link from 'next/link';

export default function ContentPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>Website Content</h1>
      <p style={{ color: '#64748b' }}>Placeholder page for managing copy and website sections.</p>
    </div>
  );
}
