// Timing dari durasi VO asli (ffprobe, 2026-11-23 19:44 WIB).
// frames = ceil(durasi * 24) + 12 tail; share + 72 frame hold senyap (3 dtk).
export const FPS = 24;

export type SceneTiming = { frames: number; voFrames: number };

export const SCENE_ORDER = [
  "hook",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "payoff",
  "share",
] as const;

export const SCENE_TIMING: Record<string, SceneTiming> = {
  hook: { frames: 155, voFrames: 143 }, // VO 5.93 dtk
  f1: { frames: 253, voFrames: 241 }, // VO 10.01 dtk
  f2: { frames: 259, voFrames: 247 }, // VO 10.25 dtk
  f3: { frames: 188, voFrames: 176 }, // VO 7.33 dtk
  f4: { frames: 214, voFrames: 202 }, // VO 8.41 dtk
  f5: { frames: 242, voFrames: 230 }, // VO 9.57 dtk
  payoff: { frames: 269, voFrames: 257 }, // VO 10.69 dtk
  share: { frames: 182, voFrames: 98 }, // VO 4.05 dtk + hold 3 dtk
};

export const TOTAL_FRAMES = SCENE_ORDER.reduce(
  (sum, id) => sum + SCENE_TIMING[id].frames,
  0,
); // 1762 frame = 73,4 dtk @24fps
