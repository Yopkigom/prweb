import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Shin Hojeong — Unity & On-Device AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// NOTE: English-only copy — the default satori font has no Hangul glyphs.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #09090b 0%, #27272a 100%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#a1a1aa", letterSpacing: 4 }}>
          SHIN HOJEONG
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 20, lineHeight: 1.2 }}>
          15 Years of Unity,
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>
          Now Building On-Device AI
        </div>
        <div style={{ fontSize: 26, color: "#a1a1aa", marginTop: 32 }}>
          ExecuTorch · llama.cpp · Unity Sentis · TensorFlow Lite
        </div>
      </div>
    ),
    size
  );
}
