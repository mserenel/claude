"""Corrección de luz para las fotos de portada.

Mismo criterio que el video: curva en S suave, tono algo más cálido y una
"luz de acento" radial sobre el mate (como un reflector o un rebote), que
aclara el producto sin tocar su forma ni sus detalles, más un leve oscurecido
de bordes para llevar la mirada al centro.

Uso: python luz_portada.py ENTRADA.jpg SALIDA.jpg CX CY RX RY [CALIDEZ]
(CX, CY, RX, RY: centro y radios del mate, en fracción de la imagen;
CALIDEZ: 1 = completa, 0.5 = la mitad, para fotos que ya son cálidas)
"""

import sys

import numpy as np
from PIL import Image


def main():
    src, dst = sys.argv[1:3]
    cx, cy, rx, ry = (float(v) for v in sys.argv[3:7])
    warm = float(sys.argv[7]) if len(sys.argv) > 7 else 1.0
    im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255
    h, w, _ = im.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = ((xx / w - cx) / rx) ** 2 + ((yy / h - cy) / ry) ** 2

    # Luz de acento sobre el mate y bordes un poco más oscuros.
    accent = 1 + 0.16 * np.exp(-d * 1.2)
    vignette = 1 - 0.22 * np.clip((np.sqrt(((xx / w - 0.5) / 0.75) ** 2 + ((yy / h - 0.5) / 0.8) ** 2) - 0.45), 0, 1)
    im = im * (accent * vignette)[..., None]

    # Contraste en S y calidez moderada.
    im = np.clip(im, 0, 1)
    im = im + 0.08 * np.sin(np.pi * (im - 0.5)) * (1 - np.abs(2 * im - 1)) * 2
    im[..., 0] *= 1 + 0.04 * warm
    im[..., 1] *= 1 + 0.01 * warm
    im[..., 2] *= 1 - 0.07 * warm
    luma = im.mean(2, keepdims=True)
    im = luma + (im - luma) * 1.06
    Image.fromarray((np.clip(im, 0, 1) * 255).astype(np.uint8)).save(dst, quality=95)


if __name__ == "__main__":
    main()
