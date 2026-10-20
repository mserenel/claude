"""Saca los pelos de una mano en una foto, sin tocar nada más.

Uso:
  python sacar_pelos.py ENTRADA SALIDA [X0,Y0,X1,Y1 ...]

Las cajas opcionales (px de la foto) no se tocan: por ejemplo la virola del
mate, cuyo grabado dorado tiene un tono parecido al de la piel.

- Marca la piel (tonos cálidos con algo de saturación; la pared gris y el
  mate quedan afuera) y se queda con la mancha más grande: la mano.
- Dentro de la piel, los pelos son líneas finas más oscuras que lo que las
  rodea (black-hat). Se descartan los puntos sueltos (poros) y las manchas
  grandes (pliegues).
- Se rellenan con la piel de alrededor (inpaint) y se les suma un grano
  suave para que no queden lisos.
"""

import sys

import cv2
import numpy as np


def main():
    src, out_path = sys.argv[1:3]
    excluir = [tuple(int(v) for v in caja.split(",")) for caja in sys.argv[3:]]
    im = cv2.imread(src)
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    h, s, v = [hsv[..., i].astype(np.int32) for i in range(3)]
    piel = (((h <= 20) | (h >= 170)) & (s > 45) & (v > 70)).astype(np.uint8) * 255
    piel = cv2.morphologyEx(piel, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(piel)
    mano = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    piel = cv2.erode((lab == mano).astype(np.uint8) * 255, np.ones((9, 9), np.uint8))

    gris = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    elipse = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    oscuro = cv2.morphologyEx(gris, cv2.MORPH_BLACKHAT, elipse)
    pelo = ((oscuro > 14) & (piel > 0)).astype(np.uint8) * 255

    n, lab, st, _ = cv2.connectedComponentsWithStats(pelo)
    mascara = np.zeros_like(pelo)
    for i in range(1, n):
        area = st[i, cv2.CC_STAT_AREA]
        largo = max(st[i, cv2.CC_STAT_WIDTH], st[i, cv2.CC_STAT_HEIGHT])
        if 12 <= area < 4000 and largo >= 8:
            mascara[lab == i] = 255
    mascara = cv2.dilate(mascara, np.ones((3, 3), np.uint8))
    for x0, y0, x1, y1 in excluir:
        mascara[y0:y1, x0:x1] = 0

    out = cv2.inpaint(im, mascara, 4, cv2.INPAINT_TELEA).astype(np.float32)
    m = (cv2.GaussianBlur(mascara, (0, 0), 1.5) / 255.0)[..., None]
    rng = np.random.default_rng(3)
    out += m * rng.normal(0, 2.0, out.shape).astype(np.float32)
    cv2.imwrite(out_path, np.clip(out, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 96])


if __name__ == "__main__":
    main()
