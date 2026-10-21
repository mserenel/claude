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
- La mesa de la foto pasa a ser un piso blanco y el mate queda apoyado
  donde estaba: una sombra de contacto justo donde la base o cada pata
  tocan la mesa (sale de la forma real del recorte en esa franja) y una
  sombra amplia y suave bajo el cuerpo. El producto no se toca: ni forma ni
  color.
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
    cx = (x0 + x1) / 2

    # --- Piso blanco, con el mate apoyado ---------------------------------
    # Dónde toca la mesa: el perfil de abajo del mate (la fila más baja de
    # cada columna) y su envolvente convexa por debajo. Lo que cae sobre la
    # envolvente apoya (cada pata, o todo el borde de una base plana); lo que
    # queda por encima (las chapas de las esquinas, la panza entre las patas)
    # está en el aire.
    alto_pie = int(0.25 * ph)
    perfil = {}
    for x in range(x0, x1 + 1):
        col = np.where(lleno[:, x] > 0)[0]
        if col.size and col.max() > y1 - alto_pie:
            perfil[x] = col.max()
    xs_p = sorted(perfil)
    casco = []
    for x in xs_p:
        while len(casco) >= 2:
            (ax, ay), (bx, by) = casco[-2], casco[-1]
            # En coordenadas de imagen (y hacia abajo): sacar b si queda por
            # encima de la recta a-x.
            if (bx - ax) * (perfil[x] - ay) - (by - ay) * (x - ax) >= 0:
                casco.pop()
            else:
                break
        casco.append((x, perfil[x]))
    cx_c, cy_c = zip(*casco)
    piso_y = np.interp(xs_p, cx_c, cy_c)
    tol = max(2, 0.005 * ph)
    apoya = [x for x, py in zip(xs_p, piso_y) if py - perfil[x] <= tol]

    # Sombra de contacto: ceñida y oscura justo donde apoya; una segunda,
    # algo más abierta, para que no quede una línea dura.
    contacto = np.zeros((h, w), np.float32)
    for x in apoya:
        contacto[perfil[x] - 2 : perfil[x] + max(2, int(0.004 * ph)), x] = 1
    ceñida = np.clip(cv2.GaussianBlur(contacto, (0, 0), 0.004 * ph) * 3, 0, 1)
    abierta = np.clip(cv2.GaussianBlur(contacto, (0, 0), 0.012 * ph) * 2, 0, 1)

    # Bajo el cuerpo: el piso entre las patas (entre la panza y la línea de
    # apoyo) está a la sombra, y la sombra apenas se asoma hacia adelante.
    bajo = np.zeros((h, w), np.float32)
    a0, a1 = min(apoya), max(apoya)
    for x, py in zip(xs_p, piso_y):
        if a0 <= x <= a1:
            bajo[perfil[x] : int(py) + 1, x] = 1
            n_caida = int(0.04 * ph)
            bajo[int(py) + 1 : int(py) + 1 + n_caida, x] = np.linspace(1, 0, n_caida)
    bajo = cv2.GaussianBlur(bajo, (0, 0), sigmaX=0.012 * ph, sigmaY=0.008 * ph)
    piso = 1 - np.clip(0.55 * ceñida + 0.22 * abierta + 0.3 * bajo, 0, 0.75)

    comp = 255 * piso[..., None] * (1 - alfa[..., None]) + limpio.astype(np.float32) * alfa[..., None]

    # --- Encuadre cuadrado: el mate al mismo alto en todas -------------------
    esc = min(LADO * ALTO / ph, LADO * 0.78 / pw)
    lado_src = LADO / esc
    cx0 = int(round(cx - lado_src / 2))
    cy0 = int(round(y1 - (1 - MARGEN_ABAJO) * lado_src))
    n = int(round(lado_src))
    lienzo = np.full((n, n, 3), 255, np.float32)
    sx0, sy0 = max(cx0, 0), max(cy0, 0)
    sx1, sy1 = min(cx0 + n, w), min(cy0 + n, h)
    # Fuera de la foto también es piso blanco; dentro, el piso y el mate.
    lienzo[sy0 - cy0 : sy1 - cy0, sx0 - cx0 : sx1 - cx0] = comp[sy0:sy1, sx0:sx1]
    out = cv2.resize(lienzo, (LADO, LADO), interpolation=cv2.INTER_LANCZOS4)
    cv2.imwrite(out_path, np.clip(out, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])


if __name__ == "__main__":
    main()
