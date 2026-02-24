'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { apiService } from '@/services/apiService';
import { Container, H1, P, Badge, Button } from '@/components/Base';
import { ServiceCard } from "@/components/Modules/(cards)/ServiceCard";
import { X, Search, SlidersHorizontal, Map as MapIcon, List } from 'lucide-react';
import dynamic from "next/dynamic";

const CardSkeleton = () => (
    <div className="bg-gray-50 rounded-3xl h-[450px] animate-pulse border border-gray-100" />
);

// Import dynamique de la map
const DynamicMap = dynamic(
    () => import('@/components/Modules/DynamicMap').then((mod) => mod.DynamicMap),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 font-black italic uppercase">
                Chargement Voiloo Map...
            </div>
        )
    }
);

function ExplorerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categorySlug = searchParams.get('category') || undefined;
    const query = searchParams.get('query') || undefined;
    const city = searchParams.get('city') || undefined;

    const [annonces, setAnnonces] = useState<any[]>([]);
    const [categories, setCategories] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    // État pour basculer entre liste et carte sur mobile
    const [showMapMobile, setShowMapMobile] = useState(false);

    useEffect(() => {
        setLoading(true);

        apiService.getAnnonces({
            category: categorySlug,
            query,
            city
        })
            .then(data => {
                setAnnonces(data.data || data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur annonces:", err);
                setLoading(false);
            });

    }, [categorySlug, query, city]);

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
        <main className="bg-white overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] h-[calc(100vh-72px)]">

                {/* LISTE */}
                <div className={`${showMapMobile ? 'hidden' : 'block'} lg:block overflow-y-auto scrollbar-hide relative bg-white`}>
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
                                {annonces.map((ad: any) => (
                                    <ServiceCard
                                        key={ad.id}
                                        href={`/u/${ad.user?.username}/${ad.slug}`}
                                        provider={{
                                            id: ad.id,
                                            name: ad.user?.name || "Utilisateur",
                                            job: ad.titre,
                                            price: ad.prix ? `${ad.prix}€` : "Sur devis",
                                            city: ad.ville,
                                            // ✅ FIX : parseFloat pour éviter l'erreur .toFixed()
                                            rating: parseFloat(ad.avis_avg_note || 0),
                                            nb_avis: ad.avis_count || 0,
                                            avatarSrc: ad.user?.avatar,
                                            mainPhoto: ad.vitrine_config?.header_photo,
                                            primary: ad.vitrine_config?.couleur_principale || '#FFD359',
                                            images: ad.images?.map((img: any) => img.path) || [],
                                            isNew: ad.created_at ? (new Date(ad.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) : false
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </Container>
                </div>

                {/* CARTE */}
                <div className={`${showMapMobile ? 'block' : 'hidden'} lg:block h-full relative border-l border-gray-100 bg-stone-50`}>
                    <DynamicMap points={annonces} />
                </div>
            </div>

            {/* BOUTON SWITCH MOBILE */}
            <button
                onClick={() => setShowMapMobile(!showMapMobile)}
                className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl active:scale-95 transition-all border border-white/10"
            >
                {showMapMobile ? <><List size={18} /> Voir la liste</> : <><MapIcon size={18} /> Voir la carte</>}
            </button>
        </main>
    );
}

export default function ExplorerPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white italic font-black text-primary uppercase">Chargement Voiloo...</div>}>
            <ExplorerContent />
        </Suspense>
    );
}