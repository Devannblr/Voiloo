'use client';
import { Avatar, P, Small, H3, IconButton, Badge, Loader } from '@/components/Base';
import { Search } from 'lucide-react';

export const ConversationList = ({ conversations, activeId, onSelect, user, formatDate, loading }: any) => (
    <aside className={`${activeId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col bg-white border-r border-gray-100`}>
        <div className="px-6 py-6 flex items-center justify-between border-b border-gray-50">
            <H3 className="font-black uppercase italic tracking-tight">Messages</H3>
            <IconButton icon={<Search size={18} />} label="Rechercher" variant="ghost" size="sm" />
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {loading ? (
                <div className="flex justify-center p-8"><Loader variant="dots" color="primary" /></div>
            ) : (
                conversations.map((conv: any) => (
                    <button
                        key={conv.id}
                        onClick={() => onSelect(conv)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${
                            activeId === conv.id ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className="relative shrink-0">
                            <Avatar src={conv.other_user.avatar ?? undefined} name={conv.other_user.name} size="md" />
                            {conv.unread_count > 0 && (
                                <span className="absolute -top-1 -right-1">
                                    <Badge variant="primary" size="sm" className="px-1.5 min-w-[20px]">{conv.unread_count}</Badge>
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <span className={`text-sm truncate ${conv.unread_count > 0 ? 'font-black' : 'font-semibold text-dark'}`}>
                                    {conv.other_user.name}
                                </span>
                                <Small className="text-gray-400 shrink-0 text-[10px]">{formatDate(conv.updated_at)}</Small>
                            </div>
                            {conv.last_message && (
                                <P className={`text-xs truncate mt-0.5 ${conv.unread_count > 0 ? 'text-dark font-medium' : 'text-gray-400'}`}>
                                    {conv.last_message.sender_id === user?.id ? 'Vous : ' : ''}{conv.last_message.body}
                                </P>
                            )}
                        </div>
                    </button>
                ))
            )}
        </div>
    </aside>
);