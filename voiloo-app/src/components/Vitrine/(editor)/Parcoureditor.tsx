import { Card, CardBody, H3, P, Button, Input, Textarea, Small, IconButton } from '@/components/Base';
import { Plus, Trash2 } from 'lucide-react';

export function ParcoursEditor({ draft, setDraft }: any) {
    const sections = draft.sections || {};
    const parcours = sections.parcours || [];

    const add = () => {
        setDraft((d: any) => ({
            ...d,
            sections: {
                ...d.sections,
                parcours: [...parcours, { year: '', title: '', description: '' }]
            }
        }));
    };

    const remove = (index: number) => {
        setDraft((d: any) => ({
            ...d,
            sections: {
                ...d.sections,
                parcours: parcours.filter((_: any, i: number) => i !== index)
            }
        }));
    };

    const update = (index: number, field: string, value: string) => {
        const updated = [...parcours];
        updated[index] = { ...updated[index], [field]: value };
        setDraft((d: any) => ({ ...d, sections: { ...d.sections, parcours: updated } }));
    };

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <H3 className="text-lg font-black">Parcours</H3>
                        <P className="text-sm text-gray-500">Étapes clés de votre carrière</P>
                    </div>
                    <Button variant="ghost" size="sm" leftIcon={<Plus size={16} />} onClick={add}>
                        Ajouter
                    </Button>
                </div>

                <div className="space-y-6">
                    {parcours.map((item: any, i: number) => (
                        <div key={i} className="relative">
                            <IconButton
                                label="Supprimer"
                                icon={<Trash2 size={12} />}
                                variant="danger"
                                onClick={() => remove(i)}
                                size="sm"
                                className="absolute -top-3 -right-3 z-10"
                            />

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="grid grid-cols-[100px_1fr] gap-3 mb-3">
                                    <Input
                                        value={item.year}
                                        onChange={(e) => update(i, 'year', e.target.value)}
                                        placeholder="2020"
                                    />
                                    <Input
                                        value={item.title}
                                        onChange={(e) => update(i, 'title', e.target.value)}
                                        placeholder="Diplôme obtenu"
                                    />
                                </div>
                                <Textarea
                                    value={item.description}
                                    onChange={(e) => update(i, 'description', e.target.value)}
                                    placeholder="Description"
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}

                    {parcours.length === 0 && (
                        <div className="text-center py-8">
                            <Small className="text-gray-400">
                                Aucune étape ajoutée. Cliquez sur "Ajouter" pour commencer.
                            </Small>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}