'use client';

import { createContext, useContext, useState } from 'react';

export interface GalleryPhoto {
  id: string;
  src: string;
  caption?: string;
  alt?: string;
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = (id: string) => {
    const idx = photos.findIndex((p) => p.id === id);
    if (idx !== -1) setOpenIndex(idx);
  };
  const close = () => setOpenIndex(null);
  const next = () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
  const prev = () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));

  return (
    <GalleryContext.Provider value={{ photos, openIndex, open, close, next, prev }}>
      {children}
    </GalleryContext.Provider>
  );
}
