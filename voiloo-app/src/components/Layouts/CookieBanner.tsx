'use client';

import { useState, useEffect } from 'react';
import { Button, P } from '@/components/Base';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
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
        <div className="fixed bottom-24 md:bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 flex flex-col gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🛡️</span>
                        <h3 className="font-bold text-gray-900">Respect de ta vie privée</h3>
                    </div>
                    <P className="text-sm text-gray-600 leading-relaxed">
                        Nous utilisons des cookies pour sécuriser ton compte (Cloudflare Turnstile) et analyser l'audience. Tu peux choisir de tout accepter ou de continuer sans accepter.
                    </P>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={() => handleConsent('all')}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm py-2"
                    >
                        Tout accepter
                    </Button>
                    <button
                        onClick={() => handleConsent('none')}
                        className="w-full text-xs text-gray-500 hover:text-gray-800 transition-colors py-1 underline"
                    >
                        Continuer sans accepter
                    </button>
                </div>

                <p className="text-[10px] text-gray-400 text-center">
                    Consulte notre <a href="/politique-confidentialite" className="underline">politique de confidentialité</a>.
                </p>
            </div>
        </div>
    );
}