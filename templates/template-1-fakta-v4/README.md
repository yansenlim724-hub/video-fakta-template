# Template 1 — Gaya V4 Captions ("3 Fakta Gila tentang ...")

Gaya standar video fakta yang dipilih user 2026-11-24 (dari 4 versi Hiu).
Contoh jadi di repo ini: **Gurita** (`examples/gurita/`, `src/CompositionGurita.tsx`),
**Hiu** (`src/CompositionHiuV4.tsx`), **Lebah** (`src/CompositionLebah.tsx`).

## Ciri gaya

- Kanvas putih ber-grid 64px, zoom global 1 → 1,02 sepanjang video.
- Judul fakta 64px, kata angka dihitung naik (count-up 0→angka, 40 frame).
- **Caption kata-per-kata gaya TikTok**: maks 3 kata/halaman, halaman
  bertahan sampai halaman berikut mulai, kata aktif warna aksen + scale 1,15,
  kata lain abu-abu 50%. Timing kata dari VO (bukan Whisper).
- Pil warna kontinyu: pil 2 mulai 10 frame SEBELUM pil 1 selesai, pil
  terakhir jalan sampai ~16 frame sebelum adegan berakhir. Pil tidak pernah
  meluncur — hanya crossfade di slot tetap.
- Maskot pojok kanan bawah di SEMUA adegan (bob + tilt sinus).
- Strip 3 ikon kanan atas selama fakta 1–3 (aktif berwarna, lain abu-abu).
- Halo bernapas (periode ~2 detik) + orbit di belakang diagram.
- SFX: pop saat headline tiap fakta (start adegan + 8), ding di penutup.
  **Hitung ulang posisi SFX dari timing SAAT INI tiap kali VO di-render
  ulang** (pop Hiu V4 sempat basi 2,2 detik karena timing berubah).
- Tanpa music bed. VO Seno 0.95, angka dieja kata. Lihat `skill/SKILL.md`.

## Setup (sekali per mesin)

```bash
bash setup.sh   # npm install + download font Plus Jakarta Sans + bikin SFX pop/ding
```

## Bikin video baru

```bash
# dari root repo:
bash scripts/new-video.sh <nama-topik>
# lalu ikuti checklist yang dicetak skrip itu
```

Alur lengkap ada di `skill/SKILL.md` dan README root repo.

## Struktur

| Path | Isi |
|---|---|
| `src/CompositionGurita.tsx` | **Pola acuan** — copy ini untuk topik baru. |
| `src/CompositionHiuV4.tsx` | Referensi gaya standar (Hiu). |
| `src/CompositionLebah.tsx` | Contoh video #2. |
| `src/timing-<topik>.ts` | Durasi tiap adegan (frame, 24 fps) + scene start. |
| `src/captions-<topik>.ts` | Timing kata-per-kata (dibangun `scripts/build_captions.py`). |
| `src/Root.tsx` | Daftarkan komposisi baru di sini. |
| `scripts/build_captions.py` | Caption otomatis dari file VO (ukur jeda sendiri). |
| `scripts/process_assets.py` | JPG Flow latar putih → PNG transparan. |
| `examples/gurita/` | Contoh topik lengkap (naskah, fakta, prompt aset). |
| `public/` | Diisi setup + hasil kerja: `fonts/`, `sfx/`, `assets/`, `audio/`. |

## Render

```bash
npx remotion render Fakta<Topik> out/fakta-<topik>.mp4 --overwrite
ffmpeg -i out/fakta-<topik>.mp4 -af loudnorm=I=-14:TP=-1.0:LRA=11 -c:v copy out/fakta-<topik>-loud.mp4
```

Target: **-14 LUFS, true peak ≤ -1 dB**. Cek 5 frame (hook, tengah tiap
fakta, penutup) sebelum diserahkan ke user.
