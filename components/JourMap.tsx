'use client';

import Map from './Map';
import { useJour } from './JourProvider';

interface Props {
  gpxPaths: (string | undefined)[];
  fallback?: string;
  color?: string;
}

export default function JourMap({ gpxPaths, fallback, color }: Props) {
  const selected = useJour();
  const gpxPath = gpxPaths[selected - 1] ?? fallback;
  if (!gpxPath) return null;
  return (
    <div className="topo-map">
      <Map gpxPath={gpxPath} color={color} />
    </div>
  );
}
