import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import PdfPopup from '@/components/PdfPopup';

const filePath = path.join(process.cwd(), 'content/annexes/aide.mdx');

export async function generateMetadata(): Promise<Metadata> {
  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
  return {
    title: `${data.title} — L'appel des terres hautes`,
    description: data.description,
  };
}

export default async function AidePage() {
  const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'));

  return (
    <main className="content-main">
      <article className="prose-wrapper">
        <div className="post-title">
          <h1>{data.title}</h1>
          <hr />
        </div>
        <MDXRemote source={content} components={{ PdfPopup }} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </article>
    </main>
  );
}
