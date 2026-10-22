"""Mate recortado con fondo transparente, para apoyarlo sobre otra cosa (una
tabla, un estante) en vez de sobre el piso blanco.

Uso:
  python recorte_mate.py FOTO MASCARA SALIDA.png CUERPO_Y0 CUERPO_Y1

- MASCARA: recorte del mate (rembg, birefnet-general).
- CUERPO_Y0..CUERPO_Y1: filas del cuerpo (cuero o madera). El metal (virola,
  chapas, base) queda fuera y no se toca: ni brillo ni color.
- En el cuerpo:
  * se bajan los brillos puntuales (destellos del barniz o del cuero): lo que
    sobresale de la luz de alrededor se acerca a ella, sin aplanar la forma;
  * se empareja la luz: la diferencia grande de un costado al otro (la
    ventana de un lado) se reduce a la mitad.
- Borde sin halo, recortado al mate y llevado a 700 px de alto, con la base
  justo en el borde de abajo (para apoyarlo exacto).
"""

import sys

import cv2
import numpy as np

ALTO = 700


def suave(img, m, sigma):
    # Desenfoque que sólo promedia dentro del mate (no mezcla el fondo).
    num = cv2.GaussianBlur(img * m, (0, 0), sigma)
    den = cv2.GaussianBlur(m, (0, 0), sigma) + 1e-6
    return num / den


def main():
    src, mask_path, out_path = sys.argv[1:4]
    y0, y1 = int(sys.argv[4]), int(sys.argv[5])
    im = cv2.imread(src)
    h, w = im.shape[:2]
    m = cv2.imread(mask_path, 0)
    m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)
    duro = (m > 128).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(duro)
    duro = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8) * 255
    cont, _ = cv2.findContours(duro, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    lleno = np.zeros_like(duro)
    cv2.drawContours(lleno, cont, -1, 255, -1)
    interior = cv2.erode(lleno, np.ones((3, 3), np.uint8))
    alfa = cv2.GaussianBlur(interior, (0, 0), 1.0).astype(np.float32) / 255

    # Cuerpo: dentro del mate y entre las filas dadas, con transición suave.
    fila = np.zeros(h, np.float32)
    fila[y0:y1] = 1
    fila = np.convolve(fila, np.ones(21) / 21, "same")
    adentro = cv2.erode(lleno, np.ones((7, 7), np.uint8)).astype(np.float32) / 255
    cuerpo = adentro * fila[:, None]

    lab_ = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = lab_[..., 0], lab_[..., 1], lab_[..., 2]
    mm = lleno.astype(np.float32) / 255
    ancho = st[1:, cv2.CC_STAT_WIDTH].max()

    # Brillos puntuales: lo que sobresale de la luz cercana.
    cerca = suave(L, mm, ancho * 0.03)
    exceso = L - cerca
    peso = np.clip((exceso - 6) / 18, 0, 1) * cuerpo
    peso = cv2.GaussianBlur(peso, (0, 0), 1.5)
    L = L - exceso * peso * 0.85
    A = A * (1 - peso) + suave(A, mm, ancho * 0.03) * peso
    B = B * (1 - peso) + suave(B, mm, ancho * 0.03) * peso

    # Luz pareja: la variación grande (un costado más iluminado) a la mitad.
    lejos = suave(L, mm * cuerpo + 1e-3, ancho * 0.18)
    media = (lejos * cuerpo).sum() / max(cuerpo.sum(), 1)
    L = L - (lejos - media) * 0.5 * cuerpo

    out = cv2.cvtColor(
        np.clip(np.dstack([L, A, B]), 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR
    )

    # Borde sin halo: en la franja del borde, el color del interior cercano.
    adentro9 = cv2.erode(lleno, np.ones((9, 9), np.uint8))
    franja = (interior > 0) & (adentro9 == 0)
    relleno = cv2.inpaint(out, franja.astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA)
    out[franja] = (out[franja] * 0.4 + relleno[franja] * 0.6).astype(np.uint8)

    ys, xs = np.where(alfa > 0.05)
    c0, c1, r0, r1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    rgba = np.dstack([out, (alfa * 255).astype(np.uint8)])[r0:r1, c0:c1]
    esc = ALTO / rgba.shape[0]
    rgba = cv2.resize(rgba, (round(rgba.shape[1] * esc), ALTO), interpolation=cv2.INTER_AREA)
    cv2.imwrite(out_path, rgba)


if __name__ == "__main__":
    main()
