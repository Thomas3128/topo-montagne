'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', background: '#e8ead4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
      Chargement de la carte…
    </div>
  ),
});

export default function Map({ gpxPath, color }: { gpxPath: string; color?: string }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapClient gpxPath={gpxPath} color={color} />
    </div>
  );
}
