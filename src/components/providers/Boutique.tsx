'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { lienWhatsApp } from '@/lib/whatsapp';
import { MessageDialog } from '@/components/ui/MessageDialog';
import { Toast } from '@/components/ui/Toast';

/**
 * État partagé : préparation des messages WhatsApp, notifications, et sélection du comparateur
 * (jusqu'à 3 modèles). Pas de panier : un téléphone = une commande, une étape de moins.
 */
type Ctx = {
  preparerWhatsApp: (message: string, titre?: string) => void;
  notifier: (texte: string) => void;
  compares: string[];
  basculerComparaison: (slug: string) => void;
  viderComparaison: () => void;
};

const BoutiqueCtx = createContext<Ctx | null>(null);
export const MAX_COMPARAISON = 3;

export function BoutiqueProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<{ texte: string; titre: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [compares, setCompares] = useState<string[]>([]);

  const notifier = useCallback((texte: string) => {
    setToast(texte);
    window.setTimeout(() => setToast((t) => (t === texte ? null : t)), 2600);
  }, []);

  const preparerWhatsApp = useCallback((texte: string, titre = 'Votre message est prêt') => {
    const lien = lienWhatsApp(texte);
    if (lien) window.open(lien, '_blank', 'noopener,noreferrer');
    else setMessage({ texte, titre });
  }, []);

  const basculerComparaison = useCallback((slug: string) => {
    setCompares((c) => {
      if (c.includes(slug)) return c.filter((x) => x !== slug);
      if (c.length >= MAX_COMPARAISON) { notifier('Trois modèles au maximum : retirez-en un pour en ajouter un autre.'); return c; }
      return [...c, slug];
    });
  }, [notifier]);
  const viderComparaison = useCallback(() => setCompares([]), []);

  const valeur = useMemo<Ctx>(() => ({ preparerWhatsApp, notifier, compares, basculerComparaison, viderComparaison }),
    [preparerWhatsApp, notifier, compares, basculerComparaison, viderComparaison]);

  return (
    <BoutiqueCtx.Provider value={valeur}>
      {children}
      <MessageDialog message={message} onClose={() => setMessage(null)} onCopie={() => notifier('Message copié')} />
      <Toast texte={toast} />
    </BoutiqueCtx.Provider>
  );
}

export function useBoutique() {
  const c = useContext(BoutiqueCtx);
  if (!c) throw new Error('useBoutique doit être utilisé dans <BoutiqueProvider>.');
  return c;
}
