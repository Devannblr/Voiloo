'use client';

import React, { useState, useEffect } from 'react';
import { Container, Button, TextAccent, H3, H1 } from '@/components/Base';
import dynamic from 'next/dynamic';
import { DoubleSearchInput } from "@/components/Modules";
import { Logo } from "@/components/Base/logo";
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';

const DynamicMap = dynamic(
    () => import('@/components/Modules/DynamicMap').then((mod) => mod.DynamicMap),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-dark/50 animate-pulse rounded-2xl flex items-center justify-center text-white/20">
                Chargement de la carte...
            </div>
        )
    }
);

export const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [annonces, setAnnonces] = useState<any[]>([]);

    const router = useRouter();

    useEffect(() => {
        // ✅ Vérifie que ton API renvoie bien prix, ville et titre ici !
        apiService.getMapPoints()
            .then((data) => {
                setAnnonces(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Erreur chargement points map:", err);
                setAnnonces([]);
            });
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('query', searchQuery);
        if (location) params.append('city', location);
        router.push(`/explorer?${params.toString()}`);
    };

    return (
        <section className="w-full bg-dark pt-12 pb-20 md:pt-20 md:pb-32 text-white overflow-hidden">
            <Container>
                <div className="w-full md:hidden mb-12 flex justify-center">
                    <Logo size={200} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative order-2 lg:order-1 group">
                        {/* ✅ FIX MOBILE : Ajout de min-h-[350px] pour éviter que la map disparaisse.
                            On s'assure que DynamicMap reçoit les annonces chargées avec prix/ville.
                        */}
                        <div className="relative z-10 w-full aspect-square md:aspect-auto md:h-[500px] min-h-[350px] max-w-[500px] mx-auto rounded-3xl overflow-hidden border-8 border-primary/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                            <DynamicMap points={annonces} />
                        </div>
                        <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -z-1 opacity-50" />
                    </div>

                    <div className="flex flex-col gap-8 order-1 lg:order-2">
                        <div className="space-y-4">
                            <H1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                Ne cherchez pas plus loin.
                            </H1>
                            <H3 className="md:text-2xl text-white/80 font-medium">
                                Tout ce dont vous avez besoin est près de <TextAccent>chez vous !</TextAccent>
                            </H3>
                        </div>

                        <DoubleSearchInput
                            whatValue={searchQuery}
                            onWhatChange={setSearchQuery}
                            whereValue={location}
                            onWhereChange={setLocation}
                            onSearch={handleSearch}
                            className="w-full"
                        />

                        <div className="justify-center flex md:justify-start">
                            <Button href={"/explorer"}>
                                Découvrir →
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};