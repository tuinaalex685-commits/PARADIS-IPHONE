'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Info, Scale } from 'lucide-react';
import type { Telephone } from '@/types';
import { site } from '@/data/site';
import { useBoutique } from '@/components/providers/Boutique';
import { suivre } from '@/lib/analytics';
import { classeBouton, Fleche } from '@/components/ui/Bouton';
import { IconeWhatsApp } from '@/components/ui/BoutonWhatsApp';
import { Scene } from './Scene';
import { PrixAnime } from './Prix';
import { Bulle, useGuide } from './Guide';

/** Conseil de capacité : repères d'usage généraux, sans promesse technique sur le modèle. */
function conseilCapacite(go: string) {
  if (go.startsWith('32') || go.startsWith('64')) return 'Pour un usage simple : appels, messages, quelques applications.';
  if (go.startsWith('128')) return 'Le choix courant : messages, réseaux sociaux et photos du quotidien.';
  if (go.startsWith('256')) return 'De la marge pour les photos, les vidéos et les applications lourdes.';
  return 'Pour filmer beaucoup, garder toute sa photothèque et ne plus jamais trier.';
}

export const lienCommande = (t: Telephone, f: number, c: string, s: string) =>
  `/commander?${new URLSearchParams({ m: t.slug, ...(t.couleurs.length ? { f: String(f) } : {}), c, s }).toString()}`;

/**
 * CONFIGURATEUR — finition → capacité → carte SIM → récapitulatif → commande.
 * Tout est réel : chaque finition affiche son rendu officiel, chaque capacité son prix relevé
 * (ou « sur confirmation » s'il n'est pas connu), et le récapitulatif suit la sélection.
 * La sélection est gardée pendant la visite (session) et transmise au formulaire de commande.
 */
export function Configurateur({ t }: { t: Telephone }) {
  const { preparerWhatsApp, basculerComparaison, compares } = useBoutique();
  const cleSession = `paradis:config:${t.slug}`;
  const [fin, setFin] = useState(0);
  const [vue, setVue] = useState(0);
  const [sens, setSens] = useState<1 | -1>(1);
  const [cap, setCap] = useState(0);
  const [sim, setSim] = useState(0);
  const [touche, setTouche] = useState(false);
  const { message, dire, fermer } = useGuide();
  const charge = useRef(false);

  // Restaure la configuration de la visite ; sinon premier conseil après un court instant.
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(cleSession) ?? 'null') as { fin: number; cap: number; sim: number } | null;
      if (s) { setFin(Math.min(s.fin, Math.max(0, t.couleurs.length - 1))); setCap(Math.min(s.cap, t.capacites.length - 1)); setSim(Math.min(s.sim, t.sims.length - 1)); setTouche(true); }
    } catch { /* rien */ }
    charge.current = true;
    const id = window.setTimeout(() => {
      if (t.couleurs.length > 1) dire({ id: `intro-${t.slug}`, zone: 'finition', texte: 'Commencez par la finition : la photo montre le vrai coloris que vous choisissez.' });
    }, 1400);
    return () => window.clearTimeout(id);
  }, [cleSession, dire, t]);
  useEffect(() => {
    if (!charge.current) return;
    try { sessionStorage.setItem(cleSession, JSON.stringify({ fin, cap, sim })); } catch { /* rien */ }
  }, [cleSession, fin, cap, sim]);

  const couleur = t.couleurs[fin];
  const vues = couleur?.vues ?? [t.images[0].src];
  const image = vues[Math.min(vue, vues.length - 1)];
  const capacite = t.capacites[cap];
  const prix = capacite.prix;
  const compare = compares.includes(t.slug);

  const choisirFinition = (i: number) => {
    if (i === fin) return;
    setSens(i > fin ? 1 : -1); setFin(i); setVue(0); setTouche(true);
    suivre('configurator_change', { item: t.slug, source: 'finition' });
    dire({ id: `fin-${t.slug}`, zone: 'finition', texte: `${t.couleurs[i].nom}, en photo officielle. Il reste à choisir la capacité.` });
  };
  const choisirCapacite = (i: number) => {
    setCap(i); setTouche(true);
    suivre('configurator_change', { item: t.slug, source: 'capacite' });
    const c = t.capacites[i];
    dire({ id: `cap-${t.slug}-${c.go}`, zone: 'capacite', texte: c.prix === null
      ? `${c.go} : ${conseilCapacite(c.go)} Le prix exact vous sera confirmé sur WhatsApp avec la disponibilité.`
      : `${c.go} : ${conseilCapacite(c.go)}` }, false);
  };
  const changerVue = (dir: 1 | -1) => {
    if (vues.length < 2) return;
    setSens(dir); setVue((v) => (v + dir + vues.length) % vues.length);
  };

  // Message de fin de parcours, une fois la configuration complète touchée.
  // Laisse d'abord le temps de lire le conseil sur la capacité.
  useEffect(() => {
    if (!(touche && cap > 0)) return;
    const id = window.setTimeout(() => dire({ id: `pret-${t.slug}`, zone: 'recap', texte: 'Votre configuration est prête. Envoyez-la : la boutique vous confirme prix et disponibilité.' }), 5200);
    return () => window.clearTimeout(id);
  }, [touche, cap, dire, t.slug]);

  const lien = lienCommande(t, fin, capacite.go, t.sims[sim]);
  const resume = useMemo(() => [couleur?.nom, capacite.go, t.sims.length > 1 ? t.sims[sim] : null].filter(Boolean).join(' · '), [couleur, capacite, sim, t.sims]);
  const question = () => { suivre('whatsapp_click', { item: t.slug, source: 'fiche' }); preparerWhatsApp(`Bonjour Paradis des téléphones, j'ai une question sur l'${t.nom} (${resume}) : `, 'Votre question est prête'); };

  return (
    <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
      {/* SCÈNE — collée pendant le défilement sur tablette et ordinateur */}
      <div className="md:sticky md:top-24 md:col-span-6 md:self-start lg:col-span-7">
        <div className="relative overflow-hidden rounded-[var(--radius-carte)] bg-surface ring-1 ring-filet">
          <Scene src={image} alt={`${t.nom}${couleur ? `, finition ${couleur.nom}` : ''}`} teinte={couleur?.hex ?? '#b4832a'} cle={image} sens={sens}
            onGlisse={vues.length > 1 ? changerVue : undefined} priorite className="aspect-square w-full md:aspect-[4/4.4] lg:aspect-[5/4.6]" />
          <div className="absolute inset-x-4 top-4 flex items-start justify-between">
            <AnimatePresence mode="wait">
              <motion.p key={couleur?.nom ?? 'x'} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.25 }}
                className="rounded-full bg-white/85 px-3.5 py-1.5 text-[0.85rem] font-semibold backdrop-blur">
                {couleur ? couleur.nom : 'Photo officielle'}
              </motion.p>
            </AnimatePresence>
            <button onClick={() => { basculerComparaison(t.slug); if (!compare) suivre('compare_open', { item: t.slug }); }} aria-pressed={compare}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-[0.85rem] font-semibold transition-colors ${compare ? 'bg-encre text-white' : 'bg-white/85 backdrop-blur hover:bg-white'}`}>
              <Scale size={16} />{compare ? 'Dans le comparateur' : 'Comparer'}
            </button>
          </div>
          {vues.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2" role="group" aria-label="Changer de vue">
              {vues.map((v, i) => (
                <button key={v} onClick={() => { setSens(i > vue ? 1 : -1); setVue(i); }} aria-label={`Vue ${i + 1} sur ${vues.length}`} aria-pressed={i === vue}
                  className={`relative h-14 w-14 overflow-hidden rounded-xl bg-white/80 ring-2 backdrop-blur transition ${i === vue ? 'ring-encre' : 'ring-transparent hover:ring-filet'}`}>
                  <Image src={v} alt="" fill sizes="56px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>
        {vues.length > 1 && <p className="mt-3 text-center text-[0.82rem] text-sourdine md:hidden">Glissez la photo pour tourner le téléphone.</p>}
      </div>

      {/* RÉGLAGES */}
      <div className="md:col-span-6 lg:col-span-5">
        <p className="text-[0.95rem] text-sourdine">{t.marque === 'Apple' ? 'iPhone' : 'Samsung'} · {t.annee}</p>
        <h1 className="titre mt-2 text-[clamp(2.5rem,5vw,4.4rem)]">{t.nom}</h1>
        <p className="mt-4 text-[1.12rem] leading-relaxed">{t.accroche}</p>

        <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1 border-y border-filet py-5">
          <PrixAnime valeur={prix} className="titre text-[clamp(2.4rem,4.4vw,3.4rem)]" />
          <p className="pb-1.5 text-[0.88rem] text-sourdine">
            {prix === null ? `Prix de cette capacité confirmé par la boutique.` : `Prix relevé le ${site.releve}, à confirmer avec la disponibilité.`}
          </p>
        </div>

        {/* FINITION */}
        {t.couleurs.length > 0 ? (
          <fieldset className="mt-8">
            <legend className="flex w-full items-baseline justify-between text-[0.98rem] font-semibold">
              Finition <span className="font-normal text-sourdine">{couleur?.nom}</span>
            </legend>
            <div className="sans-barre -mx-1 mt-3 flex gap-2.5 overflow-x-auto px-1 pb-1 md:flex-wrap">
              {t.couleurs.map((co, i) => {
                const actif = i === fin;
                return (
                  <label key={co.nom} className={`group relative flex w-[5.6rem] shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-2xl border p-2 pb-2.5 transition-[border-color,background-color,transform] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent active:scale-[0.97] ${actif ? 'border-encre bg-surface' : 'border-filet hover:border-sourdine'}`}>
                    <input type="radio" name="finition" className="sr-only" checked={actif} onChange={() => choisirFinition(i)} />
                    <span className="relative h-16 w-full">
                      {co.image && <Image src={co.image} alt="" fill sizes="80px" className="object-contain transition-transform duration-300 group-hover:-translate-y-0.5" />}
                    </span>
                    <span className="flex items-center gap-1.5 text-center text-[0.74rem] font-medium leading-tight">
                      <span aria-hidden className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/15" style={{ backgroundColor: co.hex }} />{co.nom}
                    </span>
                    {actif && <motion.span layoutId={`fin-${t.slug}`} className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-encre text-white" transition={{ type: 'spring', stiffness: 500, damping: 34 }}><Check size={13} strokeWidth={3} /></motion.span>}
                  </label>
                );
              })}
            </div>
            <Bulle message={message} zone="finition" fermer={fermer} />
          </fieldset>
        ) : (
          <p className="mt-8 flex gap-2 rounded-2xl bg-fond-2 p-4 text-[0.92rem]"><Info size={18} className="mt-0.5 shrink-0" />Coloris selon arrivage : le conseiller vous indique les finitions disponibles.</p>
        )}

        {/* CAPACITÉ */}
        <fieldset className="mt-8">
          <legend className="text-[0.98rem] font-semibold">Capacité</legend>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {t.capacites.map((c, i) => {
              const actif = i === cap;
              return (
                <label key={c.go} className={`relative flex cursor-pointer flex-col rounded-2xl border px-4 py-3.5 transition-[border-color,background-color,color] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent active:scale-[0.98] ${actif ? 'border-encre bg-encre text-white' : 'border-filet hover:border-sourdine'}`}>
                  <input type="radio" name="capacite" className="sr-only" checked={actif} onChange={() => choisirCapacite(i)} />
                  <span className="titre etroit text-[1.5rem]">{c.go}</span>
                  <span className={`chiffres mt-0.5 text-[0.82rem] ${actif ? 'text-white/70' : 'text-sourdine'}`}>{c.prix === null ? 'Prix sur confirmation' : `${new Intl.NumberFormat('fr-FR').format(c.prix)} FCFA`}</span>
                </label>
              );
            })}
          </div>
          <Bulle message={message} zone="capacite" fermer={fermer} />
        </fieldset>

        {/* SIM */}
        {t.sims.length > 1 && (
          <fieldset className="mt-8">
            <legend className="text-[0.98rem] font-semibold">Carte SIM</legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {t.sims.map((s, i) => (
                <label key={s} className={`cursor-pointer rounded-2xl border px-4 py-3.5 text-[0.95rem] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${i === sim ? 'border-encre bg-encre text-white' : 'border-filet hover:border-sourdine'}`}>
                  <input type="radio" name="sim" className="sr-only" checked={i === sim} onChange={() => { setSim(i); setTouche(true); }} />
                  {s}
                  <span className={`mt-0.5 block text-[0.8rem] font-normal ${i === sim ? 'text-white/70' : 'text-sourdine'}`}>
                    {s.startsWith('eSIM') ? 'La carte est intégrée : on l’active avec votre opérateur.' : 'Vous gardez votre carte SIM habituelle.'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {t.sims.length === 1 && <p className="mt-6 text-[0.92rem] text-sourdine">Carte SIM : <strong className="text-encre">{t.sims[0]}</strong></p>}

        {/* RÉCAPITULATIF */}
        <div className="mt-8 rounded-[var(--radius-carte)] bg-encre p-5 text-white md:p-6">
          <p className="text-[0.88rem] text-white/60">Votre configuration</p>
          <div className="mt-3 flex items-center gap-4">
            <span className="relative h-20 w-16 shrink-0"><Image src={couleur?.image ?? t.images[0].src} alt="" fill sizes="64px" className="object-contain" /></span>
            <div className="min-w-0">
              <p className="titre text-[1.35rem]">{t.nom}</p>
              <AnimatePresence mode="wait"><motion.p key={resume} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[0.95rem] text-white/75">{resume}</motion.p></AnimatePresence>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-white/60">Prix</span>
            <PrixAnime valeur={prix} className="titre text-[1.6rem] text-accent-vif" />
          </div>
          <Bulle message={message} zone="recap" fermer={fermer} />
          <div className="mt-5 grid gap-2.5">
            <Link href={lien} onClick={() => suivre('order_start', { item: t.slug, source: 'fiche' })} className={classeBouton('or', 'w-full justify-between')}>
              Commander cette configuration<Fleche variante="or" />
            </Link>
            <button onClick={question} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 text-[0.92rem] font-semibold hover:border-white">
              <IconeWhatsApp size={18} /> Poser une question avant
            </button>
          </div>
          <p className="mt-4 text-[0.8rem] text-white/50">Rien n’est payé en ligne. Livraison partout au Burkina ou retrait à {site.adresse.split(',')[0]}.</p>
        </div>
      </div>

      {/* Barre d'achat au pouce (téléphone uniquement) */}
      <div className="bas-sur fixed inset-x-0 bottom-0 z-40 border-t border-filet bg-fond/92 px-4 pt-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.8rem] text-sourdine">{resume}</p>
            <PrixAnime valeur={prix} className="titre text-[1.35rem]" />
          </div>
          <Link href={lien} onClick={() => suivre('order_start', { item: t.slug, source: 'barre_mobile' })} className="inline-flex h-12 shrink-0 items-center rounded-full bg-accent px-5 font-semibold text-white active:scale-95">Commander</Link>
        </div>
      </div>
    </div>
  );
}
