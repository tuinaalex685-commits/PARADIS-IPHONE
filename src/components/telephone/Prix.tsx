'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { chiffre } from '@/data/site';

/**
 * Prix qui change avec la configuration : l'ancien chiffre sort par le haut, le nouveau monte,
 * et un trait bleu souligne brièvement la mise à jour. `null` = prix confirmé par la boutique.
 */
export function PrixAnime({ valeur, className = '', dès = false }: { valeur: number | null; className?: string; dès?: boolean }) {
  const reduit = useReducedMotion();
  const texte = valeur === null ? 'Prix sur confirmation' : `${dès ? 'dès ' : ''}${chiffre(valeur)}`;
  return (
    <span className={`relative inline-flex items-baseline overflow-hidden ${className}`} aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={texte} className="chiffres etroit inline-block"
          initial={reduit ? { opacity: 0 } : { y: '90%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduit ? { opacity: 0 } : { y: '-90%', opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}>
          {texte}{valeur !== null && <span className="ml-2 text-[0.42em] font-semibold tracking-normal">FCFA</span>}
        </motion.span>
      </AnimatePresence>
      <motion.span key={`trait-${texte}`} aria-hidden className="absolute -bottom-0.5 left-0 h-[3px] w-full origin-left bg-accent"
        initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }} transition={{ duration: 1.1, times: [0, 0.4, 1] }} />
    </span>
  );
}
