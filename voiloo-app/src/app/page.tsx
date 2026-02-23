"use client";
import { HeroSection } from "@/components/Layouts/HeroSection";
import { CategoryBar } from "@/components/Layouts/CategoryBar";
import { FreelanceGrid } from "@/components/Layouts/FreelanceGrid";
import { FaqSection } from "@/components/Modules/Faq";
import { useUserCity } from "@/hooks/useUserCity";

const faqData = [
    {
        question: "Comment trouver un service sur Voiloo ?",
        answer: "Utilisez la barre de recherche en haut de la page pour indiquer le service recherché et votre ville. Vous pourrez ensuite filtrer les résultats selon vos besoins."
    },
    {
        question: "Le paiement en ligne est-il disponible ?",
        answer: "Non. S'agissant d'un projet de fin d'études, les moyens de paiement intégrés ne sont pas encore disponibles. Le règlement des prestations s'effectue directement auprès du professionnel."
    },
    {
        question: "Que faire en cas de problème ?",
        answer: "Vous pouvez envoyer un e-mail à contact@voiloo.fr. Nous vous répondrons sous un délai de 1 à 2 jours ouvrés."
    },
    {
        question: "Comment entrer en contact avec un prestataire ?",
        answer: "Une fois que vous avez trouvé un profil qui vous intéresse, vous pouvez utiliser les coordonnées affichées sur sa fiche pour convenir d'un rendez-vous, ou utiliser le formulaire de contact en bas de la vitrine."
    },
    {
        question: "L'inscription est-elle gratuite ?",
        answer: "Oui, la création d'un compte sur Voiloo est totalement gratuite, que vous soyez un particulier ou un professionnel."
    },
    {
        question: "Mes données personnelles sont-elles sécurisées ?",
        answer: "Oui, la protection de vos données est notre priorité. Nous utilisons des protocoles de sécurité standards pour garantir que vos informations restent confidentielles."
    },
    {
        question: "Quelles sont les prochaines fonctionnalités prévues ?",
        answer: "Nous travaillons activement sur l'intégration d'un système de réservation en ligne, d'une messagerie interne et d'un module de paiement sécurisé."
    }
];

export default function Home() {
    const userCity = useUserCity();

    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <CategoryBar />
            <FreelanceGrid userCity={userCity} />
            <FaqSection items={faqData} title="Questions fréquentes" description="Tout ce que vous devez savoir pour démarrer." />
        </div>
    );
}