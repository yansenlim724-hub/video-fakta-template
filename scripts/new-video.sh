#!/usr/bin/env bash
# Scaffold topik video fakta baru dari contoh Gurita.
# Pakai dari root repo:  bash scripts/new-video.sh <nama-topik>
# Contoh: bash scripts/new-video.sh hiu-putih
set -euo pipefail

NAME="${1:-}"
if [ -z "$NAME" ]; then
  echo "Pakai: bash scripts/new-video.sh <nama-topik>"
  echo "Contoh: bash scripts/new-video.sh paus-biru"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="$ROOT/templates/template-1-fakta-v4"
TOPIC="$TEMPLATE/topics/$NAME"

if [ -e "$TOPIC" ]; then
  echo "Folder $TOPIC sudah ada — pilih nama lain."
  exit 1
fi

mkdir -p "$TOPIC/vo" "$TOPIC/audio" "$TOPIC/downloads"
cp "$TEMPLATE/examples/gurita/facts.json" "$TOPIC/facts.json"
cp "$TEMPLATE/examples/gurita/vo/"*.txt "$TOPIC/vo/"
cp "$TEMPLATE/examples/gurita/ASSET_PROMPTS.md" "$TOPIC/ASSET_PROMPTS.md"

cat > "$TOPIC/NOTES.md" <<EOF
# Topik: $NAME

Kerangka disalin dari contoh Gurita — EDIT semua isinya sebelum lanjut.

## Checklist
- [ ] Riset 3 fakta (tiap fakta 2+ sumber) -> isi facts.json
- [ ] Tulis naskah VO di vo/*.txt (kalimat pendek, ANGKA DIEJA KATA)
- [ ] Render VO: python3 tts/render_vo.py $TOPIC --sid 9 --speed 0.95
- [ ] Generate 7 aset di Flow (lihat ASSET_PROMPTS.md) -> simpan di downloads/
- [ ] Proses aset: python3 templates/template-1-fakta-v4/scripts/process_assets.py $TOPIC/downloads
- [ ] Caption: python3 templates/template-1-fakta-v4/scripts/build_captions.py $TOPIC
- [ ] Tulis src/timing-$NAME.ts (durasi dari ffprobe tiap audio/<seg>.wav)
- [ ] Copy src/CompositionGurita.tsx -> src/Composition<Nama>.tsx, sesuaikan
      headline/pil/diagram/warna, daftarkan di src/Root.tsx
- [ ] Render + loudnorm + cek 5 frame (lihat skill/SKILL.md)
EOF

echo ""
echo "Topik '$NAME' siap di: $TOPIC"
echo ""
echo "Langkah berikutnya:"
echo "  1. Riset 3 fakta, isi $TOPIC/facts.json"
echo "  2. Tulis naskah VO di $TOPIC/vo/*.txt (angka DIEJA, misal 'tiga' bukan '3')"
echo "  3. Render VO:  python3 tts/render_vo.py $TOPIC --sid 9 --speed 0.95"
echo "  4. Generate aset Flow (prompt di $TOPIC/ASSET_PROMPTS.md)"
echo "  5. Lihat checklist lengkap di $TOPIC/NOTES.md"
