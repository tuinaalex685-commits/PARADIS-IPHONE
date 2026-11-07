'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu, X, Smartphone, Compass, MapPin } from 'lucide-react';
import { navigation, site } from '@/data/site';
import { useBoutique } from '@/components/providers/Boutique';
import { bloquerDefilement } from '@/components/providers/DefilementDoux';
import { IconeWhatsApp } from '@/components/ui/BoutonWhatsApp';
import { suivre } from '@/lib/analytics';
import { Logo } from './Logo';

const MESSAGE = 'Bonjour Paradis des téléphones, je cherche un téléphone. Pouvez-vous me conseiller ?';

/**
 * En-tête adapté à chaque appareil :
 * - ordinateur : navigation centrale en pilule ; se replie quand on descend, revient à la remontée ;
 * - tablette : navigation en ligne, pleine largeur, pas de barre basse (l'écran est assez grand) ;
 * - téléphone : en haut le logo et le menu ; en bas une barre d'actions au pouce
 *   (masquée sur la fiche produit, qui a sa propre barre « prix + commander »).
 */
export function EnTete() {
  const chemin = usePathname();
  const [menu, setMenu] = useState(false);
  const [cache, setCache] = useState(false);
  const [defile, setDefile] = useState(false);
  const { preparerWhatsApp } = useBoutique();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const avant = scrollY.getPrevious() ?? 0;
    setDefile(y > 24);
    setCache(y > 320 && y > avant + 2);
  });
  useEffect(() => { bloquerDefilement(menu); }, [menu]);
  useEffect(() => { setMenu(false); }, [chemin]);

  const whatsapp = (source: string) => { suivre('whatsapp_click', { source }); preparerWhatsApp(MESSAGE, 'Votre message est prêt'); };
  const surFiche = chemin.startsWith('/telephone/') || chemin.startsWith('/commander');

  return (
    <>
      <motion.header animate={{ y: cache && !menu ? '-120%' : '0%' }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4">
        <div className={`conteneur flex h-14 items-center justify-between gap-4 transition-[background-color,box-shadow,border-radius] duration-300 md:h-16 ${defile ? 'bg-fond/88 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)] backdrop-blur-md max-md:rounded-none md:mx-auto md:max-w-[88rem] md:rounded-full' : ''}`}>
          <Logo />

          {/* Ordinateur : pilule centrale qui se densifie une fois le héros passé */}
          <nav aria-label="Navigation principale" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <ul className={`flex items-center gap-1 rounded-full p-1.5 transition-[background-color,box-shadow] duration-300 ${defile ? 'bg-encre text-white shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)]' : 'bg-surface/80 text-encre ring-1 ring-filet backdrop-blur'}`}>
              {navigation.map((n) => {
                const actif = chemin.startsWith(n.href);
                return (
                  <li key={n.href} className="relative">
                    {actif && <motion.span layoutId="nav-actif" className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <Link href={n.href} aria-current={actif ? 'page' : undefined}
                      className={`relative block rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors ${actif ? 'text-white' : defile ? 'hover:bg-white/10' : 'hover:bg-fond-2'}`}>
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Tablette : navigation en ligne */}
          <nav aria-label="Navigation principale" className="hidden md:block lg:hidden">
            <ul className="flex items-center gap-5 text-[0.92rem] font-medium">
              {navigation.map((n) => (
                <li key={n.href}><Link href={n.href} className={`underline-offset-[6px] ${chemin.startsWith(n.href) ? 'underline decoration-accent decoration-2' : 'hover:underline'}`}>{n.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => whatsapp('en_tete')}
              className="hidden h-11 items-center gap-2.5 rounded-full bg-encre pl-4 pr-1.5 text-[0.88rem] font-semibold text-white transition-colors hover:bg-action-fonce lg:inline-flex">
              Conseil WhatsApp
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-white"><IconeWhatsApp size={17} /></span>
            </button>
            <button onClick={() => setMenu(true)} aria-label="Ouvrir le menu" aria-expanded={menu}
              className="grid h-11 w-11 place-items-center rounded-full bg-encre text-white md:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Téléphone : barre d'actions au pouce */}
      {!surFiche && (
        <nav aria-label="Actions rapides" className="bas-sur fixed inset-x-3 bottom-0 z-50 md:hidden">
          <ul className="mx-auto flex max-w-md items-center justify-between rounded-full bg-encre/95 p-1.5 text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur">
            {[
              { href: '/iphone', label: 'iPhone', Icone: Smartphone },
              { href: '/trouver', label: 'Trouver', Icone: Compass },
            ].map(({ href, label, Icone }) => (
              <li key={href} className="flex-1">
                <Link href={href} aria-current={chemin.startsWith(href) ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 rounded-full py-2 text-[0.7rem] font-medium ${chemin.startsWith(href) ? 'text-accent-vif' : 'text-white/75'}`}>
                  <Icone size={19} strokeWidth={1.7} />{label}
                </Link>
              </li>
            ))}
            <li>
              <button onClick={() => whatsapp('barre_mobile')} aria-label="Demander conseil sur WhatsApp"
                className="mx-1 grid h-14 w-14 place-items-center rounded-full bg-accent text-white active:scale-95"><IconeWhatsApp size={24} /></button>
            </li>
            <li className="flex-1">
              <Link href="/boutique" className={`flex flex-col items-center gap-0.5 rounded-full py-2 text-[0.7rem] font-medium ${chemin.startsWith('/boutique') ? 'text-accent-vif' : 'text-white/75'}`}>
                <MapPin size={19} strokeWidth={1.7} />Boutique
              </Link>
            </li>
            <li className="flex-1">
              <button onClick={() => setMenu(true)} className="flex w-full flex-col items-center gap-0.5 rounded-full py-2 text-[0.7rem] font-medium text-white/75">
                <Menu size={19} strokeWidth={1.7} />Menu
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Menu plein écran (téléphone) */}
      <AnimatePresence>
        {menu && (
          <motion.div role="dialog" aria-modal="true" aria-label="Menu" className="sur-sombre fixed inset-0 z-[60] flex flex-col bg-encre text-white"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }} animate={{ clipPath: 'circle(150% at 92% 4%)' }} exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.15, 1] }}>
            <div className="conteneur flex h-[4.5rem] items-center justify-between pt-3">
              <Logo clair onClick={() => setMenu(false)} />
              <button onClick={() => setMenu(false)} aria-label="Fermer le menu" className="grid h-11 w-11 place-items-center rounded-full bg-white/10"><X size={20} /></button>
            </div>
            <nav className="conteneur mt-8 flex-1">
              <ul>
                {[{ href: '/', label: 'Accueil' }, ...navigation, { href: '/commander', label: 'Commander' }].map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.05, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                    className="border-b border-white/10">
                    <Link href={n.href} className="titre flex items-center justify-between py-4 text-[2.1rem]">
                      {n.label}{chemin === n.href && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="conteneur bas-sur space-y-1 pb-6 text-[0.95rem] text-white/70">
              <p>{site.adresse}</p>
              {site.horaires.map((h) => <p key={h.jours}>{h.jours} : {h.heures}</p>)}
              <button onClick={() => whatsapp('menu')} className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-5 font-semibold text-white">
                <IconeWhatsApp size={18} /> Écrire au {site.whatsappAffiche}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
