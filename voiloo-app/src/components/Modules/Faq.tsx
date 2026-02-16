'use client';
import React, { useState } from 'react';
import { H2, H3, P, Container } from '@/components/Base';
import { ChevronDown } from 'lucide-react';

// --- 1. L'ÉLÉMENT INTERNE ---
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="group border-b border-beige py-5 cursor-pointer last:border-0"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex items-center justify-between gap-4">
                <H3 className={`text-lg transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-dark group-hover:text-primary'}`}>
                    {question}
                </H3>
                <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className={isOpen ? 'text-primary' : 'text-gray-400'} />
                </div>
            </div>

            <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <P className="text-gray-600 leading-relaxed pb-2">
                    {answer}
                </P>
            </div>
        </div>
    );
};

// --- 2. LE LAYOUT ---
export const FaqSection = ({
                               items = [], // Valeur par défaut pour éviter les erreurs si undefined
                               title = "Questions fréquentes",
                               description = "Tout ce que vous devez savoir pour utiliser Voiloo sereinement."
                           }: {
    items: { question: string; answer: string }[];
    title?: string;
    description?: string;
}) => {
    // Correction de la condition : on check si la liste est vide
    const hasItems = items && items.length > 0;

    return (
        <section className="py-20">
            <Container>
                <div className="text-center mb-12">
                    <H2 className="mb-4">{title}</H2>
                    <P className="text-gray-500 max-w-xl mx-auto">{description}</P>
                </div>

                <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-2xl border border-beige/50 shadow-sm">
                    {hasItems ? (
                        items.map((item, index) => (
                            <FaqItem key={index} {...item} />
                        ))
                    ) : (
                        // Le message qui s'affiche si aucune question n'est trouvée
                        <div className="py-10 text-center">
                            <P className="text-gray-400 italic">
                                Pas encore de questions ici. On arrive bientôt ! ⏳
                            </P>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
};