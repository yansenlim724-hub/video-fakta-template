// Timing Madu dari durasi VO GEMINI Charon asli (ffprobe, 2026-11-24).
// frames = ceil(durasi * 24) + 12 tail; tanya + 72 frame hold senyap (3 dtk).
// VO total 51,21 dtk — SATU BLOK satu request Gemini (1010 karakter, Charon),
// lalu dipotong split_vo.py (20 kalimat, durasi/kata konsisten 0,23-0,37).
export const FPS_MADU = 24;

export type SceneTimingMadu = { frames: number; voFrames: number };

export const SCENE_ORDER_MADU = ["hook", "f1", "f2", "f3", "tanya"] as const;

export const SCENE_TIMING_MADU: Record<string, SceneTimingMadu> = {
  hook: { frames: 101, voFrames: 89 }, // VO 3.70 dtk
  f1: { frames: 466, voFrames: 454 }, // VO 18.89 dtk
  f2: { frames: 284, voFrames: 272 }, // VO 11.31 dtk
  f3: { frames: 337, voFrames: 325 }, // VO 13.52 dtk
  tanya: { frames: 175, voFrames: 91 }, // VO 3.79 dtk + hold 3 dtk
};

export const TOTAL_FRAMES_MADU = SCENE_ORDER_MADU.reduce(
  (sum, id) => sum + SCENE_TIMING_MADU[id].frames,
  0,
); // 1363 frame = 56,8 dtk @24fps

// Batas adegan dalam frame global (kumulatif).
export const SCENE_START_MADU: Record<string, number> = {
  hook: 0,
  f1: 101,
  f2: 567,
  f3: 851,
  tanya: 1188,
};
