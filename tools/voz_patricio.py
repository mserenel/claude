"""Genera la voz de Don Patricio, una línea por archivo.

Kokoro (voz em_santa, español) a velocidad pausada, y después un poco más
grave con rubberband preservando los formantes, para que suene a hombre mayor
sin sonar "de robot". Las líneas se escriben como se pronuncian ("mijo").

Uso: python voz_patricio.py MODELOS_DIR SALIDA_DIR
"""

import json
import os
import subprocess
import sys

import soundfile as sf
from kokoro_onnx import Kokoro

LINEAS = [
    "¿Se le tapa la bombilla, mijo?",
    "No es culpa de la bombilla... Es cómo arma el mate.",
    "Ponga la yerba, tape la boca con la mano, y sacúdalo boca abajo. Así se va el polvillo.",
    "Inclínelo, moje del costado, y meta la bombilla ahí. Y después... no la mueva más.",
    "Y ahí está el secreto.",
]


def main():
    models, out = sys.argv[1:3]
    os.makedirs(out, exist_ok=True)
    k = Kokoro(os.path.join(models, "kokoro-v1.0.onnx"), os.path.join(models, "voices-v1.0.bin"))
    durs = []
    for i, text in enumerate(LINEAS):
        a, sr = k.create(text, voice="em_santa", speed=0.86, lang="es")
        raw = os.path.join(out, f"raw_{i}.wav")
        sf.write(raw, a, sr)
        dst = os.path.join(out, f"linea_{i}.wav")
        subprocess.run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
                "rubberband=pitch=0.84:formant=preserved,"
                "equalizer=f=140:t=q:w=1:g=3,equalizer=f=3500:t=q:w=1.5:g=-2,"
                "acompressor=threshold=0.1:ratio=3:attack=10:release=150,"
                "silenceremove=start_periods=1:start_threshold=-45dB,"
                "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                "loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000",
                dst,
            ],
            check=True,
        )
        x, sr2 = sf.read(dst)
        durs.append(round(len(x) / sr2, 3))
    print(json.dumps(durs))


if __name__ == "__main__":
    main()
