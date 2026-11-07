'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

/**
 * SCÈNE PRODUIT — le téléphone en grand, sur sa « vitrine ».
 * - Changement de finition : le téléphone pivote sur lui-même (perspective 3D) et revient
 *   dans sa nouvelle couleur ; c'est le VRAI rendu officiel de cette finition.
 * - Souris : léger basculement qui suit le pointeur (profondeur). Tactile : rien de forcé,
 *   on glisse horizontalement pour changer de vue.
 * - Le halo derrière le téléphone prend la teinte de la finition choisie.
 */
export function Scene({ src, alt, teinte, cle, sens = 1, onGlisse, priorite = false, className = '' }: {
  src: string; alt: string; teinte: string; cle: string; sens?: 1 | -1;
  onGlisse?: (dir: 1 | -1) => void; priorite?: boolean; className?: string;
}) {
  const reduit = useReducedMotion();
  const zone = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0); const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 160, damping: 18 });

  const bouge = (e: React.PointerEvent) => {
    if (reduit || e.pointerType !== 'mouse' || !zone.current) return;
    const r = zone.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5); py.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div ref={zone} onPointerMove={bouge} onPointerLeave={() => { px.set(0); py.set(0); }}
      className={`relative isolate grid place-items-center overflow-hidden [perspective:1400px] ${className}`}>
      {/* Halo à la teinte de la finition */}
      <motion.div aria-hidden className="absolute inset-[12%] -z-10 rounded-full blur-3xl"
        animate={{ backgroundColor: teinte, opacity: 0.28 }} transition={{ duration: 0.8 }} />
      <motion.div className="relative h-full w-full touch-pan-y" style={reduit ? {} : { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        drag={onGlisse ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18}
        onDragEnd={(_, i) => { if (onGlisse && Math.abs(i.offset.x) > 50) onGlisse(i.offset.x < 0 ? 1 : -1); }}>
        <AnimatePresence mode="wait" initial={false} custom={sens}>
          <motion.div key={cle} className="absolute inset-0" custom={sens}
            initial={reduit ? { opacity: 0 } : { rotateY: -80 * sens, opacity: 0, scale: 0.94 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={reduit ? { opacity: 0 } : { rotateY: 80 * sens, opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.42, ease: [0.65, 0, 0.15, 1] }}>
            <Image src={src} alt={alt} fill priority={priorite} loading={priorite ? "eager" : undefined} sizes="(min-width: 1024px) 46vw, 92vw" className="pointer-events-none select-none object-contain drop-shadow-[0_40px_45px_rgba(0,0,0,0.22)]" draggable={false} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
