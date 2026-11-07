'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Camera, Maximize2, BatteryFull, Smartphone, Wallet, RotateCcw, Check } from 'lucide-react';
import type { Budget, Telephone } from '@/types';
import { telephones, BUDGETS, visuel } from '@/data/telephones';
import { chiffre } from '@/data/site';
import { suivre } from '@/lib/analytics';
import { classeBouton, Fleche } from '@/components/ui/Bouton';

/**
 * TROUVER LE MIEN — 4 questions visuelles, une par écran, réponses modifiables.
 * Les correspondances reposent UNIQUEMENT sur des données vérifiables du catalogue :
 * - photo : triple caméra ou capteur principal ≥ 48 Mpx (fiche constructeur) ;
 * - grand écran : 6,5 pouces et plus ; compact : 6,1 pouces et moins ;
 * - autonomie : modèles Pro Max, Plus et Ultra, présentés par leurs fabricants comme ceux qui ont
 *   la plus grande batterie de leur génération ;
 * - prix : prix de départ relevé.
 * On ne déclare jamais un modèle « le meilleur » : on explique pourquoi il correspond.
 */
type Priorite = 'photo' | 'ecran' | 'autonomie' | 'compact' | 'prix';
type Stock = 128 | 256 | 512 | 0;
type Marque = 'Apple' | 'Samsung' | 'tous';
type Rep = { priorite?: Priorite; budget?: Budget | 'tous'; stockage?: Stock; marque?: Marque };

const pouces = (t: Telephone) => parseFloat((t.specs.ecran ?? '').replace(',', '.')) || (/SE/.test(t.nom) ? 4.7 : /Pro Max|Plus|Ultra/.test(t.nom) ? 6.7 : 6.1);
const enGo = (s: string) => (s.includes('To') ? parseInt(s) * 1024 : parseInt(s));
const crit = {
  photo: (t: Telephone) => /48 Mpx|108 Mpx|Triple/.test(t.specs.photo),
  ecran: (t: Telephone) => pouces(t) >= 6.5,
  compact: (t: Telephone) => pouces(t) <= 6.1,
  autonomie: (t: Telephone) => /Pro Max|Plus|Ultra/.test(t.nom),
};

const QUESTIONS = [
  { cle: 'priorite' as const, titre: 'Qu’est-ce qui compte le plus pour vous ?', options: [
    { v: 'photo', l: 'Les photos et vidéos', d: 'Triple caméra ou 48 Mpx', I: Camera },
    { v: 'ecran', l: 'Un grand écran', d: '6,5 pouces et plus', I: Maximize2 },
    { v: 'autonomie', l: 'Tenir toute la journée', d: 'Les plus grandes batteries', I: BatteryFull },
    { v: 'compact', l: 'Un format compact', d: '6,1 pouces et moins', I: Smartphone },
    { v: 'prix', l: 'Payer le moins possible', d: 'Le meilleur prix d’abord', I: Wallet },
  ] },
  { cle: 'budget' as const, titre: 'Quel budget voulez-vous y mettre ?', options: [
    ...BUDGETS.map((b) => ({ v: b.id, l: `${b.label} FCFA`, d: b.detail })), { v: 'tous', l: 'Peu importe', d: 'Montrez-moi tout' },
  ] },
  { cle: 'stockage' as const, titre: 'Combien de place pour vos photos et applications ?', options: [
    { v: 128, l: '128 Go', d: 'Usage courant' }, { v: 256, l: '256 Go', d: 'Beaucoup de photos' }, { v: 512, l: '512 Go ou plus', d: 'Vidéos, tout garder' }, { v: 0, l: 'Je ne sais pas', d: 'On vous conseillera' },
  ] },
  { cle: 'marque' as const, titre: 'iPhone ou Samsung ?', options: [
    { v: 'Apple', l: 'iPhone', d: 'Du SE au 18 Pro Max' }, { v: 'Samsung', l: 'Samsung', d: 'Galaxy S22 Ultra' }, { v: 'tous', l: 'Les deux me vont', d: 'Ouvert à tout' },
  ] },
];

function raisons(t: Telephone, r: Rep): string[] {
  const out: string[] = [];
  if (r.priorite === 'photo' && crit.photo(t)) out.push(`Appareil photo : ${t.specs.photo}`);
  if (r.priorite === 'ecran' && crit.ecran(t)) out.push(`Écran ${t.specs.ecran ?? 'grand format'}`);
  if (r.priorite === 'compact' && crit.compact(t)) out.push(`Format ${t.specs.ecran ?? 'compact'}`);
  if (r.priorite === 'autonomie' && crit.autonomie(t)) out.push('Version à grande batterie de sa génération');
  if (t.prixDepart !== null && r.budget && r.budget !== 'tous') out.push(`Dans votre budget : dès ${chiffre(t.prixDepart)} FCFA`);
  if (r.stockage) { const c = t.capacites.find((x) => enGo(x.go) >= r.stockage!); if (c) out.push(`Existe en ${c.go}`); }
  if (t.annee >= 2025) out.push(`Génération ${t.annee}`);
  return out.slice(0, 3);
}

export function Parcours() {
  const [r, setR] = useState<Rep>({});
  const [q, setQ] = useState(0);
  const [sens, setSens] = useState(1);
  const fini = q >= QUESTIONS.length;

  const { liste, elargi } = useMemo(() => {
    if (!fini) return { liste: [] as Telephone[], elargi: false };
    let base = telephones.filter((t) => t.prixDepart !== null)
      .filter((t) => !r.marque || r.marque === 'tous' || t.marque === r.marque)
      .filter((t) => !r.stockage || t.capacites.some((c) => enGo(c.go) >= r.stockage!));
    const b = BUDGETS.find((x) => x.id === r.budget);
    let dansBudget = b ? base.filter((t) => t.prixDepart! >= b.min && t.prixDepart! < b.max) : base;
    let elargi = false;
    if (dansBudget.length === 0 && b) { elargi = true; dansBudget = [...base].sort((x, y) => Math.abs(x.prixDepart! - b.min) - Math.abs(y.prixDepart! - b.min)).slice(0, 3); }
    base = dansBudget;
    const score = (t: Telephone) => {
      const p = r.priorite;
      let s = t.annee / 1000;
      if (p && p !== 'prix' && crit[p](t)) s += 10;
      if (p === 'prix') s -= t.prixDepart! / 100000;
      return s;
    };
    return { liste: [...base].sort((x, y) => score(y) - score(x)).slice(0, 3), elargi };
  }, [fini, r]);

  const repondre = (cle: keyof Rep, v: string | number) => {
    setR((x) => ({ ...x, [cle]: v }));
    setSens(1);
    window.setTimeout(() => { setQ((n) => n + 1); if (q === QUESTIONS.length - 1) suivre('finder_complete', {}); }, 220);
  };
  const aller = (n: number) => { setSens(n < q ? -1 : 1); setQ(n); };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Réponses données : on peut revenir sur chacune */}
      <div className="flex min-h-11 flex-wrap items-center gap-2">
        {QUESTIONS.map((qq, i) => {
          const v = r[qq.cle];
          const o = qq.options.find((x) => x.v === v);
          if (!o) return null;
          return <button key={qq.cle} onClick={() => aller(i)} className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-[0.88rem] ring-1 ring-filet hover:ring-encre"><Check size={14} className="text-accent-fonce" />{o.l}</button>;
        })}
        {q > 0 && <button onClick={() => { setR({}); aller(0); }} className="ml-auto inline-flex h-10 items-center gap-1.5 text-[0.88rem] text-sourdine hover:text-encre"><RotateCcw size={14} />Recommencer</button>}
      </div>

      <div className="relative mt-6 min-h-[26rem]">
        <AnimatePresence mode="wait" initial={false} custom={sens}>
          {!fini ? (
            <motion.div key={q} custom={sens} initial={{ opacity: 0, x: 40 * sens }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 * sens }} transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}>
              <p className="chiffres text-[0.95rem] text-sourdine">Question {q + 1} sur {QUESTIONS.length}</p>
              <h2 className="titre mt-2 text-[clamp(2rem,4.4vw,3.6rem)]">{QUESTIONS[q].titre}</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {QUESTIONS[q].options.map((o, i) => {
                  const actif = r[QUESTIONS[q].cle] === o.v;
                  const I = 'I' in o ? o.I : null;
                  return (
                    <motion.button key={String(o.v)} onClick={() => repondre(QUESTIONS[q].cle, o.v)}
                      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                      className={`group flex min-h-[6.5rem] items-start gap-4 rounded-[1.4rem] p-5 text-left transition-[background-color,color,transform] duration-200 active:scale-[0.98] ${actif ? 'bg-encre text-white' : 'bg-surface ring-1 ring-filet hover:bg-encre hover:text-white'}`}>
                      {I && <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors ${actif ? 'bg-accent text-white' : 'bg-fond-2 group-hover:bg-accent group-hover:text-white'}`}><I size={20} /></span>}
                      <span><span className="block text-[1.12rem] font-semibold">{o.l}</span><span className={`mt-0.5 block text-[0.88rem] ${actif ? 'text-white/65' : 'text-sourdine group-hover:text-white/65'}`}>{o.d}</span></span>
                    </motion.button>
                  );
                })}
              </div>
              {q > 0 && <button onClick={() => aller(q - 1)} className="mt-8 inline-flex h-11 items-center gap-2 font-semibold text-sourdine hover:text-encre"><ArrowLeft size={18} />Question précédente</button>}
            </motion.div>
          ) : (
            <motion.div key="resultats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="titre text-[clamp(2rem,4.4vw,3.6rem)]">{liste.length ? 'Voici ce qui vous correspond.' : 'Rien ne réunit tout cela.'}</h2>
              <p className="mt-3 max-w-2xl text-sourdine">
                {elargi ? 'Aucun modèle dans ce budget avec ces critères : voici les plus proches. ' : ''}
                Chaque proposition dit pourquoi elle correspond. Touchez une réponse en haut pour la changer.
              </p>
              <ol className="mt-8 grid gap-4 md:grid-cols-3">
                {liste.map((t, i) => (
                  <motion.li key={t.slug} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1, duration: 0.45 }}
                    className={`flex flex-col rounded-[var(--radius-carte)] p-5 ${i === 0 ? 'bg-encre text-white' : 'bg-surface ring-1 ring-filet'}`}>
                    <div className="relative mx-auto h-44 w-full"><Image src={visuel(t)} alt={t.nom} fill sizes="(min-width: 768px) 30vw, 80vw" className="object-contain" /></div>
                    <p className="titre mt-4 text-[1.5rem]">{t.nom}</p>
                    <p className="titre etroit chiffres text-[1.5rem]">dès {chiffre(t.prixDepart!)} <span className="text-[0.8rem] font-semibold">FCFA</span></p>
                    <ul className={`mt-3 space-y-1.5 text-[0.9rem] ${i === 0 ? 'text-white/75' : 'text-sourdine'}`}>
                      {raisons(t, r).map((x) => <li key={x} className="flex gap-2"><Check size={15} className={`mt-0.5 shrink-0 ${i === 0 ? 'text-accent-vif' : 'text-accent-fonce'}`} />{x}</li>)}
                    </ul>
                    <Link href={`/telephone/${t.slug}`} className={`${classeBouton(i === 0 ? 'or' : 'principal', 'mt-5 w-full justify-between')}`}>Configurer<Fleche variante={i === 0 ? 'or' : 'principal'} /></Link>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
