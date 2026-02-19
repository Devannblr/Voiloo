'use client';

import { Instagram, Linkedin, Facebook, Twitter, Globe, MapPin, MessageCircle, Share2 } from 'lucide-react';
import {
    Badge,
    P,
    H1,
    Price,
    Button,
    IconButton
} from '@/components/Base';
import { Link } from '@/components/Base/Link'
import { Annonce, VitrineConfig } from './types';

interface HeroProps {
    annonce: Annonce;
    config: VitrineConfig;
    primary: string;
    textColor: string;
    bgColor: string;
    onContactClick: () => void;
}

export default function VitrineHero({ annonce, config, primary, textColor, bgColor, onContactClick }: HeroProps) {
    // ✅ Récupération de l'URL de stockage depuis le .env
    const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

    const socials = [
        { key: 'instagram', icon: <Instagram size={18} />, label: 'Instagram', value: config.instagram },
        { key: 'linkedin',  icon: <Linkedin  size={18} />, label: 'LinkedIn',  value: config.linkedin  },
        { key: 'facebook',  icon: <Facebook  size={18} />, label: 'Facebook',  value: config.facebook  },
        { key: 'twitter',   icon: <Twitter   size={18} />, label: 'Twitter',   value: config.twitter   },
        { key: 'site_web',  icon: <Globe     size={18} />, label: 'Site web',  value: config.site_web  },
    ].filter(s => s.value);

    const handleShare = async () => {
        const url = window.location.href;
        const userName = (annonce.user as any)?.name || 'ce prestataire';

        const shareData = {
            title: annonce.titre,
            text: config.slogan || `Découvrez les services de ${userName}`,
            url: url,
        };

        if (navigator.share && (navigator as any).canShare?.(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                if ((err as Error).name !== 'AbortError') console.error('Erreur partage:', err);
            }
        }

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(url);
                alert('Lien copié !');
                return;
            } catch (err) {
                console.error('Erreur clipboard:', err);
            }
        }

        try {
            const textArea = document.createElement("textarea");
            textArea.value = url;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Lien copié dans le presse-papier !');
        } catch (err) {
            console.error('Échec de la copie:', err);
        }
    };

    return (
        <section className="relative">
            {/* Header Photo / Cover */}
            {config.header_photo ? (
                <div className="relative w-full aspect-[3/1] max-h-72 overflow-hidden">
                    {/* ✅ Concaténation propre : URL du back + path de la BDD */}
                    <img
                        src={`${STORAGE_URL}/${config.header_photo}`}
                        alt="Couverture"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to bottom, transparent 40%, ${bgColor})` }}
                    />
                </div>
            ) : (
                <div className="w-full h-48" style={{ backgroundColor: `${primary}33` }}>
                    <div
                        className="w-full h-full opacity-20"
                        style={{ backgroundImage: `radial-gradient(${primary} 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
                    />
                </div>
            )}

            <div className="relative px-6 pb-8 max-w-3xl mx-auto">
                <div className="h-1.5 rounded-full mb-6 -mt-0.5" style={{ backgroundColor: primary }} />

                <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                    <div>
                        <H1 className="italic tracking-tight" style={{ color: textColor } as any}>
                            {annonce.titre}
                        </H1>

                        {config.slogan && (
                            <P className="text-lg mt-1 font-medium opacity-70">
                                {config.slogan}
                            </P>
                        )}

                        {annonce.user?.username && (
                            <Link
                                href={`/u/${annonce.user.username}`}
                                className="text-sm font-bold mt-1"
                                style={{ color: primary } as any}
                            >
                                @{annonce.user.username}
                            </Link>
                        )}

                        <div className="flex items-center gap-2 mt-3 text-sm opacity-60">
                            <MapPin size={14} />
                            <span>{annonce.ville} {annonce.code_postal}</span>
                            {annonce.categorie?.nom && (
                                <>
                                    <span className="mx-1">·</span>
                                    <Badge variant="outline" size="sm">
                                        {annonce.categorie.nom}
                                    </Badge>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-3">
                        <div className="flex items-baseline gap-1">
                            <Price className="text-3xl" style={{ color: primary } as any}>
                                {annonce.prix} €
                            </Price>
                            <span className="text-base font-medium opacity-50">/h</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <IconButton
                                label="Partager"
                                icon={<Share2 size={18} />}
                                onClick={handleShare}
                                variant="ghost"
                                className="border-2 transition-all hover:scale-105 active:scale-95 bg-transparent"
                                style={{ borderColor: primary, color: textColor } as any}
                            />

                            {config.show_contact_form && (
                                <Button
                                    onClick={onContactClick}
                                    variant="primary"
                                    leftIcon={<MessageCircle size={18} />}
                                    className="hover:brightness-95 active:scale-95 transition-all text-dark bg-custom font-bold"
                                    style={{ backgroundColor: primary } as any}
                                >
                                    Contacter
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {socials.length > 0 && (
                    <div className="flex items-center gap-3 mt-5 flex-wrap">
                        {socials.map(s => (
                            <a key={s.key} href={s.value} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-2 py-2 px-4 cursor-pointer"
                                    style={{ borderColor: primary, color: textColor } as any}
                                >
                                    {s.icon} {s.label}
                                </Badge>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}