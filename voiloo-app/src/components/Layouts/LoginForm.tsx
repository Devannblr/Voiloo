'use client';

import React, { useState } from 'react';
import { Card, CardBody, H2, P, Button, Divider, Link } from '@/components/Base';
import { MailInput, PasswordInput } from "@/components/Modules";
import { Logo } from "@/components/Base/logo";
import { useApi } from '@/hooks/useApi'; // On importe ton hook

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // On récupère la fonction request, l'état de chargement et l'erreur potentielle
    const { request, isLoading, error } = useApi();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Appel à ta route API Laravel
            const data = await request('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            // On stocke le token Sanctum pour les prochaines requêtes
            localStorage.setItem('voiloo_token', data.access_token);

            // Redirection vers l'accueil
            window.location.href = "/";
        } catch (err) {
            // L'erreur est capturée par le hook et affichée via la variable "error"
            console.error("Échec de la connexion", err);
        }
    };

    return (
        <div className="min-h-screen bg-cream/30 flex flex-col items-center justify-center p-4">
            <div className="mb-8">
                <Logo size={50} />
            </div>

            <Card className="w-full max-w-md shadow-xl border-none">
                <CardBody className="p-8">
                    <div className="text-center mb-8">
                        <H2>Bon retour !</H2>
                        <P className="text-gray-500">Ravis de vous revoir sur Voiloo.</P>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <MailInput
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="space-y-2">
                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="flex justify-end">
                                <Link href="/forgot-password" variant="muted" className="text-xs">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </div>

                        {/* Affichage de l'erreur API (ex: "Identifiants invalides") */}
                        {error && (
                            <div className="p-3 rounded bg-error/10 border border-error/20 text-error text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="primary"
                            size="lg"
                            isLoading={isLoading} // Le bouton passe en mode chargement automatiquement
                        >
                            Se connecter
                        </Button>
                    </form>

                    <Divider className="my-8">ou</Divider>

                    <div className="text-center">
                        <P className="text-sm">
                            Pas encore de compte ?{" "}
                            <Link href="/signup" variant="primary" className="font-bold">
                                Créer un compte
                            </Link>
                        </P>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};