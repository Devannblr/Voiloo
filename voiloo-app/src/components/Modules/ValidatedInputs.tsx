import React, { forwardRef } from 'react';
import { Input } from '@/components/Base';

// --- TYPES ---
interface ValidatedInputProps extends Omit<React.ComponentProps<typeof Input>, 'error'> {
    value: string;
}

// --- LOGIQUE DE VALIDATION (INTERNE) ---
const getEmailError = (value: string) => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Adresse email invalide";
    return undefined;
};

const getPasswordError = (value: string) => {
    if (!value) return undefined;
    if (value.length < 8) return "Minimum 8 caractères";
    if (!/[A-Z]/.test(value)) return "Ajoutez une majuscule";
    if (!/\d/.test(value)) return "Ajoutez un chiffre";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Ajoutez un symbole";
    return undefined;
};

// --- EXPORTS DES COMPOSANTS ---

export const MailInput = forwardRef<HTMLInputElement, ValidatedInputProps>((props, ref) => (
    <Input
        {...props}
        ref={ref}
        type="email"
        label={props.label || "Email"}
        placeholder={props.placeholder || "exemple@mail.com"}
        error={getEmailError(props.value)}
    />
));
MailInput.displayName = 'MailInput';

export const PasswordInput = forwardRef<HTMLInputElement, ValidatedInputProps>((props, ref) => (
    <Input
        {...props}
        ref={ref}
        type="password"
        label={props.label || "Mot de passe"}
        error={getPasswordError(props.value)}
        hint={props.hint || "8+ car., Maj., Chiffre et Symbole"}
    />
));
PasswordInput.displayName = 'PasswordInput';