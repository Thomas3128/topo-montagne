# La montagne vue par Dijs

Site personnel de topos d'alpinisme et de randonnée en montagne, avec les récits qui vont avec.
Construit pour avoir un endroit à moi pour partager les courses, les itinéraires, et les bons souvenirs — sans dépendre d'une plateforme tierce.

## Stack

- **Next.js 15** (App Router) — migré depuis Astro pour pouvoir ajouter du backend par la suite
- **MDX** — les topos et récits sont écrits en Markdown avec du JSX pour les éléments interactifs
- **Leaflet + leaflet-gpx** — cartes interactives avec affichage du tracé GPX
- **jsPDF** — export PDF du topo avec mise en forme (titres, gras, liens, stats GPX)
- **TypeScript**

## Structure

```
content/
  topos/          # Topos techniques (itinéraire, fiche, infos pratiques)
  recits/         # Récits de courses (narration, ambiance)

app/
  topos/[slug]/   # Page d'un topo
  recits/[slug]/  # Page d'un récit

components/
  MapClient.tsx       # Carte Leaflet (client-side)
  TopoInfoPanel.tsx   # Stats GPX + profil altimétrique + fiche technique
  DownloadButtons.tsx # Export PDF et téléchargement GPX

public/
  gpx/            # Fichiers GPX des courses
  images/         # Photos
```

## Ajouter un topo

Créer `content/topos/mon-topo.mdx` avec le frontmatter :

```yaml
---
title: "Nom de la course"
description: "Courte description"
pubDate: 'May 26 2026'
heroImage: '/images/ma-photo.jpg'
gpxPath: '/gpx/ma-course.gpx'
recitSlug: 'mon-recit'          # optionnel — pointe vers content/recits/
braUrl: 'https://...'           # optionnel — lien vers le BRA Météo France
ficheTechnique:
  - label: "Sommet"
    value: "Nom du sommet"
  - label: "Altitude max"
    value: "3 000 m"
---
```

Puis écrire le contenu en Markdown sous le frontmatter.

## Ajouter un récit

Créer `content/recits/mon-recit.mdx` :

```yaml
---
title: "Titre du récit"
topoSlug: "mon-topo"   # lien retour vers le topo
pubDate: 'May 26 2026'
heroImage: '/images/ma-photo.jpg'
---
```

## Commandes

```bash
npm install       # installer les dépendances
npm run dev       # lancer le serveur local → localhost:3000
npm run build     # build de production
npm run start     # démarrer le build en local
```
