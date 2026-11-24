// Timing Lebah dari durasi VO SENO asli (ffprobe, 2026-11-23 21:45 WIB).
// frames = ceil(durasi * 24) + 12 tail; tanya + 72 frame hold senyap (3 dtk).
export const FPS_LEBAH = 24;

export type SceneTimingLebah = { frames: number; voFrames: number };

export const SCENE_ORDER_LEBAH = ["hook", "f1", "f2", "f3", "tanya"] as const;

export const SCENE_TIMING_LEBAH: Record<string, SceneTimingLebah> = {
  hook: { frames: 135, voFrames: 123 }, // VO 5.12 dtk
  f1: { frames: 424, voFrames: 412 }, // VO 17.17 dtk
  f2: { frames: 304, voFrames: 292 }, // VO 12.17 dtk
  f3: { frames: 347, voFrames: 335 }, // VO 13.97 dtk
  tanya: { frames: 191, voFrames: 107 }, // VO 4.46 dtk + hold 3 dtk
};

export const TOTAL_FRAMES_LEBAH = SCENE_ORDER_LEBAH.reduce(
  (sum, id) => sum + SCENE_TIMING_LEBAH[id].frames,
  0,
); // 1401 frame = 58,4 dtk @24fps

// Batas adegan dalam frame global (kumulatif).
export const SCENE_START_LEBAH: Record<string, number> = {
  hook: 0,
  f1: 135,
  f2: 559,
  f3: 863,
  tanya: 1210,
};
