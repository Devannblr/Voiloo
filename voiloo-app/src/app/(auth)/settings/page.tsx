'use client';

import { useState, useEffect } from 'react';
import { Container, Input, Button, H2, P, Modal, ModalBody, ModalFooter, H3, Loader } from '@/components/Base';
import { useApi } from '@/hooks/useApi';
import { Check, Mail } from 'lucide-react';

interface UserData {
    username: string;
    email: string;
    email_verified_at: string | null;
}

export default function SettingsPage() {
    const { request } = useApi();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const [identity, setIdentity] = useState({ username: '', email: '' });
    const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    const [emailSent, setEmailSent] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        request('/user').then((data: UserData) => {
            setUser(data);
            setIdentity({ username: data.username, email: data.email });
            setLoading(false);
        });
    }, [request]);

    const handleIdentityUpdate = async () => {
        setSaving(true);
        try {
            await request('/user/update', {
                method: 'PUT',
                body: JSON.stringify(identity)
            });
            alert('Modifications enregistrées');
        } catch (e: any) {
            alert(e.message || 'Erreur');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (password.new !== password.confirm) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        setSaving(true);
        try {
            await request('/user/change-password', {
                method: 'POST',
                body: JSON.stringify({ current_password: password.current, new_password: password.new })
            });
            alert('Mot de passe modifié');
            setPassword({ current: '', new: '', confirm: '' });
        } catch (e: any) {
            alert(e.message || 'Mot de passe actuel incorrect');
        } finally {
            setSaving(false);
        }
    };

    const handleSendVerification = async () => {
        try {
            await request('/email/verification-notification', { method: 'POST' });
            setEmailSent(true);
        } catch (e) {
            alert('Erreur envoi email');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await request('/user/delete', {
                method: 'DELETE',
                body: JSON.stringify({ password: deletePassword })
            });
            localStorage.removeItem('voiloo_token');
            window.location.href = '/';
        } catch (e: any) {
            alert(e.message || 'Mot de passe incorrect');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <main className="py-12 bg-gray-50 min-h-screen">
            <Container className="max-w-2xl">
                <H2 className="mb-8">Paramètres du compte</H2>

                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 space-y-4">
                    <H3>Identité</H3>
                    <Input label="Username" value={identity.username}
                           onChange={(e) => setIdentity(i => ({ ...i, username: e.target.value }))} />
                    <Input label="Email" value={identity.email}
                           onChange={(e) => setIdentity(i => ({ ...i, email: e.target.value }))} />
                    {!user?.email_verified_at && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                            <Mail size={16} className="text-amber-600" />
                            <span className="flex-1">Email non vérifié</span>
                            {emailSent ? (
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                    <Check size={12} /> Email envoyé
                                </span>
                            ) : (
                                <button onClick={handleSendVerification}
                                        className="text-xs font-bold text-amber-600 hover:underline">
                                    Renvoyer
                                </button>
                            )}
                        </div>
                    )}
                    <Button variant="primary" onClick={handleIdentityUpdate} isLoading={saving}>
                        Enregistrer
                    </Button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 space-y-4">
                    <H3>Mot de passe</H3>
                    <Input type="password" label="Mot de passe actuel" value={password.current}
                           onChange={(e) => setPassword(p => ({ ...p, current: e.target.value }))} />
                    <Input type="password" label="Nouveau mot de passe" value={password.new}
                           onChange={(e) => setPassword(p => ({ ...p, new: e.target.value }))} />
                    <Input type="password" label="Confirmer" value={password.confirm}
                           onChange={(e) => setPassword(p => ({ ...p, confirm: e.target.value }))} />
                    <Button variant="outline" onClick={handlePasswordChange} isLoading={saving}>
                        Changer le mot de passe
                    </Button>
                </div>

                <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                    <H3 className="text-red-600">Zone de danger</H3>
                    <P className="mb-4 text-sm">Suppression irréversible. Toutes vos annonces seront supprimées.</P>
                    <Button variant="danger" onClick={() => setDeleteModal(true)}>
                        Supprimer mon compte
                    </Button>
                </div>

                <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Confirmer la suppression">
                    <ModalBody>
                        <P className="mb-4">Entrez votre mot de passe pour confirmer :</P>
                        <Input type="password" value={deletePassword}
                               onChange={(e) => setDeletePassword(e.target.value)} />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={() => setDeleteModal(false)}>Annuler</Button>
                        <Button variant="danger" onClick={handleDeleteAccount}>Supprimer</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </main>
    );
}