'use client';

import { Image as ImageIcon } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { StorageImage } from "@/components/Base/StorageImage";
import { P } from "@/components/Base";

interface SectionPortfolioProps {
    images: any[];
    primary: string;
    note?: string; // Ajout de la prop note
}

export default function SectionPortfolio({ images, primary, note }: SectionPortfolioProps) {
    if (!images || images.length === 0) return null;

    return (
        <section id="portfolio" className="scroll-mt-20">
            <SectionTitle icon={<ImageIcon size={18} />} label="Portfolio" primary={primary} />

            {/* Affichage de la note si elle existe */}
            {note && (
                <div className="mt-4 mb-6">
                    <P className="text-md text-gray-300 italic leading-relaxed">
                        {note}
                    </P>
                </div>
            )}

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, i) => {
                    const path = typeof img === 'string' ? img : img.path;

                    return (
                        <div
                            key={i}
                            className="aspect-square rounded-2xl overflow-hidden border-2 bg-gray-50 group"
                            style={{ borderColor: `${primary}10` }}
                        >
                            <StorageImage
                                path={path}
                                alt={`Réalisation ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}