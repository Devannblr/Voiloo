'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Avatar, H4, P, Button, Input, IconButton, Label, H2, Link } from '@/components/Base';
import { MapPin, Calendar, Edit2, Check, X, ShoppingBag, MessageCircle, Heart, LayoutDashboard, Upload } from 'lucide-react';

interface UserData {
    name: string;
    username: string;
    localisation: string;
    joinDate: string;
    avatar?: string;
    bio?: string;
    activity?: string;
}

interface ProfilCardProps {
    user: UserData;
    onUpdate: (newData: any) => void;
}

export const ProfilCard = ({ user, onUpdate }: ProfilCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: user.name ?? "",
        localisation: user.localisation ?? ""
    });

    // ✅ État pour la preview de l'image
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    useEffect(() => {
        setEditData({
            name: user.name ?? "",
            localisation: user.localisation ?? ""
        });
        // Réinitialiser la preview quand l'user change
        setAvatarPreview(null);
    }, [user]);

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    // ✅ Gestion de l'avatar avec preview
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Vérifier le type et la taille
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner une image');
                return;
            }

            if (file.size > 2 * 1024 * 1024) { // 2MB
                alert('L\'image ne doit pas dépasser 2MB');
                return;
            }

            // ✅ Créer la preview locale
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // ✅ Upload de l'image
            setIsUploadingAvatar(true);
            try {
                const formData = new FormData();
                formData.append('avatar', file);
                await onUpdate(formData);
            } catch (error) {
                console.error('Erreur upload:', error);
                setAvatarPreview(null); // Annuler la preview en cas d'erreur
            } finally {
                setIsUploadingAvatar(false);
            }
        }
    };

    // ✅ Annuler la preview
    const cancelPreview = () => {
        setAvatarPreview(null);
    };

    return (
        <Card className="w-full border-beige/50 shadow-sm overflow-hidden">
            <CardBody className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 border-b border-beige/30 pb-4">
                    <H4 className="text-xl font-bold">Mon Profil Public</H4>
                    {!isEditing ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Edit2 size={16} />}
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <IconButton
                                label="Annuler"
                                variant="ghost"
                                icon={<X size={18}/>}
                                onClick={() => {
                                    setIsEditing(false);
                                    cancelPreview();
                                }}
                            />
                            <IconButton
                                label="Valider"
                                variant="primary"
                                icon={<Check size={18}/>}
                                onClick={handleSave}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
                    {/* ✅ Avatar avec preview et loader */}
                    <div className="relative group shrink-0">
                        <Avatar
                            src={avatarPreview || user.avatar}
                            name={user.name}
                            size="xl"
                        />

                        {/* Loader pendant l'upload */}
                        {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-dark/60 rounded-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        )}

                        {/* Preview overlay */}
                        {avatarPreview && !isUploadingAvatar && (
                            <div className="absolute inset-0 bg-dark/40 rounded-full flex items-center justify-center">
                                <button
                                    onClick={cancelPreview}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* Bouton de modification */}
                        {isEditing && !isUploadingAvatar && (
                            <label className="absolute inset-0 bg-dark/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-2 border-dashed border-white/50">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                    onChange={handleFileChange}
                                    disabled={isUploadingAvatar}
                                />
                                <Upload size={20} className="text-white mb-1" />
                                <P className="text-white text-[10px] font-bold text-center px-2">
                                    MODIFIER
                                </P>
                            </label>
                        )}
                    </div>

                    <div className="space-y-5 min-w-0">
                        {isEditing ? (
                            <div className="space-y-4">
                                <Input
                                    label="Nom"
                                    value={editData.name ?? ""}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                />
                                <Input
                                    label="Localisation"
                                    value={editData.localisation ?? ""}
                                    onChange={(e) => setEditData({...editData, localisation: e.target.value})}
                                    leftIcon={<MapPin size={16} />}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <H4 className="text-2xl font-bold truncate">{user.name}</H4>
                                    <P className="text-primary-dark font-semibold">@{user.username}</P>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin size={16} className="text-primary-dark" />
                                        <P className="text-sm font-medium">
                                            {user.localisation || "Non renseignée"}
                                        </P>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Calendar size={16} className="text-primary-dark" />
                                        <P className="text-sm font-medium italic text-gray-400">
                                            Membre depuis {user.joinDate}
                                        </P>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export const AboutSection = ({ user, onUpdate }: ProfilCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        bio: user.bio ?? "",
        activity: user.activity ?? ""
    });

    useEffect(() => {
        setEditData({ bio: user.bio ?? "", activity: user.activity ?? "" });
    }, [user]);

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    return (
        <Card className="w-full border-beige/50 shadow-sm bg-stone-50/30">
            <CardBody className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-8">
                    <H2 className="text-xl font-bold text-dark">À propos de vous</H2>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm font-medium text-gray-400 hover:text-primary"
                        >
                            Modifier
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-sm text-gray-400"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                className="text-sm font-bold text-primary"
                            >
                                Enregistrer
                            </button>
                        </div>
                    )}
                </div>
                <div className="space-y-8">
                    <div className="space-y-2">
                        <Label>Que faites vous ici ?</Label>
                        {isEditing ? (
                            <Input
                                value={editData.bio ?? ""}
                                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                            />
                        ) : (
                            <P className="text-dark/90 leading-relaxed">
                                {user.bio || "..."}
                            </P>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Activité principale</Label>
                        {isEditing ? (
                            <Input
                                value={editData.activity ?? ""}
                                onChange={(e) => setEditData({...editData, activity: e.target.value})}
                            />
                        ) : (
                            <P className="text-dark/90 font-semibold italic">
                                {user.activity || "..."}
                            </P>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export const QuickLinksCard = () => {
    const links = [
        { title: "Commandes", icon: <ShoppingBag size={18} />, href: "/commandes" },
        { title: "Messages", icon: <MessageCircle size={18} />, href: "/messages" },
        { title: "Favoris", icon: <Heart size={18} />, href: "/favoris" },
        { title: "Tableau de bord", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
    ];

    return (
        <Card className="w-full border-beige/50 shadow-sm">
            <CardBody className="p-6">
                <H4 className="mb-6 text-base font-bold">Liens rapides</H4>
                <nav className="flex flex-col gap-2">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            variant="nav"
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-primary/5 transition-colors group"
                        >
                            <span className="text-sm font-medium">{link.title}</span>
                            <span className="text-primary-dark group-hover:translate-x-1 transition-transform">
                                {link.icon}
                            </span>
                        </Link>
                    ))}
                </nav>
            </CardBody>
        </Card>
    );
};