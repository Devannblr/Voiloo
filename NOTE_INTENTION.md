# Note d'intention — Projet Portfolio S6
**Parcours Développement Web**

---

## 📋 Informations générales

| | |
|---|---|
| **Étudiant** | Devann Billereau |
| **Email** | devann.billereau@gmail.com |
| **Date** | Février 2026 |
| **URL CV en ligne** | [https://devann.billereau.fr](https://devann-billereau.fr) |
| **URL projet** | [https://voiloo.fr](https://voiloo.fr) |
| **Dépôt Git** | [https://github.com/devann/voiloo](https://github.com/Devannblr/Voiloo/) |

---

## 🎯 Quoi — Description du projet

**Voiloo** est une plateforme web de mise en relation entre particuliers et freelances pour des services locaux. Le projet se positionne comme une alternative moderne aux plateformes existantes, avec une approche centrée sur l'expérience utilisateur et la personnalisation.

### Fonctionnalités principales

#### 1. Gestion des annonces
- Création d'annonces de services avec catégorisation
- Upload et gestion multi-images
- Géolocalisation (lat/lng) et recherche par proximité
- Vitrine personnalisable par annonce (couleurs, mise en page)
- Slug unique par utilisateur et annonce (`/u/{username}/{service-slug}`)

#### 2. Système de messagerie temps réel
- Chat instantané entre utilisateurs via WebSocket (Laravel Reverb / Pusher)
- Indicateurs de lecture (✓ envoyé, ✓✓ lu)
- Indicateur de frappe en direct ("... est en train d'écrire")
- Notifications de nouveaux messages sur conversations inactives
- Historique complet des conversations

#### 3. Authentification & sécurité
- Inscription sécurisée avec Cloudflare Turnstile (anti-bot)
- Laravel Sanctum (token Bearer + cookie HttpOnly)
- Validation des formulaires côté client et serveur
- Vérification email
- Réinitialisation mot de passe

#### 4. Recherche & découverte
- Carte interactive avec localisation des services
- Filtres avancés (catégorie, ville, rayon, prix)
- Suggestions de recherche en temps réel
- Services recommandés par géolocalisation

#### 5. Système d'avis
- Notation 5 étoiles
- Commentaires textuels
- Moyenne globale par annonce

---

## 💡 Pourquoi — Motivation personnelle

### Contexte professionnel
Ce projet s'inscrit dans ma volonté de **maîtriser l'ensemble de la stack moderne full-stack** en conditions réelles. Plutôt que de réaliser plusieurs petits projets déconnectés, j'ai choisi de construire une application complète, de la conception à la mise en production.

### Objectifs d'apprentissage
1. **Approfondir React/Next.js** : Après avoir découvert Vue.js en cours, je voulais explorer l'écosystème React qui domine actuellement le marché
2. **Maîtriser Laravel 12** : Framework PHP moderne avec une architecture propre (MVC, Eloquent ORM, Events/Broadcasting)
3. **WebSocket en production** : Comprendre les défis du temps réel (latence, reconnexion, gestion d'état)
4. **Architecture scalable** : Concevoir une structure qui puisse évoluer (séparation API/frontend, tokens stateless)

### Dimension personnelle
Je recherche régulièrement des services locaux (bricolage, cours particuliers, aide déménagement) et j'ai constaté que les plateformes existantes sont souvent **trop complexes ou peu ergonomiques**. Voiloo répond à ce besoin avec une interface épurée et intuitive.
C'est aussi pour créer une plateforme qui serait pour moi utile à beaucoup de personne qui souhaite avoir une visibilité facile sur internet.
---

## 🏆 Challenge — Difficultés techniques & fonctionnalités avancées

### 1. WebSocket temps réel avec Laravel Reverb ⚡

**Difficulté** : Mise en place d'un système de messagerie instantanée fiable

**Défis rencontrés** :
- **Authentification WebSocket** : Sécuriser les channels privés avec Sanctum (Bearer token + Broadcasting policies)
- **Gestion des événements** : `ShouldBroadcast` vs `ShouldBroadcastNow` pour éviter les délais
- **Prévention des doublons** : Optimistic updates + réception Echo
- **Notifications multi-conversations** : Écouter toutes les conversations simultanément pour les badges de non-lus

**Solutions implémentées** :

```php
// Event broadcast instantané
class MessageSent implements ShouldBroadcastNow {
    public function broadcastOn(): array {
        return [new PrivateChannel('conversation.' . $this->message->conversation_id)];
    }
}
```

```typescript
// Gestion TypeScript avec Echo
const echo = getEcho();
echo.private(`conversation.${conversationId}`)
    .listen('.MessageSent', (e: { message: Message }) => {
        // Éviter doublons + mise à jour state
    });
```

### 2. Architecture API REST + Separation of Concerns 🏗️

**Difficulté** : Découplage complet frontend/backend

**Stack** :
- **Backend** : Laravel 12 API-only (aucune vue Blade pour l'instant)
- **Frontend** : Next.js 14 App Router en mode SSR/CSR hybride
- **Communication** : Headers `Authorization: Bearer` + CORS configuré

**Défis** :
- Double authentification (cookie HttpOnly + localStorage token) pour compatibilité WebSocket
- Gestion des erreurs 401 (token expiré → logout automatique + redirect)
- Typage TypeScript des réponses API
- Rate limiting sur les endpoints sensibles

### 3. Géolocalisation & recherche par proximité 📍

**Difficulté** : Calcul de distance et performances

**Implémentation** :
- Stockage lat/lng en base de données
- Utilisation de la **formule de Haversine** pour le calcul de distance
- Indexation des colonnes lat/lng pour optimiser les requêtes
- Fallback sur recherche par ville si géolocalisation refusée

**Code SQL optimisé** :
```sql
SELECT *, 
    (6371 * acos(
        cos(radians(?)) * cos(radians(lat)) * 
        cos(radians(lng) - radians(?)) + 
        sin(radians(?)) * sin(radians(lat))
    )) AS distance
FROM annonces
HAVING distance < ?
ORDER BY distance;
```

### 4. Upload & gestion d'images optimisées 🖼️

**Difficulté** : Performances et UX

**Fonctionnalités** :
- Upload multi-fichiers avec preview instantané
- Compression côté serveur (intervention/image)
- Stockage sur disque local (migration S3 prévue)
- Composant `StorageImage` custom pour gestion des erreurs 404
- Drag & drop + suppression d'images

### 5. Système de permissions granulaires 🔐

**Difficulté** : Sécuriser les actions utilisateur

**Logique métier** :
- Un utilisateur ne peut **modifier/supprimer** que ses propres annonces
- Les conversations sont **privées** (vérification `user_one_id` ou `user_two_id`)
- Broadcasting Policy pour Echo :

```php
public function join(User $user, int $conversationId): bool {
    $conv = Conversation::find($conversationId);
    return $conv->user_one_id === $user->id 
        || $conv->user_two_id === $user->id;
}
```

### 6. Vitrine personnalisable par annonce 🎨

**Difficulté** : Permettre la customisation sans compromettre la cohérence

**Implémentation** :
- Table `vitrine_configs` liée aux annonces
- Sélecteur de couleurs (couleur principale, texte, fond)
- Preview en temps réel
- CSS variables dynamiques :

```tsx
<div style={{
    '--primary': config.couleur_principale,
    '--text': config.couleur_texte
} as React.CSSProperties}>
```

### 7. Gestion d'état complexe côté frontend 🔄

**Difficulté** : Synchroniser état local + API + WebSocket

**Architecture** :
- **AuthContext** : Gestion globale de l'utilisateur connecté
- **State local** : Messages, conversations, typing indicators
- **Optimistic updates** : Feedback immédiat puis validation serveur
- **Cleanup** : Déconnexion Echo au démontage des composants

---

## 🛠️ Stack technique complète

### Frontend

| Technologie | Usage |
|-------------|-------|
| **Next.js 14** | Framework React SSR/CSR |
| **TypeScript** | Typage statique |
| **Tailwind CSS** | Styling utility-first |
| **Laravel Echo** | Client WebSocket |
| **Pusher.js** | Protocol Reverb |

### Backend

| Technologie | Usage |
|-------------|-------|
| **Laravel 12** | Framework PHP |
| **Sanctum** | Authentification API |
| **Reverb** | WebSocket server |
| **MySQL** | Base de données |
| **Eloquent ORM** | Gestion BDD |

### DevOps

| Technologie | Usage |
|-------------|-------|
| **Git/GitHub** | Versioning |
| **Infomaniak** | Hébergement production |
| **Composer** | Dépendances PHP |
| **npm** | Dépendances JS |

---

## 📊 Compétences mobilisées (référentiel BUT)

### ✅ Algorithmique et programmation
- Algorithme de Haversine pour calcul de distance
- Gestion de files d'attente (queue system)
- Logique métier complexe (conversations, permissions)

### ✅ Intégration web (HTML/CSS/JS)
- Interface responsive mobile-first
- Animations CSS (typing indicator, loaders)
- Interactions avancées (drag & drop, live search)

### ✅ Développement web (PHP)
- Laravel 12 avec architecture MVC
- API RESTful (CRUD complet)
- Middleware et policies

### ✅ Programmation Orientée Objet
- Models Eloquent avec relations (hasMany, belongsTo)
- Events & Listeners
- Service classes (ex: GeocodingService)

### ✅ Base de données
- Schéma relationnel normalisé (3NF)
- Migrations Laravel
- Requêtes optimisées (eager loading, indexation)
- Soft deletes et timestamps

### ✅ Hébergement
- Déploiement sur serveur Linux
- Configuration NGINX/Apache
- HTTPS avec certificat SSL
- Variables d'environnement sécurisées

---

## 🌐 Accès au projet

### URL de production
- **Site web** : [https://voiloo.fr](https://voiloo.fr)
- **API** : [https://api.voiloo.fr](https://api.voiloo.fr)

### Dépôt Git
- **Repository** : [https://github.com/devann/voiloo](https://github.com/Devannblr/Voiloo)
- **Accès** : Public

### Identifiants de test
Pour tester le système de messagerie, vous pouvez utiliser :
- **Compte 1** : `devann.test@voiloo.fr` / `Password123*`
- **Compte 2** : `user.test@voiloo.fr` / `Password123*`
Ou vous pouvez aussi créer le votre :
- **Compte 3** : `votre@mail.fr` / `VotrePassword123*`

*(Ces comptes permettent de tester le chat en temps réel entre 2 utilisateurs)*

### Installation locale

```bash
# Backend Laravel
git clone [repo-url]
cd voiloo-back
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
php artisan reverb:start

# Frontend Next.js
cd ../voiloo-front
npm install
cp .env.example .env.local
npm run dev
```

**Accès local** :
- Frontend : http://localhost:3000
- Backend : http://localhost:8000
- Reverb : ws://localhost:8080

---

## 📈 Évolutions futures

1. **Système de paiement** : Intégration Stripe pour transactions sécurisées
2. **Notifications push** : Firebase Cloud Messaging pour alertes mobiles
3. **Calendrier de disponibilités** : Réservation de créneaux horaires
4. **Système de badges** : Utilisateurs vérifiés, top prestataires
5. **Système de commande** : Ajout d'une commande pour voir l'avancée
6. **Export PDF** : Génération automatique de factures
7. **Multilingue** : i18n (FR/EN/ES)
8. **Application mobile** : React Native pour iOS/Android
9. **Analytics** : Dashboard statistiques pour prestataires

---

## ✅ État d'avancement

- [x] Authentification complète (inscription, login, reset password, vérification email)
- [x] CRUD annonces avec upload multi-images
- [x] Recherche avancée + géolocalisation
- [x] Carte interactive avec marqueurs
- [x] Messagerie temps réel (WebSocket)
- [x] Système d'avis et notation
- [x] Vitrine personnalisable par annonce
- [x] Interface responsive mobile
- [x] Déploiement production
- [ ] Notifications push *(prévu Q2 2026)*
- [ ] Paiement en ligne *(prévu Q2 2026)*

---


## 🎓 Conclusion

Ce projet m'a permis de mettre en pratique l'ensemble des compétences acquises durant le BUT MMI, tout en allant au-delà du programme avec des technologies modernes demandées par le marché (React, TypeScript, WebSocket).

La réalisation de Voiloo m'a confronté à des **problématiques réelles** : architecture scalable, performance, sécurité, expérience utilisateur. Chaque fonctionnalité a nécessité une réflexion approfondie et une implémentation rigoureuse.

Je suis particulièrement fier du **système de messagerie temps réel**, qui représente le défi technique le plus complexe du projet, et de l'**architecture API REST** qui permet une évolution future vers une application mobile.

---

**Signature** : Devann Billereau  
**Date** : 26 février 2026

---

> 💡 **Note aux correcteurs** : Ce document est hébergé sur GitHub à l'adresse [lien-github](https://github.com/Devannblr/Voiloo/) et peut être consulté avec une mise en forme optimale. Le code source complet est accessible.
