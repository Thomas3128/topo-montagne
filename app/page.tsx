export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <h1>L&apos;appel des sommets</h1>
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
        <div className="card">
          <h3>Derniers Topos</h3>
          <p>Découvrez les derniers topos recensés…</p>
          <a href="/topos" className="btn-link">Explorer les topos →</a>
        </div>
        <div className="card">
          <h3>À propos</h3>
          <p>
            Pourquoi ce site ? Qui se cache derrière le sac à dos ? Découvrez ma philosophie de
            randonnée.
          </p>
          <a href="/about" className="btn-link">En savoir plus →</a>
        </div>
      </section>

      <section className="quote-box">
        <blockquote>
          &ldquo;J&apos;y passerai bien un bout de journée… une nuit… voire même la vie.&rdquo;
        </blockquote>
      </section>
    </main>
  );
}
