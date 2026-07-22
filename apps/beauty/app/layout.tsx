import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://beauty.vavaw.vn'),
  title: 'VAVAW Beauty & Co - Beauty and Care Destination',
  description: 'A dedicated beauty brand experience within the VAVAW ecosystem.',
  alternates: {
    canonical: 'https://beauty.vavaw.vn',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
