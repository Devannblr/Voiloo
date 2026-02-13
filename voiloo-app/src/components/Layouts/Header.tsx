'use client';

import React from 'react';
import {
    Button,
    Container,
    IconButton, Input, Link,
    Small,
    TextAccent
} from '@/components/Base';
import {
    Search,
    Plus,
    MessageSquare,
    User,
    ChevronDown,
} from "lucide-react";
import {Logo} from "@/components/Base/logo";

export const Header = () => {
    return (
        <header className="w-full bg-[#1A1A1A] text-white py-3">
            <Container>
                {/* Grid à 3 colonnes : Logo (auto) | Recherche (remplit l'espace) | Actions (auto) */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">

                    {/* 1. BLOC GAUCHE : Logo & Menu */}
                    <div className="flex items-center gap-6">
                        <Logo variant="long" voiColor="bg-white" ooColor="text-primary" size={150} />

                        <button className="hidden md:flex items-center gap-1 font-semibold hover:text-gray-300 transition-colors text-sm">
                            Explorer <ChevronDown size={16} />
                        </button>
                    </div>

                    {/* 2. BLOC CENTRE : Recherche (Barre pilule) */}
                    <div className="flex justify-center w-full">
                        <div className="relative w-full max-w-xl group">
                            <Input
                                placeholder="Rechercher un freelance..."
                                leftIcon={<Search size={20} />}
                            />
                        </div>
                    </div>

                    {/* 3. BLOC DROITE : Actions & Profil */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Bouton Texte avec Icône */}
                        <Link href="#" className={"text-white"} rightIcon={<Plus className={"text-primary"} size={20}/>}>Ajouter une annonce</Link>


                        {/* Action Message */}
                        <div className="flex flex-col items-center cursor-pointer group">
                            <MessageSquare size={22} className="group-hover:text-[#E6C767] transition-colors" />
                            <span className="text-[10px] font-bold mt-1 uppercase">Message</span>
                        </div>

                        {/* Action Profil */}
                        <div className="flex flex-col items-center cursor-pointer group">
                            <div className="p-0.5 rounded-full border-2 border-transparent group-hover:border-[#E6C767] transition-all">
                                <User size={22} className="group-hover:text-[#E6C767]" />
                            </div>
                            <span className="text-[10px] font-bold mt-1 uppercase">Profil</span>
                        </div>
                    </div>

                </div>
            </Container>
        </header>
    );
};