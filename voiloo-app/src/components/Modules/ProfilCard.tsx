import React, { useState } from 'react';
import {Card, CardBody, Avatar, H4, P, Button, Input, IconButton, Label, H2, Link} from '@/components/Base';
import {MapPin, Calendar, Edit2, Check, X, ShoppingBag, MessageCircle, Heart, LayoutDashboard} from 'lucide-react';
interface UserData {
    name: string;
    username: string;
    location: string;
    joinDate: string;
    avatar?: string;
    intent?: string;   // Champ "Que faites-vous ici ?"
    activity?: string; // Champ "Activité principale"
}

interface ProfilCardProps {
    user: UserData;
    onUpdate: (newData: any) => void;
}

// 1. CARTE DE PROFIL (Avatar, Nom, Localisation)
export const ProfilCard = ({ user, onUpdate }: ProfilCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(user);

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    return (
        <Card className="w-full border-beige/50 shadow-sm overflow-hidden">
            <CardBody className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 border-b border-beige/30 pb-4">
                    <H4 className="text-xl font-bold">Mon Profil Public</H4>
                    <div className="shrink-0">
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
                            <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                                <IconButton label="Annuler" variant="ghost" icon={<X size={18}/>} onClick={() => setIsEditing(false)} />
                                <IconButton label="Valider" variant="primary" icon={<Check size={18}/>} onClick={handleSave} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
                    <div className="relative group shrink-0">
                        <Avatar src={user.avatar} name={user.name} size="xl" />
                        {isEditing && (
                            <label className="absolute inset-0 bg-dark/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-2 border-dashed border-white/50">
                                <input type="file" className="hidden" accept="image/*" />
                                <P className="text-white text-[10px] font-bold">MODIFIER</P>
                            </label>
                        )}
                    </div>

                    <div className="space-y-5 min-w-0">
                        {isEditing ? (
                            <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-gray-400">Nom d'affichage</Label>
                                    <Input
                                        value={editData.name}
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        placeholder="Ex: Jean Dupont"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-gray-400">Localisation</Label>
                                    <Input
                                        value={editData.location}
                                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                                        placeholder="Ville, Pays"
                                        leftIcon={<MapPin size={16} />}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div>
                                    <H4 className="text-2xl font-bold truncate">{user.name}</H4>
                                    <P className="text-primary-dark font-semibold">@{user.username}</P>
                                </div>
                                <div className="flex flex-col gap-3 pt-2">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-beige/20 flex items-center justify-center shrink-0">
                                            <MapPin size={16} className="text-primary-dark" />
                                        </div>
                                        <P className="text-sm font-medium">{user.location || "Localisation non renseignée"}</P>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-beige/20 flex items-center justify-center shrink-0">
                                            <Calendar size={16} className="text-primary-dark" />
                                        </div>
                                        <P className="text-sm font-medium italic text-gray-400">Membre depuis {user.joinDate}</P>
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

// 2. SECTION À PROPOS (Inspirée de ton image)
export const AboutSection = ({ user, onUpdate }: ProfilCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        intent: user.intent || "",
        activity: user.activity || ""
    });

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    return (
        <Card className=" w-full border-beige/50 shadow-sm bg-stone-50/30">
            <CardBody className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-8">
                    <H2 className="text-xl font-bold text-dark">À propos de vous</H2>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm font-medium text-gray-400 hover:text-primary-dark transition-colors"
                        >
                            Modifier
                        </button>
                    ) : (
                        <div className="flex gap-4 animate-in fade-in zoom-in duration-200">
                            <button onClick={() => setIsEditing(false)} className="text-sm text-gray-400">Annuler</button>
                            <button onClick={handleSave} className="text-sm font-bold text-primary-dark">Enregistrer</button>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="space-y-2">
                        <P className="text-sm text-gray-500 font-medium">Que faites vous ici ?</P>
                        {isEditing ? (
                            <Input
                                className="bg-white border-beige/50"
                                value={editData.intent}
                                onChange={(e) => setEditData({...editData, intent: e.target.value})}
                                placeholder="Expliquez votre démarche..."
                            />
                        ) : (
                            <P className="text-dark/90 leading-relaxed min-h-[1.5rem]">
                                {editData.intent || "Cliquez sur modifier pour ajouter une description."}
                            </P>
                        )}
                    </div>

                    <div className="space-y-2">
                        <P className="text-sm text-gray-500 font-medium">Principal activité</P>
                        {isEditing ? (
                            <Input
                                className="bg-white border-beige/50"
                                value={editData.activity}
                                onChange={(e) => setEditData({...editData, activity: e.target.value})}
                                placeholder="Votre métier ou passion..."
                            />
                        ) : (
                            <P className="text-dark/90 font-semibold italic min-h-[1.5rem]">
                                {editData.activity || "Non renseignée"}
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
        { title: "Commande", icon: <ShoppingBag size={18} className="text-primary-dark" />, href: "/commandes" },
        { title: "Message", icon: <MessageCircle size={18} className="text-primary-dark" />, href: "/messages" },
        { title: "Favoris", icon: <Heart size={18} className="text-primary-dark" />, href: "/favoris" },
        { title: "Dashboard", icon: <LayoutDashboard size={18} className="text-primary-dark" />, href: "/dashboard" },
    ];

    return (
        <Card className="w-full border-beige/50 shadow-sm h-full">
            <CardBody className="p-6">
                <H4 className="mb-6 text-base font-bold">Liens rapide</H4>
                <nav className="flex flex-col gap-4">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="flex items-center justify-between group no-underline hover:bg-beige/10 p-1 rounded-md transition-colors"
                        >
                            <span className="text-dark font-medium group-hover:text-primary-dark transition-colors">
                                {link.title}
                            </span>
                            <span className="shrink-0 transition-transform group-hover:scale-110">
                                {link.icon}
                            </span>
                        </Link>
                    ))}
                </nav>
            </CardBody>
        </Card>
    );
};