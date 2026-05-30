import Image from 'next/image';

export default function Home() {
  return (
    <>
      <div className="hero-full">
        <Image
          src="/images/bannière_accueil.jpg"
          alt="Bannière d'accueil"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
          priority
        />
        <div className="hero-gradient" />
        <div className="hero-content">
          <p className="hero-eyebrow">Topos · Récits · Montagne</p>
          <h1 className="hero-title">L'appel des terres hautes</h1>
          <a href="/topos" className="hero-cta">Explorer les topos →</a>
        </div>
      </div>

      <main>
        <section className="hero-section">
          <p>
            Bienvenue dans le carnet de bord d&apos;un passionné de la montagne. Des sentiers de
            randonnée aux arêtes de granit, je partage ici mes traces pour ceux qui cherchent à
            s&apos;évader au-dessus des nuages.
          </p>
          <p>
            Pour moi, la montagne n&apos;est pas qu&apos;un terrain de jeu technique, c&apos;est un
            espace de liberté brute. Qu&apos;il s&apos;agisse de gravir des crêtes effilées en plein
            été ou de tracer dans la poudreuse lors de longues sorties en ski de rando, chaque
            ascension a son histoire.
          </p>
          <p>
            Vous trouverez ici des topos détaillés, nés de mes sorties en montagne. Pas de bla-bla
            inutile : des impressions sincères, quelques photos prises sur le vif et les informations
            essentielles pour ceux qui voudraient préparer leurs propres aventures, en respectant
            toujours le rythme de la nature.
          </p>
        </section>

        <hr />

        <section className="home-grid">
          <a href="/topos" className="card">
            <h3>Topos</h3>
            <p>Des itinéraires détaillés, des traces GPX et les infos essentielles pour préparer ta sortie.</p>
            <span className="btn-link">Voir les topos →</span>
          </a>
          <a href="/recits" className="card">
            <h3>Récits</h3>
            <p>Les histoires derrière les ascensions — les galères, les panoramas, les silences.</p>
            <span className="btn-link">Lire les récits →</span>
          </a>
          <a href="/about" className="card">
            <h3>À propos</h3>
            <p>Qui se cache derrière le sac à dos ? Ma philosophie de la montagne.</p>
            <span className="btn-link">En savoir plus →</span>
          </a>
        </section>

        <section className="quote-box">
          <blockquote>
            &ldquo;J&apos;y passerai bien un bout de journée… une nuit… voire même la vie.&rdquo;
          </blockquote>
        </section>
      </main>
    </>
  );
}
