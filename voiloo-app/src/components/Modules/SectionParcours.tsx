import { Briefcase } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { P } from "@/components/Base";
import { ParcoursItem } from "./types";

// L'interface doit définir "parcours" et non "content"
interface SectionParcoursProps {
    parcours: ParcoursItem[] | string;
    primary: string;
}

export default function SectionParcours({ parcours, primary }: SectionParcoursProps) {
    return (
        <section id="parcours" className="scroll-mt-20">
            <SectionTitle icon={<Briefcase size={18} />} label="Parcours" primary={primary} />
            <div className="mt-4 space-y-4">
                {Array.isArray(parcours) ? (
                    parcours.map((item, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                                     style={{ backgroundColor: primary }} />
                                {i < parcours.length - 1 && (
                                    <div className="w-px flex-1 mt-1"
                                         style={{ backgroundColor: primary, opacity: 0.2 }} />
                                )}
                            </div>
                            <div className="pb-4">
                                {item.year && <p className="text-xs font-bold opacity-50 mb-1">{item.year}</p>}
                                {item.title && <p className="font-bold">{item.title}</p>}
                                {item.description && <p className="text-sm opacity-70 mt-1">{item.description}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    /* Si c'est juste du texte simple */
                    <P className="text-base leading-relaxed opacity-80 whitespace-pre-line">{parcours}</P>
                )}
            </div>
        </section>
    );
}