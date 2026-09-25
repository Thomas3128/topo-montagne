import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllTopos, getTopoBySlug } from '@/lib/topos';
import FormattedDate from '@/components/FormattedDate';
import TopoInfoPanel from '@/components/TopoInfoPanel';
import DownloadButtons from '@/components/DownloadButtons';
import TransportRoute from '@/components/TransportRoute';
import RouteRecap from '@/components/RouteRecap';
import { mdxComponents } from '@/components/mdx';
import JourProvider from '@/components/JourProvider';
import JourNav, { JourPager } from '@/components/JourNav';
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
  // Un topo sans « jours » se comporte comme un topo d'un seul jour : les
  // composants Jour* retombent alors sur l'image et la trace globales.
  const jours = frontmatter.jours ?? [];
  const heroImages = jours.map(j => j.heroImage);
  const gpxPaths = jours.map(j => j.gpxPath);
  const hasMedia = !!(frontmatter.heroImage || frontmatter.gpxPath || heroImages.some(Boolean) || gpxPaths.some(Boolean));
  const hasLeftSidebar = !!(frontmatter.transport?.length || frontmatter.route?.length);

  const layout = (
    <div className={`topo-outer-layout${hasLeftSidebar ? ' topo-outer-layout--transport' : ''}`}>

      {/* Sidebar gauche : transports + itinéraire */}
      {hasLeftSidebar && (
        <aside className="topo-sidebar">
          {frontmatter.transport?.length && <TransportRoute stops={frontmatter.transport} />}
          {frontmatter.route?.length && <RouteRecap stops={frontmatter.route} />}
        </aside>
      )}

      {/* Contenu principal */}
      <article className="prose-wrapper">
        <PhotoGalleryProvider photos={frontmatter.photos ?? []}>

          {hasMedia && (
            <div className="topo-media">
              <JourHeroImage images={heroImages} fallback={frontmatter.heroImage} priority />
              <JourMap gpxPaths={gpxPaths} fallback={frontmatter.gpxPath} color={frontmatter.gpxColor} />
            </div>
          )}

          <div className="topo-text">
            <MDXRemote source={content} components={mdxComponents} />
          </div>

          {jours.length > 0 && <JourPager />}

          {frontmatter.recitSlug && (
            <div className="recit-link">
              <Link href={`/recits/${frontmatter.recitSlug}`}>Lire le récit →</Link>
            </div>
          )}

          <PhotoGallery />

        </PhotoGalleryProvider>
      </article>

      {/* Sidebar droite : BRA + stats GPX + fiche technique + téléchargements */}
      <aside className="topo-sidebar">
        {frontmatter.braUrl && (
          <a href={frontmatter.braUrl} target="_blank" rel="noopener noreferrer" className="bra-link">
            Consulter le BRA (Avalanches)
          </a>
        )}
        <TopoInfoPanel
          gpxPath={frontmatter.gpxPath}
          gpxPaths={gpxPaths}
          gpxColor={frontmatter.gpxColor}
          ficheTechnique={frontmatter.ficheTechnique}
          ficheTechniques={jours.map(j => j.ficheTechnique)}
        />
        <DownloadButtons
          gpxPath={frontmatter.gpxPath}
          gpxPaths={gpxPaths}
          braUrl={frontmatter.braUrl}
          topoTitle={frontmatter.title}
          topoContent={content}
          ficheTechnique={frontmatter.ficheTechnique}
        />
      </aside>

    </div>
  );

  return (
    <main className="content-main">
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

      {jours.length ? (
        <JourProvider titres={jours.map(j => j.titre)}>
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
