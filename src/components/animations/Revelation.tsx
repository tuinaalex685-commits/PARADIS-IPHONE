'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * Révélation photographique (rideau qui s'ouvre) : réservée aux grandes images de chapitre,
 * pas à chaque bloc. Le contenu reste présent dans le HTML (lisible sans JavaScript).
 */
export function RevelationImage({ children, className = '', delai = 0 }: { children: React.ReactNode; className?: string; delai?: number }) {
  const reduit = useReducedMotion();
  if (reduit) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(12% 0 12% 0)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0 0% 0)', opacity: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay: delai, ease: [0.65, 0, 0.15, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Titre qui monte ligne par ligne (une seule fois, à l'entrée). */
export function LignesTitre({ lignes, className = '', delai = 0 }: { lignes: string[]; className?: string; delai?: number }) {
  const reduit = useReducedMotion();
  return (
    <span className={className}>
      {lignes.map((l, i) => (
        <span key={l} className="block overflow-hidden pb-[0.08em]">
          {reduit ? <span className="block">{l}</span> : (
            <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: delai + i * 0.09, ease: [0.65, 0, 0.15, 1] }}>
              {l}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  );
}
