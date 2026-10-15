# Corrige la luz de una foto de producto sobre fondo claro, sin tocar la forma:
# sólo tonos. El producto (máscara del segmentador, con borde suavizado) y el
# fondo se ajustan por separado.
#   fondo: se empareja la luz (sin la viñeta ni el degradé de la toma) y se
#          lleva a un gris claro neutro; las sombras chicas, como la de
#          apoyo, se mantienen.
#   producto: se levantan las sombras para que se vea el cuero, más contraste
#             local para los grabados del metal y el metal un poco menos
#             amarillo, para que se vea plateado.
# Uso: python luz_producto.py FOTO MASCARA SALIDA
import sys
import cv2
import numpy as np

src, mask_path, out = sys.argv[1:4]
im = cv2.imread(src).astype(np.float32) / 255
h, w = im.shape[:2]
m = cv2.imread(mask_path, 0).astype(np.float32) / 255
m = cv2.GaussianBlur(m, (0, 0), 1.5)
m3 = m[..., None]

# --- Fondo: luz pareja y neutra ---------------------------------------------
small = cv2.resize(im, (w // 8, h // 8), interpolation=cv2.INTER_AREA)
ms = cv2.resize((m > 0.05).astype(np.uint8), (w // 8, h // 8), interpolation=cv2.INTER_NEAREST)
ms = cv2.dilate(ms, np.ones((5, 5), np.uint8))
bg_small = cv2.inpaint((small * 255).astype(np.uint8), ms, 15, cv2.INPAINT_TELEA).astype(np.float32) / 255
# Cerca del producto, sólo el degradé grande (~240 px), para no borrar la
# sombra de apoyo. Lejos (arriba), también las manchas de luz del fondo.
grande = cv2.GaussianBlur(bg_small, (0, 0), 30)
fino = cv2.GaussianBlur(bg_small, (0, 0), 6)
dist = cv2.distanceTransform((1 - ms).astype(np.uint8), cv2.DIST_L2, 5)
lejos = np.clip((dist - 6) / 14, 0, 1)[..., None]
illum = fino * lejos + grande * (1 - lejos)
illum = cv2.resize(illum, (w, h), interpolation=cv2.INTER_CUBIC)
objetivo = np.array([0.935, 0.935, 0.935], np.float32)  # gris muy claro neutro
fondo = np.clip(im * (objetivo / np.maximum(illum, 0.2)), 0, 1)

# --- Producto -----------------------------------------------------------------
lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB)
L = lab[..., 0] / 100
# Levanta las sombras (el cuero negro) sin lavar los negros del todo.
Ls = np.where(L < 0.5, 0.5 * (2 * L) ** 0.58, L)
# Contraste local suave: grano del cuero y grabado del metal.
L8 = (np.clip(Ls, 0, 1) * 255).astype(np.uint8)
clahe = cv2.createCLAHE(clipLimit=1.6, tileGridSize=(8, 8)).apply(L8).astype(np.float32) / 255
Lp = 0.55 * Ls + 0.45 * clahe
lab_p = lab.copy()
lab_p[..., 0] = np.clip(Lp, 0, 1) * 100
# Metal menos amarillo (alpaca): baja el croma en las zonas claras y poco
# saturadas del producto. Lo que tiene color propio (el interior de la
# calabaza, croma > 30) no se toca.
croma = np.hypot(lab[..., 1], lab[..., 2])
claro = np.clip((L - 0.25) / 0.3, 0, 1) * (1 - np.clip((croma - 18) / 12, 0, 1))
lab_p[..., 1] *= 1 - 0.35 * claro
lab_p[..., 2] *= 1 - 0.45 * claro
prod = cv2.cvtColor(lab_p, cv2.COLOR_LAB2BGR)
# Nitidez fina, sólo en el producto.
blur = cv2.GaussianBlur(prod, (0, 0), 1.2)
prod = np.clip(prod + 0.6 * (prod - blur), 0, 1)

res = prod * m3 + fondo * (1 - m3)
cv2.imwrite(out, (np.clip(res, 0, 1) * 255 + 0.5).astype(np.uint8))
