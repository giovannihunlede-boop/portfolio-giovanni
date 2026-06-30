# Portfolio React - Giovanni

Une migration moderne de votre portfolio en React + TypeScript avec Vite, conservant le design glassmorphism élégant et les démos interactives.

## 🎯 Fonctionnalités

✅ **FlowNote** - Démo notes intelligente (React component)
✅ **Contact Form** - Formulaire avec intégration Formspree
✅ **Modal Réutilisable** - Component modal propre et accessible
✅ **Glassmorphism Design** - Design moderne et fluide
✅ **TypeScript** - Type-safe et maintenable
✅ **Responsive** - Mobile-first design
✅ **localStorage** - Persistance des données locales

## 🚀 Installation

### Prérequis
- Node.js 16+ (https://nodejs.org)
- npm ou yarn

### Étapes

1. **Installer Node.js et npm** (si pas déjà fait)
```bash
# Sur Linux/Debian
sudo apt-get install nodejs npm

# Vérifier l'installation
node --version
npm --version
```

2. **Installer les dépendances**
```bash
cd /home/mr-hunlede/development/portfolio-react
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```
Le site ouvrira automatiquement sur `http://localhost:3000`

4. **Build pour la production**
```bash
npm run build
```

## 📝 Configuration Formspree

Pour activer l'envoi d'emails du formulaire de contact :

1. Aller sur [Formspree.io](https://formspree.io)
2. Créer un compte et un nouveau formulaire
3. Copier votre **Form ID** (format: `YOUR_FORMSPREE_ID`)
4. Ouvrir `src/components/ContactForm.tsx`
5. Remplacer :
```typescript
const FORMSPREE_ID = 'f/YOUR_FORMSPREE_ID' // TODO: Update
```
Par votre vrai ID, exemple :
```typescript
const FORMSPREE_ID = 'f/xyzabc123' 
```

## 📦 Structure du Projet

```
portfolio-react/
├── src/
│   ├── components/
│   │   ├── FlowNoteDemo.tsx    # Démo notes (React)
│   │   ├── ContactForm.tsx     # Formulaire contact
│   │   └── Modal.tsx           # Component modal réutilisable
│   ├── styles/
│   │   └── globals.css         # Styles glassmorphism
│   ├── App.tsx                 # Component principal
│   └── main.tsx                # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🎨 Personnalisation

### Couleurs (glassmorphism)
Modifier dans `src/styles/globals.css`:
- `#ff006e` - Rose primary
- `#00d9ff` - Cyan secondary
- `#0a0e27` - Dark background

### Texte Contact
Modifier dans `src/components/ContactForm.tsx`:
```typescript
<p>giovannihunlede@gmail.com</p>
<p>Lomé TOGO</p>
```

## 🔄 Migration des Autres Projets

Pour ajouter les autres démos (Snake, TaskManager, Calculator), créer des composants similaires:

```typescript
// src/components/SnakeDemoGame.tsx
import React, { useState } from 'react'

const SnakeDemoGame: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  // Game logic here
  return (
    <div className={`demo-modal ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Modal content */}
    </div>
  )
}

export default SnakeDemoGame
```

## 📖 Documentation Formspree

https://formspree.io/docs/

## 🛠️ Technologies Utilisées

- **React 18** - Library UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rapide
- **CSS3** - Glassmorphism + animations
- **Formspree** - Email backend
- **localStorage API** - Persistance données

## 📱 Conseil pour Hébergement

Après build, déployer sur :
- **Netlify** (recommandé, gratuit)
- **Vercel** (optimisé pour React)
- **GitHub Pages** (simple, gratuit)

Exemple Netlify :
```bash
npm run build
# Drag & drop le dossier 'dist' sur netlify.com
```

## 📞 Support

Si problème npm, essayer :
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

**Prochains projets à migrer:** Snake Game, TaskManager, Calculator (même approche avec Canvas/HTML et localStorage)
