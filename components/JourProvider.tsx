'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const JourContext = createContext(1);
export const useJour = () => useContext(JourContext);

interface NavContextValue {
  selected: number;
  setSelected: (n: number) => void;
  titres: string[];
  labels?: string[];
}

const JourNavContext = createContext<NavContextValue | null>(null);
export const useJourNav = () => {
  const ctx = useContext(JourNavContext);
  if (!ctx) throw new Error('useJourNav must be used within a JourProvider');
  return ctx;
};

const HASH_RE = /^#jour-(\d+)$/;

interface Props {
  titres: string[];
  labels?: string[];
  children: React.ReactNode;
}

export default function JourProvider({ titres, labels, children }: Props) {
  const [selected, setSelectedState] = useState(1);
  const count = titres.length;

  // Le jour affiché est reflété dans l'URL (#jour-N) pour pouvoir partager
  // un lien direct vers une étape et la retrouver après un rechargement.
  useEffect(() => {
    const m = HASH_RE.exec(window.location.hash);
    const n = m ? Number(m[1]) : 1;
    if (n >= 1 && n <= count) setSelectedState(n);
  }, [count]);

  const setSelected = useCallback((n: number) => {
    setSelectedState(n);
    const { pathname, search } = window.location;
    window.history.replaceState(null, '', n === 1 ? pathname + search : `${pathname}${search}#jour-${n}`);
  }, []);

  return (
    <JourContext.Provider value={selected}>
      <JourNavContext.Provider value={{ selected, setSelected, titres, labels }}>
        {children}
      </JourNavContext.Provider>
    </JourContext.Provider>
  );
}
