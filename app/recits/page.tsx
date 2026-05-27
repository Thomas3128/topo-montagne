import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllRecits } from '@/lib/recits';
import { getAllLivres } from '@/lib/lectures';
import FormattedDate from '@/components/FormattedDate';
import LecturesGrid from '@/components/LecturesGrid';

export const metadata: Metadata = {
  title: 'Récits — La montagne vue par Dijs',
  description: "Récits de courses et recommandations de lecture.",
};

interface Props {
  searchParams: Promise<{ vue?: string }>;
}

export default async function RecitsPage({ searchParams }: Props) {
  const { vue } = await searchParams;
  const isLectures = vue === 'lectures';
  const recits = getAllRecits();
  const livres = getAllLivres();

  return (
    <main className="topos-page-main">
      <div className="recits-tabs">
        <Link href="/recits" className={`recits-tab${!isLectures ? ' recits-tab--active' : ''}`}>
          Mes récits
        </Link>
        <Link href="/recits?vue=lectures" className={`recits-tab${isLectures ? ' recits-tab--active' : ''}`}>
          Lectures
        </Link>
      </div>

      {isLectures ? (
        <>
          <p className="lectures-intro">
            La lecture est pour moi une façon de suspendre le temps. 
            Là-haut, quand l'horizon s'ouvre, un livre trouve presque toujours sa place au fond de mon sac, comme un compagnon de silence. 
            Voici quelques ouvrages qui m'ont habité, nés du souffle de la montagne et du goût de l'aventure.
          </p>
          <LecturesGrid livres={livres} />
        </>
      ) : (
        <section>
          <ul className="topos-list">
            {recits.map((recit, index) => (
              <li key={recit.slug} className={index === 0 ? 'featured' : ''}>
                <Link href={`/recits/${recit.slug}`}>
                  {recit.frontmatter.heroImage && (
                    <Image src={recit.frontmatter.heroImage} alt="" width={720} height={360} />
                  )}
                  <h4 className="topo-title">{recit.frontmatter.title}</h4>
                  <p className="topo-date">
                    <FormattedDate date={recit.frontmatter.pubDate} />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
