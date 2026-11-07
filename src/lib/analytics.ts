/**
 * MESURE DES CONVERSIONS — une seule fonction, aucun outil installé.
 *
 * Les événements sont poussés dans `window.dataLayer` (format compatible Google Tag Manager,
 * Plausible ou Matomo via un connecteur). Tant qu'aucun outil n'est configuré, rien ne quitte
 * le navigateur. Aucune donnée personnelle (nom, téléphone, message) n'est jamais transmise :
 * uniquement le type d'action et l'élément concerné (identifiant de produit, de soin…).
 */
import { mesureAutorisee } from '@/lib/consentement';

export type EvenementConversion =
  | 'view_shop' | 'view_product' | 'product_contact_click' | 'product_order_click'
  | 'view_service' | 'appointment_click'
  | 'view_training' | 'training_contact_click' | 'training_registration_click'
  | 'whatsapp_click' | 'contact_form_submit'
  | 'view_phone' | 'configurator_change' | 'order_start' | 'order_submit' | 'finder_complete' | 'compare_open' | 'catalog_filter';

type Proprietes = { item?: string; categorie?: string; source?: string; quantite?: number };

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}

export function suivre(evenement: EvenementConversion, proprietes: Proprietes = {}) {
  if (typeof window === 'undefined') return;
  // Rien n'est mesuré sans l'accord explicite du visiteur (bandeau cookies).
  if (!mesureAutorisee()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: evenement, ...proprietes });
  if (process.env.NODE_ENV !== 'production') console.debug('[conversion]', evenement, proprietes);
}
