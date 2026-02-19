import { User } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

export default function SectionAbout({ content, primary }: { content: string; primary: string }) {
    return (
        <section id="about" className="scroll-mt-20">
            <SectionTitle icon={<User size={18} />} label="À propos" primary={primary} />
            <p className="text-base leading-relaxed opacity-80 mt-4 whitespace-pre-line">{content}</p>
        </section>
    );
}