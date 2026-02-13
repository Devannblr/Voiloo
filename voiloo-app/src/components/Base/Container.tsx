import React from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps {
    children: React.ReactNode;
    size?: ContainerSize;
    className?: string;
    as?: React.ElementType;
}

const sizeStyles: Record<ContainerSize, string> = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
};

export const Container = ({
    children,
    size = 'xl',
    className = '',
    as: Component = 'div',
}: ContainerProps) => {
    return (
        <Component
            className={`
                w-full mx-auto px-4 sm:px-6 lg:px-8
                ${sizeStyles[size]}
                ${className}
            `}
        >
            {children}
        </Component>
    );
};
