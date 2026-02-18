import { apiFetch } from "@/lib/api";

export const apiService = {
    getCategories: () => apiFetch('/categories'),
    getUser: () => apiFetch('/user'),
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
        // Couleurs vitrine initiales
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

    // Récupère la config vitrine d'une annonce (lecture publique)
    getVitrineConfig: (userSlug: string, annonceSlug: string) =>
        apiFetch(`/annonces/${userSlug}/${annonceSlug}/vitrine`),

    // Met à jour la config vitrine (authentifié, propriétaire)
    updateVitrineConfig: (annonceId: number | string, data: {
        couleur_principale?: string;
        couleur_texte?: string;
        couleur_fond?: string;
        template?: 'default' | 'minimal' | 'bold' | 'elegant';
        options?: Record<string, unknown>;
    }) =>
        apiFetch(`/vitrine/${annonceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),
};