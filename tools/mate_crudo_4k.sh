#!/bin/sh
# Regenera public/mate-crudo-4k.mp4 desde IMG_3449.MOV (iPhone, 4K HDR):
# misma conversión a SDR y corrección de luz que public/mate-crudo.mp4, pero a
# resolución completa (2160x3840) y con mucha más calidad de compresión, para
# que los acercamientos de cámara no se vean blandos. El audio se toma de
# public/mate-crudo.mp4 (ambiente limpio, sin ladridos).
# Uso: sh tools/mate_crudo_4k.sh /ruta/a/IMG_3449.MOV
set -e
ffmpeg -v error -y -i "$1" -an -vf "zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,curves=master='0/0 0.15/0.11 0.5/0.52 0.85/0.9 1/1',colorbalance=rm=0.03:gm=0.005:bm=-0.035:rh=0.01:bh=-0.02,eq=saturation=1.08,scale=2160:3840:flags=lanczos,unsharp=5:5:0.25:5:5:0,tpad=stop_mode=clone:stop_duration=1" -c:v libx264 -preset slow -crf 12 -pix_fmt yuv420p /tmp/video4k.mp4
ffmpeg -v error -y -i /tmp/video4k.mp4 -i public/mate-crudo.mp4 -map 0:v -map 1:a -c copy -shortest public/mate-crudo-4k.mp4
