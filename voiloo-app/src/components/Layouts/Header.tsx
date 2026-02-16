'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Input,
    Link,
    Button,
    IconButton,
} from '@/components/Base';
import {
    Search,
    Plus,
    MessageSquare,
    User,
    ChevronDown,
    LogOut,
} from "lucide-react";
import { Logo } from "@/components/Base/logo";

export const Header = () => {
    const [visible, setVisible] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const lastScrollY = useRef(0);
    const scrollDownAccum = useRef(0);
    const HIDE_THRESHOLD = 200;

    // 1. Vérification de l'authentification au montage
    useEffect(() => {
        const token = localStorage.getItem('voiloo_token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // 2. Gestion du scroll (ton code existant)
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            if (currentY < 50) {
                setVisible(true);
                scrollDownAccum.current = 0;
            } else if (delta > 0) {
                scrollDownAccum.current += delta;
                if (scrollDownAccum.current > HIDE_THRESHOLD) {
                    setVisible(false);
                }
            } else {
                scrollDownAccum.current = 0;
                setVisible(true);
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. Fonction de déconnexion
    const handleLogout = () => {
        localStorage.removeItem('voiloo_token');
        setIsLoggedIn(false);
        window.location.href = '/'; // Redirection pour reset l'état proprement
    };

    return (
        <header className={`w-full bg-dark text-white py-3 hidden md:block sticky top-0 z-[100] transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
            <Container>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">

                    {/* 1. BLOC GAUCHE : Logo & Menu */}
                    <div className="flex items-center gap-6">
                        <Logo voilColor="var(--color-white)" ooColor="var(--color-primary)" href={"/"}/>
                        <Link href="/explorer" className="text-white" variant="nav" rightIcon={<ChevronDown size={20}/>}>
                            Explorer
                        </Link>
                    </div>

                    {/* 2. BLOC CENTRE : Recherche */}
                    <div className="flex justify-center w-full">
                        <div className="relative w-full max-w-xl group">
                            <Input
                                placeholder="Rechercher un freelance..."
                                leftIcon={<Search size={20} />}
                            />
                        </div>
                    </div>

                    {/* 3. BLOC DROITE : Actions & Auth */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link href="/ajouter" className="text-white whitespace-nowrap" rightIcon={<Plus className="text-primary" size={20}/>}>
                            Ajouter une annonce
                        </Link>

                        {isLoggedIn ? (
                            <div className="flex items-center gap-2">
                                <IconButton
                                    label="Messages"
                                    icon={<MessageSquare size={22} />}
                                    variant="ghost"
                                    className="text-white hover:text-primary"
                                    href="/messages"
                                />
                                <IconButton
                                    label="Mon Profil"
                                    icon={<User size={22} />}
                                    variant="ghost"
                                    className="text-white hover:text-primary"
                                    href="/profile"
                                />
                                {/* Bouton de déconnexion pour tes tests */}
                                <IconButton
                                    label="Déconnexion"
                                    icon={<LogOut size={20} />}
                                    variant="ghost"
                                    className="text-white hover:text-red-500"
                                    onClick={handleLogout}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-white text-sm font-bold">
                                    Se connecter
                                </Link>
                                <Button href="/register" variant="primary" size="sm">
                                    S'inscrire
                                </Button>
                            </div>
                        )}
                    </div>

                </div>
            </Container>
        </header>
    );
};