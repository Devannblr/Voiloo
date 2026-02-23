'use client';

import React, { useEffect, useState, useRef } from 'react';
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
    const [emptyInCity, setEmptyInCity] = useState(false);
    const [showingGlobal, setShowingGlobal] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasFetched = useRef(false);

    const fetchGlobal = async () => {
        const data = await apiService.getAnnonces({ sort: 'rating_desc' });
        return (data?.data || []).slice(0, 3);
    };

    const fetchByCity = async (city: string) => {
        const data = await apiService.getAnnonces({ sort: 'rating_desc', city });
        return (data?.data || []).slice(0, 3);
    };

    const doFetch = async (city: string | null) => {
        setIsLoading(true);
        setEmptyInCity(false);
        setShowingGlobal(false);

        try {
            if (city) {
                const annonces = await fetchByCity(city);
                if (annonces.length > 0) {
                    setFreelances(annonces);
                } else {
                    setEmptyInCity(true);
                }
            } else {
                const annonces = await fetchGlobal();
                setFreelances(annonces);
                setShowingGlobal(true);
            }
        } catch {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        if (userCity) {
            // Ville dispo → fetch direct
            doFetch(userCity);
        } else {
            // Attendre 4s que la géoloc réponde avant de fetch en global
            timerRef.current = setTimeout(() => doFetch(null), 4000);
        }

        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [userCity]);

    const handleShowGlobal = async () => {
        setIsLoading(true);
        setEmptyInCity(false);
        try {
            const annonces = await fetchGlobal();
            setFreelances(annonces);
            setShowingGlobal(true);
        } catch {
        } finally {
            setIsLoading(false);
        }
    };

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
                            {showingGlobal || !userCity
                                ? "Les meilleurs prestataires du moment"
                                : <>Les meilleurs prestataires près de <strong>{userCity}</strong></>
                            }
                        </P>
                    )}
                </div>

                {isLoading && (
                    <div className="flex justify-center py-16">
                        <Loader variant="spinner" size="md" color="primary" />
                    </div>
                )}

                {!isLoading && emptyInCity && (
                    <div className="text-center py-16 flex flex-col items-center gap-4">
                        <P>Aucun prestataire disponible près de <strong>{userCity}</strong>.</P>
                        <Button variant="outline" onClick={handleShowGlobal}>
                            Voir les meilleurs prestataires
                        </Button>
                    </div>
                )}

                {!isLoading && !emptyInCity && freelances.length > 0 && (
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