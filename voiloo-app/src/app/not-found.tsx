import React from 'react';
import {
    Container,
    H1,
    P,
    Button,
    TextAccent,
    Link
} from '@/components/Base';
import { Logo } from "@/components/Base/logo";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white py-20">
            <Container>
                <div className="max-w-2xl mx-auto text-center space-y-8">

                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <Logo size={120} variant="solo" ooColor="var(--color-primary)" />
                            <div className="absolute -top-4 -right-8 rotate-12 bg-dark text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg">
                                404
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <H1 className="text-6xl md:text-8xl">
                            Oups<TextAccent> !</TextAccent>
                        </H1>
                        <H1 className="text-2xl md:text-3xl font-black">
                            La page s'est volatilisée...
                        </H1>
                        <P className="text-gray-500 max-w-md mx-auto">
                            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                            <span className="block mt-1 font-bold text-dark italic">Voiloo... c'est vide !</span>
                        </P>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <a href="/">
                            <Button
                                variant="primary"
                                size="lg"
                                leftIcon={<Home size={20} />}
                                className="w-full sm:w-auto"
                            >
                                Retour à l'accueil
                            </Button>
                        </a>

                        <a href="/explorer">
                            <Button
                                variant="outline"
                                size="lg"
                                leftIcon={<Search size={20} />}
                                className="w-full sm:w-auto"
                            >
                                Explorer les services
                            </Button>
                        </a>
                    </div>

                    <div className="pt-4">
                        <a href="/" className="text-gray-400 text-sm font-medium flex items-center justify-center gap-2 hover:text-dark transition-colors mx-auto">
                            <ArrowLeft size={16} />
                            Revenir à la page précédente
                        </a>
                    </div>

                    <div className="pt-20 opacity-10 grayscale select-none flex justify-center">
                        <Logo voilColor="var(--color-dark)" ooColor="var(--color-dark)" />
                    </div>
                </div>
            </Container>
        </div>
    );
}