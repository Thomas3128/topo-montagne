import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllTopos, getTopoBySlug } from '@/lib/topos';
import FormattedDate from '@/components/FormattedDate';
import Map from '@/components/Map';
import TopoInfoPanel from '@/components/TopoInfoPanel';
import DownloadButtons from '@/components/DownloadButtons';
import TransportRoute from '@/components/TransportRoute';
import RouteRecap from '@/components/RouteRecap';
import Photo from '@/components/mdx/Photo';
import Gallery from '@/components/mdx/Gallery';

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
    title: `${topo.frontmatter.title} — L'appel des terres hautes`,
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
      <div className={`topo-outer-layout${(frontmatter.transport?.length || frontmatter.route?.length) ? ' topo-outer-layout--transport' : ''}`}>

        {/* Sidebar gauche : transports + itinéraire */}
        {(frontmatter.transport?.length || frontmatter.route?.length) && (
          <aside className="topo-sidebar">
            {frontmatter.transport?.length && <TransportRoute stops={frontmatter.transport} />}
            {frontmatter.route?.length && <RouteRecap stops={frontmatter.route} />}
          </aside>
        )}

        {/* Contenu principal */}
        <article className="prose-wrapper">

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

          <div className="topo-text">
            <MDXRemote source={content} components={{ Photo, Gallery }} />
          </div>

          {frontmatter.recitSlug && (
            <div className="recit-link">
              <a href={`/recits/${frontmatter.recitSlug}`}>Lire le récit →</a>
            </div>
          )}

        </article>

        {/* Sidebar sticky : BRA + profil + fiche */}
        <aside className="topo-sidebar">
          {frontmatter.braUrl && (
              <a href={frontmatter.braUrl} target="_blank" rel="noopener noreferrer" className="bra-link">
                Consulter le BRA (Avalanches)
              </a>
            )}
          <TopoInfoPanel
            gpxPath={frontmatter.gpxPath}
            gpxColor={frontmatter.gpxColor}
            ficheTechnique={frontmatter.ficheTechnique}
          />
          <DownloadButtons
            gpxPath={frontmatter.gpxPath}
            braUrl={frontmatter.braUrl}
            topoTitle={frontmatter.title}
            topoContent={content}
            ficheTechnique={frontmatter.ficheTechnique}
            gpxColor={frontmatter.gpxColor}
          />
        </aside>

      </div>
    </main>
  );
}
