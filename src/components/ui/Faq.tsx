import { Plus } from 'lucide-react';

/** Questions fréquentes : HTML natif (details/summary), accessible au clavier sans JavaScript. */
export function Faq({ titre = 'Questions fréquentes', questions }: { titre?: string; questions: { q: string; r: string }[] }) {
  return (
    <section aria-label={titre} className="grid gap-10 lg:grid-cols-12">
      <h2 className="titre text-[clamp(2.2rem,3.6vw,3.2rem)] leading-tight lg:col-span-4">{titre}</h2>
      <div className="border-t border-encre lg:col-span-7 lg:col-start-6">
        {questions.map(({ q, r }) => (
          <details key={q} className="group border-b border-filet">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden">
              {q}
              <Plus size={18} strokeWidth={1.5} aria-hidden className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="max-w-2xl pb-6 leading-relaxed text-sourdine">{r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
