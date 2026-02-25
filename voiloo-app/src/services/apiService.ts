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

    checkUsername: (cleanName: string) =>
        apiFetch(`/check-username/${cleanName}`),

    checkEmail: (email: string) =>
        apiFetch(`/check-email?email=${encodeURIComponent(email)}`),

    // --- RECHERCHE GLOBALE / SUGGESTIONS ---
    getSuggestions: (query: string) =>
        apiFetch(`/search/suggestions?query=${encodeURIComponent(query)}`),

    // --- ANNONCES ---
    // Pour la carte de la HeroSection
    getMapPoints: () => apiFetch('/annonces/map'),

    // Pour la FreelanceGrid de l'accueil
    getRecommendedAnnonces: (city?: string) => {
        const url = city
            ? `/annonces/recommended?city=${encodeURIComponent(city)}`
            : '/annonces/recommended';
        return apiFetch(url);
    },

    getAnnonces: (params?: {
        category?: string;
        city?: string;
        query?: string;
        sort?: string;
        lat?: string;
        lng?: string;
        radius?: string;
    }) => {
        const query = new URLSearchParams();
        if (params?.category) query.append('category', params.category);
        if (params?.city)     query.append('city', params.city);
        if (params?.query)    query.append('query', params.query);
        if (params?.sort)     query.append('sort', params.sort);
        if (params?.lat)      query.append('lat', params.lat);
        if (params?.lng)      query.append('lng', params.lng);
        if (params?.radius)   query.append('radius', params.radius);
        return apiFetch(`/annonces?${query.toString()}`);
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

    getUserByUsername: (username: string) =>
        apiFetch(`/users/${username}`),

    deleteAnnonce: (id: number | string) =>
        apiFetch(`/annonces/${id}`, { method: 'DELETE' }),

    // --- VITRINE / CONFIG ---
    getVitrineConfig: (userSlug: string, annonceSlug: string) =>
        apiFetch(`/annonces/${userSlug}/${annonceSlug}/vitrine`),

    updateVitrineConfig: (annonceId: number | string, data: any) => {
        if (data instanceof FormData) {
            if (!data.has('_method')) {
                data.append('_method', 'PUT');
            }
            return apiFetch(`/vitrine/${annonceId}`, {
                method: 'POST',
                body: data,
            });
        }

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


    // --- FAVORIS ---
    getFavorisIds: () => apiFetch('/favoris/ids'),

    getFavoris: () => apiFetch('/favoris'),

    toggleFavori: (annonceId: number) =>
        apiFetch(`/favoris/${annonceId}`, { method: 'POST' }),

    // --- MESSAGES ---
    getConversations: () =>
        apiFetch('/conversations'),

    getMessages: (conversationId: number) =>
        apiFetch(`/conversations/${conversationId}/messages`),

    markAsRead: (conversationId: number) =>
        apiFetch(`/conversations/${conversationId}/read`, { method: 'POST' }),

    startConversation: (data: { recipient_id: number; body: string; annonce_id?: number }) =>
        apiFetch('/conversations', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    sendMessage: (conversationId: number, body: string) =>
        apiFetch(`/conversations/${conversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ body }),
        }),

    sendTyping: (conversationId: number) =>
        apiFetch(`/conversations/${conversationId}/typing`, { method: 'POST' }),

    getUnreadCount: () =>
        apiFetch('/messages/unread-count'),

    /**
     * Supprime un message spécifique
     */
    deleteMessage: (messageId: number) =>
        apiFetch(`/messages/${messageId}`, { method: 'DELETE' }),

    /**
     * Supprime une conversation entière
     */
    deleteConversation: (conversationId: number) =>
        apiFetch(`/conversations/${conversationId}`, { method: 'DELETE' }),

};