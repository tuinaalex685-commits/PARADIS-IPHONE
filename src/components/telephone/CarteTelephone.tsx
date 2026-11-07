'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Plus, Check } from 'lucide-react';
import type { Telephone } from '@/types';
import { chiffre } from '@/data/site';
import { useBoutique } from '@/components/providers/Boutique';

/**
 * CARTE TÉLÉPHONE — une petite vitrine.
 * Souris : le téléphone se soulève et s'incline, l'appel « Configurer » glisse en place.
 * Doigt : les pastilles de finition changent la photo d'un toucher (cibles de 32 px dans une
 * zone de 44 px), l'appel reste visible. La photo affichée est toujours celle de la finition.
 */
export function CarteTelephone({ t, sombre = false, priorite = false }: { t: Telephone; sombre?: boolean; priorite?: boolean }) {
  const [fin, setFin] = useState(0);
  const { compares, basculerComparaison } = useBoutique();
  const compare = compares.includes(t.slug);
  const image = t.couleurs[fin]?.image ?? t.images[0].src;
  const max = 5;

  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-carte)] transition-[box-shadow,transform] duration-300 ease-[var(--ease-sortie)] hover:-translate-y-1 ${sombre ? 'bg-encre-2 text-white ring-1 ring-white/10 hover:shadow-[0_30px_60px_-30px_rgba(220,174,90,0.35)]' : 'bg-surface ring-1 ring-filet hover:shadow-[0_30px_60px_-34px_rgba(0,0,0,0.4)]'}`}>
      <Link href={`/telephone/${t.slug}`} className="absolute inset-0 z-10" aria-label={`${t.nom}, configurer`} />

      <div className="relative aspect-[4/4.2] [perspective:900px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={image} className="absolute inset-[9%_12%]" initial={{ opacity: 0, rotateY: -35 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 35 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}>
            <Image src={image} alt={`${t.nom}${t.couleurs[fin] ? `, ${t.couleurs[fin].nom}` : ''}`} fill priority={priorite} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 40vw, 80vw"
              className="object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-[var(--ease-sortie)] group-hover:-translate-y-2 group-hover:scale-[1.04] group-hover:-rotate-2" />
          </motion.div>
        </AnimatePresence>
        {t.surDemande && <span className="absolute left-4 top-4 rounded-full bg-accent-clair px-3 py-1 text-[0.75rem] font-semibold text-accent-fonce">Sur demande</span>}
        <button onClick={() => basculerComparaison(t.slug)} aria-pressed={compare} aria-label={compare ? `Retirer ${t.nom} du comparateur` : `Ajouter ${t.nom} au comparateur`}
          className={`absolute right-3 top-3 z-20 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.78rem] font-semibold transition-colors ${compare ? 'bg-accent text-white' : sombre ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-fond-2 hover:bg-filet'}`}>
          {compare ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={2.5} />}Comparer
        </button>
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5">
        {t.couleurs.length > 1 && (
          <div className="relative z-20 -ml-1.5 flex items-center" role="group" aria-label="Finitions">
            {t.couleurs.slice(0, max).map((co, i) => (
              <button key={co.nom} onMouseEnter={() => setFin(i)} onFocus={() => setFin(i)} onClick={() => setFin(i)} aria-label={co.nom} aria-pressed={i === fin}
                className="grid h-9 w-9 place-items-center rounded-full">
                <span className={`h-[1.15rem] w-[1.15rem] rounded-full ring-1 ring-black/15 transition-transform duration-200 ${i === fin ? `scale-110 outline outline-2 outline-offset-2 ${sombre ? 'outline-white' : 'outline-encre'}` : ''}`} style={{ backgroundColor: co.hex }} />
              </button>
            ))}
            {t.couleurs.length > max && <span className={`ml-1 text-[0.8rem] ${sombre ? 'text-white/60' : 'text-sourdine'}`}>+{t.couleurs.length - max}</span>}
          </div>
        )}
        <h3 className="titre mt-2 text-[1.45rem] leading-tight">{t.nom}</h3>
        <p className={`mt-1 line-clamp-2 text-[0.92rem] ${sombre ? 'text-white/65' : 'text-sourdine'}`}>{t.accroche}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="leading-none">
            {t.prixDepart === null ? <span className="titre etroit text-[1.4rem]">Prix sur demande</span> : (
              <><span className={`block text-[0.78rem] ${sombre ? 'text-white/55' : 'text-sourdine'}`}>à partir de</span>
                <span className="titre etroit chiffres text-[1.85rem]">{chiffre(t.prixDepart)}<span className="ml-1 text-[0.8rem] font-semibold tracking-normal">FCFA</span></span></>
            )}
          </p>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-300 group-hover:rotate-45 ${sombre ? 'bg-accent text-white' : 'bg-encre text-white group-hover:bg-accent group-hover:text-white'}`}>
            <ArrowUpRight size={19} />
          </span>
        </div>
      </div>
    </article>
  );
}
