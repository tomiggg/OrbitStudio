import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Shift Studio",
  description: "Agencia digital orientada a resultados.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const locale = h.get("x-next-intl-locale") ?? "es";

  return (
    <html lang={locale} className={inter.className}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}