import Link from 'next/link';

/**
 * Mot-marque provisoire : un monogramme « P » (carré noir aux angles doux, comme une icône
 * d'application) et le nom en deux largeurs d'Archivo. Le vrai logo de la boutique le remplacera.
 */
export function Logo({ className = '', clair = false, onClick }: { className?: string; clair?: boolean; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Paradis des téléphones, accueil" className={`group relative z-10 flex items-center gap-2.5 ${clair ? 'text-white' : 'text-encre'} ${className}`}>
      <span aria-hidden className={`relative grid h-10 w-10 place-items-center rounded-[0.8rem] transition-transform duration-300 ease-[var(--ease-sortie)] group-hover:scale-105 ${clair ? 'bg-white text-encre' : 'bg-encre text-white'}`}>
        <span className="titre text-[1.35rem] leading-none tracking-[-0.06em]">P</span>
        <span className="absolute right-[0.42rem] top-[0.42rem] h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span className="leading-none">
        <span className="titre block text-[1.3rem] tracking-[-0.04em]">Paradis</span>
        <span className="etroit mt-0.5 block text-[0.78rem] font-semibold tracking-[0.02em] opacity-70">des téléphones</span>
      </span>
    </Link>
  );
}
