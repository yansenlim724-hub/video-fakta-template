#!/usr/bin/env bash
# Setup mesin suara (Supertonic 3) — sekali saja per mesin.
# - venv Python + sherpa-onnx + numpy + soundfile
# - download model int8 (~123 MB) dari GitHub k2-fsa/sherpa-onnx, extract ke tts/model/
# - tanpa torch / tanpa GPU; jalan di CPU, ~2,2-2,4x realtime
set -euo pipefail
cd "$(dirname "$0")"

MODEL_URL="https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/sherpa-onnx-supertonic-3-tts-int8-2026-05-11.tar.bz2"
MODEL_DIR="model/sherpa-onnx-supertonic-3-tts-int8-2026-05-11"

python3 -m venv venv 2>/dev/null || true
# shellcheck disable=SC1091
source venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet sherpa-onnx numpy soundfile

if [ -f "$MODEL_DIR/voice.bin" ]; then
  echo "Model sudah ada di $MODEL_DIR — lewati download."
else
  mkdir -p model
  echo "Download model Supertonic 3 int8 (~123 MB)..."
  curl -L -o /tmp/supertonic3.tar.bz2 "$MODEL_URL"
  tar -xjf /tmp/supertonic3.tar.bz2 -C model
  rm -f /tmp/supertonic3.tar.bz2
  test -f "$MODEL_DIR/voice.bin" || { echo "GAGAL: model tidak lengkap."; exit 1; }
fi

echo "Tes cepat (1 kalimat, Seno)..."
python3 -c "
import sys; sys.path.insert(0, '.')
from tts_engine import build_tts
tts = build_tts()
a = tts.generate(text='Halo, ini tes suara Seno.', sid=9, speed=0.95)
print(f'OK — {len(a.samples)/a.sample_rate:.2f} detik audio, {a.sample_rate} Hz')
"
echo "SELESAI. Pakai: python3 tts/render_vo.py <folder-topik> --sid 9 --speed 0.95"
echo "Suara lain: lihat tts/VOICES.md (sid 0-9)."
