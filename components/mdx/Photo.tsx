'use client';

import { useState } from 'react';
import Lightbox from './Lightbox';

interface Props {
  src: string;
  caption?: string;
  alt?: string;
  width?: number;
}

export default function Photo({ src, caption, alt, width }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <figure
        className="mdx-photo"
        style={width ? { width: `${width}%`, marginLeft: 'auto', marginRight: 'auto' } : undefined}
        onClick={() => setOpen(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? caption ?? ''} className="mdx-photo-img" />
        {caption && <figcaption className="mdx-photo-caption">{caption}</figcaption>}
      </figure>

      {open && <Lightbox src={src} alt={alt ?? caption} onClose={() => setOpen(false)} />}
    </>
  );
}
