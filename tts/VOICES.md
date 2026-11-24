# Memilih karakter suara

Mesin: **Supertonic 3** (sherpa-onnx int8) — jalan lokal di CPU, 44,1 kHz,
2,2–2,4× realtime, lisensi **boleh komersial**. Setup sekali:
`bash tts/setup.sh` (download model ~123 MB dari GitHub k2-fsa).

## Yang dikunci (jangan diubah tanpa perintah user)

| Peran | Suara | sid |
|---|---|---|
| **Narasi video fakta & video panjang** | **Seno (M5, Pendongeng)** | **9** |
| Suara kedua video panjang | **Ratna (F3, Penyiar)** | **2** |

## 10 karakter (nama dari user, 2026-11-21)

| sid | Kode | Nama | Karakter | Kelamin |
|---|---|---|---|---|
| 0 | F1 | Nadia | Tenang | Perempuan |
| 1 | F2 | Kira | Ceria | Perempuan |
| 2 | F3 | Ratna | Penyiar | Perempuan |
| 3 | F4 | Laras | Tegas | Perempuan |
| 4 | F5 | Sinta | Lembut | Perempuan |
| 5 | M1 | Raka | Semangat | Laki-laki |
| 6 | M2 | Bagas | Berat | Laki-laki |
| 7 | M3 | Arka | Pembawa Acara | Laki-laki |
| 8 | M4 | Dimas | Ramah | Laki-laki |
| 9 | M5 | Seno | Pendongeng | Laki-laki |

## Dengarkan dulu sebelum memilih

```bash
python3 tts/generate_samples.py   # render 1 kalimat contoh di 10 suara -> tts/samples/
```

Lalu putar file `tts/samples/sid-<n>-<nama>.wav` dan pilih yang paling cocok.
Ganti suara narasi = ubah `--sid` di `tts/render_vo.py` (dan catat di
`tts/voices.json` bagian `locked` kalau user mengunci yang baru).

## Catatan

- Tag ekspresi yang jalan: `<laugh>`, `<breath>`, `<sigh>`. **Tidak ada**
  `<cough>`. Tidak ada preset anak kecil / suara serak.
- Kadang volume meloncat keras DI DALAM kalimat — itu bug bawaan mesin.
  Perbaikan polish **ditolak user** (2026-11-21, "biar seperti semula aja") —
  biarkan apa adanya, jangan coba perbaiki.
- Gemini TTS (Aoede) dipakai terpisah untuk video affiliate pendek Facebook,
  bukan untuk video fakta ini.
