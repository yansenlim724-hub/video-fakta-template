// Timing v2b dari durasi VO SENO asli (ffprobe, 2026-11-23 20:01 WIB).
// frames = ceil(durasi * 24) + 12 tail; tanya + 72 frame hold senyap (3 dtk).
export const FPS2B = 24;

export type SceneTiming2B = { frames: number; voFrames: number };

export const SCENE_ORDER2B = ["hook", "f1", "f2", "f3", "tanya"] as const;

export const SCENE_TIMING2B: Record<string, SceneTiming2B> = {
  hook: { frames: 139, voFrames: 127 }, // VO 5.26 dtk
  f1: { frames: 335, voFrames: 323 }, // VO 13.44 dtk
  f2: { frames: 250, voFrames: 238 }, // VO 9.90 dtk
  f3: { frames: 241, voFrames: 229 }, // VO 9.51 dtk
  tanya: { frames: 192, voFrames: 108 }, // VO 4.46 dtk + hold 3 dtk
};

export const TOTAL_FRAMES2B = SCENE_ORDER2B.reduce(
  (sum, id) => sum + SCENE_TIMING2B[id].frames,
  0,
); // 1157 frame = 48,2 dtk @24fps

// Batas adegan dalam frame global (kumulatif).
export const SCENE_START2B: Record<string, number> = {
  hook: 0,
  f1: 139,
  f2: 474,
  f3: 724,
  tanya: 965,
};
