// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';

interface Props {
  gpxPath: string;
  color?: string;
}

export default function MapClient({ gpxPath, color = '#ff0000' }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: '/leaflet-icons/marker-icon.png',
      iconRetinaUrl: '/leaflet-icons/marker-icon-2x.png',
      shadowUrl: '/leaflet-icons/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap',
    }).addTo(map);

    let timer: ReturnType<typeof setTimeout>;

    new L.GPX(gpxPath, {
      async: true,
      polyline_options: { color, opacity: 0.8, weight: 5, lineCap: 'round' },
      marker_options: { startIconUrl: null, endIconUrl: null },
    })
      .on('loaded', (e) => {
        timer = setTimeout(() => {
          if (mapRef.current !== map) return;
          map.invalidateSize();
          map.fitBounds(e.target.getBounds());
        }, 200);
      })
      .addTo(map);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
    };
  }, [gpxPath, color]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
  );
}
