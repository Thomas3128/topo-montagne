import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'À propos — La montagne vue par Dijs',
  description: 'Mon parcours, de la plaine aux sommets, et la genèse de ce carnet de topos.',
};

export default function About() {
  return (
    <main className="content-main">
      <article>
        <div className="prose-wrapper">
          <div className="post-title">
            <h1>À propos</h1>
            <hr />
            <div className="hero-image">
              <Image
                src="/images/about.jpg"
                alt="Un randonneur face aux sommets"
                width={1020}
                height={510}
                className="about-photo"
              />
            </div>
          </div>

          <h2>Un héritage plutôt montagnard</h2>
          <p>
            Dès l&apos;enfance, j&apos;ai eu la chance de pouvoir partir en vacances avec mes
            parents. L&apos;hiver au ski, l&apos;été en altitude : la montagne était notre décor
            habituel. À l&apos;époque, je me demandais parfois pourquoi nous n&apos;allions pas
            plus souvent à la plage comme mes amis, sans pour autant y attacher une importance
            démesurée ; c&apos;était simplement une curiosité d&apos;enfant face à d&apos;autres
            horizons.
          </p>

          <h2>L&apos;étape grenobloise</h2>
          <p>
            Le véritable tournant s&apos;est produit en arrivant à <strong>Grenoble</strong> pour
            mes études. Déjà coureur, j&apos;ai profité de la proximité des massifs pour intégrer
            le <strong>trail</strong> à mon quotidien. Les randonnées, très accessibles, sont
            devenues plus fréquentes et ma pratique du ski s&apos;est intensifiée, passant
            d&apos;une dizaine à une vingtaine de journées par an. C&apos;est durant mes années en
            école, à travers l&apos;escalade et le ski, que je me suis véritablement plongé dans
            cet univers.
          </p>

          <h2>L&apos;évolution technique</h2>
          <p>
            Après mes études, j&apos;ai eu envie d&apos;aller plus haut. Je me suis tourné vers
            l&apos;<strong>alpinisme</strong>, une démarche personnelle qui m&apos;a mené à suivre
            des formations à Chamonix et à pratiquer avec mes amis montagnards. Plus tard, la
            pratique du ski et de la rando m&apos;ont naturellement poussé vers le{' '}
            <strong>ski de randonnée</strong>, encouragé par des amis qui, me connaissant,
            m&apos;ont incité à essayer cette nouvelle approche de la montagne.
          </p>

          <h2>Pourquoi ce site ?</h2>
          <p>
            Aujourd&apos;hui, la montagne est devenue une passion centrale. En discutant autour de
            moi, j&apos;ai réalisé que beaucoup de monde souhaite découvrir ce milieu sans savoir
            comment s&apos;y prendre, ni par où commencer.
          </p>
          <p>
            L&apos;idée de ce site est née de deux envies :<br />
            <strong>• Transmettre et aider :</strong> Partager mes tracés et mon expérience pour
            donner quelques clés à ceux qui veulent se lancer, tout en sensibilisant au respect de
            la nature.
            <br />
            <strong>• Écrire et témoigner :</strong> Mon frère, remarquant mon goût pour
            l&apos;écriture, m&apos;a poussé à poser mes aventures sur papier. Il est vrai que les
            récits de plusieurs jours sont difficiles à raconter de vive voix ; ce site me permet
            de garder une trace fidèle de ces expériences.
          </p>

          <p className="signature-date">Arrivé en ces lieux le 13 août 2000</p>
        </div>
      </article>
    </main>
  );
}
