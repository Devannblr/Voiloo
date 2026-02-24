import React, { forwardRef } from 'react';
import { Input } from '@/components/Base';
import { Search, MapPin } from 'lucide-react'; // Oublie pas d'importer les icônes

// --- TYPES ---
interface ValidatedInputProps extends Omit<React.ComponentProps<typeof Input>, 'error'> {
    value: string;
    showChecklist?: boolean;
}

interface DoubleSearchProps {
    whatValue: string;
    whereValue: string;
    onWhatChange: (val: string) => void;
    onWhereChange: (val: string) => void;
    onSearch?: () => void;
    className?: string;
}

// --- LOGIQUE DE VALIDATION & FORMATAGE ---

const getEmailError = (value: string) => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Adresse email invalide";
    return undefined;
};

const formatFrenchPhone = (value: string) => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('33')) digits = '0' + digits.substring(2);
    else if (digits.length > 0 && digits[0] !== '0') digits = '0' + digits;
    digits = digits.substring(0, 10);
    return digits.match(/.{1,2}/g)?.join(' ') || digits;
};

const getPhoneError = (value: string) => {
    if (!value) return undefined;
    const clean = value.replace(/\s/g, '');
    if (clean.length > 0 && clean.length < 10) return "Numéro incomplet";
    return undefined;
};

const getPasswordError = (val: string) => {
    if (!val) return undefined;
    if (val.length < 8) return "8 caractères min.";
    if (!/[A-Z]/.test(val)) return "Majuscule requise";
    if (!/\d/.test(val)) return "Chiffre requis";
    if (!/[!@#$%^&*(),.?":{}|<>-]/.test(val)) return "Symbole requis";
    return undefined;
};

// --- COMPOSANTS EXPORTÉS ---

export const MailInput = forwardRef<HTMLInputElement, ValidatedInputProps>((props, ref) => (
    <Input {...props} ref={ref} type="email" label={props.label || "Email"} error={getEmailError(props.value)} />
));

export const PasswordInput = forwardRef<HTMLInputElement, ValidatedInputProps>(({ showChecklist, ...props }, ref) => {
    const val = props.value || "";

    // Définition des critères
    const criteria = [
        { label: "8+ car.", met: val.length >= 8 },
        { label: "Maj.", met: /[A-Z]/.test(val) },
        { label: "Chiffre", met: /\d/.test(val) },
        { label: "Symbole", met: /[!@#$%^&*(),.?":{}|<>_-]/.test(val) },
    ];

    // Calcul du nombre de critères remplis
    const strengthScore = criteria.filter(c => c.met).length;

    // Déterminer la couleur globale en fonction du score
    const getStrengthColor = () => {
        if (strengthScore === 0) return 'bg-gray-200';
        if (strengthScore === 1) return 'bg-red-500';    // Très faible
        if (strengthScore === 2) return 'bg-orange-500'; // Faible
        if (strengthScore === 3) return 'bg-yellow-500'; // Moyen
        return 'bg-success';                            // Parfait (4/4)
    };

    const strengthColor = getStrengthColor();

    if (!showChecklist) return <Input {...props} ref={ref} type="password" label={props.label || "Mot de passe"} error={getPasswordError(val)} />;

    return (
        <div className="flex flex-col gap-2">
            <Input {...props} ref={ref} type="password" label={props.label || "Mot de passe"} />

            {/* Barre de progression visuelle */}
            <div className="flex gap-2 px-1">
                {criteria.map((c, i) => (
                    <div key={i} className="flex flex-col flex-1 gap-1">
                        {/* La couleur change pour TOUTES les barres remplies selon le score global */}
                        <div className={`h-1 rounded-full transition-all duration-500 ${c.met ? strengthColor : 'bg-gray-200'}`} />
                        <span className={`text-[10px] uppercase font-bold tracking-tighter transition-colors duration-500 ${c.met ? strengthColor.replace('bg-', 'text-') : 'text-gray-400'}`}>
                            {c.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
});
export const PhoneInput = forwardRef<HTMLInputElement, ValidatedInputProps>(({ onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (raw !== '+') e.target.value = formatFrenchPhone(raw);
        if (onChange) onChange(e);
    };
    return (
        <Input {...props} ref={ref} type="tel" label={props.label || "Téléphone"} value={value} onChange={handleChange} error={getPhoneError(value)}
               leftIcon={<div className="flex items-center gap-2 pr-2 h-5"><span className="text-base leading-none">🇫🇷</span></div>}
        />
    );
});

// LE NOUVEAU : DOUBLE SEARCH
export const DoubleSearchInput = ({ whatValue, whereValue, onWhatChange, onWhereChange, onSearch, className = "" }: DoubleSearchProps) => {
    return (
        <div className={`flex flex-col md:flex-row items-center bg-white rounded-2xl border border-beige p-1 gap-1 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all ${className}`}>
            <div className="flex items-center flex-1 w-full px-3 gap-2">
                <Search size={20} className="text-gray-400" />
                <input type="text" value={whatValue} onChange={(e) => onWhatChange(e.target.value)} placeholder="Que cherchez-vous ?" className="w-full py-3 bg-transparent focus:outline-none text-dark" />
            </div>
            <div className="hidden md:block w-[1px] h-8 bg-beige-dark mx-2" />
            <div className="flex items-center flex-1 w-full px-3 gap-2 border-t md:border-t-0 border-beige pt-2 md:pt-0">
                <MapPin size={20} className="text-gray-400" />
                <input type="text" value={whereValue} onChange={(e) => onWhereChange(e.target.value)} placeholder="Où ?" className="w-full py-3 bg-transparent focus:outline-none text-dark" />
            </div>
            {onSearch && (
                <button onClick={onSearch} className="w-full md:w-auto px-6 py-3 bg-primary text-dark font-bold rounded-xl hover:bg-primary-dark transition-colors">
                    Trouver
                </button>
            )}
        </div>
    );
};

// Noms d'affichage pour le debug React
MailInput.displayName = 'MailInput';
PasswordInput.displayName = 'PasswordInput';
PhoneInput.displayName = 'PhoneInput';
DoubleSearchInput.displayName = 'DoubleSearchInput';