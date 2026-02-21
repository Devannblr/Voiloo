'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { Container, Button, H1 } from '@/components/Base';
import { Loader2, Save, ArrowLeft, Euro, MapPin, Tag, FileText, Calendar, Home } from 'lucide-react';
import AddressInput from "@/components/Modules/AdresseInput";

export default function EditerAnnoncePage() {
    const router = useRouter();
    const params = useParams();
    const userSlug = params.userSlug as string;
    const initialAnnonceSlug = params.annonceSlug as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const [form, setForm] = useState({
        id: '',
        titre: '',
        description: '',
        categorie_id: '',
        prix: '',
        adresse: '', // Ajouté
        ville: '',
        code_postal: '',
        disponibilites: '',
        lat: parseFloat(""),
        lng: parseFloat(""),
    });

    useEffect(() => {
        Promise.all([
            apiService.getCategories(),
            apiService.getAnnonceBySlug(userSlug, initialAnnonceSlug)
        ]).then(([cats, annonce]) => {
            setCategories(cats);
            setForm({
                id: annonce.id,
                titre: annonce.titre,
                description: annonce.description,
                categorie_id: String(annonce.categorie_id),
                prix: String(annonce.prix),
                adresse: annonce.adresse || '', // Ajouté
                ville: annonce.ville || '',
                code_postal: annonce.code_postal || '',
                disponibilites: annonce.disponibilites || '',
                lat: annonce.lat ?? null,
                lng: annonce.lng ?? null,
            });
            setLoading(false);
        }).catch(err => {
            console.error(err);
            router.push('/');
        });
    }, [userSlug, initialAnnonceSlug, router]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await apiService.updateAnnonce(form.id, form);
            const nextSlug = response.new_slug || initialAnnonceSlug;
            alert("Modification réussie !");
            router.push(`/u/${userSlug}/${nextSlug}`);
            router.refresh();
        } catch (err: any) {
            console.error("Erreur complète:", err);
            const errorMsg = err.response?.data?.message || "Erreur lors de la modification";
            alert(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-dark font-bold">
                        <ArrowLeft size={18} /> Retour
                    </button>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <H1 className="text-2xl font-black mb-8 italic text-dark uppercase tracking-tight">Modifier l'annonce</H1>

                        <div className="space-y-6">
                            {/* TITRE */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-dark flex items-center gap-2">
                                    <FileText size={16} className="text-gray-400" /> Titre de l'annonce
                                </label>
                                <input
                                    value={form.titre}
                                    onChange={e => setForm({...form, titre: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl focus:border-primary outline-none transition-colors"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* CATEGORIE */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-dark flex items-center gap-2">
                                        <Tag size={16} className="text-gray-400" /> Catégorie
                                    </label>
                                    <select
                                        value={form.categorie_id}
                                        onChange={e => setForm({...form, categorie_id: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl focus:border-primary outline-none bg-white"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* PRIX */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-dark flex items-center gap-2">
                                        <Euro size={16} className="text-gray-400" /> Tarif horaire (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={form.prix}
                                        onChange={e => setForm({...form, prix: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl focus:border-primary outline-none"
                                    />
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-dark">Description de vos services</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    rows={5}
                                    className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl focus:border-primary outline-none resize-none"
                                />
                            </div>


                            {/* VILLE & CP */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-dark flex items-center gap-2">
                                    <Home size={16} className="text-gray-400" /> Adresse complète
                                </label>
                                <AddressInput
                                    value={form.adresse}
                                    onChange={({ adresse, ville, code_postal, lat, lng }) =>
                                        setForm(f => ({ ...f, adresse, ville, code_postal, lat, lng }))
                                    }
                                />
                                {/* Affichage en lecture seule des champs auto-remplis */}
                                {form.ville && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        📍 {form.ville} — {form.code_postal}
                                        {form.lat && <span className="ml-2 text-green-600 font-semibold">✓ Coordonnées capturées</span>}
                                    </p>
                                )}
                            </div>

                            {/* DISPONIBILITÉS */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-dark flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" /> Disponibilités
                                </label>
                                <input
                                    value={form.disponibilites}
                                    onChange={e => setForm({...form, disponibilites: e.target.value})}
                                    placeholder="Ex: Semaine et week-end"
                                    className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl focus:border-primary outline-none"
                                />
                            </div>

                            <Button
                                onClick={handleSave}
                                className="w-full mt-4 flex items-center justify-center gap-2 h-14 rounded-2xl text-lg font-bold"
                                disabled={saving}
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer</>}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}