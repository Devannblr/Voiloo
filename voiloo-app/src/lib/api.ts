// lib/api.ts - VERSION OPTIMISÉE
export async function apiFetch(input: string, init?: RequestInit) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL n'est pas défini");

    // ✅ Récupérer le token depuis localStorage (si existe)
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('voiloo_token')
        : null;

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(init?.headers as Record<string, string> ?? {}),
        ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    };

    // ✅ CRITIQUE : Ajouter le Bearer token si disponible
    // Laravel Sanctum accepte BOTH cookie ET Bearer token
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(baseUrl + input, {
        ...init,
        credentials: 'include', // Cookie HttpOnly
        headers,
    });

    // ✅ Gestion 401 : Token expiré/invalide
    if (response.status === 401) {
        // Nettoyer le token invalide
        if (typeof window !== 'undefined') {
            localStorage.removeItem('voiloo_token');
        }

        // Rediriger vers login (sauf si déjà sur login)
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login?error=unauthorized';
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, ...errorData };
    }

    // ✅ Gérer les réponses vides (ex: DELETE)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        return null;
    }

    return response.json();
}