import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 3.5,
            top: 7,
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "1.8px solid #1c1c1a",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 10.5,
            top: 7,
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "1.8px solid #1c1c1a",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
