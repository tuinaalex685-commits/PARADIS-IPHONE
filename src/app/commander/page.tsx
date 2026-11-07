import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FormulaireCommande } from '@/components/commande/FormulaireCommande';

export const metadata: Metadata = {
  title: 'Commander',
  description: 'Votre téléphone, la livraison ou le retrait, vos coordonnées : la commande part sur WhatsApp, la boutique confirme prix et disponibilité.',
  alternates: { canonical: '/commander' },
};

type Q = Promise<{ m?: string; f?: string; c?: string; s?: string }>;

async function AvecParametres({ searchParams }: { searchParams: Q }) {
  return <FormulaireCommande initial={await searchParams} />;
}

export default function Commander({ searchParams }: { searchParams: Q }) {
  return (
    <div className="conteneur pb-24 pt-28 md:pt-36">
      <h1 className="titre text-[clamp(2.6rem,6vw,5rem)]">Commander</h1>
      <p className="mt-4 max-w-xl text-[1.05rem] text-sourdine">Trois étapes, moins d’une minute. La commande part sur WhatsApp, déjà rédigée.</p>
      <div className="mt-10">
        <Suspense fallback={<div className="h-[36rem] animate-pulse rounded-[var(--radius-carte)] bg-fond-2" />}>
          <AvecParametres searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
