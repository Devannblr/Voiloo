'use client';

import React from 'react';
import { Link } from '@/components/Base';

interface LogoProps {
    variant?: 'long' | 'solo';
    size?: number;
    className?: string;
    href?: string;
    // On sépare les couleurs pour avoir le contrôle précis
    voiColor?: string; // ex: "bg-white"
    ooColor?: string;  // ex: "bg-[#FFD359]"
}

export const Logo = ({
                         variant = 'long',
                         size = 130,
                         className = "",
                         href = "/",
                         voiColor = "bg-white",
                         ooColor = "bg-[#FFD359]"
                     }: LogoProps) => {

    const logoContent = (
        <div
            className={`flex items-center ${className}`}
            style={{ width: size, aspectRatio: variant === 'long' ? '2471 / 743' : '1 / 1' }}
        >
            {variant === 'long' && (
                <div
                    style={{
                        width: '74%', // Proportion du texte dans ton viewBox
                        height: '100%',
                        maskImage: `url(/logo-voil.svg)`,
                        WebkitMaskImage: `url(/logo-voil.svg)`,
                        maskRepeat: 'no-repeat',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain'
                    }}
                    className={`${voiColor}`}
                />
            )}
            <div
                style={{
                    width: variant === 'long' ? '26%' : '100%', // Proportion de l'infini
                    height: '100%',
                    maskImage: `url(/logo-oo.svg)`,
                    WebkitMaskImage: `url(/logo-oo.svg)`,
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain'
                }}
                className={`${ooColor}`}
            />
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="inline-block hover:opacity-80 transition-opacity">
                {logoContent}
            </Link>
        );
    }

    return logoContent;
};