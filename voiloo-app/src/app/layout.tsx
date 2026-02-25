import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Layouts/Header";
import { HeaderMobile } from "@/components/Layouts/HeaderMobile";
import { ConditionalFooter } from "@/components/Layouts/ConditionalFooter";
import { ToastProvider } from "@/components/Layouts/Toastprovider";
import { Preloader } from "@/components/Modules/Preloader";
import CookieBanner from "@/components/Layouts/CookieBanner";
import { AuthProvider } from '@/context/AuthContext';
import {ChatProvider} from "@/context/ChatContext";

export const metadata: Metadata = {
    title: "Voiloo - Freelances & Services locaux",
    description: "Trouvez des freelances et services près de chez vous. Créez votre mini-site vitrine gratuitement.",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <head>
            <link rel="icon" href="/favicon.ico" />
            <link rel="shortcut icon" href="/favicon.ico" />
        </head>
        <body className="antialiased md:pb-0 relative">
        <AuthProvider>
            <ChatProvider>
                <ToastProvider>
                    <Header />
                    <Preloader>
                        {children}
                        <CookieBanner />
                    </Preloader>
                    <ConditionalFooter />
                    <HeaderMobile />
                </ToastProvider>
            </ChatProvider>
        </AuthProvider>
        </body>
        </html>
    );
}