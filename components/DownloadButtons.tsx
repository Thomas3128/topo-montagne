'use client';

import { useState } from 'react';

interface FicheRow {
  label: string;
  value: string;
}

interface Props {
  gpxPath?: string;
  braUrl?: string;
  topoTitle: string;
  topoContent: string;
  ficheTechnique?: FicheRow[];
}

function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/---+/g, '')
    .trim();
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

function parseGpxFull(xml: string) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const pts = Array.from(doc.querySelectorAll('trkpt'));
  let distance = 0, elevGain = 0, elevLoss = 0;
  let prevLat = 0, prevLon = 0, prevEle = 0;

  for (let i = 0; i < pts.length; i++) {
    const lat = parseFloat(pts[i].getAttribute('lat') ?? '0');
    const lon = parseFloat(pts[i].getAttribute('lon') ?? '0');
    const ele = parseFloat(pts[i].querySelector('ele')?.textContent ?? '0');
    if (i > 0) {
      distance += haversine(prevLat, prevLon, lat, lon);
      const diff = ele - prevEle;
      if (diff > 0) elevGain += diff;
      else elevLoss += Math.abs(diff);
    }
    prevLat = lat; prevLon = lon; prevEle = ele;
  }
  return { distance: distance / 1000, elevGain, elevLoss };
}


export default function DownloadButtons({
  gpxPath,
  braUrl,
  topoTitle,
  topoContent,
  ficheTechnique,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handlePdf = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210, margin = 16, contentW = W - margin * 2;
      let y = margin;

      const accent = [188, 108, 37] as [number, number, number];

      // ── Titre ─────────────────────────────────────
      doc.setFontSize(20);
      doc.setTextColor(...accent);
      doc.text(topoTitle, margin, y);
      y += 10;

      doc.setDrawColor(...accent);
      doc.setLineWidth(0.4);
      doc.line(margin, y, W - margin, y);
      y += 6;

      // ── Lien BRA ──────────────────────────────────
      if (braUrl) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Bulletin de Risque d\'Avalanche : ', margin, y);
        doc.setTextColor(...accent);
        doc.textWithLink(braUrl, margin + 62, y, { url: braUrl });
        y += 8;
      }

      // ── Fiche technique ───────────────────────────
      if (ficheTechnique && ficheTechnique.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(...accent);
        doc.text('Fiche technique', margin, y);
        y += 5;

        for (const row of ficheTechnique) {
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          doc.setFont('helvetica', 'bold');
          doc.text(row.label + ' :', margin, y);
          doc.setFont('helvetica', 'normal');
          doc.text(row.value, margin + 50, y);
          y += 5;
        }
        y += 3;
      }

      // ── Stats GPX ─────────────────────────────────
      if (gpxPath) {
        const xml = await fetch(gpxPath).then((r) => r.text());
        const { distance, elevGain, elevLoss } = parseGpxFull(xml);

        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Distance : ${distance.toFixed(1)} km   |   D+ : ${Math.round(elevGain)} m   |   D− : ${Math.round(elevLoss)} m`,
          margin, y
        );
        y += 8;
      }

      // ── Texte du topo ─────────────────────────────
      doc.setFontSize(11);
      doc.setTextColor(...accent);
      doc.text('Topo', margin, y);
      y += 5;

      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');

      const plain = stripMarkdown(topoContent);
      const lines = doc.splitTextToSize(plain, contentW) as string[];

      for (const line of lines) {
        if (y > 280) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 4.5;
      }

      doc.save(`${topoTitle.replace(/\s+/g, '_')}.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="download-buttons">
      <button
        className="dl-btn dl-btn-pdf"
        onClick={handlePdf}
        disabled={loading}
      >
        {loading ? 'Génération…' : '⬇ Télécharger le topo (PDF)'}
      </button>
      {gpxPath && (
        <a className="dl-btn dl-btn-gpx" href={gpxPath} download>
          ⬇ Télécharger le GPX
        </a>
      )}
    </div>
  );
}
