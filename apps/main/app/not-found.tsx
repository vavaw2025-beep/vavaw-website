import type { Metadata } from 'next';
import { UnavailableLandingPage } from './_components/UnavailableLandingPage';

export const metadata: Metadata = {
  title: 'VAVAW | 404 - Không tìm thấy trang',
  description: 'Trang bạn yêu cầu không tồn tại hoặc đã thay đổi đường dẫn.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <UnavailableLandingPage reason="not-found" />;
}
