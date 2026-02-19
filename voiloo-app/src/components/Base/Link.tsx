import React from 'react';
import NextLink from 'next/link';
import { ExternalLink } from 'lucide-react';

type LinkVariant = 'default' | 'primary' | 'muted' | 'nav';

interface LinkProps {
    href: string;
    children: React.ReactNode;
    variant?: LinkVariant;
    external?: boolean;
    className?: string;
    style?: React.CSSProperties; // ✅ Ajout de style à l'interface
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    underline?: 'always' | 'hover' | 'none';
}

const variantStyles: Record<LinkVariant, string> = {
    default: 'text-dark hover:text-primary-dark',
    primary: 'text-primary-dark hover:text-primary',
    muted: 'text-gray hover:text-dark',
    nav: 'text-dark hover:text-primary font-medium',
};

const underlineStyles = {
    always: 'underline underline-offset-2',
    hover: 'hover:underline underline-offset-2',
    none: 'no-underline',
};

export const Link = ({
                         href,
                         children,
                         variant = 'default',
                         external = false,
                         className = '',
                         style, // ✅ Déstructuration du style
                         leftIcon,
                         rightIcon,
                         underline = 'hover',
                     }: LinkProps) => {
    const baseStyles = `
        inline-flex items-center gap-1 transition-colors duration-200
        ${variantStyles[variant]}
        ${underlineStyles[underline]}
        ${className}
    `;

    if (external) {
        return (
            <a
                href={href}
                className={baseStyles}
                style={style} // ✅ Application du style
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
                <ExternalLink size={14} className="opacity-60" />
            </a>
        );
    }

    return (
        <NextLink
            href={href}
            className={baseStyles}
            style={style} // ✅ Application du style sur NextLink
        >
            {leftIcon && (
                <div className="flex-shrink-0">
                    {leftIcon}
                </div>
            )}
            {children}
            {rightIcon && (
                <div className="flex-shrink-0">
                    {rightIcon}
                </div>
            )}
        </NextLink>
    );
};