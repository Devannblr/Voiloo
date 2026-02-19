// services/apiService.ts
import { apiFetch } from "@/lib/api";

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

export const apiService = {
    // --- CATEGORIES ---
    getCategories: () => apiFetch('/categories'),

    // --- UTILISATEURS ---
    getUser: () => apiFetch('/user'),

    // Vérification disponibilité Pseudo
    checkUsername: (cleanName: string) =>
        apiFetch(`/check-username/${cleanName}`),

    // ✅ Vérification disponibilité Email
    checkEmail: (email: string) =>
        apiFetch(`/check-email?email=${encodeURIComponent(email)}`),

    // --- ANNONCES ---
    getAnnonces: (categorySlug?: string) => {
        const endpoint = categorySlug ? `/annonces?category=${categorySlug}` : '/annonces';
        return apiFetch(endpoint);
    },

    getAnnonceBySlug: (userSlug: string, annonceSlug: string) =>
        apiFetch(`/annonces/${userSlug}/${annonceSlug}`),

    getAnnonce: (id: string | number) => apiFetch(`/annonces/${id}`),

    createAnnonce: (data: {
        titre: string;
        description: string;
        categorie_id: string | number;
        prix: string | number;
        ville: string;
        code_postal: string;
        disponibilites: string;
        couleur_principale?: string;
        couleur_texte?: string;
        couleur_fond?: string;
        lat?: number | null;
        lng?: number | null;
        photos?: File[];
    }) => {
        const formData = new FormData();
        formData.append('titre',          data.titre);
        formData.append('description',    data.description);
        formData.append('categorie_id',   String(data.categorie_id));
        formData.append('prix',           String(data.prix));
        formData.append('ville',          data.ville);
        formData.append('code_postal',    data.code_postal);
        formData.append('disponibilites', data.disponibilites);

        if (data.couleur_principale) formData.append('couleur_principale', data.couleur_principale);
        if (data.couleur_texte)      formData.append('couleur_texte',      data.couleur_texte);
        if (data.couleur_fond)       formData.append('couleur_fond',       data.couleur_fond);
        if (data.lat != null)        formData.append('lat',                String(data.lat));
        if (data.lng != null)        formData.append('lng',                String(data.lng));

        if (data.photos?.length) {
            data.photos.forEach(photo => formData.append('photos[]', photo));
        }

        return apiFetch('/annonces', { method: 'POST', body: formData });
    },

    // --- VITRINE / CONFIG ---
    getVitrineConfig: (userSlug: string, annonceSlug: string) =>
        apiFetch(`/annonces/${userSlug}/${annonceSlug}/vitrine`),

    /**
     * Mise à jour de la vitrine
     * Supporte à la fois un objet JSON ou un FormData (pour les images)
     */
    updateVitrineConfig: (annonceId: number | string, data: any) => {
        // Si c'est un FormData (cas de ton éditeur actuel avec photos)
        if (data instanceof FormData) {
            // Laravel nécessite souvent _method=PUT pour traiter les fichiers en multipart
            if (!data.has('_method')) {
                data.append('_method', 'PUT');
            }
            return apiFetch(`/vitrine/${annonceId}`, {
                method: 'POST', // Utilisation de POST + _method PUT pour les fichiers
                body: data,
                // On ne définit pas le Content-Type ici, le navigateur le fera avec le boundary
            });
        }

        // Si c'est un objet JSON simple
        return apiFetch(`/vitrine/${annonceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },

    updateAnnonce: (id: number | string, data: any) => {
        return apiFetch(`/annonces/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },
    // --- AUTH / MOT DE PASSE ---
    forgotPassword: (email: string) =>
        apiFetch('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    resetPassword: (data: any) =>
        apiFetch('/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};