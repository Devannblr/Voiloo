'use client';

import React from 'react';

interface VitrineNavProps {
    items: { id: string; label: string }[];
    isOwner: boolean;
    primary: string;
    textColor: string;
    bgColor: string; // Ajout de la couleur de fond
    onSelect: (id: string) => void;
}

export default function VitrineNav({ items, isOwner, primary, textColor, bgColor, onSelect }: VitrineNavProps) {
    if (!items || !items.length) return null;

    return (
        <nav
            className="sticky z-40 border-b border-gray-100 backdrop-blur-md transition-colors duration-300"
            style={{
                top: isOwner ? '48px' : '0',
                backgroundColor: `${bgColor}CC` // On ajoute 'CC' pour garder 80% d'opacité (Alpha en Hex)
            }}
        >
            <div className="max-w-3xl mx-auto px-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
                {items.map((item: any) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className="group relative px-4 py-4 text-sm font-bold whitespace-nowrap transition-colors opacity-70 hover:opacity-100"
                        style={{ color: textColor }}
                    >
                        {item.label}

                        {/* Barre d'accentuation au survol */}
                        <span
                            className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                            style={{ backgroundColor: primary }}
                        />
                    </button>
                ))}
            </div>

            {/* Ligne de fond très subtile */}
            <div
                className="h-[1px] w-full"
                style={{ backgroundColor: primary, opacity: 0.1 }}
            />
        </nav>
    );
}