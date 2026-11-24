// Timing Hiu dari durasi VO SENO asli (ffprobe, 2026-11-24 06:49 WIB).
// frames = ceil(durasi * 24) + 12 tail; tanya + 72 frame hold senyap (3 dtk).
export const FPS_HIU = 24;

export type SceneTimingHiu = { frames: number; voFrames: number };

export const SCENE_ORDER_HIU = ["hook", "f1", "f2", "f3", "tanya"] as const;

export const SCENE_TIMING_HIU: Record<string, SceneTimingHiu> = {
  hook: { frames: 134, voFrames: 122 }, // VO 5.05 dtk
  f1: { frames: 401, voFrames: 389 }, // VO 16.20 dtk (v4: angka dieja kata)
  f2: { frames: 308, voFrames: 296 }, // VO 12.30 dtk
  f3: { frames: 479, voFrames: 467 }, // VO 19.42 dtk (v4: angka dieja kata)
  tanya: { frames: 221, voFrames: 137 }, // VO 5.71 dtk + hold 3 dtk
};

export const TOTAL_FRAMES_HIU = SCENE_ORDER_HIU.reduce(
  (sum, id) => sum + SCENE_TIMING_HIU[id].frames,
  0,
); // 1543 frame = 64,3 dtk @24fps

// Batas adegan dalam frame global (kumulatif).
export const SCENE_START_HIU: Record<string, number> = {
  hook: 0,
  f1: 134,
  f2: 535,
  f3: 843,
  tanya: 1322,
};
