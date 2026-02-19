'use client';

import React, { useMemo } from 'react';

interface StorageImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    path: string | File | null | undefined;
}

export function StorageImage({ path, alt = '', className, ...props }: StorageImageProps) {
    const src = useMemo(() => {
        if (!path) return '';

        // 1. Si c'est un fichier local (objet File via upload)
        if (path instanceof File) {
            return URL.createObjectURL(path);
        }

        // 2. Si c'est déjà une URL complète (ex: http://...)
        if (typeof path === 'string' && path.startsWith('http')) {
            return path;
        }

        // 3. Construction via la variable STORAGE définie dans le .env
        // Note: NEXT_PUBLIC_STORAGE_URL vaut déjà "https://voiloo.fr/back/public/storage"
        const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || '';

        // Nettoyage des slashes pour éviter les doubles slashes "//"
        const cleanBaseUrl = storageBaseUrl.endsWith('/') ? storageBaseUrl.slice(0, -1) : storageBaseUrl;

        // On retire "storage/" ou "/" au début du path s'il existe,
        // car storageBaseUrl contient déjà le dossier storage.
        let cleanPath = typeof path === 'string' ? path : '';
        cleanPath = cleanPath.replace(/^(storage\/|\/storage\/|\/)/, '');

        return `${cleanBaseUrl}/${cleanPath}`;
    }, [path]);

    if (!src) return null;

    // Nettoyage de l'URL mémoire lors du démontage du composant pour éviter les fuites (uniquement pour les File)
    React.useEffect(() => {
        return () => {
            if (src.startsWith('blob:')) {
                URL.revokeObjectURL(src);
            }
        };
    }, [src]);

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            {...props}
        />
    );
}