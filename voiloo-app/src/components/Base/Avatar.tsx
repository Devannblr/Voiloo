import React from 'react';
import { User } from 'lucide-react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    className?: string;
    status?: 'online' | 'offline' | 'away';
}

const sizeStyles: Record<AvatarSize, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
};

const statusSizeStyles: Record<AvatarSize, string> = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
};

const statusColorStyles = {
    online: 'bg-success',
    offline: 'bg-gray',
    away: 'bg-primary-dark',
};

const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const getColorFromName = (name: string): string => {
    const colors = [
        'bg-primary',
        'bg-primary-dark',
        'bg-beige',
        'bg-gray',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};

export const Avatar = ({
    src,
    alt = '',
    name = '',
    size = 'md',
    className = '',
    status,
}: AvatarProps) => {
    const displayAlt = alt || name || 'Avatar';

    return (
        <div className={`relative inline-flex ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={displayAlt}
                    className={`
                        rounded-full object-cover
                        ${sizeStyles[size]}
                    `}
                />
            ) : (
                <div
                    className={`
                        rounded-full flex items-center justify-center font-semibold text-dark
                        ${sizeStyles[size]}
                        ${name ? getColorFromName(name) : 'bg-beige'}
                    `}
                    aria-label={displayAlt}
                >
                    {name ? getInitials(name) : (
                        <User className="w-1/2 h-1/2 text-gray" />
                    )}
                </div>
            )}
            {status && (
                <span
                    className={`
                        absolute bottom-0 right-0 rounded-full border-2 border-white
                        ${statusSizeStyles[size]}
                        ${statusColorStyles[status]}
                    `}
                />
            )}
        </div>
    );
};

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    size?: AvatarSize;
    className?: string;
}

export const AvatarGroup = ({
    children,
    max = 4,
    size = 'md',
    className = '',
}: AvatarGroupProps) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
        <div className={`flex -space-x-2 ${className}`}>
            {visibleChildren.map((child, index) => (
                <div key={index} className="ring-2 ring-white rounded-full">
                    {React.isValidElement(child)
                        ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
                        : child}
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={`
                        rounded-full flex items-center justify-center font-semibold
                        bg-beige text-dark ring-2 ring-white
                        ${sizeStyles[size]}
                    `}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
};
