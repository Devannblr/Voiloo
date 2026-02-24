'use client';

import {
    Container,
    H1,
    H2,
    P,
    Divider,
    Link,
    TextAccent
} from '@/components/Base';

export default function PolitiqueConfidentialite() {
    return (
        <div className="min-h-screen bg-white py-12">
            <Container>
                {/* Header de la page */}
                <div className="mb-12 text-center">
                    <H1 className="mb-4">
                        Politique de <TextAccent>Confidentialité</TextAccent>
                    </H1>
                    <P className="max-w-2xl mx-auto">
                        Chez Voiloo, on respecte ta vie privée. Voici comment on gère tes données de manière transparente.
                    </P>
                </div>

                <div className="max-w-3xl mx-auto space-y-10">

                    {/* Section 1 */}
                    <section>
                        <H2 className="mb-4 text-primary">1. Qui sommes-nous ?</H2>
                        <P>
                            Le projet <TextAccent>Voiloo</TextAccent> est développé par <strong>Dévann Billereau</strong>,
                            étudiant en 3ème année de BUT MMI. Le site est conçu pour mettre en relation
                            des prestataires et des clients à l'échelle locale.
                        </P>
                        <P className="mt-2">
                            Pour toute question : <Link href="mailto:contact@voiloo.fr" variant="primary">contact@voiloo.fr</Link>
                        </P>
                    </section>

                    <Divider />

                    {/* Section 2 */}
                    <section>
                        <H2 className="mb-4 text-primary">2. Quelles données collectons-nous ?</H2>
                        <P className="mb-4">
                            On ne demande que ce qui est utile pour te rendre service :
                        </P>
                        <ul className="space-y-3 ml-4">
                            <li className="flex gap-2">
                                <span className="text-primary">•</span>
                                <P><strong>Compte :</strong> Nom, email, pseudo et mot de passe (haché).</P>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary">•</span>
                                <P><strong>Localisation :</strong> Adresse et coordonnées (lat/long) pour te montrer les services autour de toi.</P>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary">•</span>
                                <P><strong>Sécurité :</strong> Via Cloudflare Turnstile, nous vérifions que tu n'es pas un robot sans te faire cliquer sur des feux tricolores.</P>
                            </li>
                        </ul>
                    </section>

                    <Divider />

                    {/* Section 3 */}
                    <section>
                        <H2 className="mb-4 text-primary">3. Où sont tes données ?</H2>
                        <P>
                            Tes données sont stockées en toute sécurité chez <strong>Infomaniak</strong> en Suisse,
                            un hébergeur reconnu pour son engagement écologique et le respect de la vie privée.
                            Elles ne sont jamais revendues à des tiers.
                        </P>
                    </section>

                    <Divider />

                    {/* Section 4 */}
                    <section>
                        <H2 className="mb-4 text-primary">4. Conservation et Suppression</H2>
                        <P>
                            Si ton compte reste inactif pendant <strong>1 an</strong>, nous supprimons tes données
                            personnelles de nos bases. Tu peux aussi demander la suppression immédiate de ton compte
                            via les paramètres ou par email.
                        </P>
                    </section>

                    <Divider />

                    {/* Section 5 */}
                    <section>
                        <H2 className="mb-4 text-primary">5. Cookies</H2>
                        <P>
                            Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du site
                            (maintien de la session et sécurité Turnstile). Pas de pistage publicitaire ici.
                        </P>
                    </section>

                    {/* Footer de la politique */}
                    <div className="pt-12 text-center border-t">
                        <P className="text-muted italic">
                            Dernière mise à jour : Février 2026 — Fait avec passion en BUT MMI.
                        </P>
                    </div>
                </div>
            </Container>
        </div>
    );
}