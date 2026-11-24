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
  FPS2B,
  SCENE_ORDER2B,
  SCENE_START2B,
  SCENE_TIMING2B,
  TOTAL_FRAMES2B,
} from "./timing-v2b";

// v5 — aset Flow (ikon + diagram) + motion lebih bagus.
// Gaya tetap plek-ketiplek referensi @ai.agentz: latar putih + grid,
// teks hitam tebal (Plus Jakarta Sans ExtraBold), pil berwarna solid,
// masuk staggered dengan ease-out, tanpa spring, adegan diam setelah menetap.
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
// Dunia: kanvas putih + grid, satu dan sama sepanjang video. Wordmark
// "Lamaku" kiri atas (seperti "rayden" di referensi).
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
        BULAN KABUR
        <br />
        DARI KITA
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
  const opacity = interpolate(frame, [start, start + 6, end - 6, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < start || frame > end) return null;
  return (
    <div
      style={{
        background: color,
        borderRadius: 999,
        padding: "12px 32px",
        transform: `translateY(${(1 - e) * 18}px)`,
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

// Ikon Flow (PNG transparan) di dalam lingkaran garis putus-putus.
const ICONS: Record<string, { src: string; w: number; h: number }> = {
  jarak: { src: "assets/icon-arrow-blue.png", w: 56, h: 56 },
  timbang: { src: "assets/icon-scale-orange.png", w: 56, h: 53 },
  jejak: { src: "assets/icon-footprint-teal.png", w: 30, h: 56 },
};

const IconCircle = ({
  kind,
  color,
  start,
}: {
  kind: "jarak" | "timbang" | "jejak";
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
    <IconCircle kind="jarak" color={BLUE} start={start} />
    <IconCircle kind="timbang" color={ORANGE} start={start + 6} />
    <IconCircle kind="jejak" color={TEAL} start={start + 12} />
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
// Diagram dari aset Flow. Motion: masuk staggered ease-out, lalu diam.
// ---------------------------------------------------------------------------
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
    // Bumi Flow (kiri bawah) + lintasan putus-putus + Bulan pucat +
    // titik kuning yang bergerak pelan sepanjang lintasan.
    const pathE = enter(frame, 36, 14);
    const moonE = enter(frame, 70, 12);
    const p = interpolate(frame, [60, voFrames - 20], [0.08, 0.92], {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <div style={wrap}>
        <Img
          src={staticFile("assets/diagram-earth.png")}
          style={{ position: "absolute", left: 8, top: 150, width: 210, height: 210 }}
        />
        <svg width="360" height="360" viewBox="0 0 360 360" style={{ position: "absolute", inset: 0, opacity: pathE }}>
          <path
            d="M 100 280 Q 180 160 288 92"
            fill="none"
            stroke={BLUE}
            strokeWidth={4}
            strokeDasharray="2 12"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 266,
            top: 62,
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#FEF3C7",
            border: "2px solid rgba(15,23,42,0.25)",
            opacity: moonE,
            transform: `scale(${0.7 + 0.3 * moonE})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 100 + (288 - 100) * p - 8,
            top: 280 + (92 - 280) * p - 8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#F59E0B",
            opacity: pathE,
          }}
        />
      </div>
    );
  }

  if (id === "f2") {
    // Timbangan Flow + label 60 (merah) dan 10 (hijau) di atas pancinya,
    // masuk satu per satu setelah timbangan menetap.
    const lab60 = enter(frame, 60, 12);
    const lab10 = enter(frame, 76, 12);
    const label = (text: string, bg: string, left: number, e: number) => (
      <div
        style={{
          position: "absolute",
          left,
          top: 197,
          transform: `translate(-50%, -50%) translateY(${(1 - e) * 12}px)`,
          opacity: e,
          background: bg,
          borderRadius: 999,
          padding: "6px 18px",
        }}
      >
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: "#FFFFFF" }}>{text}</div>
      </div>
    );
    return (
      <div style={wrap}>
        <Img
          src={staticFile("assets/diagram-scale.png")}
          style={{ position: "absolute", inset: 0, width: 360, height: 360 }}
        />
        {label("60", RED, 86, lab60)}
        {label("10", GREEN, 274, lab10)}
      </div>
    );
  }

  // f3: tiga jejak kaki Flow (susun vertikal seperti langkah berjalan).
  return (
    <div style={wrap}>
      <Img
        src={staticFile("assets/diagram-footprints.png")}
        style={{
          position: "absolute",
          left: 92,
          top: 0,
          width: 176,
          height: 340,
          objectFit: "contain",
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Adegan. VO + timing sama seperti v2/v3 (timing-v2b).
// ---------------------------------------------------------------------------
const Scene = ({ id }: { id: string }) => {
  const frame = useCurrentFrame();
  const voFrames = SCENE_TIMING2B[id].voFrames;

  if (id === "hook") {
    const subE = enter(frame, 6, 14);
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 196 }}>
        <Audio src={staticFile("audio/v2-seno/hook.wav")} />
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
          <BottomPill text="FAKTA BULAN" start={44} />
        </div>
      </AbsoluteFill>
    );
  }

  if (id === "tanya") {
    const qE = enter(frame, 8, 16);
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 210 }}>
        <Audio src={staticFile("audio/v2-seno/tanya.wav")} />
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
        <div style={{ position: "absolute", bottom: 220, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <IconRow start={22} />
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA BULAN" start={34} />
        </div>
      </AbsoluteFill>
    );
  }

  const stepColor = id === "f1" ? ORANGE : id === "f2" ? BLUE : TEAL;
  const headline = id === "f1" ? "3,8 CM PER TAHUN" : id === "f2" ? "60 KG → 10 KG" : "JUTAAN TAHUN";
  const pills: Record<string, Array<{ text: string; color: string; s: number; e: number }>> = {
    f1: [
      { text: "SECEPAT KUKU TUMBUH", color: BLUE, s: 123, e: 220 },
      { text: "GERHANA TOTAL AKAN HILANG", color: ROSE, s: 220, e: 316 },
    ],
    f2: [
      { text: "GRAVITASI 1/6 BUMI", color: ORANGE, s: 12, e: 107 },
      { text: "LOMPAT SEKALI, MELAYANG", color: TEAL, s: 179, e: 233 },
    ],
    f3: [
      { text: "JEJAK KAKI TAK HILANG", color: ORANGE, s: 11, e: 92 },
      { text: "TANPA ANGIN • TANPA HUJAN", color: BLUE, s: 92, e: 160 },
    ],
  };
  const chipLabel = id === "f1" ? "FAKTA 1" : id === "f2" ? "FAKTA 2" : "FAKTA 3";
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 246 }}>
      <Audio src={staticFile(`audio/v2-seno/${id}.wav`)} />
      <StepPill label={chipLabel} color={stepColor} />
      <Headline text={headline} start={8} />
      <div style={{ marginTop: 36 }}>
        <Diagram id={id} voFrames={voFrames} />
      </div>
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {pills[id].map((p, i) => (
          <SolidPill key={i} text={p.text} color={p.color} start={p.s} end={p.e} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// SFX: pop saat headline tiap fakta muncul, ding saat kartu penutup.
const SfxLayer = () => (
  <>
    <Sequence from={147} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
    </Sequence>
    <Sequence from={482} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
    </Sequence>
    <Sequence from={732} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
    </Sequence>
    <Sequence from={973} durationInFrames={40}>
      <Audio src={staticFile("sfx/ding.mp3")} volume={0.6} />
    </Sequence>
  </>
);

export const FaktaBulanV4: React.FC = () => {
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
        id="FaktaBulanV4"
        component={() => (
          <AbsoluteFill>
            <World />
            {SCENE_ORDER2B.map((id) => (
              <Sequence
                key={id}
                from={SCENE_START2B[id]}
                durationInFrames={SCENE_TIMING2B[id].frames}
                name={id}
              >
                <Scene id={id} />
              </Sequence>
            ))}
            <SfxLayer />
            <Audio src={staticFile("audio/music-bed.wav")} volume={1} />
          </AbsoluteFill>
        )}
        durationInFrames={TOTAL_FRAMES2B}
        fps={FPS2B}
        width={720}
        height={1280}
      />
    </>
  );
};
