# Voiloo

![Voiloo Logo](./logoDark.svg)

## 📋 Description

Voiloo est une application web moderne développée avec une architecture full-stack combinant un frontend en TypeScript et un backend en PHP/Laravel.

## 🛠️ Technologies Utilisées

### Frontend (voiloo-app)
- **TypeScript** - Langage principal
- Framework JavaScript moderne (React/Vue/Angular)
- Build tools et bundlers

### Backend (voiloo-back)
- **PHP** - Langage backend
- **Laravel** - Framework PHP (utilisation de Blade templates)
- API RESTful

## 📁 Structure du Projet

```
Voiloo/
├── voiloo-app/          # Application frontend
├── voiloo-back/         # API backend
├── .idea/               # Configuration IDE
├── Pages.txt            # Documentation des pages
├── logoDark.svg         # Logo version sombre
├── logoFullblack.svg    # Logo complet noir
└── logoOnly.svg         # Logo seul
```

## 🚀 Installation

### Prérequis

- Node.js (version 16+ recommandée)
- npm ou yarn
- PHP (version 8.0+)
- Composer
- MySQL ou PostgreSQL

### Installation du Frontend

```bash
cd voiloo-app
npm install
npm run dev
```

### Installation du Backend

```bash
cd voiloo-back
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## ⚙️ Configuration

1. Configurez votre base de données dans le fichier `.env` du backend
2. Configurez l'URL de l'API dans le fichier de configuration du frontend
3. Lancez les deux serveurs (frontend et backend)

## 🎯 Fonctionnalités

- 🔐 Authentification des utilisateurs
- 📱 Interface responsive
- 🔄 API RESTful
- 💾 Gestion de base de données
- 🎨 Interface utilisateur moderne

## 📝 Scripts Disponibles

### Frontend
```bash
npm run dev      # Démarrer en mode développement
npm run build    # Build pour la production
npm run test     # Lancer les tests
```

### Backend
```bash
php artisan serve              # Démarrer le serveur
php artisan migrate           # Exécuter les migrations
php artisan db:seed           # Seed la base de données
php artisan test              # Lancer les tests
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE) - voir le fichier LICENSE pour plus de détails.

## 👤 Auteur

**Devannblr**
- GitHub: [@Devannblr](https://github.com/Devannblr)

## 📞 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une [issue](https://github.com/Devannblr/Voiloo/issues).

---

⭐ N'oubliez pas de mettre une étoile si ce projet vous plaît !
