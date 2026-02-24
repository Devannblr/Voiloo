'use client';

import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Sun, Moon } from "lucide-react";

// Clé pour le stockage local
const POSITION_STORAGE_KEY = 'voiloo_user_position';

// Petit composant pour recentrer la map quand la position change
function RecenterMap({ lat, lng }: { lat: number, lng: number }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);
    return null;
}

interface Annonce {
    id: number | string;
    user?: {
        name?: string;
        username?: string;
    };
    titre?: string;
    lat?: number | string;
    lng?: number | string;
    ville?: string;
    prix?: number | string;
}

interface DynamicMapProps {
    points?: Annonce[];
}

export const DynamicMap = ({ points = [] }: DynamicMapProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [viewCenter, setViewCenter] = useState<[number, number]>([47.109556, 5.509639]);
    const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const [mapMode, setMapMode] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        setIsMounted(true);

        const savedPos = localStorage.getItem(POSITION_STORAGE_KEY);
        if (savedPos) {
            try {
                const parsed = JSON.parse(savedPos);
                const coords: [number, number] = [parsed.lat, parsed.lng];
                setUserPos(coords);
                setViewCenter(coords);
            } catch (e) {
                console.error("Erreur lecture position");
            }
        }

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                    setUserPos(newPos);
                    setViewCenter(newPos);
                    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    }));
                },
                () => console.log("Géo bloquée"),
                { enableHighAccuracy: false, timeout: 5000 }
            );
        }
    }, []);

    // On filtre les points qui ont au moins des coordonnées
    const validPoints = points.filter(p =>
        p.lat !== null && p.lng !== null &&
        !isNaN(parseFloat(String(p.lat))) &&
        !isNaN(parseFloat(String(p.lng)))
    );

    const tileUrl = mapMode === 'dark'
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    if (!isMounted) {
        return <div className="w-full h-full bg-stone-100 animate-pulse rounded-2xl flex items-center justify-center text-stone-400 italic">Chargement Voiloo Map...</div>;
    }

    return (
        <div className="relative w-full h-full z-0 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl bg-stone-100 min-h-[300px]">

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setMapMode(mapMode === 'light' ? 'dark' : 'light');
                }}
                className="absolute top-4 right-4 z-[1000] bg-white dark:bg-stone-900 p-2 rounded-full shadow-lg border border-primary/50 hover:scale-110 transition-transform flex items-center justify-center"
            >
                {mapMode === 'light' ? <Moon size={20} className="text-stone-900 text-white" /> : <Sun size={20} className="text-primary" />}
            </button>

            <MapContainer
                center={viewCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ height: '100%', width: '100%', background: mapMode === 'dark' ? '#202020' : '#f4f4f4' }}
            >
                <TileLayer url={tileUrl} attribution='&copy; CARTO' />
                <RecenterMap lat={viewCenter[0]} lng={viewCenter[1]} />

                {userPos && (
                    <CircleMarker
                        center={userPos}
                        pathOptions={{ color: '#FFD359', fillColor: '#FFD359', fillOpacity: 1, weight: 2 }}
                        radius={8}
                    >
                        <Popup>Tu es ici !</Popup>
                    </CircleMarker>
                )}

                {validPoints.map((pro) => {
                    // ✅ Debugging : on s'assure que les valeurs existent vraiment
                    const displayPrix = pro.prix && parseFloat(String(pro.prix)) > 0
                        ? `${pro.prix}€`
                        : 'Sur devis';

                    const displayVille = pro.ville && pro.ville.trim() !== ""
                        ? pro.ville
                        : "Ville non renseignée";

                    return (
                        <CircleMarker
                            key={pro.id}
                            center={[parseFloat(String(pro.lat)), parseFloat(String(pro.lng))]}
                            pathOptions={{
                                color: '#FFD359',
                                fillColor: mapMode === 'dark' ? '#202020' : '#ffffff',
                                fillOpacity: 1,
                                weight: 3
                            }}
                            radius={7}
                        >
                            <Popup>
                                <div className="font-sans min-w-[150px]">
                                    <div className="font-bold text-sm text-gray-900">
                                        {pro.user?.username || pro.user?.name || 'Prestataire'}
                                    </div>
                                    <div className="text-[11px] text-gray-500 leading-tight mb-2 italic">
                                        {pro.titre || 'Aucun titre'}
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
                                        <span className="text-xs font-black text-primary">
                                            {displayPrix}
                                        </span>
                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                                            {displayVille}
                                        </span>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
};