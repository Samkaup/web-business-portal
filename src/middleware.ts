import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types';
import { getCompany } from './utils/supabase_queries/company';

const UNAUTHORIZED_ROUTES: string[] = ['/auth/login', '/auth/forgot-password'];

const ADMIN_ROUTE_PREFIX = '/admin';

const VOID_ROUTE = '/void';
const VOID_ROUTES: string[] = [
  VOID_ROUTE,
  '/auth/forgot-password/reset-pass',
  '/auth/signout'
];

const redirectTo = (url: string, req: NextRequest) => {
  console.log(`Middleware redirecting to '${url}'`);
  return NextResponse.redirect(new URL(url, req.url));
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  // If user is signed in and path is in UNAUTHORIZED_ROUTES redirect to /
  if (session && UNAUTHORIZED_ROUTES.includes(req.nextUrl.pathname))
    return redirectTo('/', req);

  // If user is not signed in and path is not in UNAUTHORIZED_ROUTES redirect to /auth/login
  if (!session && !UNAUTHORIZED_ROUTES.includes(req.nextUrl.pathname))
    return redirectTo('/auth/login', req);

  if (req.nextUrl.pathname.startsWith(ADMIN_ROUTE_PREFIX)) {
    if (!session) {
      return redirectTo('/auth/login', req);
    }

    if (session.user.app_metadata.userrole !== 'ADMIN') {
      return redirectTo('/', req);
    }
  }

  if (session && !VOID_ROUTES.includes(req.nextUrl.pathname)) {
    const result = await getCompany(supabase, {});
    if (result.length === 0) return redirectTo(VOID_ROUTE, req);
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
    '/companies',
    '/admin/:path*',
    '/void',
    '/api'
  ]
};
