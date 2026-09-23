import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WebC } from "@/components/web-c/WebC";
import { geist } from "@/fonts";

// Prototipo alternativo del home: solo en local y en previews de Vercel.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function WebCPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return <WebC fontClassName={geist.variable} />;
}
