'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Scale, X } from 'lucide-react';
import { getTelephone, visuel } from '@/data/telephones';
import { chiffre } from '@/data/site';
import { useBoutique } from '@/components/providers/Boutique';
import { bloquerDefilement } from '@/components/providers/DefilementDoux';
import { suivre } from '@/lib/analytics';

/**
 * COMPARATEUR — jusqu'à trois modèles côte à côte, uniquement sur des données vérifiables
 * (prix relevé, écran, puce, photo, capacités, SIM). Les lignes qui diffèrent sont marquées.
 * Une barre discrète apparaît dès qu'un modèle est ajouté ; le tableau s'ouvre en panneau.
 */
export function Comparateur() {
  const { compares, basculerComparaison, viderComparaison } = useBoutique();
  const [ouvert, setOuvert] = useState(false);
  const modeles = compares.map(getTelephone).filter((t) => !!t);
  useEffect(() => { bloquerDefilement(ouvert); }, [ouvert]);
  useEffect(() => { if (modeles.length === 0) setOuvert(false); }, [modeles.length]);

  const lignes: { label: string; v: (t: NonNullable<(typeof modeles)[number]>) => string }[] = [
    { label: 'Prix de départ', v: (t) => (t.prixDepart === null ? 'Sur demande' : `${chiffre(t.prixDepart)} FCFA`) },
    { label: 'Écran', v: (t) => t.specs.ecran ?? '—' },
    { label: 'Puce', v: (t) => t.specs.puce },
    { label: 'Appareil photo', v: (t) => t.specs.photo },
    { label: 'Capacités', v: (t) => t.capacites.map((c) => c.go).join(', ') },
    { label: 'Carte SIM', v: (t) => t.sims.join(' ou ') },
    { label: 'Année', v: (t) => String(t.annee) },
  ];

  return (
    <>
      <AnimatePresence>
        {modeles.length > 0 && !ouvert && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed inset-x-3 bottom-24 z-40 mx-auto flex max-w-xl items-center gap-3 rounded-full bg-encre p-2 pl-3 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] md:bottom-6">
            <div className="flex -space-x-3">
              {modeles.map((t) => <span key={t.slug} className="relative h-11 w-11 rounded-full bg-white ring-2 ring-encre"><Image src={visuel(t)} alt="" fill sizes="44px" className="object-contain p-1" /></span>)}
            </div>
            <p className="min-w-0 flex-1 truncate text-[0.9rem]">{modeles.length === 1 ? 'Ajoutez un autre modèle pour comparer' : `${modeles.length} modèles à comparer`}</p>
            <button onClick={viderComparaison} aria-label="Vider le comparateur" className="grid h-10 w-10 place-items-center rounded-full text-white/60 hover:bg-white/10"><X size={17} /></button>
            <button disabled={modeles.length < 2} onClick={() => { setOuvert(true); suivre('compare_open', { quantite: modeles.length }); }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-4 text-[0.9rem] font-semibold text-white disabled:opacity-40"><Scale size={16} />Comparer</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ouvert && (
          <motion.div className="fixed inset-0 z-[65] flex items-end bg-black/50 md:items-center md:justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOuvert(false)}>
            <motion.div role="dialog" aria-modal="true" aria-label="Comparaison des modèles" data-lenis-prevent onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] bg-fond md:max-w-5xl md:rounded-[2rem]">
              <div className="sticky top-0 z-10 flex items-center justify-between bg-fond/95 px-5 py-4 backdrop-blur md:px-8">
                <div>
                  <p className="titre text-[1.5rem]">Vous hésitez ?</p>
                  <p className="text-[0.9rem] text-sourdine">Les différences sont surlignées. Données constructeur, prix relevés en boutique.</p>
                </div>
                <button onClick={() => setOuvert(false)} aria-label="Fermer" className="grid h-11 w-11 place-items-center rounded-full bg-encre text-white"><X size={18} /></button>
              </div>
              <div className="overflow-x-auto px-5 pb-8 md:px-8">
                <table className="w-full min-w-[34rem] border-collapse text-left text-[0.92rem]">
                  <thead>
                    <tr>
                      <th className="w-36" />
                      {modeles.map((t) => (
                        <th key={t.slug} scope="col" className="px-3 pb-4 align-bottom font-normal">
                          <div className="relative mx-auto h-32 w-28"><Image src={visuel(t)} alt="" fill sizes="112px" className="object-contain" /></div>
                          <p className="titre mt-2 text-[1.15rem]">{t.nom}</p>
                          <div className="mt-2 flex gap-2">
                            <Link href={`/telephone/${t.slug}`} onClick={() => setOuvert(false)} className="rounded-full bg-encre px-3 py-1.5 text-[0.8rem] font-semibold text-white">Configurer</Link>
                            <button onClick={() => basculerComparaison(t.slug)} className="rounded-full px-2 py-1.5 text-[0.8rem] text-sourdine underline">Retirer</button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lignes.map((l) => {
                      const valeurs = modeles.map((t) => l.v(t));
                      const differe = new Set(valeurs).size > 1;
                      return (
                        <tr key={l.label} className="border-t border-filet align-top">
                          <th scope="row" className="py-3 pr-3 font-semibold">{l.label}</th>
                          {valeurs.map((v, i) => <td key={i} className={`px-3 py-3 ${differe ? 'bg-accent-clair/60' : ''}`}>{v}</td>)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
