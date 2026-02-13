import React from 'react';
import { Button, H1, P, Link } from '@/components/Base';

interface CtaCardProps {
    title: string;
    description: string;
    href: string; // L'url de destination pour le bouton
    className?: string;
}

export const CtaCard = ({
                            title,
                            description,
                            href,
                            className = ""
                        }: CtaCardProps) => {
    return (
        <div
            className={`
                flex flex-col justify-center items-center text-center
                p-10 md:p-12 rounded-lg bg-primary shadow-xl
                w-full gap-8
                ${className}
            `}
        >
            <H1 className="text-dark max-w-3xl leading-tight">
                {title}
            </H1>

            <P className="text-dark text-lg md:text-xl max-w-2xl opacity-90">
                {description}
            </P>

            {/* Le lien enveloppe uniquement le bouton */}
            <Link href={href} className={"cursor-pointer"}>
                <Button variant="secondary" size="lg" className="px-8 shadow-md">
                    Créer mon compte
                </Button>
            </Link>
        </div>
    );
};