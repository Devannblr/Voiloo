'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { Container, Button, H1 } from '@/components/Base';
import { Loader2, Save, ArrowLeft, Euro, MapPin, Tag, FileText, Calendar } from 'lucide-react';

export default function EditerAnnoncePage() {
    const router = useRouter();
    const params = useParams();
    const userSlug = params.userSlug as string;
    const annonceSlug = params.annonceSlug as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const [form, setForm] = useState({
        id: '',
        titre: '',
        description: '',
        categorie_id: '',
        prix: '',
        ville: '',
        code_postal: '',
        disponibilites: ''
    });

    useEffect(() => {
        Promise.all([
            apiService.getCategories(),
            apiService.getAnnonceBySlug(userSlug, annonceSlug)
        ]).then(([cats, annonce]) => {
            setCategories(cats);
            setForm({
                id: annonce.id,
                titre: annonce.titre,
                description: annonce.description,
                categorie_id: String(annonce.categorie_id),
                prix: String(annonce.prix),
                ville: annonce.ville,
                code_postal: annonce.code_postal,
                disponibilites: annonce.disponibilites || ''
            });
            setLoading(false);
        }).catch(err => {
            console.error(err);
            router.push('/');
        });
    }, [userSlug, annonceSlug]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiService.updateAnnonce(form.id, form);
            router.push(`/u/${userSlug}/${annonceSlug}`);
        } catch (err) {
            alert("Erreur lors de la modification");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-dark">
                        <ArrowLeft size={18} /> Retour
                    </button>

                    <div className="bg-white rounded-3xl shadow-sm border border-beige/20 p-8">
                        <H1 className="text-2xl font-black mb-8 italic text-dark">Modifier l'annonce</H1>

                        <div className="space-y-6">
                            {/* TITRE */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-dark flex items-center gap-2">
                                    <FileText size={16} className="text-gray-400" /> Titre
                                </label>
                                <input
                                    value={form.titre}
                                    onChange={e => setForm({...form, titre: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-beige/40 rounded-xl focus:border-primary outline-none transition-colors"
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
                                        className="w-full px-4 py-3 border-2 border-beige/40 rounded-xl focus:border-primary outline-none bg-white appearance-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* PRIX */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-dark flex items-center gap-2">
                                        <Euro size={16} className="text-gray-400" /> Tarif horaire
                                    </label>
                                    <input
                                        type="number"
                                        value={form.prix}
                                        onChange={e => setForm({...form, prix: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-beige/40 rounded-xl focus:border-primary outline-none"
                                    />
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-dark">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    rows={5}
                                    className="w-full px-4 py-3 border-2 border-beige/40 rounded-xl focus:border-primary outline-none resize-none"
                                />
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
                                    className="w-full px-4 py-3 border-2 border-beige/40 rounded-xl focus:border-primary outline-none"
                                />
                            </div>

                            {/* VILLE & CP */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-dark flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400" /> Ville
                                    </label>
                                    <input
                                        value={form.ville}
                                        onChange={e => setForm({...form, ville: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-beige/40 rounded-xl focus:border-primary outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-dark">Code Postal</label>
                                    <input
                                        value={form.code_postal}
                                        onChange={e => setForm({...form, code_postal: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-beige/40 rounded-xl focus:border-primary outline-none"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleSave}
                                className="w-full mt-4 flex items-center justify-center gap-2 h-12 rounded-2xl"
                                disabled={saving}
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Enregistrer les modifications</>}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}