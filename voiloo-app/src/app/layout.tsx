import type { Metadata } from "next";
import "./globals.css";

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
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}