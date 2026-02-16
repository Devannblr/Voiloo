// hooks/useApi.ts
import { useState } from 'react';

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = async (endpoint: string, options: RequestInit = {}) => {
        setIsLoading(true);
        setError(null);

        const API_URL = "http://localhost:8000/api";
        const token = typeof window !== 'undefined' ? localStorage.getItem('voiloo_token') : null;

        // ⚠️ CORRECTION CRITIQUE : Ne pas forcer Content-Type pour FormData
        const isFormData = options.body instanceof FormData;

        const headers: HeadersInit = {
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };

        // ✅ Ajouter Content-Type SEULEMENT si ce n'est pas du FormData
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        // Fusionner avec les headers personnalisés (sans écraser)
        if (options.headers) {
            Object.assign(headers, options.headers);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Une erreur est survenue");
            }

            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { request, isLoading, error };
};