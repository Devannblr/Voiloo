import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, Card, CardBody, H4, Price, Small, P } from "@/components/Base";
import { StarMark } from "@/components/Modules/StarMark";

// Normalise les URLs d'images
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:8000';
function normalizeImageUrl(path: string): string {
    if (!path) return `${API_BASE}/userdefault.png`;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/storage/')) return `${API_BASE}${path}`;
    if (path.startsWith('storage/'))  return `${API_BASE}/${path}`;
    return `${API_BASE}/storage/${path}`;
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
    // Navigation vitrine
    userSlug?: string;
    annonceSlug?: string;
    // Couleur principale de la vitrine
    couleurPrincipale?: string;
}

export const DisplayCard = ({
                                name, job, rating, nb_avis, price, city,
                                avatarSrc, images = [],
                                userSlug, annonceSlug,
                                couleurPrincipale = '#FFD359',
                            }: DisplayCardProps) => {
    const displayImages = [...(images || []), null, null, null].slice(0, 3);

    const inner = (
        <Card hover className="rounded-[20px] w-full max-w-sm overflow-hidden">
            {/* Bandeau couleur vitrine */}
            <div className="h-1 w-full" style={{ backgroundColor: couleurPrincipale }} />
            <CardBody className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex gap-3">
                        <Avatar src={avatarSrc} name={name} size="lg" />
                        <div className="flex flex-col">
                            <H4 className="text-xl leading-tight mb-0.5">{name}</H4>
                            <P className="text-sm font-medium mb-1">{job}</P>
                            <StarMark variant="display" value={rating} nb_avis={nb_avis} size="sm" />
                        </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        <Price className="text-gray-200 text-base">{price}</Price>
                        <Small className="text-gray-500 font-medium">{city}</Small>
                    </div>
                </div>

                {/* Grid photos */}
                <div className="grid grid-cols-3 gap-2">
                    {displayImages.map((img, i) => (
                        <div key={i}
                             className="relative aspect-square rounded-xl overflow-hidden bg-gray-700 hover:opacity-90 transition-opacity cursor-pointer">
                            {img ? (
                                <Image src={normalizeImageUrl(img)} alt={`Réalisation ${i + 1}`} fill className="object-cover" />
                            ) : (
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

    if (userSlug && annonceSlug) {
        return (
            <Link href={`/u/${userSlug}/${annonceSlug}`} className="block">
                {inner}
            </Link>
        );
    }

    return inner;
};