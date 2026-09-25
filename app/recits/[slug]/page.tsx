import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllRecits, getRecitBySlug } from '@/lib/recits';
import { getTopoBySlug } from '@/lib/topos';
import FormattedDate from '@/components/FormattedDate';
import { mdxComponents } from '@/components/mdx';
import Citation from '@/components/mdx/Citation';
import JourProvider from '@/components/JourProvider';
import JourNav, { JourPager } from '@/components/JourNav';
import JourHeroImage from '@/components/JourHeroImage';
import PhotoGalleryProvider from '@/components/PhotoGalleryProvider';
import PhotoGallery from '@/components/PhotoGallery';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllRecits().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recit = getRecitBySlug(slug);
  if (!recit) return {};
  return {
    title: `${recit.frontmatter.title} — L'appel des terres hautes`,
  };
}

export default async function RecitPage({ params }: Props) {
  const { slug } = await params;
  const recit = getRecitBySlug(slug);
  if (!recit) notFound();

  const { frontmatter, content } = recit;
  const topo = frontmatter.topoSlug ? getTopoBySlug(frontmatter.topoSlug) : null;
  const jours = frontmatter.jours ?? [];

  const body = (
    <>
      <JourHeroImage
        images={jours.map(j => j.heroImage)}
        fallback={frontmatter.heroImage}
        style={{ marginBottom: '2rem' }}
        priority
      />
      <PhotoGalleryProvider photos={frontmatter.photos ?? []}>
        <div className="topo-text">
          <MDXRemote source={content} components={{ ...mdxComponents, blockquote: Citation }} />
        </div>
        <PhotoGallery />
      </PhotoGalleryProvider>
    </>
  );

  return (
    <main className="content-main">
      <article className="prose-wrapper">

        <div className="post-title">
          <div className="post-date">
            <FormattedDate date={frontmatter.pubDate} />
          </div>
          <h1>{frontmatter.title}</h1>
          {topo && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
              <Link href={`/topos/${frontmatter.topoSlug}`} style={{ color: 'var(--accent)' }}>
                ← Voir le topo : {topo.frontmatter.title}
              </Link>
            </p>
          )}
          <hr />
        </div>

        {jours.length ? (
          <JourProvider
            titres={jours.map(j => j.titre)}
            labels={jours.some(j => j.label) ? jours.map((j, i) => j.label ?? `J${i + 1}`) : undefined}
          >
            <JourNav />
            {body}
            <JourPager />
          </JourProvider>
        ) : (
          body
        )}

      </article>
    </main>
  );
}
