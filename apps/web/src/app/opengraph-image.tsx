import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Shin Hojeong — Unity, On-Device AI, Tech Lead";
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
          // Resume poster blue (resume/design/resume.tpl.html .p1).
          background: "linear-gradient(135deg, #1c3a75 0%, #2f5aa8 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#dbe4f6", letterSpacing: 4 }}>
          SHIN HOJEONG
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 20, lineHeight: 1.2 }}>
          16 Years of Unity,
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>
          Now Building On-Device AI
        </div>
        <div style={{ fontSize: 26, color: "#dbe4f6", marginTop: 32 }}>
          llama.cpp · ONNX · Unity Sentis · AI Product Tech Lead
        </div>
      </div>
    ),
    size
  );
}
