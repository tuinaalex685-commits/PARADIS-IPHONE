'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Message WhatsApp préparé, affiché tant que le numéro réel de Das'hair n'est pas configuré
 * (src/data/site.ts → whatsapp). Rien n'est envoyé : le visiteur peut copier le texte.
 */
export function MessageDialog({ message, onClose, onCopie }: {
  message: { texte: string; titre: string } | null;
  onClose: () => void;
  onCopie: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (message && !d.open) d.showModal();
    if (!message && d.open) d.close();
  }, [message]);

  const copier = async () => {
    if (!message) return;
    try { await navigator.clipboard.writeText(message.texte); onCopie(); } catch { /* copie manuelle possible */ }
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="m-auto w-[min(34rem,calc(100%-2rem))] rounded-[var(--radius-carte)] bg-surface p-0 text-encre backdrop:bg-encre/60"
      aria-labelledby="titre-message"
    >
      {message && (
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="sur-titre text-accent-fonce">Message WhatsApp de démonstration</p>
              <h2 id="titre-message" className="titre mt-3 text-3xl">{message.titre}</h2>
            </div>
            <button onClick={onClose} className="-m-2 p-2 text-sourdine hover:text-encre" aria-label="Fermer">
              <X size={20} />
            </button>
          </div>
          <pre className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap rounded-[var(--radius-ctrl)] border border-filet bg-fond p-4 font-sans text-[0.95rem] leading-relaxed">{message.texte}</pre>
          <p className="mt-4 text-sm text-sourdine">
            Le numéro WhatsApp de Das&rsquo;hair sera ajouté avant la mise en ligne. Une fois configuré, ce bouton ouvrira
            directement la conversation avec ce message déjà rédigé. Rien n&rsquo;a été envoyé.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={copier} className="inline-flex h-12 items-center rounded-[var(--radius-ctrl)] bg-action px-6 text-[0.95rem] font-semibold text-surface transition-colors duration-200 hover:bg-action-fonce">
              Copier le message
            </button>
            <button onClick={onClose} className="inline-flex h-12 items-center px-4 text-[0.95rem] font-semibold text-encre underline-offset-4 hover:underline">
              Fermer
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
