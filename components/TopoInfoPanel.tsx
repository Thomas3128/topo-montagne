'use client';

import { useEffect, useRef, useState } from 'react';

interface FicheRow {
  label: string;
  value: string;
}

interface GpxStats {
  distance: number;
  elevGain: number;
  elevLoss: number;
  elevData: [number, number][];
}

interface Props {
  gpxPath?: string;
  gpxColor?: string;
  ficheTechnique?: FicheRow[];
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseGpx(xml: string): GpxStats {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const pts = Array.from(doc.querySelectorAll('trkpt'));

  let distance = 0;
  let elevGain = 0;
  let elevLoss = 0;
  const elevData: [number, number][] = [];

  for (let i = 0; i < pts.length; i++) {
    const lat = parseFloat(pts[i].getAttribute('lat') ?? '0');
    const lon = parseFloat(pts[i].getAttribute('lon') ?? '0');
    const ele = parseFloat(pts[i].querySelector('ele')?.textContent ?? '0');

    if (i > 0) {
      const prev = pts[i - 1];
      const d = haversine(
        parseFloat(prev.getAttribute('lat') ?? '0'),
        parseFloat(prev.getAttribute('lon') ?? '0'),
        lat,
        lon
      );
      distance += d;

      const prevEle = parseFloat(prev.querySelector('ele')?.textContent ?? '0');
      const diff = ele - prevEle;
      if (diff > 0) elevGain += diff;
      else elevLoss += Math.abs(diff);
    }

    elevData.push([distance / 1000, ele]);
  }

  return { distance: distance / 1000, elevGain, elevLoss, elevData };
}

function ElevationChart({ elevData, color }: { elevData: [number, number][]; color: string }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = chartRef.current;
    if (!div || elevData.length < 2) return;

    const W = div.clientWidth || 800;
    const H = 120;
    const m = { top: 10, right: 16, bottom: 24, left: 44 };
    const iW = W - m.left - m.right;
    const iH = H - m.top - m.bottom;

    const dists = elevData.map((p) => p[0]);
    const eles = elevData.map((p) => p[1]);
    const minE = Math.min(...eles);
    const maxE = Math.max(...eles);
    const maxD = dists[dists.length - 1];
    const eRange = maxE - minE || 1;

    const toX = (d: number) => m.left + (d / maxD) * iW;
    const toY = (e: number) => m.top + iH - ((e - minE) / eRange) * iH;

    const pts = elevData.map((p) => `${toX(p[0]).toFixed(1)},${toY(p[1]).toFixed(1)}`);
    const line = 'M ' + pts.join(' L ');
    const area = `M ${toX(0)},${toY(minE)} L ${pts.join(' L ')} L ${toX(maxD)},${toY(minE)} Z`;

    let yLines = '';
    let yLabels = '';
    for (let i = 0; i <= 4; i++) {
      const e = minE + (eRange * i) / 4;
      const y = toY(e).toFixed(1);
      yLines += `<line x1="${m.left}" y1="${y}" x2="${m.left + iW}" y2="${y}" stroke="#e8e8e8" stroke-width="1"/>`;
      yLabels += `<text x="${m.left - 5}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="#888">${Math.round(e)}</text>`;
    }
    let xLines = '';
    let xLabels = '';
    for (let i = 0; i <= 5; i++) {
      const d = (maxD * i) / 5;
      const x = toX(d).toFixed(1);
      xLines += `<line x1="${x}" y1="${m.top}" x2="${x}" y2="${m.top + iH}" stroke="#e8e8e8" stroke-width="1"/>`;
      xLabels += `<text x="${x}" y="${m.top + iH + 14}" text-anchor="middle" font-size="10" fill="#888">${d.toFixed(1)}</text>`;
    }

    const gId = 'eg-' + Math.random().toString(36).slice(2, 6);
    const midY = (m.top + iH / 2).toFixed(1);

    div.innerHTML =
      `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">` +
      `<defs><linearGradient id="${gId}" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>` +
      `<stop offset="100%" stop-color="${color}" stop-opacity="0.05"/>` +
      `</linearGradient></defs>` +
      yLines + xLines +
      `<line x1="${m.left}" y1="${m.top}" x2="${m.left}" y2="${m.top + iH}" stroke="#ccc" stroke-width="1"/>` +
      `<line x1="${m.left}" y1="${m.top + iH}" x2="${m.left + iW}" y2="${m.top + iH}" stroke="#ccc" stroke-width="1"/>` +
      `<path d="${area}" fill="url(#${gId})"/>` +
      `<path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>` +
      yLabels + xLabels +
      `<text x="10" y="${midY}" text-anchor="middle" font-size="10" fill="#aaa" transform="rotate(-90,10,${midY})">alt. (m)</text>` +
      '</svg>';
  }, [elevData, color]);

  return <div ref={chartRef} style={{ height: '120px', width: '100%', background: '#fff' }} />;
}

export default function TopoInfoPanel({ gpxPath, gpxColor = '#bc6c25', ficheTechnique }: Props) {
  const [stats, setStats] = useState<GpxStats | null>(null);

  useEffect(() => {
    if (!gpxPath) return;
    fetch(gpxPath)
      .then((r) => r.text())
      .then((xml) => setStats(parseGpx(xml)))
      .catch(() => {});
  }, [gpxPath]);

  const hasContent = gpxPath || (ficheTechnique && ficheTechnique.length > 0);
  if (!hasContent) return null;

  return (
    <div className="topo-info-panel">

      {/* Stats GPX */}
      {stats && (
        <div className="topo-stats-bar">
          <div className="topo-stat">
            <span className="topo-stat-label">Distance</span>
            <span className="topo-stat-value">{stats.distance.toFixed(1)} km</span>
          </div>
          <div className="topo-stat">
            <span className="topo-stat-label">Dénivelé +</span>
            <span className="topo-stat-value">{Math.round(stats.elevGain)} m</span>
          </div>
          <div className="topo-stat">
            <span className="topo-stat-label">Dénivelé −</span>
            <span className="topo-stat-value">{Math.round(stats.elevLoss)} m</span>
          </div>
        </div>
      )}

      {/* Profil altimétrique */}
      {stats && stats.elevData.length > 1 && (
        <div className="topo-elevation">
          <ElevationChart elevData={stats.elevData} color={gpxColor} />
        </div>
      )}

      {/* Fiche technique */}
      {ficheTechnique && ficheTechnique.length > 0 && (
        <div className="topo-fiche">
          <table className="topo-fiche-table">
            <tbody>
              {ficheTechnique.map((row) => (
                <tr key={row.label}>
                  <th>{row.label}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
