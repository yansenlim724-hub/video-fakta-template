// Timing kata-per-kata untuk caption V4 (TikTok-style).
// Dibangun dari VO + silencedetect (lihat gurita/build_captions.py).
// Kata di DALAM klausa dibagi rata — aproksimasi, bukan Whisper.
// start/end = frame LOKAL segmen (24 fps).
export type CaptionWord = { t: string; start: number; end: number };
export const CAPTIONS_GURITA: Record<string, CaptionWord[]> = {
  "hook": [
    {
      "t": "Tiga",
      "start": 9,
      "end": 17
    },
    {
      "t": "fakta",
      "start": 17,
      "end": 25
    },
    {
      "t": "gila",
      "start": 25,
      "end": 32
    },
    {
      "t": "tentang",
      "start": 32,
      "end": 40
    },
    {
      "t": "gurita",
      "start": 40,
      "end": 48
    },
    {
      "t": "Yang",
      "start": 75,
      "end": 82
    },
    {
      "t": "nomor",
      "start": 82,
      "end": 90
    },
    {
      "t": "tiga",
      "start": 90,
      "end": 97
    },
    {
      "t": "paling",
      "start": 97,
      "end": 104
    },
    {
      "t": "nggak",
      "start": 104,
      "end": 112
    },
    {
      "t": "masuk",
      "start": 112,
      "end": 119
    },
    {
      "t": "akal",
      "start": 119,
      "end": 127
    }
  ],
  "f1": [
    {
      "t": "Fakta",
      "start": 7,
      "end": 16
    },
    {
      "t": "satu",
      "start": 16,
      "end": 25
    },
    {
      "t": "Gurita",
      "start": 52,
      "end": 60
    },
    {
      "t": "punya",
      "start": 60,
      "end": 69
    },
    {
      "t": "tiga",
      "start": 69,
      "end": 77
    },
    {
      "t": "jantung",
      "start": 77,
      "end": 86
    },
    {
      "t": "Dua",
      "start": 117,
      "end": 126
    },
    {
      "t": "jantung",
      "start": 126,
      "end": 135
    },
    {
      "t": "memompa",
      "start": 135,
      "end": 144
    },
    {
      "t": "darah",
      "start": 144,
      "end": 153
    },
    {
      "t": "ke",
      "start": 153,
      "end": 162
    },
    {
      "t": "insang",
      "start": 162,
      "end": 171
    },
    {
      "t": "satu",
      "start": 171,
      "end": 180
    },
    {
      "t": "jantung",
      "start": 180,
      "end": 189
    },
    {
      "t": "memompa",
      "start": 189,
      "end": 198
    },
    {
      "t": "darah",
      "start": 198,
      "end": 207
    },
    {
      "t": "ke",
      "start": 207,
      "end": 216
    },
    {
      "t": "seluruh",
      "start": 216,
      "end": 225
    },
    {
      "t": "tubuh",
      "start": 225,
      "end": 234
    },
    {
      "t": "Darahnya",
      "start": 267,
      "end": 279
    },
    {
      "t": "biru",
      "start": 279,
      "end": 290
    },
    {
      "t": "karena",
      "start": 290,
      "end": 302
    },
    {
      "t": "pengangkut",
      "start": 302,
      "end": 314
    },
    {
      "t": "oksigennya",
      "start": 314,
      "end": 325
    },
    {
      "t": "pakai",
      "start": 325,
      "end": 337
    },
    {
      "t": "tembaga",
      "start": 337,
      "end": 348
    },
    {
      "t": "bukan",
      "start": 348,
      "end": 360
    },
    {
      "t": "besi",
      "start": 360,
      "end": 371
    },
    {
      "t": "seperti",
      "start": 371,
      "end": 383
    },
    {
      "t": "kita",
      "start": 383,
      "end": 394
    },
    {
      "t": "Uniknya",
      "start": 426,
      "end": 437
    },
    {
      "t": "jantung",
      "start": 437,
      "end": 448
    },
    {
      "t": "utamanya",
      "start": 448,
      "end": 459
    },
    {
      "t": "berhenti",
      "start": 459,
      "end": 471
    },
    {
      "t": "berdetak",
      "start": 471,
      "end": 482
    },
    {
      "t": "saat",
      "start": 482,
      "end": 493
    },
    {
      "t": "gurita",
      "start": 493,
      "end": 504
    },
    {
      "t": "berenang",
      "start": 504,
      "end": 516
    },
    {
      "t": "cepat",
      "start": 516,
      "end": 527
    }
  ],
  "f2": [
    {
      "t": "Fakta",
      "start": 7,
      "end": 16
    },
    {
      "t": "dua",
      "start": 16,
      "end": 26
    },
    {
      "t": "Gurita",
      "start": 50,
      "end": 60
    },
    {
      "t": "punya",
      "start": 60,
      "end": 70
    },
    {
      "t": "sembilan",
      "start": 70,
      "end": 80
    },
    {
      "t": "otak",
      "start": 80,
      "end": 90
    },
    {
      "t": "Satu",
      "start": 117,
      "end": 126
    },
    {
      "t": "otak",
      "start": 126,
      "end": 135
    },
    {
      "t": "pusat",
      "start": 135,
      "end": 143
    },
    {
      "t": "delapan",
      "start": 143,
      "end": 152
    },
    {
      "t": "otak",
      "start": 152,
      "end": 161
    },
    {
      "t": "mini",
      "start": 161,
      "end": 169
    },
    {
      "t": "di",
      "start": 169,
      "end": 178
    },
    {
      "t": "pangkal",
      "start": 178,
      "end": 187
    },
    {
      "t": "tiap",
      "start": 187,
      "end": 195
    },
    {
      "t": "lengan",
      "start": 195,
      "end": 204
    },
    {
      "t": "Totalnya",
      "start": 235,
      "end": 244
    },
    {
      "t": "sekitar",
      "start": 244,
      "end": 253
    },
    {
      "t": "lima",
      "start": 253,
      "end": 262
    },
    {
      "t": "ratus",
      "start": 262,
      "end": 271
    },
    {
      "t": "juta",
      "start": 271,
      "end": 280
    },
    {
      "t": "neuron",
      "start": 280,
      "end": 289
    },
    {
      "t": "dan",
      "start": 289,
      "end": 298
    },
    {
      "t": "dua",
      "start": 298,
      "end": 307
    },
    {
      "t": "per",
      "start": 307,
      "end": 316
    },
    {
      "t": "tiga-nya",
      "start": 316,
      "end": 324
    },
    {
      "t": "ada",
      "start": 324,
      "end": 333
    },
    {
      "t": "di",
      "start": 333,
      "end": 342
    },
    {
      "t": "lengan",
      "start": 342,
      "end": 351
    },
    {
      "t": "bukan",
      "start": 351,
      "end": 360
    },
    {
      "t": "di",
      "start": 360,
      "end": 369
    },
    {
      "t": "otak",
      "start": 369,
      "end": 378
    },
    {
      "t": "Makanya",
      "start": 408,
      "end": 418
    },
    {
      "t": "tiap",
      "start": 418,
      "end": 428
    },
    {
      "t": "lengan",
      "start": 428,
      "end": 438
    },
    {
      "t": "bisa",
      "start": 438,
      "end": 448
    },
    {
      "t": "bergerak",
      "start": 448,
      "end": 458
    },
    {
      "t": "sendiri",
      "start": 458,
      "end": 468
    }
  ],
  "f3": [
    {
      "t": "Fakta",
      "start": 7,
      "end": 17
    },
    {
      "t": "tiga",
      "start": 17,
      "end": 26
    },
    {
      "t": "Gurita",
      "start": 56,
      "end": 66
    },
    {
      "t": "bisa",
      "start": 66,
      "end": 76
    },
    {
      "t": "ganti",
      "start": 76,
      "end": 85
    },
    {
      "t": "warna",
      "start": 85,
      "end": 95
    },
    {
      "t": "kulit",
      "start": 95,
      "end": 105
    },
    {
      "t": "kurang",
      "start": 105,
      "end": 114
    },
    {
      "t": "dari",
      "start": 114,
      "end": 124
    },
    {
      "t": "sepersepuluh",
      "start": 124,
      "end": 134
    },
    {
      "t": "detik",
      "start": 134,
      "end": 143
    },
    {
      "t": "Itu",
      "start": 176,
      "end": 185
    },
    {
      "t": "karena",
      "start": 185,
      "end": 195
    },
    {
      "t": "jutaan",
      "start": 195,
      "end": 204
    },
    {
      "t": "sel",
      "start": 204,
      "end": 213
    },
    {
      "t": "warna",
      "start": 213,
      "end": 222
    },
    {
      "t": "di",
      "start": 222,
      "end": 231
    },
    {
      "t": "kulitnya",
      "start": 231,
      "end": 241
    },
    {
      "t": "yang",
      "start": 241,
      "end": 250
    },
    {
      "t": "membuka",
      "start": 250,
      "end": 259
    },
    {
      "t": "dan",
      "start": 259,
      "end": 268
    },
    {
      "t": "menutup",
      "start": 268,
      "end": 277
    },
    {
      "t": "seperti",
      "start": 277,
      "end": 287
    },
    {
      "t": "balon",
      "start": 287,
      "end": 296
    },
    {
      "t": "kecil",
      "start": 296,
      "end": 305
    },
    {
      "t": "Bukan",
      "start": 337,
      "end": 347
    },
    {
      "t": "cuma",
      "start": 347,
      "end": 358
    },
    {
      "t": "warna",
      "start": 358,
      "end": 368
    },
    {
      "t": "tekstur",
      "start": 368,
      "end": 379
    },
    {
      "t": "kulitnya",
      "start": 379,
      "end": 389
    },
    {
      "t": "juga",
      "start": 389,
      "end": 400
    },
    {
      "t": "bisa",
      "start": 400,
      "end": 410
    },
    {
      "t": "berubah",
      "start": 410,
      "end": 421
    },
    {
      "t": "sampai",
      "start": 421,
      "end": 431
    },
    {
      "t": "menyerupai",
      "start": 431,
      "end": 442
    },
    {
      "t": "batu",
      "start": 442,
      "end": 452
    },
    {
      "t": "karang",
      "start": 452,
      "end": 463
    }
  ],
  "tanya": [
    {
      "t": "Fakta",
      "start": 10,
      "end": 18
    },
    {
      "t": "mana",
      "start": 18,
      "end": 26
    },
    {
      "t": "yang",
      "start": 26,
      "end": 34
    },
    {
      "t": "paling",
      "start": 34,
      "end": 42
    },
    {
      "t": "bikin",
      "start": 42,
      "end": 50
    },
    {
      "t": "kamu",
      "start": 50,
      "end": 57
    },
    {
      "t": "kaget",
      "start": 57,
      "end": 65
    },
    {
      "t": "Tulis",
      "start": 74,
      "end": 83
    },
    {
      "t": "gurita",
      "start": 83,
      "end": 91
    },
    {
      "t": "di",
      "start": 91,
      "end": 99
    },
    {
      "t": "komentar",
      "start": 99,
      "end": 107
    },
    {
      "t": "kalau",
      "start": 107,
      "end": 115
    },
    {
      "t": "kamu",
      "start": 115,
      "end": 124
    },
    {
      "t": "baru",
      "start": 124,
      "end": 132
    },
    {
      "t": "tahu",
      "start": 132,
      "end": 140
    }
  ]
};
