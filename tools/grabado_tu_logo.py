"""El mate grabado visto desde arriba, con "TU LOGO" en lugar del logo del
cliente: el grabado original se borra rellenando el metal con el de los
costados (mismo radio, en coordenadas polares) y el texto se graba curvado
con el aro, oscuro como el original y con un filo de luz abajo.

Uso:
  python grabado_tu_logo.py FOTO FUENTE.otf SALIDA.png
"""

import sys
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont

src, fuente, out = sys.argv[1:4]
a = cv2.imread(src).astype(np.float32)
cx, cy = 467.0, 818.0
t0, t1 = np.radians(-125), np.radians(-55)   # sector de arriba
r0, r1 = 300.0, 445.0
H = 290                                       # muestreo polar (2x)
W = int(2 * 368 * (t1 - t0))                  # igual escala a lo ancho
th = np.linspace(t0, t1, W)
rr = np.linspace(r1, r0, H)                    # fila 0 = radio mayor (afuera)
TH, RR = np.meshgrid(th, rr)
mx = (cx + RR * np.cos(TH)).astype(np.float32)
my = (cy + RR * np.sin(TH)).astype(np.float32)
P = cv2.remap(a, mx, my, cv2.INTER_CUBIC)
g = cv2.cvtColor(P.astype(np.uint8), cv2.COLOR_BGR2GRAY)
# El logo: lo oscuro dentro de la franja del aro donde está grabado.
rad = lambda r: int((r1 - r) / (r1 - r0) * (H - 1))
ang = lambda d: int((np.radians(d) - t0) / (t1 - t0) * (W - 1))
zona = np.zeros_like(g, bool)
zona[rad(412):rad(325), ang(-112):ang(-66)] = True
m = zona
# Relleno: cada fila (mismo radio) se interpola entre los ángulos de los
# costados, donde el metal está limpio.
F = P.copy()
xs = np.arange(W)
for y in range(H):
    if m[y].any():
        ok = ~m[y]
        for c in range(3):
            F[y, :, c] = np.interp(xs, xs[ok], P[y, ok, c])
# Un poco del grano del metal, como el de la foto.
ruido = cv2.GaussianBlur(np.random.default_rng(1).normal(0, 2.2, (H, W)).astype(np.float32), (0, 0), 0.7)
F = np.where(m[..., None], F + ruido[..., None], F)
# El texto, en el espacio polar (derecho), y después curvado con el aro.
img = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(img)
f = ImageFont.truetype(fuente, 106)
txt = "TU LOGO"
esp = 12
anchos = [d.textlength(ch, font=f) for ch in txt]
total = sum(anchos) + esp * (len(txt) - 1)
x = (ang(-112) + ang(-66)) / 2 - total / 2
ybase = rad(368)
for ch, w in zip(txt, anchos):
    d.text((x, ybase), ch, font=f, fill=255, anchor="lm")
    x += w + esp
T = np.asarray(img).astype(np.float32) / 255
T = cv2.GaussianBlur(T, (0, 0), 0.9)
# Grabado: el fondo del surco oscuro como el del original, con un filo de
# luz abajo (el borde del corte que agarra la luz).
fondo = np.array([46, 46, 48], np.float32)
filo = np.clip(np.roll(T, 3, axis=0) - T, 0, 1)
G = F * (1 - T[..., None]) + fondo * T[..., None]
G = G + filo[..., None] * 35
# Volver a la foto: sólo donde cambió algo, con borde suave.
cambio = np.clip(cv2.GaussianBlur(np.maximum(m.astype(np.float32), T), (0, 0), 3) * 3, 0, 1)
X, Y = np.meshgrid(np.arange(a.shape[1]), np.arange(a.shape[0]))
TT = np.arctan2(Y - cy, X - cx)
R = np.hypot(X - cx, Y - cy)
u = ((TT - t0) / (t1 - t0) * (W - 1)).astype(np.float32)
v = ((r1 - R) / (r1 - r0) * (H - 1)).astype(np.float32)
dentro = (u >= 0) & (u <= W - 1) & (v >= 0) & (v <= H - 1)
Gb = cv2.remap(G, u, v, cv2.INTER_LINEAR)
Cb = cv2.remap(cambio, u, v, cv2.INTER_LINEAR) * dentro
res = a * (1 - Cb[..., None]) + Gb * Cb[..., None]
cv2.imwrite(out, np.clip(res, 0, 255).astype(np.uint8))
