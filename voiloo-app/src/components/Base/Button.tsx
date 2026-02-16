'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import Link from "next/link";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    href?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-dark hover:bg-primary-dark active:bg-primary-dark',
    secondary: 'bg-dark text-white hover:bg-gray active:bg-gray',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-dark',
    ghost: 'bg-transparent text-dark hover:bg-beige/50 active:bg-beige',
    danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-7 py-3.5 text-lg gap-2.5',
};

export const Button = ({
                           children,
                           variant = 'primary',
                           size = 'md',
                           isLoading = false,
                           fullWidth = false,
                           leftIcon,
                           rightIcon,
                           disabled,
                           href, // On enlève le par défaut "" pour tester s'il existe vraiment
                           className = '',
                           ...props
                       }: ButtonProps) => {

    // On centralise les classes pour ne pas les répéter
    const combinedClasses = `
        inline-flex items-center justify-center font-semibold rounded-lg
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
    `;

    // Le contenu du bouton (Icônes + Texte)
    const content = (
        <>
            {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </>
    );

    // SI HREF EST PRÉSENT : On rend un Link stylé
    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                {content}
            </Link>
        );
    }

    // SINON : On rend le bouton standard
    return (
        <button
            className={combinedClasses}
            disabled={disabled || isLoading}
            {...props}
        >
            {content}
        </button>
    );
};