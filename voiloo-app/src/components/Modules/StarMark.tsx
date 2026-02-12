import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import {Price, Small} from "@/components/Base";

type StarMarkSize = 'sm' | 'md' | 'lg';
// On définit deux variantes claires
type StarMarkVariant = 'rating' | 'display';

interface StarMarkProps {
    variant?: StarMarkVariant; // Nouveau : pour choisir le mode
    value?: number;
    max?: number;
    size?: StarMarkSize;
    nb_avis?: number;
    onChange?: (val: number) => void;
}

const sizeStyles: Record<StarMarkSize, number> = {
    sm: 16,
    md: 24,
    lg: 32,
};

export const StarMark = ({
                             variant = 'display', // Par défaut, on affiche juste
                             value = 0,
                             max = 5,
                             size = 'md',
                             nb_avis,
                             onChange
                         }: StarMarkProps) => {
    const [hover, setHover] = useState<number | null>(null);

    // Sécurité : le mode 'display' est forcément en lecture seule
    const isReadOnly = variant === 'display';

    return (
        <div className="flex items-center gap-2">
            {/* 1. Affichage de la note textuelle si on est en mode affichage */}
            {isReadOnly && value > 0 && (
                <Price>{value.toFixed(1)}</Price>
            )}

            <div className="flex items-center gap-1">
                {Array.from({ length: max }, (_, i) => {
                    const starNumber = i + 1;

                    // Logique de remplissage :
                    // Si on survole (hover), c'est le hover qui gagne, sinon c'est la valeur réelle.
                    const activeValue = !isReadOnly && hover !== null ? hover : value;

                    const isFull = activeValue >= starNumber;
                    const isHalf = !isFull && activeValue >= starNumber - 0.5;

                    return (
                        <button
                            key={i}
                            type="button"
                            disabled={isReadOnly}
                            className={`
                                transition-all duration-150
                                ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-90'}
                            `}
                            onMouseEnter={() => !isReadOnly && setHover(starNumber)}
                            onMouseLeave={() => !isReadOnly && setHover(null)}
                            onClick={() => !isReadOnly && onChange?.(starNumber)}
                        >
                            {isFull ? (
                                <Star size={sizeStyles[size]} className="fill-yellow-400 text-yellow-400" />
                            ) : isHalf ? (
                                <StarHalf size={sizeStyles[size]} className="fill-yellow-400 text-yellow-400" />
                            ) : (
                                <Star size={sizeStyles[size]} className="text-gray-300 fill-transparent" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* 2. Affichage du nombre d'avis */}
            {nb_avis !== undefined && (
                <Small className="text-gray-500">({nb_avis} avis)</Small>
            )}
        </div>
    );
};