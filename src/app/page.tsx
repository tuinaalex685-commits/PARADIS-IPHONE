import { Hero } from '@/components/accueil/Hero';
import { Frise } from '@/components/accueil/Frise';
import { Ruban, ParBudget, BlocSamsung, CommentCommander, LaBoutique } from '@/components/accueil/Sections';
import { Faq } from '@/components/ui/Faq';
import { site } from '@/data/site';

/**
 * Accueil, pensé comme un parcours d'achat :
 * je touche le produit (héros) → je comprends la gamme (frise) → je pars de mon budget →
 * l'alternative Samsung → comment commander → la boutique réelle → les dernières questions.
 */
export default function Accueil() {
  return (
    <>
      <Hero />
      <Ruban />
      <Frise />
      <ParBudget />
      <BlocSamsung />
      <div className="h-16 lg:h-24" />
      <CommentCommander />
      <LaBoutique />
      <div className="conteneur pb-10">
        <Faq questions={[
          { q: 'Les téléphones sont-ils neufs ou reconditionnés ?', r: 'La boutique propose les deux selon les modèles. L’état exact du téléphone que vous commandez vous est indiqué par le conseiller avant tout paiement.' },
          { q: 'Les prix affichés sont-ils à jour ?', r: `Ils ont été relevés le ${site.releve} sur le site de la boutique. Ils peuvent évoluer : le conseiller vous confirme le prix exact de votre configuration avant la vente.` },
          { q: 'Comment se passent le paiement et la livraison ?', r: 'Rien n’est payé sur le site. Après confirmation sur WhatsApp, vous réglez selon les modalités convenues avec la boutique. Livraison partout au Burkina, ou retrait à Koulouba.' },
          { q: 'Je ne trouve pas le modèle que je cherche.', r: 'Décrivez-le sur WhatsApp (modèle, capacité, couleur) : la boutique le cherche pour vous, même s’il n’est pas sur le site.' },
          { q: 'Quelle différence entre eSIM et SIM physique ?', r: 'La SIM physique est la petite carte habituelle. L’eSIM est intégrée au téléphone et s’active avec votre opérateur. Certains modèles existent dans les deux versions : choisissez celle qui vous convient dans la fiche.' },
        ]} />
      </div>
    </>
  );
}
