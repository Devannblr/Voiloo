'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import {
    Container,
    Loader,
    Button,
} from '@/components/Base';
import {
    ProfilCard,
    AboutSection,
    QuickLinksCard
} from '@/components/Modules/ProfilCard';
import { Settings, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function ProfilePage() {
    const { request, isLoading } = useApi();
    const [userData, setUserData] = useState<any>(null);

    // --- 1. CHARGEMENT DES DONNÉES ---
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await request('/user');

                // --- SÉCURISATION CONTRE LES VALEURS NULL ---
                // On s'assure que chaque champ est au moins une chaîne vide
                const formattedData = {
                    ...data,
                    name: data.name ?? "",
                    username: data.username ?? "",
                    location: data.location ?? "",
                    activity: data.activity ?? "",
                    intent: data.intent ?? "",
                    avatar: data.avatar ?? "/poulet.jpg"
                };

                setUserData(formattedData);
            } catch (err) {
                console.error("Erreur lors de la récupération du profil:", err);
            }
        };

        fetchProfile();
    }, []);

    // --- 2. MISE À JOUR DES DONNÉES ---
    const handleUpdate = async (newData: any) => {
        try {
            // Mise à jour locale (Optimistic UI)
            setUserData((prev: any) => ({ ...prev, ...newData }));

            await request('/user/update', {
                method: 'PUT',
                body: JSON.stringify(newData),
            });

            console.log("Profil mis à jour avec succès");
        } catch (err) {
            console.error("Erreur lors de la sauvegarde :", err);
        }
    };

    if (!userData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader variant="spinner" size="lg" color="primary" />
                <span className="text-gray-500 font-medium italic">Chargement de votre profil Voiloo...</span>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white py-12">
            <Container>
                <div className="mb-8 flex justify-between items-center">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-dark transition-colors">
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Retour au tableau de bord</span>
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

                            <ProfilCard
                                user={userData}
                                onUpdate={handleUpdate}
                            />
                        </div>

                        <AboutSection
                            user={userData}
                            onUpdate={handleUpdate}
                        />
                    </div>

                    <div className="md:col-span-4 sticky top-24">
                        <div className="h-[48px] hidden md:block" />
                        <QuickLinksCard />

                        <div className="mt-6 p-6 bg-beige/10 rounded-2xl border border-beige/30">
                            <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                                État du compte
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success" />
                                <span className="text-sm font-bold text-dark">Vérifié & Actif</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}