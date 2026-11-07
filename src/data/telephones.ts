import type { Budget, Capacite, Couleur, Telephone } from '@/types';
import VUES from './vues.json';

/**
 * CATALOGUE — iPhone et Samsung uniquement.
 *
 * - Prix de départ : RELEVÉS sur prince-cfa.com le 07/11/2026 (capacité la plus petite proposée).
 * - Autres capacités : prix `null` → « confirmé par un conseiller » (jamais inventé).
 * - Capacités, couleurs et caractéristiques : fiches officielles des fabricants.
 *   La disponibilité réelle (stock, état neuf / reconditionné) est confirmée sur WhatsApp.
 * - Photos : visuels officiels Apple Newsroom / Samsung Newsroom (voir public/images/iphone/SOURCES.txt).
 */

const cap = (depart: number | null, ...gos: string[]): Capacite[] => gos.map((go, i) => ({ go, prix: i === 0 ? depart : null }));
const img = (fichier: string, alt: string, fond: 'clair' | 'sombre' = 'clair') => ({ src: `/images/iphone/${fichier}.webp`, alt, fond });

const SIM_RECENT = ['1 SIM physique + eSIM', 'eSIM uniquement'];
const SIM_CLASSIQUE = ['1 SIM physique + eSIM'];

const c = (nom: string, hex: string): Couleur => ({ nom, hex });

export const telephones: Telephone[] = [
  {
    slug: 'iphone-18-pro-max', marque: 'Apple', nom: 'iPhone 18 Pro Max', annee: 2026, prixDepart: 1200000, vedette: true,
    accroche: 'Le plus grand, le plus endurant, le plus avancé.',
    atouts: ['Appareil photo à ouverture variable, une première sur iPhone', 'Puce A20 Pro, la plus puissante d’Apple', 'La plus grande autonomie jamais vue sur un iPhone'],
    capacites: cap(1200000, '256 Go', '512 Go', '1 To', '2 To'), sims: SIM_RECENT,
    couleurs: [c('Noir', '#2b2b2d'), c('Argent', '#e3e4e1'), c('Glacier', '#b9cfe0'), c('Bordeaux', '#5e1f2a')],
    specs: { ecran: 'Grand format Pro', puce: 'A20 Pro', photo: 'Triple 48 Mpx, ouverture variable', plus: 'Jusqu’à 2 To' },
    images: [img('iphone-18-pro-max', 'iPhone 18 Pro Max en noir, argent, glacier et bordeaux', 'sombre'), img('iphone-18-pro-max-2', 'Deux iPhone 18 Pro bordeaux, face et dos', 'sombre')],
    pourQui: 'Pour qui veut le meilleur sans compromis : photo, vidéo, autonomie et grand écran.',
  },
  {
    slug: 'iphone-18-pro', marque: 'Apple', nom: 'iPhone 18 Pro', annee: 2026, prixDepart: 925000,
    accroche: 'Toute la puissance du 18 Pro, dans un format qui tient en main.',
    atouts: ['Appareil photo à ouverture variable', 'Puce A20 Pro', 'Format plus compact que le Pro Max'],
    capacites: cap(925000, '256 Go', '512 Go', '1 To', '2 To'), sims: SIM_RECENT,
    couleurs: [c('Noir', '#2b2b2d'), c('Argent', '#e3e4e1'), c('Glacier', '#b9cfe0'), c('Bordeaux', '#5e1f2a')],
    specs: { puce: 'A20 Pro', photo: 'Triple 48 Mpx, ouverture variable', plus: 'Jusqu’à 2 To' },
    images: [img('iphone-18-pro-max-2', 'iPhone 18 Pro bordeaux, face et dos', 'sombre'), img('iphone-18-pro-max', 'Les quatre coloris de l’iPhone 18 Pro', 'sombre')],
    pourQui: 'Pour qui veut la dernière génération Pro dans une taille plus facile à porter.',
  },
  {
    slug: 'iphone-17-pro-max', marque: 'Apple', nom: 'iPhone 17 Pro Max', annee: 2025, prixDepart: 825000,
    accroche: 'Le grand écran Pro de 2025, zoom optique 8x.',
    atouts: ['Écran 6,9 pouces, 3 000 nits en plein soleil', 'Trois caméras 48 Mpx, zoom jusqu’à 8x', 'Châssis aluminium monobloc, très bonne autonomie'],
    capacites: cap(825000, '256 Go', '512 Go', '1 To', '2 To'), sims: SIM_RECENT,
    couleurs: [c('Argent', '#e3e4e1'), c('Orange cosmique', '#d9682b'), c('Bleu intense', '#2c3a55')],
    specs: { ecran: '6,9 pouces ProMotion 120 Hz', puce: 'A19 Pro', photo: 'Triple 48 Mpx, zoom 8x' },
    images: [img('iphone-17-pro', 'iPhone 17 Pro Max en bleu intense, orange cosmique et argent', 'sombre')],
    pourQui: 'Pour les créateurs de contenu et ceux qui passent leurs journées sur leur téléphone.',
  },
  {
    slug: 'iphone-17-pro', marque: 'Apple', nom: 'iPhone 17 Pro', annee: 2025, prixDepart: 725000, vedette: true,
    accroche: 'Puissance Pro, format 6,3 pouces.',
    atouts: ['Écran 6,3 pouces, 3 000 nits en plein soleil', 'Trois caméras 48 Mpx, zoom 8x', 'Recharge 50 % en 20 minutes'],
    capacites: cap(725000, '256 Go', '512 Go'), sims: SIM_RECENT,
    couleurs: [c('Argent', '#e3e4e1'), c('Orange cosmique', '#d9682b'), c('Bleu intense', '#2c3a55')],
    specs: { ecran: '6,3 pouces ProMotion 120 Hz', puce: 'A19 Pro', photo: 'Triple 48 Mpx, zoom 8x' },
    images: [img('iphone-17-pro', 'iPhone 17 Pro en bleu intense, orange cosmique et argent', 'sombre')],
    pourQui: 'Pour qui veut un vrai Pro récent sans aller jusqu’au prix du Pro Max.',
  },
  {
    slug: 'iphone-air', marque: 'Apple', nom: 'iPhone Air', annee: 2025, prixDepart: 510000,
    accroche: 'Le plus fin jamais fait : 5,6 mm.',
    atouts: ['5,6 mm d’épaisseur, très léger en poche', 'Puce A19 Pro des modèles Pro', 'Grand écran 6,5 pouces'],
    capacites: cap(510000, '256 Go', '512 Go', '1 To'), sims: ['eSIM uniquement'],
    couleurs: [c('Noir sidéral', '#2b2b2d'), c('Blanc nuage', '#f1f0ec'), c('Or clair', '#e8dcc0'), c('Bleu ciel', '#c9dcec')],
    specs: { ecran: '6,5 pouces ProMotion', puce: 'A19 Pro', photo: '48 Mpx' },
    images: [img('iphone-air', 'iPhone Air en bleu ciel, or clair, blanc nuage et noir sidéral'), img('iphone-air-2', 'Profil de l’iPhone Air, d’une finesse extrême')],
    pourQui: 'Pour qui veut un iPhone élégant et léger, et utilise déjà l’eSIM.',
  },
  {
    slug: 'iphone-16-pro-max', marque: 'Apple', nom: 'iPhone 16 Pro Max', annee: 2024, prixDepart: 500000, vedette: true,
    accroche: 'Le très grand écran Pro, à un prix plus accessible.',
    atouts: ['Écran 6,9 pouces, le plus grand de sa génération', 'Zoom optique 5x, vidéo 4K 120 i/s', 'Titane, solide et léger'],
    capacites: cap(500000, '256 Go', '512 Go', '1 To'), sims: SIM_CLASSIQUE,
    couleurs: [c('Titane noir', '#3a3a3c'), c('Titane blanc', '#e6e4df'), c('Titane naturel', '#bdb7aa'), c('Titane désert', '#bfa58a')],
    specs: { ecran: '6,9 pouces ProMotion', puce: 'A18 Pro', photo: '48 Mpx, zoom 5x' },
    images: [img('iphone-16-pro', 'iPhone 16 Pro Max en titane noir, naturel, blanc et désert', 'sombre'), img('iphone-16-pro-2', 'iPhone 16 Pro Max titane désert', 'sombre')],
    pourQui: 'Le meilleur rapport grand écran / prix de la gamme Pro.',
  },
  {
    slug: 'iphone-16-plus', marque: 'Apple', nom: 'iPhone 16 Plus', annee: 2024, prixDepart: 400000,
    accroche: 'Grand écran, grande autonomie, sans le prix d’un Pro.',
    atouts: ['Écran 6,7 pouces', 'Très bonne autonomie', 'Bouton Commande de l’appareil photo'],
    capacites: cap(400000, '128 Go', '256 Go', '512 Go'), sims: SIM_CLASSIQUE,
    couleurs: [c('Noir', '#2b2b2d'), c('Blanc', '#f1f0ec'), c('Rose', '#f2a6c4'), c('Sarcelle', '#8ec5bd'), c('Outremer', '#5b6fe0')],
    specs: { ecran: '6,7 pouces', puce: 'A18', photo: '48 Mpx' },
    images: [img('iphone-16', 'iPhone 16 Plus en noir, blanc, rose, sarcelle et outremer'), img('iphone-16-2', 'iPhone 16 Plus outremer')],
    pourQui: 'Pour regarder des vidéos, lire et jouer sur grand écran, toute la journée.',
  },
  {
    slug: 'iphone-16', marque: 'Apple', nom: 'iPhone 16', annee: 2024, prixDepart: 355000,
    accroche: 'L’iPhone récent le plus équilibré.',
    atouts: ['Puce A18, prête pour les dernières fonctions', 'Caméra 48 Mpx', 'Coloris vifs, dont l’outremer'],
    capacites: cap(355000, '128 Go', '256 Go', '512 Go'), sims: SIM_CLASSIQUE,
    couleurs: [c('Noir', '#2b2b2d'), c('Blanc', '#f1f0ec'), c('Rose', '#f2a6c4'), c('Sarcelle', '#8ec5bd'), c('Outremer', '#5b6fe0')],
    specs: { ecran: '6,1 pouces', puce: 'A18', photo: '48 Mpx' },
    images: [img('iphone-16-2', 'iPhone 16 outremer, face et dos'), img('iphone-16', 'Les cinq coloris de l’iPhone 16')],
    pourQui: 'Le choix raisonnable pour un iPhone récent qui durera des années.',
  },
  {
    slug: 'iphone-15-pro', marque: 'Apple', nom: 'iPhone 15 Pro', annee: 2023, prixDepart: 360000,
    accroche: 'Le premier Pro en titane, avec USB-C.',
    atouts: ['Titane léger et résistant', 'Port USB-C', 'Caméra principale 48 Mpx'],
    capacites: cap(360000, '128 Go', '256 Go', '512 Go', '1 To'), sims: SIM_CLASSIQUE,
    couleurs: [c('Titane naturel', '#bdb7aa'), c('Titane bleu', '#3f4a5c'), c('Titane blanc', '#e6e4df'), c('Titane noir', '#3a3a3c')],
    specs: { ecran: '6,1 pouces ProMotion', puce: 'A17 Pro', photo: 'Triple caméra 48 Mpx' },
    images: [img('iphone-15-pro', 'iPhone 15 Pro dans ses quatre finitions titane'), img('iphone-15-pro-2', 'iPhone 15 Pro titane naturel', 'sombre')],
    pourQui: 'Un vrai Pro à un prix déjà bien redescendu.',
  },
  {
    slug: 'iphone-14-pro', marque: 'Apple', nom: 'iPhone 14 Pro', annee: 2022, prixDepart: 265000,
    accroche: 'Dynamic Island et 48 Mpx, à moins de 300 000.',
    atouts: ['Dynamic Island', 'Caméra principale 48 Mpx', 'Écran toujours allumé'],
    capacites: cap(265000, '128 Go', '256 Go', '512 Go', '1 To'), sims: SIM_CLASSIQUE,
    couleurs: [c('Noir sidéral', '#2f2e33'), c('Argent', '#e3e4e1'), c('Or', '#efe1c6'), c('Violet intense', '#4f4357')],
    specs: { ecran: '6,1 pouces ProMotion', puce: 'A16 Bionic', photo: 'Triple caméra, 48 Mpx' },
    images: [img('iphone-14-pro', 'iPhone 14 Pro violet intense', 'sombre')],
    pourQui: 'Pour passer au Pro avec un budget maîtrisé.',
  },
  {
    slug: 'iphone-13-pro', marque: 'Apple', nom: 'iPhone 13 Pro', annee: 2021, prixDepart: 240000,
    accroche: 'L’écran 120 Hz et le triple appareil photo, à prix doux.',
    atouts: ['Écran ProMotion 120 Hz', 'Triple appareil photo avec téléobjectif', 'Acier inoxydable'],
    capacites: cap(240000, '128 Go', '256 Go', '512 Go', '1 To'), sims: SIM_CLASSIQUE,
    couleurs: [c('Graphite', '#4b4a48'), c('Or', '#f3e3c4'), c('Argent', '#e3e4e1'), c('Bleu alpin', '#a7c1d9'), c('Vert alpin', '#576856')],
    specs: { ecran: '6,1 pouces ProMotion', puce: 'A15 Bionic', photo: 'Triple caméra 12 Mpx' },
    images: [img('iphone-13-pro', 'iPhone 13 Pro graphite, or, argent et bleu alpin')],
    pourQui: 'Pour qui veut le confort d’un Pro en dépensant moins.',
  },
  {
    slug: 'iphone-13', marque: 'Apple', nom: 'iPhone 13', annee: 2021, prixDepart: 170000,
    accroche: 'Fiable, rapide, et toujours à jour.',
    atouts: ['Puce A15 Bionic toujours rapide', 'Bonne autonomie', 'Double appareil photo'],
    capacites: cap(170000, '128 Go', '256 Go', '512 Go'), sims: SIM_CLASSIQUE,
    couleurs: [c('Minuit', '#232a31'), c('Lumière stellaire', '#f2ece2'), c('Bleu', '#2f5a7a'), c('Rose', '#f6d4d0'), c('Rouge', '#b81e2a'), c('Vert', '#3f5a48')],
    specs: { ecran: '6,1 pouces', puce: 'A15 Bionic', photo: 'Double 12 Mpx' },
    images: [img('iphone-13', 'iPhone 13 en rouge, lumière stellaire, minuit, bleu et rose'), img('iphone-13-2', 'iPhone 13 rose')],
    pourQui: 'Le meilleur rapport qualité-prix pour un premier iPhone.',
  },
  {
    slug: 'iphone-12-pro', marque: 'Apple', nom: 'iPhone 12 Pro', annee: 2020, prixDepart: 165000,
    accroche: 'Le design à bords plats, version Pro.',
    atouts: ['Triple appareil photo', 'Acier inoxydable', 'Compatible MagSafe'],
    capacites: cap(165000, '128 Go', '256 Go', '512 Go'), sims: SIM_CLASSIQUE,
    couleurs: [c('Graphite', '#4b4a48'), c('Argent', '#e3e4e1'), c('Or', '#f3e3c4'), c('Bleu pacifique', '#2f4c63')],
    specs: { ecran: '6,1 pouces OLED', puce: 'A14 Bionic', photo: 'Triple caméra 12 Mpx' },
    images: [img('iphone-12-pro', 'iPhone 12 Pro bleu pacifique')],
    pourQui: 'Pour un Pro au prix d’un modèle d’entrée.',
  },
  {
    slug: 'iphone-12', marque: 'Apple', nom: 'iPhone 12', annee: 2020, prixDepart: 140000,
    accroche: 'Écran OLED et bords plats, à petit prix.',
    atouts: ['Écran OLED Super Retina', 'Bords plats, compatible MagSafe', 'Double appareil photo'],
    capacites: cap(140000, '64 Go', '128 Go', '256 Go'), sims: SIM_CLASSIQUE,
    couleurs: [c('Noir', '#2b2b2d'), c('Blanc', '#f1f0ec'), c('Bleu', '#2b4a74'), c('Vert', '#cfe3cf'), c('Mauve', '#cfc4e3'), c('Rouge', '#b81e2a')],
    specs: { ecran: '6,1 pouces OLED', puce: 'A14 Bionic', photo: 'Double 12 Mpx' },
    images: [img('iphone-12', 'iPhone 12 bleu'), img('iphone-12-2', 'iPhone 12, face et dos')],
    pourQui: 'Pour un bel iPhone OLED à moins de 150 000.',
  },
  {
    slug: 'iphone-11', marque: 'Apple', nom: 'iPhone 11', annee: 2019, prixDepart: 120000,
    accroche: 'Le classique qui fait encore très bien le travail.',
    atouts: ['Double appareil photo avec ultra grand-angle', 'Bonne autonomie', 'Six coloris'],
    capacites: cap(120000, '64 Go', '128 Go', '256 Go'), sims: SIM_CLASSIQUE,
    couleurs: [c('Noir', '#2b2b2d'), c('Blanc', '#f1f0ec'), c('Vert', '#cfe3cf'), c('Jaune', '#f6e27e'), c('Mauve', '#cfc4e3'), c('Rouge', '#b81e2a')],
    specs: { ecran: '6,1 pouces Liquid Retina', puce: 'A13 Bionic', photo: 'Double 12 Mpx' },
    images: [img('iphone-11', 'iPhone 11 dans ses six coloris'), img('iphone-11-2', 'iPhone 11 mauve et ses coloris en éventail')],
    pourQui: 'Pour un iPhone fiable à petit budget.',
  },
  {
    slug: 'iphone-xr', marque: 'Apple', nom: 'iPhone XR', annee: 2018, prixDepart: 105000,
    accroche: 'L’entrée dans l’univers iPhone avec Face ID.',
    atouts: ['Face ID', 'Grand écran 6,1 pouces', 'Six coloris'],
    capacites: cap(105000, '64 Go', '128 Go', '256 Go'), sims: SIM_CLASSIQUE,
    couleurs: [c('Noir', '#2b2b2d'), c('Blanc', '#f1f0ec'), c('Bleu', '#6aa9d8'), c('Jaune', '#f6d65a'), c('Corail', '#f2836b'), c('Rouge', '#b81e2a')],
    specs: { ecran: '6,1 pouces Liquid Retina', puce: 'A12 Bionic', photo: '12 Mpx' },
    images: [img('iphone-xr', 'iPhone XR bleu, vu de dos'), img('iphone-xr-2', 'Deux iPhone XR blancs')],
    pourQui: 'Pour un premier iPhone grand écran à petit prix.',
  },
  {
    slug: 'iphone-x', marque: 'Apple', nom: 'iPhone X', annee: 2017, prixDepart: null, surDemande: true,
    accroche: 'Le premier iPhone sans bouton d’accueil.',
    atouts: ['Écran OLED 5,8 pouces', 'Face ID', 'Format compact'],
    capacites: cap(null, '64 Go', '256 Go'), sims: ['1 SIM physique'],
    couleurs: [c('Gris sidéral', '#4a4a4c'), c('Argent', '#e3e4e1')],
    specs: { ecran: '5,8 pouces OLED', puce: 'A11 Bionic', photo: 'Double 12 Mpx' },
    images: [img('iphone-x', 'iPhone X, face et dos en verre')],
    pourQui: 'Sur demande : disponibilité selon arrivage.',
  },
  {
    slug: 'iphone-se', marque: 'Apple', nom: 'iPhone SE', annee: 2022, prixDepart: 85000,
    accroche: 'Compact, avec bouton d’accueil et Touch ID.',
    atouts: ['Puce A15 Bionic, très rapide', 'Touch ID et bouton d’accueil', 'Format compact 4,7 pouces'],
    capacites: cap(85000, '64 Go', '128 Go', '256 Go'), sims: SIM_CLASSIQUE,
    couleurs: [c('Minuit', '#232a31'), c('Lumière stellaire', '#f2ece2'), c('Rouge', '#b81e2a')],
    specs: { ecran: '4,7 pouces Retina HD', puce: 'A15 Bionic', photo: '12 Mpx' },
    images: [img('iphone-se', 'Trois iPhone SE'), img('iphone-se-2', 'Les coloris de l’iPhone SE')],
    pourQui: 'Le moins cher de la gamme, idéal pour un parent ou un premier téléphone.',
  },
  {
    slug: 'iphone-7-plus', marque: 'Apple', nom: 'iPhone 7 Plus', annee: 2016, prixDepart: null, surDemande: true,
    accroche: 'Le grand écran avec double caméra, sur demande.',
    atouts: ['Écran 5,5 pouces', 'Double appareil photo', 'Touch ID'],
    capacites: cap(null, '32 Go', '128 Go', '256 Go'), sims: ['1 SIM physique'],
    couleurs: [c('Noir de jais', '#111'), c('Noir', '#2b2b2d'), c('Argent', '#e3e4e1'), c('Or', '#efe1c6'), c('Or rose', '#efcfc6')],
    specs: { ecran: '5,5 pouces Retina HD', puce: 'A10 Fusion', photo: 'Double 12 Mpx' },
    images: [img('iphone-7-plus', 'iPhone 7 Plus dans ses coloris')],
    pourQui: 'Sur demande : disponibilité selon arrivage.',
  },
  {
    slug: 'samsung-galaxy-s22-ultra', marque: 'Samsung', nom: 'Galaxy S22 Ultra', annee: 2022, prixDepart: 235000, vedette: true,
    accroche: 'Le Samsung à stylet intégré, zoom 100x.',
    atouts: ['S Pen intégré', 'Capteur 108 Mpx, zoom jusqu’à 100x', 'Écran 6,8 pouces 120 Hz'],
    // Les deux prix sont RELEVÉS sur le site actuel.
    capacites: [{ go: '128 Go', prix: 235000 }, { go: '256 Go', prix: 260000 }], sims: ['Double SIM'],
    couleurs: [c('Noir fantôme', '#2b2b2d'), c('Blanc fantôme', '#f1f0ec'), c('Vert', '#3d4f45'), c('Bordeaux', '#6b2232')],
    specs: { ecran: '6,8 pouces Dynamic AMOLED 120 Hz', puce: 'Processeur 4 nm haut de gamme', photo: '108 Mpx, zoom 100x' },
    images: [{ src: '/images/samsung-s22-ultra.webp', alt: 'Samsung Galaxy S22 Ultra bordeaux avec son S Pen', fond: 'clair' }],
    pourQui: 'Pour prendre des notes au stylet, photographier de loin et travailler sur grand écran.',
  },
];

/**
 * RENDUS PAR FINITION (Apple Store officiel) : dossier, clés de couleur dans le même ordre que
 * `couleurs`, et nombre de vues disponibles. Chaque couleur affiche SA vraie photo.
 */
const FINITIONS: Record<string, { dossier: string; cles: string[]; vues?: number }> = {
  'iphone-18-pro-max': { dossier: 'iphone-18-pro', cles: ['black', 'silver', 'glacier', 'burgundy'], vues: 3 },
  'iphone-18-pro': { dossier: 'iphone-18-pro', cles: ['black', 'silver', 'glacier', 'burgundy'], vues: 3 },
  'iphone-17-pro-max': { dossier: 'iphone-17-pro', cles: ['silver', 'cosmicorange', 'deepblue'], vues: 3 },
  'iphone-17-pro': { dossier: 'iphone-17-pro', cles: ['silver', 'cosmicorange', 'deepblue'], vues: 3 },
  'iphone-air': { dossier: 'iphone-air', cles: ['spaceblack', 'cloudwhite', 'lightgold', 'skyblue'], vues: 3 },
  'iphone-16-pro-max': { dossier: 'iphone-16-pro-max', cles: ['blacktitanium', 'whitetitanium', 'naturaltitanium', 'deserttitanium'] },
  'iphone-16-plus': { dossier: 'iphone-16-plus', cles: ['black', 'white', 'pink', 'teal', 'ultramarine'] },
  'iphone-16': { dossier: 'iphone-16', cles: ['black', 'white', 'pink', 'teal', 'ultramarine'] },
  'iphone-15-pro': { dossier: 'iphone-15-pro', cles: ['naturaltitanium', 'bluetitanium', 'whitetitanium', 'blacktitanium'] },
  'iphone-14-pro': { dossier: 'iphone-14-pro', cles: ['spaceblack', 'silver', 'gold', 'deeppurple'] },
  'iphone-13-pro': { dossier: 'iphone-13-pro', cles: ['graphite', 'gold', 'silver', 'blue', 'green'] },
  'iphone-13': { dossier: 'iphone-13', cles: ['midnight', 'starlight', 'blue', 'pink', 'product-red', 'green'] },
  'iphone-12-pro': { dossier: 'iphone-12-pro', cles: ['graphite', 'silver', 'gold', 'blue'] },
  'iphone-12': { dossier: 'iphone-12', cles: ['black', 'white', 'blue', 'green', 'purple', 'red'] },
  'iphone-11': { dossier: 'iphone-11', cles: ['black', 'white', 'green', 'yellow', 'purple', 'red'] },
  'iphone-xr': { dossier: 'iphone-xr', cles: ['black', 'white', 'blue', 'yellow', 'coral', 'red'] },
  'iphone-x': { dossier: 'iphone-x', cles: ['spacegray', 'silver'] },
  'iphone-se': { dossier: 'iphone-se', cles: ['midnight', 'starlight', 'red'] },
  'iphone-7-plus': { dossier: 'iphone-7-plus', cles: ['jetblack', 'black', 'silver', 'gold', 'rosegold'] },
};
for (const t of telephones) {
  const f = FINITIONS[t.slug];
  if (!f) continue;
  t.couleurs = t.couleurs.map((co, i) => {
    const cle = `${f.dossier}/${f.cles[i]}`;
    const base = `/images/finitions/${cle}.webp`;
    // Seules les vues réellement présentes et proprement détourées (manifeste généré) sont proposées.
    return { ...co, image: base, vues: (VUES as Record<string, string[]>)[cle] ?? [base] };
  });
}
// Samsung : un seul visuel officiel → le coloris est confirmé par le conseiller (pas de faux changement d'image).
for (const t of telephones) if (t.marque === 'Samsung') t.couleurs = [];

/** Visuel « produit seul » de la première finition (cartes, frise, héros). */
export const visuel = (t: Telephone) => t.couleurs[0]?.image ?? t.images[0].src;

export const iphones = telephones.filter((t) => t.marque === 'Apple');
export const samsungs = telephones.filter((t) => t.marque === 'Samsung');
export const getTelephone = (slug: string) => telephones.find((t) => t.slug === slug);

/** Générations pour la frise : de la plus récente à la plus ancienne. */
export function parGeneration(liste = iphones) {
  const annees = [...new Set(liste.map((t) => t.annee))].sort((a, b) => b - a);
  return annees.map((annee) => ({ annee, modeles: liste.filter((t) => t.annee === annee).sort((a, b) => (b.prixDepart ?? 0) - (a.prixDepart ?? 0)) }));
}

export const BUDGETS: { id: Budget; label: string; detail: string; min: number; max: number }[] = [
  { id: 'moins-150', label: 'Moins de 150 000', detail: 'Pour découvrir l’iPhone', min: 0, max: 150000 },
  { id: '150-300', label: '150 000 à 300 000', detail: 'Le bon équilibre', min: 150000, max: 300000 },
  { id: '300-600', label: '300 000 à 600 000', detail: 'Récent et puissant', min: 300000, max: 600000 },
  { id: 'plus-600', label: 'Plus de 600 000', detail: 'Le meilleur du moment', min: 600000, max: Infinity },
];

export const dansBudget = (b: Budget, liste = telephones) => {
  const t = BUDGETS.find((x) => x.id === b)!;
  return liste.filter((p) => p.prixDepart !== null && p.prixDepart >= t.min && p.prixDepart < t.max).sort((a, b) => (b.prixDepart ?? 0) - (a.prixDepart ?? 0));
};

export const similaires = (t: Telephone, n = 3) =>
  telephones.filter((x) => x.slug !== t.slug && x.prixDepart !== null)
    .sort((a, b) => Math.abs((a.prixDepart ?? 0) - (t.prixDepart ?? 0)) - Math.abs((b.prixDepart ?? 0) - (t.prixDepart ?? 0)))
    .slice(0, n);
