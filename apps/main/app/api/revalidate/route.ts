import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const ALLOWED_PATHS = ['/', '/cosmetic'];

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.REVALIDATION_SECRET;
    
    // Check if secret is configured on the server
    if (!secret) {
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 501 } // Not Implemented
      );
    }

    // Validate request secret
    const authHeader = req.headers.get('authorization');
    const headerSecret = req.headers.get('x-revalidation-secret');
    const providedSecret = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : headerSecret;

    if (providedSecret !== secret) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const paths = Array.isArray(body.paths) ? body.paths : [];
    
    if (paths.length === 0) {
      return NextResponse.json(
        { error: 'Missing paths array in body' },
        { status: 400 }
      );
    }

    const revalidatedPaths: string[] = [];

    for (const path of paths) {
      if (ALLOWED_PATHS.includes(path)) {
        revalidatePath(path);
        revalidatedPaths.push(path);
      }
    }

    if (revalidatedPaths.length === 0) {
      return NextResponse.json(
        { error: 'No valid paths provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      now: new Date().toISOString()
    });

  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { error: 'Internal server error during revalidation' },
      { status: 500 }
    );
  }
}
