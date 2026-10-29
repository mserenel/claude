"""Empareja la luz del cuerpo de un recorte de mate (recorte_mate.py), para que
varios mates de fotos distintas se vean con la misma luz: baja los brillos
puntuales y las franjas de reflejo del barniz o del cuero, comprime las altas
luces y reduce la diferencia de luz de un costado al otro. Sólo toca las filas
del cuerpo: el metal (virola, base, patas) queda como estaba, porque cualquier
retoque ahí borra el cincelado.

Uso:
  python sin_brillo.py RECORTE.png CUERPO_Y0 CUERPO_Y1 [GAMMA]   (lo reescribe)

GAMMA (opcional, menor que 1) aclara las sombras del cuerpo: para los cueros
negros, que sobre el fondo azul se pierden.
"""

import sys

import cv2
import numpy as np


def suave(img, m, sigma):
    # Desenfoque que sólo promedia dentro del mate (no mezcla el fondo).
    return cv2.GaussianBlur(img * m, (0, 0), sigma) / (cv2.GaussianBlur(m, (0, 0), sigma) + 1e-6)


def main():
    f = sys.argv[1]
    y0, y1 = int(sys.argv[2]), int(sys.argv[3])
    r = cv2.imread(f, cv2.IMREAD_UNCHANGED)
    h, w = r.shape[:2]
    mm = (r[..., 3] > 250).astype(np.float32)
    fila = np.zeros(h, np.float32)
    fila[y0:y1] = 1
    fila = np.convolve(fila, np.ones(15) / 15, "same")
    cuerpo = cv2.erode(mm, np.ones((5, 5), np.uint8)) * fila[:, None]
    ancho = np.ptp(np.where(mm.any(0))[0])

    lab = cv2.cvtColor(r[..., :3], cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]

    # Brillos puntuales y franjas de reflejo: lo que sobresale de la luz de
    # alrededor se acerca a ella (y toma su color), sin aplanar la textura.
    cerca = suave(L, mm, ancho * 0.04)
    exceso = L - cerca
    peso = np.clip((exceso - 4) / 16, 0, 1) * cuerpo
    peso = cv2.GaussianBlur(peso, (0, 0), 1.5)
    L = L - exceso * peso * 0.8
    A = A * (1 - peso) + suave(A, mm, ancho * 0.04) * peso
    B = B * (1 - peso) + suave(B, mm, ancho * 0.04) * peso

    # Altas luces comprimidas (sin brillo).
    hombro = float(np.percentile(L[cuerpo > 0.5], 75))
    L = np.where(L > hombro, hombro + (L - hombro) * (1 - 0.5 * cuerpo), L)

    # Luz pareja: la diferencia grande de un costado al otro se reduce.
    lejos = suave(L, mm * cuerpo + 1e-3, ancho * 0.15)
    media = (lejos * cuerpo).sum() / max(cuerpo.sum(), 1)
    L = L - (lejos - media) * 0.5 * cuerpo

    if len(sys.argv) > 4:
        aclarado = 100 * (np.clip(L, 0, 255) / 255) ** float(sys.argv[4]) * 2.55
        L = L * (1 - cuerpo) + aclarado * cuerpo

    r[..., :3] = cv2.cvtColor(np.clip(np.dstack([L, A, B]), 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    cv2.imwrite(f, r)


if __name__ == "__main__":
    main()
