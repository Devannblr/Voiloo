'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {useParams, useRouter} from 'next/navigation';
import { apiService } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';

// Tes composants Base
import { Loader, Container, P, Button } from '@/components/Base';
import { Annonce, VitrineConfig } from '@/components/Modules/types';

// Tes composants Vitrine
import OwnerBar from '@/components/Modules/OwnerBar';
import VitrineHero from '@/components/Vitrine/(vitrine)/VitrineHero';
import VitrineNav from '@/components/Vitrine/(vitrine)/VitrineNav';
import SectionAbout from '@/components/Modules/(section)/SectionAbout';
import SectionParcours from '@/components/Modules/(section)/SectionParcours';
import SectionServices from '@/components/Modules/(section)/SectionServices';
import SectionPortfolio from '@/components/Modules/(section)/SectionPortfolio';
import SectionAvis from '@/components/Modules/(section)/SectionAvis';
import SectionContact from '@/components/Modules/(section)/SectionContact';
import VitrineFooter from '@/components/Vitrine/(vitrine)/VitrineFooter';
import {useToast} from "@/components/Layouts/Toastprovider";

export default function VitrinePage() {
    const params = useParams();
    const userSlug = params.userSlug as string;
    const annonceSlug = params.annonceSlug as string;

    const { user: currentUser, isLoading: authLoading } = useAuth();

    const [annonce, setAnnonce] = useState<Annonce | null>(null);
    const [config, setConfig] = useState<VitrineConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const [headerVisible, setHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);
    const scrollDownAccum = useRef(0);
    const HIDE_THRESHOLD = 200;
    const router = useRouter();
    const { toast } = useToast();
    const [contacting, setContacting] = useState(false);

    /**
     * ✅ MODIFICATION : Redirection simple vers la messagerie
     * On ne crée plus de conversation côté serveur ici pour éviter le message automatique.
     */
    const handleContact = () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        if (!annonce) return;

        // On redirige avec les paramètres. MessagesPage s'occupera du reste.
        router.push(`/messages?user_id=${annonce.user_id}&annonce_id=${annonce.id}`);
    };

    // Gestion du scroll et resize
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();

        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            if (currentY < 50) {
                setHeaderVisible(true);
                scrollDownAccum.current = 0;
            } else if (delta > 0) {
                scrollDownAccum.current += delta;
                if (scrollDownAccum.current > HIDE_THRESHOLD) setHeaderVisible(false);
            } else {
                scrollDownAccum.current = 0;
                setHeaderVisible(true);
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener('resize', checkMobile);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Chargement des données de l'annonce
    useEffect(() => {
        if (!userSlug || !annonceSlug) return;

        const fetchVitrine = async () => {
            setLoading(true);
            try {
                const [annonceData, configData] = await Promise.all([
                    apiService.getAnnonceBySlug(userSlug, annonceSlug),
                    apiService.getVitrineConfig(userSlug, annonceSlug),
                ]);
                setAnnonce(annonceData);
                setConfig(configData);
            } catch (err) {
                console.error("Erreur chargement vitrine:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVitrine();
    }, [userSlug, annonceSlug]);

    const isOwner = useMemo(() => {
        return !!(currentUser && annonce && currentUser.id === annonce.user_id);
    }, [currentUser, annonce]);

    if (loading || authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader variant="spinner" size="lg" color="primary" />
        </div>
    );

    if (!annonce || !config) return (
        <Container className="min-h-screen flex flex-col items-center justify-center">
            <P className="text-gray-500 italic mb-4">Vitrine introuvable</P>
            <Button href="/">Retour à l'accueil</Button>
        </Container>
    );

    const primary = config.couleur_principale || '#FFD359';
    const textColor = config.couleur_texte || '#1A1A1A';
    const bgColor = config.couleur_fond || '#FFFFFF';
    const sections = config.sections || {};

    const DESKTOP_HEADER_H = 64;
    const currentHeaderH = isMobile ? 0 : DESKTOP_HEADER_H;
    const ownerBarH = isMobile ? 48 : 54;

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const navHeight = isOwner ? (currentHeaderH + ownerBarH + 50) : (currentHeaderH + 50);
            const elementPosition = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - navHeight,
                behavior: 'smooth'
            });
        }
    };

    const navItems = [
        sections.about && { id: 'about', label: 'À propos' },
        sections.parcours && { id: 'parcours', label: 'Parcours' },
        ((sections.services?.length ?? 0) > 0) && { id: 'services', label: 'Services' },
        ((annonce.images?.length ?? 0) > 0) && { id: 'portfolio', label: 'Portfolio' },
        { id: 'avis', label: 'Avis' },
        config.show_contact_form && { id: 'contact', label: 'Contact' },
    ].filter(Boolean) as { id: string; label: string }[];

    return (
        <main style={{ backgroundColor: bgColor, color: textColor }} className="min-h-screen relative">

            {isOwner && (
                <div
                    className="sticky z-[90] transition-transform duration-300 border-b border-black/5"
                    style={{
                        top: `${currentHeaderH}px`,
                        transform: headerVisible ? 'translateY(0)' : `translateY(-${currentHeaderH}px)`
                    }}
                >
                    <OwnerBar
                        userSlug={userSlug}
                        annonceSlug={annonceSlug}
                        primary={primary}
                    />
                </div>
            )}

            <VitrineHero
                annonce={annonce}
                config={config}
                primary={primary}
                textColor={textColor}
                bgColor={bgColor}
                onContactClick={() => scrollTo('contact')}
                onMessageClick={!isOwner ? handleContact : undefined}
                isContacting={contacting}
            />

            <div
                className="sticky z-[80] transition-transform duration-300 shadow-sm"
                style={{
                    top: isOwner ? `${currentHeaderH + ownerBarH}px` : `${currentHeaderH}px`,
                    transform: headerVisible ? 'translateY(0)' : `translateY(-${currentHeaderH}px)`
                }}
            >
                <VitrineNav
                    items={navItems}
                    isOwner={isOwner}
                    primary={primary}
                    textColor={textColor}
                    bgColor={bgColor}
                    onSelect={scrollTo}
                />
            </div>

            <div className="max-w-3xl mx-auto px-6 py-12 space-y-24">
                {sections.about && (
                    <SectionAbout content={sections.about} primary={primary} />
                )}

                {sections.parcours && (
                    <SectionParcours parcours={sections.parcours} primary={primary} />
                )}

                {((sections.services?.length ?? 0) > 0) && (
                    <SectionServices services={sections.services!} primary={primary} />
                )}

                {((annonce.images?.length ?? 0) > 0) && (
                    <SectionPortfolio
                        images={annonce.images || []}
                        primary={primary}
                        note={sections.portfolio_note}
                    />
                )}

                <SectionAvis
                    avis={annonce.avis || []}
                    primary={primary}
                    annonceId={annonce.id}
                />

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