'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Container, H2, P, Loader, Button } from '@/components/Base';
import { DisplayCard } from "@/components/Modules/(cards)/DisplayCard";
import { CtaCard } from "@/components/Modules/(cards)/CtaCard";
import { apiService } from "@/services/apiService";
import {useAuth} from "@/context/AuthContext";

interface FreelanceGridProps {
    userCity: string | null;
}

export const FreelanceGrid = ({ userCity }: FreelanceGridProps) => {
    const [freelances, setFreelances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<'city' | 'global'>('global');
    const [loadingGlobal, setLoadingGlobal] = useState(false);
    const { user } = useAuth();
    const fetchRecommended = useCallback(async (city: string | null) => {
        setIsLoading(true);
        try {
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

    const handleShowGlobal = async () => {
        setLoadingGlobal(true);
        try {
            const data = await apiService.getRecommendedAnnonces(undefined);
            const results = Array.isArray(data) ? data : (data?.data || []);
            setFreelances(results);
            setMode('global');
        } catch (error) {
            console.error("Erreur global:", error);
        } finally {
            setLoadingGlobal(false);
        }
    };

    useEffect(() => {
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
                        {/* Ville détectée mais 0 résultats locaux */}
                        {userCity && mode === 'global' && freelances.length === 0 && (
                            <div className="text-center py-12 mb-8">
                                <P className="text-gray-400 italic mb-6">
                                    Pas encore de prestataires à <strong>{userCity}</strong> pour le moment.
                                </P>
                                <Button
                                    variant="outline"
                                    onClick={handleShowGlobal}
                                    isLoading={loadingGlobal}
                                >
                                    Voir les meilleurs prestataires du moment →
                                </Button>
                            </div>
                        )}

                        {/* Grille principale */}
                        {freelances.length > 0 && (
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
                        )}
                    </>
                )}

                <div className="max-w-4xl mx-auto">
                    {user ? (
                        <CtaCard
                            title="Proposez vos services"
                            description="Créez votre vitrine en quelques minutes et faites-vous connaître près de chez vous."
                            href="/ajouter"
                            buttonText="Créer une annonce"
                        />
                    ) : (
                        <CtaCard
                            title="Rejoignez Voiloo"
                            description="Trouvez ou proposez des services près de chez vous, simplement et en toute confiance."
                            href="/register"
                        />
                    )}
                </div>
            </Container>
        </section>
    );
};