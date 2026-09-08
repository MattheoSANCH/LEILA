#!/usr/bin/env python3
"""
Prepara el retrato de la portada.

Recorta a 4:5, genera tres anchuras en WebP y JPEG, e inserta el <picture>
en index.html sustituyendo el marcador de posición.

    python3 tools/retrato.py foto.jpg                 # inspeccionar y preparar
    python3 tools/retrato.py foto.jpg --foco 0.35     # subir el encuadre
    python3 tools/retrato.py foto.jpg --solo-info     # solo leer EXIF y medidas
"""
import argparse, os, sys, re, io
from PIL import Image, ImageOps, ImageChops
from PIL.ExifTags import TAGS

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, 'assets', 'img')
ANCHURAS = [600, 900, 1200]
PROPORCION = 4 / 5


def exif(im):
    """Metadatos útiles para saber de dónde sale la imagen."""
    datos = {}
    bruto = getattr(im, '_getexif', lambda: None)()
    if bruto:
        for k, v in bruto.items():
            datos[TAGS.get(k, k)] = v
    return datos


def informe(ruta):
    im = Image.open(ruta)
    im = ImageOps.exif_transpose(im)
    d = exif(Image.open(ruta))
    camara = ' '.join(str(d.get(c, '')).strip() for c in ('Make', 'Model')).strip()
    print(f"  archivo    : {os.path.basename(ruta)}")
    print(f"  medidas    : {im.width} × {im.height} px  ({im.width/im.height:.2f}:1)")
    print(f"  modo       : {im.mode}")
    print(f"  cámara EXIF: {camara or '— ninguna (exportada, capturada de pantalla o generada)'}")
    if d.get('DateTimeOriginal'):
        print(f"  tomada el  : {d['DateTimeOriginal']}")
    if d.get('LensModel'):
        print(f"  objetivo   : {d['LensModel']}")
    if d.get('Software'):
        print(f"  software   : {d['Software']}")
    return im


def quitar_barras(im, umbral=18):
    """Recorta las bandas negras uniformes de una captura de pantalla."""
    gris = im.convert('L')
    fondo = Image.new('L', gris.size, 0)
    caja = ImageChops.difference(gris, fondo).point(lambda p: 255 if p > umbral else 0).getbbox()
    if caja and (caja[3] - caja[1]) < im.height:
        print(f"  bandas negras recortadas: {im.height} → {caja[3]-caja[1]} px de alto")
        return im.crop(caja)
    return im


def recortar(im, foco, foco_x):
    """Recorta a 4:5 alrededor de un punto focal (0 = arriba/izquierda, 1 = abajo/derecha)."""
    if im.width / im.height > PROPORCION:          # demasiado ancha: recortar los lados
        ancho = int(round(im.height * PROPORCION))
        izq = int(round((im.width - ancho) * foco_x))
        return im.crop((izq, 0, izq + ancho, im.height))
    alto = int(round(im.width / PROPORCION))       # demasiado alta: recortar arriba/abajo
    arriba = int(round((im.height - alto) * foco))
    return im.crop((0, arriba, im.width, arriba + alto))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('origen')
    p.add_argument('--foco', type=float, default=0.30,
                   help='posición vertical del encuadre, 0 = arriba (por defecto 0.30: la cara en el tercio superior)')
    p.add_argument('--foco-x', type=float, default=0.5, help='posición horizontal del encuadre')
    p.add_argument('--sin-barras', action='store_true', help='no intentar recortar bandas negras')
    p.add_argument('--solo-info', action='store_true')
    a = p.parse_args()

    print("── Origen ─────────────────────────────────────────")
    im = informe(a.origen)
    if a.solo_info:
        return

    if not a.sin_barras:
        im = quitar_barras(im)

    im = recortar(im, a.foco, a.foco_x).convert('RGB')
    print(f"\n── Recorte 4:5 ────────────────────────────────────")
    print(f"  {im.width} × {im.height} px")
    if im.width < 1200:
        print(f"  AVISO: por debajo de los 1200 px recomendados. Se verá blando en pantalla de alta densidad.")

    os.makedirs(DESTINO, exist_ok=True)
    print(f"\n── Salidas ────────────────────────────────────────")
    generados = []
    for w in ANCHURAS:
        if w > im.width * 1.15:
            print(f"  {w}px omitido (excede la definición del original)")
            continue
        chico = im.resize((w, int(round(w / PROPORCION))), Image.LANCZOS)
        for ext, opts in (('webp', dict(quality=82, method=6)), ('jpg', dict(quality=86, optimize=True, progressive=True))):
            ruta = os.path.join(DESTINO, f'retrato-{w}.{ext}')
            chico.save(ruta, **opts)
            print(f"  {os.path.relpath(ruta, RAIZ):32s} {os.path.getsize(ruta)/1024:6.1f} KB")
        generados.append(w)

    if not generados:
        sys.exit("Sin salidas: el original es demasiado pequeño.")

    mayor = max(generados)
    srcset = lambda ext: ', '.join(f'assets/img/retrato-{w}.{ext} {w}w' for w in generados)
    bloque = f'''<figure class="marco marco--foto rev" style="--d:2">
        <picture>
          <source type="image/webp" srcset="{srcset('webp')}" sizes="(min-width:1024px) 450px, (min-width:768px) 300px, 100vw">
          <img src="assets/img/retrato-{mayor}.jpg" srcset="{srcset('jpg')}" sizes="(min-width:1024px) 450px, (min-width:768px) 300px, 100vw"
               width="{mayor}" height="{int(round(mayor/PROPORCION))}" loading="eager" decoding="async" fetchpriority="high"
               alt="Retrato de la Dra. Alejandra Sánchez Navarro Palazuelos">
        </picture>
      </figure>'''

    ruta_html = os.path.join(RAIZ, 'index.html')
    html = io.open(ruta_html, encoding='utf-8').read()
    patron = re.compile(r'      <figure class="marco.*?</figure>', re.S)
    if not patron.search(html):
        sys.exit("No se encontró el <figure class=\"marco\"> en index.html.")
    io.open(ruta_html, 'w', encoding='utf-8').write(patron.sub(bloque, html, count=1))
    print(f"\n  index.html actualizado: el marcador de posición ha sido sustituido por la foto.")

if __name__ == '__main__':
    main()
