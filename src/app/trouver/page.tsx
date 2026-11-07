import type { Metadata } from 'next';
import { Parcours } from '@/components/trouver/Parcours';
import { BoutonWhatsApp } from '@/components/ui/BoutonWhatsApp';

export const metadata: Metadata = {
  title: 'Trouver le téléphone qui vous correspond',
  description: 'Quatre questions simples (usage, budget, stockage, marque) pour voir les iPhone et Samsung qui vous correspondent, avec la raison de chaque proposition.',
  alternates: { canonical: '/trouver' },
};

export default function Trouver() {
  return (
    <>
      <div className="conteneur pb-10 pt-28 md:pt-36">
        <h1 className="titre mx-auto max-w-5xl text-[clamp(2.6rem,6.4vw,5.6rem)]">Trouvons le vôtre.</h1>
        <p className="mx-auto mt-4 max-w-5xl text-[1.08rem] text-sourdine">Quatre questions, trente secondes. Aucune inscription.</p>
        <div className="mt-10"><Parcours /></div>
      </div>
      <section className="conteneur pb-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 rounded-[var(--radius-carte)] bg-accent-clair p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="titre text-[1.6rem]">Vous cherchez un modèle précis ?</p>
            <p className="mt-1 text-sourdine">Décrivez-le : la boutique le cherche pour vous, même s’il n’est pas sur le site.</p>
          </div>
          <BoutonWhatsApp evenement="product_contact_click" item="introuvable" titre="Votre demande est prête"
            message="Bonjour Paradis des téléphones, je cherche ce modèle : ">Décrire mon téléphone</BoutonWhatsApp>
        </div>
      </section>
    </>
  );
}
