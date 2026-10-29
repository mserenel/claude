"""Los mates en fila sobre un estante liso color crema, para poner sobre el
fondo azul de la historia: la cara de arriba del estante (donde apoyan, vista
apenas desde arriba), el canto de adelante más oscuro, la sombra del estante
sobre la pared, y bajo cada mate su sombra de contacto y una sombra suave.
La imagen sale con transparencia (la pared es el azul de la historia).

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
AZUL = np.array([59, 35, 20], np.float32)  # BGR de #14233B


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

    rgb = np.zeros((alto, ancho, 3), np.float32)
    rgb[:] = AZUL
    alfa = np.zeros((alto, ancho), np.float32)
    y = np.arange(alto, dtype=np.float32)[:, None]

    # El estante: la cara de arriba (de atrás hacia adelante, apenas más clara
    # adelante, donde le da la luz) y el canto, más oscuro.
    atras, adelante, canto = piso - 16 * X, piso + 12 * X, 34 * X
    xs = (np.arange(ancho, dtype=np.float32) - ancho / 2) / (ancho / 2)
    luz = 1 - 0.06 * xs[None, :] ** 2
    cara = (y >= atras) & (y < adelante)
    t = np.clip((y - atras) / (adelante - atras), 0, 1)
    tono_cara = (0.90 + 0.08 * t)[..., None] * CREMA * luz[..., None]
    rgb = np.where(cara[..., None], tono_cara, rgb)
    frente = (y >= adelante) & (y < adelante + canto)
    tf = np.clip((y - adelante) / canto, 0, 1)
    tono_frente = (0.80 - 0.08 * tf)[..., None] * CREMA * luz[..., None]
    rgb = np.where(frente[..., None], tono_frente, rgb)
    # El filo de adelante agarra la luz.
    filo = (y >= adelante) & (y < adelante + 2 * X)
    rgb = np.where(filo[..., None], CREMA * 1.0 * luz[..., None], rgb)
    alfa = np.where(cara | frente, 1.0, alfa)
    # Sombra del estante sobre la pared, abajo.
    abajo = y - (adelante + canto)
    sombra_pared = np.where(abajo >= 0, np.exp(-abajo / (14 * X)) * 0.55, 0)[:, 0]
    alfa = np.maximum(alfa, np.broadcast_to(sombra_pared[:, None], alfa.shape))
    rgb = np.where((abajo >= 0)[..., None], np.array([8, 6, 4], np.float32), rgb)

    # Dónde va cada mate: separaciones iguales entre uno y otro.
    anchos = [r.shape[1] for r, _ in mates]
    hueco = (ancho - 2 * margen - sum(anchos)) / (len(mates) - 1)
    x = margen
    sombra = np.zeros((alto, ancho), np.float32)
    capas = []
    for (r, bajar), w in zip(mates, anchos):
        top = piso - round(r.shape[0] * 700 / 724) + bajar
        capas.append((r, int(round(x)), top))
        cx = int(round(x + w / 2))
        ancho_s = int(w * 0.46)
        cv2.ellipse(sombra, (cx, piso + 1 * X), (ancho_s, int(ancho_s * 0.13)), 0, 0, 360, 1, -1)
        x += w + hueco
    sombra = cv2.GaussianBlur(sombra, (0, 0), 7 * X) * 0.38 * cara
    tono = np.array([40, 52, 66], np.float32)
    rgb = rgb * (1 - sombra[..., None]) + tono * sombra[..., None]

    # Grano muy fino en el estante.
    grano = cv2.GaussianBlur(np.random.default_rng(3).normal(0, 1.4, (alto, ancho)).astype(np.float32), (0, 0), 0.8)
    rgb = rgb + grano[..., None] * (cara | frente)[..., None]

    for r, x0, top in capas:
        h, w = r.shape[:2]
        y0, y1 = max(top, 0), min(top + h, alto)
        x1 = min(x0 + w, ancho)
        sub = r[y0 - top : y1 - top, : x1 - x0]
        al = sub[..., 3] / 255
        rgb[y0:y1, x0:x1] = (
            sub[..., :3] * al[..., None] + rgb[y0:y1, x0:x1] * (alfa[y0:y1, x0:x1] * (1 - al))[..., None]
        ) / np.maximum(al + alfa[y0:y1, x0:x1] * (1 - al), 1e-4)[..., None]
        alfa[y0:y1, x0:x1] = al + alfa[y0:y1, x0:x1] * (1 - al)

    cv2.imwrite(out, np.dstack([np.clip(rgb, 0, 255), np.clip(alfa, 0, 1) * 255]).astype(np.uint8))


if __name__ == "__main__":
    main()
