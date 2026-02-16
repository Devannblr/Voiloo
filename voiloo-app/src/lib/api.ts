// lib/api.ts
const API_URL = "http://localhost:8000/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('voiloo_token') : null;

    // ⚠️ CORRECTION : Détecter si c'est du FormData
    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    // ✅ Ajouter Content-Type SEULEMENT si ce n'est pas du FormData
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    // Fusionner avec les headers personnalisés
    if (options.headers) {
        Object.assign(headers, options.headers);
    }

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