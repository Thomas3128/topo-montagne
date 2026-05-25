'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '450px', background: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
      Chargement de la carte…
    </div>
  ),
});

export default function Map({ gpxPath, color }: { gpxPath: string; color?: string }) {
  return <MapClient gpxPath={gpxPath} color={color} />;
}
