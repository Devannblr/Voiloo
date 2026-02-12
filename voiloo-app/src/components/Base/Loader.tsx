import React from 'react';
import { Loader2 } from 'lucide-react';

type LoaderSize = 'sm' | 'md' | 'lg';
type LoaderVariant = 'spinner' | 'dots' | 'pulse';

interface LoaderProps {
    size?: LoaderSize;
    variant?: LoaderVariant;
    className?: string;
    color?: 'primary' | 'dark' | 'white';
}

const sizeStyles: Record<LoaderSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
};

const colorStyles = {
    primary: 'text-primary',
    dark: 'text-dark',
    white: 'text-white',
};

const Spinner = ({ size, color, className }: Omit<LoaderProps, 'variant'>) => (
    <Loader2 className={`animate-spin ${sizeStyles[size!]} ${colorStyles[color!]} ${className}`} />
);

const Dots = ({ size, color, className }: Omit<LoaderProps, 'variant'>) => {
    const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';
    const gap = size === 'sm' ? 'gap-1' : size === 'lg' ? 'gap-2' : 'gap-1.5';

    return (
        <div className={`flex items-center ${gap} ${className}`}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={`
                        ${dotSize} rounded-full ${colorStyles[color!].replace('text-', 'bg-')}
                        animate-bounce
                    `}
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
};

const Pulse = ({ size, color, className }: Omit<LoaderProps, 'variant'>) => (
    <div
        className={`
            ${sizeStyles[size!]} rounded-full
            ${colorStyles[color!].replace('text-', 'bg-')}
            animate-pulse
            ${className}
        `}
    />
);

export const Loader = ({
    size = 'md',
    variant = 'spinner',
    color = 'primary',
    className = '',
}: LoaderProps) => {
    switch (variant) {
        case 'dots':
            return <Dots size={size} color={color} className={className} />;
        case 'pulse':
            return <Pulse size={size} color={color} className={className} />;
        default:
            return <Spinner size={size} color={color} className={className} />;
    }
};

interface LoadingOverlayProps {
    isLoading: boolean;
    children: React.ReactNode;
    blur?: boolean;
    className?: string;
}

export const LoadingOverlay = ({
    isLoading,
    children,
    blur = true,
    className = '',
}: LoadingOverlayProps) => (
    <div className={`relative ${className}`}>
        {children}
        {isLoading && (
            <div
                className={`
                    absolute inset-0 flex items-center justify-center
                    bg-white/70 ${blur ? 'backdrop-blur-sm' : ''}
                    z-10
                `}
            >
                <Loader size="lg" />
            </div>
        )}
    </div>
);
