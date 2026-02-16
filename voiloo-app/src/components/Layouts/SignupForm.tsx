'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button, Input, P } from '@/components/Base';
import {PasswordInput} from "@/components/Modules";

export default function SignupForm() {
    const { request, isLoading, error } = useApi();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        username: '',
    });

    // États de validation
    const [isUserAvailable, setIsUserAvailable] = useState<boolean | null>(null);
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState({ user: false, email: false });

    // --- 1. VÉRIFICATION USERNAME (GET) ---
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

    // --- 2. VÉRIFICATION EMAIL (GET pour éviter 419 CSRF) ---
    useEffect(() => {
        const checkEmail = async () => {
            if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
                setIsEmailAvailable(null);
                return;
            }
            setIsChecking(prev => ({ ...prev, email: true }));
            try {
                // Utilisation de GET avec query param ?email=
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUserAvailable === false || isEmailAvailable === false) return;

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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

            {/* Nom complet */}
            <div>
                <Input
                    label={"Nom complet"}
                    type="text"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                />
            </div>

            {/* Identifiant avec leftIcon @ */}
            <div>
                <Input
                    label={"Identifiant unique"}
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
                {isChecking.user && <P className="text-gray-400 text-xs mt-1 italic">Vérification pseudo...</P>}
            </div>

            {/* Email */}
            <div>
                <Input
                    label={"Email"}
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
                {isChecking.email && <P className="text-gray-400 text-xs mt-1 italic">Vérification email...</P>}
            </div>

            {/* Mot de passe */}
            <div>
                <PasswordInput
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    showChecklist={true}
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 disabled:opacity-50"
                disabled={isLoading || isUserAvailable === false || isEmailAvailable === false || isChecking.user || isChecking.email}
            >
                {isLoading ? 'Création...' : 'Créer mon compte'}
            </Button>
        </form>
    );
}