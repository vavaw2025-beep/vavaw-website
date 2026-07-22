import Link from 'next/link';

export default function RedirectsPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>Redirects Management</h1>
      <p style={{ color: '#64748b' }}>Placeholder page for managing `/go/[slug]` shortlinks.</p>
    </div>
  );
}
