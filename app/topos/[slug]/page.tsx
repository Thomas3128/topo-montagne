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
import Jour from '@/components/mdx/Jour';
import PhotoLink from '@/components/mdx/PhotoLink';
import JourProvider from '@/components/JourProvider';
import JourNav from '@/components/JourNav';
import JourHeroImage from '@/components/JourHeroImage';
import JourMap from '@/components/JourMap';
import PhotoGalleryProvider from '@/components/PhotoGalleryProvider';
import PhotoGallery from '@/components/PhotoGallery';

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
  const hasJours = !!frontmatter.jours?.length;

  const layout = (
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

        <PhotoGalleryProvider photos={frontmatter.photos ?? []}>

          {hasJours ? (
            <>
              {(frontmatter.jours!.some(j => j.heroImage) || frontmatter.heroImage || frontmatter.jours!.some(j => j.gpxPath) || frontmatter.gpxPath) && (
                <div className="topo-media">
                  <JourHeroImage
                    images={frontmatter.jours!.map(j => j.heroImage)}
                    fallback={frontmatter.heroImage}
                  />
                  <JourMap
                    gpxPaths={frontmatter.jours!.map(j => j.gpxPath)}
                    fallback={frontmatter.gpxPath}
                    color={frontmatter.gpxColor}
                  />
                </div>
              )}
              <div className="topo-text">
                <MDXRemote source={content} components={{ Photo, Gallery, Jour, PhotoLink }} />
              </div>
            </>
          ) : (
            <>
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
                <MDXRemote source={content} components={{ Photo, Gallery, PhotoLink }} />
              </div>
            </>
          )}

          {frontmatter.recitSlug && (
            <div className="recit-link">
              <a href={`/recits/${frontmatter.recitSlug}`}>Lire le récit →</a>
            </div>
          )}

          <PhotoGallery />

        </PhotoGalleryProvider>

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
          gpxPaths={hasJours ? frontmatter.jours!.map(j => j.gpxPath) : undefined}
          gpxColor={frontmatter.gpxColor}
          ficheTechnique={frontmatter.ficheTechnique}
          ficheTechniques={hasJours ? frontmatter.jours!.map(j => j.ficheTechnique) : undefined}
        />
        <DownloadButtons
          gpxPath={frontmatter.gpxPath}
          gpxPaths={hasJours ? frontmatter.jours!.map(j => j.gpxPath) : undefined}
          braUrl={frontmatter.braUrl}
          topoTitle={frontmatter.title}
          topoContent={content}
          ficheTechnique={frontmatter.ficheTechnique}
          gpxColor={frontmatter.gpxColor}
        />
      </aside>

    </div>
  );

  const title = (
    <div className="topo-header-row">
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
    </div>
  );

  return (
    <main className="content-main">
      {title}

      {hasJours ? (
        <JourProvider titres={frontmatter.jours!.map(j => j.titre)}>
          <div className="topo-header-row">
            <JourNav />
          </div>
          {layout}
        </JourProvider>
      ) : (
        layout
      )}
    </main>
  );
}
