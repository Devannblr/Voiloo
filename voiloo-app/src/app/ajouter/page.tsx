'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import {
    Container, Button, H1, P, Loader, Label,
    Textarea, Checkbox, Input, H4, Badge as BaseBadge,
    Card, CardBody
} from '@/components/Base';
import {
    Check, Upload, X, MapPin, Tag, FileText, Euro,
    Image as ImageIcon, Search, Eye
} from 'lucide-react';
import AddressInput from "@/components/Modules/AdresseInput";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Types pour la structure du formulaire
interface AnnonceForm {
    titre: string;
    description: string;
    categorie_id: string;
    prix: string;
    ville: string;
    code_postal: string;
    adresse: string;
    disponibilites: string;
    couleur_principale: string;
    photos: File[];
    lat: number | null;
    lng: number | null;
    consentGPS: boolean;
    acceptCGU: boolean;
}

const STEPS = [
    { id: 1, label: 'L’essentiel', icon: <Tag size={16} /> },
    { id: 2, label: 'Détails',    icon: <FileText size={16} /> },
    { id: 3, label: 'Style',      icon: <ImageIcon size={16} /> },
    { id: 4, label: 'Finitions',  icon: <MapPin size={16} /> },
    { id: 5, label: 'Récapitulatif', icon: <Eye size={16} /> },
];

const PALETTE = ['#FFD359', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF8B94', '#A8E6CF', '#C7B8EA'];

const DISPO_SUGGESTIONS = [
    "Semaine", "Week-end", "Soirs", "Flexible", "Sur RDV"
];

const STORAGE_KEY = 'voiloo_draft_annonce';

export default function AjouterAnnoncePage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [step, setStep] = useState(1);
    const [maxStepReached, setMaxStepReached] = useState(1);
    const [categories, setCategories] = useState<{ id: string, nom: string }[]>([]);
    const [catSearch, setCatSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<AnnonceForm>({
        titre: '', description: '', categorie_id: '', prix: '',
        ville: '', code_postal: '', adresse: '',
        disponibilites: '', couleur_principale: '#FFD359',
        photos: [], lat: null, lng: null,
        consentGPS: false, acceptCGU: false
    });

    // Restauration LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setForm(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Restore error", e);
            }
        }

        apiService.getCategories().then(res => {
            setCategories([...res].sort((a, b) => a.nom.localeCompare(b.nom)));
        });
    }, [isAuthenticated, authLoading, router]);

    // Sauvegarde auto
    useEffect(() => {
        const { photos, ...toSave } = form;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }, [form]);

    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filteredCategories = useMemo(() => {
        const search = normalize(catSearch);
        return categories.filter(c => normalize(c.nom).includes(search));
    }, [categories, catSearch]);

    const selectedCategoryName = useMemo(() => {
        return categories.find(c => c.id === form.categorie_id)?.nom;
    }, [categories, form.categorie_id]);

    const set = (field: keyof AnnonceForm, value: any) => {
        setForm((prev: AnnonceForm) => ({ ...prev, [field]: value }));
        setErrors((prev: Record<string, string | undefined>) => ({ ...prev, [field]: undefined }));
    };

    const addSuggestion = (s: string) => {
        const current = form.disponibilites.trim();
        const newVal = current ? `${current}, ${s}` : s;
        set('disponibilites', newVal);
    };

    const validate = (s: number) => {
        const e: Record<string, string | undefined> = {};
        if (s === 1) {
            if (form.titre.length < 5) e.titre = "Titre trop court (min. 5)";
            if (!form.categorie_id) e.categorie_id = "Veuillez choisir une catégorie";
            if (!form.prix) e.prix = "Le prix est requis";
        }
        if (s === 2 && form.description.length < 20) e.description = "La description est trop courte";
        if (s === 4) {
            if (!form.ville) e.ville = "L'adresse est requise";
            if (!form.acceptCGU) e.acceptCGU = "Vous devez accepter les conditions";
        }
        setErrors(e);
        const isValid = Object.keys(e).length === 0;
        if (isValid && s === step) setMaxStepReached(prev => Math.max(prev, s + 1));
        return isValid;
    };

    const handleStepClick = (targetStep: number) => {
        if (targetStep <= maxStepReached) setStep(targetStep);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const result = await apiService.createAnnonce(form);
            localStorage.removeItem(STORAGE_KEY);
            router.push(`/u/${result.user_username}/${result.annonce.slug}`);
        } catch (err) {
            alert("Erreur lors de la création");
            setLoading(false);
        }
    };

    if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

    return (
        <ProtectedRoute redirectTo="/login?callbackUrl=/ajouter">
        <main className="min-h-screen bg-gray-50/60 py-12">
            <Container className="max-w-2xl">
                <div className="mb-10 text-center">
                    <H1 className="font-black italic uppercase tracking-tighter mb-6">Ma Vitrine</H1>

                    <div className="flex items-center justify-between px-2 max-w-lg mx-auto">
                        {STEPS.map((s, idx) => (
                            <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                <button
                                    onClick={() => handleStepClick(s.id)}
                                    disabled={s.id > maxStepReached}
                                    className={`flex flex-col items-center gap-2 transition-all ${s.id <= maxStepReached ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-30'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${step === s.id ? 'bg-primary border-primary text-dark scale-110' : step > s.id ? 'bg-dark border-dark text-white' : 'bg-white border-beige/40 text-gray-300'}`}>
                                        {step > s.id ? <Check size={18} /> : s.icon}
                                    </div>
                                </button>
                                {idx < STEPS.length - 1 && (
                                    <div className={`h-1 flex-1 mx-2 rounded-full ${step > s.id ? 'bg-dark' : 'bg-beige/20'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-beige/20 relative overflow-hidden">

                    {/* ÉTAPE 1 : L'OFFRE */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Input
                                label="Titre de votre service"
                                placeholder="Ex: Prothésiste ongulaire"
                                value={form.titre}
                                onChange={e => set('titre', e.target.value)}
                                error={errors.titre}
                                required
                            />

                            <div className="space-y-3">
                                <Label>Catégorie</Label>
                                {form.categorie_id ? (
                                    <div className="flex items-center justify-between p-4 bg-primary/10 border-2 border-primary rounded-2xl">
                                        <span className="font-bold text-dark">{selectedCategoryName}</span>
                                        <button onClick={() => set('categorie_id', '')} className="p-1 hover:bg-primary/20 rounded-full"><X size={18} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <Input
                                            placeholder="Rechercher une catégorie..."
                                            leftIcon={<Search size={18} />}
                                            value={catSearch}
                                            onChange={(e) => setCatSearch(e.target.value)}
                                            error={errors.categorie_id}
                                        />
                                        <div className="max-h-48 overflow-y-auto border-2 border-beige/20 rounded-2xl bg-gray-50/50 p-2 custom-scrollbar grid grid-cols-1 gap-1">
                                            {filteredCategories.map(c => (
                                                <button key={c.id} onClick={() => { set('categorie_id', c.id); setCatSearch(''); }}
                                                        className="w-full text-left p-3 px-4 rounded-xl hover:bg-white text-sm font-medium text-gray-600 transition-colors">
                                                    {c.nom}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <Input
                                label="Tarif de base (€)"
                                type="number"
                                leftIcon={<Euro size={18} />}
                                value={form.prix}
                                onChange={e => set('prix', e.target.value)}
                                error={errors.prix}
                                required
                            />
                        </div>
                    )}

                    {/* ÉTAPE 2 : LE CONTENU */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Textarea
                                    label="Description détaillée"
                                    placeholder="Décrivez votre talent, votre expérience..."
                                    rows={6}
                                    value={form.description}
                                    onChange={e => set('description', e.target.value)}
                                    error={errors.description}
                                    hint={`${form.description.length} / 20 caractères minimum.`}
                                />
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${form.description.length >= 20 ? 'bg-green-500' : 'bg-red-400'}`}
                                         style={{ width: `${Math.min((form.description.length / 20) * 100, 100)}%` }} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Vos disponibilités"
                                    placeholder="Ex: Soirs & week-ends"
                                    value={form.disponibilites}
                                    onChange={e => set('disponibilites', e.target.value)}
                                />
                                <div className="flex flex-wrap gap-2">
                                    {DISPO_SUGGESTIONS.map(s => (
                                        <button key={s} onClick={() => addSuggestion(s)} className="px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all border border-transparent hover:border-primary/20">
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 3 : STYLE */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <Label>Photos (max 6)</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {previews.map((p, i) => (
                                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm">
                                            <img src={p} className="w-full h-full object-cover" alt="preview" />
                                            <button onClick={() => {
                                                const newPhotos = [...form.photos]; newPhotos.splice(i, 1);
                                                const newPrevs = [...previews]; newPrevs.splice(i, 1);
                                                setForm(prev => ({...prev, photos: newPhotos})); setPreviews(newPrevs);
                                            }} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><X /></button>
                                        </div>
                                    ))}
                                    {form.photos.length < 6 && (
                                        <button onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-primary/40 rounded-2xl flex flex-col items-center justify-center text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                                            <Upload size={24} />
                                            <input ref={fileInputRef} type="file" className="hidden" multiple onChange={e => {
                                                const files = Array.from(e.target.files || []);
                                                setForm(prev => ({...prev, photos: [...prev.photos, ...files]}));
                                                setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
                                            }} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Couleur de votre vitrine</Label>
                                <div className="flex flex-wrap gap-3">
                                    {PALETTE.map(c => (
                                        <button key={c} onClick={() => set('couleur_principale', c)}
                                                className={`w-12 h-12 rounded-2xl border-4 transition-all ${form.couleur_principale === c ? 'scale-110 border-dark shadow-lg' : 'border-transparent opacity-60'}`}
                                                style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                                <div className="mt-6 p-6 rounded-[2rem] border-2 bg-white relative overflow-hidden" style={{ borderColor: form.couleur_principale + '40' }}>
                                    <div className="flex justify-between items-center mb-2">
                                        <BaseBadge variant="primary" size="sm">Aperçu</BaseBadge>
                                        <span className="font-bold text-lg" style={{ color: form.couleur_principale }}>{form.prix || '0'}€</span>
                                    </div>
                                    <H4 className="mb-1 font-bold">{form.titre || "Titre de l'annonce"}</H4>
                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                        <MapPin size={12}/> {form.ville || "Votre ville"}
                                    </div>
                                    <div className="mt-4 h-8 w-24 rounded-lg" style={{ backgroundColor: form.couleur_principale }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 4 : LOCALISATION */}
                    {step === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <Label>Votre localisation</Label>
                                <AddressInput value={form.adresse} onChange={(data) => setForm(prev => ({...prev, ...data}))} />
                                {form.ville && (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-bold">
                                        <Check size={16} strokeWidth={3} /> Coordonnées trouvées : {form.ville}
                                    </div>
                                )}
                                {errors.ville && <p className="text-red-500 text-xs font-bold">{errors.ville}</p>}
                            </div>

                            <Card variant="outlined" className="bg-gray-50/50">
                                <CardBody className="space-y-5">
                                    <Checkbox
                                        id="gps"
                                        label="Activer la précision GPS"
                                        checked={form.consentGPS}
                                        onChange={(e) => set('consentGPS', e.target.checked)}
                                    />
                                    <Checkbox
                                        id="cgu"
                                        label="J'accepte les conditions générales"
                                        checked={form.acceptCGU}
                                        onChange={(e) => set('acceptCGU', e.target.checked)}
                                        error={errors.acceptCGU}
                                    />
                                </CardBody>
                            </Card>
                        </div>
                    )}

                    {/* ÉTAPE 5 : RÉCAPITULATIF */}
                    {step === 5 && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 bg-primary/10 text-primary rounded-full mb-2"><Eye /></div>
                                <H4 className="font-bold">Dernière vérification</H4>
                                <P className="text-xs text-gray-500">Tout semble correct avant la mise en ligne ?</P>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Service</span>
                                    <p className="text-sm font-bold truncate">{form.titre}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Tarif</span>
                                    <p className="text-sm font-bold text-primary">{form.prix}€</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl col-span-2">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Localisation</span>
                                    <p className="text-sm font-bold">{form.adresse}, {form.ville}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl col-span-2">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Disponibilités</span>
                                    <p className="text-sm font-bold truncate">{form.disponibilites || 'Non précisé'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NAVIGATION */}
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-beige/10">
                        <Button
                            onClick={() => setStep(s => s - 1)}
                            className={`font-bold text-sm uppercase transition-colors ${step === 1 ? 'invisible' : 'text-gray-400 hover:text-dark'}`}
                        >
                            ← Retour
                        </Button>

                        {step < 5 ? (
                            <Button
                                onClick={() => validate(step) && setStep(s => s + 1)}
                                variant="primary"
                                className="px-10"
                            >
                                Suivant
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                variant="primary"
                                isLoading={loading}
                                className="px-10"
                            >
                                Confirmer et Publier
                            </Button>
                        )}
                    </div>
                </div>
            </Container>
        </main>
        </ProtectedRoute>
    );
}