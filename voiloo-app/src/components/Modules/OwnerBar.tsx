import NextLink from 'next/link';
import { Pencil } from 'lucide-react';
import {Button} from "@/components/Base";

export default function OwnerBar({ userSlug, annonceSlug, primary }: { userSlug: string; annonceSlug: string; primary: string }) {
    return (
        <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 text-sm font-semibold text-dark shadow-sm "
             style={{ backgroundColor: primary }}>
            <span>👁 Aperçu de votre vitrine</span>
            <NextLink href={`/u/${userSlug}/${annonceSlug}/edit`}
                      className="flex items-center gap-2 bg-black/10 hover:bg-black/20 px-4 py-1.5 rounded-full transition-colors">
                <Pencil size={14} /> Modifier
            </NextLink>
            <Button href={`/u/${userSlug}/${annonceSlug}/edit-info`} variant="outline" size="sm">Modifier l'annonce (Prix, Titre...)</Button>
        </div>
    );
}