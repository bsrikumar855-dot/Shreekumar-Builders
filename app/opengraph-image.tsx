import { ImageResponse } from "next/og";

export const alt = "Shreekumar Builders — Building, Electrical, Plumbing & Tiling";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4620b",
          color: "#0d0b09",
          padding: 64,
          fontFamily: "Impact, Arial Narrow, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "#0d0b09",
              color: "#f4620b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 34, letterSpacing: 6, textTransform: "uppercase" }}>
            Shreekumar Builders
          </div>
        </div>
        <div style={{ fontSize: 190, lineHeight: 0.9, textTransform: "uppercase", display: "flex", flexDirection: "column" }}>
          <span>Built with</span>
          <span style={{ color: "#fdf5e8" }}>Precision.</span>
        </div>
        <div style={{ fontSize: 30, letterSpacing: 4, textTransform: "uppercase", display: "flex" }}>
          Building · Electrical · Plumbing · Tiling
        </div>
      </div>
    ),
    size,
  );
}
