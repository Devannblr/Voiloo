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
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // 1. Auth + catégories + click outside
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
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            router.push(`/explorer?query=${searchValue}`);
            setShowSuggestions(false);
        }
    };
    useEffect(() => {
        if (!searchValue || searchValue.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false); // ← ajoute ça
            return;
        }

        const timeout = setTimeout(() => {
            apiService.getAnnonces({ query: searchValue })
                .then((data) => {
                    setSuggestions(data.data?.slice(0, 5) || []);
                    setShowSuggestions(true);
                });
        }, 300);

        return () => clearTimeout(timeout);

    }, [searchValue]);

    // 2. Scroll
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

    // 3. Déconnexion
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

                    {/* 1. BLOC GAUCHE : Logo & Menu */}
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
                                            aria-label="Supprimer le filtre"
                                        >
                                            <X size={11} />
                                        </span>
                                    </span>
                                ) : (
                                    <svg
                                        width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2.5"
                                        strokeLinecap="round" strokeLinejoin="round"
                                        className={`transition-transform duration-200 ${showExplore ? 'rotate-180' : ''}`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                )}
                            </button>

                            {showExplore && (
                                <div className="absolute top-full left-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-beige/20 overflow-hidden text-dark">

                                    <button
                                        onClick={() => handleNavigate('/explorer')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left ${!activeCategory ? 'bg-primary/5' : ''}`}
                                    >
                                        <LayoutGrid size={16} className="text-primary shrink-0" />
                                        <span className="text-sm font-bold text-dark">Toutes les catégories</span>
                                        {!activeCategory && (
                                            <span className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
                                        )}
                                    </button>

                                    <div className="border-t border-gray-100 mx-3" />

                                    {displayedCategories.map((cat: any) => {
                                        const isActive = activeCategory === cat.slug;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleNavigate(`/explorer?category=${cat.slug}`)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left ${isActive ? 'bg-primary/10' : ''}`}
                                            >
                                                <span className="text-sm font-semibold text-dark flex-1">{cat.nom}</span>
                                                {isActive && (
                                                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}

                                    {categories.length > 5 && (
                                        <>
                                            <div className="border-t border-gray-100 mx-3" />
                                            <button
                                                onClick={() => handleNavigate('/explorer')}
                                                className="w-full text-center text-xs font-semibold text-primary hover:text-primary/70 py-3 transition-colors"
                                            >
                                                Voir toutes les catégories →
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. BLOC CENTRE : Recherche */}
                    <div className="flex justify-center w-full">
                        <div className="relative w-full max-w-xl">
                            <Input
                                placeholder="Rechercher un freelance..."
                                value={searchValue}
                                onKeyDown={handleEnter}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                leftIcon={<Search size={20} />}
                            />

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white text-dark rounded-2xl shadow-xl mt-2 overflow-hidden z-50">
                                    {suggestions.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                router.push(`/explorer?query=${item.titre}`);
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                                        >
                                            <div className="font-semibold">{item.titre}</div>
                                            <div className="text-xs text-gray-400">{item.ville}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>



                    {/* 3. BLOC DROITE : Actions & Auth */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link href="/ajouter" className="text-white whitespace-nowrap" rightIcon={<Plus className="text-primary" size={20} />}>
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
                                    href="/profil"
                                />
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
}

export const Header = () => {
    return (
        <Suspense fallback={null}>
            <HeaderContent />
        </Suspense>
    );
};