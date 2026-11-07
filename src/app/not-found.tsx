import Link from 'next/link';
import { BoutonLien } from '@/components/ui/Bouton';

export default function PageIntrouvable() {
  return (
    <section className="conteneur flex min-h-[80svh] flex-col justify-center pb-16 pt-32">
      <p className="chiffres text-sourdine">Erreur 404</p>
      <h1 className="titre mt-4 text-[clamp(3rem,9vw,8rem)]">Pas de réseau ici.</h1>
      <p className="mt-6 max-w-lg text-[1.1rem] text-sourdine">Cette page n’existe pas ou plus. Le lien est peut-être ancien. Reprenez depuis l’un de ces chemins.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <BoutonLien href="/">Retour à l’accueil</BoutonLien>
        <BoutonLien href="/iphone" variante="secondaire">Voir les iPhone</BoutonLien>
      </div>
      <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-filet pt-6 font-semibold">
        {[['/samsung', 'Samsung'], ['/trouver', 'Trouver le mien'], ['/boutique', 'La boutique']].map(([h, l]) => (
          <li key={h}><Link href={h} className="underline decoration-filet underline-offset-[6px] hover:decoration-accent">{l}</Link></li>
        ))}
      </ul>
    </section>
  );
}
