'use client';

import { Container, Link, Small } from '@/components/Base';
import { ArrowLeft } from "lucide-react";
import {LoginForm} from "@/components/Layouts/LoginForm";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4">
            <Container size="sm" className="flex flex-col items-center">
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