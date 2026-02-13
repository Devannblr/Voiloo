import React, { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    size?: InputSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3.5 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
                                                                   label,
                                                                   error,
                                                                   hint,
                                                                   size = 'md',
                                                                   leftIcon,
                                                                   rightIcon,
                                                                   className = '',
                                                                   id,
                                                                   type,
                                                                   required,
                                                                   ...props
                                                               }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    // État pour gérer la visibilité du mot de passe
    const [showPassword, setShowPassword] = useState(false);

    // Détection si c'est un champ mot de passe
    const isPassword = type === 'password';

    // On change dynamiquement le type de password à text
    const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };


    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className={`block text-sm font-medium text-dark mb-1.5 ${
                        required ? "after:content-['*'] after:ml-0.5 after:text-error" : ""
                    }`}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Icône à gauche */}
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    type={currentType}
                    className={`
                        w-full rounded-lg border bg-white text-dark
                        placeholder:text-gray-80
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                        disabled:bg-beige/30 disabled:cursor-not-allowed disabled:opacity-60
                        ${error ? 'border-error focus:ring-error' : 'border-beige hover:border-gray'}
                        ${leftIcon ? 'pl-10' : ''}
                        ${(rightIcon || isPassword) ? 'pr-10' : ''}
                        ${sizeStyles[size]}
                        ${className}
                    `}
                    {...props}
                />

                {/* Icône à droite (Priorité au bouton Password, sinon rightIcon classique) */}
                {isPassword ? (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-primary-dark focus:outline-none transition-colors "
                        aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                ) : (
                    rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray">
                            {rightIcon}
                        </div>
                    )
                )}
            </div>

            {/* Messages d'erreur ou d'aide */}
            {error ? (
                <p className="mt-1.5 text-sm text-error">{error}</p>
            ) : (
                hint && <p className="mt-1.5 text-sm text-gray">{hint}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';