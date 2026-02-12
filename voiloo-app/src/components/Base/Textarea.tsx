import React, { forwardRef, useId } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    label,
    error,
    hint,
    className = '',
    id,
    rows = 4,
    ...props
}, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-dark mb-1.5"
                >
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                className={`
                    w-full rounded-lg border bg-white text-dark
                    px-4 py-2.5 text-base
                    placeholder:text-gray-80
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                    disabled:bg-beige/30 disabled:cursor-not-allowed disabled:opacity-60
                    resize-y min-h-[100px]
                    ${error ? 'border-error focus:ring-error' : 'border-beige hover:border-gray'}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-error">{error}</p>
            )}
            {hint && !error && (
                <p className="mt-1.5 text-sm text-gray">{hint}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';
