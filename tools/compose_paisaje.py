"""Apoya una foto de estudio del mate (recortada con ISNet) sobre la mesa de
madera de una foto de campo con niebla, para la historia de Instagram.

Uso:
  python compose_paisaje.py ESCENA PRODUCTO MASCARA SALIDA

- ESCENA: la foto de campo (9:16). Se le borran el mate, la bombilla y los
  textos que tenía (zonas medidas a 1080x1920, abajo).
- PRODUCTO / MASCARA: la foto de estudio y su máscara (rembg, isnet).

El mate no se redibuja: son los píxeles reales de la foto de estudio,
escalados con Lanczos. Solo se ajusta la luz al día nublado de la escena
(menos contraste, un poco más frío) y se le suma la sombra de apoyo y un
reflejo tenue en la mesa barnizada.
"""

import sys

import cv2
import numpy as np

W, H = 1080, 1920

# Zonas a borrar en la escena (1080x1920).
TEXTO = (190, 330, 900, 770)  # x0, y0, x1, y1
BOMBILLA = (620, 570, 1075, 940)
MATE = (150, 890, 870, 1760)  # incluye su reflejo, hasta el canto de la mesa
MESA_Y = 1395  # borde de atrás de la mesa

# Dónde va el mate nuevo: centro, base (donde apoya) y alto.
CX, BASE_Y, ALTO = 540, 1540, 760


def borrar(plate):
    hole = np.zeros((H, W), np.uint8)
    for x0, y0, x1, y1 in (TEXTO, BOMBILLA, MATE):
        hole[y0:y1, x0:x1] = 255

    # Campo y niebla (desenfocados): inpaint a baja resolución, sólo con
    # píxeles de arriba de la mesa, suavizado y fundido con borde blando.
    campo = plate[:MESA_Y]
    hc = hole[:MESA_Y]
    sw, sh = W // 8, MESA_Y // 8
    small = cv2.resize(campo, (sw, sh), interpolation=cv2.INTER_AREA)
    hs = cv2.resize(hc, (sw, sh), interpolation=cv2.INTER_NEAREST)
    hs = cv2.dilate(hs, np.ones((3, 3), np.uint8))
    filled = cv2.inpaint(small, hs, 6, cv2.INPAINT_TELEA)
    filled = cv2.GaussianBlur(filled, (0, 0), 2.5)
    filled = cv2.resize(filled, (W, MESA_Y), interpolation=cv2.INTER_CUBIC)
    a = cv2.dilate(hc, np.ones((31, 31), np.uint8)).astype(np.float32) / 255
    a = cv2.GaussianBlur(a, (0, 0), 14)[..., None]
    out = plate.astype(np.float32)
    out[:MESA_Y] = campo * (1 - a) + filled * a

    # Mesa: la luz de fondo sale de un inpaint suave (sin saltos de brillo)
    # y encima va sólo la veta fina, que es horizontal: cada fila toma la
    # textura de la misma fila de los costados, en espejo.
    x0, y0, x1, y1 = MATE
    ancho = x1 - x0
    mesa = plate[MESA_Y:].astype(np.float32)
    hm = hole[MESA_Y:]
    mh = H - MESA_Y
    # Luz de fondo: en cada fila, del tono de la izquierda al de la derecha
    # (promedios de 40 px a cada lado del hueco), suavizado en vertical.
    izq_m = mesa[:, x0 - 40 : x0].mean(axis=1)
    der_m = mesa[:, x1 : x1 + 40].mean(axis=1)
    izq_m = cv2.GaussianBlur(izq_m[:, None, :], (0, 0), 6)[:, 0]
    der_m = cv2.GaussianBlur(der_m[:, None, :], (0, 0), 6)[:, 0]
    tt = np.linspace(0, 1, ancho, dtype=np.float32)[None, :, None]
    lf = mesa.copy()
    lf[:, x0:x1] = izq_m[:, None] * (1 - tt) + der_m[:, None] * tt
    hf_src = mesa - cv2.GaussianBlur(mesa, (0, 0), 6)
    t = np.linspace(0, 1, ancho, dtype=np.float32)[:, None]
    detalle = np.zeros_like(mesa)
    for y in range(mh):
        izq = hf_src[y, max(0, x0 - ancho // 2) : x0][::-1]
        der = hf_src[y, x1 : min(W, x1 + ancho // 2)]
        a_ = np.resize(izq, (ancho, 3))
        b_ = np.resize(der[::-1], (ancho, 3))[::-1]
        detalle[y, x0:x1] = a_ * (1 - t) + b_ * t
    relleno = lf + detalle
    am = (hm > 0).astype(np.float32)
    am = cv2.GaussianBlur(am, (0, 0), 18)
    am = np.clip(am * 2, 0, 1)[..., None]
    out[MESA_Y:] = mesa * (1 - am) + relleno * am
    # El borde de atrás de la mesa no está a la misma altura a cada lado del
    # hueco: en las esquinas del relleno queda un escalón, que se suaviza.
    for xe in (x0, x1):
        zona = out[MESA_Y - 20 : MESA_Y + 60, xe - 40 : xe + 40]
        out[MESA_Y - 20 : MESA_Y + 60, xe - 40 : xe + 40] = cv2.GaussianBlur(zona, (0, 0), 6)
    # Costura suave entre el campo y la mesa.
    out[MESA_Y - 4 : MESA_Y + 4] = cv2.GaussianBlur(out[MESA_Y - 4 : MESA_Y + 4], (0, 0), 1.5)
    # Cerca de la última fila borrada, la mesa vuelve de a poco.
    return np.clip(out, 0, 255).astype(np.uint8)


def mate(prod_path, mask_path):
    im = cv2.imread(prod_path)
    m = cv2.imread(mask_path, 0)
    m = cv2.resize(m, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_LINEAR)
    ys, xs = np.where(m > 128)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    im, m = im[y0 : y1 + 1, x0 : x1 + 1], m[y0 : y1 + 1, x0 : x1 + 1]
    k = ALTO / im.shape[0]
    size = (round(im.shape[1] * k), ALTO)
    im = cv2.resize(im, size, interpolation=cv2.INTER_LANCZOS4)
    m = cv2.resize(m, size, interpolation=cv2.INTER_LANCZOS4)
    # Sin el halo blanco del fondo de estudio.
    m = cv2.erode(m, np.ones((3, 3), np.uint8))
    m = cv2.GaussianBlur(m, (0, 0), 1.0).astype(np.float32) / 255
    # La escena es algo más blanda que la foto de estudio.
    im = cv2.GaussianBlur(im, (0, 0), 0.7)

    # Luz de día nublado: menos contraste, sombras un poco más abiertas y
    # algo más frío y menos saturado, como la mesa de la escena.
    f = im.astype(np.float32) / 255
    f = 0.5 + (f - 0.5) * 0.9
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
    hsv[..., 1] *= 0.9
    f = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    f *= np.array([1.03, 1.0, 0.96], np.float32)  # BGR
    # Más oscuro hacia abajo: la luz viene del cielo.
    g = np.linspace(1.0, 0.82, f.shape[0], dtype=np.float32)[:, None, None]
    f = np.clip(f * g, 0, 1)
    return (f * 255).astype(np.float32), m


def main():
    escena, prod, mask, out_path = sys.argv[1:5]
    plate = cv2.imread(escena)
    plate = cv2.resize(plate, (W, H), interpolation=cv2.INTER_AREA)
    base = borrar(plate).astype(np.float32)

    im, m = mate(prod, mask)
    h, w = m.shape
    x0, y0 = CX - w // 2, BASE_Y - h

    # Sombra de apoyo: una elipse oscura y blanda bajo las patas, y una
    # sombra más ancha y tenue (luz difusa del cielo).
    sombra = np.zeros((H, W), np.float32)
    cv2.ellipse(sombra, (CX, BASE_Y - 6), (int(w * 0.36), 22), 0, 0, 360, 0.55, -1)
    sombra = cv2.GaussianBlur(sombra, (0, 0), 9)
    amplia = np.zeros((H, W), np.float32)
    cv2.ellipse(amplia, (CX, BASE_Y + 10), (int(w * 0.62), 60), 0, 0, 360, 0.3, -1)
    sombra = np.maximum(sombra, cv2.GaussianBlur(amplia, (0, 0), 30))
    base *= 1 - sombra[..., None]

    # Reflejo tenue en la mesa barnizada: el mate dado vuelta, borroso y
    # apagado, que se desvanece en ~120 px.
    refl_h = min(160, H - BASE_Y)
    r_im = im[::-1][:refl_h]
    r_m = m[::-1][:refl_h] * np.linspace(0.22, 0, refl_h, dtype=np.float32)[:, None]
    r_im = cv2.GaussianBlur(r_im, (0, 0), 4)
    reg = base[BASE_Y : BASE_Y + refl_h, x0 : x0 + w]
    reg[:] = reg * (1 - r_m[..., None]) + r_im * r_m[..., None]

    reg = base[y0:BASE_Y, x0 : x0 + w]
    reg[:] = reg * (1 - m[..., None]) + im * m[..., None]

    # Un grano parejo en toda la imagen, para que el mate y la escena
    # compartan textura.
    rng = np.random.default_rng(7)
    base += rng.normal(0, 2.2, base.shape).astype(np.float32)
    cv2.imwrite(out_path, np.clip(base, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])


if __name__ == "__main__":
    main()
