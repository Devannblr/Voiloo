'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Button, H4, P } from '@/components/Base'; // J'utilise tes composants de base
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
    const params = useSearchParams();
    const router = useRouter();
    const { request, isLoading } = useApi();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const id = params.get('id');
        const hash = params.get('hash');
        const expires = params.get('expires');
        const signature = params.get('signature');

        if (!id || !hash) {
            setStatus('error');
            return;
        }

        // Appel API vers Laravel
        request(`/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`, {
            method: 'GET'
        })
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, [params, request]);

    // --- ÉTAT : CHARGEMENT ---
    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <H4>Vérification de votre compte...</H4>
                <P className="text-gray-500">Un instant, nous validons votre adresse email.</P>
            </div>
        );
    }

    // --- ÉTAT : SUCCÈS ---
    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div className="space-y-2">
                    <H4 className="text-2xl">Email vérifié !</H4>
                    <P className="text-gray-600">
                        Merci d'avoir validé votre compte. Vous pouvez maintenant accéder à toutes les fonctionnalités de Voiloo.
                    </P>
                </div>
                <Button
                    onClick={() => router.push('/settings')}
                    className="w-full max-w-xs bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3"
                >
                    Continuer vers mon profil
                </Button>
            </div>
        );
    }

    // --- ÉTAT : ERREUR ---
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-red-100 p-4 rounded-full">
                <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <div className="space-y-2">
                <H4 className="text-2xl">Lien invalide</H4>
                <P className="text-gray-600">
                    Ce lien de vérification a expiré ou est incorrect.
                    Veuillez demander un nouveau lien depuis vos paramètres.
                </P>
            </div>
            <Button
                variant="outline"
                onClick={() => router.push('/login')}
                className="w-full max-w-xs"
            >
                Retour à la connexion
            </Button>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center container mx-auto px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <Suspense fallback={
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-300" />
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    );
}