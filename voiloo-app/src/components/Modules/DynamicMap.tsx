'use client';

import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Sun, Moon } from "lucide-react";

function RecenterMap({ lat, lng }: { lat: number, lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

interface Annonce {
    id: number | string;
    user?: { name?: string };
    title?: string;
    latitude?: number;
    longitude?: number;
    ville?: string;
    price?: number | string;
}

interface DynamicMapProps {
    points?: Annonce[];
}

export const DynamicMap = ({ points = [] }: DynamicMapProps) => {
    const [position, setPosition] = useState<[number, number]>([47.09, 5.49]);
    const [mapMode, setMapMode] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }, []);

    // Filtrer les annonces qui ont des coordonnées valides
    const validPoints = points.filter(
        (p) => p.latitude != null && p.longitude != null
    );

    const tileUrl = mapMode === 'dark'
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">

            {/* BOUTON SWITCH MODE */}
            <button
                onClick={() => setMapMode(mapMode === 'light' ? 'dark' : 'light')}
                className="absolute top-4 right-4 z-[1000] bg-white dark:bg-dark p-2 rounded-full shadow-lg border border-primary/50 hover:scale-110 transition-transform"
            >
                {mapMode === 'light'
                    ? <Moon size={20} className="text-whit" />
                    : <Sun size={20} className="text-primary" />
                }
            </button>

            <MapContainer
                center={position}
                zoom={14}
                scrollWheelZoom={false}
                style={{
                    height: '100%',
                    width: '100%',
                    background: mapMode === 'dark' ? '#202020' : '#f4f4f4'
                }}
            >
                <TileLayer url={tileUrl} attribution='&copy; CARTO' />
                <RecenterMap lat={position[0]} lng={position[1]} />

                {/* POSITION DE L'UTILISATEUR */}
                <CircleMarker
                    center={position}
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

                {/* POINTS DES ANNONCES */}
                {validPoints.map((pro) => (
                    <CircleMarker
                        key={pro.id}
                        center={[pro.latitude!, pro.longitude!]}
                        pathOptions={{
                            color: '#FFD359',
                            fillColor: mapMode === 'dark' ? '#202020' : '#ffffff',
                            fillOpacity: 0.9,
                            weight: 3
                        }}
                        radius={7}
                    >
                        <Popup>
                            <div className="font-sans font-bold">{pro.user?.name ?? 'Prestataire'}</div>
                            <div className="text-xs text-gray-500">{pro.title}</div>
                            {pro.ville && <div className="text-xs">{pro.ville}</div>}
                            {pro.price && <div className="text-xs font-semibold text-primary">{pro.price}€</div>}
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};