import React from 'react';

type DividerOrientation = 'horizontal' | 'vertical';

interface DividerProps {
    orientation?: DividerOrientation;
    className?: string;
    children?: React.ReactNode;
}

export const Divider = ({
    orientation = 'horizontal',
    className = '',
    children,
}: DividerProps) => {
    if (orientation === 'vertical') {
        return (
            <div
                className={`w-px h-full bg-beige ${className}`}
                role="separator"
                aria-orientation="vertical"
            />
        );
    }

    if (children) {
        return (
            <div
                className={`flex items-center gap-4 ${className}`}
                role="separator"
            >
                <div className="flex-1 h-px bg-beige" />
                <span className="text-sm text-gray shrink-0">{children}</span>
                <div className="flex-1 h-px bg-beige" />
            </div>
        );
    }

    return (
        <hr
            className={`border-none h-px bg-beige ${className}`}
            role="separator"
        />
    );
};
