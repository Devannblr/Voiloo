import { useEffect, useState } from 'react';

export function useUserCity() {
    const [city, setCity] = useState<string | null>(null);

    useEffect(() => {
        if (!("geolocation" in navigator)) return;

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const res = await fetch(
                        `https://api-adresse.data.gouv.fr/reverse/?lon=${pos.coords.longitude}&lat=${pos.coords.latitude}`
                    );
                    const data = await res.json();
                    const detected = data.features?.[0]?.properties?.city;
                    if (detected) setCity(detected);
                } catch {}
            },
            () => {}
        );
    }, []);

    return city;
}