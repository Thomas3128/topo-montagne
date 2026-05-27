import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

const filePath = path.join(process.cwd(), 'content/annexes/materiel.mdx');

export async function generateMetadata(): Promise<Metadata> {
  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
  return {
    title: `${data.title} — La montagne vue par Dijs`,
    description: data.description,
  };
}

export default async function MaterielPage() {
  const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'));

  return (
    <main className="content-main">
      <article className="prose-wrapper">
        <div className="post-title">
          <h1>{data.title}</h1>
          <hr />
        </div>
        <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </article>
    </main>
  );
}
