"""Los mates en fila sobre una mesa de estudio: fondo crema que se curva hacia
el piso (sin línea de horizonte, como el papel continuo de las fotos de
producto), una sombra suave bajo cada mate además de su sombra de contacto, y
un grano muy fino de papel. Sale una sola imagen para la historia.

Uso:
  python estudio_mates.py SALIDA.png ANCHO ALTO PISO MARGEN \
      RECORTE:ALTO:BAJAR [RECORTE:ALTO:BAJAR ...]

ANCHO, ALTO, PISO (la línea donde apoyan) y MARGEN en px de la historia; la
imagen sale al doble para que quede nítida. Los recortes son los de
recorte_mate.py (700 px de mate + 24 de sombra de contacto).
"""

import sys

import cv2
import numpy as np

X = 2  # la imagen sale al doble
CREMA = np.array([221, 235, 243], np.float32)  # BGR de #F3EBDD


def main():
    out = sys.argv[1]
    ancho, alto, piso, margen = (int(v) * X for v in sys.argv[2:6])
    mates = []
    for arg in sys.argv[6:]:
        f, h, b = arg.rsplit(":", 2)
        r = cv2.imread(f, cv2.IMREAD_UNCHANGED).astype(np.float32)
        h = int(h) * X * 724 / 700
        r = cv2.resize(r, (round(r.shape[1] * h / r.shape[0]), round(h)), interpolation=cv2.INTER_AREA)
        mates.append((r, int(b) * X))

    # Fondo: la pared un poco más oscura arriba, el piso más claro, y la curva
    # entre los dos muy suave (sin horizonte marcado).
    y = np.arange(alto, dtype=np.float32)[:, None]
    curva = piso - 70 * X
    t = 1 / (1 + np.exp(-(y - curva) / (38 * X)))
    pared = CREMA * 0.93
    suelo = CREMA * 1.0
    fondo = pared * (1 - t[..., None]) + suelo * t[..., None]
    # Luz desde arriba al centro: los costados apenas más oscuros.
    xs = (np.arange(ancho, dtype=np.float32) - ancho / 2) / (ancho / 2)
    fondo = fondo * (1 - 0.05 * xs[None, :, None] ** 2)
    fondo = np.repeat(fondo, ancho, axis=1) if fondo.shape[1] == 1 else fondo
    fondo = np.broadcast_to(fondo, (alto, ancho, 3)).copy()

    # Dónde va cada mate: separaciones iguales entre uno y otro.
    anchos = [r.shape[1] for r, _ in mates]
    hueco = (ancho - 2 * margen - sum(anchos)) / (len(mates) - 1)
    x = margen
    sombra = np.zeros((alto, ancho), np.float32)
    capas = []
    for (r, bajar), w in zip(mates, anchos):
        top = piso - round(r.shape[0] * 700 / 724) + bajar
        capas.append((r, int(round(x)), top))
        # Sombra suave bajo el mate: una elipse aplastada, como la que deja
        # una luz grande de arriba sobre la mesa.
        cx = int(round(x + w / 2))
        ancho_s = int(w * 0.46)
        cv2.ellipse(sombra, (cx, piso + 2 * X), (ancho_s, int(ancho_s * 0.16)), 0, 0, 360, 1, -1)
        x += w + hueco
    sombra = cv2.GaussianBlur(sombra, (0, 0), 9 * X) * 0.32
    tono = np.array([40, 52, 66], np.float32)
    fondo = fondo * (1 - sombra[..., None]) + tono * sombra[..., None]

    for r, x0, top in capas:
        h, w = r.shape[:2]
        y0, y1 = max(top, 0), min(top + h, alto)
        x1 = min(x0 + w, ancho)
        sub = r[y0 - top : y1 - top, : x1 - x0]
        al = sub[..., 3:] / 255
        fondo[y0:y1, x0:x1] = sub[..., :3] * al + fondo[y0:y1, x0:x1] * (1 - al)

    # Grano fino de papel.
    grano = np.random.default_rng(3).normal(0, 1.6, (alto, ancho)).astype(np.float32)
    fondo += cv2.GaussianBlur(grano, (0, 0), 0.8)[..., None]
    cv2.imwrite(out, np.clip(fondo, 0, 255).astype(np.uint8))


if __name__ == "__main__":
    main()
