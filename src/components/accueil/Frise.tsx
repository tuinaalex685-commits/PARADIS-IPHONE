'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { iphones, visuel } from '@/data/telephones';
import { chiffre } from '@/data/site';

const modeles = [...iphones].sort((a, b) => b.annee - a.annee || (b.prixDepart ?? 0) - (a.prixDepart ?? 0));

/**
 * LA FRISE — le seul moment « collé » de l'accueil.
 * Ordinateur et tablette : la section reste fixe pendant que les générations défilent de droite
 * à gauche, de 2026 à 2016, au rythme du défilement vertical. Une barre bleu indique où l'on en est.
 * Téléphone : pas de détournement du défilement ; un ruban natif qu'on fait glisser au doigt.
 */
export function Frise() {
  const zone = useRef<HTMLElement>(null);
  const piste = useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();
  const [colle, setColle] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const maj = () => {
      setColle(mq.matches && !reduit);
      if (piste.current) setDistance(Math.max(0, piste.current.scrollWidth - window.innerWidth + 80));
    };
    maj();
    mq.addEventListener('change', maj); window.addEventListener('resize', maj);
    return () => { mq.removeEventListener('change', maj); window.removeEventListener('resize', maj); };
  }, [reduit]);

  const { scrollYProgress } = useScroll({ target: zone, offset: ['start start', 'end end'] });
  const lisse = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  const x = useTransform(lisse, [0, 1], [0, -distance]);
  const barre = useTransform(lisse, [0, 1], ['0%', '100%']);

  const cartes = modeles.map((t) => (
    <Link key={t.slug} href={`/telephone/${t.slug}`}
      className="group relative flex h-full w-[15.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-[1.6rem] bg-white/[0.04] p-5 ring-1 ring-white/10 transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-white/[0.08] md:w-[19rem]">
      <span aria-hidden className="titre etroit pointer-events-none absolute -right-2 -top-3 text-[6.5rem] leading-none text-white/[0.07] transition-colors group-hover:text-accent-vif/20">{t.annee}</span>
      <span className="relative mt-4 h-52 w-full md:h-64">
        <Image src={visuel(t)} alt={t.nom} fill sizes="(min-width: 768px) 19rem, 15rem" className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[var(--ease-sortie)] group-hover:-translate-y-2 group-hover:-rotate-3 group-hover:scale-[1.05]" />
      </span>
      <span className="mt-auto pt-5">
        <span className="titre block text-[1.35rem] leading-tight">{t.nom}</span>
        <span className="mt-1 flex items-center justify-between">
          <span className="titre etroit chiffres text-[1.35rem] text-accent-vif">{t.prixDepart === null ? 'Sur demande' : `dès ${chiffre(t.prixDepart)}`}</span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-[transform,background-color,color] duration-300 group-hover:rotate-45 group-hover:bg-accent group-hover:text-white"><ArrowUpRight size={18} /></span>
        </span>
      </span>
    </Link>
  ));

  return (
    <section ref={zone} aria-labelledby="frise" className="sur-sombre relative bg-encre text-white" style={colle ? { height: `calc(100svh + ${distance}px)` } : undefined}>
      <div className={colle ? 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden' : 'py-20'}>
        <div className="conteneur flex flex-wrap items-end justify-between gap-6">
          <h2 id="frise" className="titre max-w-3xl text-[clamp(2.2rem,5vw,4.6rem)]">Dix ans d’iPhone, rangés par génération.</h2>
          <p className="max-w-xs text-white/60">{colle ? 'Faites défiler : les modèles avancent du plus récent au plus ancien.' : 'Faites glisser pour remonter le temps.'}</p>
        </div>
        {colle ? (
          <>
            <motion.div ref={piste} style={{ x }} className="mt-10 flex h-[26rem] gap-4 pl-[max(1.25rem,calc((100vw-90rem)/2+2.5rem))] md:h-[30rem]">{cartes}</motion.div>
            <div className="conteneur mt-8"><div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-accent-vif" style={{ width: barre }} /></div></div>
          </>
        ) : (
          <div ref={piste} className="sans-barre mt-8 flex h-[24rem] snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-5 px-5" data-lenis-prevent>{cartes}</div>
        )}
      </div>
    </section>
  );
}
