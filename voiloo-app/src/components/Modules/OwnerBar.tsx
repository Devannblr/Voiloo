'use client';

import { Pencil, Settings } from 'lucide-react';
import { Button } from "@/components/Base";

interface OwnerBarProps {
    userSlug: string;
    annonceSlug: string;
    primary: string;
}

export default function OwnerBar({ userSlug, annonceSlug, primary }: OwnerBarProps) {
    return (
        <div
            className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-dark shadow-sm"
            style={{ backgroundColor: primary }}
        >
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dark opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-dark"></span>
                </span>
                <span className="truncate max-w-[100px] md:max-w-none">
                    <span className="hidden xs:inline">Mode</span> Aperçu
                </span>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                {/* Bouton Design */}
                <Button
                    href={`/u/${userSlug}/${annonceSlug}/edit`}
                    size="sm"
                    className="bg-black/10 hover:bg-black/20 border-black/5 px-2 md:px-3"
                >
                    <Pencil size={14} />
                    <span className="hidden md:inline ml-2">Style</span>
                </Button>

                {/* Bouton Infos */}
                <Button
                    href={`/u/${userSlug}/${annonceSlug}/edit-info`}
                    variant="primary"
                    size="sm"
                    className="bg-white/50 border-black/10 hover:bg-white/80 px-2 md:px-3"
                >
                    <Settings size={14} />
                    <span className="hidden md:inline ml-2">Modifier l'annonce</span>
                    <span className="md:hidden ml-1 text-[10px]">Infos</span>
                </Button>
            </div>
        </div>
    );
}