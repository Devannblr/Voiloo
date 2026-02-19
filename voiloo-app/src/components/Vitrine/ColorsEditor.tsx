'use client';

import { Card, CardBody, H3, P } from '@/components/Base';
import { Palette } from 'lucide-react';

export function ColorsEditor({ draft, setDraft }: any) {
    const handleChange = (key: string, value: string) => {
        setDraft((d: any) => ({ ...d, [key]: value }));
    };

    const colorFields = [
        { key: 'couleur_principale', label: 'Couleur Principale', description: 'Boutons, icônes et accents.' },
        { key: 'couleur_fond',       label: 'Couleur de Fond',    description: 'Arrière-plan de votre vitrine.' },
        { key: 'couleur_texte',      label: 'Couleur du Texte',   description: 'Lisibilité de vos contenus.' },
    ];

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Palette size={20} className="text-primary" />
                    <H3 className="text-lg font-black">Personnalisation des couleurs</H3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {colorFields.map((field) => (
                        <div key={field.key} className="space-y-3 p-4 rounded-xl border-2 border-gray-100 hover:border-primary/20 transition-colors">
                            <div>
                                <label className="text-sm font-bold block">{field.label}</label>
                                <P className="text-xs text-gray-500">{field.description}</P>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={draft[field.key] || '#000000'}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="h-10 w-10 cursor-pointer rounded-lg border-none bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={draft[field.key] || ''}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-mono uppercase focus:border-primary outline-none"
                                    placeholder="#HEX"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}