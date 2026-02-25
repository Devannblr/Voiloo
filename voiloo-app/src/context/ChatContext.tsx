'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getEcho } from '@/lib/echo';
import { apiService } from '@/services/apiService';

interface ChatContextType {
    conversations: any[];
    unreadTotal: number;
    refreshConversations: () => Promise<void>;
    markAsSeen: (conversationId: number) => void;
    loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated } = useAuth();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshConversations = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const data = await apiService.getConversations();
            // On s'assure que les données reçues sont bien un tableau
            setConversations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erreur rafraîchissement convs:", err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const markAsSeen = useCallback((conversationId: number) => {
        setConversations(prev => prev.map(conv =>
            conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        ));
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setConversations([]);
            return;
        }

        refreshConversations();

        const echo = getEcho();
        if (!echo) return;

        const userChannel = echo.private(`App.Models.User.${user.id}`);

        userChannel.listen('.MessageSent', (e: any) => {
            console.log("🔔 Nouveau message reçu globalement");

            /**
             * ✅ FIX : On ajoute un léger délai (300ms) avant de refresh.
             * Cela laisse le temps au Backend de finir de marquer le message
             * comme "sent" et de mettre à jour les compteurs avant qu'on ne les demande.
             */
            setTimeout(() => {
                refreshConversations();
            }, 300);
        });

        return () => {
            userChannel.stopListening('.MessageSent');
        };
    }, [isAuthenticated, user, refreshConversations]);

    /**
     * ✅ Calcul du total avec une sécurité parseInt
     */
    const unreadTotal = conversations.reduce((acc, conv) => {
        const count = parseInt(conv.unread_count) || 0;
        return acc + count;
    }, 0);

    return (
        <ChatContext.Provider value={{
            conversations,
            unreadTotal,
            refreshConversations,
            markAsSeen,
            loading
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within a ChatProvider");
    return context;
};