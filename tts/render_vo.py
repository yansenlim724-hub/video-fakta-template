#!/usr/bin/env python3
"""Render VO satu topik video fakta — Seno (sid 9) default, speed 0.95.

Aturan VO yang dipatenkan (lihat tts/rules.md):
  - kalimat pendek, render PER KALIMAT + jeda 0,25 dtk antar kalimat
  - SEMUA angka di naskah sudah dieja jadi kata (jangan kirim digit ke Seno)
  - tanpa kata "tertua" (Seno belibet) — pakai "paling tua"

Pakai:
    python3 tts/render_vo.py <folder-topik> [--sid 9] [--speed 0.95] [--out <dir>]

Folder topik berisi vo/hook.txt, vo/f1.txt, vo/f2.txt, vo/f3.txt, vo/tanya.txt.
Output: <out>/<seg>.wav per segmen + vo-lengkap.wav (gabungan, jeda 0,5 dtk
antar segmen, buat review). Default out: <folder-topik>/audio.
"""
import argparse
import os
import re
import sys

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tts_engine import build_tts

SEGMENTS = ["hook", "f1", "f2", "f3", "tanya"]
GAP_SEC = 0.25
SEG_GAP_SEC = 0.5


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("topic", help="folder topik, berisi vo/*.txt")
    ap.add_argument("--sid", type=int, default=9, help="id suara (9 = Seno)")
    ap.add_argument("--speed", type=float, default=0.95)
    ap.add_argument("--out", default=None, help="folder output (default: <topik>/audio)")
    args = ap.parse_args()

    vo_dir = os.path.join(args.topic, "vo")
    out_dir = args.out or os.path.join(args.topic, "audio")
    os.makedirs(out_dir, exist_ok=True)

    tts = build_tts()
    print("model loaded", flush=True)
    combined = []
    sr = None
    for seg in SEGMENTS:
        path = os.path.join(vo_dir, seg + ".txt")
        if not os.path.isfile(path):
            print(f"  lewati {seg}: {path} tidak ada")
            continue
        text = open(path, encoding="utf-8").read().strip()
        # Pecah per KALIMAT — terminator bisa ".", "?" atau "!" (tanya pakai "?").
        sentences = [p.strip() for p in re.split(r"(?<=[.!?])\s+", text) if p.strip()]
        chunks = []
        for i, s in enumerate(sentences):
            audio = tts.generate(text=s, sid=args.sid, speed=args.speed)
            sr = audio.sample_rate
            d = np.array(audio.samples, dtype=np.float32)
            chunks.append(d)
            print(f"  {seg} kalimat {i + 1}: {len(d) / sr:.2f}s — {s}", flush=True)
            if i < len(sentences) - 1:
                chunks.append(np.zeros(int(GAP_SEC * sr), dtype=np.float32))
        full = np.concatenate(chunks)
        sf.write(os.path.join(out_dir, seg + ".wav"), full, sr)
        print(f"  -> {seg}.wav: {len(full) / sr:.2f}s", flush=True)
        combined.append(full)
        combined.append(np.zeros(int(SEG_GAP_SEC * sr), dtype=np.float32))
    combined = combined[:-1]
    full = np.concatenate(combined)
    sf.write(os.path.join(out_dir, "vo-lengkap.wav"), full, sr)
    print(f"DONE: {len(full) / sr:.2f}s total -> {out_dir}/vo-lengkap.wav")


if __name__ == "__main__":
    main()
