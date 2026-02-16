'use client';

import React from 'react';
import { Container } from '@/components/Base';
import { CategoryCard } from "@/components/Modules/CategoryCard";

export const CategoryBar = () => {
    return (
        <section className="w-full bg-primary py-10 md:py-14">
            <Container>
                {/* Ta grille de composants CategoryCard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CategoryCard
                        title="Proximité"
                        description="Le bon service, au bon endroit, au bon moment."
                        href="/proximite"
                    />
                    <CategoryCard
                        title="Digital & Informatique"
                        description="Sites, dépannage, formation"
                        href="/digital"
                    />
                    <CategoryCard
                        title="Etudiant & Passionné"
                        description="Compétences, motivation et tarifs adaptés."
                        href="/etudiants"
                    />
                </div>
            </Container>
        </section>
    );
};