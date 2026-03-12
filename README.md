# Voiloo 🚗

![Voiloo Logo](./logoWhite.svg#gh-dark-mode-only)
![Voiloo Logo](./logoDark.svg#gh-light-mode-only)
> **Projet Universitaire — 3ème année de BUT MMI (Métiers du Multimédia et de l'Internet)**

## 📋 Description

Voiloo est une application web moderne développée avec une architecture full-stack. Ce projet met en œuvre un frontend performant avec **Next.js** (TypeScript) et une API robuste propulsée par **Laravel 12**, le tout conçu pour offrir une expérience utilisateur fluide et sécurisée.

## 🛠️ Technologies Utilisées

### Frontend (`voiloo-app`)
- **Next.js** - Framework React pour le rendu hybride et les performances.
- **TypeScript** - Langage principal pour un code typé et sécurisé.
- **Tailwind CSS** - Pour une interface moderne et responsive.
- **npm** - Gestion des dépendances.

### Backend (`voiloo-back`)
- **PHP 8.4+** - Langage serveur.
- **Laravel 12** - Framework PHP (Utilisation de l'ORM Eloquent et des API routes).
- **MySQL** - Base de données (Hébergée sur Infomaniak).
- **API RESTful** - Communication asynchrone avec le frontend.

---

## 📁 Structure du Projet

```text
Voiloo/
├── voiloo-app/          # Frontend Next.js (TypeScript)
├── voiloo-back/         # API backend (Laravel 12)
├── .idea/               # Configuration IDE (PHPStorm / WebStorm)
├── Pages.txt            # Documentation des vues et du routing
├── logoDark.svg         # Identité visuelle (version sombre)
├── logoFullblack.svg    # Identité visuelle (version complète)
└── logoOnly.svg         # Identité visuelle (icône seule)
```

---

## 🚀 Installation

### Prérequis
- Node.js (version 18+ recommandée)
- PHP (version 8.2+)
- Composer
- MySQL

### Installation du Frontend (Next.js)
```bash
cd voiloo-app
npm install
npm run dev
```

### Installation du Backend (Laravel)
```bash
cd voiloo-back
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

---

## ⚙️ Configuration

1. Configurez votre base de données dans le fichier `.env` du backend (`voiloo-back`).
2. Configurez l'URL de l'API (généralement `NEXT_PUBLIC_API_URL`) dans le fichier `.env.local` du frontend.
3. Lancez les deux serveurs simultanément.

---

## 🎯 Fonctionnalités

- 🔐 **Authentification :** Gestion sécurisée des sessions et comptes utilisateurs.
- 📱 **Interface Responsive :** Design optimisé pour Desktop, Tablette et Mobile.
- 🔄 **API RESTful :** Architecture découplée entre Next.js et Laravel.
- 💾 **Gestion de données :** Persistance rigoureuse via l'ORM Eloquent.
- 🎨 **UI Moderne :** Interface épurée et typographie soignée.

---

## 📝 Scripts Disponibles

### Frontend (Next.js)
- `npm run dev` : Démarrer le serveur de développement Next.js.
- `npm run build` : Compiler le projet pour la production.
- `npm run start` : Lancer le serveur de production compilé.

### Backend (Laravel)
- `php artisan serve` : Lancer le serveur local Laravel.
- `php artisan migrate` : Exécuter les migrations de base de données.
- `php artisan db:seed` : Remplir la base avec des données de test.

---

## 🤝 Contribution

Les contributions sont les bienvenues pour améliorer le projet !
1. Ouvrez une **Issue** pour discuter d'un bug ou d'une amélioration.
2. Forkez le projet.
3. Créez une branche (`git checkout -b feature/AmazingFeature`).
4. Committez vos changements (`git commit -m 'Add some AmazingFeature'`).
5. Ouvrez une **Pull Request**.

---

## 🔒 Licence et Propriété

**Copyright (c) 2026 Devannblr. Tous droits réservés.**

Ce projet est réalisé dans un but pédagogique pour le cursus **BUT MMI**. 
- La consultation du code est autorisée à des fins de démonstration (Portfolio) uniquement.
- **Toute reproduction, revente ou utilisation commerciale du code source est strictement interdite** sans l'accord écrit préalable de l'auteur.
- Les contributions acceptées seront soumises à ce même régime de propriété.

---

## 👤 Auteur
**Devannblr** — Étudiant en 3ème année de BUT MMI  
GitHub: [@Devannblr](https://github.com/Devannblr)

## 📞 Support
Pour toute question, n'hésitez pas à ouvrir une [issue](https://github.com/Devannblr/Voiloo/issues).

---
⭐ N'oubliez pas de mettre une étoile si ce projet vous plaît !
