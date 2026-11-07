import type { Metadata } from 'next';
import { MapPin, Clock, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { EnTetePage } from '@/components/layout/EnTetePage';
import { BoutonWhatsApp } from '@/components/ui/BoutonWhatsApp';
import { Formulaire } from '@/components/forms/Formulaire';

export const metadata: Metadata = {
  title: 'La boutique à Koulouba, Ouagadougou',
  description: 'Adresse, horaires, téléphones et WhatsApp de Paradis des téléphones à Koulouba (Ouagadougou). Ouvert du lundi au samedi et le dimanche.',
  alternates: { canonical: '/boutique' },
};

export default function Boutique() {
  return (
    <>
      <EnTetePage fil={[{ label: 'La boutique' }]} titre={['Koulouba,', 'Ouagadougou.']}
        intro="Passez voir les téléphones en vrai. Pour être sûr de trouver votre modèle, confirmez d’abord sa disponibilité sur WhatsApp." />
      <div className="conteneur grid gap-12 pb-20 lg:grid-cols-12">
        <section aria-label="Coordonnées" className="space-y-px overflow-hidden rounded-[var(--radius-carte)] bg-filet lg:col-span-5">
          <a href={site.itineraire} target="_blank" rel="noopener noreferrer" className="flex gap-4 bg-surface p-6 hover:bg-white">
            <MapPin className="mt-1 shrink-0 text-accent-fonce" /><span><span className="block font-semibold">{site.adresse}</span><span className="text-sourdine underline underline-offset-4">Ouvrir l’itinéraire</span></span>
          </a>
          <div className="flex gap-4 bg-surface p-6"><Clock className="mt-1 shrink-0 text-accent-fonce" /><span>{site.horaires.map((h) => <span key={h.jours} className="block"><strong>{h.jours}</strong> : {h.heures}</span>)}</span></div>
          <div className="flex gap-4 bg-surface p-6"><Phone className="mt-1 shrink-0 text-accent-fonce" />
            <span className="space-y-1">{site.telephones.map((t) => <a key={t} href={`tel:${t.replace(/\s/g, '')}`} className="block font-semibold hover:underline">{t}</a>)}</span></div>
          <div className="bg-encre p-6 text-white">
            <p className="font-semibold">WhatsApp {site.whatsappAffiche}</p>
            <p className="mt-1 text-white/65">La façon la plus rapide d’avoir une réponse.</p>
            <div className="mt-5"><BoutonWhatsApp variante="or" evenement="whatsapp_click" item="boutique" titre="Votre message est prêt" message="Bonjour Paradis des téléphones, ">Écrire à la boutique</BoutonWhatsApp></div>
          </div>
        </section>
        <section aria-labelledby="ecrire" className="lg:col-span-6 lg:col-start-7">
          <h2 id="ecrire" className="titre text-[2rem]">Une question avant de venir ?</h2>
          <p className="mt-2 text-sourdine">Votre message est rédigé ici puis envoyé sur WhatsApp.</p>
          <div className="mt-6">
            <Formulaire evenement="contact_form_submit" item="boutique" bouton="Préparer mon message" titreMessage="Votre message est prêt" intro="Bonjour Paradis des téléphones,"
              champs={[
                { nom: 'nom', label: 'Nom et prénom', requis: true, autoComplete: 'name' },
                { nom: 'telephone', label: 'Téléphone (WhatsApp)', type: 'tel', requis: true, autoComplete: 'tel' },
                { nom: 'sujet', label: 'Sujet', type: 'select', requis: true, options: ['Disponibilité d’un modèle', 'Prix d’une configuration', 'Livraison', 'Autre question'] },
                { nom: 'message', label: 'Votre message', type: 'textarea', requis: true },
              ]} />
          </div>
        </section>
      </div>
    </>
  );
}
