'use client';

import Image from 'next/image';
import { useJour } from './JourProvider';

interface Props {
  images: (string | undefined)[];
  fallback?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export default function JourHeroImage({ images, fallback, style, priority }: Props) {
  const selected = useJour();
  const src = images[selected - 1] ?? fallback;
  if (!src) return null;
  return (
    <div className="topo-photo" style={style}>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 60vw"
        priority={priority}
        style={{ objectFit: 'cover', borderRadius: '12px' }}
      />
    </div>
  );
}
