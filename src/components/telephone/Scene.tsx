'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimate, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Play, SkipForward } from 'lucide-react';

export type EtapeVisite = { titre: string; detail: string };
export type Points = { photo: [number, number]; logo: [number, number] };

const E = [0.65, 0, 0.15, 1] as const;
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * SCÈNE PRODUIT — le téléphone en grand, comme dans une vitrine qu'on peut faire tourner.
 *
 * VISITE GUIDÉE (lancée une fois à l'arrivée, rejouable) :
 *  1. le téléphone pivote en 3D sur lui-même ;
 *  2. la caméra plonge sur le bloc photo et le flash ;
 *  3. glisse vers le logo, au centre de la finition choisie ;
 *  4. recule, s'éteint… et s'ALLUME : la lumière monte et un reflet balaie l'appareil.
 * Chaque étape affiche une légende tirée de la fiche du modèle (rien d'inventé).
 * Un geste du visiteur (choisir une finition, glisser, « Passer ») interrompt la visite.
 * Les points visés viennent de scripts/points.py (repérés sur chaque rendu officiel).
 */
export function Scene({ src, alt, teinte, cle, sens = 1, onGlisse, priorite = false, className = '', points, etapes, rejouer = 0 }: {
  src: string; alt: string; teinte: string; cle: string; sens?: 1 | -1;
  onGlisse?: (dir: 1 | -1) => void; priorite?: boolean; className?: string;
  points?: Points; etapes?: EtapeVisite[]; rejouer?: number;
}) {
  const reduit = useReducedMotion();
  const zone = useRef<HTMLDivElement>(null);
  const visible = useInView(zone, { once: true, amount: 0.6 });
  const [camera, animer] = useAnimate();
  const [etape, setEtape] = useState<number | null>(null);
  const [balayage, setBalayage] = useState(0);
  const annule = useRef(false);
  const enCours = useRef(false);
  const dejaJoue = useRef(false);

  // Inclinaison qui suit la souris (profondeur), hors visite.
  const px = useMotionValue(0); const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 160, damping: 18 });
  const bouge = (e: React.PointerEvent) => {
    if (reduit || e.pointerType !== 'mouse' || !zone.current || enCours.current) return;
    const r = zone.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5); py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const repos = useCallback(async () => {
    if (!camera.current) return;
    await animer(camera.current, { scale: 1, x: '0%', y: '0%', rotateY: 0, filter: 'brightness(1)' }, { duration: 0.6, ease: E });
  }, [animer, camera]);

  const arreter = useCallback(() => { annule.current = true; setEtape(null); void repos(); }, [repos]);

  const jouer = useCallback(async () => {
    if (reduit || !points || !etapes || !camera.current || enCours.current) return;
    enCours.current = true; annule.current = false; dejaJoue.current = true;
    const el = camera.current;
    const zoom = (p: [number, number], s: number) => animer(el, { scale: s, x: `${-s * (p[0] - 50)}%`, y: `${-s * (p[1] - 50)}%`, rotateY: 0 }, { duration: 1.5, ease: E });
    const etapesSuite: (() => Promise<unknown>)[] = [
      async () => { setEtape(0); await animer(el, { rotateY: [0, -32, 26, 0] }, { duration: 3.4, ease: 'easeInOut' }); },
      async () => { setEtape(1); await zoom(points.photo, 2.6); await pause(1500); },
      async () => { setEtape(2); await zoom(points.logo, 2.1); await pause(1300); },
      async () => {
        setEtape(3);
        await animer(el, { scale: 1, x: '0%', y: '0%', filter: 'brightness(0.12)' }, { duration: 0.9, ease: E });
        await pause(250); setBalayage((b) => b + 1);
        await animer(el, { filter: 'brightness(1)' }, { duration: 1.5, ease: 'easeOut' });
        await pause(1200);
      },
    ];
    for (const etapeSuivante of etapesSuite) {
      if (annule.current) break;
      await etapeSuivante();
    }
    enCours.current = false;
    if (!annule.current) setEtape(null);
  }, [animer, camera, etapes, points, reduit]);

  // Première visite automatique quand la scène est bien visible.
  useEffect(() => {
    if (!visible || dejaJoue.current) return;
    const id = window.setTimeout(() => { void jouer(); }, 900);
    return () => window.clearTimeout(id);
  }, [visible, jouer]);
  // Bouton « Revoir la visite » (compteur incrémenté par le parent).
  useEffect(() => { if (rejouer > 0) { annule.current = false; void jouer(); } }, [rejouer, jouer]);
  // Un changement de finition interrompt la visite (le visiteur prend la main).
  const premiereCle = useRef(cle);
  useEffect(() => { if (cle !== premiereCle.current && enCours.current) arreter(); premiereCle.current = cle; }, [cle, arreter]);

  return (
    <div ref={zone} onPointerMove={bouge} onPointerLeave={() => { px.set(0); py.set(0); }}
      className={`relative isolate grid place-items-center overflow-hidden [perspective:1400px] ${className}`}>
      <motion.div aria-hidden className="absolute inset-[12%] -z-10 rounded-full blur-3xl" animate={{ backgroundColor: teinte, opacity: 0.28 }} transition={{ duration: 0.8 }} />

      <motion.div className="relative h-full w-full touch-pan-y" style={reduit ? {} : { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        drag={onGlisse ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18}
        onDragStart={() => { if (enCours.current) arreter(); }}
        onDragEnd={(_, i) => { if (onGlisse && Math.abs(i.offset.x) > 50) onGlisse(i.offset.x < 0 ? 1 : -1); }}>
        {/* « Caméra » de la visite : c'est elle qui zoome, pivote et s'allume */}
        <div ref={camera} className="absolute inset-0 will-change-transform [transform-style:preserve-3d]">
          <AnimatePresence mode="wait" initial={false} custom={sens}>
            <motion.div key={cle} className="absolute inset-0" custom={sens}
              initial={reduit ? { opacity: 0 } : { rotateY: -80 * sens, opacity: 0, scale: 0.94 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={reduit ? { opacity: 0 } : { rotateY: 80 * sens, opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.42, ease: E }}>
              <Image src={src} alt={alt} fill priority={priorite} loading={priorite ? 'eager' : undefined} sizes="(min-width: 1024px) 60vw, 100vw" className="pointer-events-none select-none object-contain drop-shadow-[0_40px_45px_rgba(0,0,0,0.22)]" draggable={false} />
              {/* Reflet d'allumage, limité à la silhouette du téléphone */}
              {balayage > 0 && (
                <motion.div key={balayage} aria-hidden className="pointer-events-none absolute inset-0"
                  style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}>
                  <motion.div className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-overlay"
                    initial={{ x: '-120%' }} animate={{ x: '260%' }} transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }} />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Légende de la visite + contrôle */}
      {etapes && points && !reduit && (
        <div className="pointer-events-none absolute inset-x-3 bottom-20 z-10 flex items-end justify-between gap-3 md:bottom-24">
          <AnimatePresence mode="wait">
            {etape !== null && (
              <motion.div key={etape} role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
                className="pointer-events-auto max-w-[17rem] rounded-2xl bg-encre/90 px-4 py-3 text-white backdrop-blur">
                <p className="flex items-center gap-2 text-[0.75rem] text-white/60">
                  {etapes.map((_, i) => <span key={i} className={`h-1 rounded-full transition-all ${i === etape ? 'w-5 bg-accent-vif' : 'w-1.5 bg-white/30'}`} />)}
                </p>
                <p className="mt-1.5 font-semibold">{etapes[etape].titre}</p>
                <p className="text-[0.88rem] text-white/75">{etapes[etape].detail}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => (etape !== null ? arreter() : void jouer())}
            className="pointer-events-auto ml-auto inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-white/90 px-4 text-[0.85rem] font-semibold shadow-[0_10px_24px_-14px_rgba(0,0,0,0.5)] backdrop-blur hover:bg-white">
            {etape !== null ? <><SkipForward size={15} />Passer</> : <><Play size={15} />Revoir la visite</>}
          </button>
        </div>
      )}
    </div>
  );
}
