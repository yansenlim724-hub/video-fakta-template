# Contoh topik: Gurita (video fakta #4, selesai 2026-11-24)

Video jadi: 79,9 dtk, -13,96 LUFS. Komposisi: `src/CompositionGurita.tsx`,
timing: `src/timing-gurita.ts`, caption: `src/captions-gurita.ts`.

## Isi folder ini

- `facts.json` — 3 fakta + angka + pil + sumber (tiap fakta 2+ sumber).
- `vo/hook.txt`, `vo/f1.txt`, `vo/f2.txt`, `vo/f3.txt`, `vo/tanya.txt` —
  naskah VO final (angka sudah dieja kata, Seno 0.95).
- `ASSET_PROMPTS.md` — 7 prompt Flow untuk aset gambar topik ini.

## Fakta (terverifikasi)

1. **3 JANTUNG** — 2 ke insang, 1 ke tubuh; darah biru (tembaga);
   jantung utama berhenti saat berenang cepat.
2. **9 OTAK** — 1 pusat + 8 mini di pangkal lengan; ~500 juta neuron,
   2/3 di lengan; tiap lengan bisa bergerak sendiri.
3. **100 MILIDETIK** — ganti warna <0,1 dtk (tercepat di dunia hewan);
   tekstur kulit ikut berubah menyerupai karang/batu.

## Yang dipakai dari contoh ini saat scaffold topik baru

`scripts/new-video.sh <nama>` menyalin folder ini sebagai kerangka:
`facts.json` + `vo/*.txt` + `ASSET_PROMPTS.md` tinggal diedit isinya.
