'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';
import { loadGpx } from '@/lib/gpx';

interface Props {
  gpxPath: string;
  color?: string;
}

// Les icônes par défaut de Leaflet sont résolues via le bundle, ce qui casse
// leurs URLs : on les sert depuis /public.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet-icons/marker-icon.png',
  iconRetinaUrl: '/leaflet-icons/marker-icon-2x.png',
  shadowUrl: '/leaflet-icons/marker-shadow.png',
});

export default function MapClient({ gpxPath, color = '#ff0000' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  // La carte est créée une seule fois ; changer de jour ne fait que remplacer la trace
  useEffect(() => {
    if (!containerRef.current) return;
    const m = L.map(containerRef.current);
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '© contributeurs <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    }).addTo(m);
    setMap(m);
    return () => {
      m.remove();
      setMap(null);
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    let track: L.GPX | null = null;
    let cancelled = false;

    loadGpx(gpxPath)
      .then((xml) => {
        if (cancelled) return;
        track = new L.GPX(xml, {
          async: true,
          polyline_options: { color, opacity: 0.8, weight: 5, lineCap: 'round' },
        })
          .on('loaded', () => {
            if (cancelled || !track) return;
            map.invalidateSize();
            map.fitBounds(track.getBounds(), { padding: [16, 16] });
          })
          .addTo(map);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      track?.remove();
    };
  }, [map, gpxPath, color]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
  );
}
