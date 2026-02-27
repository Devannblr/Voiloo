'use client';
import { useState, useRef } from 'react';
import { Avatar, Small } from '@/components/Base';
import { Trash2 } from 'lucide-react';

interface MessageBubbleProps {
    msg: any;
    isMe: boolean;
    showAvatar: boolean;
    formatTime: (iso: string) => string;
    onDelete?: () => void;
    isLastMessage?: boolean; // ✅ Nouvelle prop
}

export const MessageBubble = ({ msg, isMe, showAvatar, formatTime, onDelete, isLastMessage }: MessageBubbleProps) => {
    const [showDeleteBtn, setShowDeleteBtn] = useState(false);
    const [isLongPressing, setIsLongPressing] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    // ✅ Long press pour mobile avec feedback visuel
    const handleTouchStart = () => {
        if (!isMe || !onDelete) return;
        setIsLongPressing(true);
        longPressTimer.current = setTimeout(() => {
            // Vibration si supportée
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
            setShowDeleteBtn(true);
            setIsLongPressing(false);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        setIsLongPressing(false);
    };

    return (
        <div
            className={`group flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 mb-4 animate-fade-in`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            {!isMe && (
                <div className="w-8 shrink-0">
                    {showAvatar ? <Avatar src={msg.sender.avatar ?? undefined} name={msg.sender.name} size="xs" /> : <div className="w-8" />}
                </div>
            )}
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className="relative flex items-center gap-2">
                    {/* ✅ Bouton supprimer (hover desktop OU après long press mobile) */}
                    {isMe && onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                                setShowDeleteBtn(false);
                            }}
                            className={`p-2 rounded-full transition-all ${
                                showDeleteBtn
                                    ? 'opacity-100 bg-red-500 text-white shadow-lg scale-110'
                                    : 'opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500'
                            }`}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-transform ${
                        isMe ? 'bg-primary text-black rounded-br-none' : 'bg-gray-100 text-dark rounded-bl-none'
                    } ${isLongPressing ? 'scale-95' : 'scale-100'}`}>
                        {msg.body}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1 px-1">
                    <Small className="text-[10px] text-gray-400 font-medium">{formatTime(msg.created_at)}</Small>
                    {/* ✅ Checkmarks uniquement sur le dernier message */}
                    {isMe && isLastMessage && (
                        <span className={msg.read_at ? 'text-primary' : 'text-gray-300'}>
                            {msg.read_at ? '✓✓' : '✓'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};