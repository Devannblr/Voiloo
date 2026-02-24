'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';

// Tes composants Base
import {Container, Button, H1, Loader, Input, Select, Textarea, Divider, Label, P} from '@/components/Base';
import { Save, ArrowLeft, Euro, FileText, Calendar, Home, Tag } from 'lucide-react';

// Tes composants Modules
import AddressInput from "@/components/Modules/AdresseInput";

export default function EditerAnnoncePage() {
    const router = useRouter();
    const params = useParams();
    const userSlug = params.userSlug as string;
    const initialAnnonceSlug = params.annonceSlug as string;

    const { user: currentUser, isLoading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const [form, setForm] = useState({
        id: '',
        titre: '',
        description: '',
        categorie_id: '',
        prix: '',
        adresse: '',
        ville: '',
        code_postal: '',
        disponibilites: '',
        lat: null as number | null,
        lng: null as number | null,
    });

    useEffect(() => {
        if (!authLoading && !currentUser) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [cats, annonce] = await Promise.all([
                    apiService.getCategories(),
                    apiService.getAnnonceBySlug(userSlug, initialAnnonceSlug)
                ]);

                if (currentUser && annonce.user_id !== currentUser.id) {
                    router.push('/');
                    return;
                }

                setCategories(cats);
                setForm({
                    id: annonce.id,
                    titre: annonce.titre,
                    description: annonce.description,
                    categorie_id: String(annonce.categorie_id),
                    prix: String(annonce.prix),
                    adresse: annonce.adresse || '',
                    ville: annonce.ville || '',
                    code_postal: annonce.code_postal || '',
                    disponibilites: annonce.disponibilites || '',
                    lat: annonce.lat ?? null,
                    lng: annonce.lng ?? null,
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                router.push('/');
            }
        };

        if (!authLoading) fetchData();
    }, [userSlug, initialAnnonceSlug, router, currentUser, authLoading]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await apiService.updateAnnonce(form.id, form);
            const nextSlug = response.new_slug || initialAnnonceSlug;
            router.push(`/u/${userSlug}/${nextSlug}`);
        } catch (err: any) {
            alert(err.response?.data?.message || "Erreur lors de la modification");
        } finally {
            setSaving(false);
        }
    };

    if (loading || authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader variant="spinner" size="lg" color="primary" />
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        leftIcon={<ArrowLeft size={18} />}
                        className="mb-6 font-bold"
                    >
                        Retour
                    </Button>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <H1 className="text-2xl font-black mb-8 italic text-dark uppercase tracking-tight italic">
                            Paramètres de l'annonce
                        </H1>

                        <div className="space-y-6">
                            <Input
                                label="Titre de l'annonce"
                                leftIcon={<FileText size={18} className="text-gray-400" />}
                                value={form.titre}
                                onChange={e => setForm({...form, titre: e.target.value})}
                                placeholder="Ex: Pose d'ongles à domicile"
                            />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Select
                                    label="Catégorie"
                                    value={form.categorie_id}
                                    onChange={e => setForm({...form, categorie_id: e.target.value})}
                                    options={categories.map(cat => ({ value: String(cat.id), label: cat.nom }))}
                                />
                                <Input
                                    label="Tarif horaire (€)"
                                    type="number"
                                    leftIcon={<Euro size={18} className="text-gray-400" />}
                                    value={form.prix}
                                    onChange={e => setForm({...form, prix: e.target.value})}
                                />
                            </div>

                            <Textarea
                                label="Description des services"
                                value={form.description}
                                onChange={e => setForm({...form, description: e.target.value})}
                                rows={5}
                                hint="Décrivez votre expertise pour rassurer vos futurs clients."
                            />

                            <Divider />

                            <div className="flex flex-col gap-1.5">
                                <Label className="flex items-center gap-2">
                                    <Home size={18} className="text-gray-400" /> Localisation
                                </Label>
                                <AddressInput
                                    value={form.adresse}
                                    onChange={({ adresse, ville, code_postal, lat, lng }) =>
                                        setForm(f => ({ ...f, adresse, ville, code_postal, lat, lng }))
                                    }
                                />
                                {form.ville && (
                                    <P className="text-xs text-primary mt-1 font-bold italic">
                                        📍 Actuellement : {form.ville} ({form.code_postal})
                                    </P>
                                )}
                            </div>

                            <Input
                                label="Disponibilités"
                                leftIcon={<Calendar size={18} className="text-gray-400" />}
                                value={form.disponibilites}
                                onChange={e => setForm({...form, disponibilites: e.target.value})}
                                placeholder="Ex: Lundi au Vendredi, 18h-20h"
                            />

                            <Button
                                onClick={handleSave}
                                className="w-full mt-4 h-14 rounded-2xl text-lg font-bold italic uppercase"
                                disabled={saving}
                                isLoading={saving}
                                leftIcon={!saving && <Save size={20} />}
                            >
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}