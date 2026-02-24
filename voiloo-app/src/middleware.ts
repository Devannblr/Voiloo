import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // On cherche prioritairement voiloo_token
    const token = request.cookies.get('voiloo_token')?.value || request.cookies.get('token')?.value;

    // Routes nécessitant une connexion
    const protectedRoutes = ['/ajouter', '/messages'];

    // Vérification si on est sur une route d'édition d'annonce (ex: /u/username/mon-annonce/edit)
    const isEditRoute = request.nextUrl.pathname.endsWith('/edit');
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    ) || isEditRoute;

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'unauthorized');
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