import React from 'react';

type CardVariant = 'default' | 'outlined' | 'elevated';

interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

interface CardImageProps {
    src: string;
    alt: string;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'wide';
}

const variantStyles: Record<CardVariant, string> = {
    default: 'bg-white border border-beige',
    outlined: 'bg-transparent border-2 border-beige',
    elevated: 'bg-white shadow-lg shadow-dark/10',
};

const aspectRatioStyles = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
};

export const Card = ({
    children,
    variant = 'default',
    className = '',
    onClick,
    hover = false,
}: CardProps) => {
    const isClickable = !!onClick || hover;

    return (
        <div
            className={`
                rounded-xl overflow-hidden
                ${variantStyles[variant]}
                ${isClickable ? 'cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-dark/10 hover:-translate-y-0.5' : ''}
                ${className}
            `}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    );
};

export const CardImage = ({
    src,
    alt,
    className = '',
    aspectRatio = 'video',
}: CardImageProps) => (
    <div className={`relative overflow-hidden ${aspectRatioStyles[aspectRatio]} ${className}`}>
        <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
        />
    </div>
);

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
    <div className={`px-5 pt-5 pb-2 ${className}`}>
        {children}
    </div>
);

export const CardBody = ({ children, className = '' }: CardBodyProps) => (
    <div className={`px-5 py-3 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }: CardFooterProps) => (
    <div className={`px-5 pt-2 pb-5 border-t border-beige ${className}`}>
        {children}
    </div>
);
