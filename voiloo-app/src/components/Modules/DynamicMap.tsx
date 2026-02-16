'use client';

import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Sun, Moon } from "lucide-react"; // Pour les icônes du bouton

function RecenterMap({ lat, lng }: { lat: number, lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

export const DynamicMap = () => {
    const [position, setPosition] = useState<[number, number]>([47.09, 5.49]);
    // État pour le mode de la carte : 'light' ou 'dark'
    const [mapMode, setMapMode] = useState<'light' | 'dark'>('light');

    const freelances = [
        { id: 1, name: "Bastien", coords: [47.095, 5.495] as [number, number] },
        { id: 2, name: "Claire", coords: [47.100, 5.480] as [number, number] },
        { id: 3, name: "Titouan", coords: [47.085, 5.505] as [number, number] },
    ];

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }, []);

    // URLs des fonds de carte CartoDB
    const tileUrl = mapMode === 'dark'
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">

            {/* BOUTON DE SWITCH (Flottant) */}
            <button
                onClick={() => setMapMode(mapMode === 'light' ? 'dark' : 'light')}
                className="absolute top-4 right-4 z-[1000] bg-white dark:bg-dark p-2 rounded-full shadow-lg border border-primary/50 hover:scale-110 transition-transform"
            >
                {mapMode === 'light' ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-primary" />}
            </button>

            <MapContainer
                center={position}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', background: mapMode === 'dark' ? '#202020' : '#f4f4f4' }}
            >
                <TileLayer url={tileUrl} attribution='&copy; CARTO' />
                <RecenterMap lat={position[0]} lng={position[1]} />

                {/* TON POINT */}
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

                {/* LES AUTRES POINTS */}
                {freelances.map((pro) => (
                    <CircleMarker
                        key={pro.id}
                        center={pro.coords}
                        pathOptions={{
                            color: '#FFD359',
                            // On change la couleur de fond selon le mode pour que ça ressorte
                            fillColor: mapMode === 'dark' ? '#202020' : '#ffffff',
                            fillOpacity: 0.9,
                            weight: 3
                        }}
                        radius={7}
                    >
                        <Popup>
                            <div className="font-sans font-bold">{pro.name}</div>
                            <div className="text-xs">Freelance à proximité</div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};