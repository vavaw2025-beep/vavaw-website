import Link from 'next/link';

export default function MediaPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>Media Library</h1>
      <p style={{ color: '#64748b' }}>Placeholder page for managing uploaded images and assets.</p>
    </div>
  );
}
