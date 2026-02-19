'use client';

import React from 'react';
import {
    Card,
    CardBody,
    CardImage,
    H4,
    Small,
    Price,
    Badge,
    Avatar,
    Divider
} from '@/components/Base';
import { StarMark } from "@/components/Modules/StarMark";
import { Heart } from "lucide-react";

export interface ServiceCardProvider {
    name: string;
    job: string;
    price: string;
    city: string;
    rating: number;
    nb_avis: number;
    avatarSrc: string | null;
    images: string[];
    isNew?: boolean;
}

interface EnhancedServiceCardProps {
    provider: ServiceCardProvider;
}

const STORAGE_BASE = process.env.NEXT_PUBLIC_STORAGE_URL
    ? process.env.NEXT_PUBLIC_STORAGE_URL.replace(/\/+$/, '')
    : 'http://localhost:8000/storage';

export function ServiceCard({ provider }: EnhancedServiceCardProps) {
    const {
        name,
        job,
        price,
        city,
        rating,
        nb_avis,
        avatarSrc,
        images,
        isNew
    } = provider;

    // On s'assure que la fonction renvoie toujours une string pour TS
    const getFullUrl = (path: string | null | undefined): string => {
        if (!path) return "/api/placeholder/400/300"; // Fallback par défaut
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/^(storage\/|\/storage\/|\/)/, '');
        return `${STORAGE_BASE}/${cleanPath}`;
    };

    return (
        <Card hover className="overflow-hidden group border-none shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
            <div className="relative">
                {/* Correction TS2322 :
                   On utilise getFullUrl qui garantit une string désormais
                */}
                <CardImage
                    src={getFullUrl(images && images[0])}
                    alt={job}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex gap-2">
                    {isNew && <Badge variant="primary" size="sm">Nouveau</Badge>}
                    <Badge variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm border-none shadow-sm font-bold text-gray-900">
                        {city}
                    </Badge>
                </div>
                <button className="absolute top-3 right-3 p-2 rounded-full bg-black/10 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all duration-200">
                    <Heart size={18} />
                </button>
            </div>

            <CardBody className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                    {/* Fallback géré ici aussi pour l'Avatar */}
                    <Avatar
                        src={avatarSrc ? getFullUrl(avatarSrc) : undefined}
                        name={name}
                        size="md"
                        status="online"
                    />
                    <div className="flex-1 min-w-0">
                        <H4 className="leading-tight truncate">{name}</H4>
                        <Small className="text-primary font-bold uppercase tracking-tighter text-[10px]">{job}</Small>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative">
                            {images && images[i + 1] ? (
                                <img
                                    src={getFullUrl(images[i + 1])}
                                    alt="Réalisation"
                                    className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <Divider className="mb-4 mt-auto opacity-50" />

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <StarMark variant="display" value={rating} nb_avis={nb_avis} size="sm" />
                    </div>
                    <div className="text-right">
                        <Price className="text-lg font-black text-gray-900">{price}</Price>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}