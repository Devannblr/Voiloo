'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
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

    const refreshUser = async () => {
        const token = localStorage.getItem('voiloo_token');
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const data = await apiService.getUser();
            setUser(data);
        } catch (err) {
            console.error("Erreur de récupération utilisateur", err);
            logout(); // Si le token est invalide/expiré
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = (token: string, userData: any) => {
        localStorage.setItem('voiloo_token', token);
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('voiloo_token');
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        setUser(null);
        window.location.href = "/login";
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