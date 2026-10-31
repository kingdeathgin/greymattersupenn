import { ImageResponse } from "next/og";

export const alt =
  "Penn Grey Matters — making neuroscience accessible through stories, podcasts, and interactive experiences.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px",
          color: "#ffffff",
          background:
            "radial-gradient(ellipse at 82% 18%, #301a2a 0%, #101014 42%, #000000 78%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: "#ff85b7",
            fontSize: "24px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>Penn</span>
          <span style={{ color: "#ffffff" }}>Grey Matters</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              width: "72px",
              height: "5px",
              background: "#ff85b7",
            }}
          />
          <div
            style={{
              maxWidth: "900px",
              fontSize: "68px",
              lineHeight: 1.08,
              fontWeight: 700,
            }}
          >
            Making neuroscience accessible.
          </div>
          <div
            style={{
              color: "#d0cbd0",
              fontSize: "27px",
            }}
          >
            A student journal from the University of Pennsylvania
          </div>
        </div>
      </div>
    ),
    size,
  );
}
