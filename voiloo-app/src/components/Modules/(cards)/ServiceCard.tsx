'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardBody, H4, Small, Price, Badge, Divider } from '@/components/Base';
import { StarMark } from "@/components/Modules/StarMark";
import { Heart } from "lucide-react";
import { StorageImage } from "@/components/Base/StorageImage";
import { useFavoris } from "@/hooks/useFavoris";
import { useAuth } from "@/context/AuthContext";

export interface ServiceCardProvider {
    id: number;
    name: string;
    job: string;
    price: string;
    city: string;
    rating: number;
    nb_avis: number;
    avatarSrc: string | null;
    mainPhoto?: string | null;
    primary?: string;
    images: string[];
    isNew?: boolean;
}

interface EnhancedServiceCardProps {
    provider: ServiceCardProvider;
    href: string;
    onRemove?: (id: number) => void; // ← override du Heart pour la page favoris
}

export function ServiceCard({ provider, href, onRemove }: EnhancedServiceCardProps) {
    const {
        id,
        name,
        job,
        price,
        city,
        rating,
        nb_avis,
        avatarSrc,
        mainPhoto,
        primary = '#FFD359',
        images,
        isNew
    } = provider;

    const { user } = useAuth();
    const { isFavori, toggleFavori } = useFavoris(!!user);

    const heroImage = mainPhoto;
    const favori = onRemove ? true : isFavori(id); // toujours rouge si page favoris

    const handleHeartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onRemove) {
            onRemove(id);
        } else {
            toggleFavori(id);
        }
    };

    return (
        <Link href={href} className="block h-full">
            <Card hover className="overflow-hidden group border-none shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white cursor-pointer">
                <div className="relative">
                    <div className="h-48 w-full overflow-hidden bg-gray-50">
                        {heroImage ? (
                            <StorageImage
                                path={heroImage}
                                alt={job}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div
                                className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundColor: primary }}
                            />
                        )}
                    </div>

                    <div className="absolute top-3 left-3 flex gap-2">
                        {isNew && <Badge variant="primary" size="sm">Nouveau</Badge>}
                        <Badge variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm border-none shadow-sm font-bold text-gray-900">
                            {city}
                        </Badge>
                    </div>

                    <button
                        onClick={handleHeartClick}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-1
                            ${favori
                            ? 'bg-white text-red-500'
                            : 'bg-black/10 text-white hover:bg-white hover:text-red-500'
                        }`}
                    >
                        <Heart
                            size={18}
                            fill={favori ? 'currentColor' : 'none'}
                        />
                    </button>
                </div>

                <CardBody className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative w-12 h-12 flex-shrink-0">
                            <StorageImage
                                path={avatarSrc}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                                alt={name}
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <H4 className="leading-tight truncate">{name}</H4>
                            <Small className="text-primary font-bold uppercase tracking-tighter text-[10px]">{job}</Small>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[0, 1, 2].map((i) => {
                            const currentImg = images && images[i];
                            return (
                                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative">
                                    {currentImg ? (
                                        <StorageImage
                                            path={currentImg}
                                            alt="Réalisation"
                                            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primary}20` }}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <Divider className="mb-4 mt-auto opacity-50" />

                    <div className="flex items-center justify-between">
                        <StarMark variant="display" value={rating} nb_avis={nb_avis} size="sm" />
                        <Price className="text-lg font-black text-gray-900">{price}</Price>
                    </div>
                </CardBody>
            </Card>
        </Link>
    );
}