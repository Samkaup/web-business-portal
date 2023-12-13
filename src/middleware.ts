import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types';

const UNAUTHORIZED_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // if user is signed in and the current path is / redirect the user to /account
  if (session && UNAUTHORIZED_ROUTES.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!session && !UNAUTHORIZED_ROUTES.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/transactions',
    '/contacts',
    '/profile',
    '/auth/signup',
    '/auth/login',
    '/auth/signout',
    '/auth/forgot-password/reset-pass',
  ],
};
