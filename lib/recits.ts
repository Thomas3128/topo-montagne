import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const RECITS_DIR = path.join(process.cwd(), 'content/recits');

export interface RecitPhoto {
  id: string;
  src: string;
  caption?: string;
  alt?: string;
  jour?: number;
}

export interface RecitFrontmatter {
  title: string;
  topoSlug?: string;
  pubDate: string;
  heroImage?: string;
  jours?: { titre: string; label?: string; heroImage?: string }[];
  photos?: RecitPhoto[];
}

export interface Recit {
  slug: string;
  frontmatter: RecitFrontmatter;
  content: string;
}

interface RecitDayFrontmatter {
  titre: string;
  label?: string;
  heroImage?: string;
  photos?: RecitPhoto[];
}

function readSingleFileRecit(filepath: string, slug: string): Recit {
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as RecitFrontmatter, content };
}

// Récit découpé en plusieurs fichiers : _meta.mdx pour les infos générales,
// puis un fichier par jour (01-xxx.mdx, 02-xxx.mdx, ...) pour le texte et les
// photos propres à ce jour. On les recompose ici en un seul Recit, avec
// chaque jour enveloppé dans <Jour n={N}>, pour que le reste de l'app
// (page.tsx, JourProvider, PhotoGalleryProvider) n'ait rien à changer.
function readMultiFileRecit(dir: string, slug: string): Recit {
  const { data: meta } = matter(fs.readFileSync(path.join(dir, '_meta.mdx'), 'utf-8'));

  const dayFilenames = fs
    .readdirSync(dir)
    .filter((f) => (f.endsWith('.md') || f.endsWith('.mdx')) && !f.startsWith('_'))
    .sort();

  const jours: NonNullable<RecitFrontmatter['jours']> = [];
  const photos: RecitPhoto[] = [];
  const bodyParts: string[] = [];

  dayFilenames.forEach((filename, i) => {
    const n = i + 1;
    const { data, content } = matter(fs.readFileSync(path.join(dir, filename), 'utf-8'));
    const day = data as RecitDayFrontmatter;

    jours.push({ titre: day.titre, label: day.label, heroImage: day.heroImage });
    for (const photo of day.photos ?? []) {
      photos.push({ ...photo, jour: n });
    }
    bodyParts.push(`<Jour n={${n}}>\n\n${content.trim()}\n\n</Jour>`);
  });

  return {
    slug,
    frontmatter: { ...(meta as RecitFrontmatter), jours, photos },
    content: bodyParts.join('\n\n'),
  };
}

function readRecit(entryPath: string, slug: string): Recit {
  return fs.statSync(entryPath).isDirectory()
    ? readMultiFileRecit(entryPath, slug)
    : readSingleFileRecit(entryPath, slug);
}

export function getAllRecits(): Recit[] {
  if (!fs.existsSync(RECITS_DIR)) return [];
  return fs
    .readdirSync(RECITS_DIR)
    .filter((f) => {
      const full = path.join(RECITS_DIR, f);
      return fs.statSync(full).isDirectory() || f.endsWith('.md') || f.endsWith('.mdx');
    })
    .map((f) => {
      const full = path.join(RECITS_DIR, f);
      const slug = fs.statSync(full).isDirectory() ? f : f.replace(/\.(mdx?)$/, '');
      return readRecit(full, slug);
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.pubDate).getTime() -
        new Date(a.frontmatter.pubDate).getTime()
    );
}

export function getRecitBySlug(slug: string): Recit | null {
  const dirPath = path.join(RECITS_DIR, slug);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    return readRecit(dirPath, slug);
  }
  for (const ext of ['.mdx', '.md']) {
    const filepath = path.join(RECITS_DIR, `${slug}${ext}`);
    if (fs.existsSync(filepath)) {
      return readRecit(filepath, slug);
    }
  }
  return null;
}
