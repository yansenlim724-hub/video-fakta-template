// Timing v2 dari durasi VO asli (ffprobe, 2026-11-23 19:56 WIB).
// frames = ceil(durasi * 24) + 12 tail; tanya + 72 frame hold senyap (3 dtk).
export const FPS2 = 24;

export type SceneTiming2 = { frames: number; voFrames: number };

export const SCENE_ORDER2 = ["hook", "f1", "f2", "f3", "tanya"] as const;

export const SCENE_TIMING2: Record<string, SceneTiming2> = {
  hook: { frames: 139, voFrames: 127 }, // VO 5.29 dtk
  f1: { frames: 307, voFrames: 295 }, // VO 12.29 dtk
  f2: { frames: 253, voFrames: 241 }, // VO 10.01 dtk
  f3: { frames: 224, voFrames: 212 }, // VO 8.81 dtk
  tanya: { frames: 177, voFrames: 93 }, // VO 3.85 dtk + hold 3 dtk
};

export const TOTAL_FRAMES2 = SCENE_ORDER2.reduce(
  (sum, id) => sum + SCENE_TIMING2[id].frames,
  0,
); // 1100 frame = 45,8 dtk @24fps
