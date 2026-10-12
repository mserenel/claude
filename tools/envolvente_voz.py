"""Envolvente de la voz, un valor 0..1 por cuadro (30 fps), para animar la
cara de Don Patricio al ritmo de lo que dice.

Uso: python envolvente_voz.py AUDIO SALIDA.ts
"""

import subprocess
import sys

import numpy as np

audio, out = sys.argv[1:3]
raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", audio, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"],
    capture_output=True, check=True,
).stdout
x = np.frombuffer(raw, np.float32)
# Banda de la voz (300-3000 Hz) cada 10 ms: marca las sílabas.
X = np.fft.rfft(x)
fr = np.fft.rfftfreq(len(x), 1 / 48000)
X[(fr < 300) | (fr > 3000)] = 0
xb = np.fft.irfft(X, len(x))
h10 = 480
e = np.array([np.sqrt(np.mean(xb[i:i + h10] ** 2)) for i in range(0, len(xb) - h10, h10)])
db = 20 * np.log10(e + 1e-9)
gate = np.clip((db + 42) / 10, 0, 1)  # 0 en silencio
# Relativo al máximo local (0,4 s): sube en cada sílaba y baja entre sílabas.
w = 40
loc = np.array([e[max(0, i - w // 2):i + w // 2].max() for i in range(len(e))])
syl = np.clip(e / (loc + 1e-9), 0, 1) ** 2 * gate
# A 30 fps (cada 33,3 ms): máximo de los tramos de 10 ms que cubre el cuadro.
n = int(len(x) / 1600)
v = np.array([syl[int(i * 10 / 3):int((i + 1) * 10 / 3) + 1].max() for i in range(n)])
# Ataque rápido, caída corta: la boca se cierra entre sílabas.
env = np.zeros_like(v)
for i in range(n):
    prev = env[i - 1] if i else 0
    env[i] = v[i] if v[i] > prev else prev * 0.45 + v[i] * 0.55
vals = ",".join(f"{e:.2f}" for e in env)
with open(out, "w") as f:
    f.write(
        "// Generado con tools/envolvente_voz.py a partir de\n"
        "// public/patricio-voz/elevenlabs-bombilla.mp3: un valor 0..1 por cuadro.\n"
        f"export const vozEnvolvente: number[] = [{vals}];\n"
    )
print(n, "cuadros")
