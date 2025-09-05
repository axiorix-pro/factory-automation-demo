# Factory Automation Demo - Productivité x10

🌐 **[Démo en ligne](https://axiorix-pro.github.io/factory-automation-demo/)**

[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://axiorix-pro.github.io/factory-automation-demo/) ![Tech](https://img.shields.io/badge/tech-Three.js%20%2B%20GSAP-blue) ![Platform](https://img.shields.io/badge/platform-web-orange) ![License](https://img.shields.io/badge/license-proprietary-red)

---

## 📌 Description

Cette démonstration combine **Three.js** et **GSAP** pour illustrer de façon claire et fluide le passage **Manuel → Semi‑Auto → Full Auto** dans un atelier fictif. Pensée pour des tests techniques : **pur front‑end**, sans backend, 100% responsive et optimisée mobile.

---

## ✨ Fonctionnalités principales

* **Visualisation 3D temps réel** : tapis, robots, produits, effets visuels.
* **Trois états interactifs** : Manuel, Semi‑Auto, Full Auto (via clics ou touches 1/2/3).
* **HUD métriques** dynamiques : Production/min, Efficacité, Erreurs/h, Coût/unité.
* **Accessibilité** intégrée (`prefers-reduced-motion`, focus visibles, ARIA live).
* **Performance** : GSAP timelines, rendu WebGL, optimisation mobile (ombres dynamiques).
* **Fallback** si WebGL est indisponible (message clair + aide).

---

## ⚙️ Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/axiorix0/factory-automation-demo.git
cd factory-automation-demo

# Ouvrir dans un navigateur récent
# Double-cliquez sur index.html
# Ou via serveur local si problème CORS :
npx serve .
```

📌 **Aucun build, aucune dépendance** : tout est chargé via CDN.

---

## 📂 Structure du projet

```
factory-automation-demo/
│
├── index.html                 # Point d'entrée
├── README.md                  # Documentation
├── assets/
│   ├── css/
│   │   └── styles.css         # Styles modulaires (mobile‑first)
│   ├── js/
│   │   ├── main.js            # Bootstrap + init
│   │   ├── factory.js         # Scène Three.js (robots, produits, effets)
│   │   ├── ui.js              # HUD + transitions d'état
│   │   └── utils.js           # Helpers, check WebGL
│   └── models/                # (Optionnel) modèles 3D
└── .gitignore                 # Exclusions
```

💡 Pour versionner `models/` vide : ajoutez un fichier **`.gitkeep`**.

---

## 🎮 Contrôles

* **1** → Manuel
* **2** → Semi‑Auto
* **3** → Full Auto
* **Clic HUD** → mêmes effets

---

## 📱 Compatibilité

* Chrome, Firefox, Edge, Safari (dernières versions)
* Desktop, Tablette, Mobile
* Fallback si WebGL désactivé/non supporté

---

## 🧩 Technologies

* **Three.js** → rendu 3D
* **GSAP (core)** → animations fluides
* **HTML5 / CSS3 / JavaScript pur** → aucune dépendance supplémentaire

---

## 🔒 Accessibilité & Vie privée

* WCAG 2.1 (bases) : contraste, focus, live regions
* Support de `prefers-reduced-motion`
* **0 backend**, aucun cookie, aucune collecte de données

---

## 🧾 Mentions

* Crédits : Three.js (MIT), GSAP core (licence GreenSock)
* Droits : © Axiorix — **Démo uniquement, tous droits réservés**
* Contact : [Formulaire de contact](https://www.axiorix.com/#contact)

---

Ce code est fourni à titre éducatif uniquement. © 2025 – Aucun lien avec une entreprise spécifique.

## 🤝 Auteur

**Axiorix** — Cas pratiques & formations IA pour **PME suisses**  
🌐 [https://www.axiorix.com/](https://www.axiorix.com/)
