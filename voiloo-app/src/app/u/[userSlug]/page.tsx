'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/apiService';
import { useToast } from "@/components/Layouts/Toastprovider";

// Tes composants Base
import {
    Container, H1, P, Badge, Card, CardBody, Avatar, Button,
    Modal, ModalBody, ModalFooter, Loader, Divider, H3, H2
} from '@/components/Base';

// Tes composants Modules
import { StorageImage } from '@/components/Base/StorageImage';

// Icones
import { MapPin, Trash2, Edit, Plus, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
    const params = useParams();
    const userSlug = params.userSlug as string;
    const { toast } = useToast();
    const { user: currentUser, isLoading: authLoading } = useAuth();

    const [profileUser, setProfileUser] = useState<any>(null);
    const [annonces, setAnnonces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adToDelete, setAdToDelete] = useState<any>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = await apiService.getUserByUsername(userSlug);
                setProfileUser(userData.user);
                setAnnonces(userData.annonces || []);
            } catch (err) {
                console.error("Erreur profil:", err);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [userSlug]);

    const isOwner = currentUser?.username === userSlug;

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

    if (loading || authLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader variant="spinner" size="lg" color="primary" />
        </div>
    );

    if (!profileUser) return (
        <Container className="py-20 text-center">
            <P className="italic text-gray-400">Utilisateur introuvable</P>
            <Button href="/" variant="ghost" className="mt-4" leftIcon={<ArrowLeft size={16}/>}>Retour à l'accueil</Button>
        </Container>
    );

    return (
        <main className="min-h-screen bg-white py-12">
            <Container>
                {/* Header Profil utilisant tes composants Avatar et H1 */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                        <Avatar src={profileUser.avatar} name={profileUser.name} size="xl" />
                        <div className="flex-1">
                            <H2 className="text-3xl font-black italic mb-2 uppercase tracking-tighter italic">
                                {profileUser.name}
                            </H2>
                            <P className="text-gray-500 mb-3 font-medium">@{profileUser.username}</P>
                            {profileUser.localisation && (
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-bold">
                                    <MapPin size={14} className="text-primary" />
                                    <span>{profileUser.localisation}</span>
                                </div>
                            )}
                        </div>
                        {isOwner && (
                            <Button href="/ajouter" variant="primary" leftIcon={<Plus size={16} />}>
                                Nouvelle annonce
                            </Button>
                        )}
                    </div>
                    {profileUser.bio && <P className="text-gray-600 leading-relaxed max-w-2xl">{profileUser.bio}</P>}
                </div>

                <Divider className="my-10" />

                {/* Liste des annonces utilisant Card et Badge */}
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Badge variant="primary" className="mb-2">Services proposés</Badge>
                        <H1 className="text-2xl font-black italic uppercase">
                            {annonces.length} annonce{annonces.length > 1 ? 's' : ''}
                        </H1>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {annonces.map((ad: any) => (
                            <div key={ad.id} className="relative group">
                                <Link href={`/u/${userSlug}/${ad.slug}`}>
                                    <Card hover className="h-full border-none shadow-sm bg-gray-50/50">
                                        <div className="h-1.5" style={{ backgroundColor: ad.vitrine_config?.couleur_principale || 'var(--color-primary)' }} />
                                        <CardBody className="p-5">
                                            {ad.images?.[0] && (
                                                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-200">
                                                    <StorageImage
                                                        path={ad.images[0].path}
                                                        alt={ad.titre}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-black text-lg leading-tight mb-1">{ad.titre}</h3>
                                                    {ad.categorie && <Badge variant="outline" size="sm" className="text-[10px] uppercase font-bold">{ad.categorie.nom}</Badge>}
                                                </div>
                                                <span className="text-xl font-black italic" style={{ color: ad.vitrine_config?.couleur_principale || 'var(--color-primary)' }}>
                                                    {ad.prix}€
                                                </span>
                                            </div>
                                            <P className="text-sm text-gray-500 line-clamp-2">{ad.description}</P>
                                        </CardBody>
                                    </Card>
                                </Link>

                                {isOwner && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            href={`/u/${userSlug}/${ad.slug}/edit-info`}
                                            className="px-2 shadow-md"
                                        >
                                            <Edit size={14} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setAdToDelete(ad);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="px-2 shadow-md"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Container>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !deleting && setIsDeleteModalOpen(false)}
                title="Suppression d'annonce"
            >
                <ModalBody>
                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl mb-4 text-red-700">
                        <AlertTriangle size={24} />
                        <P className="text-sm font-bold">L'action est irréversible.</P>
                    </div>
                    <P>Voulez-vous supprimer l'annonce <strong>{adToDelete?.titre}</strong> ?</P>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>Annuler</Button>
                    <Button variant="danger" onClick={handleDelete} isLoading={deleting}>Supprimer l'annonce</Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}