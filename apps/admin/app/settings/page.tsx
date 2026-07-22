import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>System Settings</h1>
      <p style={{ color: '#64748b' }}>Placeholder page for global system configurations.</p>
    </div>
  );
}
