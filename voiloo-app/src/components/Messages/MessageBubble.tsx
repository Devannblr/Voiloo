'use client';
import { Avatar, Small, IconButton } from '@/components/Base';
import { Trash2 } from 'lucide-react';

interface MessageBubbleProps {
    msg: any;
    isMe: boolean;
    showAvatar: boolean;
    formatTime: (iso: string) => string;
    onDelete?: () => void; // ✅ Nouvelle prop
}

export const MessageBubble = ({ msg, isMe, showAvatar, formatTime, onDelete }: MessageBubbleProps) => (
    <div className={`group flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 mb-4 animate-fade-in`}>
        {!isMe && (
            <div className="w-8 shrink-0">
                {showAvatar ? <Avatar src={msg.sender.avatar ?? undefined} name={msg.sender.name} size="xs" /> : <div className="w-8" />}
            </div>
        )}
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
            <div className="relative flex items-center gap-2">
                {/* ✅ Bouton supprimer qui apparaît au survol (group-hover) */}
                {isMe && onDelete && (
                    <button
                        onClick={onDelete}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-opacity"
                    >
                        <Trash2 size={14} />
                    </button>
                )}

                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMe ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-dark rounded-bl-none'
                }`}>
                    {msg.body}
                </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1 px-1">
                <Small className="text-[10px] text-gray-400 font-medium">{formatTime(msg.created_at)}</Small>
                {isMe && <span className={msg.read_at ? 'text-primary' : 'text-gray-300'}>{msg.read_at ? '✓✓' : '✓'}</span>}
            </div>
        </div>
    </div>
);