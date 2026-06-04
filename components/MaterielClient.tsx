'use client';

import { useState } from 'react';

type Categorie = { titre: string; items: string[] };
type Onglet = { id: string; label: string; cats: Categorie[] };
type Section = { id: string; titre: string; description?: string; onglets: Onglet[] };

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
              'Carte IGN du secteur',
              'Téléphone chargé avec application hors-ligne (Cartes IGN, Komoot…)',
              'Montre avec fond de carte et trace GPX',
            ],
          },
          {
            titre: 'Sécurité',
            items: [
              'Couverture de survie',
              'Sifflet (souvent intégré au sac)',
              'Lampe frontale + piles de rechange',
              'Batterie externe',
            ],
          },
          {
            titre: 'Prévention',
            items: [
              'Traitement médical personnel (si besoin)',
              'Trousse de secours légère',
              'Lunettes de soleil (cat. 3 minimum)',
              'Crème solaire indice 50',
              'Baume à lèvres',
              'Bâtons de randonnée',
            ],
          },
          {
            titre: 'En cas de menstruations',
            items: [
              'Protections hygiéniques',
              'Antidouleurs si cycles douloureux',
              'Sous-vêtements de rechange supplémentaires',
              'Sachet zip étanche pour déchets',
              'Culotte menstruelle ?',
              'Gel hydroalcoolique',
              'Crème anti-irritations'
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'rando',
    titre: 'Randonnée',
    description: "Cette liste est un point de départ large. Chacun adapte selon son expérience, ses habitudes et la sortie du jour. Certains partiront légers avec moins, d'autres préféreront avoir plus.",
    onglets: [
      {
        id: 'rando-1j',
        label: '1 jour',
        cats: [
          {
            titre: 'Vêtements',
            items: [
              'Couche intermédiaire (polaire ou softshell selon saison)',
              'Veste imperméable',
              'Chapeau / casquette + buff',
              'Gants légers (selon saison)',
            ],
          },
          {
            titre: 'Nourriture & hydratation',
            items: [
              '2 à 4 L d\'eau selon durée et chaleur',
              'Repas',
              'Réserve énergétique (barres, gels, compotes)',
            ],
          }
        ],
      },
      {
        id: 'rando-2j',
        label: '2 jours',
        cats: [
          {
            titre: 'Vêtements',
            items: [
              'Couche de rechange (sous-vêtements + chaussettes + t-shirt)',
            ],
          },
          {
            titre: 'Nourriture & hydratation',
            items: [
              'Filtre à eau ou pastilles de purification',
            ],
          },
          {
            titre: 'Hygiène',
            items: [
              'Trousse de toilette légère',
              'Serviette',
              'Sac poubelle'
            ],
          },
          {
            titre: 'Logistique',
            items: [
              'Housse de sac imperméable',
            ],
          },
          {
            titre: 'Refuge',
            items: [
              'Drap de sac / sac à viandre',
            ],
          },
          {
            titre: 'Bivouac',
            items: [
              'Réchaud + popote + briquet + couverts',
              'Sac de couchage adapté à la saison',
              'Tente légère ou tarp',
              'Matelas isolant',
            ],
          },
          {
            titre: 'En cas de menstruations',
            items: [
              'Stock suffisant de protections'
            ],
          },
        ],
      },
      {
        id: 'rando-multi',
        label: 'Multi-jours',
        cats: [
          {
            titre: 'Vêtements',
            items: [
              '2ème short / pantalon',
            ],
          },
          {
            titre: 'Nourriture & hydratation',
            items: [
              'Nourriture pour les prochains jours',
            ],
          },
          {
            titre: 'Logistique',
            items: [
              'Cordelette multi-usage',
              'Kit réparation léger (duct tape, ficelle, kit couture)',
            ],
          }
        ],
      },
    ],
  },
  {
    id: 'alpi',
    titre: 'Alpinisme',
    description: "En alpinisme, savoir gérer le poids du sac est important. On peut faire des concessions, mais pas sur tout. Le matériel de sécurité n'est pas négociable. Pour le reste, l'expérience et le jugement priment sur n'importe quelle liste.",
    onglets: [
      {
        id: 'alpi-1j',
        label: '1 jour',
        cats: [
          {
            titre: 'Équipement technique',
            items: [
              'Doudoune',
              'Casque',
              'Baudrier + longe + Mousqueton à vis',
              'Lunettes de glacier (cat. 4)',
              'Corde — taille et nombre selon la course',
              'Assureur reverso + mousquetion directionnel',
              'Cordelette de rappel',
            ],
          },
          {
            titre: 'Glacier',
            items: [
              'Chaussures d\'alpinisme rigides compatibles crampons',
              'Crampons adaptés aux chaussures',
              'Piolet',
              'Corde de glacier (30 à 40 m pour une cordée de 2)',
              'Broches à glace (min. 2 par personne)',
              'Matériel de mouflage (tibloc, microtrac, sangles…)',
              'Mousquetons simples et à vis',
            ],
          },
          {
            titre: 'Crête / falaise',
            items: [
              'Chaussons d\'escalade',
              'Jeu de friends',
              'Jeu de bloqueurs',
              'Sangles + mousquetons',
              'Dégaines',
            ],
          },
          {
            titre: 'Neige',
            items: [
              'DVA (détecteur de victimes d\'avalanche)',
              'Sonde à avalanche',
              'Pelle à neige',
            ],
          }
        ],
      },
      {
        id: 'alpi-multi',
        label: 'Multi-jours',
        cats: [
          {
            titre: 'Nuit en altitude',
            items: [
              'Sac de couchage −10 °C minimum',
              'Nourriture haute calorie',
              'Réchaud haute altitude (vérifier fonctionnement en conditions extrêmes)',
            ],
          },
          {
            titre: 'Logistique',
            items: [
              'Bivy bag (bivouac d\'urgence)',
              'Communication hors réseau (SPOT, Garmin inReach, ...)',
            ],
          },
          {
            titre: 'En cas de menstruations',
            items: [
              'Stock suffisant de protections'
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
    alpi: 'alpi-1j',
  });

  return (
    <div className="materiel">
      {SECTIONS.map(section => {
        const hasTabs = section.onglets.length > 1;
        const activeId = activeOnglets[section.id];
        const activeIndex = section.onglets.findIndex(o => o.id === (activeId ?? section.onglets[0].id));
        const visibleOnglets = section.onglets.slice(0, activeIndex + 1);

        return (
          <div key={section.id} className="materiel-section">
            <h2 className="materiel-section-titre">{section.titre}</h2>
            {section.description && <p className="materiel-section-desc">{section.description}</p>}

            {hasTabs && (
              <div className="materiel-tabs">
                {section.onglets.map(o => (
                  <button
                    key={o.id}
                    className={`materiel-tab${o.id === (activeId ?? section.onglets[0].id) ? ' active' : ''}`}
                    onClick={() => setActiveOnglets(prev => ({ ...prev, [section.id]: o.id }))}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}

            <div className="materiel-content">
              {(() => {
                  const merged = visibleOnglets
                    .flatMap(o => o.cats)
                    .reduce<Categorie[]>((acc, cat) => {
                      const existing = acc.find(c => c.titre === cat.titre);
                      if (existing) {
                        existing.items = [...existing.items, ...cat.items];
                      } else {
                        acc.push({ ...cat, items: [...cat.items] });
                      }
                      return acc;
                    }, []);
                  const sf = merged.find(c => c.titre === 'En cas de menstruations');
                  const rest = merged.filter(c => c.titre !== 'En cas de menstruations');
                  if (sf) rest.push(sf);
                  return rest;
                })()
                .map(cat => (
                  <div key={cat.titre} className="materiel-category">
                    <h3 className="materiel-category-titre">{cat.titre}</h3>
                    <ul className="materiel-list">
                      {cat.items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ))
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}
