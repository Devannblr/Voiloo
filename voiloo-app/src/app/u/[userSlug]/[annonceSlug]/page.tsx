'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';
import Link from 'next/link';
import {
    Instagram, Linkedin, Globe, Facebook, Twitter,
    Mail, Phone, MapPin, ChevronRight, Pencil, Loader2,
    Star, Briefcase, User, Image as ImageIcon, MessageCircle
} from 'lucide-react';

export default function VitrinePage() {
    const params = useParams();
    const router = useRouter();
    const userSlug    = params.userSlug as string;
    const annonceSlug = params.annonceSlug as string;

    const [annonce, setAnnonce] = useState<any>(null);
    const [config, setConfig]   = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [contactForm, setContactForm] = useState({ nom: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    useEffect(() => {
        Promise.all([
            apiService.getAnnonceBySlug(userSlug, annonceSlug),
            apiService.getVitrineConfig(userSlug, annonceSlug),
        ])
            .then(([annonceData, configData]) => {
                setAnnonce(annonceData);
                setConfig(configData);

                // Vérifie si le visiteur est le propriétaire
                const token = localStorage.getItem('voiloo_token');
                if (token) {
                    apiService.getUser?.().then((user: any) => {
                        if (user?.id === annonceData.user_id) setIsOwner(true);
                    }).catch(() => {});
                }

                setLoading(false);
            })
            .catch(() => setLoading(false));
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

    const primary   = config.couleur_principale || '#FFD359';
    const textColor = config.couleur_texte      || '#1A1A1A';
    const bgColor   = config.couleur_fond       || '#FFFFFF';
    const sections  = config.sections           || {};

    const socials = [
        { key: 'instagram', icon: <Instagram size={18} />, label: 'Instagram', value: config.instagram },
        { key: 'linkedin',  icon: <Linkedin  size={18} />, label: 'LinkedIn',  value: config.linkedin  },
        { key: 'facebook',  icon: <Facebook  size={18} />, label: 'Facebook',  value: config.facebook  },
        { key: 'twitter',   icon: <Twitter   size={18} />, label: 'Twitter',   value: config.twitter   },
        { key: 'site_web',  icon: <Globe     size={18} />, label: 'Site web',  value: config.site_web  },
    ].filter(s => s.value);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    // Sections avec contenu pour la nav
    const navItems = [
        sections.about    && { id: 'about',    label: 'À propos'   },
        sections.parcours && { id: 'parcours',  label: 'Parcours'   },
        sections.services && { id: 'services',  label: 'Services'   },
        sections.portfolio && { id: 'portfolio', label: 'Portfolio'  },
        config.show_contact_form && { id: 'contact', label: 'Contact' },
    ].filter(Boolean) as { id: string; label: string }[];

    return (
        <main style={{ backgroundColor: bgColor, color: textColor }} className="min-h-screen">

            {/* ── Barre owner ── */}
            {isOwner && (
                <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 text-sm font-semibold text-dark shadow-sm"
                     style={{ backgroundColor: primary }}>
                    <span>👁 Aperçu de votre vitrine</span>
                    <Link href={`/${userSlug}/${annonceSlug}/edit`}
                          className="flex items-center gap-2 bg-black/10 hover:bg-black/20 px-4 py-1.5 rounded-full transition-colors">
                        <Pencil size={14} /> Modifier
                    </Link>
                </div>
            )}

            {/* ── HERO ── */}
            <section className="relative">
                {/* Photo de couverture */}
                {config.header_photo ? (
                    <div className="relative w-full aspect-[3/1] max-h-72 overflow-hidden">
                        <img src={config.header_photo} alt="Couverture"
                             className="w-full h-full object-cover" />
                        <div className="absolute inset-0"
                             style={{ background: `linear-gradient(to bottom, transparent 40%, ${bgColor})` }} />
                    </div>
                ) : (
                    <div className="w-full h-48"
                         style={{ background: `linear-gradient(135deg, ${primary}33 0%, ${primary}11 100%)` }}>
                        <div className="w-full h-full"
                             style={{ backgroundImage: `radial-gradient(${primary}22 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                    </div>
                )}

                {/* Infos principales */}
                <div className="relative px-6 pb-8 max-w-3xl mx-auto">
                    {/* Bande couleur */}
                    <div className="h-1.5 rounded-full mb-6 -mt-0.5"
                         style={{ backgroundColor: primary }} />

                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                        <div>
                            <h1 className="text-3xl font-black italic tracking-tight" style={{ color: textColor }}>
                                {annonce.titre}
                            </h1>
                            {config.slogan && (
                                <p className="text-lg mt-1 font-medium opacity-70">{config.slogan}</p>
                            )}
                            <div className="flex items-center gap-2 mt-3 text-sm opacity-60">
                                <MapPin size={14} />
                                <span>{annonce.ville} {annonce.code_postal}</span>
                                {annonce.categorie?.nom && (
                                    <>
                                        <span className="mx-1">·</span>
                                        <span>{annonce.categorie.nom}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <span className="text-3xl font-black" style={{ color: primary }}>
                                {annonce.prix}€<span className="text-base font-medium opacity-50">/h</span>
                            </span>
                            {config.show_contact_form && (
                                <button onClick={() => scrollTo('contact')}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-dark transition-transform hover:scale-105 active:scale-95"
                                        style={{ backgroundColor: primary }}>
                                    <MessageCircle size={15} /> Contacter
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Réseaux sociaux */}
                    {socials.length > 0 && (
                        <div className="flex items-center gap-3 mt-5 flex-wrap">
                            {socials.map(s => (
                                <a key={s.key} href={s.value} target="_blank" rel="noopener noreferrer"
                                   className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all hover:scale-105"
                                   style={{ borderColor: primary, color: textColor }}>
                                    {s.icon} {s.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Nav ancres ── */}
            {navItems.length > 0 && (
                <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md"
                     style={{ top: isOwner ? '48px' : '0' }}>
                    <div className="max-w-3xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
                        {navItems.map(item => (
                            <button key={item.id} onClick={() => scrollTo(item.id)}
                                    className="px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors hover:opacity-100 opacity-60 hover:opacity-100"
                                    style={{ color: textColor }}>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="h-0.5" style={{ backgroundColor: primary, opacity: 0.3 }} />
                </nav>
            )}

            {/* ── Contenu ── */}
            <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">

                {/* À propos */}
                {sections.about && (
                    <section id="about" className="scroll-mt-20">
                        <SectionTitle icon={<User size={18} />} label="À propos" primary={primary} />
                        <p className="text-base leading-relaxed opacity-80 mt-4 whitespace-pre-line">
                            {sections.about}
                        </p>
                    </section>
                )}

                {/* Parcours */}
                {sections.parcours && (
                    <section id="parcours" className="scroll-mt-20">
                        <SectionTitle icon={<Briefcase size={18} />} label="Parcours" primary={primary} />
                        <div className="mt-4 space-y-4">
                            {Array.isArray(sections.parcours) ? (
                                sections.parcours.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                                                 style={{ backgroundColor: primary }} />
                                            {i < sections.parcours.length - 1 && (
                                                <div className="w-px flex-1 mt-1" style={{ backgroundColor: primary, opacity: 0.2 }} />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            {item.date && <p className="text-xs font-bold opacity-50 mb-1">{item.date}</p>}
                                            {item.titre && <p className="font-bold">{item.titre}</p>}
                                            {item.description && <p className="text-sm opacity-70 mt-1">{item.description}</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-base leading-relaxed opacity-80 whitespace-pre-line">
                                    {sections.parcours}
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {/* Services */}
                {sections.services && Array.isArray(sections.services) && sections.services.length > 0 && (
                    <section id="services" className="scroll-mt-20">
                        <SectionTitle icon={<Star size={18} />} label="Services" primary={primary} />
                        <div className="mt-4 grid sm:grid-cols-2 gap-4">
                            {sections.services.map((s: any, i: number) => {
                                const name = s?.name || s?.titre || '';
                                const price = s?.price || s?.prix || '';
                                return (
                                    <div key={i} className="p-5 rounded-2xl border-2"
                                         style={{ borderColor: `${primary}40` }}>
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-bold">{name}</p>
                                            {price && <span className="text-sm font-black" style={{ color: primary }}>{price}</span>}
                                        </div>
                                        {s?.description && <p className="text-sm opacity-60 mt-1">{s.description}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Portfolio */}
                {sections.portfolio && Array.isArray(sections.portfolio) && sections.portfolio.length > 0 && (
                    <section id="portfolio" className="scroll-mt-20">
                        <SectionTitle icon={<ImageIcon size={18} />} label="Portfolio" primary={primary} />
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {sections.portfolio.map((img: string, i: number) => (
                                <div key={i} className="aspect-square rounded-xl overflow-hidden border-2"
                                     style={{ borderColor: `${primary}20` }}>
                                    <img src={img} alt={`Portfolio ${i + 1}`}
                                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Contact */}
                {config.show_contact_form && (
                    <section id="contact" className="scroll-mt-20">
                        <SectionTitle icon={<Mail size={18} />} label="Contact" primary={primary} />
                        {sent ? (
                            <div className="mt-4 p-6 rounded-2xl text-center"
                                 style={{ backgroundColor: `${primary}20` }}>
                                <p className="text-2xl mb-2">✉️</p>
                                <p className="font-bold">Message envoyé !</p>
                                <p className="text-sm opacity-60 mt-1">Je vous répondrai dans les plus brefs délais.</p>
                            </div>
                        ) : (
                            <div className="mt-4 p-6 rounded-2xl border-2 space-y-4"
                                 style={{ borderColor: `${primary}30` }}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold mb-1.5 opacity-60">Nom</label>
                                        <input value={contactForm.nom}
                                               onChange={e => setContactForm(f => ({ ...f, nom: e.target.value }))}
                                               placeholder="Votre nom"
                                               className="w-full px-4 py-3 rounded-xl border-2 bg-transparent outline-none transition-colors text-sm"
                                               style={{ borderColor: `${primary}30` }}
                                               onFocus={e => e.target.style.borderColor = primary}
                                               onBlur={e => e.target.style.borderColor = `${primary}30`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1.5 opacity-60">Email</label>
                                        <input value={contactForm.email} type="email"
                                               onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                                               placeholder="votre@email.com"
                                               className="w-full px-4 py-3 rounded-xl border-2 bg-transparent outline-none transition-colors text-sm"
                                               style={{ borderColor: `${primary}30` }}
                                               onFocus={e => e.target.style.borderColor = primary}
                                               onBlur={e => e.target.style.borderColor = `${primary}30`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1.5 opacity-60">Message</label>
                                    <textarea value={contactForm.message} rows={4}
                                              onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                                              placeholder="Bonjour, je souhaite vous contacter pour..."
                                              className="w-full px-4 py-3 rounded-xl border-2 bg-transparent outline-none resize-none transition-colors text-sm"
                                              style={{ borderColor: `${primary}30` }}
                                              onFocus={e => e.target.style.borderColor = primary}
                                              onBlur={e => e.target.style.borderColor = `${primary}30`}
                                    />
                                </div>
                                <button onClick={() => setSent(true)}
                                        disabled={!contactForm.nom || !contactForm.email || !contactForm.message}
                                        className="w-full py-3 rounded-xl font-bold text-dark text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: primary }}>
                                    Envoyer le message
                                </button>
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-100 py-8 mt-8">
                <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs opacity-40">
                        Vitrine créée avec <span style={{ color: primary }}>Voiloo</span>
                    </p>
                    {isOwner && (
                        <Link href={`/${userSlug}/${annonceSlug}/edit`}
                              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                              style={{ backgroundColor: `${primary}20`, color: textColor }}>
                            <Pencil size={12} /> Modifier la vitrine
                        </Link>
                    )}
                </div>
            </footer>
        </main>
    );
}

function SectionTitle({ icon, label, primary }: { icon: React.ReactNode; label: string; primary: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: `${primary}20`, color: primary }}>
                {icon}
            </div>
            <h2 className="text-xl font-black italic">{label}</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: `${primary}20` }} />
        </div>
    );
}