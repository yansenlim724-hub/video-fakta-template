#!/usr/bin/env python3
"""Bangun timing kata-per-kata untuk caption V4 — OTOMATIS dari file VO.

Dulu (Bulan/Hiu/Gurita) tabel klausa diisi manual dari output silencedetect.
Skrip ini melakukan langkah yang sama sendiri:

  1. baca naskah vo/<seg>.txt -> pecah jadi kalimat (klausa)
  2. jalankan ffmpeg silencedetect (-40 dB) pada audio/<seg>.wav
  3. gabungkan rentang bicara yang dipisah jeda < 0,9 dtk (jeda koma di
     dalam kalimat) -> rentang klausa
  4. kalau jumlah rentang == jumlah kalimat, pakai rentang itu;
     kalau tidak cocok, fallback: bagi rata seluruh durasi file
  5. kata di DALAM klausa dibagi rata (aproksimasi, bukan Whisper)

Pakai:
    python3 scripts/build_captions.py <folder-topik> [--audio-dir <dir>] [--out <file.ts>] [--const CAPTIONS_GURITA]

Folder topik berisi vo/*.txt dan audio/*.wav (hasil tts/render_vo.py).
Output default: src/captions-<nama-topik>.ts (di folder template ini).
Frame LOKAL segmen, 24 fps.
"""
import argparse
import json
import os
import re
import subprocess
import sys

FPS = 24
SILENCE_DB = -40
# Jeda antar-kalimat di VO hasil render cuma ~0,25 dtk + padding (~0,38 dtk),
# nyaris sama dengan jeda koma di DALAM kalimat (0,19-0,40 dtk) — jadi
# ambang tetap TIDAK BISA membedakan keduanya. Sebagai gantinya, gabungkan
# rentang bicara dari celah TERKECIL sampai jumlahnya == jumlah kalimat.

SEGMENTS = ["hook", "f1", "f2", "f3", "tanya"]


def sentences(text: str):
    # Pecah per KALIMAT — terminator bisa ".", "?" atau "!" (tanya pakai "?").
    parts = [p.strip() for p in re.split(r"(?<=[.!?])\s+", text.strip()) if p.strip()]
    return parts


def ffprobe_duration(path: str) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", path],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def detect_silences(path: str):
    """Kembalikan daftar (start, end) jeda dari ffmpeg silencedetect."""
    r = subprocess.run(
        ["ffmpeg", "-i", path, "-af",
         f"silencedetect=noise={SILENCE_DB}dB:d=0.1", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    return list(zip(starts, ends))


def speech_spans(silences, duration: float, n_sentences: int):
    """Rentang bicara = celah antar jeda; gabungkan dari celah terkecil
    sampai jumlah rentang == jumlah kalimat (naskah sudah diketahui)."""
    spans = []
    cursor = 0.0
    for s, e in silences:
        if s > cursor:
            spans.append([cursor, s])
        cursor = max(cursor, e)
    if cursor < duration:
        spans.append([cursor, duration])
    # buang rentang super-pendek (<0,05 dtk — biasanya noise)
    spans = [sp for sp in spans if sp[1] - sp[0] >= 0.05]
    while len(spans) > n_sentences:
        gaps = [(spans[i + 1][0] - spans[i][1], i) for i in range(len(spans) - 1)]
        _, i = min(gaps)
        spans[i][1] = spans[i + 1][1]
        del spans[i + 1]
    return [(a, b) for a, b in spans]


def clean(w: str) -> str:
    return re.sub(r"[,.\\?'\"!]", "", w)


def build_segment(topic_dir: str, audio_dir: str, seg: str):
    txt_path = os.path.join(topic_dir, "vo", seg + ".txt")
    wav_path = os.path.join(audio_dir, seg + ".wav")
    text = open(txt_path, encoding="utf-8").read().strip()
    cls = sentences(text)
    dur = ffprobe_duration(wav_path)
    sil = detect_silences(wav_path)
    spans = speech_spans(sil, dur, len(cls))
    if len(spans) != len(cls):
        print(
            f"  {seg}: PERINGATAN — {len(spans)} rentang bicara != {len(cls)} kalimat; "
            "fallback bagi rata seluruh durasi.",
            file=sys.stderr,
        )
        spans = [(0.0, dur)] if len(cls) == 1 else [
            (i * dur / len(cls), (i + 1) * dur / len(cls)) for i in range(len(cls))
        ]
    words = []
    for (s, e), clause in zip(spans, cls):
        ws = [clean(w) for w in clause.split() if clean(w)]
        n = len(ws)
        per = (e - s) / n
        for i, w in enumerate(ws):
            words.append({
                "t": w,
                "start": round((s + i * per) * FPS),
                "end": round((s + (i + 1) * per) * FPS),
            })
    print(f"  {seg}: {len(words)} kata, {len(cls)} klausa, span {spans}")
    return words


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("topic", help="folder topik (berisi vo/*.txt)")
    ap.add_argument("--audio-dir", default=None,
                    help="folder wav (default: <topik>/audio)")
    ap.add_argument("--out", default=None, help="file .ts output")
    ap.add_argument("--const", default=None,
                    help="nama konstanta TS (default: CAPTIONS_<NAMA>)")
    args = ap.parse_args()

    topic = args.topic
    name = os.path.basename(os.path.normpath(topic))
    audio_dir = args.audio_dir or os.path.join(topic, "audio")
    const = args.const or ("CAPTIONS_" + name.upper().replace("-", "_"))
    out = args.out or os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "src",
        f"captions-{name}.ts",
    )

    result = {}
    for seg in SEGMENTS:
        txt = os.path.join(topic, "vo", seg + ".txt")
        wav = os.path.join(audio_dir, seg + ".wav")
        if not os.path.isfile(txt) or not os.path.isfile(wav):
            print(f"  lewati {seg}: naskah/wav tidak ada")
            continue
        result[seg] = build_segment(topic, audio_dir, seg)

    ts = "// Timing kata-per-kata untuk caption V4 (TikTok-style).\n"
    ts += "// Dibangun otomatis dari VO (scripts/build_captions.py).\n"
    ts += "// Kata di DALAM klausa dibagi rata — aproksimasi, bukan Whisper.\n"
    ts += "// start/end = frame LOKAL segmen (24 fps).\n"
    ts += "export type CaptionWord = { t: string; start: number; end: number };\n"
    ts += f"export const {const}: Record<string, CaptionWord[]> = "
    ts += json.dumps(result, ensure_ascii=False, indent=2) + ";\n"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(ts)
    print(f"OK -> {out}")


if __name__ == "__main__":
    main()
