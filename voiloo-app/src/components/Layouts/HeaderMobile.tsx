'use client';

import React from 'react';
import { IconButton, Small, Badge } from '@/components/Base';
import { Home, Search, Plus, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { useChat } from '@/context/ChatContext';

export const HeaderMobile = () => {
    const { unreadTotal } = useChat(); // Récupère les notifications non lues

    const iconBase = "text-primary pointer-events-none";
    const textBase = "capitalize -mt-1 tracking-tighter text-white";
    const itemContainer = "flex flex-col items-center flex-1 rounded-lg active:bg-white/10 transition-colors hover:bg-beige active:bg-beige";

    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full bg-dark text-white border-t border-white/10 py-2 z-[100] md:hidden">
            <div className="flex justify-around items-center w-full relative px-2">

                <Link href="/" className={itemContainer}>
                    <IconButton label="Accueil" icon={<Home size={22} />} variant="ghost" className={iconBase} />
                    <Small className={textBase}>Accueil</Small>
                </Link>

                <Link href="/explorer" className={itemContainer}>
                    <IconButton label="Explorer" icon={<Search size={22} />} variant="ghost" className={iconBase} />
                    <Small className={textBase}>Explorer</Small>
                </Link>

                {/* BOUTON CENTRAL */}
                <Link href="/ajouter" className="flex flex-col items-center flex-1">
                    <button className="bg-primary p-4 rounded-full shadow-lg border-4 border-dark flex items-center justify-center active:scale-90 transition-transform" aria-label="Ajouter une annonce">
                        <Plus size={22} className="text-dark" />
                    </button>
                </Link>

                <Link href="/messages" className={`${itemContainer} relative`}>
                    <IconButton label="Messages" icon={<MessageSquare size={22} />} variant="ghost" className={iconBase} />
                    {unreadTotal > 0 && (
                        <Badge
                            variant="primary"
                            size="sm"
                            className="absolute top-1 right-2 px-1 min-w-[16px] h-[16px] border border-dark text-[9px]"
                        >
                            {unreadTotal}
                        </Badge>
                    )}
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