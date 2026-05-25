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
  const distRef = useRef<HTMLSpanElement>(null);
  const elevPlusRef = useRef<HTMLSpanElement>(null);
  const elevMinusRef = useRef<HTMLSpanElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap',
    }).addTo(map);

    new L.GPX(gpxPath, {
      async: true,
      polyline_options: {
        color,
        opacity: 0.8,
        weight: 5,
        lineCap: 'round',
      },
      marker_options: { startIconUrl: null, endIconUrl: null },
    })
      .on('loaded', (e) => {
        const gpx = e.target;
        map.fitBounds(gpx.getBounds());

        if (distRef.current) distRef.current.innerText = (gpx.get_distance() / 1000).toFixed(1);
        if (elevPlusRef.current) elevPlusRef.current.innerText = String(Math.round(gpx.get_elevation_gain()));
        if (elevMinusRef.current) elevMinusRef.current.innerText = String(Math.round(gpx.get_elevation_loss()));

        drawElevationProfile(gpx.get_elevation_data(), color);
        setTimeout(() => map.invalidateSize(), 200);
      })
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [gpxPath, color]);

  function drawElevationProfile(elevData: [number, number][], lineColor: string) {
    const chartDiv = chartRef.current;
    if (!chartDiv || !elevData || elevData.length < 2) return;

    const W = chartDiv.clientWidth || 800;
    const H = 150;
    const margin = { top: 12, right: 16, bottom: 28, left: 48 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;

    const distances = elevData.map((p) => p[0]);
    const elevations = elevData.map((p) => p[1]);

    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);
    const maxDist = distances[distances.length - 1];
    const elevRange = maxElev - minElev || 1;

    const toX = (d: number) => margin.left + (d / maxDist) * innerW;
    const toY = (e: number) => margin.top + innerH - ((e - minElev) / elevRange) * innerH;

    const pts = elevData.map((p) => toX(p[0]).toFixed(1) + ',' + toY(p[1]).toFixed(1));
    const linePath = 'M ' + pts.join(' L ');
    const areaPath = `M ${toX(0)},${toY(minElev)} L ${pts.join(' L ')} L ${toX(maxDist)},${toY(minElev)} Z`;

    let yTickLines = '';
    let yTickLabels = '';
    for (let i = 0; i <= 4; i++) {
      const elev = minElev + (elevRange * i) / 4;
      const y = toY(elev).toFixed(1);
      yTickLines += `<line x1="${margin.left}" y1="${y}" x2="${margin.left + innerW}" y2="${y}" stroke="#e8e8e8" stroke-width="1"/>`;
      yTickLabels += `<text x="${margin.left - 6}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="#888">${Math.round(elev)}</text>`;
    }

    let xTickLines = '';
    let xTickLabels = '';
    for (let i = 0; i <= 5; i++) {
      const dist = (maxDist * i) / 5;
      const x = toX(dist).toFixed(1);
      const bottomY = (margin.top + innerH).toFixed(1);
      xTickLines += `<line x1="${x}" y1="${margin.top}" x2="${x}" y2="${bottomY}" stroke="#e8e8e8" stroke-width="1"/>`;
      xTickLabels += `<text x="${x}" y="${(margin.top + innerH + 14).toFixed(1)}" text-anchor="middle" font-size="10" fill="#888">${dist.toFixed(1)} km</text>`;
    }

    const gradId = 'elev-grad-' + Math.random().toString(36).slice(2, 7);
    const midY = (margin.top + innerH / 2).toFixed(1);

    chartDiv.innerHTML =
      `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">` +
      `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0%" stop-color="${lineColor}" stop-opacity="0.35"/>` +
      `<stop offset="100%" stop-color="${lineColor}" stop-opacity="0.05"/>` +
      `</linearGradient></defs>` +
      yTickLines + xTickLines +
      `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + innerH}" stroke="#ccc" stroke-width="1"/>` +
      `<line x1="${margin.left}" y1="${margin.top + innerH}" x2="${margin.left + innerW}" y2="${margin.top + innerH}" stroke="#ccc" stroke-width="1"/>` +
      `<path d="${areaPath}" fill="url(#${gradId})"/>` +
      `<path d="${linePath}" fill="none" stroke="${lineColor}" stroke-width="2" stroke-linejoin="round"/>` +
      yTickLabels + xTickLabels +
      `<text x="10" y="${midY}" text-anchor="middle" font-size="10" fill="#aaa" transform="rotate(-90, 10, ${midY})">alt. (m)</text>` +
      `</svg>`;
  }

  return (
    <div className="topo-wrapper">
      <div ref={mapContainerRef} className="map-container" />

      <div className="stats-bar">
        <div className="stat">
          <span className="label">Distance</span>
          <span className="value"><span ref={distRef}>-</span> km</span>
        </div>
        <div className="stat">
          <span className="label">Dénivelé +</span>
          <span className="value"><span ref={elevPlusRef}>-</span> m</span>
        </div>
        <div className="stat">
          <span className="label">Dénivelé -</span>
          <span className="value"><span ref={elevMinusRef}>-</span> m</span>
        </div>
      </div>

      <div ref={chartRef} className="elevation-chart" aria-label="Profil altimétrique" />

      <style jsx>{`
        .topo-wrapper {
          margin: 2rem 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e0e0e0;
          background: white;
        }
        .map-container {
          height: 450px;
          width: 100%;
          z-index: 1;
        }
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background: #fdfdfd;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          padding: 1rem 0;
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-right: 1px solid #eee;
        }
        .stat:last-child { border-right: none; }
        .label { font-size: 0.75rem; color: #666; text-transform: uppercase; font-weight: 600; }
        .value { font-size: 1.2rem; font-weight: bold; color: #333; }
        .elevation-chart {
          height: 150px;
          width: 100%;
          background: #fff;
          box-sizing: border-box;
        }
        .elevation-chart :global(svg) { display: block; width: 100%; height: 100%; }
      `}</style>
    </div>
  );
}
