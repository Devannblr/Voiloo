import type { Metadata } from "next";
import "./globals.css";
import {Header} from "@/components/Layouts/Header";
import {HeaderMobile} from "@/components/Layouts/HeaderMobile";
import {Footer} from "@/components/Layouts/Footer";

export const metadata: Metadata = {
    title: "Voiloo - Freelances & Services locaux",
    description: "Trouvez des freelances et services près de chez vous. Créez votre mini-site vitrine gratuitement.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className="antialiased pb-8 md:pb-0 relative">
            <Header/>
                {children}
            <Footer/>
            <HeaderMobile/>
            </body>
        </html>
    );
}