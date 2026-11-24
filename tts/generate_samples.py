#!/usr/bin/env python3
"""Render 1 kalimat contoh di semua 10 suara — buat memilih karakter.

    python3 tts/generate_samples.py [--text "Kalimat contohnya."]

Output: tts/samples/sid-<n>-<nama>.wav
"""
import argparse
import os
import sys

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tts_engine import build_tts

VOICES = [
    (0, "Nadia"), (1, "Kira"), (2, "Ratna"), (3, "Laras"), (4, "Sinta"),
    (5, "Raka"), (6, "Bagas"), (7, "Arka"), (8, "Dimas"), (9, "Seno"),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--text",
        default="Halo, nama saya Seno. Saya akan membacakan tiga fakta gila tentang gurita.",
    )
    args = ap.parse_args()
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "samples")
    os.makedirs(out_dir, exist_ok=True)
    tts = build_tts()
    print("model loaded", flush=True)
    for sid, name in VOICES:
        audio = tts.generate(text=args.text, sid=sid, speed=0.95)
        sr = audio.sample_rate
        d = np.array(audio.samples, dtype=np.float32)
        path = os.path.join(out_dir, f"sid-{sid}-{name}.wav")
        sf.write(path, d, sr)
        print(f"  sid {sid} {name}: {len(d) / sr:.2f}s -> {path}", flush=True)
    print("DONE — putar file di tts/samples/ untuk memilih suara.")


if __name__ == "__main__":
    main()
