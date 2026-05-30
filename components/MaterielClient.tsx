'use client';

import { useState } from 'react';

type Categorie = { titre: string; items: string[] };
type Onglet = { id: string; label: string; cats: Categorie[] };
type Section = { id: string; titre: string; onglets: Onglet[] };

const SECTIONS: Section[] = [
  {
    id: 'always',
    titre: 'Toujours dans le sac',
    onglets: [
      {
        id: 'always',
        label: '',
        cats: [
          {
            titre: 'Navigation',
            items: [
              'Carte IGN papier du secteur + boussole',
              'Téléphone chargé avec appli hors-ligne (IGNrando, OrganicMaps…)',
            ],
          },
          {
            titre: 'Sécurité',
            items: [
              'Couverture de survie',
              'Sifflet',
              'Lampe frontale + piles de rechange',
              'Batterie externe',
            ],
          },
          {
            titre: 'Spécifique femmes',
            items: [
              'Protections hygiéniques compactes (cup menstruelle ou tampons)',
              'Sachet zip pour déchets hygiéniques',
              'Sous-vêtements de rechange supplémentaires',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'rando',
    titre: 'Randonnée',
    onglets: [
      {
        id: 'rando-1j',
        label: '1 jour',
        cats: [
          {
            titre: 'Vêtements',
            items: [
              'Couche de base respirante',
              'Couche intermédiaire (polaire ou softshell selon saison)',
              'Coupe-vent ou imperméable',
              'Chapeau / casquette + buff',
              'Gants légers (même en été en montagne)',
            ],
          },
          {
            titre: 'Nourriture & hydratation',
            items: [
              '2 à 3 L d\'eau selon durée et chaleur',
              'Repas + barres de rechange',
            ],
          },
          {
            titre: 'Sécurité',
            items: [
              'Trousse de premiers secours légère',
            ],
          },
          {
            titre: 'Spécifique femmes',
            items: [
              'Protection solaire adaptée',
              'Crème anti-irritations si longue marche',
            ],
          },
        ],
      },
      {
        id: 'rando-2j',
        label: '2 jours',
        cats: [
          {
            titre: 'Nuit en refuge',
            items: [
              'Sursac / drap de soie',
              'Couche de rechange (sous-vêtements, chaussettes)',
              'Trousse de toilette légère',
            ],
          },
          {
            titre: 'Bivouac (si hors refuge)',
            items: [
              'Sac de couchage adapté à la saison',
              'Matelas isolant',
              'Tente légère ou abri',
            ],
          },
          {
            titre: 'Confort',
            items: [
              'Crème solaire indice élevé + protection lèvres',
              'Lunettes de soleil catégorie 3 minimum',
              'Bâtons de randonnée',
              'Guêtres (terrain humide ou enneigé)',
            ],
          },
          {
            titre: 'Spécifique femmes',
            items: [
              'Culotte menstruelle de rechange',
              'Cup menstruelle ou tampons pour 2 jours',
              'Sachet zip étanche pour déchets',
              'Crème protectrice / anti-irritations',
            ],
          },
        ],
      },
      {
        id: 'rando-multi',
        label: 'Multi-jours',
        cats: [
          {
            titre: 'Alimentation autonome',
            items: [
              'Réchaud + popote + briquet',
              'Filtre à eau ou pastilles de purification',
              'Nourriture pour tous les jours + 1 jour de réserve',
            ],
          },
          {
            titre: 'Logistique',
            items: [
              'Sac étanche ou housses imperméables',
              'Cordelette multi-usage',
              'Kit réparation léger (duct tape, ficelle, kit couture)',
            ],
          },
          {
            titre: 'Spécifique femmes',
            items: [
              'Stock suffisant de protections (prévoir large)',
              'Antidouleurs si cycles douloureux',
              'Lingettes intimes biodégradables',
              'Sous-vêtements techniques supplémentaires',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'alpi',
    titre: 'Alpinisme',
    onglets: [
      {
        id: 'alpi-fond',
        label: 'Fond de sac',
        cats: [
          {
            titre: 'Toujours présent en alpi',
            items: [
              'Casque',
              'Baudrier + longe(s)',
              'Mousquetons à vis (2 minimum)',
              'Lunettes de glacier catégorie 4',
              'Protection solaire renforcée (crème 50+ + stick lèvres)',
              'Couches chaudes supplémentaires',
            ],
          },
          {
            titre: 'Spécifique femmes',
            items: [
              'Baudrier adapté à la morphologie féminine si possible',
              'Cup menstruelle recommandée — pratique en milieu engagé',
            ],
          },
        ],
      },
      {
        id: 'alpi-1j',
        label: '1 jour',
        cats: [
          {
            titre: 'Progression sur neige / glacier',
            items: [
              'Crampons adaptés aux chaussures',
              'Piolet',
              'Corde de glacier (30 à 40 m pour une cordée de 2)',
              'Chaussures d\'alpinisme rigides compatibles crampons',
            ],
          },
          {
            titre: 'Sécurité glacier',
            items: [
              'Broches à glace (minimum 2 par personne)',
              'Matériel de mouflage (poulie + bloqueur)',
            ],
          },
          {
            titre: 'Terrain enneigé',
            items: [
              'DVA (détecteur de victimes d\'avalanche)',
              'Sonde à avalanche',
              'Pelle à neige',
            ],
          },
          {
            titre: 'Spécifique femmes',
            items: [
              'Cup menstruelle fortement conseillée (pas de déchets en milieu glaciaire)',
              'Sous-vêtements thermiques supplémentaires',
            ],
          },
        ],
      },
      {
        id: 'alpi-multi',
        label: 'Multi-jours',
        cats: [
          {
            titre: 'Nuit en refuge ou bivouac alpi',
            items: [
              'Sac de couchage adapté altitude (−10°C ou moins)',
              'Matelas isolant haute performance',
              'Nourriture haute calorie',
              'Réchaud + popote adaptés altitude',
            ],
          },
          {
            titre: 'Logistique',
            items: [
              'Cordelettes de rappel',
              'Bivy bag (bivouac d\'urgence)',
              'Communication hors réseau (SPOT ou Garmin inReach)',
            ],
          },
          {
            titre: 'Spécifique femmes',
            items: [
              'Stock de protections pour toute la durée + réserve',
              'Sous-vêtements thermiques techniques supplémentaires',
              'Crème anti-irritations pour les longues journées',
            ],
          },
        ],
      },
    ],
  },
];

export default function MaterielClient() {
  const [activeOnglets, setActiveOnglets] = useState<Record<string, string>>({
    rando: 'rando-1j',
    alpi: 'alpi-fond',
  });

  const getActiveOnglet = (section: Section): Onglet => {
    const id = activeOnglets[section.id];
    return section.onglets.find(o => o.id === id) ?? section.onglets[0];
  };

  return (
    <div className="materiel">
      {SECTIONS.map(section => {
        const hasTabs = section.onglets.length > 1;
        const onglet = getActiveOnglet(section);

        return (
          <div key={section.id} className="materiel-section">
            <h2 className="materiel-section-titre">{section.titre}</h2>

            {hasTabs && (
              <div className="materiel-tabs">
                {section.onglets.map(o => (
                  <button
                    key={o.id}
                    className={`materiel-tab${onglet.id === o.id ? ' active' : ''}`}
                    onClick={() => setActiveOnglets(prev => ({ ...prev, [section.id]: o.id }))}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}

            <div className="materiel-content">
              {onglet.cats.map(cat => (
                <div key={cat.titre} className="materiel-category">
                  <h3 className="materiel-category-titre">{cat.titre}</h3>
                  <ul className="materiel-list">
                    {cat.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
