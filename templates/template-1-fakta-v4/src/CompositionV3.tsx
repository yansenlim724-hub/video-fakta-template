import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
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

// v4 — plek-ketiplek gaya referensi @ai.agentz (TikTok):
// latar putih + grid abu-abu muda, teks hitam tebal (Plus Jakarta Sans
// ExtraBold), pil berwarna solid, masuk staggered dengan ease-out,
// tanpa spring, tanpa karakter, adegan diam setelah elemen menetap.
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
      {kind === "jarak" && (
        <svg width="52" height="52" viewBox="0 0 52 52">
          <path
            d="M 12 40 L 34 18 M 22 16 L 36 16 L 36 30"
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {kind === "timbang" && (
        <svg width="52" height="52" viewBox="0 0 52 52">
          <path
            d="M 26 8 L 26 40 M 10 16 L 42 16 M 10 16 L 6 30 M 10 16 L 14 30 M 42 16 L 38 30 M 42 16 L 46 30 M 14 44 L 38 44"
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {kind === "jejak" && (
        <svg width="52" height="52" viewBox="0 0 52 52">
          <ellipse cx="24" cy="32" rx="10" ry="13" fill={color} />
          <circle cx="14" cy="16" r="4" fill={color} />
          <circle cx="22" cy="12" r="4" fill={color} />
          <circle cx="30" cy="13" r="4" fill={color} />
          <circle cx="36" cy="18" r="4" fill={color} />
        </svg>
      )}
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
// Diagram datar per fakta (tanpa karakter, tanpa X-ray).
// ---------------------------------------------------------------------------
const Diagram = ({ id }: { id: string }) => {
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
    // Bumi + garis putus-putus + Bulan pucat di ujung lintasan.
    const p = interpolate(e, [0, 1], [0.08, 0.92]);
    return (
      <div style={wrap}>
        <svg width="360" height="360" viewBox="0 0 360 360" style={{ position: "absolute", inset: 0 }}>
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
            left: 62,
            top: 242,
            width: 76,
            height: 76,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #7DD3FC 0%, #2563EB 55%, #1E40AF 100%)",
          }}
        >
          <div style={{ position: "absolute", left: 14, top: 20, width: 26, height: 18, borderRadius: "50%", background: "#4ADE80" }} />
          <div style={{ position: "absolute", left: 40, top: 44, width: 20, height: 14, borderRadius: "50%", background: "#4ADE80" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 100 + (288 - 100) * p - 8,
            top: 280 + (92 - 280) * p - 8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#F59E0B",
          }}
        />
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
          }}
        />
      </div>
    );
  }
  if (id === "f2") {
    // Timbangan datar: tiang + batang hitam, 60 merah turun, 10 hijau naik.
    return (
      <div style={wrap}>
        <div style={{ position: "absolute", left: 175, top: 110, width: 10, height: 130, background: INK, borderRadius: 5 }} />
        <div
          style={{
            position: "absolute",
            left: 105,
            top: 108,
            width: 150,
            height: 10,
            background: INK,
            borderRadius: 5,
            transform: "rotate(9deg)",
            transformOrigin: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 88,
            top: 168,
            width: 78,
            height: 40,
            borderRadius: "50% 50% 0 0",
            background: RED,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            color: "#FFFFFF",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 28,
            paddingTop: 4,
          }}
        >
          60
        </div>
        <div
          style={{
            position: "absolute",
            left: 196,
            top: 138,
            width: 78,
            height: 40,
            borderRadius: "50% 50% 0 0",
            background: GREEN,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            color: "#FFFFFF",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 28,
            paddingTop: 4,
          }}
        >
          10
        </div>
        <div style={{ position: "absolute", left: 150, top: 240, width: 60, height: 12, background: INK, borderRadius: 6 }} />
      </div>
    );
  }
  // f3: tiga jejak kaki gelap.
  const prints = [
    { left: 82, top: 130, rot: -14 },
    { left: 152, top: 158, rot: 10 },
    { left: 222, top: 130, rot: -12 },
  ];
  return (
    <div style={wrap}>
      {prints.map((pr, i) => (
        <div
          key={i}
          style={{ position: "absolute", left: pr.left, top: pr.top, width: 56, height: 80, transform: `rotate(${pr.rot}deg)` }}
        >
          <div style={{ position: "absolute", left: 8, top: 26, width: 40, height: 52, borderRadius: "50%", background: "#334155" }} />
          {[0, 1, 2, 3].map((t) => (
            <div
              key={t}
              style={{
                position: "absolute",
                left: 5 + t * 13,
                top: 2 + (t % 2) * 8,
                width: 12,
                height: 17,
                borderRadius: "50%",
                background: "#334155",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Adegan. VO + timing sama seperti v2 (timing-v2b). Isi visual plek-ketiplek
// referensi: pil langkah berwarna, headline hitam besar, diagram datar,
// pil pendukung berwarna solid.
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
        <Diagram id={id} />
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

export const FaktaBulanV3: React.FC = () => {
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
        id="FaktaBulanV3"
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
