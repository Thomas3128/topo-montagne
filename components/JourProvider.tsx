'use client';

import { createContext, useContext, useState } from 'react';

const JourContext = createContext(1);
export const useJour = () => useContext(JourContext);

interface Props {
  titres: string[];
  labels?: string[];
  children: React.ReactNode;
}

export default function JourProvider({ titres, labels, children }: Props) {
  const [selected, setSelected] = useState(1);
  const count = titres.length;

  return (
    <JourContext.Provider value={selected}>
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
        <button className="jour-nav" onClick={() => setSelected(s => Math.max(1, s - 1))} disabled={selected === 1}>←</button>
        <div className="jour-header-title">
          <span className="jour-header-num">{labels?.[selected - 1] ?? `Jour ${selected}`}</span>
          <span className="jour-header-titre">{titres[selected - 1]}</span>
        </div>
        <button className="jour-nav" onClick={() => setSelected(s => Math.min(count, s + 1))} disabled={selected === count}>→</button>
      </div>

      {children}
    </JourContext.Provider>
  );
}
