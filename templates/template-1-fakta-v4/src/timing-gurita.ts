// Timing Gurita dari durasi VO SENO asli (ffprobe, 2026-11-24).
// frames = ceil(durasi * 24) + 12 tail; tanya + 72 frame hold senyap (3 dtk).
// VO total 76,66 dtk — lebih panjang dari standar (±60 dtk); user sudah diberi tahu.
export const FPS_GURITA = 24;

export type SceneTimingGurita = { frames: number; voFrames: number };

export const SCENE_ORDER_GURITA = ["hook", "f1", "f2", "f3", "tanya"] as const;

export const SCENE_TIMING_GURITA: Record<string, SceneTimingGurita> = {
  hook: { frames: 152, voFrames: 140 }, // VO 5.83 dtk
  f1: { frames: 556, voFrames: 544 }, // VO 22.63 dtk
  f2: { frames: 494, voFrames: 482 }, // VO 20.04 dtk
  f3: { frames: 490, voFrames: 478 }, // VO 19.91 dtk
  tanya: { frames: 223, voFrames: 151 }, // VO 6.25 dtk + hold 3 dtk
};

export const TOTAL_FRAMES_GURITA = SCENE_ORDER_GURITA.reduce(
  (sum, id) => sum + SCENE_TIMING_GURITA[id].frames,
  0,
); // 1915 frame = 79,8 dtk @24fps

// Batas adegan dalam frame global (kumulatif).
export const SCENE_START_GURITA: Record<string, number> = {
  hook: 0,
  f1: 152,
  f2: 708,
  f3: 1202,
  tanya: 1692,
};
