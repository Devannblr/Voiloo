import { Instagram, Linkedin, Facebook, Twitter, Globe, MapPin, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/Base';
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
    const socials = [
        { key: 'instagram', icon: <Instagram size={18} />, label: 'Instagram', value: config.instagram },
        { key: 'linkedin',  icon: <Linkedin  size={18} />, label: 'LinkedIn',  value: config.linkedin  },
        { key: 'facebook',  icon: <Facebook  size={18} />, label: 'Facebook',  value: config.facebook  },
        { key: 'twitter',   icon: <Twitter   size={18} />, label: 'Twitter',   value: config.twitter   },
        { key: 'site_web',  icon: <Globe     size={18} />, label: 'Site web',  value: config.site_web  },
    ].filter(s => s.value);

    return (
        <section className="relative">
            {config.header_photo ? (
                <div className="relative w-full aspect-[3/1] max-h-72 overflow-hidden">
                    <img src={config.header_photo} alt="Couverture" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${bgColor})` }} />
                </div>
            ) : (
                <div className="w-full h-48" style={{ background: `linear-gradient(135deg, ${primary}33 0%, ${primary}11 100%)` }}>
                    <div className="w-full h-full" style={{ backgroundImage: `radial-gradient(${primary}22 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                </div>
            )}
            <div className="relative px-6 pb-8 max-w-3xl mx-auto">
                <div className="h-1.5 rounded-full mb-6 -mt-0.5" style={{ backgroundColor: primary }} />
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                    <div>
                        <h1 className="text-3xl font-black italic tracking-tight" style={{ color: textColor }}>{annonce.titre}</h1>
                        {config.slogan && <p className="text-lg mt-1 font-medium opacity-70">{config.slogan}</p>}
                        <div className="flex items-center gap-2 mt-3 text-sm opacity-60">
                            <MapPin size={14} />
                            <span>{annonce.ville} {annonce.code_postal}</span>
                            {annonce.categorie?.nom && (
                                <><span className="mx-1">·</span><Badge variant="outline" size="sm">{annonce.categorie.nom}</Badge></>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                        <span className="text-3xl font-black" style={{ color: primary }}>{annonce.prix}€<span className="text-base font-medium opacity-50">/h</span></span>
                        {config.show_contact_form && (
                            <button onClick={onContactClick} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-dark transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: primary }}>
                                <MessageCircle size={15} /> Contacter
                            </button>
                        )}
                    </div>
                </div>
                {socials.length > 0 && (
                    <div className="flex items-center gap-3 mt-5 flex-wrap">
                        {socials.map(s => (
                            <a key={s.key} href={s.value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all hover:scale-105" style={{ borderColor: primary, color: textColor }}>
                                {s.icon} {s.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}