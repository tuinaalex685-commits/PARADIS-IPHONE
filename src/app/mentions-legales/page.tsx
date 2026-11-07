import type { Metadata } from 'next';
import { PageLegale } from '@/components/layout/PageLegale';
import { ACompleter } from '@/components/ui/Demo';

export const metadata: Metadata = {
  title: 'Mentions légales',
  alternates: { canonical: '/mentions-legales' },
  robots: { index: false },
};

export default function MentionsLegales() {
  return (
    <PageLegale titre={['Mentions', 'légales']} intro="Les informations sur l’éditeur et l’hébergeur du site."
      sections={[
        { t: 'Éditeur du site', c: <><p>Paradis des téléphones, <ACompleter>forme juridique, numéro RCCM et IFU</ACompleter>.</p><p><ACompleter>Adresse du siège</ACompleter></p></> },
        { t: 'Responsable de la publication', c: <p><ACompleter>Nom de la personne responsable</ACompleter></p> },
        { t: 'Hébergement', c: <p><ACompleter>Nom et adresse de l’hébergeur</ACompleter></p> },
        { t: 'Propriété des contenus', c: <p>Les textes, logos et éléments graphiques du site appartiennent à Paradis des téléphones. Les visuels des téléphones sont des rendus officiels d’Apple et de Samsung ; leur usage doit être vérifié avec les conditions revendeurs avant la mise en ligne définitive.</p> },
        { t: 'Contenus de démonstration', c: <p>Ce site est un prototype : les produits, prestations, formations, durées et tarifs affichés sont des exemples de présentation.</p> },
      ]} />
  );
}
