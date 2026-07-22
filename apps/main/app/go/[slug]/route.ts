import { NextRequest, NextResponse } from 'next/server';
import { getBusinessBySlug } from '@vavaw/brand-config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = getBusinessBySlug(slug);

  if (!entry) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (entry.navigationType === 'internal') {
    return NextResponse.redirect(new URL(entry.href, request.url));
  }

  if (entry.navigationType === 'external-app') {
    return NextResponse.redirect(entry.href);
  }

  return NextResponse.redirect(new URL('/', request.url));
}
