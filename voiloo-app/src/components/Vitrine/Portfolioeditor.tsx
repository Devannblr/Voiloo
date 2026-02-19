'use client';

import { Card, CardBody, H3, P } from '@/components/Base';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import { useRef } from 'react';
import { StorageImage } from '@/components/Base/StorageImage'; // Vérifie le chemin d'import

export function PortfolioEditor({ draft, setDraft, annonce }: any) {
    const sections = draft.sections || {};
    const portfolioNote = sections.portfolio_note || '';
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNoteChange = (value: string) => {
        setDraft((d: any) => ({
            ...d,
            sections: { ...d.sections, portfolio_note: value }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setDraft((d: any) => ({
                ...d,
                new_portfolio_files: [...(d.new_portfolio_files || []), ...files]
            }));
        }
    };

    const removeNewFile = (index: number) => {
        setDraft((d: any) => ({
            ...d,
            new_portfolio_files: d.new_portfolio_files.filter((_: any, i: number) => i !== index)
        }));
    };

    const removeExistingImage = (imageId: number) => {
        setDraft((d: any) => ({
            ...d,
            portfolio_images_to_delete: [...(d.portfolio_images_to_delete || []), imageId]
        }));
    };

    // Images déjà en BDD non marquées pour suppression
    const visibleExistingImages = annonce.images?.filter(
        (img: any) => !(draft.portfolio_images_to_delete || []).includes(img.id)
    );

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <H3 className="text-lg font-black flex items-center gap-2">
                        <ImageIcon size={20} className="text-primary" /> Portfolio
                    </H3>
                </div>

                <P className="text-sm text-gray-500 mb-6">
                    Gérez les photos de votre vitrine. Celles-ci seront visibles par vos clients.
                </P>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {/* --- 1. Images existantes --- */}
                    {visibleExistingImages?.map((img: any) => (
                        <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent">
                            <StorageImage
                                path={img.path}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeExistingImage(img.id)}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}

                    {/* --- 2. Nouvelles images (Files) --- */}
                    {draft.new_portfolio_files?.map((file: File, i: number) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary ring-2 ring-primary/20">
                            <StorageImage
                                path={file}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeNewFile(i)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                            >
                                <X size={14} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-primary text-[10px] text-center font-bold py-0.5 text-white">
                                À SAUVER
                            </div>
                        </div>
                    ))}

                    {/* --- 3. Bouton d'ajout --- */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all text-gray-400"
                    >
                        <Plus size={24} />
                        <span className="text-xs font-bold">Ajouter</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Note du portfolio</label>
                    <textarea
                        value={portfolioNote}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        placeholder="Décrivez votre travail ou vos spécialités ici..."
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors resize-none text-sm"
                    />
                </div>
            </CardBody>
        </Card>
    );
}