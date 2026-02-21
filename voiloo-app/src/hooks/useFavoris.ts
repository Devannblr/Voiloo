// hooks/useFavoris.ts
import { useState, useEffect, useCallback } from 'react';

export interface Favori {
    id: number;
    slug: string;
    userSlug: string;
    titre: string;
    prix: number;
    ville: string;
    description: string;
    couleur: string;
    image?: string;
    categorie?: string;
}

const STORAGE_KEY = 'voiloo_favoris';

export function useFavoris() {
    const [favoris, setFavoris] = useState<Favori[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        setFavoris(stored ? JSON.parse(stored) : []);
    }, []);

    const save = (updated: Favori[]) => {
        setFavoris(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const addFavori = useCallback((fav: Favori) => {
        setFavoris(prev => {
            if (prev.find(f => f.id === fav.id)) return prev;
            const updated = [...prev, fav];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const removeFavori = useCallback((id: number) => {
        setFavoris(prev => {
            const updated = prev.filter(f => f.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const toggleFavori = useCallback((fav: Favori) => {
        setFavoris(prev => {
            const exists = prev.find(f => f.id === fav.id);
            const updated = exists ? prev.filter(f => f.id !== fav.id) : [...prev, fav];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const isFavori = useCallback((id: number) => {
        return favoris.some(f => f.id === id);
    }, [favoris]);

    const clearAll = useCallback(() => {
        setFavoris([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return { favoris, addFavori, removeFavori, toggleFavori, isFavori, clearAll };
}