import { Card, CardBody, H3, P, Label, Input } from '@/components/Base';
import { Instagram, Linkedin, Globe, Facebook, Twitter } from 'lucide-react';

export function SocialsEditor({ draft, setDraft }: any) {
    const socials = [
        { key: 'instagram', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/votreprofil' },
        { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/votreprofil' },
        { key: 'facebook', icon: Facebook, label: 'Facebook', placeholder: 'https://facebook.com/votreprofil' },
        { key: 'twitter', icon: Twitter, label: 'Twitter/X', placeholder: 'https://twitter.com/votreprofil' },
        { key: 'site_web', icon: Globe, label: 'Site web', placeholder: 'https://votresite.com' },
    ];

    const update = (key: string, value: string) => {
        setDraft((d: any) => ({ ...d, [key]: value }));
    };

    return (
        <Card variant="elevated">
            <CardBody className="p-6">
                <H3 className="text-lg font-black mb-4">Réseaux sociaux</H3>
                <P className="text-sm text-gray-500 mb-4">
                    Ajoutez vos liens (facultatif). Seuls les liens remplis seront affichés.
                </P>

                <div className="space-y-3">
                    {socials.map(({ key, icon: Icon, label, placeholder }) => (
                        <div key={key} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <Icon size={18} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <Input
                                    label={label}
                                    type="url"
                                    value={draft[key] || ''}
                                    onChange={(e) => update(key, e.target.value)}
                                    placeholder={placeholder}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}