#!/usr/bin/env bash
# Setup Template 2 (sekali per mesin, di dalam folder template ini).
# Sama seperti Template 1:
# - npm install
# - download font Plus Jakarta Sans (variable) dari google/fonts
# - bikin SFX pop.mp3 + ding.mp3 (ffmpeg, setara file asli yang kecil)
# Bedanya: aset gambar Template 2 adalah FOTO ASLI (lihat ASSET_GUIDE.md),
# bukan hasil generate — tidak ada proses transparan seperti Template 1.
set -euo pipefail
cd "$(dirname "$0")"

command -v node >/dev/null || { echo "node tidak ketemu — install Node 20+ dulu."; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg tidak ketemu — install ffmpeg dulu."; exit 1; }

echo "npm install..."
npm install --no-audit --no-fund

mkdir -p public/fonts public/sfx public/assets public/audio

if [ ! -s public/fonts/PlusJakartaSans.ttf ]; then
  echo "Download font Plus Jakarta Sans..."
  curl -sL -o public/fonts/PlusJakartaSans.ttf \
    "https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
fi
FONT_SIZE=$(stat -c%s public/fonts/PlusJakartaSans.ttf 2>/dev/null || echo 0)
if [ "$FONT_SIZE" -lt 50000 ]; then
  echo "PERINGATAN: font gagal di-download (ukuran $FONT_SIZE byte). Cek internet, lalu jalankan lagi."
  rm -f public/fonts/PlusJakartaSans.ttf
else
  echo "Font OK ($FONT_SIZE byte)."
fi

if [ ! -s public/sfx/pop.mp3 ]; then
  echo "Bikin SFX pop.mp3..."
  ffmpeg -y -v error -f lavfi -i "sine=frequency=900:duration=0.12" \
    -af "afade=t=out:st=0.05:d=0.07" public/sfx/pop.mp3
fi
if [ ! -s public/sfx/ding.mp3 ]; then
  echo "Bikin SFX ding.mp3..."
  ffmpeg -y -v error -f lavfi -i "sine=frequency=1318:duration=0.5" \
    -af "afade=t=out:st=0.2:d=0.3,volume=0.6" public/sfx/ding.mp3
fi

echo "SELESAI. Render contoh: npx remotion render FaktaMadu out/fakta-madu.mp4 --overwrite"
