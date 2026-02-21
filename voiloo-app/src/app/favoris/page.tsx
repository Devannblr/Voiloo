'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, H1, H4, P, Badge, Card, CardBody, Button, Small } from '@/components/Base';
import { StorageImage } from '@/components/Base/StorageImage';
import { Heart, Trash2 } from 'lucide-react';

interface Favori {
    id: number;
    slug: string;
    userSlug: string;
    titre: string;
    prix: number;
    ville: string;
    description: string;
    couleur: string;
    image?: string;
    categorie?: string;
}

export default function FavorisPage() {
    const [favoris, setFavoris] = useState<Favori[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('voiloo_favoris');
        setFavoris(stored ? JSON.parse(stored) : []);
        setLoaded(true);
    }, []);

    const removeFavori = (id: number) => {
        const updated = favoris.filter(f => f.id !== id);
        setFavoris(updated);
        localStorage.setItem('voiloo_favoris', JSON.stringify(updated));
    };

    const clearAll = () => {
        setFavoris([]);
        localStorage.removeItem('voiloo_favoris');
    };

    if (!loaded) return null;

    return (
        <main className="min-h-screen bg-white py-12">
            <Container>
                <div className="max-w-4xl mx-auto">

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
                        {favoris.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={clearAll} leftIcon={<Trash2 size={14} />}>
                                Tout effacer
                            </Button>
                        )}
                    </div>

                    {/* Vide */}
                    {favoris.length === 0 && (
                        <div className="flex flex-col items-center py-32 text-center max-w-sm mx-auto">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
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
                    <div className="grid md:grid-cols-2 gap-6">
                        {favoris.map((fav) => (
                            <div key={fav.id} className="relative group">
                                <Link href={`/u/${fav.userSlug}/${fav.slug}`}>
                                    <Card hover className="h-full">
                                        <div className="h-1.5" style={{ backgroundColor: fav.couleur || '#FFD359' }} />
                                        <CardBody className="p-5">
                                            {fav.image && (
                                                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                                                    <StorageImage
                                                        path={fav.image}
                                                        alt={fav.titre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-black text-lg leading-tight mb-1">{fav.titre}</h3>
                                                    {fav.categorie && (
                                                        <Badge variant="outline" size="sm">{fav.categorie}</Badge>
                                                    )}
                                                </div>
                                                <span className="text-xl font-black" style={{ color: fav.couleur || '#FFD359' }}>
                                                    {fav.prix}€
                                                </span>
                                            </div>
                                            <P className="text-sm text-gray-500 line-clamp-2 mb-3">{fav.description}</P>
                                            <Small className="text-gray-400">{fav.ville}</Small>
                                        </CardBody>
                                    </Card>
                                </Link>

                                {/* Bouton supprimer */}
                                <button
                                    onClick={(e) => { e.preventDefault(); removeFavori(fav.id); }}
                                    className="absolute top-4 right-4 p-2 bg-white border rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:border-red-200"
                                >
                                    <Heart size={14} className="text-primary fill-primary" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </main>
    );
}