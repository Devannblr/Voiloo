// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ⚠️ MIDDLEWARE DÉSACTIVÉ
 *
 * L'authentification est gérée côté client par AuthContext.
 * Les pages protégées (/messages, /ajouter, /favoris, /profil)
 * utilisent useAuth() et redirigent automatiquement vers /login.
 *
 * Le middleware Next.js ne peut pas accéder à localStorage où
 * est stocké le token, donc il est inutile ici.
 */

export function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [], // Désactivé
};