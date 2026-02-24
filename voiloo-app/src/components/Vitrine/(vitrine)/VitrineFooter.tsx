import NextLink from "next/link";
import { Pencil } from "lucide-react";

export default function VitrineFooter({ userSlug, annonceSlug, isOwner, primary, textColor }: any) {
    return (
        <footer className="border-t border-gray-100 py-8 mt-8">
            <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs opacity-40">Vitrine créée avec <span style={{ color: primary }}>Voiloo</span></p>
                {isOwner && (
                    <NextLink href={`/u/${userSlug}/${annonceSlug}/edit`} className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-colors" style={{ backgroundColor: `${primary}20`, color: textColor }}>
                        <Pencil size={12} /> Modifier la vitrine
                    </NextLink>
                )}
            </div>
        </footer>
    );
}