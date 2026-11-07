import { site } from '@/data/site';

/** Lignes d'un message WhatsApp, assemblées proprement (une ligne vide entre les blocs). */
export function composerMessage(blocs: (string | null | undefined | false)[]): string {
  return blocs.filter(Boolean).join('\n').trim();
}

/** Lien wa.me, ou null tant que Das'hair n'a pas communiqué son numéro (jamais de numéro inventé). */
export function lienWhatsApp(message: string): string | null {
  const numero = site.whatsapp?.replace(/\D/g, '');
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

/** Nettoie une saisie avant de l'insérer dans un message (longueur bornée, sans caractères de contrôle). */
export function propre(valeur: unknown, max = 400): string {
  return String(valeur ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}
