'use client';

import { useJourNav } from './JourProvider';

export default function JourNav() {
  const { selected, setSelected, titres, labels } = useJourNav();
  const count = titres.length;

  return (
    <>
      <div className="jour-picker">
        {titres.map((_, i) => (
          <button
            key={i + 1}
            className={`jour-btn${selected === i + 1 ? ' jour-btn--active' : ''}`}
            onClick={() => setSelected(i + 1)}
          >
            {labels?.[i] ?? `J${i + 1}`}
          </button>
        ))}
      </div>

      <div className="jour-header">
        <button className="jour-nav" onClick={() => setSelected(Math.max(1, selected - 1))} disabled={selected === 1}>←</button>
        <div className="jour-header-title">
          <span className="jour-header-num">{labels?.[selected - 1] ?? `Jour ${selected}`}</span>
          <span className="jour-header-titre">{titres[selected - 1]}</span>
        </div>
        <button className="jour-nav" onClick={() => setSelected(Math.min(count, selected + 1))} disabled={selected === count}>→</button>
      </div>
    </>
  );
}
