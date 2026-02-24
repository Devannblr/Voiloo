'use client';

import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Sun, Moon } from "lucide-react";

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
    // Crucial pour Next.js : on attend que le composant soit monté côté client
    const [isMounted, setIsMounted] = useState(false);

    const [viewCenter, setViewCenter] = useState<[number, number]>([47.109556, 5.509639]);
    const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const [mapMode, setMapMode] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        setIsMounted(true); // Le client est prêt

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserPos(newPos);
                setViewCenter(newPos);
            }, (err) => {
                console.log("Géolocalisation refusée ou indisponible");
            });
        }
    }, []);

    // Nettoyage et conversion des points en Float
    const validPoints = points.filter(p =>
        p.lat !== null && p.lng !== null &&
        !isNaN(parseFloat(p.lat as string)) &&
        !isNaN(parseFloat(p.lng as string))
    );

    const tileUrl = mapMode === 'dark'
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    // Si on n'est pas sur le client, on affiche un loader ou rien pour éviter l'erreur getPane()
    if (!isMounted) {
        return <div className="w-full h-full bg-stone-100 animate-pulse rounded-2xl" />;
    }

    return (
        <div className="relative w-full h-full z-0 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl bg-stone-100">

            {/* BOUTON SWITCH MODE */}
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setMapMode(mapMode === 'light' ? 'dark' : 'light');
                }}
                className="absolute top-4 right-4 z-[1000] bg-white dark:bg-stone-900 p-2 rounded-full shadow-lg border border-primary/50 hover:scale-110 transition-transform flex items-center justify-center"
            >
                {mapMode === 'light'
                    ? <Moon size={20} className="text-stone-900" />
                    : <Sun size={20} className="text-primary" />
                }
            </button>

            <MapContainer
                center={viewCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{
                    height: '100%',
                    width: '100%',
                    background: mapMode === 'dark' ? '#202020' : '#f4f4f4'
                }}
            >
                <TileLayer url={tileUrl} attribution='&copy; CARTO' />
                <RecenterMap lat={viewCenter[0]} lng={viewCenter[1]} />

                {/* ✅ POSITION DE L'UTILISATEUR */}
                {userPos && (
                    <CircleMarker
                        center={userPos}
                        pathOptions={{
                            color: '#FFD359',
                            fillColor: '#FFD359',
                            fillOpacity: 1,
                            weight: 2
                        }}
                        radius={8}
                    >
                        <Popup>Tu es ici !</Popup>
                    </CircleMarker>
                )}

                {/* POINTS DES ANNONCES */}
                {validPoints.map((pro) => (
                    <CircleMarker
                        key={pro.id}
                        center={[parseFloat(pro.lat as string), parseFloat(pro.lng as string)]}
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
                                <div className="font-bold text-sm">{pro.user?.username ?? 'Prestataire'}</div>
                                <div className="text-[11px] text-gray-500 leading-tight mb-1">{pro.titre}</div>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-1 mt-1">
                                    <span className="text-xs font-black text-primary">
                                        {pro.prix ? `${pro.prix}€` : 'Sur devis'}
                                    </span>
                                    <span className="text-[10px] bg-gray-100 px-1 py-0.5 rounded uppercase font-bold">
                                        {pro.ville}
                                    </span>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};