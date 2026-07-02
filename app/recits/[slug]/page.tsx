import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllRecits, getRecitBySlug } from '@/lib/recits';
import { getTopoBySlug } from '@/lib/topos';
import FormattedDate from '@/components/FormattedDate';
import Photo from '@/components/mdx/Photo';
import Gallery from '@/components/mdx/Gallery';
import Jour from '@/components/mdx/Jour';
import PhotoLink from '@/components/mdx/PhotoLink';
import JourProvider from '@/components/JourProvider';
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

  return (
    <main className="content-main">
      <article className="prose-wrapper">

        <PhotoGalleryProvider photos={frontmatter.photos ?? []}>

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

          {frontmatter.jours?.length ? (
            <JourProvider
              titres={frontmatter.jours.map(j => j.titre)}
              labels={frontmatter.jours.some(j => j.label) ? frontmatter.jours.map((j, i) => j.label ?? `J${i + 1}`) : undefined}
            >
              <JourHeroImage
                images={frontmatter.jours.map(j => j.heroImage)}
                fallback={frontmatter.heroImage}
                style={{ marginBottom: '2rem' }}
              />
              <div className="topo-text">
                <MDXRemote source={content} components={{ Photo, Gallery, Jour, PhotoLink }} />
              </div>
            </JourProvider>
          ) : (
            <>
              {frontmatter.heroImage && (
                <div className="topo-photo" style={{ marginBottom: '2rem' }}>
                  <Image src={frontmatter.heroImage} alt="" fill style={{ objectFit: 'cover', borderRadius: '12px' }} />
                </div>
              )}
              <div className="topo-text">
                <MDXRemote source={content} components={{ Photo, Gallery, PhotoLink }} />
              </div>
            </>
          )}

          <PhotoGallery />

        </PhotoGalleryProvider>

      </article>
    </main>
  );
}
