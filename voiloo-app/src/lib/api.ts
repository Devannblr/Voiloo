// lib/api.ts

// ✅ Utilise la variable d'env, sinon fallback local
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('voiloo_token') : null;
    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    // ✅ On utilise bien l'API_URL dynamique
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Une erreur est survenue");
    }

    return response.json();
};