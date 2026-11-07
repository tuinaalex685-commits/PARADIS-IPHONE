/**
 * CONSENTEMENT AUX COOKIES ET TRACEURS
 *
 * - « nécessaires » : toujours actifs (sélection de produits, mémorisation du choix lui-même).
 * - « mesure » : mesure d'audience anonyme, DÉSACTIVÉE tant que le visiteur ne l'a pas acceptée.
 *
 * Le choix est gardé 6 mois puis redemandé. Augmenter VERSION quand un nouvel outil (Google
 * Analytics, Meta Pixel…) est ajouté : tous les visiteurs seront de nouveau interrogés.
 */
export type Choix = { mesure: boolean; date: string; version: number };

const CLE = 'paradis:consentement';
const VERSION = 1;
const DUREE_MS = 1000 * 60 * 60 * 24 * 182; // ~6 mois
export const EVT_CHANGEMENT = 'paradis:consentement';
export const EVT_OUVRIR = 'paradis:ouvrir-cookies';

export function lireChoix(): Choix | null {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const c = JSON.parse(brut) as Choix;
    if (c.version !== VERSION || Date.now() - new Date(c.date).getTime() > DUREE_MS) return null;
    return c;
  } catch {
    return null;
  }
}

export function enregistrerChoix(mesure: boolean) {
  const c: Choix = { mesure, date: new Date().toISOString(), version: VERSION };
  try { localStorage.setItem(CLE, JSON.stringify(c)); } catch { /* navigation privée : le choix vaut pour la visite */ }
  window.dispatchEvent(new CustomEvent(EVT_CHANGEMENT, { detail: c }));
}

/** Rouvre le panneau de préférences (lien « Gérer mes cookies »). */
export function ouvrirPreferencesCookies() {
  window.dispatchEvent(new Event(EVT_OUVRIR));
}

export const mesureAutorisee = () => lireChoix()?.mesure === true;
