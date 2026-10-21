"""Foto de producto sobre fondo blanco a partir de una foto casera, sacándole
el film protector al mate.

Uso:
  python foto_producto.py FOTO MASCARA SALIDA BORDE_Y VIROLA_Y1 BASE_Y0

- MASCARA: recorte del mate (rembg, birefnet-general).
- BORDE_Y: fila del borde de arriba de la virola. Lo que asome por encima
  (el film arrugado en la boca) se corta.
- VIROLA_Y1: fila donde termina la virola. Hasta ahí el film le da un tinte
  azul a la alpaca: se le saca el color (el metal es plateado) y se conserva
  el cincelado tal cual.
- BASE_Y0: fila donde empieza la base de metal. Ahí el film está arrugado:
  el anillo es liso, así que se suaviza (metal pulido) y se le saca el
  color. En la madera, las líneas largas, finas y claras del film se
  rellenan con la madera de alrededor; la veta no se toca.

El contorno se hace simétrico (el mate lo es) tomando en cada fila el lado
más angosto: así se van las solapas de film que sobresalen. La madera, el
cincelado y la forma son los de la foto.
"""

import sys

import cv2
import numpy as np


def main():
    src, mask_path, out_path = sys.argv[1:4]
    borde_y, virola_y1, base_y0 = (int(v) for v in sys.argv[4:7])
    im = cv2.imread(src)
    h, w = im.shape[:2]
    m = cv2.imread(mask_path, 0)
    m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)

    # --- Contorno: sin lo que asoma arriba y simétrico -------------------
    duro = m > 128
    duro[:borde_y] = False
    filas = np.where(duro.any(axis=1))[0]
    cuerpo = [y for y in filas if virola_y1 < y < base_y0]
    cx = np.mean([(np.where(duro[y])[0].min() + np.where(duro[y])[0].max()) / 2 for y in cuerpo])
    sil = np.zeros((h, w), np.uint8)
    for y in filas:
        xs = np.where(duro[y])[0]
        r = min(cx - xs.min(), xs.max() - cx)
        sil[y, int(round(cx - r)) : int(round(cx + r)) + 1] = 255
    # Suavizar el contorno (sin escalones entre filas) y un borde de 1 px.
    sil = cv2.GaussianBlur(sil, (0, 0), 2)
    sil = (sil > 127).astype(np.uint8) * 255
    alfa = cv2.GaussianBlur(cv2.erode(sil, np.ones((3, 3), np.uint8)), (0, 0), 1.2).astype(np.float32) / 255

    out = im.copy()
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV).astype(np.float32)

    # --- Virola: sin el tinte azul del film --------------------------------
    hv = hsv.copy()
    hv[borde_y:virola_y1, :, 1] *= 0.1
    # Sobre fondo blanco la alpaca se ve apagada: un poco más de luz.
    hv[borde_y:virola_y1, :, 2] *= 1.12
    gris = cv2.cvtColor(np.clip(hv, 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)
    # Transición suave hacia la madera.
    k = np.zeros(h, np.float32)
    k[borde_y:virola_y1] = 1
    k = np.convolve(k, np.ones(9, np.float32) / 9, mode="same")[:, None, None]
    out = (out * (1 - k) + gris * k).astype(np.uint8)

    # --- Borde de abajo de la madera: líneas claras del film ----------------
    lum = cv2.cvtColor(out, cv2.COLOR_BGR2GRAY)
    brillo = cv2.morphologyEx(lum, cv2.MORPH_TOPHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))
    zona = np.zeros((h, w), bool)
    zona[virola_y1 + 6 : base_y0] = True
    cand = ((brillo > 16) & zona & (cv2.erode(sil, np.ones((9, 9), np.uint8)) > 0)).astype(np.uint8) * 255
    # Sólo las líneas largas y finas (el film); los puntos claros cortos son
    # la veta de la madera y quedan.
    n, lab, st, _ = cv2.connectedComponentsWithStats(cand)
    lineas = np.zeros_like(cand)
    for i in range(1, n):
        largo = max(st[i, cv2.CC_STAT_WIDTH], st[i, cv2.CC_STAT_HEIGHT])
        if largo >= 35 and st[i, cv2.CC_STAT_AREA] <= largo * 4:
            lineas[lab == i] = 255
    lineas = cv2.dilate(lineas, np.ones((3, 3), np.uint8))
    out = cv2.inpaint(out, lineas, 4, cv2.INPAINT_TELEA)

    # --- Base de metal: sin arrugas ni color ------------------------------
    base = out[base_y0:].copy()
    # El anillo es liso: un suavizado fuerte deja el brillo del metal pulido
    # y borra las arrugas del film, con un grano leve para que no quede
    # plástico.
    mediana = cv2.GaussianBlur(base, (0, 0), sigmaX=10, sigmaY=5)
    rng = np.random.default_rng(5)
    mediana = np.clip(mediana + rng.normal(0, 2.5, mediana.shape), 0, 255).astype(np.uint8)
    hb = cv2.cvtColor(mediana, cv2.COLOR_BGR2HSV).astype(np.float32)
    hb[..., 1] *= 0.15
    mediana = cv2.cvtColor(np.clip(hb, 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)
    t = np.clip((np.arange(h - base_y0) - 6) / 12, 0, 1)[:, None, None]
    out[base_y0:] = (base * (1 - t) + mediana * t).astype(np.uint8)

    # --- Luz: un poco más clara y pareja, como de estudio -------------------
    f = out.astype(np.float32) / 255
    f = np.clip(f * 1.08 + 0.015, 0, 1)
    out = (f * 255).astype(np.uint8)

    # --- Composición sobre blanco, 2000x2000 ---------------------------------
    ys, xs = np.where(alfa > 0.5)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    lado = 2000
    alto = int(lado * 0.72)
    esc = alto / (y1 - y0 + 1)
    recorte = out[y0 : y1 + 1, x0 : x1 + 1]
    a = alfa[y0 : y1 + 1, x0 : x1 + 1]
    nw, nh = int((x1 - x0 + 1) * esc), alto
    recorte = cv2.resize(recorte, (nw, nh), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
    a = cv2.resize(a, (nw, nh), interpolation=cv2.INTER_LINEAR)[..., None]

    lienzo = np.full((lado, lado, 3), 255, np.float32)
    px, py = (lado - nw) // 2, int(lado * 0.15)
    # Sombra de apoyo, blanda, bajo la base.
    sombra = np.zeros((lado, lado), np.float32)
    cv2.ellipse(sombra, (lado // 2, py + nh - 14), (int(nw * 0.3), 14), 0, 0, 360, 0.5, -1)
    sombra = cv2.GaussianBlur(sombra, (0, 0), 10)
    amplia = np.zeros((lado, lado), np.float32)
    cv2.ellipse(amplia, (lado // 2, py + nh - 6), (int(nw * 0.45), 30), 0, 0, 360, 0.16, -1)
    sombra = np.maximum(sombra, cv2.GaussianBlur(amplia, (0, 0), 30))
    lienzo *= 1 - sombra[..., None]
    reg = lienzo[py : py + nh, px : px + nw]
    reg[:] = reg * (1 - a) + recorte * a
    cv2.imwrite(out_path, np.clip(lienzo, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])


if __name__ == "__main__":
    main()
