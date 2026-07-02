'use client';

import Lightbox from './mdx/Lightbox';
import { useGallery } from './PhotoGalleryProvider';

export default function PhotoGallery() {
  const { photos, openIndex, open, close, next, prev } = useGallery();
  if (!photos.length) return null;

  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <div className="recit-gallery">
      <h2 className="recit-gallery-title">Galerie photo</h2>
      <div className="mdx-gallery" data-cols={3}>
        {photos.map((photo) => (
          <figure key={photo.id} className="mdx-photo" onClick={() => open(photo.id)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt ?? photo.caption ?? ''} className="mdx-photo-img" />
            {photo.caption && <figcaption className="mdx-photo-caption">{photo.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {current && (
        <Lightbox
          key={current.id}
          src={current.src}
          alt={current.alt ?? current.caption}
          caption={current.caption}
          onClose={close}
          onPrev={photos.length > 1 ? prev : undefined}
          onNext={photos.length > 1 ? next : undefined}
        />
      )}
    </div>
  );
}
