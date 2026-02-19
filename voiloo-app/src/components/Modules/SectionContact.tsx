'use client';

import { useState } from 'react';
import { Mail, Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

interface SectionContactProps {
    primary: string;
    annonceId: number; // Requis pour savoir à qui envoyer le mail côté Laravel
    destinataireEmail: string; // Requis pour savoir à qui envoyer le mail côté Laravel
}

export default function SectionContact({ primary, annonceId, destinataireEmail }: SectionContactProps) {
    const [form, setForm] = useState({ nom: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...form,
                    annonce_id: annonceId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Une erreur est survenue lors de l'envoi.");
            }

            setSent(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) return (
        <section id="contact" className="scroll-mt-20">
            <SectionTitle icon={<Mail size={18} />} label="Contact" primary={primary} />
            <div className="mt-4 p-10 rounded-3xl text-center border-2 border-dashed" style={{ borderColor: `${primary}40`, backgroundColor: `${primary}05` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${primary}20` }}>
                    <CheckCircle2 size={32} style={{ color: primary }} />
                </div>
                {/* 🎯 On utilise la prop ici */}
                <p className="text-xl font-black text-dark">
                    Message envoyé à <span className="underline" style={{ color: primary }}>{destinataireEmail}</span> !
                </p>
                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                    Votre demande a bien été transmise. Vous recevrez une réponse par email sous peu.
                </p>
            </div>
        </section>
    );

    return (
        <section id="contact" className="scroll-mt-20">
            <SectionTitle icon={<Mail size={18} />} label="Contact" primary={primary} />

            <form onSubmit={handleSend} className="mt-4 p-6 rounded-3xl border-2 space-y-4 bg-white" style={{ borderColor: `${primary}20` }}>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <input
                            type="text"
                            required
                            value={form.nom}
                            onChange={e => setForm({...form, nom: e.target.value})}
                            placeholder="Votre nom"
                            className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 text-sm outline-none transition-all focus:bg-white"
                            style={{ borderColor: 'transparent', borderBottomColor: `${primary}20` }}
                        />
                    </div>
                    <div className="space-y-1">
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            placeholder="Votre adresse email"
                            className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 text-sm outline-none transition-all focus:bg-white"
                            style={{ borderColor: 'transparent', borderBottomColor: `${primary}20` }}
                        />
                    </div>
                </div>

                <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="Comment puis-je vous aider ?"
                    className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 text-sm outline-none transition-all focus:bg-white resize-none"
                    style={{ borderColor: 'transparent', borderBottomColor: `${primary}20` }}
                />

                {error && (
                    <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-lg">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    style={{ backgroundColor: primary, color: '#000' }}
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <span>Envoyer le message</span>
                            <Send size={18} />
                        </>
                    )}
                </button>
            </form>
        </section>
    );
}