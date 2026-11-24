#!/usr/bin/env python3
"""Proses aset Flow (JPG latar putih) -> PNG transparan.

Resep (sama untuk Bulan/Lebah/Hiu/Gurita):
  alpha = clamp((255 - min(r,g,b)) * 2, 0-255); alpha = 0 kalau min > 241
  crop ke bbox alpha + padding 16px

Pakai:
    python3 scripts/process_assets.py <folder-gambar> [--out <dir>]

Folder gambar berisi file hasil download Flow yang SUDAH diganti namanya
menjadi nama aset, misal: icon-gurita-blue.jpg, diagram-jantung.jpg,
maskot-gurita.jpg. Output: <out>/<nama>.png (transparan).

WAJIB cek visual tiap hasil sebelum dipakai — nama file Flow bisa menipu;
yang menentukan adalah isi gambarnya, bukan namanya.
"""
import argparse
import os

import numpy as np
from PIL import Image

EXTS = (".jpg", ".jpeg", ".png")


def process(src, dst):
    im = Image.open(src).convert("RGB")
    arr = np.asarray(im).astype(np.int16)
    m = arr.min(axis=2)
    alpha = np.clip((255 - m) * 2, 0, 255).astype(np.uint8)
    alpha[m > 241] = 0
    rgba = np.dstack([np.asarray(im), alpha])
    out = Image.fromarray(rgba, "RGBA")
    bbox = out.getbbox()
    if bbox is None:
        raise ValueError(f"kosong (semua putih?): {src}")
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - 16)
    y0 = max(0, y0 - 16)
    x1 = min(out.width, x1 + 16)
    y1 = min(out.height, y1 + 16)
    out = out.crop((x0, y0, x1, y1))
    out.save(dst)
    return out.size, os.path.getsize(dst)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src_dir", help="folder gambar Flow (nama file = nama aset)")
    ap.add_argument("--out", default=None, help="folder output (default: public/assets)")
    args = ap.parse_args()

    out_dir = args.out or os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets"
    )
    os.makedirs(out_dir, exist_ok=True)
    files = sorted(
        f for f in os.listdir(args.src_dir) if f.lower().endswith(EXTS)
    )
    if not files:
        raise SystemExit(f"Tidak ada gambar di {args.src_dir}")
    for f in files:
        name = os.path.splitext(f)[0]
        dst = os.path.join(out_dir, name + ".png")
        size, nbytes = process(os.path.join(args.src_dir, f), dst)
        print(f"{name}.png: {size[0]}x{size[1]}, {nbytes} byte")
    print(f"OK — {len(files)} aset di {out_dir}/ (CEK VISUAL dulu sebelum dipakai)")


if __name__ == "__main__":
    main()
