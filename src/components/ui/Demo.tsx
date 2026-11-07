/** Mention discrète mais visible : la donnée affichée est un exemple, à remplacer. */
export function MentionDemo({ children = 'Exemple de démonstration', className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[0.8rem] font-medium text-sourdine ${className}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

/** Emplacement d'une information que Das'hair doit fournir (jamais inventée). */
export function ACompleter({ children }: { children: React.ReactNode }) {
  return <span className="italic text-sourdine">{children} (à compléter)</span>;
}
