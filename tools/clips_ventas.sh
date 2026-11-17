#!/usr/bin/env bash
# Baja las tomas de stock (Mixkit, licencia libre) del video de la app de
# ventas a public/ventas/clips/. No van en el repositorio.
set -euo pipefail
cd "$(dirname "$0")/../public/ventas"
mkdir -p clips
for id in 45926 25595 22827 46977 20847 34125; do
  [ -f "clips/$id.mp4" ] && continue
  curl -sSfL -o "clips/$id.mp4" "https://assets.mixkit.co/videos/$id/$id-1080.mp4" ||
    curl -sSfL -o "clips/$id.mp4" "https://assets.mixkit.co/videos/$id/$id-720.mp4"
done
