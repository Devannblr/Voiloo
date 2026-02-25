'use client';

import React, {useState} from 'react';
import {Button, Card, CardBody, Divider, H2, Link, P} from '@/components/Base';
import {MailInput, PasswordInput} from "@/components/Modules";
import {Logo} from "@/components/Base/logo";
import {useApi} from '@/hooks/useApi';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { request, isLoading, error } = useApi();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await request('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            if (data.access_token) {
                // 1. Stockage pour les appels API classiques (Header Authorization)
                localStorage.setItem('voiloo_token', data.access_token);
                // 2. Stockage dans un COOKIE pour le middleware Next.js
                // On utilise 'token' car c'est ce que ton middleware.ts cherche
                // On met path=/ pour qu'il soit accessible sur tout le site
                document.cookie = `token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
                // 3. Redirection vers la page demandée ou le profil
                const params = new URLSearchParams(window.location.search);
                window.location.href = params.get('callbackUrl') || "/profil";
            }
        } catch (err) {
            console.error("Échec de la connexion", err);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-2xl border-none bg-white">
            <CardBody className="p-8 md:p-10">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Logo size={60} variant="solo" />
                    </div>
                    <H2 className="text-2xl font-bold">Bon retour !</H2>
                    <P className="text-gray-500 mt-2">Ravis de vous revoir sur Voiloo.</P>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <MailInput
                        label="Adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="votre@email.com"
                    />

                    <div className="space-y-2">
                        <PasswordInput
                            label="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            showChecklist={false}
                        />
                        <div className="flex justify-end">
                            <Link href="/forgot-password" variant="primary" className="text-xs font-bold">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="font-bold shadow-lg shadow-primary/20"
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </form>

                <Divider className="my-8 text-gray-400">ou</Divider>

                <div className="text-center">
                    <P className="text-sm text-gray-600">
                        Pas encore de compte ?{" "}
                        <Link href="/register" variant="primary" className="font-extrabold underline-offset-4 hover:underline">
                            Créer un compte
                        </Link>
                    </P>
                </div>
            </CardBody>
        </Card>
    );
};