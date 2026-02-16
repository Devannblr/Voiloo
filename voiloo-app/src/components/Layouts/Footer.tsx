'use client';

import React from 'react';
import { Container, Small, Link } from '@/components/Base';
import { Logo } from "@/components/Base/logo";
import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    // --- TES BASES COMMUNES ---
    const columnTitle = "font-accent text-primary text-lg mb-4 block";
    // Ajout de 'block' ou 'w-full' pour que le lien occupe toute la ligne
    const linkStyle = "text-white/70 hover:text-primary transition-colors text-sm block mb-2";
    // La base pour tes conteneurs de listes
    const colBase = "flex flex-col gap-1";

    return (
        <footer className="w-full bg-dark text-white border-t border-white/5 pt-12 pb-24 md:pb-12">
            <Container>
                {/* VERSION DESKTOP */}
                <div className="hidden md:grid grid-cols-5 gap-8 mb-12">

                    {/* Colonne 1 : Pitch */}
                    <div className="flex flex-col gap-4">
                        <Logo voilColor="var(--color-white)" ooColor="var(--color-primary)" />
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
                            <Link href="/annonces" className={linkStyle}>Annonces</Link>
                            <Link href="/profil" className={linkStyle}>Mon Profil</Link>
                        </div>
                    </div>

                    {/* Colonne 3 : Plateforme */}
                    <div>
                        <span className={columnTitle}>Plateforme</span>
                        <div className={colBase}>
                            <Link href="/comment-ca-marche" className={linkStyle}>Comment ça marche</Link>
                            <Link href="/devenir-prestataire" className={linkStyle}>Proposer un service</Link>
                            <Link href="/blog" className={linkStyle}>Blog & Actu</Link>
                        </div>
                    </div>

                    {/* Colonne 4 : Aide */}
                    <div>
                        <span className={columnTitle}>Aide</span>
                        <div className={colBase}>
                            <Link href="/faq" className={linkStyle}>FAQ</Link>
                            <Link href="/contact" className={linkStyle}>Contact</Link>
                            <Link href="/mentions-legales" className={linkStyle}>Légal</Link>
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

                {/* VERSION MOBILE */}
                <div className="md:hidden flex flex-col items-center gap-8 mb-8 text-center">
                    <Logo voilColor="var(--color-white)" ooColor="var(--color-primary)" />
                    <div className={colBase}>
                        <Link href="/faq" className={linkStyle}>FAQ</Link>
                        <Link href="/contact" className={linkStyle}>Contact</Link>
                        <Link href="/mentions-legales" className={linkStyle}>Légal</Link>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <Small className="text-white/30 text-[10px]">
                        © {currentYear} Voiloo. Tous droits réservés.
                    </Small>
                    <div className="flex gap-4 items-center">
                        <Mail size={14} className="text-white/30" />
                        <Small className="text-white/30 text-[10px]">hello@voiloo.fr</Small>
                    </div>
                </div>
            </Container>
        </footer>
    );
};