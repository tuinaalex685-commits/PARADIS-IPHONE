'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

/**
 * GUIDE CONTEXTUEL — de courts messages déclenchés par une action du visiteur.
 * Règles : un seul message à la fois ; chaque message ne s'affiche qu'UNE fois par visite
 * (mémoire de session) ; il disparaît seul après quelques secondes ; on peut le fermer.
 * Jamais de pop-up qui bloque, jamais d'affirmation technique non vérifiée.
 */
const CLE = 'paradis:guide-vus';
function dejaVu(id: string) { try { return (JSON.parse(sessionStorage.getItem(CLE) ?? '[]') as string[]).includes(id); } catch { return false; } }
function marquer(id: string) { try { const v = JSON.parse(sessionStorage.getItem(CLE) ?? '[]') as string[]; sessionStorage.setItem(CLE, JSON.stringify([...v, id])); } catch { /* navigation privée */ } }

export type Message = { id: string; texte: string; zone: string };

export function useGuide(duree = 6500) {
  const [message, setMessage] = useState<Message | null>(null);
  const minuteur = useRef<number | undefined>(undefined);
  const dire = useCallback((m: Message, forcer = false) => {
    if (!forcer && dejaVu(m.id)) return;
    marquer(m.id);
    setMessage(m);
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setMessage((x) => (x?.id === m.id ? null : x)), duree);
  }, [duree]);
  const fermer = useCallback(() => setMessage(null), []);
  useEffect(() => () => window.clearTimeout(minuteur.current), []);
  return { message, dire, fermer };
}

/** Bulle affichée dans une zone donnée (près du sélecteur concerné). */
export function Bulle({ message, zone, fermer, className = '' }: { message: Message | null; zone: string; fermer: () => void; className?: string }) {
  const visible = message?.zone === zone ? message : null;
  return (
    <div aria-live="polite" className={`relative ${className}`}>
      <AnimatePresence>
        {visible && (
          <motion.div key={visible.id} role="status"
            initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="relative mt-3 flex items-start gap-3 rounded-2xl bg-encre py-3 pl-4 pr-2 text-[0.92rem] leading-snug text-white shadow-[0_18px_40px_-22px_rgba(0,0,0,0.7)]">
            <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-vif" />
            <span className="flex-1">{visible.texte}</span>
            <button onClick={fermer} aria-label="Masquer ce conseil" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"><X size={15} /></button>
            <motion.span aria-hidden className="absolute bottom-0 left-4 right-4 h-px origin-left bg-accent-vif/60" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 6.5, ease: 'linear' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
