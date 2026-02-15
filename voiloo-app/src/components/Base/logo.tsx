'use client';

import React from 'react';
import { Link } from '@/components/Base';
import LogoLong from '../../../public/logoLong.svg';
import LogoSolo from '../../../public/logoSolo.svg';

interface LogoProps {
    variant?: 'long' | 'solo';
    size?: number;
    className?: string;
    href?: string;
    voilColor?: string;
    ooColor?: string;
}

export const Logo = ({
    variant = 'long',
    size = 130,
    className = "",
    href = "",
    voilColor = "#FFFFFF",
    ooColor = "#FFD359"
}: LogoProps) => {

    const logoContent = variant === 'long' ? (
        <LogoLong
            width={size}
            height="auto"
            className={className}
            style={{
                '--voil-color': voilColor,
                '--oo-color': ooColor,
            } as React.CSSProperties}
        />
    ) : (
        <LogoSolo
            width={size}
            height={size}
            className={className}
            style={{ color: ooColor }}
        />
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
