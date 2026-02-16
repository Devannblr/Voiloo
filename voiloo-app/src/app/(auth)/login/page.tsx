'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import {
    Container,
    H1,
    P,
    Button,
    Link,
    Card,
    CardBody,
    Divider, Small
} from '@/components/Base';
import { MailInput, PasswordInput } from '@/components/Modules';
import { Logo } from "@/components/Base/logo";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const { request, isLoading, error } = useApi();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await request('/login', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            if (data.access_token) {
                // On stocke le token comme pour le register
                localStorage.setItem('voiloo_token', data.access_token);
                // Redirection vers le dashboard
                window.location.href = '/profil';
            }
        } catch (err) {
            console.error("Erreur de connexion:", err);
        }
    };

    return (
        <main className="min-h-screen bg-beige/20 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Container size="sm">
                {/* Retour à l'accueil */}
                <div className="mb-8">
                    <Link href="/voiloo-app/public" leftIcon={<ArrowLeft size={18} />} variant="muted">
                        Retour à l'accueil
                    </Link>
                </div>

                <Card className="shadow-xl border-none">
                    <CardBody className="p-8 md:p-12">
                        {/* Header de la Card */}
                        <div className="text-center mb-10">
                            <div className="flex justify-center mb-6">
                                <Logo size={50} variant="solo" ooColor="var(--color-primary)" />
                            </div>
                            <H1 className="text-2xl md:text-3xl mb-2">Bon retour !</H1>
                            <P className="text-gray-500">Connectez-vous pour accéder à votre espace Voiloo.</P>
                        </div>

                        {/* Affichage de l'erreur API */}
                        {error && (
                            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <MailInput
                                label="Adresse email"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />

                            <div className="space-y-1">
                                <PasswordInput
                                    label="Mot de passe"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    showChecklist={false} // Pas besoin de la checklist sur le login
                                />
                                <div className="flex justify-end">
                                    <Link href="/forgot-password" variant="primary" className="text-xs font-bold">
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                isLoading={isLoading}
                                className="font-bold text-lg"
                            >
                                Se connecter
                            </Button>
                        </form>

                        <div className="mt-8">
                            <Divider>Nouveau sur Voiloo ?</Divider>
                            <div className="mt-6 text-center">
                                <Button
                                    href="/register"
                                    variant="outline"
                                    fullWidth
                                >
                                    Créer un compte
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Footer discret */}
                <div className="mt-8 text-center text-gray-400">
                    <Small>© 2026 Voiloo. Tous droits réservés.</Small>
                </div>
            </Container>
        </main>
    );
}