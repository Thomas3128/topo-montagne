# L'appel des terres hautes

Site personnel de topos d'alpinisme et de randonnée en montagne, avec les récits qui vont avec.
Construit pour avoir un endroit à moi pour partager les courses, les itinéraires, et les bons souvenirs — sans dépendre d'une plateforme tierce.

## Stack

- **Next.js 15** (App Router, pages générées statiquement) — migré depuis Astro pour pouvoir ajouter du backend par la suite
- **MDX** — les topos et récits sont écrits en Markdown avec du JSX pour les éléments interactifs
- **Leaflet + leaflet-gpx** — cartes interactives avec affichage du tracé GPX
- **jsPDF** — export PDF du topo avec mise en forme (titres, gras, liens, stats GPX)
- **TypeScript**

L'authentification et les commentaires (Supabase) vivent sur la branche `dev_dynamic-db` ; `main` reste un site statique.

## Structure

```
content/
  topos/          # Topos techniques (itinéraire, fiche, infos pratiques)
  recits/         # Récits : un fichier .mdx, ou un dossier multi-jours (voir plus bas)
  lectures/       # Fiches de lecture (onglet « Lectures » de /recits)
  annexes/        # Pages annexes en MDX (aide)

app/
  topos/[slug]/   # Page d'un topo
  recits/[slug]/  # Page d'un récit

components/
  mdx/                # Composants utilisables dans le MDX (Photo, Gallery, Attention…)
  MapClient.tsx       # Carte Leaflet (client-side)
  TopoInfoPanel.tsx   # Stats GPX + profil altimétrique + fiche technique
  DownloadButtons.tsx # Export PDF et téléchargement GPX
  JourProvider.tsx    # Jour sélectionné (synchronisé avec l'URL : #jour-3)

lib/
  topos.ts, recits.ts, lectures.ts  # Lecture du contenu
  gpx.ts                            # Chargement (mis en cache) et analyse des GPX

public/
  gpx/            # Fichiers GPX des courses
  images/         # Photos
  documents/      # PDF annexes
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
gpxColor: '#bc6c25'             # optionnel — couleur du tracé
recitSlug: 'mon-recit'          # optionnel — pointe vers content/recits/
braUrl: 'https://...'           # optionnel — lien vers le BRA Météo France
ficheTechnique:
  - label: "Sommet"
    value: "Nom du sommet"
  - label: "Altitude max"
    value: "3 000 m"
---
```

Champs optionnels pour la colonne de gauche : `transport` (accès en transports en commun) et `route` (étapes de l'itinéraire) — voir `content/topos/vignemale.mdx`.

### Topo sur plusieurs jours

Ajouter une liste `jours` : chaque jour peut avoir sa photo, sa trace et sa fiche technique
(à défaut, ce sont les valeurs globales du topo qui s'affichent). Le texte de chaque jour
est placé dans un bloc `<Jour n={N}>` — voir `content/topos/tour-des-ecrins.mdx`.

```yaml
jours:
  - titre: "Départ → Refuge"
    heroImage: '/images/j1.jpg'
    gpxPath: '/gpx/j1.gpx'
    ficheTechnique:
      - label: "Durée estimée"
        value: "4 h"
```

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

### Récit sur plusieurs jours

Créer un dossier `content/recits/mon-recit/` contenant :

- `_meta.mdx` — le frontmatter du récit (title, topoSlug, pubDate, heroImage) ;
- un fichier par jour, trié par nom (`01-xxx.mdx`, `02-xxx.mdx`…), avec `titre`, `label` (ex. « J1 »),
  `heroImage` et `photos` (la galerie du jour) dans son frontmatter.

## Composants MDX

| Composant | Usage |
|---|---|
| `<Photo src caption width />` | Photo flottante, cliquable (zoom) ; `width` en % |
| `<Gallery cols={2 \| 3}>` | Grille de photos |
| `<PhotoLink id>` | Lien dans le texte qui ouvre une photo de la galerie du jour |
| `<Attention>` | Encadré d'avertissement |
| `<Jour n={N}>` | Texte propre au jour N d'un topo multi-jours |

## Commandes

```bash
npm install         # installer les dépendances
npm run dev         # lancer le serveur local → localhost:3000
npm run build       # build de production
npm run start       # démarrer le build en local
npm run typecheck   # vérifier les types
```
