'use client';

import { useState } from 'react';
import { Mail, Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

interface SectionContactProps {
    primary: string;
    annonceId: number;
    destinataireEmail: string;
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
            if (!response.ok) throw new Error(data.message || "Une erreur est survenue.");
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
            <div className="mt-4 p-10 rounded-3xl text-center border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${primary}20` }}>
                    <CheckCircle2 size={32} style={{ color: primary }} />
                </div>
                <p className="text-xl font-black text-dark">
                    Message envoyé !
                </p>
                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                    Votre demande a bien été transmise à l'annonceur.
                </p>
            </div>
        </section>
    );

    return (
        <section id="contact" className="scroll-mt-20">
            <SectionTitle icon={<Mail size={18} />} label="Contact" primary={primary} />

            <form
                onSubmit={handleSend}
                className="mt-4 p-8 rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/40 space-y-6"
            >
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-wider ml-1 text-gray-400">Votre Nom</label>
                        <input
                            type="text"
                            required
                            value={form.nom}
                            onChange={e => setForm({...form, nom: e.target.value})}
                            placeholder="Jean Dupont"
                            className="w-full px-4 py-3.5 rounded-2xl border-2 bg-gray-50/50 text-sm outline-none transition-all focus:bg-white focus:border-gray-200"
                            style={{ borderColor: 'transparent', borderBottomColor: `${primary}40` }}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-wider ml-1 text-gray-400">Votre Email</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            placeholder="jean@exemple.com"
                            className="w-full px-4 py-3.5 rounded-2xl border-2 bg-gray-50/50 text-sm outline-none transition-all focus:bg-white focus:border-gray-200"
                            style={{ borderColor: 'transparent', borderBottomColor: `${primary}40` }}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider ml-1 text-gray-400">Message</label>
                    <textarea
                        rows={4}
                        required
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        placeholder="Comment puis-je vous aider ?"
                        className="w-full px-5 py-4 rounded-2xl border-2 bg-gray-50/50 text-sm outline-none transition-all focus:bg-white resize-none"
                        style={{ borderColor: 'transparent', borderBottomColor: `${primary}40` }}
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-4 rounded-xl border border-red-100">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {/* BOUTON AVEC HOVER DYNAMIQUE */}
                <button
                    type="submit"
                    disabled={loading}
                    className="group w-full py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 hover:brightness-95    hover:shadow-lg"
                    style={{
                        backgroundColor: primary,
                        color: '#1A1A1A'
                    }}
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <span>Envoyer le message</span>
                            <Send size={18} className="transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </button>
            </form>
        </section>
    );
}