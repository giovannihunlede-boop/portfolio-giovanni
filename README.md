# Portfolio React - Giovanni

Portfolio personnel de Giovanni, construit avec React, TypeScript et Vite. Le site présente les compétences, les projets et quatre démos interactives dans une interface glassmorphism responsive.

## État du projet

La migration de la première version est fonctionnelle :

- interface portfolio et navigation par ancres ;
- sections accueil, à propos, compétences, projets et contact ;
- démos FlowNote, Snake Game, TaskManager et Calculator ;
- persistance locale de FlowNote et TaskManager ;
- build de production Vite validé.

Le front est prêt pour la mise en ligne sur un espace statique. Le contact fonctionne par email et WhatsApp ; une connexion Brevo côté serveur pourra être ajoutée lorsque l'espace d'hébergement proposera un endpoint sécurisé.

## 🎯 Fonctionnalités

✅ **FlowNote** - Démo notes intelligente (React component)
✅ **Contact Form** - Prépare un email avec les informations saisies
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
cd portfolio-react
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```
Le site sera disponible sur `http://localhost:3000`

4. **Build pour la production**
```bash
npm run build
```

## 📮 Contact et Brevo

Le portfolio étant destiné à un hébergement statique, le formulaire ouvre actuellement la messagerie du visiteur avec un email prérempli. Les liens directs vers WhatsApp et l'adresse `giovannihunlede@gmail.com` restent toujours disponibles.

Pour utiliser Brevo plus tard, il faudra créer un petit endpoint côté serveur (sans exposer la clé API dans React), puis remplacer l'action `mailto:` du composant `ContactForm`.

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

## 🛠️ Technologies Utilisées

- **React 18** - Library UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rapide
- **CSS3** - Glassmorphism + animations
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

**Suite recommandée:** lancer `npm run build`, puis transférer le contenu de `dist/` sur l'espace serveur. Le nom de domaine pourra être relié ensuite via les DNS de l'hébergeur.
