"""Retoque de piel de una mano para Instagram, sin tocar nada más.

Uso:
  python retocar_mano.py ENTRADA SALIDA [X0,Y0,X1,Y1 ...]

Las cajas opcionales (px de la foto) quedan fuera del retoque: la virola
del mate tiene letras doradas de un tono parecido al de la piel.

Se aplica después de sacar_pelos.py. Sobre la piel (máscara con borde
suave), separando frecuencias:
- tono (frecuencias bajas): se conserva el color y la luz de la mano; sólo
  se emparejan las manchas, acercando cada zona al tono de su alrededor;
- textura (frecuencias altas): se conserva, apenas suavizada, para que las
  arrugas no marquen tanto pero la piel siga siendo piel.
Además se borran los pelitos finos que asoman en el borde de la mano contra
la pared.
"""

import sys

import cv2
import numpy as np


def mascara_piel(im, excluir):
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    h, s, v = [hsv[..., i].astype(np.int32) for i in range(3)]
    piel = (((h <= 20) | (h >= 170)) & (s > 40) & (v > 60)).astype(np.uint8) * 255
    for x0, y0, x1, y1 in excluir:
        piel[y0:y1, x0:x1] = 0
    piel = cv2.morphologyEx(piel, cv2.MORPH_CLOSE, np.ones((31, 31), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(piel)
    mano = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    piel = (lab == mano).astype(np.uint8) * 255
    # Rellenar agujeros (uñas, sombras dentro de la mano).
    cont, _ = cv2.findContours(piel, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    lleno = np.zeros_like(piel)
    cv2.drawContours(lleno, cont, -1, 255, -1)
    for x0, y0, x1, y1 in excluir:
        lleno[y0:y1, x0:x1] = 0
    return lleno


def pelitos_del_borde(im, piel, excluir):
    # Una franja de pared justo afuera del contorno de la mano: ahí los pelos
    # son líneas finas más oscuras que la pared.
    franja = cv2.dilate(piel, np.ones((41, 41), np.uint8)) & ~cv2.erode(piel, np.ones((7, 7), np.uint8))
    gris = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    oscuro = cv2.morphologyEx(gris, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
    pelo = ((oscuro > 10) & (franja > 0)).astype(np.uint8) * 255
    for x0, y0, x1, y1 in excluir:
        pelo[y0:y1, x0:x1] = 0
    n, lab, st, _ = cv2.connectedComponentsWithStats(pelo)
    m = np.zeros_like(pelo)
    for i in range(1, n):
        area = st[i, cv2.CC_STAT_AREA]
        largo = max(st[i, cv2.CC_STAT_WIDTH], st[i, cv2.CC_STAT_HEIGHT])
        if 6 <= area < 1500 and largo >= 6:
            m[lab == i] = 255
    return cv2.dilate(m, np.ones((3, 3), np.uint8))


def main():
    src, out_path = sys.argv[1:3]
    excluir = [tuple(int(v) for v in caja.split(",")) for caja in sys.argv[3:]]
    im = cv2.imread(src)
    piel = mascara_piel(im, excluir)

    borde = pelitos_del_borde(im, piel, excluir)
    im = cv2.inpaint(im, borde, 3, cv2.INPAINT_TELEA)

    lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
    bajo = cv2.GaussianBlur(lab, (0, 0), 10)
    alto = lab - bajo

    # Tono: se conserva el color y la luz de la mano. Sólo se emparejan las
    # manchas: cada zona se acerca al tono de su alrededor (no a un promedio
    # de toda la mano, que la dejaba pálida y pareja como de plástico).
    parejo = cv2.GaussianBlur(bajo, (0, 0), 28)
    nuevo_bajo = bajo.copy()
    nuevo_bajo[..., 0] = bajo[..., 0] * 0.6 + parejo[..., 0] * 0.4
    nuevo_bajo[..., 1] = bajo[..., 1] * 0.45 + parejo[..., 1] * 0.55  # manchas rojas
    nuevo_bajo[..., 2] = bajo[..., 2] * 0.6 + parejo[..., 2] * 0.4
    # Textura: apenas más suave.
    nuevo = nuevo_bajo + alto * 0.72

    m = cv2.GaussianBlur(cv2.erode(piel, np.ones((5, 5), np.uint8)), (0, 0), 6).astype(np.float32) / 255
    m = m[..., None]
    for x0, y0, x1, y1 in excluir:
        m[y0:y1, x0:x1] = 0
    lab_out = lab * (1 - m) + nuevo * m
    out = cv2.cvtColor(np.clip(lab_out, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    cv2.imwrite(out_path, out, [cv2.IMWRITE_JPEG_QUALITY, 96])


if __name__ == "__main__":
    main()
