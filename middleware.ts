import type { MiddlewareConfig, NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

const PROTECTED = ['/saltos'];
const UNMIDDLEWARE = ['/entrar/api'];
export const AUTH_URL = ['/entrar', '/cadastrar', '/confirmar'];

const [HOME_ROUTE] = PROTECTED;
const [LOGIN_ROUTE] = AUTH_URL;

const COGNITO_COOKIE = [
  'CognitoIdentityServiceProvider',
  process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
  'LastAuthUser',
].join('.');

export function middleware(request: NextRequest) {
  if (UNMIDDLEWARE.includes(request.nextUrl.pathname)) return NextResponse.next();

  const hasLoggedUser = request.cookies.get(COGNITO_COOKIE) !== undefined;

  const isAuthUrl = AUTH_URL.some((url) =>
    request.nextUrl.pathname.startsWith(url)
  );

  const isProtectedUrl = PROTECTED.some((url) =>
    request.nextUrl.pathname.startsWith(url)
  );

  const isNextResources = !isAuthUrl && !isProtectedUrl;

  if (isNextResources || hasLoggedUser !== isAuthUrl) return NextResponse.next();

  return NextResponse.redirect(
    new URL(hasLoggedUser ? HOME_ROUTE : LOGIN_ROUTE, request.url)
  );
}

export const config: MiddlewareConfig = {
  matcher: [
    ...PROTECTED,
    ...AUTH_URL,
  ],
};
