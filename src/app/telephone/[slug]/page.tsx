import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { telephones, getTelephone, similaires, visuel } from '@/data/telephones';
import { prixFcfa } from '@/data/site';
import { Configurateur } from '@/components/telephone/Configurateur';
import { CarteTelephone } from '@/components/telephone/CarteTelephone';
import { SuiviVue } from '@/components/analytics/SuiviVue';
import { Apparition } from '@/components/animations/Apparition';

export function generateStaticParams() {
  return telephones.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTelephone((await params).slug);
  if (!t) return {};
  return {
    title: `${t.nom}${t.prixDepart ? ` dès ${prixFcfa(t.prixDepart)}` : ''} à Ouagadougou`,
    description: `${t.nom} : ${t.accroche} ${t.capacites.map((c) => c.go).join(', ')}. Commande sur WhatsApp, livraison partout au Burkina ou retrait à Koulouba.`.slice(0, 158),
    alternates: { canonical: `/telephone/${t.slug}` },
    openGraph: { images: [{ url: visuel(t), alt: t.nom }] },
  };
}

/** Le paramètre d'URL est lu dans un îlot Suspense (exigence de Next 16 avec cacheComponents). */
export default function FicheTelephone({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="conteneur h-[80svh] pt-28"><div className="h-full animate-pulse rounded-[var(--radius-carte)] bg-fond-2" /></div>}><Fiche params={params} /></Suspense>;
}

async function Fiche({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTelephone((await params).slug);
  if (!t) notFound();
  const rayon = t.marque === 'Apple' ? { href: '/iphone', label: 'iPhone' } : { href: '/samsung', label: 'Samsung' };

  return (
    <>
      <SuiviVue evenement="view_phone" item={t.slug} />
      <div className="conteneur pb-28 pt-24 md:pb-10 md:pt-28">
        <nav aria-label="Fil d’Ariane" className="mb-6">
          <ol className="flex flex-wrap gap-2 text-[0.85rem] text-sourdine">
            <li><Link href="/" className="hover:underline">Accueil</Link></li>
            <li className="flex gap-2"><span aria-hidden>/</span><Link href={rayon.href} className="hover:underline">{rayon.label}</Link></li>
            <li className="flex gap-2"><span aria-hidden>/</span><span aria-current="page">{t.nom}</span></li>
          </ol>
        </nav>
        <Configurateur t={t} />
      </div>

      {/* Ce que le modèle apporte : arguments issus des fiches constructeur */}
      <section aria-labelledby="atouts" className="px-2 sm:px-4">
        <div className="sur-sombre section mx-auto max-w-[96rem] rounded-[2rem] bg-encre text-white">
          <div className="conteneur grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="atouts" className="titre text-[clamp(2.2rem,4.4vw,3.8rem)]">Ce que {t.marque === 'Apple' ? 'l’' : 'le '}{t.nom} change au quotidien.</h2>
              <p className="mt-5 max-w-md text-white/65">{t.pourQui}</p>
            </div>
            <ol className="grid gap-px overflow-hidden rounded-[1.4rem] bg-white/10 lg:col-span-7">
              {t.atouts.map((a, i) => (
                <Apparition key={a} delai={i * 0.08} as="li" className="flex items-baseline gap-5 bg-encre p-6 md:p-8">
                  <span className="titre etroit text-[2.2rem] text-accent-vif">{i + 1}</span>
                  <span className="text-[1.15rem] leading-snug md:text-[1.3rem]">{a}</span>
                </Apparition>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="fiche" className="conteneur section grid gap-10 lg:grid-cols-12">
        <h2 id="fiche" className="titre text-[clamp(2rem,3.4vw,3rem)] lg:col-span-4">Fiche technique</h2>
        <dl className="border-t border-encre lg:col-span-8">
          {[
            ['Écran', t.specs.ecran], ['Puce', t.specs.puce], ['Appareil photo', t.specs.photo], ['Stockage', t.capacites.map((c) => c.go).join(', ')],
            ['Carte SIM', t.sims.join(' ou ')], ['Finitions', t.couleurs.map((c) => c.nom).join(', ') || 'Selon arrivage'], ['Sortie', String(t.annee)], ['En plus', t.specs.plus],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-filet py-4 sm:grid-cols-[12rem_1fr]">
              <dt className="font-semibold">{k}</dt><dd className="text-sourdine">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[0.85rem] text-sourdine lg:col-span-8 lg:col-start-5">Caractéristiques du fabricant. L’état (neuf ou reconditionné) et la disponibilité de chaque configuration sont confirmés par la boutique avant la vente.</p>
      </section>

      <section aria-labelledby="proches" className="conteneur pb-10">
        <h2 id="proches" className="titre text-[clamp(2rem,3.4vw,3rem)]">Dans le même budget</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similaires(t).map((s) => <li key={s.slug}><CarteTelephone t={s} /></li>)}
        </ul>
      </section>
    </>
  );
}
