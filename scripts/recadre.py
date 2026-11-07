"""Rendus Apple 2022-2024 (rectangle gris + petit téléphone) : retéléchargés en grand, fond gris
détouré depuis les bords, téléphone recadré et recentré comme les autres finitions."""
import io, json, os, urllib.request
from PIL import Image, ImageChops, ImageDraw
B = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/'
D = r'C:\Users\Panasonic CF-53\Projets\paradis-telephones\public\images\finitions'
S = r'C:\Users\PANASO~1\AppData\Local\Temp\claude\ea460e1d5c50c73e\e714d9a6-37bc-49f7-9a7e-bde845660eaa\scratchpad\shop\trouves.json'
t = json.load(open(S))
cibles = {k: t[k] for k in ['iphone-15-pro', 'iphone-16', 'iphone-16-pro-max']}
cibles['iphone-16-plus'] = t['iphone-16']
for slug, couls in cibles.items():
    for co, nom in couls.items():
        if not nom: continue
        im = Image.open(io.BytesIO(urllib.request.urlopen(f'{B}{nom}?wid=2600&hei=2600&fmt=png-alpha', timeout=60).read())).convert('RGBA')
        bb = im.getbbox(); x0, y0, x1, y1 = bb
        rgb = im.convert('RGB'); masque = Image.new('L', im.size, 0)
        for c in [(x0+2, y0+2), (x1-3, y0+2), (x0+2, y1-3), (x1-3, y1-3)]:
            if im.getpixel(c)[3] < 200: continue
            tmp = rgb.copy(); ImageDraw.floodfill(tmp, c, (255, 0, 255), thresh=10)
            # Pixels repeints en magenta = fond relié au bord : calcul vectorisé (rapide).
            diff = ImageChops.difference(tmp, Image.new('RGB', im.size, (255, 0, 255))).convert('L')
            masque = ImageChops.lighter(masque, diff.point(lambda v: 255 if v == 0 else 0))
        a = im.split()[3]; im.putalpha(Image.composite(Image.new('L', im.size, 0), a, masque))
        bb = im.getbbox(); im = im.crop(bb)
        c = 1000; m = int(c * 0.86); im.thumbnail((m, m), Image.LANCZOS)
        fond = Image.new('RGBA', (c, c), (0, 0, 0, 0)); fond.paste(im, ((c - im.width) // 2, (c - im.height) // 2), im)
        fond.save(os.path.join(D, slug, f'{co}.webp'), 'WEBP', quality=86, method=6)
        print(slug, co, 'téléphone', bb[2] - bb[0], 'x', bb[3] - bb[1], 'px')
