# Template 2 — Video Fakta Foto Asli

Sama seperti Template 1 (gaya V4 Captions: kanvas putih ber-grid, pil warna,
headline, caption kata-per-kata gaya TikTok, SFX pelan, loudnorm −14 LUFS),
tapi **semua aset gambar adalah FOTO ASLI** — foto sungguhan, bukan kartun,
ilustrasi, atau hasil generate AI.

Contoh jadi: **Madu** (`examples/madu/`, komposisi `FaktaMadu`).

## Bedanya dengan Template 1

| | Template 1 | Template 2 |
|---|---|---|
| Aset gambar | Generate di Google Flow (flat vector, latar putih) | Foto asli berlisensi bebas (Openverse / Wikimedia Commons) |
| Diagram | Gambar diagram kartun | Foto asli + label/panah di atasnya |
| Maskot | Maskot kartun pojok kanan bawah | TIDAK ADA — diganti foto asli |
| Proses aset | Putih → transparan (PIL) | Crop tengah ke 1:1 + resize (lihat `ASSET_GUIDE.md`) |

Layout, warna, pil, headline, caption, SFX, dan loudnorm: **sama** seperti
Template 1 (lihat `skill/SKILL.md`, pelajaran 31 = gaya standar V4).

## Cara bikin video baru (ringkas)

1. **Setup sekali saja:** `bash setup.sh` (npm install + font + SFX).
2. **Scaffold topik:** `bash ../../scripts/new-video.sh <nama-topik>` (dari root repo).
   (Atau salin `examples/madu/` sebagai contoh.)
3. **Riset** 3 fakta (tiap fakta 2+ sumber) → isi `examples/<topik>/facts.json`.
4. **Cari 7 foto asli** (3 foto utama, 3 foto detail, 1 foto penutup) —
   caranya di `ASSET_GUIDE.md`. Proses ke `public/assets/`.
5. **Tulis naskah VO** di `examples/<topik>/vo/*.txt` — kalimat pendek,
   **semua angka dieja jadi kata**.
6. **Render VO** — Supertonic: `python3 ../../tts/render_vo.py examples/<topik>`
   (per kalimat, buat timing caption pasti); Gemini: **satu blok utuh**
   per video (lihat `../../tts/rules.md` bag. 2 — jangan render per kalimat,
   kuota cuma 15 request/hari).
7. **Caption otomatis:** `python3 scripts/build_captions.py examples/<topik>`
   (dari file VO-nya sendiri).
8. **Tulis timing** di `src/timing-<topik>.ts`, **tulis komposisi** dengan
   meniru `src/CompositionMadu.tsx`, daftarkan di `src/Root.tsx`.
9. **Render + loudnorm:**
   ```bash
   npx remotion render Fakta<Topik> out/fakta-<topik>.mp4 --overwrite
   ffmpeg -i out/fakta-<topik>.mp4 -af loudnorm=I=-14:TP=-1.0:LRA=11 -c:v copy out/fakta-<topik>-loud.mp4
   ```
10. **Cek 5+ frame** (hook, tengah tiap fakta, penutup) sebelum diserahkan —
    foto harus asli dan sesuai topik, teks tidak terpotong/bertumpuk.

## Yang TIDAK ada di repo ini (sengaja)

- **Foto asli** — berlisensi bebas tapi tetap file biner; dicari per topik,
  sumber + lisensinya dicatat di `examples/<topik>/PHOTO_SOURCES.md`.
  Foto TIDAK ikut push GitHub (konektor tidak bisa push biner).
- **Model TTS Supertonic (~123 MB)** — di-download `../../tts/setup.sh`.
- **Video hasil render (.mp4)** — di-render lokal, bukan disimpan di repo.
- **Kunci/API apa pun** — repo ini tidak butuh kredensial.
