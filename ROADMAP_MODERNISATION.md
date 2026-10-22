# Roadmap de Modernisation

## 1. Objectif

Faire évoluer le projet actuel vers une architecture professionnelle, maintenable et securisee, en conservant le style visuel existant, avec :

- PostgreSQL pour la base de donnees
- Laravel pour l'API et le back-office metier
- React pour le front public et l'interface d'administration
- Une separation claire des responsabilites pour limiter les impacts entre composants
- Une base solide pour la securite, les tests, le deploiement et la maintenance

## 2. Etat actuel du projet

Le projet actuel est un front statique avec logique embarquee dans le navigateur.

### 2.1 Fichiers existants

- `index.html` : site public en pseudo-SPA, rendu via JavaScript et templates HTML en chaine
- `dashboard.html` : mini CMS local en JavaScript, stockage via `localStorage`
- `login.html` : ecran de connexion de demonstration, sans vraie authentification serveur
- `content.js` : registre global de contenus partages entre le site public et le dashboard

### 2.2 Constats structurants

- Pas de backend reel
- Pas de base de donnees
- Pas d'authentification securisee
- Persistance locale uniquement via `localStorage` et `sessionStorage`
- Couplage fort entre donnees, rendu, navigation et interface
- Quelques branches de routage dupliquees dans le front public
- Une partie du contenu editorial est partagee, mais la partie sportive reste surtout statique

### 2.3 Risques actuels

- Perte de donnees selon le navigateur ou la machine
- Aucune vraie gestion des roles et permissions
- Aucune traçabilite serveur
- Pas de journalisation securisee
- Pas de strategie de tests automatique
- Evolutivite limitee

## 3. Vision cible

## 3.1 Architecture cible

Adopter une architecture en couches avec separation nette :

- `apps/api` : application Laravel
- `apps/web` : application React pour le site public
- `apps/admin` : application React pour l'administration, ou un seul front React avec zones separees selon les besoins
- `database` : PostgreSQL
- `storage` : fichiers applicatifs, exports, images, journaux techniques, idealement sur disque dedie ou stockage objet

### Option recommandee

Utiliser un monorepo simple :

```text
project-root/
  apps/
    api/        # Laravel
    web/        # React public
    admin/      # React admin
  docs/
  infra/
  scripts/
```

Si vous voulez reduire la complexite initiale, vous pouvez commencer par :

- un seul backend Laravel
- un seul frontend React
- deux zones logiques dans le front : public et admin

## 3.2 Principes de conception

- Couplage faible entre front, API et base
- Architecture modulaire par domaine
- API versionnee
- Composants UI reutilisables
- Regles de securite appliquees cote serveur en priorite
- Migration progressive pour ne pas casser l'existant d'un seul coup

## 4. Strategie de migration recommandee

Il ne faut pas tout re-ecrire en une seule etape. La strategie la plus sure est une migration par paliers.

### Phase 0. Cadrage et decisions

Objectif : verrouiller l'architecture et les regles de travail.

Actions :

- Definir les environnements : local, test, preproduction, production
- Choisir la structure du depot : mono repo recommande
- Definir les conventions de nommage, structure de dossiers et standards de code
- Definir les domaines metier :
  - authentification
  - utilisateurs
  - roles et permissions
  - clubs
  - joueurs
  - matchs
  - saisons
  - classements
  - articles
  - episodes TV
  - magazines
  - publicites
  - favoris et preferences utilisateur
- Identifier les donnees a conserver depuis le projet actuel
- Rediger un mapping complet entre les pages actuelles et les futures routes React

Livrables :

- schema d'architecture
- conventions de code
- backlog de migration
- dictionnaire de donnees

### Phase 1. Extraction du design system existant

Objectif : garder le meme style tout en rendant l'UI maintenable.

Actions :

- Extraire les tokens de design actuels :
  - couleurs principales
  - typographies
  - espacements
  - rayons
  - ombres
  - styles de cartes
  - styles de badges
  - variantes de boutons
- Formaliser ces tokens dans un theme React
- Reproduire les composants structurants existants :
  - header
  - sidebar
  - cartes
  - tableaux
  - blocs stats
  - panneaux admin
  - modales
  - toasts
  - fiches club/joueur
- Creer une librairie de composants interne

Bonnes pratiques :

- Conserver les memes codes couleurs pour l'identite
- Eviter de recopier la logique HTML inline actuelle
- Transformer le style en composants et en tokens reutilisables

### Phase 2. Mise en place du backend Laravel

Objectif : creer une base saine pour les donnees et la securite.

Actions :

- Initialiser une application Laravel recente
- Configurer PostgreSQL
- Configurer les environnements `.env`
- Mettre en place :
  - migrations
  - seeders
  - factories
  - Form Requests
  - Policies
  - Resources API
  - gestion des exceptions
  - journalisation structuree
- Installer un systeme de roles et permissions

Recommandations Laravel :

- Authentification SPA : Laravel Sanctum
- Roles et permissions : package mature de type Spatie Permission
- Validation : Form Requests sur chaque point d'entree critique
- Serialisation API : API Resources
- Metiers complexes : Services ou Actions par domaine

### Phase 3. Modelisation PostgreSQL

Objectif : normaliser les donnees metier.

Tables de base recommandees :

- `users`
- `roles`
- `permissions`
- `clubs`
- `stadiums`
- `players`
- `seasons`
- `competition_groups`
- `matches`
- `match_events`
- `standings`
- `articles`
- `article_categories`
- `media_items`
- `magazines`
- `ads`
- `favorites`
- `audit_logs`
- `api_tokens` ou tables Sanctum

Relations principales :

- un club appartient a un stade
- un joueur appartient a un club a un instant donne
- une saison possede des groupes, des matchs et des classements
- un match relie deux clubs
- un article peut etre lie a plusieurs entites metier
- un utilisateur peut avoir plusieurs roles

Bonnes pratiques PostgreSQL :

- utiliser des cles etrangeres partout ou c'est pertinent
- ajouter des index sur : slug, email, date, season_id, club_id, status
- utiliser des contraintes d'unicite
- journaliser les changements importants
- prevoir des colonnes `created_at`, `updated_at`, `deleted_at`

### Phase 4. Conception de l'API

Objectif : isoler le front de la base et rendre le systeme evolutif.

### 4.1 Style API recommande

- REST versionnee : `/api/v1/...`
- Auth par cookies securises avec Sanctum pour la SPA admin
- Pagination partout pour les listes
- Filtres, tris et recherche serveur
- Format de reponse uniforme

Exemples de ressources :

- `GET /api/v1/articles`
- `POST /api/v1/articles`
- `GET /api/v1/clubs`
- `GET /api/v1/clubs/{id}`
- `GET /api/v1/matches`
- `GET /api/v1/standings?season=2025-2026`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/me`

### 4.2 Decoupage par domaines

Ne pas construire une API geante sans limites. Organiser par modules :

- Auth
- Users
- Editorial
- Competition
- Media
- Ads
- Preferences
- Audit

### 4.3 Regles de robustesse

- validation stricte en entree
- codes HTTP coherents
- erreurs homogenes
- rate limiting sur auth, recherche et operations sensibles
- soft delete sur les contenus quand c'est justifie

### Phase 5. Construction du front React

Objectif : remplacer les fichiers HTML monolithiques par un front modulaire.

### 5.1 Stack recommandee

- React avec Vite
- TypeScript recommande
- React Router pour les routes
- TanStack Query pour la couche data
- React Hook Form pour les formulaires
- Zod pour la validation front si souhaite
- Tailwind CSS si vous voulez conserver la logique visuelle actuelle facilement

### 5.2 Arborescence recommandee

```text
apps/web/src/
  app/
  routes/
  features/
    home/
    articles/
    clubs/
    players/
    matches/
    standings/
    media/
    auth/
  components/
  layouts/
  services/
  lib/
  styles/
  types/
```

Pour l'admin :

```text
apps/admin/src/
  app/
  routes/
  features/
    dashboard/
    articles/
    clubs/
    players/
    matches/
    seasons/
    media/
    ads/
    users/
    roles/
  components/
  services/
  guards/
```

### 5.3 Mapping avec l'existant

Pages publiques a migrer :

- accueil
- actualites
- article detail
- matchs et resultats
- direct
- classement
- clubs
- fiche club
- joueurs
- fiche joueur
- TV
- magazine
- data center
- records
- power ranking
- supporters
- carte
- recherche
- espace utilisateur

Pages admin a migrer :

- vue d'ensemble
- activite recente
- gestion articles
- gestion matchs
- gestion clubs
- gestion joueurs
- gestion saisons
- gestion media
- gestion publicites
- gestion utilisateurs
- gestion roles et permissions

### 5.4 Composants critiques a factoriser

- `AppShell`
- `PublicHeader`
- `PublicSidebar`
- `AdminShell`
- `DataTable`
- `EntityForm`
- `StatCard`
- `ContentCard`
- `MatchCard`
- `StandingsTable`
- `ToastProvider`
- `Modal`

## 5. Maintenabilite sans effet domino

Pour eviter qu'une modification casse d'autres composants :

### 5.1 Regles d'isolation

- un module = un domaine fonctionnel
- un composant ne doit pas connaitre les details SQL ou HTTP
- la couche UI ne doit pas contenir de logique metier lourde
- la logique metier du backend doit etre dans des services dedies
- les contrats API doivent etre documentes et testes

### 5.2 Contrats stables

- DTO ou Resources cote Laravel
- types TypeScript generes ou maintenus proprement cote React
- conventions de payload standardisees

### 5.3 Eviter les regressions

- tests unitaires backend
- tests d'integration API
- tests composant front
- tests end-to-end sur parcours critiques
- pipeline CI obligatoire avant mise en production

## 6. Securite : exigences minimales

La securite doit etre pensee des le depart, pas a la fin.

### 6.1 Authentification

- Laravel Sanctum pour SPA
- cookies `HttpOnly`, `Secure`, `SameSite`
- rotation de session apres connexion
- expiration de session admin
- protection contre brute force
- 2FA pour comptes administrateurs si possible

### 6.2 Autorisation

- roles et permissions fines
- Policies Laravel par ressource
- verification systematique cote serveur
- masquer les actions interdites dans l'UI, mais surtout les bloquer en backend

### 6.3 Validation et sanitation

- valider toutes les entrees avec Form Requests
- echapper les contenus rendus
- nettoyer les champs riches si vous ajoutez un editeur HTML
- verifier les fichiers uploades : type, taille, extension, antivirus si pertinent

### 6.4 Protection applicative

- CSRF si auth par session/cookies
- rate limiting sur login, reset password, recherche et endpoints sensibles
- headers de securite : CSP, X-Frame-Options, Referrer-Policy, X-Content-Type-Options
- CORS strict si front et API sont separes par domaine
- desactiver les messages d'erreur verbeux en production

### 6.5 Securite base de donnees

- utilisateur PostgreSQL dedie par environnement
- droits minimaux
- sauvegardes automatisees
- tests de restauration
- chiffrement des secrets hors du code
- rotation des mots de passe d'acces infrastructure

### 6.6 Traçabilite

- audit logs pour connexions et actions admin critiques
- journalisation des suppressions, publications et changements de roles
- centralisation des logs si possible

## 7. Plan de donnees et migration de l'existant

Le projet actuel contient des donnees en dur dans le front. Elles doivent etre migrees proprement.

### 7.1 Sources a migrer

- contenus editoriaux depuis `content.js`
- donnees sportives depuis `index.html`
- donnees de demonstration admin depuis `dashboard.html`

### 7.2 Methode recommandee

- creer un script de seed initial
- convertir les tableaux statiques en jeux de donnees structures
- attribuer des slugs stables
- normaliser les noms d'equipes, saisons, groupes et statuts
- charger d'abord les references : saisons, clubs, stades
- charger ensuite joueurs, matchs, classements, contenus media

### 7.3 Point d'attention

Certaines donnees actuelles sont purement demo ou editoriales. Il faut les marquer explicitement :

- donnees reelles
- donnees de demonstration
- donnees archivees
- donnees a verifier

## 8. Maintien du style actuel

Le style actuel fait deja apparaitre une identite claire. Il faut la conserver, mais la formaliser.

### 8.1 A conserver

- palette couleur actuelle
- ambiance editoriale sport premium
- typographies Manrope et Sora ou equivalent valide
- cartes, badges, hero sections, tableaux et blocs data
- logique dark mode

### 8.2 A ameliorer

- uniformiser les espacements
- supprimer les redondances CSS
- transformer les styles inline en composants themables
- creer un systeme de design token central
- harmoniser les etats hover, active, disabled, loading, error

### 8.3 Resultat attendu

Le nouveau produit doit paraitre visuellement familier, mais techniquement plus propre, plus coherent et plus robuste.

## 9. Ameliorations fonctionnelles recommandees

Au-dela de la migration technique, voici les ameliorations a forte valeur.

### 9.1 Cote public

- vraie recherche multi-entites
- filtres serveur sur articles, matchs, clubs, joueurs
- pages detail plus riches reliees aux vraies donnees
- SEO propre pour les contenus publics
- sitemap et metadonnees dynamiques
- gestion d'images optimisee
- favoris utilisateur persistants serveur

### 9.2 Cote admin

- brouillon, publication, archivage
- historique des modifications
- previsualisation avant publication
- workflow editorial simple
- tableaux filtres, tries, pagines
- export CSV/Excel pour la data competition
- tableau d'audit des actions sensibles

### 9.3 Cote exploitation

- supervision des erreurs
- monitoring API
- dashboards techniques
- backup automatise
- cron jobs pour consolidation de donnees

## 10. SEO et performance

### 10.1 SEO

Le site public doit etre pense pour le referencement.

Recommandations :

- pre-render ou SSR si besoin SEO fort
- balises meta dynamiques
- URLs propres avec slugs
- Open Graph et Twitter Cards
- sitemap.xml
- robots.txt propre
- schema.org pour articles et contenus media

### 10.2 Performance

- lazy loading des pages et composants lourds
- images optimisees
- requetes API paginees et cachees
- caching HTTP cote API pour les contenus publics si pertinent
- CDN pour assets statiques en production

## 11. Tests et assurance qualite

### Backend

- tests unitaires des services
- tests feature Laravel pour l'API
- tests d'autorisations
- tests de validation

### Frontend

- tests unitaires des composants critiques
- tests d'integration des pages principales
- tests des formulaires admin

### End-to-end

- connexion admin
- creation d'article
- publication d'un contenu
- consultation publique du contenu
- filtre classement/matchs

## 12. DevOps et deploiement

### Environnements

- local
- integration
- preproduction
- production

### CI/CD recommande

- lint backend et frontend
- tests backend et frontend
- build React
- migration base controlee
- deploiement automatise avec rollback possible

### Infrastructure minimale

- Nginx
- PHP-FPM
- PostgreSQL
- Node pour build
- HTTPS obligatoire
- stockage de secrets hors du depot

## 13. Ordre de realisation recommande

### Etape 1

Creer la documentation d'architecture, le dictionnaire de donnees et le mapping des pages actuelles.

### Etape 2

Initialiser Laravel + PostgreSQL + auth + roles/permissions.

### Etape 3

Creer les schemas de base : users, roles, clubs, seasons, matches, articles, media.

### Etape 4

Migrer les contenus de `content.js` vers la base et exposer les premiers endpoints API.

### Etape 5

Construire le design system React qui reprend le style actuel.

### Etape 6

Migrer d'abord le front public en React, page par page, avec les vraies donnees API.

### Etape 7

Migrer ensuite le dashboard vers React admin branche sur l'API.

### Etape 8

Ajouter les tests, les audits de securite et les optimisations SEO/performance.

### Etape 9

Basculer progressivement en production avec validation fonctionnelle a chaque palier.

## 14. Choix techniques recommandes

### Backend

- Laravel recent
- PHP recent et supporte
- PostgreSQL
- Sanctum
- Spatie Permission
- API Resources

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- React Hook Form

### Qualite

- ESLint
- Prettier
- Pint cote Laravel
- PHPUnit ou Pest
- tests E2E

## 15. Anti-patterns a eviter

- tout remettre dans un seul composant React geant
- faire des appels API directement partout dans les composants
- dupliquer la logique d'autorisation entre front et back sans source de verite serveur
- stocker des secrets dans le repo
- laisser les donnees de demonstration melangees avec la vraie production
- exposer des routes admin sans verification serveur
- migrer toute l'application en une seule livraison risquee

## 16. Premiere version cible realiste

Pour limiter le risque, la V1 cible recommandee est :

- API Laravel securisee
- PostgreSQL operationnel
- authentification admin reelle
- gestion des articles, medias, publicites et utilisateurs
- front public React pour accueil, actualites, article detail, clubs, joueurs, matchs, classement
- conservation du style visuel actuel

Le reste peut arriver en V2 :

- recherche avancee
- analytics
- favoris persistes serveur
- workflow editorial avance
- contenus premium, PDF, notifications, etc.

## 17. Conclusion

Le bon chemin n'est pas une simple conversion technique du HTML actuel vers React. Il faut transformer le projet en plateforme modulaire.

La cible recommandee est :

- Laravel comme coeur metier et de securite
- PostgreSQL comme source de verite
- React comme couche d'experience utilisateur
- un design system derive du style actuel
- une migration progressive, testee et securisee

Si cette roadmap est suivie par phases, vous obtiendrez un produit professionnel, plus sur, plus maintenable et plus evolutif, sans perdre l'identite visuelle du projet actuel.

## 18. Suite recommandee immediate

Avant de coder la nouvelle version, il faut produire trois documents complementaires :

- un schema de base de donnees detaille
- un schema des endpoints API
- un plan de migration page par page entre l'existant et React

Ces trois livrables permettront de lancer la refonte sans improvisation et sans couplage excessif.