'use client';

import { useState, useEffect } from 'react';

interface Props {
  src: string;
  children: React.ReactNode;
}

export default function PdfPopup({ src, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button className="pdf-popup-trigger" onClick={() => setOpen(true)}>
        {children}
      </button>

      {open && (
        <div className="pdf-overlay" onClick={() => setOpen(false)}>
          <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pdf-modal-close" onClick={() => setOpen(false)} aria-label="Fermer">✕</button>
            <iframe src={src} className="pdf-frame" title="Document PDF" />
          </div>
        </div>
      )}
    </>
  );
}
