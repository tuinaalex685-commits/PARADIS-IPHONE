'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Budget } from '@/types';
import { BUDGETS, dansBudget, getTelephone } from '@/data/telephones';
import { chiffre, site } from '@/data/site';
import { CarteTelephone } from '@/components/telephone/CarteTelephone';
import { BoutonLien } from '@/components/ui/Bouton';
import { Apparition } from '@/components/animations/Apparition';

/** Ruban défilant des engagements réels de la boutique. */
export function Ruban() {
  const items = ['Livraison partout au Burkina', 'Retrait en boutique à Koulouba', 'Prix affichés', 'Conseil sur WhatsApp', 'iPhone et Samsung', 'Ouvert le dimanche'];
  return (
    <div aria-hidden className="overflow-hidden border-y border-filet py-5">
      <div className="flex w-max animate-defile gap-10 whitespace-nowrap">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="titre flex items-center gap-10 text-[1.5rem] md:text-[2rem]">{t}<span className="h-2.5 w-2.5 rounded-full bg-accent" /></span>
        ))}
      </div>
    </div>
  );
}

/** Le budget d'abord : on touche une tranche, la sélection se recompose. */
export function ParBudget() {
  const [b, setB] = useState<Budget>('150-300');
  const liste = dansBudget(b).slice(0, 4);
  return (
    <section aria-labelledby="budget" className="conteneur section">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2 id="budget" className="titre text-[clamp(2.2rem,5vw,4.4rem)] lg:col-span-7">Commencez par votre budget.</h2>
        <p className="text-[1.05rem] text-sourdine lg:col-span-4 lg:col-start-9">Touchez une tranche : les modèles qui y entrent apparaissent, du plus cher au plus doux.</p>
      </div>
      <div role="tablist" aria-label="Tranches de budget" className="sans-barre -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
        {BUDGETS.map((x) => (
          <button key={x.id} role="tab" aria-selected={b === x.id} onClick={() => setB(x.id)}
            className={`relative h-14 shrink-0 rounded-full px-6 text-[0.98rem] font-semibold transition-colors ${b === x.id ? 'text-white' : 'bg-surface ring-1 ring-filet hover:ring-sourdine'}`}>
            {b === x.id && <motion.span layoutId="budget-actif" className="absolute inset-0 rounded-full bg-encre" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="relative">{x.label} <span className="font-normal opacity-60">FCFA</span></span>
          </button>
        ))}
      </div>
      <motion.ul layout className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {liste.map((t, i) => (
            <motion.li key={t.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
              <CarteTelephone t={t} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <BoutonLien href={`/iphone?budget=${b}`}>Tout voir dans ce budget</BoutonLien>
        <BoutonLien href="/trouver" variante="secondaire">Être guidé en 4 questions</BoutonLien>
      </div>
    </section>
  );
}

/** Samsung : le Galaxy S22 Ultra, seul Android du catalogue, présenté pour ce qu'il a d'unique. */
export function BlocSamsung() {
  const s = getTelephone('samsung-galaxy-s22-ultra')!;
  return (
    <section aria-labelledby="samsung" className="conteneur pb-8">
      <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-surface ring-1 ring-filet md:grid-cols-2">
        <div className="relative h-80 md:h-full md:min-h-[30rem]"><Image src={s.images[0].src} alt={s.images[0].alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" /></div>
        <div className="p-6 md:p-10">
          <p className="text-[0.95rem] text-sourdine">Côté Android</p>
          <h2 id="samsung" className="titre mt-2 text-[clamp(2.2rem,4.4vw,3.8rem)]">Samsung Galaxy S22 Ultra, stylet compris.</h2>
          <ul className="mt-6 space-y-2 text-[1.02rem]">{s.atouts.map((a) => <li key={a} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{a}</li>)}</ul>
          <p className="mt-6"><span className="titre etroit chiffres text-[2.2rem]">dès {chiffre(s.prixDepart!)}</span> <span className="font-semibold">FCFA</span> <span className="text-sourdine">· 256 Go à {chiffre(s.capacites[1].prix!)} FCFA</span></p>
          <div className="mt-6"><BoutonLien href={`/telephone/${s.slug}`}>Voir le Galaxy S22 Ultra</BoutonLien></div>
        </div>
      </div>
    </section>
  );
}

/** Comment commander : une vraie séquence, d'où la numérotation. */
export function CommentCommander() {
  const etapes = [
    { t: 'Choisissez', d: 'Parcourez les modèles ou laissez-vous guider en 4 questions.' },
    { t: 'Configurez', d: 'Finition, capacité, carte SIM : la photo et le prix suivent vos choix.' },
    { t: 'Envoyez', d: 'Votre commande part sur WhatsApp, déjà rédigée. Rien à payer en ligne.' },
    { t: 'Recevez', d: 'Livraison partout au Burkina, ou retrait en boutique après confirmation.' },
  ];
  return (
    <section aria-labelledby="commander" className="px-2 sm:px-4">
      <div className="mx-auto max-w-[96rem] rounded-[2rem] bg-accent-clair section">
        <div className="conteneur">
          <h2 id="commander" className="titre max-w-3xl text-[clamp(2.2rem,5vw,4.4rem)]">Commander prend une minute.</h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {etapes.map((e, i) => (
              <Apparition key={e.t} as="li" delai={i * 0.08} className="rounded-[1.6rem] bg-surface p-6">
                <span className="titre etroit chiffres text-[3rem] text-accent-fonce">{i + 1}</span>
                <p className="titre mt-2 text-[1.5rem]">{e.t}</p>
                <p className="mt-2 text-sourdine">{e.d}</p>
              </Apparition>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** La boutique physique : la preuve qu'il y a quelqu'un derrière le site. */
export function LaBoutique() {
  return (
    <section aria-labelledby="koulouba" className="conteneur section grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <h2 id="koulouba" className="titre text-[clamp(2.4rem,6vw,5.4rem)]">Une vraie boutique, à Koulouba.</h2>
        <p className="mt-5 max-w-md text-[1.05rem] text-sourdine">Venez voir et prendre en main le téléphone avant de l’acheter. Confirmez d’abord la disponibilité avec un conseiller.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={site.itineraire} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center rounded-full bg-encre px-7 font-semibold text-white hover:bg-action-fonce">Itinéraire</a>
          <Link href="/boutique" className="inline-flex h-14 items-center rounded-full px-7 font-semibold ring-1 ring-black/20 hover:ring-black">Horaires et contacts</Link>
        </div>
      </div>
      <dl className="grid content-start gap-px overflow-hidden rounded-[1.6rem] bg-filet lg:col-span-5 lg:col-start-8">
        {[['Adresse', site.adresse], ...site.horaires.map((h) => [h.jours, h.heures]), ['WhatsApp', site.whatsappAffiche], ['Téléphones', site.telephones.join(' · ')]].map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-6 bg-surface px-5 py-4"><dt className="text-sourdine">{k}</dt><dd className="chiffres text-right font-semibold">{v}</dd></div>
        ))}
      </dl>
    </section>
  );
}
