import { Card, CardBody, H3, P, Label } from '@/components/Base';
import { Mail } from 'lucide-react';

export function ContactEditor({ draft, setDraft }: any) {
    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <H3 className="text-lg font-black mb-4">Formulaire de contact</H3>
                <P className="text-sm text-gray-500 mb-4">
                    Activez le formulaire pour que les visiteurs puissent vous contacter directement.
                </P>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                    <input
                        type="checkbox"
                        checked={draft.show_contact_form ?? true}
                        onChange={(e) => setDraft((d: any) => ({ ...d, show_contact_form: e.target.checked }))}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Mail size={18} className="text-primary" />
                        </div>
                        <div>
                            <Label>Afficher le formulaire de contact</Label>
                            <P className="text-xs text-gray-500">Les messages seront envoyés à votre email</P>
                        </div>
                    </div>
                </label>
            </CardBody>
        </Card>
    );
}