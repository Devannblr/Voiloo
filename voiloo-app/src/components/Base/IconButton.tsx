import React from 'react';
import { Loader2 } from 'lucide-react';

type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    label: string; // Required for accessibility
    isLoading?: boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
    default: 'bg-beige/50 text-dark hover:bg-beige active:bg-beige',
    primary: 'bg-primary text-dark hover:bg-primary-dark active:bg-primary-dark',
    ghost: 'bg-transparent text-gray hover:bg-beige/50 hover:text-dark active:bg-beige',
    danger: 'bg-error/10 text-error hover:bg-error/20 active:bg-error/30',
};

const sizeStyles: Record<IconButtonSize, string> = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
};

const iconSizeStyles: Record<IconButtonSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
};

export const IconButton = ({
    icon,
    variant = 'default',
    size = 'md',
    label,
    isLoading = false,
    disabled,
    className = '',
    ...props
}: IconButtonProps) => {
    const iconWithSize = React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: `${iconSizeStyles[size]} ${(icon.props as { className?: string }).className || ''}`.trim(),
        })
        : icon;

    return (
        <button
            className={`
                inline-flex items-center justify-center rounded-lg
                transition-all duration-200 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${className}
            `}
            disabled={disabled || isLoading}
            aria-label={label}
            {...props}
        >
            {isLoading ? (
                <Loader2 className={`animate-spin ${iconSizeStyles[size]}`} />
            ) : (
                iconWithSize
            )}
        </button>
    );
};
