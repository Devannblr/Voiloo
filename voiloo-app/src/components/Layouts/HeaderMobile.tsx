'use client';

import React from 'react';
import { IconButton, Small } from '@/components/Base';
import { Search, Heart, Plus, MessageSquare, User } from "lucide-react";
import Link from "next/link";

export const HeaderMobile = () => {
    const iconBase = "text-primary hover:bg-white/10";
    const textBase = "capitalize -mt-1 tracking-tighter text-white";
    const itemContainer = "flex flex-col items-center flex-1";

    return (
        /* Utilisation de "max-md:flex" au lieu de juste "flex" pour être sûr
           que le display flex ne s'applique QUE sur mobile */
        <nav className="fixed bottom-0 left-0 right-0 w-full bg-dark text-white border-t border-white/10 py-2 z-[100] md:hidden">
            <div className="flex justify-around items-center w-full relative px-2">

                <Link href="/explorer" className={itemContainer}>
                    <IconButton label="Explorer" icon={<Search size={22} />} variant="ghost" className={iconBase} />
                    <Small className={textBase}>Explorer</Small>
                </Link>

                <Link href="/favoris" className={itemContainer}>
                    <IconButton label="Favoris" icon={<Heart size={22} />} variant="ghost" className={iconBase} />
                    <Small className={textBase}>Favoris</Small>
                </Link>

                {/* BOUTON CENTRAL */}
                <Link href="/ajouter" className="flex flex-col items-center flex-1">
                    <button className="bg-primary p-4 rounded-full shadow-lg border-4 border-dark flex items-center justify-center active:scale-90 transition-transform" aria-label="Ajouter une annonce">
                        <Plus size={22} className="text-dark" />
                    </button>
                </Link>

                <Link href="/messages" className={itemContainer}>
                    <IconButton label="Messages" icon={<MessageSquare size={22} />} variant="ghost" className={iconBase} />
                    <Small className={textBase}>Message</Small>
                </Link>

                <Link href="/profil" className={itemContainer}>
                    <IconButton label="Profil" icon={<User size={22} />} variant="ghost" className={iconBase} />
                    <Small className={textBase}>Profil</Small>
                </Link>
            </div>
        </nav>
    );
};