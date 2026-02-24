import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // ✅ Utilise le même nom que celui défini dans ton Back (ou ton script de login)
    // On vérifie 'voiloo_token' (recommandé) ou 'token' selon ce que tu as gardé
    const token = request.cookies.get('voiloo_token')?.value || request.cookies.get('token')?.value;

    // Définis les routes qui nécessitent d'être connecté
    const protectedRoutes = ['/ajouter', '/messages'];

    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Si la route est protégée et qu'aucun cookie n'est présent
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
        '/messages/:path*'
    ],
};