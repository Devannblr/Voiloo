'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Container, Loader, Button, Link, H4, P } from '@/components/Base';
import { ProfilCard, AboutSection, QuickLinksCard } from '@/components/Modules/ProfilCard';
import { Settings, ArrowLeft, LogIn, UserPlus, LogOut } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
    const { request, isLoading } = useApi();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [isAuthError, setIsAuthError] = useState(false);

    const fetchProfil = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('voiloo_token') : null;
        if (!token) {
            setIsAuthError(true);
            return;
        }

        try {
            const data = await request('/user');
            const clean = {
                ...data,
                name: data.name ?? "",
                username: data.username ?? "",
                localisation: data.localisation ?? "",
                activity: data.activity ?? "",
                bio: data.bio ?? "",
                avatar: data.avatar ?? "/storage/userdefault.png",
            };
            setUserData(clean);

            if (!clean.localisation) getGeoLocation();
        } catch (err: any) {
            console.error("Erreur fetch profil:", err);
            if (err.message?.includes('401') || err.message?.includes('Unauthenticated')) {
                setIsAuthError(true);
            }
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
                response = await request('/user/update', {
                    method: 'POST',
                    body: newData
                });
            } else {
                setUserData((prev: any) => ({ ...prev, ...newData }));
                response = await request('/user/update', {
                    method: 'PUT',
                    body: JSON.stringify(newData)
                });
            }
            if (response.user) {
                await fetchProfil();
            }
        } catch (err) {
            console.error("Erreur update:", err);
            fetchProfil();
        }
    };

    const handleLogout = async () => {
        if (!confirm("Voulez-vous vraiment vous déconnecter ?")) return;
        try {
            await request('/logout', { method: 'POST' }).catch(() => null);
        } finally {
            localStorage.removeItem('voiloo_token');
            router.push('/');
            router.refresh();
        }
    };

    // 1. GESTION DES ERREURS D'AUTH (Ecran Login/Signup)
    if (isAuthError) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="w-full max-w-sm text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-3">
                        <H4 className="text-3xl font-bold">Votre Profil</H4>
                        <P className="text-gray-500">Connectez-vous pour gérer vos annonces, vos favoris et vos paramètres.</P>
                    </div>
                    <div className="space-y-3">
                        <Button
                            className="w-full bg-primary py-4 text-black font-bold text-lg rounded-2xl"
                            leftIcon={<LogIn size={20}/>}
                            onClick={() => router.push('/login')}
                        >
                            Se connecter
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full py-4 font-bold text-lg rounded-2xl border-2"
                            leftIcon={<UserPlus size={20}/>}
                            onClick={() => router.push('/register')}
                        >
                            Créer un compte
                        </Button>
                    </div>
                    <Link href="/" className="text-gray-400 text-sm inline-flex items-center gap-2">
                        <ArrowLeft size={14}/> Retour à la navigation
                    </Link>
                </div>
            </main>
        );
    }

    // 2. CHARGEMENT : Tant qu'on n'a pas de userData, on affiche le loader
    // J'ai enlevé le "&& isLoading" car si userData est null, on DOIT attendre.
    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader size="lg" />
            </div>
        );
    }

    // 3. AFFICHAGE DU PROFIL : Ici, on est CERTAIN que userData n'est plus null
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
                            <div className="flex flex-wrap justify-end gap-2 mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Settings size={16} className="text-primary"/>}
                                    href="/settings"
                                >
                                    Paramètres
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50"
                                    leftIcon={<LogOut size={16}/>}
                                    onClick={handleLogout}
                                >
                                    Déconnexion
                                </Button>
                            </div>
                            {/* Désormais sécurisé : userData est forcément un objet ici */}
                            <ProfilCard user={userData} onUpdate={handleUpdate} />
                        </div>
                        <AboutSection user={userData} onUpdate={handleUpdate} />
                    </div>
                    <div className="md:col-span-4 sticky top-24">
                        <div className="h-[48px] hidden md:block" />
                        <QuickLinksCard user={userData}/>
                    </div>
                </div>
            </Container>
        </main>
    );
}