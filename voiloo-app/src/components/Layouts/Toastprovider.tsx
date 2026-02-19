'use client';

/**
 * ToastProvider — Voiloo Notification System
 *
 * Usage dans layout.tsx :
 *   import { ToastProvider } from '@/components/Modules/ToastProvider';
 *   <ToastProvider>{children}</ToastProvider>
 *
 * Usage partout dans l'app :
 *   import { useToast } from '@/components/Modules/ToastProvider';
 *   const { toast } = useToast();
 *   toast.success('Annonce sauvegardée !');
 *   toast.error('Erreur réseau, réessayez.');
 *   toast.info('Nouvelle mise à jour disponible.');
 *   toast.warning('Session bientôt expirée.');
 *
 * Usage avec l'helper fetchWithToast :
 *   const data = await fetchWithToast(
 *     () => apiService.getAnnonce(slug),
 *     { errorMessage: 'Impossible de charger l'annonce' }
 *   );
 */

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
    ReactNode,
} from 'react';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
    WifiOff,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'network';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    description?: string;
    duration?: number; // ms — 0 = sticky
}

interface ToastContextValue {
    toast: {
        success: (message: string, description?: string) => void;
        error:   (message: string, description?: string) => void;
        warning: (message: string, description?: string) => void;
        info:    (message: string, description?: string) => void;
        network: (message?: string) => void;
    };
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}

// ─────────────────────────────────────────────
// Config visuelle
// ─────────────────────────────────────────────

const CONFIG: Record<ToastType, {
    icon: ReactNode;
    border: string;
    bg: string;
    iconColor: string;
    label: string;
}> = {
    success: {
        icon: <CheckCircle2 size={18} />,
        border: 'border-green-200',
        bg: 'bg-green-50',
        iconColor: 'text-green-500',
        label: 'Succès',
    },
    error: {
        icon: <XCircle size={18} />,
        border: 'border-red-200',
        bg: 'bg-red-50',
        iconColor: 'text-red-500',
        label: 'Erreur',
    },
    warning: {
        icon: <AlertTriangle size={18} />,
        border: 'border-yellow-200',
        bg: 'bg-yellow-50',
        iconColor: 'text-yellow-500',
        label: 'Attention',
    },
    info: {
        icon: <Info size={18} />,
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        label: 'Info',
    },
    network: {
        icon: <WifiOff size={18} />,
        border: 'border-gray-200',
        bg: 'bg-gray-50',
        iconColor: 'text-gray-500',
        label: 'Réseau',
    },
};

const DEFAULT_DURATION: Record<ToastType, number> = {
    success: 3500,
    error:   6000,
    warning: 5000,
    info:    4000,
    network: 7000,
};

// ─────────────────────────────────────────────
// Single Toast Item
// ─────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const cfg = CONFIG[toast.type];
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [progress, setProgress] = useState(100);
    const [visible, setVisible] = useState(false);

    const dismiss = useCallback(() => {
        setVisible(false);
        setTimeout(() => onDismiss(toast.id), 300);
    }, [toast.id, onDismiss]);

    useEffect(() => {
        // Entrée
        requestAnimationFrame(() => setVisible(true));

        const duration = toast.duration ?? DEFAULT_DURATION[toast.type];
        if (duration === 0) return;

        // Progress bar
        const interval = 50;
        const steps = duration / interval;
        let current = steps;
        const progressTimer = setInterval(() => {
            current--;
            setProgress((current / steps) * 100);
            if (current <= 0) clearInterval(progressTimer);
        }, interval);

        timerRef.current = setTimeout(dismiss, duration);

        return () => {
            clearTimeout(timerRef.current!);
            clearInterval(progressTimer);
        };
    }, []);

    return (
        <div
            className={`
                relative overflow-hidden flex items-start gap-3
                w-full max-w-sm rounded-2xl border-2 shadow-lg
                p-4 pr-10 cursor-pointer
                transition-all duration-300 ease-out
                ${cfg.border} ${cfg.bg}
                ${visible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-2 scale-95'}
            `}
            onClick={dismiss}
            role="alert"
        >
            {/* Icône */}
            <span className={`mt-0.5 shrink-0 ${cfg.iconColor}`}>
                {cfg.icon}
            </span>

            {/* Texte */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                    {toast.message}
                </p>
                {toast.description && (
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {toast.description}
                    </p>
                )}
            </div>

            {/* Bouton fermer */}
            <button
                onClick={(e) => { e.stopPropagation(); dismiss(); }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
            >
                <X size={15} />
            </button>

            {/* Barre de progression */}
            {(toast.duration ?? DEFAULT_DURATION[toast.type]) > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
                    <div
                        className={`h-full transition-none ${cfg.iconColor.replace('text-', 'bg-')}`}
                        style={{ width: `${progress}%`, opacity: 0.6 }}
                    />
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Provider + Container
// ─────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const add = useCallback((type: ToastType, message: string, description?: string, duration?: number) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, type, message, description, duration }]);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg: string, desc?: string) => add('success', msg, desc),
        error:   (msg: string, desc?: string) => add('error', msg, desc),
        warning: (msg: string, desc?: string) => add('warning', msg, desc),
        info:    (msg: string, desc?: string) => add('info', msg, desc),
        network: (msg = 'Connexion perdue. Vérifiez votre réseau.') =>
            add('network', msg, 'La requête a échoué — réessayez dans quelques instants.'),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Portal-like fixed container */}
            <div
                className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
                aria-live="polite"
            >
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto w-full max-w-sm">
                        <ToastItem toast={t} onDismiss={dismiss} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// ─────────────────────────────────────────────
// Helper : fetchWithToast
// ─────────────────────────────────────────────
//
// Wrape un appel API et affiche automatiquement
// un toast d'erreur en cas d'échec.
//
// Exemple :
//   const data = await fetchWithToast(
//     () => apiService.getAnnonce(slug),
//     { successMessage: 'Chargé !', errorMessage: 'Impossible de charger' }
//   );


type FetchWithToastOptions = {
    successMessage?: string;
    errorMessage?: string;
    networkOnly?: boolean; // n'affiche que les erreurs réseau (fetch failed)
};

export async function fetchWithToast<T>(
    fn: () => Promise<T>,
    options: FetchWithToastOptions = {},
    toastRef: ToastContextValue['toast'],
): Promise<T | null> {
    try {
        const result = await fn();
        if (options.successMessage) {
            toastRef.success(options.successMessage);
        }
        return result;
    } catch (err: any) {
        const isNetwork = !navigator.onLine || err?.message === 'Failed to fetch';

        if (isNetwork) {
            toastRef.network();
        } else if (!options.networkOnly) {
            toastRef.error(
                options.errorMessage || 'Une erreur est survenue',
                err?.message || undefined,
            );
        }
        return null;
    }
}