'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useJour } from './JourProvider';

export interface GalleryPhoto {
  id: string;
  src: string;
  caption?: string;
  alt?: string;
  jour?: number;
}

interface GalleryContextValue {
  photos: GalleryPhoto[];
  openIndex: number | null;
  open: (id: string) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error('useGallery doit être utilisé dans un PhotoGalleryProvider');
  return ctx;
}

interface Props {
  photos: GalleryPhoto[];
  children: React.ReactNode;
}

export default function PhotoGalleryProvider({ photos, children }: Props) {
  const currentJour = useJour();
  // Une photo rattachée à un jour n'apparaît que dans la galerie de ce jour-là.
  const dayPhotos = useMemo(
    () => photos.filter((p) => p.jour === undefined || p.jour === currentJour),
    [photos, currentJour]
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    setOpenIndex(null);
  }, [currentJour]);

  const open = (id: string) => {
    const idx = dayPhotos.findIndex((p) => p.id === id);
    if (idx !== -1) setOpenIndex(idx);
  };
  const close = () => setOpenIndex(null);
  const next = () => setOpenIndex((i) => (i === null ? null : (i + 1) % dayPhotos.length));
  const prev = () => setOpenIndex((i) => (i === null ? null : (i - 1 + dayPhotos.length) % dayPhotos.length));

  return (
    <GalleryContext.Provider value={{ photos: dayPhotos, openIndex, open, close, next, prev }}>
      {children}
    </GalleryContext.Provider>
  );
}
