'use client';

import { createContext, useContext, useState } from 'react';

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

interface Props {
  titres: string[];
  labels?: string[];
  children: React.ReactNode;
}

export default function JourProvider({ titres, labels, children }: Props) {
  const [selected, setSelected] = useState(1);

  return (
    <JourContext.Provider value={selected}>
      <JourNavContext.Provider value={{ selected, setSelected, titres, labels }}>
        {children}
      </JourNavContext.Provider>
    </JourContext.Provider>
  );
}
