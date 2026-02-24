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

export default function MentionsLegales() {
    return (
        <div className="min-h-screen bg-white py-12">
            <Container>
                <div className="mb-12 text-center">
                    <H1 className="mb-4">
                        Mentions <TextAccent>Légales</TextAccent>
                    </H1>
                    <P className="max-w-2xl mx-auto">
                        Informations obligatoires concernant l'éditeur et l'hébergeur du site Voiloo.
                    </P>
                </div>

                <div className="max-w-3xl mx-auto space-y-10">

                    {/* 1. Édition du site */}
                    <section>
                        <H2 className="mb-4 ">1. Éditeur du site</H2>
                        <P>
                            Le site <strong>Voiloo</strong> est un projet pédagogique édité par <strong>Dévann Billereau</strong>,
                            étudiant en 3ème année de BUT MMI.
                        </P>
                        <P className="mt-2">
                            <strong>Directeur de la publication :</strong> Dévann Billereau<br />
                            <strong>Contact :</strong> <Link href="mailto:contact@voiloo.fr" variant="muted">contact@voiloo.fr</Link>
                        </P>
                    </section>

                    <Divider />

                    {/* 2. Hébergement */}
                    <section>
                        <H2 className="mb-4 ">2. Hébergement</H2>
                        <P>
                            Le site est hébergé par la société <strong>Infomaniak Network SA</strong>.
                        </P>
                        <P className="mt-2 italic">
                            Siège social : Rue Eugène-Marziano 25, 1227 Les Acacias, Genève, Suisse.<br />
                            Site web : <Link href="https://www.infomaniak.com" external variant="muted">www.infomaniak.com</Link>
                        </P>
                    </section>

                    <Divider />

                    {/* 3. Responsabilité et Modération (Ta protection) */}
                    <section>
                        <H2 className="mb-4 ">3. Responsabilité et Contenus</H2>
                        <P>
                            Voiloo agit en tant qu'hébergeur de contenus mis en ligne par ses utilisateurs.
                            À ce titre, l'éditeur ne saurait être tenu responsable des annonces, textes ou photos
                            publiés par les membres de la plateforme.
                        </P>
                        <P className="mt-4">
                            <strong>Modération :</strong> Une modération humaine est assurée a posteriori.
                            En raison d'une gestion en autonomie, un délai de traitement des signalements est possible.
                            Tout contenu illicite peut être signalé à : <Link href="mailto:contact@voiloo.fr" variant="muted">contact@voiloo.fr</Link>.
                        </P>
                    </section>

                    <Divider />

                    {/* 4. Propriété intellectuelle */}
                    <section>
                        <H2 className="mb-4 ">4. Propriété intellectuelle</H2>
                        <P>
                            La structure générale du site, ainsi que les textes et logos propres à Voiloo sont la propriété de l'éditeur.
                            Les photos utilisées lors de la phase de test sont la propriété de l'éditeur ou issues de banques d'images libres de droits.
                            Toute reproduction totale ou partielle du site est interdite.
                        </P>
                    </section>

                    <div className="pt-12 text-center border-t">
                        <P className="text-muted italic">
                            Voiloo — Projet étudiant BUT MMI — 2026
                        </P>
                    </div>

                </div>
            </Container>
        </div>
    );
}