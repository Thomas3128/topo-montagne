import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllTopos, getTopoBySlug } from '@/lib/topos';
import FormattedDate from '@/components/FormattedDate';
import Map from '@/components/Map';
import TopoInfoPanel from '@/components/TopoInfoPanel';

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
      <article className="prose-wrapper">

        {/* Titre + date */}
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
        </div>

        {/* Photo (gauche) + Carte (droite) — même hauteur */}
        {(frontmatter.heroImage || frontmatter.gpxPath) && (
          <div className="topo-media">
            {frontmatter.heroImage && (
              <div className="topo-photo">
                <Image src={frontmatter.heroImage} alt="" fill style={{ objectFit: 'cover', borderRadius: '12px' }} />
              </div>
            )}
            {frontmatter.gpxPath && (
              <div className="topo-map">
                <Map gpxPath={frontmatter.gpxPath} color={frontmatter.gpxColor} />
              </div>
            )}
          </div>
        )}

        {/* Encart pleine largeur : stats GPX + profil alti + fiche technique */}
        <TopoInfoPanel
          gpxPath={frontmatter.gpxPath}
          gpxColor={frontmatter.gpxColor}
          ficheTechnique={frontmatter.ficheTechnique}
        />

        {/* Texte de l'article */}
        <div className="topo-text">
          <MDXRemote source={content} />
        </div>

      </article>
    </main>
  );
}
