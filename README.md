# 🛒 Zoom Market DZ - Marketplace Premium Algérie 🇩🇿

Plateforme e-commerce moderne, fluide et ultra-premium développée sur-mesure pour la marque **Zoom Market Dz**. 
Application Single Page (SPA) 100% statique construite avec **React, Vite et Tailwind CSS**, optimisée pour un hébergement gratuit et direct sur **GitHub Pages**.

---

## 🎨 Charte Graphique & Design System

- **Couleur Primaire (Bleu Nuit / Dark Navy) :** `#0A192F` / `#0F172A`
- **Couleur D'Accent (Orange Dynamique) :** `#FF5500` / `#FF6B00`
- **Fond :** `#F8FAFC` avec mode sombre dynamique (**Dark Mode** `#0B132B`).
- **Typographie :** Plus Jakarta Sans & Inter (Google Fonts).

---

## ⚡ Fonctionnalités Clés

### 1. Entête & Navigation Responsive
- Logo **Zoom Market Dz** avec panier orange et monogramme Z.
- **Recherche en temps réel** dans le catalogue par nom et description.
- Filtres dynamiques par catégories (High-Tech, Électronique, Mode, Maison, Beauté, Accessoires).
- Bouton d'accès rapide au **Panneau Administrateur** (création & gestion de produits).
- Sélecteur de thème **Mode Clair / Sombre**.
- **Tiroir Panier (Cart Drawer)** coulissant avec badge de quantité dynamique.

### 2. Catalogue Produit & Espace Admin (Client-Side)
- Grille responsive avec effets de survol (zoom doux), badges (Nouveau, Promo, Stock Limité) et notation d'avis.
- Modale d'aperçu rapide (**Quick View Lightbox**) avec sélecteur de quantité et récapitulatif des garanties.
- **Formulaire d'ajout de produit (Espace Admin) :**
  - Nom, Prix en DA, Ancien prix (barré), Catégorie, Badge et Description.
  - Upload direct d'image convertie en **Base64** ou saisie d'URL.
  - Sauvegarde et persistance dans le `localStorage` du navigateur.
  - Bouton de réinitialisation pour restaurer le jeu de données démo par défaut.

### 3. Panier & Formulaire de Commande Express (58 Wilayas)
- Gestion des quantités (+ / -) et suppression d'articles.
- **Menu déroulant des 58 Wilayas d'Algérie** avec calcul automatique et immédiat des frais de livraison (ex: Alger 400 DA, Oran 700 DA, Ghardaïa 1000 DA...).
- Formulaire client sécurisé avec validation du format de téléphone algérien (`05`, `06`, `07` + 8 chiffres).
- Calcul du sous-total, livraison et **Total Général en DZD**.

### 4. Notification des Commandes par Email & WhatsApp
- Intégration **EmailJS** pré-configurée pour envoyer un e-mail structuré directement à **marketdzzoom@gmail.com**.
- Canal de secours direct **WhatsApp** ("Commander via WhatsApp") ouvrant un message pré-rempli contenant tous les détails du client et des articles.
- Écran de confirmation avec animation **Confetti & Checkmark SVG**.

---

## 🚀 Installation & Lancement Local

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement local
npm run dev

# 3. Ouvrir dans le navigateur :
# http://localhost:5173
```

---

## ⚙️ Configuration de EmailJS (Pour recevoir les e-mails)

1. Créez un compte gratuit sur [EmailJS.com](https://www.emailjs.com/).
2. Ajoutez un service email (Gmail) et notez votre **Service ID**.
3. Créez un template d'email avec les variables suivantes et notez votre **Template ID** :
   - `{{customer_name}}`
   - `{{customer_phone}}`
   - `{{customer_wilaya}}`
   - `{{customer_address}}`
   - `{{order_details}}`
   - `{{total_amount}}`
4. Récupérez votre **Public Key** dans *Account Settings > API Keys*.
5. Sur le site Zoom Market Dz, cliquez sur l'icône **Engrenage / Paramètres** dans l'en-tête et saisissez vos 3 clés EmailJS. 
*(Les clés sont également sauvegardées localement).*

---

## 🌐 Déploiement Gratuit sur GitHub Pages

### Option A : Déploiement automatique via GitHub Actions (Recommandé)
Le fichier `.github/workflows/deploy.yml` est inclus.
1. Créez un dépôt sur GitHub et poussez le code sur la branche `main` :
   ```bash
   git init
   git add .
   git commit -m "Initial release Zoom Market Dz"
   git branch -M main
   git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/zoom-market-dz.git
   git push -u origin main
   ```
2. Sur GitHub, allez dans **Settings > Pages** et sous **Source**, choisissez **GitHub Actions**.
3. Le site sera automatiquement en ligne à l'adresse : `https://VOTRE_NOM_UTILISATEUR.github.io/zoom-market-dz/`

### Option B : Déploiement manuel via la commande `npm run deploy`
```bash
npm run deploy
```

---

## 📄 Licence
Développé exclusivement pour **Zoom Market dz** 🇩🇿.
