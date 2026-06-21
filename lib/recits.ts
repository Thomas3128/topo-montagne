import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const RECITS_DIR = path.join(process.cwd(), 'content/recits');

export interface RecitFrontmatter {
  title: string;
  topoSlug?: string;
  pubDate: string;
  heroImage?: string;
  jours?: { titre: string; label?: string }[];
}

export interface Recit {
  slug: string;
  frontmatter: RecitFrontmatter;
  content: string;
}

export function getAllRecits(): Recit[] {
  if (!fs.existsSync(RECITS_DIR)) return [];
  return fs
    .readdirSync(RECITS_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.(mdx?)$/, '');
      const raw = fs.readFileSync(path.join(RECITS_DIR, filename), 'utf-8');
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as RecitFrontmatter, content };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.pubDate).getTime() -
        new Date(a.frontmatter.pubDate).getTime()
    );
}

export function getRecitBySlug(slug: string): Recit | null {
  for (const ext of ['.mdx', '.md']) {
    const filepath = path.join(RECITS_DIR, `${slug}${ext}`);
    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath, 'utf-8');
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as RecitFrontmatter, content };
    }
  }
  return null;
}
