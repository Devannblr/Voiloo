import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Layouts/Header";
import { HeaderMobile } from "@/components/Layouts/HeaderMobile";
import { Footer } from "@/components/Layouts/Footer";
import { ToastProvider } from "@/components/Layouts/Toastprovider";

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
        <body className="antialiased pb-8 md:pb-0 relative">
        <Header />
        <ToastProvider>{children}</ToastProvider>
        <Footer />
        <HeaderMobile />
        </body>
        </html>
    );
}