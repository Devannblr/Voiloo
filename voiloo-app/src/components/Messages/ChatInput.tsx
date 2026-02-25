'use client';
import { Send } from 'lucide-react';
import { Button } from '@/components/Base';

interface ChatInputProps {
    value: string;
    onChange: (val: string) => void;
    onSend: () => void;
    disabled: boolean;
}

export const ChatInput = ({ value, onChange, onSend, disabled }: ChatInputProps) => (
    <div className="p-4 md:p-6 bg-white border-t border-gray-50">
        <div className="flex items-end gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-primary/20 focus-within:bg-white transition-all shadow-inner">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                    }
                }}
                placeholder="Écris ton message..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm p-2 max-h-32 min-h-[40px] text-dark"
            />
            {/* Utilisation de ton composant Button */}
            <Button
                onClick={onSend}
                disabled={!value.trim() || disabled}
                isLoading={disabled}
                size="md"
                className="rounded-xl px-3"
            >
                {!disabled && <Send size={18} />}
            </Button>
        </div>
    </div>
);