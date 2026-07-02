'use client';

import Image from 'next/image';
import { useJour } from './JourProvider';

interface Props {
  images: (string | undefined)[];
  fallback?: string;
  style?: React.CSSProperties;
}

export default function JourHeroImage({ images, fallback, style }: Props) {
  const selected = useJour();
  const src = images[selected - 1] ?? fallback;
  if (!src) return null;
  return (
    <div className="topo-photo" style={style}>
      <Image src={src} alt="" fill style={{ objectFit: 'cover', borderRadius: '12px' }} />
    </div>
  );
}
