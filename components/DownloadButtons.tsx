'use client';

import { useState } from 'react';

interface FicheRow { label: string; value: string; }

interface Props {
  gpxPath?: string;
  braUrl?: string;
  topoTitle: string;
  topoContent: string;
  ficheTechnique?: FicheRow[];
  gpxColor?: string;
}

// ── Inline segments ──────────────────────────────────────────────────────────
interface Seg { text: string; bold: boolean; italic: boolean; href?: string; }

function parseInline(raw: string): Seg[] {
  const segs: Seg[] = [];
  let s = raw.replace(/<[^>]+>/g, '');
  while (s.length > 0) {
    let m: RegExpMatchArray | null;
    if ((m = s.match(/^\*\*\*(.+?)\*\*\*/))) { segs.push({ text: m[1], bold: true,  italic: true  }); s = s.slice(m[0].length); continue; }
    if ((m = s.match(/^\*\*(.+?)\*\*/)))      { segs.push({ text: m[1], bold: true,  italic: false }); s = s.slice(m[0].length); continue; }
    if ((m = s.match(/^\*(.+?)\*/)))           { segs.push({ text: m[1], bold: false, italic: true  }); s = s.slice(m[0].length); continue; }
    if ((m = s.match(/^\[(.+?)\]\((.+?)\)/))) { segs.push({ text: m[1], bold: false, italic: false, href: m[2] }); s = s.slice(m[0].length); continue; }
    if ((m = s.match(/^[^*[\]]+/)))            { segs.push({ text: m[0], bold: false, italic: false }); s = s.slice(m[0].length); continue; }
    s = s.slice(1);
  }
  return segs.filter(sg => sg.text.length > 0);
}

// ── Block-level parser ───────────────────────────────────────────────────────
type Block =
  | { type: 'h2' | 'h3' | 'h4'; text: string }
  | { type: 'hr' | 'spacer' }
  | { type: 'p' | 'li'; segs: Seg[] };

function parseMd(md: string): Block[] {
  const blocks: Block[] = [];
  for (const line of md.split('\n')) {
    const t = line.trim();
    if (!t) {
      if (blocks.length && blocks[blocks.length - 1].type !== 'spacer') blocks.push({ type: 'spacer' });
      continue;
    }
    let m: RegExpMatchArray | null;
    // Markdown headings
    if ((m = t.match(/^####\s+(.*)/)))  { blocks.push({ type: 'h4', text: m[1] }); continue; }
    if ((m = t.match(/^###\s+(.*)/)))   { blocks.push({ type: 'h3', text: m[1] }); continue; }
    if ((m = t.match(/^##\s+(.*)/)))    { blocks.push({ type: 'h2', text: m[1] }); continue; }
    if (/^---+$/.test(t))               { blocks.push({ type: 'hr' });              continue; }
    if ((m = t.match(/^[-*•]\s+(.*)/))) { blocks.push({ type: 'li', segs: parseInline(m[1]) }); continue; }
    // JSX/HTML headings: <h3 style={{...}}>text</h3>
    if ((m = t.match(/<h2[^>]*>(.*?)<\/h2>/))) { blocks.push({ type: 'h2', text: m[1].replace(/<[^>]+>/g, '') }); continue; }
    if ((m = t.match(/<h3[^>]*>(.*?)<\/h3>/))) { blocks.push({ type: 'h3', text: m[1].replace(/<[^>]+>/g, '') }); continue; }
    if ((m = t.match(/<h4[^>]*>(.*?)<\/h4>/))) { blocks.push({ type: 'h4', text: m[1].replace(/<[^>]+>/g, '') }); continue; }
    // Skip pure JSX wrapper tags (<span ...>, </span>, etc.)
    if (/^<\/?[a-zA-Z][^>]*>$/.test(t)) continue;
    blocks.push({ type: 'p', segs: parseInline(t) });
  }
  return blocks;
}

// ── jsPDF block renderer ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlocks(doc: any, blocks: Block[], margin: number, contentW: number, initY: number): number {
  const accent: [number, number, number] = [188, 108, 37];
  const dark:   [number, number, number] = [50,  50,  50 ];
  let y = initY;

  const newPage = () => { doc.addPage(); y = margin; };
  const guard   = (h: number) => { if (y + h > 282) newPage(); };

  // Renders inline segments word-by-word with style switching and line-wrap
  const renderSegs = (segs: Seg[], x0: number, bullet?: string) => {
    const lineH = 4.8;
    let x = x0;
    if (bullet) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
      doc.setTextColor(...dark);
      doc.text(bullet, x0 - 5, y);
    }
    for (const seg of segs) {
      const style = seg.bold && seg.italic ? 'bolditalic' : seg.bold ? 'bold' : seg.italic ? 'italic' : 'normal';
      doc.setFont('helvetica', style);
      doc.setFontSize(9);
      doc.setTextColor(...(seg.href ? accent : dark));
      for (const token of seg.text.split(/(\s+)/)) {
        if (!token) continue;
        const tw = doc.getTextWidth(token);
        if (x + tw > x0 + contentW && x > x0) { y += lineH; x = x0; guard(lineH); }
        seg.href ? doc.textWithLink(token, x, y, { url: seg.href }) : doc.text(token, x, y);
        x += tw;
      }
    }
    y += lineH;
  };

  for (const block of blocks) {
    switch (block.type) {
      case 'spacer': y += 2; break;

      case 'hr':
        guard(5);
        doc.setDrawColor(210, 210, 210); doc.setLineWidth(0.25);
        doc.line(margin, y, margin + contentW, y);
        y += 5;
        break;

      case 'h2':
        guard(9); y += 3;
        doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...accent);
        { const ls: string[] = doc.splitTextToSize(block.text, contentW); doc.text(ls, margin, y); y += ls.length * 6 + 2; }
        break;

      case 'h3':
        guard(7); y += 2;
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...accent);
        { const ls: string[] = doc.splitTextToSize(block.text, contentW); doc.text(ls, margin, y); y += ls.length * 5.5 + 1; }
        break;

      case 'h4':
        guard(5);
        doc.setFontSize(9.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...dark);
        { const ls: string[] = doc.splitTextToSize(block.text, contentW); doc.text(ls, margin, y); y += ls.length * 4.8 + 0.5; }
        break;

      case 'li':
        guard(5);
        renderSegs(block.segs, margin + 5, '•');
        break;

      case 'p':
        guard(5);
        renderSegs(block.segs, margin);
        break;
    }
  }
  return y;
}

// ── GPX stats ────────────────────────────────────────────────────────────────
function haversine(la1: number, lo1: number, la2: number, lo2: number) {
  const R = 6371000, dLa = ((la2 - la1) * Math.PI) / 180, dLo = ((lo2 - lo1) * Math.PI) / 180;
  const a = Math.sin(dLa / 2) ** 2 + Math.cos((la1 * Math.PI) / 180) * Math.cos((la2 * Math.PI) / 180) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseGpxStats(xml: string) {
  const pts = Array.from(new DOMParser().parseFromString(xml, 'application/xml').querySelectorAll('trkpt'));
  let dist = 0, gain = 0, loss = 0, pLat = 0, pLon = 0, pEle = 0;
  for (let i = 0; i < pts.length; i++) {
    const lat = parseFloat(pts[i].getAttribute('lat') ?? '0');
    const lon = parseFloat(pts[i].getAttribute('lon') ?? '0');
    const ele = parseFloat(pts[i].querySelector('ele')?.textContent ?? '0');
    if (i > 0) {
      dist += haversine(pLat, pLon, lat, lon);
      const d = ele - pEle;
      if (d > 0) gain += d; else loss += Math.abs(d);
    }
    pLat = lat; pLon = lon; pEle = ele;
  }
  return { dist: dist / 1000, gain, loss };
}

// ── Component ────────────────────────────────────────────────────────────────
export default function DownloadButtons({ gpxPath, braUrl, topoTitle, topoContent, ficheTechnique }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePdf = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const margin = 16, W = 210, contentW = W - margin * 2;
      const accent: [number, number, number] = [188, 108, 37];
      let y = margin;

      // Titre
      doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(...accent);
      const titleLines: string[] = doc.splitTextToSize(topoTitle, contentW);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 8 + 2;
      doc.setDrawColor(...accent); doc.setLineWidth(0.4);
      doc.line(margin, y, W - margin, y);
      y += 7;

      // Lien BRA
      if (braUrl) {
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100);
        doc.text('Bulletin de Risque d\'Avalanche :', margin, y);
        doc.setTextColor(...accent);
        doc.textWithLink(braUrl, margin, y + 4.5, { url: braUrl });
        y += 11;
      }

      // Fiche technique
      if (ficheTechnique && ficheTechnique.length > 0) {
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...accent);
        doc.text('Fiche technique', margin, y);
        y += 5;
        for (const row of ficheTechnique) {
          doc.setFontSize(9); doc.setTextColor(80, 80, 80);
          doc.setFont('helvetica', 'bold');   doc.text(row.label + ' :', margin, y);
          doc.setFont('helvetica', 'normal'); doc.text(row.value, margin + 52, y);
          y += 5;
        }
        y += 3;
      }

      // Stats GPX
      if (gpxPath) {
        const xml = await fetch(gpxPath).then((r) => r.text());
        const { dist, gain, loss } = parseGpxStats(xml);
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 80, 80);
        doc.text(`Distance : ${dist.toFixed(1)} km  |  D+ : ${Math.round(gain)} m  |  D- : ${Math.round(loss)} m`, margin, y);
        y += 8;
      }

      // Séparateur
      doc.setDrawColor(210, 210, 210); doc.setLineWidth(0.25);
      doc.line(margin, y, W - margin, y);
      y += 6;

      // Contenu markdown
      const blocks = parseMd(topoContent);
      renderBlocks(doc, blocks, margin, contentW, y);

      doc.save(`${topoTitle.replace(/\s+/g, '_')}.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="download-buttons">
      <button className="dl-btn dl-btn-pdf" onClick={handlePdf} disabled={loading}>
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
