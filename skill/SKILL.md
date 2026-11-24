# Video Fakta Remotion — Skill

> **Catatan repo:** skill ini ditulis di VM kerja asli (proyek
> `~/workspace/remotion-fakta-bulan/`, suara di `~/workspace/supertonic-test/`).
> Kalau repo ini di-clone ke tempat lain, ganti path itu dengan lokasi clone
> kamu — semua langkahnya sama. Versi repo ini = salinan 1:1 dari skill asli
> (44 pelajaran, per 2026-11-25).

**Nama skill:** `video-fakta-remotion`
**Tujuan:** bikin video fakta vertikal 720×1280 (±45–60 detik, format "3 Fakta Gila tentang X") yang padat, smooth, dan bisa diulang untuk topik apa pun.
**Dipatenkan:** 2026-11-23, dari video Bulan (v1–v6) + video Lebah (v1). Proyek kerja: `~/workspace/remotion-fakta-bulan/`.

## Sistem visual (JANGAN diubah tanpa alasan)

- Kanvas putih `#FFFFFF` + grid abu-abu tipis (`rgba(15,23,42,0.07)`, sel 64px), sama sepanjang video — adegan berganti di atas kanvas yang sama, tanpa potongan latar.
- Font: **Plus Jakarta Sans** (bundle di `public/fonts/PlusJakartaSans.ttf`, `@font-face` + `delayRender` sampai font ke-load). Judul 800, pil 700.
- Warna: tinta `#0F172A`; oranye `#F97316`; biru `#2563EB`; teal `#0D9488`; rose `#E11D48`; hijau `#22C55E`; merah `#EF4444`.
- Wordmark **"Lamaku"** pojok kiri atas (800, 30px).
- Struktur adegan: hook → fakta 1 → fakta 2 → fakta 3 → pertanyaan penutup.
  - Hook: pil oranye "3 FAKTA GILA" → judul 2 baris 84px → 3 lingkaran ikon garis putus-putus (staggered +6 frame) → pil hitam bawah "FAKTA <TOPIK>".
  - Fakta: pil langkah warna ("FAKTA 1/2/3") → headline 64px (SATU angka/kejutan, mis. "1 DETIK = 1 KM") → diagram → 2 pil solid (kontinyu, tanpa jeda — lihat "Pelajaran").
  - Penutup: pertanyaan 72px ("MANA YANG / PALING GILA?") → maskot → lingkaran ikon → pil hitam.
- Progress bar oranye 6px di bawah, tumbuh 0→100% sepanjang video.
- **Tanpa** karakter besar, tanpa karaoke/caption kata-per-kata, tanpa angka raksasa count-up, tanpa spring.

## Sistem motion (yang bikin "smooth")

- Semua entrance: `Easing.bezier(0.22, 1, 0.36, 1)` (ease-out), `translateY` + opacity, durasi 12–16 frame. **TIDAK ADA `spring()`** — spring bikin jolt/overshoot.
- Entrance staggered: elemen muncul SATU PER SATU (bukan barengan).
- Setelah elemen settle, adegan TIDAK BOLEH diam total: zoom global pelan 1 → 1,02 sepanjang video; tiap diagram punya gerak pelan terus (zoom 1 → 1,03/1,04, sway ±1–1,2° periode 4 detik, atau objek bergerak di jalur).
- Gerak diikat ke SUARA/kata, bukan ke detik: pill muncul saat kalimat terkait diucapkan.
- Pil solid: crossfade 10 frame (masuk 10 frame sebelum `start`, keluar 10 frame sebelum `end`).
- **Dilarang:** `@remotion/transitions` TransitionSeries (menelan frame, desync VO).

## Sistem suara

- Narator: **Seno (M5, Supertonic 3, sid 9)**, speed 1.0, via `render_vo_<topik>.py` (pola `render_vo_v2.py`).
- SFX: pop saat headline tiap fakta (volume **0,22 / 0,25 / 0,28** + `playbackRate` **0,97 / 1,0 / 1,03** — divariasi, jangan 3× identik), ding **0,3** saat kartu penutup. Posisi global = start adegan + 8 frame.
- **TIDAK ADA music bed sintetis** (sine pad dilarang — "never synthesise the soundtrack in code"). Voice + SFX pelan saja sudah cukup (bukti: Palito/Explica).
- Mix akhir: `ffmpeg -af loudnorm=I=-14:TP=-1.0:LRA=11 -c:v copy` → ukur ulang, target **-14 LUFS, TP ≤ -1 dBTP**.

## Alur kerja (urut, jangan dilompati)

### 1. Riset + fact ledger — FAKTA DULU, NASKAH BELAKANGAN
- Pilih 3 fakta: paling mengejutkan, ada angka spesifik, bisa divisualkan.
- Verifikasi tiap fakta dengan **minimal 2 sumber** (cari lewat browser.search). Simpan di `<topik>/facts.json`: id, klaim, angka, sumber (URL), narasi, headline, pil, catatan kejujuran.
- Aturan kejujuran: angka estimasi/kutipan populer WAJIB pakai kata "kira-kira" di narasi; folklore tanpa dokumentasi kuat JANGAN masuk narasi (tulis di catatan ledger saja); tidak ada angka/klaim tambahan di luar ledger.
- Cari juga 1–2 referensi video fakta (Threads/TikTok/YouTube) — catat URL + apa yang layak ditiru.

### 2. Naskah VO (5 segmen, teks polos di `<topik>/vo/`)
- `hook.txt` (~5 dtk): "Tiga fakta gila tentang X. Yang nomor tiga paling nggak masuk akal."
- `f1/f2/f3.txt` (~10–17 dtk): "Fakta satu/dua/tiga. ..." — kalimat pendek sehari-hari, narator laki-laki santai. Setiap angka harus ada di ledger.
- `tanya.txt` (~4 dtk): "Fakta mana yang paling bikin kamu kaget? Tulis di komentar."

### 3. Kumpulkan SEMUA aset dulu (sebelum bangun video)
- Generate di Google Flow (Nano Banana 2.1, 1:1) via browser task, gaya: **flat vector, minimalis, latar PUTIH POLOS, tanpa teks, tanpa bayangan, tanpa border, tanpa objek lain**.
- Set standar: **3 ikon** (satu warna solid sistem: biru/oranye/teal, mis. tarian/sendok/stoples) + **diagram per fakta** (lebah, matahari, bunga, sendok madu, stoples, piramida) + **1 maskot** (dipakai di F1 dan penutup).
- Prompt ikon: "Flat vector icon, [objek], solid [warna] color #[hex], minimalist geometric style, perfectly centered on a pure white background, no text, no shadow, no border, no other objects".
- Prompt diagram: sama, tanpa "solid [warna]" — warna natural objek.
- Unduh via menu "1K Ukuran asli"; **verifikasi file ada di VM + baca visual tiap gambar sendiri** (jangan percaya klaim browser task). Kalau Flow blokir "aktivitas tidak biasa" → coba profil/project browser baru yang segar.
- Proses putih→transparan (PIL, resep teruji): `alpha = clip((255 - min(r,g,b)) * 2, 0, 255)`, `alpha = 0` jika `min > 241` (bunuh noise JPEG); crop ke bbox alpha + padding 16px; simpan PNG ke `public/assets/`. Pengecualian: aset yang butuh matematika posisi label di kanvas penuh jangan di-crop.
- Periksa hasil proses: sayap/area terang bisa jadi semi-transparan (wajar); objek abu-abu muda bisa pudar (cek visual).

### 4. VO + timing
- Render VO Seno per segmen → `public/audio/<topik>-seno/*.wav`.
- Ukur durasi asli dengan `ffprobe` (jangan pakai estimasi!).
- Tulis `src/timing-<topik>.ts`: `frames = ceil(durasi * 24) + 12`; tanya + 72 frame hold senyap (3 dtk); `TOTAL = 1401 frame ≈ 58 dtk` untuk contoh Lebah. Hitung `SCENE_START` kumulatif.

### 5. Komposisi (copy pola `CompositionV5.tsx` / `CompositionLebah.tsx`)
- Buat `src/Composition<Topik>.tsx` + daftarkan di `src/Root.tsx` (id `Fakta<Topik>`).
- Isi per fakta: `StepPill` + `Headline` + `Diagram` + 2 `SolidPill` (kontinyu).
- Diagram harus punya gerak kontinu: objek berjalan di jalur (lemniscate figure-eight untuk tarian — rumus di `CompositionLebah.tsx`), deret objek bergoyang dengan fase beda, atau zoom/sway pelan.
- SFX di `SfxLayer` (posisi global = start adegan + 8).

### 6. Render + loudnorm + verifikasi
- `npx remotion render Fakta<Topik> out/fakta-<topik>.mp4 --overwrite` (±2,5 menit untuk ~1400 frame) → loudnorm → `out/fakta-<topik>-loud.mp4`.
- Ekstrak 5 frame cek (hook, tiap fakta di tengah, penutup) dan **baca visual semuanya**:
  - teks tidak terpotong / tidak bertumpuk; pil tidak menutupi diagram; label mendarat di tempatnya; transparansi bersih (grid tembus); progress bar tumbuh.
- Kalau ada cacat (mis. diagram tumpang tindih, jeda pil kosong) → perbaiki komposisi/aset, render ulang, cek ulang. Jangan serahkan video yang belum dicek.

### 7. Serahkan + catat
- Serahkan file `*-loud.mp4` ke user + ringkasan perubahan. Tanya verdict.
- Catat ke `~/memory/2026-11-23.md` (atau tanggal berjalan): topik, fakta, aset, durasi, LUFS, verdict user.

## Pelajaran yang sudah dibayar mahal (jangan diulangi)

1. **Pill harus kontinyu.** Jeda 4–5 detik tanpa pil di tengah adegan terasa kosong. Atur `end` pil 1 = `start` pil 2.
2. **Diagram jangan tumpang tindih sembarangan.** Stoples + piramida pernah tabrakan dengan pencelup madu — solusinya crop pencelup dari PNG aset, bukan geser-geser buta. Ukur bbox alpha dulu sebelum menata.
3. **SFX lebih keras dari VO = gagal.** Pop sumber -17 dB vs VO -24 dB. Volume pop maks 0,28, ding 0,3, dan selalu loudnorm -14 LUFS di akhir.
4. **Fakta tanpa sumber = jangan masuk.** Ledger dulu, naskah belakangan. Estimasi pakai "kira-kira".
5. **Aset dikumpulkan dulu, video dibangun belakangan.** Jangan bangun komposisi sebelum semua aset terverifikasi di VM.
6. **Flow bisa blokir** ("aktivitas tidak biasa") — profil/project browser baru yang segar memperbaikinya.
7. **VO Seno lebih lambat dari estimasi** (fakta 1 Lebah: estimasi 11,9 dtk, asli 17,17 dtk). Selalu ukur durasi asli sebelum menulis timing. Adegan panjang (>15 dtk) butuh gerak kontinu yang kuat (mis. lebah terbang di jalur).
8. **Jangan pakai spring, jangan pakai TransitionSeries, jangan sintesis music bed.** Ketiganya sudah terbukti jelek di v1–v6.
9. **Maskot konsisten di pojok kanan bawah di SEMUA adegan** (bukan cuma penutup) — jangkar visual + identitas kanal. Dari @dmvtkn (maskot beanie hijau selalu di pojok); cocok juga dengan gurita @archive.egan yang selalu di tengah. Untuk video fakta: maskot kecil (mis. lebah) di pojok kanan bawah tiap adegan, jangan menutupi teks/diagram.
10. **CTA penutup spesifik, bukan generik.** "Tulis di komentar" kalah dengan "Tulis 'X' di komentar kalau..." — memancing komentar SEKALIGUS riset audiens untuk video berikutnya (dari @dmvtkn: "tulis 'mau' kalau mau versi gratisnya" → 5 komentar "mau" langsung).
11. **Eksperimen (belum diadopsi): teks kata-per-kata + highlight kata kunci** yang sinkron dengan narasi — terbukti di video tutorial @dmvtkn (video tetap bisa diikuti tanpa suara). Untuk video fakta, sistem pil tetap default; uji A/B di satu video kalau user minta.
12. **SVG memotong gambar yang keluar dari viewBox-nya.** Busur gelombang listrik F2 Hiu (radius sampai 125px di SVG 360×360) hanya kelihatan ujung-ujungnya — tengahnya terpotong viewport. Solusi: perlebar SVG + viewBox (mis. width 560, viewBox "0 0 560 360", left -100) supaya elemen yang menjorok keluar kanvas tetap utuh. Selalu cek frame render, jangan percaya koordinat di kode.
13. **POLISH v2 (Hiu, user: "animasinya dimulusin lagi") — transisi dissolve antar-adegan.** Potongan keras terasa "jeglek": tiap adegan fade-in 10 frame pertama + fade-out 8 frame terakhir (opacity = fadeIn × fadeOut, di root AbsoluteFill tiap adegan, frame lokal di dalam Sequence). Dunia (grid + wordmark) + maskot tetap di luar Sequence jadi tidak ikut berkedip — hasilnya dissolve lewat kanvas putih. Adegan terakhir ikut fade-out = outro yang rapi.
14. **POLISH v2 — cincin memancar, bukan busur berdenyut.** Gelombang listrik statis yang kedip opacity terasa kaku; ganti dengan 3 cincin setengah lingkaran yang MEMBESAR (45→115px, 36 frame) sambil memudar (0,9→0), berjarak 12 frame, berulang terus — terbaca sebagai sinyal yang memancar dari moncong.
15. **POLISH v2 — headline kata-per-kata yang meluncur.** Stagger 5 frame + durasi 14 + naik 20px = pop satu-satu yang staccato. Yang mulus: stagger 3 frame + durasi 18 + naik 12px — kata-kata masuk tumpang-tindih. Prinsip umum: gerakan kontinu (drift/bob/sway sinus pelan) di semua diagram supaya tidak ada adegan yang diam total setelah settling; pil crossfade 14 frame (bukan 10).
16. **SINKRON KATA (Hiu F1, user: "jangan muncul bareng"):** elemen diagram muncul pas kata-nya diucapkan, bukan bareng di awal adegan. Cara ukur: `ffmpeg -af silencedetect` di file VO — jeda antar-kalimat terukur akurat (TTS berhenti ~0,3 dtk antar-kalimat); kata di DALAM kalimat diperkirakan proporsional dari jumlah kata (tidak ada jeda antar-kata yang terdeteksi). Contoh F1: hiu frame 42 ("Hiu" 1,75 dtk), pohon frame 72 ("pohon" 3,0 dtk), titik 450 JT frame 146 ("450" 6,1 dtk), 385 JT frame 194 ("pohon" kedua 8,07 dtk), DINO frame 274 ("Dinosaurus" 11,4 dtk). Elemen yang disebut ulang diberi "denyut" (scale 1→1,08→1) di penyebutan kedua. Verifikasi dengan frame di detik yang sesuai (mis. hiu saja sebelum pohon muncul).
17. **SINKRON KATA F2 & F3 (lanjutan 16, "terapin semua saran"):** F2 — kepala 38 ("Hiu"), cincin listrik DI-GATE enter(frame, 64) ("listrik" pertama 2,67 dtk; animasi kontinu jangan jalan sebelum katanya diucapkan), angka "5" 183 ("lima" 7,63 dtk), ikan + pasir 221 ("Ikan" 9,21 dtk). F3 — hiu 42, jam pasir + angka "400" 82 (3,42 dtk), titik LAHIR 1624 206 ("lahir" 8,58 dtk), titik 2024 246 ("1624" 10,23 dtk). Pil ikut kata yang dibicarakannya (bukan jadwal tetap): mis. pil F3 "DEWASA UMUR 150 TAHUN" di 265 ("dan baru dewasa..." 11,05 dtk).
18. **PUNCH-IN + SOROT (Hiu, "terapin semua saran"):** punch-in = bump zoom global +3% di frame angka headline muncul (global = start adegan + numberFrame: 280/657/864), balik pelan selama ~36 frame; sorot = elemen yang dibicarakan scale +6–8% sementara elemen lain meredup ke 0,82–0,85 (interpolate, ramp 8 frame). SFX pop dipindah mengikuti angka headline, bukan awal adegan.
19. **"TERAPIN SEMUA SARAN" DINILAI LEBIH JELEK dari versi sebelumnya (user 2026-11-24 ~08:43: "bagus yang sebelumnya").** Paket pelajaran 17+18 (sinkron F2/F3 + angka headline telat + punch-in + sorot meredup) di-REVERT total ke versi polish round 2 (dissolve + stagger 3 + cincin + sinkron F1 saja, headline dari awal adegan, zoom merayap 1→1,02, tanpa sorot). Pelajaran: JANGAN tumpuk 4 efek sekaligus dalam satu ronde — satu perubahan besar per ronde, dan angka headline yang telat bikin adegan kosong di awal. Kalau user minta referensi, cari dulu di FB/Threads/GitHub lalu implementasikan yang paling menjanjikan — jangan menebak sendiri.
20. **DRAW-ON (emblemo, Threads — riset 2026-11-24):** garis/diagram DIGAMBAR mengikuti narasi, bukan fade in — SVG `strokeDasharray` + `strokeDashoffset` dengan `pathLength={100}`: garis waktu F1 digambar frame 42→274 (selesai pas titik DINO), F3 20→80; cincin F2 menggambar dirinya sendiri selama 45% pertama tiap denyut (`draw = min(t/0.45, 1)`). Angka terasa "dibuktikan", bukan ditempel.
21. **COUNT-UP (Flimify, GitHub — riset 2026-11-24):** angka headline menghitung naik 0→target selama 40 frame sejak kata masuk (`Easing.out(Easing.cubic)`, `fontVariantNumeric: "tabular-nums"` supaya digit tidak goyang). Headline TETAP muncul dari awal adegan — count-up adalah flourish di pembuka adegan, BUKAN sinkron kata (pelajaran 19: angka telat bikin adegan kosong).
22. **STRIP 3 FAKTA (@adamprabata, Threads — riset 2026-11-24):** 3 ikon kecil persisten pojok kanan atas selama F1–F3; aktif berwarna penuh + scale 1,15, nonaktif grayscale + opacity 0,3. Muncul bareng F1, hilang di kartu penutup. Penonton selalu tahu sedang di fakta ke berapa.
23. **REFERENSI RISET 2026-11-24 (belum diimplementasikan, simpan buat ronde berikut):** lompatan skala ala Zack D. Films (2,9 rb likes — fakta abstrak divisualkan lewat perubahan skala dramatis, butuh 1–2 gambar Flow tambahan); maskot jadi host yang menunjuk/mendemonstrasikan (@mex.cahh — butuh 2–3 pose Flow); transisi bernama per-fakta (Lexington/@michaelandreuzza — Reveal/Orbit/dll ganti dissolve); smear frames (Kenson, FB — regangan/ghost di gerakan cepat); odometer digit-roll (Motify — angka bergulir seperti slot machine); morph antar-scene (remotion-templates/clippkit).
24. **PIL DI SLOT TETAP (user 2026-11-24 ~08:55, "munculnya awal disitu tetap disitu aja"):** SolidPill yang return null di luar jendelanya + wadah flex column = pil 2 muncul DI BAWAH pil 1, lalu MELOMPAT NAIK saat pil 1 hilang dari flow. Perbaikan ronde 1: wadah `position: relative` tinggi tetap satu pil (76px), tiap pil `position: absolute; left: 50%; top: 0; transform: translate(-50%, glide)` — kedua pil crossfade di SATU slot yang sama. **RONDE 2 (user 2026-11-24 ~09:17, "kenapa ini masih pindah tempat ke atas"):** glide masuknya SENDIRI masih menggerakkan pil naik 18px — dan headline naik 12px ("teks setelahnya juga sama"). Perbaikan ronde 2: hapus SEMUA translateY masuk dari SolidPill DAN HeadlineWords — teks muncul di tempat, opacity saja. Berlaku di SEMUA komposisi fakta (Hiu, Bulan v6, Lebah — ketiganya pakai pola yang sama, sudah diperbaiki + render ulang 2026-11-24; terverifikasi frame: pil 2 muncul tepat di posisi pil 1, tidak naik). Aturan umum: elemen yang bergantian tampil di tempat yang sama HARUS absolut di slot tetap — jangan pernah mengandalkan flow flex untuk pergantian; dan teks TIDAK BOLEH punya glide naik saat masuk.
26. **GLOW BERNAPAS + ORBIT (ai.agentz, diimplementasikan di Hiu 2026-11-24 ~09:22, disetujui user):** komponen `Glow` (div radial-gradient `color 60% → 35% → transparan`, opacity 0,65–1,0 + scale 1–1,07, sine periode 2 dtk — nilai lama 35%→15%, opacity 0,45–0,95 TERLALU PUCAT, lihat pelajaran 42) ditaruh di belakang hero tiap adegan: F1 oranye di belakang hiu (280px, cx 100 cy 86), F2 biru di belakang kepala hiu (340px, cx 180 cy 134), F3 teal di belakang jam pasir (240px, cx 86 cy 257). Komponen `Orbit` (cincin titik-titik stroke #CBD5E1 dasharray "0.1 12" + 4 sparkle bintang-4-sisi pastel #F9A8D4/#FDE68A/#93C5FD/#86EFAC, berkelip sine 1,5 dtk fase beda) dipakai di F1 mengelilingi hiu (180px, cx 100 cy 86). Terverifikasi frame: glow F2 terang-redup antar detik 21–22 ✅, orbit + sparkle kelihatan di F1 ✅, glow teal di jam pasir F3 ✅. Aturan: glow warna ikut aksen adegan; orbit hanya untuk hero yang kompak (jangan mengelilingi diagram lebar — cincinnya ketutup gambar).
27. **11 SKILL VIDEO MUHAMMAD IHSAN (FB reel 1128359326719331, 2026-11-24 — "11 SKILL WAJIB VIDEO MOTION GRAPHICS", Google Antigravity):** user minta pasang + implementasi ke video hiu. Hasil: (1) Official Skill — sudah ada sejak 23 Nov; (2) Camera Rig — SENGAJA TIDAK dipakai (referensi @ai.agentz kameranya diam); (3) Kinetic Type bounce — SENGAJA TIDAK dipakai (user menolak spring); (4) Scene/Particle — sudah punya (grid + sparkle + rings); (5) remotion-bits 0.2.1 — TERPASANG (komponennya belum dipakai); (6) @remotion/captions — TERPASANG, butuh Whisper untuk timestamp kata — BELUM dipakai (mengubah format; tawarkan dulu ke user); (7) @remotion/media-utils — TERPASANG; (8) @remotion/paths — TERPASANG + DIIMPLEMENTASI: semua draw-on (garis F1/F3 + cincin F2) pakai `evolvePath(progress, d)` — frame terverifikasi identik dengan versi manual (hash sama di 3 dari 4 frame cek, sisanya beda antialiasing tak terlihat); (9) @remotion/google-fonts — TERPASANG (font kita lokal, jadi belum dipakai); (10) Data Counter — sudah ada (count-up interpolate); (11) Project Rules — file `.agents/rules.md` dibuat (9:16 terkunci, safe area 80px, wajib cek frame, 1 perubahan/ronde, tanpa spring, tanpa glide naik teks).
28. **PORTOFOLIO 4 VERSI (user 2026-11-24 ~10:10, \"jangan bikin 1 video, bikinkan beberapa versi... portofolio... bebas\"):** dari 1 naskah hiu yang sama dibuat 4 komposisi (semua 56,7 dtk, VO Seno sama, loudnorm -14): **V1 Director's Cut** (`FaktaHiuDirector`, `out/fakta-hiu-director-loud.mp4`): camera rig per-adegan (focal + zoom, inOut cubic, drift pelan ke hero, grid/maskot/strip diam) + headline spring SCALE tanpa translateY (damping 14, stiffness 260) + Dust 28 titik (noise2D) + angka pakai `AnimatedCounter` remotion-bits (easeOutCubic, 40f). **V2 Kinetic** (`FaktaHiuV2`, `out/fakta-hiu-v2-loud.mp4`): spring PENUH — kata naik 30px + scale (damping 12, stiffness 200, mass 0,5, stagger 3f), pil step nge-pop, adegan scale-through 1,06→1 masuk dan 1→1,05 keluar (hand-rolled, bukan TransitionSeries — VO tetap sinkron). **V3 Atmosphere** (`FaktaHiuV3`, `out/fakta-hiu-v3-loud.mp4`): BgMesh (3 orb radial blur 60–70px melayang) + Grain film 0,04 + Dust 60 titik + GlassPanel (putih 55%) + glow lebih besar + orbit di semua hero (ikan kecil F2, jam pasir F3). **V4 Captions** (`FaktaHiuV4`, `out/fakta-hiu-v4-loud.mp4`): caption kata-per-kata gaya TikTok — kata aktif warna aksen + scale 1,15, halaman maks 3 kata, timing dari `src/captions-hiu.ts` (108 kata, dibangun `hiu/build_captions.py`: silencedetect per klausa + bagi rata di dalam klausa — aproksimasi, bukan Whisper); jeda antar-kalimat highlight TAHAN di kata terakhir; caption lowercase; posisi per adegan (fakta y 1060, hook 940, tanya 800 — tanya di 940 NABRAK ikon, diperbaiki ke 800).
29. **BUG STACKING GLASS PANEL (V3, 2026-11-24):** panel kaca `position: absolute` (z-auto) terlukis DI ATAS teks static (normal flow) — headline fakta jadi pudar (terukur piksel: 0 piksel gelap di band headline vs 8.240 di V2, mean RGB 20/26/44). Elemen ber-transform (judul hook, pertanyaan tanya) TIDAK kena karena transform otomatis menaikkan layer lukis; pil/diagram (positioned) juga aman. Perbaikan: `position: relative` di container HeadlineWords. Aturan: dekor positioned HARUS di bawah teks — verifikasi dengan ukur piksel, bukan mata.
30. **BIAYA RENDER V3:** blur(60–70px) di orb mesh bikin render ~3x lebih lambat (498 dtk vs ~170 dtk V1/V2/V4) — pertimbangkan sebelum pakai blur besar di video berikut.
31. **GAYA STANDAR = V4 CAPTIONS (user 2026-11-24 ~10:52, "v4 bagus pakai style itu saja"):** video fakta berikutnya pakai gaya V4 — caption kata-per-kata gaya TikTok (kata aktif warna aksen + scale 1,15, halaman maks 3 kata, lowercase, highlight tahan di kata terakhir saat jeda; posisi fakta y 1060, hook 940, tanya 800). VO tetap Seno (M5, sid 9, Supertonic 3).
32. **PERBAIKAN "BELIBET" (user 2026-11-24 ~10:53, VO detik 38–42):** tebakan pertama SALAH — dikira "vertebrata" (klausa tercepat, 9 frame/kata), ternyata user koreksi ~11:05: yang belibet itu **"yang tertua"** — Seno memblepotkan kata "tertua" (awalan ter- + tua). Perbaikan akhir: "Yang tertua" → **"Yang paling tua"** (kata umum, aman); naskah tetap kalimat pendek + VO Seno 0.95; timing + caption diukur ulang dari VO baru; caption TAHAN di halaman terakhir sampai halaman berikut mulai (jeda antar-kalimat 1,1–1,5 dtk di VO 0.95). Pelajaran: jangan menebak kata yang belibet dari angka saja — tanya user kata persisnya; kata superlatif "ter-" + kata dasar patut dicurigai di TTS. Aturan: VO video fakta = Seno 0.95 + kalimat pendek mulai sekarang.
33. **ATURAN ANGKA DIEJA KATA (user 2026-11-24 ~11:26–11:33, "pokoknya kalau ada angka kamu bacakan aja"):** Seno (Supertonic) memblepotkan angka DIGIT ("400 tahun", "450", "1624" kedengeran bingung/belibet). Aturan tetap: **semua angka di naskah VO ditulis sebagai kata Indonesia** — "empat ratus tahun", "empat ratus lima puluh juta tahun", "seribu enam ratus dua puluh empat", "seratus lima puluh tahun". Headline/pil/titik garis waktu di GAMBAR tetap digit ("450 JUTA TAHUN", "400 TAHUN", "LAHIR 1624") — yang dieja hanya yang DIBACA VO; caption kata-per-kata ikut kata yang diucapkan. Diterapkan ke video hiu 2026-11-24: F1 13,66→16,20 dtk, F3 18,24→19,42 dtk, total 60,6→64,3 dtk; timing + caption + sync diagram + pil diukur ulang dari VO baru (V4 dirender ulang, terverifikasi frame 7,7/12,7/46,5/59,5). Berlaku untuk SEMUA video fakta ke depan — tulis naskah langsung dengan angka dieja, jangan digit. File VO lama (digit) dibackup: `f1-old-digits.wav`, `f3-v3-digits.wav`.
34. **ISTILAH INGGRIS DI VO (latihan berita BMKG 2026-11-24):** Seno bisa belibet baca istilah Inggris (contoh "Madden Julian Oscillation"). Tiga cara: (1) biarkan asli; (2) ganti istilah Indonesia kalau ada ("Osilasi Madden Julian"); (3) eja fonetik Indonesia ("Meden Julien Osileysyen"). Cara uji: render 3 varian kalimat yang sama, user yang pilih. **Verdict user 2026-11-24: untuk "Madden Julian Oscillation", ASLI saja tidak apa-apa ("masih bagus")** — jadi jangan berasumsi Inggris selalu jelek; nilai per istilah dengan didengarkan. Latihan VO berita: `latihan-vo/berita-bmkg-2026-11-24.wav` (56 dtk, Seno 0,95) + teks di file .txt yang sama.
25. **REFERENSI @ai.agentz — "Bikin Video Remotion" (TikTok, 128 dtk, 2.229 likes, 576x1024 30fps, file `remotion-research/tiktok-lampu/ai-agentz-gemini-chatgpt-claude.mp4`):** video yang SAMA dengan referensi "smooth" 2026-11-23 — kali ini dibedah DETAIL per gerakan atas perintah user ("tiru gaya video ini... detail-detail kecil kau catat"). Struktur: hook (0–10 dtk) → SEKARANG → MENARIKNYA → LANGKAH 1–4 → TERAKHIR → NGGAK HARUS → SEKARANG (penutup) → MAU TUTORIALNYA? (CTA). Sistem visual: kanvas putih ber-grid; wordmark "rayden" kecil kiri atas di SEMUA frame; pil langkah kecil di atas judul (warna beda tiap langkah: biru/teal/salmon/kuning/hijau/merah/oranye); judul hitam tebal maks 2 baris, kata kunci berwarna; kartu putih neo-brutalist (outline navy ~3px + bayangan keras offset bawah); terminal navy + teks hijau monospace.
35. **SFX HARUS DIHITUNG ULANG DARI TIMING SAAT INI (ditemukan saat bangun Gurita 2026-11-24):** pop Hiu V4 di frame 482/790 sudah BASI — itu posisi dari timing lama (f1 340 frame); setelah VO dieja-kata f1 jadi 401 frame, posisi benarnya 543/851. Pop yang basi bunyi ~2,2 detik lebih awal (masih di ekor adegan sebelumnya). Aturan: tiap kali timing berubah (VO di-render ulang, durasi segmen berubah), hitung ulang SEMUA posisi SFX dari SCENE_START yang baru (pop = start adegan + 8, ding = start tanya + 8). Gurita sudah pakai posisi benar: pop 160/716/1210, ding 1700.
    - **LAMPU BERCAHAYA (yang user tunjuk):** ikon bohlam kuning flat (#EFB704, outline navy) + **halo radial kuning yang BERNAPAS — intensitasnya berdenyut periode ~2 detik (DIUKUR dari piksel halo: 2414 → 1731 → 915 → 2619 → 1244 dalam 2 detik)**. Implementasi: div radial-gradient kuning (pusat) → transparan di belakang ikon, opacity/scale sine 2 detik. Lampu TIDAK berpindah posisi — hanya cahayanya yang hidup.
    - **Orbit + sparkle:** logo di tengah cincin titik-titik (dotted orbit) + bintang 4-sisi pastel (pink/kuning/biru/hijau) di sekelilingnya yang berkelip; saat transisi, logo menghilang duluan, orbit + sparkle tertinggal sesaat sebagai "hantu".
    - **Transisi antar-langkah:** dissolve ~0,5 dtk (adegan lama memudar → jeda hampir kosong → adegan baru memudar masuk), lalu elemen adegan baru masuk stagger (pil+judul dulu, lalu ikon/kartu satu-satu dari samping/bawah).
    - **Kartu masuk:** slide dari samping + fade, stagger; kartu pertama penuh, kartu berikut masih samar di tepi.
    - **Progress & checklist:** player mockup navy + tombol play hijau + progress bar yang terisi; "Rendering... 24%→75%→100%"; checklist logo + nama + lingkaran centang.
    - **Penutup:** pil putih "Cek panduannya di bio gaes!" + panah besar ke atas + pil oranye "LINK DI BIO".
    - **Audio:** VO dominan, mean -21,5 dB / max -3,6 dB, 20 jeda ≥0,5 dtk — tidak ada music bed yang keras.
    - **Warna terukur:** tinta #111426, kuning lampu #EFB704, salmon LANGKAH 1 #DA7656; teal/biru/hijau ≈ sistem kami.
    - Yang bisa diadopsi ke video fakta: (1) halo bernapas di ikon kunci (mis. petir F2 / jam pasir F3); (2) orbit titik + sparkle di sekitar diagram hero; (3) kartu neo-brutalist dengan outline navy + bayangan keras; (4) transisi dissolve dengan jeda kosong + stagger masuk; (5) pil langkah berwarna beda tiap fakta.

## Referensi yang dipakai (sudah dibedah)

- @archive.egan (Threads, video gurita): 1 maskot konsisten, morph X-ray, teks minim, suara yang bawa semuanya.
- @ai.agentz (TikTok, tutorial Remotion): 1 kanvas putih ber-grid, entrance staggered ease-out, diam setelah settle — ini sistem visual yang dipakai skill ini.
- Palito/Explica (@explicapalito): voice + caption saja, tanpa musik/SFX; kamera tidak pernah berhenti.
- remotion-shorts-skill (GitHub social-media-skills): SFX kecil tetap (hit/whoosh/pop/tick), musik hanya dari file berlisensi.
- coldframe sound-design (GitHub razee4315): bed -24..-20 LUFS, mix akhir -14 LUFS TP ≤ -1, variasi SFX, sunyi 3–8 frame sebelum reveal.
- thread-film (GitHub hanzlahabib): sound = movement (whoosh saat terbang, tick saat mendarat).
- shorts-kit (GitHub howznguyen): fact ledger, 20 flow storytelling, aturan warna/gerak.
- **@dmvtkn / Dede Muttakin (Facebook reel, 22 Nov 2026, ~80 dtk, 2,8 rb suka)** — tutorial "bikin animasi pakai laptop kentang (Claude Code + Remotion)". Yang ditiru: (1) hook masalah relatable + visual literal (laptop + stiker kentang, penonton paham dalam 3 detik); (2) teks kata-per-kata + efek mengetik sinkron narasi, kata kunci di-highlight hijau/kuning; (3) diagram berpanah + kartu bernomor + mockup UI asli (bukan sekadar teks); (4) maskot kartun (beanie hijau) konsisten di pojok kanan bawah SEMUA adegan; (5) disclaimer jujur di awal ("Claude Pro berbayar") + CTA komentar spesifik ("tulis 'mau'"). Latar grid krem/navy bergantian; narasi laki-laki santai tempo cepat, tanpa musik/SFX dominan; pacing sangat padat, tanpa jeda kosong.

36. **ATURAN VO SATU BLOK — DIBEDAKAN PER MESIN & KEBUTUHAN CAPTION (user 2026-11-24 ~19:59, "tambahin satu aturan... biar hemat"):** ide awal "satu blok utuh baru dipotong" dites dan GAGAL untuk timing caption — jeda koma Seno bisa lebih panjang dari jeda antar-kalimat (tes: kalimat 6 kata dapat 6,12 dtk, kalimat 21 kata dapat 3,79 dtk — merge lewat jeda terpendek salah gabung; jumlah potongan cocok belum tentu isinya benar). Aturan final (lihat `tts/rules.md` bag. 2): **(A) Gemini TTS — WAJIB satu blok** (15 request/hari; video 10 menit = 50–60 kalimat = kuota 4 hari kalau per kalimat; maks ~11 menit/blok, amannya 4.000–6.000 karakter/blok ~5–7 menit); **(B) video tanpa caption kata-per-kata — satu blok, Supertonic maupun Gemini**, potong kasar per beat saja (`tts/split_vo.py`); **(C) video fakta V4 + Supertonic — TETAP per kalimat** (lokal gratis, timing PASTI buat caption; `render_vo.py` tanpa `--block`); **(D) satu kata salah baca — render ulang kalimat itu saja lalu tempel.** Skrip baru: `render_vo.py --block` (satu blok per segmen + jeda pembuka 0,5 dtk) dan `tts/split_vo.py` (deteksi sunyi ≥0,2 dtk, gabung lewat jeda terpendek, verifikasi jumlah potongan = jumlah kalimat, exit 2 kalau tidak cocok) — keduanya dites end-to-end 2026-11-24 sebelum push.

## Template 2 — Fakta Foto Asli (2026-11-24)

Template 2 (`templates/template-2-fakta-foto-asli/`) = gaya V4 Captions yang SAMA
seperti Template 1 (layout, warna, pil, headline, caption kata-per-kata,
SFX, loudnorm −14 LUFS), dengan SATU perbedaan: **semua aset gambar adalah
FOTO ASLI (foto sungguhan), BUKAN kartun/ilustrasi/flat/AI**. Foto cabai =
foto cabai asli. TIDAK ADA maskot kartun.

- **Slot aset (7):** 3 foto utama per fakta, 3 foto detail, 1 foto penutup.
  Hook memakai foto utama F1 (300px); tiap fakta memakai PhotoHero =
  foto utama 360px (zoom merayap + glow bernapas) + foto detail 150px
  menumpuk di pojok kanan bawah (border putih 4px) + label chip di atas
  foto utama; adegan penutup memakai foto penutup 200px. FactStrip memakai
  3 foto utama (lingkaran, aktif berwarna penuh + scale 1,15, yang lain
  grayscale + opacity 0,3) — bukan ikon kartun.
- **Sumber foto — HANYA lisensi bebas (CC0/CC-BY):** Openverse
  (api.openverse.org, tanpa key, filter `license=cc0,by`), Wikimedia
  Commons, atau Unsplash/Pexels (unduh manual dari situs kalau tanpa key).
  JANGAN foto ber-watermark/teks, JANGAN gambar AI/kartun. Verifikasi tiap
  foto secara visual (foto asli, sesuai topik, bukan kartun) sebelum dipakai.
  Catat sumber + lisensi tiap foto di `examples/<topik>/PHOTO_SOURCES.md`
  (judul, kreator, lisensi, landing URL).
- **Proses foto:** crop tengah ke 1:1 + resize 1024×1024 (PIL) ke
  `public/assets/` — lihat `templates/template-2-fakta-foto-asli/ASSET_GUIDE.md`.
  Foto adalah file biner → TIDAK ikut push GitHub (hanya catatan sumbernya).
- **VO demo Template 2 (Madu, 2026-11-24):** Gemini TTS Charon, SATU BLOK
  satu request (1010 karakter → 55,81 dtk, 24 kHz, dikonversi 44,1 kHz),
  dipotong `tts/split_vo.py` → 20 potongan (23 region awal digabung lewat
  jeda terpendek). Cek kewarasan split: durasi/kata KONSISTEN 0,23–0,37
  dtk/kata di semua potongan (bandingkan: tes Seno yang gagal 1,02 vs 0,18
  dtk/kata). `build_captions.py` jalan tanpa peringatan (klausa cocok:
  hook 2, f1 8, f2 4, f3 4, tanya 2) dan span klausa konsisten dengan durasi
  split (±0,05 dtk) — jadi timing caption demo ini DIPERCAYA, tapi tetap
  verifikasi lewat frame (caption sinkron sebatas yang bisa dicek).
- **Pelajaran dari demo Madu:** foto close-up statis (pisau, sarang) rawan
  ditolak policy di Flow — di Openverse tidak ada masalah itu, tapi tetap
  cek tiap foto visual. Foto dengan watermark kecil (© di pojok) DITOLAK
  walau lisensinya CC-BY — jangan pakai, jangan crop watermark-nya keluar.

37. **VO GEMINI PUCK UNTUK VIDEO FAKTA (user 2026-11-25, "cocok"):** suara laki-laki muda, energik, gaya mengajar — dipakai untuk video fakta Template 1 (uji coba Telur). Render SATU BLOK per video (1 request); helper `gemini_tts.py` tidak punya parameter gaya — gaya mengandalkan karakter bawaan Puck. **Loop cek ejaan WAJIB:** transkripsi balik audio dengan faster-whisper model **small** (bahasa id); kata kunci harus cocok di transkrip, kalau tidak cocok perbaiki ejaan naskah lalu render ulang bloknya. Model **base TIDAK boleh** dipakai (salah di 6 kata). Whisper menormalisasi angka jadi digit — itu bukan bukti Puck mengucap digit. **Timing caption dari blok Gemini: JANGAN pakai `split_vo.py`** (salah gabung di blok Puck walau jumlah potongan cocok) — pakai **word-timestamps Whisper small** (align kata 100%, termasuk merge desimal "0," + "3" → "nol koma tiga"). Aturan lengkap di `tts/rules.md` bag. 6.

38. **DUA PELAJARAN RENDER (video Telur, 2026-11-25):** (a) **HeadlineWords memotong angka bertitik** — "17.000" tampil jadi "17" di headline fakta (judul hook yang pakai div biasa tampil utuh). Aturan: angka ribuan di headline/pil tulis sebagai kata — "17 RIBU LUBANG" — konsisten hook + fakta. (b) **Aset krem/putih hampir hilang di atas kanvas putih** — resep white→transparan standar (alpha = (255-min)*2, bunuh min>241) membuat telur krem (min ~208–237) hampir transparan. Perbaikan untuk diagram krem saja: alpha = clip((241-min)*4 + 80, 0, 255), ambang tetap 241 — JANGAN naikkan ambang ke 250 (noise JPEG ikut keangkat, bbox meledak dari 887×540 jadi 957×821). Terverifikasi: telur unta krem jadi jelas, ukuran crop tetap.

39. **SPARKLE ORBIT HARUS SEKELUARGA DENGAN WARNA AKSEN ADEGAN (user 2026-11-25, "warna animasinya bertabrakan"):** Orbit dari referensi @ai.agentz pakai 4 sparkle pastel pelangi (pink/kuning/biru/hijau) — di referensi itu tidak bertabrakan karena palet videonya netral dan sparkle-lah satu-satunya aksen warna. Di video fakta, tiap adegan sudah punya SATU aksen kuat (oranye/teal/biru) + glow sewarna aksen, jadi 4 pastel pelangi jadi warna kelima yang bertabrakan. Perbaikan Telur: `Orbit` menerima prop `colors` = 4 gradasi warna aksen adegan itu (F1 oranye #FDBA74/#FB923C/#F97316/#EA580C; F2 teal #5EEAD4/#2DD4BF/#14B8A6/#0D9488; F3 biru #93C5FD/#60A5FA/#3B82F6/#2563EB) — kelipnya tetap hidup (fase beda), tapi sekarang sekeluarga dengan adegan. Aturan: dekor animasi apa pun ikut keluarga warna aksen adegannya; jangan impor palet dari referensi tanpa dicek terhadap palet adegan.

40. **PIL SOLID + POTONG VO — DUA PELAJARAN TELUR (user 2026-11-25, "masih bertabrakan" + "kata terpotong"):** (a) **Pil solid harus sekeluarga dengan aksen adegan** — pil biru + rose di adegan oranye (F1) dan pil oranye di adegan teal/biru (F2/F3) adalah tabrakan yang sebenarnya, bukan sparkle-nya (sparkle sudah diperbaiki pelajaran 39 tapi user masih melihat tabrakan). Aturan: pil 1 = warna aksen, pil 2 = aksen gelap (F1 oranye #F97316/#EA580C; F2 teal #0D9488/#0F766E; F3 biru #2563EB/#1D4ED8). Cek warna frame demi frame (13 frame) sebelum menyimpulkan penyebab tabrakan — jangan menebak dari satu frame. (b) **Potong audio adegan di TENGAH jeda sunyi, bukan di ujung kata Whisper + 0,05** — Whisper bisa 0,36 dtk lebih awal dari ujung kata sebenarnya: "milimeter" (akhir F1) Whisper 24,48 tapi suara aslinya baru habis 24,84 (silencedetect -40dB); potong lama 24,53 memotong ~0,3 dtk kata itu (RMS ujung f1.wav 0,070 = masih bersuara keras). Titik potong diukur dari silencedetect + envelope RMS 20ms; setelah perbaikan RMS ujung semua segmen ≤0,008 (sunyi). Kalau timing berubah, hitung ulang posisi SFX dari SCENE_START baru (pelajaran 35).

41. **PIL TIDAK BOLEH TUMPANG-TINDIH SAAT GANTI (user 2026-11-25, screenshot 02:10):** Aturan lama "pil 2 mulai 10 frame sebelum pil 1 selesai" bikin 10 frame di mana KEDUA pil tampil di slot yang sama, sama-sama setengah transparan (SolidPill fade 14 frame masuk + 14 frame keluar) — teksnya dobel bertumpuk dan warnanya pudar tercampur (di screenshot user, pil F1 kelihatan pucat padahal warnanya sudah benar). Perbaikan Telur: pil 2 mulai TEPAT saat pil 1 selesai (s = e pil 1) — handoff sambung tanpa jeda dan tanpa dobel; di frame handoff slot kosong tepat 1 frame (tidak kelihatan). Aturan: elemen yang menempati slot yang sama tidak boleh overlap dalam waktu — gantinya berurutan, bukan bersamaan.

42. **GLOW TENGAH HARUS JELAS BEDA DARI ASET, BUKAN NGE-BLEND (user 2026-11-25: "warnanya terlalu balance sama asetnya"):** Glow lama (gradien 35%→15%, opacity 0,45–0,95) di render cuma jadi cucian warna pucat — efektif di tengah cuma 16–33% aksen. Diukur piksel frame Telur: glow teal F2 (245,249,249) hampir sama dengan kanvas putih (255,255,255); glow oranye F1 (250,197,159) hampir sama dengan diagram krem (248,219,197) — halo, diagram, dan kanvas jadi satu massa pucat, diagram tidak terpisah. Perbaikan: gradien 60%→35% (`${color}99` → `${color}59`), opacity 0,65–1,0 — efektif tengah 39–60%, halo jadi cakram warna jelas yang membingkai diagram (cek ulang piksel: kotak diagram F1 (248,219,197)→(247,189,149), F2 (231,235,227)→(201,222,212)). Aturan: cek kontras glow vs aset vs kanvas dengan ukur piksel (bukan mata saja) — kalau selisih RGB-nya kecil, glow terlalu lemah.

43. **TANPA WARNA ISI DI BELAKANG DIAGRAM — AKSEN CUMA GARIS/BENTUK DI SEKELILING (user 2026-11-25, pilih sampel C):** Cakram glow di belakang diagram GAGAL dua kali di Telur — glow lemah nge-blend sama diagram krem (pelajaran 42), glow kuat bikin telur krem jelek di atas oranye (user: "warna telur sama bg orangenya jadi jelek"). Solusi yang dipilih user: buang Glow+Orbit, ganti 4 bentuk aksen kecil yang mengambang pelan di sekeliling diagram (lingkaran, plus, segitiga, cincin — warna aksen adegan, bob sine ±7px periode 2 dtk, fase beda) + drop-shadow lembut di gambar diagram (0 12px 20px rgba(15,23,42,0.18)). Diagram tetap di atas putih bersih, warnanya asli. Aturan: kalau diagramnya terang/pucat, JANGAN taruh warna isi di belakangnya — aksen cukup sebagai garis/bentuk di sekeliling. (Komponen: `FloatShapes` di CompositionTelur; Glow+Orbit dihapus dari video ini.)

44. **ANIMASI HARUS BERFUNGSI (aturan user 2026-11-25):** Setiap elemen animasi tengah WAJIB punya tugas — nunjukin bagian yang dibahas, nambah info, ngasih tahu progres, atau nggambarin gerakan dari faktanya. Hiasan kosong (bentuk mengambang, sparkle, glow) DITOLAK user walaupun warnanya sudah dibetulkan. Pola yang dipilih: **CALLOUT** — garis tipis dari bagian diagram ke label kecil, muncul pas VO nyebut kata itu (frame lokal dari word-timestamps Whisper), label dari fakta terverifikasi di ledger (jangan karang angka). Dirender SETELAH gambar supaya label tidak ketutup diagram. Contoh Telur: F1 "PORI-PORI" pas "lubang" + "CANGKANG 0,3 MM" pas "nol"; F2 "24 TELUR AYAM" pas "empat" + "CANGKANG KUAT" pas "kuat"; F3 "KLIK-KLIK" pas "klik" + "SINYAL KOMUNIKASI" pas "komunikasi". (Komponen: `Callout` + `Callouts` di CompositionTelur; FloatShapes dihapus.)
