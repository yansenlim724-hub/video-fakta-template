# Mesin suara (TTS) — Supertonic 3

Jalan **lokal di CPU**, tanpa API, tanpa biaya per karakter, lisensi
**boleh komersial**. Satu kali setup, dipakai semua video.

## Setup (sekali per mesin)

```bash
bash tts/setup.sh
```

Yang dilakukan setup: bikin venv Python, install `sherpa-onnx` + `numpy` +
`soundfile`, download model int8 (~123 MB) dari GitHub k2-fsa/sherpa-onnx,
lalu tes 1 kalimat Seno. Model **tidak** ikut di-commit ke repo (terlalu
besar) — di-download saat setup.

## Render VO satu topik

```bash
python3 tts/render_vo.py <folder-topik> --sid 9 --speed 0.95
```

Folder topik berisi `vo/hook.txt`, `vo/f1.txt`, `vo/f2.txt`, `vo/f3.txt`,
`vo/tanya.txt`. Output: `audio/<seg>.wav` + `audio/vo-lengkap.wav`.

## File di folder ini

| File | Isi |
|---|---|
| `tts_engine.py` | `build_tts()` — load model (cari di env, `tts/model/`, atau instalasi lama VM). |
| `render_vo.py` | Render VO per topik (per kalimat + jeda 0,25 dtk). |
| `generate_samples.py` | Render 1 kalimat contoh di 10 suara → `samples/`. |
| `voices.json` | 10 karakter suara + yang dikunci (Seno 9, Ratna 2). |
| `VOICES.md` | Cara memilih karakter suara. |
| `rules.md` | **Aturan VO yang dipatenkan** (angka dieja kata, dll). |
| `setup.sh` | Instalasi sekali saja. |

## Kenapa bukan TTS lain

- Kokoro / ArboTTS / VoxCPM2: **dihapus permanen** 2026-11-21, jangan dihidupkan lagi.
- Gemini TTS: kuota API terpisah, dipakai untuk video affiliate pendek saja.
- Gemini API image generation: **mati** (kuota 0) — gambar tetap lewat Flow.
