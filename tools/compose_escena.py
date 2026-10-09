"""Compone el giro del mate (recortado cuadro a cuadro) sobre la escena real.

Uso:
  python compose_escena.py FRAMES_DIR MASKS_DIR ESCENA_JPG ESCENA_MASK OUT_DIR START END STEP

- FRAMES_DIR / MASKS_DIR: cuadros del video original y sus máscaras (ISNet).
- ESCENA_MASK: máscara del mate que ya aparece en la foto, para borrarlo.
- Escribe PNGs 1080x1920 en OUT_DIR.

El mate no se redibuja: se usan los píxeles reales del video, escalados con
Lanczos. Solo se ajusta la luz (más cálida y entrando desde la derecha, como
el sol de la foto). La base giratoria se dibuja con la geometría medida en el
video, porque ahí queda cortada por el borde del cuadro.
"""

import os
import sys

import cv2
import numpy as np

W, H = 1080, 1920

# Geometría medida en el video original (464x832).
TT_CX, TT_CY, TT_RX, TT_RY = 235, 674, 228, 66  # cara superior de la base
# Profundidad con que se dibuja la cara superior: un poco mayor que la medida,
# para que la huella del mate (estrella de la base) quede adentro y no en el
# borde trasero, que es lo que lo hacía ver flotando.
TOP_RY = 82
SCALE = 2.1
# Dónde cae el centro de la cara superior de la base en el cuadro final.
DST_CX, DST_CY = 540, 1400
SIDE_H = 95  # alto del lateral de la base, en px finales
FEET_Y = 722  # punto más bajo de las patas en el video (y)



def to_dst(x, y):
    return DST_CX + (x - TT_CX) * SCALE, DST_CY + (y - TT_CY) * SCALE


def build_plate(escena_path, mask_path):
    img = cv2.imread(escena_path).astype(np.float32)
    m = cv2.imread(mask_path, 0)
    m = cv2.dilate((m > 40).astype(np.uint8), np.ones((41, 41), np.uint8)) > 0
    # Relleno por filas: cada fila interpola entre sus bordes reales.
    out = img.copy()
    for y in range(img.shape[0]):
        xs = np.where(m[y])[0]
        if len(xs) == 0:
            continue
        x0, x1 = max(xs.min() - 1, 0), min(xs.max() + 1, img.shape[1] - 1)
        t = np.linspace(0, 1, x1 - x0 + 1)[:, None]
        out[y, x0 : x1 + 1] = img[y, x0] * (1 - t) + img[y, x1] * t
    out = np.clip(out, 0, 255).astype(np.uint8)
    # 3:4 -> 9:16: escalar a 1920 de alto y recortar al centro.
    h, w = out.shape[:2]
    s = H / h
    out = cv2.resize(out, (round(w * s), H), interpolation=cv2.INTER_LANCZOS4)
    x = (out.shape[1] - W) // 2
    out = out[:, x : x + W]
    # Profundidad de campo: el fondo fuera de foco, como con un lente abierto.
    return cv2.GaussianBlur(out, (0, 0), 7).astype(np.float32)


def soft_ellipse(cx, cy, rx, ry, blur):
    layer = np.zeros((H, W), np.float32)
    cv2.ellipse(layer, (int(cx), int(cy)), (int(rx), int(ry)), 0, 0, 360, 1, -1)
    return cv2.GaussianBlur(layer, (0, 0), blur)


def build_base():
    """Devuelve (color, alpha) de la base giratoria negra mate, y la sombra."""
    cx, cy = DST_CX, DST_CY
    rx, ry = TT_RX * SCALE, TOP_RY * SCALE
    color = np.zeros((H, W, 3), np.float32)
    alpha = np.zeros((H, W), np.float32)

    # Lateral: rectángulo + elipse inferior.
    side = np.zeros((H, W), np.uint8)
    cv2.rectangle(side, (int(cx - rx), int(cy)), (int(cx + rx), int(cy + SIDE_H)), 1, -1)
    cv2.ellipse(side, (int(cx), int(cy + SIDE_H)), (int(rx), int(ry)), 0, 0, 360, 1, -1)
    xs = (np.arange(W) - cx) / rx
    # Luz desde la derecha: el lateral se aclara hacia ese lado.
    xc = np.clip(xs, -1, 1)
    shade = 9 + 7 * (xc + 1) + 55 * np.exp(-(((xc - 0.72) / 0.12) ** 2))
    side_col = np.repeat(shade[None, :], H, 0)
    side_col = np.dstack([side_col * 0.92, side_col * 0.95, side_col * 1.0])
    s = side.astype(bool)
    color[s] = side_col[s]
    alpha[s] = 1

    # Cara superior satinada: gris oscuro (no negro puro, para que se lean la
    # sombra de contacto y el reflejo del mate) con el brillo del sol a la derecha.
    top = np.zeros((H, W), np.uint8)
    cv2.ellipse(top, (int(cx), int(cy)), (int(rx), int(ry)), 0, 0, 360, 1, -1)
    yy, xx = np.mgrid[0:H, 0:W]
    glow = np.exp(-(((xx - (cx + rx * 0.45)) / (rx * 0.6)) ** 2 + ((yy - cy) / (ry * 0.9)) ** 2))
    top_col = 30 + 16 * (yy - (cy - ry)) / (2 * ry) + 62 * glow
    t = top.astype(bool)
    color[t] = np.dstack([top_col * 0.95, top_col * 0.95, top_col * 0.97])[t]
    alpha[t] = 1
    # Canto entre cara superior y lateral.
    rim = np.zeros((H, W), np.uint8)
    cv2.ellipse(rim, (int(cx), int(cy)), (int(rx), int(ry)), 0, 0, 180, 1, 3)
    rim_shade = np.repeat((30 + 70 * np.clip((xs + 0.2), 0, 1))[None, :], H, 0)
    r = rim.astype(bool)
    color[r] = np.dstack([rim_shade * 0.9, rim_shade * 0.95, rim_shade])[r]

    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.8)

    # Sombras sobre la mesa: oclusión debajo y proyectada hacia la izquierda.
    shadow = 0.75 * soft_ellipse(cx, cy + SIDE_H + 10, rx * 1.02, ry * 0.9, 14)
    shadow += 0.45 * soft_ellipse(cx - rx * 0.55, cy + SIDE_H + 6, rx * 1.05, ry * 0.75, 40)
    top_a = cv2.GaussianBlur(top.astype(np.float32), (0, 0), 0.8)
    return color, alpha, np.clip(shadow, 0, 0.85), top_a


def is_clean(m):
    """ISNet a veces incluye la base giratoria real en la máscara: se nota
    porque hay máscara debajo de las patas o la base se ve más ancha que el
    mate. Esos cuadros no se usan en la edición (ver src/HerenciaPatria/Ad.tsx)."""
    return (m[FEET_Y:] > 128).sum() <= 200 and (m[680] > 128).sum() <= 300


def relight(rgb, mask, bbox):
    x0, x1 = bbox
    xs = (np.arange(rgb.shape[1]) - x0) / max(x1 - x0, 1)
    x = np.clip(xs, 0, 1)
    # Sombra a la izquierda, sol a la derecha, con un borde cálido de contraluz.
    gain = 0.62 + 0.48 * x**1.4 + 0.25 * np.exp(-(((x - 0.95) / 0.05) ** 2))
    out = rgb * gain[None, :, None]
    out[..., 2] *= 1.07  # R (BGR): más cálido
    out[..., 1] *= 1.02
    out[..., 0] *= 0.88
    return np.clip(out, 0, 255)


def touch_the_base(frame, fw, mw, top_a, xx, yy):
    """Lo que hace que el mate se vea apoyado y no flotando:
    - sombra de contacto que sigue el borde inferior de la banda plateada;
    - reflejo suave del mate en la cara satinada de la base, espejado en cada
      columna sobre el punto donde el mate toca la base."""
    solid = mw > 0.5
    has = solid.any(0)
    bottom = np.where(has, H - 1 - np.argmax(solid[::-1], 0), 0).astype(np.float32)
    bottom = cv2.GaussianBlur(bottom[None, :], (0, 0), 3)[0]
    below = (yy - bottom[None, :]) * has[None, :]
    on_top = top_a * (1 - mw)

    # Reflejo: y espejada = 2*borde - y.
    map_y = (2 * bottom[None, :] - yy).astype(np.float32)
    refl = cv2.remap(fw, xx, map_y, cv2.INTER_LINEAR, borderValue=0)
    refl_a = cv2.remap(mw, xx, map_y, cv2.INTER_LINEAR, borderValue=0)
    refl = cv2.GaussianBlur(refl, (0, 0), 2.5)
    refl_a = cv2.GaussianBlur(refl_a, (0, 0), 2.5)
    w = 0.32 * np.exp(-np.clip(below, 0, None) / 55) * (below > 0) * refl_a * on_top
    frame = frame * (1 - w[..., None]) + refl * w[..., None]

    # Sombra de contacto: oscurece justo debajo y alrededor del apoyo.
    ao = cv2.GaussianBlur(np.roll(mw, 5, axis=0), (0, 0), 6)
    ao = 0.85 * ao * on_top * (below > -25)
    return frame * (1 - ao[..., None])


def main():
    frames, masks, escena, escena_mask, out_dir = sys.argv[1:6]
    start, end, step = (int(v) for v in sys.argv[6:9])
    os.makedirs(out_dir, exist_ok=True)

    plate = build_plate(escena, escena_mask)
    base_col, base_a, shadow, top_a = build_base()
    bg = plate * (1 - shadow[..., None])
    bg = bg * (1 - base_a[..., None]) + base_col * base_a[..., None]

    # Afín fija video -> cuadro final (la cámara no se mueve).
    M = np.float32([[SCALE, 0, DST_CX - TT_CX * SCALE], [0, SCALE, DST_CY - TT_CY * SCALE]])
    # Sombra general del mate sobre la base (hacia la izquierda, lejos del sol).
    contact = 0.45 * soft_ellipse(DST_CX - 30, DST_CY + 20, 300, 70, 18)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

    names = sorted(os.listdir(frames))
    bad = []
    for n, i in enumerate(range(start, end, step)):
        name = names[i]
        # Máscara suavizada en el tiempo (vecinos) para que el borde no tiemble.
        ms = [
            cv2.imread(os.path.join(masks, names[j]), 0).astype(np.float32)
            for j in (i - 1, i, i + 1)
            if 0 <= j < len(names) and os.path.exists(os.path.join(masks, names[j]))
        ]
        m = (0.25 * ms[0] + 0.5 * ms[1] + 0.25 * ms[-1]) / 255 if len(ms) == 3 else ms[0] / 255
        f = cv2.imread(os.path.join(frames, name)).astype(np.float32)
        if not is_clean(m * 255):
            bad.append(n)
        m[FEET_Y:] = 0

        fw = cv2.warpAffine(f, M, (W, H), flags=cv2.INTER_LANCZOS4)
        mw = cv2.warpAffine(m, M, (W, H), flags=cv2.INTER_LINEAR)
        # Achicar 1 px el borde para no arrastrar el gris de la pared.
        mw = cv2.erode(mw, np.ones((3, 3), np.uint8))
        mw = np.clip((mw - 0.15) / 0.7, 0, 1)
        xs = np.where(mw.max(0) > 0.5)[0]
        fw = relight(fw, mw, (xs.min(), xs.max()) if len(xs) else (0, W))

        frame = bg * (1 - contact[..., None] * top_a[..., None])
        frame = touch_the_base(frame, fw, mw, top_a, xx, yy)
        frame = frame * (1 - mw[..., None]) + fw * mw[..., None]
        cv2.imwrite(os.path.join(out_dir, f"{n:05d}.png"), np.clip(frame, 0, 255).astype(np.uint8))
        if n % 50 == 0:
            print(n, flush=True)
    print("cuadros con la base real en la máscara:", bad, flush=True)


if __name__ == "__main__":
    main()
