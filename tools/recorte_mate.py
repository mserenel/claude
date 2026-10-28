"""Mate recortado con fondo transparente, para apoyarlo sobre otra cosa (una
tabla, un estante) en vez de sobre el piso blanco.

Uso:
  python recorte_mate.py FOTO MASCARA SALIDA.png [CUERPO_Y0 CUERPO_Y1]

- MASCARA: recorte del mate (rembg, birefnet-general), o "-" si la FOTO ya
  viene recortada (PNG con transparencia).
- Sin CUERPO_Y0..CUERPO_Y1 (fotos de catálogo, ya retocadas y derechas): no
  se endereza ni se retoca nada; sólo el recorte, el borde y la sombra.
- Si el mate salió torcido (el celular inclinado), primero se endereza.
- CUERPO_Y0..CUERPO_Y1: filas del cuerpo (cuero o madera). El metal (virola,
  chapas, base) queda fuera y no se toca: ni brillo ni color.
- En el cuerpo (no en el metal):
  * sin brillo: los destellos bajan y las altas luces se comprimen;
  * se bajan los brillos puntuales (destellos del barniz o del cuero): lo que
    sobresale de la luz de alrededor se acerca a ella, sin aplanar la forma;
  * se empareja la luz: la diferencia grande de un costado al otro (la
    ventana de un lado) y las franjas de luz se reducen bastante.
- Borde sin halo, recortado al mate y llevado a 700 px de alto (el mate), con
  la base a 700 px del borde de arriba. Debajo quedan PIE px para la sombra de
  contacto, que sale de los puntos reales de apoyo (cada pata, el borde de la
  base: la envolvente del perfil de abajo, como en fondo_blanco.py) y va
  semitransparente, para que caiga sobre lo que haya debajo.
"""

import sys

import cv2
import numpy as np

ALTO = 700
PIE = 24


def suave(img, m, sigma):
    # Desenfoque que sólo promedia dentro del mate (no mezcla el fondo).
    num = cv2.GaussianBlur(img * m, (0, 0), sigma)
    den = cv2.GaussianBlur(m, (0, 0), sigma) + 1e-6
    return num / den


def enderezar(im, m):
    # Si el celular estaba inclinado, el mate sale torcido. Se mide la
    # inclinación del eje (el medio entre los dos bordes, a lo alto) y la de la
    # boca, y se gira la foto el promedio para dejarlo derecho.
    mk = m > 128
    ys = np.where(mk.any(1))[0]
    y0, y1 = ys.min(), ys.max()
    alto = y1 - y0
    pts = []
    for y in range(int(y0 + 0.08 * alto), int(y0 + 0.8 * alto), 5):
        xs = np.where(mk[y])[0]
        if xs.size:
            pts.append((y, (xs.min() + xs.max()) / 2))
    pts = np.array(pts)
    eje = np.degrees(np.arctan(np.polyfit(pts[:, 0], pts[:, 1], 1)[0]))
    xs = np.where(mk.any(0))[0]
    x0, x1 = xs.min(), xs.max()
    tl, tr = int(x0 + 0.15 * (x1 - x0)), int(x0 + 0.85 * (x1 - x0))
    boca = np.degrees(
        np.arctan2(np.where(mk[:, tr])[0].min() - np.where(mk[:, tl])[0].min(), tr - tl)
    )
    giro = (boca - eje) / 2
    if abs(giro) < 0.2:
        return im, m
    h, w = m.shape
    rot = cv2.getRotationMatrix2D(((x0 + x1) / 2, (y0 + y1) / 2), giro, 1)
    im = cv2.warpAffine(im, rot, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    m = cv2.warpAffine(m, rot, (w, h), flags=cv2.INTER_LINEAR)
    return im, m


def main():
    src, mask_path, out_path = sys.argv[1:4]
    retoque = len(sys.argv) > 5
    foto = cv2.imread(src, cv2.IMREAD_UNCHANGED)
    im = foto[..., :3]
    h, w = im.shape[:2]
    if mask_path == "-":
        m = foto[..., 3]
    else:
        m = cv2.imread(mask_path, 0)
        m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)
    if retoque:
        im, m = enderezar(im, m)
    duro = (m > 128).astype(np.uint8)
    # Cerrar rendijas chicas del recorte (entre una chapa y el cuerpo), que
    # dejarían ver el fondo.
    duro = cv2.morphologyEx(duro, cv2.MORPH_CLOSE, np.ones((21, 21), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(duro)
    duro = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8) * 255
    cont, _ = cv2.findContours(duro, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    lleno = np.zeros_like(duro)
    cv2.drawContours(lleno, cont, -1, 255, -1)
    interior = cv2.erode(lleno, np.ones((3, 3), np.uint8))
    alfa = cv2.GaussianBlur(interior, (0, 0), 1.0).astype(np.float32) / 255

    # Cuerpo: dentro del mate y entre las filas dadas, con transición suave.
    fila = np.zeros(h, np.float32)
    if retoque:
        fila[int(sys.argv[4]) : int(sys.argv[5])] = 1
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

    # Sin brillo en el cuerpo: los destellos que sobresalen se bajan y las
    # altas luces se comprimen. Sólo la luz (L); el color queda. El metal no
    # se toca: cualquier retoque ahí borra el cincelado.
    todo = cuerpo
    cerca2 = suave(L, mm, ancho * 0.02)
    exceso2 = L - cerca2
    peso2 = np.clip((exceso2 - 4) / 16, 0, 1) * todo
    L = L - exceso2 * cv2.GaussianBlur(peso2, (0, 0), 1.2) * 0.7
    hombro = 140.0
    alto_ = L > hombro
    L = np.where(alto_, hombro + (L - hombro) * (1 - 0.55 * todo), L)

    # Luz pareja en el cuerpo: la variación grande (un costado más iluminado,
    # franjas de luz) se reduce bastante (60 %).
    lejos = suave(L, mm * cuerpo + 1e-3, ancho * 0.12)
    media = (lejos * cuerpo).sum() / max(cuerpo.sum(), 1)
    L = L - (lejos - media) * 0.6 * cuerpo

    out = cv2.cvtColor(
        np.clip(np.dstack([L, A, B]), 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR
    )
    if not retoque:
        out = im.copy()

    # Borde sin halo: en la franja del borde, el color del interior cercano.
    adentro9 = cv2.erode(lleno, np.ones((9, 9), np.uint8))
    franja = (interior > 0) & (adentro9 == 0)
    relleno = cv2.inpaint(out, franja.astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA)
    out[franja] = (out[franja] * 0.4 + relleno[franja] * 0.6).astype(np.uint8)

    # --- Sombra de contacto, en las coordenadas de la foto ---------------
    ys, xs = np.where(alfa > 0.05)
    by0, by1, bx0, bx1 = ys.min(), ys.max(), xs.min(), xs.max()
    ph = by1 - by0 + 1
    perfil = {}
    for x in range(bx0, bx1 + 1):
        col = np.where(lleno[:, x] > 0)[0]
        if col.size and col.max() > by1 - 0.25 * ph:
            perfil[x] = col.max()
    xs_p = sorted(perfil)
    casco = []
    for x in xs_p:
        while len(casco) >= 2:
            (ax, ay), (bx, by) = casco[-2], casco[-1]
            if (bx - ax) * (perfil[x] - ay) - (by - ay) * (x - ax) >= 0:
                casco.pop()
            else:
                break
        casco.append((x, perfil[x]))
    cx_c, cy_c = zip(*casco)
    piso_y = np.interp(xs_p, cx_c, cy_c)
    tol = max(2, 0.005 * ph)
    # Sólo lo que llega abajo de todo: si la panza es más ancha que la base,
    # sus bordes quedan en la envolvente pero no tocan el piso.
    apoya = [
        x
        for x, py in zip(xs_p, piso_y)
        if py - perfil[x] <= tol and perfil[x] >= by1 - 0.04 * ph
    ]
    pie = int(PIE * ph / ALTO)
    hh = h + pie + 4
    contacto = np.zeros((hh, w), np.float32)
    for x in apoya:
        contacto[perfil[x] - 2 : perfil[x] + max(2, int(0.004 * ph)), x] = 1
    ceñida = np.clip(cv2.GaussianBlur(contacto, (0, 0), 0.005 * ph) * 3, 0, 1)
    abierta = np.clip(cv2.GaussianBlur(contacto, (0, 0), 0.014 * ph) * 2, 0, 1)
    bajo = np.zeros((hh, w), np.float32)
    a0, a1 = min(apoya), max(apoya)
    for x, py in zip(xs_p, piso_y):
        if a0 <= x <= a1:
            bajo[perfil[x] : int(py) + 1, x] = 1
            n_caida = int(0.03 * ph)
            bajo[int(py) + 1 : int(py) + 1 + n_caida, x] = np.linspace(1, 0, n_caida)
    bajo = cv2.GaussianBlur(bajo, (0, 0), sigmaX=0.012 * ph, sigmaY=0.008 * ph)
    sombra = np.clip(0.75 * ceñida + 0.3 * abierta + 0.7 * bajo, 0, 0.85)

    # El mate sobre su sombra (sombra azul muy oscuro, casi negro).
    tono = np.array([14, 20, 28], np.float32)
    al = np.zeros((hh, w), np.float32)
    al[:h] = alfa
    rgb = np.zeros((hh, w, 3), np.float32)
    rgb[:] = tono
    rgb[:h] = out
    a_tot = al + sombra * (1 - al)
    mezcla = (rgb * al[..., None] + tono * (sombra * (1 - al))[..., None]) / np.maximum(
        a_tot, 1e-4
    )[..., None]

    c0, c1 = bx0 - pie, bx1 + 1 + pie
    c0, c1 = max(c0, 0), min(c1, w)
    r0, r1 = by0, by1 + 1 + pie
    rgba = np.dstack([np.clip(mezcla, 0, 255), a_tot * 255]).astype(np.uint8)[r0:r1, c0:c1]
    esc = ALTO / ph
    rgba = cv2.resize(rgba, (round(rgba.shape[1] * esc), ALTO + PIE), interpolation=cv2.INTER_AREA)
    cv2.imwrite(out_path, rgba)


if __name__ == "__main__":
    main()
