'use client';

import { Image as ImageIcon } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

export default function SectionPortfolio({ images, primary, baseUrl }: { images: string[]; primary: string; baseUrl: string }) {
    if (!images || images.length === 0) return null;

    return (
        <section id="portfolio" className="scroll-mt-20">
            <SectionTitle icon={<ImageIcon size={18} />} label="Portfolio" primary={primary} />

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((path, i) => {

                    return (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 bg-gray-100"
                             style={{ borderColor: `${primary}20` }}>
                            <img
                                src={path} // Plus besoin de concaténer avec baseUrl ou /storage/
                                alt={`Réalisation ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}