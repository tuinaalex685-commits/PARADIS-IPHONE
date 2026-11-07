'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Phone, MapPin, Clock } from 'lucide-react';
import { navigation, site } from '@/data/site';
import { useBoutique } from '@/components/providers/Boutique';
import { IconeWhatsApp } from '@/components/ui/BoutonWhatsApp';
import { LienGererCookies } from '@/components/ui/BandeauCookies';
import { suivre } from '@/lib/analytics';
import { Logo } from './Logo';

/** Pied de page noir : dernier appel (disque bleu magnétique), coordonnées réelles, nom géant. */
export function PiedDePage() {
  const { preparerWhatsApp } = useBoutique();
  const reduit = useReducedMotion();
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18 }); const y = useSpring(my, { stiffness: 200, damping: 18 });
  const aimant = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduit || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.3); my.set((e.clientY - r.top - r.height / 2) * 0.3);
  };

  return (
    <footer className="sur-sombre relative mt-24 overflow-hidden rounded-t-[2rem] bg-encre pb-32 text-white md:pb-10">
      <div className="conteneur pt-20 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="titre text-[clamp(2.6rem,6vw,5.6rem)]">Votre prochain téléphone vous attend à Koulouba.</h2>
            <p className="mt-6 max-w-lg text-[1.05rem] text-white/70">Choisissez-le ici, configurez-le, et la boutique vous confirme le prix et la disponibilité sur WhatsApp.</p>
          </div>
          <div className="flex lg:col-span-4 lg:justify-end">
            <motion.a href="/iphone" onPointerMove={aimant} onPointerLeave={() => { mx.set(0); my.set(0); }} style={{ x, y }}
              className="group grid h-44 w-44 place-items-center rounded-full bg-accent text-center text-white transition-colors hover:bg-accent-fonce lg:h-52 lg:w-52">
              <span className="flex flex-col items-center gap-2 text-[1.05rem] font-semibold">
                <ArrowUpRight size={26} className="transition-transform duration-300 group-hover:rotate-45" />Voir les<br />iPhone
              </span>
            </motion.a>
          </div>
        </div>

        <div className="mt-20 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo clair />
            <p className="mt-5 max-w-xs text-white/60">iPhone et Samsung à Ouagadougou. Livraison partout au Burkina ou retrait en boutique.</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.reseaux.map((r) => (
                <li key={r.nom}><a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-[0.88rem] hover:border-accent-vif hover:text-accent-vif">{r.nom}</a></li>
              ))}
            </ul>
          </div>
          <ul className="space-y-4 lg:col-span-4">
            <li>
              <button onClick={() => { suivre('whatsapp_click', { source: 'pied_de_page' }); preparerWhatsApp('Bonjour Paradis des téléphones, ', 'Votre message est prêt'); }}
                className="flex items-center gap-3 text-left hover:text-accent-vif"><IconeWhatsApp size={20} /> WhatsApp {site.whatsappAffiche}</button>
            </li>
            {site.telephones.map((t) => (
              <li key={t}><a href={`tel:${t.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-accent-vif"><Phone size={19} strokeWidth={1.6} /> {t}</a></li>
            ))}
            <li><a href={site.itineraire} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-accent-vif"><MapPin size={19} strokeWidth={1.6} /> {site.adresse} · itinéraire</a></li>
            <li className="flex items-start gap-3 text-white/70"><Clock size={19} strokeWidth={1.6} className="mt-1" />
              <span>{site.horaires.map((h) => <span key={h.jours} className="block">{h.jours} : {h.heures}</span>)}</span></li>
          </ul>
          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-8 text-[0.95rem] lg:col-span-4">
            <ul className="space-y-3">
              {navigation.map((n) => <li key={n.href}><Link href={n.href} className="text-white/70 hover:text-white">{n.label}</Link></li>)}
              <li><Link href="/commander" className="text-white/70 hover:text-white">Commander</Link></li>
            </ul>
            <ul className="space-y-3">
              <li><Link href="/mentions-legales" className="text-white/70 hover:text-white">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="text-white/70 hover:text-white">Confidentialité</Link></li>
              <li><Link href="/cookies" className="text-white/70 hover:text-white">Cookies</Link></li>
              <li><LienGererCookies className="text-left text-white/70 hover:text-white" /></li>
            </ul>
          </nav>
        </div>
      </div>
      <p aria-hidden className="titre pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[17vw] leading-[0.8] text-white/[0.06]">Paradis</p>
      <p className="conteneur mt-6 text-[0.8rem] text-white/45">© 2026 {site.nom}. Prix relevés le {site.releve}, confirmés par la boutique avant toute vente. Visuels produits : Apple et Samsung.</p>
    </footer>
  );
}
