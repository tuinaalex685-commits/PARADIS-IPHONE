'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Check, Store, Truck } from 'lucide-react';
import { telephones, getTelephone } from '@/data/telephones';
import { site } from '@/data/site';
import { useBoutique } from '@/components/providers/Boutique';
import { composerMessage, propre } from '@/lib/whatsapp';
import { suivre } from '@/lib/analytics';
import { classeBouton, Fleche } from '@/components/ui/Bouton';
import { PrixAnime } from '@/components/telephone/Prix';

/**
 * COMMANDE EN 3 ÉTAPES — 1. le téléphone  2. la réception  3. vos coordonnées → récapitulatif.
 * - Arrive pré-rempli depuis la fiche (modèle, finition, capacité, SIM).
 * - Changer de modèle réinitialise les options devenues incompatibles.
 * - Brouillon gardé pendant la visite. Rien n'est payé ni enregistré : la commande, structurée,
 *   part sur WhatsApp et la boutique confirme prix, disponibilité et livraison.
 */
type Etat = { m: string; f: number; c: string; s: string; mode: 'livraison' | 'retrait' | ''; ville: string; quartier: string; nom: string; tel: string; note: string };
const CLE = 'paradis:commande';
const ETAPES = ['Votre téléphone', 'Réception', 'Vos coordonnées'];

export function FormulaireCommande({ initial }: { initial: { m?: string; f?: string; c?: string; s?: string } }) {
  const id = useId();
  const { preparerWhatsApp } = useBoutique();
  const depart = getTelephone(initial.m ?? '') ?? telephones[0];
  const [v, setV] = useState<Etat>(() => ({
    m: depart.slug, f: Math.min(Number(initial.f ?? 0) || 0, Math.max(0, depart.couleurs.length - 1)),
    c: depart.capacites.some((x) => x.go === initial.c) ? initial.c! : depart.capacites[0].go,
    s: depart.sims.includes(initial.s ?? '') ? initial.s! : depart.sims[0],
    mode: '', ville: 'Ouagadougou', quartier: '', nom: '', tel: '', note: '',
  }));
  const [etape, setEtape] = useState(initial.m ? 1 : 0);
  const [sens, setSens] = useState(1);
  const [fini, setFini] = useState(false);
  const [err, setErr] = useState<Partial<Record<keyof Etat, string>>>({});

  // Brouillon : restauré seulement si l'on n'arrive pas d'une fiche produit.
  useEffect(() => {
    if (initial.m) return;
    try { const b = JSON.parse(sessionStorage.getItem(CLE) ?? 'null'); if (b) setV((x) => ({ ...x, ...b })); } catch { /* rien */ }
  }, [initial.m]);
  useEffect(() => { try { sessionStorage.setItem(CLE, JSON.stringify(v)); } catch { /* rien */ } }, [v]);

  const t = getTelephone(v.m)!;
  const couleur = t.couleurs[v.f];
  const prix = t.capacites.find((x) => x.go === v.c)?.prix ?? null;
  const maj = <K extends keyof Etat>(k: K, val: Etat[K]) => { setV((x) => ({ ...x, [k]: val })); setErr((e) => ({ ...e, [k]: undefined })); };
  const changerModele = (slug: string) => {
    const n = getTelephone(slug)!;
    // Réinitialise ce qui n'existe pas sur le nouveau modèle.
    setV((x) => ({ ...x, m: slug, f: 0, c: n.capacites.some((k) => k.go === x.c) ? x.c : n.capacites[0].go, s: n.sims.includes(x.s) ? x.s : n.sims[0] }));
  };

  const verifier = (n: number) => {
    const e: typeof err = {};
    if (n === 1) {
      if (!v.mode) e.mode = 'Choisissez la livraison ou le retrait en boutique.';
      if (v.mode === 'livraison' && v.ville.trim().length < 2) e.ville = 'Indiquez la ville de livraison.';
      if (v.mode === 'livraison' && v.quartier.trim().length < 2) e.quartier = 'Indiquez le quartier, pour que le livreur vous trouve.';
    }
    if (n === 2) {
      if (v.nom.trim().length < 2) e.nom = 'Indiquez votre nom.';
      if (!/^\+?[\d\s.-]{8,18}$/.test(v.tel.trim())) e.tel = 'Ce numéro semble incomplet : indiquez-le avec l’indicatif, par exemple +226 70 00 00 00.';
    }
    setErr(e);
    const premier = Object.keys(e)[0];
    if (premier) document.getElementById(`${id}-${premier}`)?.focus();
    return !premier;
  };
  const suivant = () => {
    if (!verifier(etape)) return;
    if (etape < 2) { setSens(1); setEtape(etape + 1); if (etape === 0) suivre('order_start', { item: v.m, source: 'formulaire' }); return; }
    suivre('order_submit', { item: v.m }); setFini(true);
  };

  const message = useMemo(() => composerMessage([
    'Bonjour Paradis des téléphones, je souhaite commander :',
    '',
    `📱 ${t.nom}`,
    couleur && `Finition : ${couleur.nom}`,
    `Capacité : ${v.c}`,
    `Carte SIM : ${v.s}`,
    `Prix affiché : ${prix === null ? 'à confirmer' : `${new Intl.NumberFormat('fr-FR').format(prix)} FCFA`}`,
    '',
    v.mode === 'retrait' ? `Réception : retrait en boutique (${site.adresse})` : `Réception : livraison à ${propre(v.ville, 60)}, quartier ${propre(v.quartier, 80)}`,
    `Nom : ${propre(v.nom, 80)}`,
    `Téléphone : ${propre(v.tel, 30)}`,
    v.note && `Précision : ${propre(v.note)}`,
    '',
    'Merci de me confirmer la disponibilité et le prix.',
  ]), [t, couleur, v, prix]);

  const champ = (k: keyof Etat) => `mt-2 block w-full rounded-[var(--radius-ctrl)] border bg-surface px-4 py-3.5 text-[1rem] outline-none transition-colors focus:border-encre ${err[k] ? 'border-erreur' : 'border-filet'}`;
  const Erreur = ({ k }: { k: keyof Etat }) => (err[k] ? <p id={`${id}-${k}-err`} role="alert" className="mt-2 text-sm text-erreur">{err[k]}</p> : null);

  const Resume = (
    <div className="rounded-[var(--radius-carte)] bg-encre p-5 text-white md:p-6">
      <div className="flex items-center gap-4">
        <span className="relative h-24 w-20 shrink-0">
          <AnimatePresence mode="wait"><motion.span key={couleur?.image ?? t.slug} className="absolute inset-0" initial={{ opacity: 0, rotateY: -40 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0 }}>
            <Image src={couleur?.image ?? t.images[0].src} alt="" fill sizes="80px" className="object-contain" />
          </motion.span></AnimatePresence>
        </span>
        <div>
          <p className="titre text-[1.3rem]">{t.nom}</p>
          <p className="text-[0.92rem] text-white/70">{[couleur?.nom, v.c, v.s].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-white/60">Prix</span><PrixAnime valeur={prix} className="titre text-[1.5rem] text-accent-vif" />
      </div>
    </div>
  );

  if (fini) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="grid h-14 w-14 place-items-center rounded-full bg-accent text-white"><Check size={26} /></motion.span>
          <h2 className="titre mt-6 text-[clamp(2.2rem,4vw,3.4rem)]">Votre commande est prête à partir.</h2>
          <p className="mt-4 max-w-xl text-[1.08rem] text-sourdine">Elle s’ouvre dans WhatsApp, déjà rédigée. Envoyez-la : un conseiller vous confirme la disponibilité, le prix et la livraison. Rien n’est payé avant cette confirmation.</p>
          <pre className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-surface p-5 text-[0.9rem] ring-1 ring-filet" data-lenis-prevent>{message}</pre>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button onClick={() => { suivre('whatsapp_click', { item: v.m, source: 'commande' }); preparerWhatsApp(message, 'Votre commande est prête'); }} className={classeBouton('or')}>Envoyer sur WhatsApp<Fleche variante="or" /></button>
            <button onClick={() => { setFini(false); setEtape(2); }} className={classeBouton('lien')}>Modifier ma commande</button>
          </div>
        </div>
        <div className="lg:col-span-5">{Resume}</div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="order-2 lg:order-1 lg:col-span-7">
        <ol className="flex items-center gap-3" aria-label="Étapes de la commande">
          {ETAPES.map((e, i) => (
            <li key={e} className="flex flex-1 items-center gap-3 last:flex-none" aria-current={i === etape ? 'step' : undefined}>
              <span className={`chiffres grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.85rem] font-bold transition-colors ${i < etape ? 'bg-accent text-white' : i === etape ? 'bg-encre text-white' : 'ring-1 ring-filet text-sourdine'}`}>{i < etape ? <Check size={15} /> : i + 1}</span>
              <span className={`hidden text-[0.9rem] font-semibold sm:block ${i === etape ? '' : 'text-sourdine'}`}>{e}</span>
              {i < 2 && <span className="relative h-px flex-1 bg-filet"><motion.span className="absolute inset-y-0 left-0 bg-accent" initial={false} animate={{ width: i < etape ? '100%' : '0%' }} /></span>}
            </li>
          ))}
        </ol>

        <form onSubmit={(e) => { e.preventDefault(); suivant(); }} noValidate className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={etape} initial={{ opacity: 0, x: sens * 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: sens * -24 }} transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}>
              {etape === 0 && (
                <div className="space-y-6">
                  <h2 className="titre text-[2rem]">Votre téléphone</h2>
                  <div>
                    <label htmlFor={`${id}-m`} className="font-semibold">Modèle</label>
                    <select id={`${id}-m`} value={v.m} onChange={(e) => changerModele(e.target.value)} className={champ('m')}>
                      {telephones.map((x) => <option key={x.slug} value={x.slug}>{x.marque === 'Samsung' ? 'Samsung ' : ''}{x.nom}</option>)}
                    </select>
                  </div>
                  {t.couleurs.length > 0 && (
                    <fieldset>
                      <legend className="font-semibold">Finition <span className="font-normal text-sourdine">· {couleur?.nom}</span></legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {t.couleurs.map((co, i) => (
                          <label key={co.nom} className={`flex cursor-pointer items-center gap-2 rounded-full border py-2 pl-2 pr-4 text-[0.9rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${i === v.f ? 'border-encre bg-encre text-white' : 'border-filet'}`}>
                            <input type="radio" name="f" className="sr-only" checked={i === v.f} onChange={() => maj('f', i)} />
                            <span className="h-5 w-5 rounded-full ring-1 ring-black/15" style={{ backgroundColor: co.hex }} />{co.nom}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}
                  <fieldset>
                    <legend className="font-semibold">Capacité</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {t.capacites.map((k) => (
                        <label key={k.go} className={`cursor-pointer rounded-full border px-4 py-2 text-[0.9rem] font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${k.go === v.c ? 'border-encre bg-encre text-white' : 'border-filet'}`}>
                          <input type="radio" name="c" className="sr-only" checked={k.go === v.c} onChange={() => maj('c', k.go)} />{k.go}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {t.sims.length > 1 && (
                    <fieldset>
                      <legend className="font-semibold">Carte SIM</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {t.sims.map((s) => (
                          <label key={s} className={`cursor-pointer rounded-full border px-4 py-2 text-[0.9rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${s === v.s ? 'border-encre bg-encre text-white' : 'border-filet'}`}>
                            <input type="radio" name="s" className="sr-only" checked={s === v.s} onChange={() => maj('s', s)} />{s}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}
                </div>
              )}

              {etape === 1 && (
                <div className="space-y-6">
                  <h2 className="titre text-[2rem]">Comment le recevoir ?</h2>
                  <fieldset aria-describedby={err.mode ? `${id}-mode-err` : undefined}>
                    <legend className="sr-only">Mode de réception</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { id: 'livraison' as const, t: 'Livraison', d: 'Partout au Burkina. Frais et délai confirmés par la boutique.', I: Truck },
                        { id: 'retrait' as const, t: 'Retrait en boutique', d: `${site.adresse}. Vous essayez avant de payer.`, I: Store },
                      ].map((o, i) => (
                        <label key={o.id} className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${v.mode === o.id ? 'border-encre bg-encre text-white' : 'border-filet hover:border-sourdine'}`}>
                          <input id={i === 0 ? `${id}-mode` : undefined} type="radio" name="mode" className="sr-only" checked={v.mode === o.id} onChange={() => maj('mode', o.id)} />
                          <o.I size={22} className="mt-0.5 shrink-0" />
                          <span><span className="block font-semibold">{o.t}</span><span className={`text-[0.88rem] ${v.mode === o.id ? 'text-white/70' : 'text-sourdine'}`}>{o.d}</span></span>
                        </label>
                      ))}
                    </div>
                    <Erreur k="mode" />
                  </fieldset>
                  <AnimatePresence initial={false}>
                    {v.mode === 'livraison' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid gap-5 overflow-hidden sm:grid-cols-2">
                        <div><label htmlFor={`${id}-ville`} className="font-semibold">Ville</label><input id={`${id}-ville`} value={v.ville} onChange={(e) => maj('ville', e.target.value)} autoComplete="address-level2" className={champ('ville')} /><Erreur k="ville" /></div>
                        <div><label htmlFor={`${id}-quartier`} className="font-semibold">Quartier</label><input id={`${id}-quartier`} value={v.quartier} onChange={(e) => maj('quartier', e.target.value)} placeholder="Ex. Ouaga 2000, Dassasgho…" className={champ('quartier')} /><Erreur k="quartier" /></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {etape === 2 && (
                <div className="space-y-5">
                  <h2 className="titre text-[2rem]">Comment vous joindre ?</h2>
                  <p className="text-sourdine">Uniquement pour confirmer la commande.</p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div><label htmlFor={`${id}-nom`} className="font-semibold">Nom et prénom</label><input id={`${id}-nom`} value={v.nom} onChange={(e) => maj('nom', e.target.value)} autoComplete="name" maxLength={80} className={champ('nom')} /><Erreur k="nom" /></div>
                    <div><label htmlFor={`${id}-tel`} className="font-semibold">Téléphone (WhatsApp)</label><input id={`${id}-tel`} type="tel" inputMode="tel" value={v.tel} onChange={(e) => maj('tel', e.target.value)} autoComplete="tel" placeholder="+226 70 00 00 00" maxLength={20} className={champ('tel')} /><Erreur k="tel" /></div>
                    <div className="sm:col-span-2"><label htmlFor={`${id}-note`} className="font-semibold">Une précision <span className="font-normal text-sourdine">(facultatif)</span></label><textarea id={`${id}-note`} rows={3} maxLength={400} value={v.note} onChange={(e) => maj('note', e.target.value)} placeholder="Ex. je veux le voir avant d’acheter, créneau de livraison…" className={champ('note')} /></div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-filet pt-6">
            {etape > 0
              ? <button type="button" onClick={() => { setSens(-1); setEtape(etape - 1); }} className="inline-flex h-12 items-center gap-2 font-semibold text-sourdine hover:text-encre"><ArrowLeft size={18} />Retour</button>
              : <Link href={`/telephone/${t.slug}`} className="text-[0.92rem] text-sourdine underline underline-offset-4">Revoir la fiche</Link>}
            <button type="submit" className={classeBouton(etape === 2 ? 'or' : 'principal')}>{etape === 2 ? 'Voir ma commande' : 'Continuer'}<Fleche variante={etape === 2 ? 'or' : 'principal'} /></button>
          </div>
        </form>
      </div>
      <aside className="order-1 lg:sticky lg:top-28 lg:order-2 lg:col-span-5 lg:self-start">{Resume}
        <ul className="mt-4 space-y-2 text-[0.88rem] text-sourdine">
          <li>Rien n’est payé en ligne : vous réglez après confirmation.</li>
          <li>Le prix et la disponibilité sont confirmés par un conseiller.</li>
        </ul>
      </aside>
    </div>
  );
}
