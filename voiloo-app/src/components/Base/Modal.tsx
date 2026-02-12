'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: ModalSize;
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    className?: string;
}

interface ModalHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
};

export const Modal = ({
    isOpen,
    onClose,
    children,
    title,
    size = 'md',
    closeOnOverlay = true,
    closeOnEscape = true,
    showCloseButton = true,
    className = '',
}: ModalProps) => {
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') {
            onClose();
        }
    }, [closeOnEscape, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
                onClick={closeOnOverlay ? onClose : undefined}
            />

            {/* Modal */}
            <div
                className={`
                    relative w-full bg-white rounded-2xl shadow-xl
                    animate-in fade-in zoom-in-95 duration-200
                    ${sizeStyles[size]}
                    ${className}
                `}
            >
                {/* Header with title and close button */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                        {title && (
                            <h2
                                id="modal-title"
                                className="text-xl font-bold text-dark"
                            >
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-lg text-gray hover:text-dark hover:bg-beige/50 transition-colors"
                                aria-label="Fermer"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                {children}
            </div>
        </div>
    );

    if (typeof window === 'undefined') return null;

    return createPortal(modalContent, document.body);
};

export const ModalHeader = ({ children, className = '' }: ModalHeaderProps) => (
    <div className={`px-6 pt-6 pb-2 ${className}`}>
        {children}
    </div>
);

export const ModalBody = ({ children, className = '' }: ModalBodyProps) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

export const ModalFooter = ({ children, className = '' }: ModalFooterProps) => (
    <div className={`px-6 pt-2 pb-6 flex items-center justify-end gap-3 ${className}`}>
        {children}
    </div>
);
