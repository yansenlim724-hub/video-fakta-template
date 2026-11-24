// Timing kata-per-kata untuk caption V4 (TikTok-style).
// Dibangun otomatis dari VO (scripts/build_captions.py).
// Kata di DALAM klausa dibagi rata — aproksimasi, bukan Whisper.
// start/end = frame LOKAL segmen (24 fps).
export type CaptionWord = { t: string; start: number; end: number };
export const CAPTIONS_MADU: Record<string, CaptionWord[]> = {
  "hook": [
    {
      "t": "Tiga",
      "start": 0,
      "end": 8
    },
    {
      "t": "fakta",
      "start": 8,
      "end": 15
    },
    {
      "t": "gila",
      "start": 15,
      "end": 23
    },
    {
      "t": "tentang",
      "start": 23,
      "end": 30
    },
    {
      "t": "madu",
      "start": 30,
      "end": 38
    },
    {
      "t": "Yang",
      "start": 46,
      "end": 52
    },
    {
      "t": "nomor",
      "start": 52,
      "end": 58
    },
    {
      "t": "tiga",
      "start": 58,
      "end": 64
    },
    {
      "t": "paling",
      "start": 64,
      "end": 70
    },
    {
      "t": "nggak",
      "start": 70,
      "end": 77
    },
    {
      "t": "masuk",
      "start": 77,
      "end": 83
    },
    {
      "t": "akal",
      "start": 83,
      "end": 89
    }
  ],
  "f1": [
    {
      "t": "Fakta",
      "start": 0,
      "end": 8
    },
    {
      "t": "satu",
      "start": 8,
      "end": 16
    },
    {
      "t": "Madu",
      "start": 24,
      "end": 31
    },
    {
      "t": "itu",
      "start": 31,
      "end": 37
    },
    {
      "t": "makanan",
      "start": 37,
      "end": 44
    },
    {
      "t": "yang",
      "start": 44,
      "end": 50
    },
    {
      "t": "tidak",
      "start": 50,
      "end": 57
    },
    {
      "t": "pernah",
      "start": 57,
      "end": 63
    },
    {
      "t": "basi",
      "start": 63,
      "end": 70
    },
    {
      "t": "Arkeolog",
      "start": 78,
      "end": 85
    },
    {
      "t": "menemukan",
      "start": 85,
      "end": 92
    },
    {
      "t": "madu",
      "start": 92,
      "end": 99
    },
    {
      "t": "di",
      "start": 99,
      "end": 106
    },
    {
      "t": "dalam",
      "start": 106,
      "end": 113
    },
    {
      "t": "makam",
      "start": 113,
      "end": 120
    },
    {
      "t": "Mesir",
      "start": 120,
      "end": 127
    },
    {
      "t": "yang",
      "start": 127,
      "end": 134
    },
    {
      "t": "sudah",
      "start": 134,
      "end": 141
    },
    {
      "t": "tersegel",
      "start": 141,
      "end": 148
    },
    {
      "t": "lebih",
      "start": 148,
      "end": 155
    },
    {
      "t": "dari",
      "start": 155,
      "end": 162
    },
    {
      "t": "tiga",
      "start": 162,
      "end": 169
    },
    {
      "t": "ribu",
      "start": 169,
      "end": 176
    },
    {
      "t": "tahun",
      "start": 176,
      "end": 183
    },
    {
      "t": "Dan",
      "start": 191,
      "end": 197
    },
    {
      "t": "madunya",
      "start": 197,
      "end": 203
    },
    {
      "t": "masih",
      "start": 203,
      "end": 209
    },
    {
      "t": "utuh",
      "start": 209,
      "end": 215
    },
    {
      "t": "Rahasianya",
      "start": 223,
      "end": 231
    },
    {
      "t": "ada",
      "start": 231,
      "end": 239
    },
    {
      "t": "tiga",
      "start": 239,
      "end": 248
    },
    {
      "t": "Airnya",
      "start": 256,
      "end": 264
    },
    {
      "t": "sedikit",
      "start": 264,
      "end": 273
    },
    {
      "t": "sekali",
      "start": 273,
      "end": 282
    },
    {
      "t": "cuma",
      "start": 282,
      "end": 291
    },
    {
      "t": "sekitar",
      "start": 291,
      "end": 299
    },
    {
      "t": "tujuh",
      "start": 299,
      "end": 308
    },
    {
      "t": "belas",
      "start": 308,
      "end": 317
    },
    {
      "t": "persen",
      "start": 317,
      "end": 325
    },
    {
      "t": "Asamnya",
      "start": 333,
      "end": 342
    },
    {
      "t": "cukup",
      "start": 342,
      "end": 350
    },
    {
      "t": "kuat",
      "start": 350,
      "end": 359
    },
    {
      "t": "sekitar",
      "start": 359,
      "end": 367
    },
    {
      "t": "tiga",
      "start": 367,
      "end": 376
    },
    {
      "t": "koma",
      "start": 376,
      "end": 384
    },
    {
      "t": "sembilan",
      "start": 384,
      "end": 393
    },
    {
      "t": "Dan",
      "start": 402,
      "end": 409
    },
    {
      "t": "enzim",
      "start": 409,
      "end": 416
    },
    {
      "t": "dari",
      "start": 416,
      "end": 424
    },
    {
      "t": "lebahnya",
      "start": 424,
      "end": 431
    },
    {
      "t": "ikut",
      "start": 431,
      "end": 439
    },
    {
      "t": "melawan",
      "start": 439,
      "end": 446
    },
    {
      "t": "kuman",
      "start": 446,
      "end": 453
    }
  ],
  "f2": [
    {
      "t": "Fakta",
      "start": 0,
      "end": 7
    },
    {
      "t": "dua",
      "start": 7,
      "end": 14
    },
    {
      "t": "Untuk",
      "start": 22,
      "end": 25
    },
    {
      "t": "membuat",
      "start": 25,
      "end": 27
    },
    {
      "t": "satu",
      "start": 27,
      "end": 30
    },
    {
      "t": "pon",
      "start": 30,
      "end": 32
    },
    {
      "t": "madu",
      "start": 32,
      "end": 35
    },
    {
      "t": "lebah",
      "start": 35,
      "end": 37
    },
    {
      "t": "harus",
      "start": 37,
      "end": 40
    },
    {
      "t": "mengunjungi",
      "start": 40,
      "end": 43
    },
    {
      "t": "sekitar",
      "start": 43,
      "end": 45
    },
    {
      "t": "dua",
      "start": 45,
      "end": 48
    },
    {
      "t": "juta",
      "start": 48,
      "end": 50
    },
    {
      "t": "bunga",
      "start": 50,
      "end": 53
    },
    {
      "t": "Satu",
      "start": 61,
      "end": 73
    },
    {
      "t": "pon",
      "start": 73,
      "end": 85
    },
    {
      "t": "itu",
      "start": 85,
      "end": 96
    },
    {
      "t": "sekitar",
      "start": 96,
      "end": 108
    },
    {
      "t": "empat",
      "start": 108,
      "end": 120
    },
    {
      "t": "ratus",
      "start": 120,
      "end": 132
    },
    {
      "t": "lima",
      "start": 132,
      "end": 143
    },
    {
      "t": "puluh",
      "start": 143,
      "end": 155
    },
    {
      "t": "empat",
      "start": 155,
      "end": 167
    },
    {
      "t": "gram",
      "start": 167,
      "end": 179
    },
    {
      "t": "Dan",
      "start": 187,
      "end": 194
    },
    {
      "t": "mereka",
      "start": 194,
      "end": 201
    },
    {
      "t": "terbang",
      "start": 201,
      "end": 208
    },
    {
      "t": "sejauh",
      "start": 208,
      "end": 215
    },
    {
      "t": "lebih",
      "start": 215,
      "end": 222
    },
    {
      "t": "dari",
      "start": 222,
      "end": 229
    },
    {
      "t": "dua",
      "start": 229,
      "end": 236
    },
    {
      "t": "kali",
      "start": 236,
      "end": 243
    },
    {
      "t": "keliling",
      "start": 243,
      "end": 250
    },
    {
      "t": "bumi",
      "start": 250,
      "end": 257
    },
    {
      "t": "untuk",
      "start": 257,
      "end": 264
    },
    {
      "t": "mengumpulkannya",
      "start": 264,
      "end": 271
    }
  ],
  "f3": [
    {
      "t": "Fakta",
      "start": 0,
      "end": 7
    },
    {
      "t": "tiga",
      "start": 7,
      "end": 14
    },
    {
      "t": "Satu",
      "start": 22,
      "end": 31
    },
    {
      "t": "lebah",
      "start": 31,
      "end": 39
    },
    {
      "t": "pekerja",
      "start": 39,
      "end": 47
    },
    {
      "t": "seumur",
      "start": 47,
      "end": 56
    },
    {
      "t": "hidupnya",
      "start": 56,
      "end": 64
    },
    {
      "t": "cuma",
      "start": 64,
      "end": 72
    },
    {
      "t": "menghasilkan",
      "start": 72,
      "end": 80
    },
    {
      "t": "sekitar",
      "start": 80,
      "end": 89
    },
    {
      "t": "seperduabelas",
      "start": 89,
      "end": 97
    },
    {
      "t": "sendok",
      "start": 97,
      "end": 105
    },
    {
      "t": "teh",
      "start": 105,
      "end": 113
    },
    {
      "t": "madu",
      "start": 113,
      "end": 122
    },
    {
      "t": "Jadi",
      "start": 130,
      "end": 136
    },
    {
      "t": "satu",
      "start": 136,
      "end": 142
    },
    {
      "t": "sendok",
      "start": 142,
      "end": 148
    },
    {
      "t": "teh",
      "start": 148,
      "end": 153
    },
    {
      "t": "madu",
      "start": 153,
      "end": 159
    },
    {
      "t": "itu",
      "start": 159,
      "end": 165
    },
    {
      "t": "hasil",
      "start": 165,
      "end": 170
    },
    {
      "t": "kerja",
      "start": 170,
      "end": 176
    },
    {
      "t": "seumur",
      "start": 176,
      "end": 182
    },
    {
      "t": "hidup",
      "start": 182,
      "end": 188
    },
    {
      "t": "dua",
      "start": 188,
      "end": 193
    },
    {
      "t": "belas",
      "start": 193,
      "end": 199
    },
    {
      "t": "lebah",
      "start": 199,
      "end": 205
    },
    {
      "t": "Satu",
      "start": 213,
      "end": 219
    },
    {
      "t": "stoples",
      "start": 219,
      "end": 225
    },
    {
      "t": "madu",
      "start": 225,
      "end": 232
    },
    {
      "t": "seberat",
      "start": 232,
      "end": 238
    },
    {
      "t": "satu",
      "start": 238,
      "end": 244
    },
    {
      "t": "pon",
      "start": 244,
      "end": 250
    },
    {
      "t": "itu",
      "start": 250,
      "end": 256
    },
    {
      "t": "hasil",
      "start": 256,
      "end": 263
    },
    {
      "t": "kerja",
      "start": 263,
      "end": 269
    },
    {
      "t": "seumur",
      "start": 269,
      "end": 275
    },
    {
      "t": "hidup",
      "start": 275,
      "end": 281
    },
    {
      "t": "sekitar",
      "start": 281,
      "end": 287
    },
    {
      "t": "tujuh",
      "start": 287,
      "end": 293
    },
    {
      "t": "ratus",
      "start": 293,
      "end": 300
    },
    {
      "t": "enam",
      "start": 300,
      "end": 306
    },
    {
      "t": "puluh",
      "start": 306,
      "end": 312
    },
    {
      "t": "delapan",
      "start": 312,
      "end": 318
    },
    {
      "t": "lebah",
      "start": 318,
      "end": 324
    }
  ],
  "tanya": [
    {
      "t": "Fakta",
      "start": 0,
      "end": 5
    },
    {
      "t": "mana",
      "start": 5,
      "end": 11
    },
    {
      "t": "yang",
      "start": 11,
      "end": 16
    },
    {
      "t": "paling",
      "start": 16,
      "end": 21
    },
    {
      "t": "bikin",
      "start": 21,
      "end": 27
    },
    {
      "t": "kamu",
      "start": 27,
      "end": 32
    },
    {
      "t": "kaget",
      "start": 32,
      "end": 37
    },
    {
      "t": "Tulis",
      "start": 46,
      "end": 51
    },
    {
      "t": "madu",
      "start": 51,
      "end": 57
    },
    {
      "t": "di",
      "start": 57,
      "end": 63
    },
    {
      "t": "komentar",
      "start": 63,
      "end": 68
    },
    {
      "t": "kalau",
      "start": 68,
      "end": 74
    },
    {
      "t": "kamu",
      "start": 74,
      "end": 80
    },
    {
      "t": "baru",
      "start": 80,
      "end": 85
    },
    {
      "t": "tahu",
      "start": 85,
      "end": 91
    }
  ]
};
