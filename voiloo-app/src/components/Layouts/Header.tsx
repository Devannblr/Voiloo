'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Input, Link,
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
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const scrollDownAccum = useRef(0);
    const HIDE_THRESHOLD = 200;

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            if (currentY < 50) {
                setVisible(true);
                scrollDownAccum.current = 0;
            } else if (delta > 0) {
                // Scroll vers le bas -> accumule avant de cacher
                scrollDownAccum.current += delta;
                if (scrollDownAccum.current > HIDE_THRESHOLD) {
                    setVisible(false);
                }
            } else {
                // Scroll vers le haut -> on montre direct
                scrollDownAccum.current = 0;
                setVisible(true);
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`w-full bg-dark text-white py-3 hidden md:block sticky top-0 z-[100] transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
            <Container>
                {/* Grid à 3 colonnes : Logo (auto) | Recherche (remplit l'espace) | Actions (auto) */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">

                    {/* 1. BLOC GAUCHE : Logo & Menu */}
                    <div className="flex items-center gap-6">
                        <Logo voilColor="var(--color-white)" ooColor="var(--color-primary)" />

                        <Link href="#" className={"text-white"} variant="nav" rightIcon={<ChevronDown size={20}/>}>Explorer</Link>

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
                            <MessageSquare size={22} className="group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-bold mt-1 uppercase">Message</span>
                        </div>

                        {/* Action Profil */}
                        <div className="flex flex-col items-center cursor-pointer group">
                            <div className="p-0.5 rounded-full border-2 border-transparent group-hover:border-primary transition-all">
                                <User size={22} className="group-hover:text-primary" />
                            </div>
                            <span className="text-[10px] font-bold mt-1 uppercase">Profil</span>
                        </div>
                    </div>

                </div>
            </Container>
        </header>
    );
};
