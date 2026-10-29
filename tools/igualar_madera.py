"""Iguala el color de la madera de varios recortes de mate (recorte_mate.py):
en cada uno toma la madera (lo opaco y con color, no el metal gris ni la
sombra) y lleva su color medio y su contraste al promedio de todos, en LAB.
El metal y la sombra quedan como estaban.

Uso:
  python igualar_madera.py RECORTE.png [RECORTE.png ...]   (los reescribe)
"""

import sys

import cv2
import numpy as np


def madera(r):
    lab = cv2.cvtColor(r[..., :3], cv2.COLOR_BGR2LAB).astype(np.float32)
    croma = np.hypot(lab[..., 1] - 128, lab[..., 2] - 128)
    m = (r[..., 3] > 250) & (croma > 18)
    # Sólo el cuerpo: fuera de las filas de abajo, donde está la sombra.
    m[int(r.shape[0] * 690 / 724) :] = False
    return lab, croma, m


def main():
    rs = [cv2.imread(f, cv2.IMREAD_UNCHANGED) for f in sys.argv[1:]]
    datos = []
    for r in rs:
        lab, croma, m = madera(r)
        datos.append((lab, croma, m, lab[m].mean(0), lab[m].std(0)))
    media = np.mean([d[3] for d in datos], 0)
    desvio = np.mean([d[4] for d in datos], 0)
    for f, r, (lab, croma, m, mu, sd) in zip(sys.argv[1:], rs, datos):
        nuevo = (lab - mu) * (desvio / sd) + media
        # Peso suave según cuánto color tiene el píxel: el metal (gris) no cambia.
        peso = np.clip((croma - 10) / 12, 0, 1) * (r[..., 3] > 0)
        peso[int(r.shape[0] * 690 / 724) :] = 0
        peso = cv2.GaussianBlur(peso.astype(np.float32), (0, 0), 1.2)[..., None]
        lab = lab * (1 - peso) + nuevo * peso
        r[..., :3] = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
        cv2.imwrite(f, r)
        print(f, np.round(mu, 1), "->", np.round(media, 1))


if __name__ == "__main__":
    main()
