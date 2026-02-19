'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { Container, Button, H1, P } from '@/components/Base';
import {
    ChevronRight, ChevronLeft, Check, Upload, X, AlertCircle,
    MapPin, Tag, FileText, Euro, Calendar, Image as ImageIcon, Palette,
} from 'lucide-react';

interface FormData {
    titre: string;
    description: string;
    categorie_id: string;
    prix: string;
    ville: string;
    code_postal: string;
    disponibilites: string;
    couleur_principale: string;
    photos: File[];
    lat?: number | null;
    lng?: number | null;
}

const STEPS = [
    { id: 1, label: 'Présentation',     icon: <FileText size={16} /> },
    { id: 2, label: 'Catégorie & Prix', icon: <Tag size={16} /> },
    { id: 3, label: 'Localisation',     icon: <MapPin size={16} /> },
    { id: 4, label: 'Disponibilités',   icon: <Calendar size={16} /> },
    { id: 5, label: 'Photos',           icon: <ImageIcon size={16} /> },
    { id: 6, label: 'Couleur vitrine',  icon: <Palette size={16} /> },
];

const PALETTE = [
    '#FFD359', '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FF8B94', '#A8E6CF', '#C7B8EA',
    '#F7DC6F', '#82E0AA', '#F1948A', '#85C1E9',
];

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_LABELS = 'JPG, PNG, WebP';
const MAX_SIZE_MB = 10;
const MAX_PHOTOS = 6;

function Field({ label, required, error, children }: {
    label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-dark">
                {label}{required && <span className="text-primary ml-1">*</span>}
            </label>
            {children}
            {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
        </div>
    );
}

function InputField({ value, onChange, placeholder, type = 'text', error, leftIcon }: {
    value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; error?: string; leftIcon?: React.ReactNode;
}) {
    return (
        <div className={`flex items-center border-2 rounded-xl bg-white transition-colors ${error ? 'border-red-400' : 'border-beige/40 focus-within:border-primary'}`}>
            {leftIcon && <span className="pl-3 text-gray-400 shrink-0">{leftIcon}</span>}
            <input type={type} value={value} onChange={e => onChange(e.target.value)}
                   placeholder={placeholder}
                   className="w-full px-3 py-3 bg-transparent text-dark placeholder-gray-400 text-sm outline-none" />
        </div>
    );
}

export default function AjouterAnnoncePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [previews, setPreviews] = useState<string[]>([]);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<FormData>({
        titre: '', description: '', categorie_id: '',
        prix: '', ville: '', code_postal: '',
        disponibilites: '', couleur_principale: '#FFD359', photos: [],
        lat: null,
        lng: null,
    });

    useEffect(() => {
        apiService.getCategories().then(setCategories).catch(() => {});
    }, []);

    useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

    const set = (field: keyof FormData, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handlePhotos = (files: FileList | null) => {
        if (!files) return;
        setPhotoError(null);
        const incoming = Array.from(files);
        const rejected: string[] = [];
        const valid: File[] = [];

        for (const file of incoming) {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                rejected.push(`${file.name} → format non supporté`);
                continue;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                rejected.push(`${file.name} → dépasse ${MAX_SIZE_MB} Mo`);
                continue;
            }
            valid.push(file);
        }

        if (rejected.length > 0) setPhotoError(`Ignoré : ${rejected.join(' / ')}`);

        const slots = MAX_PHOTOS - form.photos.length;
        const toAdd = valid.slice(0, slots);
        if (toAdd.length === 0) return;

        set('photos', [...form.photos, ...toAdd]);
        setPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePhoto = (i: number) => {
        URL.revokeObjectURL(previews[i]);
        set('photos', form.photos.filter((_, idx) => idx !== i));
        setPreviews(prev => prev.filter((_, idx) => idx !== i));
    };

    const validate = (s: number): boolean => {
        const e: typeof errors = {};
        if (s === 1) {
            if (!form.titre.trim() || form.titre.length < 5) e.titre = 'Minimum 5 caractères.';
            if (!form.description.trim() || form.description.length < 20) e.description = 'Minimum 20 caractères.';
        }
        if (s === 2) {
            if (!form.categorie_id) e.categorie_id = 'Choisissez une catégorie.';
            if (!form.prix || isNaN(Number(form.prix)) || Number(form.prix) <= 0) e.prix = 'Prix invalide.';
        }
        if (s === 3) {
            if (!form.ville.trim()) e.ville = 'La ville est requise.';
            if (!/^\d{5}$/.test(form.code_postal)) e.code_postal = '5 chiffres requis.';
        }
        if (s === 4 && !form.disponibilites.trim()) e.disponibilites = 'Précisez vos disponibilités.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const [isLocating, setIsLocating] = useState(false);
    const getLocation = () => {
        if (!navigator.geolocation) return alert("Géolocalisation non supportée");
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                set('lat', pos.coords.latitude);
                set('lng', pos.coords.longitude);
                setIsLocating(false);
            },
            () => { setIsLocating(false); alert("Position refusée ou introuvable."); },
            { enableHighAccuracy: true }
        );
    };

    const handleNext = () => { if (validate(step)) setStep(s => Math.min(s + 1, STEPS.length)); };
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const result = await apiService.createAnnonce({ ...form });
            router.push(`/u/${result.user_slug}/${result.annonce.slug}`);
        } catch (err) {
            console.error('Erreur:', err);
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: return (
                <div className="flex flex-col gap-6">
                    <Field label="Titre de l'annonce" required error={errors.titre}>
                        <InputField value={form.titre} onChange={v => set('titre', v)} placeholder="Ex : Prothésiste ongulaire à domicile" error={errors.titre} />
                    </Field>
                    <Field label="Description" required error={errors.description}>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)}
                                  placeholder="Décrivez votre activité, expérience, ce que vous proposez..."
                                  rows={6}
                                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 bg-white outline-none resize-none transition-colors ${errors.description ? 'border-red-400' : 'border-beige/40 focus:border-primary'}`} />
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-400">{form.description.length} caractères</span>
                            {form.description.length < 20 && <span className="text-xs text-gray-300">min. 20</span>}
                        </div>
                    </Field>
                </div>
            );
            case 2: return (
                <div className="flex flex-col gap-6">
                    <Field label="Catégorie" required error={errors.categorie_id}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {categories.map((cat: any) => (
                                <button key={cat.id} type="button" onClick={() => set('categorie_id', String(cat.id))}
                                        className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 text-left transition-all ${form.categorie_id === String(cat.id) ? 'border-primary bg-primary/10 text-primary' : 'border-beige/40 text-dark hover:border-primary/40'}`}>
                                    {cat.nom}
                                </button>
                            ))}
                        </div>
                    </Field>
                    <Field label="Tarif horaire (€)" required error={errors.prix}>
                        <InputField value={form.prix} onChange={v => set('prix', v)} placeholder="Ex : 45" type="number" error={errors.prix} leftIcon={<Euro size={16} />} />
                    </Field>
                </div>
            );
            case 3: return (
                <div className="flex flex-col gap-6">
                    <Field label="Ville" required error={errors.ville}>
                        <InputField value={form.ville} onChange={v => set('ville', v)} placeholder="Ex : Lyon" error={errors.ville} leftIcon={<MapPin size={16} />} />
                    </Field>
                    <Field label="Code postal" required error={errors.code_postal}>
                        <InputField value={form.code_postal} onChange={v => set('code_postal', v)} placeholder="Ex : 69001" error={errors.code_postal} />
                    </Field>
                </div>
            );
            case 4: return (
                <div className="flex flex-col gap-6">
                    <Field label="Vos disponibilités" required error={errors.disponibilites}>
                        <textarea value={form.disponibilites} onChange={e => set('disponibilites', e.target.value)}
                                  placeholder="Ex : Disponible le week-end et en soirée..."
                                  rows={5}
                                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 bg-white outline-none resize-none transition-colors ${errors.disponibilites ? 'border-red-400' : 'border-beige/40 focus:border-primary'}`} />
                    </Field>
                    <div>
                        <p className="text-xs text-gray-400 mb-2 font-medium">Suggestions rapides :</p>
                        <div className="flex flex-wrap gap-2">
                            {['Semaine uniquement', 'Week-end uniquement', 'Flexible', 'Soirs & week-ends', 'Toute la semaine'].map(s => (
                                <button key={s} type="button" onClick={() => set('disponibilites', s)}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${form.disponibilites === s ? 'bg-primary border-primary text-dark' : 'border-beige/60 text-gray-500 hover:border-primary/50'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            );
            case 5: return (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-gray-500">Jusqu'à <span className="font-bold text-dark">{MAX_PHOTOS} photos</span> — {ACCEPTED_LABELS}.</p>
                    {form.photos.length < MAX_PHOTOS && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-beige/60 rounded-2xl p-10 flex flex-col items-center gap-3 transition-colors group">
                            <Upload size={22} className="text-primary" />
                            <p className="text-sm font-semibold text-dark">Cliquez pour ajouter des photos</p>
                            <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(',')} multiple className="hidden" onChange={e => handlePhotos(e.target.files)} />
                        </button>
                    )}
                    {photoError && <p className="text-xs text-red-600">{photoError}</p>}
                    <div className="grid grid-cols-3 gap-3">
                        {previews.map((src, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-beige/20 group">
                                <img src={src} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removePhoto(i)} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 6: return (
                <div className="flex flex-col gap-8">
                    <p className="text-sm text-gray-500">Choisissez la couleur principale de votre vitrine.</p>
                    <div className="grid grid-cols-6 gap-3">
                        {PALETTE.map(color => (
                            <button key={color} type="button" onClick={() => set('couleur_principale', color)}
                                    className="relative aspect-square rounded-xl transition-transform hover:scale-110 border-2"
                                    style={{ backgroundColor: color, borderColor: form.couleur_principale === color ? '#000' : 'transparent' }}>
                                {form.couleur_principale === color && <Check size={14} className="text-dark m-auto" strokeWidth={3} />}
                            </button>
                        ))}
                    </div>

                    <div className="p-5 border-2 border-primary/20 bg-primary/5 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin size={20} className="text-primary" />
                            <p className="font-bold text-dark">Ma position exacte</p>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Autoriser la position permet d'apparaître en priorité aux clients autour de {form.ville || 'vous'}.</p>
                        {form.lat ? (
                            <div className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 p-3 rounded-xl"><Check size={16} /> Position capturée</div>
                        ) : (
                            <button type="button" onClick={getLocation} disabled={isLocating} className="w-full py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl flex items-center justify-center gap-2">
                                {isLocating ? "Recherche..." : "Partager ma position"}
                            </button>
                        )}
                    </div>

                    <div className="rounded-2xl overflow-hidden border-2 border-beige/20 shadow-sm bg-white">
                        <div className="h-2" style={{ backgroundColor: form.couleur_principale }} />
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div><p className="font-black text-dark text-lg">{form.titre || 'Votre titre'}</p><p className="text-sm text-gray-400">{form.ville || 'Votre ville'}</p></div>
                                <span className="font-black text-xl" style={{ color: form.couleur_principale }}>{form.prix ? `${form.prix}€` : '–€'}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-dark" style={{ backgroundColor: form.couleur_principale }}>Contacter</div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const progress = ((step - 1) / (STEPS.length - 1)) * 100;

    return (
        <main className="min-h-screen bg-gray-50/60 py-12">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <div className="mb-10 text-center">
                        <H1 className="text-3xl font-black italic text-dark">Publiez votre vitrine</H1>
                    </div>

                    <div className="mb-8">
                        <div className="relative h-1.5 bg-beige/30 rounded-full mb-6 overflow-hidden">
                            <div className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between">
                            {STEPS.map(s => (
                                <div key={s.id} className="flex flex-col items-center gap-1.5">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${s.id < step ? 'bg-primary border-primary text-dark' : s.id === step ? 'border-primary text-primary shadow-md' : 'border-beige/40 text-gray-300'}`}>
                                        {s.id < step ? <Check size={15} strokeWidth={3} /> : s.icon}
                                    </div>
                                    <span className={`text-[10px] font-semibold hidden sm:block ${s.id === step ? 'text-primary' : 'text-gray-300'}`}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-beige/20 p-8">
                        {renderStep()}
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-beige/20">
                            <button type="button" onClick={handleBack} disabled={step === 1} className="flex items-center gap-2 text-sm font-semibold text-gray-500 disabled:opacity-0">
                                <ChevronLeft size={16} /> Retour
                            </button>
                            {step === STEPS.length ? (
                                <Button onClick={handleSubmit} variant="primary" disabled={loading}>{loading ? 'Publication...' : 'Publier ma vitrine'}</Button>
                            ) : (
                                <Button onClick={handleNext} variant="primary">Continuer <ChevronRight size={16} /></Button>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}