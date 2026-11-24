# Aturan VO yang dipatenkan (video fakta)

Aturan ini lahir dari koreksi user langsung (2026-11-24) — jangan diubah
tanpa perintah user.

## 1. Semua angka dieja jadi kata — TANPA kecuali

Seno belibet membaca angka digit. Semua angka di naskah VO ditulis sebagai
kata Bahasa Indonesia, termasuk desimal dan tahun:

- `3` → "tiga", `9` → "sembilan", `500 juta` → "lima ratus juta"
- `0,1 detik` → "sepersepuluh detik"
- `241,4 mm` → "dua ratus empat puluh satu koma empat milimeter"
- `450 juta tahun` → "empat ratus lima puluh juta tahun"

**Angka di layar (headline, pil, label) tetap digit** — yang dieja hanya
teks yang DIUCAPKAN (dan caption kata-per-kata).

## 2. Kalimat pendek, render per kalimat

- Satu kalimat = satu render, jeda 0,25 dtk antar kalimat.
- Speed **0.95** (bukan 1.0 — user bilang 1.0 kecepetan).
- Jeda pembuka **~0,5 dtk** sebelum kalimat pertama (kata pertama jangan
  sampai kedengeran kepotong).

## 3. Kata yang dihindari

- **"tertua"** — Seno menggumam. Pakai **"paling tua"**.
- Istilah teknis yang rawan belibet diganti dengan penjelasan polos:
  `hemosianin` → "pengangkut oksigennya pakai tembaga",
  `kromatofora` → "sel warna".
- Jangan menebak kata mana yang belibet dari statistik timing — tanya user
  kata persisnya.

## 4. Istilah Inggris dinilai PER KATA, dengan didengarkan

Jangan berasumsi istilah Inggris selalu jelek. Uji 3 varian (asli / istilah
Indonesia / ejaan fonetik), kirim ke user, biarkan user pilih.
Contoh: "Madden Julian Oscillation" — user pilih **versi asli**
("asli aja gapapa keknya masih bagus").

## 5. Suara & kecepatan

- Narasi: **Seno (M5, sid 9)**, speed **0.95**.
- Suara kedua (video panjang): **Ratna (F3, sid 2)**.
- Lihat `tts/VOICES.md` untuk 10 karakter lengkap.
