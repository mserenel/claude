#!/usr/bin/env bash
# Baja las tomas de stock (Mixkit, licencia libre) del TikTok de café a
# public/cafe/clips/. Pesan ~700 MB, por eso no van en el repositorio.
set -euo pipefail
cd "$(dirname "$0")/../public/cafe"
mkdir -p clips
for id in 41865 816 236 4984 4985 43941 41859; do
  [ -f "clips/$id.mp4" ] || curl -sSfL -o "clips/$id.mp4" "https://assets.mixkit.co/videos/$id/$id-1080.mp4"
done
[ -f clips/100343.mp4 ] || curl -sSfL -o clips/100343.mp4 \
  "https://assets.mixkit.co/active_storage/video_items/100343/1723061803/100343-video-1080.mp4"
