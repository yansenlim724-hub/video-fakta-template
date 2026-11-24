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
import { CAPTIONS_MADU, type CaptionWord } from "./captions-madu";
import {
  FPS_MADU,
  SCENE_ORDER_MADU,
  SCENE_START_MADU,
  SCENE_TIMING_MADU,
  TOTAL_FRAMES_MADU,
} from "./timing-madu";

// Video fakta Template 2 — "3 Fakta Gila tentang Madu" (2026-11-24).
// TEMPLATE 2 = gaya V4 Captions yang SAMA seperti Template 1, tapi semua
// aset adalah FOTO ASLI (bukan kartun/ilustrasi): foto stoples madu,
// sarang madu, lebah di bunga, ladang bunga, makro lebah, sendok madu,
// tangan menuang madu. TIDAK ADA maskot kartun.
// VO Gemini Charon, SATU BLOK satu request (1010 karakter, 55,81 dtk),
// dipotong split_vo.py (20 kalimat, durasi/kata konsisten 0,23-0,37).
// Angka di naskah dieja kata (aturan 33). SFX dihitung dari scene start
// SAAT INI (pelajaran 35).
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
  const p = frame / TOTAL_FRAMES_MADU;
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

// Strip 3 fakta persisten — Template 2: foto utama tiap fakta (lingkaran),
// aktif berwarna penuh, yang lain abu-abu redup. Bukan ikon kartun.
const FactStrip = () => {
  const frame = useCurrentFrame();
  const e =
    enter(frame, SCENE_START_MADU.f1, 12) *
    (1 - enter(frame, SCENE_START_MADU.tanya, 12));
  const active =
    frame < SCENE_START_MADU.f2 ? 0 : frame < SCENE_START_MADU.f3 ? 1 : 2;
  const photos = [
    "assets/foto-utama-f1.jpg",
    "assets/foto-utama-f2.jpg",
    "assets/foto-utama-f3.jpg",
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
      {photos.map((src, i) => (
        <Img
          key={src}
          src={staticFile(src)}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #FFFFFF",
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
    [{ t: "MADU" }],
    [{ t: "3000", accent: true }, { t: "TAHUN" }],
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
// Foto (Template 2): foto asli + label/panah di atasnya, bukan diagram kartun.
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
  const breathe = 0.5 + 0.5 * Math.sin((frame / FPS_MADU) * Math.PI);
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

// Foto hero tiap fakta: foto utama besar + foto detail kecil menumpuk di
// pojok + label chip di atas foto utama. Gerak pelan terus (zoom merayap).
const PHOTOS: Record<
  string,
  { main: string; detail: string; label: string; glow: string }
> = {
  f1: {
    main: "assets/foto-utama-f1.jpg",
    detail: "assets/foto-detail-f1.jpg",
    label: "SARANG MADU",
    glow: ORANGE,
  },
  f2: {
    main: "assets/foto-utama-f2.jpg",
    detail: "assets/foto-detail-f2.jpg",
    label: "LADANG BUNGA",
    glow: BLUE,
  },
  f3: {
    main: "assets/foto-utama-f3.jpg",
    detail: "assets/foto-detail-f3.jpg",
    label: "SATU SENDOK TEH",
    glow: TEAL,
  },
};

const PhotoHero = ({ id, voFrames }: { id: string; voFrames: number }) => {
  const frame = useCurrentFrame();
  const e = enter(frame, 20, 16);
  const p = PHOTOS[id];
  const drift = Math.sin((frame / FPS_MADU) * ((2 * Math.PI) / 4)) * 6;
  const bob = Math.sin((frame / FPS_MADU) * ((2 * Math.PI) / 3)) * 4;
  const zoom = 1 + (0.03 * Math.min(frame, voFrames)) / voFrames;
  const detailE = enter(frame, 44, 14);
  return (
    <div
      style={{
        width: 360,
        height: 360,
        position: "relative",
        transform: `translateY(${(1 - e) * 20}px)`,
        opacity: e,
      }}
    >
      <Glow color={p.glow} cx={180} cy={180} size={340} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 360,
          height: 360,
          borderRadius: 28,
          overflow: "hidden",
          transform: `scale(${zoom}) translate(${drift}px, ${bob}px)`,
        }}
      >
        <Img
          src={staticFile(p.main)}
          style={{ width: 360, height: 360, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            background: "rgba(15,23,42,0.88)",
            borderRadius: 999,
            padding: "8px 18px",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 2,
              color: "#FFFFFF",
            }}
          >
            {p.label}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: -14,
          bottom: -14,
          width: 150,
          height: 150,
          borderRadius: 20,
          overflow: "hidden",
          border: "4px solid #FFFFFF",
          transform: `rotate(2deg) translateY(${(1 - detailE) * 16}px)`,
          opacity: detailE,
        }}
      >
        <Img
          src={staticFile(p.detail)}
          style={{ width: 150, height: 150, objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

// Foto hero hook: stoples madu (foto utama F1), 300px.
const HookPhoto = ({ start }: { start: number }) => {
  const frame = useCurrentFrame();
  const e = enter(frame, start, 16);
  const zoom = 1 + 0.02 * e;
  return (
    <div
      style={{
        width: 300,
        height: 300,
        borderRadius: 28,
        overflow: "hidden",
        transform: `translateY(${(1 - e) * 20}px) scale(${zoom})`,
        opacity: e,
      }}
    >
      <Img
        src={staticFile("assets/foto-utama-f1.jpg")}
        style={{ width: 300, height: 300, objectFit: "cover" }}
      />
    </div>
  );
};

// Foto penutup: tangan menuang madu, 200px.
const ClosingPhoto = ({ start }: { start: number }) => {
  const frame = useCurrentFrame();
  const e = enter(frame, start, 16);
  return (
    <div
      style={{
        width: 200,
        height: 200,
        borderRadius: 24,
        overflow: "hidden",
        transform: `translateY(${(1 - e) * 16}px)`,
        opacity: e,
      }}
    >
      <Img
        src={staticFile("assets/foto-penutup.jpg")}
        style={{ width: 200, height: 200, objectFit: "cover" }}
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
  const pages = buildPages(CAPTIONS_MADU[id]);
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
  const voFrames = SCENE_TIMING_MADU[id].voFrames;
  const sceneFrames = SCENE_TIMING_MADU[id].frames;
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
        <Audio src={staticFile("audio/madu/hook.wav")} />
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
        <div style={{ marginTop: 36 }}>
          <HookPhoto start={30} />
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA MADU" start={44} />
        </div>
        <Captions id="hook" accent={ORANGE} top={940} />
      </AbsoluteFill>
    );
  }

  if (id === "tanya") {
    const qE = enter(frame, 8, 16);
    const ctaE = enter(frame, 44, 14);
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 210, opacity: fade }}>
        <Audio src={staticFile("audio/madu/tanya.wav")} />
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
        <div style={{ marginTop: 32 }}>
          <ClosingPhoto start={26} />
        </div>
        <div
          style={{
            marginTop: 32,
            background: TEAL,
            borderRadius: 999,
            padding: "12px 32px",
            transform: `translateY(${(1 - ctaE) * 16}px)`,
            opacity: ctaE,
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, letterSpacing: 1, color: "#FFFFFF", textAlign: "center" }}>
            TULIS 'MADU' DI KOMENTAR
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA MADU" start={34} />
        </div>
        <Captions id="tanya" accent={TEAL} top={800} />
      </AbsoluteFill>
    );
  }

  const stepColor = id === "f1" ? ORANGE : id === "f2" ? BLUE : TEAL;
  const headline: Array<{ t: string; accent?: boolean }> =
    id === "f1"
      ? [{ t: "3000", accent: true }, { t: "TAHUN" }]
      : id === "f2"
        ? [{ t: "2", accent: true }, { t: "JUTA BUNGA" }]
        : [{ t: "12", accent: true }, { t: "LEBAH" }];
  const accent = id === "f1" ? ORANGE : id === "f2" ? BLUE : TEAL;
  // Pil kontinyu (aturan 1): pil 2 mulai 10 frame SEBELUM pil 1 selesai;
  // pil terakhir jalan sampai ~16 frame sebelum adegan berakhir.
  // Jendela diukur dari span klausa build_captions (VO Gemini Charon):
  // f1: "tiga ribu tahun" klausa 3 (78-183), "masih utuh" klausa 4 (191-215)
  // f2: "dua juta bunga" klausa 3 (61-179), "dua kali keliling bumi" klausa 4 (187-271)
  // f3: "seperduabelas sendok teh" klausa 2 (22-122), "dua belas lebah" klausa 3 (130-205)
  const pills: Record<string, Array<{ text: string; color: string; s: number; e: number }>> = {
    f1: [
      { text: "TIGA RIBU TAHUN", color: BLUE, s: 70, e: 200 },
      { text: "MASIH UTUH", color: ROSE, s: 190, e: 450 },
    ],
    f2: [
      { text: "DUA JUTA BUNGA", color: BLUE, s: 55, e: 195 },
      { text: "DUA KALI KELILING BUMI", color: ORANGE, s: 185, e: 268 },
    ],
    f3: [
      { text: "SEPERDUABELAS SENDOK TEH", color: ORANGE, s: 20, e: 140 },
      { text: "DUA BELAS LEBAH", color: BLUE, s: 130, e: 321 },
    ],
  };
  const chipLabel = id === "f1" ? "FAKTA 1" : id === "f2" ? "FAKTA 2" : "FAKTA 3";
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 246, opacity: fade }}>
      <Audio src={staticFile(`audio/madu/${id}.wav`)} />
      <StepPill label={chipLabel} color={stepColor} />
      <HeadlineWords words={headline} start={8} accent={accent} />
      <div style={{ marginTop: 36 }}>
        <PhotoHero id={id} voFrames={voFrames} />
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
// ding pelan saat kartu penutup. Dihitung dari timing-madu SAAT INI:
// f1 101+8=109, f2 567+8=575, f3 851+8=859, tanya 1188+8=1196.
const SfxLayer = () => (
  <>
    <Sequence from={109} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.22} playbackRate={0.97} />
    </Sequence>
    <Sequence from={575} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.25} playbackRate={1} />
    </Sequence>
    <Sequence from={859} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.28} playbackRate={1.03} />
    </Sequence>
    <Sequence from={1196} durationInFrames={40}>
      <Audio src={staticFile("sfx/ding.mp3")} volume={0.3} />
    </Sequence>
  </>
);

const FaktaMaduScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TOTAL_FRAMES_MADU], [1, 1.02], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <World />
        {SCENE_ORDER_MADU.map((id) => (
          <Sequence
            key={id}
            from={SCENE_START_MADU[id]}
            durationInFrames={SCENE_TIMING_MADU[id].frames}
            name={id}
          >
            <Scene id={id} />
          </Sequence>
        ))}
        <FactStrip />
      </div>
      <ProgressBar />
      <SfxLayer />
    </AbsoluteFill>
  );
};

export const FaktaMadu: React.FC = () => {
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
        id="FaktaMadu"
        component={FaktaMaduScene}
        durationInFrames={TOTAL_FRAMES_MADU}
        fps={FPS_MADU}
        width={720}
        height={1280}
      />
    </>
  );
};
