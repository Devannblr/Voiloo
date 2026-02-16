import { useState } from 'react';

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = async (endpoint: string, options: RequestInit = {}) => {
        setIsLoading(true);
        setError(null);

        // URL de ton back-end Laravel
        const API_URL = "http://localhost:8000/api";

        // On récupère le token Sanctum stocké lors du login/signup
        const token = typeof window !== 'undefined' ? localStorage.getItem('voiloo_token') : null;

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
            const data = await response.json();

            if (!response.ok) {
                // Gestion des erreurs de validation Laravel (422)
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