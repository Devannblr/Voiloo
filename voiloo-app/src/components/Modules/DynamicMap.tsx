'use client';

import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import { Sun, Moon, MapPin, X  } from "lucide-react";
import {useToast} from "@/components/Layouts/Toastprovider";

const POSITION_STORAGE_KEY = 'voiloo_user_position';

// ✅ SOLUTION DÉFINITIVE : Force la map à s'adapter à la taille de son parent
function MapResizer() {
    const map = useMap();
    const [parent, setParent] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setParent(map.getContainer().parentElement);
    }, [map]);

    useEffect(() => {
        if (!parent) return;

        const observer = new ResizeObserver(() => {
            map.invalidateSize();
        });

        observer.observe(parent);
        return () => observer.disconnect();
    }, [parent, map]);

    return null;
}

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
    user?: { name?: string; username?: string; };
    titre?: string;
    lat?: number | string;
    lng?: number | string;
    ville?: string;
    prix?: number | string;
}

export const DynamicMap = ({ points = [] }: { points?: Annonce[] }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [viewCenter, setViewCenter] = useState<[number, number]>([47.109556, 5.509639]);
    const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const [mapMode, setMapMode] = useState<'light' | 'dark'>('light');
    const [showLocBanner, setShowLocBanner] = useState(false);
    const { toast } = useToast();
    const posObtained = useRef(false);

    useEffect(() => {
        setIsMounted(true);
        const savedPos = localStorage.getItem(POSITION_STORAGE_KEY);
        if (savedPos) {
            try {
                const parsed = JSON.parse(savedPos);
                setUserPos([parsed.lat, parsed.lng]);
                setViewCenter([parsed.lat, parsed.lng]);
            } catch (e) {}
            return;
        }

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    posObtained.current = true;
                    const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                    setUserPos(newPos);
                    setViewCenter(newPos);
                    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({ lat: newPos[0], lng: newPos[1] }));
                },
                () => setShowLocBanner(true),
                { enableHighAccuracy: false, timeout: 5000 }
            );

            setTimeout(() => {
                if (!posObtained.current) setShowLocBanner(true);
            }, 1000);
        } else {
            setShowLocBanner(true);
        }
    }, []);

    const handleLocate = () => {
        if (!("geolocation" in navigator)) return;
        setShowLocBanner(false);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserPos(newPos);
                setViewCenter(newPos);
                localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({ lat: newPos[0], lng: newPos[1] }));
            },
            (err) => {
                setShowLocBanner(true);
                if (err.code === 1) {
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                    const isAndroid = /Android/.test(navigator.userAgent);

                    if (isIOS) {
                        toast.error('Localisation refusée. Réglages → Confidentialité → Service de localisation → Safari Sites web → Lors de l\'utilisation');
                    } else if (isAndroid) {
                        toast.error('Localisation refusée. Paramètres → Applications → Chrome → Autorisations → Localisation');
                    } else {
                        toast.error('Localisation refusée. Cliquez sur 🔒 dans la barre d\'adresse → Autorisations → Localisation');
                    }
                } else if (err.code === 2) {
                    toast.error('Position introuvable. Réessayez dans un moment.');
                } else {
                    toast.error('Délai dépassé. Réessayez.');
                }
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
        );
    };
    const validPoints = points.filter(p =>
        p.lat && p.lng && !isNaN(parseFloat(String(p.lat))) && !isNaN(parseFloat(String(p.lng)))
    );

    const tileUrl = mapMode === 'dark'
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    if (!isMounted) return <div className="w-full h-full bg-stone-100 animate-pulse" />;

    return (
        <div className="relative w-full h-full bg-stone-100 overflow-hidden">
            <button
                type="button"
                onClick={() => setMapMode(mapMode === 'light' ? 'dark' : 'light')}
                className="absolute top-4 right-4 z-[1000] bg-white dark:bg-stone-900 p-2 rounded-full shadow-lg border border-primary/50"
            >
                {mapMode === 'light' ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-primary" />}
            </button>
            <button
                type="button"
                onClick={handleLocate}
                className="absolute bottom-4 left-4 z-[1000] bg-white p-2 rounded-full shadow-lg border border-primary/50"
            >
                <MapPin size={20} className="text-primary" />
            </button>
            {showLocBanner && !userPos && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-2xl shadow-lg border border-primary/20 flex items-center gap-3 whitespace-nowrap">
                    <MapPin size={16} className="text-primary shrink-0" />
                    <span className="text-xs font-bold text-gray-600">Activez la localisation pour vous situer</span>
                    <button onClick={() => setShowLocBanner(false)} className="text-gray-300 hover:text-gray-500">
                        <X size={14} />
                    </button>
                </div>
            )}
            <MapContainer
                center={viewCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ height: '100%', width: '100%', position: 'absolute' }}
            >
                <TileLayer url={tileUrl} attribution='&copy; CARTO' />
                <MapResizer />
                <RecenterMap lat={viewCenter[0]} lng={viewCenter[1]} />

                {userPos && (
                    <CircleMarker center={userPos} pathOptions={{ color: '#FFD359', fillColor: '#FFD359', fillOpacity: 1 }} radius={8}>
                        <Popup>Tu es ici !</Popup>
                    </CircleMarker>
                )}

                {validPoints.map((pro) => (
                    <CircleMarker
                        key={pro.id}
                        center={[parseFloat(String(pro.lat)), parseFloat(String(pro.lng))]}
                        pathOptions={{ color: '#FFD359', fillColor: mapMode === 'dark' ? '#202020' : '#ffffff', fillOpacity: 1, weight: 3 }}
                        radius={7}
                    >
                        <Popup>
                            <div className="font-sans min-w-[150px]">
                                <div className="font-bold text-sm">{pro.user?.username || 'Prestataire'}</div>
                                <div className="text-[11px] italic mb-2">{pro.titre}</div>
                                <div className="flex items-center justify-between border-t pt-1">
                                    <span className="text-xs font-black text-primary">{pro.prix ? `${pro.prix}€` : 'Sur devis'}</span>
                                    <span className="text-[10px] bg-gray-100 px-2 rounded uppercase font-bold">{pro.ville}</span>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};