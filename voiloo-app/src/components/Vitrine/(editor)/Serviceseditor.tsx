import { Card, CardBody, H3, P, Button, Input, Textarea, Small, IconButton } from '@/components/Base';
import { Plus, Trash2 } from 'lucide-react';

export function ServicesEditor({ draft, setDraft }: any) {
    const sections = draft.sections || {};
    const services = sections.services || [];

    const add = () => {
        setDraft((d: any) => ({
            ...d,
            sections: {
                ...d.sections,
                services: [...services, { name: '', description: '', price: '' }]
            }
        }));
    };

    const remove = (index: number) => {
        setDraft((d: any) => ({
            ...d,
            sections: {
                ...d.sections,
                services: services.filter((_: any, i: number) => i !== index)
            }
        }));
    };

    const update = (index: number, field: string, value: string) => {
        const updated = [...services];
        updated[index] = { ...updated[index], [field]: value };
        setDraft((d: any) => ({ ...d, sections: { ...d.sections, services: updated } }));
    };

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <H3 className="text-lg font-black">Services</H3>
                        <P className="text-sm text-gray-500">Prestations que vous proposez</P>
                    </div>
                    <Button variant="ghost" size="sm" leftIcon={<Plus size={16} />} onClick={add}>
                        Ajouter
                    </Button>
                </div>

                <div className="space-y-6">
                    {services.map((item: any, i: number) => (
                        <div key={i} className="relative">
                            <IconButton
                                label="Supprimer"
                                icon={<Trash2 size={12} />}
                                variant="danger"
                                onClick={() => remove(i)}
                                size={"sm"}
                                className="absolute -top-3 -right-3 z-10"
                            />

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-end gap-2 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <Input
                                            value={item.name}
                                            onChange={(e) => update(i, 'name', e.target.value)}
                                            placeholder="Nom du service"
                                        />
                                    </div>
                                    <div className="w-20 shrink-0">
                                        <Input
                                            value={item.price}
                                            onChange={(e) => update(i, 'price', e.target.value)}
                                            placeholder="45€"
                                            className={"text-end"}
                                        />
                                    </div>
                                </div>

                                <Textarea
                                    value={item.description}
                                    onChange={(e) => update(i, 'description', e.target.value)}
                                    placeholder="Description du service"
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}

                    {services.length === 0 && (
                        <div className="text-center py-8">
                            <Small className="text-gray-400">
                                Aucun service ajouté. Cliquez sur "Ajouter" pour commencer.
                            </Small>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}