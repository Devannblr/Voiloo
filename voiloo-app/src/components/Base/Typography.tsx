import React from 'react';

interface TypographyProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties; // ✅ L'interface est bonne
}

// ✅ On ajoute "style" dans les arguments de CHAQUE composant
// ✅ On l'applique à la balise HTML avec style={style}

export const H1 = ({ children, className = '', style }: TypographyProps) => (
    <h1 className={`text-4xl lg:text-5xl font-bold text-dark leading-tight ${className}`} style={style}>
        {children}
    </h1>
);

export const H2 = ({ children, className = '', style }: TypographyProps) => (
    <h2 className={`text-2xl lg:text-3xl font-bold text-dark border-b-[3px] border-primary inline-block pb-1 tracking-tight uppercase ${className}`} style={style}>
        {children}
    </h2>
);

export const H3 = ({ children, className = '', style }: TypographyProps) => (
    <h3 className={`text-xl lg:text-2xl font-semibold text-dark ${className}`} style={style}>
        {children}
    </h3>
);

export const H4 = ({ children, className = '', style }: TypographyProps) => (
    <h4 className={`text-lg font-semibold text-dark ${className}`} style={style}>
        {children}
    </h4>
);

export const P = ({ children, className = '', style }: TypographyProps) => (
    <p className={`text-base text-dark/80 leading-relaxed ${className}`} style={style}>
        {children}
    </p>
);

export const Small = ({ children, className = '', style }: TypographyProps) => (
    <small className={`text-sm text-gray leading-snug ${className}`} style={style}>
        {children}
    </small>
);

export const TextAccent = ({ children, className = '', style }: TypographyProps) => (
    <span className={`font-accent text-primary ${className}`} style={style}>
        {children}
    </span>
);

export const Price = ({ children, className = '', style }: TypographyProps) => (
    <span className={`text-lg font-bold text-primary-dark ${className}`} style={style}>
        {children}
    </span>
);

export const Rating = ({ children, className = '', style }: TypographyProps) => (
    <span className={`text-sm font-bold text-primary-dark ${className}`} style={style}>
        {children}
    </span>
);

export const Label = ({ children, className = '', style }: TypographyProps) => (
    <span className={`text-sm font-medium text-dark ${className}`} style={style}>
        {children}
    </span>
);