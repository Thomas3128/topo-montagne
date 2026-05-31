import type { Metadata } from 'next';
import MaterielClient from '@/components/MaterielClient';

export const metadata: Metadata = {
  title: "Que mettre dans son sac ? — L'appel des terres hautes",
  description: 'Listes de matériel par type de sortie — rando journée, trek, alpinisme et sécurité.',
};

export default function MaterielPage() {
  return (
    <main className="content-main">
      <article className="prose-wrapper">
        <div className="post-title">
          <h1>Que mettre dans son sac ?</h1>
          <hr />
        </div>
        <p className="materiel-intro">
          Ces listes sont indicatives. Adaptez-les à la durée, la saison, le terrain et votre expérience.
          Le meilleur équipement est celui que vous savez utiliser.
        </p>
        <p className="materiel-intro">
          La rubrique <em>En cas de règles</em> a été rédigée par des amies pratiquantes,
          pour être au plus près de la réalité. Chaque personne est différente,
          ces suggestions restent un point de départ, à adapter selon ses propres besoins et habitudes.
        </p>
        <MaterielClient />
      </article>
    </main>
  );
}
