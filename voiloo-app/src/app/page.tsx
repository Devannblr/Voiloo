import {HeroSection} from "@/components/Layouts/HeroSection";
import {CategoryBar} from "@/components/Layouts/CategoryBar";
import {FreelanceGrid} from "@/components/Layouts/FreelanceGrid";
import {FaqSection} from "@/components/Modules/Faq";

export default function Home() {
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
    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. La partie haute avec la carte et la recherche */}
            <HeroSection />
            <CategoryBar />
            <FreelanceGrid/>
            <FaqSection
                items={faqData}
                title="Questions fréquentes"
                description="Tout ce que vous devez savoir pour démarrer."
            />
        </div>
    );
}