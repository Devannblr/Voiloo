'use client';

import { useRef } from 'react';
import { Card, CardBody, H3, P } from '@/components/Base';
import { Upload, X } from 'lucide-react';
import { StorageImage } from '@/components/Base/StorageImage';

export function HeaderEditor({ draft, setDraft }: any) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Quand on ajoute une photo :
        // 1. On stocke le fichier
        // 2. On passe delete_header_photo à false (au cas où il était à true)
        setDraft((d: any) => ({
            ...d,
            header_photo: file,
            delete_header_photo: false
        }));
    };

    const removePhoto = () => {
        // Pour la suppression :
        // 1. On vide le champ visuel (null)
        // 2. On active le flag pour le Controller Laravel
        setDraft((d: any) => ({
            ...d,
            header_photo: null,
            delete_header_photo: true
        }));

        // On reset l'input file pour pouvoir reprendre la même photo si besoin
        if (fileRef.current) {
            fileRef.current.value = '';
        }
    };

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <H3 className="text-lg font-black mb-4">En-tête</H3>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-dark mb-2">
                        Photo de couverture
                    </label>

                    {/* On affiche l'image seulement si elle existe
                        ET que l'utilisateur n'a pas demandé sa suppression
                    */}
                    {draft.header_photo ? (
                        <div className="relative rounded-xl overflow-hidden aspect-[3/1] border-2 border-gray-100">
                            <StorageImage
                                path={draft.header_photo}
                                alt="Header"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={removePhoto}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors z-10"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="w-full aspect-[3/1] border-2 border-dashed border-gray-300 hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group overflow-hidden"
                                style={{ backgroundColor: `${draft.couleur_principale || '#FFD359'}10` }}
                            >
                                {/* Carré de couleur de fond discret (Ta demande) */}
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{ backgroundColor: draft.couleur_principale || '#FFD359' }}
                                />

                                <div className="relative z-10 flex flex-col items-center">
                                    <Upload size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                                    <P className="text-sm text-gray-400 font-medium">Ajouter une photo de couverture</P>
                                </div>

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhoto}
                                />
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Slogan</label>
                    <input
                        type="text"
                        value={draft.slogan || ''}
                        onChange={(e) => setDraft((d: any) => ({ ...d, slogan: e.target.value }))}
                        placeholder="Ex : Votre beauté, mon expertise"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors"
                        maxLength={200}
                    />
                    <P className="text-xs text-gray-400 mt-1 text-right">
                        {(draft.slogan || '').length}/200
                    </P>
                </div>
            </CardBody>
        </Card>
    );
}