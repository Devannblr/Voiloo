'use client';

import React, { useState } from 'react'; // Importer useState
import {Container, Button, TextAccent, H3, P, H1} from '@/components/Base';
import { Search, MapPin } from "lucide-react";
import dynamic from 'next/dynamic';
import { DynamicMap } from "@/components/Modules/DynamicMap";
import { DoubleSearchInput } from "@/components/Modules";
import {Logo} from "@/components/Base/logo";

export const HeroSection = () => {
    // 1. DÉCLARATION DES STATES À L'INTÉRIEUR DU COMPOSANT
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

    // 2. DÉCLARATION DE LA FONCTION DE RECHERCHE À L'INTÉRIEUR
    const handleSearch = () => {
        console.log("Recherche de :", searchQuery, "à :", location);
        // Logique de redirection ou API ici
    };
    const DynamicMap = dynamic(
        () => import('@/components/Modules/DynamicMap').then((mod) => mod.DynamicMap),
        {
            ssr: false, // Désactive le rendu serveur pour ce composant
            loading: () => <div className="w-full h-full bg-dark/50 animate-pulse rounded-2xl flex items-center justify-center text-white/20">Chargement de la carte...</div>
        }
    );
    return (
        <section className="w-full bg-dark pt-12 pb-20 md:pt-20 md:pb-32 text-white overflow-hidden">
            <Container>
                <div className="w-full md:hidden mb-12 flex justify-center">
                    <Logo size={200}/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* 1. BLOC GAUCHE : LA CARTE DYNAMIQUE */}
                    <div className="relative order-2 lg:order-1 group">
                        <div className="relative z-10 w-full aspect-square max-w-[500px] mx-auto rounded-3xl overflow-hidden border-8 border-primary/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                            <DynamicMap />
                        </div>

                        {/* Effet de lueur derrière la carte */}
                        <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -z-1 opacity-50" />
                    </div>

                    {/* 2. BLOC DROITE : TEXTE & RECHERCHE */}
                    <div className="flex flex-col gap-8 order-1 lg:order-2">
                        <div className="space-y-4">
                            <H1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                Ne cherchez pas plus loin.
                            </H1>
                            <H3 className="md:text-2xl text-white/80 font-medium">
                                Tout ce dont vous avez besoin est près de <TextAccent>chez vous !</TextAccent>
                            </H3>
                        </div>

                        {/* 3. UTILISATION DU DOUBLESEARCH */}
                        <DoubleSearchInput
                            whatValue={searchQuery}
                            onWhatChange={setSearchQuery}
                            whereValue={location}
                            onWhereChange={setLocation}
                            onSearch={handleSearch}
                            // Retiré le max-w-3xl mx-auto ici car dans le Hero,
                            // il doit s'aligner sur le texte à gauche, pas se centrer.
                            className="w-full"
                        />

                        {/* BOUTON DÉCOUVRIR */}
                        <div className={"justify-center flex md:justify-start"}>
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