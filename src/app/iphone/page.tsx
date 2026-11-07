import type { Metadata } from 'next';
import { Suspense } from 'react';
import { iphones } from '@/data/telephones';
import { EnTetePage } from '@/components/layout/EnTetePage';
import { Catalogue } from '@/components/catalogue/Catalogue';
import { BoutonLien } from '@/components/ui/Bouton';
import { SuiviVue } from '@/components/analytics/SuiviVue';
import { CarteTelephone } from '@/components/telephone/CarteTelephone';

export const metadata: Metadata = {
  title: 'iPhone à Ouagadougou : de l’iPhone SE à l’iPhone 18 Pro Max',
  description: 'Tous les iPhone de Paradis des téléphones, prix affichés : filtrez par gamme, budget, capacité ou carte SIM, configurez la finition, commandez sur WhatsApp.',
  alternates: { canonical: '/iphone' },
};

export default function PageIphone() {
  return (
    <>
      <SuiviVue evenement="view_shop" item="iphone" />
      <EnTetePage fil={[{ label: 'iPhone' }]} titre={['Tous les iPhone,', 'du SE au 18 Pro Max.']}
        intro={`${iphones.length} modèles, des plus accessibles aux plus récents. Filtrez, comparez, puis configurez la finition et la capacité : la boutique confirme le prix et la disponibilité.`}>
        <BoutonLien href="/trouver" variante="secondaire">Pas sûr ? Trouvez le vôtre en 4 questions</BoutonLien>
      </EnTetePage>
      <section className="conteneur pb-16">
        <Suspense fallback={<ul className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{iphones.slice(0, 8).map((t) => <li key={t.slug}><CarteTelephone t={t} /></li>)}</ul>}>
          <Catalogue liste={iphones} />
        </Suspense>
      </section>
    </>
  );
}
