import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const LECTURES_DIR = path.join(process.cwd(), 'content/lectures');

export interface LivreFrontmatter {
  title: string;
  author: string;
  cover?: string;
  genre?: string;
  resume?: string;
  note?: string;
}

export interface Livre {
  slug: string;
  frontmatter: LivreFrontmatter;
}

export function getAllLivres(): Livre[] {
  if (!fs.existsSync(LECTURES_DIR)) return [];
  return fs
    .readdirSync(LECTURES_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.(mdx?)$/, '');
      const raw = fs.readFileSync(path.join(LECTURES_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return { slug, frontmatter: data as LivreFrontmatter };
    });
}
