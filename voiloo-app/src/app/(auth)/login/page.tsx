'use client';

import { Container, Link, Small } from '@/components/Base';
import { ArrowLeft, AlertCircle } from "lucide-react";
import {LoginForm} from "@/components/Layouts/LoginForm";
import { useSearchParams } from 'next/navigation';
export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    return (
        <main className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4">
            <Container size="sm" className="flex flex-col items-center">
                {error === 'unauthorized' && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-3 text-error animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={20} />
                        <p className="text-sm font-bold">
                            Tu dois être connecté pour accéder à cette page.
                        </p>
                    </div>
                )}
                {/* Bouton retour contextuel */}
                <div className="w-full max-w-md mb-6 text-left">
                    <Link
                        href="/"
                        leftIcon={<ArrowLeft size={18} />}
                        variant="muted"
                        className="text-sm font-medium hover:text-dark transition-colors"
                    >
                        Retour à l'accueil
                    </Link>
                </div>

                {/* Le formulaire importé */}
                <LoginForm />

                {/* Footer de page */}
                <div className="mt-12 text-center text-gray-400">
                    <Small>© 2026 Voiloo. Plateforme sécurisée.</Small>
                </div>
            </Container>
        </main>
    );
}