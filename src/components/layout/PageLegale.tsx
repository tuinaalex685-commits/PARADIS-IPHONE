import { EnTetePage } from './EnTetePage';

/** Gabarit sobre des pages légales : titre, date, sections numérotées. */
export function PageLegale({ titre, intro, sections }: { titre: string[]; intro: string; sections: { t: string; c: React.ReactNode }[] }) {
  return (
    <>
      <EnTetePage fil={[{ label: titre.join(' ') }]} titre={titre} intro={intro} />
      <div className="conteneur pb-24">
        <div className="max-w-3xl border-t border-encre">
          {sections.map((s, i) => (
            <section key={s.t} className="grid gap-3 border-b border-filet py-8 md:grid-cols-[3rem_1fr]">
              <span className="chiffres text-sourdine">{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <h2 className="titre text-2xl">{s.t}</h2>
                <div className="mt-3 space-y-3 leading-relaxed text-sourdine">{s.c}</div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
