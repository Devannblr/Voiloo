import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

type SelectSize = 'sm' | 'md' | 'lg';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    error?: string;
    hint?: string;
    size?: SelectSize;
    options: SelectOption[];
    placeholder?: string;
}

const sizeStyles: Record<SelectSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3.5 text-lg',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    hint,
    size = 'md',
    options,
    placeholder,
    className = '',
    id,
    ...props
}, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-dark mb-1.5"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    className={`
                        w-full rounded-lg border bg-white text-dark
                        appearance-none cursor-pointer
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                        disabled:bg-beige/30 disabled:cursor-not-allowed disabled:opacity-60
                        ${error ? 'border-error focus:ring-error' : 'border-beige hover:border-gray'}
                        ${sizeStyles[size]}
                        pr-10
                        ${className}
                    `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray">
                    <ChevronDown size={20} />
                </div>
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-error">{error}</p>
            )}
            {hint && !error && (
                <p className="mt-1.5 text-sm text-gray">{hint}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';
