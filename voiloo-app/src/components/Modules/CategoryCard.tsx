import React from 'react';
import { ExternalLink } from 'lucide-react'; // Ou l'icône de ton choix
import { H4, P } from '@/components/Base';
import NextLink from "next/link";

interface CategoryCardProps {
    title: string;
    description: string;
    href?: string;
    onClick?: () => void;
    className?: string;
}

export const CategoryCard = ({
                                 title,
                                 description,
                                 href = "/not-found",
                                 onClick,
                                 className = ""
                             }: CategoryCardProps) => {
    return (
        <NextLink
            href={href}
            onClick={onClick}
            className={`
                group flex flex-col justify-center items-center text-center
                p-6 rounded-xl bg-dark/95 border border-white/10
                hover:bg-dark hover:scale-[1.02] 
                transition-all duration-300 cursor-pointer
                min-h-[140px] w-full
                ${className}
            `}
        >
            <div className="flex items-center gap-2 mb-2">
                <H4 className="text-white group-hover:text-primary transition-colors">
                    {title}
                </H4>
                <ExternalLink size={18} className="text-white/70 group-hover:text-primary" />
            </div>

            <P className="text-white/60 text-sm leading-snug max-w-[220px]">
                {description}
            </P>
        </NextLink>
    );
};