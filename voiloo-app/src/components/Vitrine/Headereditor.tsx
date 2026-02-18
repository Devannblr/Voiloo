import { useRef } from 'react';
import { Card, CardBody, H3, P, Button } from '@/components/Base';
import { Upload, X } from 'lucide-react';

export function HeaderEditor({ draft, setDraft }: any) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setDraft((d: any) => ({ ...d, header_photo: file }));
    };

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <H3 className="text-lg font-black mb-4">En-tête</H3>

                {/* Photo de couverture */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-dark mb-2">
                        Photo de couverture
                    </label>
                    {draft.header_photo ? (
                        <div className="relative rounded-xl overflow-hidden aspect-[3/1] border-2 border-gray-200">
                            <img
                                src={draft.header_photo instanceof File
                                    ? URL.createObjectURL(draft.header_photo)
                                    : draft.header_photo}
                                alt="Header"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setDraft((d: any) => ({ ...d, header_photo: null }))}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="w-full aspect-[3/1] border-2 border-dashed border-gray-300 hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group"
                        >
                            <Upload size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                            <P className="text-sm text-gray-400">Ajouter une photo de couverture</P>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhoto}
                            />
                        </button>
                    )}
                </div>

                {/* Slogan */}
                <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                        Slogan
                    </label>
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