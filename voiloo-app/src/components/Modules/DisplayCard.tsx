'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, Card, CardBody, H4, Price, Small, P } from "@/components/Base";
import { StarMark } from "@/components/Modules/StarMark";

// ✅ Correction de la base URL avec fallback propre
const STORAGE_BASE = (process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:8000/storage').replace(/\/+$/, '');

function normalizeImageUrl(path: string | null | undefined): string {
    if (!path || path === "userdefault.png") return "/userdefault.png";
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    // Nettoyage des slashes et du mot "storage" en doublon
    const cleanPath = path.replace(/^(storage\/|\/storage\/|\/)/, '');

    return `${STORAGE_BASE}/${cleanPath}`;
}

interface DisplayCardProps {
    name: string;
    job: string;
    rating: number;
    nb_avis: number;
    price: string;
    city: string;
    avatarSrc?: string;
    images?: string[];
    userSlug?: string;
    annonceSlug?: string;
    couleurPrincipale?: string;
}

export const DisplayCard = ({
                                name, job, rating, nb_avis, price, city,
                                avatarSrc, images = [],
                                userSlug, annonceSlug,
                                couleurPrincipale = '#FFD359',
                            }: DisplayCardProps) => {

    const displayImages = [...(images || [])].slice(0, 3);
    while (displayImages.length < 3) displayImages.push(null as any);

    const inner = (
        <Card hover className="rounded-[20px] w-full max-w-sm overflow-hidden border-none shadow-sm h-full flex flex-col">
            {/* Bandeau couleur vitrine */}
            <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: couleurPrincipale }} />
            <CardBody className="p-5 flex flex-col flex-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-5 gap-2">
                    <div className="flex gap-3 min-w-0">
                        <Avatar src={normalizeImageUrl(avatarSrc)} name={name} size="lg" />
                        <div className="flex flex-col min-w-0">
                            <H4 className="text-lg leading-tight mb-0.5 truncate">{name}</H4>
                            <P className="text-sm font-medium mb-1 text-gray-600 truncate">{job}</P>
                            <StarMark variant="display" value={rating} nb_avis={nb_avis} size="sm" />
                        </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        <Price className="text-gray-900 text-base font-bold">{price}</Price>
                        <Small className="text-gray-400 font-medium">{city}</Small>
                    </div>
                </div>

                {/* Grid photos - Remplissage auto du reste de la carte */}
                <div className="grid grid-cols-3 gap-2 mt-auto">
                    {displayImages.map((img, i) => (
                        <div key={i}
                             className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity">
                            {img ? (
                                <Image
                                    src={normalizeImageUrl(img)}
                                    alt={`Réalisation ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 33vw, 120px"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );

    if (userSlug && annonceSlug) {
        return (
            <Link href={`/u/${userSlug}/${annonceSlug}`} className="block transition-transform active:scale-[0.98] h-full">
                {inner}
            </Link>
        );
    }

    return inner;
};