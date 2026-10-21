"""Foto de producto sobre fondo blanco, para la tienda.

Uso:
  python fondo_blanco.py FOTO MASCARA SALIDA

- MASCARA: recorte del producto (rembg, birefnet-general).
- Salida cuadrada de 2000x2000, blanco puro, el producto centrado y siempre
  al mismo alto (o ancho, si es más ancho que alto), para que la tienda se
  vea pareja.
- El borde se limpia: se achica 1 px y se suaviza, y en esa franja el color
  se toma del interior del producto, para que no quede el halo oscuro de la
  mesa.
- La sombra sale de la huella real del producto (la última franja del
  recorte: patas, base), aplastada y difuminada, más una sombra amplia y
  tenue. El producto no se toca: ni forma ni color.
"""

import sys

import cv2
import numpy as np

LADO = 2000
ALTO = 0.70  # fracción del lado que ocupa el producto
MARGEN_ABAJO = 0.17


def main():
    src, mask_path, out_path = sys.argv[1:4]
    im = cv2.imread(src)
    h, w = im.shape[:2]
    m = cv2.imread(mask_path, 0)
    m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)

    # Una sola pieza: la mancha más grande (fuera reflejos sueltos).
    duro = (m > 128).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(duro)
    duro = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8) * 255
    cont, _ = cv2.findContours(duro, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    lleno = np.zeros_like(duro)
    cv2.drawContours(lleno, cont, -1, 255, -1)
    interior = cv2.erode(lleno, np.ones((3, 3), np.uint8))
    alfa = cv2.GaussianBlur(interior, (0, 0), 1.0).astype(np.float32) / 255

    # Borde sin halo: en la franja del borde, el color del interior cercano.
    adentro = cv2.erode(lleno, np.ones((9, 9), np.uint8))
    franja = (interior > 0) & (adentro == 0)
    relleno = cv2.inpaint(im, franja.astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA)
    limpio = im.copy()
    limpio[franja] = (im[franja] * 0.4 + relleno[franja] * 0.6).astype(np.uint8)

    ys, xs = np.where(alfa > 0.05)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    pw, ph = x1 - x0 + 1, y1 - y0 + 1
    esc = min(LADO * ALTO / ph, LADO * 0.78 / pw)
    nw, nh = int(pw * esc), int(ph * esc)
    prod = cv2.resize(limpio[y0 : y1 + 1, x0 : x1 + 1], (nw, nh), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
    a = cv2.resize(alfa[y0 : y1 + 1, x0 : x1 + 1], (nw, nh), interpolation=cv2.INTER_LINEAR)[..., None]

    lienzo = np.full((LADO, LADO, 3), 255, np.float32)
    px = (LADO - nw) // 2
    py = int(LADO * (1 - MARGEN_ABAJO)) - nh

    # Sombra de la huella: la franja de abajo del recorte, aplastada.
    huella = (a[..., 0] > 0.5).astype(np.float32)
    alto_h = max(4, int(nh * 0.035))
    pie = huella[nh - alto_h :]
    sombra = np.zeros((LADO, LADO), np.float32)
    pie_pl = cv2.resize(pie, (nw, max(2, alto_h // 2)), interpolation=cv2.INTER_AREA)
    yb = py + nh - pie_pl.shape[0] // 2
    sombra[yb : yb + pie_pl.shape[0], px : px + nw] = np.maximum(sombra[yb : yb + pie_pl.shape[0], px : px + nw], pie_pl * 0.55)
    sombra = cv2.GaussianBlur(sombra, (0, 0), 9)
    amplia = np.zeros((LADO, LADO), np.float32)
    cv2.ellipse(amplia, (LADO // 2, py + nh - 4), (int(nw * 0.46), max(14, int(nh * 0.03))), 0, 0, 360, 0.16, -1)
    sombra = np.maximum(sombra, cv2.GaussianBlur(amplia, (0, 0), 28))
    lienzo *= 1 - sombra[..., None]

    reg = lienzo[py : py + nh, px : px + nw]
    reg[:] = reg * (1 - a) + prod * a
    cv2.imwrite(out_path, np.clip(lienzo, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])


if __name__ == "__main__":
    main()
