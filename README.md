# Video Fakta — Template & Skill

Semua aturan, suara, dan kode untuk bikin video fakta vertikal gaya
**"3 Fakta Gila tentang ..."** — kanvas putih ber-grid, pil warna,
caption kata-per-kata gaya TikTok, VO Seno. Sekali clone, tinggal
bikin video baru tanpa mulai dari nol.

## Isi repo

| Folder | Isi |
|---|---|
| `skill/SKILL.md` | **Buku aturan lengkap** — 35 pelajaran dari 4 video (Bulan, Lebah, Hiu, Gurita). Baca ini dulu sebelum bikin video. |
| `templates/template-1-fakta-v4/` | **Template 1** — proyek Remotion gaya V4 Captions (gaya standar yang dipilih user 2026-11-24). Copy folder ini untuk tiap video baru. |
| `tts/` | Mesin suara (Supertonic 3, lokal, gratis, boleh komersial) + daftar 10 karakter suara + aturan VO yang dipatenkan. |
| `scripts/new-video.sh` | Scaffold topik baru dari contoh Gurita: `bash scripts/new-video.sh <nama-topik>`. |

## Cara bikin video baru (ringkas)

1. **Clone + setup sekali saja:**
   ```bash
   git clone https://github.com/yansenlim724-hub/video-fakta-template.git
   cd video-fakta-template
   bash tts/setup.sh                 # install Supertonic 3 + download model (~123 MB)
   cd templates/template-1-fakta-v4 && bash setup.sh   # npm install + font + SFX
   ```
2. **Scaffold topik:** `bash scripts/new-video.sh gurita-baru` (dari root repo).
3. **Riset** 3 fakta (tiap fakta 2+ sumber) → isi `topics/<topik>/facts.json`.
4. **Tulis naskah VO** di `topics/<topik>/vo/*.txt` — kalimat pendek,
   **semua angka dieja jadi kata** (Seno belibet baca digit).
5. **Render VO:** `python3 tts/render_vo.py topics/<topik> --sid 9 --speed 0.95`
   (sid 9 = Seno, suara narasi yang dikunci).
6. **Generate 7 aset di Google Flow** (prompt ada di `topics/<topik>/ASSET_PROMPTS.md`),
   lalu `python3 templates/template-1-fakta-v4/scripts/process_assets.py topics/<topik>`.
7. **Caption otomatis:** `python3 templates/template-1-fakta-v4/scripts/build_captions.py topics/<topik>`
   (ukur jeda kalimat dari file VO-nya sendiri, tanpa silencedetect manual).
8. **Tulis timing** di `src/timing-<topik>.ts` (durasi tiap segmen dari ffprobe),
   **tulis komposisi** dengan meniru `src/CompositionGurita.tsx`, daftarkan di `src/Root.tsx`.
9. **Render + loudnorm:**
   ```bash
   npx remotion render Fakta<Topik> out/fakta-<topik>.mp4 --overwrite
   ffmpeg -i out/fakta-<topik>.mp4 -af loudnorm=I=-14:TP=-1.0:LRA=11 -c:v copy out/fakta-<topik>-loud.mp4
   ```
10. **Cek 5 frame** (hook, tengah tiap fakta, penutup) sebelum diserahkan.

Detail tiap langkah ada di `skill/SKILL.md`.

## Template

- **Template 1 — `template-1-fakta-v4`**: gaya V4 Captions. Judul 64px,
  pil warna kontinyu, caption maks 3 kata/halaman, kata aktif warna aksen +
  scale 1,15, maskot pojok kanan bawah di semua adegan, halo bernapas +
  orbit, SFX pop/ding pelan, tanpa music bed. Contoh jadi: Gurita, Hiu, Lebah.
- **Template 2, 3, ...**: tinggal minta — tiap template baru masuk ke
  `templates/template-N-<nama>/` dengan README-nya sendiri.

## Suara (TTS)

Supertonic 3 via sherpa-onnx, jalan lokal di CPU, 44,1 kHz, lisensi boleh
komersial. 10 karakter suara (lihat `tts/VOICES.md`):

- Narasi dikunci: **Seno (M5, sid 9)** — pendongeng, speed 0.95.
- Suara kedua: **Ratna (F3, sid 2)** — penyiar.
- 8 lainnya: Raka, Bagas, Arka, Dimas, Nadia, Kira, Laras, Sinta.

Aturan VO yang dipatenkan ada di `tts/rules.md` (angka dieja kata, tanpa
kata "tertua", istilah Inggris dinilai per kata dengan didengarkan).

## Yang TIDAK ada di repo ini (sengaja)

- **Model TTS (~123 MB)** — di-download `tts/setup.sh` dari GitHub
  k2-fsa/sherpa-onnx (terlalu besar untuk GitHub biasa).
- **Aset gambar PNG** — di-generate per topik di Google Flow (prompt ikut
  di tiap folder topik). Contoh Gurita lengkap ada di
  `templates/template-1-fakta-v4/examples/gurita/`.
- **Video hasil render (.mp4)** — di-render lokal, bukan disimpan di repo.
- **Kunci/API apa pun** — repo ini tidak butuh kredensial.

## Lisensi

MIT — bebas dipakai, diubah, dan dipakai komersial.
