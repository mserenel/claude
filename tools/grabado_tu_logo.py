"""El mate grabado visto desde arriba, con "TU LOGO" en lugar de los logos de
los clientes: cada grabado original se borra rellenando el metal con el de
los costados (mismo radio, en coordenadas polares alrededor de la boca) y el
texto se graba curvado con el aro, oscuro como el original y con un filo de
luz abajo.

Uso:
  python grabado_tu_logo.py FOTO FUENTE.otf SALIDA.png
"""

import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Centro de la boca y radio donde va el texto, en la foto original.
CX, CY = 467.0, 818.0
R_TEXTO = 372.0
# Los grabados a borrar: ángulos (grados, 0 a la derecha, -90 arriba) y radios.
GRABADOS = [
    (-114, -64, 338, 414),  # arriba
    (-14, 14, 295, 420),  # derecha
    (164, 196, 298, 420),  # izquierda
    (56, 124, 322, 378),  # abajo
]


def polar(a, t0, t1, r0, r1, escala=2.0):
    # Muestreo del sector: columnas = ángulo, filas = radio (fila 0 afuera),
    # con la misma escala a lo ancho que a lo alto (en el radio del texto).
    W = int(escala * R_TEXTO * (t1 - t0))
    H = int(escala * (r1 - r0))
    TH, RR = np.meshgrid(np.linspace(t0, t1, W), np.linspace(r1, r0, H))
    mx = (CX + RR * np.cos(TH)).astype(np.float32)
    my = (CY + RR * np.sin(TH)).astype(np.float32)
    return cv2.remap(a, mx, my, cv2.INTER_CUBIC), W, H


def volver(a, G, cambio, t0, t1, r0, r1):
    # De vuelta a la foto, sólo donde cambió algo.
    H, W = G.shape[:2]
    X, Y = np.meshgrid(np.arange(a.shape[1]), np.arange(a.shape[0]))
    TT = np.mod(np.arctan2(Y - CY, X - CX) - t0, 2 * np.pi)
    R = np.hypot(X - CX, Y - CY)
    u = (TT / (t1 - t0) * (W - 1)).astype(np.float32)
    v = ((r1 - R) / (r1 - r0) * (H - 1)).astype(np.float32)
    dentro = (u >= 0) & (u <= W - 1) & (v >= 0) & (v <= H - 1)
    Gb = cv2.remap(G, u, v, cv2.INTER_LINEAR)
    Cb = cv2.remap(cambio, u, v, cv2.INTER_LINEAR) * dentro
    return a * (1 - Cb[..., None]) + Gb * Cb[..., None]


def borrar(a, d0, d1, q0, q1, margen=10):
    # El sector con un margen alrededor; el grabado se rellena fila por fila
    # interpolando entre los costados limpios.
    t0, t1 = np.radians(d0 - margen), np.radians(d1 + margen)
    r0, r1 = q0 - 6, q1 + 6
    P, W, H = polar(a, t0, t1, r0, r1)
    m = np.zeros((H, W), bool)
    c0 = int(margen / (d1 - d0 + 2 * margen) * W)
    m[12:-12, c0 : W - c0] = True
    F = P.copy()
    xs = np.arange(W)
    for y in range(H):
        if m[y].any():
            ok = ~m[y]
            for c in range(3):
                F[y, :, c] = np.interp(xs, xs[ok], P[y, ok, c])
    ruido = np.random.default_rng(1).normal(0, 2.2, (H, W)).astype(np.float32)
    F = np.where(m[..., None], F + cv2.GaussianBlur(ruido, (0, 0), 0.7)[..., None], F)
    cambio = np.clip(cv2.GaussianBlur(m.astype(np.float32), (0, 0), 3) * 2, 0, 1)
    return volver(a, F, cambio, t0, t1, r0, r1)


def grabar(a, fuente, txt, tam, esp):
    t0, t1 = np.radians(-125), np.radians(-55)
    r0, r1 = 300.0, 445.0
    P, W, H = polar(a, t0, t1, r0, r1)
    img = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(fuente, tam)
    anchos = [d.textlength(ch, font=f) for ch in txt]
    x = W / 2 - (sum(anchos) + esp * (len(txt) - 1)) / 2
    for ch, w in zip(txt, anchos):
        d.text((x, (r1 - R_TEXTO) * 2), ch, font=f, fill=255, anchor="lm")
        x += w + esp
    T = cv2.GaussianBlur(np.asarray(img).astype(np.float32) / 255, (0, 0), 0.9)
    fondo = np.array([46, 46, 48], np.float32)
    filo = np.clip(np.roll(T, 3, axis=0) - T, 0, 1)
    G = P * (1 - T[..., None]) + fondo * T[..., None] + filo[..., None] * 35
    cambio = np.clip(cv2.GaussianBlur(T, (0, 0), 2) * 3, 0, 1)
    return volver(a, G, cambio, t0, t1, r0, r1)


def main():
    src, fuente, out = sys.argv[1:4]
    a = cv2.imread(src).astype(np.float32)
    for g in GRABADOS:
        a = borrar(a, *g)
    a = grabar(a, fuente, "TU LOGO", 128, 14)
    cv2.imwrite(out, np.clip(a, 0, 255).astype(np.uint8))


if __name__ == "__main__":
    main()
