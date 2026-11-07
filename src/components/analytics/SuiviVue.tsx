'use client';

import { useEffect } from 'react';
import { suivre, type EvenementConversion } from '@/lib/analytics';

/** Enregistre une consultation de page (une fois par affichage). */
export function SuiviVue({ evenement, item, categorie }: { evenement: EvenementConversion; item?: string; categorie?: string }) {
  useEffect(() => { suivre(evenement, { item, categorie }); }, [evenement, item, categorie]);
  return null;
}
