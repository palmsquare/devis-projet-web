# 🧾 Application de Devis Interactif pour Projets Web

Une application React moderne et interactive permettant aux clients de simuler le coût de leur projet web en temps réel.

## ✨ Fonctionnalités

- **Interface moderne et intuitive** avec animations fluides
- **Navigation étape par étape** avec possibilité de retour en arrière
- **Calcul du prix en temps réel** affiché en bas de page
- **Séparation des coûts fixes et mensuels**
- **Questions conditionnelles** qui s'adaptent aux choix de l'utilisateur
- **Icônes visuelles** pour chaque option
- **Validation des champs** obligatoires
- **Design responsive** adapté à tous les écrans

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Lancer l'application en mode développement :
```bash
npm run dev
```

3. Ouvrir votre navigateur à l'adresse affichée (généralement http://localhost:5173)

## 📦 Build pour la production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

## 🎨 Technologies utilisées

- **React 18** - Framework JavaScript
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes

## 📋 Étapes du questionnaire

1. **Informations de contact** - Email, Nom, Prénom
2. **Votre projet** - Nouveau site ou refonte
3. **Type de site** - Landing page (990€) ou Site vitrine (2490€)
4. **Nombre de pages** - Si site vitrine sélectionné
5. **Niveau de design** - Template ou sur mesure
6. **Fonctionnalités** - Si site vitrine sélectionné
7. **Délais** - Planning du projet
8. **Besoins complémentaires** - Services additionnels
9. **Informations supplémentaires** - Détails du projet

## 💰 Tarification

### Coûts fixes
- Landing page : 990€
- Site vitrine : 2490€
- Design sur mesure (landing page) : +1500€
- Design sur mesure (site vitrine) : +500€
- Paiement en ligne : +150€
- Newsletter : +150€
- Prise de rendez-vous : +50€
- Charte graphique : +500€
- Logo : +500€
- Nom de domaine : +10€

### Coûts mensuels
- Maintenance : +50€/mois
- TMA : +70€/mois
- Hébergement : +10€/mois
- SEO : +1200€/mois
- Publicité (ADS) : +500€/mois

## 🎯 Personnalisation

Pour modifier les prix ou ajouter des options, éditez le fichier `src/App.jsx` :
- Fonction `calculatePricing()` pour les calculs
- Composants individuels pour chaque étape

## 📝 Licence

Propriétaire - Tous droits réservés

