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
    };
}

export interface Annonce {
    titre: string;
    ville: string;
    code_postal: string;
    prix: number;
    user_id: number;
    categorie?: { nom: string };
}