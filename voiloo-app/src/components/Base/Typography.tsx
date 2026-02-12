import React from 'react';

interface TypographyProps {
    children: React.ReactNode;
    className?: string;
}

interface HeadingProps extends TypographyProps {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const H1 = ({ children, className = '' }: TypographyProps) => (
    <h1 className={`text-4xl lg:text-5xl font-bold text-dark leading-tight ${className}`}>
        {children}
    </h1>
);

export const H2 = ({ children, className = '' }: TypographyProps) => (
    <h2 className={`text-2xl lg:text-3xl font-bold text-dark border-b-[3px] border-primary inline-block pb-1 tracking-tight uppercase ${className}`}>
        {children}
    </h2>
);

export const H3 = ({ children, className = '' }: TypographyProps) => (
    <h3 className={`text-xl lg:text-2xl font-semibold text-dark ${className}`}>
        {children}
    </h3>
);

export const H4 = ({ children, className = '' }: TypographyProps) => (
    <h4 className={`text-lg font-semibold text-dark ${className}`}>
        {children}
    </h4>
);

export const P = ({ children, className = '' }: TypographyProps) => (
    <p className={`text-base text-dark/80 leading-relaxed ${className}`}>
        {children}
    </p>
);

export const Small = ({ children, className = '' }: TypographyProps) => (
    <small className={`text-sm text-gray leading-snug ${className}`}>
        {children}
    </small>
);

export const TextAccent = ({ children, className = '' }: TypographyProps) => (
    <span className={`font-accent text-primary ${className}`}>
        {children}
    </span>
);

export const Price = ({ children, className = '' }: TypographyProps) => (
    <span className={`text-lg font-bold text-primary-dark ${className}`}>
        {children}
    </span>
);

export const Label = ({ children, className = '' }: TypographyProps) => (
    <span className={`text-sm font-medium text-dark ${className}`}>
        {children}
    </span>
);