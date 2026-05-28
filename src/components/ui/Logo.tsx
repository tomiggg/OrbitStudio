"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

type Props = {
  variant?: "full" | "mark" | "wordmark";
  theme?: "dark" | "light";
  size?: number;
};

const PATH =
  "M 12 44 L 170 44 C 208 44 208 92 172 108 C 148 118 100 122 70 132 C 32 144 32 196 70 196 L 222 196";

export function Logo({ variant = "full", theme = "dark", size = 40 }: Props) {
  const color = theme === "dark" ? "#ffffff" : "#0d0d0d";

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <g transform="translate(22 0) skewX(-11)">
        <path
          d={PATH}
          transform="translate(14 14)"
          fill="none"
          stroke="#9EC7D4"
          strokeWidth="48"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="3"
        />
        <path
          d={PATH}
          fill="none"
          stroke={color}
          strokeWidth="48"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="3"
        />
      </g>
    </svg>
  );

  const wordmark = (
    <div
      className={plusJakarta.className}
      style={{
        display: "flex",
        flexDirection: "column",
        color,
        lineHeight: 0.9,
        letterSpacing: "-0.035em",
      }}
    >
      <span style={{ fontSize: size * 0.55 }}>shift</span>
      <span style={{ fontSize: size * 0.38, alignSelf: "flex-end" }}>Studio.</span>
    </div>
  );

  if (variant === "mark") return mark;
  if (variant === "wordmark") return wordmark;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.28 }}>
      {mark}
      {wordmark}
    </div>
  );
}
