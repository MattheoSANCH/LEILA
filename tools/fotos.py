#!/usr/bin/env python3
"""
Prepara las cuatro fotografías del sitio.

Recorta cada una a su proporción de destino sobre una caja elegida a mano
(centrada en los rostros, evitando el rótulo de otro diseño que lleva la
foto del consultorio), armoniza la temperatura de color de las cuatro —que
vienen de fuentes distintas— y exporta WebP y JPEG en dos anchuras.

    python3 tools/fotos.py
"""
import os, statistics
from PIL import Image, ImageEnhance

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEN = '/tmp/fotos'
DESTINO = os.path.join(RAIZ, 'assets', 'img')

# La página está compuesta sobre papel cálido #F8F7F3 (R/B = 1.021). Las cuatro
# fuentes van de 0.91 (fría) a 1.37 (muy cálida): se acercan a un punto común,
# pero solo en parte —una corrección total desplazaría los tonos de piel— y con
# la ganancia acotada para que ninguna foto se vuelva artificial.
OBJETIVO_RB = 1.03
FUERZA = 0.6
GANANCIA_MAX = 0.08
SATURACION = 0.92
CONTRASTE = 1.04

FOTOS = [
    dict(clave='retrato', archivo='IMG_1259_2.png', recorte_previo=(0, 681, 1170, 1850),
         caja=(117, 0, 1052, 1169), anchuras=[600, 935],
         nota='Portada — retrato de estudio, fondo neutro'),
    dict(clave='consultorio', archivo='IMG_1260_2.jpeg', caja=(250, 55, 1090, 895),
         anchuras=[420, 840],
         nota='Sobre mí — consultorio, diplomas al fondo (el rótulo ajeno empieza en y=928: la caja se detiene antes)'),
    dict(clave='optotipo', archivo='IMG_1261_2.jpeg', caja=(170, 330, 950, 1110),
         anchuras=[420, 780],
         nota='Áreas — explicando sobre el optotipo'),
    dict(clave='equipo', archivo='IMG_1263_2.jpeg', caja=(0, 230, 1165, 885),
         anchuras=[900, 1165],
         nota='Antes del logro — pasillo de la clínica'),
]


def media_rb(im):
    px = list(im.resize((64, 64)).convert('RGB').getdata())
    r = statistics.mean(p[0] for p in px)
    b = statistics.mean(p[2] for p in px)
    return r / max(b, 1)


def armonizar(im):
    """Acerca la temperatura al punto común, sin tocar el canal verde."""
    r_b = media_rb(im)
    deseado = r_b + (OBJETIVO_RB - r_b) * FUERZA
    factor = (deseado / r_b) ** 0.5
    gr = max(1 - GANANCIA_MAX, min(1 + GANANCIA_MAX, factor))
    gb = max(1 - GANANCIA_MAX, min(1 + GANANCIA_MAX, 1 / factor))
    r, v, b = im.split()
    im = Image.merge('RGB', (r.point(lambda p: min(255, int(p * gr))), v,
                             b.point(lambda p: min(255, int(p * gb)))))
    im = ImageEnhance.Color(im).enhance(SATURACION)
    im = ImageEnhance.Contrast(im).enhance(CONTRASTE)
    return im, r_b, media_rb(im)


def main():
    os.makedirs(DESTINO, exist_ok=True)
    total = 0
    for f in FOTOS:
        im = Image.open(os.path.join(ORIGEN, f['archivo'])).convert('RGB')
        if f.get('recorte_previo'):
            im = im.crop(f['recorte_previo'])
        im = im.crop(f['caja'])
        proporcion = im.width / im.height
        im, antes, despues = armonizar(im)
        print(f"\n── {f['clave']} · {f['nota']}")
        print(f"   recorte {im.width}×{im.height} px  (proporción {proporcion:.3f})")
        print(f"   temperatura R/B {antes:.3f} → {despues:.3f}  (objetivo {OBJETIVO_RB})")
        for w in f['anchuras']:
            chico = im.resize((w, int(round(w / proporcion))), Image.LANCZOS)
            for ext, o in (('webp', dict(quality=80, method=6)),
                           ('jpg', dict(quality=84, optimize=True, progressive=True))):
                ruta = os.path.join(DESTINO, f"{f['clave']}-{w}.{ext}")
                chico.save(ruta, **o)
                kb = os.path.getsize(ruta) / 1024
                total += kb
                print(f"   {os.path.basename(ruta):26s} {kb:6.1f} KB")
    print(f"\n   total de imágenes: {total:.0f} KB")


if __name__ == '__main__':
    main()
