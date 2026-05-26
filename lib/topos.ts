import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const TOPOS_DIR = path.join(process.cwd(), 'content/topos');

export interface FicheRow {
  label: string;
  value: string;
}

export interface TransportStop {
  stop: string;
  via?: string;
  ligne?: string;
  duree?: string;
  lien?: string;
}

export interface TopoFrontmatter {
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  heroImage?: string;
  gpxPath?: string;
  gpxColor?: string;
  ficheTechnique?: FicheRow[];
  transport?: TransportStop[];
  recitSlug?: string;
  braUrl?: string;
}

export interface Topo {
  slug: string;
  frontmatter: TopoFrontmatter;
  content: string;
}

export function getAllTopos(): Topo[] {
  const files = fs.readdirSync(TOPOS_DIR);
  return files
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.(mdx?)$/, '');
      const raw = fs.readFileSync(path.join(TOPOS_DIR, filename), 'utf-8');
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as TopoFrontmatter, content };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.pubDate).getTime() -
        new Date(a.frontmatter.pubDate).getTime()
    );
}

export function getTopoBySlug(slug: string): Topo | null {
  for (const ext of ['.mdx', '.md']) {
    const filepath = path.join(TOPOS_DIR, `${slug}${ext}`);
    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath, 'utf-8');
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as TopoFrontmatter, content };
    }
  }
  return null;
}
