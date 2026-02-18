'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { apiService } from '@/services/apiService';
import { Container, H1, P, Badge, Button } from '@/components/Base';
import { DisplayCard } from "@/components/Modules/DisplayCard";
import { DynamicMap } from '@/components/Modules/DynamicMap';
import { X } from 'lucide-react';

function ExplorerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categorySlug = searchParams.get('category') || undefined;

    const [annonces, setAnnonces] = useState([]);
    const [categories, setCategories] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiService.getAnnonces(categorySlug)
            .then(data => { setAnnonces(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [categorySlug]);

    useEffect(() => {
        apiService.getCategories()
            .then((cats: any[]) => {
                const map: Record<string, string> = {};
                cats.forEach(c => { map[c.slug] = c.nom; });
                setCategories(map);
            })
            .catch(() => {});
    }, []);

    const handleRemoveFilter = () => router.push('/explorer');
    const categoryLabel = categorySlug ? (categories[categorySlug] || categorySlug) : null;

    return (
        <main className="bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] h-[calc(100vh-72px)]">

                <div className="overflow-y-auto p-6 scrollbar-hide">
                    <Container>
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <Badge variant="primary" className="mb-2">Proximité</Badge>
                                <H1 className="text-3xl font-black italic">
                                    {categoryLabel ? `Freelances : ${categoryLabel}` : "Tous les prestataires"}
                                </H1>
                                {categoryLabel && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full border border-primary/20">
                                            {categoryLabel}
                                            <button onClick={handleRemoveFilter}
                                                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                                                <X size={13} />
                                            </button>
                                        </span>
                                        <button onClick={handleRemoveFilter}
                                                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors">
                                            Voir tous les prestataires
                                        </button>
                                    </div>
                                )}
                            </div>
                            <P className="text-gray-400 font-medium">{annonces.length} profils trouvés</P>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                                <P className="mt-4">Chargement des talents...</P>
                            </div>
                        ) : annonces.length === 0 ? (
                            <div className="flex flex-col items-center py-20 text-center">
                                <P className="text-gray-400 text-lg mb-4">
                                    Aucun prestataire{categoryLabel ? ` dans "${categoryLabel}"` : ''}.
                                </P>
                                {categoryLabel && (
                                    <Button onClick={handleRemoveFilter} variant="primary" size="sm">
                                        Voir tous les prestataires
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {annonces.map((ad: any) => (
                                    <DisplayCard
                                        key={ad.id}
                                        name={ad.user?.name}
                                        job={ad.titre}
                                        rating={ad.average_rating || 0}
                                        nb_avis={ad.avis_count || 0}
                                        price={`${ad.prix}€`}
                                        city={ad.ville}
                                        avatarSrc={ad.user?.avatar}
                                        images={ad.images?.map((img: any) => img.path) || []}
                                        userSlug={ad.user?.slug}
                                        annonceSlug={ad.slug}
                                        // Couleur depuis la config vitrine
                                        couleurPrincipale={ad.vitrine_config?.couleur_principale ?? '#FFD359'}
                                    />
                                ))}
                            </div>
                        )}
                    </Container>
                </div>

                <div className="hidden lg:block h-full relative border-l border-beige/20">
                    <DynamicMap points={annonces} />
                </div>
            </div>
        </main>
    );
}

export default function ExplorerPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Initialisation de Voiloo...</div>}>
            <ExplorerContent />
        </Suspense>
    );
}