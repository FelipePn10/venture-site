import { NextRequest, NextResponse } from 'next/server';
import {
  adminConfigured,
  checkPassword,
  createSessionToken,
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: 'Admin não configurado. Defina ADMIN_PASSWORD (mín. 8 caracteres) e SESSION_SECRET (mín. 16).' },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  if (!checkPassword((body as { password?: unknown }).password)) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}
