'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Container, H2, P, Loader, Button } from '@/components/Base';
import { DisplayCard } from "@/components/Modules/DisplayCard";
import { CtaCard } from "@/components/Modules/CtaCard";
import { apiService } from "@/services/apiService";

interface FreelanceGridProps {
    userCity: string | null;
}

export const FreelanceGrid = ({ userCity }: FreelanceGridProps) => {
    const [freelances, setFreelances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<'city' | 'global'>('global');

    const fetchRecommended = useCallback(async (city: string | null) => {
        setIsLoading(true);
        try {
            // Utilisation de l'endpoint ultra-léger
            const data = await apiService.getRecommendedAnnonces(city || undefined);
            const results = Array.isArray(data) ? data : (data?.data || []);

            setFreelances(results);
            setMode(city && results.length > 0 ? 'city' : 'global');
        } catch (error) {
            console.error("Erreur recommandation:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Si on a la ville, on fonce, sinon on attend 2s la géoloc avant de mettre le global
        let timeout: NodeJS.Timeout;

        if (userCity) {
            fetchRecommended(userCity);
        } else {
            timeout = setTimeout(() => fetchRecommended(null), 2000);
        }

        return () => clearTimeout(timeout);
    }, [userCity, fetchRecommended]);

    const mapToCard = (annonce: any) => ({
        name: annonce.user?.name || annonce.user?.username || "Prestataire",
        job: annonce.titre || "Service",
        rating: parseFloat(annonce.avis_avg_note) || 0,
        nb_avis: annonce.avis_count ?? 0,
        price: annonce.prix ? `${annonce.prix}€` : "Sur devis",
        city: annonce.ville || "",
        avatarSrc: annonce.user?.avatar || undefined,
        images: annonce.images?.map((img: any) => img.path) ?? [],
    });

    return (
        <section className="py-20 bg-white">
            <Container>
                <div className="text-center mb-12">
                    <H2 className="font-bold">Commencez à chercher par là.</H2>
                    {!isLoading && (
                        <P className="text-muted mt-2">
                            {mode === 'city'
                                ? <>Les meilleurs prestataires près de <strong>{userCity}</strong></>
                                : "Les meilleurs prestataires du moment"
                            }
                        </P>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader variant="spinner" size="md" color="primary" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {freelances.map((annonce) => (
                                <DisplayCard
                                    key={annonce.id}
                                    {...mapToCard(annonce)}
                                    userSlug={annonce.user?.username}
                                    annonceSlug={annonce.slug}
                                    couleurPrincipale={annonce.vitrine_config?.couleur_principale}
                                />
                            ))}
                        </div>

                        {mode === 'global' && userCity && freelances.length === 0 && (
                            <P className="text-center text-gray-400 mb-8 italic">
                                Pas encore de prestataires à {userCity}, voici les meilleurs ailleurs !
                            </P>
                        )}
                    </>
                )}

                <div className="max-w-4xl mx-auto">
                    <CtaCard
                        title="Rejoignez Voiloo"
                        description="Trouvez ou proposez des services près de chez vous, simplement et en toute confiance."
                        href="/register"
                    />
                </div>
            </Container>
        </section>
    );
};