export type ImageRef = { src: string; alt: string; fond?: 'clair' | 'sombre' };

export type Marque = 'Apple' | 'Samsung';

/** Tranche de budget utilisée par le sélecteur « Trouvez votre iPhone ». */
export type Budget = 'moins-150' | '150-300' | '300-600' | 'plus-600';

/** Une finition : son nom, sa pastille, et ses rendus officiels (vue principale + vues d'angle). */
export type Couleur = { nom: string; hex: string; image?: string; vues?: string[] };

export type Capacite = {
  /** Libellé affiché : « 128 Go », « 1 To »… */
  go: string;
  /** Prix RELEVÉ sur le site actuel quand il est connu ; sinon `null` = confirmé par un conseiller. */
  prix: number | null;
};

export interface Telephone {
  slug: string;
  marque: Marque;
  nom: string;
  /** Année de sortie (sert au classement par génération). */
  annee: number;
  /** Prix de départ relevé sur prince-cfa.com le 07/11/2026 ; `null` = prix sur demande. */
  prixDepart: number | null;
  /** Phrase d'accroche courte, orientée usage. */
  accroche: string;
  /** Trois arguments concrets, du plus parlant au moins parlant. */
  atouts: [string, string, string];
  capacites: Capacite[];
  sims: string[];
  couleurs: Couleur[];
  specs: { ecran?: string; puce: string; photo: string; plus?: string };
  images: ImageRef[];
  /** Pour qui ce modèle est le bon choix (aide à la décision). */
  pourQui: string;
  /** Modèle mis en avant (héros, sélection). */
  vedette?: boolean;
  /** Absent du catalogue en ligne actuel : disponible sur demande uniquement. */
  surDemande?: boolean;
}
