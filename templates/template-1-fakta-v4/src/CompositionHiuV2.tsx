import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  Composition,
  Sequence,
} from "remotion";
import { Audio } from "@remotion/media";
import { evolvePath } from "@remotion/paths";
import {
  FPS_HIU,
  SCENE_ORDER_HIU,
  SCENE_START_HIU,
  SCENE_TIMING_HIU,
  TOTAL_FRAMES_HIU,
} from "./timing-hiu";

// Video fakta #3 — V2 KINETIC (portofolio, 2026-11-24). Sampel gaya kedua:
// tipografi kinetik PENUH — kata mendarat dengan spring (naik 30px + scale,
// damping 12, stiffness 200, mass 0.5, stagger 3f), pil step nge-pop,
// adegan masuk scale-through 1.06 -> 1. Sengaja MELANGGAR aturan lama
// (tanpa spring / tanpa glide naik) — ini sampel, bukan pengganti versi
// yang disetujui. Basis: CompositionHiu.tsx (versi pil-diem + halo + orbit
// + draw-on evolvePath).
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
  const p = frame / TOTAL_FRAMES_HIU;
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

// Maskot (aturan 9): hiu biru kecil, pojok kanan bawah, di SEMUA adegan,
// goyang pelan supaya hidup. Dirender sekali di level komposisi (di dalam
// zoom global) sehingga posisinya konsisten dari adegan ke adegan.
const MascotCorner = () => {
  const frame = useCurrentFrame();
  const bob = Math.sin((frame / FPS_HIU) * (2 * Math.PI * 0.5)) * 4;
  const tilt = Math.sin((frame / FPS_HIU) * (2 * Math.PI * 0.5)) * 1.5;
  const e = enter(frame, 0, 20);
  return (
    <Img
      src={staticFile("assets/diagram-shark.png")}
      style={{
        position: "absolute",
        right: 20,
        bottom: 28,
        width: 120,
        height: 67,
        opacity: e,
        transform: `translateY(${bob}px) rotate(${tilt}deg)`,
      }}
    />
  );
};

// Strip 3 fakta persisten (@adamprabata, riset Threads): penonton selalu
// tahu sedang di fakta ke berapa — ikon aktif berwarna penuh, yang lain
// abu-abu redup. Muncul bareng F1, hilang di kartu penutup.
const FactStrip = () => {
  const frame = useCurrentFrame();
  const e =
    enter(frame, SCENE_START_HIU.f1, 12) *
    (1 - enter(frame, SCENE_START_HIU.tanya, 12));
  const active =
    frame < SCENE_START_HIU.f2 ? 0 : frame < SCENE_START_HIU.f3 ? 1 : 2;
  const icons = [
    "assets/icon-shark-blue.png",
    "assets/icon-lightning-orange.png",
    "assets/icon-hourglass-teal.png",
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
  // KINETIC V2: pil nge-pop dengan spring scale (overshoot), tanpa geser.
  const p = spring({
    frame: frame - 4,
    fps: FPS_HIU,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 56,
        background: color,
        borderRadius: 999,
        padding: "10px 28px",
        transform: `scale(${0.8 + 0.2 * p})`,
        opacity: Math.min(1, Math.max(0, p)),
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

// EKSPERIMEN aturan 11: headline muncul kata-per-kata — POLISH v2: stagger
// dirapatkan (5->3 frame) + durasi dipanjang (14->18) + naik lebih pendek
// (20->12px) supaya kata-kata MELUNCUR masuk tumpang-tindih, bukan pop satu-satu.
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
        // KINETIC V2: kata mendarat dengan spring — naik 30px + scale,
        // stagger 3f (resep claude-remotion-skill).
        const p = spring({
          frame: frame - (start + i * 3),
          fps: FPS_HIU,
          config: { damping: 12, stiffness: 200, mass: 0.5 },
        });
        // COUNT-UP (Flimify, riset GitHub): angka headline menghitung naik
        // 0 -> target selama 40 frame sejak kata itu masuk — angka terasa
        // "tiba" dengan energi, bukan sekadar muncul diam. tabular-nums
        // supaya digit tidak goyang saat berubah.
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
              opacity: Math.min(1, Math.max(0, p)),
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${0.9 + 0.1 * p})`,
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
    [{ t: "HIU" }, { t: "LEBIH" }, { t: "TUA", accent: true }],
    [{ t: "DARI" }, { t: "POHON" }],
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
            const p = spring({
              frame: frame - (start + i * 3),
              fps: FPS_HIU,
              config: { damping: 12, stiffness: 200, mass: 0.5 },
            });
            return (
              <div
                key={w.t}
                style={{
                  opacity: Math.min(1, Math.max(0, p)),
                  transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${0.9 + 0.1 * p})`,
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
  const e = enter(frame, start, 14);
  const opacity = interpolate(frame, [start, start + 14, end - 14, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < start || frame > end) return null;
  return (
    <div
      style={{
        // POSISI TETAP (perbaikan 2026-11-24, ronde 2): pil muncul di tempat
        // — opacity saja, TANPA geser naik (glide 18px dihapus atas perintah
        // user "munculnya awal disitu tetap disitu aja").
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
  hiu: { src: "assets/icon-shark-blue.png", w: 56, h: 28 },
  petir: { src: "assets/icon-lightning-orange.png", w: 30, h: 56 },
  jam: { src: "assets/icon-hourglass-teal.png", w: 39, h: 56 },
};

const IconCircle = ({
  kind,
  color,
  start,
}: {
  kind: "hiu" | "petir" | "jam";
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
    <IconCircle kind="hiu" color={BLUE} start={start} />
    <IconCircle kind="petir" color={ORANGE} start={start + 6} />
    <IconCircle kind="jam" color={TEAL} start={start + 12} />
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
// GLOW BERNAPAS (ai.agentz, riset 2026-11-24): halo radial di belakang
// ikon hero — berdenyut periode ~2 dtk (opacity + scale sine), warna ikut
// aksen adegan. Ikon TIDAK berpindah — hanya cahayanya yang hidup.
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
  const breathe = 0.5 + 0.5 * Math.sin((frame / FPS_HIU) * Math.PI);
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

// ORBIT (ai.agentz): cincin titik-titik + 4 sparkle pastel berkelip di
// sekeliling hero. Dipakai di F1 mengelilingi hiu.
const Orbit = ({ cx, cy, size }: { cx: number; cy: number; size: number }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS_HIU;
  const r = size / 2 - 12;
  const sparks = [
    { angle: 45, color: "#F9A8D4", phase: 0 },
    { angle: 135, color: "#FDE68A", phase: 1.1 },
    { angle: 225, color: "#93C5FD", phase: 2.2 },
    { angle: 315, color: "#86EFAC", phase: 3.1 },
  ];
  const star = (x: number, y: number, s: number, color: string, op: number) => (
    <path
      d={`M ${x} ${y - s} Q ${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q ${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q ${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q ${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z`}
      fill={color}
      opacity={op}
    />
  );
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2, overflow: "visible", pointerEvents: "none" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#CBD5E1"
        strokeWidth={3}
        strokeDasharray="0.1 12"
        strokeLinecap="round"
      />
      {sparks.map((sp) => {
        const rad = (sp.angle * Math.PI) / 180;
        const x = size / 2 + r * Math.cos(rad);
        const y = size / 2 + r * Math.sin(rad);
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((t * 2 * Math.PI) / 1.5 + sp.phase));
        return <g key={sp.angle}>{star(x, y, 9, sp.color, tw)}</g>;
      })}
    </svg>
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
    // Garis waktu: hiu (450 jt thn) -> pohon (385 jt thn) -> dinosaurus.
    // SINKRON KATA (user: jangan muncul bareng, sesuai ucapan): batas antar
    // kalimat DIUKUR dari f1.wav (silencedetect); kata di dalam kalimat
    // diperkirakan proporsional. Hiu muncul pas "Hiu" (1,75 dtk = frame 42),
    // pohon pas "pohon" pertama (3,0 dtk = frame 72). Titik garis waktu:
    // 450 JT pas "450" (6,1 dtk = 146), 385 JT pas "pohon" kedua
    // (8,07 dtk = 194), DINO pas "Dinosaurus" (11,4 dtk = 274).
    // Pohon "berdenyut" membesar sedikit pas "pohon" kedua disebut.
    const bob = Math.sin((frame / FPS_HIU) * ((2 * Math.PI) / 3)) * 5;
    const drift = Math.sin((frame / FPS_HIU) * ((2 * Math.PI) / 6)) * 8;
    const sway = Math.sin((frame / FPS_HIU) * ((2 * Math.PI) / 4)) * 1;
    const sharkE = enter(frame, 42, 16);
    const treeE = enter(frame, 72, 16);
    const treePulse = interpolate(frame, [194, 202, 218], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const dots = [
      { x: 40, label: "450 JT", color: ORANGE, start: 146 },
      { x: 200, label: "385 JT", color: GREEN, start: 194 },
      { x: 320, label: "DINO", color: ROSE, start: 274 },
    ];
    return (
      <div style={wrap}>
        <Glow color={ORANGE} cx={100} cy={86} size={280} />
        <Orbit cx={100} cy={86} size={180} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 30,
            width: 200,
            height: 112,
            opacity: sharkE,
            transform: `translateY(${(1 - sharkE) * 20}px)`,
          }}
        >
          <Img
            src={staticFile("assets/diagram-shark.png")}
            style={{ width: 200, height: 112, transform: `translate(${drift}px, ${bob}px)` }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 235,
            top: 40,
            width: 120,
            height: 156,
            opacity: treeE,
            transform: `translateY(${(1 - treeE) * 20}px)`,
          }}
        >
          <Img
            src={staticFile("assets/diagram-tree.png")}
            style={{
              width: 120,
              height: 156,
              transform: `rotate(${sway + treePulse * 2}deg) scale(${1 + treePulse * 0.08})`,
            }}
          />
        </div>
        {/* DRAW-ON (emblemo, riset Threads; @remotion/paths skill 8 dari
            video 11-skill 2026-11-24): garis waktu DIGAMBAR dari kiri ke
            kanan mengikuti narasi — selesai pas titik DINO muncul (274).
            evolvePath menghitung panjang garisnya sendiri. */}
        {(() => {
          const p = evolvePath(
            interpolate(frame, [42, 274], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            "M 0 2 L 320 2",
          );
          return (
            <svg
              width="320"
              height="4"
              viewBox="0 0 320 4"
              style={{ position: "absolute", left: 20, top: 292, overflow: "visible" }}
            >
              <path
                d="M 0 2 L 320 2"
                fill="none"
                stroke="rgba(15,23,42,0.25)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={p.strokeDasharray}
                strokeDashoffset={p.strokeDashoffset}
              />
            </svg>
          );
        })()}
        {dots.map((d) => {
          const de = enter(frame, d.start, 12);
          return (
            <div key={d.label}>
              <div
                style={{
                  position: "absolute",
                  left: d.x - 7,
                  top: 286,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: d.color,
                  opacity: de,
                  transform: `scale(${0.5 + de * 0.5})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: Math.max(0, d.x - 45),
                  top: 308,
                  width: 90,
                  textAlign: "center",
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 22,
                  color: d.color,
                  opacity: de,
                }}
              >
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === "f2") {
    // Kepala hiu close-up (sway pelan) + gelombang listrik berdenyut dari
    // moncong + ikan kecil bersembunyi di pasir (gundukan pasir di bawahnya).
    const sway = Math.sin((frame / FPS_HIU) * ((2 * Math.PI) / 4)) * 1;
    const headE = enter(frame, 20, 16);
    const fishE = enter(frame, 90, 14);
    // Gelombang listrik: POLISH v2 — cincin yang MEMANCAR dari moncong
    // (bukan busur statis berdenyut): tiap cincin membesar 45->115px selama
    // 36 frame sambil memudar 0,9->0, 3 cincin berjarak 12 frame, berulang.
    // Titik moncong ≈ (351, 115); SVG diperlebar (560, viewBox 0 0 560 360)
    // supaya busur utuh (pelajaran v2/v3).
    const CYCLE = 36;
    const rings = [0, 1, 2].map((i) => {
      const phase = (frame + i * 12) % CYCLE;
      const t = phase / CYCLE;
      // DRAW-ON: tiap cincin MENGGAMBAR dirinya sendiri — busur tergambar
      // dari moncong selama 45% pertama hidupnya, baru lalu memudar.
      return { r: 45 + 70 * t, opacity: 0.9 * (1 - t), draw: Math.min(t / 0.45, 1) };
    });
    return (
      <div style={wrap}>
        <Glow color={BLUE} cx={180} cy={134} size={340} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 20,
            width: 360,
            height: 228,
            opacity: headE,
            transform: `translateY(${(1 - headE) * 20}px) rotate(${sway}deg)`,
          }}
        >
          <Img
            src={staticFile("assets/diagram-shark-head.png")}
            style={{ width: 360, height: 228, objectFit: "contain" }}
          />
        </div>
        <svg
          width="560"
          height="360"
          viewBox="0 0 560 360"
          style={{ position: "absolute", left: -100, top: 0, pointerEvents: "none" }}
        >
          {rings.map((w, i) => {
            const d = `M 351 ${115 - w.r} A ${w.r} ${w.r} 0 0 1 351 ${115 + w.r}`;
            // @remotion/paths (skill 8): evolvePath menghitung panjang busur.
            const p = evolvePath(w.draw, d);
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={BLUE}
                strokeWidth={6}
                strokeLinecap="round"
                opacity={w.opacity}
                strokeDasharray={p.strokeDasharray}
                strokeDashoffset={p.strokeDashoffset}
              />
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 330,
            width: 130,
            height: 26,
            background: "#E8C88A",
            borderRadius: "50%",
            opacity: fishE * 0.9,
          }}
        />
        <Img
          src={staticFile("assets/diagram-fish.png")}
          style={{
            position: "absolute",
            left: 20,
            top: 285,
            width: 90,
            height: 61,
            opacity: fishE,
            transform: `translateY(${(1 - fishE) * 16}px)`,
          }}
        />
      </div>
    );
  }

  // f3: hiu Greenland (drift + bob pelan) + jam pasir (zoom 1 -> 1,03) +
  // garis waktu 1624 -> 2024.
  const drift = Math.sin((frame / FPS_HIU) * ((2 * Math.PI) / 4)) * 6;
  const bob3 = Math.sin((frame / FPS_HIU) * ((2 * Math.PI) / 3)) * 4;
  const zoom = 1 + (0.03 * Math.min(frame, voFrames)) / voFrames;
  const dotE1 = enter(frame, 60, 12);
  const dotE2 = enter(frame, 80, 12);
  return (
    <div style={{ ...wrap, transform: `translateY(${(1 - e) * 20}px) scale(${zoom})` }}>
      <Glow color={TEAL} cx={86} cy={257} size={240} />
      <Img
        src={staticFile("assets/diagram-greenland.png")}
        style={{
          position: "absolute",
          left: 0,
          top: 30,
          width: 360,
          height: 125,
          transform: `translate(${drift}px, ${bob3}px)`,
        }}
      />
      <Img
        src={staticFile("assets/diagram-hourglass.png")}
        style={{ position: "absolute", left: 36, top: 170, width: 100, height: 175 }}
      />
      {/* DRAW-ON (@remotion/paths, skill 8): garis digambar 20 -> 80,
          selesai pas titik 2024 muncul. */}
      {(() => {
        const p = evolvePath(
          interpolate(frame, [20, 80], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          "M 0 2 L 180 2",
        );
        return (
          <svg
            width="180"
            height="4"
            viewBox="0 0 180 4"
            style={{ position: "absolute", left: 170, top: 270, overflow: "visible" }}
          >
            <path
              d="M 0 2 L 180 2"
              fill="none"
              stroke="rgba(15,23,42,0.25)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={p.strokeDasharray}
              strokeDashoffset={p.strokeDashoffset}
            />
          </svg>
        );
      })()}
      <div
        style={{
          position: "absolute",
          left: 173,
          top: 264,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: TEAL,
          opacity: dotE1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 336,
          top: 264,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: ORANGE,
          opacity: dotE2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 286,
          width: 120,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 20,
          color: TEAL,
          opacity: dotE1,
          whiteSpace: "nowrap",
        }}
      >
        LAHIR 1624
      </div>
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 286,
          width: 90,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 20,
          color: ORANGE,
          opacity: dotE2,
        }}
      >
        2024
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Adegan.
// ---------------------------------------------------------------------------
const Scene = ({ id }: { id: string }) => {
  const frame = useCurrentFrame();
  const voFrames = SCENE_TIMING_HIU[id].voFrames;
  // POLISH v2 — transisi antar-adegan: dissolve lewat dunia putih (bukan
  // potongan keras). Adegan masuk 10 frame pertama, keluar 8 frame terakhir.
  const sceneFrames = SCENE_TIMING_HIU[id].frames;
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
  // KINETIC V2 — scale-through: adegan masuk membesar 1.06 -> 1, keluar
  // membesar lagi 1 -> 1.05 (hand-rolled, bukan TransitionSeries — VO
  // tetap sinkron karena tidak ada frame yang ditelan).
  const scaleThrough =
    interpolate(frame, [0, 14], [1.06, 1], {
      easing: EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [sceneFrames - 10, sceneFrames], [1, 1.05], {
      easing: EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  if (id === "hook") {
    const subE = enter(frame, 6, 14);
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 196, opacity: fade, transform: `scale(${scaleThrough})` }}>
        <Audio src={staticFile("audio/hiu-seno/hook.wav")} />
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
          <BottomPill text="FAKTA HIU" start={44} />
        </div>
      </AbsoluteFill>
    );
  }

  if (id === "tanya") {
    const qE = enter(frame, 8, 16);
    const sharkE = enter(frame, 26, 14);
    const ctaE = enter(frame, 44, 14);
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 210, opacity: fade, transform: `scale(${scaleThrough})` }}>
        <Audio src={staticFile("audio/hiu-seno/tanya.wav")} />
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
        <div style={{ marginTop: 36, opacity: sharkE, transform: `translateY(${(1 - sharkE) * 16}px)` }}>
          <Img src={staticFile("assets/diagram-shark.png")} style={{ width: 190, height: 107 }} />
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
            TULIS 'HIU' DI KOMENTAR
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 200, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <IconRow start={22} />
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA HIU" start={34} />
        </div>
      </AbsoluteFill>
    );
  }

  const stepColor = id === "f1" ? ORANGE : id === "f2" ? BLUE : TEAL;
  const headline: Array<{ t: string; accent?: boolean }> =
    id === "f1"
      ? [{ t: "450", accent: true }, { t: "JUTA" }, { t: "TAHUN" }]
      : id === "f2"
        ? [{ t: "5", accent: true }, { t: "NANOVOLT" }]
        : [{ t: "400", accent: true }, { t: "TAHUN" }];
  const accent = id === "f1" ? ORANGE : id === "f2" ? BLUE : TEAL;
  // Pil kontinyu: pil 2 mulai 10 frame SEBELUM pil 1 selesai (crossfade).
  const pills: Record<string, Array<{ text: string; color: string; s: number; e: number }>> = {
    f1: [
      { text: "LEBIH TUA DARI POHON", color: BLUE, s: 70, e: 200 },
      { text: "SEBELUM DINOSAURUS", color: ROSE, s: 190, e: 320 },
    ],
    f2: [
      { text: "LIMA PER MILIAR VOLT", color: ORANGE, s: 100, e: 190 },
      { text: "NEMU MANGSA DI PASIR", color: TEAL, s: 180, e: 280 },
    ],
    f3: [
      { text: "PALING PANJANG UMUR", color: ORANGE, s: 60, e: 200 },
      { text: "DEWASA UMUR 150 TAHUN", color: BLUE, s: 190, e: 335 },
    ],
  };
  const chipLabel = id === "f1" ? "FAKTA 1" : id === "f2" ? "FAKTA 2" : "FAKTA 3";
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 246, opacity: fade, transform: `scale(${scaleThrough})` }}>
      <Audio src={staticFile(`audio/hiu-seno/${id}.wav`)} />
      <StepPill label={chipLabel} color={stepColor} />
      <HeadlineWords words={headline} start={8} accent={accent} />
      <div style={{ marginTop: 36 }}>
        <Diagram id={id} voFrames={voFrames} />
      </div>
      {/* Slot pil tetap: tinggi satu pil, anak-anaknya absolut — tidak ada
          yang bergeser saat pil berganti. */}
      <div style={{ position: "relative", marginTop: 28, width: "100%", height: 76 }}>
        {pills[id].map((p, i) => (
          <SolidPill key={i} text={p.text} color={p.color} start={p.s} end={p.e} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// SFX: pop saat headline tiap fakta muncul (global = start adegan + 8),
// ding pelan saat kartu penutup. Volume + playbackRate seperti v6.
const SfxLayer = () => (
  <>
    <Sequence from={142} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.22} playbackRate={0.97} />
    </Sequence>
    <Sequence from={482} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.25} playbackRate={1} />
    </Sequence>
    <Sequence from={790} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.28} playbackRate={1.03} />
    </Sequence>
    <Sequence from={1330} durationInFrames={40}>
      <Audio src={staticFile("sfx/ding.mp3")} volume={0.3} />
    </Sequence>
  </>
);

const FaktaHiuScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TOTAL_FRAMES_HIU], [1, 1.02], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <World />
        {SCENE_ORDER_HIU.map((id) => (
          <Sequence
            key={id}
            from={SCENE_START_HIU[id]}
            durationInFrames={SCENE_TIMING_HIU[id].frames}
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

export const FaktaHiuV2: React.FC = () => {
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
        id="FaktaHiuV2"
        component={FaktaHiuScene}
        durationInFrames={TOTAL_FRAMES_HIU}
        fps={FPS_HIU}
        width={720}
        height={1280}
      />
    </>
  );
};
