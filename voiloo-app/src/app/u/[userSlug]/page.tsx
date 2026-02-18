'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, H1, P, Badge, Card, CardBody, Avatar, Button } from '@/components/Base';
import { MapPin, Star, Loader2, Trash2, Edit, Plus } from 'lucide-react';
import { apiService } from '@/services/apiService';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:8000';

function normalizeImageUrl(path: string): string {
    if (!path) return `${API_BASE}/userdefault.png`;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/storage/')) return `${API_BASE}${path}`;
    if (path.startsWith('storage/'))  return `${API_BASE}/${path}`;
    return `${API_BASE}/storage/${path}`;
}

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userSlug = params.userSlug as string;

    const [user, setUser] = useState<any>(null);
    const [annonces, setAnnonces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/users/${userSlug}`)
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setAnnonces(data.annonces || []);

                // Check ownership
                const token = localStorage.getItem('voiloo_token');
                if (token) {
                    fetch(`${API_BASE}/api/user`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                        .then(r => r.json())
                        .then(currentUser => {
                            if (currentUser?.slug === userSlug) setIsOwner(true);
                        })
                        .catch(() => {});
                }

                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [userSlug]);

    const handleDelete = async (annonceId: number) => {
        if (!confirm('Supprimer cette annonce ?')) return;

        setDeleting(annonceId);
        try {
            const token = localStorage.getItem('voiloo_token');
            await fetch(`${API_BASE}/api/annonces/${annonceId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAnnonces(prev => prev.filter(a => a.id !== annonceId));
        } catch (e) {
            console.error('Erreur suppression:', e);
            alert('Erreur lors de la suppression');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary" />
        </div>
    );

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <P>Utilisateur introuvable</P>
        </div>
    );

    return (
        <main className="min-h-screen bg-white py-12">
            <Container>
                {/* Header profil */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                        <Avatar src={normalizeImageUrl(user.avatar)} name={user.name} size="xl" />
                        <div className="flex-1">
                            <H1 className="text-3xl font-black italic mb-2">{user.name}</H1>
                            <P className="text-gray-500 mb-3">@{user.username}</P>
                            {user.localisation && (
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <MapPin size={14} />
                                    <span>{user.localisation}</span>
                                </div>
                            )}
                        </div>

                        {isOwner && (
                            <Link href="/ajouter">
                                <Button variant="primary" leftIcon={<Plus size={16} />}>
                                    Nouvelle annonce
                                </Button>
                            </Link>
                        )}
                    </div>

                    {user.bio && (
                        <P className="text-gray-600 leading-relaxed">{user.bio}</P>
                    )}
                </div>

                {/* Liste des annonces */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Badge variant="primary" className="mb-2">Services</Badge>
                            <H1 className="text-2xl font-black italic">
                                {annonces.length} annonce{annonces.length > 1 ? 's' : ''}
                            </H1>
                        </div>
                    </div>

                    {annonces.length === 0 ? (
                        <div className="text-center py-20">
                            <P className="text-gray-400 mb-4">Aucune annonce publiée</P>
                            {isOwner && (
                                <Link href="/ajouter">
                                    <Button variant="primary" size="sm">Créer une annonce</Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {annonces.map((ad: any) => (
                                <div key={ad.id} className="relative group">
                                    <Link href={`/${userSlug}/${ad.slug}`}>
                                        <Card hover className="h-full">
                                            <div className="h-1.5" style={{ backgroundColor: ad.vitrine_config?.couleur_principale || '#FFD359' }} />
                                            <CardBody className="p-5">
                                                {ad.images?.[0] && (
                                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                                                        <img src={normalizeImageUrl(ad.images[0].path)} alt={ad.titre}
                                                             className="w-full h-full object-cover" />
                                                    </div>
                                                )}

                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="font-black text-lg leading-tight mb-1">{ad.titre}</h3>
                                                        {ad.categorie && (
                                                            <Badge variant="outline" size="sm">{ad.categorie.nom}</Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xl font-black shrink-0"
                                                          style={{ color: ad.vitrine_config?.couleur_principale || '#FFD359' }}>
                                                        {ad.prix}€
                                                    </span>
                                                </div>

                                                <P className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                    {ad.description}
                                                </P>

                                                <div className="flex items-center justify-between text-xs text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={12} />
                                                        <span>{ad.ville}</span>
                                                    </div>
                                                    {ad.average_rating > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <Star size={12} fill="currentColor" />
                                                            <span>{ad.average_rating}</span>
                                                            <span className="opacity-50">({ad.avis_count})</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Link>

                                    {/* Boutons owner */}
                                    {isOwner && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <Link href={`/${userSlug}/${ad.slug}/edit`}>
                                                <button className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-md transition-colors">
                                                    <Edit size={14} className="text-gray-600" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleDelete(ad.id); }}
                                                disabled={deleting === ad.id}
                                                className="p-2 bg-white hover:bg-red-50 border border-gray-200 rounded-lg shadow-md transition-colors disabled:opacity-50">
                                                {deleting === ad.id ? (
                                                    <Loader2 size={14} className="animate-spin text-red-500" />
                                                ) : (
                                                    <Trash2 size={14} className="text-red-500" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </main>
    );
}