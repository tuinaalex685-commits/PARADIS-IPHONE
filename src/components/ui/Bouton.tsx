import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/**
 * Boutons pilule.
 * - principal : noir pur, flèche dans un disque bleu qui pivote au survol (souris seulement) ;
 * - or : aplat bleu pour l'action clé d'un écran (Commander) ;
 * - secondaire : filet ; clair : blanc (sur noir) ; lien : texte souligné.
 */
export type Variante = 'principal' | 'or' | 'secondaire' | 'lien' | 'clair';

const base = 'group/btn inline-flex select-none items-center justify-center gap-3 rounded-full text-[0.95rem] font-semibold transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-sortie)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50';
const styles: Record<Variante, string> = {
  principal: 'h-14 bg-encre pl-7 pr-2 text-white hover:bg-action-fonce',
  or: 'h-14 bg-accent pl-7 pr-2 text-white hover:bg-accent-fonce',
  secondaire: 'h-14 border border-black/20 px-7 text-encre hover:border-black hover:bg-black hover:text-white',
  clair: 'h-14 bg-white pl-7 pr-2 text-black hover:bg-accent-clair',
  lien: 'h-auto rounded-none px-0 text-encre underline decoration-filet decoration-1 underline-offset-[6px] hover:decoration-accent',
};

export function Fleche({ variante = 'principal' }: { variante?: Variante }) {
  if (variante === 'secondaire' || variante === 'lien') return null;
  const fond = variante === 'or' ? 'bg-white text-accent' : variante === 'clair' ? 'bg-black text-white' : 'bg-accent text-white';
  return (
    <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${fond} transition-transform duration-300 ease-[var(--ease-sortie)] group-hover/btn:rotate-45`}>
      <ArrowUpRight size={18} strokeWidth={2.2} />
    </span>
  );
}

export const classeBouton = (variante: Variante = 'principal', className = '') => `${base} ${styles[variante]} ${className}`;

export function BoutonLien({ href, children, variante = 'principal', className = '', onClick }: {
  href: string; children: React.ReactNode; variante?: Variante; className?: string; onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className={classeBouton(variante, className)}>
      {children}<Fleche variante={variante} />
    </Link>
  );
}

export function Bouton({ children, variante = 'principal', className = '', ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button {...props} className={classeBouton(variante, className)}>
      {children}<Fleche variante={variante} />
    </button>
  );
}
