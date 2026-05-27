'use client';

import type { Livre } from '@/lib/lectures';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function LivreModal({ livre, onClose }: { livre: Livre; onClose: () => void }) {
  const { title, author, genre, resume, note } = livre.frontmatter;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className="livre-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="livre-modal" onClick={(e) => e.stopPropagation()}>
        <div className="livre-modal-header">
          <div className="livre-card-meta">
            {genre && <span className="livre-genre">{genre}</span>}
            <span className="livre-title">{title}</span>
            <span className="livre-author">{author}</span>
          </div>
          <button className="livre-modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        {(resume || note) && (
          <div className="livre-modal-body">
            {resume && resume.trim().split(/\n\n+/).map((para, i) => (
              <p key={i} className="livre-resume">{para.trim()}</p>
            ))}
            {note && <p className="livre-note"><span className="livre-note-label">Mon avis —</span> {note}</p>}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function LivreCard({ livre, onOpen }: { livre: Livre; onOpen: () => void }) {
  const { title, author, genre } = livre.frontmatter;

  return (
    <li className="livre-card">
      <button className="livre-card-header" onClick={onOpen}>
        <div className="livre-card-meta">
          {genre && <span className="livre-genre">{genre}</span>}
          <span className="livre-title">{title}</span>
          <span className="livre-author">{author}</span>
        </div>
        <span className="livre-chevron" aria-hidden="true">›</span>
      </button>
    </li>
  );
}

export default function LecturesGrid({ livres }: { livres: Livre[] }) {
  const [selected, setSelected] = useState<Livre | null>(null);

  if (livres.length === 0) {
    return <p style={{ color: 'rgb(var(--gray))', fontStyle: 'italic' }}>Aucune recommandation pour l'instant.</p>;
  }

  return (
    <>
      <ul className="lectures-grid">
        {livres.map((livre) => (
          <LivreCard key={livre.slug} livre={livre} onOpen={() => setSelected(livre)} />
        ))}
      </ul>
      {selected && <LivreModal livre={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
