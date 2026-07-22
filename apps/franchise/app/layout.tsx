import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://franchise.vavaw.vn'),
  title: 'VAVAW Franchise - Business & Partnership Opportunities',
  description: 'Learn about business partnership and franchise opportunities with VAVAW.',
  alternates: {
    canonical: 'https://franchise.vavaw.vn',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
