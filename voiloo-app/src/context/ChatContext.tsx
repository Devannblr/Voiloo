'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { getEcho } from '@/lib/echo';
import { apiService } from '@/services/apiService';

interface ChatContextType {
    conversations: any[];
    unreadTotal: number;
    refreshConversations: () => Promise<void>;
    markAsSeen: (conversationId: number) => void;
    loading: boolean;
    activeConversationId: number | null;
    setActiveConversationId: (id: number | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated } = useAuth();
    const pathname = usePathname();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

    const refreshConversations = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const data = await apiService.getConversations();
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

    // ✅ Reset activeConversationId quand on quitte /messages
    useEffect(() => {
        if (pathname !== '/messages') {
            console.log('🔄 Quitte /messages, reset activeConversationId');
            setActiveConversationId(null);
        }
    }, [pathname]);

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
            console.log("📍 Pathname:", pathname);
            console.log("🎯 Conversation active:", activeConversationId);
            console.log("📨 Message dans conversation:", e.message?.conversation_id);

            // ✅ Refresh SAUF si le message arrive dans la conversation actuellement ouverte
            const isInActiveConversation =
                pathname === '/messages' &&
                activeConversationId !== null &&
                e.message?.conversation_id === activeConversationId;

            if (!isInActiveConversation) {
                console.log("♻️ Refresh des conversations");
                setTimeout(() => {
                    refreshConversations();
                }, 300);
            } else {
                console.log("⏭️ Message dans conversation active, skip refresh");
            }
        });

        return () => {
            userChannel.stopListening('.MessageSent');
        };
    }, [isAuthenticated, user, refreshConversations, pathname, activeConversationId]);

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
            loading,
            activeConversationId,
            setActiveConversationId
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