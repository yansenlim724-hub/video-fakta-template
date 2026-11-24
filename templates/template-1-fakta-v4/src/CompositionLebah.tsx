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
import {
  FPS_LEBAH,
  SCENE_ORDER_LEBAH,
  SCENE_START_LEBAH,
  SCENE_TIMING_LEBAH,
  TOTAL_FRAMES_LEBAH,
} from "./timing-lebah";

// Video fakta #2 — "3 Fakta Gila tentang Lebah".
// Sistem visual sama seperti FaktaBulan v6 (kanvas putih ber-grid, judul
// hitam tebal, pil warna-warni, aset Flow transparan, ease-out, progress bar,
// SFX pelan + variasi, tanpa music bed, loudnorm -14 LUFS pasca-render).
// Yang baru / lebih padat: F1 lebah TERBANG mengikuti lintasan figure-eight
// (lemniscate) selama adegan + matahari & bunga masuk staggered; F2 12 lebah
// kecil bergoyang terus + sendok sway; F3 zoom pelan; tanya pakai maskot lebah.
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
  >
    <div
      style={{
        position: "absolute",
        top: 62,
        left: 56,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: 0.5,
        color: INK,
      }}
    >
      Lamaku
    </div>
  </AbsoluteFill>
);

const ProgressBar = () => {
  const frame = useCurrentFrame();
  const p = frame / TOTAL_FRAMES_LEBAH;
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

const Headline = ({ text, start }: { text: string; start: number }) => {
  const frame = useCurrentFrame();
  const e = enter(frame, start, 16);
  return (
    <div
      style={{
        transform: `translateY(${(1 - e) * 20}px)`,
        opacity: e,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 64,
          lineHeight: 1.08,
          color: INK,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const HookTitle = ({ start }: { start: number }) => {
  const frame = useCurrentFrame();
  const e = enter(frame, start, 16);
  return (
    <div
      style={{
        transform: `translateY(${(1 - e) * 20}px)`,
        opacity: e,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 84,
          lineHeight: 1.05,
          color: INK,
          textAlign: "center",
        }}
      >
        LEBAH PUNYA
        <br />
        BAHASA TARI
      </div>
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
  const opacity = interpolate(frame, [start, start + 10, end - 10, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < start || frame > end) return null;
  return (
    <div
      style={{
        // POSISI TETAP (perbaikan 2026-11-24): pil diposisikan absolut di
        // SATU slot yang sama — pil 2 muncul tepat di tempat pil 1, tidak
        // lagi melompat naik saat pil 1 hilang dari flow.
        position: "absolute",
        left: "50%",
        top: 0,
        background: color,
        borderRadius: 999,
        padding: "12px 32px",
        transform: `translate(-50%, ${(1 - e) * 18}px)`,
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
  tari: { src: "assets/icon-dance-blue.png", w: 56, h: 56 },
  sendok: { src: "assets/icon-spoon-orange.png", w: 40, h: 56 },
  stoples: { src: "assets/icon-jar-teal.png", w: 56, h: 51 },
};

const IconCircle = ({
  kind,
  color,
  start,
}: {
  kind: "tari" | "sendok" | "stoples";
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
    <IconCircle kind="tari" color={BLUE} start={start} />
    <IconCircle kind="sendok" color={ORANGE} start={start + 6} />
    <IconCircle kind="stoples" color={TEAL} start={start + 12} />
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
// Lemniscate Bernoulli = figure-eight persis: x = a*cos(t)/(1+sin^2 t),
// y = a*sin(t)*cos(t)/(1+sin^2 t). Satu putaran penuh = t 0..2pi.
const lemniscate = (t: number, a: number, cx: number, cy: number) => {
  const s = Math.sin(t);
  const c = Math.cos(t);
  const d = 1 + s * s;
  return { x: cx + (a * c) / d, y: cy + (a * s * c) / d };
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
    // Lebah TERBANG mengikuti lintasan figure-eight (2 putaran selama adegan)
    // + matahari kanan atas + bunga kiri bawah, masuk staggered.
    const pathE = enter(frame, 36, 14);
    const sunE = enter(frame, 50, 14);
    const flowerE = enter(frame, 80, 14);
    const beeE = enter(frame, 30, 14);
    const loops = interpolate(frame, [40, voFrames - 10], [0, 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const bp = lemniscate(loops * Math.PI * 2, 140, 180, 185);
    const pathPoints = Array.from({ length: 101 }, (_, i) => {
      const p = lemniscate((i / 100) * Math.PI * 2, 140, 180, 185);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");
    return (
      <div style={wrap}>
        <Img
          src={staticFile("assets/diagram-sun.png")}
          style={{
            position: "absolute",
            left: 248,
            top: -6,
            width: 110,
            height: 110,
            opacity: sunE,
            transform: `translateY(${(1 - sunE) * 16}px)`,
          }}
        />
        <Img
          src={staticFile("assets/diagram-flower.png")}
          style={{
            position: "absolute",
            left: 8,
            top: 262,
            width: 92,
            height: 90,
            opacity: flowerE,
            transform: `translateY(${(1 - flowerE) * 16}px)`,
          }}
        />
        <svg
          width="360"
          height="360"
          viewBox="0 0 360 360"
          style={{ position: "absolute", inset: 0, opacity: pathE }}
        >
          <polyline
            points={pathPoints}
            fill="none"
            stroke={BLUE}
            strokeWidth={4}
            strokeDasharray="2 12"
            strokeLinecap="round"
          />
        </svg>
        <Img
          src={staticFile("assets/diagram-bee.png")}
          style={{
            position: "absolute",
            left: bp.x - 48,
            top: bp.y - 43,
            width: 96,
            height: 86,
            opacity: beeE,
          }}
        />
      </div>
    );
  }

  if (id === "f2") {
    // Sendok madu besar (sway pelan) + 12 lebah kecil (2 baris x 6) yang
    // bergoyang terus dengan fase beda-beda supaya adegan hidup.
    const spoonE = enter(frame, 20, 16);
    const sway = Math.sin((frame / FPS_LEBAH) * ((2 * Math.PI) / 4)) * 1;
    const bees = Array.from({ length: 12 }, (_, i) => {
      const row = Math.floor(i / 6);
      const col = i % 6;
      const bob = Math.sin((frame / FPS_LEBAH) * (2 * Math.PI * 0.8) + i * 0.55) * 4;
      const bE = enter(frame, 40 + i * 4, 12);
      return (
        <Img
          key={i}
          src={staticFile("assets/diagram-bee.png")}
          style={{
            position: "absolute",
            left: 5 + col * 60,
            top: 258 + row * 52 + bob,
            width: 50,
            height: 45,
            opacity: bE,
          }}
        />
      );
    });
    return (
      <div style={wrap}>
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 0,
            width: 340,
            height: 243,
            opacity: spoonE,
            transform: `translateY(${(1 - spoonE) * 20}px) rotate(${sway}deg)`,
          }}
        >
          <Img
            src={staticFile("assets/diagram-spoon.png")}
            style={{ width: 340, height: 243, objectFit: "contain" }}
          />
        </div>
        {bees}
      </div>
    );
  }

  // f3: stoples madu (dipper sudah di-crop) + piramida, zoom pelan 1 -> 1,03.
  const zoom = 1 + (0.03 * Math.min(frame, voFrames)) / voFrames;
  return (
    <div style={{ ...wrap, transform: `translateY(${(1 - e) * 20}px) scale(${zoom})` }}>
      <Img
        src={staticFile("assets/diagram-jar.png")}
        style={{ position: "absolute", left: 5, top: 55, width: 170, height: 243 }}
      />
      <Img
        src={staticFile("assets/diagram-pyramid.png")}
        style={{ position: "absolute", left: 178, top: 195, width: 190, height: 154 }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Adegan.
// ---------------------------------------------------------------------------
const Scene = ({ id }: { id: string }) => {
  const frame = useCurrentFrame();
  const voFrames = SCENE_TIMING_LEBAH[id].voFrames;

  if (id === "hook") {
    const subE = enter(frame, 6, 14);
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 196 }}>
        <Audio src={staticFile("audio/lebah-seno/hook.wav")} />
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
          <HookTitle start={14} />
        </div>
        <div style={{ marginTop: 44 }}>
          <IconRow start={30} />
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA LEBAH" start={44} />
        </div>
      </AbsoluteFill>
    );
  }

  if (id === "tanya") {
    const qE = enter(frame, 8, 16);
    const beeE = enter(frame, 26, 14);
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 210 }}>
        <Audio src={staticFile("audio/lebah-seno/tanya.wav")} />
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
        <div style={{ marginTop: 44, opacity: beeE, transform: `translateY(${(1 - beeE) * 16}px)` }}>
          <Img src={staticFile("assets/diagram-bee.png")} style={{ width: 150, height: 134 }} />
        </div>
        <div style={{ position: "absolute", bottom: 220, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <IconRow start={22} />
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA LEBAH" start={34} />
        </div>
      </AbsoluteFill>
    );
  }

  const stepColor = id === "f1" ? ORANGE : id === "f2" ? BLUE : TEAL;
  const headline = id === "f1" ? "1 DETIK = 1 KM" : id === "f2" ? "1 SENDOK = 12 LEBAH" : "3.000 TAHUN";
  const pills: Record<string, Array<{ text: string; color: string; s: number; e: number }>> = {
    f1: [
      { text: "SUDUT = ARAH MATAHARI", color: BLUE, s: 70, e: 250 },
      { text: "NOBEL 1973", color: ROSE, s: 250, e: 405 },
    ],
    f2: [
      { text: "SEUMUR HIDUP", color: ORANGE, s: 110, e: 195 },
      { text: "DARI LAHIR SAMPAI MATI", color: TEAL, s: 205, e: 285 },
    ],
    f3: [
      { text: "MADU NGGAK PERNAH BASI", color: ORANGE, s: 25, e: 170 },
      { text: "AIR CUMA 14–18%", color: BLUE, s: 170, e: 325 },
    ],
  };
  const chipLabel = id === "f1" ? "FAKTA 1" : id === "f2" ? "FAKTA 2" : "FAKTA 3";
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 246 }}>
      <Audio src={staticFile(`audio/lebah-seno/${id}.wav`)} />
      <StepPill label={chipLabel} color={stepColor} />
      <Headline text={headline} start={8} />
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
    <Sequence from={143} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.22} playbackRate={0.97} />
    </Sequence>
    <Sequence from={567} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.25} playbackRate={1} />
    </Sequence>
    <Sequence from={871} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.28} playbackRate={1.03} />
    </Sequence>
    <Sequence from={1218} durationInFrames={40}>
      <Audio src={staticFile("sfx/ding.mp3")} volume={0.3} />
    </Sequence>
  </>
);

const FaktaLebahScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TOTAL_FRAMES_LEBAH], [1, 1.02], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <World />
        {SCENE_ORDER_LEBAH.map((id) => (
          <Sequence
            key={id}
            from={SCENE_START_LEBAH[id]}
            durationInFrames={SCENE_TIMING_LEBAH[id].frames}
            name={id}
          >
            <Scene id={id} />
          </Sequence>
        ))}
      </div>
      <ProgressBar />
      <SfxLayer />
    </AbsoluteFill>
  );
};

export const FaktaLebah: React.FC = () => {
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
        id="FaktaLebah"
        component={FaktaLebahScene}
        durationInFrames={TOTAL_FRAMES_LEBAH}
        fps={FPS_LEBAH}
        width={720}
        height={1280}
      />
    </>
  );
};
