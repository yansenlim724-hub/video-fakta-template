# ASSET_GUIDE — Template 2 (Fakta Foto Asli)

Template 2 = Template 1 (gaya V4 Captions) dengan SATU perbedaan: **semua
aset gambar adalah FOTO ASLI (foto sungguhan)**. Bukan kartun, bukan
ilustrasi flat, bukan gambar AI. Foto cabai = foto cabai asli. **Tidak ada
maskot kartun** — slot sudut pun pakai foto asli.

## 1. Cara cari foto asli

Sumber (urut prioritas):

1. **Openverse** — https://api.openverse.org/v1/images/ — tanpa key.
   Filter lisensi `cc0,by` (boleh dipakai komersial; CC-BY wajib atribusi).
   Contoh query:
   `https://api.openverse.org/v1/images/?q=honey%20jar&license=cc0,by&page_size=10`
   Ambil field `url` (file langsung), `title`, `creator`, `license`,
   `foreign_landing_url`, `license_url`.
2. **Wikimedia Commons** — API tanpa key
   (`https://commons.wikimedia.org/w/api.php?action=query&...`), atau
   unduh manual dari situs. Lisensi bebas, cek per file.
3. **Unsplash / Pexels** — unduh manual dari situs (API-nya butuh key).
   Foto di sana gratis dipakai, tanpa atribusi wajib (tapi catat sumbernya
   tetap).

Kata kunci pencarian: pakai bahasa Inggris ("honey jar", "honeycomb",
"honey bee flower", "wildflower meadow", "honey pouring") — hasilnya jauh
lebih banyak daripada bahasa Indonesia.

## 2. Aturan foto (keras)

- HANYA lisensi bebas: CC0 atau CC-BY (boleh komersial). JANGAN foto
  berlisensi lain, JANGAN foto dari Google Images tanpa lisensi jelas.
- JANGAN foto ber-watermark/teks (termasuk © kecil di pojok) — DITOLAK
  walau lisensinya CC-BY. Jangan crop watermark-nya keluar.
- JANGAN gambar AI/kartun/ilustrasi — verifikasi tiap foto secara visual:
  foto asli, sesuai topik, bukan pola abstrak atau judul yang menyesatkan
  (contoh ditolak di demo Madu: "Honeycomb" yang ternyata pola geometris
  abu-abu; "honey drip" yang ternyata close-up kaca abstrak).
- Catat sumber + lisensi tiap foto di `examples/<topik>/PHOTO_SOURCES.md`
  (tabel: slot, file, judul, kreator, lisensi, landing URL).

## 3. Cara proses foto

Crop tengah ke 1:1 + resize 1024×1024 (PIL), simpan ke `public/assets/`:

```python
from PIL import Image
im = Image.open("foto-mentah.jpg").convert("RGB")
w, h = im.size
s = min(w, h)
im.crop(((w-s)//2, (h-s)//2, (w-s)//2+s, (h-s)//2+s)) \
  .resize((1024, 1024), Image.LANCZOS) \
  .save("public/assets/foto-utama-f1.jpg", quality=90)
```

Cek hasil proses secara visual (foto tidak terpotong aneh, subjek tetap di
tengah). Foto adalah file biner → **TIDAK ikut push GitHub** (hanya catatan
sumber di `PHOTO_SOURCES.md` yang ikut).

## 4. Pemetaan slot aset (7 foto)

| Slot | File | Dipakai di komposisi |
|---|---|---|
| Foto utama F1 | `foto-utama-f1.jpg` | PhotoHero F1 (360px) + foto hook (300px) + FactStrip lingkaran 1 |
| Foto detail F1 | `foto-detail-f1.jpg` | PhotoHero F1, foto kecil 150px pojok kanan bawah |
| Foto utama F2 | `foto-utama-f2.jpg` | PhotoHero F2 (360px) + FactStrip lingkaran 2 |
| Foto detail F2 | `foto-detail-f2.jpg` | PhotoHero F2, foto kecil 150px |
| Foto utama F3 | `foto-utama-f3.jpg` | PhotoHero F3 (360px) + FactStrip lingkaran 3 |
| Foto detail F3 | `foto-detail-f3.jpg` | PhotoHero F3, foto kecil 150px |
| Foto penutup | `foto-penutup.jpg` | Adegan tanya (200px) |

"Diagram" di Template 2 = **foto asli + label/panah di atasnya** (chip label
di pojok foto, mis. "SARANG MADU") — bukan gambar diagram kartun.

## 5. Contoh: demo Madu (2026-11-24)

| Slot | Foto | Kreator | Lisensi |
|---|---|---|---|
| Foto utama F1 | Big Honey Jar (stoples + pencelup madu) | Alabama Extension | CC0 |
| Foto detail F1 | Honeycomb (sarang madu asli) | wildxplorer | CC-BY 2.0 |
| Foto utama F2 | Honey Bee & Flower (lebah di bunga pink) | Kumaravel | CC-BY 2.0 |
| Foto detail F2 | Wildflower Meadow (ladang bunga + gunung) | Mount Rainier NPS | CC-BY 2.0 |
| Foto utama F3 | Honeybee Macro (makro lebah, kantong serbuk sari) | Pets4Dawn | CC-BY 2.0 |
| Foto detail F3 | Small Honey Jar with Honeycomb (sendok + sarang) | Alabama Extension | CC0 |
| Foto penutup | Honey Pour (tangan menuang madu) | Didriks | CC-BY 2.0 |

Detail lengkap + landing URL: `examples/madu/PHOTO_SOURCES.md`.
