import 'server-only';
import { createHmac } from 'crypto';

export interface PreviewTokenPayload {
  app: 'main' | 'beauty' | 'franchise';
  target: 'home' | 'cosmetic' | 'beauty' | 'franchise';
  path: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

/**
 * Creates a short-lived signed preview token.
 */
export function createPreviewToken(
  payload: Omit<PreviewTokenPayload, 'issuedAt' | 'expiresAt' | 'nonce'>,
  secret: string,
  ttlSeconds: number = 900
): string {
  if (!secret) {
    throw new Error('Preview secret is required to generate a token');
  }

  const now = Date.now();
  const fullPayload: PreviewTokenPayload = {
    ...payload,
    issuedAt: now,
    expiresAt: now + ttlSeconds * 1000,
    nonce: Math.random().toString(36).substring(2, 15),
  };

  const payloadString = JSON.stringify(fullPayload);
  const encodedPayload = Buffer.from(payloadString).toString('base64url');

  const signature = createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export interface VerifyPreviewTokenResult {
  valid: boolean;
  payload?: PreviewTokenPayload;
  error?: string;
}

/**
 * Verifies a signed preview token.
 */
export function verifyPreviewToken(token: string, secret: string): VerifyPreviewTokenResult {
  if (!secret) {
    return { valid: false, error: 'Server configuration error (missing secret)' };
  }
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Malformed token' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const [encodedPayload, signature] = parts;

  // Verify signature first
  const expectedSignature = createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const payloadString = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadString) as PreviewTokenPayload;

    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Token expired' };
    }

    if (!payload.app || !payload.target || !payload.path) {
      return { valid: false, error: 'Token missing required claims' };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: 'Failed to decode token payload' };
  }
}
