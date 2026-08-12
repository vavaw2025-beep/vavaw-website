import type { Metadata } from 'next';
import { UnavailableLandingPage, UnavailableReason } from '../_components/UnavailableLandingPage';

const ALLOWED_REASONS: UnavailableReason[] = [
  'coming-soon',
  'maintenance',
  'not-found',
  'private',
  'default',
];

export const metadata: Metadata = {
  title: 'VAVAW | Trải nghiệm đang được cập nhật',
  description: 'Trang đang được VAVAW hoàn thiện hoặc cập nhật nội dung.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn'}/system-update`,
  },
};

interface SystemUpdatePageProps {
  searchParams: Promise<{
    reason?: string;
    from?: string;
  }>;
}

export default async function SystemUpdatePage({ searchParams }: SystemUpdatePageProps) {
  const resolvedParams = await searchParams;
  const rawReason = resolvedParams?.reason;
  const fromPath = resolvedParams?.from;

  const safeReason: UnavailableReason = ALLOWED_REASONS.includes(rawReason as UnavailableReason)
    ? (rawReason as UnavailableReason)
    : 'default';

  return (
    <UnavailableLandingPage reason={safeReason} fromPath={fromPath} />
  );
}
