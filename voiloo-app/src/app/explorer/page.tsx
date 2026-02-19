'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { apiService } from '@/services/apiService';
import { Container, H1, P, Badge, Button } from '@/components/Base';
import { ServiceCard } from "@/components/Modules/ServiceCard";
import { X, Search, SlidersHorizontal } from 'lucide-react';
import dynamic from "next/dynamic";

const CardSkeleton = () => (
    <div className="bg-gray-50 rounded-3xl h-[450px] animate-pulse border border-gray-100" />
);

const DynamicMap = dynamic(
    () => import('@/components/Modules/DynamicMap').then((mod) => mod.DynamicMap),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-dark/50 animate-pulse rounded-2xl flex items-center justify-center text-white/20">Chargement de la carte...</div>
    }
);

function ExplorerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categorySlug = searchParams.get('category') || undefined;

    const [annonces, setAnnonces] = useState<any[]>([]);
    const [categories, setCategories] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiService.getAnnonces(categorySlug)
            .then(data => {
                setAnnonces(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur annonces:", err);
                setLoading(false);
            });
    }, [categorySlug]);

    useEffect(() => {
        apiService.getCategories()
            .then((cats: any[]) => {
                const map: Record<string, string> = {};
                cats.forEach(c => {
                    if (c.slug && c.nom) map[c.slug] = c.nom;
                });
                setCategories(map);
            })
            .catch(() => {});
    }, []);

    const handleRemoveFilter = () => router.push('/explorer');
    const categoryLabel = categorySlug ? (categories[categorySlug] || categorySlug) : null;

    return (
        <main className="bg-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] h-[calc(100vh-72px)]">
                <div className="overflow-y-auto scrollbar-hide relative bg-white">
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="primary" className="text-[10px] uppercase tracking-wider px-2 py-0">Proximité</Badge>
                                    <span className="text-gray-300 text-xs">•</span>
                                    <P className="text-gray-400 text-xs font-bold uppercase tracking-tight">
                                        {annonces.length} talents disponibles
                                    </P>
                                </div>
                                <H1 className="text-2xl font-black italic tracking-tight leading-none uppercase">
                                    {categoryLabel ? categoryLabel : "Tous les prestataires"}
                                </H1>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <SlidersHorizontal size={18} className="text-gray-500" />
                                </button>
                                {categoryLabel && (
                                    <button onClick={handleRemoveFilter} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all">
                                        Effacer <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <Container className="py-8">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 3, 4].map((n) => <CardSkeleton key={n} />)}
                            </div>
                        ) : annonces.length === 0 ? (
                            <div className="flex flex-col items-center py-32 text-center max-w-sm mx-auto">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300"><Search size={32} /></div>
                                <H1 className="text-xl mb-2">Aucun talent trouvé</H1>
                                <P className="text-gray-400 text-sm mb-8">Nous n'avons pas trouvé de prestataires dans la catégorie "{categoryLabel}".</P>
                                <Button onClick={handleRemoveFilter} variant="primary" className="w-full">Réinitialiser la recherche</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                                {annonces.map((ad: any) => {
                                    // Règle stricte : Seulement la header_photo de la config
                                    const mainImage = ad.vitrine_config?.header_photo;
                                    const primaryColor = ad.vitrine_config?.couleur_principale || '#FFD359';

                                    return (
                                        <div key={ad.id}>
                                            <ServiceCard
                                                href={`/u/${ad.user?.slug || ad.user?.username}/${ad.slug}`}
                                                provider={{
                                                    name: ad.user?.name || "Utilisateur",
                                                    job: ad.titre,
                                                    price: `${ad.prix}€`,
                                                    city: ad.ville,
                                                    rating: ad.average_rating || 0,
                                                    nb_avis: ad.avis_count || 0,
                                                    avatarSrc: ad.user?.avatar,
                                                    mainPhoto: mainImage,
                                                    primary: primaryColor,
                                                    images: ad.images?.map((img: any) => img.path) || [],
                                                    isNew: ad.created_at ? (new Date(ad.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) : false
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Container>
                </div>
                <div className="hidden lg:block h-full relative border-l border-gray-100">
                    <DynamicMap points={annonces} />
                </div>
            </div>
        </main>
    );
}

export default function ExplorerPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="font-black italic uppercase text-sm tracking-widest text-primary">Voiloo</span>
                </div>
            </div>
        }>
            <ExplorerContent />
        </Suspense>
    );
}