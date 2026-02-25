import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        // On change le type ici pour Pusher
        Echo?: Echo<'pusher'>;
    }
}

// On définit le type de l'instance avec 'pusher'
let echoInstance: Echo<'pusher'> | null = null;

export function getEcho(): Echo<'pusher'> | null {
    // Si déjà initialisé, on retourne l'instance
    if (echoInstance) {
        return echoInstance;
    }

    const token = typeof window !== 'undefined'
        ? localStorage.getItem('voiloo_token')
        : null;

    if (!token) {
        return null;
    }

    if (typeof window !== 'undefined') {
        window.Pusher = Pusher;
    }

    console.log('✅ Initializing Echo with Pusher');

    // On passe l'argument de type 'pusher' à l'instanciation
    echoInstance = new Echo<'pusher'>({
        broadcaster: 'pusher',
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
        cluster: 'eu',
        forceTLS: true,
        authEndpoint: process.env.NEXT_PUBLIC_REVERB_AUTH_URL ?? 'http://localhost:8000/api/broadcasting/auth',
        auth: {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        },
    });

    return echoInstance;
}

export function disconnectEcho(): void {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
        console.log('🔌 Echo disconnected');
    }
}

export function reconnectEcho(): Echo<'pusher'> | null {
    disconnectEcho();
    return getEcho();
}