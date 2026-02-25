'use client';

import { useEffect, useState, useRef } from 'react';
import { H3, Button, Label, Select } from '@/components/Base';
import { X, ArrowUpDown, MapPin, Tag } from 'lucide-react';

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Record<string, string>;
    filters: { category: string; city: string; sort: string; lat?: string; lng?: string; radius?: string };
    onApply: (f: { category: string; city: string; sort: string; lat?: string; lng?: string; radius?: string }) => void;
}

interface CitySuggestion {
    nom: string;
    codesPostaux: string[];
    centre: { coordinates: [number, number] };
}

export function FilterDrawer({ isOpen, onClose, categories, filters, onApply }: FilterDrawerProps) {
    const [local, setLocal] = useState(filters);
    const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
    const [cityLoading, setCityLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setLocal(filters); }, [filters]);

    const searchCities = (query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query || query.length < 2) {
            setCitySuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setCityLoading(true);
            try {
                const res = await fetch(
                    `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom,codesPostaux,centre&boost=population&limit=6`
                );
                const data = await res.json();
                setCitySuggestions(data);
                setShowSuggestions(true);
            } catch {
                setCitySuggestions([]);
            } finally {
                setCityLoading(false);
            }
        }, 300);
    };

    const selectCity = (city: CitySuggestion) => {
        const [lng, lat] = city.centre.coordinates;
        setLocal(l => ({
            ...l,
            city: city.nom,
            lat: String(lat),
            lng: String(lng),
            radius: l.radius || '30',
        }));
        setCitySuggestions([]);
        setShowSuggestions(false);
    };

    const clearCity = () => {
        setLocal(l => ({ ...l, city: '', lat: undefined, lng: undefined, radius: undefined }));
        setCitySuggestions([]);
    };

    const categoryOptions = [
        { value: '', label: 'Toutes les catégories' },
        ...Object.entries(categories).map(([slug, nom]) => ({ value: slug, label: nom }))
    ];

    const sortOptions = [
        { value: '', label: 'Par défaut' },
        { value: 'price_asc', label: 'Prix croissant' },
        { value: 'price_desc', label: 'Prix décroissant' },
        { value: 'rating', label: 'Mieux notés' },
        { value: 'recent', label: 'Plus récents' },
    ];

    const hasLocalChanges =
        local.category !== filters.category ||
        local.city !== filters.city ||
        local.sort !== filters.sort ||
        local.radius !== filters.radius;

    const handleReset = () => {
        const empty = { category: '', city: '', sort: '', lat: undefined, lng: undefined, radius: undefined };
        setLocal(empty);
        onApply(empty);
        onClose();
    };

    const handleApply = () => {
        onApply(local);
        onClose();
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 z-[998] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[999] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <H3 className="font-black uppercase italic tracking-tight">Filtres</H3>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Contenu */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

                    {/* Tri */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown size={16} className="text-primary" />
                            <Label>Trier par</Label>
                        </div>
                        <Select
                            value={local.sort}
                            onChange={(e) => setLocal(l => ({ ...l, sort: e.target.value }))}
                            options={sortOptions}
                            placeholder="Par défaut"
                        />
                    </div>

                    {/* Catégorie */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Tag size={16} className="text-primary" />
                            <Label>Catégorie</Label>
                        </div>
                        <Select
                            value={local.category}
                            onChange={(e) => setLocal(l => ({ ...l, category: e.target.value }))}
                            options={categoryOptions}
                            placeholder="Toutes les catégories"
                        />
                    </div>

                    {/* Ville avec autocomplete */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-primary" />
                            <Label>Ville</Label>
                        </div>

                        <div className="relative">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={local.city}
                                    onChange={(e) => {
                                        setLocal(l => ({ ...l, city: e.target.value, lat: undefined, lng: undefined }));
                                        searchCities(e.target.value);
                                    }}
                                    onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
                                    placeholder="Ex : Dole, Paris..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors text-sm pr-10"
                                />
                                {local.city && (
                                    <button
                                        onClick={clearCity}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                                {cityLoading && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            {/* Suggestions */}
                            {showSuggestions && citySuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
                                    {citySuggestions.map((city, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => selectCity(city)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between gap-2 border-b border-gray-50 last:border-0"
                                        >
                                            <span className="text-sm font-semibold text-dark">{city.nom}</span>
                                            <span className="text-xs text-gray-400 shrink-0">{city.codesPostaux[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Slider rayon — affiché seulement si ville avec coords sélectionnée */}
                        {local.lat && local.lng && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Rayon de recherche</Label>
                                    <span className="text-sm font-black text-primary">{local.radius || 30} km</span>
                                </div>
                                <input
                                    type="range"
                                    min={5}
                                    max={100}
                                    step={5}
                                    value={local.radius || 30}
                                    onChange={(e) => setLocal(l => ({ ...l, radius: e.target.value }))}
                                    className="w-full accent-primary"
                                />
                                <div className="flex justify-between text-xs text-gray-400 font-bold">
                                    <span>5 km</span>
                                    <span>100 km</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
                    <Button variant="ghost" onClick={handleReset} className="flex-1">
                        Réinitialiser
                    </Button>
                    <Button variant="primary" onClick={handleApply} className="flex-1" disabled={!hasLocalChanges}>
                        Appliquer
                    </Button>
                </div>
            </div>
        </>
    );
}