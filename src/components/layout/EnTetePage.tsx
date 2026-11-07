import Link from 'next/link';
import { LignesTitre } from '@/components/animations/Revelation';

/** En-tête de page intérieure : fil d'Ariane, grand titre qui monte ligne par ligne, introduction. */
export function EnTetePage({ fil, titre, intro, children, sombre = false }: {
  fil: { label: string; href?: string }[];
  titre: string[];
  intro: string;
  children?: React.ReactNode;
  sombre?: boolean;
}) {
  return (
    <header className={`${sombre ? 'sur-sombre bg-encre text-white' : ''} relative overflow-hidden`}>
      <div className="conteneur pb-12 pt-28 md:pt-36 lg:pb-16 lg:pt-40">
        <nav aria-label="Fil d’Ariane">
          <ol className={`flex flex-wrap gap-2 text-[0.85rem] ${sombre ? 'text-white/60' : 'text-sourdine'}`}>
            <li><Link href="/" className="hover:underline">Accueil</Link></li>
            {fil.map((f) => (
              <li key={f.label} className="flex gap-2"><span aria-hidden>/</span>{f.href ? <Link href={f.href} className="hover:underline">{f.label}</Link> : <span aria-current="page">{f.label}</span>}</li>
            ))}
          </ol>
        </nav>
        <h1 className="titre mt-6 text-[clamp(2.8rem,7vw,6.4rem)]"><LignesTitre lignes={titre} /></h1>
        <p className={`mt-6 max-w-2xl text-[1.08rem] leading-relaxed ${sombre ? 'text-white/75' : 'text-sourdine'}`}>{intro}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
