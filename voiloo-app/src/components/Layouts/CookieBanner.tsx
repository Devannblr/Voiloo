'use client';

import { useState, useEffect } from 'react';
import { Button, P } from '@/components/Base';
import { ShieldCheck, Cookie } from 'lucide-react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // On vérifie si l'utilisateur a déjà fait un choix
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleConsent = (status: 'all' | 'none') => {
        localStorage.setItem('cookie_consent', status);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-6 flex flex-col gap-6">

                <div className="space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <ShieldCheck size={28} />
                    </div>

                    <h3 className="font-black italic text-xl uppercase tracking-tighter">Cookies & Vie privée</h3>

                    <div className="space-y-4">
                        <P className="text-sm text-gray-600 leading-relaxed">
                            Nous utilisons des cookies pour assurer le bon fonctionnement du site.
                        </P>

                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Session & Connexion</p>
                                    <p className="text-[11px] text-gray-500">Pour rester connecté à ton compte en toute sécurité.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Sécurité (Cloudflare)</p>
                                    <p className="text-[11px] text-gray-500">Pour protéger le site contre les attaques et les bots.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Localisation</p>
                                    <p className="text-[11px] text-gray-500">Pour vous donner les annonces près de chez vous.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={() => handleConsent('all')}
                        className="w-full bg-primary hover:bg-primary/90 text-black border-none font-bold py-3"
                    >
                        Accepter les cookies
                    </Button>

                    <Button
                        onClick={() => handleConsent('none')}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-none font-bold py-3"
                    >
                        Tout refuser
                    </Button>
                </div>

                <p className="text-[10px] text-gray-400 text-center">
                    Consulte notre <a href="/politique-confidentialite" className="underline hover:text-primary">politique de confidentialité</a>.
                </p>
            </div>
        </div>
    );
}