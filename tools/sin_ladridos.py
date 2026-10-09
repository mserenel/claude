"""Saca los ladridos de perro del audio ambiente de IMG_3449.MOV.

Los ladridos (armónicos entre 600 y 2600 Hz, ubicados con un espectrograma)
caen en los primeros 6,5 s. Un filtro no sirve porque comparten frecuencias con
los pájaros, así que cada tramo se reemplaza por ambiente real del mismo parque
tomado de la segunda mitad del video, donde no hay ladridos, con fundidos de
150 ms en las uniones.

Uso: python sin_ladridos.py ENTRADA.wav SALIDA.wav
"""

import sys

import numpy as np
import soundfile as sf

FADE = 0.15
# (inicio, fin) del tramo con ladridos -> inicio del ambiente limpio a usar.
PARCHES = [
    ((0.0, 2.15), 8.9),
    ((2.85, 3.65), 11.1),
    ((3.8, 4.2), 10.35),
    ((5.5, 6.55), 6.95),
]


def main():
    x, sr = sf.read(sys.argv[1], dtype="float32", always_2d=True)
    out = x.copy()
    f = int(FADE * sr)
    for (a, b), src in PARCHES:
        i0, i1 = max(int(a * sr) - f, 0), int(b * sr) + f
        s0 = int(src * sr)
        patch = x[s0 : s0 + (i1 - i0)]
        # El ambiente es parejo (LRA 3 LU): el parche va a su nivel natural.
        w = np.ones(i1 - i0, np.float32)
        # Fundido de potencia constante en las uniones.
        ramp = np.sin(np.linspace(0, np.pi / 2, f)) ** 2
        w[-f:] = ramp[::-1]
        if i0 > 0:  # al comienzo del archivo no hay nada con qué fundir
            w[:f] = ramp
        out[i0:i1] = x[i0:i1] * (1 - w[:, None]) ** 0.5 + patch * w[:, None] ** 0.5
    sf.write(sys.argv[2], out, sr, subtype="FLOAT")


if __name__ == "__main__":
    main()
