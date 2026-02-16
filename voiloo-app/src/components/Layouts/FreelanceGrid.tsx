'use client';

import React from 'react';
import { Container, H2 } from '@/components/Base';
import { DisplayCard } from "@/components/Modules/DisplayCard";
import { CtaCard } from "@/components/Modules/CtaCard";

export const FreelanceGrid = () => {
    // Données simulées basées sur ta maquette
    const featuredFreelances = [
        {
            name: "Bastien",
            job: "Informaticien",
            rating: 4.3,
            nb_avis: 7,
            price: "15-20€",
            city: "Besançon",
            avatarSrc: "/poulddet.jpg", // Remplace par tes vrais assets
            images: ["/ongleLaora.jpg", "/ongleMikella.jpg", "/ongleLilie.jpg"]
        },
        {
            name: "Mikella",
            job: "Prothésiste Ongulaire",
            rating: 4.8,
            nb_avis: 12,
            price: "40-50€",
            city: "Dole",
            avatarSrc: "/poulet.jpg",
            images: ["/ongleLaora.jpg", "/ongleMikella.jpg", "/ongleLilie.jpg"]
        },
        {
            name: "Titouan",
            job: "Jardinage",
            rating: 4.2,
            nb_avis: 9,
            price: "6-7€",
            city: "Dijon",
            avatarSrc: "/titouan.jpg",
            images: ["/ongleLaora.jpg", "/ongleMikella.jpg", "/ongleLilie.jpg"]
        }
    ];

    return (
        <section className="py-20 bg-white">
            <Container>
                {/* Titre de la section */}
                <div className="text-center mb-12">
                    <H2 className="font-bold">Commencez à chercher par là.</H2>
                </div>

                {/* Grille de profils */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {featuredFreelances.map((free, index) => (
                        <DisplayCard
                            key={index}
                            name={free.name}
                            job={free.job}
                            rating={free.rating}
                            nb_avis={free.nb_avis}
                            price={free.price}
                            city={free.city}
                            avatarSrc={free.avatarSrc}
                            images={free.images}
                        />
                    ))}
                </div>

                {/* Section Appel à l'action (CTA) */}
                <div className="max-w-4xl mx-auto">
                    <CtaCard
                        title="Rejoignez Voiloo"
                        description="Trouvez ou proposez des services près de chez vous, simplement et en toute confiance."
                        href="/signup"
                    />
                </div>
            </Container>
        </section>
    );
};