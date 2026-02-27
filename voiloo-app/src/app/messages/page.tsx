'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { apiService } from '@/services/apiService';
import { getEcho } from '@/lib/echo';
import {
    Container, Card, Loader, Avatar, P, Small,
    IconButton, Divider, Button, Modal, ModalBody, ModalFooter
} from '@/components/Base';
import { ArrowLeft, MessageSquare, MoreVertical, AlertTriangle } from 'lucide-react';

import { ConversationList } from '@/components/Messages/ConversationList';
import { MessageBubble } from '@/components/Messages/MessageBubble';
import { ChatInput } from '@/components/Messages/ChatInput';
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function MessagesPage() {
    const { user, isLoading } = useAuth();
    const { conversations, refreshConversations, markAsSeen, setActiveConversationId } = useChat();
    const searchParams = useSearchParams();
    const router = useRouter();

    const urlUserId = searchParams.get('user_id');
    const urlAnnonceId = searchParams.get('annonce_id');

    const [activeConv, setActiveConv] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [typingName, setTypingName] = useState<string | null>(null);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const typingTimer = useRef<NodeJS.Timeout | null>(null);
    const lastTypingSent = useRef<number>(0);
    const echoChannel = useRef<any>(null);
    const activeConvIdRef = useRef<number | null>(null);

    const isSyncing = useRef(false);

    useEffect(() => {
        activeConvIdRef.current = activeConv?.id || null;
    }, [activeConv]);

    useEffect(() => {
        return () => {
            if (echoChannel.current) {
                echoChannel.current.stopListening('.MessageSent');
                echoChannel.current.stopListeningForWhisper('typing');
                echoChannel.current.stopListeningForWhisper('seen');
                echoChannel.current.stopListeningForWhisper('message-deleted');
                echoChannel.current = null;
            }
        };
    }, [activeConv?.id]);

    useEffect(() => {
        if (!isInitialLoad && messages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length, typingName, isInitialLoad]);

    const handleInputFocus = () => {
        if (window.innerWidth < 768) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    };

    const openConversation = useCallback(async (conv: any) => {
        if (!conv) return;

        setLoadingMsgs(true);
        setActiveConv(conv);
        setActiveConversationId(conv.id);
        setMessages([]);
        setIsInitialLoad(true);

        if (!conv.id) {
            setLoadingMsgs(false);
            return;
        }

        markAsSeen(conv.id);

        try {
            apiService.markAsRead(conv.id).catch(() => {});
            const msgs = await apiService.getMessages(conv.id);
            setMessages(msgs);

            setTimeout(() => {
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                }
                setIsInitialLoad(false);
            }, 50);

            const echo = getEcho();
            if (echo) {
                echoChannel.current = echo.private(`conversation.${conv.id}`);
                echoChannel.current.listenForWhisper('seen', () => {
                    setMessages(prev => prev.map(m =>
                        m.sender_id === user?.id ? { ...m, read_at: new Date().toISOString() } : m
                    ));
                });

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
                            if (echoChannel.current) {
                                echoChannel.current.whisper('seen', { user_id: user?.id });
                            }
                        }
                    })
                    .listenForWhisper('message-deleted', (e: any) => {
                        setMessages(prev => prev.filter(m => m.id !== e.message_id));
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
    }, [user?.id, markAsSeen, setActiveConversationId]);

    // ✅ LOGIQUE DE NAVIGATION SIMPLIFIÉE : Sync puis nettoyage URL
    useEffect(() => {
        if (isLoading || !urlUserId || isSyncing.current) return;

        const syncAndClean = async () => {
            isSyncing.current = true;
            const targetAnnonceId = urlAnnonceId ? Number(urlAnnonceId) : null;
            const targetUserId = Number(urlUserId);

            // On cherche localement
            const existing = conversations.find((c: any) => {
                const matchUser = Number(c.other_user?.id) === targetUserId;
                const matchAnnonce = targetAnnonceId ? Number(c.annonce_id) === targetAnnonceId : true;
                return matchUser && matchAnnonce;
            });

            if (existing) {
                // On nettoie l'URL avant d'ouvrir pour casser la boucle
                router.replace('/messages', { scroll: false });
                openConversation(existing);
                isSyncing.current = false;
                return;
            }

            // Sinon on crée
            setLoadingMsgs(true);
            try {
                const newConv = await apiService.startConversation({
                    recipient_id: targetUserId,
                    annonce_id: targetAnnonceId || undefined,
                    body: ""
                });

                await refreshConversations();
                // Nettoyage URL
                router.replace('/messages', { scroll: false });
                openConversation(newConv);
            } catch (err) {
                console.error("Erreur sync:", err);
                // En cas d'erreur 500 ou autre, on nettoie quand même pour éviter de boucler à l'infini
                router.replace('/messages', { scroll: false });
            } finally {
                setLoadingMsgs(false);
                isSyncing.current = false;
            }
        };

        syncAndClean();
    }, [urlUserId, urlAnnonceId, conversations, isLoading, router, openConversation, refreshConversations]);

    const sendMessage = async () => {
        if (!input.trim() || !activeConv?.id || sending) return;
        const body = input.trim();
        setInput('');
        setSending(true);

        try {
            const response = await apiService.sendMessage(activeConv.id, body);
            setMessages(prev => [...prev, response]);
            refreshConversations();
        } catch (error) {
            setInput(body);
        } finally {
            setSending(false);
        }
    };

    const confirmDelete = async () => {
        if (!messageToDelete) return;
        try {
            await apiService.deleteMessage(messageToDelete);
            setMessages(prev => prev.filter(m => m.id !== messageToDelete));
            if (echoChannel.current) {
                echoChannel.current.whisper('message-deleted', { message_id: messageToDelete });
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
        } finally {
            setDeleteModalOpen(false);
            setMessageToDelete(null);
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

    const handleBack = () => {
        setActiveConv(null);
        setActiveConversationId(null);
        router.push('/messages');
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader variant="spinner" color="primary" /></div>;

    return (
        <ProtectedRoute>
        <div className="bg-white md:bg-gray-50/50 h-[100dvh] md:h-screen">
            <div className="h-full md:flex md:items-center md:justify-center md:p-4">
                <Container className="max-w-6xl w-full h-full md:h-auto !px-0">
                    <Card className="h-full md:h-[85vh] flex flex-col md:flex-row overflow-hidden border-none md:border shadow-2xl" variant="elevated">

                        <aside className={`${activeConv ? 'hidden md:block' : 'block'} w-full md:w-80 h-full border-r border-gray-100 bg-white`}>
                            <ConversationList
                                conversations={conversations}
                                activeId={activeConv?.id}
                                onSelect={(c: any) => {
                                    router.push('/messages');
                                    openConversation(c);
                                }}
                                user={user}
                                formatDate={formatDate}
                                loading={false}
                            />
                        </aside>

                        <main className={`${activeConv ? 'flex' : 'hidden md:flex'} flex-1 flex-col h-full overflow-hidden bg-white`}>
                            {!activeConv ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-12">
                                    <MessageSquare size={40} className="text-gray-100 mb-4" />
                                    <P className="text-gray-400">Sélectionnez une discussion</P>
                                </div>
                            ) : (
                                <>
                                    <header className="flex-none flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-white z-20">
                                        <div className="flex items-center gap-3">
                                            <IconButton
                                                icon={<ArrowLeft size={20} />}
                                                label="Retour"
                                                variant="ghost"
                                                className="md:hidden"
                                                onClick={handleBack}
                                            />
                                            <Avatar src={activeConv.other_user?.avatar} name={activeConv.other_user?.name} size="md" />
                                            <div className="min-w-0">
                                                <P className="font-black text-sm truncate">{activeConv.other_user?.name}</P>
                                                {activeConv.annonce && (
                                                    <Small className="text-primary font-bold truncate block">
                                                        {activeConv.annonce.titre}
                                                    </Small>
                                                )}
                                            </div>
                                        </div>
                                        <IconButton icon={<MoreVertical size={20} />} label="Options" variant="ghost" />
                                    </header>

                                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6 bg-[#FAFAFA]">
                                        {loadingMsgs ? (
                                            <div className="flex justify-center p-10"><Loader variant="pulse" size="sm" color="primary" /></div>
                                        ) : (
                                            <div className="space-y-1">
                                                {!loadingMsgs && messages.length === 0 && (
                                                    <div className="text-center py-10 opacity-40 italic">
                                                        <P>Dites bonjour à {activeConv.other_user?.name} !</P>
                                                    </div>
                                                )}
                                                {messages.map((msg, i) => (
                                                    <MessageBubble
                                                        key={msg.id || i}
                                                        msg={msg}
                                                        isMe={msg.sender_id === user?.id}
                                                        showAvatar={msg.sender_id !== user?.id && (i === 0 || messages[i-1].sender_id !== msg.sender_id)}
                                                        formatTime={formatTime}
                                                        onDelete={msg.sender_id === user?.id ? () => {
                                                            setMessageToDelete(msg.id);
                                                            setDeleteModalOpen(true);
                                                        } : undefined}
                                                        isLastMessage={msg.sender_id === user?.id && i === messages.map(m => m.sender_id).lastIndexOf(user?.id)}
                                                    />
                                                ))}
                                                <div ref={bottomRef} />
                                            </div>
                                        )}
                                        {typingName && !loadingMsgs && (
                                            <div className="flex items-center gap-2 mt-4 ml-2">
                                                <Loader variant="dots" size="sm" color="primary" />
                                                <Small className="text-gray-400 italic">{typingName} écrit...</Small>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-none sticky bottom-0 bg-white">
                                        <Divider />
                                        <div onFocusCapture={handleInputFocus}>
                                            <ChatInput
                                                value={input}
                                                onChange={handleTyping}
                                                onSend={sendMessage}
                                                disabled={sending}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </main>
                    </Card>
                </Container>
            </div>

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="sm">
                <ModalBody>
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                        <div>
                            <P className="font-bold text-lg mb-1">Supprimer le message</P>
                            <Small className="text-gray-500">Cette action est irréversible</Small>
                        </div>
                    </div>
                    <P className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer ce message ?</P>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Annuler</Button>
                    <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>Supprimer</Button>
                </ModalFooter>
            </Modal>
        </div>
        </ProtectedRoute>
    );
}