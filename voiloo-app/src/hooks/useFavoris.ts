import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/apiService';

export function useFavoris(isAuthenticated: boolean = false) {
    const [favorisIds, setFavorisIds] = useState<Set<number>>(new Set());
    const [favoris, setFavoris] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Charger les IDs au montage (ultra léger)
    useEffect(() => {
        if (!isAuthenticated) return;

        apiService.getFavorisIds()
            .then((ids: number[]) => setFavorisIds(new Set(ids)))
            .catch(console.error);
    }, [isAuthenticated]);

    // Charger la liste complète (à la demande sur la page /favoris)
    const fetchFavoris = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const data = await apiService.getFavoris();
            setFavoris(data);
        } catch (err) {
            console.error('Erreur fetchFavoris:', err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const toggleFavori = useCallback(async (annonceId: number) => {
        if (!isAuthenticated) return;

        // Optimistic update
        setFavorisIds(prev => {
            const next = new Set(prev);
            next.has(annonceId) ? next.delete(annonceId) : next.add(annonceId);
            return next;
        });

        try {
            await apiService.toggleFavori(annonceId);
        } catch (err) {
            // Rollback si erreur réseau
            setFavorisIds(prev => {
                const next = new Set(prev);
                next.has(annonceId) ? next.delete(annonceId) : next.add(annonceId);
                return next;
            });
            console.error('Erreur toggle favori:', err);
        }
    }, [isAuthenticated]);

    const isFavori = useCallback((id: number) => {
        return favorisIds.has(id);
    }, [favorisIds]);

    return { favoris, favorisIds, toggleFavori, isFavori, fetchFavoris, loading };
}