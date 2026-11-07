import Link from 'next/link';

/**
 * Mot-marque provisoire : une silhouette de téléphone (un écrin arrondi + l'objectif bleu)
 * et le nom en deux largeurs d'Archivo. Le vrai logo de la boutique le remplacera.
 */
export function Logo({ className = '', clair = false, onClick }: { className?: string; clair?: boolean; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Paradis des téléphones, accueil" className={`group relative z-10 flex items-center gap-2.5 ${clair ? 'text-white' : 'text-encre'} ${className}`}>
      <span aria-hidden className={`relative grid h-9 w-[1.45rem] place-items-start rounded-[0.42rem] border-[2.5px] ${clair ? 'border-white' : 'border-encre'} transition-transform duration-300 ease-[var(--ease-sortie)] group-hover:-rotate-6`}>
        <span className="ml-[3px] mt-[3px] h-[7px] w-[7px] rounded-full bg-accent" />
      </span>
      <span className="leading-none">
        <span className="titre block text-[1.32rem] tracking-[-0.04em]">Paradis</span>
        <span className="etroit block text-[0.78rem] font-semibold tracking-[0.02em] opacity-70">des téléphones</span>
      </span>
    </Link>
  );
}
