import React, { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: React.ReactNode;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
    label,
    error,
    className = '',
    id,
    ...props
}, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
        <div className={`flex flex-col ${className}`}>
            <label className="group inline-flex items-center gap-2 cursor-pointer">
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={checkboxId}
                        className="peer sr-only"
                        {...props}
                    />
                    <div
                        className={`
                            w-5 h-5 rounded border-2 transition-all duration-200
                            flex items-center justify-center
                            peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2
                            peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                            ${error
                                ? 'border-error'
                                : 'border-beige group-hover:border-gray peer-checked:border-primary peer-checked:bg-primary'
                            }
                        `}
                    />
                    <Check
                        className="absolute inset-0 m-auto w-3.5 h-3.5 text-dark opacity-0 peer-checked:opacity-100 transition-opacity"
                        strokeWidth={3}
                    />
                </div>
                {label && (
                    <span className="text-sm text-dark select-none">{label}</span>
                )}
            </label>
            {error && (
                <p className="mt-1 text-sm text-error">{error}</p>
            )}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
    label,
    className = '',
    id,
    ...props
}, ref) => {
    const generatedId = useId();
    const radioId = id || generatedId;

    return (
        <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
            <div className="relative">
                <input
                    ref={ref}
                    type="radio"
                    id={radioId}
                    className="peer sr-only"
                    {...props}
                />
                <div
                    className={`
                        w-5 h-5 rounded-full border-2 transition-all duration-200
                        peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2
                        peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                        border-beige peer-hover:border-gray peer-checked:border-primary
                    `}
                />
                <div
                    className={`
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-2.5 h-2.5 rounded-full bg-primary
                        scale-0 peer-checked:scale-100 transition-transform duration-200
                    `}
                />
            </div>
            {label && (
                <span className="text-sm text-dark select-none">{label}</span>
            )}
        </label>
    );
});

Radio.displayName = 'Radio';
