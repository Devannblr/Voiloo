export interface ParcoursItem { year?: string; title?: string; description?: string; }
export interface ServiceItem  { name?: string; titre?: string; price?: string; prix?: string; description?: string; }

export interface VitrineConfig {
    couleur_principale?: string;
    couleur_texte?: string;
    couleur_fond?: string;
    slogan?: string;
    header_photo?: string;
    instagram?: string; linkedin?: string; facebook?: string; twitter?: string; site_web?: string;
    show_contact_form?: boolean;
    sections?: {
        about?: string;
        parcours?: ParcoursItem[] | string;
        services?: ServiceItem[];
        portfolio?: string[];
        portfolio_note?: string;
    };
}
export interface Avis {
    id: number;
    note: number;
    commentaire: string;
    auteur_id: number;
    created_at: string;
    user?: {
        name: string;
        username: string;
        avatar?: string;
    };
}
export interface Annonce {
    id: number;
    user?: {
        id: number;
        email: string;
        username?: string;
    };
    titre: string;
    ville: string;
    code_postal: string;
    prix: number;
    user_id: number;
    categorie?: { nom: string };
    images?: { id: number; path: string }[];
    avis?: Avis[];
}