'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { apiService } from '@/services/apiService';
import { getEcho } from '@/lib/echo';
import {
    Container,
    Card,
    Loader,
    Avatar,
    P,
    Small,
    IconButton,
    Divider,
    TextAccent,
    Badge
} from '@/components/Base';
import { ArrowLeft, MoreVertical, MessageSquare, Trash2 } from 'lucide-react';

import { ConversationList } from '@/components/Messages/ConversationList';
import { MessageBubble } from '@/components/Messages/MessageBubble';
import { ChatInput } from '@/components/Messages/ChatInput';

export default function MessagesPage() {
    const { user, isLoading } = useAuth();
    const { conversations, refreshConversations, markAsSeen } = useChat();
    const searchParams = useSearchParams();

    const [activeConv, setActiveConv] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [typingName, setTypingName] = useState<string | null>(null);
    const [loadingMsgs, setLoadingMsgs] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const typingTimer = useRef<NodeJS.Timeout | null>(null);
    const lastTypingSent = useRef<number>(0);
    const echoChannel = useRef<any>(null);
    const activeConvIdRef = useRef<number | null>(null);

    useEffect(() => {
        activeConvIdRef.current = activeConv?.id || null;
    }, [activeConv]);

    // --- SUPPRESSION ---
    const handleDeleteMessage = async (messageId: number) => {
        // Note: On pourrait utiliser ta Modal ici pour plus de style
        if (!confirm('Supprimer ce message ?')) return;
        try {
            await apiService.deleteMessage(messageId);
            setMessages(prev => prev.filter(m => m.id !== messageId));
        } catch (error) {
            console.error("Erreur suppression message");
        }
    };

    const handleDeleteConversation = async () => {
        if (!activeConv?.id) return;
        if (!confirm('Supprimer toute la discussion ?')) return;

        try {
            await apiService.deleteConversation(activeConv.id);
            setActiveConv(null);
            refreshConversations();
        } catch (error) {
            console.error("Erreur suppression conversation");
        }
    };

    // --- FONCTION D'OUVERTURE ---
    const openConversation = useCallback(async (conv: any) => {
        if (echoChannel.current) {
            echoChannel.current.stopListening('.MessageSent');
        }

        setActiveConv(conv);
        setMessages([]);

        if (!conv.id) {
            setLoadingMsgs(false);
            return;
        }

        setLoadingMsgs(true);
        markAsSeen(conv.id);

        try {
            apiService.markAsRead(conv.id).catch(() => {});
            const msgs = await apiService.getMessages(conv.id);
            setMessages(msgs);

            const echo = getEcho();
            if (echo) {
                echoChannel.current = echo.private(`conversation.${conv.id}`);
                echoChannel.current
                    .listen('.MessageSent', (e: any) => {
                        if (e.message.sender_id === user?.id) return;
                        setMessages(prev => {
                            if (prev.find(m => m.id === e.message.id)) return prev;
                            return [...prev, e.message];
                        });
                        if (activeConvIdRef.current === conv.id) {
                            apiService.markAsRead(conv.id).catch(() => {});
                            markAsSeen(conv.id);
                            echoChannel.current.whisper('seen', { user_id: user?.id });
                        }
                    })
                    .listenForWhisper('typing', (e: any) => {
                        setTypingName(e.name);
                        if (typingTimer.current) clearTimeout(typingTimer.current);
                        typingTimer.current = setTimeout(() => setTypingName(null), 3000);
                    });
            }
        } catch (error) {
            console.error("Erreur messages:", error);
        } finally {
            setLoadingMsgs(false);
        }
    }, [user?.id, markAsSeen]);

    // --- LOGIQUE AUTO-OUVERTURE ---
    useEffect(() => {
        if (isLoading || conversations.length === 0) return;
        const urlAnnonceId = searchParams.get('annonce_id');
        const urlUserId = searchParams.get('user_id');
        if (!urlAnnonceId && !urlUserId) return;

        const existing = conversations.find(c => {
            const matchAnnonce = urlAnnonceId && String(c.annonce_id) === String(urlAnnonceId);
            const matchUser = urlUserId && String(c.other_user?.id) === String(urlUserId);
            return matchAnnonce || matchUser;
        });

        if (existing) {
            if (activeConv?.id !== existing.id) openConversation(existing);
        } else if (!activeConv && urlUserId) {
            const initNewChat = async () => {
                try {
                    const res = await apiService.getUserById(urlUserId);
                    setActiveConv({
                        id: null,
                        is_temp: true,
                        other_user: res || { id: urlUserId, name: "Prestataire" },
                        annonce: urlAnnonceId ? { id: urlAnnonceId, titre: "Nouveau message" } : null
                    });
                } catch (e) {
                    setActiveConv({
                        id: null,
                        is_temp: true,
                        other_user: { id: urlUserId, name: "Prestataire" },
                        annonce: urlAnnonceId ? { id: urlAnnonceId } : null
                    });
                }
            };
            initNewChat();
        }
    }, [searchParams, conversations, isLoading, openConversation, activeConv?.id]);

    const sendMessage = async () => {
        if (!input.trim() || !activeConv || sending) return;
        const body = input.trim();
        setInput('');
        setSending(true);
        try {
            if (activeConv.id === null) {
                await apiService.sendMessageToUser(activeConv.other_user.id, body, activeConv.annonce?.id);
                await refreshConversations();
            } else {
                const response = await apiService.sendMessage(activeConv.id, body);
                setMessages(prev => [...prev, response]);
                refreshConversations();
            }
        } catch (error) {
            setInput(body);
        } finally {
            setSending(false);
        }
    };

    const handleTyping = (v: string) => {
        setInput(v);
        if (!activeConv?.id || !echoChannel.current) return;
        const now = Date.now();
        if (now - lastTypingSent.current > 2000) {
            lastTypingSent.current = now;
            echoChannel.current.whisper('typing', { name: user?.name });
        }
    };

    const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const formatDate = (iso: string) => {
        const d = new Date(iso), n = new Date();
        return d.toDateString() === n.toDateString() ? formatTime(iso) : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, typingName]);

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader variant="spinner" color="primary" /></div>;

    return (
        <div className="bg-gray-50/50 min-h-screen flex items-center justify-center p-0 md:p-4">
            <Container className="max-w-6xl w-full">
                <Card className="h-[100vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden border-none md:border shadow-2xl" variant="elevated">

                    <ConversationList
                        conversations={conversations}
                        activeId={activeConv?.id}
                        onSelect={openConversation}
                        user={user}
                        formatDate={formatDate}
                        loading={false}
                    />

                    <main className={`${activeConv ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white`}>
                        {!activeConv ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-12">
                                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4 text-primary/20">
                                    <MessageSquare size={40} />
                                </div>
                                <P className="text-gray-400 font-medium">Tes messages s'afficheront ici</P>
                            </div>
                        ) : (
                            <>
                                <header className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-white/80 backdrop-blur-md z-10">
                                    <div className="flex items-center gap-3">
                                        <IconButton
                                            icon={<ArrowLeft size={20} />}
                                            label="Retour"
                                            variant="ghost"
                                            className="md:hidden"
                                            onClick={() => setActiveConv(null)}
                                        />
                                        <Avatar
                                            src={activeConv.other_user?.avatar}
                                            name={activeConv.other_user?.name}
                                            size="md"
                                            status={activeConv.id ? "online" : undefined}
                                        />
                                        <div className="min-w-0">
                                            <P className="font-black text-sm truncate">{activeConv.other_user?.name}</P>
                                            {activeConv.annonce && (
                                                <Small className="text-primary font-bold truncate block">
                                                    {activeConv.annonce.titre || "Annonce"}
                                                </Small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {activeConv.id && (
                                            <IconButton
                                                icon={<Trash2 size={18} />}
                                                label="Supprimer discussion"
                                                variant="ghost"
                                                className="text-gray-400 hover:text-danger"
                                                onClick={handleDeleteConversation}
                                            />
                                        )}
                                        <IconButton icon={<MoreVertical size={20} />} label="Options" variant="ghost" />
                                    </div>
                                </header>

                                <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth bg-[#FAFAFA]">
                                    {loadingMsgs ? (
                                        <div className="flex justify-center p-10"><Loader variant="pulse" size="sm" color="primary" /></div>
                                    ) : (
                                        <div className="space-y-1">
                                            {messages.length === 0 && (
                                                <div className="text-center py-10 opacity-40 italic">
                                                    <P>Aucun message. Envoyez le premier !</P>
                                                </div>
                                            )}
                                            {messages.map((msg, i) => (
                                                <MessageBubble
                                                    key={msg.id || i}
                                                    msg={msg}
                                                    isMe={msg.sender_id === user?.id}
                                                    showAvatar={msg.sender_id !== user?.id && (i === 0 || messages[i-1].sender_id !== msg.sender_id)}
                                                    formatTime={formatTime}
                                                    onDelete={() => handleDeleteMessage(msg.id)}
                                                />
                                            ))}
                                            <div ref={bottomRef} />
                                        </div>
                                    )}

                                    {typingName && (
                                        <div className="flex items-center gap-2 mt-4 ml-2">
                                            <Loader variant="dots" size="sm" color="primary" />
                                            <Small className="text-gray-400 italic">{typingName} écrit...</Small>
                                        </div>
                                    )}
                                </div>

                                <Divider />

                                <ChatInput
                                    value={input}
                                    onChange={handleTyping}
                                    onSend={sendMessage}
                                    disabled={sending}
                                />
                            </>
                        )}
                    </main>
                </Card>
            </Container>
        </div>
    );
}