'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    avatar: string | null;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            // ✅ Utilise /me qui retourne { user: {...} }
            const data = await apiFetch('/me');
            setUser(data.user);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
            // ✅ Nettoyer le token si invalide
            localStorage.removeItem('voiloo_token');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await apiFetch('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            // ✅ CRITIQUE : Stocker le token pour Echo/Reverb
            if (response.access_token) {
                localStorage.setItem('voiloo_token', response.access_token);
            }

            // ✅ Le cookie HttpOnly est automatiquement défini par Laravel
            // On récupère maintenant l'utilisateur complet
            await refreshUser();
        } catch (err) {
            throw err;
        }
    }, [refreshUser]);

    const logout = useCallback(async () => {
        try {
            await apiFetch('/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // ✅ Nettoyer TOUT : token + state
            localStorage.removeItem('voiloo_token');
            setUser(null);

            // ✅ Rediriger vers login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }, []);

    // ✅ Au montage : vérifier si un token existe
    useEffect(() => {
        const token = localStorage.getItem('voiloo_token');
        if (token) {
            // Token existe → récupérer l'user
            refreshUser();
        } else {
            // Pas de token → pas authentifié
            setIsLoading(false);
        }
    }, [refreshUser]);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};