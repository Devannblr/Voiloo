'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext'; // ✅ Ton nouveau contexte
import { Container, Button, P, Badge, Loader } from '@/components/Base';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Imports des éditeurs
import { HeaderEditor }    from "@/components/Vitrine/(editor)/Headereditor";
import { ColorsEditor }    from "@/components/Vitrine/(editor)/ColorsEditor";
import { SocialsEditor }   from "@/components/Vitrine/(editor)/Socialseditor";
import { AboutEditor }     from "@/components/Vitrine/(editor)/Abouteditor";
import { ParcoursEditor }  from "@/components/Vitrine/(editor)/Parcoureditor";
import { ServicesEditor }  from "@/components/Vitrine/(editor)/Serviceseditor";
import { PortfolioEditor } from "@/components/Vitrine/(editor)/Portfolioeditor";
import { ContactEditor }   from "@/components/Vitrine/(editor)/Contacteditor";

export default function VitrineEditPage() {
    const params = useParams();
    const router = useRouter();
    const userSlug    = params.userSlug    as string;
    const annonceSlug = params.annonceSlug as string;

    // ✅ On récupère l'utilisateur global
    const { user: currentUser, isLoading: authLoading } = useAuth();

    const [annonce, setAnnonce] = useState<any>(null);
    const [config, setConfig]   = useState<any>(null);
    const [draft, setDraft]     = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);
    const [saved, setSaved]     = useState(false);

    useEffect(() => {
        // Si l'auth a fini de charger et qu'il n'y a pas de user
        if (!authLoading && !currentUser) {
            router.push('/login');
            return;
        }

        const loadData = async () => {
            try {
                const [annonceData, configData] = await Promise.all([
                    apiService.getAnnonceBySlug(userSlug, annonceSlug),
                    apiService.getVitrineConfig(userSlug, annonceSlug),
                ]);

                // ✅ Sécurité : Vérifier si c'est bien le propriétaire
                if (currentUser && annonceData.user_id !== currentUser.id) {
                    router.push(`/u/${userSlug}/${annonceSlug}`);
                    return;
                }

                setAnnonce(annonceData);
                setConfig(configData);
                setDraft({
                    ...configData,
                    new_portfolio_files: [],
                    portfolio_images_to_delete: [],
                    delete_header_photo: false
                });
            } catch (err) {
                console.error("Erreur chargement vitrine:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) loadData();
    }, [userSlug, annonceSlug, router, currentUser, authLoading]);

    // ✅ Optimisé avec useMemo pour éviter les calculs lourds à chaque frappe au clavier
    const hasChanges = useMemo(() => {
        if (!draft || !config) return false;
        return JSON.stringify(draft) !== JSON.stringify({
            ...config,
            new_portfolio_files: [],
            portfolio_images_to_delete: [],
            delete_header_photo: false
        });
    }, [draft, config]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            // Laravel/Symfony ont souvent besoin de ce spoofing pour le multipart en PUT
            formData.append('_method', 'PUT');

            const plainStringKeys = [
                'couleur_principale', 'couleur_texte', 'couleur_fond',
                'slogan', 'template', 'instagram', 'linkedin',
                'facebook', 'twitter', 'site_web'
            ];

            Object.keys(draft).forEach(key => {
                if (key === 'new_portfolio_files') return;
                const value = draft[key];

                if (key === 'header_photo') {
                    if (value instanceof File) formData.append(key, value);
                }
                else if (key === 'delete_header_photo') {
                    formData.append(key, value ? '1' : '0');
                }
                else if (key === 'portfolio_images_to_delete') {
                    formData.append(key, JSON.stringify(value || []));
                }
                else if (key === 'show_contact_form') {
                    formData.append(key, value ? '1' : '0');
                }
                else if (plainStringKeys.includes(key)) {
                    formData.append(key, value || '');
                }
                else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
                    formData.append(key, JSON.stringify(value));
                }
                else if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (draft.new_portfolio_files?.length > 0) {
                draft.new_portfolio_files.forEach((file: File) => {
                    formData.append('portfolio_images[]', file);
                });
            }

            const data = await apiService.updateVitrineConfig(annonce.id, formData);

            setConfig(data.config);
            setDraft({
                ...data.config,
                new_portfolio_files: [],
                portfolio_images_to_delete: [],
                delete_header_photo: false
            });

            if (data.annonce) setAnnonce(data.annonce);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e: any) {
            console.error('Erreur sauvegarde:', e);
            alert("Erreur lors de la sauvegarde.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || authLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader variant="spinner" size="lg" color="primary" />
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header d'édition collé en haut */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <Container>
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <Link href={`/u/${userSlug}/${annonceSlug}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors font-bold">
                                <ArrowLeft size={16} /> Quitter l'édition
                            </Link>
                            <div className="h-6 w-px bg-gray-200" />
                            <div>
                                <P className="text-sm font-black italic uppercase tracking-tight">{annonce?.titre}</P>
                                <P className="text-[10px] text-gray-400 font-bold uppercase">Mode Éditeur</P>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {hasChanges && <Badge variant="warning" size="sm" className="animate-pulse">Modifications en cours</Badge>}
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSave}
                                disabled={!hasChanges || saving}
                                isLoading={saving}
                                className="font-bold italic uppercase"
                            >
                                {saved ? 'Enregistré !' : 'Enregistrer'}
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="py-12 max-w-4xl mx-auto space-y-12">
                {/* Ordre des sections d'édition utilisant tes composants */}
                <section className="space-y-8">
                    <HeaderEditor    draft={draft} setDraft={setDraft} />
                    <ColorsEditor    draft={draft} setDraft={setDraft} />
                    <AboutEditor     draft={draft} setDraft={setDraft} />
                    <ServicesEditor  draft={draft} setDraft={setDraft} />
                    <ParcoursEditor  draft={draft} setDraft={setDraft} />
                    <SocialsEditor   draft={draft} setDraft={setDraft} />
                    <PortfolioEditor draft={draft} setDraft={setDraft} annonce={annonce} />
                    <ContactEditor   draft={draft} setDraft={setDraft} />
                </section>
            </Container>
        </main>
    );
}