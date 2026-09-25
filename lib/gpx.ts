// Chargement et analyse des traces GPX côté navigateur.
// La carte, le panneau de stats et l'export PDF lisent le même fichier :
// on ne le télécharge qu'une fois par page grâce au cache ci-dessous.

export interface GpxStats {
  distance: number; // km
  elevGain: number; // m
  elevLoss: number; // m
  elevData: [number, number][]; // [distance cumulée (km), altitude (m)]
}

const cache = new Map<string, Promise<string>>();

export function loadGpx(path: string): Promise<string> {
  let pending = cache.get(path);
  if (!pending) {
    pending = fetch(path).then((r) => {
      if (!r.ok) throw new Error(`GPX introuvable : ${path} (${r.status})`);
      return r.text();
    });
    // Un échec ne doit pas rester en cache : on retentera au prochain appel
    pending.catch(() => cache.delete(path));
    cache.set(path, pending);
  }
  return pending;
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

export function parseGpx(xml: string): GpxStats {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const pts = Array.from(doc.querySelectorAll('trkpt'));

  let distance = 0;
  let elevGain = 0;
  let elevLoss = 0;
  const elevData: [number, number][] = [];
  let prev: { lat: number; lon: number; ele: number } | null = null;

  for (const pt of pts) {
    const lat = parseFloat(pt.getAttribute('lat') ?? '0');
    const lon = parseFloat(pt.getAttribute('lon') ?? '0');
    const ele = parseFloat(pt.querySelector('ele')?.textContent ?? '0');

    if (prev) {
      distance += haversine(prev.lat, prev.lon, lat, lon);
      const diff = ele - prev.ele;
      if (diff > 0) elevGain += diff;
      else elevLoss -= diff;
    }
    elevData.push([distance / 1000, ele]);
    prev = { lat, lon, ele };
  }

  return { distance: distance / 1000, elevGain, elevLoss, elevData };
}

export async function loadGpxStats(path: string): Promise<GpxStats> {
  return parseGpx(await loadGpx(path));
}
