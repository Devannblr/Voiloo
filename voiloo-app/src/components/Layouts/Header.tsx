'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
    LogOut,
    LayoutGrid,
    X,
} from "lucide-react";
import { Logo } from "@/components/Base/logo";
import { apiService } from '@/services/apiService';
import { useRouter, useSearchParams } from 'next/navigation';

function HeaderContent() {
    const [visible, setVisible] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [showExplore, setShowExplore] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeCategory = searchParams.get('category');

    const lastScrollY = useRef(0);
    const scrollDownAccum = useRef(0);
    const HIDE_THRESHOLD = 200;

    // --- NOUVEAUX STATES POUR LES SUGGESTIONS ---
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Auth + catégories + click outside
    useEffect(() => {
        const token = localStorage.getItem('voiloo_token');
        if (token) setIsLoggedIn(true);

        apiService.getCategories()
            .then(setCategories)
            .catch(err => console.error("Erreur catégories:", err));

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowExplore(false);
            }
            // Fermer les suggestions si on clique ailleurs
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            router.push(`/explorer?query=${encodeURIComponent(searchValue)}`);
            setShowSuggestions(false);
        }
    };

    // --- LOGIQUE DE RECHERCHE MISE À JOUR (Utilise getSuggestions) ---
    useEffect(() => {
        if (!searchValue || searchValue.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timeout = setTimeout(() => {
            // On appelle la nouvelle route globale qui gère u: et a:
            apiService.getSuggestions(searchValue)
                .then((data) => {
                    // On reçoit maintenant des objets unifiés {type, title, subtitle, url, price, avatar}
                    setSuggestions(data || []);
                    setShowSuggestions(true);
                })
                .catch(() => setSuggestions([]));
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchValue]);

    // Scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            if (currentY < 50) {
                setVisible(true);
                scrollDownAccum.current = 0;
            } else if (delta > 0) {
                scrollDownAccum.current += delta;
                if (scrollDownAccum.current > HIDE_THRESHOLD) setVisible(false);
            } else {
                scrollDownAccum.current = 0;
                setVisible(true);
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('voiloo_token');
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    const handleNavigate = (href: string) => {
        router.push(href);
        setShowExplore(false);
    };

    const displayedCategories = categories.slice(0, 5);

    return (
        <header className={`w-full bg-dark text-white py-3 hidden md:block sticky top-0 z-[100] transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
            <Container>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">

                    {/* 1. Logo & Menu */}
                    <div className="flex items-center gap-6">
                        <Logo voilColor="var(--color-white)" ooColor="var(--color-primary)" href={"/"} />

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowExplore(!showExplore)}
                                className="text-white font-bold hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                                Explorer
                                {activeCategory ? (
                                    <span className="flex items-center gap-1 bg-primary text-dark text-xs font-bold px-2 py-0.5 rounded-full">
                                        {activeCategory}
                                        <span
                                            role="button"
                                            onClick={(e) => { e.stopPropagation(); router.push('/explorer'); }}
                                            className="hover:opacity-70 transition-opacity"
                                        >
                                            <X size={11} />
                                        </span>
                                    </span>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${showExplore ? 'rotate-180' : ''}`}>
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                )}
                            </button>

                            {showExplore && (
                                <div className="absolute top-full left-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-beige/20 overflow-hidden text-dark">
                                    <button onClick={() => handleNavigate('/explorer')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left ${!activeCategory ? 'bg-primary/5' : ''}`}>
                                        <LayoutGrid size={16} className="text-primary shrink-0" />
                                        <span className="text-sm font-bold text-dark">Toutes les catégories</span>
                                    </button>
                                    <div className="border-t border-gray-100 mx-3" />
                                    {displayedCategories.map((cat: any) => (
                                        <button key={cat.id} onClick={() => handleNavigate(`/explorer?category=${cat.slug}`)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left">
                                            <span className="text-sm font-semibold text-dark flex-1">{cat.nom}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. CENTRE : Recherche + Suggestions */}
                    <div className="flex justify-center w-full" ref={suggestionsRef}>
                        <div className="relative w-full max-w-xl">
                            <Input
                                placeholder="Rechercher... (u: pour user, a: pour annonce)"
                                value={searchValue}
                                onKeyDown={handleEnter}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                leftIcon={<Search size={20} />}
                            />

                            {/* LE BLOC DE SUGGESTIONS */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white text-dark rounded-2xl shadow-xl mt-2 overflow-hidden z-50 border border-gray-100">
                                    {suggestions.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                // On utilise l'URL envoyée par le backend (qui gère déjà si c'est /u/user ou /u/user/slug)
                                                router.push(item.url);
                                                setShowSuggestions(false);
                                                setSearchValue('');
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {item.subtitle}
                                                </span>
                                            </div>
                                            {item.price && (
                                                <div className="text-xs font-black bg-gray-100 px-2 py-1 rounded-md">
                                                    {item.price}€
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => router.push(`/explorer?query=${encodeURIComponent(searchValue)}`)}
                                        className="w-full text-center py-2 text-[10px] font-black uppercase tracking-tighter text-gray-400 bg-gray-50 hover:text-dark transition-colors"
                                    >
                                        Voir tous les résultats pour "{searchValue}"
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Actions & Auth */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link href="/ajouter" className="text-white whitespace-nowrap" rightIcon={<Plus className="text-primary" size={20} />}>
                            Ajouter une annonce
                        </Link>

                        {isLoggedIn ? (
                            <div className="flex items-center gap-2">
                                <IconButton label="Messages" icon={<MessageSquare size={22} />} variant="ghost" className="text-white hover:text-primary" href="/messages" />
                                <IconButton label="Mon Profil" icon={<User size={22} />} variant="ghost" className="text-white hover:text-primary" href="/profil" />
                                <IconButton label="Déconnexion" icon={<LogOut size={20} />} variant="ghost" className="text-white hover:text-red-500" onClick={handleLogout} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-white text-sm font-bold">Se connecter</Link>
                                <Button href="/register" variant="primary" size="sm">S'inscrire</Button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    );
}

export const Header = () => {
    return (
        <Suspense fallback={null}>
            <HeaderContent />
        </Suspense>
    );
};