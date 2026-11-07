import glob, json, os
from PIL import Image, ImageDraw
racine = r'C:\Users\Panasonic CF-53\Projets\paradis-telephones\public\images\finitions'
manif = {}
for f in sorted(glob.glob(os.path.join(racine, '*', '*-vue*.webp'))):
    im = Image.open(f).convert('RGBA'); bb = im.getbbox()
    if not bb: os.remove(f); continue
    x0, y0, x1, y1 = bb
    coins = [(x0+2, y0+2), (x1-3, y0+2), (x0+2, y1-3), (x1-3, y1-3)]
    clair = all(sum(im.getpixel(c)[:3]) > 690 and im.getpixel(c)[3] > 200 for c in coins)
    if clair:
        # Remplit depuis chaque coin les pixels proches du fond clair, puis les rend transparents.
        rgb = im.convert('RGB'); masque = Image.new('L', im.size, 0)
        for c in coins:
            tmp = rgb.copy(); ImageDraw.floodfill(tmp, c, (255, 0, 255), thresh=14)
            px = tmp.load(); mp = masque.load()
            for y in range(y0, y1):
                for x in range(x0, x1):
                    if px[x, y] == (255, 0, 255): mp[x, y] = 255
        a = im.split()[3]; a = Image.composite(Image.new('L', im.size, 0), a, masque); im.putalpha(a)
        im.save(f, 'WEBP', quality=86, method=6)
    # contrôle : coins encore opaques → vue écartée
    bb = im.getbbox(); x0, y0, x1, y1 = bb
    if any(im.getpixel(c)[3] > 200 for c in [(x0+2, y0+2), (x1-3, y0+2), (x0+2, y1-3), (x1-3, y1-3)]):
        os.remove(f); print('écartée', f[-40:]); continue
    print('ok', f[-40:])
for d in glob.glob(os.path.join(racine, '*')):
    for f in glob.glob(os.path.join(d, '*.webp')):
        n = os.path.basename(f)
        if '-vue' in n: continue
        cle = f'{os.path.basename(d)}/{n[:-5]}'
        manif[cle] = [f'/images/finitions/{cle}.webp'] + [f'/images/finitions/{cle}-vue{k}.webp' for k in (2, 3) if os.path.exists(os.path.join(d, f'{n[:-5]}-vue{k}.webp'))]
json.dump(manif, open(r'C:\Users\Panasonic CF-53\Projets\paradis-telephones\src\data\vues.json', 'w'), indent=0)
print(len(manif), 'finitions dans le manifeste')
