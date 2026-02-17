'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button, Input, P } from '@/components/Base';
import { PasswordInput } from "@/components/Modules";

export default function SignupForm() {
    const { request, isLoading, error } = useApi();
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        username: '',
    });

    const [isUserAvailable, setIsUserAvailable] = useState<boolean | null>(null);
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState({ user: false, email: false });

    // --- VÉRIFICATION USERNAME ---
    useEffect(() => {
        const checkUser = async () => {
            const cleanName = formData.username.trim();
            if (cleanName.length < 3) {
                setIsUserAvailable(null);
                return;
            }
            setIsChecking(prev => ({ ...prev, user: true }));
            try {
                const res = await fetch(`http://localhost:8000/api/check-username/${cleanName}`);
                const data = await res.json();
                setIsUserAvailable(data.available);
            } catch (e) {
                console.error("Erreur check username");
            } finally {
                setIsChecking(prev => ({ ...prev, user: false }));
            }
        };
        const timer = setTimeout(checkUser, 500);
        return () => clearTimeout(timer);
    }, [formData.username]);

    // --- VÉRIFICATION EMAIL ---
    useEffect(() => {
        const checkEmail = async () => {
            if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
                setIsEmailAvailable(null);
                return;
            }
            setIsChecking(prev => ({ ...prev, email: true }));
            try {
                const res = await fetch(`http://localhost:8000/api/check-email?email=${encodeURIComponent(formData.email)}`);
                const data = await res.json();
                setIsEmailAvailable(data.available);
            } catch (e) {
                console.error("Erreur check email");
            } finally {
                setIsChecking(prev => ({ ...prev, email: false }));
            }
        };
        const timer = setTimeout(checkEmail, 500);
        return () => clearTimeout(timer);
    }, [formData.email]);

    // --- LOGIQUE DE SOUMISSION SÉCURISÉE ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Bloquer si les vérifications sont en cours
        if (isChecking.user || isChecking.email) return;

        // 2. Bloquer si les dispos sont fausses OU nulles (pas encore vérifiées)
        if (isUserAvailable !== true || isEmailAvailable !== true) {
            alert("Veuillez vérifier vos identifiants et email.");
            return;
        }

        // 3. Bloquer si les mots de passe ne correspondent pas
        if (formData.password !== passwordConfirm) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const data = await request('/register', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            if (data.access_token) {
                localStorage.setItem('voiloo_token', data.access_token);
                window.location.href = '/profil';
            }
        } catch (err) {
            console.error("Erreur d'inscription:", err);
        }
    };

    // Variable pour désactiver le bouton proprement
    const isInvalid =
        !formData.name ||
        isUserAvailable !== true ||
        isEmailAvailable !== true ||
        formData.password !== passwordConfirm ||
        formData.password.length < 8 ||
        isChecking.user ||
        isChecking.email;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

            <Input
                label="Nom complet"
                type="text"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
            />

            <div>
                <Input
                    label="Identifiant unique"
                    type="text"
                    placeholder="ton_pseudo"
                    leftIcon={<span className="font-bold text-gray-400">@</span>}
                    value={formData.username}
                    onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                        setFormData({...formData, username: val});
                    }}
                    className={
                        isUserAvailable === false ? 'border-red-500 bg-red-50' :
                            isUserAvailable === true ? 'border-green-500 bg-green-50' : ''
                    }
                    required
                />
                {isUserAvailable === false && <P className="text-red-500 text-xs mt-1">Ce pseudo est déjà pris.</P>}
            </div>

            <div>
                <Input
                    label="Email"
                    type="email"
                    placeholder="jean@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={
                        isEmailAvailable === false ? 'border-red-500 bg-red-50' :
                            isEmailAvailable === true ? 'border-green-500 bg-green-50' : ''
                    }
                    required
                />
                {isEmailAvailable === false && <P className="text-red-500 text-xs mt-1">Cet email est déjà utilisé.</P>}
            </div>

            <div className="space-y-4">
                <PasswordInput
                    label="Mot de passe"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    showChecklist={true}
                />

                <Input
                    label="Confirmer Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    error={
                        passwordConfirm && passwordConfirm !== formData.password
                            ? "Les mots de passe ne correspondent pas."
                            : undefined
                    }
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 disabled:opacity-50 disabled:cursor-not-ALLOWED"
                disabled={isLoading || isInvalid}
            >
                {isLoading ? 'Création...' : 'Créer mon compte'}
            </Button>
        </form>
    );
}