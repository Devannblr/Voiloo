import React from 'react';
import { X } from 'lucide-react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'error' | 'warning' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
    removable?: boolean;
    onRemove?: () => void;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-beige/50 text-dark',
    primary: 'bg-primary text-dark',
    success: 'bg-success/20 text-success',
    error: 'bg-error/20 text-error',
    warning: 'bg-primary-dark/20 text-primary-dark',
    outline: 'bg-transparent border border-beige text-dark',
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
};

export const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    removable = false,
    onRemove,
}: BadgeProps) => {
    return (
        <span
            className={`
                inline-flex items-center gap-1 font-medium rounded-full
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${className}
            `}
        >
            {children}
            {removable && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-0.5 hover:opacity-70 transition-opacity"
                    aria-label="Retirer"
                >
                    <X size={14} />
                </button>
            )}
        </span>
    );
};
