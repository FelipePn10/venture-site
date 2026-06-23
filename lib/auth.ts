import crypto from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Sessão de admin baseada em cookie httpOnly assinado com HMAC-SHA256.
 * - Sem senha padrão: se ADMIN_PASSWORD ou SESSION_SECRET não estiverem
 *   definidos, o acesso é negado (fail-closed).
 * - Comparações em tempo constante (timingSafeEqual) contra timing attacks.
 * - O token guarda apenas o instante de expiração + assinatura; não há
 *   dado sensível no cookie.
 */
export const ADMIN_COOKIE = 'vp_admin';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas

function getSecret(): string | null {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
}

export function adminConfigured(): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && pw.length >= 8 && !!getSecret();
}

function sign(expMs: number, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret).update(String(expMs)).digest('hex');
  return `${expMs}.${hmac}`;
}

export function createSessionToken(): string {
  const secret = getSecret();
  if (!secret) throw new Error('SESSION_SECRET ausente.');
  return sign(Date.now() + ADMIN_COOKIE_MAX_AGE * 1000, secret);
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function verifyToken(token?: string | null): boolean {
  const secret = getSecret();
  if (!token || !secret) return false;
  const dot = token.indexOf('.');
  if (dot < 1) return false;
  const exp = Number(token.slice(0, dot));
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return safeEqual(token, sign(exp, secret));
}

export function checkPassword(input: unknown): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || typeof input !== 'string') return false;
  return safeEqual(input, pw);
}

export function isAdminAuthed(): boolean {
  return verifyToken(cookies().get(ADMIN_COOKIE)?.value);
}
