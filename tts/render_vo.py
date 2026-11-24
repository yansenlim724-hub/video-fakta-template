#!/usr/bin/env python3
"""Render VO satu topik video fakta — Seno (sid 9) default, speed 0.95.

Aturan VO yang dipatenkan (lihat tts/rules.md):
  - --block = SATU BLOK UTUH per segmen: untuk video TANPA caption
    kata-per-kata, dan untuk hemat kuota Gemini (15 request/hari).
  - Tanpa --block = PER KALIMAT: cara DEFAULT untuk video fakta V4
    (timing caption pasti). Satu blok + split TIDAK boleh dipakai
    untuk timing caption (jeda koma bisa lebih panjang dari jeda
    antar-kalimat — terbukti di tes 2026-11-24).
  - SEMUA angka di naskah sudah dieja jadi kata (jangan kirim digit ke Seno)
  - tanpa kata "tertua" (Seno belibet) — pakai "paling tua"

Pakai:
    python3 tts/render_vo.py <folder-topik> --block [--sid 9] [--speed 0.95] [--out <dir>]

Folder topik berisi vo/hook.txt, vo/f1.txt, vo/f2.txt, vo/f3.txt, vo/tanya.txt.
Output (--block): <out>/<seg>-block.wav per segmen + vo-lengkap.wav
(gabungan, jeda 0,5 dtk antar segmen, buat review). Tanpa --block:
<out>/<seg>.wav per segmen (per kalimat + jeda 0,25 dtk). Default out:
<folder-topik>/audio.
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
OPENING_SEC = 0.5


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("topic", help="folder topik, berisi vo/*.txt")
    ap.add_argument("--sid", type=int, default=9, help="id suara (9 = Seno)")
    ap.add_argument("--speed", type=float, default=0.95)
    ap.add_argument("--out", default=None, help="folder output (default: <topik>/audio)")
    ap.add_argument("--block", action="store_true",
                    help="render SATU BLOK UTUH per segmen (aturan baru, lihat tts/rules.md bag. 2); tanpa flag = per kalimat (fallback)")
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
        if args.block:
            # SATU BLOK UTUH: semua kalimat sekaligus, jeda pembuka 0,5 dtk.
            audio = tts.generate(text=text, sid=args.sid, speed=args.speed)
            sr = audio.sample_rate
            d = np.array(audio.samples, dtype=np.float32)
            full = np.concatenate([np.zeros(int(OPENING_SEC * sr), dtype=np.float32), d])
            print(f"  {seg} blok utuh: {len(full) / sr:.2f}s", flush=True)
            sf.write(os.path.join(out_dir, seg + "-block.wav"), full, sr)
            print(f"  -> {seg}-block.wav: {len(full) / sr:.2f}s (potong pakai tts/split_vo.py)", flush=True)
        else:
            # Fallback per KALIMAT — terminator bisa ".", "?" atau "!" (tanya pakai "?").
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
