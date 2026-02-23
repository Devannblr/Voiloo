import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Correction ici

export function middleware(request: NextRequest) {
    // Récupère le token dans les cookies
    const token = request.cookies.get('token')?.value;

    // Définis les routes qui nécessitent d'être connecté
    const protectedRoutes = ['/ajouter', '/messages'];

    // Vérifie si la route actuelle est protégée
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'unauthorized');
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Sécurité : on définit sur quelles routes le middleware doit s'activer
export const config = {
    matcher: [
        '/profil/:path*',
        '/ajouter/:path*',
        '/messages/:path*'
    ],
};