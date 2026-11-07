import type { Metadata } from 'next';
import { samsungs } from '@/data/telephones';
import { EnTetePage } from '@/components/layout/EnTetePage';
import { CarteTelephone } from '@/components/telephone/CarteTelephone';
import { BoutonWhatsApp } from '@/components/ui/BoutonWhatsApp';
import { SuiviVue } from '@/components/analytics/SuiviVue';

export const metadata: Metadata = {
  title: 'Samsung Galaxy à Ouagadougou',
  description: 'Le Samsung Galaxy S22 Ultra chez Paradis des téléphones : 128 Go à 235 000 FCFA, 256 Go à 260 000 FCFA. Autres Samsung sur demande.',
  alternates: { canonical: '/samsung' },
};

export default function PageSamsung() {
  return (
    <>
      <SuiviVue evenement="view_shop" item="samsung" />
      <EnTetePage fil={[{ label: 'Samsung' }]} titre={['Samsung Galaxy.']}
        intro="Le Galaxy S22 Ultra est disponible au catalogue. Vous cherchez un autre Samsung ? Dites-nous lequel : la boutique le cherche pour vous." />
      <section className="conteneur grid gap-6 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {samsungs.map((t) => <CarteTelephone key={t.slug} t={t} priorite />)}
        <div className="flex flex-col justify-between rounded-[var(--radius-carte)] bg-encre p-7 text-white lg:col-span-2">
          <div>
            <p className="titre text-[clamp(1.8rem,3vw,2.6rem)]">Un autre Galaxy en tête ?</p>
            <p className="mt-3 max-w-md text-white/65">Indiquez le modèle, la capacité et votre budget : un conseiller vous répond avec ce qui est disponible.</p>
          </div>
          <div className="mt-8">
            <BoutonWhatsApp variante="or" evenement="product_contact_click" item="samsung-sur-demande" titre="Votre demande est prête"
              message="Bonjour Paradis des téléphones, je cherche un Samsung : modèle , capacité , budget .">Demander un Samsung</BoutonWhatsApp>
          </div>
        </div>
      </section>
    </>
  );
}
