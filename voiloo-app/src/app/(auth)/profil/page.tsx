'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Container, Loader, Button, Link } from '@/components/Base';
import { ProfilCard, AboutSection, QuickLinksCard } from '@/components/Modules/ProfilCard';
import { Settings, ArrowLeft } from "lucide-react";

export default function ProfilPage() {
    const { request, isLoading } = useApi();
    const [userData, setUserData] = useState<any>(null);

    const fetchProfil = async () => {
        try {
            const data = await request('/user');
            const clean = {
                ...data,
                name: data.name ?? "",
                username: data.username ?? "",
                localisation: data.localisation ?? "",
                activity: data.activity ?? "",
                bio: data.bio ?? "",
                avatar: data.avatar ?? "/poulet.jpg"
            };
            setUserData(clean);

            if (!clean.localisation) getGeoLocation();
        } catch (err) {
            console.error("Erreur fetch profil:", err);
        }
    };

    const getGeoLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.village || "";
                    const country = data.address.country || "";
                    const loc = city && country ? `${city}, ${country}` : city || country;

                    if (loc) handleUpdate({ localisation: loc });
                } catch (e) {
                    console.error("Géo-erreur", e);
                }
            });
        }
    };

    useEffect(() => {
        fetchProfil();
    }, []);

    const handleUpdate = async (newData: any) => {
        try {
            let response;

            if (newData instanceof FormData) {
                // ✅ Upload d'avatar avec FormData
                response = await request('/user/update', {
                    method: 'POST', // POST pour multipart
                    body: newData
                    // Le hook gère automatiquement les headers
                });

            } else {
                // ✅ Mise à jour de texte avec JSON
                // Mise à jour optimiste de l'UI
                setUserData((prev: any) => ({ ...prev, ...newData }));

                response = await request('/user/update', {
                    method: 'PUT',
                    body: JSON.stringify(newData)
                    // Le hook ajoute automatiquement Content-Type: application/json
                });
            }

            // Rafraîchir les données après succès
            if (response.user) {
                await fetchProfil();
            }

        } catch (err) {
            console.error("Erreur update:", err);
            // Annuler le changement optimiste en cas d'erreur
            fetchProfil();
        }
    };

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white py-12">
            <Container>
                <div className="mb-8 flex justify-between items-center">
                    <Link
                        href="/"
                        variant="muted"
                        leftIcon={<ArrowLeft size={20}/>}
                    >
                        Revenir à l'accueil
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-8 space-y-8">
                        <div className="flex flex-col">
                            <div className="flex justify-end mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Settings size={16} className="text-primary"/>}
                                    href="/settings"
                                >
                                    Paramètres du compte
                                </Button>
                            </div>
                            <ProfilCard user={userData} onUpdate={handleUpdate} />
                        </div>
                        <AboutSection user={userData} onUpdate={handleUpdate} />
                    </div>
                    <div className="md:col-span-4 sticky top-24">
                        <div className="h-[48px] hidden md:block" />
                        <QuickLinksCard />
                    </div>
                </div>
            </Container>
        </main>
    );
}