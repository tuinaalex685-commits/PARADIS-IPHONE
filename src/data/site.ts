/**
 * CONFIGURATION CENTRALE — Paradis des téléphones.
 * Coordonnées, horaires et réseaux relevés sur le site actuel (prince-cfa.com) le 07/11/2026.
 */
export const site = {
  nom: 'Paradis des téléphones',
  signature: 'iPhone & Samsung à Ouagadougou',
  url: 'https://paradis-telephones.vercel.app', // À REMPLACER par le domaine réel
  description:
    "Paradis des téléphones, à Koulouba (Ouagadougou) : iPhone de l'iPhone 7 Plus à l'iPhone 18 Pro Max et Samsung Galaxy, prix affichés, commande en un message WhatsApp, livraison partout au Burkina ou retrait en boutique.",

  /** WhatsApp au format international sans « + » ni espaces. */
  whatsapp: '22657138126' as string | null, // fourni par l'utilisateur le 07/11
  whatsappAffiche: '+226 57 13 81 26',
  telephones: ['+226 64 76 91 30', '+226 77 14 67 13'],
  email: null as string | null,
  adresse: 'Koulouba, Ouagadougou',
  itineraire: 'https://maps.app.goo.gl/mwcY1V9BxqgHXA1K6',
  horaires: [
    { jours: 'Lundi – samedi', heures: '9 h – 19 h' },
    { jours: 'Dimanche', heures: '10 h – 16 h' },
  ],
  reseaux: [
    { nom: 'TikTok', url: 'https://www.tiktok.com/@princecfa01' },
    { nom: 'Instagram', url: 'https://www.instagram.com/le_prince_cfa_1' },
    { nom: 'YouTube', url: 'https://youtube.com/@princecfamalldesiphones' },
    { nom: 'Facebook', url: 'https://www.facebook.com/share/1BzjKXdeV3/' },
  ],

  devise: 'FCFA',
  /** Date du relevé des prix sur le site actuel : affichée avec les prix. */
  releve: '7 novembre 2026',
  /** Prototype : bandeau de démonstration visible tant que c'est vrai. */
  demonstration: true,
} as const;

export const navigation = [
  { href: '/iphone', label: 'iPhone' },
  { href: '/samsung', label: 'Samsung' },
  { href: '/trouver', label: 'Trouver le mien' },
  { href: '/boutique', label: 'La boutique' },
] as const;

export function prixFcfa(montant: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(montant)} ${site.devise}`;
}

export function chiffre(montant: number): string {
  return new Intl.NumberFormat('fr-FR').format(montant);
}
