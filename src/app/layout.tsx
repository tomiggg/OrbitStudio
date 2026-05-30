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
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }],
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