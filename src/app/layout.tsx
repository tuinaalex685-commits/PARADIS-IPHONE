import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import { site } from '@/data/site';
import { BoutiqueProvider } from '@/components/providers/Boutique';
import { EnTete } from '@/components/layout/EnTete';
import { PiedDePage } from '@/components/layout/PiedDePage';
import { DefilementDoux } from '@/components/providers/DefilementDoux';
import { Curseur } from '@/components/ui/Curseur';
import { BandeauCookies } from '@/components/ui/BandeauCookies';
import { Comparateur } from '@/components/catalogue/Comparateur';

// Une seule famille, variable en graisse ET en largeur (axe wdth 62 → 125).
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', axes: ['wdth'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Paradis des téléphones · iPhone & Samsung à Ouagadougou', template: '%s · Paradis des téléphones' },
  description: site.description,
  openGraph: { siteName: site.nom, locale: 'fr_FR', type: 'website' },
  // Prototype de présentation : pas d'indexation tant que le contenu n'est pas validé.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#f1f1ee', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={archivo.variable}>
      <body className="flex min-h-dvh flex-col">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-surface focus:px-4 focus:py-2">Aller au contenu</a>
        <BoutiqueProvider>
          <EnTete />
          <main id="contenu" className="flex-1">{children}</main>
          <PiedDePage />
          <Comparateur />
          <DefilementDoux />
          <Curseur />
          <BandeauCookies />
        </BoutiqueProvider>
        {site.demonstration && (
          <p className="pointer-events-none fixed bottom-4 right-4 z-30 hidden rounded-full bg-surface/90 px-4 py-1.5 text-[0.78rem] font-medium text-encre ring-1 ring-filet backdrop-blur lg:block">
            Prototype · prix relevés le {site.releve}, à confirmer
          </p>
        )}
      </body>
    </html>
  );
}
