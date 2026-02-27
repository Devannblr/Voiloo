'use client';

import { useState } from 'react';
import { Star, MessageSquare, Plus } from "lucide-react";
import { H3, P, Small, Card, CardBody, Avatar, Button, Modal, ModalBody, ModalFooter, Textarea } from '@/components/Base';
import { StarMark } from "@/components/Modules/StarMark";
import { apiFetch } from "@/lib/api"; // On utilise apiFetch directement pour le POST

interface Avis {
    id: number;
    note: number;
    commentaire: string;
    user?: {
        name: string;
        username: string;
        avatar?: string;
    };
    created_at: string;
}

interface SectionAvisProps {
    avis: Avis[];
    primary: string;
    annonceId: number;
    onAvisPoste?: () => void;
    textColor?: string;
}

export default function SectionAvis({ avis, primary, annonceId, onAvisPoste, textColor }: SectionAvisProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [note, setNote] = useState(0);
    const [commentaire, setCommentaire] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const moyenne = avis.length > 0
        ? avis.reduce((acc, curr) => acc + curr.note, 0) / avis.length
        : 0;

    const handleSubmit = async () => {
        if (note === 0) return alert("Merci de choisir une note");

        setIsSubmitting(true);
        try {
            // ✅ CORRECTION : Utilisation de POST au lieu de PUT
            await apiFetch(`/annonces/${annonceId}/avis`, {
                method: 'POST',
                body: JSON.stringify({ note, commentaire }),
            });

            setIsModalOpen(false);
            setNote(0);
            setCommentaire('');

            // On prévient le parent pour recharger la liste
            if (onAvisPoste) onAvisPoste();

            alert("Merci ! Votre avis a été publié.");
            window.location.reload(); // Solution simple pour voir l'avis immédiatement
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'envoi de l'avis. Vérifiez que vous êtes connecté.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="avis" className="scroll-mt-20 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${primary}20` }}>
                        <Star size={20} style={{ color: primary }} />
                    </div>
                    <H3>Avis clients</H3>
                </div>

                <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Plus size={16} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Noter
                </Button>
            </div>

            {/* Score Global ou Message Vide */}
            {avis.length > 0 ? (
                <div className="mb-10 p-8 rounded-3xl bg-gray-50 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
                    <div className="text-center">
                        <div className="text-6xl font-black mb-2" style={{ color: primary }}>
                            {moyenne.toFixed(1)}
                        </div>
                        <StarMark variant="display" value={moyenne} size="md" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <P className="font-bold mb-1 italic">La satisfaction avant tout</P>
                        <Small className="text-gray-500">
                            Basé sur {avis.length} {avis.length > 1 ? 'retours' : 'retour'}.
                        </Small>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mb-8">
                    <MessageSquare size={40} className="mx-auto text-gray-300 mb-4" />
                    <P className="text-gray-500">Aucun avis pour le moment.</P>
                    <Small className="block mb-4">Soyez le premier à partager votre expérience !</Small>
                    <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                        Laisser un avis
                    </Button>
                </div>
            )}

            {/* Liste des avis */}
            <div className="grid gap-4">
                {avis.map((item) => (
                    <Card key={item.id} variant="outlined" className="border-gray-100">
                        <CardBody className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar name={item.user?.name} src={item.user?.avatar} size="sm" />
                                    <div>
                                        <span className="font-bold text-sm block">{item.user?.name}</span>
                                        <Small className="text-gray-400">@{item.user?.username}</Small>
                                    </div>
                                </div>
                                <StarMark variant="display" value={item.note} size="sm" />
                            </div>
                            <P className="text-sm italic" style={{color: textColor} as any}>"{item.commentaire}"</P>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* MODAL POUR NOTER */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Donner votre avis"
            >
                <ModalBody className="space-y-6">
                    <div className="flex flex-col items-center gap-2 py-4">
                        <P className="font-semibold">Quelle note donnez-vous ?</P>
                        <StarMark
                            variant="rating"
                            value={note}
                            onChange={setNote}
                            size="md"
                        />
                    </div>

                    <Textarea
                        label="Votre commentaire (optionnel)"
                        placeholder="Racontez votre expérience..."
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        rows={4}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                    <Button
                        isLoading={isSubmitting}
                        onClick={handleSubmit}
                        disabled={note === 0}
                    >
                        Publier mon avis
                    </Button>
                </ModalFooter>
            </Modal>
        </section>
    );
}