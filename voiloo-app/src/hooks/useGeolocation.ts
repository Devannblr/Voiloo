'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'voiloo_user_position';

export const useGeolocation = () => {
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<PermissionState | 'loading'>('loading');
    const [error, setError] = useState<string | null>(null);

    // Charger le cache au démarrage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setCoords(JSON.parse(saved));

        // Vérifier l'état de la permission native
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setPermissionStatus(result.state);
                result.onchange = () => setPermissionStatus(result.state);
            });
        }
    }, []);

    const requestLocation = useCallback(() => {
        if (!("geolocation" in navigator)) {
            setError("Non supporté");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setCoords(newCoords);
                setPermissionStatus('granted');
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newCoords));
            },
            (err) => {
                setPermissionStatus('denied');
                setError(err.message);
            },
            { enableHighAccuracy: false, timeout: 5000 }
        );
    }, []);

    return { coords, permissionStatus, requestLocation, error };
};