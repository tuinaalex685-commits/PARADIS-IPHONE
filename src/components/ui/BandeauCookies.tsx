'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { enregistrerChoix, lireChoix, EVT_OUVRIR } from '@/lib/consentement';

/**
 * Bandeau de consentement. Refuser est aussi simple qu'accepter (même taille, même niveau).
 * Rien n'est mesuré avant un « oui ». Le panneau se rouvre depuis « Gérer mes cookies ».
 */
export function BandeauCookies() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  const [mesure, setMesure] = useState(false);
  const reduit = useReducedMotion();
  const titre = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const c = lireChoix();
    if (!c) setVisible(true);
    const ouvrir = () => { setMesure(lireChoix()?.mesure ?? false); setDetails(true); setVisible(true); };
    window.addEventListener(EVT_OUVRIR, ouvrir);
    return () => window.removeEventListener(EVT_OUVRIR, ouvrir);
  }, []);

  useEffect(() => { if (visible && details) titre.current?.focus(); }, [visible, details]);

  const choisir = (oui: boolean) => { enregistrerChoix(oui); setVisible(false); setDetails(false); };

  const btn = 'inline-flex h-11 flex-1 items-center justify-center whitespace-nowrap rounded-full px-5 text-[0.88rem] font-semibold transition-colors duration-200';

  return (
    <AnimatePresence>
      {visible && (
        <motion.section role="dialog" aria-modal="false" aria-labelledby="cookies-titre" aria-describedby="cookies-texte"
          initial={reduit ? { opacity: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={reduit ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-x-3 bottom-24 z-[70] mx-auto max-w-[27rem] rounded-[1.6rem] border border-filet bg-surface p-5 text-encre shadow-[0_24px_60px_-20px_rgba(21,19,26,0.45)] sm:bottom-6 sm:left-6 sm:right-auto sm:mx-0 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <p id="cookies-titre" ref={titre} tabIndex={-1} className="titre text-[1.45rem] outline-none">
              {details ? 'Vos préférences' : <>Un mot sur les <span className="accent">cookies</span></>}
            </p>
            {details && lireChoix() && (
              <button onClick={() => { setVisible(false); setDetails(false); }} aria-label="Fermer sans changer" className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-fond-2"><X size={18} /></button>
            )}
          </div>

          {!details ? (
            <p id="cookies-texte" className="mt-3 text-[0.92rem] leading-relaxed text-sourdine">
              Le site garde votre sélection de produits sur votre appareil. Avec votre accord, il compte aussi les visites de façon anonyme pour s’améliorer. Aucune publicité, aucun nom, aucun numéro.{' '}
              <Link href="/cookies" className="font-semibold text-encre underline decoration-filet underline-offset-4 hover:decoration-accent">En savoir plus</Link>
            </p>
          ) : (
            <div id="cookies-texte" className="mt-4 divide-y divide-filet border-y border-filet text-[0.9rem]">
              <div className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold">Nécessaires</p>
                  <p className="mt-1 text-sourdine">Votre sélection de produits et ce choix. Sans eux, le site ne fonctionne pas.</p>
                </div>
                <span className="mt-0.5 shrink-0 text-[0.8rem] font-semibold text-succes">Toujours actifs</span>
              </div>
              <label className="flex cursor-pointer items-start justify-between gap-4 py-4">
                <span>
                  <span className="block font-semibold">Mesure d’audience</span>
                  <span className="mt-1 block text-sourdine">Pages vues et clics sur « Réserver », sans donnée personnelle.</span>
                </span>
                <span className="relative mt-0.5 shrink-0">
                  <input type="checkbox" role="switch" checked={mesure} onChange={(e) => setMesure(e.target.checked)} className="peer sr-only" />
                  <span aria-hidden className="block h-7 w-12 rounded-full bg-filet transition-colors duration-200 peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent" />
                  <span aria-hidden className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
                </span>
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {!details ? (
              <>
                <button onClick={() => choisir(false)} className={`${btn} border border-encre/25 hover:border-encre`}>Tout refuser</button>
                <button onClick={() => choisir(true)} className={`${btn} bg-encre text-surface hover:bg-black`}>Tout accepter</button>
                <button onClick={() => { setMesure(false); setDetails(true); }} className="basis-full pt-1 text-[0.88rem] font-semibold text-sourdine underline decoration-filet underline-offset-4 hover:text-encre">Personnaliser</button>
              </>
            ) : (
              <>
                <button onClick={() => choisir(mesure)} className={`${btn} bg-encre text-surface hover:bg-black`}>Enregistrer mes choix</button>
                <Link href="/cookies" onClick={() => setVisible(false)} className={`${btn} border border-encre/25 hover:border-encre`}>Politique de cookies</Link>
              </>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

/** Lien du pied de page pour changer d'avis à tout moment. */
export function LienGererCookies({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(EVT_OUVRIR))} className={className}>
      Gérer mes cookies
    </button>
  );
}
