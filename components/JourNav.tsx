'use client';

import { useJourNav } from './JourProvider';

const NAV_ID = 'jour-nav';

// Sélecteur de jour affiché en haut de page
export default function JourNav() {
  const { selected, setSelected, titres, labels } = useJourNav();
  const count = titres.length;
  const label = (n: number) => labels?.[n - 1] ?? `J${n}`;

  return (
    <div id={NAV_ID} className="jour-nav-wrap">
      <div className="jour-picker">
        {titres.map((_, i) => (
          <button
            key={i + 1}
            className={`jour-btn${selected === i + 1 ? ' jour-btn--active' : ''}`}
            aria-current={selected === i + 1 ? 'step' : undefined}
            onClick={() => setSelected(i + 1)}
          >
            {label(i + 1)}
          </button>
        ))}
      </div>

      <div className="jour-header">
        <button className="jour-nav" aria-label="Jour précédent" onClick={() => setSelected(Math.max(1, selected - 1))} disabled={selected === 1}>←</button>
        <div className="jour-header-title">
          <span className="jour-header-num">{labels?.[selected - 1] ?? `Jour ${selected}`}</span>
          <span className="jour-header-titre">{titres[selected - 1]}</span>
        </div>
        <button className="jour-nav" aria-label="Jour suivant" onClick={() => setSelected(Math.min(count, selected + 1))} disabled={selected === count}>→</button>
      </div>
    </div>
  );
}

// Liens « jour précédent / suivant » en bas de page, qui ramènent en haut de l'étape
export function JourPager() {
  const { selected, setSelected, titres, labels } = useJourNav();
  const count = titres.length;
  const label = (n: number) => labels?.[n - 1] ?? `Jour ${n}`;

  const go = (n: number) => {
    setSelected(n);
    document.getElementById(NAV_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (count < 2) return null;

  return (
    <nav className="jour-pager" aria-label="Navigation entre les jours">
      {selected > 1 ? (
        <button className="jour-pager-btn" onClick={() => go(selected - 1)}>
          <span className="jour-pager-dir">← {label(selected - 1)}</span>
          <span className="jour-pager-titre">{titres[selected - 2]}</span>
        </button>
      ) : <span />}
      {selected < count && (
        <button className="jour-pager-btn jour-pager-btn--next" onClick={() => go(selected + 1)}>
          <span className="jour-pager-dir">{label(selected + 1)} →</span>
          <span className="jour-pager-titre">{titres[selected]}</span>
        </button>
      )}
    </nav>
  );
}
