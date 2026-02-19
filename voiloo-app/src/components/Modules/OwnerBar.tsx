import { Pencil, Settings } from 'lucide-react';
import { Button } from "@/components/Base";

interface OwnerBarProps {
    userSlug: string;
    annonceSlug: string;
    primary: string;
}

export default function OwnerBar({ userSlug, annonceSlug, primary }: OwnerBarProps) {
    return (
        <div
            className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 text-sm font-semibold text-dark shadow-sm"
            style={{ backgroundColor: primary }}
        >
            <div className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dark opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-dark"></span>
                    </span>
                    Aperçu de votre vitrine
                </span>
            </div>

            <div className="flex items-center gap-3">
                {/* Bouton pour le design/vitrine */}
                <Button
                    href={`/u/${userSlug}/${annonceSlug}/edit`}
                    size="sm"
                    className="flex items-center gap-2 bg-black/10 hover:bg-black/20 px-4 py-1.5 rounded-full transition-colors border border-black/5"
                >
                    <Pencil size={14} />
                    Personnaliser le style
                </Button>

                {/* Bouton pour les infos (Prix, Titre...) */}
                <Button
                    href={`/u/${userSlug}/${annonceSlug}/edit-info`}
                    variant="primary"
                    size="sm"
                    className="bg-white/50 border-black/10 hover:bg-white/80"
                >
                    <Settings size={14} className="mr-2" />
                    Modifier l'annonce (Prix, Titre...)
                </Button>
            </div>
        </div>
    );
}