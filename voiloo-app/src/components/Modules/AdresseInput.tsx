'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useAddressSearch, AddressSuggestion } from '@/hooks/useAddressSearch';

interface Props {
    value: string;
    onChange: (data: {
        adresse: string;
        ville: string;
        code_postal: string;
        lat: number;
        lng: number;
    }) => void;
    error?: string;
}

export default function AddressInput({ value, onChange, error }: Props) {
    const [inputValue, setInputValue] = useState(value);
    const [open, setOpen] = useState(false);
    const { suggestions, loading, search, clear } = useAddressSearch();
    const containerRef = useRef<HTMLDivElement>(null);

    // Fermer si clic à l'extérieur
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                clear();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [clear]);

    const handleInput = (val: string) => {
        setInputValue(val);
        setOpen(true);
        search(val);
    };

    const handleSelect = (s: AddressSuggestion) => {
        setInputValue(s.label);
        setOpen(false);
        clear();
        onChange({
            adresse:     s.street,
            ville:       s.city,
            code_postal: s.postcode,
            lat:         s.lat,
            lng:         s.lng,
        });
    };

    return (
        <div ref={containerRef} className="relative">
            <div className={`flex items-center border-2 rounded-xl bg-white transition-colors
                ${error ? 'border-red-400' : 'border-gray-100 focus-within:border-primary'}`}>
                <span className="pl-3 text-gray-400 shrink-0">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                </span>
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => handleInput(e.target.value)}
                    placeholder="Ex : 12 rue de la République, Lyon"
                    className="w-full px-3 py-3 bg-transparent text-dark placeholder-gray-400 text-sm outline-none"
                />
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            {open && suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                    {suggestions.map((s, i) => (
                        <li key={i}>
                            <button
                                type="button"
                                onMouseDown={() => handleSelect(s)}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-colors flex items-start gap-2"
                            >
                                <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold text-dark">{s.street}</p>
                                    <p className="text-gray-400 text-xs">{s.postcode} {s.city}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}