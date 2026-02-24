'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar, Card, CardBody, H4, Price, Small, P } from "@/components/Base";
import { StarMark } from "@/components/Modules/StarMark";
import { StorageImage } from "@/components/Base/StorageImage";

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

    const hasImages = images && images.length > 0;
    const displayImages = [...(images || [])].slice(0, 3);
    if (hasImages) {
        while (displayImages.length < 3) displayImages.push(null as any);
    }

    const inner = (
        <Card hover className="rounded-[20px] w-full max-w-sm overflow-hidden border-none shadow-sm h-full flex flex-col">
            <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: couleurPrincipale }} />
            <CardBody className="p-5 flex flex-col flex-1">

                {/* HEADER DE LA CARTE */}
                <div className="flex justify-between items-start mb-5 gap-4">

                    {/* INFOS GAUCHE (Avatar + Nom + Job + Stars) */}
                    <div className="flex gap-3 min-w-0">
                        <Avatar src={avatarSrc} name={name} size="lg" className="shrink-0" />
                        <div className="flex flex-col min-w-0">
                            {/* Retrait du truncate pour laisser le nom respirer */}
                            <H4 className="text-lg leading-tight mb-0.5 font-bold text-dark">{name}</H4>
                            <P className="text-sm font-medium mb-1 text-gray-600 leading-snug">{job}</P>

                            {/* Stars & Avis : on bloque le retour à la ligne */}
                            <div className="flex items-center whitespace-nowrap">
                                <StarMark variant="display" value={rating} nb_avis={nb_avis} size="sm" />
                            </div>
                        </div>
                    </div>

                    {/* shrink-0 empêche le bloc de se ratatiner, flex-1 sur la gauche ferait l'inverse */}
                    <div className="flex flex-col items-end text-right min-w-[80px] shrink-0 ml-auto">
                        <Price className="text-gray-900 text-base font-bold whitespace-nowrap mb-1">{price}</Price>
                        {/* La ville est la seule variable ajustable qui peut truncate si vraiment c'est trop long */}
                        <Small className="text-gray-400 font-medium truncate max-w-[100px]">
                            {city}
                        </Small>
                    </div>
                </div>

                {/* GRILLE D'IMAGES */}
                {hasImages && (
                    <div className="grid grid-cols-3 gap-2 mt-auto">
                        {displayImages.map((img, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity">
                                {img ? (
                                    <StorageImage
                                        path={img}
                                        alt={`Réalisation ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 rounded-xl">
                                        <div className="w-2 h-2 rounded-full bg-gray-200" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
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