'use client';

import { Suspense, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/services/apiService';
import { Button, Input, H4, P } from '@/components/Base';
import { Mail } from 'lucide-react';

function ForgotPasswordForm() {
    const { request, isLoading, error } = useApi();
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await request('/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
            setIsSent(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (isSent) {
        return (
            <div className="text-center space-y-4 p-8 bg-white rounded-3xl shadow-xl">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Mail size={32} />
                </div>
                <H4>Vérifiez vos emails</H4>
                <P>Si ce compte existe, un lien de récupération a été envoyé.</P>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white rounded-3xl shadow-xl max-w-md mx-auto">
            <H4>Mot de passe oublié ?</H4>
            <P className="text-gray-500 text-sm">Entrez votre email pour recevoir un lien de réinitialisation.</P>

            {error && <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg">{error}</div>}

            <Input
                label="Email"
                type="email"
                placeholder="jean@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <Button type="submit" className="w-full bg-primary py-3" disabled={isLoading}>
                {isLoading ? 'Envoi...' : 'Envoyer le lien'}
            </Button>
        </form>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ForgotPasswordForm />
        </Suspense>
    );
}