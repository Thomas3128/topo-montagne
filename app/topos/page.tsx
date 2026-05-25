import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllTopos } from '@/lib/topos';
import FormattedDate from '@/components/FormattedDate';

export const metadata: Metadata = {
  title: 'Topos — La montagne vue par Dijs',
  description: 'Tous les topos de randonnée, alpinisme et ski de rando.',
};

export default function ToposPage() {
  const topos = getAllTopos();

  return (
    <main className="topos-page-main">
      <section>
        <ul className="topos-list">
          {topos.map((topo, index) => (
            <li key={topo.slug} className={index === 0 ? 'featured' : ''}>
              <Link href={`/topos/${topo.slug}`}>
                {topo.frontmatter.heroImage && (
                  <Image
                    src={topo.frontmatter.heroImage}
                    alt=""
                    width={720}
                    height={360}
                  />
                )}
                <h4 className="topo-title">{topo.frontmatter.title}</h4>
                <p className="topo-date">
                  <FormattedDate date={topo.frontmatter.pubDate} />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
