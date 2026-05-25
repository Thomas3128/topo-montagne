import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllRecits } from '@/lib/recits';
import FormattedDate from '@/components/FormattedDate';

export const metadata: Metadata = {
  title: 'Récits — La montagne vue par Dijs',
  description: 'Récits de courses et d\'aventures en montagne.',
};

export default function RecitsPage() {
  const recits = getAllRecits();

  return (
    <main className="topos-page-main">
      <section>
        <ul className="topos-list">
          {recits.map((recit, index) => (
            <li key={recit.slug} className={index === 0 ? 'featured' : ''}>
              <Link href={`/recits/${recit.slug}`}>
                {recit.frontmatter.heroImage && (
                  <Image
                    src={recit.frontmatter.heroImage}
                    alt=""
                    width={720}
                    height={360}
                  />
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
    </main>
  );
}
