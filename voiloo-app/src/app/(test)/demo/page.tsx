'use client';

import { useState } from 'react';
import {
    // Typography
    H1, H2, H3, H4, P, Small, TextAccent, Price, Label,
    // Forms
    Button, Input, Textarea, Select, Checkbox, Radio,
    // Layout
    Container, Card, CardHeader, CardBody, CardFooter, CardImage, Divider,
    // Feedback
    Modal, ModalBody, ModalFooter, Loader, LoadingOverlay, Badge,
    // Navigation
    Link, IconButton,
    // Data Display
    Avatar, AvatarGroup, Rating,
} from '@/components/Base';
import {DoubleSearchInput, MailInput, PasswordInput, PhoneInput} from "@/components/Modules";
import {
    Eye,
    Plus,
    ArrowRight,
    Search,
    Heart,
    Share2,
    Menu,
    Trash2,
    X, Settings,
} from "lucide-react";
import {DisplayCard} from "@/components/Modules/DisplayCard";
import {StarMark} from "@/components/Modules/StarMark";
import {CategoryCard} from "@/components/Modules/CategoryCard";
import {CtaCard} from "@/components/Modules/CtaCard"
import {FaqSection} from "@/components/Modules/Faq";
import {AboutSection, ProfilCard} from "@/components/Modules/ProfilCard";
import {QuickLinksCard} from "@/components/Modules/ProfilCard";
import {Logo} from "@/components/Base/logo";

export default function DemoPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [passwordValue, setpasswordValue] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [phone, setPhone] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const faqData = [
        {
            question: "Comment trouver un service sur Voiloo ?",
            answer: "Utilisez la barre de recherche en haut de la page pour indiquer le service recherché et votre ville. Vous pourrez ensuite filtrer les résultats selon vos besoins."
        },
        {
            question: "Est-ce que le paiement est sécurisé ?",
            answer: "Oui, toutes les transactions sont chiffrées et nous utilisons des partenaires de paiement reconnus pour garantir la sécurité de vos fonds."
        },
        {
            question: "Que faire en cas de litige ?",
            answer: "Notre support client est disponible 7j/7 pour intervenir et trouver une solution amiable entre le prestataire et le client."
        }
    ];
    const [userData, setUserData] = useState({
        name: "Mikella Colart",
        username: "mikiki",
        localisation: "Dole, France",
        joinDate: "Février 2026",
        avatar: "/poulet.jpg",
        bio: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias cupiditate dolor eos, error eveniet expedita fugiat illo itaque labore maiores minus molestiae porro possimus provident qui sit veniam voluptas voluptates.",
        activity: "Etudiante",
    });

    // 2. La fonction déclenchée lors du clic sur le bouton
    const handleSearch = () => {
        console.log("Recherche de :", searchQuery, "à :", location);
        // Ici tu feras ta redirection ou ton appel API
    };
    const [userRating, setUserRating] = useState(0); // Pour le mode interactif

    const handleLoadingDemo = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };
    const getPasswordError = (value: string) => {
        if (!value) return undefined;
        if (value.length < 8) return "Minimum 8 caractères";
        if (!/[A-Z]/.test(value)) return "Ajoutez une majuscule";
        if (!/\d/.test(value)) return "Ajoutez un chiffre";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Ajoutez un symbole (!@#$)";
        return undefined;
    };

    return (
    <div className="min-h-screen bg-white py-12 md:pb-12 relative">
            <Container>
                {/* Header */}
                <div className="mb-16 text-center">
                    <H1 className="mb-4">
                        <TextAccent>Voiloo</TextAccent> Design System
                    </H1>
                    <P className="max-w-2xl mx-auto">
                        Kit UI complet avec tous les composants Base pour construire l'interface Voiloo.
                    </P>
                </div>

                <div className="mb-16 text-center">
                    <H1>
                        Ne cherchez pas plus loin.
                    </H1>
                    <H3 className="mb-4">
                        Tout ce dont vous avez besoin est près de <TextAccent>chez vous !</TextAccent>
                    </H3>
                </div>

                {/* Typography */}
                <section className="mb-16">
                    <H2 className="mb-8">Typographie</H2>
                    <div className="space-y-4 bg-cream/50 p-8 rounded-2xl">
                        <H1>Heading 1 - Voiloo</H1>
                        <H2>Heading 2 - Section</H2>
                        <H3>Heading 3 - Sous-section</H3>
                        <H4>Heading 4 - Titre</H4>
                        <P>Paragraph - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</P>
                        <Small>Small - Texte secondaire ou aide</Small>
                        <div className="flex items-center gap-4">
                            <Label>Label</Label>
                            <TextAccent>Accent Text</TextAccent>
                            <Price>49,99 €</Price>
                            <Rating>4.5</Rating>
                        </div>
                        <div className="space-y-6">
                            {/* Cas 1 : Le Noteur (Interactif) */}
                            <div className="flex flex-col gap-2">
                                <Label>Tester le noteur (cliquable) :</Label>
                                <div className="flex items-center gap-4">
                                    <StarMark
                                        variant="rating"
                                        value={userRating}
                                        onChange={setUserRating}
                                        size="md"
                                    />
                                    <Rating>{userRating > 0 ? userRating : "Pas encore de note"}</Rating>
                                </div>
                            </div>

                            {/* Cas 2 : L'affichage (Statique) */}
                            <div className="flex flex-col gap-2">
                                <Label>Exemple d'affichage (moyenne) :</Label>
                                <StarMark
                                    variant="display"
                                    value={4.5}
                                    nb_avis={128}
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <Divider className="my-12" />

                {/* Buttons */}
                <section className="mb-16">
                    <H2 className="mb-8">Boutons</H2>

                    <H4 className="mb-4">Variantes</H4>
                    <div className="flex flex-wrap gap-4 mb-8">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Danger</Button>
                    </div>

                    <H4 className="mb-4">Tailles</H4>
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                    </div>

                    <H4 className="mb-4">États</H4>
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <Button disabled>Disabled</Button>
                        <Button isLoading>Loading</Button>
                        <Button
                            isLoading={isLoading}
                            onClick={handleLoadingDemo}
                        >
                            {isLoading ? 'Chargement...' : 'Cliquez-moi'}
                        </Button>
                    </div>

                    <H4 className="mb-4">Avec icônes</H4>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button leftIcon={<Plus size={20} />}>
                            Ajouter
                        </Button>
                        <Button variant="secondary" rightIcon={<ArrowRight size={20} />}>
                            Continuer
                        </Button>
                        <Button variant="outline" fullWidth className="max-w-xs">
                            Full Width
                        </Button>
                    </div>
                </section>
                <Divider className="my-12" />

                {/* Cards Link */}
                <section className="mb-16 ">
                    <H2 className="mb-8">Cards Link</H2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <CategoryCard
                            title="Proximité"
                            description="Le bon service, au bon endroit, au bon moment."
                            href="/proximite"
                        />
                        <CategoryCard
                            title="Digital & Informatique"
                            description="Sites, dépannage, formation"
                            href="/digital"
                        />
                        <CategoryCard
                            title="Etudiant & Passionné"
                            description="Compétences, motivation et tarifs adaptés."
                            href="/etudiants"
                        />
                    </div>
                    <CtaCard
                        title={"Rejoignez Voiloo"}
                        description="Trouvez ou proposez des services près de chez vous, simplement et en toute confiance."
                        href="/register"
                    />
                </section>

                <Divider className="my-12" />

                {/* Forms */}
                <section className="mb-16">
                    <H2 className="mb-8">Formulaires</H2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Input
                                label="Email"
                                placeholder="ton@email.com"
                                type="email"
                            />
                            <Input
                                label="Mot de passe"
                                type="password"
                                placeholder="••••••••"
                                value={passwordValue}
                                onChange={(e) => setpasswordValue(e.target.value)}
                                error={getPasswordError(passwordValue)}
                                hint={"Doit contenir 8+ car., une majuscule, un chiffre et un symbole."}
                                required={true}
                            />
                            <MailInput
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <PasswordInput
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                required
                            />

                            <PhoneInput
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Votre portable"
                                leftIcon={<div className="text-xs font-bold">+33</div>}
                            />

                            <DoubleSearchInput
                                whatValue={searchQuery}
                                onWhatChange={setSearchQuery}
                                whereValue={location}
                                onWhereChange={setLocation}
                                onSearch={handleSearch}
                                className="max-w-3xl mx-auto" // Pour centrer et limiter la largeur
                            />
                            <Input
                                label="Avec erreur"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                error={
                                    inputValue.length < 3 && inputValue.length > 0 ? "Minimum 3 caractères" : undefined
                                }
                                placeholder="Tapez quelque chose..."
                            />
                            <Input
                                label="Recherche"
                                placeholder="Rechercher un freelance..."
                                leftIcon={<Search size={20} />}
                            />
                        </div>

                        <div className="space-y-6">
                            <Select
                                label="Catégorie"
                                placeholder="Choisir une catégorie"
                                options={[
                                    { value: 'design', label: 'Design & Graphisme' },
                                    { value: 'dev', label: 'Développement' },
                                    { value: 'marketing', label: 'Marketing' },
                                    { value: 'photo', label: 'Photographie' },
                                    { value: 'beauty', label: 'Beauté & Bien-être' },
                                ]}
                            />
                            <Textarea
                                label="Description"
                                placeholder="Décrivez votre service..."
                                hint="Soyez précis pour attirer plus de clients"
                            />
                            <div className="space-y-3">
                                <Label>Options</Label>
                                <Checkbox label="J'accepte les conditions" />
                                <Checkbox label="Recevoir la newsletter" defaultChecked />
                                <Checkbox label="Désactivé" disabled />
                            </div>
                            <div className="space-y-3">
                                <Label>Type de prestation</Label>
                                <div className="flex gap-6">
                                    <Radio name="type" label="À distance" defaultChecked />
                                    <Radio name="type" label="Sur place" />
                                    <Radio name="type" label="Les deux" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Divider className="my-12" />

                {/* Cards */}
                <section className="mb-16">
                    <H2 className="mb-8">Cards</H2>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <Card hover>
                            <CardImage
                                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop"
                                alt="Service"
                            />
                            <CardBody>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="primary" size="sm">Beauté</Badge>
                                    <Badge variant="outline" size="sm">Disponible</Badge>
                                </div>
                                <H4 className="mb-2">Pose d'ongles en gel</H4>
                                <P className="text-sm mb-3">Manucure professionnelle avec pose de gel UV longue durée.</P>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar name="Marie D" size="sm" />
                                        <Small>Marie D.</Small>
                                    </div>
                                    <Price>35 €</Price>
                                </div>
                            </CardBody>
                        </Card>

                        <Card variant="outlined">
                            <CardHeader>
                                <H4>Card avec Header</H4>
                            </CardHeader>
                            <CardBody>
                                <P>Contenu de la card avec une variante outlined.</P>
                            </CardBody>
                            <CardFooter>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost">Annuler</Button>
                                    <Button size="sm">Confirmer</Button>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card variant="elevated">
                            <CardBody>
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                                        size="lg"
                                        status="online"
                                    />
                                    <div>
                                        <H4>Thomas Martin</H4>
                                        <Small>Développeur Web</Small>
                                    </div>
                                </div>
                                <P className="text-sm mb-4">Création de sites web et applications sur mesure.</P>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>React</Badge>
                                    <Badge>Next.js</Badge>
                                    <Badge>Node.js</Badge>
                                </div>
                            </CardBody>
                        </Card>
                        <DisplayCard
                            name="Mikella"
                            job="Prothésiste Ongulaire"
                            rating={4.8}
                            nb_avis={12}
                            price="50-60€"
                            city="Dole"
                            avatarSrc="/poulet.jpg"
                            images={["/ongleLaora.jpg", "/ongleMikella.jpg", "/ongleLilie.jpg"]}
                        />
                        <ProfilCard
                            user={userData}
                            onUpdate={(newData) => {
                                setUserData(newData);
                                console.log("Données mises à jour dans la DB simulée :", newData);
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mx-auto">

                        {/* Colonne de GAUCHE (Paramètres + Profil) - occupe 8 colonnes (plus large) */}
                        <div className="md:col-span-8 flex flex-col">
                            {/* On met le bouton Paramètre juste au dessus de la ProfilCard, aligné à droite de sa zone */}
                            <div className="flex justify-end mb-2">
                                <Button variant="ghost" size="sm" leftIcon={<Settings size={16} className="text-primary"/>}>
                                    Paramètre du compte
                                </Button>
                            </div>

                            <ProfilCard
                                user={userData}
                                onUpdate={setUserData}
                            />
                        </div>

                        {/* Colonne de DROITE (Liens rapides) - occupe 4 colonnes (plus petite) */}
                        <div className="md:col-span-4 flex flex-col">
                            {/* Espaceur pour que le haut de la QuickLinksCard soit aligné avec le haut de la ProfilCard */}
                            <div className="h-[32px] mb-2 hidden md:block" />

                            <QuickLinksCard />
                        </div>
                        {/* Colonne de DROITE (Liens rapides) - occupe 4 colonnes (plus petite) */}
                        <div className="md:col-span-12 flex flex-col">
                            <AboutSection
                                user={userData}
                                onUpdate={setUserData}
                            />
                        </div>
                    </div>
                </section>

                <Divider className="my-12" />

                {/* Badges */}
                <section className="mb-16">
                    <H2 className="mb-8">Badges</H2>

                    <H4 className="mb-4">Variantes</H4>
                    <div className="flex flex-wrap gap-3 mb-6">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="error">Error</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="outline">Outline</Badge>
                    </div>

                    <H4 className="mb-4">Tailles</H4>
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <Badge size="sm">Small</Badge>
                        <Badge size="md">Medium</Badge>
                        <Badge size="lg">Large</Badge>
                    </div>

                    <H4 className="mb-4">Removable</H4>
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="primary" removable onRemove={() => {}}>Design</Badge>
                        <Badge variant="primary" removable onRemove={() => {}}>Dev</Badge>
                        <Badge variant="primary" removable onRemove={() => {}}>Marketing</Badge>
                    </div>
                </section>

                <Divider className="my-12" />

                {/* Avatars */}
                <section className="mb-16">
                    <H2 className="mb-8">Avatars</H2>

                    <H4 className="mb-4">Tailles</H4>
                    <div className="flex items-end gap-4 mb-6">
                        <Avatar size="xs" name="AB" />
                        <Avatar size="sm" name="CD" />
                        <Avatar size="md" name="EF" />
                        <Avatar size="lg" name="GH" />
                        <Avatar size="xl" name="IJ" />
                    </div>

                    <H4 className="mb-4">Avec image et statut</H4>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                            size="lg"
                            status="online"
                        />
                        <Avatar
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                            size="lg"
                            status="away"
                        />
                        <Avatar
                            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop"
                            size="lg"
                            status="offline"
                        />
                    </div>

                    <H4 className="mb-4">Avatar Group</H4>
                    <AvatarGroup max={4}>
                        <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
                        <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
                        <Avatar src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" />
                        <Avatar name="Marie" />
                        <Avatar name="Jean" />
                        <Avatar name="Luc" />
                    </AvatarGroup>
                </section>

                <Divider className="my-12" />

                {/* Loaders */}
                <section className="mb-16">
                    <H2 className="mb-8">Loaders</H2>

                    <div className="flex items-center gap-8 mb-8">
                        <div className="text-center">
                            <Loader variant="spinner" size="md" />
                            <Small className="block mt-2">Spinner</Small>
                        </div>
                        <div className="text-center">
                            <Loader variant="dots" size="md" />
                            <Small className="block mt-2">Dots</Small>
                        </div>
                        <div className="text-center">
                            <Loader variant="pulse" size="md" />
                            <Small className="block mt-2">Pulse</Small>
                        </div>
                    </div>

                    <H4 className="mb-4">Couleurs</H4>
                    <div className="flex items-center gap-8 mb-8">
                        <Loader color="primary" />
                        <Loader color="dark" />
                        <div className="bg-dark p-4 rounded-lg">
                            <Loader color="white" />
                        </div>
                    </div>

                    <H4 className="mb-4">Loading Overlay</H4>
                    <LoadingOverlay isLoading={isLoading}>
                        <Card>
                            <CardBody>
                                <P>Cliquez sur le bouton "Cliquez-moi" ci-dessus pour voir l'overlay.</P>
                            </CardBody>
                        </Card>
                    </LoadingOverlay>
                </section>

                <Divider className="my-12" />

                {/* Links & Icon Buttons */}
                <section className="mb-16">
                    <H2 className="mb-8">Links & Icon Buttons</H2>

                    <H4 className="mb-4">Links</H4>
                    <div className="flex flex-wrap gap-6 mb-8">
                        <Link href="#">Default Link</Link>
                        <Link href="#" variant="primary">Primary Link</Link>
                        <Link href="#" variant="muted">Muted Link</Link>
                        <Link href="#" variant="nav">Nav Link</Link>
                        <Link href="#" variant="primary" rightIcon={<Plus size={20}/>}>Link Icon Right</Link>
                        <Link href="#" variant="primary" leftIcon={<Plus size={20}/>}>Link Icon Left</Link>
                        <Link href="https://google.com" external>External Link</Link>
                    </div>

                    <H4 className="mb-4">Icon Buttons</H4>
                    <div className="flex items-center gap-4">
                        <IconButton label="Favoris" icon={<Heart />} />
                        <IconButton label="Partager" variant="primary" icon={<Share2 />} />
                        <IconButton label="Menu" variant="ghost" icon={<Menu />} />
                        <IconButton label="Supprimer" variant="danger" icon={<Trash2 />} />
                    </div>
                </section>

                <Divider className="my-12" />

                {/* Dividers */}
                <section className="mb-16">
                    <H2 className="mb-8">Dividers</H2>

                    <div className="space-y-6">
                        <div>
                            <Small className="mb-2 block">Simple</Small>
                            <Divider />
                        </div>
                        <div>
                            <Small className="mb-2 block">Avec texte</Small>
                            <Divider>ou</Divider>
                        </div>
                        <div className="flex items-center h-12">
                            <Small>Vertical →</Small>
                            <Divider orientation="vertical" className="mx-4" />
                            <Small>← Vertical</Small>
                        </div>
                    </div>
                </section>

                <Divider className="my-12" />

                {/* Modal */}
                <section className="mb-16">
                    <H2 className="mb-8">Modal</H2>

                    <Button onClick={() => setIsModalOpen(true)}>
                        Ouvrir la Modal
                    </Button>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Confirmer l'action"
                        size="md"
                    >
                        <ModalBody>
                            <P>Êtes-vous sûr de vouloir continuer ? Cette action est irréversible.</P>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button onClick={() => setIsModalOpen(false)}>
                                Confirmer
                            </Button>
                        </ModalFooter>
                    </Modal>
                </section>
                <Divider className="my-12" />

                {/* 3. Utilisation de la section FAQ */}
                <FaqSection
                    items={faqData}
                    title="Questions fréquentes"
                    description="Tout ce que vous devez savoir pour démarrer."
                />
                {/* Footer */}
                <div className="text-center py-12 bg-cream rounded-2xl">
                    <TextAccent className="text-2xl">Voiloo</TextAccent>
                    <P className="mt-2">Design System v1.0</P>
                </div>

                {/* Modal */}
                <section className="mb-16 flex flex-col gap-2">
                    <H2 className="mb-8 ">Logo</H2>
                    <div className="bg-dark p-3 flex gap-2">
                    <Logo />
                        <Logo voilColor="var(--color-dark)" ooColor="var(--color-primary)" />

                    </div>

                    <Logo voilColor="var(--color-dark)" ooColor="var(--color-primary)" />

                    <div className="bg-dark p-3">
                        <Logo voilColor="var(--color-white)" ooColor="var(--color-white)" />
                    </div>

                    <Logo variant="solo" ooColor="var(--color-primary)" />
                    <Logo voilColor={"#965dfd"} ooColor={"#00FFFF"} />
                    <Logo voilColor={"var(--dark)"} ooColor={"#FF0000"} />

                    <Logo variant="solo" size={40} />
                    <Logo variant="solo" size={40} ooColor={"#00FFFF"}/>
                    <Logo variant="solo" size={40} ooColor={"#FF0000"}/>

                </section>
            </Container>
        </div>
    );
}
