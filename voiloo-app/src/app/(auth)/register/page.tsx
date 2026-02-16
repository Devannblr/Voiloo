'use client';

import { H1, P } from '@/components/Base';
import Link from 'next/link';
import SignupForm from "@/components/Layouts/SignupForm";

export default function RegisterPage() {
    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Colonne Gauche : Visuel / Message */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-yellow-400 p-12 text-white">
                <div className="max-w-md text-center">
                    <H1 className="text-5xl font-extrabold mb-6">Rejoignez Voiloo.</H1>
                    <P className="text-xl opacity-90">
                        Trouvez les meilleurs freelances ou proposez vos services en quelques clics.
                    </P>
                </div>
            </div>

            {/* Colonne Droite : Le Formulaire */}
            <div className="flex flex-col justify-center items-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <H1 className="text-3xl font-bold">Créer un compte</H1>
                        <P className="text-gray-500 mt-2">
                            Déjà inscrit ?{' '}
                            <Link href="/login" className="text-yellow-600 font-semibold hover:underline">
                                Connectez-vous ici
                            </Link>
                        </P>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                        <SignupForm />
                    </div>

                    <P className="text-xs text-center text-gray-400">
                        En vous inscrivant, vous acceptez nos Conditions Générales et notre Politique de Confidentialité.
                    </P>
                </div>
            </div>
        </main>
    );
}