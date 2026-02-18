'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { Container, Button, H2, P, Badge } from '@/components/Base';
import { Save, Eye, ArrowLeft, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { HeaderEditor }   from "@/components/Vitrine/Headereditor";
import { SocialsEditor }  from "@/components/Vitrine/Socialseditor";
import { AboutEditor }    from "@/components/Vitrine/Abouteditor";
import { ParcoursEditor } from "@/components/Vitrine/Parcoureditor";
import { ServicesEditor } from "@/components/Vitrine/Serviceseditor";
import { PortfolioEditor } from "@/components/Vitrine/Portfolioeditor";
import { ContactEditor }  from "@/components/Vitrine/Contacteditor";

export default function VitrineEditPage() {
    const params = useParams();
    const router = useRouter();
    const userSlug    = params.userSlug    as string;
    const annonceSlug = params.annonceSlug as string;

    const [annonce, setAnnonce] = useState<any>(null);
    const [config, setConfig]   = useState<any>(null);
    const [draft, setDraft]     = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);
    const [saved, setSaved]     = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('voiloo_token');
        if (!token) {
            router.push('/login');
            return;
        }

        Promise.all([
            apiService.getAnnonceBySlug(userSlug, annonceSlug),
            apiService.getVitrineConfig(userSlug, annonceSlug),
        ])
            .then(([annonceData, configData]) => {
                setAnnonce(annonceData);
                setConfig(configData);
                setDraft(configData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [userSlug, annonceSlug]);

    const hasChanges = JSON.stringify(draft) !== JSON.stringify(config);

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');

            Object.keys(draft).forEach(key => {
                const value = draft[key];
                if (value === null || value === undefined) return;

                if (key === 'show_contact_form') {
                    formData.append(key, value ? '1' : '0');
                } else if (key === 'sections' || key === 'options') {
                    // Décoder côté Laravel avec json_decode dans le controller
                    formData.append(key, JSON.stringify(value));
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vitrine/${annonce.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('voiloo_token')}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Erreurs de validation Laravel:', data.errors);
                throw new Error('Erreur de validation');
            }

            setConfig(draft);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            console.error('Erreur sauvegarde:', e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary" />
        </div>
    );

    if (!annonce || !config) return (
        <div className="min-h-screen flex items-center justify-center">
            <P>Erreur de chargement</P>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Top bar sticky */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <Container>
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            {/* ← Retour vers la vitrine publique */}
                            <Link href={`/u/${userSlug}/${annonceSlug}`}
                                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors">
                                <ArrowLeft size={16} />
                                Retour à la vitrine
                            </Link>
                            <div className="h-6 w-px bg-gray-200" />
                            <div>
                                <P className="text-sm font-bold text-dark">{annonce.titre}</P>
                                <P className="text-xs text-gray-400">Édition de la vitrine</P>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {hasChanges && (
                                <Badge variant="warning" size="sm">Non sauvegardé</Badge>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<Eye size={16} />}
                                onClick={() => window.open(`/u/${userSlug}/${annonceSlug}`, '_blank')}
                            >
                                Prévisualiser
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={saved ? <Check size={16} /> : <Save size={16} />}
                                onClick={handleSave}
                                disabled={!hasChanges || saving}
                                isLoading={saving}
                            >
                                {saved ? 'Sauvegardé !' : 'Sauvegarder'}
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="py-12 max-w-4xl mx-auto space-y-8">
                    <div className="text-center mb-12">
                        <Badge variant="primary" className="mb-3">Personnalisation</Badge>
                        <H2 className="text-3xl font-black italic text-dark mb-2">
                            Construisez votre vitrine
                        </H2>
                        <P className="text-gray-500">
                            Chaque modification est sauvegardée en un clic. Prévisualisez en temps réel.
                        </P>
                    </div>

                    <HeaderEditor   draft={draft} setDraft={setDraft} />
                    <SocialsEditor  draft={draft} setDraft={setDraft} />
                    <AboutEditor    draft={draft} setDraft={setDraft} />
                    <ParcoursEditor draft={draft} setDraft={setDraft} />
                    <ServicesEditor draft={draft} setDraft={setDraft} />
                    <PortfolioEditor draft={draft} setDraft={setDraft} annonce={annonce} />
                    <ContactEditor  draft={draft} setDraft={setDraft} />

                    <div className="flex justify-center pt-8 border-t border-gray-200">
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            isLoading={saving}
                            className="px-12"
                        >
                            {saved ? 'Sauvegardé !' : 'Sauvegarder les modifications'}
                        </Button>
                    </div>
                </div>
            </Container>
        </main>
    );
}