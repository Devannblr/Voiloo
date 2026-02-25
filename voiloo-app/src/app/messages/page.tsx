'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { apiService } from '@/services/apiService';
import { getEcho } from '@/lib/echo';
import {
    Container, Card, Loader, Avatar, P, Small,
    IconButton
} from '@/components/Base';
import { ArrowLeft, MoreVertical, MessageSquare } from 'lucide-react';

import { ConversationList } from '@/components/Messages/ConversationList';
import { MessageBubble } from '@/components/Messages/MessageBubble';
import { ChatInput } from '@/components/Messages/ChatInput';

export default function MessagesPage() {
    const { user, isLoading } = useAuth();
    const { conversations, refreshConversations, markAsSeen } = useChat();

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

    // Focus handler : Marquer comme lu quand on revient sur la fenêtre
    useEffect(() => {
        const handleFocus = async () => {
            if (activeConvIdRef.current && echoChannel.current) {
                try {
                    await apiService.markAsRead(activeConvIdRef.current);
                    markAsSeen(activeConvIdRef.current);
                    echoChannel.current.whisper('seen', { user_id: user?.id });
                } catch (e) {}
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [markAsSeen, user?.id]);

    const openConversation = useCallback(async (conv: any) => {
        // On nettoie l'ancien canal si nécessaire
        if (echoChannel.current) {
            echoChannel.current.stopListening('.MessageSent');
        }

        setActiveConv(conv);
        setMessages([]);
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
                        // Si c'est nous qui avons envoyé, on ignore (déjà ajouté localement)
                        if (e.message.sender_id === user?.id) return;

                        setMessages(prev => {
                            if (prev.find(m => m.id === e.message.id)) return prev;
                            return [...prev, e.message];
                        });

                        // Si on est sur la conversation, on markAsRead immédiatement
                        if (activeConvIdRef.current === conv.id) {
                            apiService.markAsRead(conv.id).catch(() => {});
                            markAsSeen(conv.id);
                            echoChannel.current.whisper('seen', { user_id: user?.id });
                        }
                    })
                    .listenForWhisper('seen', () => {
                        setMessages(prev => prev.map(msg => ({
                            ...msg,
                            read_at: msg.read_at || new Date().toISOString()
                        })));
                    })
                    .listenForWhisper('typing', (e: any) => {
                        setTypingName(e.name);
                        if (typingTimer.current) clearTimeout(typingTimer.current);
                        typingTimer.current = setTimeout(() => setTypingName(null), 3000);
                    })
                    .listenForWhisper('message_deleted', (e: any) => {
                        setMessages(prev => prev.filter(m => m.id !== e.id));
                    });

                // Notifier l'autre qu'on a ouvert la conv
                setTimeout(() => {
                    if (echoChannel.current && activeConvIdRef.current === conv.id) {
                        echoChannel.current.whisper('seen', { user_id: user?.id });
                    }
                }, 1000);
            }
        } catch (error) {
            console.error("Erreur critique chargement messages:", error);
        } finally {
            setLoadingMsgs(false);
        }
    }, [user, markAsSeen]);

    const deleteMessage = async (messageId: number) => {
        try {
            await apiService.deleteMessage(messageId);
            setMessages(prev => prev.filter(m => m.id !== messageId));

            if (echoChannel.current) {
                // On utilise whisper pour la suppression immédiate sans repasser par le serveur
                echoChannel.current.whisper('message_deleted', { id: messageId });
            }
            refreshConversations();
        } catch (error) {
            console.error("Erreur suppression message:", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !activeConv || sending) return;
        const body = input.trim();
        setInput('');
        setSending(true);
        try {
            const response = await apiService.sendMessage(activeConv.id, body);
            setMessages(prev => [...prev, response]);
            refreshConversations();
            // On stoppe l'indicateur de typing chez l'autre immédiatement après l'envoi
            if (echoChannel.current) {
                setTypingName(null);
            }
        } catch (error) {
            setInput(body); // On remet le texte en cas d'erreur
        } finally {
            setSending(false);
        }
    };

    const handleTyping = (v: string) => {
        setInput(v);
        if (!activeConv || !echoChannel.current) return;

        const now = Date.now();
        // On limite l'envoi du whisper à une fois toutes les 2 secondes pour ne pas spammer Pusher
        if (now - lastTypingSent.current > 2000) {
            lastTypingSent.current = now;
            echoChannel.current.whisper('typing', { name: user?.name });
        }
    };

    const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit'
    });

    const formatDate = (iso: string) => {
        const d = new Date(iso), n = new Date();
        return d.toDateString() === n.toDateString() ? formatTime(iso) : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    useEffect(() => {
        if (messages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length, typingName]); // Scroll aussi si le texte "écrit..." apparaît

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader variant="spinner" /></div>;

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
                                        <Avatar src={activeConv.other_user.avatar ?? undefined} name={activeConv.other_user.name} size="md" status="online" />
                                        <div className="min-w-0">
                                            <P className="font-black text-sm truncate">{activeConv.other_user.name}</P>
                                            {activeConv.annonce && (
                                                <Small className="text-primary font-bold truncate block">
                                                    {activeConv.annonce.titre}
                                                </Small>
                                            )}
                                        </div>
                                    </div>
                                    <IconButton icon={<MoreVertical size={20} />} label="Options" variant="ghost" />
                                </header>

                                <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
                                    {loadingMsgs ? (
                                        <div className="flex justify-center p-10"><Loader variant="pulse" size="sm" /></div>
                                    ) : (
                                        <div className="space-y-1">
                                            {messages.map((msg, i) => (
                                                <MessageBubble
                                                    key={msg.id}
                                                    msg={msg}
                                                    isMe={msg.sender_id === user?.id}
                                                    showAvatar={msg.sender_id !== user?.id && (i === 0 || messages[i-1].sender_id !== msg.sender_id)}
                                                    formatTime={formatTime}
                                                    onDelete={() => deleteMessage(msg.id)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {typingName && (
                                        <div className="flex items-center gap-2 mt-4 ml-2">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                            <Small className="text-gray-400 italic">
                                                {typingName} est en train d'écrire...
                                            </Small>
                                        </div>
                                    )}
                                    <div ref={bottomRef} className="h-4" />
                                </div>

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