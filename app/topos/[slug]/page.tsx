import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllTopos, getTopoBySlug } from '@/lib/topos';
import FormattedDate from '@/components/FormattedDate';
import Map from '@/components/Map';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTopos().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topo = getTopoBySlug(slug);
  if (!topo) return {};
  return {
    title: `${topo.frontmatter.title} — La montagne vue par Dijs`,
    description: topo.frontmatter.description,
  };
}

export default async function TopoPage({ params }: Props) {
  const { slug } = await params;
  const topo = getTopoBySlug(slug);
  if (!topo) notFound();

  const { frontmatter, content } = topo;

  return (
    <main className="content-main">
      <article>
        <div className="prose-wrapper">
          <div className="post-title">
            <div className="post-date">
              <FormattedDate date={frontmatter.pubDate} />
              {frontmatter.updatedDate && (
                <div className="last-updated-on">
                  Mis à jour le <FormattedDate date={frontmatter.updatedDate} />
                </div>
              )}
            </div>
            <h1>{frontmatter.title}</h1>
            <hr />
            {frontmatter.heroImage && (
              <div className="hero-image">
                <Image
                  src={frontmatter.heroImage}
                  alt=""
                  width={1020}
                  height={510}
                />
              </div>
            )}
          </div>

          <MDXRemote source={content} components={{ Map }} />
        </div>
      </article>
    </main>
  );
}
