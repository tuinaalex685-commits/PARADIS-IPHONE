"""Repère, sur chaque rendu de finition, le bloc photo et le logo Apple (en % de l'image).

Tous les rendus officiels montrent le dos du téléphone à gauche (bloc photo en haut à gauche,
logo au centre du dos) et la face avant à droite. On mesure la silhouette du téléphone de dos
(colonne la plus à gauche de la zone opaque) puis on place les deux points dans ce dos.
Résultat : src/data/points.json  { "/images/finitions/x/y.webp": { "photo": [x, y], "logo": [x, y] } }
"""
import glob, json, os
from PIL import Image

R = r'C:\Users\Panasonic CF-53\Projets\paradis-telephones'
sortie = {}
for f in sorted(glob.glob(os.path.join(R, 'public', 'images', 'finitions', '*', '*.webp'))):
    if '-vue' in f:
        continue
    im = Image.open(f).convert('RGBA')
    W, H = im.size
    a = im.split()[3]
    x0, y0, x1, y1 = a.getbbox()
    # Largeur du téléphone de dos : on suit la ligne du milieu de la silhouette depuis la gauche
    # jusqu'au premier « creux » de transparence ou de changement brusque ; à défaut, 55 % du total.
    larg = int((x1 - x0) * 0.56)
    dos_x0, dos_x1 = x0, x0 + larg
    haut = y1 - y0
    photo = ((dos_x0 + 0.27 * (dos_x1 - dos_x0)) / W * 100, (y0 + 0.14 * haut) / H * 100)
    logo = ((dos_x0 + 0.50 * (dos_x1 - dos_x0)) / W * 100, (y0 + 0.50 * haut) / H * 100)
    cle = '/images/finitions/' + os.path.relpath(f, os.path.join(R, 'public', 'images', 'finitions')).replace('\\', '/')
    sortie[cle] = {'photo': [round(photo[0], 1), round(photo[1], 1)], 'logo': [round(logo[0], 1), round(logo[1], 1)]}
json.dump(sortie, open(os.path.join(R, 'src', 'data', 'points.json'), 'w'), indent=0)
print(len(sortie), 'rendus repérés')
