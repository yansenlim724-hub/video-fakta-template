import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { FPS, SCENE_ORDER, SCENE_TIMING, TOTAL_FRAMES } from "./timing";

// ---------- palet (shorts-kit §6) ----------
const BG = "#05080B";
const CYAN = "#2FD8FF";
const RED = "#FF3B30";
const YELLOW = "#FFCC00";
const WHITE = "#FFFFFF";
const DIM = "rgba(255,255,255,0.32)";
const FONT = "'Liberation Sans', Arial, sans-serif";

// ---------- isi adegan ----------
type BigDef =
  | { kind: "number"; value: number; decimals: number; unit: string; sub: string }
  | { kind: "text"; text: string; sub: string };

type SceneContent = {
  id: string;
  audio: string;
  words: string[];
  chip?: string;
  big?: BigDef;
  punch?: number[];
};

const CONTENT: SceneContent[] = [
  {
    id: "hook",
    audio: "hook.wav",
    words:
      "Bulan itu kabur dari kita. Setiap tahun, sedikit demi sedikit.".split(" "),
  },
  {
    id: "f1",
    audio: "f1.wav",
    chip: "FAKTA 1",
    big: { kind: "number", value: 384400, decimals: 0, unit: "KM", sub: "JARAK BUMI – BULAN" },
    words:
      "Fakta satu. Jarak Bulan ke Bumi, 384.400 kilometer. Cahaya saja butuh 1,3 detik untuk sampai ke sana.".split(
        " ",
      ),
  },
  {
    id: "f2",
    audio: "f2.wav",
    chip: "FAKTA 2",
    big: { kind: "number", value: 3474, decimals: 0, unit: "KM", sub: "DIAMETER BULAN" },
    words:
      "Fakta dua. Diameter Bulan 3.474 kilometer. Seperempat Bumi. Dan ini bulan terbesar kelima di tata surya.".split(
        " ",
      ),
  },
  {
    id: "f3",
    audio: "f3.wav",
    chip: "FAKTA 3",
    big: { kind: "number", value: 3.8, decimals: 1, unit: "CM", sub: "MENJAUH PER TAHUN" },
    words:
      "Fakta tiga. Bulan menjauh 3,8 sentimeter setiap tahun. Secepat kukumu tumbuh.".split(
        " ",
      ),
  },
  {
    id: "f4",
    audio: "f4.wav",
    chip: "FAKTA 4",
    big: { kind: "number", value: 10, decimals: 0, unit: "KG", sub: "BERAT 60 KG DI BUMI" },
    words:
      "Fakta empat. Gravitasi Bulan seperenam Bumi. Beratmu 60 kilo di sini, cuma 10 kilo di sana.".split(
        " ",
      ),
  },
  {
    id: "f5",
    audio: "f5.wav",
    chip: "FAKTA 5",
    big: { kind: "text", text: "JUTAAN TAHUN", sub: "JEJAK KAKI APOLLO DI BULAN" },
    words:
      "Fakta lima. Jejak kaki astronaut di Bulan tidak akan hilang. Tidak ada angin. Tidak ada hujan. Bisa bertahan jutaan tahun.".split(
        " ",
      ),
  },
  {
    id: "payoff",
    audio: "payoff.wav",
    punch: [12, 13, 14, 15],
    words:
      "Dan ini yang paling gila. Karena Bulan terus menjauh, suatu hari nanti tidak akan ada lagi gerhana matahari total. Langit tidak akan pernah gelap total lagi.".split(
        " ",
      ),
  },
  {
    id: "share",
    audio: "share.wav",
    words: "Kirim video ini ke temanmu yang suka menatap langit malam.".split(" "),
  },
];

// ---------- acak deterministik ----------
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---------- latar: langit bintang (dunia kontinu, parallax) ----------
const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: rand(i, 1) * 720,
  y: rand(i, 2) * 1280,
  size: 1 + rand(i, 3) * 2.2,
  base: 0.35 + rand(i, 4) * 0.65,
  near: i % 3 === 0,
  phase: rand(i, 5) * Math.PI * 2,
}));

const Starfield: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <AbsoluteFill>
      {STARS.map((s, i) => {
        const speed = s.near ? 0.32 : 0.12;
        const y = (((s.y + frame * speed) % 1280) + 1280) % 1280;
        const tw = 0.65 + 0.35 * Math.sin(frame / 16 + s.phase);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: y,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#FFFFFF",
              opacity: s.base * tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- bulan (hanyut pelan sepanjang video) ----------
const Moon: React.FC<{ frame: number }> = ({ frame }) => {
  const x = interpolate(frame, [0, TOTAL_FRAMES], [510, 450], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, TOTAL_FRAMES], [60, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 230,
        height: 230,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 38% 35%, #FAF8F2 0%, #E8E6DF 45%, #B9B7AF 78%, #8F8D86 100%)",
        boxShadow: "0 0 90px 18px rgba(220,225,235,0.22)",
      }}
    />
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)",
    }}
  />
);

// ---------- caption kinetik kata per kata ----------
const Caption: React.FC<{
  words: string[];
  frame: number;
  voFrames: number;
  punch?: number[];
}> = ({ words, frame, voFrames, punch = [] }) => {
  const per = voFrames / words.length;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 20px",
        padding: "0 56px",
      }}
    >
      {words.map((w, i) => {
        const start = i * per;
        const end = (i + 1) * per;
        const isCurrent = frame >= start && frame < end;
        const spoken = frame >= end;
        const isPunch = punch.includes(i);
        const color = isPunch
          ? spoken || isCurrent
            ? RED
            : DIM
          : isCurrent
            ? CYAN
            : spoken
              ? WHITE
              : DIM;
        const scale = isCurrent
          ? interpolate(frame, [start, start + 4], [1, 1.12], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })
          : 1;
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 52,
              lineHeight: 1.32,
              color,
              scale,
              textShadow:
                "0 3px 0 rgba(0,0,0,0.65), 0 0 22px rgba(0,0,0,0.5)",
              display: "inline-block",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ---------- angka besar (count-up + slam) ----------
const formatId = (v: number, decimals: number) => {
  if (decimals === 0) {
    return Math.round(v).toLocaleString("id-ID");
  }
  return v.toFixed(decimals).replace(".", ",");
};

const BigBlock: React.FC<{ big: BigDef; frame: number; fps: number }> = ({
  big,
  frame,
  fps,
}) => {
  const slam = spring({ frame: frame - 2, fps, config: { damping: 200 } });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 32,
          letterSpacing: 6,
          color: YELLOW,
          textAlign: "center",
          textShadow: "0 2px 0 rgba(0,0,0,0.7), 0 0 18px rgba(0,0,0,0.6)",
        }}
      >
        {big.sub}
      </div>
      {big.kind === "number" ? (
        <NumberCount
          frame={frame}
          slam={slam}
          value={big.value}
          decimals={big.decimals}
          unit={big.unit}
        />
      ) : (
        <div
          style={{
            scale: slam,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 84,
            color: CYAN,
            lineHeight: 1.05,
            textAlign: "center",
            textShadow: "0 4px 0 rgba(0,0,0,0.6)",
            marginTop: 14,
          }}
        >
          {big.text}
        </div>
      )}
    </div>
  );
};

const NumberCount: React.FC<{
  frame: number;
  slam: number;
  value: number;
  decimals: number;
  unit: string;
}> = ({ frame, slam, value, decimals, unit }) => {
  const progress = interpolate(frame, [4, 22], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        scale: slam,
        marginTop: 10,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 148,
          color: CYAN,
          lineHeight: 1,
          textShadow: "0 4px 0 rgba(0,0,0,0.6)",
        }}
      >
        {formatId(progress, decimals)}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 64,
          color: YELLOW,
        }}
      >
        {unit}
      </span>
    </div>
  );
};

// ---------- satu adegan ----------
const Scene: React.FC<{ def: SceneContent }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const meta = SCENE_TIMING[def.id];
  const fadeOutAt =
    def.id === "share" ? meta.voFrames + 2 : meta.frames - 10;
  const opacity = interpolate(
    frame,
    [0, 8, fadeOutAt, fadeOutAt + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const chipX = interpolate(frame, [0, 14], [-260, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <Audio src={staticFile(`audio/${def.audio}`)} />
      {def.chip ? (
        <div
          style={{
            position: "absolute",
            top: 168,
            left: 56,
            translate: `${chipX}px 0px`,
            border: `3px solid ${CYAN}`,
            borderRadius: 999,
            padding: "10px 22px",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: 5,
            color: CYAN,
            background: "rgba(5,8,11,0.55)",
          }}
        >
          {def.chip}
        </div>
      ) : null}
      {def.big ? (
        <div style={{ marginBottom: 64 }}>
          <BigBlock big={def.big} frame={frame} fps={fps} />
        </div>
      ) : null}
      <Caption
        words={def.words}
        frame={frame}
        voFrames={meta.voFrames}
        punch={def.punch}
      />
    </AbsoluteFill>
  );
};

// ---------- komposisi ----------
export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  let start = 0;
  const blocks = SCENE_ORDER.map((id) => {
    const def = CONTENT.find((c) => c.id === id)!;
    const from = start;
    start += SCENE_TIMING[id].frames;
    return { def, from };
  });
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Starfield frame={frame} />
      <Moon frame={frame} />
      <Vignette />
      {blocks.map(({ def, from }) => (
        <Sequence
          key={def.id}
          from={from}
          durationInFrames={SCENE_TIMING[def.id].frames}
          name={def.id}
        >
          <Scene def={def} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="FaktaBulan"
      component={MyComponent}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={720}
      height={1280}
    />
  );
};
