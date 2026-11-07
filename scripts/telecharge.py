import urllib.request, json, io, os
from PIL import Image
B='https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/'
D=r'C:\Users\Panasonic CF-53\Projets\paradis-telephones\public\images\finitions'
def get(n, w=1100):
    try: return Image.open(io.BytesIO(urllib.request.urlopen(f'{B}{n}?wid={w}&hei={w}&fmt=png-alpha',timeout=40).read())).convert('RGBA')
    except Exception: return None
def sauve(im, chemin):
    bb = im.getbbox()
    if bb: im = im.crop(bb)
    # cadre carré commun : le téléphone occupe ~86 % de la hauteur, centré
    c = 1000; m = int(c*0.86)
    im.thumbnail((m, m), Image.LANCZOS)
    fond = Image.new('RGBA', (c, c), (0,0,0,0)); fond.paste(im, ((c-im.width)//2, (c-im.height)//2), im)
    fond.save(chemin, 'WEBP', quality=86, method=6)
t={}
for f in ['trouves.json','trouves2.json','trouves3.json']: 
    for k,v in json.load(open(f)).items(): t.setdefault(k,{}).update({a:b for a,b in v.items() if b})
# 16 Plus : version 6,7 pouces si elle existe
t['iphone-16-plus'] = {co: n.replace('6-1inch','6-7inch') for co,n in t['iphone-16'].items()}
journal=[]
for slug, couls in t.items():
    os.makedirs(os.path.join(D,slug), exist_ok=True)
    for co, nom in couls.items():
        im = get(nom)
        if im is None and slug=='iphone-16-plus': nom = nom.replace('6-7inch','6-1inch'); im = get(nom)
        if im is None: print('MANQUE', slug, co); continue
        sauve(im, os.path.join(D,slug,f'{co}.webp')); journal.append(f'{slug}/{co}.webp\t{B}{nom}')
        vues = 1
        for av in ('_AV2','_AV3'):
            v = get(nom+av)
            if v: sauve(v, os.path.join(D,slug,f'{co}{av.lower().replace("_av","-vue")}.webp')); vues += 1; journal.append(f'{slug}/{co}{av}\t{B}{nom}{av}')
        print(slug, co, vues, 'vue(s)')
open(os.path.join(D,'SOURCES.txt'),'w').write('Rendus officiels Apple Store (store.storeimages.cdn-apple.com), usage prototype.\n'+'\n'.join(journal))
