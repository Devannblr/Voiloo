'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { Loader2 } from 'lucide-react';

// Imports des types partagés
import { Annonce, VitrineConfig } from '@/components/Modules/types';

// Imports des composants
import OwnerBar from '@/components/Modules/OwnerBar';
import VitrineHero from '@/components/Modules/VitrineHero';
import VitrineNav from '@/components/Modules/VitrineNav';
import SectionAbout from '@/components/Modules/SectionAbout';
import SectionParcours from '@/components/Modules/SectionParcours';
import SectionServices from '@/components/Modules/SectionServices';
import SectionPortfolio from '@/components/Modules/SectionPortfolio';
import SectionContact from '@/components/Modules/SectionContact';
import VitrineFooter from '@/components/Modules/VitrineFooter';

export default function VitrinePage() {
    const params = useParams();
    const userSlug = params.userSlug as string;
    const annonceSlug = params.annonceSlug as string;

    // --- Gestion des URLs ---
    // On s'assure d'avoir la base sans /api pour les fichiers du dossier storage
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const storageBaseUrl = apiUrl.replace(/\/api$/, '');

    const [annonce, setAnnonce] = useState<Annonce | null>(null);
    const [config, setConfig] = useState<VitrineConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        Promise.all([
            apiService.getAnnonceBySlug(userSlug, annonceSlug),
            apiService.getVitrineConfig(userSlug, annonceSlug),
        ])
            .then(([annonceData, configData]) => {
                setAnnonce(annonceData);
                setConfig(configData);

                // Vérification si l'utilisateur est le propriétaire
                const token = localStorage.getItem('voiloo_token');
                if (token) {
                    apiService.getUser?.()
                        .then((user: any) => {
                            if (user?.id === annonceData.user_id) setIsOwner(true);
                        })
                        .catch(() => {});
                }
            })
            .catch((err) => console.error("Erreur chargement vitrine:", err))
            .finally(() => setLoading(false));
    }, [userSlug, annonceSlug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 size={32} className="animate-spin" style={{ color: '#FFD359' }} />
        </div>
    );

    if (!annonce || !config) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Vitrine introuvable</p>
        </div>
    );

    // Extraction des réglages de design
    const primary = config.couleur_principale || '#FFD359';
    const textColor = config.couleur_texte || '#1A1A1A';
    const bgColor = config.couleur_fond || '#FFFFFF';
    const sections = config.sections || {};

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // Préparation des éléments de navigation
    const navItems = [
        sections.about && { id: 'about', label: 'À propos' },
        sections.parcours && { id: 'parcours', label: 'Parcours' },
        (sections.services && sections.services.length > 0) && { id: 'services', label: 'Services' },
        (annonce.images && annonce.images.length > 0) && { id: 'portfolio', label: 'Portfolio' },
        config.show_contact_form && { id: 'contact', label: 'Contact' },
    ].filter(Boolean) as { id: string; label: string }[];

    return (
        <main style={{ backgroundColor: bgColor, color: textColor }} className="min-h-screen">

            {isOwner && (
                <OwnerBar
                    userSlug={userSlug}
                    annonceSlug={annonceSlug}
                    primary={primary}
                />
            )}

            <VitrineHero
                annonce={annonce}
                config={config}
                primary={primary}
                textColor={textColor}
                bgColor={bgColor}
                onContactClick={() => scrollTo('contact')}
            />

            <VitrineNav
                items={navItems}
                isOwner={isOwner}
                primary={primary}
                textColor={textColor}
                onSelect={scrollTo}
            />

            <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">

                {sections.about && (
                    <SectionAbout content={sections.about} primary={primary} />
                )}

                {sections.parcours && (
                    <SectionParcours parcours={sections.parcours} primary={primary} />
                )}

                {sections.services && sections.services.length > 0 && (
                    <SectionServices services={sections.services} primary={primary} />
                )}

                {/* Utilisation des images de l'annonce pour le portfolio */}
                {annonce.images && annonce.images.length > 0 && (
                    <SectionPortfolio
                        images={annonce.images.map((img: any) => img.path)}
                        primary={primary}
                        baseUrl={storageBaseUrl}
                    />
                )}

                {/* Formulaire de contact réel lié à l'ID de l'annonce */}
                {config.show_contact_form && (
                    <SectionContact
                        primary={primary}
                        annonceId={annonce.id}
                        destinataireEmail={annonce.user?.email || 'l\'annonceur'}
                    />
                )}

            </div>

            <VitrineFooter
                userSlug={userSlug}
                annonceSlug={annonceSlug}
                isOwner={isOwner}
                primary={primary}
                textColor={textColor}
            />
        </main>
    );
}