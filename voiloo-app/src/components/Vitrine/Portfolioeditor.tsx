import { Card, CardBody, H3, P } from '@/components/Base';

export function PortfolioEditor({ draft, setDraft, annonce }: any) {
    const sections = draft.sections || {};
    const portfolioNote = sections.portfolio_note || '';

    const handleChange = (value: string) => {
        setDraft((d: any) => ({
            ...d,
            sections: { ...d.sections, portfolio_note: value }
        }));
    };

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <H3 className="text-lg font-black mb-4">Portfolio</H3>
                <P className="text-sm text-gray-500 mb-4">
                    Les photos de votre annonce sont automatiquement affichées. Ajoutez une note pour présenter votre portfolio.
                </P>

                {/* Preview des images existantes */}
                {annonce.images?.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {annonce.images.slice(0, 8).map((img: any, i: number) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img src={img.path} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}

                <textarea
                    value={portfolioNote}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Ex : Découvrez mes dernières réalisations..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors resize-none"
                />
            </CardBody>
        </Card>
    );
}