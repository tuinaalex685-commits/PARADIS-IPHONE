'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useBoutique } from '@/components/providers/Boutique';
import { composerMessage, propre } from '@/lib/whatsapp';
import { suivre, type EvenementConversion } from '@/lib/analytics';

/**
 * Formulaire de demande (rendez-vous, inscription, contact) du prototype.
 * Validation côté navigateur, puis confirmation HONNÊTE : aucune donnée n'est transmise ni
 * enregistrée (pas de serveur). Le visiteur peut envoyer sa demande par WhatsApp en un clic.
 */
export type Champ = {
  nom: string;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'date' | 'textarea' | 'select';
  requis?: boolean;
  options?: string[];
  aide?: string;
  autoComplete?: string;
  defaut?: string;
};

function valider(c: Champ, v: string): string | null {
  const t = v.trim();
  if (c.requis && !t) return `Indiquez ${c.label.toLowerCase()}.`;
  if (!t) return null;
  if (c.type === 'tel' && !/^\+?[\d\s.-]{8,18}$/.test(t)) return 'Ce numéro semble incomplet : indiquez-le avec l’indicatif, par exemple +226 70 00 00 00.';
  if (c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return 'Cette adresse e-mail semble incomplète.';
  if (c.type === 'date' && new Date(t) < new Date(new Date().toDateString())) return 'Choisissez une date à venir.';
  return null;
}

export function Formulaire({ champs, intro, bouton, titreMessage, evenement, item, reassurance }: {
  champs: Champ[];
  /** Première ligne du message WhatsApp généré. */
  intro: string;
  bouton: string;
  titreMessage: string;
  evenement: EvenementConversion;
  item?: string;
  reassurance?: string;
}) {
  const id = useId();
  const { preparerWhatsApp } = useBoutique();
  const [valeurs, setValeurs] = useState<Record<string, string>>(() => Object.fromEntries(champs.map((c) => [c.nom, c.defaut ?? ''])));
  const [erreurs, setErreurs] = useState<Record<string, string | null>>({});
  const [etat, setEtat] = useState<'saisie' | 'verification' | 'prete'>('saisie');

  const message = () => composerMessage([
    intro,
    '',
    ...champs.filter((c) => valeurs[c.nom]?.trim()).map((c) => `${c.label} : ${propre(valeurs[c.nom])}`),
  ]);

  const envoyer = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = Object.fromEntries(champs.map((c) => [c.nom, valider(c, valeurs[c.nom] ?? '')]));
    setErreurs(errs);
    const premiere = champs.find((c) => errs[c.nom]);
    if (premiere) { document.getElementById(`${id}-${premiere.nom}`)?.focus(); return; }
    setEtat('verification');
    suivre(evenement, { item });
    suivre('contact_form_submit', { item, source: evenement });
    window.setTimeout(() => setEtat('prete'), 650); // court état de préparation, rien n'est envoyé
  };

  const champClasse = (n: string) =>
    `mt-2 block w-full rounded-[var(--radius-ctrl)] border bg-surface px-4 py-3.5 text-[1rem] text-encre outline-none transition-colors placeholder:text-sourdine/70 focus:border-encre ${erreurs[n] ? 'border-erreur' : 'border-filet'}`;

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {etat !== 'prete' ? (
          <motion.form key="saisie" onSubmit={envoyer} noValidate exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="grid gap-5 sm:grid-cols-2">
            {champs.map((c) => {
              const large = c.type === 'textarea' || c.type === 'select' || champs.length < 3;
              const props = {
                id: `${id}-${c.nom}`, name: c.nom, value: valeurs[c.nom] ?? '', autoComplete: c.autoComplete,
                'aria-invalid': !!erreurs[c.nom], 'aria-describedby': erreurs[c.nom] ? `${id}-${c.nom}-err` : c.aide ? `${id}-${c.nom}-aide` : undefined,
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                  setValeurs((v) => ({ ...v, [c.nom]: e.target.value }));
                  if (erreurs[c.nom]) setErreurs((er) => ({ ...er, [c.nom]: valider(c, e.target.value) }));
                },
                onBlur: () => setErreurs((er) => ({ ...er, [c.nom]: valider(c, valeurs[c.nom] ?? '') })),
                className: champClasse(c.nom),
              };
              return (
                <div key={c.nom} className={large ? 'sm:col-span-2' : ''}>
                  <label htmlFor={`${id}-${c.nom}`} className="text-[0.92rem] font-semibold">
                    {c.label}{!c.requis && <span className="font-normal text-sourdine"> (facultatif)</span>}
                  </label>
                  {c.type === 'textarea' ? <textarea rows={4} maxLength={800} {...props} />
                    : c.type === 'select' ? (
                      <select {...props}>
                        <option value="">Choisir…</option>
                        {c.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : <input type={c.type ?? 'text'} inputMode={c.type === 'tel' ? 'tel' : undefined} maxLength={160} {...props} />}
                  {erreurs[c.nom] ? <p id={`${id}-${c.nom}-err`} className="mt-2 text-sm text-erreur">{erreurs[c.nom]}</p>
                    : c.aide && <p id={`${id}-${c.nom}-aide`} className="mt-2 text-sm text-sourdine">{c.aide}</p>}
                </div>
              );
            })}
            <div className="sm:col-span-2">
              <button type="submit" disabled={etat === 'verification'} aria-busy={etat === 'verification'}
                className="inline-flex h-13 w-full items-center justify-center gap-3 rounded-[var(--radius-ctrl)] bg-action px-7 text-[0.95rem] font-semibold text-surface transition-colors hover:bg-action-fonce disabled:opacity-70 sm:w-auto">
                {etat === 'verification' ? 'Préparation de votre demande…' : bouton}
              </button>
              {reassurance && <p className="mt-3 text-sm text-sourdine">{reassurance}</p>}
            </div>
          </motion.form>
        ) : (
          <motion.div key="prete" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            role="status" className="rounded-[var(--radius-carte)] border border-filet bg-surface p-6 md:p-8">
            <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              className="grid h-11 w-11 place-items-center rounded-full bg-succes text-surface"><Check size={20} /></motion.span>
            <p className="titre mt-5 text-3xl">Votre demande est prête.</p>
            <p className="mt-3 max-w-lg text-sourdine">
              Prototype de démonstration : rien n’a été envoyé ni enregistré. Pour la transmettre à Das’hair, envoyez-la par WhatsApp, elle est déjà rédigée.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button onClick={() => { suivre('whatsapp_click', { item, source: evenement }); preparerWhatsApp(message(), titreMessage); }}
                className="inline-flex h-13 items-center rounded-[var(--radius-ctrl)] bg-action px-7 text-[0.95rem] font-semibold text-surface transition-colors hover:bg-action-fonce">
                Envoyer par WhatsApp
              </button>
              <button onClick={() => setEtat('saisie')} className="text-[0.95rem] font-semibold underline decoration-filet underline-offset-[6px] hover:decoration-accent">
                Modifier ma demande
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
