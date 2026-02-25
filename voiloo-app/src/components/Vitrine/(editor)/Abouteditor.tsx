import { Card, CardBody, H3, P, Textarea } from '@/components/Base';

export function AboutEditor({ draft, setDraft }: any) {
    const sections = draft.sections || {};
    const about = sections.about || '';

    const handleChange = (value: string) => {
        setDraft((d: any) => ({
            ...d,
            sections: { ...d.sections, about: value }
        }));
    };

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <H3 className="text-lg font-black mb-4">À propos</H3>
                <P className="text-sm text-gray-500 mb-4">
                    Présentez-vous en quelques lignes. Qui êtes-vous ? Quelle est votre passion ?
                </P>
                <Textarea
                    value={about}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Ex : Passionnée par la beauté des ongles depuis 10 ans, je mets mon expertise au service de votre bien-être..."
                    rows={6}
                    hint={`${about.length} caractères`}
                />
            </CardBody>
        </Card>
    );
}