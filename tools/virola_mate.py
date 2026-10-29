"""Baja el brillo del metal de un recorte de mate (virola, base, patas) sin
perder el cincelado: la luz del metal se separa en la de fondo (desenfocada)
y el relieve (lo que queda); sólo la de fondo baja y se comprime, y el
relieve se refuerza un poco, así los dibujos se leen mejor aunque el metal
brille menos.

Uso:
  python virola_mate.py RECORTE.png Y0:Y1 [Y0:Y1 ...]   (lo reescribe)

Y0:Y1 son las filas del metal en el recorte (700 px de mate).
"""

import sys

import cv2
import numpy as np


def main():
    f = sys.argv[1]
    r = cv2.imread(f, cv2.IMREAD_UNCHANGED)
    h = r.shape[0]
    fila = np.zeros(h, np.float32)
    for tramo in sys.argv[2:]:
        y0, y1 = (int(v) for v in tramo.split(":"))
        fila[y0:y1] = 1
    fila = np.convolve(fila, np.ones(9) / 9, "same")
    metal = (r[..., 3] > 0) * fila[:, None]

    lab = cv2.cvtColor(r[..., :3], cv2.COLOR_BGR2LAB).astype(np.float32)
    L = lab[..., 0]
    zona = metal > 0.5
    fondo = cv2.GaussianBlur(L, (0, 0), 3)
    relieve = L - fondo
    hombro = float(np.percentile(fondo[zona], 45))
    curva = np.where(fondo > hombro, hombro + (fondo - hombro) * 0.45, fondo) * 0.9
    curva = curva + relieve * 1.35
    lab[..., 0] = L * (1 - metal) + curva * metal
    # El color del metal (alpaca o dorado) un poco menos saturado, sin brillo.
    for c in (1, 2):
        lab[..., c] = lab[..., c] * (1 - metal) + (128 + (lab[..., c] - 128) * 0.85) * metal
    r[..., :3] = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    cv2.imwrite(f, r)


if __name__ == "__main__":
    main()
