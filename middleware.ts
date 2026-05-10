import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth;

  // Already on /login: send signed-in users to home.
  if (pathname === '/login') {
    if (isAuthed) return NextResponse.redirect(new URL('/', req.url));
    return NextResponse.next();
  }

  // Anything else under the matcher requires auth.
  if (!isAuthed) {
    // Anonymous landing on the home app → marketing welcome page.
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/welcome', req.url));
    }
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  // Protect the home app, settings, and write APIs. Auth.js itself,
  // /login, and Next internals are excluded.
  matcher: [
    '/',
    '/login',
    '/settings/:path*',
    '/api/notes/:path*',
    '/api/categories/:path*',
    '/api/tags/:path*',
    '/api/export/:path*',
    '/api/account/:path*',
  ],
};
