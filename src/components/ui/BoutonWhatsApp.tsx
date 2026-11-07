'use client';

import { useBoutique } from '@/components/providers/Boutique';
import { suivre, type EvenementConversion } from '@/lib/analytics';
import { classeBouton, Fleche, type Variante } from './Bouton';

/** Bouton qui prépare un message WhatsApp contextualisé et enregistre l'intention. */
export function BoutonWhatsApp({ message, titre, evenement, item, variante = 'principal', children, className = '' }: {
  message: string; titre: string; evenement: EvenementConversion; item?: string;
  variante?: Variante; children: React.ReactNode; className?: string;
}) {
  const { preparerWhatsApp } = useBoutique();
  return (
    <button
      onClick={() => { suivre(evenement, { item }); suivre('whatsapp_click', { item, source: evenement }); preparerWhatsApp(message, titre); }}
      className={classeBouton(variante, className)}>
      {children}<Fleche variante={variante} />
    </button>
  );
}

/** Pictogramme de bulle de discussion (tracé simple, pas le logo officiel). */
export function IconeWhatsApp({ size = 22 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.6z" />
      <path d="M9 8.6c0 3.3 3 6.4 6.4 6.4l1.2-1.3-1.9-1-1 .8c-1.2-.5-2.3-1.6-2.8-2.8l.8-1-1-1.9z" />
    </svg>
  );
}
