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

## 2. VO SATU BLOK UTUH — tapi lihat mesin & kebutuhan caption

Aturan ini hasil TES (2026-11-24 malam): satu blok lalu dipotong TIDAK
selalu bisa diandalkan — jeda koma Seno bisa LEBIH PANJANG dari jeda
antar-kalimat, jadi potongan bisa salah gabung (tes: kalimat 6 kata
dapat 6,12 dtk, kalimat 21 kata dapat 3,79 dtk — merge salah). Karena
itu aturannya dibedakan:

**A. Gemini TTS (kuota 15 request/hari) — WAJIB satu blok.**
Video 10 menit = 50–60 kalimat; render per kalimat menghabiskan kuota
4 hari untuk satu video. Satu blok = 1 request. Batas: maks ~11
menit/blok (16.384 token ÷ 25 token/detik); amannya 4.000–6.000
karakter/blok (~5–7 menit) supaya aman dari TPM 10.000. Video 15 menit
= 2–3 blok. Kirim SATU naskah utuh per blok ke `gemini_tts.py`.

**B. Video TANPA caption kata-per-kata (video panjang) — satu blok,
   Supertonic maupun Gemini.** Tidak butuh timing per kalimat, jadi
   tidak perlu dipotong presisi. Potong kasar per beat/segmen kalau
   perlu saja (pakai `tts/split_vo.py`).

**C. Video fakta V4 (caption kata-per-kata) + Supertonic — TETAP
   render per kalimat.** Supertonic lokal & gratis (tidak ada kuota),
   dan per kalimat memberi timing PASTI buat caption. Satu blok +
   split TIDAK boleh dipakai untuk timing caption — jumlah potongan
   yang cocok belum tentu isinya benar (lihat tes di atas).
   `render_vo.py` tanpa `--block` = cara ini.

**D. Kalau satu kata salah baca:** render ulang kalimat itu saja lalu
   tempel — jangan render ulang satu blok penuh kalau tidak perlu
   (berlaku A, B, C).

Catatan: aturan angka dieja kata (bagian 1) dan kalimat pendek tetap
berlaku — naskah ditulis per kalimat pendek seperti biasa. Speed tetap
**0.95**, jeda pembuka **~0,5 dtk** sebelum kalimat pertama.
`tts/split_vo.py` = alat potong blok (deteksi sunyi ≥0,2 dtk, gabung
lewat jeda terpendek, verifikasi jumlah potongan = jumlah kalimat) —
dipakai untuk kasus B saja; untuk timing caption pakai cara C.

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
