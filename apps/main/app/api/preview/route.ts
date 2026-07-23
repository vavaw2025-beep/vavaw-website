import { NextRequest, NextResponse } from 'next/server';
import { verifyPreviewToken } from '@vavaw/auth/server';
import { draftMode } from 'next/headers';

const ALLOWED_PATHS = ['/', '/cosmetic'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const path = searchParams.get('path');

  if (!token || !path) {
    return new NextResponse('Missing token or path', { status: 400 });
  }

  if (!ALLOWED_PATHS.includes(path)) {
    return new NextResponse('Invalid path', { status: 400 });
  }

  const secret = process.env.CMS_PREVIEW_SECRET;
  if (!secret) {
    return new NextResponse('Preview not configured on server', { status: 500 });
  }

  const verification = verifyPreviewToken(token, secret);
  if (!verification.valid || !verification.payload) {
    return new NextResponse(`Invalid token: ${verification.error}`, { status: 401 });
  }

  if (verification.payload.app !== 'main') {
    return new NextResponse('Token app mismatch', { status: 401 });
  }

  if (verification.payload.path !== path) {
    return new NextResponse('Token path mismatch', { status: 401 });
  }

  if (Date.now() > verification.payload.expiresAt) {
    return new NextResponse('Token expired', { status: 401 });
  }

  (await draftMode()).enable();

  return NextResponse.redirect(new URL(path, request.url));
}
