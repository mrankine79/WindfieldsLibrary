import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SECRET = process.env.SESSION_SECRET || process.env.MANAGEMENT_PASSWORD || 'dev-secret-change-me';
export const COOKIE = 'wf_session';
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours
export const MAX_AGE = MAX_AGE_SECONDS;

function hmac(value) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

export function createSessionToken() {
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expires}.${hmac(expires)}`;
}

export function verifySessionToken(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [value, sig] = parts;
  const expected = hmac(value);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;
  return Number(value) > Date.now();
}

export function checkPassword(candidate) {
  const real = process.env.MANAGEMENT_PASSWORD || '';
  if (!real) return false;
  const a = Buffer.from(candidate || '');
  const b = Buffer.from(real);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Call at the top of any /manage server component. Redirects to the login
// page if there's no valid session cookie.
export function requireAuth() {
  const token = cookies().get(COOKIE)?.value;
  if (!verifySessionToken(token)) {
    redirect('/manage/login');
  }
}
