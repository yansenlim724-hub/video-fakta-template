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

## 6. VO Gemini Puck untuk video fakta (disetujui user 2026-11-25, "cocok")

- Suara: **Puck** — laki-laki muda, energik, gaya mengajar. Dipakai untuk video fakta Template 1 (uji coba Telur).
- Render **SATU BLOK** per video (1 request) — sama seperti aturan 2A. Helper `gemini_tts.py` TIDAK punya parameter gaya/prompt/style — gaya mengandalkan karakter bawaan Puck.
- **Loop cek ejaan WAJIB:** transkripsi balik audio dengan faster-whisper model **small** (bahasa id); kata kunci (angka dieja, istilah, kata serapan) harus cocok di transkrip; kalau tidak cocok, perbaiki ejaan naskah lalu render ulang bloknya. Model **base TIDAK boleh** dipakai untuk cek ejaan (salah di 6 kata pada tes Telur: bernapas→benapa, setengah→stengah, bunyi→punya, omelet→omlat, dioksida→di Oksida). Catatan: Whisper menormalisasi angka jadi digit ("tujuh belas ribu" → "17 ribu") — itu BUKAN bukti Puck mengucap digit; yang dicek adalah kata-katanya. Satu keraguan yang dibiarkan: "burung unta" terdengar "burung untah" di kedua model — bagi pendengar Indonesia tetap terbaca "burung unta"; jangan "diperbaiki" kecuali user mendengar jelas salah.
- **Timing caption dari blok Gemini: JANGAN pakai `split_vo.py`** — terbukti salah gabung di blok Puck walau jumlah potongan cocok (segmen 7 kata cuma 0,80 dtk; bandingkan Whisper: 2,60 dtk). Pakai **word-timestamps Whisper small** (align kata 100% dulu — termasuk perbaikan merge desimal "0," + "3" → "nol koma tiga" — baru bangun timing + caption).
