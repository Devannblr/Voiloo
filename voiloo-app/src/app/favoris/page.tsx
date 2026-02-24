'use client';

import { useEffect, useState } from 'react';
import { Container, H1, H4, P, Button, Modal, ModalBody, ModalFooter, Loader } from '@/components/Base';
import { Heart } from 'lucide-react';
import { useFavoris } from '@/hooks/useFavoris';
import { useAuth } from '@/context/AuthContext';
import { ServiceCard } from '@/components/Modules/ServiceCard';

export default function FavorisPage() {
    const { isAuthenticated } = useAuth();
    const { favoris, fetchFavoris, toggleFavori, loading } = useFavoris(isAuthenticated);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    useEffect(() => {
        fetchFavoris();
    }, [fetchFavoris]);

    const handleRemove = async () => {
        if (confirmId === null) return;
        await toggleFavori(confirmId);
        setConfirmId(null);
        fetchFavoris();
    };

    return (
        <main className="min-h-screen bg-white py-12">
            <Container>
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Heart size={28} className="text-primary fill-primary" />
                                <H1 className="text-3xl font-black italic">Mes favoris</H1>
                            </div>
                            <P className="text-gray-400">
                                {favoris.length > 0
                                    ? `${favoris.length} service${favoris.length > 1 ? 's' : ''} sauvegardé${favoris.length > 1 ? 's' : ''}`
                                    : 'Aucun favori pour le moment'}
                            </P>
                        </div>
                    </div>

                    {/* Loader */}
                    {loading && (
                        <div className="flex justify-center items-center py-32">
                            <Loader variant="spinner" color="primary" size="lg" />
                        </div>
                    )}

                    {/* Vide */}
                    {!loading && favoris.length === 0 && (
                        <div className="flex flex-col items-center py-32 text-center max-w-sm mx-auto">
                            <div className="w-24 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Heart size={36} className="text-gray-200" />
                            </div>
                            <H4 className="mb-2">Aucun favori</H4>
                            <P className="text-gray-400 text-sm mb-8">
                                Ajoutez des services en favoris pour les retrouver facilement ici.
                            </P>
                            <Button href="/explorer" variant="primary">
                                Explorer les services
                            </Button>
                        </div>
                    )}

                    {/* Liste */}
                    {!loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoris.map((annonce: any) => {
                                const images = annonce.images?.map((img: any) => img.path) ?? [];
                                const headerPhoto = annonce.vitrine_config?.header_photo ?? null;
                                const primary = annonce.vitrine_config?.couleur_principale ?? '#FFD359';

                                return (
                                    <ServiceCard
                                        key={annonce.id}
                                        href={`/u/${annonce.user?.username}/${annonce.slug}`}
                                        onRemove={(id) => setConfirmId(id)}
                                        provider={{
                                            id:        annonce.id,
                                            name:      annonce.user?.name ?? '',
                                            job:       annonce.titre,
                                            price:     `${annonce.prix}€`,
                                            city:      annonce.ville,
                                            rating:    annonce.avis_avg_note ? parseFloat(annonce.avis_avg_note) : 0,
                                            nb_avis:   annonce.avis_count ?? 0,
                                            avatarSrc: annonce.user?.avatar ?? null,
                                            mainPhoto: headerPhoto,
                                            primary,
                                            images,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </Container>

            {/* Modal confirmation */}
            <Modal
                isOpen={confirmId !== null}
                onClose={() => setConfirmId(null)}
                title="Retirer des favoris"
                size="sm"
            >
                <ModalBody>
                    <P>Es-tu sûr de vouloir retirer ce service de tes favoris ?</P>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setConfirmId(null)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleRemove}>
                        Retirer
                    </Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}