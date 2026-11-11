#!/usr/bin/env bash
# Baja las tomas de stock (Mixkit, licencia libre) del TikTok de café a
# public/cafe/clips/. Pesan ~700 MB, por eso no van en el repositorio.
set -euo pipefail
cd "$(dirname "$0")/../public/cafe"
mkdir -p clips
for id in 41865 816 236 4984 4985 43941 41859 4982 3571 3572 43940 4676; do
  [ -f "clips/$id.mp4" ] || curl -sSfL -o "clips/$id.mp4" "https://assets.mixkit.co/videos/$id/$id-1080.mp4"
done
for x in 100343/1723061803 100239/1722540354 100241/1722540727 100246/1722541483; do
  id=${x%%/*}
  [ -f "clips/$id.mp4" ] || curl -sSfL -o "clips/$id.mp4" \
    "https://assets.mixkit.co/active_storage/video_items/$x/$id-video-1080.mp4"
done
