import type { Metadata } from "next";
import { headers } from "next/headers";
import { Anton, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-title" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shift Studio",
  description: "Agencia digital orientada a resultados.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='80' fill='%230d0d0d'/><g transform='translate(100 10) skewX(-11)'><path d='M 12 44 L 170 44 C 208 44 208 92 172 108 C 148 118 100 122 70 132 C 32 144 32 196 70 196 L 222 196' transform='translate(14 14)' fill='none' stroke='%239EC7D4' stroke-width='48' stroke-linecap='butt' stroke-linejoin='miter'/><path d='M 12 44 L 170 44 C 208 44 208 92 172 108 C 148 118 100 122 70 132 C 32 144 32 196 70 196 L 222 196' fill='none' stroke='white' stroke-width='48' stroke-linecap='butt' stroke-linejoin='miter'/></g></svg>",
        type: "image/svg+xml",
      },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    images: [{ url: "/og.svg", width: 1200, height: 630 }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const locale = h.get("x-next-intl-locale") ?? "es";

  return (
    <html lang={locale} className={`${anton.variable} ${jetbrainsMono.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}