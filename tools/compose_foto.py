"""Apoya una captura del mate (recortada con BiRefNet) sobre la mesa de la foto
de la escena, en el mismo lugar y tamaño que el mate original de la foto.

Uso:
  python compose_foto.py CAPTURA MASCARA ESCENA_JPG ESCENA_MASK SALIDA_JPG

Cada recorte se revisa a mano en resolución completa antes de usarlo. El mate
no se redibuja: son los píxeles reales de la captura, escalados con Lanczos;
solo se ajusta la luz para que coincida con el sol de la escena.
"""

import sys

import cv2
import numpy as np

from compose_escena import H, W, build_plate, relight


def bbox(mask):
    ys, xs = np.where(mask > 0.5)
    return xs.min(), xs.max(), ys.min(), ys.max()


def main():
    cap_path, mask_path, escena, escena_mask, out_path = sys.argv[1:6]
    # La foto ya tiene su propia profundidad de campo: la mesa está nítida
    # donde apoya el mate. No se desenfoca.
    plate = build_plate(escena, escena_mask, blur=0, mirror=150, reflection=60)

    # Dónde estaba el mate en la foto, llevado al cuadro 9:16.
    em = cv2.imread(escena_mask, 0).astype(np.float32) / 255
    eh, ew = em.shape
    s = H / eh
    off_x = (round(ew * s) - W) // 2
    ex0, ex1, _, ey1 = bbox(em)
    target_w = (ex1 - ex0) * s
    target_cx = (ex0 + ex1) / 2 * s - off_x
    target_bottom = ey1 * s

    f = cv2.imread(cap_path).astype(np.float32)
    m = cv2.imread(mask_path, 0).astype(np.float32) / 255
    x0, x1, _, y1 = bbox(m)
    # Un poco más ancho que el original para tapar por completo el relleno
    # que quedó donde estaba el mate de la foto.
    k = target_w / (x1 - x0) * 1.04
    M = np.float32(
        [[k, 0, target_cx - (x0 + x1) / 2 * k], [0, k, target_bottom - y1 * k]]
    )
    fw = cv2.warpAffine(f, M, (W, H), flags=cv2.INTER_LANCZOS4)
    mw = cv2.warpAffine(m, M, (W, H), flags=cv2.INTER_LINEAR)
    xs = np.where(mw.max(0) > 0.5)[0]
    fw = relight(fw, mw, (xs.min(), xs.max()))

    # Sombras sobre la mesa: contacto pegado a la banda y una proyectada hacia
    # la izquierda (el sol entra por la derecha).
    solid = (mw > 0.5).astype(np.float32)
    contact = cv2.GaussianBlur(np.roll(solid, 6, axis=0), (0, 0), 7)
    cast = cv2.GaussianBlur(
        cv2.warpAffine(
            solid,
            np.float32([[1, -0.9, 0], [0, 0.22, 0]]),
            (W, H),
        ),
        (0, 0),
        18,
    )
    # La sombra proyectada nace en el apoyo: se ubica con su base en la del mate.
    ys = np.where(solid.max(1) > 0)[0]
    cast = np.roll(cast, int(ys.max() - np.where(cast.max(1) > 0.05)[0].max()), axis=0)
    shadow = np.clip(0.75 * contact + 0.45 * cast, 0, 0.85) * (1 - mw)
    frame = plate * (1 - shadow[..., None])

    # Reflejo en la madera barnizada, como en la foto original: el mate
    # espejado sobre su línea de apoyo, suave y desvaneciéndose hacia abajo.
    has = solid.max(0) > 0
    bottom = np.where(has, H - 1 - np.argmax(solid[::-1], 0), 0).astype(np.float32)
    bottom = cv2.GaussianBlur(bottom[None, :], (0, 0), 4)[0]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    map_y = 2 * bottom[None, :] - yy
    refl = cv2.GaussianBlur(cv2.remap(fw, xx, map_y, cv2.INTER_LINEAR), (0, 0), 3)
    refl_a = cv2.GaussianBlur(cv2.remap(mw, xx, map_y, cv2.INTER_LINEAR), (0, 0), 3)
    below = yy - bottom[None, :]
    w = 0.3 * np.exp(-np.clip(below, 0, None) / 45) * (below > 0) * has[None, :] * refl_a
    frame = frame * (1 - w[..., None]) + refl * w[..., None]
    frame = frame * (1 - mw[..., None]) + fw * mw[..., None]
    cv2.imwrite(out_path, np.clip(frame, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])


if __name__ == "__main__":
    main()
