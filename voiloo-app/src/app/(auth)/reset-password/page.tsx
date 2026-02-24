'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Button, Input, H4, P } from '@/components/Base';
import { PasswordInput } from '@/components/Modules';
import { ShieldCheck, Loader2 } from 'lucide-react';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { request, isLoading, error } = useApi();

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await request('/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirm,
                }),
            });
            setIsSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            console.error("Erreur reset password:", err);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center space-y-6 p-10 animate-in fade-in zoom-in duration-300">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <ShieldCheck size={40} />
                </div>
                <div className="space-y-2">
                    <H4>Mot de passe mis à jour !</H4>
                    <P className="text-gray-500">Votre compte est sécurisé. Redirection vers la connexion...</P>
                </div>
            </div>
        );
    }

    if (!token || !email) {
        return (
            <div className="p-8 text-center text-red-500">
                Lien invalide ou expiré. Veuillez refaire une demande.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2 text-center mb-4">
                <H4 className="text-2xl">Nouveau mot de passe</H4>
                <P className="text-sm text-gray-500">Choisissez un mot de passe robuste pour protéger votre compte.</P>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <PasswordInput
                    label="Nouveau mot de passe"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showChecklist={true}
                    required
                />

                <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="Mot de passe"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    error={passwordConfirm && password !== passwordConfirm ? "Les mots de passe diffèrent" : undefined}
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-2xl shadow-lg shadow-yellow-400/20"
                disabled={isLoading || password.length < 8 || password !== passwordConfirm}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        Mise à jour...
                    </div>
                ) : 'Réinitialiser mon mot de passe'}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">
                <Suspense fallback={<div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>}>
                    <ResetPasswordContent />
                </Suspense>
            </div>
        </div>
    );
}