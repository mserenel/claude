# Recorta a Don Patricio de su fondo crema liso: el fondo es lo que tiene
# color de fondo y está conectado al borde de arriba o a los costados, sin
# cruzar las líneas de tinta.
import sys, numpy as np, cv2
from scipy import ndimage as ndi
src, out, tol = sys.argv[1], sys.argv[2], float(sys.argv[3])
im = cv2.imread(src)
lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
h, w = im.shape[:2]
ref = np.median(np.concatenate([lab[:8].reshape(-1, 3), lab[:400, :6].reshape(-1, 3), lab[:400, -6:].reshape(-1, 3)]), 0)
d = np.linalg.norm(lab - ref, axis=2)
cand = d < tol
cand = ndi.binary_opening(cand, iterations=1)
labels, n = ndi.label(cand)
seeds = set(np.unique(labels[0])) | set(np.unique(labels[: int(h * 0.55), 0])) | set(np.unique(labels[: int(h * 0.55), -1]))
seeds.discard(0)
bg = np.isin(labels, list(seeds))
# Sin agujeritos sueltos dentro del personaje.
fg = ndi.binary_fill_holes(~bg)
# Zonas que no tocan el borde de arriba (rincones de abajo, huecos entre
# brazo y cuerpo): son fondo sólo si tienen exactamente su color. La camisa y
# el bigote, de un crema parecido, son un poco más claros (distancia > 3).
sizes = ndi.sum(cand, labels, range(n + 1))
means = ndi.mean(d, labels, range(n + 1))
for i in range(1, n + 1):
    if i not in seeds and sizes[i] > 1500 and means[i] < 2.8:
        fg &= labels != i
bg = ~fg
# Borde suave de 1-2 px que se come el halo crema del antialias.
fg = cv2.erode(fg.astype(np.uint8) * 255, np.ones((2, 2), np.uint8))
alpha = cv2.GaussianBlur(fg, (0, 0), 0.8)
rgba = np.dstack([im, alpha])
cv2.imwrite(out, rgba)
print(src.split('/')[-1], 'n', n, 'bg%', round(bg.mean() * 100, 1))
