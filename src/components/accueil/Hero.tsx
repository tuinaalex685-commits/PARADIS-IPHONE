'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Truck, Store, ShieldCheck } from 'lucide-react';
import { getTelephone, iphones } from '@/data/telephones';
import { chiffre, site } from '@/data/site';
import { classeBouton, Fleche } from '@/components/ui/Bouton';
import { suivre } from '@/lib/analytics';

const vedette = getTelephone('iphone-18-pro-max')!;
const E = [0.65, 0, 0.15, 1] as const;

/**
 * Repères « plan d'ingénieur » : des cotes fines qui se tracent vers le téléphone.
 * Contenu tiré du communiqué Apple de l'iPhone 18 Pro (09/09/2026) : rien d'inventé.
 * x / y : point visé sur la scène (%) ; cote : côté où s'écrit l'étiquette.
 */
const REPERES = [
  { titre: 'Ouverture variable', detail: 'une première sur iPhone', x: 29, y: 31, cote: 'gauche' as const },
  { titre: 'A20 Pro', detail: 'la puce la plus rapide d’Apple', x: 38, y: 56, cote: 'gauche' as const },
  { titre: 'Jusqu’à 2 To', detail: 'de stockage', x: 33, y: 80, cote: 'gauche' as const },
];

/**
 * HÉROS — signature de la marque : la précision.
 * Un « 18 » géant en filigrane, le téléphone qui monte en pivotant, puis des cotes qui se tracent
 * vers lui. Les pastilles changent sa finition (vrais rendus Apple). Au défilement, le chiffre,
 * le téléphone et le texte bougent à des vitesses différentes (profondeur).
 */
export function Hero() {
  const zone = useRef<HTMLElement>(null);
  const reduit = useReducedMotion();
  const [fin, setFin] = useState(3);
  const [sens, setSens] = useState(1);
  const { scrollYProgress } = useScroll({ target: zone, offset: ['start start', 'end start'] });
  const yChiffre = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const yTel = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const rTel = useTransform(scrollYProgress, [0, 1], [-7, 6]);
  const yTexte = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const fondu = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const co = vedette.couleurs[fin];
  const changer = (i: number) => { if (i === fin) return; setSens(i > fin ? 1 : -1); setFin(i); suivre('configurator_change', { item: vedette.slug, source: 'heros' }); };

  return (
    <section ref={zone} className="relative overflow-hidden pt-20 md:pt-24 lg:min-h-[100svh] lg:pt-24">
      <div className="conteneur relative grid items-center gap-4 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-12 lg:gap-8">

        {/* ——— SCÈNE ——— */}
        <div className="relative h-[58svh] min-h-[23rem] max-h-[40rem] md:h-[62svh] lg:order-2 lg:col-span-7 lg:h-[82svh] lg:max-h-none">
          {/* Le chiffre géant, en filigrane */}
          <motion.span aria-hidden style={reduit ? {} : { y: yChiffre }}
            initial={reduit ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: E }}
            className="titre pointer-events-none absolute inset-0 flex select-none items-center justify-between px-[2%] text-[min(62vw,30rem)] leading-none tracking-[-0.06em] text-[#e2e2dc] lg:px-[8%] lg:text-[min(30vw,30rem)]">
            <span>1</span><span>8</span>
          </motion.span>
          {/* Halo à la teinte de la finition */}
          <motion.div aria-hidden className="absolute left-[18%] top-[16%] h-[66%] w-[66%] rounded-full blur-[80px]" animate={{ backgroundColor: co.hex, opacity: 0.38 }} transition={{ duration: 0.9 }} />

          {/* Le téléphone */}
          <motion.div className="absolute inset-[4%_6%_10%] [perspective:1600px] lg:inset-[6%_10%_10%]" style={reduit ? {} : { y: yTel, rotate: rTel }}
            initial={reduit ? false : { opacity: 0, y: 140, rotate: -24, scale: 0.86 }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} transition={{ duration: 1.35, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}>
            <AnimatePresence mode="wait" initial={false} custom={sens}>
              <motion.div key={co.nom} className="absolute inset-0" initial={reduit ? { opacity: 0 } : { rotateY: -80 * sens, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={reduit ? { opacity: 0 } : { rotateY: 80 * sens, opacity: 0 }} transition={{ duration: 0.42, ease: E }}>
                <Image src={co.image!} alt={`iPhone 18 Pro Max, finition ${co.nom}`} fill priority loading="eager" sizes="(min-width: 1024px) 50vw, 90vw" className="object-contain drop-shadow-[0_60px_50px_rgba(0,0,0,0.28)]" />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Cotes techniques (ordinateur) */}
          <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none">
            {REPERES.map((r, i) => {
              const xFin = r.cote === 'gauche' ? 1 : 99;
              return (
                <motion.path key={r.titre} d={`M ${r.x} ${r.y} L ${(r.x + xFin) / 2} ${r.y} L ${xFin} ${r.y}`} fill="none" stroke="var(--color-accent)" strokeWidth="0.22"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.9 }} transition={{ delay: 1.4 + i * 0.25, duration: 0.7, ease: E }} />
              );
            })}
          </svg>
          {REPERES.map((r, i) => (
            <motion.div key={r.titre} aria-hidden className={`absolute hidden lg:block ${r.cote === 'gauche' ? 'left-0 text-left' : 'right-0 text-right'}`} style={{ top: `${r.y}%`, transform: 'translateY(-115%)' }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 + i * 0.25, duration: 0.5 }}>
              <p className="text-[0.95rem] font-semibold">{r.titre}</p>
              <p className="text-[0.8rem] text-sourdine">{r.detail}</p>
            </motion.div>
          ))}
          {REPERES.map((r, i) => (
            <motion.span key={`p-${r.titre}`} aria-hidden className="absolute hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-accent/25 lg:block" style={{ left: `${r.x}%`, top: `${r.y}%` }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.35 + i * 0.25, type: 'spring', stiffness: 500, damping: 20 }} />
          ))}

          {/* Pastilles de finition */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-white/90 p-1.5 pl-4 shadow-[0_14px_34px_-16px_rgba(0,0,0,0.45)] backdrop-blur lg:bottom-[3%]">
            <AnimatePresence mode="wait"><motion.span key={co.nom} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mr-1.5 w-[5.2rem] whitespace-nowrap text-[0.82rem] font-semibold">{co.nom}</motion.span></AnimatePresence>
            {vedette.couleurs.map((c, i) => (
              <button key={c.nom} onClick={() => changer(i)} aria-label={`Finition ${c.nom}`} aria-pressed={i === fin} className="grid h-11 w-11 place-items-center rounded-full">
                <span className={`h-6 w-6 rounded-full ring-1 ring-black/15 transition-transform duration-200 ${i === fin ? 'scale-110 outline outline-2 outline-offset-2 outline-encre' : 'hover:scale-110'}`} style={{ backgroundColor: c.hex }} />
              </button>
            ))}
          </motion.div>
        </div>

        {/* ——— TEXTE ——— */}
        <motion.div className="relative z-10 lg:order-1 lg:col-span-5" style={reduit ? {} : { y: yTexte, opacity: fondu }}>
          {/* Repères en étiquettes (téléphone, tablette) */}
          <ul className="sans-barre -mx-5 mb-5 flex gap-2 overflow-x-auto px-5 lg:hidden">
            {REPERES.map((r) => <li key={r.titre} className="shrink-0 rounded-full bg-surface px-3.5 py-1.5 text-[0.82rem] ring-1 ring-filet"><strong>{r.titre}</strong> <span className="text-sourdine">{r.detail}</span></li>)}
          </ul>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="hidden text-[0.95rem] font-medium text-sourdine lg:block">Nouveau · iPhone 18 Pro Max</motion.p>
          <h1 className="titre mt-1 text-[clamp(2.6rem,11vw,4.4rem)] md:text-[clamp(3.6rem,8vw,5.2rem)] lg:mt-3 lg:text-[clamp(3.2rem,4.6vw,5.4rem)]">
            {['Le paradis', 'des iPhone', 'est à Ouaga.'].map((l, i) => (
              <span key={l} className="block overflow-hidden whitespace-nowrap pb-[0.06em]">
                <motion.span className="block" initial={reduit ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.95, delay: 0.25 + i * 0.09, ease: E }}>{l}</motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-6 flex items-end gap-4 border-l-2 border-accent pl-4">
            <p className="leading-none">
              <span className="block text-[0.85rem] text-sourdine">iPhone 18 Pro Max, à partir de</span>
              <span className="titre etroit chiffres mt-1 block text-[clamp(2.4rem,6vw,3.4rem)]">{chiffre(vedette.prixDepart!)}<span className="ml-1.5 text-[0.36em] font-semibold tracking-normal">FCFA</span></span>
            </p>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-sourdine">
            Et {iphones.length - 1} autres iPhone, du SE au 17 Pro Max. Choisissez la finition et la capacité ici, la boutique vous confirme tout sur WhatsApp.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href={`/telephone/${vedette.slug}`} onClick={() => suivre('order_start', { item: vedette.slug, source: 'heros' })} className={classeBouton('principal', 'justify-between sm:justify-center')}>Configurer le mien<Fleche /></Link>
            <Link href="/iphone" className={classeBouton('secondaire')}>Voir tous les iPhone</Link>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.88rem] text-sourdine">
            <li className="flex items-center gap-1.5"><Truck size={16} className="text-accent-fonce" />Livraison partout au Burkina</li>
            <li className="flex items-center gap-1.5"><Store size={16} className="text-accent-fonce" />Retrait à Koulouba</li>
            <li className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-accent-fonce" />Rien à payer en ligne</li>
          </motion.ul>
          <p className="mt-3 text-[0.78rem] text-sourdine/80">Prix relevé le {site.releve}, confirmé par la boutique.</p>
        </motion.div>
      </div>

      {/* Invitation à descendre */}
      <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.75rem] text-sourdine lg:flex">
        <span className="relative h-10 w-px overflow-hidden bg-filet"><motion.span className="absolute inset-x-0 top-0 h-4 bg-encre" animate={{ y: [-16, 40] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} /></span>
      </motion.div>
    </section>
  );
}
