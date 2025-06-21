import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/auth/jwt';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};