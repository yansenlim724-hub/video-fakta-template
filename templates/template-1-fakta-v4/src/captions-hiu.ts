// Timing kata-per-kata untuk caption V4 (TikTok-style).
// Dibangun dari VO + silencedetect (lihat hiu/build_captions.py).
// Kata di DALAM klausa dibagi rata — aproksimasi, bukan Whisper.
// start/end = frame LOKAL segmen (24 fps).
export type CaptionWord = { t: string; start: number; end: number };
export const CAPTIONS_HIU: Record<string, CaptionWord[]> = {
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
      "end": 33
    },
    {
      "t": "tentang",
      "start": 33,
      "end": 41
    },
    {
      "t": "hiu",
      "start": 41,
      "end": 49
    },
    {
      "t": "Yang",
      "start": 59,
      "end": 66
    },
    {
      "t": "nomor",
      "start": 66,
      "end": 73
    },
    {
      "t": "tiga",
      "start": 73,
      "end": 79
    },
    {
      "t": "paling",
      "start": 79,
      "end": 86
    },
    {
      "t": "nggak",
      "start": 86,
      "end": 93
    },
    {
      "t": "masuk",
      "start": 93,
      "end": 99
    },
    {
      "t": "akal",
      "start": 99,
      "end": 106
    }
  ],
  "f1": [
    {
      "t": "Fakta",
      "start": 5,
      "end": 16
    },
    {
      "t": "satu",
      "start": 16,
      "end": 27
    },
    {
      "t": "Hiu",
      "start": 50,
      "end": 57
    },
    {
      "t": "lebih",
      "start": 57,
      "end": 64
    },
    {
      "t": "tua",
      "start": 64,
      "end": 71
    },
    {
      "t": "dari",
      "start": 71,
      "end": 77
    },
    {
      "t": "pohon",
      "start": 77,
      "end": 84
    },
    {
      "t": "Hiu",
      "start": 109,
      "end": 120
    },
    {
      "t": "sudah",
      "start": 120,
      "end": 130
    },
    {
      "t": "berenang",
      "start": 130,
      "end": 140
    },
    {
      "t": "di",
      "start": 140,
      "end": 150
    },
    {
      "t": "laut",
      "start": 150,
      "end": 160
    },
    {
      "t": "sekitar",
      "start": 160,
      "end": 170
    },
    {
      "t": "empat",
      "start": 170,
      "end": 180
    },
    {
      "t": "ratus",
      "start": 180,
      "end": 190
    },
    {
      "t": "lima",
      "start": 190,
      "end": 200
    },
    {
      "t": "puluh",
      "start": 200,
      "end": 210
    },
    {
      "t": "juta",
      "start": 210,
      "end": 220
    },
    {
      "t": "tahun",
      "start": 220,
      "end": 230
    },
    {
      "t": "sementara",
      "start": 230,
      "end": 241
    },
    {
      "t": "pohon",
      "start": 241,
      "end": 251
    },
    {
      "t": "baru",
      "start": 251,
      "end": 261
    },
    {
      "t": "muncul",
      "start": 261,
      "end": 271
    },
    {
      "t": "puluhan",
      "start": 271,
      "end": 281
    },
    {
      "t": "juta",
      "start": 281,
      "end": 291
    },
    {
      "t": "tahun",
      "start": 291,
      "end": 301
    },
    {
      "t": "setelahnya",
      "start": 301,
      "end": 311
    },
    {
      "t": "Dinosaurus",
      "start": 340,
      "end": 349
    },
    {
      "t": "saja",
      "start": 349,
      "end": 357
    },
    {
      "t": "kalah",
      "start": 357,
      "end": 365
    },
    {
      "t": "tua",
      "start": 365,
      "end": 373
    }
  ],
  "f2": [
    {
      "t": "Fakta",
      "start": 8,
      "end": 18
    },
    {
      "t": "dua",
      "start": 18,
      "end": 28
    },
    {
      "t": "Hiu",
      "start": 38,
      "end": 47
    },
    {
      "t": "bisa",
      "start": 47,
      "end": 55
    },
    {
      "t": "merasakan",
      "start": 55,
      "end": 64
    },
    {
      "t": "listrik",
      "start": 64,
      "end": 72
    },
    {
      "t": "Di",
      "start": 82,
      "end": 92
    },
    {
      "t": "moncongnya",
      "start": 92,
      "end": 101
    },
    {
      "t": "ada",
      "start": 101,
      "end": 110
    },
    {
      "t": "ratusan",
      "start": 110,
      "end": 119
    },
    {
      "t": "pori",
      "start": 119,
      "end": 129
    },
    {
      "t": "kecil",
      "start": 129,
      "end": 138
    },
    {
      "t": "yang",
      "start": 138,
      "end": 147
    },
    {
      "t": "menangkap",
      "start": 147,
      "end": 156
    },
    {
      "t": "listrik",
      "start": 156,
      "end": 166
    },
    {
      "t": "sekecil",
      "start": 166,
      "end": 175
    },
    {
      "t": "lima",
      "start": 175,
      "end": 184
    },
    {
      "t": "per",
      "start": 184,
      "end": 193
    },
    {
      "t": "miliar",
      "start": 193,
      "end": 203
    },
    {
      "t": "volt",
      "start": 203,
      "end": 212
    },
    {
      "t": "Ikan",
      "start": 221,
      "end": 230
    },
    {
      "t": "yang",
      "start": 230,
      "end": 239
    },
    {
      "t": "sembunyi",
      "start": 239,
      "end": 248
    },
    {
      "t": "di",
      "start": 248,
      "end": 257
    },
    {
      "t": "pasir",
      "start": 257,
      "end": 266
    },
    {
      "t": "pun",
      "start": 266,
      "end": 275
    },
    {
      "t": "ketahuan",
      "start": 275,
      "end": 284
    }
  ],
  "f3": [
    {
      "t": "Fakta",
      "start": 7,
      "end": 16
    },
    {
      "t": "tiga",
      "start": 16,
      "end": 25
    },
    {
      "t": "Hiu",
      "start": 54,
      "end": 63
    },
    {
      "t": "Greenland",
      "start": 63,
      "end": 71
    },
    {
      "t": "bisa",
      "start": 71,
      "end": 80
    },
    {
      "t": "hidup",
      "start": 80,
      "end": 88
    },
    {
      "t": "empat",
      "start": 88,
      "end": 97
    },
    {
      "t": "ratus",
      "start": 97,
      "end": 105
    },
    {
      "t": "tahun",
      "start": 105,
      "end": 114
    },
    {
      "t": "Dia",
      "start": 146,
      "end": 155
    },
    {
      "t": "yang",
      "start": 155,
      "end": 164
    },
    {
      "t": "paling",
      "start": 164,
      "end": 173
    },
    {
      "t": "panjang",
      "start": 173,
      "end": 182
    },
    {
      "t": "umur",
      "start": 182,
      "end": 191
    },
    {
      "t": "di",
      "start": 191,
      "end": 200
    },
    {
      "t": "antara",
      "start": 200,
      "end": 209
    },
    {
      "t": "hewan",
      "start": 209,
      "end": 219
    },
    {
      "t": "bertulang",
      "start": 219,
      "end": 228
    },
    {
      "t": "belakang",
      "start": 228,
      "end": 237
    },
    {
      "t": "Yang",
      "start": 265,
      "end": 274
    },
    {
      "t": "paling",
      "start": 274,
      "end": 283
    },
    {
      "t": "tua",
      "start": 283,
      "end": 291
    },
    {
      "t": "lahir",
      "start": 291,
      "end": 300
    },
    {
      "t": "sekitar",
      "start": 300,
      "end": 309
    },
    {
      "t": "tahun",
      "start": 309,
      "end": 317
    },
    {
      "t": "seribu",
      "start": 317,
      "end": 326
    },
    {
      "t": "enam",
      "start": 326,
      "end": 334
    },
    {
      "t": "ratus",
      "start": 334,
      "end": 343
    },
    {
      "t": "dua",
      "start": 343,
      "end": 352
    },
    {
      "t": "puluh",
      "start": 352,
      "end": 360
    },
    {
      "t": "empat",
      "start": 360,
      "end": 369
    },
    {
      "t": "dan",
      "start": 376,
      "end": 386
    },
    {
      "t": "baru",
      "start": 386,
      "end": 395
    },
    {
      "t": "dewasa",
      "start": 395,
      "end": 405
    },
    {
      "t": "umur",
      "start": 405,
      "end": 414
    },
    {
      "t": "seratus",
      "start": 414,
      "end": 424
    },
    {
      "t": "lima",
      "start": 424,
      "end": 433
    },
    {
      "t": "puluh",
      "start": 433,
      "end": 443
    },
    {
      "t": "tahun",
      "start": 443,
      "end": 452
    }
  ],
  "tanya": [
    {
      "t": "Fakta",
      "start": 10,
      "end": 17
    },
    {
      "t": "mana",
      "start": 17,
      "end": 24
    },
    {
      "t": "yang",
      "start": 24,
      "end": 32
    },
    {
      "t": "paling",
      "start": 32,
      "end": 39
    },
    {
      "t": "bikin",
      "start": 39,
      "end": 47
    },
    {
      "t": "kamu",
      "start": 47,
      "end": 54
    },
    {
      "t": "kaget",
      "start": 54,
      "end": 62
    },
    {
      "t": "Tulis",
      "start": 69,
      "end": 76
    },
    {
      "t": "hiu",
      "start": 76,
      "end": 82
    },
    {
      "t": "di",
      "start": 82,
      "end": 89
    },
    {
      "t": "komentar",
      "start": 89,
      "end": 96
    },
    {
      "t": "kalau",
      "start": 96,
      "end": 102
    },
    {
      "t": "kamu",
      "start": 102,
      "end": 109
    },
    {
      "t": "baru",
      "start": 109,
      "end": 116
    },
    {
      "t": "tahu",
      "start": 116,
      "end": 122
    }
  ]
};
