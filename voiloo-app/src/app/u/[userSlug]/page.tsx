'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
    Container, H1, P, Badge, Card, CardBody, Avatar, Button,
    Modal, ModalBody, ModalFooter, Loader
} from '@/components/Base';
import { MapPin, Trash2, Edit, Plus, AlertTriangle } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { StorageImage } from '@/components/Base/StorageImage';
import { useToast } from "@/components/Layouts/Toastprovider";

export default function UserProfilePage() {
    const params = useParams();
    const userSlug = params.userSlug as string;
    const { toast } = useToast();

    // States
    const [user, setUser] = useState<any>(null);
    const [annonces, setAnnonces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    // States pour la suppression (Modal dédiée)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adToDelete, setAdToDelete] = useState<any>(null);
    const [deleting, setDeleting] = useState(false);

    // Exemple d'optimisation par parallélisme
    useEffect(() => {
        const load = async () => {
            try {
                // On lance les deux promesses en même temps
                const [userData, currentUser] = await Promise.all([
                    apiService.getUserByUsername(userSlug),
                    localStorage.getItem('voiloo_token') ? apiService.getUser() : Promise.resolve(null)
                ]);

                setUser(userData.user);
                setAnnonces(userData.annonces || []);

                if (currentUser?.username === userSlug) {
                    setIsOwner(true);
                }
            } catch (err) {
                console.error("Erreur:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userSlug]);

    const openDeleteModal = (ad: any) => {
        setAdToDelete(ad);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!adToDelete) return;

        setDeleting(true);
        try {
            await apiService.deleteAnnonce(adToDelete.id);
            setAnnonces(prev => prev.filter(a => a.id !== adToDelete.id));
            toast.success('Annonce supprimée avec succès');
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        } finally {
            setDeleting(false);
            setAdToDelete(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            {/* Utilisation de ton composant Loader du Design System */}
            <Loader variant="spinner" size="lg" color="primary" />
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
                {/* Header Profil */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                        <Avatar src={user.avatar} name={user.name} size="xl" />
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
                                <Button variant="primary" leftIcon={<Plus size={16} />}>Nouvelle annonce</Button>
                            </Link>
                        )}
                    </div>
                    {user.bio && <P className="text-gray-600 leading-relaxed">{user.bio}</P>}
                </div>

                {/* Liste des annonces */}
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Badge variant="primary" className="mb-2">Services</Badge>
                        <H1 className="text-2xl font-black italic">
                            {annonces.length} annonce{annonces.length > 1 ? 's' : ''}
                        </H1>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {annonces.map((ad: any) => (
                            <div key={ad.id} className="relative group">
                                <Link href={`/u/${userSlug}/${ad.slug}`}>
                                    <Card hover className="h-full">
                                        <div className="h-1.5" style={{ backgroundColor: ad.vitrine_config?.couleur_principale || '#FFD359' }} />
                                        <CardBody className="p-5">
                                            {ad.images?.[0] && (
                                                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                                                    <StorageImage
                                                        path={ad.images[0].path}
                                                        alt={ad.titre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-black text-lg leading-tight mb-1">{ad.titre}</h3>
                                                    {ad.categorie && <Badge variant="outline" size="sm">{ad.categorie.nom}</Badge>}
                                                </div>
                                                <span className="text-xl font-black" style={{ color: ad.vitrine_config?.couleur_principale || '#FFD359' }}>
                                                    {ad.prix}€
                                                </span>
                                            </div>
                                            <P className="text-sm text-gray-500 line-clamp-2">{ad.description}</P>
                                        </CardBody>
                                    </Card>
                                </Link>

                                {isOwner && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <Link href={`/u/${userSlug}/${ad.slug}/edit`}>
                                            <button className="p-2 bg-white border rounded-lg shadow-md hover:bg-gray-50 transition-colors">
                                                <Edit size={14} />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                openDeleteModal(ad);
                                            }}
                                            className="p-2 bg-white border rounded-lg shadow-md hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={14} className="text-red-500" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Container>

            {/* Modal de confirmation de suppression (Remplace le confirm natif) */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !deleting && setIsDeleteModalOpen(false)}
                title="Supprimer l'annonce"
                size="md"
            >
                <ModalBody>
                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl mb-4">
                        <AlertTriangle className="text-red-500" size={24} />
                        <div className="flex-1">
                            <P className="text-sm text-red-700 font-bold mb-1">Attention</P>
                            <P className="text-sm text-red-700">
                                L'annonce <strong>{adToDelete?.titre}</strong> sera définitivement supprimée.
                            </P>
                        </div>
                    </div>
                    <P>Voulez-vous vraiment continuer ? Cette action est irréversible.</P>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setIsDeleteModalOpen(false)}
                        disabled={deleting}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={deleting}
                    >
                        Supprimer
                    </Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}