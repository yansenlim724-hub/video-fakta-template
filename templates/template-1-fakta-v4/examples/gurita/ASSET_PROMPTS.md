# Prompt aset Flow — contoh Gurita (7 gambar)

Generate di Google Flow (mode gambar). Semua 7 gambar **satu gaya yang
sama**: flat vector, latar putih polos, tanpa teks/label apa pun di gambar.
Prompt di bawah ini rekonstruksi dari 7 hasil yang sudah terverifikasi
bagus (2026-11-24) — pakai sebagai pola, ganti subjeknya per topik.

> Kalau Flow memblokir ("aktivitas tidak biasa"): ganti ke profil browser
> baru yang segar dulu sebelum menyerah (pernah pulih total begitu).

## 1. `icon-gurita-blue.jpg` — ikon topik
> Flat vector icon of a cute blue octopus, front view, simple bold shapes,
> solid blue color, centered, pure white background, no text.

## 2. `icon-jantung-rose.jpg` — ikon fakta 1
> Flat vector icon of a solid rose-red heart, simple bold shape, centered,
> pure white background, no text.

## 3. `icon-otak-teal.jpg` — ikon fakta 2
> Flat vector icon of a teal brain, simple bold shapes, side view, centered,
> pure white background, no text.

## 4. `diagram-jantung.jpg` — diagram fakta 1
> Flat vector educational diagram of an octopus anatomy showing three hearts
> and blue blood vessels, orange octopus, hearts in rose pink, blue drops,
> clean minimal style, pure white background, no text, no labels.

## 5. `diagram-otak.jpg` — diagram fakta 2
> Flat vector illustration, top-down view of an octopus with a glowing cyan
> brain in the center and eight small glowing nodes at the base of each arm,
> orange octopus, pure white background, no text.

## 6. `diagram-kamuflase.jpg` — diagram fakta 3
> Flat vector illustration of an octopus camouflaged, left half in bright
> coral reef colors and orange, right half grey rock texture with spots,
> split down the middle, pure white background, no text.

## 7. `maskot-gurita.jpg` — maskot (pojok kanan bawah, semua adegan)
> Cute flat vector mascot of an orange octopus, big round head, small smile,
> eight short curly arms, friendly, centered, pure white background, no text.

## Setelah generate

1. Download ke-7 gambar, ganti namanya sesuai daftar di atas.
2. Proses jadi PNG transparan:
   `python3 scripts/process_assets.py <folder-download> --out public/assets`
3. **Cek visual tiap hasil** (buka gambarnya, jangan percaya nama file):
   ikon bersih tanpa teks, diagram sesuai fakta, transparansi rapi
   (grid kanvas kelihatan tembus di sekeliling gambar).
