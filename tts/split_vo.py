#!/usr/bin/env python3
"""Potong satu blok VO utuh jadi per kalimat — deteksi sunyi.

Dipakai untuk aturan VO satu blok, kasus B (lihat tts/rules.md bagian 2):
video TANPA caption kata-per-kata — potong kasar per beat/segmen saja.
Render dulu SATU blok utuh (render_vo.py --block, atau satu request
Gemini TTS), baru potong di sini.

PERINGATAN (tes 2026-11-24): jumlah potongan yang cocok TIDAK menjamin
isinya benar — jeda koma Seno bisa lebih panjang dari jeda antar-kalimat,
jadi merge bisa salah gabung. JANGAN pakai script ini untuk timing
caption kata-per-kata; untuk itu render per kalimat (render_vo.py tanpa
--block).

Pakai:
    python3 tts/split_vo.py <blok.wav> <kalimat.txt> --out <dir>
      [--min-silence 0.2] [--threshold-db -40]

kalimat.txt: satu kalimat per baris, URUTAN SAMA dengan isi blok.
Output: seg-01.wav, seg-02.wav, ... + timings.json (start + durasi tiap
potongan). Kalau potongan awal lebih banyak dari kalimat (mis. jeda koma
ikut kepotong), script menggabungkan lewat jeda TERPENDEK dulu.

ATURAN: jumlah potongan HARUS sama dengan jumlah kalimat. Kalau tidak sama,
script KELUAR dengan error (exit 2) dan TIDAK menulis potongan — jangan
pakai hasil potongan yang jumlahnya tidak cocok; fallback ke render per
kalimat (render_vo.py tanpa --block).
"""
import argparse
import json
import os
import sys

import numpy as np
import soundfile as sf


def find_regions(x, sr, threshold_db=-40.0, min_silence=0.2, frame_sec=0.01, pad=0.05):
    """Cari daerah bersuara: pisahkan di tiap jeda sunyi >= min_silence.

    Kembalikan (regions, gaps): regions = daftar (start, end) detik,
    gaps[j] = durasi jeda sunyi antara regions[j] dan regions[j+1].
    Jeda koma (pendek) ikut kepotong di sini — penggabungannya ada di main().
    """
    if x.ndim > 1:
        x = x.mean(axis=1)
    win = max(1, int(frame_sec * sr))
    n = len(x) // win
    xr = x[: n * win].reshape(n, win)
    rms = np.sqrt(np.mean(xr ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms + 1e-12)
    speech = db > threshold_db
    min_sil_frames = max(1, int(round(min_silence / frame_sec)))
    raw = []  # (start_frame, end_frame_excl, gap_after_frames atau None)
    i = 0
    total = len(speech)
    while i < total:
        if not speech[i]:
            i += 1
            continue
        start = i
        j = i
        last_speech = i
        gap_after = None
        while j < total:
            if speech[j]:
                last_speech = j
                j += 1
            else:
                k = j
                while k < total and not speech[k]:
                    k += 1
                if k - j >= min_sil_frames:
                    gap_after = k - j
                    break
                j = k
        raw.append((start, last_speech + 1, gap_after))
        i = j
    regions = []
    gaps = []
    for idx, (s, e, g) in enumerate(raw):
        s2 = max(0.0, s * frame_sec - pad)
        e2 = min(len(x) / sr, e * frame_sec + pad)
        if idx > 0:
            s2 = max(s2, regions[-1][1])
        regions.append((s2, e2))
        if g is not None:
            gaps.append(g * frame_sec)
    return regions, gaps


def merge_to_count(regions, gaps, target):
    """Gabung potongan lewat jeda TERPENDEK sampai jumlah = target.

    Jeda koma lebih pendek dari jeda antar-kalimat, jadi penggabungan
    mulai dari jeda tersingkat. Kalau potongan sudah lebih sedikit dari
    target, tidak bisa digabung — kembalikan apa adanya (nanti gagal).
    """
    regions = list(regions)
    gaps = list(gaps)
    while len(regions) > target and gaps:
        i = min(range(len(gaps)), key=lambda k: gaps[k])
        regions[i:i + 2] = [(regions[i][0], regions[i + 1][1])]
        del gaps[i]
    return regions


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("block", help="file wav blok utuh")
    ap.add_argument("sentences", help="file teks, satu kalimat per baris")
    ap.add_argument("--out", required=True, help="folder output potongan")
    ap.add_argument("--min-silence", type=float, default=0.2)
    ap.add_argument("--threshold-db", type=float, default=-40.0)
    args = ap.parse_args()

    sents = [ln.strip() for ln in open(args.sentences, encoding="utf-8") if ln.strip()]
    if not sents:
        print("kalimat.txt kosong", file=sys.stderr)
        return 2
    x, sr = sf.read(args.block)
    regions, gaps = find_regions(x, sr, args.threshold_db, args.min_silence)
    print(f"  blok: {len(x) / sr:.2f}s, {len(sents)} kalimat, {len(regions)} potongan awal terdeteksi")
    if len(regions) > len(sents):
        regions = merge_to_count(regions, gaps, len(sents))
        print(f"  gabung lewat jeda terpendek -> {len(regions)} potongan")
    if len(regions) != len(sents):
        print(
            f"  GAGAL: potongan ({len(regions)}) != kalimat ({len(sents)}). "
            "Jangan pakai hasil potongan — fallback ke render per kalimat "
            "(render_vo.py tanpa --block).",
            file=sys.stderr,
        )
        return 2
    os.makedirs(args.out, exist_ok=True)
    if x.ndim > 1:
        x = x.mean(axis=1)
    timings = []
    for i, ((s, e), sent) in enumerate(zip(regions, sents), 1):
        seg = x[int(s * sr): int(e * sr)]
        name = f"seg-{i:02d}.wav"
        sf.write(os.path.join(args.out, name), seg, sr)
        timings.append({"sentence": sent, "start": round(s, 3), "duration": round(len(seg) / sr, 3)})
        print(f"  -> {name}: {len(seg) / sr:.2f}s — {sent}")
    with open(os.path.join(args.out, "timings.json"), "w", encoding="utf-8") as f:
        json.dump(timings, f, ensure_ascii=False, indent=2)
    print(f"DONE: {len(regions)} potongan -> {args.out}/timings.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
