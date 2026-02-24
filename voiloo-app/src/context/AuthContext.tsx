'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiService } from '@/services/apiService';

interface AuthContextType {
    user: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: any) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        // On nettoie tout
        localStorage.removeItem('voiloo_token');
        document.cookie = "voiloo_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        setUser(null);

        // On ne redirige que si nécessaire pour éviter les boucles infinies en dev
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = "/login";
        }
    }, []);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('voiloo_token');

        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const data = await apiService.getUser();
            setUser(data);
        } catch (err: any) {
            console.error("Erreur de récupération utilisateur", err);

            // ✅ CRITIQUE : On ne déconnecte QUE si c'est une erreur 401 (Non autorisé)
            // Si c'est une erreur 500 ou réseau, on garde l'état actuel pour éviter de vider la session
            if (err.status === 401 || err.response?.status === 401) {
                logout();
            }
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = (token: string, userData: any) => {
        localStorage.setItem('voiloo_token', token);
        // On définit voiloo_token pour matcher ton middleware
        document.cookie = `voiloo_token=${token}; path=/; max-age=604800; SameSite=Lax`;
        setUser(userData);
    };

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
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};