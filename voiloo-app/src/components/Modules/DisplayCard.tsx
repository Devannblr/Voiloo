import React from 'react';
import Image from 'next/image';
import {Avatar, Card, CardBody, H4, Price, Small, Rating, P} from "@/components/Base";
import { StarMark } from "@/components/Modules/StarMark";

interface DisplayCardProps {
    name: string;
    job: string;
    rating: number;
    nb_avis: number;
    price: string;
    city: string;
    avatarSrc?: string;
    images?: string[]; // Pour plus tard quand tu auras de vraies images
}

export const DisplayCard = ({
                                name,
                                job,
                                rating,
                                nb_avis,
                                price,
                                city,
                                avatarSrc,
                                images = [] // Valeur par défaut pour la démo
                            }: DisplayCardProps) => {
    const displayImages = [...(images || []), null, null, null].slice(0, 3);
    return (
        <Card hover className="rounded-[20px] w-full max-w-sm">
            <CardBody className="p-5">
                {/* Header : Profil à gauche, Prix/Ville à droite */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex gap-3">
                        <Avatar
                            src={avatarSrc}
                            name={name}
                            size="lg"
                        />
                        <div className="flex flex-col">
                            <H4 className=" text-xl leading-tight mb-0.5">{name}</H4>
                            <P className="text-sm font-medium mb-1">{job}</P>
                            <div className="flex items-center gap-1">
                                <StarMark
                                    variant="display"
                                    value={rating}
                                    nb_avis={nb_avis}
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <Price className="text-gray-200 text-base">{price}</Price>
                        <Small className="text-gray-500 font-medium">{city}</Small>
                    </div>
                </div>

                {/* Grid d'images (Portfolio) */}
                <div className="grid grid-cols-3 gap-2">
                    {displayImages.map((img, i) => (
                        <div
                            key={i}
                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-700 transition-opacity hover:opacity-90 cursor-pointer"
                        >
                            {img ? (
                                <Image
                                    src={img}
                                    alt={`Réalisation ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                // Carré gris si pas d'image
                                <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-white/5" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};