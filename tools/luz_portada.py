"""Corrección de luz para las fotos de portada.

Mismo criterio que el video: curva en S suave, tono algo más cálido y una
"luz de acento" radial sobre el mate (como un reflector o un rebote), que
aclara el producto sin tocar su forma ni sus detalles, más un leve oscurecido
de bordes para llevar la mirada al centro.

Uso: python luz_portada.py ENTRADA.jpg SALIDA.jpg CX CY RX RY [CALIDEZ] [CONTRASTE]
     [MCX MCY MRX MRY FONDO]
(CX, CY, RX, RY: centro y radios del mate, en fracción de la imagen;
CALIDEZ: 1 = completa, 0.5 = la mitad, para fotos que ya son cálidas;
CONTRASTE: 1 = normal, más alto para acercarse al sol directo del feed;
MCX..MRY: elipse de la virola, donde el metal conserva sus tonos originales;
FONDO: 0..1, color y contraste extra solo en el fondo)
"""

import sys

import numpy as np
from PIL import Image


def main():
    src, dst = sys.argv[1:3]
    cx, cy, rx, ry = (float(v) for v in sys.argv[3:7])
    warm = float(sys.argv[7]) if len(sys.argv) > 7 else 1.0
    # Opcionales: zona de la virola (MCX MCY MRX MRY) y vida extra del fondo.
    metal_zone = [float(v) for v in sys.argv[9:13]] if len(sys.argv) > 12 else None
    bg_life = float(sys.argv[13]) if len(sys.argv) > 13 else 0.0
    im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255
    orig = im.copy()
    h, w, _ = im.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = ((xx / w - cx) / rx) ** 2 + ((yy / h - cy) / ry) ** 2

    # Luz de acento sobre el mate y bordes un poco más oscuros.
    accent = 1 + 0.16 * np.exp(-d * 1.2)
    vignette = 1 - 0.22 * np.clip((np.sqrt(((xx / w - 0.5) / 0.75) ** 2 + ((yy / h - 0.5) / 0.8) ** 2) - 0.45), 0, 1)
    im = im * (accent * vignette)[..., None]

    # Contraste en S y calidez moderada.
    im = np.clip(im, 0, 1)
    contrast = float(sys.argv[8]) if len(sys.argv) > 8 else 1.0
    im = im + 0.08 * contrast * np.sin(np.pi * (im - 0.5)) * (1 - np.abs(2 * im - 1)) * 2
    im[..., 0] *= 1 + 0.04 * warm
    im[..., 1] *= 1 + 0.01 * warm
    im[..., 2] *= 1 - 0.07 * warm
    luma = im.mean(2, keepdims=True)
    im = luma + (im - luma) * 1.06
    # El metal (claro y sin color en la foto original) no se aclara: vuelve a
    # sus tonos originales, con un poco de definición local para marcar el
    # cincelado. El resto de la imagen se queda con la corrección.
    from PIL import ImageFilter

    orig_l = orig.mean(2, keepdims=True)
    orig_sat = orig.max(2, keepdims=True) - orig.min(2, keepdims=True)
    metal = np.clip((orig_l - 0.42) / 0.15, 0, 1) * np.clip((0.16 - orig_sat) / 0.08, 0, 1)
    if metal_zone:
        # Solo dentro de la virola: el cuero claro no debe tomarse por metal.
        mx, my, mrx, mry = metal_zone
        dz = ((xx / w - mx) / mrx) ** 2 + ((yy / h - my) / mry) ** 2
        metal = metal * np.clip((1 - dz) / 0.08, 0, 1)[..., None]
    metal = np.asarray(
        Image.fromarray((metal[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
    ).astype(np.float32)[..., None] / 255
    o_img = Image.fromarray((orig * 255).astype(np.uint8))
    o_blur = np.asarray(o_img.filter(ImageFilter.GaussianBlur(5))).astype(np.float32) / 255
    metal_px = orig + 0.6 * (orig - o_blur)
    im = im * (1 - metal) + metal_px * metal

    if bg_life:
        # Fondo: más color y contraste lejos del mate, para que no se vea
        # apagado. El producto no se toca.
        bg = np.clip(d / 2.5, 0, 1)[..., None] * bg_life
        lum = im.mean(2, keepdims=True)
        lively = lum + (im - lum) * 1.35
        lively = lively + 0.12 * np.sin(np.pi * (lively - 0.5)) * (1 - np.abs(2 * lively - 1)) * 2
        im = im * (1 - bg) + np.clip(lively, 0, 1) * bg
    out = Image.fromarray((np.clip(im, 0, 1) * 255).astype(np.uint8))
    # PNG para no sumar otra compresión JPEG antes del render.
    out.save(dst, quality=95) if dst.lower().endswith((".jpg", ".jpeg")) else out.save(dst)


if __name__ == "__main__":
    main()
