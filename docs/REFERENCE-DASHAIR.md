# Fiche de référence — Das'hair (das-hair.vercel.app)

Analyse du 07/11/2026. Deux sources croisées :
- **Observé** : site en ligne, navigateur Playwright 1440 × 900, défilement à la molette, mesures des styles calculés et captures.
- **Code** : paramètres exacts lus dans le code source (durées, courbes, valeurs).

Tout ce qui n'a pas été observé en direct est marqué *(code seul)*.

## 1. Principes de composition
- **Fond papier chaud, jamais blanc pur** (#f5f2ec), un seul accent vif (indigo) utilisé rarement, du noir chaud pour les panneaux.
- **Titres très grands et serrés** (−4,5 % d'interlettrage, interligne 0,9), avec **un ou deux mots en italique serif colorés** dans chaque grand titre. C'est la signature de la marque.
- **Asymétrie éditoriale** : le héros oppose un texte à gauche (5 colonnes) et une image en arche à droite ; les sections alternent largeur pleine et grille 12 colonnes décalée.
- **Panneaux sombres arrondis** (rayon 2 rem) posés sur le fond clair, avec une marge latérale : ils semblent « flotter » au-dessus de la page (observé à 4 300 px).
- **Éléments flottants qui débordent** : badge rond tournant à cheval sur l'image du héros, carte produit qui chevauche le bas de la photo (observé).
- **Grands espaces** : environ 5,5 rem entre les sections, et une page d'accueil d'environ 9 700 px de haut.

## 2. Comportements au défilement
| Comportement | Statut | Détail |
|---|---|---|
| Défilement doux avec inertie | **Observé** (classe `lenis` active) | Lenis, lerp 0,09 ; coupé si l'utilisateur réduit les animations |
| En-tête qui se cache à la descente et revient à la remontée | **Observé** | Translation de −80 px après 240 px ; fond crème à 80 % + flou de 12 px dès 30 px |
| Cartes empilées qui restent collées (sticky) et rétrécissent sous la suivante | **Observé** | 3 éléments sticky ; échelle mesurée 1 → 0,953 → 0,91 pour la 1re carte, 0,955 pour la 2e |
| Parallaxe du héros | *(code seul)* | Portrait −0 → +14 % et zoom 1,04 → 1,16 ; badge qui tourne de 0 à 90° ; carte produit qui monte de −60 % |
| Titres qui montent ligne par ligne | *(code seul)* | Chaque ligne glisse de 105 % → 0 dans un masque, 0,8 s, décalage 0,09 s, courbe (0,65 / 0 / 0,15 / 1) |
| Images qui se révèlent par un rideau | *(code seul)* | Masque inset 12 % → 0 % et opacité 0,4 → 1, 0,9 s, une seule fois, réservé aux grandes images |
| Transition entre les pages | *(code seul)* | Fondu + 8 px de montée, 0,32 s |

## 3. Interactions
- **Boutons pilule** avec une flèche dans un rond d'accent, qui pivote de 45° au survol ; effet « pressé » à 97 % *(code seul)*.
- **Navigation centrale en pilule** : le fond de l'onglet actif glisse d'un lien à l'autre (animation de mise en page partagée) *(code seul)*.
- **Curseur personnalisé** : rond qui suit la souris avec un ressort (rigidité 500) ; visible sur les captures.
- **Prestations** : la photo change selon la ligne survolée (fondu + léger zoom) *(code seul)*.
- **Bouton rond magnétique** dans le pied de page : il suit la souris à 30 % *(code seul)*.
- **Mobile** : barre d'actions flottante en bas, à portée de pouce (vérifié lors des tests du 06/11).

## 4. À transposer dans Paradis des téléphones (les principes, pas l'apparence)
1. **Un fond clair travaillé et un seul accent**, mais une **autre palette** et une **autre typographie** (univers tech, pas beauté).
2. **Des titres très grands avec un mot « signature »**, rendu ici autrement (contraste de largeur ou de graisse, pas d'italique serif).
3. **Un moment sticky stratégique** sur l'accueil : la frise des générations d'iPhone qui défile horizontalement pendant le scroll vertical.
4. **La parallaxe du héros, appliquée au produit** : le téléphone pivote et se rapproche pendant la descente.
5. **Des panneaux sombres arrondis** pour les moments forts (gamme Pro, commande).
6. **L'en-tête qui se cache et revient**, la transition de page courte, les révélations en masque, le respect de la réduction des animations.
7. **La barre d'action mobile**, transformée en « prix + Commander » sur les fiches produit.
