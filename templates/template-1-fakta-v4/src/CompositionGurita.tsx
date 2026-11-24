import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Composition,
  Sequence,
} from "remotion";
import { Audio } from "@remotion/media";
import { CAPTIONS_GURITA, type CaptionWord } from "./captions-gurita";
import {
  FPS_GURITA,
  SCENE_ORDER_GURITA,
  SCENE_START_GURITA,
  SCENE_TIMING_GURITA,
  TOTAL_FRAMES_GURITA,
} from "./timing-gurita";

// Video fakta #4 — "3 Fakta Gila tentang Gurita" (2026-11-24).
// Gaya standar V4 Captions (user pilih 2026-11-24): caption kata-per-kata
// gaya TikTok, kata aktif warna aksen + scale 1,15, halaman maks 3 kata.
// VO Seno 0.95, angka dieja kata (aturan 33). Aset Flow 7/7 terverifikasi.
// SFX dihitung dari scene start SAAT INI (bukan timing lama — lihat
// pelajaran 35: pop Hiu V4 di 482/790 sudah basi dari timing pra-ejaan).
const FONT = "'Plus Jakarta Sans', 'Liberation Sans', sans-serif";
const INK = "#0F172A";
const ORANGE = "#F97316";
const BLUE = "#2563EB";
const TEAL = "#0D9488";
const ROSE = "#E11D48";
const GREEN = "#22C55E";
const RED = "#EF4444";
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

const enter = (frame: number, start: number, dur = 14) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ---------------------------------------------------------------------------
// Dunia: kanvas putih + grid, satu dan sama sepanjang video.
// ---------------------------------------------------------------------------
const World = () => (
  <AbsoluteFill
    style={{
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "linear-gradient(rgba(15,23,42,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.07) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }}
  />
);

const ProgressBar = () => {
  const frame = useCurrentFrame();
  const p = frame / TOTAL_FRAMES_GURITA;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 6,
        background: "rgba(15,23,42,0.12)",
      }}
    >
      <div style={{ width: `${p * 100}%`, height: "100%", background: ORANGE }} />
    </div>
  );
};

// Maskot (aturan 9): gurita oranye kecil, pojok kanan bawah, di SEMUA adegan.
const MascotCorner = () => {
  const frame = useCurrentFrame();
  const bob = Math.sin((frame / FPS_GURITA) * (2 * Math.PI * 0.5)) * 4;
  const tilt = Math.sin((frame / FPS_GURITA) * (2 * Math.PI * 0.5)) * 1.5;
  const e = enter(frame, 0, 20);
  return (
    <Img
      src={staticFile("assets/maskot-gurita.png")}
      style={{
        position: "absolute",
        right: 20,
        bottom: 28,
        width: 120,
        height: 120,
        opacity: e,
        transform: `translateY(${bob}px) rotate(${tilt}deg)`,
      }}
    />
  );
};

// Strip 3 fakta persisten: ikon aktif berwarna penuh, yang lain abu-abu redup.
const FactStrip = () => {
  const frame = useCurrentFrame();
  const e =
    enter(frame, SCENE_START_GURITA.f1, 12) *
    (1 - enter(frame, SCENE_START_GURITA.tanya, 12));
  const active =
    frame < SCENE_START_GURITA.f2 ? 0 : frame < SCENE_START_GURITA.f3 ? 1 : 2;
  const icons = [
    "assets/icon-gurita-blue.png",
    "assets/icon-jantung-rose.png",
    "assets/icon-otak-teal.png",
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        right: 24,
        display: "flex",
        gap: 10,
        opacity: e,
      }}
    >
      {icons.map((src, i) => (
        <Img
          key={src}
          src={staticFile(src)}
          style={{
            width: 34,
            height: 34,
            objectFit: "contain",
            opacity: i === active ? 1 : 0.3,
            filter: i === active ? "none" : "grayscale(1)",
            transform: `scale(${i === active ? 1.15 : 1})`,
          }}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Elemen-elemen (semua masuk ease-out, tanpa spring).
// ---------------------------------------------------------------------------
const StepPill = ({ label, color }: { label: string; color: string }) => {
  const frame = useCurrentFrame();
  const e = enter(frame, 4);
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 56,
        background: color,
        borderRadius: 999,
        padding: "10px 28px",
        transform: `translateY(${(1 - e) * 16}px)`,
        opacity: e,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 3,
          color: "#FFFFFF",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const HeadlineWords = ({
  words,
  start,
  accent,
}: {
  words: Array<{ t: string; accent?: boolean }>;
  start: number;
  accent: string;
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 18px",
      }}
    >
      {words.map((w, i) => {
        const e = enter(frame, start + i * 3, 18);
        const target = w.accent ? parseInt(w.t, 10) : NaN;
        const isNumber = !Number.isNaN(target);
        const counted = isNumber
          ? Math.round(
              interpolate(frame, [start + i * 3, start + i * 3 + 40], [0, target], {
                easing: Easing.out(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            )
          : null;
        return (
          <div
            key={i}
            style={{
              opacity: e,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 64,
                lineHeight: 1.08,
                color: w.accent ? accent : INK,
                textAlign: "center",
                fontVariantNumeric: isNumber ? "tabular-nums" : undefined,
              }}
            >
              {isNumber ? String(counted) : w.t}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const HookTitleWords = ({ start }: { start: number }) => {
  const frame = useCurrentFrame();
  const lines: Array<Array<{ t: string; accent?: boolean }>> = [
    [{ t: "GURITA" }],
    [{ t: "3", accent: true }, { t: "JANTUNG" }],
  ];
  let idx = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px" }}
        >
          {line.map((w) => {
            const i = idx++;
            const e = enter(frame, start + i * 3, 18);
            return (
              <div
                key={w.t}
                style={{
                  transform: `translateY(${(1 - e) * 12}px)`,
                  opacity: e,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 84,
                    lineHeight: 1.05,
                    color: w.accent ? ORANGE : INK,
                    textAlign: "center",
                  }}
                >
                  {w.t}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const SolidPill = ({
  text,
  color,
  start,
  end,
}: {
  text: string;
  color: string;
  start: number;
  end: number;
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + 14, end - 14, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < start || frame > end) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        background: color,
        borderRadius: 999,
        padding: "12px 32px",
        transform: "translateX(-50%)",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: 0.5,
          color: "#FFFFFF",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const ICONS: Record<string, { src: string; w: number; h: number }> = {
  gurita: { src: "assets/icon-gurita-blue.png", w: 56, h: 50 },
  jantung: { src: "assets/icon-jantung-rose.png", w: 40, h: 36 },
  otak: { src: "assets/icon-otak-teal.png", w: 52, h: 45 },
};

const IconCircle = ({
  kind,
  color,
  start,
}: {
  kind: "gurita" | "jantung" | "otak";
  color: string;
  start: number;
}) => {
  const frame = useCurrentFrame();
  const e = enter(frame, start, 14);
  const icon = ICONS[kind];
  return (
    <div
      style={{
        width: 92,
        height: 92,
        borderRadius: "50%",
        border: `3px dashed ${color}`,
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${(1 - e) * 18}px)`,
        opacity: e,
      }}
    >
      <Img
        src={staticFile(icon.src)}
        style={{ width: icon.w, height: icon.h, objectFit: "contain" }}
      />
    </div>
  );
};

const IconRow = ({ start }: { start: number }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: 36,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <IconCircle kind="gurita" color={BLUE} start={start} />
    <IconCircle kind="jantung" color={ROSE} start={start + 6} />
    <IconCircle kind="otak" color={TEAL} start={start + 12} />
  </div>
);

const BottomPill = ({ text, start }: { text: string; start: number }) => {
  const frame = useCurrentFrame();
  const e = enter(frame, start, 14);
  return (
    <div
      style={{
        background: INK,
        borderRadius: 999,
        padding: "14px 36px",
        transform: `translateY(${(1 - e) * 16}px)`,
        opacity: e,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: 4,
          color: "#FFFFFF",
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Diagram dari aset Flow.
// ---------------------------------------------------------------------------
const Glow = ({
  color,
  cx,
  cy,
  size,
}: {
  color: string;
  cx: number;
  cy: number;
  size: number;
}) => {
  const frame = useCurrentFrame();
  const breathe = 0.5 + 0.5 * Math.sin((frame / FPS_GURITA) * Math.PI);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}59 0%, ${color}26 45%, transparent 70%)`,
        opacity: 0.45 + 0.5 * breathe,
        transform: `scale(${1 + 0.07 * breathe})`,
        pointerEvents: "none",
      }}
    />
  );
};

const Diagram = ({ id, voFrames }: { id: string; voFrames: number }) => {
  const frame = useCurrentFrame();
  const e = enter(frame, 20, 16);
  const wrap: React.CSSProperties = {
    width: 360,
    height: 360,
    position: "relative",
    transform: `translateY(${(1 - e) * 20}px)`,
    opacity: e,
  };

  if (id === "f1") {
    // Diagram jantung: masuk pas "Gurita punya tiga jantung" (klausa 2,
    // 2,15 dtk = frame 52, diukur silencedetect). Berdenyut pas "biru"
    // (klausa 4, 11,14 dtk = 267) dan pas "berhenti" (klausa 5, 17,73 dtk
    // = 426). Diagram ditampilkan 300px supaya halo bernapas kelihatan
    // di sekelilingnya.
    const bob = Math.sin((frame / FPS_GURITA) * ((2 * Math.PI) / 3)) * 5;
    const drift = Math.sin((frame / FPS_GURITA) * ((2 * Math.PI) / 6)) * 8;
    const diagE = enter(frame, 52, 16);
    const pulse = (center: number) =>
      interpolate(frame, [center, center + 8, center + 24], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    const p = Math.max(pulse(267), pulse(426));
    return (
      <div style={wrap}>
        <Glow color={ORANGE} cx={180} cy={180} size={340} />
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 20,
            width: 300,
            height: 287,
            opacity: diagE,
            transform: `translateY(${(1 - diagE) * 20}px) scale(${1 + p * 0.05})`,
          }}
        >
          <Img
            src={staticFile("assets/diagram-jantung.png")}
            style={{ width: 300, height: 287, transform: `translate(${drift}px, ${bob}px)` }}
          />
        </div>
      </div>
    );
  }

  if (id === "f2") {
    // Diagram otak: sway pelan + zoom merayap. Halo biru di belakang.
    const sway = Math.sin((frame / FPS_GURITA) * ((2 * Math.PI) / 4)) * 1;
    const zoom = 1 + (0.03 * Math.min(frame, voFrames)) / voFrames;
    return (
      <div style={{ ...wrap, transform: `translateY(${(1 - e) * 20}px) scale(${zoom})` }}>
        <Glow color={BLUE} cx={180} cy={180} size={340} />
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 25,
            width: 300,
            height: 294,
            transform: `rotate(${sway}deg)`,
          }}
        >
          <Img
            src={staticFile("assets/diagram-otak.png")}
            style={{ width: 300, height: 294, objectFit: "contain" }}
          />
        </div>
      </div>
    );
  }

  // f3: diagram kamuflase (setengah karang / setengah batu) — zoom merayap
  // + drift pelan. Halo teal di belakang.
  const drift = Math.sin((frame / FPS_GURITA) * ((2 * Math.PI) / 4)) * 6;
  const bob3 = Math.sin((frame / FPS_GURITA) * ((2 * Math.PI) / 3)) * 4;
  const zoom = 1 + (0.03 * Math.min(frame, voFrames)) / voFrames;
  return (
    <div style={{ ...wrap, transform: `translateY(${(1 - e) * 20}px) scale(${zoom})` }}>
      <Glow color={TEAL} cx={180} cy={180} size={340} />
      <Img
        src={staticFile("assets/diagram-kamuflase.png")}
        style={{
          position: "absolute",
          left: 20,
          top: 22,
          width: 320,
          height: 311,
          transform: `translate(${drift}px, ${bob3}px)`,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Adegan.
// ---------------------------------------------------------------------------
const buildPages = (words: CaptionWord[]): CaptionWord[][] => {
  const pages: CaptionWord[][] = [];
  let cur: CaptionWord[] = [];
  for (const w of words) {
    if (cur.length === 0) {
      cur.push(w);
      continue;
    }
    const prev = cur[cur.length - 1];
    if (cur.length >= 3 || w.start - prev.end > 30) {
      pages.push(cur);
      cur = [w];
    } else {
      cur.push(w);
    }
  }
  if (cur.length) pages.push(cur);
  return pages;
};
const Captions = ({ id, accent, top }: { id: string; accent: string; top: number }) => {
  const frame = useCurrentFrame();
  const pages = buildPages(CAPTIONS_GURITA[id]);
  const pageIdx = pages.findIndex(
    (p, i) =>
      frame >= p[0].start &&
      (i === pages.length - 1 || frame < pages[i + 1][0].start),
  );
  if (pageIdx < 0) return null;
  const page = pages[pageIdx];
  const activeIdx = page.findIndex((w) => frame >= w.start && frame < w.end);
  const highlightIdx =
    activeIdx >= 0
      ? activeIdx
      : page.reduce((acc, w, i) => (w.end <= frame ? i : acc), -1);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      {page.map((w, i) => {
        const active = i === highlightIdx;
        return (
          <span
            key={`${w.t}-${w.start}`}
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 42,
              lineHeight: 1.1,
              color: active ? accent : INK,
              opacity: active ? 1 : 0.5,
              transform: `scale(${active ? 1.15 : 1})`,
              display: "inline-block",
            }}
          >
            {w.t.toLowerCase()}
          </span>
        );
      })}
    </div>
  );
};

const Scene = ({ id }: { id: string }) => {
  const frame = useCurrentFrame();
  const voFrames = SCENE_TIMING_GURITA[id].voFrames;
  const sceneFrames = SCENE_TIMING_GURITA[id].frames;
  const fade =
    interpolate(frame, [0, 10], [0, 1], {
      easing: EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [sceneFrames - 8, sceneFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  if (id === "hook") {
    const subE = enter(frame, 6, 14);
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 196, opacity: fade }}>
        <Audio src={staticFile("audio/gurita-seno/hook.wav")} />
        <div
          style={{
            background: ORANGE,
            borderRadius: 999,
            padding: "10px 28px",
            transform: `translateY(${(1 - subE) * 16}px)`,
            opacity: subE,
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, letterSpacing: 6, color: "#FFFFFF" }}>
            3 FAKTA GILA
          </div>
        </div>
        <div style={{ marginTop: 22 }}>
          <HookTitleWords start={14} />
        </div>
        <div style={{ marginTop: 44 }}>
          <IconRow start={30} />
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA GURITA" start={44} />
        </div>
        <Captions id="hook" accent={ORANGE} top={940} />
      </AbsoluteFill>
    );
  }

  if (id === "tanya") {
    const qE = enter(frame, 8, 16);
    const mascotE = enter(frame, 26, 14);
    const ctaE = enter(frame, 44, 14);
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 210, opacity: fade }}>
        <Audio src={staticFile("audio/gurita-seno/tanya.wav")} />
        <div
          style={{
            transform: `translateY(${(1 - qE) * 20}px)`,
            opacity: qE,
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, lineHeight: 1.08, color: INK, textAlign: "center" }}>
            MANA YANG
            <br />
            PALING GILA?
          </div>
        </div>
        <div style={{ marginTop: 36, opacity: mascotE, transform: `translateY(${(1 - mascotE) * 16}px)` }}>
          <Img src={staticFile("assets/maskot-gurita.png")} style={{ width: 150, height: 150 }} />
        </div>
        <div
          style={{
            marginTop: 36,
            background: TEAL,
            borderRadius: 999,
            padding: "12px 32px",
            transform: `translateY(${(1 - ctaE) * 16}px)`,
            opacity: ctaE,
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, letterSpacing: 1, color: "#FFFFFF", textAlign: "center" }}>
            TULIS 'GURITA' DI KOMENTAR
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 200, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <IconRow start={22} />
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA GURITA" start={34} />
        </div>
        <Captions id="tanya" accent={TEAL} top={800} />
      </AbsoluteFill>
    );
  }

  const stepColor = id === "f1" ? ORANGE : id === "f2" ? BLUE : TEAL;
  const headline: Array<{ t: string; accent?: boolean }> =
    id === "f1"
      ? [{ t: "3", accent: true }, { t: "JANTUNG" }]
      : id === "f2"
        ? [{ t: "9", accent: true }, { t: "OTAK" }]
        : [{ t: "100", accent: true }, { t: "MILIDETIK" }];
  const accent = id === "f1" ? ORANGE : id === "f2" ? BLUE : TEAL;
  // Pil kontinyu (aturan 1): pil 2 mulai 10 frame SEBELUM pil 1 selesai;
  // pil terakhir jalan sampai ~16 frame sebelum adegan berakhir.
  const pills: Record<string, Array<{ text: string; color: string; s: number; e: number }>> = {
    f1: [
      { text: "TIGA JANTUNG", color: BLUE, s: 60, e: 260 },
      { text: "BERHENTI SAAT BERENANG", color: ROSE, s: 250, e: 540 },
    ],
    f2: [
      { text: "SEMBILAN OTAK", color: BLUE, s: 60, e: 210 },
      { text: "LENGAN BISA MIKIR SENDIRI", color: ORANGE, s: 200, e: 475 },
    ],
    f3: [
      { text: "GANTI WARNA SEKEJAP", color: ORANGE, s: 60, e: 240 },
      { text: "TEKSTUR IKUT BERUBAH", color: BLUE, s: 230, e: 470 },
    ],
  };
  const chipLabel = id === "f1" ? "FAKTA 1" : id === "f2" ? "FAKTA 2" : "FAKTA 3";
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 246, opacity: fade }}>
      <Audio src={staticFile(`audio/gurita-seno/${id}.wav`)} />
      <StepPill label={chipLabel} color={stepColor} />
      <HeadlineWords words={headline} start={8} accent={accent} />
      <div style={{ marginTop: 36 }}>
        <Diagram id={id} voFrames={voFrames} />
      </div>
      <div style={{ position: "relative", marginTop: 28, width: "100%", height: 76 }}>
        {pills[id].map((p, i) => (
          <SolidPill key={i} text={p.text} color={p.color} start={p.s} end={p.e} />
        ))}
      </div>
      <Captions id={id} accent={stepColor} top={1060} />
    </AbsoluteFill>
  );
};

// SFX: pop saat headline tiap fakta muncul (global = start adegan + 8),
// ding pelan saat kartu penutup. Dihitung dari timing-gurita SAAT INI:
// f1 152+8=160, f2 708+8=716, f3 1202+8=1210, tanya 1692+8=1700.
const SfxLayer = () => (
  <>
    <Sequence from={160} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.22} playbackRate={0.97} />
    </Sequence>
    <Sequence from={716} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.25} playbackRate={1} />
    </Sequence>
    <Sequence from={1210} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.28} playbackRate={1.03} />
    </Sequence>
    <Sequence from={1700} durationInFrames={40}>
      <Audio src={staticFile("sfx/ding.mp3")} volume={0.3} />
    </Sequence>
  </>
);

const FaktaGuritaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TOTAL_FRAMES_GURITA], [1, 1.02], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <World />
        {SCENE_ORDER_GURITA.map((id) => (
          <Sequence
            key={id}
            from={SCENE_START_GURITA[id]}
            durationInFrames={SCENE_TIMING_GURITA[id].frames}
            name={id}
          >
            <Scene id={id} />
          </Sequence>
        ))}
        <MascotCorner />
        <FactStrip />
      </div>
      <ProgressBar />
      <SfxLayer />
    </AbsoluteFill>
  );
};

export const FaktaGurita: React.FC = () => {
  const [handle] = useState(() => delayRender("plus-jakarta-font"));
  useEffect(() => {
    document.fonts
      .load('800 48px "Plus Jakarta Sans"')
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  return (
    <>
      <style>{`@font-face { font-family: 'Plus Jakarta Sans'; src: url(${staticFile("fonts/PlusJakartaSans.ttf")}) format('truetype-variations'); font-weight: 200 800; }`}</style>
      <Composition
        id="FaktaGurita"
        component={FaktaGuritaScene}
        durationInFrames={TOTAL_FRAMES_GURITA}
        fps={FPS_GURITA}
        width={720}
        height={1280}
      />
    </>
  );
};
