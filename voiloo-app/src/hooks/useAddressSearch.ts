import { useState, useCallback, useRef } from 'react';

export interface AddressSuggestion {
    label: string;
    city: string;
    postcode: string;
    street: string;
    lat: number;
    lng: number;
}

export function useAddressSearch() {
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5&autocomplete=1`
                );
                const data = await res.json();
                const results: AddressSuggestion[] = data.features.map((f: any) => ({
                    label:    f.properties.label,
                    city:     f.properties.city,
                    postcode: f.properties.postcode,
                    street:   f.properties.name,
                    lat:      f.geometry.coordinates[1],
                    lng:      f.geometry.coordinates[0],
                }));
                setSuggestions(results);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    }, []);

    const clear = useCallback(() => setSuggestions([]), []);

    return { suggestions, loading, search, clear };
}