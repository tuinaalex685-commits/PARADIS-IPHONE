'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Telephone } from '@/types';
import { BUDGETS } from '@/data/telephones';
import { CarteTelephone } from '@/components/telephone/CarteTelephone';
import { suivre } from '@/lib/analytics';

const GAMMES = [
  { id: 'pro', label: 'Pro', test: (t: Telephone) => /Pro/.test(t.nom) },
  { id: 'classique', label: 'Classique', test: (t: Telephone) => !/Pro|Air|SE/.test(t.nom) },
  { id: 'fin', label: 'Air & SE', test: (t: Telephone) => /Air|SE/.test(t.nom) },
];
const STOCKAGES = ['128 Go', '256 Go', '512 Go', '1 To'];
const enGo = (s: string) => (s.includes('To') ? parseInt(s) * 1024 : parseInt(s));
const TRIS = [
  { id: 'recent', label: 'Plus récents' },
  { id: 'prix-asc', label: 'Prix croissant' },
  { id: 'prix-desc', label: 'Prix décroissant' },
];

/**
 * CATALOGUE FILTRABLE — filtres réels, mémorisés dans l'adresse (partageable, retour arrière OK).
 * Les cartes se réorganisent avec une animation de mise en page ; état vide utile.
 */
export function Catalogue({ liste }: { liste: Telephone[] }) {
  const p = useSearchParams();
  const router = useRouter();
  const chemin = usePathname();
  const gamme = p.get('gamme');
  const budget = p.get('budget');
  const stockage = p.get('stockage');
  const sim = p.get('sim');
  const tri = p.get('tri') ?? 'recent';

  const maj = (cle: string, valeur: string | null) => {
    const q = new URLSearchParams(p.toString());
    if (valeur === null || q.get(cle) === valeur) q.delete(cle); else q.set(cle, valeur);
    router.replace(`${chemin}${q.size ? `?${q}` : ''}`, { scroll: false });
    suivre('catalog_filter', { source: cle, item: valeur ?? 'aucun' });
  };

  const resultat = useMemo(() => {
    let r = liste.filter((t) => {
      if (gamme && !GAMMES.find((g) => g.id === gamme)?.test(t)) return false;
      if (budget) { const b = BUDGETS.find((x) => x.id === budget); if (!b || t.prixDepart === null || t.prixDepart < b.min || t.prixDepart >= b.max) return false; }
      if (stockage && !t.capacites.some((c) => enGo(c.go) >= enGo(stockage))) return false;
      if (sim === 'physique' && !t.sims.some((s) => s.includes('physique') || s.includes('Double'))) return false;
      return true;
    });
    r = [...r].sort((a, b) => tri === 'prix-asc' ? (a.prixDepart ?? 9e9) - (b.prixDepart ?? 9e9) : tri === 'prix-desc' ? (b.prixDepart ?? -1) - (a.prixDepart ?? -1) : b.annee - a.annee || (b.prixDepart ?? 0) - (a.prixDepart ?? 0));
    return r;
  }, [liste, gamme, budget, stockage, sim, tri]);

  const actifs = [gamme, budget, stockage, sim].filter(Boolean).length;
  const puce = (actif: boolean) => `inline-flex h-10 shrink-0 items-center rounded-full px-4 text-[0.88rem] font-medium transition-colors ${actif ? 'bg-encre text-white' : 'bg-surface ring-1 ring-filet hover:ring-sourdine'}`;

  return (
    <div>
      {/* Barre de filtres : défilement horizontal au doigt, collée en haut sur grand écran */}
      <div className="sticky top-[4.6rem] z-30 -mx-5 bg-fond/90 px-5 py-3 backdrop-blur md:top-[5.4rem] md:-mx-10 md:px-10">
        <div className="sans-barre flex items-center gap-2 overflow-x-auto">
          <span className="mr-1 inline-flex shrink-0 items-center gap-1.5 text-[0.88rem] font-semibold"><SlidersHorizontal size={16} />Filtrer</span>
          {GAMMES.map((g) => <button key={g.id} onClick={() => maj('gamme', g.id)} aria-pressed={gamme === g.id} className={puce(gamme === g.id)}>{g.label}</button>)}
          <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-filet" />
          {BUDGETS.map((b) => <button key={b.id} onClick={() => maj('budget', b.id)} aria-pressed={budget === b.id} className={puce(budget === b.id)}>{b.label}</button>)}
          <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-filet" />
          {STOCKAGES.map((s) => <button key={s} onClick={() => maj('stockage', s)} aria-pressed={stockage === s} className={puce(stockage === s)}>{s} et +</button>)}
          <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-filet" />
          <button onClick={() => maj('sim', 'physique')} aria-pressed={sim === 'physique'} className={puce(sim === 'physique')}>Avec SIM physique</button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.95rem]" aria-live="polite"><strong className="chiffres">{resultat.length}</strong> modèle{resultat.length > 1 ? 's' : ''}
          {actifs > 0 && <button onClick={() => router.replace(chemin, { scroll: false })} className="ml-3 inline-flex items-center gap-1 text-sourdine underline underline-offset-4 hover:text-encre"><X size={14} />Tout effacer</button>}
        </p>
        <label className="flex items-center gap-2 text-[0.9rem]">Trier
          <select value={tri} onChange={(e) => maj('tri', e.target.value === 'recent' ? null : e.target.value)} className="h-10 rounded-full bg-surface px-3 ring-1 ring-filet">
            {TRIS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
        </label>
      </div>

      {resultat.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-carte)] bg-surface p-8 text-center ring-1 ring-filet md:p-14">
          <p className="titre text-[1.8rem]">Aucun modèle ne réunit tous ces critères.</p>
          <p className="mx-auto mt-3 max-w-md text-sourdine">Retirez un filtre, ou décrivez votre besoin : la boutique cherche pour vous, y compris hors catalogue.</p>
          <button onClick={() => router.replace(chemin, { scroll: false })} className="mt-6 rounded-full bg-encre px-6 py-3 font-semibold text-white">Voir tous les modèles</button>
        </div>
      ) : (
        <motion.ul layout className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {resultat.map((t, i) => (
              <motion.li key={t.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
                <CarteTelephone t={t} priorite={i < 4} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
