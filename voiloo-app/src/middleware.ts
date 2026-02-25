// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const protectedRoutes = ['/ajouter', '/messages'];
    const isEditRoute = request.nextUrl.pathname.match(/\/u\/.+\/.+\/edit/);
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    ) || isEditRoute;

    const hasToken = request.cookies.has('voiloo_token'); // cookie HttpOnly

    if (isProtectedRoute && !hasToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profil/:path*',
        '/ajouter/:path*',
        '/messages/:path*',
        '/u/:user/:annonce/edit'
    ],
};