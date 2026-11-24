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

const FONT = "Fredoka, 'Liberation Sans', sans-serif";
const YELLOW = "#FFD93D";
const CYAN = "#4DD8FF";
const PINK = "#FF9EBB";
const WHITE = "#FFFFFF";
const CREAM = "#FFE9A8";

// ---------------------------------------------------------------------------
// Dunia: langit malam biru (adaptasi laut teal referensi), sinar bulan,
// bintang sparkle, bayangan lembut di bawah karakter. Satu dunia kontinu.
// ---------------------------------------------------------------------------
const Starfield = () => {
  const frame = useCurrentFrame();
  const stars = Array.from({ length: 46 }, (_, i) => {
    const x = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
    const y = ((Math.sin(i * 78.233) * 12543.1234) % 1 + 1) % 1;
    const size = 3 + (((Math.sin(i * 39.346) * 24634.6345) % 1 + 1) % 1) * 6;
    const speed = 0.02 + (((Math.sin(i * 11.135) * 7743.1) % 1 + 1) % 1) * 0.02;
    const layer = i % 2 === 0 ? 0.1 : 0.24;
    const tw = 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(frame * speed + i * 1.7));
    const top = (((y * 1280 + frame * layer) % 1280) + 1280) % 1280;
    const big = i % 6 === 0;
    return { x: x * 720, top, size, tw, big };
  });
  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.top,
            width: s.size,
            height: s.size,
            backgroundColor: "#FFFFFF",
            opacity: s.tw,
            transform: "rotate(45deg)",
            clipPath: s.big
              ? "polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%)"
              : undefined,
            borderRadius: s.big ? 0 : 2,
          }}
        />
      ))}
    </>
  );
};

const World = () => {
  const frame = useCurrentFrame();
  const rays = [110, 330, 540];
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #0A2A4A 0%, #082038 45%, #061A30 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 520,
          background:
            "radial-gradient(ellipse 420px 260px at 50% 0%, rgba(120,190,255,0.16), transparent 70%)",
        }}
      />
      {rays.map((left, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left,
            top: -240,
            width: 110,
            height: 1500,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.0))",
            transform: `rotate(18deg)`,
            opacity: 0.6 + 0.4 * Math.sin(frame * 0.02 + i * 2.1),
          }}
        />
      ))}
      <Starfield />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Karakter Bulan: wajah krem bulat, pipi pink, mata besar, senyum.
// Ekspresi: normal | sleepy | wide. Mode X-ray: wajah tembus pandang,
// isi dalam (per fakta) terlihat. Mengambang pelan, berkedip.
// ---------------------------------------------------------------------------
type Expr = "normal" | "sleepy" | "wide";

const xrayAt = (frame: number): number => {
  // Jendela X-ray per fakta (frame global), morph 12 frame tiap sisi.
  const windows: Array<[number, number]> = [
    [154, 459],
    [489, 709],
    [739, 950],
  ];
  for (const [a, b] of windows) {
    if (frame >= a - 12 && frame <= b + 12) {
      const inn = interpolate(frame, [a - 12, a], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const out = interpolate(frame, [b, b + 12], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return Math.min(inn, out);
    }
  }
  return 0;
};

const exprAt = (frame: number): Expr => {
  if (frame >= 653 && frame < 724) return "sleepy"; // f2: "melayang"
  if (frame >= 884 && frame < 965) return "wide"; // f3: "jutaan tahun"
  return "normal";
};

const sceneOf = (frame: number): string => {
  if (frame < 139) return "hook";
  if (frame < 474) return "f1";
  if (frame < 724) return "f2";
  if (frame < 965) return "f3";
  return "tanya";
};

const InnerVisual = ({ scene, xray }: { scene: string; xray: number }) => {
  if (xray <= 0.02) return null;
  if (scene === "f1") {
    // Bumi kecil + garis putus-putus + titik yang bergerak menjauh.
    const p = interpolate(xray, [0, 1], [0.1, 0.95]);
    return (
      <div style={{ position: "absolute", inset: 0, opacity: xray }}>
        <svg
          width="340"
          height="340"
          viewBox="0 0 340 340"
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d="M 95 265 Q 170 150 268 88"
            fill="none"
            stroke={CYAN}
            strokeWidth={4}
            strokeDasharray="2 12"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 62,
            top: 232,
            width: 76,
            height: 76,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #7DD3FC 0%, #2563EB 55%, #1E40AF 100%)",
            boxShadow: "0 0 24px rgba(59,130,246,0.7)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 14,
              top: 20,
              width: 26,
              height: 18,
              borderRadius: "50%",
              background: "#4ADE80",
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 44,
              width: 20,
              height: 14,
              borderRadius: "50%",
              background: "#4ADE80",
              opacity: 0.85,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 95 + (268 - 95) * p - 8,
            top: 265 + (88 - 265) * p - 8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: YELLOW,
            boxShadow: `0 0 16px ${YELLOW}`,
          }}
        />
      </div>
    );
  }
  if (scene === "f2") {
    // Timbangan: 60 kg turun, 10 kg naik (lebih ringan).
    return (
      <div style={{ position: "absolute", inset: 0, opacity: xray }}>
        <div
          style={{
            position: "absolute",
            left: 165,
            top: 120,
            width: 10,
            height: 110,
            background: "#E8D9B0",
            borderRadius: 5,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 95,
            top: 118,
            width: 150,
            height: 10,
            background: "#E8D9B0",
            borderRadius: 5,
            transform: "rotate(9deg)",
            transformOrigin: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 78,
            top: 168,
            width: 74,
            height: 34,
            borderRadius: "50% 50% 0 0",
            background: "#F87171",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            color: "#FFFFFF",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 26,
            paddingTop: 2,
          }}
        >
          60
        </div>
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 138,
            width: 74,
            height: 34,
            borderRadius: "50% 50% 0 0",
            background: "#4ADE80",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            color: "#06281A",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 26,
            paddingTop: 2,
          }}
        >
          10
        </div>
      </div>
    );
  }
  // f3: jejak kaki di permukaan.
  const prints = [
    { left: 72, top: 196, rot: -14 },
    { left: 138, top: 222, rot: 10 },
    { left: 204, top: 196, rot: -12 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: xray }}>
      {prints.map((pr, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pr.left,
            top: pr.top,
            width: 52,
            height: 74,
            transform: `rotate(${pr.rot}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 7,
              top: 24,
              width: 38,
              height: 48,
              borderRadius: "50%",
              background: "rgba(229,231,235,0.95)",
            }}
          />
          {[0, 1, 2, 3].map((t) => (
            <div
              key={t}
              style={{
                position: "absolute",
                left: 5 + t * 12,
                top: 2 + (t % 2) * 7,
                width: 11,
                height: 16,
                borderRadius: "50%",
                background: "rgba(229,231,235,0.95)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const MoonCharacter = () => {
  const frame = useCurrentFrame();
  const scene = sceneOf(frame);
  const xray = xrayAt(frame);
  const expr = exprAt(frame);

  const bob = Math.sin(frame * 0.045) * 8;
  // f1: Bulan kabur — geser kanan-atas + mengecil sedikit.
  const f1p = interpolate(frame, [139, 474], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const driftX = 36 * f1p;
  const driftY = -26 * f1p;
  const driftScale = 1 - 0.06 * f1p;
  // f2: lompat saat "melayang" (frame 653-704).
  const jumpT = interpolate(frame, [653, 678, 704], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jumpY = -64 * Math.sin(jumpT * Math.PI);
  // f3: zoom-in tipis.
  const f3p = interpolate(frame, [724, 965], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = 1 + 0.05 * f3p;
  const scale = driftScale * zoom;

  // Kedip: tiap 96 frame, 4 frame.
  const blinkPhase = frame % 96;
  const blink = blinkPhase < 4 ? 0.12 : 1;
  const eyeScaleY = expr === "sleepy" ? 0.35 : expr === "wide" ? 1.25 : blink;
  const pupilSize = expr === "wide" ? 26 : 20;

  // Bayangan di bawah karakter (melembut saat melompat).
  const shadowScale = 1 - 0.12 * Math.sin(jumpT * Math.PI);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 360 - 130 * shadowScale,
          top: 838,
          width: 260 * shadowScale,
          height: 44,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.45), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 190 + driftX,
          top: 470 + bob + driftY + jumpY,
          width: 340,
          height: 340,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              xray > 0.5
                ? "rgba(255,233,168,0.16)"
                : "radial-gradient(circle at 38% 30%, #FFF6C9 0%, #FFE9A8 55%, #F5D67A 100%)",
            boxShadow:
              xray > 0.5
                ? `0 0 60px rgba(77,216,255,0.35), inset 0 0 0 3px rgba(77,216,255,0.55)`
                : "0 0 90px rgba(255,233,168,0.35), inset -18px -22px 50px rgba(214,164,32,0.25)",
            transition: "none",
          }}
        />
        {/* Kawah */}
        {[
          { left: 52, top: 62, s: 26 },
          { left: 252, top: 96, s: 20 },
          { left: 226, top: 236, s: 30 },
          { left: 66, top: 210, s: 16 },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.left,
              top: c.top,
              width: c.s,
              height: c.s,
              borderRadius: "50%",
              background: "rgba(190,150,60,0.18)",
              opacity: 1 - xray * 0.8,
            }}
          />
        ))}
        {/* Wajah (memudar saat X-ray) */}
        <div style={{ position: "absolute", inset: 0, opacity: 1 - xray }}>
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 128,
              width: 52,
              height: 64,
              borderRadius: "50%",
              background: "#FFFFFF",
              transform: `scaleY(${eyeScaleY})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 26 - pupilSize / 2,
                top: 34 - pupilSize / 2,
                width: pupilSize,
                height: pupilSize,
                borderRadius: "50%",
                background: "#1F2937",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 192,
              top: 128,
              width: 52,
              height: 64,
              borderRadius: "50%",
              background: "#FFFFFF",
              transform: `scaleY(${eyeScaleY})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 26 - pupilSize / 2,
                top: 34 - pupilSize / 2,
                width: pupilSize,
                height: pupilSize,
                borderRadius: "50%",
                background: "#1F2937",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 62,
              top: 200,
              width: 44,
              height: 24,
              borderRadius: "50%",
              background: PINK,
              opacity: 0.75,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 234,
              top: 200,
              width: 44,
              height: 24,
              borderRadius: "50%",
              background: PINK,
              opacity: 0.75,
            }}
          />
          <svg
            width="340"
            height="340"
            viewBox="0 0 340 340"
            style={{ position: "absolute", inset: 0 }}
          >
            {expr === "sleepy" ? (
              <path
                d="M 138 232 Q 170 246 202 232"
                fill="none"
                stroke="#3A2E1A"
                strokeWidth={7}
                strokeLinecap="round"
              />
            ) : expr === "wide" ? (
              <path
                d="M 132 228 Q 170 268 208 228"
                fill="none"
                stroke="#3A2E1A"
                strokeWidth={7}
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M 136 230 Q 170 258 204 230"
                fill="none"
                stroke="#3A2E1A"
                strokeWidth={7}
                strokeLinecap="round"
              />
            )}
          </svg>
        </div>
        <InnerVisual scene={scene} xray={xray} />
        {/* Lengan mungil */}
        <div
          style={{
            position: "absolute",
            left: -14,
            top: 220,
            width: 34,
            height: 74,
            borderRadius: 17,
            background: "#F5D67A",
            transform: `rotate(${8 + Math.sin(frame * 0.05) * 6 + jumpT * -50}deg)`,
            transformOrigin: "top center",
            opacity: 1 - xray,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -14,
            top: 220,
            width: 34,
            height: 74,
            borderRadius: 17,
            background: "#F5D67A",
            transform: `rotate(${-8 - Math.sin(frame * 0.05 + 1) * 6 - jumpT * 50}deg)`,
            transformOrigin: "top center",
            opacity: 1 - xray,
          }}
        />
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// Label pill: teks kunci pendek, muncul pop, lalu hilang. Tanpa karaoke.
// ---------------------------------------------------------------------------
const Pill = ({
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
  const local = frame - start;
  // v3: tanpa spring — masuk dengan ease-out (naik pelan + berhenti tepat).
  const enter = interpolate(local, [0, 14], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [start, start + 6, end - 6, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < start || frame > end) return null;
  return (
    <div
      style={{
        background: "rgba(4,20,38,0.55)",
        borderRadius: 999,
        padding: "14px 32px",
        transform: `translateY(${(1 - enter) * 18}px)`,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 1,
          color,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Chip = ({ label }: { label: string }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 168,
        left: 56,
        border: `3px solid ${CYAN}`,
        borderRadius: 999,
        padding: "10px 26px",
        transform: `translateY(${(1 - enter) * 14}px)`,
        opacity: enter,
        background: "rgba(4,20,38,0.35)",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 4,
          color: CYAN,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Ikon lingkaran (peta isi): panah jarak, timbangan, jejak kaki.
const IconCircle = ({ kind }: { kind: "jarak" | "timbang" | "jejak" }) => (
  <div
    style={{
      width: 92,
      height: 92,
      borderRadius: "50%",
      border: `3px solid ${CYAN}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(4,20,38,0.35)",
    }}
  >
    {kind === "jarak" && (
      <svg width="52" height="52" viewBox="0 0 52 52">
        <path
          d="M 12 40 L 34 18 M 22 16 L 36 16 L 36 30"
          fill="none"
          stroke={CYAN}
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
          stroke={CYAN}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
    {kind === "jejak" && (
      <svg width="52" height="52" viewBox="0 0 52 52">
        <ellipse cx="24" cy="32" rx="10" ry="13" fill={CYAN} />
        <circle cx="14" cy="16" r="4" fill={CYAN} />
        <circle cx="22" cy="12" r="4" fill={CYAN} />
        <circle cx="30" cy="13" r="4" fill={CYAN} />
        <circle cx="36" cy="18" r="4" fill={CYAN} />
      </svg>
    )}
  </div>
);

const IconRow = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: 36,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <IconCircle kind="jarak" />
    <IconCircle kind="timbang" />
    <IconCircle kind="jejak" />
  </div>
);

const BottomPill = ({ text }: { text: string }) => (
  <div
    style={{
      background: "rgba(4,20,38,0.55)",
      border: `3px solid ${YELLOW}`,
      borderRadius: 999,
      padding: "14px 36px",
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 38,
        letterSpacing: 4,
        color: YELLOW,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Adegan: hanya teks kunci + VO. Karakter & dunia kontinu di luar Sequence.
// ---------------------------------------------------------------------------
const Scene = ({ id }: { id: string }) => {
  const frame = useCurrentFrame();
  const voFrames = SCENE_TIMING2B[id].voFrames;

  if (id === "hook") {
    // v3: judul masuk dengan ease-out (naik pelan), tanpa spring.
    const titleEnter = interpolate(frame, [6, 22], [0, 1], {
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const titleOpacity = interpolate(frame, [6, 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 196,
        }}
      >
        <Audio src={staticFile("audio/v2-seno/hook.wav")} />
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 8,
            color: YELLOW,
            textAlign: "center",
          }}
        >
          3 FAKTA GILA
        </div>
        <div
          style={{
            marginTop: 18,
            transform: `translateY(${(1 - titleEnter) * 20}px)`,
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 86,
              lineHeight: 1.05,
              color: WHITE,
              textAlign: "center",
              textShadow: "0 4px 0 rgba(0,0,0,0.35)",
            }}
          >
            BULAN KABUR
            <br />
            DARI KITA
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 220, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <IconRow />
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA BULAN" />
        </div>
      </AbsoluteFill>
    );
  }

  if (id === "tanya") {
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 196,
        }}
      >
        <Audio src={staticFile("audio/v2-seno/tanya.wav")} />
        <Pill text="MANA YANG PALING GILA?" color={WHITE} start={8} end={voFrames + 10} />
        <div style={{ position: "absolute", bottom: 220, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <IconRow />
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <BottomPill text="FAKTA BULAN" />
        </div>
      </AbsoluteFill>
    );
  }

  const pills: Record<string, Array<{ text: string; color: string; s: number; e: number }>> = {
    f1: [
      { text: "3,8 CM PER TAHUN", color: YELLOW, s: 16, e: 123 },
      { text: "SECEPAT KUKU TUMBUH", color: CYAN, s: 123, e: 220 },
      { text: "GERHANA TOTAL AKAN HILANG", color: PINK, s: 220, e: 316 },
    ],
    f2: [
      { text: "GRAVITASI 1/6 BUMI", color: YELLOW, s: 12, e: 107 },
      { text: "60 KG → 10 KG", color: CYAN, s: 107, e: 179 },
      { text: "LOMPAT SEKALI, MELAYANG", color: PINK, s: 179, e: 233 },
    ],
    f3: [
      { text: "JEJAK KAKI TAK HILANG", color: YELLOW, s: 11, e: 92 },
      { text: "TANPA ANGIN • TANPA HUJAN", color: CYAN, s: 92, e: 160 },
      { text: "JUTAAN TAHUN", color: PINK, s: 160, e: 224 },
    ],
  };
  const chipLabel = id === "f1" ? "FAKTA 1" : id === "f2" ? "FAKTA 2" : "FAKTA 3";
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 252,
      }}
    >
      <Audio src={staticFile(`audio/v2-seno/${id}.wav`)} />
      <Chip label={chipLabel} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {pills[id].map((p, i) => (
          <Pill key={i} text={p.text} color={p.color} start={p.s} end={p.e} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// SFX: pop saat pill pertama tiap fakta muncul, whoosh saat morph X-ray
// pertama, ding saat kartu penutup muncul. Total 5 = batas kit.
const SfxLayer = () => (
  <>
    <Sequence from={154} durationInFrames={24}>
      <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} />
    </Sequence>
    <Sequence from={155} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
    </Sequence>
    <Sequence from={486} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
    </Sequence>
    <Sequence from={735} durationInFrames={24}>
      <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
    </Sequence>
    <Sequence from={973} durationInFrames={40}>
      <Audio src={staticFile("sfx/ding.mp3")} volume={0.6} />
    </Sequence>
  </>
);

export const FaktaBulanV2: React.FC = () => {
  const [handle] = useState(() => delayRender("fredoka-font"));
  useEffect(() => {
    document.fonts
      .load('700 48px Fredoka')
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  return (
    <>
      <style>{`@font-face { font-family: 'Fredoka'; src: url(${staticFile("fonts/Fredoka.ttf")}) format('truetype-variations'); font-weight: 300 700; }`}</style>
      <Composition
        id="FaktaBulanV2"
        component={() => (
          <AbsoluteFill>
            <World />
            <MoonCharacter />
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
