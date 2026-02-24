'use client';

import React from 'react';
import { Container, Small, Link } from '@/components/Base';
import { Logo } from "@/components/Base/logo";
import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    // --- TES BASES COMMUNES ---
    const columnTitle = "font-accent text-primary text-lg mb-4 block";
    const linkStyle = "text-white/70 hover:text-primary transition-colors text-sm block mb-2";
    const colBase = "flex flex-col gap-1";

    return (
        <footer className="w-full bg-dark text-white border-t border-white/5 pt-12 pb-24 md:pb-12">
            <Container>
                {/* VERSION DESKTOP */}
                <div className="hidden md:grid grid-cols-5 gap-8 mb-12">

                    {/* Colonne 1 : Pitch */}
                    <div className="flex flex-col gap-4">
                        <Logo voilColor="var(--color-white)" ooColor="var(--color-primary)" href={"/"}/>
                        <p className="text-sm text-white/60 leading-relaxed">
                            La plateforme qui connecte les talents locaux. Simple, visuel, direct.
                        </p>
                    </div>

                    {/* Colonne 2 : Pages */}
                    <div>
                        <span className={columnTitle}>Pages</span>
                        <div className={colBase}>
                            <Link href="/" className={linkStyle}>Accueil</Link>
                            <Link href="/explorer" className={linkStyle}>Explorer</Link>
                            <Link href="/favoris" className={linkStyle}>Favoris</Link>
                            <Link href="/profil" className={linkStyle}>Mon Profil</Link>
                        </div>
                    </div>

                    {/* Colonne 3 : Plateforme (Mise à jour ✅) */}
                    <div>
                        <span className={columnTitle}>Plateforme</span>
                        <div className={colBase}>
                            {/* Liens vers les futures pages ou ancres */}
                            <Link href="/concept" className={linkStyle}>Comment ça marche</Link>
                            <Link href="/register" className={linkStyle}>Devenir prestataire</Link>
                            <Link href="/blog" className={linkStyle}>Blog & Actu</Link>
                        </div>
                    </div>

                    {/* Colonne 4 : Aide (Mise à jour ✅) */}
                    <div>
                        <span className={columnTitle}>Aide & Légal</span>
                        <div className={colBase}>
                            <Link href="/faq" className={linkStyle}>FAQ</Link>
                            <Link href="/contact" className={linkStyle}>Contact</Link>
                            <Link href="/mentions-legales" className={linkStyle}>Mentions Légales</Link>
                            <Link href="/politique-confidentialite" className={linkStyle}>Confidentialité</Link>
                        </div>
                    </div>

                    {/* Colonne 5 : Réseaux */}
                    <div>
                        <span className={columnTitle}>Suivez-nous</span>
                        <div className="flex gap-4">
                            <Instagram size={20} className="cursor-pointer hover:text-primary transition-colors" />
                            <Twitter size={20} className="cursor-pointer hover:text-primary transition-colors" />
                            <Linkedin size={20} className="cursor-pointer hover:text-primary transition-colors" />
                        </div>
                    </div>
                </div>

                {/* VERSION MOBILE (Mise à jour ✅) */}
                <div className="md:hidden flex flex-col items-center gap-8 mb-8 text-center">
                    <Logo voilColor="var(--color-white)" ooColor="var(--color-primary)" href={"/"}/>
                    <div className={colBase}>
                        <Link href="/" className={linkStyle}>Accueil</Link>
                        <Link href="/mentions-legales" className={linkStyle}>Mentions Légales</Link>
                        <Link href="/politique-confidentialite" className={linkStyle}>Confidentialité</Link>
                        <Link href="/contact" className={linkStyle}>Contact</Link>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <Small className="text-white/30 text-[10px]">
                        © {currentYear} Voiloo. Tous droits réservés.
                    </Small>
                    <div className="flex gap-4 items-center">
                        <Mail size={14} className="text-white/30" />
                        <Small className="text-white/30 text-[10px]">contact@voiloo.fr</Small>
                    </div>
                </div>
            </Container>
        </footer>
    );
};