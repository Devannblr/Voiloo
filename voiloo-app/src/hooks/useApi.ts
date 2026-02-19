// hooks/useApi.ts
import {useCallback, useState} from 'react';
import {apiFetch} from '@/lib/api';

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // useCallback évite des re-renders inutiles
    const request = useCallback(async (endpoint: string, options: RequestInit = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            return await apiFetch(endpoint, options);
        } catch (err: any) {
            const msg = err.message || "Une erreur est survenue";
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { request, isLoading, error };
};