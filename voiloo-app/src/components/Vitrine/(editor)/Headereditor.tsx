'use client';

import { useRef } from 'react';
import { Card, CardBody, H3, P, Label, Input, IconButton } from '@/components/Base';
import { Upload, X } from 'lucide-react';
import { StorageImage } from '@/components/Base/StorageImage';

export function HeaderEditor({ draft, setDraft }: any) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setDraft((d: any) => ({
            ...d,
            header_photo: file,
            delete_header_photo: false
        }));
    };

    const removePhoto = () => {
        setDraft((d: any) => ({
            ...d,
            header_photo: null,
            delete_header_photo: true
        }));
        if (fileRef.current) {
            fileRef.current.value = '';
        }
    };

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <H3 className="text-lg font-black mb-4">En-tête</H3>

                <div className="mb-4">
                    <Label className="mb-2">Photo de couverture</Label>

                    {draft.header_photo ? (
                        <div className="relative rounded-xl overflow-hidden aspect-[3/1] border-2 border-gray-100">
                            <StorageImage
                                path={draft.header_photo}
                                alt="Header"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 z-10">
                                <IconButton
                                    label="Supprimer la photo"
                                    icon={<X size={16} />}
                                    onClick={removePhoto}
                                    variant="ghost"
                                    className="bg-black/60 hover:bg-black/80 text-white"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="w-full aspect-[3/1] border-2 border-dashed border-gray-300 hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group overflow-hidden"
                                style={{ backgroundColor: `${draft.couleur_principale || '#FFD359'}10` }}
                            >
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

                <Input
                    label="Slogan"
                    value={draft.slogan || ''}
                    onChange={(e) => setDraft((d: any) => ({ ...d, slogan: e.target.value }))}
                    placeholder="Ex : Votre beauté, mon expertise"
                    maxLength={200}
                    hint={`${(draft.slogan || '').length}/200`}
                />
            </CardBody>
        </Card>
    );
}